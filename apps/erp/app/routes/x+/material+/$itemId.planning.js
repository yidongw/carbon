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
exports.action = action;
exports.default = MateriallanningRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var items_1 = require("~/modules/items");
var Item_1 = require("~/modules/items/ui/Item");
var ItemPlanningChart_1 = require("~/modules/items/ui/Item/ItemPlanningChart");
var resources_1 = require("~/modules/resources");
var users_server_1 = require("~/modules/users/users.server");
var form_2 = require("~/utils/form");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, itemId, url, searchParams, locationId, userDefaults, _d, _e, locations, _f, _g, materialPlanning, _h, _j;
        var _k, _l, _m, _o;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "parts"
                    })];
                case 1:
                    _c = _p.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    itemId = params.itemId;
                    if (!itemId)
                        throw new Error("Could not find itemId");
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    locationId = searchParams.get("location");
                    if (!!locationId) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, users_server_1.getUserDefaults)(client, userId, companyId)];
                case 2:
                    userDefaults = _p.sent();
                    if (!userDefaults.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.material(itemId)];
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
                    _g = [path_1.path.to.material(itemId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(locations.error, "Failed to load any locations"))];
                case 7: throw _f.apply(void 0, _g.concat([_p.sent()]));
                case 8:
                    locationId = (_o = locations.data) === null || _o === void 0 ? void 0 : _o[0].id;
                    _p.label = 9;
                case 9: return [4 /*yield*/, (0, items_1.getItemPlanning)(client, itemId, companyId, locationId)];
                case 10:
                    materialPlanning = _p.sent();
                    if (!(materialPlanning.error || !materialPlanning.data)) return [3 /*break*/, 12];
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.material(itemId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(materialPlanning.error, "Failed to load material planning"))];
                case 11: throw _h.apply(void 0, _j.concat([_p.sent()]));
                case 12: return [2 /*return*/, {
                        materialPlanning: materialPlanning.data,
                        locationId: locationId
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, itemId, formData, validation, updateMateriallanning, _d, _e, _f, _g;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "parts"
                        })];
                case 1:
                    _c = _h.sent(), client = _c.client, userId = _c.userId;
                    itemId = params.itemId;
                    if (!itemId)
                        throw new Error("Could not find itemId");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _h.sent();
                    return [4 /*yield*/, (0, form_1.validator)(items_1.itemPlanningValidator).validate(formData)];
                case 3:
                    validation = _h.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    return [4 /*yield*/, (0, items_1.upsertItemPlanning)(client, __assign(__assign({}, validation.data), { itemId: itemId, updatedBy: userId, customFields: (0, form_2.setCustomFields)(formData) }))];
                case 4:
                    updateMateriallanning = _h.sent();
                    if (!updateMateriallanning.error) return [3 /*break*/, 6];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.material(itemId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateMateriallanning.error, "Failed to update material planning"))];
                case 5: throw _d.apply(void 0, _e.concat([_h.sent()]));
                case 6:
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.materialPlanningLocation(itemId, validation.data.locationId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated material planning"))];
                case 7: throw _f.apply(void 0, _g.concat([_h.sent()]));
            }
        });
    });
}
function MateriallanningRoute() {
    var _a, _b;
    var sharedMaterialsData = (0, hooks_1.useRouteData)(path_1.path.to.materialRoot);
    var _c = (0, react_router_1.useLoaderData)(), materialPlanning = _c.materialPlanning, locationId = _c.locationId;
    if (!sharedMaterialsData)
        throw new Error("Could not load shared materials data");
    return (<react_1.VStack spacing={2} className="p-2">
      <Item_1.ItemPlanningForm key={materialPlanning.itemId} initialValues={__assign(__assign({}, materialPlanning), (0, form_2.getCustomFields)(materialPlanning.customFields))} locations={(_a = sharedMaterialsData.locations) !== null && _a !== void 0 ? _a : []} type="Material"/>
      <ItemPlanningChart_1.ItemPlanningChart itemId={materialPlanning.itemId} locationId={locationId} safetyStock={materialPlanning.reorderingPolicy === "Demand-Based Reorder"
            ? ((_b = materialPlanning.demandAccumulationSafetyStock) !== null && _b !== void 0 ? _b : 0)
            : undefined}/>
    </react_1.VStack>);
}
