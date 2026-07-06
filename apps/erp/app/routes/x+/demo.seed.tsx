import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { resolveLanguage } from "@carbon/locale";
import { getPreferenceHeaders } from "@carbon/utils";
import { waitUntil } from "@vercel/functions";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { runDemoSeed } from "~/services/demoSeed.server";

/**
 * Seeds the current user's demo company with sample data, and reports progress.
 *
 * The seed runs via `waitUntil` from `@vercel/functions`, which on Vercel keeps
 * the serverless function alive after the response is sent (up to `maxDuration`).
 * On long-running Node servers (foxhole, self-hosted) `waitUntil` is a no-op
 * that falls back to background execution, matching the prior `void` behaviour.
 *
 * `maxDuration: 300` tells Vercel to allow up to 5 minutes for this route's
 * function — enough headroom for the ~3-minute seed.
 *
 * GET  → { status, counts } for the progress toast to poll.
 * POST → atomically claims a `pending` demo and kicks off the detached seed.
 */

// Vercel route config: isolate this route into its own server bundle with a
// 5-minute execution limit so the background seed isn't cut off by the default
// 60-second serverless timeout.
export const config = { maxDuration: 300 };

async function getProgressCounts(
  client: ReturnType<typeof getCarbonServiceRole>,
  companyId: string
) {
  const count = async (
    table:
      | "item"
      | "customer"
      | "supplier"
      | "salesOrder"
      | "job"
      | "jobOperation"
      | "productionEvent"
      | "nonConformance"
      | "gauge"
      | "procedure"
      | "quote"
      | "purchaseOrder"
      | "maintenanceSchedule"
      | "riskRegister"
      | "training"
  ) => {
    const { count: n } = await client
      .from(table)
      .select("id", { count: "exact", head: true })
      .eq("companyId", companyId);
    return n ?? 0;
  };
  const counts = await Promise.all([
    count("item"),
    count("customer"),
    count("supplier"),
    count("salesOrder"),
    count("job"),
    count("jobOperation"),
    count("productionEvent"),
    count("nonConformance"),
    count("gauge"),
    count("procedure"),
    count("quote"),
    count("purchaseOrder"),
    count("maintenanceSchedule"),
    count("riskRegister"),
    count("training")
  ]);
  const items = counts[0];
  const total = counts.reduce((sum, n) => sum + n, 0);
  return { items, total };
}

// A seed that has been "seeding" for longer than this is assumed to have been
// killed by the runtime (e.g. Vercel cold-killing a timed-out function before
// waitUntil / maxDuration was in place). The loader auto-repairs so the
// progress toast doesn't loop forever.
const SEED_STALE_MS = 15 * 60 * 1000; // 15 minutes

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {});
  const { data: demoRow } = await client
    .from("demoCompany")
    .select("id, seedStatus, updatedAt")
    .eq("id", companyId)
    .maybeSingle();

  if (!demoRow) {
    return { status: "none" as const, counts: null };
  }

  // Auto-repair: if a seed has been stuck in "seeding" for longer than
  // SEED_STALE_MS the background task was almost certainly killed. Heal the
  // status so the UI can recover without requiring a user page reload.
  if (demoRow.seedStatus === "seeding") {
    const age = Date.now() - new Date(demoRow.updatedAt).getTime();
    if (age > SEED_STALE_MS) {
      const admin = getCarbonServiceRole();
      const { count: itemCount } = await admin
        .from("item")
        .select("id", { count: "exact", head: true })
        .eq("companyId", companyId);
      const repairedStatus = (itemCount ?? 0) > 0 ? "seeded" : "pending";
      await admin
        .from("demoCompany")
        .update({ seedStatus: repairedStatus })
        .eq("id", companyId);
      return {
        status: repairedStatus,
        counts: await getProgressCounts(client, companyId)
      };
    }
  }

  return {
    status: (demoRow.seedStatus ?? "pending") as string,
    counts: await getProgressCounts(client, companyId)
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const { userId } = await requirePermissions(request, {});
  const admin = getCarbonServiceRole();

  // Find this user's demo company.
  const { data: links } = await admin
    .from("userToCompany")
    .select("companyId")
    .eq("userId", userId);
  const companyIds = (links ?? []).map((l) => l.companyId);
  if (!companyIds.length) return { status: "none" };

  const { data: demo } = await admin
    .from("demoCompany")
    .select("id, seedStatus")
    .in("id", companyIds)
    .maybeSingle();
  if (!demo) return { status: "none" };

  // If the demo already has data, it's seeded — don't re-run (keep the flag honest).
  const { count: itemCount } = await admin
    .from("item")
    .select("id", { count: "exact", head: true })
    .eq("companyId", demo.id);
  if ((itemCount ?? 0) > 0) {
    if (demo.seedStatus !== "seeded") {
      await admin
        .from("demoCompany")
        .update({ seedStatus: "seeded" })
        .eq("id", demo.id);
    }
    return { status: "seeded" };
  }

  // Atomic claim: flip to "seeding" unless a seed is already running, so a stray
  // double-trigger (double mount, revalidation) can't run the seed twice.
  const { data: claimed } = await admin
    .from("demoCompany")
    .update({ seedStatus: "seeding" })
    .eq("id", demo.id)
    .neq("seedStatus", "seeding")
    .select("id")
    .maybeSingle();
  if (!claimed) {
    return { status: "seeding" };
  }

  const { data: location } = await admin
    .from("location")
    .select("id")
    .eq("companyId", demo.id)
    .eq("name", "Headquarters")
    .maybeSingle();

  // Bail if the company setup didn't produce a Headquarters — the seed needs a
  // valid locationId and would fail entirely, leaving the status stuck at 'seeding'.
  if (!location?.id) {
    await admin
      .from("demoCompany")
      .update({ seedStatus: "failed" })
      .eq("id", demo.id);
    return { status: "failed" };
  }

  const language = resolveLanguage(getPreferenceHeaders(request).locale);

  // waitUntil: on Vercel keeps the serverless function alive after the response;
  // on long-running Node servers behaves like `void` (background execution).
  waitUntil(
    runDemoSeed({
      companyId: demo.id,
      userId,
      locationId: location.id,
      language
    })
  );

  return { status: "seeding" };
}
