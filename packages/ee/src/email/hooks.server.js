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
exports.emailHealthcheck = emailHealthcheck;
var config_1 = require("./config");
/**
 * Server-side healthcheck for the Email integration.
 *
 * Validates the stored credentials for the company's chosen delivery
 * provider without actually sending a message:
 *
 * - `resend`: hits `GET https://api.resend.com/domains` with the API key.
 *   A 2xx means the key is valid and has read access; anything else means
 *   the credentials are wrong or the account is suspended.
 * - `smtp`:   dynamically imports `nodemailer`, builds a transport from the
 *   stored host/port/username/password/secure and calls `.verify()`, which
 *   performs a handshake without sending mail.
 *
 * Returns `true` on success and `false` on any failure (invalid metadata,
 * network error, bad credentials). Never throws — the settings page caches
 * a boolean and we don't want a transient SMTP outage to surface as a 500
 * in the integrations list.
 */
function emailHealthcheck(_companyId, metadata) {
    return __awaiter(this, void 0, void 0, function () {
        var withProvider, parsed, data, response, nodemailer, transporter, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    withProvider = metadata && typeof metadata === "object" && !("provider" in metadata)
                        ? __assign({ provider: "resend" }, metadata) : metadata;
                    parsed = config_1.Email.schema.safeParse(withProvider);
                    if (!parsed.success)
                        return [2 /*return*/, false];
                    data = parsed.data;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    if (!(data.provider === "resend")) return [3 /*break*/, 3];
                    return [4 /*yield*/, fetch("https://api.resend.com/domains", {
                            method: "GET",
                            headers: {
                                Authorization: "Bearer ".concat(data.apiKey)
                            }
                        })];
                case 2:
                    response = _a.sent();
                    return [2 /*return*/, response.ok];
                case 3:
                    if (!(data.provider === "smtp")) return [3 /*break*/, 6];
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("nodemailer"); })];
                case 4:
                    nodemailer = _a.sent();
                    transporter = nodemailer.createTransport({
                        host: data.host,
                        port: data.port,
                        secure: data.secure,
                        auth: {
                            user: data.username,
                            pass: data.password
                        }
                    });
                    return [4 /*yield*/, transporter.verify()];
                case 5:
                    _a.sent();
                    return [2 /*return*/, true];
                case 6: return [2 /*return*/, false];
                case 7:
                    error_1 = _a.sent();
                    console.error("Email integration healthcheck failed", error_1);
                    return [2 /*return*/, false];
                case 8: return [2 /*return*/];
            }
        });
    });
}
