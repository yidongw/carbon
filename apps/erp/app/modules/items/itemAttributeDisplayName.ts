import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";

/**
 * System catalog names for seeded attribute sets / attributes (by code or name).
 * Custom company-defined names pass through unchanged.
 */
const catalogMessages: Record<string, MessageDescriptor> = {
  Color: msg`Color`,
  Fabric: msg`Fabric`,
  Garment: msg`Garment`,
  Size: msg`Size`,
  Trim: msg`Trim`
};

export function translateItemAttributeCatalogName(
  name: string,
  i18n: { _: (descriptor: MessageDescriptor) => string }
): string {
  const descriptor = catalogMessages[name];
  return descriptor != null ? i18n._(descriptor) : name;
}
