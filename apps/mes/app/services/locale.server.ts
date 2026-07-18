import { DOMAIN } from "@carbon/auth";
import { localeCookieName, resolveLanguage } from "@carbon/locale";
import * as cookie from "cookie";

/** Serialize the UI language cookie (same `locale` cookie the root reads). */
export function setLocale(locale: string) {
  const cookieOptions: cookie.SerializeOptions = {
    path: "/",
    maxAge: 31536000
  };

  if (DOMAIN && !DOMAIN.startsWith("localhost")) {
    cookieOptions.domain = DOMAIN;
  }

  return cookie.serialize(
    localeCookieName,
    resolveLanguage(locale),
    cookieOptions
  );
}
