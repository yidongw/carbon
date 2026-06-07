import NProgress from "nprogress";
import { useEffect } from "react";
import { useNavigation } from "react-router";

export function useNProgress() {
  const transition = useNavigation();

  useEffect(() => {
    try {
      if (
        (transition.state === "loading" || transition.state === "submitting") &&
        !NProgress.isStarted()
      ) {
        NProgress.start();
      } else if (NProgress.isStarted()) {
        NProgress.done();
      }
    } catch {
      // NProgress DOM manipulation can fail transiently; ignore to avoid crashing the app
    }
  }, [transition.state]);
}
