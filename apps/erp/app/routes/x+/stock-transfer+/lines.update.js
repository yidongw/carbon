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
var inventory_1 = require("~/modules/inventory");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, formData, ids, field, value, line, viewClient, transfer, update;
        var _d;
        var _e, _f;
        var request = _b.request;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "inventory"
                    })];
                case 1:
                    _c = _g.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _g.sent();
                    ids = formData.getAll("ids");
                    field = formData.get("field");
                    value = formData.get("value");
                    if (!(ids.length > 0)) return [3 /*break*/, 7];
                    return [4 /*yield*/, client
                            .from("stockTransferLine")
                            .select("stockTransferId")
                            .eq("id", ids[0])
                            .single()];
                case 3:
                    line = _g.sent();
                    if (!((_e = line.data) === null || _e === void 0 ? void 0 : _e.stockTransferId)) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "inventory"
                        })];
                case 4:
                    viewClient = (_g.sent()).client;
                    return [4 /*yield*/, (0, inventory_1.getStockTransfer)(viewClient, line.data.stockTransferId)];
                case 5:
                    transfer = _g.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: (0, inventory_1.isStockTransferLocked)((_f = transfer.data) === null || _f === void 0 ? void 0 : _f.status),
                            redirectTo: path_1.path.to.stockTransfer(line.data.stockTransferId),
                            message: "Cannot modify a locked stock transfer. Reopen it first."
                        })];
                case 6:
                    _g.sent();
                    _g.label = 7;
                case 7:
                    if (typeof field !== "string" ||
                        (typeof value !== "string" && value !== null)) {
                        return [2 /*return*/, { error: { message: "Invalid form data" }, data: null }];
                    }
                    if (field !== "fromStorageUnitId" && field !== "toStorageUnitId") {
                        return [2 /*return*/, { error: { message: "Invalid field: ".concat(field) }, data: null }];
                    }
                    return [4 /*yield*/, client
                            .from("stockTransferLine")
                            .update((_d = {},
                            _d[field] = value ? value : null,
                            _d.updatedBy = userId,
                            _d.updatedAt = new Date().toISOString(),
                            _d))
                            .in("id", ids)
                            .eq("companyId", companyId)];
                case 8:
                    update = _g.sent();
                    return [2 /*return*/, update];
            }
        });
    });
}
