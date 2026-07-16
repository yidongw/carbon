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
exports.handle = void 0;
exports.loader = loader;
exports.action = action;
exports.default = GaugeRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var quality_1 = require("~/modules/quality");
var GaugeForm_1 = require("~/modules/quality/ui/Gauge/GaugeForm");
var form_2 = require("~/utils/form");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Gauges"], ["Gauges"]))),
    to: path_1.path.to.gauges
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var companyId, serviceRole, id, gauge, _c, _d;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "quality"
                    })];
                case 1:
                    companyId = (_e.sent()).companyId;
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 2:
                    serviceRole = _e.sent();
                    id = params.id;
                    if (!id)
                        throw new Error("Could not find id");
                    return [4 /*yield*/, (0, quality_1.getGauge)(serviceRole, id)];
                case 3:
                    gauge = _e.sent();
                    if (!gauge.error) return [3 /*break*/, 5];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.gauges];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(gauge.error, "Failed to load gauge"))];
                case 4: throw _c.apply(void 0, _d.concat([_e.sent()]));
                case 5:
                    if (gauge.data.companyId !== companyId) {
                        throw (0, react_router_1.redirect)(path_1.path.to.gauges);
                    }
                    return [2 /*return*/, {
                            gauge: gauge.data,
                            records: (0, quality_1.getGaugeCalibrationRecordsByGaugeId)(serviceRole, id)
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, id, formData, validation, _d, gaugeId, d, gaugeCalibrationStatus, update, _e, _f, _g, _h;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "quality"
                        })];
                case 1:
                    _c = _j.sent(), client = _c.client, userId = _c.userId;
                    id = params.id;
                    if (!id)
                        throw new Error("Could not find id");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _j.sent();
                    return [4 /*yield*/, (0, form_1.validator)(quality_1.gaugeValidator).validate(formData)];
                case 3:
                    validation = _j.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, gaugeId = _d.gaugeId, d = __rest(_d, ["gaugeId"]);
                    if (!gaugeId)
                        throw new Error("Could not find gaugeId");
                    gaugeCalibrationStatus = d.nextCalibrationDate
                        ? (0, date_1.parseDate)(d.nextCalibrationDate) < (0, date_1.today)((0, date_1.getLocalTimeZone)())
                            ? "Out-of-Calibration"
                            : d.lastCalibrationDate
                                ? "In-Calibration"
                                : "Pending"
                        : "Pending";
                    return [4 /*yield*/, (0, quality_1.updateGauge)(client, {
                            id: id,
                            gaugeId: gaugeId,
                            gaugeCalibrationStatus: gaugeCalibrationStatus,
                            gaugeTypeId: d.gaugeTypeId,
                            gaugeRole: d.gaugeRole,
                            supplierId: d.supplierId || null,
                            modelNumber: d.modelNumber || null,
                            serialNumber: d.serialNumber || null,
                            description: d.description || null,
                            dateAcquired: d.dateAcquired || null,
                            lastCalibrationDate: d.lastCalibrationDate || null,
                            nextCalibrationDate: d.nextCalibrationDate || null,
                            locationId: d.locationId || null,
                            storageUnitId: d.storageUnitId || null,
                            calibrationIntervalInMonths: d.calibrationIntervalInMonths,
                            customFields: (0, form_2.setCustomFields)(formData),
                            updatedBy: userId
                        })];
                case 4:
                    update = _j.sent();
                    if (!update.error) return [3 /*break*/, 6];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.gauge(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(update.error, "Failed to update gauge"))];
                case 5: throw _e.apply(void 0, _f.concat([_j.sent()]));
                case 6:
                    _g = react_router_1.redirect;
                    _h = ["".concat(path_1.path.to.gauges, "?").concat((0, path_1.getParams)(request))];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated gauge"))];
                case 7: throw _g.apply(void 0, _h.concat([_j.sent()]));
            }
        });
    });
}
function GaugeRoute() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("Could not find id");
    var _r = (0, react_router_1.useLoaderData)(), gauge = _r.gauge, records = _r.records;
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.gauges);
    var initialValues = __assign({ id: gauge.id, gaugeId: gauge.gaugeId, supplierId: (_a = gauge.supplierId) !== null && _a !== void 0 ? _a : "", modelNumber: (_b = gauge.modelNumber) !== null && _b !== void 0 ? _b : "", serialNumber: (_c = gauge.serialNumber) !== null && _c !== void 0 ? _c : "", description: (_d = gauge.description) !== null && _d !== void 0 ? _d : "", dateAcquired: (_e = gauge.dateAcquired) !== null && _e !== void 0 ? _e : "", gaugeTypeId: (_f = gauge.gaugeTypeId) !== null && _f !== void 0 ? _f : "", gaugeCalibrationStatus: (_g = gauge.gaugeCalibrationStatus) !== null && _g !== void 0 ? _g : "Pending", gaugeStatus: (_h = gauge.gaugeStatus) !== null && _h !== void 0 ? _h : "Active", gaugeRole: (_j = gauge.gaugeRole) !== null && _j !== void 0 ? _j : "Standard", lastCalibrationDate: (_k = gauge.lastCalibrationDate) !== null && _k !== void 0 ? _k : "", nextCalibrationDate: (_l = gauge.nextCalibrationDate) !== null && _l !== void 0 ? _l : "", locationId: (_m = gauge.locationId) !== null && _m !== void 0 ? _m : "", storageUnitId: (_o = gauge.storageUnitId) !== null && _o !== void 0 ? _o : "", calibrationIntervalInMonths: (_p = gauge.calibrationIntervalInMonths) !== null && _p !== void 0 ? _p : 6 }, (0, form_2.getCustomFields)(gauge.customFields));
    var navigate = (0, react_router_1.useNavigate)();
    return (<GaugeForm_1.default key={id} 
    // @ts-ignore
    initialValues={initialValues} records={records} gaugeTypes={(_q = routeData === null || routeData === void 0 ? void 0 : routeData.gaugeTypes) !== null && _q !== void 0 ? _q : []} onClose={function () { return navigate(-1); }}/>);
}
var templateObject_1;
