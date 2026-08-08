import {
  DOMAIN,
  expireStaleCookieScopeHeaders,
  getCookieDomain
} from "@carbon/auth";
import { localeCookieName, resolveLanguage } from "@carbon/locale";
import * as cookie from "cookie";

/** Serialize the UI language cookie (same `locale` cookie the root reads). */
export function setLocale(locale: string, request?: Request): string[] {
  const cookieDomain = getCookieDomain(DOMAIN);
  const requestHost = request?.headers.get("host") ?? undefined;

  const clears = expireStaleCookieScopeHeaders(
    localeCookieName,
    cookieDomain,
    requestHost
  );

  const cookieOptions: cookie.SerializeOptions = {
    path: "/",
    maxAge: 31536000
  };
  if (cookieDomain) cookieOptions.domain = cookieDomain;

  return [
    ...clears,
    cookie.serialize(localeCookieName, resolveLanguage(locale), cookieOptions)
  ];
}
