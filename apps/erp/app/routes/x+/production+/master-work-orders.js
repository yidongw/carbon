"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.handle = void 0;
exports.loader = loader;
exports.default = MasterWorkOrdersRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var production_1 = require("~/modules/production");
var MasterWorkOrders_1 = require("~/modules/production/ui/MasterWorkOrders");
var path_1 = require("~/utils/path");
var query_1 = require("~/utils/query");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Master Work Orders"], ["Master Work Orders"]))),
    to: path_1.path.to.masterWorkOrders,
    module: "production"
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, url, searchParams, search, _d, limit, offset, sorts, filters, masterWorkOrders, _e, _f, _g, rows, itemIds, masterIds, _h, itemIdsWithConfigurationParameters, bundleRows, bundleCountByMasterId, _i, _j, masterWorkOrderId, masterIdByMasterJobId, masterJobIds, _k, rows_1, r, processDescByMasterId, ops, _l, _m, op, masterId, processCountByMasterId, _o, _p, _q, masterId, descriptions, cuttingProgressByMasterId;
        var _r, _s, _t, _u, _v, _w, _x;
        var request = _b.request;
        return __generator(this, function (_y) {
            switch (_y.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "production",
                        role: "employee"
                    })];
                case 1:
                    _c = _y.sent(), client = _c.client, companyId = _c.companyId;
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    search = searchParams.get("search");
                    _d = (0, query_1.getGenericQueryFilters)(searchParams), limit = _d.limit, offset = _d.offset, sorts = _d.sorts, filters = _d.filters;
                    return [4 /*yield*/, (0, production_1.getMasterWorkOrders)(client, companyId, {
                            search: search,
                            limit: limit,
                            offset: offset,
                            sorts: sorts,
                            filters: filters
                        })];
                case 2:
                    masterWorkOrders = _y.sent();
                    if (!masterWorkOrders.error) return [3 /*break*/, 4];
                    _e = Response.bind;
                    _f = [void 0, undefined];
                    _g = [{ status: 500 }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(masterWorkOrders.error, "Failed to load master work orders"))];
                case 3: throw new (_e.apply(Response, _f.concat([__assign.apply(void 0, _g.concat([(_y.sent())]))])))();
                case 4:
                    rows = (_r = masterWorkOrders.data) !== null && _r !== void 0 ? _r : [];
                    itemIds = __spreadArray([], new Set(rows.map(function (r) { return r.itemId; }).filter(function (id) { return Boolean(id); })), true);
                    masterIds = rows
                        .map(function (r) { return r.id; })
                        .filter(function (id) { return Boolean(id); });
                    return [4 /*yield*/, Promise.all([
                            (0, production_1.getItemIdsWithConfigurationParameters)(client, companyId, itemIds),
                            masterIds.length > 0
                                ? client
                                    .from("bundleWorkOrders")
                                    .select("masterWorkOrderId, jobId")
                                    .eq("companyId", companyId)
                                    .in("masterWorkOrderId", masterIds)
                                : Promise.resolve({
                                    data: []
                                })
                        ])];
                case 5:
                    _h = _y.sent(), itemIdsWithConfigurationParameters = _h[0], bundleRows = _h[1];
                    bundleCountByMasterId = {};
                    for (_i = 0, _j = (_s = bundleRows.data) !== null && _s !== void 0 ? _s : []; _i < _j.length; _i++) {
                        masterWorkOrderId = _j[_i].masterWorkOrderId;
                        if (!masterWorkOrderId)
                            continue;
                        bundleCountByMasterId[masterWorkOrderId] =
                            ((_t = bundleCountByMasterId[masterWorkOrderId]) !== null && _t !== void 0 ? _t : 0) + 1;
                    }
                    masterIdByMasterJobId = {};
                    masterJobIds = [];
                    for (_k = 0, rows_1 = rows; _k < rows_1.length; _k++) {
                        r = rows_1[_k];
                        if (r.jobId && r.id) {
                            masterIdByMasterJobId[r.jobId] = r.id;
                            masterJobIds.push(r.jobId);
                        }
                    }
                    processDescByMasterId = {};
                    if (!(masterJobIds.length > 0)) return [3 /*break*/, 7];
                    return [4 /*yield*/, client
                            .from("jobOperation")
                            .select("jobId, description")
                            .in("jobId", masterJobIds)
                            .eq("companyId", companyId)];
                case 6:
                    ops = _y.sent();
                    for (_l = 0, _m = (_u = ops.data) !== null && _u !== void 0 ? _u : []; _l < _m.length; _l++) {
                        op = _m[_l];
                        masterId = op.jobId ? masterIdByMasterJobId[op.jobId] : undefined;
                        if (!masterId)
                            continue;
                        ((_v = processDescByMasterId[masterId]) !== null && _v !== void 0 ? _v : (processDescByMasterId[masterId] = new Set())).add((_w = op.description) !== null && _w !== void 0 ? _w : "—");
                    }
                    _y.label = 7;
                case 7:
                    processCountByMasterId = {};
                    for (_o = 0, _p = Object.entries(processDescByMasterId); _o < _p.length; _o++) {
                        _q = _p[_o], masterId = _q[0], descriptions = _q[1];
                        processCountByMasterId[masterId] = descriptions.size;
                    }
                    return [4 /*yield*/, (0, production_1.getMasterCuttingProgress)(client, rows.map(function (r) { return ({
                            id: r.id,
                            jobId: r.jobId,
                            itemId: r.itemId,
                            quantity: r.quantity
                        }); }), companyId)];
                case 8:
                    cuttingProgressByMasterId = _y.sent();
                    return [2 /*return*/, {
                            count: (_x = masterWorkOrders.count) !== null && _x !== void 0 ? _x : 0,
                            masterWorkOrders: rows,
                            itemIdsWithConfigurationParameters: itemIdsWithConfigurationParameters,
                            bundleCountByMasterId: bundleCountByMasterId,
                            processCountByMasterId: processCountByMasterId,
                            cuttingProgressByMasterId: cuttingProgressByMasterId
                        }];
            }
        });
    });
}
function MasterWorkOrdersRoute() {
    var _a = (0, react_router_1.useLoaderData)(), count = _a.count, masterWorkOrders = _a.masterWorkOrders, itemIdsWithConfigurationParameters = _a.itemIdsWithConfigurationParameters, bundleCountByMasterId = _a.bundleCountByMasterId, processCountByMasterId = _a.processCountByMasterId, cuttingProgressByMasterId = _a.cuttingProgressByMasterId;
    return (<react_1.VStack spacing={0} className="h-full">
      <MasterWorkOrders_1.MasterWorkOrdersTable data={masterWorkOrders} count={count} itemIdsWithConfigurationParameters={itemIdsWithConfigurationParameters} bundleCountByMasterId={bundleCountByMasterId} processCountByMasterId={processCountByMasterId} cuttingProgressByMasterId={cuttingProgressByMasterId}/>
      <react_router_1.Outlet />
    </react_1.VStack>);
}
var templateObject_1;
