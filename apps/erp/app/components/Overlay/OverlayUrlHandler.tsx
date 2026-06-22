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
    // Note: openOverlay will update the URL to include the overlay param
    // and closeOverlay will remove it when the overlay closes
    openOverlay({ id: overlayId, url });

    hasTriggered.current = true;
  }, [searchParams, openOverlay]);

  return null;
}
