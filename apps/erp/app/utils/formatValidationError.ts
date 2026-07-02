import type { I18n, MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react/macro";

export const ZOD_STRING_MIN_ERROR =
  "String must contain at least 1 character(s)";

export const validationErrorMessages: Record<string, MessageDescriptor> = {
  [ZOD_STRING_MIN_ERROR]: msg`Required`,
  Required: msg`Required`,
  "List options are required": msg`List options are required`,
  "Label is required": msg`Label is required`,
  "Email is required": msg`Email is required`,
  "Must be a valid email": msg`Must be a valid email`,
  "Password is too short": msg`Password is too short`,
  "First name is required": msg`First name is required`,
  "Last name is required": msg`Last name is required`,
  "Verification code is required": msg`Verification code is required`,
  "Verification code must be 6 characters": msg`Verification code must be 6 characters`,
  "Rate limit exceeded": msg`Rate limit exceeded`,
  "Bot verification failed. Please try again.": msg`Bot verification failed. Please try again.`,
  "Invalid email address": msg`Invalid email address`,
  "Failed to send magic link": msg`Failed to send magic link`,
  "User record not found": msg`User record not found`,
  "Failed to sign in": msg`Failed to sign in`,
  "Failed to send verification code": msg`Failed to send verification code`,
  "Invalid verification code": msg`Invalid verification code`,
  "Invalid or expired verification code": msg`Invalid or expired verification code`,
  "Failed to create user account": msg`Failed to create user account`,
  "Failed to sign in user": msg`Failed to sign in user`,
  "Email link is invalid or has expired": msg`Email link is invalid or has expired`,
  "Error deleting file": msg`Error deleting file`,
  "Failed to upload file": msg`Failed to upload file`,
  "File upload is not supported for external scars": msg`File upload is not supported for external scars`,
  "File size too big (max 20MB).": msg`File size too big (max 20MB).`,
  "Please open this link in the same browser where you requested sign-in.": msg`Please open this link in the same browser where you requested sign-in.`,
  "Magic link expired or already used. Please request a new one.": msg`Magic link expired or already used. Please request a new one.`
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
