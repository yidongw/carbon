import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { getTwentyClient } from "@carbon/lib/twenty.server";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";

/**
 * POST → creates a note on the user's Twenty CRM opportunity requesting a demo
 * extension. Silently no-ops if no Twenty opportunity is linked (e.g. the user
 * signed up before the CRM integration was live, or TWENTY_API_KEY isn't set).
 */
export async function action({ request }: ActionFunctionArgs) {
  const { userId, companyId } = await requirePermissions(request, {});
  const admin = getCarbonServiceRole();

  const [{ data: user }, { data: company }] = await Promise.all([
    admin
      .from("user")
      .select("firstName, lastName, email, externalId")
      .eq("id", userId)
      .single(),
    admin
      .from("company")
      .select("name, externalId")
      .eq("id", companyId)
      .single()
  ]);

  // externalId is JSONB: { twenty: "<opportunityId>" }
  const opportunityId = (company?.externalId as Record<string, string> | null)
    ?.twenty;

  if (!opportunityId || !process.env.TWENTY_API_KEY) {
    // No CRM record to attach to — request is still acknowledged to the user.
    return { ok: true };
  }

  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const body =
    `Demo extension requested by ${name} (${user?.email ?? "unknown"}).\n` +
    `Company: ${company?.name ?? companyId}`;

  try {
    const twenty = getTwentyClient();
    await twenty.createNoteOnOpportunity(opportunityId, body, "Demo Extension Request");
  } catch (error) {
    // Don't surface CRM errors to the user — the request is still noted in logs.
    console.error("Twenty note creation failed:", error);
  }

  return { ok: true };
}

// Overlay/navigation lands here only via POST (fetcher). No UI needed.
export default function DemoExtendRequest() {
  return null;
}
