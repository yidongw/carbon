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
exports.toE164Phone = toE164Phone;
exports.findPhoneUser = findPhoneUser;
exports.findOrCreatePhoneUser = findOrCreatePhoneUser;
var client_server_1 = require("../lib/supabase/client.server");
var identity_server_1 = require("./identity.server");
// Aliyun's verify-code service is mainland-China only, so the national 11-digit
// number always carries a +86 country code. We canonicalize to E.164 so it
// resolves consistently and the profile's PhoneInput can show the country.
function toE164Phone(phone) {
    return phone.startsWith("+") ? phone : "+86".concat(phone);
}
// Placeholder email so Supabase can anchor the auth user; only used at creation.
// Sessions are later minted against the auth user's *current* email (which a
// linked real email replaces), via getCanonicalAuthEmail.
function syntheticPhoneEmail(e164) {
    return "phone+".concat(e164.replace(/\D/g, ""), "@carbon.internal");
}
function getUserById(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var serviceRole, _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("user")
                            .select("*")
                            .eq("id", userId)
                            .maybeSingle()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error("[phone] user load failed", error);
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, data];
            }
        });
    });
}
/**
 * Look up an existing user by phone identity, without creating one. Used to gate
 * Enterprise deployments, where accounts must be provisioned, not self-created.
 */
function findPhoneUser(phone) {
    return __awaiter(this, void 0, void 0, function () {
        var userId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, identity_server_1.findUserIdByIdentity)("phone", toE164Phone(phone))];
                case 1:
                    userId = _a.sent();
                    return [2 /*return*/, userId ? getUserById(userId) : null];
            }
        });
    });
}
/**
 * Resolve the user for a phone login, creating one (and linking the phone
 * identity) on first sign-in. Identity is assumed already proven by a checked
 * SMS code (see checkSmsVerifyCode). Mirrors findOrCreateWeChatUser.
 */
function findOrCreatePhoneUser(phone) {
    return __awaiter(this, void 0, void 0, function () {
        var serviceRole, e164, existingId, _a, authUser, authError, updatedUser, link;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    e164 = toE164Phone(phone);
                    return [4 /*yield*/, (0, identity_server_1.findUserIdByIdentity)("phone", e164)];
                case 1:
                    existingId = _b.sent();
                    if (existingId)
                        return [2 /*return*/, getUserById(existingId)];
                    return [4 /*yield*/, serviceRole.auth.admin.createUser({
                            email: syntheticPhoneEmail(e164),
                            email_confirm: true,
                            user_metadata: { phone: e164 }
                        })];
                case 2:
                    _a = _b.sent(), authUser = _a.data, authError = _a.error;
                    if (authError || !authUser.user) {
                        console.error("[phone findOrCreate] createUser failed", authError);
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, serviceRole
                            .from("user")
                            .update({ email: null, phone: e164 })
                            .eq("id", authUser.user.id)
                            .select("*")
                            .single()];
                case 3:
                    updatedUser = (_b.sent()).data;
                    return [4 /*yield*/, (0, identity_server_1.linkIdentity)(authUser.user.id, "phone", e164)];
                case 4:
                    link = _b.sent();
                    if (!link.success) {
                        console.error("[phone findOrCreate] identity link failed", link);
                    }
                    return [2 /*return*/, updatedUser];
            }
        });
    });
}
