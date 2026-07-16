"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = loader;
exports.default = QuantitiesRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var react_router_1 = require("react-router");
var inventory_1 = require("~/modules/inventory");
var InventoryTable_1 = require("~/modules/inventory/ui/Inventory/InventoryTable");
var items_1 = require("~/modules/items");
var resources_1 = require("~/modules/resources");
var shared_1 = require("~/modules/shared");
var users_server_1 = require("~/modules/users/users.server");
var path_1 = require("~/utils/path");
var query_1 = require("~/utils/query");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, url, searchParams, search, _d, limit, offset, sorts, filters, storageUnitFilter, ids, expanded, locationId, userDefaults, _e, _f, locations, _g, _h, _j, inventoryItems, forms, substances, tags, storageTypes, storageUnits, _k, _l, uniqueTags;
        var _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        var request = _b.request;
        return __generator(this, function (_x) {
            switch (_x.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "inventory",
                        bypassRls: true
                    })];
                case 1:
                    _c = _x.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    search = searchParams.get("search");
                    _d = (0, query_1.getGenericQueryFilters)(searchParams), limit = _d.limit, offset = _d.offset, sorts = _d.sorts, filters = _d.filters;
                    storageUnitFilter = filters === null || filters === void 0 ? void 0 : filters.find(function (f) { return f.column === "storageUnitIds" && f.value; });
                    if (!(storageUnitFilter === null || storageUnitFilter === void 0 ? void 0 : storageUnitFilter.value)) return [3 /*break*/, 3];
                    ids = storageUnitFilter.value.split(",");
                    return [4 /*yield*/, (0, inventory_1.expandStorageUnitIdsWithDescendants)(client, ids)];
                case 2:
                    expanded = _x.sent();
                    storageUnitFilter.value = expanded.join(",");
                    _x.label = 3;
                case 3:
                    locationId = searchParams.get("location");
                    if (!!locationId) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, users_server_1.getUserDefaults)(client, userId, companyId)];
                case 4:
                    userDefaults = _x.sent();
                    if (!userDefaults.error) return [3 /*break*/, 6];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.inventoryQuantities];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(userDefaults.error, "Failed to load default location"))];
                case 5: throw _e.apply(void 0, _f.concat([_x.sent()]));
                case 6:
                    locationId = (_o = (_m = userDefaults.data) === null || _m === void 0 ? void 0 : _m.locationId) !== null && _o !== void 0 ? _o : null;
                    _x.label = 7;
                case 7:
                    if (!!locationId) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, resources_1.getLocationsList)(client, companyId)];
                case 8:
                    locations = _x.sent();
                    if (!(locations.error || !((_p = locations.data) === null || _p === void 0 ? void 0 : _p.length))) return [3 /*break*/, 10];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.inventoryQuantities];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(locations.error, "Failed to load any locations"))];
                case 9: throw _g.apply(void 0, _h.concat([_x.sent()]));
                case 10:
                    locationId = (_q = locations.data) === null || _q === void 0 ? void 0 : _q[0].id;
                    _x.label = 11;
                case 11: return [4 /*yield*/, Promise.all([
                        (0, inventory_1.getInventoryItems)(client, locationId, companyId, {
                            search: search,
                            limit: limit,
                            offset: offset,
                            sorts: sorts,
                            filters: filters
                        }),
                        (0, items_1.getMaterialFormsList)(client, companyId),
                        (0, items_1.getMaterialSubstancesList)(client, companyId),
                        (0, shared_1.getTagsList)(client, companyId),
                        (0, inventory_1.getStorageTypesList)(client, companyId),
                        (0, inventory_1.getStorageUnitsList)(client, companyId)
                    ])];
                case 12:
                    _j = _x.sent(), inventoryItems = _j[0], forms = _j[1], substances = _j[2], tags = _j[3], storageTypes = _j[4], storageUnits = _j[5];
                    if (!inventoryItems.error) return [3 /*break*/, 14];
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.authenticatedRoot];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(inventoryItems.error, "Failed to fetch inventory items"))];
                case 13:
                    _k.apply(void 0, _l.concat([_x.sent()]));
                    _x.label = 14;
                case 14:
                    uniqueTags = (0, utils_1.pluckUnique)(tags.data, function (t) { return t.name; });
                    return [2 /*return*/, {
                            count: (_r = inventoryItems.count) !== null && _r !== void 0 ? _r : 0,
                            inventoryItems: ((_s = inventoryItems.data) !== null && _s !== void 0 ? _s : []),
                            locationId: locationId,
                            forms: (_t = forms.data) !== null && _t !== void 0 ? _t : [],
                            substances: (_u = substances.data) !== null && _u !== void 0 ? _u : [],
                            tags: uniqueTags,
                            storageTypes: (_v = storageTypes.data) !== null && _v !== void 0 ? _v : [],
                            storageUnits: (_w = storageUnits.data) !== null && _w !== void 0 ? _w : []
                        }];
            }
        });
    });
}
function QuantitiesRoute() {
    var _a = (0, react_router_1.useLoaderData)(), count = _a.count, inventoryItems = _a.inventoryItems, locationId = _a.locationId, forms = _a.forms, substances = _a.substances, tags = _a.tags, storageTypes = _a.storageTypes, storageUnits = _a.storageUnits;
    return (<react_1.VStack spacing={0} className="h-full ">
      <react_1.ResizablePanelGroup direction="horizontal">
        <react_1.ResizablePanel defaultSize={50} maxSize={70} minSize={25} className="bg-background">
          <InventoryTable_1.default data={inventoryItems} count={count} locationId={locationId} forms={forms} substances={substances} tags={tags} storageTypes={storageTypes} storageUnits={storageUnits}/>
        </react_1.ResizablePanel>
        <react_router_1.Outlet />
      </react_1.ResizablePanelGroup>
    </react_1.VStack>);
}
