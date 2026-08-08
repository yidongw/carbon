import { parseAcceptLanguage } from "intl-parse-accept-language";

type OperatingSystemPlatform = "mac" | "windows";

/** All values for a cookie name, in header order (duplicates kept). */
function getCookieValues(cookieHeader: string, name: string): string[] {
  const values: string[] = [];
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    if (trimmed.slice(0, eq) !== name) continue;
    values.push(trimmed.slice(eq + 1));
  }
  return values;
}

export const getPreferenceHeaders = (request: Request) => {
  const acceptLanguage = request.headers.get("accept-language");
  const cookieHeader = request.headers.get("cookie");
  // Prefer the last `locale=` when host-only + Domain-scoped duplicates are
  // both sent — browsers put the older/more-specific host-only value first,
  // and `cookie.parse` would keep that stale value.
  const localeValues = cookieHeader
    ? getCookieValues(cookieHeader, "locale")
    : [];
  const localeCookie = localeValues.at(-1);
  const locales = parseAcceptLanguage(acceptLanguage, {
    validate: Intl.DateTimeFormat.supportedLocalesOf
  });
  const [cookieLocale] = localeCookie
    ? Intl.DateTimeFormat.supportedLocalesOf([localeCookie])
    : [];

  // get whether it's a mac or pc from the headers
  const platform: OperatingSystemPlatform = request.headers
    .get("user-agent")
    ?.includes("Mac")
    ? "mac"
    : "windows";

  let locale = cookieLocale ?? locales?.[0] ?? "en-US";

  if (cookieLocale && !cookieLocale.includes("-") && locales?.length) {
    const regionalMatch = locales.find((l) =>
      l.toLowerCase().startsWith(cookieLocale.toLowerCase() + "-")
    );
    if (regionalMatch) locale = regionalMatch;
  }

  return {
    platform,
    locale
  };
};

/**
 * Build a `Content-Disposition` header value that is safe for filenames with
 * non-Latin-1 characters (e.g. a company name with CJK characters).
 *
 * HTTP header values are ByteStrings (0–255), so putting a CJK filename
 * straight into `filename="…"` throws `Cannot convert argument to a ByteString`
 * when the `Headers` object is constructed, 500-ing the route. Per RFC 6266 we
 * emit both an ASCII-only `filename` fallback and a percent-encoded
 * `filename*=UTF-8''…`, which modern browsers prefer — so the download keeps its
 * real (Unicode) name while the header stays Latin-1.
 */
export function contentDisposition(
  filename: string,
  type: "inline" | "attachment" = "inline"
): string {
  const ascii = filename.replace(/[^\x20-\x7E]/g, "_").replace(/["\\]/g, "'");
  const encoded = encodeURIComponent(filename);
  return `${type}; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}
