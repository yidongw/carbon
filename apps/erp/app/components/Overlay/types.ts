import type { ComponentType } from "react";
import type { FetcherWithComponents } from "react-router";
import type { OverlayId } from "./overlay.registry";

export type OverlayType = "drawer" | "modal";

export type OverlayContentProps<TLoader = unknown> = {
  loaderData: TLoader | undefined;
  isLoading: boolean;
  url: string;
  close: () => void;
  onCreated?: () => void;
  submitFetcher: FetcherWithComponents<unknown>;
};

export type OverlayRenderer = ComponentType<OverlayContentProps>;

export type OverlayRegistryEntry = {
  type: OverlayType;
  render: OverlayRenderer;
};

export type OverlayInstance = {
  id: string;
  overlayId: OverlayId;
  url: string;
  onCreated?: () => void;
};

export type OpenOverlayOptions = {
  onCreated?: () => void;
};
