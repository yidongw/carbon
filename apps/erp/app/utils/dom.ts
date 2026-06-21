/** Keep drawers/dialogs open when the user interacts with portaled select menus. */
export function preventDismissOnPortaledContent(event: Event) {
  const target = event.target as HTMLElement | null;
  if (
    target?.closest('[role="listbox"]') ||
    target?.closest("[data-radix-select-viewport]") ||
    target?.closest("[data-radix-popper-content-wrapper]")
  ) {
    event.preventDefault();
  }
}

export function scrollIntoView(element: HTMLElement | undefined | null) {
  element?.scrollIntoView({
    inline: "nearest",
    block: "nearest"
  });
}

type StartViewTransition = (callback: () => void | Promise<void>) => {
  ready: Promise<void>;
  finished: Promise<void>;
};

export function startModeTransition(
  nextMode: "light" | "dark",
  persist: () => void
) {
  const html = document.documentElement;

  const apply = () => {
    html.classList.remove("light", "dark");
    html.classList.add(nextMode);
    document.body.removeAttribute("style");
    persist();
  };

  const start = (
    document as Document & { startViewTransition?: StartViewTransition }
  ).startViewTransition;

  if (!start) {
    apply();
    return;
  }

  html.classList.add("mode-transitioning");

  const transition = start.call(document, apply);
  transition.ready.then(() => {
    html.animate(
      { clipPath: ["inset(0 0 100% 0)", "inset(0)"] },
      {
        pseudoElement: "::view-transition-new(root)",
        duration: 600,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)"
      }
    );
  });
  transition.finished.finally(() => {
    html.classList.remove("mode-transitioning");
  });
}
