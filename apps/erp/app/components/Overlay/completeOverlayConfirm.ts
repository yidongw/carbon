import { toast } from "@carbon/react";
import type { I18n } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import type { OverlayConfirmMode, OverlayInstance } from "./types";

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
  if (
    typeof data !== "object" ||
    data === null ||
    !("ok" in data) ||
    data.ok !== true
  ) {
    return;
  }

  instance.onSuccess?.(data);
  instance.onCreated?.();

  if (confirmMode === "server" && instance.overlayId === "jobConfigTable") {
    toast.success(i18n._(msg`Quantity updated`));
  }

  onClose(instance.id);
}
