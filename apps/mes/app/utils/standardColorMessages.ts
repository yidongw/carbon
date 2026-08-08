import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";

/**
 * Standard color codes → Lingui message descriptors.
 * Keep English source strings stable so catalog hashes stay aligned across
 * client (`useLocalizeColor`) and server (`localizeColor.server`) lookups.
 */
export const STANDARD_COLOR_MESSAGES: Record<string, MessageDescriptor> = {
  RED: msg`Red`,
  BLUE: msg`Blue`,
  BLACK: msg`Black`,
  WHITE: msg`White`,
  GREEN: msg`Green`,
  YELLOW: msg`Yellow`,
  GRAY: msg`Gray`,
  GREY: msg`Gray`,
  PINK: msg`Pink`,
  PURPLE: msg`Purple`,
  ORANGE: msg`Orange`,
  BROWN: msg`Brown`,
  NAVY: msg`Navy`,
  BEIGE: msg`Beige`,
  KHAKI: msg`Khaki`,
  GOLD: msg`Gold`,
  SILVER: msg`Silver`
};
