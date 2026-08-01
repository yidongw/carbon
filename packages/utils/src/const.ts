export const SUPPORT_EMAIL = "support@carbon.ms";

/**
 * The single source of truth for the free-plan read-only message. The server
 * (`requirePermissions`) sends this verbatim; the browser flash-toast middleware
 * swaps in the localized `.po` copy via `@carbon/react`'s `serverFlashMessages`.
 * That map must ALSO include the exact same text inside a `msg\`\`` macro — Lingui
 * only extracts from a static literal and strips the source at build time, so the
 * literal can't be replaced with this constant. Keep the two byte-for-byte equal.
 */
export const READ_ONLY_MESSAGE =
  "Your company is on the free plan (read-only). Upgrade to make changes.";

export const FILE_SIZE_LIMIT_MB = {
  CAD_MODEL_UPLOAD: 120,
  DOCUMENT_UPLOAD: 50
} as const;

export const PO_EMAIL_ATTACHMENT_LIMIT_MB = 25;
export const PO_EMAIL_ATTACHMENT_WARN_MB = 20;

export const getFileSizeLimit = (type: keyof typeof FILE_SIZE_LIMIT_MB) => {
  const valueMegaBytes = FILE_SIZE_LIMIT_MB[type];
  const valueBytes = valueMegaBytes * 1024 * 1024;

  return {
    get megabytes() {
      return valueMegaBytes;
    },
    format() {
      return `${valueMegaBytes} ${valueMegaBytes > 1 ? "MBs" : "MB"}`;
    },
    get bytes() {
      return valueBytes;
    }
  } as const;
};
