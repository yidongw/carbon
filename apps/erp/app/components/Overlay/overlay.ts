import { path } from "~/utils/path";
import { getOverlayRegistryEntry, type OverlayId } from "./overlay.registry";

export type OverlayTarget = {
  id: OverlayId;
  url: string;
  /**
   * Structured params for URL-addressable overlays, mirrored verbatim into the
   * page URL (e.g. `{ jobId, jobOperationId }`). Carried here so the codec can
   * serialize them directly instead of parsing them back out of `url`.
   */
  params?: Record<string, string>;
  /**
   * In-memory data passed straight to the overlay component (surfaced as
   * `ctx.props` in the renderer). Unlike `url`/`params` it never touches the URL
   * — it's for parent-owned data (e.g. a draft `configuration`) the loader can't
   * fetch. Absent when the overlay is restored from a URL alone.
   */
  props?: Record<string, unknown>;
};

/**
 * Build the URL-mirrored params for any overlay, dropping nullish fields so
 * optional args never land in the URL as `key=undefined`. (Same idea as
 * lodash's `pickBy(obj, v => v != null)`.)
 */
function overlayParams(
  params: Record<string, string | undefined>
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value != null)
  ) as Record<string, string>;
}

export const overlay = {
  to: {
    newJobPickup({
      jobId,
      jobOperationId
    }: {
      jobId: string;
      jobOperationId?: string;
    }): OverlayTarget {
      const base = path.to.newJobPickup(jobId, { jobOperationId });
      const sep = base.includes("?") ? "&" : "?";
      return {
        id: "newJobPickup",
        url: `${base}${sep}overlay=true`,
        params: overlayParams({ jobId, jobOperationId })
      };
    },

    newJobProductionQuantity({
      jobId,
      jobOperationId
    }: {
      jobId: string;
      jobOperationId?: string;
    }): OverlayTarget {
      const base = path.to.newJobProductionQuantity(jobId, { jobOperationId });
      const sep = base.includes("?") ? "&" : "?";
      return {
        id: "newJobProductionQuantity",
        url: `${base}${sep}overlay=true`,
        params: overlayParams({ jobId, jobOperationId })
      };
    },

    editJobProductionQuantity({
      jobId,
      quantityId
    }: {
      jobId: string;
      quantityId: string;
    }): OverlayTarget {
      return {
        id: "editJobProductionQuantity",
        url: `${path.to.jobProductionQuantity(jobId, quantityId)}?overlay=true`
      };
    },

    jobBillOfProcessPreview({ jobId }: { jobId: string }): OverlayTarget {
      return {
        id: "jobBillOfProcessPreview",
        url: path.to.api.jobBillOfProcessPreview(jobId)
      };
    },

    jobConfigTable({ jobId }: { jobId: string }): OverlayTarget {
      return {
        id: "jobConfigTable",
        url: path.to.api.jobConfigTable(jobId),
        // url-addressable: fully fetched by jobId, so deep-link restores it.
        params: { jobId }
      };
    },

    // Fetch key is just `itemId` (the loader reads parameters by it). The
    // in-memory `configuration` rides the props channel — never the URL.
    itemConfigTable(
      { itemId }: { itemId: string },
      props?: { configuration?: unknown }
    ): OverlayTarget {
      return {
        id: "itemConfigTable",
        url: path.to.api.itemConfigTable(itemId),
        props:
          props?.configuration !== undefined
            ? { configuration: props.configuration }
            : undefined
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
 * Whether an overlay is mirrored in the page URL — driven by the registry's
 * `urlAddressable` flag (see `overlay.registry.tsx`). Overlays without it stay
 * imperative-only (e.g. config modals, whose params aren't URL-safe). Decode
 * rebuilds a target by running the id's canonical `overlay.to.*` builder.
 */
export function isUrlOverlay(id: OverlayId): boolean {
  return getOverlayRegistryEntry(id)?.urlAddressable === true;
}

/** Encode an overlay as a `id:key=val,key=val` URL token, or null if not URL-addressable. */
export function overlayToken(target: OverlayTarget): string | null {
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
  if (!isUrlOverlay(id)) return null;

  const params: Record<string, string> = {};
  if (sep !== -1) {
    for (const pair of token.slice(sep + 1).split(",")) {
      const eq = pair.indexOf("=");
      if (eq !== -1) params[pair.slice(0, eq)] = pair.slice(eq + 1);
    }
  }
  // The allowlist guarantees this id's builder accepts the mirrored params; the
  // URL boundary is dynamic so `overlay.to[id]` is called as a loose builder.
  const build = overlay.to[id] as (
    params: Record<string, string>
  ) => OverlayTarget;
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

/** Page params carrying exactly `tokens` as the overlay stack (other params kept). */
export function paramsWithOverlayTokens(
  params: URLSearchParams,
  tokens: string[]
): URLSearchParams {
  const next = new URLSearchParams(params);
  next.delete(OVERLAY_PARAM);
  for (const token of tokens) next.append(OVERLAY_PARAM, token);
  return next;
}
