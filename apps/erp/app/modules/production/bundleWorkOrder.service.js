"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBundleWorkOrders = getBundleWorkOrders;
exports.getBundleWorkOrdersList = getBundleWorkOrdersList;
exports.getBundleWorkOrder = getBundleWorkOrder;
exports.getBundleProcessReports = getBundleProcessReports;
exports.insertBundleWorkOrder = insertBundleWorkOrder;
exports.getCuttingSplitProposal = getCuttingSplitProposal;
exports.saveBundleSplit = saveBundleSplit;
exports.replaceMasterCuttingSplitRows = replaceMasterCuttingSplitRows;
exports.recordBundleProductionReport = recordBundleProductionReport;
var styleMethod_service_1 = require("~/modules/items/styleMethod.service");
var query_1 = require("~/utils/query");
var masterWorkOrder_service_1 = require("./masterWorkOrder.service");
var production_service_1 = require("./production.service");
/** Drop the `<prefix>_` from an internal id (e.g. `mwo_RWARP…` -> `RWARP…`). */
function stripIdPrefix(id) {
    var underscore = id.indexOf("_");
    return underscore >= 0 ? id.slice(underscore + 1) : id;
}
/**
 * The shortest prefix of `id` (after its `<prefix>_`) that no id in `others`
 * shares — starting at 4 chars and growing by one on each collision. Used to
 * disambiguate a bundle's descriptive id across masters.
 */
function shortestDistinctIdPrefix(id, others) {
    var sid = stripIdPrefix(id);
    var otherSids = others.map(stripIdPrefix);
    var length = 4;
    while (length < sid.length &&
        otherSids.some(function (other) { return other.slice(0, length) === sid.slice(0, length); })) {
        length++;
    }
    return sid.slice(0, length);
}
/** All bundle work orders belonging to a master work order (ordered by sequence). */
function getBundleWorkOrders(client, masterWorkOrderId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("bundleWorkOrders")
                    .select("*")
                    .eq("masterWorkOrderId", masterWorkOrderId)
                    .eq("companyId", companyId)
                    .order("sequence", { ascending: true })];
        });
    });
}
/**
 * Paginated list of bundle work orders. Company-wide for the list page, or
 * scoped to a single master via `masterWorkOrderId` (the Master WO detail tab).
 */
function getBundleWorkOrdersList(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("bundleWorkOrders")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.masterWorkOrderId) {
                query = query.eq("masterWorkOrderId", args.masterWorkOrderId);
            }
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.or("itemName.ilike.%".concat(args.search, "%,colorCode.ilike.%").concat(args.search, "%,jobReadableId.ilike.%").concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "createdAt", ascending: false }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getBundleWorkOrder(client, id, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("bundleWorkOrders")
                    .select("*")
                    .eq("id", id)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
/**
 * Process reports (Production / Rework / Scrap) filed against a bundle's backing
 * job, across all of its operations. Reuses the existing `productionQuantity`
 * data (a "process report" line), filtered by job via the operation join.
 */
function getBundleProcessReports(client, jobId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("productionQuantity")
                    .select("id, quantity, type, createdAt, jobOperation!inner(description, jobId), scrapReason(name)")
                    .eq("jobOperation.jobId", jobId)
                    .eq("companyId", companyId)
                    .is("invalidatedAt", null)
                    .order("createdAt", { ascending: false })];
        });
    });
}
/**
 * Create a bundle work order under a master. A child job (parentJobId = the
 * master's backing job) is created through `insertJob` for downstream execution,
 * then wrapped by the bundle work order carrying the color/size identity.
 */
