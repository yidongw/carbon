/**
 * Minimal HS256 JWT signer for the integration harness — mints the tokens
 * PostgREST accepts (its role comes from the `role` claim). No dependency; the
 * tokens only ever authenticate to an ephemeral throwaway container.
 */
import crypto from "node:crypto";

const b64url = (o: unknown) =>
  Buffer.from(JSON.stringify(o)).toString("base64url");

// Fixed, far-future expiry — these guard a throwaway container, so there is no
// reason to rotate and avoiding a clock read keeps them deterministic.
const IAT = 1_641_769_200; // 2022-01-10
const EXP = 1_893_456_000; // 2030-01-01

export function signJwt(secret: string, claims: Record<string, unknown>): string {
  const header = b64url({ alg: "HS256", typ: "JWT" });
  const payload = b64url({ iat: IAT, exp: EXP, ...claims });
  const data = `${header}.${payload}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("base64url");
  return `${data}.${signature}`;
}

/** Full-access token (bypasses RLS) — the equivalent of the service-role key. */
export const serviceRoleToken = (secret: string) =>
  signJwt(secret, { role: "service_role", iss: "carbon-itest" });

/** User-scoped token — RLS applies as this user. */
export const authenticatedToken = (secret: string, userId: string) =>
  signJwt(secret, {
    role: "authenticated",
    aud: "authenticated",
    sub: userId,
    iss: "carbon-itest",
  });
