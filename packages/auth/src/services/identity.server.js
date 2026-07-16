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
exports.getUserIdentities = getUserIdentities;
exports.userHasEmailIdentity = userHasEmailIdentity;
exports.findUserIdByIdentity = findUserIdByIdentity;
exports.linkIdentity = linkIdentity;
exports.unlinkIdentity = unlinkIdentity;
exports.getCanonicalAuthEmail = getCanonicalAuthEmail;
var client_server_1 = require("../lib/supabase/client.server");
/** A user's linked login methods, for the profile "Login methods" card. */
function getUserIdentities(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var serviceRole, _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("userIdentity")
                            .select("id, type, value, verifiedAt, createdAt")
                            .eq("userId", userId)
                            .order("createdAt", { ascending: true })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error("[identity] list failed", error);
                        return [2 /*return*/, []];
                    }
                    return [2 /*return*/, data !== null && data !== void 0 ? data : []];
            }
        });
    });
}
/**
 * Whether the user already has an email-OTP login method. Used to decide
 * whether to ADOPT an OAuth email as the account's canonical address. On lookup
 * error this returns `true` (fail-safe): adopting on a false "no email" would
 * resurrect a previously-removed email or overwrite the canonical address, so
 * when we can't confirm the absence we skip adoption rather than risk it.
 */
function userHasEmailIdentity(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var serviceRole, _a, count, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("userIdentity")
                            .select("id", { count: "exact", head: true })
                            .eq("userId", userId)
                            .eq("type", "email")];
                case 1:
                    _a = _b.sent(), count = _a.count, error = _a.error;
                    if (error) {
                        console.error("[identity] email-identity check failed", error);
                        return [2 /*return*/, true];
                    }
                    return [2 /*return*/, (count !== null && count !== void 0 ? count : 0) > 0];
            }
        });
    });
}
/** Resolve which user owns a given identity (the heart of login resolution). */
function findUserIdByIdentity(type, value) {
    return __awaiter(this, void 0, void 0, function () {
        var serviceRole, _a, data, error;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("userIdentity")
                            .select("userId")
                            .eq("type", type)
                            .eq("value", value)
                            .maybeSingle()];
                case 1:
                    _a = _c.sent(), data = _a.data, error = _a.error;
                    // Surface lookup errors as "unknown" rather than risk mis-resolving identity.
                    if (error) {
                        console.error("[identity] lookup failed", error);
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, (_b = data === null || data === void 0 ? void 0 : data.userId) !== null && _b !== void 0 ? _b : null];
            }
        });
    });
}
/**
 * Attach a login method to a user. Idempotent if it already belongs to this
 * user; blocks (conflict) if it belongs to another — we never silently move an
 * identity between accounts.
 */
function linkIdentity(userId_1, type_1, value_1) {
    return __awaiter(this, arguments, void 0, function (userId, type, value, _a) {
        var serviceRole, existingOwner, error;
        var _b = _a === void 0 ? {} : _a, _c = _b.verified, verified = _c === void 0 ? true : _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, findUserIdByIdentity(type, value)];
                case 1:
                    existingOwner = _d.sent();
                    if (existingOwner) {
                        return [2 /*return*/, existingOwner === userId
                                ? { success: true }
                                : { success: false, reason: "conflict" }];
                    }
                    return [4 /*yield*/, serviceRole.from("userIdentity").insert({
                            userId: userId,
                            type: type,
                            value: value,
                            verifiedAt: verified ? new Date().toISOString() : null
                        })];
                case 2:
                    error = (_d.sent()).error;
                    if (error) {
                        // A unique-violation here means it was linked concurrently to someone else.
                        console.error("[identity] link failed", error);
                        return [2 /*return*/, { success: false, reason: "conflict" }];
                    }
                    return [2 /*return*/, { success: true }];
            }
        });
    });
}
/**
 * Remove a login method. Refuses to remove the user's last one so the account
 * can't be locked out.
 */
function unlinkIdentity(userId, type, value) {
    return __awaiter(this, void 0, void 0, function () {
        var serviceRole, identities, error, rpcError, isEmailFamily, shouldFree, synthetic, currentEmail, resetError;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, getUserIdentities(userId)];
                case 1:
                    identities = _b.sent();
                    if (identities.length <= 1) {
                        return [2 /*return*/, { success: false, reason: "last_method" }];
                    }
                    return [4 /*yield*/, serviceRole
                            .from("userIdentity")
                            .delete()
                            .eq("userId", userId)
                            .eq("type", type)
                            .eq("value", value)];
                case 2:
                    error = (_b.sent()).error;
                    if (error) {
                        console.error("[identity] unlink failed", error);
                        return [2 /*return*/, { success: false, reason: "error" }];
                    }
                    if (!(type === "google" || type === "azure")) return [3 /*break*/, 4];
                    return [4 /*yield*/, serviceRole.rpc("delete_oauth_identity", {
                            p_user_id: userId,
                            p_provider: type,
                            p_email: value
                        })];
                case 3:
                    rpcError = (_b.sent()).error;
                    if (rpcError) {
                        console.error("[identity] failed to remove GoTrue OAuth identity", rpcError);
                    }
                    _b.label = 4;
                case 4:
                    isEmailFamily = type === "email" || type === "google" || type === "azure";
                    shouldFree = false;
                    if (!isEmailFamily) return [3 /*break*/, 5];
                    shouldFree = !identities.some(function (i) {
                        return !(i.type === type && i.value === value) &&
                            (i.type === "email" || i.type === "google" || i.type === "azure");
                    });
                    return [3 /*break*/, 7];
                case 5:
                    synthetic = type === "phone"
                        ? "phone+".concat(value.replace(/\D/g, ""), "@carbon.internal")
                        : type === "wechat"
                            ? "wechat+".concat(value.toLowerCase(), "@carbon.internal")
                            : null;
                    return [4 /*yield*/, getCanonicalAuthEmail(userId)];
                case 6:
                    currentEmail = (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                    shouldFree = !!synthetic && currentEmail === synthetic.toLowerCase();
                    _b.label = 7;
                case 7:
                    if (!shouldFree) return [3 /*break*/, 10];
                    return [4 /*yield*/, serviceRole.auth.admin.updateUserById(userId, { email: "freed-".concat(userId, "@carbon.internal"), email_confirm: true })];
                case 8:
                    resetError = (_b.sent()).error;
                    if (resetError) {
                        console.error("[identity] freeing auth email failed", resetError);
                    }
                    // Clear the public email too — it has a partial-unique index, so a leftover
                    // value would block re-registering it (no-op when already null).
                    return [4 /*yield*/, serviceRole.from("user").update({ email: null }).eq("id", userId)];
                case 9:
                    // Clear the public email too — it has a partial-unique index, so a leftover
                    // value would block re-registering it (no-op when already null).
                    _b.sent();
                    _b.label = 10;
                case 10: return [2 /*return*/, { success: true }];
            }
        });
    });
}
/**
 * The auth user's current email. Any login method mints its session by
 * generateLink against this address, so it stays correct even after a
 * phone/wechat user links a real email (which replaces the synthetic one).
 */
function getCanonicalAuthEmail(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var serviceRole, _a, data, error;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole.auth.admin.getUserById(userId)];
                case 1:
                    _a = _c.sent(), data = _a.data, error = _a.error;
                    if (error || !((_b = data.user) === null || _b === void 0 ? void 0 : _b.email)) {
                        console.error("[identity] canonical email lookup failed", error);
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, data.user.email];
            }
        });
    });
}
