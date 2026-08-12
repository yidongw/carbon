import type { z } from "zod";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import type { AttributeSetFormOption } from "~/modules/items/itemAttribute.service";
import type { styleValidator } from "../../style.models";
import { newStyleInitialValues } from "./newStyleDefaults";
import StyleForm from "./StyleForm";

type NewStyleOverlayContentProps = {
  initialValues?: z.infer<typeof styleValidator>;
  attributeSets?: AttributeSetFormOption[];
} & Pick<OverlayFormInjectedProps, "onDismiss" | "fetcher" | "action">;

/**
 * Thin wrapper around StyleForm for the newStyle overlay.
 * StylesTable statically imports this module so StyleForm is already evaluated
 * when the overlay opens (no cold multi-second lazy chunk on first click).
 */
export default function NewStyleOverlayContent({
  initialValues = newStyleInitialValues,
  attributeSets,
  onDismiss,
  fetcher,
  action
}: NewStyleOverlayContentProps) {
  return (
    <StyleForm
      type="overlay"
      initialValues={initialValues}
      attributeSets={attributeSets}
      onDismiss={onDismiss}
      fetcher={fetcher}
      action={action}
    />
  );
}
