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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = loader;
exports.default = ItemInventoryRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var react_router_1 = require("react-router");
var StorageUnit_1 = require("~/components/Form/StorageUnit");
var inventory_1 = require("~/modules/inventory");
var items_1 = require("~/modules/items");
var resources_1 = require("~/modules/resources");
var shared_1 = require("~/modules/shared");
var users_server_1 = require("~/modules/users/users.server");
var items_2 = require("~/stores/items");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, itemId, url, searchParams, locationId, userDefaults, _d, _e, locations, _f, _g, pickMethod, insertPickMethod, _h, _j, _k, _l, _m, quantities, item, _o, _p, _q, _r, itemStorageUnitQuantities, _s, _t, trackedEntityIds, _u, itemShelfLife, trackedEntityExpirations, methodData, tags, makeMethods, makeMethod, fullMethod, _v, methodMaterials, methodOperations, operationTags;
        var _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_9) {
            switch (_9.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "inventory"
                    })];
                case 1:
                    _c = _9.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    itemId = params.itemId;
                    if (!itemId)
                        throw (0, auth_1.notFound)("itemId not found");
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    locationId = searchParams.get("location");
                    if (!!locationId) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, users_server_1.getUserDefaults)(client, userId, companyId)];
                case 2:
                    userDefaults = _9.sent();
                    if (!userDefaults.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.inventoryQuantities];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(userDefaults.error, "Failed to load default location"))];
                case 3: throw _d.apply(void 0, _e.concat([_9.sent()]));
                case 4:
                    locationId = (_x = (_w = userDefaults.data) === null || _w === void 0 ? void 0 : _w.locationId) !== null && _x !== void 0 ? _x : null;
                    _9.label = 5;
                case 5:
                    if (!!locationId) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, resources_1.getLocationsList)(client, companyId)];
                case 6:
                    locations = _9.sent();
                    if (!(locations.error || !((_y = locations.data) === null || _y === void 0 ? void 0 : _y.length))) return [3 /*break*/, 8];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.inventoryQuantities];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(locations.error, "Failed to load any locations"))];
                case 7: throw _f.apply(void 0, _g.concat([_9.sent()]));
                case 8:
                    locationId = (_z = locations.data) === null || _z === void 0 ? void 0 : _z[0].id;
                    _9.label = 9;
                case 9: return [4 /*yield*/, Promise.all([
                        (0, items_1.getPickMethod)(client, itemId, companyId, locationId)
                    ])];
                case 10:
                    pickMethod = (_9.sent())[0];
                    if (!(pickMethod.error || !pickMethod.data)) return [3 /*break*/, 16];
                    return [4 /*yield*/, (0, items_1.upsertPickMethod)(client, {
                            itemId: itemId,
                            companyId: companyId,
                            locationId: locationId,
                            customFields: {},
                            createdBy: userId
                        })];
                case 11:
                    insertPickMethod = _9.sent();
                    if (!(insertPickMethod.error &&
                        !insertPickMethod.error.message.includes("duplicate key value"))) return [3 /*break*/, 13];
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.inventoryQuantities];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(insertPickMethod.error, "Failed to insert part inventory"))];
                case 12: throw _h.apply(void 0, _j.concat([_9.sent()]));
                case 13: return [4 /*yield*/, (0, items_1.getPickMethod)(client, itemId, companyId, locationId)];
                case 14:
                    pickMethod = _9.sent();
                    if (!(pickMethod.error || !pickMethod.data)) return [3 /*break*/, 16];
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.inventoryQuantities];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(pickMethod.error, "Failed to load part inventory"))];
                case 15: throw _k.apply(void 0, _l.concat([_9.sent()]));
                case 16: return [4 /*yield*/, Promise.all([
                        (0, items_1.getItemQuantities)(client, itemId, companyId, locationId),
                        (0, items_1.getItem)(client, itemId)
                    ])];
                case 17:
                    _m = _9.sent(), quantities = _m[0], item = _m[1];
                    if (!quantities.error) return [3 /*break*/, 19];
                    _o = react_router_1.redirect;
                    _p = [path_1.path.to.inventoryQuantities];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(quantities, "Failed to load part quantities"))];
                case 18: throw _o.apply(void 0, _p.concat([_9.sent()]));
                case 19:
                    if (!(item.error || !item.data)) return [3 /*break*/, 21];
                    _q = react_router_1.redirect;
                    _r = [path_1.path.to.inventoryQuantities];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(item.error, "Failed to load item"))];
                case 20: throw _q.apply(void 0, _r.concat([_9.sent()]));
                case 21: return [4 /*yield*/, (0, items_1.getItemStorageUnitQuantities)(client, itemId, companyId, locationId)];
                case 22:
                    itemStorageUnitQuantities = _9.sent();
                    if (!(itemStorageUnitQuantities.error || !itemStorageUnitQuantities.data)) return [3 /*break*/, 24];
                    _s = react_router_1.redirect;
                    _t = [path_1.path.to.inventoryQuantities];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(itemStorageUnitQuantities.error, "Failed to load item storage unit quantities"))];
                case 23: throw _s.apply(void 0, _t.concat([_9.sent()]));
                case 24:
                    trackedEntityIds = (0, utils_1.pluckUnique)(itemStorageUnitQuantities.data, function (row) { return row.trackedEntityId; });
                    return [4 /*yield*/, Promise.all([
                            (0, items_1.getItemShelfLife)(client, itemId),
                            (0, inventory_1.getTrackedEntityExpirations)(client, trackedEntityIds)
                        ])];
                case 25:
                    _u = _9.sent(), itemShelfLife = _u[0], trackedEntityExpirations = _u[1];
                    methodData = null;
                    tags = [];
                    if (!(item.data.replenishmentSystem !== "Buy")) return [3 /*break*/, 29];
                    return [4 /*yield*/, (0, items_1.getMakeMethods)(client, itemId, companyId)];
                case 26:
                    makeMethods = _9.sent();
                    makeMethod = (_1 = (_0 = makeMethods.data) === null || _0 === void 0 ? void 0 : _0.find(function (m) { return m.status === "Active"; })) !== null && _1 !== void 0 ? _1 : (_2 = makeMethods.data) === null || _2 === void 0 ? void 0 : _2[0];
                    if (!makeMethod) return [3 /*break*/, 29];
                    return [4 /*yield*/, (0, items_1.getMakeMethodById)(client, makeMethod.id, companyId)];
                case 27:
                    fullMethod = _9.sent();
                    if (!(!fullMethod.error && fullMethod.data)) return [3 /*break*/, 29];
                    return [4 /*yield*/, Promise.all([
                            (0, items_1.getMethodMaterialsByMakeMethod)(client, fullMethod.data.id),
                            (0, items_1.getMethodOperationsByMakeMethodId)(client, fullMethod.data.id),
                            (0, shared_1.getTagsList)(client, companyId, "operation")
                        ])];
                case 28:
                    _v = _9.sent(), methodMaterials = _v[0], methodOperations = _v[1], operationTags = _v[2];
                    methodData = {
                        makeMethod: fullMethod.data,
                        methodMaterials: (_4 = (_3 = methodMaterials.data) === null || _3 === void 0 ? void 0 : _3.map(function (m) {
                            var _a, _b;
                            return (__assign(__assign({}, m), { description: (_b = (_a = m.item) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "", methodType: m.methodType, itemType: m.itemType }));
                        })) !== null && _4 !== void 0 ? _4 : [],
                        methodOperations: (_6 = (_5 = methodOperations.data) === null || _5 === void 0 ? void 0 : _5.map(function (operation) {
                            var _a, _b;
                            return (__assign(__assign({}, operation), { workCenterId: (_a = operation.workCenterId) !== null && _a !== void 0 ? _a : undefined, operationSupplierProcessId: (_b = operation.operationSupplierProcessId) !== null && _b !== void 0 ? _b : undefined, workInstruction: operation.workInstruction }));
                        })) !== null && _6 !== void 0 ? _6 : []
                    };
                    tags = (_7 = operationTags.data) !== null && _7 !== void 0 ? _7 : [];
                    _9.label = 29;
                case 29: return [2 /*return*/, {
                        pickMethod: pickMethod.data,
                        quantities: quantities.data,
                        itemStorageUnitQuantities: itemStorageUnitQuantities.data,
                        item: item.data,
                        itemShelfLife: (_8 = itemShelfLife.data) !== null && _8 !== void 0 ? _8 : null,
                        trackedEntityExpirations: trackedEntityExpirations,
                        methodData: methodData,
                        tags: tags
                    }];
            }
        });
    });
}
function ItemInventoryRoute() {
    var _a, _b, _c;
    var _d = (0, react_router_1.useLoaderData)(), pickMethod = _d.pickMethod, quantities = _d.quantities, itemStorageUnitQuantities = _d.itemStorageUnitQuantities, item = _d.item, itemShelfLife = _d.itemShelfLife, trackedEntityExpirations = _d.trackedEntityExpirations;
    var items = (0, items_2.useItems)()[0];
    var itemTrackingType = (_a = items.find(function (i) { return i.id === item.id; })) === null || _a === void 0 ? void 0 : _a.itemTrackingType;
    var storageUnits = (0, StorageUnit_1.useStorageUnits)(pickMethod === null || pickMethod === void 0 ? void 0 : pickMethod.locationId);
    return (<react_1.VStack spacing={2}>
      <inventory_1.InventoryDetails itemStorageUnitQuantities={itemStorageUnitQuantities} itemUnitOfMeasureCode={(_b = item.unitOfMeasureCode) !== null && _b !== void 0 ? _b : "EA"} itemTrackingType={itemTrackingType !== null && itemTrackingType !== void 0 ? itemTrackingType : "Inventory"} itemShelfLife={itemShelfLife} trackedEntityExpirations={trackedEntityExpirations} pickMethod={__assign(__assign({}, pickMethod), { defaultStorageUnitId: (_c = pickMethod.defaultStorageUnitId) !== null && _c !== void 0 ? _c : undefined })} quantities={quantities} storageUnits={storageUnits.options}/>
    </react_1.VStack>);
}
