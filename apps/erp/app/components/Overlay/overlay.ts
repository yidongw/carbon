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
 * URL-addressable overlays are mirrored on the *current page* URL as a stack,
 * using one reserved repeated search param so it never clObbers a page's own
 * params. URLSearchParams preserves insertion order, so the values read back
 * bottom -> top. Each value is a `id:<urlencoded args>` token:
 *   `?overlay=newJobProductionQuantity:jobId%3D123&overlay=newJobPickup:jobId%3D123`
 * The pathname is left untouched — opening pushes a history entry, so the
 * browser Back button (or closing) returns to the previous stack state.
 *
 * Only the overlays listed in `urlOverlays` participate; everything else stays
 * imperative-only (e.g. nested config modals shouldn't live in the URL).
 */
export const OVERLAY_PARAM = "overlay";

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

/** Encode one stack entry as `id:<urlencoded args>` (args omitted when empty). */
function encodeOverlayEntry(target: OverlayTarget): string | null {
  const def = urlOverlays[target.id];
  if (!def) return null;
  const args = def.encode(target.url).toString();
  return args ? `${target.id}:${args}` : target.id;
}

/** Decode one `id:<urlencoded args>` token back into a target, or null. */
function decodeOverlayEntry(token: string): OverlayTarget | null {
  const sep = token.indexOf(":");
  const id = (sep === -1 ? token : token.slice(0, sep)) as OverlayId;
  const def = urlOverlays[id];
  if (!def) return null;
  return def.build(new URLSearchParams(sep === -1 ? "" : token.slice(sep + 1)));
}

/** Read the ordered overlay stack (bottom -> top) from the page params. */
export function overlayStackFromParams(
  params: URLSearchParams
): OverlayTarget[] {
  const stack: OverlayTarget[] = [];
  for (const token of params.getAll(OVERLAY_PARAM)) {
    const target = decodeOverlayEntry(token);
    if (target) stack.push(target);
  }
  return stack;
}

/** Page params with `target` pushed onto the overlay stack, or null if not URL-addressable. */
export function paramsWithOverlay(
  params: URLSearchParams,
  target: OverlayTarget
): URLSearchParams | null {
  const token = encodeOverlayEntry(target);
  if (!token) return null;
  const next = new URLSearchParams(params);
  next.append(OVERLAY_PARAM, token);
  return next;
}

/** Page params with the top overlay popped off the stack (other params kept). */
export function paramsWithoutTopOverlay(
  params: URLSearchParams
): URLSearchParams {
  const tokens = params.getAll(OVERLAY_PARAM);
  const next = new URLSearchParams(params);
  next.delete(OVERLAY_PARAM);
  for (const token of tokens.slice(0, -1)) next.append(OVERLAY_PARAM, token);
  return next;
}

/** Page params with the entire overlay stack cleared (other params kept). */
export function paramsWithoutOverlays(
  params: URLSearchParams
): URLSearchParams {
  const next = new URLSearchParams(params);
  next.delete(OVERLAY_PARAM);
  return next;
}
