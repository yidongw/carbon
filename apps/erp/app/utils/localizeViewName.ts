import type { I18n, MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";

// Saved-view names are free text stored verbatim, so they normally show the same
// string to every viewer. A few views are created programmatically with a known
// English name and registered here so their label follows each viewer's language
// (translated via the same catalog message the UI uses). Arbitrary user-typed
// names aren't in this map and pass through unchanged.
const LOCALIZED_VIEW_NAMES: Record<string, MessageDescriptor> = {
  "Ready to cut": msg`Ready to cut`
};

export function localizeViewName(i18n: I18n, name: string): string {
  const descriptor = LOCALIZED_VIEW_NAMES[name];
  return descriptor ? i18n._(descriptor) : name;
}
