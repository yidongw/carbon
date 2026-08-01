import { READ_ONLY_MESSAGE } from "@carbon/utils";
import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";

/**
 * Flash/toast messages produced by server code in shared packages (e.g.
 * `requirePermissions` in @carbon/auth) that can't reach the app's Lingui
 * catalog. The server sends the English source string as `result.message`; the
 * client flash-toast middleware looks it up here and renders `i18n._(descriptor)`.
 *
 * The value MUST be a `msg` macro descriptor (not the raw string): Carbon's
 * compiled catalog is keyed by Lingui's generated hash ids, so a raw source
 * string is never a catalog key and can't be translated directly. The `msg`
 * macro compiles to that same hash id, so the lookup resolves.
 *
 * Living in packages/react/src (a Lingui `include` path consumed as source)
 * means this gets both extracted into the catalog and macro-transformed.
 * Keep each key byte-for-byte identical to the string the server sends.
 */
export const serverFlashMessages: Record<string, MessageDescriptor> = {
  // Key = the exact string the server sends (from @carbon/utils). Value = the
  // `msg` descriptor; its literal must match the key byte-for-byte (Lingui needs
  // a static literal here and strips the source at build time).
  [READ_ONLY_MESSAGE]:
    msg`Your company is on the free plan (read-only). Upgrade to make changes.`
};
