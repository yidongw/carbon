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
var storage_rules_server_1 = require("@carbon/ee/storage-rules.server");
var react_router_1 = require("react-router");
var models_1 = require("~/services/models");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, userId, companyId, payload, validation, _d, materialId, parentTrackedEntityId, children, acknowledged, serviceRole, matRow, jobOpRow, workInstructionId, ruleEval, issue;
        var _e, _f, _g, _h, _j, _k, _l;
        var request = _b.request;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _m.sent(), userId = _c.userId, companyId = _c.companyId;
                    return [4 /*yield*/, request.json()];
                case 2:
                    payload = _m.sent();
                    validation = models_1.issueTrackedEntityValidator.safeParse(payload);
                    if (!validation.success) {
                        return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Failed to validate payload" }, { status: 400 })];
                    }
                    _d = validation.data, materialId = _d.materialId, parentTrackedEntityId = _d.parentTrackedEntityId, children = _d.children;
                    if (!materialId) {
                        return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "materialId required" }, { status: 400 })];
                    }
                    acknowledged = Boolean(payload.acknowledged);
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 3:
                    serviceRole = _m.sent();
                    return [4 /*yield*/, serviceRole
                            .from("jobMaterial")
                            .select("jobOperationId, itemId, quantity")
                            .eq("id", materialId)
                            .maybeSingle()];
                case 4:
                    matRow = (_m.sent()).data;
                    if (!(matRow === null || matRow === void 0 ? void 0 : matRow.jobOperationId)) return [3 /*break*/, 7];
                    return [4 /*yield*/, serviceRole
                            .from("jobOperation")
                            .select("workCenterId")
                            .eq("id", matRow.jobOperationId)
                            .maybeSingle()];
                case 5:
                    jobOpRow = (_m.sent()).data;
                    if (!(jobOpRow === null || jobOpRow === void 0 ? void 0 : jobOpRow.workCenterId)) return [3 /*break*/, 7];
                    workInstructionId = (_e = jobOpRow.workInstructionId) !== null && _e !== void 0 ? _e : null;
                    return [4 /*yield*/, (0, storage_rules_server_1.evaluateLinesForSurface)({
                            client: serviceRole,
                            companyId: companyId,
                            userId: userId,
                            targetType: "workCenter",
                            surface: "materialReceive",
                            lines: [
                                {
                                    lineId: materialId,
                                    itemId: (_f = matRow.itemId) !== null && _f !== void 0 ? _f : null,
                                    workCenterId: jobOpRow.workCenterId,
                                    operation: {
                                        id: matRow.jobOperationId,
                                        itemId: (_g = matRow.itemId) !== null && _g !== void 0 ? _g : null,
                                        quantity: (_h = matRow.quantity) !== null && _h !== void 0 ? _h : null,
                                        workInstructionId: workInstructionId
                                    },
                                    quantity: (_j = matRow.quantity) !== null && _j !== void 0 ? _j : 0
                                }
                            ]
                        })];
                case 6:
                    ruleEval = _m.sent();
                    if (ruleEval.violations.length > 0 &&
                        (0, storage_rules_server_1.isBlocked)(ruleEval.violations, acknowledged)) {
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: (_l = (_k = ruleEval.violations[0]) === null || _k === void 0 ? void 0 : _k.message) !== null && _l !== void 0 ? _l : "Rule violation prevented material return",
                                violations: ruleEval.violations,
                                ruleNames: ruleEval.ruleNames
                            }, { status: 400 })];
                    }
                    _m.label = 7;
                case 7: return [4 /*yield*/, serviceRole.functions.invoke("issue", {
                        body: {
                            type: "unconsumeTrackedEntities",
                            materialId: materialId,
                            parentTrackedEntityId: parentTrackedEntityId,
                            children: children,
                            companyId: companyId,
                            userId: userId
                        }
                    })];
                case 8:
                    issue = _m.sent();
                    if (issue.error) {
                        console.error(issue.error);
                        return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Failed to issue material" }, { status: 400 })];
                    }
                    return [2 /*return*/, { success: true, message: "Material unconsumed successfully" }];
            }
        });
    });
}
