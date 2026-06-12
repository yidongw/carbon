import { useEffect, useRef, useState } from "react";
import { useNavigation } from "react-router";

// Driven by React Router's useNavigation() — no external dependency.
// Renders the #nprogress .bar markup reusing styles/nprogress.css.
// Note: useNavigation() only reflects primary navigation, not background
// useFetcher loads, so silent autosaves/optimistic fetchers don't flash it.
export function NavigationProgress() {
  const navigation = useNavigation();
  const active = navigation.state !== "idle";

  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const trickle = useRef<ReturnType<typeof setInterval> | null>(null);
  const hide = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    const clearTrickle = () => {
      if (trickle.current) clearInterval(trickle.current);
      trickle.current = null;
    };

    if (active) {
      if (hide.current) clearTimeout(hide.current);
      if (!startedAt.current) startedAt.current = Date.now();

      setVisible(true);
      setProgress((p) => (p < 12 ? 12 : p));
      clearTrickle();
      trickle.current = setInterval(() => {
        setProgress((p) => (p >= 90 ? p : p + (90 - p) * 0.12));
      }, 180);
    } else {
      clearTrickle();
      const elapsed = startedAt.current ? Date.now() - startedAt.current : 0;
      startedAt.current = null;

      setVisible((wasVisible) => {
        if (!wasVisible) return false;
        setProgress(100);
        // Fast navigations (cache hits) hide without flashing; slow loads still showed the bar.
        const hideDelay = elapsed < 300 ? 0 : 240;
        hide.current = setTimeout(() => {
          setVisible(false);
          setProgress(0);
        }, hideDelay);
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
