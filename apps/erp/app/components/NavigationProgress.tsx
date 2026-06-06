import { useEffect, useRef, useState } from "react";
import { useNavigation } from "react-router";

/**
 * A thin top-of-page progress bar that gives instant feedback the moment a
 * navigation (or form submission) starts, and completes when it settles.
 *
 * Driven entirely by React Router's `useNavigation()` — no external dependency.
 * Renders the `#nprogress .bar` markup so it reuses the existing
 * `styles/nprogress.css` (previously imported but never wired up).
 *
 * Note: `useNavigation()` only reflects the primary navigation, not background
 * `useFetcher` loads, so silent autosaves/optimistic fetchers don't flash it.
 */
export function NavigationProgress() {
  const navigation = useNavigation();
  const active = navigation.state !== "idle";

  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0); // 0..100
  const trickle = useRef<ReturnType<typeof setInterval> | null>(null);
  const hide = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clearTrickle = () => {
      if (trickle.current) clearInterval(trickle.current);
      trickle.current = null;
    };

    if (active) {
      if (hide.current) clearTimeout(hide.current);
      setVisible(true);
      // Jump in immediately, then trickle toward (but never reaching) 90%.
      setProgress((p) => (p < 12 ? 12 : p));
      clearTrickle();
      trickle.current = setInterval(() => {
        setProgress((p) => (p >= 90 ? p : p + (90 - p) * 0.12));
      }, 180);
    } else {
      clearTrickle();
      // Only "complete" if we actually started a bar.
      setVisible((wasVisible) => {
        if (!wasVisible) return false;
        setProgress(100);
        hide.current = setTimeout(() => {
          setVisible(false);
          setProgress(0);
        }, 240);
        return true;
      });
    }

    return clearTrickle;
  }, [active]);

  if (!visible) return null;

  const done = progress >= 100;
  return (
    <div id="nprogress" aria-hidden>
      <div
        className="bar"
        style={{
          transform: `translateX(${progress - 100}%)`,
          opacity: done ? 0 : 1,
          transition: done
            ? "transform 200ms ease, opacity 240ms ease 120ms"
            : "transform 200ms ease"
        }}
      />
    </div>
  );
}

export default NavigationProgress;
