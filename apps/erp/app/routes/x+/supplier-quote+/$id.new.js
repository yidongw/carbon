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
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var purchasing_1 = require("~/modules/purchasing");
var form_2 = require("~/utils/form");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, companyId, userId, supplierQuoteId, viewClient, quote, formData, validation, _d, id, d, serviceRole, createQuotationLine, _e, _f, quoteLineId;
        var _g;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "purchasing"
                        })];
                case 1:
                    _c = _h.sent(), companyId = _c.companyId, userId = _c.userId;
                    supplierQuoteId = params.id;
                    if (!supplierQuoteId)
                        throw new Error("Could not find supplierQuoteId");
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "purchasing"
                        })];
                case 2:
                    viewClient = (_h.sent()).client;
                    return [4 /*yield*/, (0, purchasing_1.getSupplierQuote)(viewClient, supplierQuoteId)];
                case 3:
                    quote = _h.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: (0, purchasing_1.isSupplierQuoteLocked)((_g = quote.data) === null || _g === void 0 ? void 0 : _g.status),
                            redirectTo: path_1.path.to.supplierQuote(supplierQuoteId),
                            message: "Cannot modify a locked supplier quote. Reopen it first."
                        })];
                case 4:
                    _h.sent();
                    return [4 /*yield*/, request.formData()];
                case 5:
                    formData = _h.sent();
                    return [4 /*yield*/, (0, form_1.validator)(purchasing_1.supplierQuoteLineValidator).validate(formData)];
                case 6:
                    validation = _h.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, id = _d.id, d = __rest(_d, ["id"]);
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, purchasing_1.upsertSupplierQuoteLine)(serviceRole, __assign(__assign({}, d), { companyId: companyId, createdBy: userId, customFields: (0, form_2.setCustomFields)(formData) }))];
                case 7:
                    createQuotationLine = _h.sent();
                    if (!createQuotationLine.error) return [3 /*break*/, 9];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.supplierQuote(supplierQuoteId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(createQuotationLine.error, "Failed to create quote line."))];
                case 8: throw _e.apply(void 0, _f.concat([_h.sent()]));
                case 9:
                    quoteLineId = createQuotationLine.data.id;
                    throw (0, react_router_1.redirect)(path_1.path.to.supplierQuoteLine(supplierQuoteId, quoteLineId));
            }
        });
    });
}
