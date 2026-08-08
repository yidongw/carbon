import { describe, expect, it } from "vitest";
import { expireStaleCookieScopeHeaders } from "./cookie";

describe("expireStaleCookieScopeHeaders", () => {
  it("always expires the host-only scope", () => {
    expect(
      expireStaleCookieScopeHeaders("locale", undefined, undefined)
    ).toEqual(["locale=; Path=/; Max-Age=0"]);
  });

  it("expires host-only and intermediate domains down to cookieDomain", () => {
    expect(
      expireStaleCookieScopeHeaders("locale", "example.com", "erp.example.com")
    ).toEqual([
      "locale=; Path=/; Max-Age=0",
      "locale=; Domain=erp.example.com; Path=/; Max-Age=0"
    ]);
  });

  it("includes HttpOnly/SameSite when requested (session cookies)", () => {
    expect(
      expireStaleCookieScopeHeaders(
        "carbon",
        "example.com",
        "erp.example.com",
        {
          httpOnly: true,
          sameSite: "Lax"
        }
      )
    ).toEqual([
      "carbon=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax",
      "carbon=; Domain=erp.example.com; Path=/; Max-Age=0; HttpOnly; SameSite=Lax"
    ]);
  });
});
