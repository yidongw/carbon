import { Loading } from "@carbon/react";
import {
  type ComponentType,
  type LazyExoticComponent,
  lazy,
  Suspense
} from "react";
import type { FetcherWithComponents } from "react-router";
import type {
  OverlayConfirmMode,
  OverlayContentProps,
  OverlayRenderer
} from "./types";

export type OverlayFormInjectedProps = {
  onDismiss: () => void;
  fetcher: FetcherWithComponents<unknown>;
  confirmMode: OverlayConfirmMode;
  onConfirmSuccess: (data: unknown) => void;
  /** POST target when `confirmMode` is `"server"`. */
  action?: string;
};

function overlayFormInjectedProps(
  ctx: OverlayContentProps
): OverlayFormInjectedProps {
  return {
    onDismiss: ctx.close,
    fetcher: ctx.submitFetcher,
    confirmMode: ctx.confirmMode,
    onConfirmSuccess: ctx.onConfirmSuccess,
    action: ctx.confirmMode === "server" ? ctx.url : undefined
  };
}

function LoadingFallback() {
  return (
    <div className="flex min-h-[200px] items-center justify-center p-6">
      <Loading isLoading />
    </div>
  );
}

function LazyOverlayContent({
  component: Component,
  props
}: {
  component: LazyExoticComponent<ComponentType<Record<string, unknown>>>;
  props: Record<string, unknown>;
}) {
  return <Component {...props} />;
}

export function renderLazyOverlay<TContentProps extends Record<string, unknown>>(
  selectProps: (
    ctx: OverlayContentProps
  ) => TContentProps | null | undefined,
  factory: () => Promise<{
    default: ComponentType<TContentProps & OverlayFormInjectedProps>;
  }>
): OverlayRenderer {
  const LazyContent = lazy(factory);

  const Renderer: OverlayRenderer = (ctx) => {
    if (ctx.isLoading) {
      return <LoadingFallback />;
    }

    if (ctx.loaderData === undefined) {
      return null;
    }

    const contentProps = selectProps(ctx);
    if (!contentProps) return null;

    const props = { ...contentProps, ...overlayFormInjectedProps(ctx) };

    return (
      <Suspense fallback={<LoadingFallback />}>
        <LazyOverlayContent
          component={
            LazyContent as LazyExoticComponent<
              ComponentType<Record<string, unknown>>
            >
          }
          props={props}
        />
      </Suspense>
    );
  };

  Renderer.displayName = "LazyOverlay";
  return Renderer;
}
