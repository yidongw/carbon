import type { I18n } from "@lingui/core";

/**
 * Translate a runtime value that MAY be a catalog message id — e.g. a seeded
 * default name like a customer status ("Active", "On Hold").
 *
 * Seeded defaults are extracted into the catalog and should localize, but the
 * same field can also hold user-defined values that are not catalog ids.
 * Calling `i18n._(value)` on a value that isn't in the compiled catalog logs
 * "Uncompiled message detected!" and returns the value unchanged.
 *
 * This helper only translates when the compiled catalog actually has the key,
 * so known seed defaults localize while custom values pass through silently —
 * no warning either way.
 */
export function translateIfKnown(i18n: I18n, value: string): string {
  return value in i18n.messages ? i18n._(value) : value;
}
