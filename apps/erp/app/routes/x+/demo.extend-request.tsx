import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { RESEND_DOMAIN } from "@carbon/env";
import { sendEmail } from "@carbon/lib/resend.server";
import { createHmac } from "node:crypto";
import type { ActionFunctionArgs } from "react-router";

function buildApproveToken(companyId: string): string {
  const secret = process.env.DEMO_APPROVE_SECRET ?? "";
  const payload = Buffer.from(
    JSON.stringify({ companyId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })
  ).toString("base64url");
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

function fmt(date: string | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

/**
 * POST → sends a demo extension request email to DEMO_EXTENSION_EMAIL with
 * full context (who, company, dates) and a signed one-click approve link.
 */
export async function action({ request }: ActionFunctionArgs) {
  const { userId, companyId } = await requirePermissions(request, {});
  const admin = getCarbonServiceRole();

  // Load user, demo company, and their real (non-demo) company.
  const [{ data: user }, { data: demo }, { data: companyLinks }] =
    await Promise.all([
      admin
        .from("user")
        .select("firstName, lastName, email, phone, createdAt")
        .eq("id", userId)
        .single(),
      admin
        .from("demoCompany")
        .select("id, expiresAt, seedStatus, createdAt")
        .eq("id", companyId)
        .maybeSingle(),
      admin
        .from("userToCompany")
        .select("companyId, company(id, name, addressLine1, city, stateProvince, countryCode, website, phone, createdAt, isDemo)")
        .eq("userId", userId)
    ]);

  const companies = (companyLinks ?? []).flatMap((l) =>
    Array.isArray(l.company) ? l.company : l.company ? [l.company] : []
  );
  const realCompany = companies.find((c) => !c.isDemo);
  const demoCompany = companies.find((c) => c.isDemo);

  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Unknown";
  const companyName = realCompany?.name ?? demoCompany?.name ?? companyId;

  const token = buildApproveToken(companyId);
  const host = new URL(request.url).origin;
  const approveUrl = `${host}/api/demo/extend-approve?token=${token}`;

  const daysLeft = demo?.expiresAt
    ? Math.max(0, Math.ceil((new Date(demo.expiresAt).getTime() - Date.now()) / 86_400_000))
    : null;

  const address = [
    realCompany?.addressLine1,
    realCompany?.city,
    realCompany?.stateProvince,
    realCompany?.countryCode
  ]
    .filter(Boolean)
    .join(", ");

  const to = process.env.DEMO_EXTENSION_EMAIL;
  if (!to) {
    console.warn("DEMO_EXTENSION_EMAIL not set — extension request email skipped");
    return { ok: true };
  }

  const subject = `Demo Extension Request — ${name} at ${companyName}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;color:#111;max-width:600px;margin:0 auto;padding:24px">
  <h2 style="margin-top:0">Demo Extension Request</h2>

  <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
    <tr><td colspan="2" style="background:#f4f4f5;padding:8px 12px;font-weight:600;font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:#555">Contact</td></tr>
    <tr><td style="padding:8px 12px;width:40%;color:#555">Name</td><td style="padding:8px 12px"><strong>${name}</strong></td></tr>
    <tr style="background:#fafafa"><td style="padding:8px 12px;color:#555">Email</td><td style="padding:8px 12px"><a href="mailto:${user?.email}">${user?.email ?? "—"}</a></td></tr>
    <tr><td style="padding:8px 12px;color:#555">Phone</td><td style="padding:8px 12px">${user?.phone ?? "—"}</td></tr>

    <tr><td colspan="2" style="background:#f4f4f5;padding:8px 12px;font-weight:600;font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:#555">Real Company</td></tr>
    <tr><td style="padding:8px 12px;color:#555">Name</td><td style="padding:8px 12px"><strong>${realCompany?.name ?? "—"}</strong></td></tr>
    <tr style="background:#fafafa"><td style="padding:8px 12px;color:#555">Address</td><td style="padding:8px 12px">${address || "—"}</td></tr>
    <tr><td style="padding:8px 12px;color:#555">Website</td><td style="padding:8px 12px">${realCompany?.website ? `<a href="${realCompany.website}">${realCompany.website}</a>` : "—"}</td></tr>
    <tr style="background:#fafafa"><td style="padding:8px 12px;color:#555">Phone</td><td style="padding:8px 12px">${realCompany?.phone ?? "—"}</td></tr>
    <tr><td style="padding:8px 12px;color:#555">Created</td><td style="padding:8px 12px">${fmt(realCompany?.createdAt)}</td></tr>

    <tr><td colspan="2" style="background:#f4f4f5;padding:8px 12px;font-weight:600;font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:#555">Demo Company</td></tr>
    <tr><td style="padding:8px 12px;color:#555">Created</td><td style="padding:8px 12px">${fmt(demo?.createdAt)}</td></tr>
    <tr style="background:#fafafa"><td style="padding:8px 12px;color:#555">Expires</td><td style="padding:8px 12px">${fmt(demo?.expiresAt)}${daysLeft !== null ? ` <span style="color:${daysLeft <= 0 ? "#dc2626" : daysLeft <= 7 ? "#d97706" : "#555"}">(${daysLeft <= 0 ? "expired" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`})</span>` : ""}</td></tr>
    <tr><td style="padding:8px 12px;color:#555">Seed status</td><td style="padding:8px 12px">${demo?.seedStatus ?? "—"}</td></tr>
  </table>

  <a href="${approveUrl}"
     style="display:inline-block;background:#18181b;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:600;font-size:15px">
    ✓ Approve 30-day extension
  </a>

  <p style="margin-top:24px;font-size:12px;color:#888">
    This link is valid for 7 days. Clicking it extends the demo to
    ${fmt(new Date(Date.now() + (Math.max(daysLeft ?? 0, 0) + 30) * 86_400_000).toISOString())} (30 days from today or from current expiry, whichever is later).
  </p>
</body>
</html>`;

  try {
    await sendEmail({
      from: `no-reply@${RESEND_DOMAIN}`,
      to,
      subject,
      html,
      text: `Demo extension request from ${name} (${user?.email}) at ${companyName}.\n\nApprove: ${approveUrl}`
    });
  } catch (error) {
    console.error("Failed to send extension request email:", error);
  }

  return { ok: true };
}

export default function DemoExtendRequest() {
  return null;
}
