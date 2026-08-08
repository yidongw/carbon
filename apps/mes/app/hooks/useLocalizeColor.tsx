import { useLingui } from "@lingui/react/macro";
import { STANDARD_COLOR_MESSAGES } from "~/utils/standardColorMessages";

/**
 * Localize common standard color names. Style color master data is often
 * English (e.g. "RED"); this maps the known ones to the active locale and
 * leaves anything custom untouched. Handles both colorName and colorCode.
 */
export function useLocalizeColor() {
  const { t } = useLingui();
  return (color: string | null | undefined) => {
    if (!color) return color;
    const descriptor = STANDARD_COLOR_MESSAGES[color.trim().toUpperCase()];
    return descriptor ? t(descriptor) : color;
  };
}
