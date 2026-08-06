import { toast } from "@carbon/react";
import type { I18n } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import type { OverlayConfirmMode, OverlayInstance } from "./types";

/** `validationError()` responses carry `fieldErrors`; ValidatedForm renders those
 * on the fields themselves, so the host must stay quiet and leave the overlay
 * open rather than reporting a generic failure on top of the inline messages. */
function isFieldValidationFailure(data: object) {
  return (
    "fieldErrors" in data &&
    typeof (data as { fieldErrors?: unknown }).fieldErrors === "object" &&
    (data as { fieldErrors?: unknown }).fieldErrors !== null
  );
}

export function completeOverlayConfirm({
  data,
  instance,
  confirmMode,
  onClose,
  i18n
}: {
  data: unknown;
  instance: OverlayInstance;
  confirmMode: OverlayConfirmMode;
  onClose: (id: string) => void;
  i18n: I18n;
}) {
  if (typeof data !== "object" || data === null) {
    toast.error(i18n._(msg`Update failed`));
    return;
  }

  if (isFieldValidationFailure(data)) return;

  if ("ok" in data && data.ok === false) {
    const message =
      "error" in data && typeof data.error === "string" && data.error
        ? data.error
        : i18n._(msg`Update failed`);
    toast.error(message);
    return;
  }

  if (!("ok" in data) || data.ok !== true) {
    toast.error(i18n._(msg`Update failed`));
    return;
  }

  instance.onSuccess?.(data);
  instance.onCreated?.();

  if (confirmMode === "server" && instance.overlayId === "jobConfigTable") {
    toast.success(i18n._(msg`Quantity updated`));
  }

  onClose(instance.id);
}
