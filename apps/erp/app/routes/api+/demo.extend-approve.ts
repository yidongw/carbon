import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { LoaderFunctionArgs } from "react-router";
import { data } from "react-router";

function verifyToken(token: string): { companyId: string } | null {
  const secret = process.env.DEMO_APPROVE_SECRET ?? "";
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  // Constant-time comparison to prevent timing attacks.
  const a = Buffer.from(expected);
  const b = Buffer.from(sig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof parsed.companyId !== "string") return null;
    if (parsed.exp < Date.now()) return null;
    return { companyId: parsed.companyId };
  } catch {
    return null;
  }
}

/**
 * GET /api/demo/extend-approve?token=<signed>
 *
 * One-click approval link sent in the extension request email. No login needed —
 * the HMAC token proves intent and has a 7-day TTL.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";

  const verified = verifyToken(token);
  if (!verified) {
    return data(
      { html: page("Invalid or expired link", "This approval link is invalid or has expired. Please ask the user to request a new extension.", false) },
      { headers: { "Content-Type": "text/html" } }
    );
  }

  const { companyId } = verified;
  const admin = getCarbonServiceRole();

  const { data: demo } = await admin
    .from("demoCompany")
    .select("expiresAt, id")
    .eq("id", companyId)
    .maybeSingle();

  if (!demo) {
    return data(
      { html: page("Demo not found", `No demo company found for id ${companyId}.`, false) },
      { headers: { "Content-Type": "text/html" } }
    );
  }

  // Extend 30 days from today or from current expiry, whichever is later.
  const base = Math.max(
    Date.now(),
    demo.expiresAt ? new Date(demo.expiresAt).getTime() : 0
  );
  const newExpiry = new Date(base + 30 * 24 * 60 * 60 * 1000);

  await admin
    .from("demoCompany")
    .update({ expiresAt: newExpiry.toISOString() })
    .eq("id", companyId);

  const { data: company } = await admin
    .from("company")
    .select("name")
    .eq("id", companyId)
    .maybeSingle();

  const formatted = newExpiry.toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  });

  console.log(`Demo extended for company ${companyId} (${company?.name}) → ${newExpiry.toISOString()}`);

  return new Response(
    page(
      "Extension approved",
      `Demo for <strong>${company?.name ?? companyId}</strong> has been extended to <strong>${formatted}</strong>.`,
      true
    ),
    { headers: { "Content-Type": "text/html" } }
  );
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
