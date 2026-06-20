import type { ComponentType } from "react";
import type { FetcherWithComponents } from "react-router";
import type { OverlayId } from "./overlay.registry";

export type OverlayType = "drawer" | "modal";

/** How overlay content confirms: POST to `url` action, or client-only callback. */
export type OverlayConfirmMode = "client" | "server";

export type OverlayContentProps<TLoader = unknown> = {
  loaderData: TLoader | undefined;
  isLoading: boolean;
  url: string;
  close: () => void;
  onCreated?: () => void;
  submitFetcher: FetcherWithComponents<unknown>;
  confirmMode: OverlayConfirmMode;
  onConfirmSuccess: (data: unknown) => void;
};

export type OverlayRenderer = ComponentType<OverlayContentProps>;

export type OverlayRegistryEntry = {
  type: OverlayType;
  render: OverlayRenderer;
  /** Default `"server"`. Use `"client"` when confirm should not POST (e.g. draft config on a parent form). */
  confirmMode?: OverlayConfirmMode;
};

export type OverlayInstance = {
  id: string;
  overlayId: OverlayId;
  url: string;
  onCreated?: () => void;
  onSuccess?: (data: unknown) => void;
};

export type OpenOverlayOptions = {
  onCreated?: () => void;
  onSuccess?: (data: unknown) => void;
};
