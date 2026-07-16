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
exports.linearSyncFunction = exports.syncIssueFromLinearSchema = void 0;
var client_server_1 = require("@carbon/auth/client.server");
var linear_server_1 = require("@carbon/ee/linear.server");
var schemas_js_1 = require("../../../schemas.js");
Object.defineProperty(exports, "syncIssueFromLinearSchema", { enumerable: true, get: function () { return schemas_js_1.syncIssueFromLinearSchema; } });
var client_1 = require("../../client");
exports.linearSyncFunction = client_1.inngest.createFunction({ id: "sync-issue-from-linear", retries: 1 }, { event: "carbon/linear-sync" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var linear, payload, carbon, _c, company, integration, mapping, action, fullIssue, assignee, linearUser, employees, _d, updated;
    var event = _b.event, step = _b.step;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                linear = (0, linear_server_1.getLinearClient)();
                payload = schemas_js_1.syncIssueFromLinearSchema.parse(event.data);
                console.info("Linear webhook received: ".concat(payload));
                console.info("Payload:", payload);
                carbon = (0, client_server_1.getCarbonServiceRole)();
                return [4 /*yield*/, Promise.all([
                        carbon.from("company").select("*").eq("id", payload.companyId).single(),
                        carbon
                            .from("companyIntegration")
                            .select("*")
                            .eq("companyId", payload.companyId)
                            .eq("id", "linear")
                            .single()
                    ])];
            case 1:
                _c = _e.sent(), company = _c[0], integration = _c[1];
                if (company.error || !company.data) {
                    throw new Error("Failed to fetch company from Carbon");
                }
                if (integration.error || !integration.data) {
                    throw new Error("Failed to fetch integration from Carbon");
                }
                return [4 /*yield*/, carbon
                        .from("externalIntegrationMapping")
                        .select("entityId")
                        .eq("entityType", "nonConformanceActionTask")
                        .eq("integration", "linear")
                        .eq("externalId", payload.event.data.id)
                        .eq("companyId", payload.companyId)
                        .maybeSingle()];
            case 2:
                mapping = _e.sent();
                action = mapping.data
                    ? { data: { id: mapping.data.entityId } }
                    : { data: null };
                if (!action.data) {
                    return [2 /*return*/, {
                            success: false,
                            message: "No linked action found for Linear issue ID ".concat(payload.event.data.id)
                        }];
                }
                return [4 /*yield*/, linear.getIssueById(payload.companyId, payload.event.data.id)];
            case 3:
                fullIssue = _e.sent();
                if (!fullIssue) {
                    return [2 /*return*/, {
                            success: false,
                            message: "Failed to fetch issue ".concat(payload.event.data.id, " from Linear")
                        }];
                }
                assignee = null;
                if (!payload.event.data.assigneeId) return [3 /*break*/, 8];
                return [4 /*yield*/, linear.getUsers(payload.companyId, {
                        id: payload.event.data.assigneeId
                    })];
            case 4:
                linearUser = (_e.sent())[0];
                if (!(linearUser === null || linearUser === void 0 ? void 0 : linearUser.email)) return [3 /*break*/, 6];
                return [4 /*yield*/, (0, linear_server_1.getCompanyEmployees)(carbon, payload.companyId, [
                        linearUser.email
                    ])];
            case 5:
                _d = _e.sent();
                return [3 /*break*/, 7];
            case 6:
                _d = [];
                _e.label = 7;
            case 7:
                employees = _d;
                assignee = employees.length > 0 ? employees[0].userId : null;
                _e.label = 8;
            case 8: return [4 /*yield*/, (0, linear_server_1.linkActionToLinearIssue)(carbon, payload.companyId, {
                    actionId: action.data.id,
                    issue: fullIssue,
                    assignee: assignee,
                    syncNotes: true
                })];
            case 9:
                updated = _e.sent();
                if (!updated || updated.error) {
                    return [2 /*return*/, {
                            success: false,
                            message: "Failed to update action for Linear issue ID ".concat(payload.event.data.id)
                        }];
                }
                return [2 /*return*/, {
                        success: true,
                        message: "Synced Linear issue ".concat(payload.event.data.id)
                    }];
        }
    });
}); });
