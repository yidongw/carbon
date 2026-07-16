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
exports.default = default_1;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var email_1 = require("@carbon/documents/email");
var form_1 = require("@carbon/form");
var resend_server_1 = require("@carbon/lib/resend.server");
var components_1 = require("@react-email/components");
var nanoid_1 = require("nanoid");
var react_router_1 = require("react-router");
var users_1 = require("~/modules/users");
var users_server_1 = require("~/modules/users/users.server");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, validation, _d, _e, url, searchParams, customerRedirect, _f, id, customer, result, _g, _h, location, ip, _j, company, user, invitee, _k, _l, _m, _o, _p;
        var _q;
        var _r, _s, _t, _u, _v, _w, _x, _y;
        var request = _b.request;
        return __generator(this, function (_z) {
            switch (_z.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "users"
                        })];
                case 1:
                    _c = _z.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    _e = (_d = (0, form_1.validator)(users_1.createCustomerAccountValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 2: return [4 /*yield*/, _e.apply(_d, [_z.sent()])];
                case 3:
                    validation = _z.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    customerRedirect = searchParams.get("customer");
                    _f = validation.data, id = _f.id, customer = _f.customer;
                    return [4 /*yield*/, (0, users_server_1.createCustomerAccount)(client, {
                            id: id,
                            customerId: customer,
                            companyId: companyId,
                            createdBy: userId
                        })];
                case 4:
                    result = _z.sent();
                    if (!!result.success) return [3 /*break*/, 6];
                    console.error(result);
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.customerAccounts];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result, (_r = result.message) !== null && _r !== void 0 ? _r : "Failed to create customer account"))];
                case 5: throw _g.apply(void 0, _h.concat([_z.sent()]));
                case 6:
                    location = (_s = request.headers.get("x-vercel-ip-city")) !== null && _s !== void 0 ? _s : "Unknown";
                    ip = (_t = request.headers.get("x-forwarded-for")) !== null && _t !== void 0 ? _t : "127.0.0.1";
                    return [4 /*yield*/, Promise.all([
                            client.from("company").select("name").eq("id", companyId).single(),
                            client.from("user").select("email, fullName").eq("id", userId).single(),
                            client.from("user").select("fullName").eq("id", result.userId).single()
                        ])];
                case 7:
                    _j = _z.sent(), company = _j[0], user = _j[1], invitee = _j[2];
                    if (!company.data || !user.data) {
                        throw new Error("Failed to load company or user");
                    }
                    _k = resend_server_1.sendEmail;
                    _q = {
                        from: "Carbon <no-reply@".concat(auth_1.RESEND_DOMAIN, ">"),
                        to: result.email,
                        subject: "You have been invited to join ".concat((_u = company.data) === null || _u === void 0 ? void 0 : _u.name, " on Carbon"),
                        headers: {
                            "X-Entity-Ref-ID": (0, nanoid_1.nanoid)()
                        }
                    };
                    return [4 /*yield*/, (0, components_1.render)((0, email_1.InviteEmail)({
                            invitedByEmail: (_v = user.data.email) !== null && _v !== void 0 ? _v : "",
                            invitedByName: (_w = user.data.fullName) !== null && _w !== void 0 ? _w : "",
                            email: result.email,
                            name: (_y = (_x = invitee.data) === null || _x === void 0 ? void 0 : _x.fullName) !== null && _y !== void 0 ? _y : "",
                            companyName: company.data.name,
                            inviteLink: "".concat((0, auth_1.getAppUrl)(), "/invite/").concat(result.code),
                            ip: ip,
                            location: location
                        }))];
                case 8: return [4 /*yield*/, _k.apply(void 0, [(_q.html = _z.sent(),
                            _q)])];
                case 9:
                    _z.sent();
                    if (!customerRedirect) return [3 /*break*/, 11];
                    _l = react_router_1.redirect;
                    _m = [path_1.path.to.customerContacts(customerRedirect)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Customer invited"))];
                case 10: throw _l.apply(void 0, _m.concat([_z.sent()]));
                case 11:
                    _o = react_router_1.redirect;
                    _p = [path_1.path.to.customerAccounts];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Customer invited"))];
                case 12: throw _o.apply(void 0, _p.concat([_z.sent()]));
            }
        });
    });
}
function default_1() {
    return <users_1.CreateCustomerModal />;
}
