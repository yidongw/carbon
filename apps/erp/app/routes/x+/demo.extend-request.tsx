import { RESEND_DOMAIN } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { getUserIdentities } from "@carbon/auth/identity.server";
import { sendEmail } from "@carbon/lib/resend.server";
import { randomBytes } from "node:crypto";
import type { ActionFunctionArgs } from "react-router";

function fmt(date: string | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

/**
 * POST → generates a per-request random token (stored on demoCompany),
 * then sends a rich extension request email to SUPER_ADMIN_EMAIL with a
 * one-click approve link containing that token.
 */
export async function action({ request }: ActionFunctionArgs) {
  const { userId, companyId } = await requirePermissions(request, {});
  const admin = getCarbonServiceRole();

  const [{ data: user }, { data: demo }, { data: companyLinks }, identities] =
    await Promise.all([
      admin
        .from("user")
        .select("firstName, lastName, email, phone, about, createdAt")
        .eq("id", userId)
        .single(),
      admin
        .from("demoCompany")
        .select("id, expiresAt, seedStatus, createdAt")
        .eq("id", companyId)
        .maybeSingle(),
      admin
        .from("userToCompany")
        .select(
          "companyId, company(id, name, addressLine1, city, stateProvince, countryCode, website, phone, createdAt, isDemo)"
        )
        .eq("userId", userId),
      getUserIdentities(userId)
    ]);

  const companies = (companyLinks ?? []).flatMap((l) =>
    Array.isArray(l.company) ? l.company : l.company ? [l.company] : []
  );
  const realCompany = companies.find((c) => !c.isDemo);
  const demoCompanyRow = companies.find((c) => c.isDemo);

  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Unknown";
  const companyName =
    realCompany?.name ?? demoCompanyRow?.name ?? companyId;

  // Derive login methods from the userIdentity table (canonical app-layer store)
  const providerLabels: Record<string, string> = {
    email: "Email",
    google: "Google",
    azure: "Microsoft (Azure)",
    wechat: "WeChat",
    phone: "Phone (SMS)"
  };
  const loginMethods = (identities ?? []).map(
    (i) => providerLabels[i.type] ?? (i.type.charAt(0).toUpperCase() + i.type.slice(1))
  );

  // Generate a random one-time token and store it on the demoCompany row
  // (7-day TTL). No shared signing secret needed.
  const token = randomBytes(32).toString("hex");
  const tokenExpiry = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  await admin
    .from("demoCompany")
    .update({ extensionToken: token, extensionTokenExpiresAt: tokenExpiry })
    .eq("id", companyId);

  const host = new URL(request.url).origin;
  const approveUrl = `${host}/api/demo/extend-approve?token=${token}`;

  const daysLeft = demo?.expiresAt
    ? Math.max(
        0,
        Math.ceil(
          (new Date(demo.expiresAt).getTime() - Date.now()) / 86_400_000
        )
      )
    : null;

  const address = [
    realCompany?.addressLine1,
    realCompany?.city,
    realCompany?.stateProvince,
    realCompany?.countryCode
  ]
    .filter(Boolean)
    .join(", ");

  const to = process.env.SUPER_ADMIN_EMAIL;
  if (!to) {
    console.warn("SUPER_ADMIN_EMAIL not set — extension request email skipped");
    return { ok: true };
  }

  const subject = `Demo Extension Request — ${name} at ${companyName}`;

  const expiryColor =
    daysLeft === null ? "#555" : daysLeft <= 0 ? "#dc2626" : daysLeft <= 7 ? "#d97706" : "#555";
  const expiryLabel =
    daysLeft === null
      ? ""
      : daysLeft <= 0
      ? " (expired)"
      : ` (${daysLeft} day${daysLeft === 1 ? "" : "s"} left)`;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;color:#111;max-width:600px;margin:0 auto;padding:24px">
  <h2 style="margin-top:0">Demo Extension Request</h2>

  <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
    <tr>
      <td colspan="2" style="background:#f4f4f5;padding:8px 12px;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#555">
        Contact
      </td>
    </tr>
    <tr>
      <td style="padding:8px 12px;width:38%;color:#555">Name</td>
      <td style="padding:8px 12px"><strong>${name}</strong></td>
    </tr>
    <tr style="background:#fafafa">
      <td style="padding:8px 12px;color:#555">Email</td>
      <td style="padding:8px 12px"><a href="mailto:${user?.email}">${user?.email ?? "—"}</a></td>
    </tr>
    <tr>
      <td style="padding:8px 12px;color:#555">Phone</td>
      <td style="padding:8px 12px">${user?.phone ?? "—"}</td>
    </tr>

    <tr>
      <td colspan="2" style="background:#f4f4f5;padding:8px 12px;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#555">
        Login Methods
      </td>
    </tr>
    <tr>
      <td style="padding:8px 12px;color:#555">Providers</td>
      <td style="padding:8px 12px">${loginMethods.length ? loginMethods.join(", ") : "—"}</td>
    </tr>
    <tr style="background:#fafafa">
      <td style="padding:8px 12px;color:#555">Member since</td>
      <td style="padding:8px 12px">${fmt(user?.createdAt)}</td>
    </tr>

    <tr>
      <td colspan="2" style="background:#f4f4f5;padding:8px 12px;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#555">
        Profile
      </td>
    </tr>
    <tr>
      <td style="padding:8px 12px;color:#555">About</td>
      <td style="padding:8px 12px">${user?.about ? `<em>${user.about}</em>` : "—"}</td>
    </tr>

    <tr>
      <td colspan="2" style="background:#f4f4f5;padding:8px 12px;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#555">
        Real Company
      </td>
    </tr>
    <tr>
      <td style="padding:8px 12px;color:#555">Name</td>
      <td style="padding:8px 12px"><strong>${realCompany?.name ?? "—"}</strong></td>
    </tr>
    <tr style="background:#fafafa">
      <td style="padding:8px 12px;color:#555">Address</td>
      <td style="padding:8px 12px">${address || "—"}</td>
    </tr>
    <tr>
      <td style="padding:8px 12px;color:#555">Website</td>
      <td style="padding:8px 12px">${realCompany?.website ? `<a href="${realCompany.website}">${realCompany.website}</a>` : "—"}</td>
    </tr>
    <tr style="background:#fafafa">
      <td style="padding:8px 12px;color:#555">Phone</td>
      <td style="padding:8px 12px">${realCompany?.phone ?? "—"}</td>
    </tr>
    <tr>
      <td style="padding:8px 12px;color:#555">Created</td>
      <td style="padding:8px 12px">${fmt(realCompany?.createdAt)}</td>
    </tr>

    <tr>
      <td colspan="2" style="background:#f4f4f5;padding:8px 12px;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#555">
        Demo Company
      </td>
    </tr>
    <tr>
      <td style="padding:8px 12px;color:#555">Created</td>
      <td style="padding:8px 12px">${fmt(demo?.createdAt)}</td>
    </tr>
    <tr style="background:#fafafa">
      <td style="padding:8px 12px;color:#555">Expires</td>
      <td style="padding:8px 12px">
        ${fmt(demo?.expiresAt)}<span style="color:${expiryColor}">${expiryLabel}</span>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 12px;color:#555">Seed status</td>
      <td style="padding:8px 12px">${demo?.seedStatus ?? "—"}</td>
    </tr>
  </table>

  <a href="${approveUrl}"
     style="display:inline-block;background:#18181b;color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-weight:600;font-size:15px">
    ✓ Approve 30-day extension
  </a>

  <p style="margin-top:24px;font-size:12px;color:#888">
    This link is valid for 7 days and can only be used once.
  </p>
</body>
</html>`;

  try {
    await sendEmail({
      from: `no-reply@${RESEND_DOMAIN}`,
      to,
      subject,
      html,
      text: `Demo extension request from ${name} (${user?.email ?? "?"}) at ${companyName}.\n\nApprove: ${approveUrl}`
    });
  } catch (error) {
    console.error("Failed to send extension request email:", error);
  }

  return { ok: true };
}

export default function DemoExtendRequest() {
  return null;
}
