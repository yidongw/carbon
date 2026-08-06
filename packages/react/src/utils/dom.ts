export type Booleanish = boolean | "true" | "false";

export const dataAttr = (condition: boolean | undefined) =>
  (condition ? "" : undefined) as Booleanish;

export const ariaAttr = (condition: boolean | undefined) =>
  condition ? true : undefined;

/**
 * Copy text content (string or Promise<string>) into Clipboard.
 * Safari doesn't support write text into clipboard async, so if you need to load
 * text content async before coping, please use Promise<string> for the 1st arg.
 */
/** Prevent Radix overlays from refocusing their trigger after pointer dismiss. */
export function preventOverlayCloseAutoFocus(
  onCloseAutoFocus?: (event: Event) => void
) {
  return (event: Event) => {
    onCloseAutoFocus?.(event);
    if (!event.defaultPrevented) {
      event.preventDefault();
      queueMicrotask(() => {
        const active = document.activeElement;
        if (active instanceof HTMLElement) {
          active.blur();
        }
      });
    }
  };
}

/**
 * Swallow the rest of the current pointer gesture so unmounting a portaled
 * list cannot "click through" onto controls beneath (e.g. a form Save button).
 * Same approach Radix DismissableLayer uses when layers close mid-click.
 */
export function suppressDocumentPointerEventsUntilGestureEnds() {
  const body = document.body;
  if (body.dataset.pointerEventsSuppressed === "true") return;

  const previous = body.style.pointerEvents;
  body.dataset.pointerEventsSuppressed = "true";
  body.style.pointerEvents = "none";

  const restore = () => {
    if (body.dataset.pointerEventsSuppressed !== "true") return;
    body.style.pointerEvents = previous;
    delete body.dataset.pointerEventsSuppressed;
    document.removeEventListener("pointerup", restore, true);
    document.removeEventListener("pointercancel", restore, true);
    document.removeEventListener("mouseup", restore, true);
    window.clearTimeout(timeoutId);
  };

  document.addEventListener("pointerup", restore, true);
  document.addEventListener("pointercancel", restore, true);
  document.addEventListener("mouseup", restore, true);
  const timeoutId = window.setTimeout(restore, 400);
}

export const copyToClipboard = async (
  str: string | Promise<string>,
  // biome-ignore lint/suspicious/noEmptyBlockStatements: suppressed due to migration
  callback = () => {}
) => {
  const focused = window.document.hasFocus();
  if (focused) {
    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      const text = await Promise.resolve(str);
      Promise.resolve(window.navigator?.clipboard?.writeText(text)).then(
        callback
      );

      return;
    }

    Promise.resolve(str)
      .then((text) => window.navigator?.clipboard?.writeText(text))
      .then(callback);
  } else {
    console.warn("Unable to copy to clipboard");
  }
};
