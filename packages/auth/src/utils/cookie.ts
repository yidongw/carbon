export function getCookieDomain(
  domain: string | null | undefined
): string | undefined {
  if (!domain) return undefined;

  const withoutProtocol = domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "");
  const host = withoutProtocol.split("/")[0]?.split(":")[0];

  if (!host) return undefined;
  if (host === "localhost" || host.endsWith(".localhost")) return undefined;
  if (host.startsWith("[") || /^[\d.]+$/.test(host)) return undefined;

  return host;
}

/**
 * Expire cookie scopes that are NOT the current `cookieDomain`, so a stale
 * host-only (or narrower Domain) cookie cannot shadow the one the app writes.
 *
 * Same problem as the session `carbon` cookie: after DOMAIN changes, browsers
 * keep the old scope and send both; `cookie.parse` keeps the first value.
 * Pass `cookieDomain` undefined to only clear the host-only variant.
 */
export function expireStaleCookieScopeHeaders(
  name: string,
  cookieDomain: string | undefined,
  requestHost: string | undefined,
  attrs: { httpOnly?: boolean; sameSite?: "Lax" | "Strict" | "None" } = {}
): string[] {
  const suffix = [
    attrs.httpOnly ? "HttpOnly" : null,
    attrs.sameSite ? `SameSite=${attrs.sameSite}` : null
  ]
    .filter(Boolean)
    .map((part) => `; ${part}`)
    .join("");

  const headers = [`${name}=; Path=/; Max-Age=0${suffix}`];

  if (!cookieDomain || !requestHost) return headers;

  let host = requestHost.split(":")[0]?.toLowerCase() ?? "";
  while (host && host !== cookieDomain && host.includes(".")) {
    headers.push(`${name}=; Domain=${host}; Path=/; Max-Age=0${suffix}`);
    host = host.slice(host.indexOf(".") + 1);
  }
  return headers;
}
