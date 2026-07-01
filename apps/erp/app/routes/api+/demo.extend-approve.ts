import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { LoaderFunctionArgs } from "react-router";

/**
 * GET /api/demo/extend-approve?token=<random-hex>
 *
 * One-click approval link from the extension request email. No login needed.
 * The token is a 32-byte random hex string stored on demoCompany with a 7-day
 * TTL; it's cleared on first use so the link works exactly once.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const token = new URL(request.url).searchParams.get("token") ?? "";

  if (!token) {
    return html(page("Invalid link", "No token provided.", false));
  }

  const admin = getCarbonServiceRole();

  // Look up the demo company by token and check expiry in one query.
  const { data: demo } = await admin
    .from("demoCompany")
    .select("id, expiresAt, extensionTokenExpiresAt")
    .eq("extensionToken", token)
    .maybeSingle();

  if (!demo) {
    return html(
      page("Invalid or expired link", "This link is invalid or has already been used.", false)
    );
  }

  if (
    demo.extensionTokenExpiresAt &&
    new Date(demo.extensionTokenExpiresAt) < new Date()
  ) {
    return html(page("Link expired", "This approval link has expired. Ask the user to request a new extension.", false));
  }

  // Extend 30 days from today or from current expiry, whichever is later.
  const base = Math.max(
    Date.now(),
    demo.expiresAt ? new Date(demo.expiresAt).getTime() : 0
  );
  const newExpiry = new Date(base + 30 * 24 * 60 * 60 * 1000);

  // Clear the token (one-time use) and extend expiry atomically.
  await admin
    .from("demoCompany")
    .update({
      expiresAt: newExpiry.toISOString(),
      extensionToken: null,
      extensionTokenExpiresAt: null
    })
    .eq("id", demo.id);

  const { data: company } = await admin
    .from("company")
    .select("name")
    .eq("id", demo.id)
    .maybeSingle();

  const formatted = newExpiry.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  console.log(`Demo extended: company=${demo.id} (${company?.name}) newExpiry=${newExpiry.toISOString()}`);

  return html(
    page(
      "Extension approved",
      `Demo for <strong>${company?.name ?? demo.id}</strong> extended to <strong>${formatted}</strong>.`,
      true
    )
  );
}

function html(body: string) {
  return new Response(body, { headers: { "Content-Type": "text/html" } });
}

function page(title: string, body: string, success: boolean): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="font-family:sans-serif;color:#111;max-width:480px;margin:80px auto;padding:24px;text-align:center">
  <div style="font-size:48px;margin-bottom:16px">${success ? "✓" : "✗"}</div>
  <h1 style="margin:0 0 12px;font-size:22px">${title}</h1>
  <p style="color:#555;line-height:1.6">${body}</p>
</body>
</html>`;
}
