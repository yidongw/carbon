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
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = action;
exports.default = UserAttributeValueRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var account_1 = require("~/modules/account");
var people_1 = require("~/modules/people");
var users_server_1 = require("~/modules/users/users.server");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, targetUserId, formData, attributeId, clientClaims, canUpdateAnyUser, _d, _e, attribute, _f, _g, canSelfManage, _h, _j, type, v, validation, upsertAttributeValue, _k, _l, _m, _o;
        var _p, _q, _r, _s;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _t.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    targetUserId = params.userId;
                    if (!targetUserId) {
                        throw new Error("No user id provided");
                    }
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _t.sent();
                    attributeId = formData.get("userAttributeId");
                    if (!attributeId)
                        throw new Error("No attribute id provided");
                    return [4 /*yield*/, (0, users_server_1.getUserClaims)(userId, companyId)];
                case 3:
                    clientClaims = _t.sent();
                    canUpdateAnyUser = 
                    // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
                    (_q = (_p = clientClaims.permissions["users"]) === null || _p === void 0 ? void 0 : _p.update) === null || _q === void 0 ? void 0 : _q.includes(companyId);
                    if (!(!canUpdateAnyUser && userId !== targetUserId)) return [3 /*break*/, 5];
                    _d = react_router_1.data;
                    _e = [null];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Unauthorized: Cannot update attribute"))];
                case 4: return [2 /*return*/, _d.apply(void 0, _e.concat([_t.sent()]))];
                case 5:
                    if (!(!canUpdateAnyUser && userId === targetUserId)) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, people_1.getAttribute)(client, attributeId)];
                case 6:
                    attribute = _t.sent();
                    if (!attribute.error) return [3 /*break*/, 8];
                    _f = react_router_1.data;
                    _g = [null];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(attribute.error, "Failed to get attribute"))];
                case 7: return [2 /*return*/, _f.apply(void 0, _g.concat([_t.sent()]))];
                case 8:
                    canSelfManage = (_s = (_r = attribute.data) === null || _r === void 0 ? void 0 : _r.canSelfManage) !== null && _s !== void 0 ? _s : false;
                    if (!!canSelfManage) return [3 /*break*/, 10];
                    _h = react_router_1.data;
                    _j = [null];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Unauthorized: Cannot update attribute"))];
                case 9: return [2 /*return*/, _h.apply(void 0, _j.concat([_t.sent()]))];
                case 10:
                    type = formData.get("type");
                    if (!type)
                        throw new Error("No type provided");
                    v = getValidatorByType(type);
                    return [4 /*yield*/, (0, form_1.validator)(v).validate(formData)];
                case 11:
                    validation = _t.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    return [4 /*yield*/, (0, account_1.upsertUserAttributeValue)(client, __assign(__assign({}, validation.data), { userId: targetUserId, updatedBy: userId }))];
                case 12:
                    upsertAttributeValue = _t.sent();
                    if (!upsertAttributeValue.error) return [3 /*break*/, 14];
                    _k = react_router_1.data;
                    _l = [null];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(upsertAttributeValue.error, "Failed to update attribute value"))];
                case 13: return [2 /*return*/, _k.apply(void 0, _l.concat([_t.sent()]))];
                case 14:
                    _m = react_router_1.data;
                    _o = [null];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated attribute value"))];
                case 15: return [2 /*return*/, _m.apply(void 0, _o.concat([_t.sent()]))];
            }
        });
    });
}
function UserAttributeValueRoute() {
    // React Router bug
    return null;
}
function getValidatorByType(type) {
    switch (type) {
        case "boolean":
            return account_1.attributeBooleanValidator;
        case "date":
            return account_1.attributeTextValidator;
        case "list":
            return account_1.attributeTextValidator;
        case "numeric":
            return account_1.attributeNumericValidator;
        case "text":
            return account_1.attributeTextValidator;
        case "user":
            return account_1.attributeUserValidator;
        case "supplier":
            return account_1.attributeSupplierValidator;
        case "customer":
            return account_1.attributeCustomerValidator;
        case "file":
            return account_1.attributeFileValidator;
        default:
            throw new Error("Invalid type provided");
    }
}
