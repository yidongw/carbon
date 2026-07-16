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
var zod_1 = require("zod");
var resources_1 = require("~/modules/resources");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
var addAndIssueValidator = zod_1.z.object({
    itemId: zod_1.z.string().min(1),
    unitOfMeasureCode: zod_1.z.string().min(1),
    // For inventory items
    quantity: zod_1.z.number().optional(),
    // For tracked items (serial/batch)
    children: zod_1.z
        .array(zod_1.z.object({
        trackedEntityId: zod_1.z.string(),
        quantity: zod_1.z.number()
    }))
        .optional()
});
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, userId, companyId, dispatchId, viewClient, dispatch, json, validation, _d, itemId, unitOfMeasureCode, quantity, children, totalQuantity, serviceRole, issue, splitEntities, _i, splitEntities_1, split, e_1, issue;
        var _e, _f;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _g.sent(), userId = _c.userId, companyId = _c.companyId;
                    dispatchId = params.dispatchId;
                    if (!dispatchId) {
                        return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Dispatch ID is required" }, { status: 400 })];
                    }
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "resources"
                        })];
                case 2:
                    viewClient = (_g.sent()).client;
                    return [4 /*yield*/, (0, resources_1.getMaintenanceDispatch)(viewClient, dispatchId)];
                case 3:
                    dispatch = _g.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: (0, resources_1.isMaintenanceDispatchLocked)((_e = dispatch.data) === null || _e === void 0 ? void 0 : _e.status),
                            redirectTo: path_1.path.to.maintenanceDispatch(dispatchId),
                            message: "Cannot modify a locked dispatch. Reopen it first."
                        })];
                case 4:
                    _g.sent();
                    return [4 /*yield*/, request.json()];
                case 5:
                    json = _g.sent();
                    validation = addAndIssueValidator.safeParse(json);
                    if (!validation.success) {
                        return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Failed to validate payload" }, { status: 400 })];
                    }
                    _d = validation.data, itemId = _d.itemId, unitOfMeasureCode = _d.unitOfMeasureCode, quantity = _d.quantity, children = _d.children;
                    totalQuantity = children
                        ? children.reduce(function (sum, c) { return sum + c.quantity; }, 0)
                        : (quantity !== null && quantity !== void 0 ? quantity : 0);
                    if (totalQuantity <= 0) {
                        return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Quantity must be greater than 0" }, { status: 400 })];
                    }
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 6:
                    serviceRole = _g.sent();
                    if (!(children && children.length > 0)) return [3 /*break*/, 15];
                    return [4 /*yield*/, serviceRole.functions.invoke("issue", {
                            body: {
                                type: "maintenanceDispatchTrackedEntities",
                                maintenanceDispatchId: dispatchId,
                                itemId: itemId,
                                unitOfMeasureCode: unitOfMeasureCode,
                                children: children,
                                companyId: companyId,
                                userId: userId
                            }
                        })];
                case 7:
                    issue = _g.sent();
                    if (issue.error) {
                        console.error(issue.error);
                        return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Failed to issue tracked items" }, { status: 400 })];
                    }
                    splitEntities = ((_f = issue.data) === null || _f === void 0 ? void 0 : _f.splitEntities) || [];
                    if (!(splitEntities.length > 0)) return [3 /*break*/, 14];
                    _g.label = 8;
                case 8:
                    _g.trys.push([8, 13, , 14]);
                    _i = 0, splitEntities_1 = splitEntities;
                    _g.label = 9;
                case 9:
                    if (!(_i < splitEntities_1.length)) return [3 /*break*/, 12];
                    split = splitEntities_1[_i];
                    return [4 /*yield*/, (0, jobs_1.trigger)("print-job", {
                            sourceDocument: "Split",
                            sourceDocumentId: split.newId,
                            companyId: companyId,
                            userId: userId
                        })];
                case 10:
                    _g.sent();
                    _g.label = 11;
                case 11:
                    _i++;
                    return [3 /*break*/, 9];
                case 12: return [3 /*break*/, 14];
                case 13:
                    e_1 = _g.sent();
                    console.error("Auto-print for split entities failed:", e_1);
                    return [3 /*break*/, 14];
                case 14: return [3 /*break*/, 17];
                case 15: return [4 /*yield*/, serviceRole.functions.invoke("issue", {
                        body: {
                            type: "maintenanceDispatchInventory",
                            maintenanceDispatchId: dispatchId,
                            itemId: itemId,
                            unitOfMeasureCode: unitOfMeasureCode,
                            quantity: totalQuantity,
                            companyId: companyId,
                            userId: userId
                        }
                    })];
                case 16:
                    issue = _g.sent();
                    if (issue.error) {
                        console.error(issue.error);
                        return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Failed to issue from inventory" }, { status: 400 })];
                    }
                    _g.label = 17;
                case 17: return [2 /*return*/, {
                        success: true,
                        message: "Part added and issued successfully"
                    }];
            }
        });
    });
}
