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
exports.getUserByEmail = getUserByEmail;
exports.getUserById = getUserById;
exports.getUserClaims = getUserClaims;
exports.deactivateCustomer = deactivateCustomer;
exports.deactivateEmployee = deactivateEmployee;
exports.deactivateUser = deactivateUser;
exports.deactivateSupplier = deactivateSupplier;
var kv_1 = require("@carbon/kv");
var client_server_1 = require("../lib/supabase/client.server");
var result_1 = require("../utils/result");
var users_1 = require("./users");
function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, client_server_1.getCarbonServiceRole)()
                    .from("user")
                    .select("*")
                    .eq("email", email.toLowerCase())
                    .single()];
        });
    });
}
function getUserById(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, client_server_1.getCarbonServiceRole)().from("user").select("*").eq("id", id).single()];
        });
    });
}
function getUserClaims(userId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var claims, cachedClaims, parsed, e_1, rawClaims;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    claims = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 8]);
                    return [4 /*yield*/, kv_1.redis.get((0, users_1.getPermissionCacheKey)(userId))];
                case 2:
                    cachedClaims = _a.sent();
                    if (cachedClaims) {
                        parsed = JSON.parse(cachedClaims);
                        if ((0, users_1.isValidCachedClaims)(parsed)) {
                            claims = parsed;
                        }
                    }
                    return [3 /*break*/, 8];
                case 3:
                    e_1 = _a.sent();
                    console.error("Failed to get claims from redis", e_1);
                    return [3 /*break*/, 8];
                case 4:
                    if (!!claims) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, users_1.getClaims)((0, client_server_1.getCarbonServiceRole)(), userId, companyId)];
                case 5:
                    rawClaims = _a.sent();
                    if (rawClaims.error) {
                        console.error(rawClaims);
                        throw new Error("Failed to get claims");
                    }
                    // convert rawClaims to permissions
                    claims =
                        rawClaims.data === null
                            ? { permissions: {}, role: null }
                            : (0, users_1.makePermissionsFromClaims)(rawClaims.data);
                    if (!claims) {
                        claims = { permissions: {}, role: null };
                    }
                    // store claims in redis
                    return [4 /*yield*/, kv_1.redis.set((0, users_1.getPermissionCacheKey)(userId), JSON.stringify(claims))];
                case 6:
                    // store claims in redis
                    _a.sent();
                    _a.label = 7;
                case 7: return [2 /*return*/, claims];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function deactivateCustomer(serviceRole, userId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var currentPermissions, permissions, companyGroups, groupIds, _a, updatePermissions, userToCompanyDelete, customerAccountDelete;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, serviceRole
                        .from("userPermission")
                        .select("*")
                        .eq("id", userId)
                        .maybeSingle()];
                case 1:
                    currentPermissions = _f.sent();
                    if (currentPermissions.error) {
                        return [2 /*return*/, (0, result_1.error)(currentPermissions.error, "Failed to get user permissions")];
                    }
                    permissions = Object.entries(((_c = (_b = currentPermissions.data) === null || _b === void 0 ? void 0 : _b.permissions) !== null && _c !== void 0 ? _c : {})).reduce(function (acc, _a) {
                        var key = _a[0], value = _a[1];
                        acc[key] = value.filter(function (id) { return id !== companyId; });
                        return acc;
                    }, {});
                    return [4 /*yield*/, serviceRole
                            .from("group")
                            .select("id")
                            .eq("companyId", companyId)];
                case 2:
                    companyGroups = _f.sent();
                    groupIds = (_e = (_d = companyGroups.data) === null || _d === void 0 ? void 0 : _d.map(function (g) { return g.id; })) !== null && _e !== void 0 ? _e : [];
                    return [4 /*yield*/, Promise.all(__spreadArray([
                            serviceRole
                                .from("userPermission")
                                .update({ permissions: permissions })
                                .eq("id", userId),
                            serviceRole
                                .from("userToCompany")
                                .delete()
                                .eq("userId", userId)
                                .eq("companyId", companyId),
                            serviceRole
                                .from("customerAccount")
                                .delete()
                                .eq("id", userId)
                                .eq("companyId", companyId)
                        ], (groupIds.length > 0
                            ? [
                                serviceRole
                                    .from("membership")
                                    .delete()
                                    .eq("memberUserId", userId)
                                    .in("groupId", groupIds)
                            ]
                            : []), true))];
                case 3:
                    _a = _f.sent(), updatePermissions = _a[0], userToCompanyDelete = _a[1], customerAccountDelete = _a[2];
                    if (updatePermissions.error) {
                        return [2 /*return*/, (0, result_1.error)(updatePermissions.error, "Failed to update user permissions")];
                    }
                    if (userToCompanyDelete.error) {
                        return [2 /*return*/, (0, result_1.error)(userToCompanyDelete.error, "Failed to remove user from company")];
                    }
                    if (customerAccountDelete.error) {
                        return [2 /*return*/, (0, result_1.error)(customerAccountDelete.error, "Failed to remove customer account")];
                    }
                    return [2 /*return*/, (0, result_1.success)("Sucessfully deactivated customer")];
            }
        });
    });
}
function deactivateEmployee(serviceRole, userId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var currentPermissions, permissions, companyGroups, groupIds, _a, updatePermissions, userToCompanyDelete, employeeDeactivate;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, serviceRole
                        .from("userPermission")
                        .select("*")
                        .eq("id", userId)
                        .maybeSingle()];
                case 1:
                    currentPermissions = _f.sent();
                    if (currentPermissions.error) {
                        return [2 /*return*/, (0, result_1.error)(currentPermissions.error, "Failed to get user permissions")];
                    }
                    permissions = Object.entries(((_c = (_b = currentPermissions.data) === null || _b === void 0 ? void 0 : _b.permissions) !== null && _c !== void 0 ? _c : {})).reduce(function (acc, _a) {
                        var key = _a[0], value = _a[1];
                        acc[key] = value.filter(function (id) { return id !== companyId; });
                        return acc;
                    }, {});
                    return [4 /*yield*/, serviceRole
                            .from("group")
                            .select("id")
                            .eq("companyId", companyId)];
                case 2:
                    companyGroups = _f.sent();
                    groupIds = (_e = (_d = companyGroups.data) === null || _d === void 0 ? void 0 : _d.map(function (g) { return g.id; })) !== null && _e !== void 0 ? _e : [];
                    return [4 /*yield*/, Promise.all(__spreadArray([
                            serviceRole
                                .from("userPermission")
                                .update({ permissions: permissions })
                                .eq("id", userId),
                            serviceRole
                                .from("userToCompany")
                                .delete()
                                .eq("userId", userId)
                                .eq("companyId", companyId),
                            serviceRole
                                .from("employee")
                                .update({ active: false })
                                .eq("id", userId)
                                .eq("companyId", companyId),
                            serviceRole
                                .from("employeeJob")
                                .delete()
                                .eq("id", userId)
                                .eq("companyId", companyId)
                        ], (groupIds.length > 0
                            ? [
                                serviceRole
                                    .from("membership")
                                    .delete()
                                    .eq("memberUserId", userId)
                                    .in("groupId", groupIds)
                            ]
                            : []), true))];
                case 3:
                    _a = _f.sent(), updatePermissions = _a[0], userToCompanyDelete = _a[1], employeeDeactivate = _a[2];
                    if (updatePermissions.error) {
                        return [2 /*return*/, (0, result_1.error)(updatePermissions.error, "Failed to update user permissions")];
                    }
                    if (userToCompanyDelete.error) {
                        return [2 /*return*/, (0, result_1.error)(userToCompanyDelete.error, "Failed to remove user from company")];
                    }
                    if (employeeDeactivate.error) {
                        return [2 /*return*/, (0, result_1.error)(employeeDeactivate.error, "Failed to deactivate employee")];
                    }
                    return [2 /*return*/, (0, result_1.success)("Sucessfully deactivated employee")];
            }
        });
    });
}
function deactivateUser(serviceRole, userId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var userToCompany, result, user, userEmail, invite, userRecord;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, serviceRole
                        .from("userToCompany")
                        .select("role")
                        .eq("userId", userId)
                        .eq("companyId", companyId)
                        .single()];
                case 1:
                    userToCompany = _f.sent();
                    if (!userToCompany.error) return [3 /*break*/, 11];
                    return [4 /*yield*/, serviceRole
                            .from("user")
                            .select("*")
                            .eq("id", userId)
                            .single()];
                case 2:
                    user = _f.sent();
                    if (user.error) {
                        return [2 /*return*/, (0, result_1.error)(user.error, "Failed to get user")];
                    }
                    userEmail = (_a = user.data) === null || _a === void 0 ? void 0 : _a.email;
                    if (!userEmail) {
                        return [2 /*return*/, (0, result_1.success)("User already deactivated")];
                    }
                    return [4 /*yield*/, serviceRole
                            .from("invite")
                            .select("*")
                            .eq("email", userEmail)
                            .eq("companyId", companyId)
                            .maybeSingle()];
                case 3:
                    invite = _f.sent();
                    if (!invite.data) {
                        // No userToCompany and no invite — already fully deactivated.
                        return [2 /*return*/, (0, result_1.success)("User already deactivated")];
                    }
                    if (!(invite.data.role === "customer")) return [3 /*break*/, 5];
                    return [4 /*yield*/, deactivateCustomer(serviceRole, userId, companyId)];
                case 4:
                    result = _f.sent();
                    return [3 /*break*/, 10];
                case 5:
                    if (!(invite.data.role === "employee")) return [3 /*break*/, 7];
                    return [4 /*yield*/, deactivateEmployee(serviceRole, userId, companyId)];
                case 6:
                    result = _f.sent();
                    return [3 /*break*/, 10];
                case 7:
                    if (!(invite.data.role === "supplier")) return [3 /*break*/, 9];
                    return [4 /*yield*/, deactivateSupplier(serviceRole, userId, companyId)];
                case 8:
                    result = _f.sent();
                    return [3 /*break*/, 10];
                case 9: throw new Error("Invalid user role");
                case 10: return [3 /*break*/, 18];
                case 11:
                    if (!(((_b = userToCompany.data) === null || _b === void 0 ? void 0 : _b.role) === "customer")) return [3 /*break*/, 13];
                    return [4 /*yield*/, deactivateCustomer(serviceRole, userId, companyId)];
                case 12:
                    result = _f.sent();
                    return [3 /*break*/, 18];
                case 13:
                    if (!(((_c = userToCompany.data) === null || _c === void 0 ? void 0 : _c.role) === "employee")) return [3 /*break*/, 15];
                    return [4 /*yield*/, deactivateEmployee(serviceRole, userId, companyId)];
                case 14:
                    result = _f.sent();
                    return [3 /*break*/, 18];
                case 15:
                    if (!(((_d = userToCompany.data) === null || _d === void 0 ? void 0 : _d.role) === "supplier")) return [3 /*break*/, 17];
                    return [4 /*yield*/, deactivateSupplier(serviceRole, userId, companyId)];
                case 16:
                    result = _f.sent();
                    return [3 /*break*/, 18];
                case 17: throw new Error("Invalid user role");
                case 18:
                    if (!(result && result.success)) return [3 /*break*/, 20];
                    return [4 /*yield*/, kv_1.redis.del((0, users_1.getPermissionCacheKey)(userId))];
                case 19:
                    _f.sent();
                    _f.label = 20;
                case 20:
                    if (!(result && result.success)) return [3 /*break*/, 23];
                    return [4 /*yield*/, serviceRole
                            .from("user")
                            .select("email")
                            .eq("id", userId)
                            .single()];
                case 21:
                    userRecord = _f.sent();
                    if (!(!userRecord.error && ((_e = userRecord.data) === null || _e === void 0 ? void 0 : _e.email))) return [3 /*break*/, 23];
                    return [4 /*yield*/, serviceRole
                            .from("invite")
                            .update({ revokedAt: new Date().toISOString() })
                            .eq("email", userRecord.data.email)
                            .eq("companyId", companyId)
                            .is("revokedAt", null)];
                case 22:
                    _f.sent();
                    _f.label = 23;
                case 23: return [2 /*return*/, result];
            }
        });
    });
}
function deactivateSupplier(serviceRole, userId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var currentPermissions, permissions, companyGroups, groupIds, _a, updatePermissions, userToCompanyDelete, supplierAccountDelete;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, serviceRole
                        .from("userPermission")
                        .select("*")
                        .eq("id", userId)
                        .maybeSingle()];
                case 1:
                    currentPermissions = _f.sent();
                    if (currentPermissions.error) {
                        return [2 /*return*/, (0, result_1.error)(currentPermissions.error, "Failed to get user permissions")];
                    }
                    permissions = Object.entries(((_c = (_b = currentPermissions.data) === null || _b === void 0 ? void 0 : _b.permissions) !== null && _c !== void 0 ? _c : {})).reduce(function (acc, _a) {
                        var key = _a[0], value = _a[1];
                        acc[key] = value.filter(function (id) { return id !== companyId; });
                        return acc;
                    }, {});
                    return [4 /*yield*/, serviceRole
                            .from("group")
                            .select("id")
                            .eq("companyId", companyId)];
                case 2:
                    companyGroups = _f.sent();
                    groupIds = (_e = (_d = companyGroups.data) === null || _d === void 0 ? void 0 : _d.map(function (g) { return g.id; })) !== null && _e !== void 0 ? _e : [];
                    return [4 /*yield*/, Promise.all(__spreadArray([
                            serviceRole
                                .from("userPermission")
                                .update({ permissions: permissions })
                                .eq("id", userId),
                            serviceRole
                                .from("userToCompany")
                                .delete()
                                .eq("userId", userId)
                                .eq("companyId", companyId),
                            serviceRole
                                .from("supplierAccount")
                                .delete()
                                .eq("id", userId)
                                .eq("companyId", companyId)
                        ], (groupIds.length > 0
                            ? [
                                serviceRole
                                    .from("membership")
                                    .delete()
                                    .eq("memberUserId", userId)
                                    .in("groupId", groupIds)
                            ]
                            : []), true))];
                case 3:
                    _a = _f.sent(), updatePermissions = _a[0], userToCompanyDelete = _a[1], supplierAccountDelete = _a[2];
                    if (updatePermissions.error) {
                        return [2 /*return*/, (0, result_1.error)(updatePermissions.error, "Failed to update user permissions")];
                    }
                    if (userToCompanyDelete.error) {
                        return [2 /*return*/, (0, result_1.error)(userToCompanyDelete.error, "Failed to remove user from company")];
                    }
                    if (supplierAccountDelete.error) {
                        return [2 /*return*/, (0, result_1.error)(supplierAccountDelete.error, "Failed to remove supplier account")];
                    }
                    return [2 /*return*/, (0, result_1.success)("Sucessfully deactivated supplier")];
            }
        });
    });
}
