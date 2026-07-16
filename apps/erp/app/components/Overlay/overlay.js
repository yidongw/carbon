"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OVERLAY_PARAM = exports.overlay = void 0;
exports.serializeSearch = serializeSearch;
exports.isUrlOverlay = isUrlOverlay;
exports.overlayToken = overlayToken;
exports.overlayStackFromParams = overlayStackFromParams;
exports.paramsWithOverlayTokens = paramsWithOverlayTokens;
var path_1 = require("~/utils/path");
var overlay_registry_1 = require("./overlay.registry");
/**
 * Build the URL-mirrored params for any overlay, dropping nullish fields so
 * optional args never land in the URL as `key=undefined`. (Same idea as
 * lodash's `pickBy(obj, v => v != null)`.)
 */
function overlayParams(params) {
    return Object.fromEntries(Object.entries(params).filter(function (_a) {
        var value = _a[1];
        return value != null;
    }));
}
exports.overlay = {
    to: {
        newJobProductionQuantity: function (_a) {
            var jobId = _a.jobId, jobOperationId = _a.jobOperationId;
            var base = path_1.path.to.newJobProductionQuantity(jobId, { jobOperationId: jobOperationId });
            var sep = base.includes("?") ? "&" : "?";
            return {
                id: "newJobProductionQuantity",
                url: "".concat(base).concat(sep, "overlay=true"),
                params: overlayParams({ jobId: jobId, jobOperationId: jobOperationId })
            };
        },
        newMasterWorkOrder: function () {
            return {
                id: "newMasterWorkOrder",
                url: "".concat(path_1.path.to.newMasterWorkOrder, "?overlay=true"),
                params: {}
            };
        },
        newProductionQuantity: function (_a) {
            var _b = _a === void 0 ? {} : _a, jobId = _b.jobId, jobOperationId = _b.jobOperationId, lockOperation = _b.lockOperation;
            var query = new URLSearchParams();
            query.set("overlay", "true");
            if (jobId)
                query.set("jobId", jobId);
            if (jobOperationId)
                query.set("jobOperationId", jobOperationId);
            if (lockOperation)
                query.set("lockOperation", "true");
            return {
                id: "newProductionQuantity",
                url: "".concat(path_1.path.to.newProductionQuantity, "?").concat(query.toString()),
                params: overlayParams({
                    jobId: jobId,
                    jobOperationId: jobOperationId,
                    lockOperation: lockOperation ? "true" : undefined
                })
            };
        },
        editJobProductionQuantity: function (_a) {
            var jobId = _a.jobId, quantityId = _a.quantityId;
            return {
                id: "editJobProductionQuantity",
                url: "".concat(path_1.path.to.jobProductionQuantity(jobId, quantityId), "?overlay=true"),
                params: { jobId: jobId, quantityId: quantityId }
            };
        },
        // `table` rides the URL (restorable on deep link); `name` is a seed for the
        // form's input and rides the in-memory props channel (tag names may contain
        // `,`/`=`, which the URL token codec can't carry).
        newTag: function (_a, props) {
            var _b = _a === void 0 ? {} : _a, table = _b.table;
            var query = new URLSearchParams();
            query.set("overlay", "true");
            if (table)
                query.set("table", table);
            return {
                id: "newTag",
                url: "".concat(path_1.path.to.newTag, "?").concat(query.toString()),
                params: overlayParams({ table: table }),
                props: (props === null || props === void 0 ? void 0 : props.name) ? { name: props.name } : undefined
            };
        },
        jobBillOfProcessPreview: function (_a) {
            var jobId = _a.jobId;
            return {
                id: "jobBillOfProcessPreview",
                url: path_1.path.to.api.jobBillOfProcessPreview(jobId),
                params: { jobId: jobId }
            };
        },
        jobConfigTable: function (_a) {
            var jobId = _a.jobId;
            return {
                id: "jobConfigTable",
                url: path_1.path.to.api.jobConfigTable(jobId),
                params: { jobId: jobId }
            };
        },
        masterWorkOrderBundles: function (_a) {
            var masterWorkOrderId = _a.masterWorkOrderId;
            return {
                id: "masterWorkOrderBundles",
                url: path_1.path.to.api.masterWorkOrderBundles(masterWorkOrderId),
                params: { masterWorkOrderId: masterWorkOrderId }
            };
        },
        masterWorkOrderProcesses: function (_a) {
            var masterWorkOrderId = _a.masterWorkOrderId;
            return {
                id: "masterWorkOrderProcesses",
                url: path_1.path.to.api.masterWorkOrderProcesses(masterWorkOrderId),
                params: { masterWorkOrderId: masterWorkOrderId }
            };
        },
        bundleWorkOrderProcesses: function (_a) {
            var bundleWorkOrderId = _a.bundleWorkOrderId;
            return {
                id: "bundleWorkOrderProcesses",
                url: path_1.path.to.api.bundleWorkOrderProcesses(bundleWorkOrderId),
                params: { bundleWorkOrderId: bundleWorkOrderId }
            };
        },
        masterWorkOrderSplitBatch: function (_a) {
            var masterWorkOrderId = _a.masterWorkOrderId;
            return {
                id: "masterWorkOrderSplitBatch",
                url: path_1.path.to.api.masterWorkOrderSplitBatch(masterWorkOrderId),
                params: { masterWorkOrderId: masterWorkOrderId }
            };
        },
        // Read-only view of a reported row's saved config. In-app the
        // `configuration` rides the props channel; `recordId`/`reportKind` are the
        // fetch keys so a deep link can restore it server-side (route loader).
        itemConfigTable: function (_a, props) {
            var itemId = _a.itemId, recordId = _a.recordId, reportKind = _a.reportKind;
            var base = path_1.path.to.api.itemConfigTable(itemId);
            var query = new URLSearchParams();
            if (recordId)
                query.set("recordId", recordId);
            if (reportKind)
                query.set("reportKind", reportKind);
            var qs = query.toString();
            return {
                id: "itemConfigTable",
                url: qs ? "".concat(base, "?").concat(qs) : base,
                params: overlayParams({ itemId: itemId, recordId: recordId, reportKind: reportKind }),
                props: (props === null || props === void 0 ? void 0 : props.configuration) !== undefined
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
 * Every registered overlay participates (see `isUrlOverlay`); each restores
 * from its token via its `overlay.to.*` builder + a server-fetched fallback.
 *
 * Note: overlay param values must not themselves contain `,` or `=` (job ids /
 * operation ids are url-safe, so this holds).
 */
exports.OVERLAY_PARAM = "overlay";
/**
 * Serialize search params keeping `: , =` human-readable. `URLSearchParams`
 * correctly escapes `& + % #` and spaces; we just un-escape the safe chars so
 * overlay tokens render as `id:key=val,key=val` instead of `%3A…%3D…%2C…`.
 */
function serializeSearch(params) {
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
 * `itemConfigTable`). Decode rebuilds a target by running the id's canonical
 * builder, so the only real guard here is that the token's id is registered.
 */
function isUrlOverlay(id) {
    return (0, overlay_registry_1.getOverlayRegistryEntry)(id) != null;
}
/** Encode an overlay as a `id:key=val,key=val` URL token, or null if not URL-addressable. */
function overlayToken(target) {
    var _a;
    if (!isUrlOverlay(target.id))
        return null;
    var args = Object.entries((_a = target.params) !== null && _a !== void 0 ? _a : {})
        .map(function (_a) {
        var key = _a[0], value = _a[1];
        return "".concat(key, "=").concat(value);
    })
        .join(",");
    return args ? "".concat(target.id, ":").concat(args) : target.id;
}
/** Decode one `id:key=val,key=val` token back into a target, or null. */
function decodeOverlayEntry(token) {
    var sep = token.indexOf(":");
    var id = (sep === -1 ? token : token.slice(0, sep));
    if (!isUrlOverlay(id))
        return null;
    var params = {};
    if (sep !== -1) {
        for (var _i = 0, _a = token.slice(sep + 1).split(","); _i < _a.length; _i++) {
            var pair = _a[_i];
            var eq = pair.indexOf("=");
            if (eq !== -1)
                params[pair.slice(0, eq)] = pair.slice(eq + 1);
        }
    }
    // The allowlist guarantees this id's builder accepts the mirrored params; the
    // URL boundary is dynamic so `overlay.to[id]` is called as a loose builder.
    var build = exports.overlay.to[id];
    return build(params);
}
/** Read the ordered overlay stack (bottom -> top) from the page params. */
function overlayStackFromParams(params) {
    var stack = [];
    for (var _i = 0, _a = params.getAll(exports.OVERLAY_PARAM); _i < _a.length; _i++) {
        var token = _a[_i];
        var target = decodeOverlayEntry(token);
        if (target)
            stack.push(target);
    }
    return stack;
}
/** Page params carrying exactly `tokens` as the overlay stack (other params kept). */
function paramsWithOverlayTokens(params, tokens) {
    var next = new URLSearchParams(params);
    next.delete(exports.OVERLAY_PARAM);
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        next.append(exports.OVERLAY_PARAM, token);
    }
    return next;
}
