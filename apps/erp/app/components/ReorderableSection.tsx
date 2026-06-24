import { useLingui } from "@lingui/react/macro";
import { Reorder, useDragControls } from "framer-motion";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { LuGripVertical } from "react-icons/lu";

/** Nearest vertically-scrollable ancestor, falling back to the page scroller. */
function findScrollContainer(element: HTMLElement | null) {
  let current = element?.parentElement ?? null;
  while (current) {
    const overflowY = window.getComputedStyle(current).overflowY;
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      current.scrollHeight > current.clientHeight
    ) {
      return current;
    }
    current = current.parentElement;
  }
  return document.scrollingElement as HTMLElement | null;
}

// How close (px) to an edge before auto-scroll kicks in, and the max px/frame.
const AUTO_SCROLL_THRESHOLD = 100;
const AUTO_SCROLL_MAX_SPEED = 22;

/**
 * While a section is being dragged, scrolls the surrounding container when the
 * pointer nears its top or bottom edge — faster the closer to the edge.
 *
 * framer-motion drives both the dragged item's position AND its reorder
 * detection from the pointer (it only re-checks order on pointer move, using the
 * drag transform value). A custom scroll container is invisible to it, so we
 * hide the real pointer moves (capture phase, before framer's window listener)
 * and relay a single synthetic stream shifted down by the scroll offset.
 * Shifting the pointer by the scroll keeps the card under the cursor, and
 * relaying it every frame makes framer re-run reorder while the list scrolls so
 * the other cards open/close the gap.
 *
 * Returns a `start` callback to invoke on drag start; it cleans itself up on
 * pointer up / cancel / unmount.
 */
function useDragAutoScroll() {
  const frameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const pointerMetaRef = useRef({
    pointerId: 1,
    pointerType: "mouse",
    isPrimary: true
  });
  // Total scroll applied since drag start; framer's pointer is shifted by this.
  const scrollOffsetRef = useRef(0);
  // True while we re-dispatch our own synthetic pointer event so the capture
  // interceptor lets it through to framer instead of swallowing it.
  const dispatchingRef = useRef(false);

  const interceptPointerMove = useCallback((event: PointerEvent) => {
    if (dispatchingRef.current) return;
    pointerRef.current = { x: event.clientX, y: event.clientY };
    event.stopImmediatePropagation();
  }, []);

  const relayToFramer = useCallback(() => {
    const pointer = pointerRef.current;
    if (!pointer) return;
    const meta = pointerMetaRef.current;
    dispatchingRef.current = true;
    window.dispatchEvent(
      new PointerEvent("pointermove", {
        clientX: pointer.x,
        clientY: pointer.y + scrollOffsetRef.current,
        pointerId: meta.pointerId,
        pointerType: meta.pointerType,
        isPrimary: meta.isPrimary,
        buttons: 1,
        bubbles: true,
        cancelable: true
      })
    );
    dispatchingRef.current = false;
  }, []);

  const stop = useCallback(() => {
    containerRef.current = null;
    pointerRef.current = null;
    scrollOffsetRef.current = 0;
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    window.removeEventListener("pointermove", interceptPointerMove, true);
    window.removeEventListener("pointerup", stop);
    window.removeEventListener("pointercancel", stop);
  }, [interceptPointerMove]);

  const tick = useCallback(() => {
    const container = containerRef.current;
    const pointer = pointerRef.current;
    if (container && pointer) {
      const rect = container.getBoundingClientRect();
      // Clamp the edges to the visible viewport: the container can extend past
      // the bottom of the screen (e.g. `h-[calc(100dvh-49px)]`), and the pointer
      // can only ever reach the visible edge — so measure proximity from there.
      const visibleTop = Math.max(rect.top, 0);
      const visibleBottom = Math.min(rect.bottom, window.innerHeight);
      const fromTop = pointer.y - visibleTop;
      const fromBottom = visibleBottom - pointer.y;

      const before = container.scrollTop;
      if (fromTop < AUTO_SCROLL_THRESHOLD) {
        const intensity = Math.min(
          1,
          (AUTO_SCROLL_THRESHOLD - fromTop) / AUTO_SCROLL_THRESHOLD
        );
        container.scrollTop -= AUTO_SCROLL_MAX_SPEED * intensity;
      } else if (fromBottom < AUTO_SCROLL_THRESHOLD) {
        const intensity = Math.min(
          1,
          (AUTO_SCROLL_THRESHOLD - fromBottom) / AUTO_SCROLL_THRESHOLD
        );
        container.scrollTop += AUTO_SCROLL_MAX_SPEED * intensity;
      }
      scrollOffsetRef.current += container.scrollTop - before;
      relayToFramer();
    }
    frameRef.current = requestAnimationFrame(tick);
  }, [relayToFramer]);

  const start = useCallback(
    (event: ReactPointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
      pointerMetaRef.current = {
        pointerId: event.pointerId,
        pointerType: event.pointerType,
        isPrimary: event.isPrimary
      };
      scrollOffsetRef.current = 0;
      containerRef.current = findScrollContainer(
        event.currentTarget as HTMLElement
      );
      // Capture phase so we run before framer's own window pointermove listener.
      window.addEventListener("pointermove", interceptPointerMove, true);
      window.addEventListener("pointerup", stop);
      window.addEventListener("pointercancel", stop);
      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(tick);
      }
    },
    [interceptPointerMove, stop, tick]
  );

  useEffect(() => stop, [stop]);

  return start;
}

