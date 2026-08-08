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

/** Split Batch's failures carry an interpolated `reason` (a cut/reported cap), so
 * the message is translated here rather than as a catalog-unmatchable flash. */
function splitBatchErrorMessage(data: object, i18n: I18n): string {
  const num = (key: string) => {
    const v = (data as Record<string, unknown>)[key];
    return typeof v === "number" ? v : 0;
  };
  switch ((data as { reason?: unknown }).reason) {
    case "cap":
      return i18n._(
        msg`An attribute combo can't exceed the cut quantity (max ${num("max")})`
      );
    case "reported":
      return i18n._(
        msg`A bundle can't be set below its reported quantity (${num("reported")})`
      );
    case "save":
      return i18n._(msg`Failed to save bundles`);
    default:
      return i18n._(msg`Split failed`);
  }
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
    if (
      confirmMode === "server" &&
      instance.overlayId === "masterWorkOrderSplitBatch"
    ) {
      toast.error(splitBatchErrorMessage(data, i18n));
      return;
    }
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

  // Split Batch reports how many bundles it created/updated. The counts are
  // dynamic, so the toast is built + translated here rather than as a server
  // flash string (interpolated flash messages can't be catalog-matched).
  if (
    confirmMode === "server" &&
    instance.overlayId === "masterWorkOrderSplitBatch"
  ) {
    const created =
      "created" in data && typeof data.created === "number" ? data.created : 0;
    const updated =
      "updated" in data && typeof data.updated === "number" ? data.updated : 0;
    toast.success(
      i18n._(msg`Saved bundles (${created} created, ${updated} updated)`)
    );
  }

  onClose(instance.id);
}
