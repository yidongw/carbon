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
var session_server_1 = require("@carbon/auth/session.server");
var react_router_1 = require("react-router");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, formData, id, supplierId, table, _d, _e, _f, _g, _h, _j, result, _k, _l, _m, _o;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "quality"
                    })];
                case 1:
                    _c = _p.sent(), client = _c.client, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _p.sent();
                    id = formData.get("id");
                    supplierId = formData.get("supplierId");
                    table = formData.get("table");
                    if (!!id) return [3 /*break*/, 4];
                    _d = react_router_1.data;
                    _e = [{ success: false }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Task ID is required"))];
                case 3: return [2 /*return*/, _d.apply(void 0, _e.concat([_p.sent()]))];
                case 4:
                    if (!!table) return [3 /*break*/, 6];
                    _f = react_router_1.data;
                    _g = [{ success: false }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Table is required"))];
                case 5: return [2 /*return*/, _f.apply(void 0, _g.concat([_p.sent()]))];
                case 6:
                    if (!(table !== "nonConformanceActionTask")) return [3 /*break*/, 8];
                    _h = react_router_1.data;
                    _j = [{ success: false }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Invalid table"))];
                case 7: return [2 /*return*/, _h.apply(void 0, _j.concat([_p.sent()]))];
                case 8: return [4 /*yield*/, client
                        .from(table)
                        .update({
                        supplierId: supplierId || null,
                        updatedBy: userId
                    })
                        .eq("id", id)
                        .select("id")
                        .maybeSingle()];
                case 9:
                    result = _p.sent();
                    if (!result.error) return [3 /*break*/, 11];
                    _k = react_router_1.data;
                    _l = [{ success: false }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to update task supplier"))];
                case 10: return [2 /*return*/, _k.apply(void 0, _l.concat([_p.sent()]))];
                case 11:
                    if (!!result.data) return [3 /*break*/, 13];
                    _m = react_router_1.data;
                    _o = [{ success: false }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Task not found"))];
                case 12: return [2 /*return*/, _m.apply(void 0, _o.concat([_p.sent()]))];
                case 13: return [2 /*return*/, { success: true }];
            }
        });
    });
}