function insertBundleWorkOrder(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var job, bundleOps, cuttingIds;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, production_service_1.insertJob)(client, {
                        itemId: input.itemId,
                        quantity: input.quantity,
                        companyId: input.companyId,
                        createdBy: input.createdBy,
                        // Give the backing job the bundle's descriptive readable id (NE-BK-2XL-07)
                        // instead of an auto J-number, so the bundle's job id *is* that label.
                        jobId: input.jobReadableId,
                        // Bundles are cut from an already-released master and go straight to the
                        // floor — skip the Draft stage and create them released (Ready). This also
                        // lets the production-event trigger auto-advance them to In Progress.
                        status: "Ready"
                    })];
                case 1:
                    job = _e.sent();
                    if (job.error || !job.data) {
                        return [2 /*return*/, { data: null, error: job.error }];
                    }
                    return [4 /*yield*/, client
                            .from("jobOperation")
                            .select("id, processId, order, tags, customFields")
                            .eq("jobId", job.data.id)
                            .eq("companyId", input.companyId)];
                case 2:
                    bundleOps = _e.sent();
                    if (!(bundleOps.data && bundleOps.data.length > 0)) return [3 /*break*/, 4];
                    cuttingIds = (0, styleMethod_service_1.getBundleJobCuttingOperationIdsToDelete)({
                        operations: bundleOps.data,
                        cuttingProcessId: (_a = input.cuttingProcessId) !== null && _a !== void 0 ? _a : null
                    });
                    if (!(cuttingIds.length > 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, client
                            .from("jobOperation")
                            .delete()
                            .in("id", cuttingIds)
                            .eq("companyId", input.companyId)];
                case 3:
                    _e.sent();
                    _e.label = 4;
                case 4: return [2 /*return*/, client
                        .from("bundleWorkOrder")
                        .insert({
                        masterWorkOrderId: input.masterWorkOrderId,
                        jobId: job.data.id,
                        sequence: (_b = input.sequence) !== null && _b !== void 0 ? _b : 1,
                        colorCode: (_c = input.colorCode) !== null && _c !== void 0 ? _c : null,
                        sizeCode: (_d = input.sizeCode) !== null && _d !== void 0 ? _d : null,
                        companyId: input.companyId,
                        createdBy: input.createdBy
                    })
                        .select("id, jobId")
                        .single()];
            }
        });
    });
}
/**
 * Turn one reported cutting config table into individual color/size cells —
 * one cell (→ one bundle) per (primary option × row) with quantity > 0.
 *
 * The config table is a matrix: the primary list param's options are the
 * quantity columns (`configTablePrimaryKeys`), the other list param is a
 * descriptor column on each row. We identify which param is primary by
 * matching the quantity-column keys against each param's list options, so the
 * color/size mapping is correct regardless of parameter order.
 */
function extractCuttingCells(configuration, colorParam, sizeParam) {
    var _a;
    var _b, _c, _d, _e;
    var cfg = (configuration !== null && configuration !== void 0 ? configuration : null);
    var table = cfg === null || cfg === void 0 ? void 0 : cfg.configTable;
    var primaryKeys = (_b = cfg === null || cfg === void 0 ? void 0 : cfg.configTablePrimaryKeys) !== null && _b !== void 0 ? _b : [];
    if (!Array.isArray(table) || primaryKeys.length === 0)
        return [];
    var sizeOptions = new Set((_c = sizeParam === null || sizeParam === void 0 ? void 0 : sizeParam.listOptions) !== null && _c !== void 0 ? _c : []);
    // Primary = the param whose options are the quantity columns; otherwise the
    // primary column is treated as color (the `else` branch below).
    var sizeIsPrimary = sizeOptions.size > 0 && primaryKeys.every(function (k) { return sizeOptions.has(k); });
    var cells = [];
    for (var _i = 0, table_1 = table; _i < table_1.length; _i++) {
        var row = table_1[_i];
        // Descriptor columns = everything that isn't a quantity column.
        var descriptors = Object.fromEntries(Object.entries(row).filter(function (_a) {
            var k = _a[0];
            return !primaryKeys.includes(k);
        }));
        for (var _f = 0, primaryKeys_1 = primaryKeys; _f < primaryKeys_1.length; _f++) {
            var key = primaryKeys_1[_f];
            var quantity = Number(row[key]) || 0;
            if (quantity <= 0)
                continue;
            var colorCode = void 0;
            var sizeCode = void 0;
            if (sizeIsPrimary) {
                sizeCode = key;
                colorCode = colorParam
                    ? (String((_d = row[colorParam.key]) !== null && _d !== void 0 ? _d : "") || null)
                    : null;
            }
            else {
                colorCode = key;
                sizeCode = sizeParam
                    ? (String((_e = row[sizeParam.key]) !== null && _e !== void 0 ? _e : "") || null)
                    : null;
            }
            cells.push({
                colorCode: colorCode,
                sizeCode: sizeCode,
                quantity: quantity,
                // The bundle carries a single-cell config table for its own reporting.
                configuration: {
                    configTable: [__assign(__assign({}, descriptors), (_a = {}, _a[key] = quantity, _a))],
                    configTablePrimaryKeys: [key]
                }
            });
        }
    }
    return cells;
}
function cellKey(colorCode, sizeCode) {
    return "".concat(colorCode !== null && colorCode !== void 0 ? colorCode : "", "|").concat(sizeCode !== null && sizeCode !== void 0 ? sizeCode : "");
}
/**
 * The proposed bundle split for a Master Work Order, as a color/size matrix
 * matching the master's config-param plan. Each configured cell carries a
 * suggested quantity and a cap of (reported cut − already bundled), so the split
 * can't create more than was actually cut for any color/size.
 */
