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
exports.RP_ID = void 0;
exports.storeRegistrationChallenge = storeRegistrationChallenge;
exports.getAndDeleteRegistrationChallenge = getAndDeleteRegistrationChallenge;
exports.storeAuthChallenge = storeAuthChallenge;
exports.getAndDeleteAuthChallenge = getAndDeleteAuthChallenge;
exports.getPasskeyRegistrationOptions = getPasskeyRegistrationOptions;
exports.verifyPasskeyRegistration = verifyPasskeyRegistration;
exports.getPasskeyAuthenticationOptions = getPasskeyAuthenticationOptions;
exports.verifyPasskeyAuthentication = verifyPasskeyAuthentication;
exports.getCredentialName = getCredentialName;
var kv_1 = require("@carbon/kv");
var server_1 = require("@simplewebauthn/server");
var env_1 = require("../config/env");
// ── RP (Relying Party) configuration ────────────────────────────────────────
//
// The Relying Party is our application. WebAuthn binds passkeys to the RP_ID
// so a passkey registered on "app.carbon.ms" cannot be used on a different domain.
//
// Rules:
//  - RP_ID must be a bare hostname — no protocol, no port.
//  - RP_ID must be an exact match OR a registrable suffix of the page origin.
//    e.g. origin "https://app.carbon.ms" → valid RP_IDs: "app.carbon.ms" or "carbon.ms"
//  - ORIGIN must be the full URL the browser reports (window.location.origin),
//    including protocol and port. Used server-side to verify the attestation origin.
/** The Relying Party identifier — bare hostname, no port. Exported so routes can store it. */
exports.RP_ID = env_1.DOMAIN && !env_1.DOMAIN.startsWith("localhost") ? env_1.DOMAIN : "localhost";
/** The expected origin(s) sent by the browser during registration/authentication.
 *  Both ERP and MES subdomains share the same RP_ID (the parent DOMAIN), so a
 *  passkey registered on either app works on both — but @simplewebauthn checks
 *  origin exactly, so we pass an array of allowed origins. */
var ORIGIN = env_1.DOMAIN && !env_1.DOMAIN.startsWith("localhost")
    ? ["https://".concat(env_1.DOMAIN), env_1.ERP_URL, env_1.MES_URL].filter(function (url, idx, arr) { return !!url && arr.indexOf(url) === idx; })
    : (env_1.VERCEL_URL === null || env_1.VERCEL_URL === void 0 ? void 0 : env_1.VERCEL_URL.startsWith("http"))
        ? env_1.VERCEL_URL
        : "http://localhost:3000";
var CHALLENGE_TTL_SECONDS = 300; // 5 minutes
// ── Challenge storage in Redis ───────────────────────────────────────────────
//
// Challenges are one-time random strings generated by the server and sent to
// the browser. The browser signs them (along with other data) with the passkey
// private key. The server then verifies the signature against the stored
// challenge to prevent replay attacks.
//
// Challenges are stored in Redis with a 5-minute TTL and deleted immediately
// after the first use (get-and-delete pattern).
function regChallengeKey(userId) {
    return "passkey:reg:challenge:".concat(userId);
}
function authChallengeKey(challengeId) {
    return "passkey:auth:challenge:".concat(challengeId);
}
/** Store a registration challenge for the given user. Overwrites any existing one. */
function storeRegistrationChallenge(userId, challenge) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, kv_1.redis.set(regChallengeKey(userId), challenge, "EX", CHALLENGE_TTL_SECONDS)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Retrieve and immediately delete the registration challenge for a user.
 * Returns null if not found or expired — the caller should treat this as an error.
 *
 */
function getAndDeleteRegistrationChallenge(userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, kv_1.redis.getdel(regChallengeKey(userId))];
        });
    });
}
/** Store an authentication challenge keyed by a random challengeId (not userId,
 *  since we don't know who the user is yet at this point in the auth flow). */
function storeAuthChallenge(challengeId, challenge) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, kv_1.redis.set(authChallengeKey(challengeId), challenge, "EX", CHALLENGE_TTL_SECONDS)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Retrieve and immediately delete the authentication challenge.
 * Returns null if not found or expired.
 *
 */
function getAndDeleteAuthChallenge(challengeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, kv_1.redis.getdel(authChallengeKey(challengeId))];
        });
    });
}
// ── Registration ─────────────────────────────────────────────────────────────
/**
 * Generate PublicKeyCredentialCreationOptions to send to the browser.
 *
 * Key decisions:
 * - attestationType "none": we don't need device attestation (reduces friction).
 * - authenticatorAttachment "platform": device-bound authenticators only
 *   (Touch ID, Face ID, Windows Hello). Excludes USB security keys.
 * - requireResidentKey true: the passkey is stored on the device (discoverable),
 *   so the user doesn't need to type their email before using it.
 * - excludeCredentials: prevents the same device registering twice for this user.
 */
function getPasskeyRegistrationOptions(userId, userEmail, userDisplayName, existingCredentialIds) {
    return __awaiter(this, void 0, void 0, function () {
        var options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_1.generateRegistrationOptions)({
                        rpName: "Carbon",
                        rpID: exports.RP_ID,
                        userName: userEmail,
                        userDisplayName: userDisplayName || userEmail,
                        userID: new TextEncoder().encode(userId),
                        attestationType: "none",
                        excludeCredentials: existingCredentialIds.map(function (id) { return ({
                            id: id,
                            type: "public-key"
                        }); }),
                        authenticatorSelection: {
                            authenticatorAttachment: "platform",
                            requireResidentKey: true,
                            residentKey: "required",
                            userVerification: "required"
                        },
                        // -7 = ECDSA P-256, -257 = RSA PKCS#1 v1.5 SHA-256
                        supportedAlgorithmIDs: [-7, -257]
                    })];
                case 1:
                    options = _a.sent();
                    return [4 /*yield*/, storeRegistrationChallenge(userId, options.challenge)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, options];
            }
        });
    });
}
/**
 * Verify the registration response from the browser and extract the credential
 * data to persist in the database.
 *
 * Throws if the challenge is missing/expired or if verification fails.
 */
