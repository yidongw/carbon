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
var passkey_server_1 = require("@carbon/auth/passkey.server");
var react_router_1 = require("react-router");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var userId, body, _c, credential, e_1, serviceRole, dbError;
        var _d, _e;
        var request = _b.request;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    if (!(0, auth_1.isAuthProviderEnabled)("passkey")) {
                        return [2 /*return*/, (0, react_router_1.data)((0, auth_1.error)(null, "Passkeys are disabled"), { status: 404 })];
                    }
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    userId = (_f.sent()).userId;
                    _f.label = 2;
                case 2:
                    _f.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, request.json()];
                case 3:
                    body = _f.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _c = _f.sent();
                    return [2 /*return*/, (0, react_router_1.data)((0, auth_1.error)(null, "Invalid request body"), { status: 400 })];
                case 5:
                    _f.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, (0, passkey_server_1.verifyPasskeyRegistration)(userId, body)];
                case 6:
                    credential = _f.sent();
                    return [3 /*break*/, 8];
                case 7:
                    e_1 = _f.sent();
                    return [2 /*return*/, (0, react_router_1.data)((0, auth_1.error)(null, (_d = e_1.message) !== null && _d !== void 0 ? _d : "Verification failed"), {
                            status: 400
                        })];
                case 8:
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("passkeyCredential")
                            .insert({
                            id: credential.id,
                            userId: userId,
                            publicKey: Buffer.from(credential.publicKey).toString("base64url"),
                            counter: credential.counter,
                            transports: (_e = credential.transports) !== null && _e !== void 0 ? _e : [],
                            deviceType: credential.deviceType,
                            backedUp: credential.backedUp,
                            aaguid: credential.aaguid,
                            credentialName: credential.credentialName,
                            rpId: credential.rpId,
                            userHandle: credential.userHandle
                        })];
                case 9:
                    dbError = (_f.sent()).error;
                    if (dbError) {
                        return [2 /*return*/, (0, react_router_1.data)((0, auth_1.error)(dbError, "Failed to save passkey"), { status: 500 })];
                    }
                    return [2 /*return*/, (0, react_router_1.data)({ success: true, credentialName: credential.credentialName })];
            }
        });
    });
}
