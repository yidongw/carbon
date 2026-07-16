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
exports.sendEmailFunction = void 0;
var env_1 = require("@carbon/env");
var inngest_1 = require("inngest");
var resend_1 = require("resend");
var client_1 = require("../../client");
exports.sendEmailFunction = client_1.inngest.createFunction({
    id: "send-email",
    retries: 3
}, { event: "carbon/send-email" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var payload, sanitizeRecipients, toRecipients, ccRecipients, fromAddress, result;
    var event = _b.event, step = _b.step;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                payload = event.data;
                sanitizeRecipients = function (value) {
                    if (Array.isArray(value)) {
                        var filtered = value.filter(function (entry) {
                            return typeof entry === "string" && entry.length > 0;
                        });
                        return filtered.length ? filtered : undefined;
                    }
                    return value && typeof value === "string" ? value : undefined;
                };
                toRecipients = sanitizeRecipients(payload.to);
                ccRecipients = sanitizeRecipients(payload.cc);
                if (!toRecipients) {
                    throw new inngest_1.NonRetriableError("send-email called without any valid `to` recipients");
                }
                fromAddress = "Carbon <no-reply@".concat(env_1.RESEND_DOMAIN, ">");
                return [4 /*yield*/, step.run("send-email", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var resend, email, response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (process.env.DISABLE_RESEND) {
                                        console.info("Resend disabled \u2014 skipping send to", toRecipients);
                                        return [2 /*return*/, null];
                                    }
                                    resend = new resend_1.Resend(process.env.RESEND_API_KEY);
                                    email = {
                                        attachments: payload.attachments,
                                        cc: ccRecipients,
                                        from: fromAddress,
                                        html: payload.html,
                                        reply_to: payload.from,
                                        subject: payload.subject,
                                        text: payload.text,
                                        to: toRecipients
                                    };
                                    console.info("Resend Email Job");
                                    return [4 /*yield*/, resend.emails.send(email)];
                                case 1:
                                    response = _a.sent();
                                    if (response.error) {
                                        if (response.error.name === "validation_error") {
                                            throw new inngest_1.NonRetriableError("Resend validation error: ".concat((0, inngest_1.serializeError)(response.error)));
                                        }
                                        throw new Error("Resend error: ".concat((0, inngest_1.serializeError)(response.error)));
                                    }
                                    return [2 /*return*/, response.data];
                            }
                        });
                    }); })];
            case 1:
                result = _c.sent();
                return [2 /*return*/, { result: result, success: true }];
        }
    });
}); });