function getCuttingSplitProposal(client, masterWorkOrderId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var empty, master, jobId, job, masterDisplayId, itemId, params, colorParam, sizeParam, plannedCells, cuttingOperationId, cutByCell, cuts, _i, _a, row, _b, _c, cell, k, existing, styleColors, colorNameByCode, _d, _e, c, colorName, existingBundles, cells, colorPresent, sizePresent, _f, plannedCells_1, cell, k, cut, orderAxis, pending, splitRows;
        var _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
        return __generator(this, function (_y) {
            switch (_y.label) {
                case 0:
                    empty = {
                        masterDisplayId: null,
                        colorAxis: [],
                        sizeAxis: [],
                        cells: [],
                        existingBundles: [],
                        splitRows: []
                    };
                    return [4 /*yield*/, client
                            .from("masterWorkOrder")
                            .select("id, jobId")
                            .eq("id", masterWorkOrderId)
                            .eq("companyId", companyId)
                            .maybeSingle()];
                case 1:
                    master = _y.sent();
                    if (master.error || !((_g = master.data) === null || _g === void 0 ? void 0 : _g.jobId))
                        return [2 /*return*/, empty];
                    jobId = master.data.jobId;
                    return [4 /*yield*/, client
                            .from("job")
                            .select("jobId, itemId, configuration")
                            .eq("id", jobId)
                            .eq("companyId", companyId)
                            .single()];
                case 2:
                    job = _y.sent();
                    masterDisplayId = (_j = (_h = job.data) === null || _h === void 0 ? void 0 : _h.jobId) !== null && _j !== void 0 ? _j : null;
                    itemId = (_k = job.data) === null || _k === void 0 ? void 0 : _k.itemId;
                    if (!itemId)
                        return [2 /*return*/, __assign(__assign({}, empty), { masterDisplayId: masterDisplayId })];
                    return [4 /*yield*/, client
                            .from("configurationParameter")
                            .select("key, listOptions")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .in("key", ["color", "size"])];
                case 3:
                    params = _y.sent();
                    colorParam = (_l = params.data) === null || _l === void 0 ? void 0 : _l.find(function (p) { return p.key === "color"; });
                    sizeParam = (_m = params.data) === null || _m === void 0 ? void 0 : _m.find(function (p) { return p.key === "size"; });
                    plannedCells = extractCuttingCells((_o = job.data) === null || _o === void 0 ? void 0 : _o.configuration, colorParam, sizeParam);
                    return [4 /*yield*/, (0, masterWorkOrder_service_1.getMasterCuttingOperationId)(client, jobId, companyId)];
                case 4:
                    cuttingOperationId = _y.sent();
                    cutByCell = new Map();
                    if (!cuttingOperationId) return [3 /*break*/, 6];
                    return [4 /*yield*/, client
                            .from("productionQuantity")
                            .select("configuration")
                            .eq("jobOperationId", cuttingOperationId)
                            .eq("companyId", companyId)
                            .eq("type", "Production")
                            .is("invalidatedAt", null)];
                case 5:
                    cuts = _y.sent();
                    for (_i = 0, _a = (_p = cuts.data) !== null && _p !== void 0 ? _p : []; _i < _a.length; _i++) {
                        row = _a[_i];
                        for (_b = 0, _c = extractCuttingCells(row.configuration, colorParam, sizeParam); _b < _c.length; _b++) {
                            cell = _c[_b];
                            k = cellKey(cell.colorCode, cell.sizeCode);
                            cutByCell.set(k, ((_q = cutByCell.get(k)) !== null && _q !== void 0 ? _q : 0) + cell.quantity);
                        }
                    }
                    _y.label = 6;
                case 6: return [4 /*yield*/, getBundleWorkOrders(client, masterWorkOrderId, companyId)];
                case 7:
                    existing = _y.sent();
                    return [4 /*yield*/, client
                            .from("styleColor")
                            .select("colorCode, colorName")
                            .eq("companyId", companyId)];
                case 8:
                    styleColors = _y.sent();
                    colorNameByCode = new Map();
                    for (_d = 0, _e = (_r = styleColors.data) !== null && _r !== void 0 ? _r : []; _d < _e.length; _d++) {
                        c = _e[_d];
                        if (c.colorCode)
                            colorNameByCode.set(c.colorCode, (_s = c.colorName) !== null && _s !== void 0 ? _s : c.colorCode);
                    }
                    colorName = function (code) { var _a; return code ? ((_a = colorNameByCode.get(code)) !== null && _a !== void 0 ? _a : code) : null; };
                    existingBundles = ((_t = existing.data) !== null && _t !== void 0 ? _t : []).map(function (b) {
                        var _a, _b, _c, _d, _e, _f, _g;
                        return ({
                            id: (_a = b.id) !== null && _a !== void 0 ? _a : "",
                            jobReadableId: (_b = b.jobReadableId) !== null && _b !== void 0 ? _b : "",
                            colorCode: (_c = b.colorCode) !== null && _c !== void 0 ? _c : null,
                            colorName: colorName((_d = b.colorCode) !== null && _d !== void 0 ? _d : null),
                            sizeCode: (_e = b.sizeCode) !== null && _e !== void 0 ? _e : null,
                            quantity: (_f = b.quantity) !== null && _f !== void 0 ? _f : 0,
                            reportedQuantity: (_g = b.reportedQuantity) !== null && _g !== void 0 ? _g : 0
                        });
                    });
                    cells = [];
                    colorPresent = new Set();
                    sizePresent = new Set();
                    for (_f = 0, plannedCells_1 = plannedCells; _f < plannedCells_1.length; _f++) {
                        cell = plannedCells_1[_f];
                        k = cellKey(cell.colorCode, cell.sizeCode);
                        cut = (_u = cutByCell.get(k)) !== null && _u !== void 0 ? _u : 0;
                        if (cut <= 0)
                            continue;
                        cells.push({
                            colorCode: cell.colorCode,
                            colorName: colorName(cell.colorCode),
                            sizeCode: cell.sizeCode,
                            cut: cut
                        });
                        if (cell.colorCode)
                            colorPresent.add(cell.colorCode);
                        if (cell.sizeCode)
                            sizePresent.add(cell.sizeCode);
                    }
                    orderAxis = function (present, options) {
                        return options && options.length > 0
                            ? options.filter(function (o) { return present.has(o); })
                            : __spreadArray([], present, true);
                    };
                    return [4 /*yield*/, client
                            .from("masterWorkOrderSplitRow")
                            .select("id, colorCode, sizeCode, quantity")
                            .eq("masterWorkOrderId", masterWorkOrderId)
                            .eq("companyId", companyId)
                            .is("bundleWorkOrderId", null)
                            .order("createdAt", { ascending: true })];
                case 9:
                    pending = _y.sent();
                    splitRows = ((_v = pending.data) !== null && _v !== void 0 ? _v : []).map(function (r) {
                        var _a, _b, _c, _d;
                        return ({
                            id: r.id,
                            colorCode: (_a = r.colorCode) !== null && _a !== void 0 ? _a : null,
                            colorName: colorName((_b = r.colorCode) !== null && _b !== void 0 ? _b : null),
                            sizeCode: (_c = r.sizeCode) !== null && _c !== void 0 ? _c : null,
                            quantity: Number((_d = r.quantity) !== null && _d !== void 0 ? _d : 0)
                        });
                    });
                    return [2 /*return*/, {
                            masterDisplayId: masterDisplayId,
                            colorAxis: orderAxis(colorPresent, (_w = colorParam === null || colorParam === void 0 ? void 0 : colorParam.listOptions) !== null && _w !== void 0 ? _w : null),
                            sizeAxis: orderAxis(sizePresent, (_x = sizeParam === null || sizeParam === void 0 ? void 0 : sizeParam.listOptions) !== null && _x !== void 0 ? _x : null),
                            cells: cells,
                            existingBundles: existingBundles,
                            splitRows: splitRows
                        }];
            }
        });
    });
}
/**
 * Save a reviewed/edited split: create new bundles (rows without an id, quantity
 * > 0) and update the quantity of existing bundles (rows with an id). Bundle
 * numbers continue the master's existing sequence.
 */
