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
exports.loader = loader;
exports.action = action;
exports.clientAction = clientAction;
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
var settings_1 = require("~/modules/settings");
var users_1 = require("~/modules/users");
var users_server_1 = require("~/modules/users/users.server");
var path_1 = require("~/utils/path");
var react_query_1 = require("~/utils/react-query");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, invitable, _d, _e;
        var _f;
        var request = _b.request;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        create: "users"
                    })];
                case 1:
                    _c = _g.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, (0, users_1.getInvitable)(client, companyId)];
                case 2:
                    invitable = _g.sent();
                    if (!invitable.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.employeeAccounts];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(invitable.error, "Failed to load invitable users"))];
                case 3: throw _d.apply(void 0, _e.concat([_g.sent()]));
                case 4: return [2 /*return*/, {
                        invitable: (_f = invitable.data) !== null && _f !== void 0 ? _f : []
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, formData, modal, validation, _d, email, firstName, lastName, locationId, employeeType, number, seat, _e, _f, _g, _h, result, message, _j, _k, _l, _m, location, ip, _o, company, user, _p, _q, _r, _s, _t;
        var _u;
        var _v, _w, _x, _y, _z, _0;
        var request = _b.request;
        return __generator(this, function (_1) {
            switch (_1.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "users"
                        })];
                case 1:
                    _c = _1.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _1.sent();
                    modal = formData.get("type") === "modal";
                    return [4 /*yield*/, (0, form_1.validator)(users_1.createEmployeeValidator).validate(formData)];
                case 3:
                    validation = _1.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, email = _d.email, firstName = _d.firstName, lastName = _d.lastName, locationId = _d.locationId, employeeType = _d.employeeType, number = _d.number;
                    return [4 /*yield*/, (0, settings_1.checkSeatAvailability)(client, companyId, 1)];
                case 4:
                    seat = _1.sent();
                    if (!!seat.ok) return [3 /*break*/, 8];
                    if (!modal) return [3 /*break*/, 6];
                    _e = react_router_1.data;
                    _f = [{ success: false, message: seat.message }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, seat.message))];
                case 5: return [2 /*return*/, _e.apply(void 0, _f.concat([_1.sent()]))];
                case 6:
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.employeeAccounts];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, seat.message))];
                case 7: throw _g.apply(void 0, _h.concat([_1.sent()]));
                case 8: return [4 /*yield*/, (0, users_server_1.createEmployeeAccount)(client, {
                        email: email.toLowerCase(),
                        firstName: firstName,
                        lastName: lastName,
                        employeeType: employeeType,
                        locationId: locationId,
                        companyId: companyId,
                        createdBy: userId,
                        number: number
                    })];
                case 9:
                    result = _1.sent();
                    if (!!result.success) return [3 /*break*/, 13];
                    console.error(result);
                    message = (_v = result.message) !== null && _v !== void 0 ? _v : "Failed to create employee account";
                    if (!modal) return [3 /*break*/, 11];
                    _j = react_router_1.data;
                    _k = [{ success: false, message: message }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result, message))];
                case 10: return [2 /*return*/, _j.apply(void 0, _k.concat([_1.sent()]))];
                case 11:
                    _l = react_router_1.redirect;
                    _m = [path_1.path.to.employeeAccounts];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result, message))];
                case 12: throw _l.apply(void 0, _m.concat([_1.sent()]));
                case 13:
                    location = (_w = request.headers.get("x-vercel-ip-city")) !== null && _w !== void 0 ? _w : "Unknown";
                    ip = (_x = request.headers.get("x-forwarded-for")) !== null && _x !== void 0 ? _x : "127.0.0.1";
                    return [4 /*yield*/, Promise.all([
                            client.from("company").select("name").eq("id", companyId).single(),
                            client.from("user").select("email, fullName").eq("id", userId).single()
                        ])];
                case 14:
                    _o = _1.sent(), company = _o[0], user = _o[1];
                    if (!company.data || !user.data) {
                        throw new Error("Failed to load company or user");
                    }
                    _p = resend_server_1.sendEmail;
                    _u = {
                        from: "Carbon <no-reply@".concat(auth_1.RESEND_DOMAIN, ">"),
                        to: email,
                        subject: "You have been invited to join ".concat((_y = company.data) === null || _y === void 0 ? void 0 : _y.name, " on Carbon"),
                        headers: {
                            "X-Entity-Ref-ID": (0, nanoid_1.nanoid)()
                        }
                    };
                    return [4 /*yield*/, (0, components_1.render)((0, email_1.InviteEmail)({
                            invitedByEmail: (_z = user.data.email) !== null && _z !== void 0 ? _z : "",
                            invitedByName: (_0 = user.data.fullName) !== null && _0 !== void 0 ? _0 : "",
                            email: email,
                            name: "".concat(firstName, " ").concat(lastName).trim(),
                            companyName: company.data.name,
                            inviteLink: "".concat((0, auth_1.getAppUrl)(), "/invite/").concat(result.code),
                            ip: ip,
                            location: location
                        }))];
                case 15: return [4 /*yield*/, _p.apply(void 0, [(_u.html = _1.sent(),
                            _u)])];
                case 16:
                    _1.sent();
                    if (!modal) return [3 /*break*/, 18];
                    _q = react_router_1.data;
                    _r = [{
                            success: true,
                            userId: result.userId,
                            firstName: firstName,
                            lastName: lastName
                        }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Successfully invited employee"))];
                case 17: return [2 /*return*/, _q.apply(void 0, _r.concat([_1.sent()]))];
                case 18:
                    _s = react_router_1.redirect;
                    _t = [path_1.path.to.personJob(result.userId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Successfully invited employee"))];
                case 19: throw _s.apply(void 0, _t.concat([_1.sent()]));
            }
        });
    });
}
function clientAction(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var companyId;
        var _c;
        var serverAction = _b.serverAction;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    companyId = (0, react_query_1.getCompanyId)();
                    (_c = window.clientCache) === null || _c === void 0 ? void 0 : _c.invalidateQueries({
                        predicate: function (query) {
                            var queryKey = query.queryKey;
                            return queryKey[0] === "groupsByType" && queryKey[1] === companyId;
                        }
                    });
                    return [4 /*yield*/, serverAction()];
                case 1: return [2 /*return*/, _d.sent()];
            }
        });
    });
}
function default_1() {
    var invitable = (0, react_router_1.useLoaderData)().invitable;
    return <users_1.CreateEmployeeModal invitable={invitable}/>;
}
