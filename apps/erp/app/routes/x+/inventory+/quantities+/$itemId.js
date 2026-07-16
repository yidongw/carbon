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
exports.default = ItemInventoryRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var react_router_1 = require("react-router");
var InventoryItemHeader_1 = require("~/modules/inventory/ui/Inventory/InventoryItemHeader");
var items_1 = require("~/modules/items");
var resources_1 = require("~/modules/resources");
var users_server_1 = require("~/modules/users/users.server");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, itemId, url, searchParams, locationId, userDefaults, _d, _e, locations, _f, _g, ensurePickMethod, _h, _j, pickMethod, _k, _l, item, _m, _o;
        var _p, _q, _r, _s;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "inventory"
                    })];
                case 1:
                    _c = _t.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    itemId = params.itemId;
                    if (!itemId)
                        throw (0, auth_1.notFound)("itemId not found");
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    locationId = searchParams.get("location");
                    if (!!locationId) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, users_server_1.getUserDefaults)(client, userId, companyId)];
                case 2:
                    userDefaults = _t.sent();
                    if (!userDefaults.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.inventoryQuantities];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(userDefaults.error, "Failed to load default location"))];
                case 3: throw _d.apply(void 0, _e.concat([_t.sent()]));
                case 4:
                    locationId = (_q = (_p = userDefaults.data) === null || _p === void 0 ? void 0 : _p.locationId) !== null && _q !== void 0 ? _q : null;
                    _t.label = 5;
                case 5:
                    if (!!locationId) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, resources_1.getLocationsList)(client, companyId)];
                case 6:
                    locations = _t.sent();
                    if (!(locations.error || !((_r = locations.data) === null || _r === void 0 ? void 0 : _r.length))) return [3 /*break*/, 8];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.inventoryQuantities];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(locations.error, "Failed to load any locations"))];
                case 7: throw _f.apply(void 0, _g.concat([_t.sent()]));
                case 8:
                    locationId = (_s = locations.data) === null || _s === void 0 ? void 0 : _s[0].id;
                    _t.label = 9;
                case 9: return [4 /*yield*/, (0, items_1.upsertPickMethod)(client, {
                        itemId: itemId,
                        companyId: companyId,
                        locationId: locationId,
                        customFields: {},
                        createdBy: userId
                    })];
                case 10:
                    ensurePickMethod = _t.sent();
                    if (!ensurePickMethod.error) return [3 /*break*/, 12];
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.inventoryQuantities];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(ensurePickMethod.error, "Failed to ensure pick method exists"))];
                case 11: throw _h.apply(void 0, _j.concat([_t.sent()]));
                case 12: return [4 /*yield*/, (0, items_1.getPickMethod)(client, itemId, companyId, locationId)];
                case 13:
                    pickMethod = _t.sent();
                    if (!(pickMethod.error || !pickMethod.data)) return [3 /*break*/, 15];
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.inventoryQuantities];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(pickMethod.error, "Failed to load pick method"))];
                case 14: throw _k.apply(void 0, _l.concat([_t.sent()]));
                case 15: return [4 /*yield*/, (0, items_1.getItem)(client, itemId)];
                case 16:
                    item = _t.sent();
                    if (!(item.error || !item.data)) return [3 /*break*/, 18];
                    _m = react_router_1.redirect;
                    _o = [path_1.path.to.inventoryQuantities];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(item.error, "Failed to load item"))];
                case 17: throw _m.apply(void 0, _o.concat([_t.sent()]));
                case 18: return [2 /*return*/, {
                        pickMethod: pickMethod.data,
                        item: item.data
                    }];
            }
        });
    });
}
function ItemInventoryRoute() {
    var _a;
    var item = (0, react_router_1.useLoaderData)().item;
    return (<>
      <react_1.ResizableHandle withHandle/>
      <react_1.ResizablePanel defaultSize={50} maxSize={70} minSize={25} className="bg-muted">
        <react_1.ScrollArea className="h-[calc(100dvh-49px)]">
          <InventoryItemHeader_1.default itemReadableId={(_a = item.readableIdWithRevision) !== null && _a !== void 0 ? _a : item.readableId} 
    // @ts-ignore
    itemType={item.type}/>
          <react_1.VStack className="p-2">
            <react_router_1.Outlet />
          </react_1.VStack>
        </react_1.ScrollArea>
      </react_1.ResizablePanel>
    </>);
}
