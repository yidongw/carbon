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
var client_server_1 = require("@carbon/auth/client.server");
/**
 * GET /api/demo/extend-approve?token=<random-hex>
 *
 * One-click approval link from the extension request email. No login needed.
 * The token is a 32-byte random hex string stored on demoCompany with a 7-day
 * TTL; it's cleared on first use so the link works exactly once.
 */
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var token, admin, demo, base, newExpiry, company, formatted;
        var _c, _d;
        var request = _b.request;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    token = (_c = new URL(request.url).searchParams.get("token")) !== null && _c !== void 0 ? _c : "";
                    if (!token) {
                        return [2 /*return*/, html(page("Invalid link", "No token provided.", false))];
                    }
                    admin = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, admin
                            .from("demoCompany")
                            .select("id, expiresAt, extensionTokenExpiresAt")
                            .eq("extensionToken", token)
                            .maybeSingle()];
                case 1:
                    demo = (_e.sent()).data;
                    if (!demo) {
                        return [2 /*return*/, html(page("Invalid or expired link", "This link is invalid or has already been used.", false))];
                    }
                    if (demo.extensionTokenExpiresAt &&
                        new Date(demo.extensionTokenExpiresAt) < new Date()) {
                        return [2 /*return*/, html(page("Link expired", "This approval link has expired. Ask the user to request a new extension.", false))];
                    }
                    base = Math.max(Date.now(), demo.expiresAt ? new Date(demo.expiresAt).getTime() : 0);
                    newExpiry = new Date(base + 30 * 24 * 60 * 60 * 1000);
                    // Clear the token (one-time use) and extend expiry atomically.
                    return [4 /*yield*/, admin
                            .from("demoCompany")
                            .update({
                            expiresAt: newExpiry.toISOString(),
                            extensionToken: null,
                            extensionTokenExpiresAt: null
                        })
                            .eq("id", demo.id)];
                case 2:
                    // Clear the token (one-time use) and extend expiry atomically.
                    _e.sent();
                    return [4 /*yield*/, admin
                            .from("company")
                            .select("name")
                            .eq("id", demo.id)
                            .maybeSingle()];
                case 3:
                    company = (_e.sent()).data;
                    formatted = newExpiry.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    });
                    console.log("Demo extended: company=".concat(demo.id, " (").concat(company === null || company === void 0 ? void 0 : company.name, ") newExpiry=").concat(newExpiry.toISOString()));
                    return [2 /*return*/, html(page("Extension approved", "Demo for <strong>".concat((_d = company === null || company === void 0 ? void 0 : company.name) !== null && _d !== void 0 ? _d : demo.id, "</strong> extended to <strong>").concat(formatted, "</strong>."), true))];
            }
        });
    });
}
function html(body) {
    return new Response(body, { headers: { "Content-Type": "text/html" } });
}
function page(title, body, success) {
    return "<!DOCTYPE html>\n<html>\n<head><meta charset=\"utf-8\"><title>".concat(title, "</title></head>\n<body style=\"font-family:sans-serif;color:#111;max-width:480px;margin:80px auto;padding:24px;text-align:center\">\n  <div style=\"font-size:48px;margin-bottom:16px\">").concat(success ? "✓" : "✗", "</div>\n  <h1 style=\"margin:0 0 12px;font-size:22px\">").concat(title, "</h1>\n  <p style=\"color:#555;line-height:1.6\">").concat(body, "</p>\n</body>\n</html>");
}
