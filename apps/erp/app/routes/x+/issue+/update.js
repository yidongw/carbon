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
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var quality_1 = require("~/modules/quality");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, formData, ids, field, value, issues, lockedError, _d, arrayValue, update, serviceRole_1;
        var _e, _f;
        var _this = this;
        var _g;
        var request = _b.request;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "quality"
                    })];
                case 1:
                    _c = _h.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _h.sent();
                    ids = formData.getAll("ids");
                    field = formData.get("field");
                    value = formData.get("value");
                    if (typeof field !== "string" ||
                        (typeof value !== "string" && value !== null)) {
                        return [2 /*return*/, { error: { message: "Invalid form data" }, data: null }];
                    }
                    return [4 /*yield*/, client
                            .from("nonConformance")
                            .select("id, status")
                            .in("id", ids)];
                case 3:
                    issues = _h.sent();
                    lockedError = (0, lockedGuard_server_1.requireUnlockedBulk)({
                        statuses: ((_g = issues.data) !== null && _g !== void 0 ? _g : []).map(function (i) { return i.status; }),
                        checkFn: quality_1.isIssueLocked,
                        message: "Cannot modify a closed issue. Reopen it first."
                    });
                    if (lockedError)
                        return [2 /*return*/, lockedError];
                    _d = field;
                    switch (_d) {
                        case "requiredActionIds": return [3 /*break*/, 4];
                        case "approvalRequirements": return [3 /*break*/, 4];
                        case "source": return [3 /*break*/, 8];
                        case "priority": return [3 /*break*/, 8];
                        case "name": return [3 /*break*/, 8];
                        case "description": return [3 /*break*/, 8];
                        case "locationId": return [3 /*break*/, 8];
                        case "nonConformanceTypeId": return [3 /*break*/, 8];
                        case "openDate": return [3 /*break*/, 8];
                        case "dueDate": return [3 /*break*/, 8];
                        case "closeDate": return [3 /*break*/, 8];
                        case "quantity": return [3 /*break*/, 8];
                        case "itemId": return [3 /*break*/, 8];
                        case "supplierId": return [3 /*break*/, 8];
                    }
                    return [3 /*break*/, 10];
                case 4:
                    arrayValue = value ? value.split(",") : [];
                    return [4 /*yield*/, client
                            .from("nonConformance")
                            .update((_e = {},
                            _e[field] = arrayValue,
                            _e.updatedBy = userId,
                            _e.updatedAt = new Date().toISOString(),
                            _e))
                            .in("id", ids)];
                case 5:
                    update = _h.sent();
                    if (update.error) {
                        console.error(update.error);
                        return [2 /*return*/, {
                                error: { message: "Failed to update issue" },
                                data: null
                            }];
                    }
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 6:
                    serviceRole_1 = _h.sent();
                    return [4 /*yield*/, Promise.all(ids.map(function (id) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, serviceRole_1.functions.invoke("create", {
                                            body: {
                                                type: "nonConformanceTasks",
                                                id: id,
                                                companyId: companyId,
                                                userId: userId
                                            }
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 7:
                    _h.sent();
                    return [2 /*return*/, { data: update.data }];
                case 8: return [4 /*yield*/, client
                        .from("nonConformance")
                        .update((_f = {},
                        _f[field] = value ? value : null,
                        _f.updatedBy = userId,
                        _f.updatedAt = new Date().toISOString(),
                        _f))
                        .in("id", ids)];
                case 9: return [2 /*return*/, _h.sent()];
                case 10: return [2 /*return*/, {
                        error: { message: "Invalid field: ".concat(field) },
                        data: null
                    }];
            }
        });
    });
}
