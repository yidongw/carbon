import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { runDemoSeed } from "~/services/demoSeed.server";

/**
 * Seeds the current user's demo company with sample data, and reports progress.
 *
 * Why a detached server run (not Inngest): the foxhole previews and Community
 * self-hosted deployments serve Inngest functions but aren't registered with
 * Inngest Cloud, so `inngest.send` never gets executed there. A long-running
 * Node server keeps a non-awaited promise alive, so we run the seed inline-detached.
 * (On serverless/Cloud, switch this to the `carbon/demo.seed` Inngest job instead.)
 *
 * GET  → { status, counts } for the progress toast to poll.
 * POST → atomically claims a `pending` demo and kicks off the detached seed.
 */

async function getProgressCounts(
  client: ReturnType<typeof getCarbonServiceRole>,
  companyId: string
) {
  const count = async (
    table: "item" | "customer" | "supplier" | "salesOrder" | "job"
  ) => {
    const { count: n } = await client
      .from(table)
      .select("id", { count: "exact", head: true })
      .eq("companyId", companyId);
    return n ?? 0;
  };
  const [items, customers, suppliers, salesOrders, jobs] = await Promise.all([
    count("item"),
    count("customer"),
    count("supplier"),
    count("salesOrder"),
    count("job")
  ]);
  return { items, customers, suppliers, salesOrders, jobs };
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {});
  const { data: demoRow } = await client
    .from("demoCompany")
    .select("id, seedStatus")
    .eq("id", companyId)
    .maybeSingle();

  if (!demoRow) {
    return { status: "none" as const, counts: null };
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

  const [{ data: user }, { data: location }] = await Promise.all([
    admin.from("user").select("email, firstName").eq("id", userId).single(),
    admin
      .from("location")
      .select("id")
      .eq("companyId", demo.id)
      .eq("name", "Headquarters")
      .maybeSingle()
  ]);

  // Detached: don't await — the server keeps it running after the response.
  void runDemoSeed({
    companyId: demo.id,
    userId,
    locationId: location?.id ?? "",
    email: user?.email ?? "demo@example.com",
    firstName: user?.firstName ?? "Demo"
  });

  return { status: "seeding" };
}
