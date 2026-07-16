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
exports.getLinearIssueFromExternalId = exports.getCompanyEmployees = void 0;
exports.getLinearIntegration = getLinearIntegration;
exports.linkActionToLinearIssue = linkActionToLinearIssue;
exports.unlinkActionFromLinearIssue = unlinkActionFromLinearIssue;
var client_server_1 = require("@carbon/auth/client.server");
var richtext_1 = require("./richtext");
var types_1 = require("./types");
var utils_1 = require("./utils");
function getLinearIntegration(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("companyIntegration")
                        .select("*")
                        .eq("companyId", companyId)
                        .eq("id", "linear")
                        .limit(1)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function linkActionToLinearIssue(client, companyId, input) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, success, notes, updateData, result, serviceRoleForLink;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = types_1.LinearIssueSchema.safeParse(input.issue), data = _a.data, success = _a.success;
                    if (!success)
                        return [2 /*return*/, null];
                    notes = undefined;
                    if (input.syncNotes && data.description) {
                        try {
                            notes = (0, richtext_1.markdownToTiptap)(data.description);
                        }
                        catch (e) {
                            console.error("Failed to convert Linear description to Tiptap:", e);
                        }
                    }
                    updateData = {
                        assignee: input.assignee,
                        status: (0, utils_1.mapLinearStatusToCarbonStatus)(data.state.type),
                        dueDate: data.dueDate
                    };
                    // Only update notes if we successfully converted the description
                    if (notes !== undefined) {
                        updateData.notes = notes;
                    }
                    return [4 /*yield*/, client
                            .from("nonConformanceActionTask")
                            .update(updateData)
                            .eq("companyId", companyId)
                            .eq("id", input.actionId)
                            .select("nonConformanceId")];
                case 1:
                    result = _b.sent();
                    serviceRoleForLink = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRoleForLink
                            .from("externalIntegrationMapping")
                            .delete()
                            .eq("entityType", "nonConformanceActionTask")
                            .eq("entityId", input.actionId)
                            .eq("integration", "linear")];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, client.from("externalIntegrationMapping").insert({
                            entityType: "nonConformanceActionTask",
                            entityId: input.actionId,
                            integration: "linear",
                            externalId: data.id,
                            metadata: data,
                            companyId: companyId
                        })];
                case 3:
                    _b.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
var getCompanyEmployees = function (client, companyId, emails) { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, client
                    .from("userToCompany")
                    .select("userId,user(email)")
                    .eq("companyId", companyId)
                    .eq("role", "employee")
                    .in("user.email", emails)];
            case 1:
                users = _b.sent();
                return [2 /*return*/, (_a = users.data) !== null && _a !== void 0 ? _a : []];
        }
    });
}); };
exports.getCompanyEmployees = getCompanyEmployees;
function unlinkActionFromLinearIssue(client, companyId, input) {
    return __awaiter(this, void 0, void 0, function () {
        var serviceRole;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("externalIntegrationMapping")
                            .delete()
                            .eq("entityType", "nonConformanceActionTask")
                            .eq("entityId", input.actionId)
                            .eq("integration", "linear")];
                case 1:
                    _a.sent();
                    // Return the nonConformanceId for the action task
                    return [2 /*return*/, client
                            .from("nonConformanceActionTask")
                            .select("nonConformanceId")
                            .eq("companyId", companyId)
                            .eq("id", input.actionId)];
            }
        });
    });
}
var getLinearIssueFromExternalId = function (client, companyId, actionId) { return __awaiter(void 0, void 0, void 0, function () {
    var mapping, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client
                    .from("externalIntegrationMapping")
                    .select("metadata")
                    .eq("entityType", "nonConformanceActionTask")
                    .eq("entityId", actionId)
                    .eq("integration", "linear")
                    .eq("companyId", companyId)
                    .maybeSingle()];
            case 1:
                mapping = (_a.sent()).data;
                if (!mapping)
                    return [2 /*return*/, null];
                data = types_1.LinearIssueSchema.safeParse(mapping.metadata).data;
                if (!data)
                    return [2 /*return*/, null];
                return [2 /*return*/, data];
        }
    });
}); };
exports.getLinearIssueFromExternalId = getLinearIssueFromExternalId;
