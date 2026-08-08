import { describe, expect, it } from "vitest";
import { getPreferenceHeaders } from "./headers";

describe("getPreferenceHeaders locale cookie", () => {
  it("uses a single locale cookie", () => {
    const prefs = getPreferenceHeaders(
      new Request("https://example.com", {
        headers: { cookie: "locale=es", "accept-language": "en-US" }
      })
    );
    expect(prefs.locale).toMatch(/^es/i);
  });

  it("prefers the last locale when host-only and Domain-scoped duplicates are sent", () => {
    // Browsers send the older host-only value first; the Domain-scoped write
    // from /api/locale comes second. Reading the first value made language
    // switch look like a no-op after login.
    const prefs = getPreferenceHeaders(
      new Request("https://example.com", {
        headers: {
          cookie: "locale=zh; locale=es",
          "accept-language": "en-US"
        }
      })
    );
    expect(prefs.locale).toMatch(/^es/i);
  });
});
