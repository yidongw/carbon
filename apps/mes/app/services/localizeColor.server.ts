import { resolveLanguage } from "@carbon/locale";

// Standard color codes -> English display names. Keep in sync with
// apps/mes/app/hooks/useLocalizeColor.tsx.
const COLOR_EN: Record<string, string> = {
  RED: "Red",
  BLUE: "Blue",
  BLACK: "Black",
  WHITE: "White",
  GREEN: "Green",
  YELLOW: "Yellow",
  GRAY: "Gray",
  GREY: "Gray",
  PINK: "Pink",
  PURPLE: "Purple",
  ORANGE: "Orange",
  BROWN: "Brown",
  NAVY: "Navy",
  BEIGE: "Beige",
  KHAKI: "Khaki",
  GOLD: "Gold",
  SILVER: "Silver"
};

// Per-language overrides for the printed ticket. The lingui catalog can't be
// used here (its compiled keys are hashed at build time via the `t` macro), so
// standard colors are translated statically; anything else passes through.
const COLOR_BY_LANGUAGE: Record<string, Record<string, string>> = {
  zh: {
    RED: "红色",
    BLUE: "蓝色",
    BLACK: "黑色",
    WHITE: "白色",
    GREEN: "绿色",
    YELLOW: "黄色",
    GRAY: "灰色",
    GREY: "灰色",
    PINK: "粉色",
    PURPLE: "紫色",
    ORANGE: "橙色",
    BROWN: "棕色",
    NAVY: "藏青色",
    BEIGE: "米色",
    KHAKI: "卡其色",
    GOLD: "金色",
    SILVER: "银色"
  }
};

/**
 * Server-side counterpart to useLocalizeColor: translate a standard color code
 * to the request locale for printed tickets. Custom names pass through.
 */
export function localizeColorForLocale(
  color: string | null | undefined,
  locale: string | null | undefined
): string | null | undefined {
  if (!color) return color;
  const code = color.trim().toUpperCase();
  const language = resolveLanguage(locale);
  return COLOR_BY_LANGUAGE[language]?.[code] ?? COLOR_EN[code] ?? color;
}
