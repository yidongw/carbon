import { Font } from "@react-pdf/renderer";
import { BUNDLED_FONTS } from "./fonts.data";

// Fonts are bundled as base64 woff (fonts.data.ts, built by
// `pnpm --filter @carbon/documents build`) and registered in-process — no network
// at render. woff, NOT woff2: react-pdf supports only TTF/WOFF, and its fontkit's
// woff2/brotli decoder corrupts shared state when many woff2 fonts are decoded in
// one process, throwing DataView range errors at embed.

export const BUILT_IN_FONTS = ["Helvetica", "Times-Roman", "Courier"];

let registered = false;

export function registerDocumentFonts(): void {
  if (registered) return;
  registered = true;

  for (const { family, fonts } of BUNDLED_FONTS) {
    Font.register({ family, fonts });
  }
}

/**
 * Chinese (Simplified) support for react-pdf. The bundled Latin fonts above
 * cover Latin only, so any CJK text (garment bundle tickets carry Chinese
 * color/customer/work-center values) renders as blank boxes without a CJK face
 * registered.
 *
 * react-pdf embeds only the glyphs actually used, so registering a full CJK TTF
 * once per process is affordable. The source is overridable via
 * `CJK_FONT_URL_REGULAR` / `CJK_FONT_URL_BOLD` so deployments can self-host the
 * font instead of depending on the public CDN at print time.
 */
const CJK_FAMILY = "Noto Sans SC";
// A single Simplified-Chinese variable TrueType (TrueType outlines subset well
// in react-pdf; the CFF/OTF CJK builds do not). Both weights point at the same
// file — the default (regular) instance is embedded either way. Overridable so
// deployments can self-host instead of depending on the CDN at print time.
const CJK_FONT_URL_REGULAR =
  process.env.CJK_FONT_URL_REGULAR ??
  "https://cdn.jsdelivr.net/gh/googlefonts/noto-cjk@main/Sans/Variable/TTF/Subset/NotoSansSC-VF.ttf";
// Real weighted faces — the variable TTF ignores fontWeight in react-pdf (700
// renders identical to 400), so weighted text needs separate files or it prints
// thin/faint on a 1-bit thermal printer. Medium is used for the tag fields (bold
// looked too heavy); these SC subset OTFs subset fine (only used glyphs embed).
const CJK_FONT_URL_MEDIUM =
  process.env.CJK_FONT_URL_MEDIUM ??
  "https://cdn.jsdelivr.net/gh/googlefonts/noto-cjk@main/Sans/SubsetOTF/SC/NotoSansSC-Medium.otf";
const CJK_FONT_URL_BOLD =
  process.env.CJK_FONT_URL_BOLD ??
  "https://cdn.jsdelivr.net/gh/googlefonts/noto-cjk@main/Sans/SubsetOTF/SC/NotoSansSC-Bold.otf";

let cjkResult: string | null = null;
let cjkInFlight: Promise<string> | null = null;

/**
 * Ensure the CJK font is registered, returning the family name to use for text
 * that may contain Chinese — the registered CJK family when the font is
 * reachable, or `"Helvetica"` otherwise (so callers never register an
 * unreachable face). A HEAD check avoids a render-time fetch failure; callers
 * should still guard the render (fall back to Helvetica) in case the font
 * fails to parse.
 */
export async function ensureCJKFont(): Promise<string> {
  if (cjkResult) return cjkResult;
  if (cjkInFlight) return cjkInFlight;

  cjkInFlight = (async () => {
    try {
      const res = await fetch(CJK_FONT_URL_REGULAR, { method: "HEAD" });
      if (!res.ok) {
        cjkResult = "Helvetica";
        return cjkResult;
      }
      Font.register({
        family: CJK_FAMILY,
        fonts: [
          { src: CJK_FONT_URL_REGULAR },
          { src: CJK_FONT_URL_MEDIUM, fontWeight: 500 },
          { src: CJK_FONT_URL_BOLD, fontWeight: 700 }
        ]
      });
      // Disable hyphenation so CJK runs aren't broken mid-character.
      Font.registerHyphenationCallback((word) => [word]);
      cjkResult = CJK_FAMILY;
    } catch {
      cjkResult = "Helvetica";
    } finally {
      cjkInFlight = null;
    }
    return cjkResult ?? "Helvetica";
  })();

  return cjkInFlight;
}

// Back-compat: routes await ensureFont(family) before render, but fonts are now all
// registered up front, so the arg is ignored.
export async function ensureFont(_family?: string): Promise<void> {
  registerDocumentFonts();
}

// Falls back to Helvetica for an unregistered family so react-pdf never throws
// "Font family not registered".
export function getSafeFontFamily(family: string | undefined | null): string {
  registerDocumentFonts();
  if (!family) return "Helvetica";
  if (BUILT_IN_FONTS.includes(family)) return family;
  return Font.getRegisteredFontFamilies().includes(family)
    ? family
    : "Helvetica";
}
