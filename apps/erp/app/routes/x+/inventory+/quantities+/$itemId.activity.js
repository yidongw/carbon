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
exports.loader = loader;
exports.default = ItemInventoryActivityRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var macro_1 = require("@lingui/react/macro");
var react_1 = require("react");
var react_router_1 = require("react-router");
var InfiniteScroll_1 = require("~/components/InfiniteScroll");
var inventory_1 = require("~/modules/inventory");
var resources_1 = require("~/modules/resources");
var users_server_1 = require("~/modules/users/users.server");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, itemId, url, searchParams, locationId, userDefaults, _d, _e, locations, _f, _g, itemLedgerRecords, _h, _j;
        var _k, _l, _m, _o;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "inventory"
                    })];
                case 1:
                    _c = _p.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    itemId = params.itemId;
                    if (!itemId)
                        throw (0, auth_1.notFound)("itemId not found");
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    locationId = searchParams.get("location");
                    if (!!locationId) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, users_server_1.getUserDefaults)(client, userId, companyId)];
                case 2:
                    userDefaults = _p.sent();
                    if (!userDefaults.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.inventoryQuantities];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(userDefaults.error, "Failed to load default location"))];
                case 3: throw _d.apply(void 0, _e.concat([_p.sent()]));
                case 4:
                    locationId = (_l = (_k = userDefaults.data) === null || _k === void 0 ? void 0 : _k.locationId) !== null && _l !== void 0 ? _l : null;
                    _p.label = 5;
                case 5:
                    if (!!locationId) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, resources_1.getLocationsList)(client, companyId)];
                case 6:
                    locations = _p.sent();
                    if (!(locations.error || !((_m = locations.data) === null || _m === void 0 ? void 0 : _m.length))) return [3 /*break*/, 8];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.inventoryQuantities];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(locations.error, "Failed to load any locations"))];
                case 7: throw _f.apply(void 0, _g.concat([_p.sent()]));
                case 8:
                    locationId = (_o = locations.data) === null || _o === void 0 ? void 0 : _o[0].id;
                    _p.label = 9;
                case 9: return [4 /*yield*/, (0, inventory_1.getItemLedgerPage)(client, itemId, companyId, locationId, true)];
                case 10:
                    itemLedgerRecords = _p.sent();
                    if (!(itemLedgerRecords.error || !itemLedgerRecords.data)) return [3 /*break*/, 12];
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.inventoryQuantities];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(itemLedgerRecords, "Failed to load item inventory activity"))];
                case 11: throw _h.apply(void 0, _j.concat([_p.sent()]));
                case 12: return [2 /*return*/, {
                        initialItemLedgers: itemLedgerRecords.data,
                        itemId: itemId,
                        companyId: companyId,
                        locationId: locationId
                    }];
            }
        });
    });
}
function ItemInventoryActivityRoute() {
    var _this = this;
    var _a = (0, react_router_1.useLoaderData)(), initialItemLedgers = _a.initialItemLedgers, itemId = _a.itemId, companyId = _a.companyId, locationId = _a.locationId;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _b = (0, react_1.useState)(initialItemLedgers), itemLedgers = _b[0], setItemLedgers = _b[1];
    var _c = (0, react_1.useState)(1), page = _c[0], setPage = _c[1];
    var _d = (0, react_1.useState)(false), isLoading = _d[0], setIsLoading = _d[1];
    var _e = (0, react_1.useState)(true), hasMore = _e[0], setHasMore = _e[1];
    var loadMoreItemLedgers = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var newItemLedgers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isLoading || !hasMore)
                        return [2 /*return*/];
                    setIsLoading(true);
                    return [4 /*yield*/, (0, inventory_1.getItemLedgerPage)(carbon, itemId, companyId, locationId, true, page + 1)];
                case 1:
                    newItemLedgers = _a.sent();
                    if (newItemLedgers.data && newItemLedgers.data.length > 0) {
                        setItemLedgers(function (prevItemLedgers) { return __spreadArray(__spreadArray([], prevItemLedgers, true), newItemLedgers.data, true); });
                        setPage(function (prevPage) { return prevPage + 1; });
                    }
                    else {
                        setHasMore(false);
                    }
                    setIsLoading(false);
                    return [2 /*return*/];
            }
        });
    }); }, [page, carbon, companyId, locationId, itemId, isLoading, hasMore]);
    return (<>
      <div className="w-full space-y-4 pt-6 px-4">
        <h2 className="text-2xl font-semibold mb-4">
          <macro_1.Trans>Activity</macro_1.Trans>
        </h2>

        <InfiniteScroll_1.default component={inventory_1.InventoryActivity} items={itemLedgers} loadMore={loadMoreItemLedgers} hasMore={hasMore}/>
      </div>
    </>);
}
