import { useLingui } from "@lingui/react/macro";

/**
 * Localize common standard color names. Style color master data is often
 * English (e.g. "RED"); this maps the known ones to the active locale and
 * leaves anything custom untouched. Handles both colorName and colorCode.
 */
export function useLocalizeColor() {
  const { t } = useLingui();
  const colorNames: Record<string, string> = {
    RED: t`Red`,
    BLUE: t`Blue`,
    BLACK: t`Black`,
    WHITE: t`White`,
    GREEN: t`Green`,
    YELLOW: t`Yellow`,
    GRAY: t`Gray`,
    GREY: t`Gray`,
    PINK: t`Pink`,
    PURPLE: t`Purple`,
    ORANGE: t`Orange`,
    BROWN: t`Brown`,
    NAVY: t`Navy`,
    BEIGE: t`Beige`,
    KHAKI: t`Khaki`,
    GOLD: t`Gold`,
    SILVER: t`Silver`
  };
  return (color: string | null | undefined) =>
    color ? (colorNames[color.trim().toUpperCase()] ?? color) : color;
}
