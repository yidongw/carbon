import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import type { OverlayId } from "./overlay.registry";
import { useOverlay } from "./OverlayProvider";

/**
 * Detects overlay parameters in the URL and automatically opens the corresponding overlay.
 *
 * URL format: ?overlay={overlayId}&... (additional params passed to overlay)
 *
 * Example: /x/job/123/details?overlay=newJobPickup&jobOperationId=456
 */
export function OverlayUrlHandler() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { openOverlay } = useOverlay();
  const hasTriggered = useRef(false);

  useEffect(() => {
    // Only trigger once per page load
    if (hasTriggered.current) return;

    const overlayId = searchParams.get("overlay") as OverlayId | null;
    if (!overlayId) return;

    // Construct the overlay URL with all current search params
    const url = `${window.location.pathname}${window.location.search}`;

    // Open the overlay
    openOverlay(
      { id: overlayId, url },
      {
        onSuccess: () => {
          // Optionally clean up URL params after overlay closes
        }
      }
    );

    // Remove overlay param from URL to prevent re-triggering on refresh
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("overlay");

    // Clean up the URL without page reload
    window.history.replaceState(
      {},
      "",
      newParams.toString()
        ? `${window.location.pathname}?${newParams.toString()}`
        : window.location.pathname
    );

    hasTriggered.current = true;
  }, [searchParams, openOverlay, setSearchParams]);

  return null;
}
