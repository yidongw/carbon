import { DOMAIN, getCookieDomain } from "@carbon/auth";
import type { TextSize } from "@carbon/utils";
import { DEFAULT_TEXT_SIZE, TEXT_SIZES } from "@carbon/utils";
import * as cookie from "cookie";

const cookieName = "textSize";

export function getTextSize(request: Request): TextSize {
  const cookieHeader = request.headers.get("cookie");
  const parsed = cookieHeader
    ? cookie.parse(cookieHeader)[cookieName]
    : DEFAULT_TEXT_SIZE;
  if (TEXT_SIZES.includes(parsed as TextSize)) return parsed as TextSize;
  return DEFAULT_TEXT_SIZE;
}

export function setTextSize(textSize: string) {
  const cookieOptions: cookie.SerializeOptions = {
    path: "/",
    maxAge: 31536000
  };

  const cookieDomain = getCookieDomain(DOMAIN);
  if (cookieDomain) cookieOptions.domain = cookieDomain;

  return cookie.serialize(cookieName, textSize, cookieOptions);
}
