import { Drawer, DrawerContent, Modal, ModalContent } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { useCallback, useEffect, useRef } from "react";
import { useFetcher } from "react-router";
import { completeOverlayConfirm } from "./completeOverlayConfirm";
import { getOverlayRegistryEntry } from "./overlay.registry";
import type { OverlayConfirmMode, OverlayInstance } from "./types";

type RegisteredOverlayProps = {
  instance: OverlayInstance;
  stackIndex: number;
  onClose: (id: string) => void;
};

export function RegisteredOverlay({
  instance,
  stackIndex,
  onClose
}: RegisteredOverlayProps) {
  const { i18n } = useLingui();
  const entry = getOverlayRegistryEntry(instance.overlayId);
  const confirmMode: OverlayConfirmMode = entry?.confirmMode ?? "server";
  const loadFetcher = useFetcher({ key: `overlay-load-${instance.id}` });
  const submitFetcher = useFetcher({ key: `overlay-submit-${instance.id}` });
  const prevSubmitState = useRef(submitFetcher.state);
  const loadOverlay = useRef(loadFetcher.load);
  loadOverlay.current = loadFetcher.load;

  const handleConfirmSuccess = useCallback(
    (data: unknown) => {
      completeOverlayConfirm({
        data,
        instance,
        confirmMode,
        onClose,
        i18n
      });
    },
    [confirmMode, instance, onClose, i18n]
  );

  useEffect(() => {
    void loadOverlay.current(instance.url);
  }, [instance.url]);

  useEffect(() => {
    if (confirmMode !== "server") return;

    const prev = prevSubmitState.current;
    prevSubmitState.current = submitFetcher.state;

    // Fetchers go submitting → loading → idle when the action revalidates loaders.
    if (
      (prev === "submitting" || prev === "loading") &&
      submitFetcher.state === "idle"
    ) {
      handleConfirmSuccess(submitFetcher.data);
    }
  }, [
    confirmMode,
    submitFetcher.state,
    submitFetcher.data,
    handleConfirmSuccess
  ]);

  if (!entry) return null;

  const Content = entry.render;
  const zIndex = 50 + stackIndex * 10;
  const isLoading =
    loadFetcher.data === undefined && loadFetcher.state !== "idle";

  const contentProps = {
    loaderData: loadFetcher.data,
    isLoading,
    url: instance.url,
    close: () => onClose(instance.id),
    onCreated: instance.onCreated,
    submitFetcher,
    confirmMode,
    onConfirmSuccess: handleConfirmSuccess
  };

  if (entry.type === "modal") {
    return (
      <Modal
        open
        onOpenChange={(open) => {
          if (!open) onClose(instance.id);
        }}
      >
        <ModalContent
          stackZIndex={zIndex}
          className="flex h-[92vh] max-h-[92vh] w-[calc(100vw-1.5rem)] max-w-5xl flex-col gap-0 overflow-hidden p-0 pt-0 [&>button]:z-20"
        >
          <div className="min-h-0 flex-1 overflow-y-auto">
            <Content {...contentProps} />
          </div>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Drawer
      open
      onOpenChange={(open) => {
        if (!open) onClose(instance.id);
      }}
    >
      <DrawerContent
        style={{ zIndex }}
        onOpenAutoFocus={(event) => {
          if (isLoading) event.preventDefault();
        }}
      >
        <Content {...contentProps} />
      </DrawerContent>
    </Drawer>
  );
}
