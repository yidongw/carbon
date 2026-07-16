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
exports.loader = loader;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var date_1 = require("@internationalized/date");
var react_router_1 = require("react-router");
var items_service_1 = require("~/modules/items/items.service");
var shared_server_1 = require("~/modules/shared/shared.server");
var defaultResponse = {
    demand: [],
    demandForecast: [],
    demandForecastSources: [],
    supply: [],
    periods: [],
    quantityOnHand: 0,
    openSalesOrderLines: [],
    openJobMaterials: [],
    openProductionOrders: [],
    openPurchaseOrderLines: []
};
var WEEKS_TO_FORECAST = 12 * 4;
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, itemId, locationId, periods, _d, demand, supply, quantities, openSalesOrderLines, openJobMaterials, openProductionOrders, openPurchaseOrderLines, demandForecastSources, _e, _f;
        var _g, _h, _j, _k, _l, _m, _o;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "parts"
                    })];
                case 1:
                    _c = _p.sent(), client = _c.client, companyId = _c.companyId;
                    itemId = params.id, locationId = params.locationId;
                    if (!itemId)
                        throw new Error("Could not find itemId");
                    if (!locationId)
                        throw new Error("Could not find locationId");
                    return [4 /*yield*/, (0, shared_server_1.getOrCreatePeriods)((0, date_1.today)((0, date_1.getLocalTimeZone)()), WEEKS_TO_FORECAST)];
                case 2:
                    periods = _p.sent();
                    return [4 /*yield*/, Promise.all([
                            (0, items_service_1.getItemDemand)(client, {
                                itemId: itemId,
                                locationId: locationId,
                                periods: periods.map(function (p) { var _a; return (_a = p.id) !== null && _a !== void 0 ? _a : ""; }),
                                companyId: companyId
                            }),
                            (0, items_service_1.getItemSupply)(client, {
                                itemId: itemId,
                                locationId: locationId,
                                periods: periods.map(function (p) { var _a; return (_a = p.id) !== null && _a !== void 0 ? _a : ""; }),
                                companyId: companyId
                            }),
                            (0, items_service_1.getItemQuantities)(client, itemId, companyId, locationId),
                            (0, items_service_1.getOpenSalesOrderLines)(client, { itemId: itemId, companyId: companyId, locationId: locationId }),
                            (0, items_service_1.getOpenJobMaterials)(client, { itemId: itemId, companyId: companyId, locationId: locationId }),
                            (0, items_service_1.getOpenProductionOrders)(client, { itemId: itemId, companyId: companyId, locationId: locationId }),
                            (0, items_service_1.getOpenPurchaseOrderLines)(client, { itemId: itemId, companyId: companyId, locationId: locationId }),
                            (0, items_service_1.getDemandForecastSources)(client, {
                                itemId: itemId,
                                locationId: locationId,
                                periods: periods.map(function (p) { var _a; return (_a = p.id) !== null && _a !== void 0 ? _a : ""; }),
                                companyId: companyId
                            })
                        ])];
                case 3:
                    _d = _p.sent(), demand = _d[0], supply = _d[1], quantities = _d[2], openSalesOrderLines = _d[3], openJobMaterials = _d[4], openProductionOrders = _d[5], openPurchaseOrderLines = _d[6], demandForecastSources = _d[7];
                    if (!(demand.actuals.length === 0 && demand.forecasts.length === 0)) return [3 /*break*/, 5];
                    _e = react_router_1.data;
                    _f = [defaultResponse];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Failed to load demand"))];
                case 4: return [2 /*return*/, _e.apply(void 0, _f.concat([_p.sent()]))];
                case 5: return [2 /*return*/, {
                        demand: demand.actuals,
                        demandForecast: demand.forecasts,
                        demandForecastSources: (_g = demandForecastSources.data) !== null && _g !== void 0 ? _g : [],
                        supply: __spreadArray(__spreadArray([], supply.actuals, true), supply.forecasts.map(function (f) { return (__assign(__assign({}, f), { actualQuantity: f.forecastQuantity })); }), true),
                        periods: periods,
                        quantityOnHand: (_j = (_h = quantities.data) === null || _h === void 0 ? void 0 : _h.quantityOnHand) !== null && _j !== void 0 ? _j : 0,
                        openSalesOrderLines: (_k = openSalesOrderLines.data) !== null && _k !== void 0 ? _k : [],
                        openJobMaterials: (_l = openJobMaterials.data) !== null && _l !== void 0 ? _l : [],
                        openProductionOrders: (_m = openProductionOrders.data) !== null && _m !== void 0 ? _m : [],
                        openPurchaseOrderLines: (_o = openPurchaseOrderLines.data) !== null && _o !== void 0 ? _o : []
                    }];
            }
        });
    });
}
