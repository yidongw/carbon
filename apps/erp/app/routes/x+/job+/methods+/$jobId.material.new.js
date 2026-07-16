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
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var production_1 = require("~/modules/production");
var form_2 = require("~/utils/form");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, companyId, userId, jobId, formData, validation, serviceRole, insertJobMaterial, _d, _e, jobMaterialId, _f, _g, job, isReleased, materialMakeMethod, _h, _j, makeMethod, _k, _l, promises, _m, recalculateResult, recalculateDependencies, _o, _p, _q, _r;
        var _s, _t, _u, _v;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_w) {
            switch (_w.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "production"
                        })];
                case 1:
                    _c = _w.sent(), companyId = _c.companyId, userId = _c.userId;
                    jobId = params.jobId;
                    if (!jobId) {
                        throw new Error("jobId not found");
                    }
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _w.sent();
                    return [4 /*yield*/, (0, form_1.validator)(production_1.jobMaterialValidator).validate(formData)];
                case 3:
                    validation = _w.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, production_1.upsertJobMaterial)(serviceRole, __assign(__assign({}, validation.data), { jobId: jobId, companyId: companyId, createdBy: userId, customFields: (0, form_2.setCustomFields)(formData) }))];
                case 4:
                    insertJobMaterial = _w.sent();
                    if (!insertJobMaterial.error) return [3 /*break*/, 6];
                    _d = react_router_1.data;
                    _e = [{
                            id: null
                        }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(insertJobMaterial.error, "Failed to insert job material"))];
                case 5: return [2 /*return*/, _d.apply(void 0, _e.concat([_w.sent()]))];
                case 6:
                    jobMaterialId = (_s = insertJobMaterial.data) === null || _s === void 0 ? void 0 : _s.id;
                    if (!!jobMaterialId) return [3 /*break*/, 8];
                    _f = react_router_1.data;
                    _g = [{
                            id: null
                        }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(insertJobMaterial, "Failed to insert job material"))];
                case 7: return [2 /*return*/, _f.apply(void 0, _g.concat([_w.sent()]))];
                case 8: return [4 /*yield*/, serviceRole
                        .from("job")
                        .select("status")
                        .eq("id", jobId)
                        .single()];
                case 9:
                    job = _w.sent();
                    isReleased = !["Draft", "Planned"].includes((_u = (_t = job.data) === null || _t === void 0 ? void 0 : _t.status) !== null && _u !== void 0 ? _u : "");
                    if (!(validation.data.methodType === "Make to Order")) return [3 /*break*/, 15];
                    return [4 /*yield*/, serviceRole
                            .from("jobMaterialWithMakeMethodId")
                            .select("*")
                            .eq("id", jobMaterialId)
                            .single()];
                case 10:
                    materialMakeMethod = _w.sent();
                    if (!materialMakeMethod.error) return [3 /*break*/, 12];
                    _h = react_router_1.data;
                    _j = [{
                            id: null
                        }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(materialMakeMethod.error, "Failed to get material make method"))];
                case 11: return [2 /*return*/, _h.apply(void 0, _j.concat([_w.sent()]))];
                case 12: return [4 /*yield*/, (0, production_1.upsertJobMaterialMakeMethod)(serviceRole, {
                        sourceId: validation.data.itemId,
                        targetId: (_v = materialMakeMethod.data) === null || _v === void 0 ? void 0 : _v.jobMaterialMakeMethodId,
                        companyId: companyId,
                        userId: userId
                    })];
                case 13:
                    makeMethod = _w.sent();
                    if (!makeMethod.error) return [3 /*break*/, 15];
                    _k = react_router_1.data;
                    _l = [{
                            id: jobMaterialId
                        }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(makeMethod.error, "Failed to insert job material make method"))];
                case 14: return [2 /*return*/, _k.apply(void 0, _l.concat([_w.sent()]))];
                case 15:
                    if (!isReleased) return [3 /*break*/, 20];
                    promises = [
                        (0, production_1.recalculateJobMakeMethodRequirements)(serviceRole, {
                            id: validation.data.jobMakeMethodId,
                            companyId: companyId,
                            userId: userId
                        })
                    ];
                    promises.push((0, production_1.recalculateJobOperationDependencies)(serviceRole, {
                        jobId: jobId,
                        companyId: companyId,
                        userId: userId
                    }));
                    return [4 /*yield*/, Promise.all(promises)];
                case 16:
                    _m = _w.sent(), recalculateResult = _m[0], recalculateDependencies = _m[1];
                    if (!recalculateResult.error) return [3 /*break*/, 18];
                    _o = react_router_1.data;
                    _p = [{ id: jobMaterialId }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(recalculateResult.error, "Failed to recalculate job make method requirements"))];
                case 17: return [2 /*return*/, _o.apply(void 0, _p.concat([_w.sent()]))];
                case 18:
                    if (!(recalculateDependencies === null || recalculateDependencies === void 0 ? void 0 : recalculateDependencies.error)) return [3 /*break*/, 20];
                    _q = react_router_1.data;
                    _r = [{ id: jobMaterialId }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(recalculateDependencies.error, "Failed to recalculate job operation dependencies"))];
                case 19: return [2 /*return*/, _q.apply(void 0, _r.concat([_w.sent()]))];
                case 20: return [2 /*return*/, {
                        id: jobMaterialId,
                        success: true,
                        message: "Material created"
                    }];
            }
        });
    });
}
