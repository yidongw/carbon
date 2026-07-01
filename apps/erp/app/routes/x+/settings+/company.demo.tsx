import { assertIsPost } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { setCompanyId } from "@carbon/auth/company.server";
import { updateCompanySession } from "@carbon/auth/session.server";
import { redis } from "@carbon/kv";
import { getLocalTimeZone } from "@internationalized/date";
import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { insertEmployeeJob } from "~/modules/people";
import { upsertLocation } from "~/modules/resources";
import { seedCompany } from "~/modules/settings";
import { getPermissionCacheKey } from "~/modules/users/users.server";
import { path } from "~/utils/path";

// A demo company is accessible for this many days, then hidden and (30 days later) deleted
// by the demo-cleanup scheduled job (packages/jobs .../scheduled/demo-cleanup.ts).
const DEMO_ACCESS_DAYS = 30;

/**
 * "Try the demo" — lazily creates a single, full-feature demo company for the current user
 * (seeded like any new company) and switches the active company to it. If the user already
 * has a demo company, this just switches to it instead of creating another.
 *
 * Created lazily (on click) rather than at signup so we don't seed heavy data for users who
 * never engage, and so the 30-day clock starts when they actually try it.
 */
export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { userId } = await requirePermissions(request, {});

  const client = getCarbonServiceRole();

  // A user gets at most one demo company. If they already have one, just switch to it.
  const { data: links } = await client
    .from("userToCompany")
    .select("companyId")
    .eq("userId", userId);
  const companyIds = (links ?? []).map((l) => l.companyId);

  let companyId: string | undefined;
  let companyGroupId = "";

  if (companyIds.length > 0) {
    const { data: existingDemo } = await client
      .from("company")
      .select("id, companyGroupId")
      .eq("isDemo", true)
      .in("id", companyIds)
      .maybeSingle();
    if (existingDemo) {
      companyId = existingDemo.id;
      companyGroupId = existingDemo.companyGroupId ?? "";
    }
  }

  if (!companyId) {
    const demoExpiresAt = new Date(
      Date.now() + DEMO_ACCESS_DAYS * 24 * 60 * 60 * 1000
    ).toISOString();

    const companyInsert = await client
      .from("company")
      .insert({
        name: "Demo Company",
        baseCurrencyCode: "USD",
        isDemo: true
      })
      .select("id")
      .single();
    if (companyInsert.error || !companyInsert.data?.id) {
      console.error(companyInsert.error);
      throw new Error("Fatal: failed to insert demo company");
    }
    companyId = companyInsert.data.id;

    // Demo metadata lives in its own 1:1 table (like companyPlan/companySettings).
    const demoRow = await client
      .from("demoCompany")
      .insert({ id: companyId, expiresAt: demoExpiresAt, seedStatus: "pending" });
    if (demoRow.error) {
      console.error(demoRow.error);
      throw new Error("Fatal: failed to insert demo metadata");
    }

    const seed = await seedCompany(client, companyId, userId);
    if (seed.error) {
      console.error(seed.error);
      throw new Error("Fatal: failed to seed demo company");
    }

    const locationInsert = await upsertLocation(client, {
      name: "Headquarters",
      companyId,
      timezone: getLocalTimeZone(),
      createdBy: userId,
      addressLine1: "",
      city: "",
      stateProvince: "",
      postalCode: "",
      countryCode: ""
    });
    if (locationInsert.error || !locationInsert.data?.id) {
      console.error(locationInsert.error);
      throw new Error("Fatal: failed to insert demo location");
    }

    const [job] = await Promise.all([
      insertEmployeeJob(client, {
        id: userId,
        companyId,
        locationId: locationInsert.data.id
      }),
      redis.del(getPermissionCacheKey(userId))
    ]);
    if (job.error) {
      console.error(job.error);
      throw new Error("Fatal: failed to insert demo job");
    }

    // companyGroupId is assigned during seeding; read it back for the session.
    const { data: companyRecord } = await client
      .from("company")
      .select("companyGroupId")
      .eq("id", companyId)
      .single();
    companyGroupId = companyRecord?.companyGroupId ?? "";

    // Seeding is kicked off (and shown with a progress toast) the first time the user
    // lands in the demo — see routes/x+/demo.seed.tsx. The demoCompany row is created
    // with seedStatus='pending' above; we don't seed inline so "Try the demo" stays fast.
  }

  const sessionCookie = await updateCompanySession(
    request,
    companyId,
    companyGroupId
  );
  const companyIdCookie = setCompanyId(companyId);

  throw redirect(path.to.authenticatedRoot, {
    headers: [
      ["Set-Cookie", sessionCookie],
      ["Set-Cookie", companyIdCookie]
    ]
  });
}
