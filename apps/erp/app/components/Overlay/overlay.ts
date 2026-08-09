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
   * — it's for parent-owned data (e.g. a draft `variantQuantities`) the loader can't
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

    newEmployee(): OverlayTarget {
      return {
        id: "newEmployee",
        url: `${path.to.newEmployee}?overlay=true`,
        params: {}
      };
    },

    editInvite({ userId }: { userId: string }): OverlayTarget {
      return {
        id: "editInvite",
        url: `${path.to.editInvite(userId)}?overlay=true`,
        params: { userId }
      };
    },

    newItemAttribute(): OverlayTarget {
      return {
        id: "newItemAttribute",
        url: `${path.to.newItemAttribute}?overlay=true`,
        params: {}
      };
    },

    editItemAttribute({ id }: { id: string }): OverlayTarget {
      return {
        id: "editItemAttribute",
        url: `${path.to.itemAttribute(id)}?overlay=true`,
        params: { id }
      };
    },

    newItemAttributeValue({
      attributeId
    }: {
      attributeId: string;
    }): OverlayTarget {
      return {
        id: "newItemAttributeValue",
        url: `${path.to.newItemAttributeValue(attributeId)}?overlay=true`,
        params: { attributeId }
      };
    },

    editItemAttributeValue({
      attributeId,
      id
    }: {
      attributeId: string;
      id: string;
    }): OverlayTarget {
      return {
        id: "editItemAttributeValue",
        url: `${path.to.itemAttributeValue(attributeId, id)}?overlay=true`,
        params: { attributeId, id }
      };
    },

    newItemAttributeSet(): OverlayTarget {
      return {
        id: "newItemAttributeSet",
        url: `${path.to.newItemAttributeSet}?overlay=true`,
        params: {}
      };
    },

    editItemAttributeSet({ id }: { id: string }): OverlayTarget {
      return {
        id: "editItemAttributeSet",
        url: `${path.to.itemAttributeSet(id)}?overlay=true`,
        params: { id }
      };
    },

    newItemAttributeSetAssignment(): OverlayTarget {
      return {
        id: "newItemAttributeSetAssignment",
        url: `${path.to.newItemAttributeSetAssignment}?overlay=true`,
        params: {}
      };
    },

    editItemAttributeSetAssignment({ id }: { id: string }): OverlayTarget {
      return {
        id: "editItemAttributeSetAssignment",
        url: `${path.to.itemAttributeSetAssignment(id)}?overlay=true`,
        params: { id }
      };
    },

    newMasterWorkOrder(): OverlayTarget {
      return {
        id: "newMasterWorkOrder",
        url: `${path.to.newMasterWorkOrder}?overlay=true`,
        params: {}
      };
    },

    newSalesOrderLine({ orderId }: { orderId: string }): OverlayTarget {
      return {
        id: "newSalesOrderLine",
        url: `${path.to.newSalesOrderLine(orderId)}?overlay=true`,
        params: { orderId }
      };
    },

    newTransfer(mode: "stock" | "warehouse" = "warehouse"): OverlayTarget {
      return {
        id: "newTransfer",
        url: `${path.to.newTransfer}?overlay=true&mode=${mode}`,
        params: { mode }
      };
    },

    newPurchaseOrderLine({ orderId }: { orderId: string }): OverlayTarget {
      return {
        id: "newPurchaseOrderLine",
        url: `${path.to.newPurchaseOrderLine(orderId)}?overlay=true`,
        params: { orderId }
      };
    },

    newStyleSample({ styleId }: { styleId: string }): OverlayTarget {
      return {
        id: "newStyleSample",
        url: `${path.to.newStyleSample(styleId)}?overlay=true`,
        params: overlayParams({ styleId })
      };
    },

    newProductionQuantity({
      jobId,
      jobOperationId,
      lockOperation
    }: {
      jobId?: string;
      jobOperationId?: string;
      // Lock the job + operation selects to the seeded values (e.g. a Master
      // Work Order can only report its cutting operation).
      lockOperation?: boolean;
    } = {}): OverlayTarget {
      const query = new URLSearchParams();
      query.set("overlay", "true");
      if (jobId) query.set("jobId", jobId);
      if (jobOperationId) query.set("jobOperationId", jobOperationId);
      if (lockOperation) query.set("lockOperation", "true");
      return {
        id: "newProductionQuantity",
        url: `${path.to.newProductionQuantity}?${query.toString()}`,
        params: overlayParams({
          jobId,
          jobOperationId,
          lockOperation: lockOperation ? "true" : undefined
        })
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
        url: `${path.to.jobProductionQuantity(jobId, quantityId)}?overlay=true`,
        params: { jobId, quantityId }
      };
    },

    // `table` rides the URL (restorable on deep link); `name` is a seed for the
    // form's input and rides the in-memory props channel (tag names may contain
    // `,`/`=`, which the URL token codec can't carry).
    newTag(
      { table }: { table?: string } = {},
      props?: { name?: string }
    ): OverlayTarget {
      const query = new URLSearchParams();
      query.set("overlay", "true");
      if (table) query.set("table", table);
      return {
        id: "newTag",
        url: `${path.to.newTag}?${query.toString()}`,
        params: overlayParams({ table }),
        props: props?.name ? { name: props.name } : undefined
      };
    },

    jobBillOfProcessPreview({ jobId }: { jobId: string }): OverlayTarget {
      return {
        id: "jobBillOfProcessPreview",
        url: path.to.api.jobBillOfProcessPreview(jobId),
        params: { jobId }
      };
    },

    jobVariantsQuantity({ jobId }: { jobId: string }): OverlayTarget {
      return {
        id: "jobVariantsQuantity",
        url: path.to.api.jobVariantsQuantity(jobId),
        params: { jobId }
      };
    },

    masterWorkOrderBundles({
      masterWorkOrderId
    }: {
      masterWorkOrderId: string;
    }): OverlayTarget {
      return {
        id: "masterWorkOrderBundles",
        url: path.to.api.masterWorkOrderBundles(masterWorkOrderId),
        params: { masterWorkOrderId }
      };
    },

    masterWorkOrderProcesses({
      masterWorkOrderId
    }: {
      masterWorkOrderId: string;
    }): OverlayTarget {
      return {
        id: "masterWorkOrderProcesses",
        url: path.to.api.masterWorkOrderProcesses(masterWorkOrderId),
        params: { masterWorkOrderId }
      };
    },

    bundleWorkOrderProcesses({
      bundleWorkOrderId
    }: {
      bundleWorkOrderId: string;
    }): OverlayTarget {
      return {
        id: "bundleWorkOrderProcesses",
        url: path.to.api.bundleWorkOrderProcesses(bundleWorkOrderId),
        params: { bundleWorkOrderId }
      };
    },

    masterWorkOrderSplitBatch({
      masterWorkOrderId
    }: {
      masterWorkOrderId: string;
    }): OverlayTarget {
      return {
        id: "masterWorkOrderSplitBatch",
        url: path.to.api.masterWorkOrderSplitBatch(masterWorkOrderId),
        params: { masterWorkOrderId }
      };
    },

    // Read-only view of a reported row's saved variant quantities. In-app the
    // `variantQuantities` ride the props channel; `recordId`/`reportKind` are the
    // fetch keys so a deep link can restore it server-side (route loader).
    itemVariantsQuantity(
      {
        itemId,
        recordId,
        reportKind
      }: {
        itemId: string;
        recordId?: string;
        reportKind?: "pickup" | "productionQuantity";
      },
      props?: { variantQuantities?: unknown }
    ): OverlayTarget {
      const base = path.to.api.itemVariantsQuantity(itemId);
      const query = new URLSearchParams();
      if (recordId) query.set("recordId", recordId);
      if (reportKind) query.set("reportKind", reportKind);
      const qs = query.toString();
      return {
        id: "itemVariantsQuantity",
        url: qs ? `${base}?${qs}` : base,
        params: overlayParams({ itemId, recordId, reportKind }),
        props:
          props?.variantQuantities !== undefined
            ? { variantQuantities: props.variantQuantities }
            : undefined
      };
    }
  }
};

/**
 * Build an {@link OverlayTarget} from an overlay id + params, e.g. a `nextOverlay`
 * signal an action returns so the host can chain a follow-up overlay generically.
 * Returns null for an unknown id or if the builder rejects the params.
 */
export function buildOverlayTarget(
  id: string,
  params?: Record<string, unknown>
): OverlayTarget | null {
  const builder = (
    overlay.to as Record<string, (args?: unknown) => OverlayTarget>
  )[id];
  if (!builder) return null;
  try {
    return builder(params ?? {});
  } catch {
    return null;
  }
}

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
 * Every registered overlay participates (see `isUrlOverlay`); each restores
 * from its token via its `overlay.to.*` builder + a server-fetched fallback.
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
 * Whether an overlay is mirrored in the page URL — true for every registered
 * overlay. Each overlay is fully restorable from its token: `overlay.to.*`
 * builders carry their fetch keys as `params`, and any in-memory data passed via
 * props has a server-fetched fallback keyed by those params (e.g.
 * `itemVariantsQuantity`). Decode rebuilds a target by running the id's canonical
 * builder, so the only real guard here is that the token's id is registered.
 */
export function isUrlOverlay(id: OverlayId): boolean {
  return getOverlayRegistryEntry(id) != null;
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