function saveBundleSplit(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var master, jobId, cuttingOperationId, cuttingProcessId, cuttingOp, job, itemId, styleReadableId, otherMasters, masterToken, existing, bundleJobById, sequence, planned, processOp, CONCURRENCY, created, updated, firstError, i, chunk, results, _i, results_1, r;
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0: return [4 /*yield*/, client
                        .from("masterWorkOrder")
                        .select("id, jobId")
                        .eq("id", input.masterWorkOrderId)
                        .eq("companyId", input.companyId)
                        .maybeSingle()];
                case 1:
                    master = _o.sent();
                    if (master.error)
                        return [2 /*return*/, { data: { created: 0, updated: 0 }, error: master.error }];
                    if (!((_a = master.data) === null || _a === void 0 ? void 0 : _a.jobId)) {
                        return [2 /*return*/, {
                                data: { created: 0, updated: 0 },
                                error: new Error("Master work order not found")
                            }];
                    }
                    jobId = master.data.jobId;
                    return [4 /*yield*/, (0, masterWorkOrder_service_1.getMasterCuttingOperationId)(client, jobId, input.companyId)];
                case 2:
                    cuttingOperationId = _o.sent();
                    cuttingProcessId = null;
                    if (!cuttingOperationId) return [3 /*break*/, 4];
                    return [4 /*yield*/, client
                            .from("jobOperation")
                            .select("processId")
                            .eq("id", cuttingOperationId)
                            .eq("companyId", input.companyId)
                            .single()];
                case 3:
                    cuttingOp = _o.sent();
                    cuttingProcessId = (_c = (_b = cuttingOp.data) === null || _b === void 0 ? void 0 : _b.processId) !== null && _c !== void 0 ? _c : null;
                    _o.label = 4;
                case 4: return [4 /*yield*/, client
                        .from("job")
                        .select("itemId, jobId, item(readableId)")
                        .eq("id", jobId)
                        .eq("companyId", input.companyId)
                        .single()];
                case 5:
                    job = _o.sent();
                    if (job.error || !((_d = job.data) === null || _d === void 0 ? void 0 : _d.itemId)) {
                        return [2 /*return*/, {
                                data: { created: 0, updated: 0 },
                                error: (_e = job.error) !== null && _e !== void 0 ? _e : new Error("Master job not found")
                            }];
                    }
                    itemId = job.data.itemId;
                    styleReadableId = (_h = (_g = (_f = job.data.item) === null || _f === void 0 ? void 0 : _f.readableId) !== null && _g !== void 0 ? _g : job.data.jobId) !== null && _h !== void 0 ? _h : "BWO";
                    return [4 /*yield*/, client
                            .from("masterWorkOrder")
                            .select("id")
                            .eq("companyId", input.companyId)
                            .neq("id", input.masterWorkOrderId)];
                case 6:
                    otherMasters = _o.sent();
                    masterToken = shortestDistinctIdPrefix(input.masterWorkOrderId, ((_j = otherMasters.data) !== null && _j !== void 0 ? _j : []).map(function (m) { return m.id; }));
                    return [4 /*yield*/, getBundleWorkOrders(client, input.masterWorkOrderId, input.companyId)];
                case 7:
                    existing = _o.sent();
                    bundleJobById = new Map(((_k = existing.data) !== null && _k !== void 0 ? _k : []).map(function (b) { return [b.id, b.jobId]; }));
                    sequence = (_m = (_l = existing.data) === null || _l === void 0 ? void 0 : _l.length) !== null && _m !== void 0 ? _m : 0;
                    planned = input.bundles.map(function (bundle) {
                        var _a, _b;
                        var quantity = Number(bundle.quantity) || 0;
                        if (bundle.id) {
                            return { kind: "update", bundle: bundle, quantity: quantity };
                        }
                        if (quantity <= 0) {
                            return { kind: "skip" };
                        }
                        sequence += 1;
                        // The bundle's descriptive id (also used as its backing job's readable id).
                        var jobReadableId = [
                            styleReadableId,
                            (_a = bundle.colorCode) !== null && _a !== void 0 ? _a : "NA",
                            (_b = bundle.sizeCode) !== null && _b !== void 0 ? _b : "NA",
                            masterToken,
                            String(sequence).padStart(2, "0")
                        ].join("-");
                        return {
                            kind: "create",
                            bundle: bundle,
                            quantity: quantity,
                            sequence: sequence,
                            jobReadableId: jobReadableId
                        };
                    });
                    processOp = function (op) { return __awaiter(_this, void 0, void 0, function () {
                        var backingJobId, jobUpdate, inserted;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (op.kind === "skip") {
                                        return [2 /*return*/, { created: 0, updated: 0, error: null }];
                                    }
                                    if (!(op.kind === "update")) return [3 /*break*/, 2];
                                    backingJobId = op.bundle.id ? bundleJobById.get(op.bundle.id) : null;
                                    if (!backingJobId)
                                        return [2 /*return*/, { created: 0, updated: 0, error: null }];
                                    return [4 /*yield*/, client
                                            .from("job")
                                            .update({
                                            quantity: op.quantity,
                                            updatedBy: input.createdBy,
                                            updatedAt: new Date().toISOString()
                                        })
                                            .eq("id", backingJobId)
                                            .eq("companyId", input.companyId)];
                                case 1:
                                    jobUpdate = _a.sent();
                                    if (jobUpdate.error) {
                                        return [2 /*return*/, { created: 0, updated: 0, error: jobUpdate.error }];
                                    }
                                    return [2 /*return*/, { created: 0, updated: 1, error: null }];
                                case 2: return [4 /*yield*/, insertBundleWorkOrder(client, {
                                        masterWorkOrderId: input.masterWorkOrderId,
                                        itemId: itemId,
                                        quantity: op.quantity,
                                        sequence: op.sequence,
                                        colorCode: op.bundle.colorCode,
                                        sizeCode: op.bundle.sizeCode,
                                        cuttingProcessId: cuttingProcessId,
                                        jobReadableId: op.jobReadableId,
                                        companyId: input.companyId,
                                        createdBy: input.createdBy
                                    })];
                                case 3:
                                    inserted = _a.sent();
                                    if (inserted.error || !inserted.data) {
                                        return [2 /*return*/, { created: 0, updated: 0, error: inserted.error }];
                                    }
                                    if (!op.bundle.splitRowId) return [3 /*break*/, 5];
                                    return [4 /*yield*/, client
                                            .from("masterWorkOrderSplitRow")
                                            .update({
                                            bundleWorkOrderId: inserted.data.id,
                                            updatedBy: input.createdBy,
                                            updatedAt: new Date().toISOString()
                                        })
                                            .eq("id", op.bundle.splitRowId)
                                            .eq("companyId", input.companyId)];
                                case 4:
                                    _a.sent();
                                    _a.label = 5;
                                case 5: return [2 /*return*/, { created: 1, updated: 0, error: null }];
                            }
                        });
                    }); };
                    CONCURRENCY = 8;
                    created = 0;
                    updated = 0;
                    firstError = null;
                    i = 0;
                    _o.label = 8;
                case 8:
                    if (!(i < planned.length)) return [3 /*break*/, 11];
                    chunk = planned.slice(i, i + CONCURRENCY);
                    return [4 /*yield*/, Promise.all(chunk.map(processOp))];
                case 9:
                    results = _o.sent();
                    for (_i = 0, results_1 = results; _i < results_1.length; _i++) {
                        r = results_1[_i];
                        created += r.created;
                        updated += r.updated;
                        if (r.error && !firstError)
                            firstError = r.error;
                    }
                    _o.label = 10;
                case 10:
                    i += CONCURRENCY;
                    return [3 /*break*/, 8];
                case 11: return [2 /*return*/, { data: { created: created, updated: updated }, error: firstError }];
            }
        });
    });
}
/**
 * Replace a cutting report's still-pending cut split rows with its current rows.
 * Already-materialized rows (linked to a bundle) are left alone, so re-reporting
 * only rewrites what hasn't been bundled yet. Called after a master WO cutting
 * production report is saved.
 */
