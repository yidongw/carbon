import type { ConfigTableReferenceContext } from "~/modules/production/configParamsTableColumns";
import { path } from "~/utils/path";
import type { OverlayId } from "./overlay.registry";

export type OverlayTarget = {
  id: OverlayId;
  url: string;
  /**
   * Structured params for URL-addressable overlays, mirrored verbatim into the
   * page URL (e.g. `{ jobId, jobOperationId }`). Carried here so the codec can
   * serialize them directly instead of parsing them back out of `url`.
   */
  params?: Record<string, string>;
};

function jobOverlayParams(
  jobId: string,
  opts?: { jobOperationId?: string }
): Record<string, string> {
  const params: Record<string, string> = { jobId };
  if (opts?.jobOperationId) params.jobOperationId = opts.jobOperationId;
  return params;
}

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
        url: `${base}${sep}overlay=true`,
        params: jobOverlayParams(jobId, opts)
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
        url: `${base}${sep}overlay=true`,
        params: jobOverlayParams(jobId, opts)
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
 * bottom -> top. Each value is a readable `id:key=val,key=val` token (args are
 * comma-separated so no `&` ends up inside a value):
 *   `?overlay=newJobProductionQuantity:jobId=123,jobOperationId=op-1&overlay=newJobPickup:jobId=123`
 * Use `serializeSearch` (not `URLSearchParams.toString`) when navigating so the
 * `: , =` stay un-escaped. The pathname is left untouched — opening pushes a
 * history entry, so Back (or closing) returns to the previous stack state.
 *
 * Only the overlays listed in `urlOverlays` participate; everything else stays
 * imperative-only (e.g. nested config modals shouldn't live in the URL).
 *
 * Note: overlay param values must not themselves contain `,` or `=` (job ids /
 * operation ids are url-safe, so this holds).
 */
export const OVERLAY_PARAM = "overlay";

/**
 * Serialize search params keeping `: , =` human-readable. `URLSearchParams`
 * correctly escapes `& + % #` and spaces; we just un-escape the safe chars so
 * overlay tokens render as `id:key=val,key=val` instead of `%3A…%3D…%2C…`.
 */
export function serializeSearch(params: URLSearchParams): string {
  return params
    .toString()
    .replace(/%3A/gi, ":")
    .replace(/%2C/gi, ",")
    .replace(/%3D/gi, "=");
}

/**
 * Rebuild a URL-addressable overlay from its mirrored params. Only the canonical
 * `overlay.to.*` builders are used, so the route shape lives in one place; the
 * args are read straight from the URL (no parsing of the loader path needed).
 */
const urlOverlays: Partial<
  Record<OverlayId, (params: URLSearchParams) => OverlayTarget | null>
> = {
  newJobPickup: (params) => {
    const jobId = params.get("jobId");
    if (!jobId) return null;
    return overlay.to.newJobPickup(jobId, {
      jobOperationId: params.get("jobOperationId") ?? undefined
    });
  },
  newJobProductionQuantity: (params) => {
    const jobId = params.get("jobId");
    if (!jobId) return null;
    return overlay.to.newJobProductionQuantity(jobId, {
      jobOperationId: params.get("jobOperationId") ?? undefined
    });
  }
};

/** Whether an overlay is mirrored in the page URL. */
export function isUrlOverlay(id: OverlayId): boolean {
  return id in urlOverlays;
}

/** Encode one stack entry as `id:key=val,key=val` (args omitted when empty). */
function encodeOverlayEntry(target: OverlayTarget): string | null {
  if (!isUrlOverlay(target.id)) return null;
  const args = Object.entries(target.params ?? {})
    .map(([key, value]) => `${key}=${value}`)
    .join(",");
  return args ? `${target.id}:${args}` : target.id;
}

/** Decode one `id:key=val,key=val` token back into a target, or null. */
function decodeOverlayEntry(token: string): OverlayTarget | null {
  const sep = token.indexOf(":");
  const id = (sep === -1 ? token : token.slice(0, sep)) as OverlayId;
  const build = urlOverlays[id];
  if (!build) return null;

  const params = new URLSearchParams();
  if (sep !== -1) {
    for (const pair of token.slice(sep + 1).split(",")) {
      const eq = pair.indexOf("=");
      if (eq !== -1) params.set(pair.slice(0, eq), pair.slice(eq + 1));
    }
  }
  return build(params);
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
