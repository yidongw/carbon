"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var sales_1 = require("~/modules/sales");
var shared_1 = require("~/modules/shared");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, id, formData, validation, _d, _id, d, update, _e, _f, operationParameterId, _g, _h, _j, _k;
        var _l;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "parts"
                        })];
                case 1:
                    _c = _m.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    id = params.id;
                    if (!id) {
                        return [2 /*return*/, { success: false, message: "Invalid operation parameter id" }];
                    }
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _m.sent();
                    return [4 /*yield*/, (0, form_1.validator)(shared_1.operationParameterValidator).validate(formData)];
                case 3:
                    validation = _m.sent();
                    if (validation.error) {
                        return [2 /*return*/, { success: false, message: "Invalid form data" }];
                    }
                    _d = validation.data, _id = _d.id, d = __rest(_d, ["id"]);
                    return [4 /*yield*/, (0, sales_1.upsertQuoteOperationParameter)(client, __assign(__assign({ id: id }, d), { companyId: companyId, updatedBy: userId, updatedAt: new Date().toISOString() }))];
                case 4:
                    update = _m.sent();
                    if (!update.error) return [3 /*break*/, 6];
                    _e = react_router_1.data;
                    _f = [{
                            id: null
                        }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(update.error, "Failed to update  operation parameter"))];
                case 5: return [2 /*return*/, _e.apply(void 0, _f.concat([_m.sent()]))];
                case 6:
                    operationParameterId = (_l = update.data) === null || _l === void 0 ? void 0 : _l.id;
                    if (!!operationParameterId) return [3 /*break*/, 8];
                    _g = react_router_1.data;
                    _h = [{
                            id: null
                        }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(update.error, "Failed to update  operation parameter"))];
                case 7: return [2 /*return*/, _g.apply(void 0, _h.concat([_m.sent()]))];
                case 8:
                    _j = react_router_1.data;
                    _k = [{ id: operationParameterId }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Quote operation parameter updated"))];
                case 9: return [2 /*return*/, _j.apply(void 0, _k.concat([_m.sent()]))];
            }
        });
    });
}
