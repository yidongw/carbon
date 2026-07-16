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
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var jobs_1 = require("@carbon/jobs");
var react_router_1 = require("react-router");
var models_1 = require("~/services/models");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, userId, companyId, payload, validation, _d, materialId, jobOperationId, itemId, parentTrackedEntityId, children, overrideExpired, overrideReason, serviceRole, issue, message, ctx, body, _e, splitEntities, warning, locationId, workCenterId, op, wc, _i, splitEntities_1, split, e_1;
        var _f, _g, _h, _j, _k;
        var request = _b.request;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _l.sent(), userId = _c.userId, companyId = _c.companyId;
                    return [4 /*yield*/, request.json()];
                case 2:
                    payload = _l.sent();
                    validation = models_1.issueTrackedEntityValidator.safeParse(payload);
                    if (!validation.success) {
                        return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Failed to validate payload" }, { status: 400 })];
                    }
                    _d = validation.data, materialId = _d.materialId, jobOperationId = _d.jobOperationId, itemId = _d.itemId, parentTrackedEntityId = _d.parentTrackedEntityId, children = _d.children, overrideExpired = _d.overrideExpired, overrideReason = _d.overrideReason;
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 3:
                    serviceRole = _l.sent();
                    return [4 /*yield*/, serviceRole.functions.invoke("issue", {
                            body: {
                                type: "trackedEntitiesToOperation",
                                materialId: materialId,
                                jobOperationId: jobOperationId,
                                itemId: itemId,
                                parentTrackedEntityId: parentTrackedEntityId,
                                children: children,
                                overrideExpired: overrideExpired,
                                overrideReason: overrideReason,
                                companyId: companyId,
                                userId: userId
                            }
                        })];
                case 4:
                    issue = _l.sent();
                    if (!issue.error) return [3 /*break*/, 11];
                    console.error(issue.error);
                    message = "Failed to issue material";
                    ctx = (_f = issue.error) === null || _f === void 0 ? void 0 : _f.context;
                    if (!(ctx && typeof ctx.json === "function")) return [3 /*break*/, 9];
                    _l.label = 5;
                case 5:
                    _l.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, ctx.clone().json()];
                case 6:
                    body = _l.sent();
                    if (body && typeof body.message === "string") {
                        message = body.message;
                    }
                    return [3 /*break*/, 8];
                case 7:
                    _e = _l.sent();
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 10];
                case 9:
                    if (issue.error.message) {
                        message = issue.error.message;
                    }
                    _l.label = 10;
                case 10: return [2 /*return*/, (0, react_router_1.data)({ success: false, message: message }, { status: 400 })];
                case 11:
                    splitEntities = ((_g = issue.data) === null || _g === void 0 ? void 0 : _g.splitEntities) || [];
                    warning = (_h = issue.data) === null || _h === void 0 ? void 0 : _h.warning;
                    if (!(splitEntities.length > 0)) return [3 /*break*/, 22];
                    _l.label = 12;
                case 12:
                    _l.trys.push([12, 21, , 22]);
                    locationId = void 0;
                    workCenterId = void 0;
                    if (!jobOperationId) return [3 /*break*/, 14];
                    return [4 /*yield*/, serviceRole
                            .from("jobOperation")
                            .select("workCenterId")
                            .eq("id", jobOperationId)
                            .single()];
                case 13:
                    op = (_l.sent()).data;
                    workCenterId = (_j = op === null || op === void 0 ? void 0 : op.workCenterId) !== null && _j !== void 0 ? _j : undefined;
                    _l.label = 14;
                case 14:
                    if (!workCenterId) return [3 /*break*/, 16];
                    return [4 /*yield*/, serviceRole
                            .from("workCenter")
                            .select("locationId")
                            .eq("id", workCenterId)
                            .single()];
                case 15:
                    wc = (_l.sent()).data;
                    locationId = (_k = wc === null || wc === void 0 ? void 0 : wc.locationId) !== null && _k !== void 0 ? _k : undefined;
                    _l.label = 16;
                case 16:
                    _i = 0, splitEntities_1 = splitEntities;
                    _l.label = 17;
                case 17:
                    if (!(_i < splitEntities_1.length)) return [3 /*break*/, 20];
                    split = splitEntities_1[_i];
                    return [4 /*yield*/, (0, jobs_1.trigger)("print-job", {
                            sourceDocument: "Split",
                            sourceDocumentId: split.newId,
                            companyId: companyId,
                            userId: userId,
                            locationId: locationId,
                            workCenterId: workCenterId
                        })];
                case 18:
                    _l.sent();
                    _l.label = 19;
                case 19:
                    _i++;
                    return [3 /*break*/, 17];
                case 20: return [3 /*break*/, 22];
                case 21:
                    e_1 = _l.sent();
                    console.error("Auto-print for split entities failed:", e_1);
                    return [3 /*break*/, 22];
                case 22: return [2 /*return*/, {
                        success: true,
                        message: "Material issued successfully",
                        splitEntities: splitEntities,
                        warning: warning
                    }];
            }
        });
    });
}
