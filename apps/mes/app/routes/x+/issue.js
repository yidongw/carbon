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
var session_server_1 = require("@carbon/auth/session.server");
var storage_rules_server_1 = require("@carbon/ee/storage-rules.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var models_1 = require("~/services/models");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, userId, companyId, formData, validation, _d, jobOperationId, materialId, itemId, quantity, adjustmentType, serviceRole, acknowledged, jobOpRow, ruleEval, issue, _e, _f;
        var _g, _h, _j;
        var request = _b.request;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _k.sent(), userId = _c.userId, companyId = _c.companyId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _k.sent();
                    return [4 /*yield*/, (0, form_1.validator)(models_1.issueValidator).validate(formData)];
                case 3:
                    validation = _k.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, jobOperationId = _d.jobOperationId, materialId = _d.materialId, itemId = _d.itemId, quantity = _d.quantity, adjustmentType = _d.adjustmentType;
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 4:
                    serviceRole = _k.sent();
                    acknowledged = formData.get("acknowledged") === "true";
                    return [4 /*yield*/, serviceRole
                            .from("jobOperation")
                            .select("workCenterId")
                            .eq("id", jobOperationId)
                            .maybeSingle()];
                case 5:
                    jobOpRow = (_k.sent()).data;
                    if (!(jobOpRow === null || jobOpRow === void 0 ? void 0 : jobOpRow.workCenterId)) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, storage_rules_server_1.evaluateLinesForSurface)({
                            client: serviceRole,
                            companyId: companyId,
                            userId: userId,
                            targetType: "workCenter",
                            surface: "materialIssue",
                            lines: [
                                {
                                    lineId: jobOperationId,
                                    itemId: itemId,
                                    workCenterId: jobOpRow.workCenterId,
                                    operation: {
                                        id: jobOperationId,
                                        itemId: itemId,
                                        quantity: quantity,
                                        workInstructionId: (_g = jobOpRow
                                            .workInstructionId) !== null && _g !== void 0 ? _g : null
                                    },
                                    quantity: quantity
                                }
                            ]
                        })];
                case 6:
                    ruleEval = _k.sent();
                    if (ruleEval.violations.length > 0 &&
                        (0, storage_rules_server_1.isBlocked)(ruleEval.violations, acknowledged)) {
                        return [2 /*return*/, {
                                error: null,
                                data: null,
                                violations: ruleEval.violations,
                                ruleNames: ruleEval.ruleNames
                            }];
                    }
                    _k.label = 7;
                case 7: return [4 /*yield*/, serviceRole.functions.invoke("issue", {
                        body: {
                            id: jobOperationId,
                            type: "partToOperation",
                            itemId: itemId,
                            materialId: materialId,
                            quantity: quantity,
                            adjustmentType: adjustmentType,
                            companyId: companyId,
                            userId: userId
                        }
                    })];
                case 8:
                    issue = _k.sent();
                    if (!issue.error) return [3 /*break*/, 10];
                    _e = react_router_1.redirect;
                    _f = [(_h = (0, path_1.requestReferrer)(request)) !== null && _h !== void 0 ? _h : path_1.path.to.operations];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(issue.error, "Failed to issue material"))];
                case 9: throw _e.apply(void 0, _f.concat([_k.sent()]));
                case 10: throw (0, react_router_1.redirect)((_j = (0, path_1.requestReferrer)(request)) !== null && _j !== void 0 ? _j : path_1.path.to.operations);
            }
        });
    });
}
