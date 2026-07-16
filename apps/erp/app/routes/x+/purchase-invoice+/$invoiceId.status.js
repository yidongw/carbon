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
var invoicing_1 = require("~/modules/invoicing");
var invoicing_models_1 = require("~/modules/invoicing/invoicing.models");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, id, formData, status, _d, _e, invoice, _f, _g, _h, _j, update, _k, _l, _m, _o;
        var _p, _q, _r, _s;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "invoicing"
                        })];
                case 1:
                    _c = _t.sent(), client = _c.client, userId = _c.userId;
                    id = params.invoiceId;
                    if (!id)
                        throw new Error("Could not find id");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _t.sent();
                    status = formData.get("status");
                    if (!(!status || !invoicing_models_1.purchaseInvoiceStatusType.includes(status))) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.purchaseInvoiceDetails(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Invalid status"))];
                case 3: throw _d.apply(void 0, _e.concat([_t.sent()]));
                case 4: return [4 /*yield*/, (0, invoicing_1.getPurchaseInvoice)(client, id)];
                case 5:
                    invoice = _t.sent();
                    if (!(invoice.error || !invoice.data)) return [3 /*break*/, 7];
                    _f = react_router_1.redirect;
                    _g = [(_p = (0, path_1.requestReferrer)(request)) !== null && _p !== void 0 ? _p : path_1.path.to.purchaseInvoiceDetails(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(invoice.error, "Failed to get purchase invoice"))];
                case 6: throw _f.apply(void 0, _g.concat([_t.sent()]));
                case 7:
                    if (!!invoice.data.postingDate) return [3 /*break*/, 9];
                    _h = react_router_1.redirect;
                    _j = [(_q = (0, path_1.requestReferrer)(request)) !== null && _q !== void 0 ? _q : path_1.path.to.purchaseInvoiceDetails(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Cannot update status of draft purchase invoice. Please post the invoice first."))];
                case 8: throw _h.apply(void 0, _j.concat([_t.sent()]));
                case 9: return [4 /*yield*/, (0, invoicing_1.updatePurchaseInvoiceStatus)(client, {
                        id: id,
                        status: status,
                        assignee: !["Partially Paid"].includes(status) ? null : undefined,
                        updatedBy: userId
                    })];
                case 10:
                    update = _t.sent();
                    if (!update.error) return [3 /*break*/, 12];
                    _k = react_router_1.redirect;
                    _l = [(_r = (0, path_1.requestReferrer)(request)) !== null && _r !== void 0 ? _r : path_1.path.to.purchaseInvoiceDetails(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(update.error, "Failed to update purchase invoice status"))];
                case 11: throw _k.apply(void 0, _l.concat([_t.sent()]));
                case 12:
                    _m = react_router_1.redirect;
                    _o = [(_s = (0, path_1.requestReferrer)(request)) !== null && _s !== void 0 ? _s : path_1.path.to.quote(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated purchase invoice status"))];
                case 13: throw _m.apply(void 0, _o.concat([_t.sent()]));
            }
        });
    });
}
