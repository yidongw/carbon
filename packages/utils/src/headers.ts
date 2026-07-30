import * as cookie from "cookie";
import { parseAcceptLanguage } from "intl-parse-accept-language";

type OperatingSystemPlatform = "mac" | "windows";

export const getPreferenceHeaders = (request: Request) => {
  const acceptLanguage = request.headers.get("accept-language");
  const cookieHeader = request.headers.get("cookie");
  const localeCookie = cookieHeader
    ? cookie.parse(cookieHeader).locale
    : undefined;
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
 * non-Latin-1 characters (e.g. a Chinese company name like 紫梦伊云).
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