function verifyPasskeyRegistration(userId, response) {
    return __awaiter(this, void 0, void 0, function () {
        var challenge, verification, _a, credential, aaguid, credentialDeviceType, credentialBackedUp, userHandle;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getAndDeleteRegistrationChallenge(userId)];
                case 1:
                    challenge = _b.sent();
                    if (!challenge)
                        throw new Error("Registration challenge not found or expired");
                    return [4 /*yield*/, (0, server_1.verifyRegistrationResponse)({
                            response: response,
                            expectedChallenge: challenge,
                            expectedOrigin: ORIGIN,
                            expectedRPID: exports.RP_ID,
                            requireUserVerification: true
                        })];
                case 2:
                    verification = _b.sent();
                    if (!verification.verified || !verification.registrationInfo) {
                        throw new Error("Registration verification failed");
                    }
                    _a = verification.registrationInfo, credential = _a.credential, aaguid = _a.aaguid, credentialDeviceType = _a.credentialDeviceType, credentialBackedUp = _a.credentialBackedUp;
                    userHandle = Buffer.from(new TextEncoder().encode(userId)).toString("base64url");
                    return [2 /*return*/, {
                            id: credential.id,
                            publicKey: credential.publicKey,
                            counter: credential.counter,
                            transports: response.response.transports || null,
                            deviceType: credentialDeviceType,
                            backedUp: credentialBackedUp,
                            aaguid: aaguid || "",
                            credentialName: getCredentialName(aaguid),
                            userHandle: userHandle,
                            rpId: exports.RP_ID
                        }];
            }
        });
    });
}
// ── Authentication ───────────────────────────────────────────────────────────
/**
 * Generate PublicKeyCredentialRequestOptions to send to the browser.
 *
 * allowCredentials is intentionally empty — this triggers "discoverable credential"
 * mode, where the browser shows a picker of all passkeys the user has for this RP,
 * without requiring them to type their email first.
 *
 * The challengeId is a random ID we generate and send alongside the options so
 * the verify endpoint can retrieve the right challenge from Redis.
 */
function getPasskeyAuthenticationOptions(challengeId) {
    return __awaiter(this, void 0, void 0, function () {
        var options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_1.generateAuthenticationOptions)({
                        rpID: exports.RP_ID,
                        allowCredentials: [],
                        userVerification: "required"
                    })];
                case 1:
                    options = _a.sent();
                    return [4 /*yield*/, storeAuthChallenge(challengeId, options.challenge)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, options];
            }
        });
    });
}
/**
 * Verify the authentication response from the browser.
 * Returns the new counter value so the caller can update the DB.
 * Throws if the challenge is missing/expired or verification fails.
 */
function verifyPasskeyAuthentication(challengeId, response, credential) {
    return __awaiter(this, void 0, void 0, function () {
        var challenge, verification;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAndDeleteAuthChallenge(challengeId)];
                case 1:
                    challenge = _a.sent();
                    if (!challenge)
                        throw new Error("Authentication challenge not found or expired");
                    return [4 /*yield*/, (0, server_1.verifyAuthenticationResponse)({
                            response: response,
                            expectedChallenge: challenge,
                            expectedOrigin: ORIGIN,
                            expectedRPID: exports.RP_ID,
                            requireUserVerification: true,
                            credential: {
                                id: credential.id,
                                publicKey: credential.publicKey,
                                counter: credential.counter,
                                transports: credential.transports || undefined
                            }
                        })];
                case 2:
                    verification = _a.sent();
                    if (!verification.verified) {
                        throw new Error("Authentication verification failed");
                    }
                    return [2 /*return*/, {
                            newCounter: verification.authenticationInfo.newCounter
                        }];
            }
        });
    });
}
// ── AAGUID → provider name ───────────────────────────────────────────────────
//
// AAGUID (Authenticator Attestation GUID) is a UUID that identifies the make
// and model of the authenticator. We use it to display a friendly name like
// "iCloud Keychain" instead of a raw credential ID.
//
// Source: https://passkeydeveloper.github.io/passkey-authenticator-aaguids/
var AAGUID_NAMES = {
    "ea9b8d66-4d01-1d21-3ce4-b6b48cb575d4": "Google Password Manager",
    "adce0002-35bc-c60a-648b-0b25f1f05503": "Chrome on Mac",
    "fbfc3007-154e-4ecc-8c0b-6e020557d7bd": "iCloud Keychain",
    "08987058-cadc-4b81-b6e1-30de50dcbe96": "Windows Hello"
    // "b93fd961-f2e6-462f-b122-82002247de78": "Android Fingerprint",
    // "6d44ba9b-f6ec-2e49-b930-0c8fe920cb73": "Chrome on Android",
    // "17290f1e-c212-34d0-1423-365d729f09d9": "Chrome on iPhone",
    // "f8a011f3-8c0a-4d15-8006-17111f9edc7d": "Security Key"
};
function getCredentialName(aaguid) {
    if (!aaguid)
        return "Passkey";
    return AAGUID_NAMES[aaguid] || "Passkey";
}
