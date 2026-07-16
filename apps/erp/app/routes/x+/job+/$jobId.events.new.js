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
exports.default = NewProductionEventRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var production_1 = require("~/modules/production");
var Jobs_1 = require("~/modules/production/ui/Jobs");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, jobId, jobOperations, operationOptions;
        var _c, _d;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        create: "production"
                    })];
                case 1:
                    client = (_e.sent()).client;
                    jobId = params.jobId;
                    if (!jobId)
                        throw (0, auth_1.notFound)("jobId not found");
                    return [4 /*yield*/, (0, production_1.getJobOperations)(client, jobId)];
                case 2:
                    jobOperations = _e.sent();
                    operationOptions = (_d = (_c = jobOperations.data) === null || _c === void 0 ? void 0 : _c.map(function (operation) {
                        var _a;
                        return ({
                            label: (_a = operation.description) !== null && _a !== void 0 ? _a : "",
                            value: operation.id
                        });
                    })) !== null && _d !== void 0 ? _d : [];
                    return [2 /*return*/, { operationOptions: operationOptions }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, jobId, viewClient, job, formData, modal, validation, _d, id, d, insert, _e, _f, serviceRole, _g, _h, _j;
        var _k;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "production"
                        })];
                case 1:
                    _c = _l.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    jobId = params.jobId;
                    if (!jobId) {
                        throw (0, auth_1.notFound)("jobId not found");
                    }
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "production"
                        })];
                case 2:
                    viewClient = (_l.sent()).client;
                    return [4 /*yield*/, (0, production_1.getJob)(viewClient, jobId)];
                case 3:
                    job = _l.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: (0, production_1.isJobLocked)((_k = job.data) === null || _k === void 0 ? void 0 : _k.status),
                            redirectTo: path_1.path.to.job(jobId),
                            message: "Cannot modify a locked job. Reopen it first."
                        })];
                case 4:
                    _l.sent();
                    return [4 /*yield*/, request.formData()];
                case 5:
                    formData = _l.sent();
                    modal = formData.get("type") === "modal";
                    return [4 /*yield*/, (0, form_1.validator)(production_1.productionEventValidator).validate(formData)];
                case 6:
                    validation = _l.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, id = _d.id, d = __rest(_d, ["id"]);
                    return [4 /*yield*/, (0, production_1.upsertProductionEvent)(client, __assign(__assign({}, d), { companyId: companyId, createdBy: userId }))];
                case 7:
                    insert = _l.sent();
                    if (!insert.error) return [3 /*break*/, 9];
                    _e = react_router_1.data;
                    _f = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(insert.error, "Failed to insert production event"))];
                case 8: return [2 /*return*/, _e.apply(void 0, _f.concat([_l.sent()]))];
                case 9:
                    if (!d.endTime) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 10:
                    serviceRole = _l.sent();
                    return [4 /*yield*/, serviceRole.functions.invoke("post-production-event", {
                            body: {
                                productionEventId: insert.data.id,
                                userId: userId,
                                companyId: companyId
                            }
                        })];
                case 11:
                    _l.sent();
                    _l.label = 12;
                case 12:
                    if (!modal) return [3 /*break*/, 13];
                    _g = (0, react_router_1.data)(insert, { status: 201 });
                    return [3 /*break*/, 15];
                case 13:
                    _h = react_router_1.redirect;
                    _j = ["".concat(path_1.path.to.jobProductionEvents(jobId), "?").concat((0, path_1.getParams)(request))];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Production event created"))];
                case 14:
                    _g = _h.apply(void 0, _j.concat([_l.sent()]));
                    _l.label = 15;
                case 15: return [2 /*return*/, _g];
            }
        });
    });
}
function NewProductionEventRoute() {
    var operationOptions = (0, react_router_1.useLoaderData)().operationOptions;
    var initialValues = {
        type: "Labor",
        jobOperationId: "",
        startTime: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
        employeeId: "",
        workCenterId: "",
        notes: ""
    };
    return (<Jobs_1.ProductionEventForm initialValues={initialValues} operationOptions={operationOptions !== null && operationOptions !== void 0 ? operationOptions : []}/>);
}
