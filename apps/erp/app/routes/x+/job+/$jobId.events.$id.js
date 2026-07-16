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
exports.default = EditProductionEventRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var production_1 = require("~/modules/production");
var Jobs_1 = require("~/modules/production/ui/Jobs");
var resources_1 = require("~/modules/resources");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, id, jobId, _d, jobOperations, workCenters, productionEvent, operationOptions;
        var _e;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        create: "production"
                    })];
                case 1:
                    _c = _f.sent(), client = _c.client, companyId = _c.companyId;
                    id = params.id, jobId = params.jobId;
                    if (!id)
                        throw (0, auth_1.notFound)("id not found");
                    if (!jobId)
                        throw (0, auth_1.notFound)("jobId not found");
                    return [4 /*yield*/, Promise.all([
                            (0, production_1.getJobOperations)(client, jobId),
                            (0, resources_1.getWorkCentersList)(client, companyId),
                            (0, production_1.getProductionEvent)(client, id)
                        ])];
                case 2:
                    _d = _f.sent(), jobOperations = _d[0], workCenters = _d[1], productionEvent = _d[2];
                    operationOptions = (_e = jobOperations.data) === null || _e === void 0 ? void 0 : _e.map(function (operation) {
                        var _a, _b;
                        return ({
                            label: "".concat(operation.description, " - ").concat((_b = (_a = workCenters.data) === null || _a === void 0 ? void 0 : _a.find(function (center) { return center.id === operation.workCenterId; })) === null || _b === void 0 ? void 0 : _b.name),
                            value: operation.id
                        });
                    });
                    if (productionEvent.error) {
                        throw (0, auth_1.notFound)("Failed to fetch production event");
                    }
                    return [2 /*return*/, { productionEvent: productionEvent.data, operationOptions: operationOptions }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, jobId, formData, validation, _d, id, d, update, _e, _f, serviceRole, _g, _h;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "production"
                        })];
                case 1:
                    _c = _j.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    jobId = params.jobId;
                    if (!jobId)
                        throw (0, auth_1.notFound)("jobId or id not found");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _j.sent();
                    return [4 /*yield*/, (0, form_1.validator)(production_1.productionEventValidator).validate(formData)];
                case 3:
                    validation = _j.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, id = _d.id, d = __rest(_d, ["id"]);
                    if (!id)
                        throw new Error("id not found");
                    return [4 /*yield*/, (0, production_1.upsertProductionEvent)(client, __assign(__assign({ id: id }, d), { companyId: companyId, updatedBy: userId }))];
                case 4:
                    update = _j.sent();
                    if (!update.error) return [3 /*break*/, 6];
                    _e = react_router_1.data;
                    _f = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(update.error, "Failed to update production event"))];
                case 5: return [2 /*return*/, _e.apply(void 0, _f.concat([_j.sent()]))];
                case 6:
                    if (!d.endTime) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 7:
                    serviceRole = _j.sent();
                    return [4 /*yield*/, serviceRole.functions.invoke("post-production-event", {
                            body: {
                                productionEventId: id,
                                userId: userId,
                                companyId: companyId
                            }
                        })];
                case 8:
                    _j.sent();
                    _j.label = 9;
                case 9:
                    _g = react_router_1.redirect;
                    _h = ["".concat(path_1.path.to.jobProductionEvents(jobId), "?").concat((0, path_1.getParams)(request))];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated production event"))];
                case 10: throw _g.apply(void 0, _h.concat([_j.sent()]));
            }
        });
    });
}
function EditProductionEventRoute() {
    var _a, _b, _c, _d, _e, _f, _g;
    var _h = (0, react_router_1.useLoaderData)(), productionEvent = _h.productionEvent, operationOptions = _h.operationOptions;
    var initialValues = {
        id: productionEvent === null || productionEvent === void 0 ? void 0 : productionEvent.id,
        type: (_a = productionEvent === null || productionEvent === void 0 ? void 0 : productionEvent.type) !== null && _a !== void 0 ? _a : "Setup",
        jobOperationId: (_b = productionEvent === null || productionEvent === void 0 ? void 0 : productionEvent.jobOperationId) !== null && _b !== void 0 ? _b : "",
        startTime: (_c = productionEvent === null || productionEvent === void 0 ? void 0 : productionEvent.startTime) !== null && _c !== void 0 ? _c : "",
        employeeId: (_d = productionEvent === null || productionEvent === void 0 ? void 0 : productionEvent.employeeId) !== null && _d !== void 0 ? _d : "",
        workCenterId: (_e = productionEvent === null || productionEvent === void 0 ? void 0 : productionEvent.workCenterId) !== null && _e !== void 0 ? _e : "",
        endTime: (_f = productionEvent === null || productionEvent === void 0 ? void 0 : productionEvent.endTime) !== null && _f !== void 0 ? _f : "",
        notes: (_g = productionEvent === null || productionEvent === void 0 ? void 0 : productionEvent.notes) !== null && _g !== void 0 ? _g : ""
    };
    return (<Jobs_1.ProductionEventForm key={initialValues.id} initialValues={initialValues} operationOptions={operationOptions !== null && operationOptions !== void 0 ? operationOptions : []}/>);
}
