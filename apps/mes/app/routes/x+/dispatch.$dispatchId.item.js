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
var react_router_1 = require("react-router");
var maintenance_service_1 = require("~/services/maintenance.service");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, companyId, userId, dispatchId, _d, _e, formData, action, serviceRole, itemId, quantity, unitOfMeasureCode, _f, _g, _h, _j, result, _k, _l, _m, _o, itemId, _p, _q, result, _r, _s, _t, _u;
        var _v;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_w) {
            switch (_w.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _w.sent(), companyId = _c.companyId, userId = _c.userId;
                    dispatchId = params.dispatchId;
                    if (!!dispatchId) return [3 /*break*/, 3];
                    _d = react_router_1.data;
                    _e = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Dispatch ID is required"))];
                case 2: return [2 /*return*/, _d.apply(void 0, _e.concat([_w.sent()]))];
                case 3: return [4 /*yield*/, request.formData()];
                case 4:
                    formData = _w.sent();
                    action = formData.get("action");
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 5:
                    serviceRole = _w.sent();
                    if (!(action === "add")) return [3 /*break*/, 14];
                    itemId = formData.get("itemId");
                    quantity = Number(formData.get("quantity"));
                    unitOfMeasureCode = formData.get("unitOfMeasureCode");
                    if (!!itemId) return [3 /*break*/, 7];
                    _f = react_router_1.data;
                    _g = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Item is required"))];
                case 6: return [2 /*return*/, _f.apply(void 0, _g.concat([_w.sent()]))];
                case 7:
                    if (!(!quantity || quantity <= 0)) return [3 /*break*/, 9];
                    _h = react_router_1.data;
                    _j = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Valid quantity is required"))];
                case 8: return [2 /*return*/, _h.apply(void 0, _j.concat([_w.sent()]))];
                case 9: return [4 /*yield*/, (0, maintenance_service_1.addMaintenanceDispatchItem)(serviceRole, {
                        maintenanceDispatchId: dispatchId,
                        itemId: itemId,
                        quantity: quantity,
                        unitOfMeasureCode: unitOfMeasureCode || "EA",
                        companyId: companyId,
                        createdBy: userId
                    })];
                case 10:
                    result = _w.sent();
                    if (!result.error) return [3 /*break*/, 12];
                    _k = react_router_1.data;
                    _l = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to add spare part"))];
                case 11: return [2 /*return*/, _k.apply(void 0, _l.concat([_w.sent()]))];
                case 12:
                    _m = react_router_1.data;
                    _o = [{ id: (_v = result.data) === null || _v === void 0 ? void 0 : _v.id }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Spare part added"))];
                case 13: return [2 /*return*/, _m.apply(void 0, _o.concat([_w.sent()]))];
                case 14:
                    if (!(action === "delete")) return [3 /*break*/, 21];
                    itemId = formData.get("itemId");
                    if (!!itemId) return [3 /*break*/, 16];
                    _p = react_router_1.data;
                    _q = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Item ID is required"))];
                case 15: return [2 /*return*/, _p.apply(void 0, _q.concat([_w.sent()]))];
                case 16: return [4 /*yield*/, serviceRole.functions.invoke("issue", {
                        body: {
                            type: "maintenanceDispatchUnissue",
                            maintenanceDispatchItemId: itemId,
                            companyId: companyId,
                            userId: userId
                        }
                    })];
                case 17:
                    result = _w.sent();
                    if (!result.error) return [3 /*break*/, 19];
                    _r = react_router_1.data;
                    _s = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to remove spare part"))];
                case 18: return [2 /*return*/, _r.apply(void 0, _s.concat([_w.sent()]))];
                case 19:
                    _t = react_router_1.data;
                    _u = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Spare part removed and returned to inventory"))];
                case 20: return [2 /*return*/, _t.apply(void 0, _u.concat([_w.sent()]))];
                case 21: return [2 /*return*/, (0, react_router_1.data)({})];
            }
        });
    });
}
