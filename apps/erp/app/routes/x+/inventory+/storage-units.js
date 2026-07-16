"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.default = StorageUnitsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var inventory_1 = require("~/modules/inventory");
var StorageUnitsTable_1 = require("~/modules/inventory/ui/StorageUnits/StorageUnitsTable");
var resources_1 = require("~/modules/resources");
var users_server_1 = require("~/modules/users/users.server");
var path_1 = require("~/utils/path");
var query_1 = require("~/utils/query");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Storage Units"], ["Storage Units"]))),
    to: path_1.path.to.storageUnits,
    module: "inventory"
};
// Deepest level (1-based, roots = 1) the tree eagerly loads and pre-expands.
// Nodes below this still render with an expand chevron and lazy-load on click.
var EAGER_EXPAND_MAX_DEPTH = 5;
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, url, searchParams, search, _d, limit, offset, sorts, filters, locationId, userDefaults, _e, _f, locationsList, _g, _h, _j, parentIdsWithChildren, storageTypesList, rows, count, initialExpanded, searchResult, _k, _l, rootsResult, _m, _o, roots, descendants, _p, _q, expandedParents, _i, rows_1, row;
        var _r, _s, _t, _u, _v, _w, _x;
        var request = _b.request;
        return __generator(this, function (_y) {
            switch (_y.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "inventory",
                        bypassRls: true
                    })];
                case 1:
                    _c = _y.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    search = searchParams.get("search");
                    _d = (0, query_1.getGenericQueryFilters)(searchParams), limit = _d.limit, offset = _d.offset, sorts = _d.sorts, filters = _d.filters;
                    locationId = searchParams.get("location");
                    if (!!locationId) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, users_server_1.getUserDefaults)(client, userId, companyId)];
                case 2:
                    userDefaults = _y.sent();
                    if (!userDefaults.error) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.storageUnits];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(userDefaults.error, "Failed to load default location"))];
                case 3: throw _e.apply(void 0, _f.concat([_y.sent()]));
                case 4:
                    locationId = (_s = (_r = userDefaults.data) === null || _r === void 0 ? void 0 : _r.locationId) !== null && _s !== void 0 ? _s : null;
                    _y.label = 5;
                case 5: return [4 /*yield*/, (0, resources_1.getLocationsList)(client, companyId)];
                case 6:
                    locationsList = _y.sent();
                    if (!(locationsList.error || !((_t = locationsList.data) === null || _t === void 0 ? void 0 : _t.length))) return [3 /*break*/, 8];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.storageUnits];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(locationsList.error, "Failed to load any locations"))];
                case 7: throw _g.apply(void 0, _h.concat([_y.sent()]));
                case 8:
                    if (!locationId) {
                        locationId = locationsList.data[0].id;
                    }
                    return [4 /*yield*/, Promise.all([
                            (0, inventory_1.getStorageUnitParentIdsWithChildren)(client, companyId, locationId),
                            // Fetch storage types server-side so the Storage Types column can render
                            // resolved names on first paint instead of flashing raw ids while the
                            // client-side useStorageTypes() fetcher catches up.
                            (0, inventory_1.getStorageTypesList)(client, companyId)
                        ])];
                case 9:
                    _j = _y.sent(), parentIdsWithChildren = _j[0], storageTypesList = _j[1];
                    initialExpanded = [];
                    if (!search) return [3 /*break*/, 13];
                    return [4 /*yield*/, (0, inventory_1.searchStorageUnitsWithAncestors)(client, companyId, locationId, search)];
                case 10:
                    searchResult = _y.sent();
                    if (!searchResult.error) return [3 /*break*/, 12];
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.authenticatedRoot];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(searchResult.error, "Failed to fetch storageUnits"))];
                case 11: throw _k.apply(void 0, _l.concat([_y.sent()]));
                case 12:
                    rows = searchResult.rows;
                    count = searchResult.rows.length;
                    initialExpanded = searchResult.expandedParentIds;
                    return [3 /*break*/, 20];
                case 13: return [4 /*yield*/, (0, inventory_1.getStorageUnitRoots)(client, companyId, locationId, { search: search, limit: limit, offset: offset, sorts: sorts, filters: filters })];
                case 14:
                    rootsResult = _y.sent();
                    if (!rootsResult.error) return [3 /*break*/, 16];
                    _m = react_router_1.redirect;
                    _o = [path_1.path.to.authenticatedRoot];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(rootsResult.error, "Failed to fetch storageUnits"))];
                case 15: throw _m.apply(void 0, _o.concat([_y.sent()]));
                case 16:
                    roots = (_u = rootsResult.data) !== null && _u !== void 0 ? _u : [];
                    count = (_v = rootsResult.count) !== null && _v !== void 0 ? _v : 0;
                    return [4 /*yield*/, (0, inventory_1.getStorageUnitSubtrees)(client, companyId, locationId, roots.map(function (r) { return r.id; }), EAGER_EXPAND_MAX_DEPTH)];
                case 17:
                    descendants = _y.sent();
                    if (!descendants.error) return [3 /*break*/, 19];
                    _p = react_router_1.redirect;
                    _q = [path_1.path.to.authenticatedRoot];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(descendants.error, "Failed to fetch storageUnits"))];
                case 18: throw _p.apply(void 0, _q.concat([_y.sent()]));
                case 19:
                    rows = __spreadArray(__spreadArray([], roots, true), ((_w = descendants.data) !== null && _w !== void 0 ? _w : []), true);
                    expandedParents = new Set();
                    for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                        row = rows_1[_i];
                        if (row.parentId)
                            expandedParents.add(row.parentId);
                    }
                    initialExpanded = Array.from(expandedParents);
                    _y.label = 20;
                case 20: return [2 /*return*/, {
                        count: count,
                        storageUnits: rows,
                        parentIdsWithChildren: parentIdsWithChildren.data,
                        initialExpanded: initialExpanded,
                        locations: locationsList.data,
                        locationId: locationId,
                        storageTypes: (_x = storageTypesList.data) !== null && _x !== void 0 ? _x : []
                    }];
            }
        });
    });
}
function StorageUnitsRoute() {
    var _a = (0, react_router_1.useLoaderData)(), count = _a.count, storageUnits = _a.storageUnits, parentIdsWithChildren = _a.parentIdsWithChildren, initialExpanded = _a.initialExpanded, locations = _a.locations, locationId = _a.locationId, storageTypes = _a.storageTypes;
    // storageUnits comes from storageUnits_recursive (a view) so every column
    // is nominally nullable in the generated types. In practice only roots have
    // a null parentId; id / name / active / companyId / locationId are always
    // populated for rows visible to a user. Narrow by filtering and casting.
    var rows = storageUnits.filter(function (r) { return r.id != null && r.name != null && r.active != null; });
    return (<react_1.VStack spacing={0} className="h-full">
      <StorageUnitsTable_1.default data={rows} count={count} locations={locations} locationId={locationId} storageTypes={storageTypes} parentIdsWithChildren={parentIdsWithChildren} initialExpanded={initialExpanded}/>
      <react_router_1.Outlet />
    </react_1.VStack>);
}
var templateObject_1;