function replaceMasterCuttingSplitRows(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var c, del, rows, insert;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    c = client;
                    return [4 /*yield*/, c
                            .from("masterWorkOrderSplitRow")
                            .delete()
                            .eq("companyId", input.companyId)
                            .eq("productionQuantityReportId", input.productionQuantityReportId)
                            .is("bundleWorkOrderId", null)];
                case 1:
                    del = _a.sent();
                    if (del.error)
                        return [2 /*return*/, { error: del.error }];
                    rows = input.rows.filter(function (r) { return (Number(r.quantity) || 0) > 0; });
                    if (rows.length === 0)
                        return [2 /*return*/, { error: null }];
                    return [4 /*yield*/, c.from("masterWorkOrderSplitRow").insert(rows.map(function (r) { return ({
                            masterWorkOrderId: input.masterWorkOrderId,
                            companyId: input.companyId,
                            productionQuantityReportId: input.productionQuantityReportId,
                            colorCode: r.colorCode,
                            sizeCode: r.sizeCode,
                            quantity: Number(r.quantity) || 0,
                            createdBy: input.createdBy
                        }); }))];
                case 2:
                    insert = _a.sent();
                    return [2 /*return*/, { error: insert.error }];
            }
        });
    });
}
/**
 * After production is reported against a Bundle Work Order's job, cache the
 * bundle's reported quantity + last-reported timestamp on the bundle row, and
 * auto-complete the bundle's job once the reported quantity reaches the target.
 * No-op when the job isn't a bundle.
 */
