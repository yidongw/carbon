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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = loader;
exports.action = action;
exports.default = EditProjectionRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var date_1 = require("@internationalized/date");
var react_router_1 = require("react-router");
var production_models_1 = require("~/modules/production/production.models");
var production_service_1 = require("~/modules/production/production.service");
var DemandProjectionForm_1 = require("~/modules/production/ui/Projection/DemandProjectionForm");
var shared_server_1 = require("~/modules/shared/shared.server");
var path_1 = require("~/utils/path");
var WEEKS_TO_PROJECT = 52;
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, itemId, locationId, periods, existingProjections, weekValues, initialValues;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "production"
                    })];
                case 1:
                    _c = _d.sent(), client = _c.client, companyId = _c.companyId;
                    itemId = params.itemId, locationId = params.locationId;
                    if (!itemId || !locationId) {
                        throw new Error("Item ID and Location ID are required");
                    }
                    return [4 /*yield*/, (0, shared_server_1.getOrCreatePeriods)((0, date_1.today)((0, date_1.getLocalTimeZone)()), WEEKS_TO_PROJECT)];
                case 2:
                    periods = _d.sent();
                    return [4 /*yield*/, (0, production_service_1.getDemandProjections)(client, {
                            itemId: itemId,
                            locationId: locationId,
                            companyId: companyId,
                            periodIds: periods.map(function (p) { return p.id; })
                        })];
                case 3:
                    existingProjections = _d.sent();
                    weekValues = {};
                    if (existingProjections.data) {
                        periods.forEach(function (period, index) {
                            var _a, _b;
                            var forecast = (_a = existingProjections.data) === null || _a === void 0 ? void 0 : _a.find(function (f) { return f.periodId === period.id; });
                            weekValues["week".concat(index)] = (_b = forecast === null || forecast === void 0 ? void 0 : forecast.forecastQuantity) !== null && _b !== void 0 ? _b : 0;
                        });
                    }
                    initialValues = __assign({ itemId: itemId, locationId: locationId }, weekValues);
                    return [2 /*return*/, {
                            periods: periods,
                            initialValues: initialValues
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, routeItemId, routeLocationId, formData, validation, _d, periods, weekData, demandProjections, i, weekKey, quantity, result, _e, _f, _g, _h;
        var _j;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "production"
                        })];
                case 1:
                    _c = _k.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    routeItemId = params.itemId, routeLocationId = params.locationId;
                    if (!routeItemId || !routeLocationId) {
                        throw new Error("Item ID and Location ID are required");
                    }
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _k.sent();
                    return [4 /*yield*/, (0, form_1.validator)(production_models_1.demandProjectionValidator).validate(formData)];
                case 3:
                    validation = _k.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, periods = _d.periods, weekData = __rest(_d, ["periods"]);
                    demandProjections = [];
                    for (i = 0; i < 52; i++) {
                        weekKey = "week".concat(i);
                        quantity = weekData[weekKey];
                        if (periods === null || periods === void 0 ? void 0 : periods[i]) {
                            // Include all periods, even with 0 quantity (to handle deletions)
                            demandProjections.push({
                                itemId: routeItemId,
                                locationId: routeLocationId,
                                periodId: periods[i],
                                forecastQuantity: (_j = Number(quantity)) !== null && _j !== void 0 ? _j : 0,
                                companyId: companyId,
                                createdBy: userId,
                                updatedBy: userId
                            });
                        }
                    }
                    return [4 /*yield*/, (0, production_service_1.upsertDemandProjections)(client, demandProjections)];
                case 4:
                    result = _k.sent();
                    if (!result.error) return [3 /*break*/, 6];
                    _e = react_router_1.data;
                    _f = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to update demand forecasts"))];
                case 5: return [2 /*return*/, _e.apply(void 0, _f.concat([_k.sent()]))];
                case 6:
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.demandProjections + "?location=".concat(routeLocationId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Demand forecasts updated successfully"))];
                case 7: return [2 /*return*/, _g.apply(void 0, _h.concat([_k.sent()]))];
            }
        });
    });
}
function EditProjectionRoute() {
    var initialValues = (0, react_router_1.useLoaderData)().initialValues;
    var navigate = (0, react_router_1.useNavigate)();
    return (<DemandProjectionForm_1.default initialValues={initialValues} isEditing onClose={function () { return navigate(-1); }}/>);
}
