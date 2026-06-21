import { useCallback, useRef, useState } from "react";
import type { TouchEvent } from "react";

const DEFAULT_SWIPE_OPEN_OFFSET = 80;
const SWIPE_COMMIT_RATIO = 0.35;
const SWIPE_AXIS_THRESHOLD = 8;

type UseSwipeRevealOptions = {
  openOffset?: number;
  onOpen?: () => void;
};

export function useSwipeReveal({
  openOffset = DEFAULT_SWIPE_OPEN_OFFSET,
  onOpen
}: UseSwipeRevealOptions = {}) {
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const startOffset = useRef(0);
  const isHorizontalSwipe = useRef(false);
  const didSwipe = useRef(false);

  const close = useCallback(() => {
    setIsDragging(false);
    setOffset(0);
  }, []);

  const onTouchStart = useCallback((event: TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    if (!touch) return;

    touchStart.current = { x: touch.clientX, y: touch.clientY };
    startOffset.current = 0;
    isHorizontalSwipe.current = false;
    didSwipe.current = false;
    setIsDragging(false);
  }, []);

  const onTouchMove = useCallback(
    (event: TouchEvent<HTMLElement>) => {
      const touch = event.touches[0];
      const start = touchStart.current;
      if (!touch || !start) return;

      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;

      if (!isHorizontalSwipe.current) {
        if (
          Math.abs(deltaX) < SWIPE_AXIS_THRESHOLD &&
          Math.abs(deltaY) < SWIPE_AXIS_THRESHOLD
        ) {
          return;
        }

        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          touchStart.current = null;
          return;
        }

        isHorizontalSwipe.current = true;
        setIsDragging(true);
      }

      didSwipe.current = true;
      const nextOffset = Math.max(
        -openOffset,
        Math.min(0, startOffset.current + deltaX)
      );
      setOffset(nextOffset);
    },
    [openOffset]
  );

  const onTouchEnd = useCallback(() => {
    setIsDragging(false);

    if (!isHorizontalSwipe.current) {
      touchStart.current = null;
      return;
    }

    setOffset((current) => {
      if (Math.abs(current) > openOffset * SWIPE_COMMIT_RATIO) {
        onOpen?.();
      }
      return 0;
    });

    touchStart.current = null;
    isHorizontalSwipe.current = false;
  }, [onOpen, openOffset]);

  const onTouchCancel = useCallback(() => {
    touchStart.current = null;
    isHorizontalSwipe.current = false;
    didSwipe.current = false;
    setIsDragging(false);
    setOffset(0);
  }, []);

  return {
    close,
    didSwipe,
    isDragging,
    offset,
    onTouchCancel,
    onTouchEnd,
    onTouchMove,
    onTouchStart
  };
}

export { DEFAULT_SWIPE_OPEN_OFFSET };
