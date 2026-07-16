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
var client_server_1 = require("@carbon/auth/client.server");
var company_server_1 = require("@carbon/auth/company.server");
var passkey_server_1 = require("@carbon/auth/passkey.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var body, _c, webAuthnResponse, challengeId, redirectTo, serviceRole, _d, credRow, credError, storedCredential, newCounter, returnedHandle, expectedHandle, counterError, authUser, authSession, sessionCookie, companyIdCookie, safeRedirect, _e;
        var _f, _g, _h;
        var request = _b.request;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    if (!(0, auth_1.isAuthProviderEnabled)("passkey")) {
                        return [2 /*return*/, (0, react_router_1.data)((0, auth_1.error)(null, "Passkeys are disabled"), { status: 404 })];
                    }
                    _j.label = 1;
                case 1:
                    _j.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, request.json()];
                case 2:
                    body = _j.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _c = _j.sent();
                    return [2 /*return*/, (0, react_router_1.data)((0, auth_1.error)(null, "Sign-in failed. Please try again."), {
                            status: 400
                        })];
                case 4:
                    webAuthnResponse = body.credential, challengeId = body.challengeId, redirectTo = body.redirectTo;
                    if (!(webAuthnResponse === null || webAuthnResponse === void 0 ? void 0 : webAuthnResponse.id) || !challengeId) {
                        return [2 /*return*/, (0, react_router_1.data)((0, auth_1.error)(null, "Sign-in failed. Please try again."), {
                                status: 400
                            })];
                    }
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("passkeyCredential")
                            .select("id, userId, publicKey, counter, transports")
                            .eq("id", webAuthnResponse.id)
                            .maybeSingle()];
                case 5:
                    _d = _j.sent(), credRow = _d.data, credError = _d.error;
                    if (credError || !credRow) {
                        // Return info so client can call signalUnknownCredential
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                unknownCredential: true,
                                credentialId: webAuthnResponse.id
                            }, { status: 404 })];
                    }
                    storedCredential = {
                        id: credRow.id,
                        publicKey: new Uint8Array(Buffer.from(credRow.publicKey, "base64url")),
                        counter: credRow.counter,
                        transports: (_f = credRow.transports) !== null && _f !== void 0 ? _f : null
                    };
                    _j.label = 6;
                case 6:
                    _j.trys.push([6, 12, , 13]);
                    return [4 /*yield*/, (0, passkey_server_1.verifyPasskeyAuthentication)(challengeId, webAuthnResponse, storedCredential)];
                case 7:
                    newCounter = (_j.sent()).newCounter;
                    returnedHandle = (_g = webAuthnResponse.response) === null || _g === void 0 ? void 0 : _g.userHandle;
                    if (returnedHandle) {
                        expectedHandle = Buffer.from(new TextEncoder().encode(credRow.userId)).toString("base64url");
                        if (returnedHandle !== expectedHandle) {
                            return [2 /*return*/, (0, react_router_1.data)((0, auth_1.error)(null, "Sign-in failed. Please try again."), {
                                    status: 401
                                })];
                        }
                    }
                    return [4 /*yield*/, serviceRole
                            .from("passkeyCredential")
                            .update({ counter: newCounter, lastUsedAt: new Date().toISOString() })
                            .eq("id", credRow.id)];
                case 8:
                    counterError = (_j.sent()).error;
                    if (counterError) {
                        return [2 /*return*/, (0, react_router_1.data)((0, auth_1.error)(null, "Sign-in failed. Please try again."), {
                                status: 500
                            })];
                    }
                    return [4 /*yield*/, serviceRole.auth.admin.getUserById(credRow.userId)];
                case 9:
                    authUser = (_j.sent()).data;
                    if (!((_h = authUser.user) === null || _h === void 0 ? void 0 : _h.email)) {
                        return [2 /*return*/, (0, react_router_1.data)((0, auth_1.error)(null, "Sign-in failed. Please try again."), {
                                status: 401
                            })];
                    }
                    return [4 /*yield*/, (0, auth_server_1.signInWithPasskey)(credRow.userId, authUser.user.email)];
                case 10:
                    authSession = _j.sent();
                    if (!authSession) {
                        return [2 /*return*/, (0, react_router_1.data)((0, auth_1.error)(null, "Sign-in failed. Please try again."), {
                                status: 500
                            })];
                    }
                    return [4 /*yield*/, (0, session_server_1.setAuthSession)(request, { authSession: authSession })];
                case 11:
                    sessionCookie = _j.sent();
                    companyIdCookie = (0, company_server_1.setCompanyId)(authSession.companyId);
                    safeRedirect = redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")
                        ? redirectTo
                        : path_1.path.to.authenticatedRoot;
                    return [2 /*return*/, (0, react_router_1.redirect)(safeRedirect, {
                            headers: [
                                ["Set-Cookie", sessionCookie],
                                ["Set-Cookie", companyIdCookie]
                            ]
                        })];
                case 12:
                    _e = _j.sent();
                    return [2 /*return*/, (0, react_router_1.data)((0, auth_1.error)(null, "Sign-in failed. Please try again."), {
                            status: 401
                        })];
                case 13: return [2 /*return*/];
            }
        });
    });
}