function recordBundleProductionReport(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var bundle, producedDelta, nowIso, reportedQuantity, update, job, target;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, client
                        .from("bundleWorkOrder")
                        .select("id, reportedQuantity")
                        .eq("jobId", input.jobId)
                        .eq("companyId", input.companyId)
                        .maybeSingle()];
                case 1:
                    bundle = _e.sent();
                    if (bundle.error)
                        return [2 /*return*/, { error: bundle.error }];
                    if (!bundle.data)
                        return [2 /*return*/, { error: null }];
                    producedDelta = input.lines
                        .filter(function (line) { return line.type === "Production"; })
                        .reduce(function (sum, line) { return sum + (line.quantity || 0); }, 0);
                    nowIso = new Date().toISOString();
                    reportedQuantity = ((_a = bundle.data.reportedQuantity) !== null && _a !== void 0 ? _a : 0) + producedDelta;
                    return [4 /*yield*/, client
                            .from("bundleWorkOrder")
                            .update({
                            reportedQuantity: reportedQuantity,
                            lastReportedAt: nowIso,
                            updatedBy: input.createdBy,
                            updatedAt: nowIso
                        })
                            .eq("id", bundle.data.id)];
                case 2:
                    update = _e.sent();
                    if (update.error)
                        return [2 /*return*/, { error: update.error }];
                    return [4 /*yield*/, client
                            .from("job")
                            .select("quantity, status")
                            .eq("id", input.jobId)
                            .single()];
                case 3:
                    job = _e.sent();
                    target = (_c = (_b = job.data) === null || _b === void 0 ? void 0 : _b.quantity) !== null && _c !== void 0 ? _c : 0;
                    if (!(producedDelta > 0 &&
                        target > 0 &&
                        reportedQuantity >= target &&
                        ((_d = job.data) === null || _d === void 0 ? void 0 : _d.status) !== "Completed")) return [3 /*break*/, 5];
                    return [4 /*yield*/, client
                            .from("job")
                            .update({
                            status: "Completed",
                            completedDate: nowIso,
                            updatedBy: input.createdBy
                        })
                            .eq("id", input.jobId)
                            .eq("companyId", input.companyId)];
                case 4:
                    _e.sent();
                    _e.label = 5;
                case 5: return [2 /*return*/, { error: null }];
            }
        });
    });
}
