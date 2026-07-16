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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePermissionsFunction = void 0;
exports.updatePermissions = updatePermissions;
var auth_1 = require("@carbon/auth");
var client_server_1 = require("@carbon/auth/client.server");
var kv_1 = require("@carbon/kv");
var client_1 = require("../../client");
exports.updatePermissionsFunction = client_1.inngest.createFunction({ id: "update-permissions", retries: 3 }, { event: "carbon/update-permissions" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var serviceRole, payload, result;
    var event = _b.event, step = _b.step;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                serviceRole = (0, client_server_1.getCarbonServiceRole)();
                payload = event.data;
                return [4 /*yield*/, step.run("update-permissions", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, success, message;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    console.info("Permission Update for ".concat(payload.id));
                                    return [4 /*yield*/, updatePermissions(serviceRole, payload)];
                                case 1:
                                    _a = _b.sent(), success = _a.success, message = _a.message;
                                    if (success) {
                                        console.info("Permission Update for ".concat(payload.id, " succeeded"));
                                    }
                                    else {
                                        console.error("Permission Update for ".concat(payload.id, " failed: ").concat(message));
                                    }
                                    return [2 /*return*/, { success: success, message: message }];
                            }
                        });
                    }); })];
            case 1:
                result = _c.sent();
                return [2 /*return*/, result];
        }
    });
}); });
function updatePermissions(client_2, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var claims, updatedPermissions_1, permissionsUpdate;
        var id = _b.id, permissions = _b.permissions, companyId = _b.companyId, _c = _b.addOnly, addOnly = _c === void 0 ? false : _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, client.rpc("is_claims_admin")];
                case 1:
                    if (!_d.sent()) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, auth_1.getClaims)(client, id)];
                case 2:
                    claims = _d.sent();
                    if (claims.error)
                        return [2 /*return*/, (0, auth_1.error)(claims.error, "Failed to get claims")];
                    updatedPermissions_1 = (typeof claims.data !== "object" ||
                        Array.isArray(claims.data) ||
                        claims.data === null
                        ? {}
                        : claims.data);
                    delete updatedPermissions_1.role;
                    // add any missing claims to the current claims
                    Object.keys(permissions).forEach(function (name) {
                        var module = name.toLowerCase();
                        if (!("".concat(module, "_view") in updatedPermissions_1)) {
                            updatedPermissions_1["".concat(module, "_view")] = [];
                        }
                        if (!("".concat(module, "_create") in updatedPermissions_1)) {
                            updatedPermissions_1["".concat(module, "_create")] = [];
                        }
                        if (!("".concat(module, "_update") in updatedPermissions_1)) {
                            updatedPermissions_1["".concat(module, "_update")] = [];
                        }
                        if (!("".concat(module, "_delete") in updatedPermissions_1)) {
                            updatedPermissions_1["".concat(module, "_delete")] = [];
                        }
                    });
                    if (addOnly) {
                        Object.entries(permissions).forEach(function (_a) {
                            var _b, _c, _d, _e;
                            var name = _a[0], permission = _a[1];
                            var module = name.toLowerCase();
                            if (permission.view &&
                                !((_b = updatedPermissions_1["".concat(module, "_view")]) === null || _b === void 0 ? void 0 : _b.includes(companyId))) {
                                updatedPermissions_1["".concat(module, "_view")].push(companyId);
                            }
                            if (permission.create &&
                                !((_c = updatedPermissions_1["".concat(module, "_create")]) === null || _c === void 0 ? void 0 : _c.includes(companyId))) {
                                updatedPermissions_1["".concat(module, "_create")].push(companyId);
                            }
                            if (permission.update &&
                                !((_d = updatedPermissions_1["".concat(module, "_update")]) === null || _d === void 0 ? void 0 : _d.includes(companyId))) {
                                updatedPermissions_1["".concat(module, "_update")].push(companyId);
                            }
                            if (permission.delete &&
                                !((_e = updatedPermissions_1["".concat(module, "_delete")]) === null || _e === void 0 ? void 0 : _e.includes(companyId))) {
                                updatedPermissions_1["".concat(module, "_delete")].push(companyId);
                            }
                        });
                    }
                    else {
                        Object.entries(permissions).forEach(function (_a) {
                            var _b, _c, _d, _e, _f, _g, _h, _j;
                            var name = _a[0], permission = _a[1];
                            var module = name.toLowerCase();
                            if (permission.view) {
                                if (!((_b = updatedPermissions_1["".concat(module, "_view")]) === null || _b === void 0 ? void 0 : _b.includes(companyId))) {
                                    updatedPermissions_1["".concat(module, "_view")] = __spreadArray(__spreadArray([], ((_c = updatedPermissions_1["".concat(module, "_view")]) !== null && _c !== void 0 ? _c : []), true), [
                                        companyId
                                    ], false);
                                }
                            }
                            else {
                                updatedPermissions_1["".concat(module, "_view")] = updatedPermissions_1["".concat(module, "_view")].filter(function (c) { return c !== companyId; });
                            }
                            if (permission.create) {
                                if (!((_d = updatedPermissions_1["".concat(module, "_create")]) === null || _d === void 0 ? void 0 : _d.includes(companyId))) {
                                    updatedPermissions_1["".concat(module, "_create")] = __spreadArray(__spreadArray([], ((_e = updatedPermissions_1["".concat(module, "_create")]) !== null && _e !== void 0 ? _e : []), true), [
                                        companyId
                                    ], false);
                                }
                            }
                            else {
                                updatedPermissions_1["".concat(module, "_create")] = updatedPermissions_1["".concat(module, "_create")].filter(function (c) { return c !== companyId; });
                            }
                            if (permission.update) {
                                if (!((_f = updatedPermissions_1["".concat(module, "_update")]) === null || _f === void 0 ? void 0 : _f.includes(companyId))) {
                                    updatedPermissions_1["".concat(module, "_update")] = __spreadArray(__spreadArray([], ((_g = updatedPermissions_1["".concat(module, "_update")]) !== null && _g !== void 0 ? _g : []), true), [
                                        companyId
                                    ], false);
                                }
                            }
                            else {
                                updatedPermissions_1["".concat(module, "_update")] = updatedPermissions_1["".concat(module, "_update")].filter(function (c) { return c !== companyId; });
                            }
                            if (permission.delete) {
                                if (!((_h = updatedPermissions_1["".concat(module, "_delete")]) === null || _h === void 0 ? void 0 : _h.includes(companyId))) {
                                    updatedPermissions_1["".concat(module, "_delete")] = __spreadArray(__spreadArray([], ((_j = updatedPermissions_1["".concat(module, "_delete")]) !== null && _j !== void 0 ? _j : []), true), [
                                        companyId
                                    ], false);
                                }
                            }
                            else {
                                updatedPermissions_1["".concat(module, "_delete")] = updatedPermissions_1["".concat(module, "_delete")].filter(function (c) { return c !== companyId; });
                            }
                        });
                    }
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()
                            .from("userPermission")
                            .update({ permissions: updatedPermissions_1 })
                            .eq("id", id)];
                case 3:
                    permissionsUpdate = _d.sent();
                    if (permissionsUpdate.error)
                        return [2 /*return*/, (0, auth_1.error)(permissionsUpdate.error, "Failed to update claims")];
                    return [4 /*yield*/, kv_1.redis.del((0, auth_1.getPermissionCacheKey)(id))];
                case 4:
                    _d.sent();
                    return [2 /*return*/, (0, auth_1.success)("Permissions updated")];
                case 5: return [2 /*return*/, (0, auth_1.error)(null, "You do not have permission to update permissions")];
            }
        });
    });
}
