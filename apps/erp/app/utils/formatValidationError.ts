import type { I18n, MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react/macro";

export const ZOD_STRING_MIN_ERROR =
  "String must contain at least 1 character(s)";

export const validationErrorMessages: Record<string, MessageDescriptor> = {
  [ZOD_STRING_MIN_ERROR]: msg`Required`,
  Required: msg`Required`,
  "List options are required": msg`List options are required`,
  "Label is required": msg`Label is required`
};

export function formatValidationError(error: string, i18n: I18n) {
  const descriptor = validationErrorMessages[error];
  if (descriptor) return i18n._(descriptor);
  return i18n._(error);
}

export function useFormatValidationError() {
  const { i18n } = useLingui();
  return (error: string) => formatValidationError(error, i18n);
}
