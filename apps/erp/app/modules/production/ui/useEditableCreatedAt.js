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
exports.usePickupCreatedAtSave = usePickupCreatedAtSave;
exports.useProductionQuantityLineCreatedAtSave = useProductionQuantityLineCreatedAtSave;
exports.useProductionQuantityReportCreatedAtSave = useProductionQuantityReportCreatedAtSave;
var auth_1 = require("@carbon/auth");
var react_1 = require("react");
var hooks_1 = require("~/hooks");
function useCreatedAtMutationContext() {
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _a = (0, hooks_1.useUser)(), userId = _a.id, company = _a.company;
    return {
        carbon: carbon,
        userId: userId,
        companyId: company.id
    };
}
function usePickupCreatedAtSave() {
    var _this = this;
    var permissions = (0, hooks_1.usePermissions)();
    var _a = useCreatedAtMutationContext(), carbon = _a.carbon, userId = _a.userId, companyId = _a.companyId;
    var saveCreatedAt = (0, react_1.useCallback)(function (_newValue, row) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!carbon)
                throw new Error("Carbon client not found");
            return [2 /*return*/, carbon
                    .from("jobOperationPickup")
                    .update({
                    createdAt: _newValue,
                    updatedBy: userId,
                    updatedAt: new Date().toISOString()
                })
                    .eq("id", row.id)
                    .eq("companyId", companyId)];
        });
    }); }, [carbon, companyId, userId]);
    return {
        saveCreatedAt: saveCreatedAt,
        canEdit: permissions.can("update", "production")
    };
}
function useProductionQuantityLineCreatedAtSave() {
    var _this = this;
    var permissions = (0, hooks_1.usePermissions)();
    var _a = useCreatedAtMutationContext(), carbon = _a.carbon, userId = _a.userId, companyId = _a.companyId;
    var saveCreatedAt = (0, react_1.useCallback)(function (newValue, row) { return __awaiter(_this, void 0, void 0, function () {
        var reportUpdate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!carbon)
                        throw new Error("Carbon client not found");
                    if (row.actorKind === "supplier") {
                        return [2 /*return*/, carbon
                                .from("jobOperationSupplierQuantity")
                                .update({ createdAt: newValue })
                                .eq("id", row.id)
                                .eq("companyId", companyId)];
                    }
                    if (!row.reportId) return [3 /*break*/, 2];
                    return [4 /*yield*/, carbon
                            .from("productionQuantityReport")
                            .update({
                            createdAt: newValue,
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .eq("id", row.reportId)
                            .eq("companyId", companyId)];
                case 1:
                    reportUpdate = _a.sent();
                    if (reportUpdate.error)
                        return [2 /*return*/, reportUpdate];
                    return [2 /*return*/, carbon
                            .from("productionQuantity")
                            .update({
                            createdAt: newValue,
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .eq("reportId", row.reportId)
                            .eq("companyId", companyId)];
                case 2: return [2 /*return*/, carbon
                        .from("productionQuantity")
                        .update({
                        createdAt: newValue,
                        updatedBy: userId,
                        updatedAt: new Date().toISOString()
                    })
                        .eq("id", row.id)
                        .eq("companyId", companyId)];
            }
        });
    }); }, [carbon, companyId, userId]);
    return {
        saveCreatedAt: saveCreatedAt,
        canEdit: permissions.can("update", "production")
    };
}
function useProductionQuantityReportCreatedAtSave() {
    var _this = this;
    var permissions = (0, hooks_1.usePermissions)();
    var _a = useCreatedAtMutationContext(), carbon = _a.carbon, userId = _a.userId, companyId = _a.companyId;
    var saveCreatedAt = (0, react_1.useCallback)(function (newValue, row) { return __awaiter(_this, void 0, void 0, function () {
        var reportUpdate, linesUpdate, approvalUpdate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!carbon)
                        throw new Error("Carbon client not found");
                    return [4 /*yield*/, carbon
                            .from("productionQuantityReport")
                            .update({
                            createdAt: newValue,
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .eq("id", row.reportId)
                            .eq("companyId", companyId)];
                case 1:
                    reportUpdate = _a.sent();
                    if (reportUpdate.error)
                        return [2 /*return*/, reportUpdate];
                    return [4 /*yield*/, carbon
                            .from("productionQuantity")
                            .update({
                            createdAt: newValue,
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .eq("reportId", row.reportId)
                            .eq("companyId", companyId)];
                case 2:
                    linesUpdate = _a.sent();
                    if (linesUpdate.error)
                        return [2 /*return*/, linesUpdate];
                    if (!row.approvalRequestId) return [3 /*break*/, 4];
                    return [4 /*yield*/, carbon
                            .from("approvalRequest")
                            .update({ requestedAt: newValue })
                            .eq("id", row.approvalRequestId)
                            .eq("companyId", companyId)];
                case 3:
                    approvalUpdate = _a.sent();
                    if (approvalUpdate.error)
                        return [2 /*return*/, approvalUpdate];
                    _a.label = 4;
                case 4: return [2 /*return*/, reportUpdate];
            }
        });
    }); }, [carbon, companyId, userId]);
    return {
        saveCreatedAt: saveCreatedAt,
        canEdit: permissions.can("update", "production")
    };
}
