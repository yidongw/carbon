import {
  measureElement as defaultMeasureElement,
  useVirtualizer
} from "@tanstack/react-virtual";
import type { RefObject } from "react";
import { useCallback, useRef } from "react";

// Row lists at or below this size render in full. Windowing has a fixed
// overhead (spacer rows, scroll measurement, re-render on scroll) that isn't
// worth paying for short lists, and small tables keep their exact, well-tested
// layout behavior. Server-paginated lists default to 100 rows/page, so most
// real list views cross this and get windowed.
export const VIRTUALIZATION_THRESHOLD = 50;

// Viewport height assumed for the very first render (server + hydration), before
// the real scroll container has been measured. Keeping it fixed makes the SSR
// output deterministic — the server and the first client render emit the same
// window of rows, so hydration matches — while still shipping only a screenful
// of rows instead of the entire list.
const INITIAL_VIEWPORT_HEIGHT = 900;

type UseVirtualRowsArgs = {
  /** Total number of rows in the (already sorted/filtered) row model. */
  count: number;
  /** The scroll container the rows live in. */
  scrollRef: RefObject<HTMLElement | null>;
  /** Seed row height in px, used until rows have been measured. */
  estimateSize: number;
  /** When false the caller renders every row and these results are inert. */
  enabled: boolean;
  overscan?: number;
};

/**
 * Thin wrapper around `@tanstack/react-virtual` shared by the desktop table body
 * and the mobile card list. It returns the visible window plus the leading and
 * trailing padding needed to preserve the scrollbar size. When `enabled` is
 * false it reports an empty window (count 0) so the caller can fall back to a
 * plain, un-windowed render without conditionally calling hooks.
 *
 * Rows vary in height (a plain text row vs. a thumbnail/multi-chip row), so each
 * rendered row is measured via `virtualizer.measureElement`. Off-screen rows
 * still need an estimate, though — we feed a running average of the heights
 * measured so far instead of a fixed seed, so the scrollbar and any long jump
 * land close to the real position and need little correction.
 */
export function useVirtualRows({
  count,
  scrollRef,
  estimateSize,
  enabled,
  overscan = 12
}: UseVirtualRowsArgs) {
  // Live average of measured row heights, seeded with the caller's estimate.
  const estimateRef = useRef(estimateSize);
  const measuredSizes = useRef(new Map<number, number>());
  const measuredSum = useRef(0);

  const measureRow = useCallback(
    (
      el: Element,
      entry: ResizeObserverEntry | undefined,
      instance: Parameters<typeof defaultMeasureElement>[2]
    ) => {
      const size = defaultMeasureElement(el, entry, instance);
      const indexAttr = el.getAttribute(instance.options.indexAttribute);
      const index = indexAttr === null ? Number.NaN : Number(indexAttr);
      if (Number.isFinite(index) && size > 0) {
        const previous = measuredSizes.current.get(index);
        measuredSizes.current.set(index, size);
        measuredSum.current += size - (previous ?? 0);
        estimateRef.current = measuredSum.current / measuredSizes.current.size;
      }
      return size;
    },
    []
  );

  const virtualizer = useVirtualizer({
    count: enabled ? count : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateRef.current,
    measureElement: measureRow,
    overscan,
    initialRect: { width: 0, height: INITIAL_VIEWPORT_HEIGHT }
  });

  const items = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();
  const paddingTop = items.length > 0 ? items[0].start : 0;
  const paddingBottom =
    items.length > 0 ? totalSize - items[items.length - 1].end : 0;

  return { virtualizer, items, totalSize, paddingTop, paddingBottom };
}
