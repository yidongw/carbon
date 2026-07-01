import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";

/**
 * Inbound webhook from Twenty CRM.
 *
 * Configure in Twenty: Settings → Webhooks → POST https://<host>/api/webhook/twenty
 * with secret = TWENTY_WEBHOOK_SECRET. Twenty sends the secret as a Bearer token
 * in the Authorization header.
 *
 * Approval flow: when an internal team member sets the opportunity stage to
 * "DEMO_EXTENSION_APPROVED" in Twenty, this handler extends the demo by 30 days.
 * All other events are acknowledged and ignored.
 */
export async function action({ request }: ActionFunctionArgs) {
  // Validate shared secret.
  const secret = process.env.TWENTY_WEBHOOK_SECRET;
  if (secret) {
    const auth = request.headers.get("Authorization") ?? "";
    if (auth !== `Bearer ${secret}`) {
      return data({ error: "Unauthorized" }, { status: 401 });
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return data({ error: "Invalid JSON" }, { status: 400 });
  }

  // Twenty webhook payload shape (REST/GraphQL bridge):
  // { eventName: "opportunity.updated", record: { id, stage, ... }, updatedFields: [...] }
  const event = body as {
    eventName?: string;
    record?: { id?: string; stage?: string[] };
    updatedFields?: string[];
  };

  const isOpportunityUpdate = event.eventName?.startsWith("opportunity.");
  const isApproval = event.record?.stage?.includes("DEMO_EXTENSION_APPROVED");

  if (!isOpportunityUpdate || !isApproval) {
    return { ok: true, action: "ignored" };
  }

  const opportunityId = event.record?.id;
  if (!opportunityId) {
    return data({ error: "Missing opportunity id" }, { status: 400 });
  }

  const admin = getCarbonServiceRole();

  // Look up the company whose externalId.twenty matches this opportunity.
  // externalId is JSONB so we use the ->> text operator.
  const { data: companies } = await admin
    .from("company")
    .select("id")
    .filter("externalId->>twenty", "eq", opportunityId);

  if (!companies?.length) {
    console.warn("Twenty webhook: no company found for opportunity", opportunityId);
    return { ok: true, action: "no_match" };
  }

  const companyId = companies[0].id;

  // Extend by 30 days from today (or from the current expiry if it's still in
  // the future, whichever is later).
  const { data: demo } = await admin
    .from("demoCompany")
    .select("expiresAt")
    .eq("id", companyId)
    .maybeSingle();

  if (!demo) {
    return { ok: true, action: "no_demo" };
  }

  const base = Math.max(
    Date.now(),
    demo.expiresAt ? new Date(demo.expiresAt).getTime() : 0
  );
  const newExpiry = new Date(base + 30 * 24 * 60 * 60 * 1000).toISOString();

  await admin
    .from("demoCompany")
    .update({ expiresAt: newExpiry })
    .eq("id", companyId);

  console.log(`Demo extended for company ${companyId} → ${newExpiry}`);
  return { ok: true, action: "extended", companyId, expiresAt: newExpiry };
}

// Twenty may also call GET for webhook verification.
export async function loader() {
  return { ok: true };
}
