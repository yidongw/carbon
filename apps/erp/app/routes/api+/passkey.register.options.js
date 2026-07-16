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
        var _c, userId, email, serviceRole, existing, existingIds, userData, displayName, options, e_1;
        var _d, _e, _f;
        var request = _b.request;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    if (!(0, auth_1.isAuthProviderEnabled)("passkey")) {
                        return [2 /*return*/, (0, react_router_1.data)((0, auth_1.error)(null, "Passkeys are disabled"), { status: 404 })];
                    }
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _g.sent(), userId = _c.userId, email = _c.email;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("passkeyCredential")
                            .select("id")
                            .eq("userId", userId)];
                case 2:
                    existing = (_g.sent()).data;
                    existingIds = (existing !== null && existing !== void 0 ? existing : []).map(function (c) { return c.id; });
                    return [4 /*yield*/, serviceRole
                            .from("user")
                            .select("firstName, lastName")
                            .eq("id", userId)
                            .single()];
                case 3:
                    userData = (_g.sent()).data;
                    displayName = userData
                        ? "".concat((_d = userData.firstName) !== null && _d !== void 0 ? _d : "", " ").concat((_e = userData.lastName) !== null && _e !== void 0 ? _e : "").trim()
                        : email;
                    _g.label = 4;
                case 4:
                    _g.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, (0, passkey_server_1.getPasskeyRegistrationOptions)(userId, email, displayName || email, existingIds)];
                case 5:
                    options = _g.sent();
                    return [2 /*return*/, (0, react_router_1.data)(options)];
                case 6:
                    e_1 = _g.sent();
                    return [2 /*return*/, (0, react_router_1.data)((0, auth_1.error)(null, (_f = e_1.message) !== null && _f !== void 0 ? _f : "Failed to generate options"), {
                            status: 500
                        })];
                case 7: return [2 /*return*/];
            }
        });
    });
}
