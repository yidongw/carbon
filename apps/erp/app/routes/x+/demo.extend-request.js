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
exports.default = DemoExtendRequest;
var node_crypto_1 = require("node:crypto");
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var identity_server_1 = require("@carbon/auth/identity.server");
var resend_server_1 = require("@carbon/lib/resend.server");
function fmt(date) {
    if (!date)
        return "—";
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}
/**
 * POST → generates a per-request random token (stored on demoCompany),
 * then sends a rich extension request email to SUPER_ADMIN_EMAIL with a
 * one-click approve link containing that token.
 */
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, userId, companyId, admin, _d, user, demo, companyLinks, identities, companies, realCompany, demoCompanyRow, name, companyName, providerLabels, token, tokenExpiry, host, approveUrl, daysLeft, address, to, subject, expiryColor, expiryLabel, html, error_1;
        var _e, _f, _g, _h, _j, _k, _l;
        var request = _b.request;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _m.sent(), userId = _c.userId, companyId = _c.companyId;
                    admin = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, Promise.all([
                            admin
                                .from("user")
                                .select("firstName, lastName, email, phone, about, createdAt")
                                .eq("id", userId)
                                .single(),
                            admin
                                .from("demoCompany")
                                .select("id, expiresAt, seedStatus, createdAt, extensionTokenExpiresAt")
                                .eq("id", companyId)
                                .maybeSingle(),
                            admin
                                .from("userToCompany")
                                .select("companyId, company(id, name, addressLine1, city, stateProvince, countryCode, website, phone, createdAt, isDemo)")
                                .eq("userId", userId),
                            (0, identity_server_1.getUserIdentities)(userId)
                        ])];
                case 2:
                    _d = _m.sent(), user = _d[0].data, demo = _d[1].data, companyLinks = _d[2].data, identities = _d[3];
                    companies = (companyLinks !== null && companyLinks !== void 0 ? companyLinks : []).flatMap(function (l) {
                        return Array.isArray(l.company) ? l.company : l.company ? [l.company] : [];
                    });
                    realCompany = companies.find(function (c) { return !c.isDemo; });
                    demoCompanyRow = companies.find(function (c) { return c.isDemo; });
                    name = [user === null || user === void 0 ? void 0 : user.firstName, user === null || user === void 0 ? void 0 : user.lastName].filter(Boolean).join(" ") || "Unknown";
                    companyName = (_f = (_e = realCompany === null || realCompany === void 0 ? void 0 : realCompany.name) !== null && _e !== void 0 ? _e : demoCompanyRow === null || demoCompanyRow === void 0 ? void 0 : demoCompanyRow.name) !== null && _f !== void 0 ? _f : companyId;
                    providerLabels = {
                        email: "Email",
                        google: "Google",
                        azure: "Microsoft (Azure)",
                        wechat: "WeChat",
                        phone: "Phone (SMS)"
                    };
                    // If a request was made within the last 24 h (token expires > 6 days from now),
                    // silently succeed — don't spam the admin or reset the token.
                    if ((demo === null || demo === void 0 ? void 0 : demo.extensionTokenExpiresAt) &&
                        new Date(demo.extensionTokenExpiresAt).getTime() >
                            Date.now() + 6 * 24 * 60 * 60 * 1000) {
                        return [2 /*return*/, { ok: true }];
                    }
                    token = (0, node_crypto_1.randomBytes)(32).toString("hex");
                    tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
                    return [4 /*yield*/, admin
                            .from("demoCompany")
                            .update({ extensionToken: token, extensionTokenExpiresAt: tokenExpiry })
                            .eq("id", companyId)];
                case 3:
                    _m.sent();
                    host = new URL(request.url).origin;
                    approveUrl = "".concat(host, "/api/demo/extend-approve?token=").concat(token);
                    daysLeft = (demo === null || demo === void 0 ? void 0 : demo.expiresAt)
                        ? Math.max(0, Math.ceil((new Date(demo.expiresAt).getTime() - Date.now()) / 86400000))
                        : null;
                    address = [
                        realCompany === null || realCompany === void 0 ? void 0 : realCompany.addressLine1,
                        realCompany === null || realCompany === void 0 ? void 0 : realCompany.city,
                        realCompany === null || realCompany === void 0 ? void 0 : realCompany.stateProvince,
                        realCompany === null || realCompany === void 0 ? void 0 : realCompany.countryCode
                    ]
                        .filter(Boolean)
                        .join(", ");
                    to = process.env.SUPER_ADMIN_EMAIL;
                    if (!to) {
                        console.warn("SUPER_ADMIN_EMAIL not set — extension request email skipped");
                        return [2 /*return*/, { ok: true }];
                    }
                    subject = "Demo Extension Request \u2014 ".concat(name, " at ").concat(companyName);
                    expiryColor = daysLeft === null
                        ? "#555"
                        : daysLeft <= 0
                            ? "#dc2626"
                            : daysLeft <= 7
                                ? "#d97706"
                                : "#555";
                    expiryLabel = daysLeft === null
                        ? ""
                        : daysLeft <= 0
                            ? " (expired)"
                            : " (".concat(daysLeft, " day").concat(daysLeft === 1 ? "" : "s", " left)");
                    html = "<!DOCTYPE html>\n<html>\n<head><meta charset=\"utf-8\"></head>\n<body style=\"font-family:sans-serif;color:#111;max-width:600px;margin:0 auto;padding:24px\">\n  <h2 style=\"margin-top:0\">Demo Extension Request</h2>\n\n  <table style=\"width:100%;border-collapse:collapse;margin-bottom:24px\">\n    <tr>\n      <td colspan=\"2\" style=\"background:#f4f4f5;padding:8px 12px;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#555\">\n        Profile\n      </td>\n    </tr>\n    <tr>\n      <td style=\"padding:8px 12px;width:38%;color:#555\">Name</td>\n      <td style=\"padding:8px 12px\"><strong>".concat(name, "</strong></td>\n    </tr>\n    <tr style=\"background:#fafafa\">\n      <td style=\"padding:8px 12px;color:#555\">Email</td>\n      <td style=\"padding:8px 12px\">").concat((user === null || user === void 0 ? void 0 : user.email) ? "<a href=\"mailto:".concat(user.email, "\">").concat(user.email, "</a>") : "—", "</td>\n    </tr>\n    <tr>\n      <td style=\"padding:8px 12px;color:#555\">Phone</td>\n      <td style=\"padding:8px 12px\">").concat((_g = user === null || user === void 0 ? void 0 : user.phone) !== null && _g !== void 0 ? _g : "—", "</td>\n    </tr>\n    <tr style=\"background:#fafafa\">\n      <td style=\"padding:8px 12px;color:#555\">About</td>\n      <td style=\"padding:8px 12px\">").concat((user === null || user === void 0 ? void 0 : user.about) ? "<em>".concat(user.about, "</em>") : "—", "</td>\n    </tr>\n    <tr>\n      <td style=\"padding:8px 12px;color:#555\">Member since</td>\n      <td style=\"padding:8px 12px\">").concat(fmt(user === null || user === void 0 ? void 0 : user.createdAt), "</td>\n    </tr>\n\n    <tr>\n      <td colspan=\"2\" style=\"background:#f4f4f5;padding:8px 12px;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#555\">\n        Login Methods\n      </td>\n    </tr>\n    ").concat((identities !== null && identities !== void 0 ? identities : []).length === 0
                        ? "<tr><td colspan=\"2\" style=\"padding:8px 12px;color:#555\">\u2014</td></tr>"
                        : (identities !== null && identities !== void 0 ? identities : [])
                            .map(function (identity, idx) {
                            var _a, _b;
                            var label = (_a = providerLabels[identity.type]) !== null && _a !== void 0 ? _a : identity.type.charAt(0).toUpperCase() + identity.type.slice(1);
                            var bg = idx % 2 === 1 ? ' style="background:#fafafa"' : "";
                            return "<tr".concat(bg, ">\n      <td style=\"padding:8px 12px;color:#555\">").concat(label, "</td>\n      <td style=\"padding:8px 12px\">").concat((_b = identity.value) !== null && _b !== void 0 ? _b : "—", "</td>\n    </tr>");
                        })
                            .join("\n    "), "\n\n    <tr>\n      <td colspan=\"2\" style=\"background:#f4f4f5;padding:8px 12px;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#555\">\n        Real Company\n      </td>\n    </tr>\n    <tr>\n      <td style=\"padding:8px 12px;color:#555\">Name</td>\n      <td style=\"padding:8px 12px\"><strong>").concat((_h = realCompany === null || realCompany === void 0 ? void 0 : realCompany.name) !== null && _h !== void 0 ? _h : "—", "</strong></td>\n    </tr>\n    <tr style=\"background:#fafafa\">\n      <td style=\"padding:8px 12px;color:#555\">Address</td>\n      <td style=\"padding:8px 12px\">").concat(address || "—", "</td>\n    </tr>\n    <tr>\n      <td style=\"padding:8px 12px;color:#555\">Website</td>\n      <td style=\"padding:8px 12px\">").concat((realCompany === null || realCompany === void 0 ? void 0 : realCompany.website) ? "<a href=\"".concat(realCompany.website, "\">").concat(realCompany.website, "</a>") : "—", "</td>\n    </tr>\n    <tr style=\"background:#fafafa\">\n      <td style=\"padding:8px 12px;color:#555\">Phone</td>\n      <td style=\"padding:8px 12px\">").concat((_j = realCompany === null || realCompany === void 0 ? void 0 : realCompany.phone) !== null && _j !== void 0 ? _j : "—", "</td>\n    </tr>\n    <tr>\n      <td style=\"padding:8px 12px;color:#555\">Created</td>\n      <td style=\"padding:8px 12px\">").concat(fmt(realCompany === null || realCompany === void 0 ? void 0 : realCompany.createdAt), "</td>\n    </tr>\n\n    <tr>\n      <td colspan=\"2\" style=\"background:#f4f4f5;padding:8px 12px;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#555\">\n        Demo Company\n      </td>\n    </tr>\n    <tr>\n      <td style=\"padding:8px 12px;color:#555\">Created</td>\n      <td style=\"padding:8px 12px\">").concat(fmt(demo === null || demo === void 0 ? void 0 : demo.createdAt), "</td>\n    </tr>\n    <tr style=\"background:#fafafa\">\n      <td style=\"padding:8px 12px;color:#555\">Expires</td>\n      <td style=\"padding:8px 12px\">\n        ").concat(fmt(demo === null || demo === void 0 ? void 0 : demo.expiresAt), "<span style=\"color:").concat(expiryColor, "\">").concat(expiryLabel, "</span>\n      </td>\n    </tr>\n    <tr>\n      <td style=\"padding:8px 12px;color:#555\">Seed status</td>\n      <td style=\"padding:8px 12px\">").concat((_k = demo === null || demo === void 0 ? void 0 : demo.seedStatus) !== null && _k !== void 0 ? _k : "—", "</td>\n    </tr>\n  </table>\n\n  <a href=\"").concat(approveUrl, "\"\n     style=\"display:inline-block;background:#18181b;color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-weight:600;font-size:15px\">\n    \u2713 Approve 30-day extension\n  </a>\n\n  <p style=\"margin-top:24px;font-size:12px;color:#888\">\n    This link is valid for 7 days and can only be used once.\n  </p>\n</body>\n</html>");
                    _m.label = 4;
                case 4:
                    _m.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, (0, resend_server_1.sendEmail)({
                            from: "no-reply@".concat(auth_1.RESEND_DOMAIN),
                            to: to,
                            subject: subject,
                            html: html,
                            text: "Demo extension request from ".concat(name, " (").concat((_l = user === null || user === void 0 ? void 0 : user.email) !== null && _l !== void 0 ? _l : "?", ") at ").concat(companyName, ".\n\nApprove: ").concat(approveUrl)
                        })];
                case 5:
                    _m.sent();
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _m.sent();
                    console.error("Failed to send extension request email:", error_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/, { ok: true }];
            }
        });
    });
}
function DemoExtendRequest() {
    return null;
}
