export function getAutoScrollDirection({
  pointerY,
  containerTop,
  containerBottom,
  threshold
}: {
  pointerY: number;
  containerTop: number;
  containerBottom: number;
  threshold: number;
}): -1 | 0 | 1 {
  if (pointerY < containerTop + threshold) return -1;
  if (pointerY > containerBottom - threshold) return 1;
  return 0;
}

export function findScrollContainer(element: HTMLElement | null) {
  let current = element?.parentElement ?? null;

  while (current) {
    const style = window.getComputedStyle(current);
    const overflowY = style.overflowY;
    const canScrollY =
      (overflowY === "auto" ||
        overflowY === "scroll" ||
        overflowY === "overlay") &&
      current.scrollHeight > current.clientHeight;

    if (canScrollY) return current;

    current = current.parentElement;
  }

  return document.scrollingElement as HTMLElement | null;
}
