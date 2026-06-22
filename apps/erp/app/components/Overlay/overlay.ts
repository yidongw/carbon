import type { ConfigTableReferenceContext } from "~/modules/production/configParamsTableColumns";
import { path } from "~/utils/path";
import type { OverlayId } from "./overlay.registry";

export type OverlayTarget = {
  id: OverlayId;
  url: string;
};

export const overlay = {
  to: {
    newJobPickup(
      jobId: string,
      opts?: { jobOperationId?: string }
    ): OverlayTarget {
      const base = path.to.newJobPickup(jobId, opts);
      const sep = base.includes("?") ? "&" : "?";
      return {
        id: "newJobPickup",
        url: `${base}${sep}overlay=true`
      };
    },

    newJobProductionQuantity(
      jobId: string,
      opts?: { jobOperationId?: string }
    ): OverlayTarget {
      const base = path.to.newJobProductionQuantity(jobId, opts);
      const sep = base.includes("?") ? "&" : "?";
      return {
        id: "newJobProductionQuantity",
        url: `${base}${sep}overlay=true`
      };
    },

    editJobProductionQuantity(
      jobId: string,
      quantityId: string
    ): OverlayTarget {
      return {
        id: "editJobProductionQuantity",
        url: `${path.to.jobProductionQuantity(jobId, quantityId)}?overlay=true`
      };
    },

    jobBillOfProcessPreview(jobId: string): OverlayTarget {
      return {
        id: "jobBillOfProcessPreview",
        url: path.to.api.jobBillOfProcessPreview(jobId)
      };
    },

    jobConfigTable(jobId: string): OverlayTarget {
      return {
        id: "jobConfigTable",
        url: path.to.api.jobConfigTable(jobId)
      };
    },

    itemConfigTable(
      itemId: string,
      opts?: {
        configuration?: unknown;
        referenceContext?: ConfigTableReferenceContext;
      }
    ): OverlayTarget {
      const base = path.to.api.itemConfigTable(itemId);
      if (
        opts?.configuration === undefined &&
        opts?.referenceContext === undefined
      ) {
        return { id: "itemConfigTable", url: base };
      }
      const params = new URLSearchParams();
      if (opts?.configuration !== undefined) {
        params.set("configuration", JSON.stringify(opts.configuration));
      }
      if (opts?.referenceContext !== undefined) {
        params.set("referenceContext", JSON.stringify(opts.referenceContext));
      }
      return {
        id: "itemConfigTable",
        url: `${base}?${params.toString()}`
      };
    }
  }
};

/**
 * URL state for overlays.
 *
 * URL-addressable overlays are mirrored on the *current page* URL with two
 * reserved, namespaced search params so they never clObber a page's own params:
 *   `?overlay=<id>&overlayArgs=<urlencoded args>`
 * The pathname is left untouched — opening pushes a history entry, so the
 * browser Back button (or closing) returns to where you were.
 *
 * Only the overlays listed in `urlOverlays` participate; everything else stays
 * imperative-only (e.g. nested config modals shouldn't live in the URL).
 */
export const OVERLAY_PARAM = "overlay";
export const OVERLAY_ARGS_PARAM = "overlayArgs";
export const OVERLAY_URL_PARAMS = [OVERLAY_PARAM, OVERLAY_ARGS_PARAM] as const;

type UrlOverlayDef = {
  /** Pull the args needed to rebuild this overlay out of its loader URL. */
  encode: (loaderUrl: string) => URLSearchParams;
  /** Rebuild the overlay target from previously-encoded args. */
  build: (args: URLSearchParams) => OverlayTarget | null;
};

/** Extract `{ jobId, jobOperationId }` from a `/x/job/{jobId}/.../new?...` URL. */
function jobOverlayArgs(loaderUrl: string): URLSearchParams {
  const [pathname, query = ""] = loaderUrl.split("?");
  const args = new URLSearchParams();
  // pathname: /x/job/{jobId}/... -> ["", "x", "job", jobId, ...]
  const jobId = pathname.split("/")[3];
  if (jobId) args.set("jobId", jobId);
  const jobOperationId = new URLSearchParams(query).get("jobOperationId");
  if (jobOperationId) args.set("jobOperationId", jobOperationId);
  return args;
}

const urlOverlays: Partial<Record<OverlayId, UrlOverlayDef>> = {
  newJobPickup: {
    encode: jobOverlayArgs,
    build: (args) => {
      const jobId = args.get("jobId");
      if (!jobId) return null;
      return overlay.to.newJobPickup(jobId, {
        jobOperationId: args.get("jobOperationId") ?? undefined
      });
    }
  },
  newJobProductionQuantity: {
    encode: jobOverlayArgs,
    build: (args) => {
      const jobId = args.get("jobId");
      if (!jobId) return null;
      return overlay.to.newJobProductionQuantity(jobId, {
        jobOperationId: args.get("jobOperationId") ?? undefined
      });
    }
  }
};

/** Whether an overlay is mirrored in the page URL. */
export function isUrlOverlay(id: OverlayId): boolean {
  return id in urlOverlays;
}

/** Page search params representing an open `target`, or null if not URL-addressable. */
export function overlayToUrlParams(
  target: OverlayTarget
): Record<string, string> | null {
  const def = urlOverlays[target.id];
  if (!def) return null;
  return {
    [OVERLAY_PARAM]: target.id,
    [OVERLAY_ARGS_PARAM]: def.encode(target.url).toString()
  };
}

/** Read an open overlay target from the current page search params, or null. */
export function overlayFromUrlParams(
  params: URLSearchParams
): OverlayTarget | null {
  const id = params.get(OVERLAY_PARAM) as OverlayId | null;
  if (!id) return null;
  const def = urlOverlays[id];
  if (!def) return null;
  return def.build(new URLSearchParams(params.get(OVERLAY_ARGS_PARAM) ?? ""));
}