/**
 * Remembers a reorderable list's order in localStorage. Starts from the default
 * order on the server (and first client render) to avoid hydration mismatches,
 * then loads any saved order after mount. Ids that aren't in the saved order are
 * appended so newly-added sections never disappear, and ids that are no longer
 * known are dropped.
 */
export function useReorderableOrder(
  storageKey: string,
  defaultOrder: readonly string[]
) {
  const [order, setOrder] = useState<string[]>(() => [...defaultOrder]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? "null");
      if (!Array.isArray(saved)) return;
      const known = saved.filter((id): id is string =>
        defaultOrder.includes(id)
      );
      const merged = [
        ...known,
        ...defaultOrder.filter((id) => !known.includes(id))
      ];
      setOrder(merged);
    } catch {
      // Ignore malformed storage and keep the default order.
    }
  }, [storageKey, defaultOrder]);

  const reorder = useCallback(
    (next: string[]) => {
      setOrder(next);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Storage may be unavailable (private mode); reorder still works in-session.
      }
    },
    [storageKey]
  );

  return [order, reorder] as const;
}

/**
 * A `Reorder.Group` configured for a vertical stack of {@link ReorderableSection}
 * cards. Pass the `order` array and an `onReorder` callback (e.g. from
 * {@link useReorderableOrder}).
 */
export function ReorderableSectionGroup({
  order,
  onReorder,
  className = "flex w-full flex-col gap-2",
  children
}: {
  order: string[];
  onReorder: (order: string[]) => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Reorder.Group
      as="div"
      axis="y"
      values={order}
      onReorder={onReorder}
      className={className}
    >
      {children}
    </Reorder.Group>
  );
}

/**
 * One draggable card within a {@link ReorderableSectionGroup}. Renders a grip
 * handle in the top-left of the card's header and supports edge auto-scroll
 * while dragging. When `children` renders nothing the wrapper collapses via
 * `:has(> .section-body:empty)`, so empty sections show no stray handle — make
 * sure the section renders `null`/nothing rather than an empty placeholder.
 */
export function ReorderableSection({
  id,
  label,
  children
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  const { t } = useLingui();
  const controls = useDragControls();
  const startAutoScroll = useDragAutoScroll();

  return (
    <Reorder.Item
      as="div"
      value={id}
      dragListener={false}
      dragControls={controls}
      className="group/section relative w-full [&:has(>.section-body:empty)]:hidden"
    >
      <div className="section-body w-full">{children}</div>
      {/* The grip sits inside the card's existing header left padding (px-6),
          so it never reflows the title or body. It renders after the card so
          it shares the card's (auto) z-index while still sitting on top. */}
      <button
        type="button"
        aria-label={label}
        title={t`Drag to reorder`}
        onPointerDown={(event) => {
          // Register the auto-scroll interceptor before framer's own pointer
          // listener so it runs first and can relay shifted moves to framer.
          startAutoScroll(event);
          controls.start(event);
        }}
        style={{ touchAction: "none" }}
        className="absolute left-1 top-[14px] flex h-5 w-5 cursor-grab touch-none items-center justify-center rounded text-foreground/30 transition-colors hover:text-foreground/70 active:cursor-grabbing"
      >
        <LuGripVertical className="h-4 w-4" />
      </button>
    </Reorder.Item>
  );
}
