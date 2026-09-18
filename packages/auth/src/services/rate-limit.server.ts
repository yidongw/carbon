import { RATE_LIMIT, TRUSTED_PROXY_IPS } from "@carbon/env";
import { Ratelimit, redis } from "@carbon/kv";

const trustedProxyIps = new Set(
  (TRUSTED_PROXY_IPS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
);

// A trusted proxy IP fronts an entire site (all its users share that one IP), so
// its aggregate ceiling must be far higher than a single real user's — but still
// finite, so a compromised/abusive client behind the proxy can't burn unlimited
// SMS/email quota. Per-identifier limits still bound each individual account.
const TRUSTED_PROXY_MULTIPLIER = 100;

function slidingHour(tokens: number) {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, "1 h"),
    analytics: true
  });
}

/**
 * Login/OTP rate limit with two independent hourly sliding windows — BOTH must
 * pass:
 *   1. per identifier (phone number / email): stops spamming a single account.
 *   2. per IP: stops one client enumerating many identifiers to burn our
 *      SMS/email quota.
 *
 * Behind the China L4 proxy every mainland user shares one source IP, so a flat
 * per-IP limit would throttle the whole site at once. Trusted proxy IPs
 * (`TRUSTED_PROXY_IPS`) therefore get a large aggregate ceiling instead of the
 * per-user limit, while the per-identifier window still protects each account.
 *
 * `scope` namespaces the counters (e.g. "sms-send", "email-verify") so unrelated
 * flows don't share a bucket.
 */
export async function checkLoginRateLimit(
  scope: string,
  identifier: string | null | undefined,
  ip: string
): Promise<boolean> {
  if (identifier) {
    const idOk = (
      await slidingHour(RATE_LIMIT).limit(`${scope}:id:${identifier}`)
    ).success;
    if (!idOk) return false;
  }

  const ipCeiling = trustedProxyIps.has(ip)
    ? RATE_LIMIT * TRUSTED_PROXY_MULTIPLIER
    : RATE_LIMIT;
  const ipOk = (await slidingHour(ipCeiling).limit(`${scope}:ip:${ip}`))
    .success;
  return ipOk;
}
