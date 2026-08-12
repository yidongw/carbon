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

export function renderLazyOverlay<
  TContentProps extends Record<string, unknown>
>(
  selectProps: (ctx: OverlayContentProps) => TContentProps | null | undefined,
  factory: () => Promise<{
    default: ComponentType<TContentProps & OverlayFormInjectedProps>;
  }>
): OverlayRenderer {
  // Share one module promise so we can start the chunk download as soon as the
  // overlay shell mounts (while the route loader is still in flight). Without
  // this, Suspense never mounts until `isLoading` flips false — serializing
  // loader RTT and JS download.
  let modulePromise: ReturnType<typeof factory> | null = null;
  const loadModule = () => (modulePromise ??= factory());
  const LazyContent = lazy(loadModule);

  const Renderer: OverlayRenderer = (ctx) => {
    void loadModule();

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

/**
 * Like `renderLazyOverlay`, but does not block the form on the route loader.
 * Prefer `getWarmed` when the host page has already statically imported the
 * form module — React.lazy + Promise.resolve(warmed) can stay suspended forever
 * in production, so the warm path renders the component directly.
 */
export function renderImmediateOverlay<
  TContentProps extends Record<string, unknown>
>(
  selectProps: (ctx: OverlayContentProps) => TContentProps | null | undefined,
  factory: () => Promise<{
    default: ComponentType<TContentProps & OverlayFormInjectedProps>;
  }>,
  getWarmed?: () =>
    | ComponentType<TContentProps & OverlayFormInjectedProps>
    | null
    | undefined
): OverlayRenderer {
  let modulePromise: ReturnType<typeof factory> | null = null;
  const loadModule = () => (modulePromise ??= factory());
  const LazyContent = lazy(loadModule);

  const Renderer: OverlayRenderer = (ctx) => {
    const contentProps = selectProps(ctx);
    if (!contentProps) {
      return ctx.isLoading ? <LoadingFallback /> : null;
    }

    const props = { ...contentProps, ...overlayFormInjectedProps(ctx) };
    const Warmed = getWarmed?.();
    if (Warmed) {
      return <Warmed {...props} />;
    }

    void loadModule();
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

  Renderer.displayName = "ImmediateOverlay";
  return Renderer;
}
