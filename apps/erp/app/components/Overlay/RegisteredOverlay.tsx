import { Drawer, DrawerContent, Modal, ModalContent } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { useCallback, useEffect, useRef } from "react";
import { useFetcher, useFetchers, useRevalidator } from "react-router";
import { variantsQuantityModalContentClassName } from "~/modules/production/ui/Jobs/configTableShared";
import { completeOverlayConfirm } from "./completeOverlayConfirm";
import { useOverlay } from "./OverlayProvider";
import { buildOverlayTarget, type OverlayTarget } from "./overlay";
import { getOverlayRegistryEntry } from "./overlay.registry";
import type { OverlayConfirmMode, OverlayInstance } from "./types";

// `w-fit` alone is not enough: ModalContentVariants' base carries `md:w-full`,
// which tailwind-merge keeps (different responsive group) and which wins on
// desktop — blowing the overlay to full width. `md:w-fit` overrides it so the
// modal shrinks to its content (the form's own `w-[44rem]`) at every breakpoint.
const overlayModalContentClassName = `${variantsQuantityModalContentClassName} pt-6 md:w-fit`;

/** A successful confirm response can request opening a follow-up overlay via a
 * generic `nextOverlay: { id, params }` signal (e.g. a master cutting report →
 * Split Batch). Resolved only for a successful (ok:true) response so we never
 * chain off a failed submit; unknown ids resolve to null and are ignored. */
function readNextOverlay(data: unknown): OverlayTarget | null {
  if (!data || typeof data !== "object") return null;
  if (!("ok" in data) || (data as { ok?: unknown }).ok !== true) return null;
  const next = (data as { nextOverlay?: unknown }).nextOverlay;
  if (!next || typeof next !== "object" || !("id" in next)) return null;
  const id = (next as { id?: unknown }).id;
  if (typeof id !== "string") return null;
  const rawParams = (next as { params?: unknown }).params;
  const params =
    rawParams && typeof rawParams === "object"
      ? (rawParams as Record<string, unknown>)
      : undefined;
  return buildOverlayTarget(id, params);
}

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
  const { openOverlay } = useOverlay();
  const { revalidate } = useRevalidator();
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

      // An action can chain a follow-up overlay via a `nextOverlay` signal (e.g.
      // a master cutting report → Split Batch). The opener that requested this
      // overlay may already chain via onCreated (the Report-Cutting button); when
      // it was opened from a deep link (no onCreated), honour the signal here so
      // the flow still works either way.
      if (!instance.onCreated) {
        const next = readNextOverlay(data);
        if (next) {
          openOverlay(next, { onCreated: () => revalidate() });
        }
      }
    },
    [confirmMode, instance, onClose, i18n, openOverlay, revalidate]
  );

  useEffect(() => {
    void loadOverlay.current(instance.url);
  }, [instance.url]);

  // A read-only overlay's data is fetched once, so inline mutations inside it
  // (e.g. changing an assignee) don't refresh it. Re-load the overlay whenever an
  // outside mutation fetcher settles, so it reflects the change without reopening.
  // Excludes this overlay's own submit (handled via confirm) and GET loads.
  const fetchers = useFetchers();
  const pendingMutations = fetchers.filter(
    (f) =>
      f.state !== "idle" &&
      f.formMethod &&
      f.formMethod.toUpperCase() !== "GET" &&
      f.key !== `overlay-submit-${instance.id}`
  ).length;
  const prevPendingMutations = useRef(pendingMutations);
  useEffect(() => {
    if (prevPendingMutations.current > 0 && pendingMutations === 0) {
      void loadOverlay.current(instance.url);
    }
    prevPendingMutations.current = pendingMutations;
  }, [pendingMutations, instance.url]);

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
    props: instance.props ?? {},
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
          className={overlayModalContentClassName}
        >
          <Content {...contentProps} />
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
