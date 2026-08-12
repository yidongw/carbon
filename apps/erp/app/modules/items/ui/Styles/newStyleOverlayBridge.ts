import type { ComponentType } from "react";
import type { z } from "zod";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import type { AttributeSetFormOption } from "~/modules/items/itemAttribute.service";
import type { styleValidator } from "../../style.models";

type NewStyleOverlayContentProps = {
  initialValues?: z.infer<typeof styleValidator>;
  attributeSets?: AttributeSetFormOption[];
} & Pick<OverlayFormInjectedProps, "onDismiss" | "fetcher" | "action">;

type NewStyleOverlayModule = {
  default: ComponentType<NewStyleOverlayContentProps>;
};

// globalThis so the styles-page sync bundle and the overlay lazy() factory share
// one warm slot even if Vite emits duplicate module instances.
const WARM_KEY = "__carbonWarmNewStyleOverlay";

/**
 * StylesTable calls this with the statically imported overlay content module so
 * Add Style resolves synchronously. A bare side-effect import is tree-shaken in
 * production and does not keep StyleForm in the page graph.
 */
export function warmNewStyleOverlay(module: NewStyleOverlayModule) {
  (globalThis as Record<string, unknown>)[WARM_KEY] = module;
}

export function loadNewStyleOverlay(): Promise<NewStyleOverlayModule> {
  const warmed = (globalThis as Record<string, unknown>)[WARM_KEY] as
    | NewStyleOverlayModule
    | undefined;
  if (warmed) return Promise.resolve(warmed);
  return import("./NewStyleOverlayContent");
}
