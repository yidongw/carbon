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
exports.acceptInvite = acceptInvite;
exports.grantEmployeeAccess = grantEmployeeAccess;
exports.addUserToCompany = addUserToCompany;
exports.createCustomerAccount = createCustomerAccount;
exports.createEmployeeAccount = createEmployeeAccount;
exports.createSupplierAccount = createSupplierAccount;
exports.getClaims = getClaims;
exports.getCurrentUser = getCurrentUser;
exports.getPermissionCacheKey = getPermissionCacheKey;
exports.getUser = getUser;
exports.getUserByEmail = getUserByEmail;
exports.isMesOnlyEmployee = isMesOnlyEmployee;
exports.getUserClaims = getUserClaims;
exports.getUserGroups = getUserGroups;
exports.getUserDefaults = getUserDefaults;
exports.getModulePreferences = getModulePreferences;
exports.upsertModulePreferences = upsertModulePreferences;
exports.insertEmployee = insertEmployee;
exports.insertInvite = insertInvite;
exports.createConsoleOperator = createConsoleOperator;
exports.convertConsoleOperatorToUser = convertConsoleOperatorToUser;
exports.makeEmptyPermissionsFromModules = makeEmptyPermissionsFromModules;
exports.makeCompanyPermissionsFromClaims = makeCompanyPermissionsFromClaims;
exports.makePermissionsFromClaims = makePermissionsFromClaims;
exports.makeCompanyPermissionsFromEmployeeType = makeCompanyPermissionsFromEmployeeType;
exports.getInvite = getInvite;
exports.resetPassword = resetPassword;
exports.updateEmployee = updateEmployee;
exports.updatePermissions = updatePermissions;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var users_server_1 = require("@carbon/auth/users.server");
var kv_1 = require("@carbon/kv");
var react_router_1 = require("react-router");
var purchasing_1 = require("~/modules/purchasing");
var sales_1 = require("~/modules/sales");
var users_1 = require("~/modules/users");
var path_1 = require("~/utils/path");
var people_service_1 = require("../people/people.service");
function acceptInvite(serviceRole, code, email) {
    return __awaiter(this, void 0, void 0, function () {
        var invite, user, activationFunction, _a, activate, addUser, setPermissions;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, serviceRole
                        .from("invite")
                        .select("*")
                        .eq("code", code)
                        .is("acceptedAt", null)
                        .is("revokedAt", null)
                        .single()];
                case 1:
                    invite = _b.sent();
                    if (invite.error)
                        return [2 /*return*/, invite];
                    if (email && invite.data.email !== email) {
                        throw new Error("Invite code does not match email. Please logout and try again.");
                    }
                    return [4 /*yield*/, getUserByEmail(invite.data.email)];
                case 2:
                    user = _b.sent();
                    if (user.error)
                        return [2 /*return*/, user];
                    activationFunction = invite.data.role === "employee"
                        ? activateEmployee
                        : invite.data.role === "customer"
                            ? activateCustomer
                            : invite.data.role === "supplier"
                                ? activateSupplier
                                : null;
                    if (!activationFunction) {
                        return [2 /*return*/, {
                                data: null,
                                error: {
                                    message: "Invalid invite role"
                                }
                            }];
                    }
                    return [4 /*yield*/, Promise.all([
                            activationFunction(serviceRole, {
                                userId: user.data.id,
                                companyId: invite.data.companyId
                            }),
                            addUserToCompany(serviceRole, {
                                userId: user.data.id,
                                companyId: invite.data.companyId,
                                role: invite.data.role
                            }),
                            setUserPermissions(serviceRole, user.data.id, invite.data.permissions)
                        ])];
                case 3:
                    _a = _b.sent(), activate = _a[0], addUser = _a[1], setPermissions = _a[2];
                    if (!activate.error) return [3 /*break*/, 5];
                    console.error(activate.error);
                    return [4 /*yield*/, rollbackInvite(serviceRole, {
                            userId: user.data.id,
                            companyId: invite.data.companyId
                        })];
                case 4:
                    _b.sent();
                    return [2 /*return*/, activate];
                case 5:
                    if (!addUser.error) return [3 /*break*/, 7];
                    console.error(addUser.error);
                    return [4 /*yield*/, rollbackInvite(serviceRole, {
                            userId: user.data.id,
                            companyId: invite.data.companyId
                        })];
                case 6:
                    _b.sent();
                    return [2 /*return*/, addUser];
                case 7:
                    if (!setPermissions.error) return [3 /*break*/, 9];
                    console.error(setPermissions.error);
                    return [4 /*yield*/, rollbackInvite(serviceRole, {
                            userId: user.data.id,
                            companyId: invite.data.companyId
                        })];
                case 8:
                    _b.sent();
                    return [2 /*return*/, setPermissions];
                case 9: return [2 /*return*/, serviceRole
                        .from("invite")
                        .update({ acceptedAt: new Date().toISOString() })
                        .eq("code", code)
                        .select("*")
                        .single()];
            }
        });
    });
}
function grantEmployeeAccess(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var existingEmployee, employeeTypePermissions, permissions, serviceRole, _c, activate, addUser, updateType, existingJob, jobInsert, _d, employeeInsert, jobInsert, addUser, setPermissions;
        var _e;
        var userId = _b.userId, companyId = _b.companyId, employeeTypeId = _b.employeeTypeId, locationId = _b.locationId;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, client
                        .from("employee")
                        .select("id, active")
                        .eq("id", userId)
                        .eq("companyId", companyId)
                        .maybeSingle()];
                case 1:
                    existingEmployee = _f.sent();
                    if ((_e = existingEmployee.data) === null || _e === void 0 ? void 0 : _e.active) {
                        return [2 /*return*/, {
                                success: false,
                                message: "This user is already an employee in this company"
                            }];
                    }
                    return [4 /*yield*/, (0, users_1.getPermissionsByEmployeeType)(client, employeeTypeId)];
                case 2:
                    employeeTypePermissions = _f.sent();
                    if (employeeTypePermissions.error) {
                        return [2 /*return*/, { success: false, message: employeeTypePermissions.error.message }];
                    }
                    permissions = makePermissionsFromEmployeeType(employeeTypePermissions);
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    if (!existingEmployee.data) return [3 /*break*/, 7];
                    return [4 /*yield*/, Promise.all([
                            activateEmployee(serviceRole, { userId: userId, companyId: companyId }),
                            addUserToCompany(serviceRole, { userId: userId, companyId: companyId, role: "employee" }),
                            serviceRole
                                .from("employee")
                                .update({ employeeTypeId: employeeTypeId, active: true })
                                .eq("id", userId)
                                .eq("companyId", companyId)
                        ])];
                case 3:
                    _c = _f.sent(), activate = _c[0], addUser = _c[1], updateType = _c[2];
                    if (activate.error) {
                        return [2 /*return*/, { success: false, message: activate.error.message }];
                    }
                    if (addUser.error) {
                        return [2 /*return*/, { success: false, message: addUser.error.message }];
                    }
                    if (updateType.error) {
                        return [2 /*return*/, { success: false, message: updateType.error.message }];
                    }
                    return [4 /*yield*/, serviceRole
                            .from("employeeJob")
                            .select("id")
                            .eq("id", userId)
                            .eq("companyId", companyId)
                            .maybeSingle()];
                case 4:
                    existingJob = _f.sent();
                    if (!!existingJob.data) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, people_service_1.insertEmployeeJob)(serviceRole, {
                            id: userId,
                            companyId: companyId,
                            locationId: locationId
                        })];
                case 5:
                    jobInsert = _f.sent();
                    if (jobInsert.error) {
                        return [2 /*return*/, { success: false, message: jobInsert.error.message }];
                    }
                    _f.label = 6;
                case 6: return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, Promise.all([
                        insertEmployee(serviceRole, {
                            id: userId,
                            employeeTypeId: employeeTypeId,
                            active: true,
                            companyId: companyId
                        }),
                        (0, people_service_1.insertEmployeeJob)(serviceRole, { id: userId, companyId: companyId, locationId: locationId }),
                        addUserToCompany(serviceRole, { userId: userId, companyId: companyId, role: "employee" })
                    ])];
                case 8:
                    _d = _f.sent(), employeeInsert = _d[0], jobInsert = _d[1], addUser = _d[2];
                    if (employeeInsert.error) {
                        return [2 /*return*/, { success: false, message: employeeInsert.error.message }];
                    }
                    if (jobInsert.error) {
                        return [2 /*return*/, { success: false, message: jobInsert.error.message }];
                    }
                    if (addUser.error) {
                        return [2 /*return*/, { success: false, message: addUser.error.message }];
                    }
                    _f.label = 9;
                case 9: return [4 /*yield*/, setUserPermissions(serviceRole, userId, permissions)];
                case 10:
                    setPermissions = _f.sent();
                    if (setPermissions.error) {
                        return [2 /*return*/, { success: false, message: setPermissions.error.message }];
                    }
                    return [2 /*return*/, { success: true }];
            }
        });
    });
}
function activateCustomer(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var result;
        var userId = _b.userId, companyId = _b.companyId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client
                        .from("customerAccount")
                        .update({ active: true })
                        .eq("id", userId)
                        .eq("companyId", companyId)
                        .select("id")];
                case 1:
                    result = _c.sent();
                    if (!result.error && (!result.data || result.data.length === 0)) {
                        return [2 /*return*/, {
                                data: null,
                                error: {
                                    message: "Customer account not found for user ".concat(userId, " in company ").concat(companyId, ". The account may have been deleted during deactivation.")
                                }
                            }];
                    }
                    return [2 /*return*/, result];
            }
        });
    });
}
function activateEmployee(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var result;
        var userId = _b.userId, companyId = _b.companyId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client
                        .from("employee")
                        .update({ active: true })
                        .eq("id", userId)
                        .eq("companyId", companyId)
                        .select("id")];
                case 1:
                    result = _c.sent();
                    if (!result.error && (!result.data || result.data.length === 0)) {
                        return [2 /*return*/, {
                                data: null,
                                error: {
                                    message: "Employee record not found for user ".concat(userId, " in company ").concat(companyId, ". The record may have been deleted during deactivation.")
                                }
                            }];
                    }
                    return [2 /*return*/, result];
            }
        });
    });
}
function activateSupplier(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var result;
        var userId = _b.userId, companyId = _b.companyId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client
                        .from("supplierAccount")
                        .update({ active: true })
                        .eq("id", userId)
                        .eq("companyId", companyId)
                        .select("id")];
                case 1:
                    result = _c.sent();
                    if (!result.error && (!result.data || result.data.length === 0)) {
                        return [2 /*return*/, {
                                data: null,
                                error: {
                                    message: "Supplier account not found for user ".concat(userId, " in company ").concat(companyId, ". The account may have been deleted during deactivation.")
                                }
                            }];
                    }
                    return [2 /*return*/, result];
            }
        });
    });
}
function addUserToCompany(client, userToCompany) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("userToCompany").insert(userToCompany)];
        });
    });
}
function createCustomerAccount(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var customerContact, _c, email, firstName, lastName, permissions, serviceRole, user, userId, isNewUser, createSupabaseUser, createCarbonUser, code, _d, contactUpdate, customerAccountInsert, inviteInsert;
        var id = _b.id, customerId = _b.customerId, companyId = _b.companyId, createdBy = _b.createdBy;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, sales_1.getCustomerContact)(client, id)];
                case 1:
                    customerContact = _e.sent();
                    if (customerContact.error ||
                        customerContact.data === null ||
                        customerContact.data.contact === null ||
                        !customerContact.data.contact.email) {
                        return [2 /*return*/, { success: false, message: "Failed to get customer contact" }];
                    }
                    _c = customerContact.data.contact, email = _c.email, firstName = _c.firstName, lastName = _c.lastName;
                    permissions = makeCustomerPermissions(companyId);
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, getUserByEmail(email)];
                case 2:
                    user = _e.sent();
                    userId = "";
                    isNewUser = false;
                    if (!user.data) return [3 /*break*/, 3];
                    userId = user.data.id;
                    return [3 /*break*/, 7];
                case 3:
                    isNewUser = true;
                    return [4 /*yield*/, serviceRole.auth.admin.createUser({
                            email: email.toLowerCase(),
                            password: crypto.randomUUID(),
                            email_confirm: true
                        })];
                case 4:
                    createSupabaseUser = _e.sent();
                    if (createSupabaseUser.error) {
                        return [2 /*return*/, { success: false, message: createSupabaseUser.error.message }];
                    }
                    userId = createSupabaseUser.data.user.id;
                    return [4 /*yield*/, createUser(serviceRole, {
                            id: userId,
                            email: email.toLowerCase(),
                            firstName: firstName !== null && firstName !== void 0 ? firstName : "",
                            lastName: lastName !== null && lastName !== void 0 ? lastName : "",
                            avatarUrl: null
                        })];
                case 5:
                    createCarbonUser = _e.sent();
                    if (!createCarbonUser.error) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, auth_server_1.deleteAuthAccount)(serviceRole, userId)];
                case 6:
                    _e.sent();
                    return [2 /*return*/, { success: false, message: createCarbonUser.error.message }];
                case 7:
                    code = crypto.randomUUID();
                    return [4 /*yield*/, Promise.all([
                            client.from("customerContact").update({ userId: userId }).eq("id", id),
                            insertCustomerAccount(client, {
                                id: userId,
                                customerId: customerId,
                                companyId: companyId
                            }),
                            insertInvite(serviceRole, {
                                role: "customer",
                                permissions: permissions,
                                email: email,
                                companyId: companyId,
                                createdBy: createdBy,
                                code: code
                            })
                        ])];
                case 8:
                    _d = _e.sent(), contactUpdate = _d[0], customerAccountInsert = _d[1], inviteInsert = _d[2];
                    if (!contactUpdate.error) return [3 /*break*/, 13];
                    if (!isNewUser) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, auth_server_1.deleteAuthAccount)(serviceRole, userId)];
                case 9:
                    _e.sent();
                    return [3 /*break*/, 12];
                case 10: return [4 /*yield*/, (0, users_server_1.deactivateCustomer)(serviceRole, userId, companyId)];
                case 11:
                    _e.sent();
                    _e.label = 12;
                case 12: return [2 /*return*/, { success: false, message: contactUpdate.error.message }];
                case 13:
                    if (!customerAccountInsert.error) return [3 /*break*/, 18];
                    if (!isNewUser) return [3 /*break*/, 15];
                    return [4 /*yield*/, (0, auth_server_1.deleteAuthAccount)(serviceRole, userId)];
                case 14:
                    _e.sent();
                    return [3 /*break*/, 17];
                case 15: return [4 /*yield*/, (0, users_server_1.deactivateCustomer)(serviceRole, userId, companyId)];
                case 16:
                    _e.sent();
                    _e.label = 17;
                case 17: return [2 /*return*/, { success: false, message: customerAccountInsert.error.message }];
                case 18:
                    if (!inviteInsert.error) return [3 /*break*/, 23];
                    if (!isNewUser) return [3 /*break*/, 20];
                    return [4 /*yield*/, (0, auth_server_1.deleteAuthAccount)(serviceRole, userId)];
                case 19:
                    _e.sent();
                    return [3 /*break*/, 22];
                case 20: return [4 /*yield*/, (0, users_server_1.deactivateCustomer)(serviceRole, userId, companyId)];
                case 21:
                    _e.sent();
                    _e.label = 22;
                case 22: return [2 /*return*/, { success: false, message: inviteInsert.error.message }];
                case 23: return [2 /*return*/, { success: true, code: code, userId: userId, email: email }];
            }
        });
    });
}
function createEmployeeAccount(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var employeeTypePermissions, permissions, serviceRole, user, userId, isNewUser, existingEmployee, createSupabaseUser, userNumber, nextSequence, createCarbonUser, code, _c, employeeInsert, jobInsert, inviteInsert;
        var email = _b.email, firstName = _b.firstName, lastName = _b.lastName, employeeType = _b.employeeType, locationId = _b.locationId, companyId = _b.companyId, createdBy = _b.createdBy, number = _b.number;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, users_1.getPermissionsByEmployeeType)(client, employeeType)];
                case 1:
                    employeeTypePermissions = _d.sent();
                    if (employeeTypePermissions.error) {
                        return [2 /*return*/, { success: false, message: employeeTypePermissions.error.message }];
                    }
                    permissions = makePermissionsFromEmployeeType(employeeTypePermissions);
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, getUserByEmail(email)];
                case 2:
                    user = _d.sent();
                    userId = "";
                    isNewUser = false;
                    if (!user.data) return [3 /*break*/, 4];
                    userId = user.data.id;
                    return [4 /*yield*/, client
                            .from("employee")
                            .select("id")
                            .eq("id", userId)
                            .eq("companyId", companyId)
                            .maybeSingle()];
                case 3:
                    existingEmployee = _d.sent();
                    if (existingEmployee.data) {
                        return [2 /*return*/, {
                                success: false,
                                message: "This user is already an employee in this company"
                            }];
                    }
                    return [3 /*break*/, 10];
                case 4:
                    isNewUser = true;
                    return [4 /*yield*/, serviceRole.auth.admin.createUser({
                            email: email.toLowerCase(),
                            password: crypto.randomUUID(),
                            email_confirm: true
                        })];
                case 5:
                    createSupabaseUser = _d.sent();
                    if (createSupabaseUser.error) {
                        return [2 /*return*/, { success: false, message: createSupabaseUser.error.message }];
                    }
                    userId = createSupabaseUser.data.user.id;
                    userNumber = number;
                    if (!!userNumber) return [3 /*break*/, 7];
                    return [4 /*yield*/, client.rpc("get_next_sequence", {
                            sequence_name: "user",
                            company_id: companyId
                        })];
                case 6:
                    nextSequence = _d.sent();
                    if (nextSequence.data) {
                        userNumber = nextSequence.data;
                    }
                    _d.label = 7;
                case 7: return [4 /*yield*/, createUser(serviceRole, {
                        id: userId,
                        email: email.toLowerCase(),
                        firstName: firstName,
                        lastName: lastName,
                        avatarUrl: null,
                        number: userNumber
                    })];
                case 8:
                    createCarbonUser = _d.sent();
                    if (!createCarbonUser.error) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, auth_server_1.deleteAuthAccount)(serviceRole, userId)];
                case 9:
                    _d.sent();
                    return [2 /*return*/, { success: false, message: createCarbonUser.error.message }];
                case 10:
                    code = crypto.randomUUID();
                    return [4 /*yield*/, Promise.all([
                            insertEmployee(client, {
                                id: userId,
                                employeeTypeId: employeeType,
                                active: false,
                                companyId: companyId
                            }),
                            (0, people_service_1.insertEmployeeJob)(client, {
                                id: userId,
                                companyId: companyId,
                                locationId: locationId
                            }),
                            insertInvite(serviceRole, {
                                role: "employee",
                                permissions: permissions,
                                email: email,
                                companyId: companyId,
                                createdBy: createdBy,
                                code: code
                            })
                        ])];
                case 11:
                    _c = _d.sent(), employeeInsert = _c[0], jobInsert = _c[1], inviteInsert = _c[2];
                    if (!employeeInsert.error) return [3 /*break*/, 14];
                    if (!isNewUser) return [3 /*break*/, 13];
                    return [4 /*yield*/, (0, auth_server_1.deleteAuthAccount)(serviceRole, userId)];
                case 12:
                    _d.sent();
                    _d.label = 13;
                case 13: return [2 /*return*/, { success: false, message: employeeInsert.error.message }];
                case 14:
                    if (!jobInsert.error) return [3 /*break*/, 19];
                    if (!isNewUser) return [3 /*break*/, 16];
                    return [4 /*yield*/, (0, auth_server_1.deleteAuthAccount)(serviceRole, userId)];
                case 15:
                    _d.sent();
                    return [3 /*break*/, 18];
                case 16: return [4 /*yield*/, (0, users_server_1.deactivateEmployee)(serviceRole, userId, companyId)];
                case 17:
                    _d.sent();
                    _d.label = 18;
                case 18: return [2 /*return*/, { success: false, message: jobInsert.error.message }];
                case 19:
                    if (!inviteInsert.error) return [3 /*break*/, 24];
                    if (!isNewUser) return [3 /*break*/, 21];
                    return [4 /*yield*/, (0, auth_server_1.deleteAuthAccount)(serviceRole, userId)];
                case 20:
                    _d.sent();
                    return [3 /*break*/, 23];
                case 21: return [4 /*yield*/, (0, users_server_1.deactivateEmployee)(serviceRole, userId, companyId)];
                case 22:
                    _d.sent();
                    _d.label = 23;
                case 23: return [2 /*return*/, { success: false, message: inviteInsert.error.message }];
                case 24: return [2 /*return*/, { success: true, code: code, userId: userId }];
            }
        });
    });
}
function createSupplierAccount(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var supplierContact, _c, email, firstName, lastName, permissions, serviceRole, user, userId, isNewUser, createSupabaseUser, createCarbonUser, code, _d, contactUpdate, supplierAccountInsert, inviteInsert;
        var id = _b.id, supplierId = _b.supplierId, companyId = _b.companyId, createdBy = _b.createdBy;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, purchasing_1.getSupplierContact)(client, id)];
                case 1:
                    supplierContact = _e.sent();
                    if (supplierContact.error ||
                        supplierContact.data === null ||
                        supplierContact.data.contact === null ||
                        !supplierContact.data.contact.email) {
                        return [2 /*return*/, { success: false, message: "Failed to get supplier contact" }];
                    }
                    _c = supplierContact.data.contact, email = _c.email, firstName = _c.firstName, lastName = _c.lastName;
                    permissions = makeSupplierPermissions(companyId);
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, getUserByEmail(email)];
                case 2:
                    user = _e.sent();
                    userId = "";
                    isNewUser = false;
                    if (!user.data) return [3 /*break*/, 3];
                    userId = user.data.id;
                    return [3 /*break*/, 7];
                case 3:
                    isNewUser = true;
                    return [4 /*yield*/, serviceRole.auth.admin.createUser({
                            email: email.toLowerCase(),
                            password: crypto.randomUUID(),
                            email_confirm: true
                        })];
                case 4:
                    createSupabaseUser = _e.sent();
                    if (createSupabaseUser.error) {
                        return [2 /*return*/, { success: false, message: createSupabaseUser.error.message }];
                    }
                    userId = createSupabaseUser.data.user.id;
                    return [4 /*yield*/, createUser(serviceRole, {
                            id: userId,
                            email: email.toLowerCase(),
                            firstName: firstName !== null && firstName !== void 0 ? firstName : "",
                            lastName: lastName !== null && lastName !== void 0 ? lastName : "",
                            avatarUrl: null
                        })];
                case 5:
                    createCarbonUser = _e.sent();
                    if (!createCarbonUser.error) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, auth_server_1.deleteAuthAccount)(serviceRole, userId)];
                case 6:
                    _e.sent();
                    return [2 /*return*/, { success: false, message: createCarbonUser.error.message }];
                case 7:
                    code = crypto.randomUUID();
                    return [4 /*yield*/, Promise.all([
                            client.from("supplierContact").update({ userId: userId }).eq("id", id),
                            insertSupplierAccount(client, {
                                id: userId,
                                supplierId: supplierId,
                                companyId: companyId
                            }),
                            insertInvite(serviceRole, {
                                role: "supplier",
                                permissions: permissions,
                                email: email,
                                companyId: companyId,
                                createdBy: createdBy,
                                code: code
                            })
                        ])];
                case 8:
                    _d = _e.sent(), contactUpdate = _d[0], supplierAccountInsert = _d[1], inviteInsert = _d[2];
                    if (!contactUpdate.error) return [3 /*break*/, 13];
                    if (!isNewUser) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, auth_server_1.deleteAuthAccount)(serviceRole, userId)];
                case 9:
                    _e.sent();
                    return [3 /*break*/, 12];
                case 10: return [4 /*yield*/, (0, users_server_1.deactivateSupplier)(serviceRole, userId, companyId)];
                case 11:
                    _e.sent();
                    _e.label = 12;
                case 12: return [2 /*return*/, { success: false, message: contactUpdate.error.message }];
                case 13:
                    if (!supplierAccountInsert.error) return [3 /*break*/, 18];
                    if (!isNewUser) return [3 /*break*/, 15];
                    return [4 /*yield*/, (0, auth_server_1.deleteAuthAccount)(serviceRole, userId)];
                case 14:
                    _e.sent();
                    return [3 /*break*/, 17];
                case 15: return [4 /*yield*/, (0, users_server_1.deactivateSupplier)(serviceRole, userId, companyId)];
                case 16:
                    _e.sent();
                    _e.label = 17;
                case 17: return [2 /*return*/, { success: false, message: supplierAccountInsert.error.message }];
                case 18:
                    if (!inviteInsert.error) return [3 /*break*/, 23];
                    if (!isNewUser) return [3 /*break*/, 20];
                    return [4 /*yield*/, (0, auth_server_1.deleteAuthAccount)(serviceRole, userId)];
                case 19:
                    _e.sent();
                    return [3 /*break*/, 22];
                case 20: return [4 /*yield*/, (0, users_server_1.deactivateSupplier)(serviceRole, userId, companyId)];
                case 21:
                    _e.sent();
                    _e.label = 22;
                case 22: return [2 /*return*/, { success: false, message: inviteInsert.error.message }];
                case 23: return [2 /*return*/, { success: true, code: code, userId: userId, email: email }];
            }
        });
    });
}
function createUser(client, user) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, insertUser(client, user)];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (!error) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, auth_server_1.deleteAuthAccount)(client, user.id)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3: return [2 /*return*/, { data: data, error: error }];
            }
        });
    });
}
function getClaims(client, uid, company) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.rpc("get_claims", { uid: uid, company: company !== null && company !== void 0 ? company : "" })];
        });
    });
}
function getCurrentUser(request, client) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, user, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, session_server_1.requireAuthSession)(request)];
                case 1:
                    userId = (_c.sent()).userId;
                    return [4 /*yield*/, getUser(client, userId)];
                case 2:
                    user = _c.sent();
                    if (!((user === null || user === void 0 ? void 0 : user.error) || (user === null || user === void 0 ? void 0 : user.data) === null)) return [3 /*break*/, 4];
                    _a = react_router_1.redirect;
                    _b = [path_1.path.to.authenticatedRoot];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(user.error, "Failed to get user"))];
                case 3: throw _a.apply(void 0, _b.concat([_c.sent()]));
                case 4: return [2 /*return*/, user.data];
            }
        });
    });
}
function getPermissionCacheKey(userId) {
    return "permissions:".concat(userId);
}
function getUser(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("user")
                    .select("*")
                    .eq("id", id)
                    .eq("active", true)
                    .single()];
        });
    });
}
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
// Whether the user's employee type is "MES only" for this company. Such users
// are shop-floor workers (or console operators): they may use the MES but are
// blocked from the ERP, and they do not count as a billable seat.
// Uses the service role because the employeeType RLS policy requires the
// users_update permission, which MES-only workers do not have.
function isMesOnlyEmployee(userId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()
                        .from("employee")
                        .select("...employeeType!inner(mesOnly)")
                        .eq("id", userId)
                        .eq("companyId", companyId)
                        .maybeSingle()];
                case 1:
                    result = _c.sent();
                    return [2 /*return*/, (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.mesOnly) !== null && _b !== void 0 ? _b : false];
            }
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
                    return [4 /*yield*/, kv_1.redis.get(getPermissionCacheKey(userId))];
                case 2:
                    cachedClaims = _a.sent();
                    if (cachedClaims) {
                        parsed = JSON.parse(cachedClaims);
                        if ((0, auth_1.isValidCachedClaims)(parsed)) {
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
                    return [4 /*yield*/, getClaims((0, client_server_1.getCarbonServiceRole)(), userId, companyId)];
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
                            : makePermissionsFromClaims(rawClaims.data);
                    if (!claims) {
                        claims = { permissions: {}, role: null };
                    }
                    // store claims in redis
                    return [4 /*yield*/, kv_1.redis.set(getPermissionCacheKey(userId), JSON.stringify(claims))];
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
function getUserGroups(client, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.rpc("groups_for_user", { uid: userId })];
        });
    });
}
function getUserDefaults(client, userId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("userDefaults")
                    .select("*")
                    .eq("userId", userId)
                    .eq("companyId", companyId)
                    .maybeSingle()];
        });
    });
}
function getModulePreferences(client, userId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("userModulePreference")
                    .select("module, position, hidden")
                    .eq("userId", userId)
                    .eq("companyId", companyId)
                    .order("position")];
        });
    });
}
function upsertModulePreferences(client, userId, companyId, preferences) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("userModulePreference").upsert(preferences.map(function (p) { return ({
                    userId: userId,
                    companyId: companyId,
                    module: p.module,
                    position: p.position,
                    hidden: p.hidden,
                    updatedAt: new Date().toISOString()
                }); }), { onConflict: "userId,companyId,module" })];
        });
    });
}
function insertCustomerAccount(client, customerAccount) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("customerAccount")
                    .insert(customerAccount)
                    .select("id")
                    .single()];
        });
    });
}
function insertEmployee(client, employee) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("employee").insert([employee]).select("*").single()];
        });
    });
}
function insertInvite(client, invite) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("invite")
                    .upsert([__assign(__assign({}, invite), { acceptedAt: null })], {
                    onConflict: "email, companyId",
                    ignoreDuplicates: false
                })
                    .select("*")
                    .single()];
        });
    });
}
function insertSupplierAccount(client, supplierAccount) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("supplierAccount")
                    .insert(supplierAccount)
                    .select("id")
                    .single()];
        });
    });
}
function insertUser(client, user) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("user").upsert([user]).select("*")];
        });
    });
}
/**
 * Creates a console-only operator: a lightweight user record that can pin in
 * at MES terminals without needing email, password, or Supabase Auth.
 *
 * Uses a synthetic email ({uuid}@console.internal) to satisfy the NOT NULL
 * constraint. No auth.users entry is created — operators cannot log in.
 */
function createConsoleOperator(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var serviceRole, userId, syntheticEmail, userInsert, employeeInsert, jobInsert, companyLink;
        var firstName = _b.firstName, lastName = _b.lastName, employeeType = _b.employeeType, locationId = _b.locationId, companyId = _b.companyId, createdBy = _b.createdBy;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    userId = crypto.randomUUID();
                    syntheticEmail = "".concat(userId, "@console.internal");
                    return [4 /*yield*/, serviceRole
                            .from("user")
                            .insert({
                            id: userId,
                            email: syntheticEmail,
                            firstName: firstName,
                            lastName: lastName,
                            avatarUrl: null,
                            active: true,
                            isConsoleOperator: true
                        })
                            .select("*")
                            .single()];
                case 1:
                    userInsert = _c.sent();
                    if (userInsert.error) {
                        return [2 /*return*/, { success: false, message: userInsert.error.message }];
                    }
                    return [4 /*yield*/, insertEmployee(client, {
                            id: userId,
                            employeeTypeId: employeeType,
                            active: true,
                            companyId: companyId
                        })];
                case 2:
                    employeeInsert = _c.sent();
                    if (!employeeInsert.error) return [3 /*break*/, 4];
                    // Cleanup: remove user
                    return [4 /*yield*/, serviceRole.from("user").delete().eq("id", userId)];
                case 3:
                    // Cleanup: remove user
                    _c.sent();
                    return [2 /*return*/, { success: false, message: employeeInsert.error.message }];
                case 4: return [4 /*yield*/, (0, people_service_1.insertEmployeeJob)(client, {
                        id: userId,
                        companyId: companyId,
                        locationId: locationId
                    })];
                case 5:
                    jobInsert = _c.sent();
                    if (!jobInsert.error) return [3 /*break*/, 8];
                    // Cleanup
                    return [4 /*yield*/, serviceRole.from("employee").delete().eq("id", userId)];
                case 6:
                    // Cleanup
                    _c.sent();
                    return [4 /*yield*/, serviceRole.from("user").delete().eq("id", userId)];
                case 7:
                    _c.sent();
                    return [2 /*return*/, { success: false, message: jobInsert.error.message }];
                case 8: return [4 /*yield*/, serviceRole
                        .from("userToCompany")
                        .insert({ userId: userId, companyId: companyId, role: "employee" })
                        .select("*")
                        .single()];
                case 9:
                    companyLink = _c.sent();
                    if (companyLink.error) {
                        // Non-critical — operator still works without this
                        console.error("Failed to link console operator to company:", companyLink.error);
                    }
                    return [2 /*return*/, {
                            success: true,
                            userId: userId,
                            name: "".concat(firstName, " ").concat(lastName)
                        }];
            }
        });
    });
}
/**
 * Converts a console-only operator to a full user by adding a Supabase Auth
 * account and updating their email to a real one.
 */
function convertConsoleOperatorToUser(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var serviceRole, existingUser, emailCheck, createAuth, updateUser, code, employee, employeeTypePermissions, permissions, inviteResult;
        var _c, _d;
        var userId = _b.userId, email = _b.email, employeeType = _b.employeeType, companyId = _b.companyId, createdBy = _b.createdBy;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("user")
                            .select("*")
                            .eq("id", userId)
                            .single()];
                case 1:
                    existingUser = _e.sent();
                    if (existingUser.error || !((_c = existingUser.data) === null || _c === void 0 ? void 0 : _c.isConsoleOperator)) {
                        return [2 /*return*/, { success: false, message: "User is not a console operator" }];
                    }
                    return [4 /*yield*/, serviceRole
                            .from("user")
                            .select("id")
                            .eq("email", email.toLowerCase())
                            .maybeSingle()];
                case 2:
                    emailCheck = _e.sent();
                    if (emailCheck.data) {
                        return [2 /*return*/, { success: false, message: "Email is already in use" }];
                    }
                    return [4 /*yield*/, serviceRole.auth.admin.createUser({
                            id: userId,
                            email: email.toLowerCase(),
                            password: crypto.randomUUID(),
                            email_confirm: true
                        })];
                case 3:
                    createAuth = _e.sent();
                    if (createAuth.error) {
                        return [2 /*return*/, { success: false, message: createAuth.error.message }];
                    }
                    return [4 /*yield*/, serviceRole
                            .from("user")
                            .update({
                            email: email.toLowerCase(),
                            isConsoleOperator: false
                        })
                            .eq("id", userId)];
                case 4:
                    updateUser = _e.sent();
                    if (!updateUser.error) return [3 /*break*/, 6];
                    // Cleanup auth
                    return [4 /*yield*/, (0, auth_server_1.deleteAuthAccount)(serviceRole, userId)];
                case 5:
                    // Cleanup auth
                    _e.sent();
                    return [2 /*return*/, { success: false, message: updateUser.error.message }];
                case 6: 
                // Change employee type to the selected type
                return [4 /*yield*/, serviceRole
                        .from("employee")
                        .update({ employeeTypeId: employeeType })
                        .eq("id", userId)
                        .eq("companyId", companyId)];
                case 7:
                    // Change employee type to the selected type
                    _e.sent();
                    code = crypto.randomUUID();
                    return [4 /*yield*/, client
                            .from("employee")
                            .select("employeeTypeId")
                            .eq("id", userId)
                            .eq("companyId", companyId)
                            .single()];
                case 8:
                    employee = _e.sent();
                    if (!((_d = employee.data) === null || _d === void 0 ? void 0 : _d.employeeTypeId)) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, users_1.getPermissionsByEmployeeType)(client, employee.data.employeeTypeId)];
                case 9:
                    employeeTypePermissions = _e.sent();
                    if (!!employeeTypePermissions.error) return [3 /*break*/, 11];
                    permissions = makePermissionsFromEmployeeType(employeeTypePermissions);
                    return [4 /*yield*/, insertInvite(serviceRole, {
                            role: "employee",
                            permissions: permissions,
                            email: email.toLowerCase(),
                            companyId: companyId,
                            createdBy: createdBy,
                            code: code
                        })];
                case 10:
                    inviteResult = _e.sent();
                    if (inviteResult.error) {
                        console.error("Failed to create invite for converted operator:", inviteResult.error);
                    }
                    _e.label = 11;
                case 11: return [2 /*return*/, { success: true }];
            }
        });
    });
}
function makePermissionsFromEmployeeType(_a) {
    var data = _a.data;
    var permissions = {};
    data.forEach(function (permission) {
        if (!permission.module) {
            throw new Error("Permission module is missing for permission ".concat(JSON.stringify(data)));
        }
        var module = permission.module.toLowerCase();
        permissions["".concat(module, "_view")] = permission.view;
        permissions["".concat(module, "_create")] = permission.create;
        permissions["".concat(module, "_update")] = permission.update;
        permissions["".concat(module, "_delete")] = permission.delete;
    });
    return permissions;
}
function isClaimPermission(key, value) {
    var action = key.split("_")[1];
    return (action !== undefined &&
        ["view", "create", "update", "delete"].includes(action) &&
        Array.isArray(value));
}
function makeCustomerPermissions(companyId) {
    // TODO: this should be more dynamic
    var permissions = {
        documents_view: [companyId],
        documents_create: [companyId],
        documents_udpate: [companyId],
        documents_delete: [companyId],
        jobs_view: [companyId],
        sales_view: [companyId],
        parts_view: [companyId]
    };
    return permissions;
}
function makeEmptyPermissionsFromModules(data) {
    return data.reduce(function (acc, m) {
        if (m.name && m.name !== "Messaging") {
            acc[m.name] = {
                name: m.name.toLowerCase(),
                permission: {
                    view: false,
                    create: false,
                    update: false,
                    delete: false
                }
            };
        }
        return acc;
    }, {});
}
function makeCompanyPermissionsFromClaims(claims, companyId) {
    if (typeof claims !== "object" || claims === null)
        return null;
    var permissions = {};
    var role = null;
    Object.entries(claims).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        if (isClaimPermission(key, value)) {
            var _b = key.split("_"), module = _b[0], action = _b[1];
            if (!(module in permissions)) {
                permissions[module] = {
                    view: false,
                    create: false,
                    update: false,
                    delete: false
                };
            }
            if (!Array.isArray(value)) {
                permissions[module] = {
                    view: false,
                    create: false,
                    update: false,
                    delete: false
                };
            }
            else {
                switch (action) {
                    case "view":
                        // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
                        permissions[module]["view"] =
                            value.includes("0") || value.includes(companyId);
                        break;
                    case "create":
                        // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
                        permissions[module]["create"] =
                            value.includes("0") || value.includes(companyId);
                        break;
                    case "update":
                        // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
                        permissions[module]["update"] =
                            value.includes("0") || value.includes(companyId);
                        break;
                    case "delete":
                        // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
                        permissions[module]["delete"] =
                            value.includes("0") || value.includes(companyId);
                        break;
                }
            }
        }
    });
    if ("role" in claims) {
        // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
        role = claims["role"];
    }
    if ("items" in permissions) {
        // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
        delete permissions["items"];
    }
    if ("messaging" in permissions) {
        // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
        delete permissions["messaging"];
    }
    return { permissions: permissions, role: role };
}
function makePermissionsFromClaims(claims) {
    if (typeof claims !== "object" || claims === null)
        return null;
    var permissions = {};
    var role = null;
    Object.entries(claims).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        if (isClaimPermission(key, value)) {
            var _b = key.split("_"), module = _b[0], action = _b[1];
            if (!(module in permissions)) {
                permissions[module] = {
                    view: [],
                    create: [],
                    update: [],
                    delete: []
                };
            }
            switch (action) {
                case "view":
                    // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
                    permissions[module]["view"] = value;
                    break;
                case "create":
                    // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
                    permissions[module]["create"] = value;
                    break;
                case "update":
                    // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
                    permissions[module]["update"] = value;
                    break;
                case "delete":
                    // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
                    permissions[module]["delete"] = value;
                    break;
            }
        }
    });
    if ("role" in claims) {
        // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
        role = claims["role"];
    }
    if ("items" in permissions) {
        // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
        delete permissions["items"];
    }
    if ("messaging" in permissions) {
        // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
        delete permissions["messaging"];
    }
    return { permissions: permissions, role: role };
}
function makeCompanyPermissionsFromEmployeeType(data, companyId) {
    var result = {};
    if (!data)
        return result;
    data.forEach(function (permission) {
        if (!permission.module) {
            throw new Error("Module is missing for permission ".concat(JSON.stringify(permission)));
        }
        else {
            result[permission.module] = {
                name: permission.module.toLowerCase(),
                permission: {
                    view: permission.view.includes("0") ||
                        permission.view.includes(companyId),
                    create: permission.create.includes("0") ||
                        permission.create.includes(companyId),
                    update: permission.update.includes("0") ||
                        permission.update.includes(companyId),
                    delete: permission.delete.includes("0") ||
                        permission.delete.includes(companyId)
                }
            };
        }
    });
    if ("items" in result) {
        // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
        delete result["items"];
    }
    if ("Messaging" in result) {
        // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
        delete result["Messaging"];
    }
    return result;
}
function makeSupplierPermissions(companyId) {
    // TODO: this should be more dynamic
    var permissions = {
        documents_view: [companyId],
        documents_create: [companyId],
        documents_udpate: [companyId],
        documents_delete: [companyId],
        purchasing_view: [companyId],
        parts_view: [companyId]
    };
    return permissions;
}
function getInvite(client, email, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("invite")
                    .select("*")
                    .eq("email", email)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function resetPassword(userId, password) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, client_server_1.getCarbonServiceRole)().auth.admin.updateUserById(userId, {
                    password: password
                })];
        });
    });
}
function rollbackInvite(serviceRole_1, _a) {
    return __awaiter(this, arguments, void 0, function (serviceRole, _b) {
        var userId = _b.userId, companyId = _b.companyId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        serviceRole
                            .from("employee")
                            .update({ active: false })
                            .eq("id", userId)
                            .eq("companyId", companyId),
                        serviceRole
                            .from("userToCompany")
                            .delete()
                            .eq("userId", userId)
                            .eq("companyId", companyId),
                        serviceRole
                            .from("customerAccount")
                            .delete()
                            .eq("userId", userId)
                            .eq("companyId", companyId),
                        serviceRole
                            .from("supplierAccount")
                            .delete()
                            .eq("userId", userId)
                            .eq("companyId", companyId)
                    ])];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function setUserPermissions(client, userId, permissions) {
    return __awaiter(this, void 0, void 0, function () {
        var user, currentPermissions, newPermissions, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client
                        .from("userPermission")
                        .select("permissions")
                        .eq("id", userId)
                        .maybeSingle()];
                case 1:
                    user = _c.sent();
                    currentPermissions = ((_b = (_a = user.data) === null || _a === void 0 ? void 0 : _a.permissions) !== null && _b !== void 0 ? _b : {});
                    newPermissions = __assign({}, currentPermissions);
                    Object.entries(permissions).forEach(function (_a) {
                        var key = _a[0], value = _a[1];
                        if (key in newPermissions) {
                            newPermissions[key] = __spreadArray(__spreadArray([], newPermissions[key], true), value, true);
                        }
                        else {
                            newPermissions[key] = value;
                        }
                    });
                    return [4 /*yield*/, client
                            .from("userPermission")
                            .upsert({ id: userId, permissions: newPermissions })];
                case 2:
                    result = _c.sent();
                    return [4 /*yield*/, kv_1.redis.del(getPermissionCacheKey(userId))];
                case 3:
                    _c.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
function updateEmployee(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var updateEmployeeEmployeeType;
        var id = _b.id, employeeType = _b.employeeType, permissions = _b.permissions, companyId = _b.companyId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client
                        .from("employee")
                        .upsert([{ id: id, companyId: companyId, employeeTypeId: employeeType }])];
                case 1:
                    updateEmployeeEmployeeType = _c.sent();
                    if (updateEmployeeEmployeeType.error)
                        return [2 /*return*/, (0, auth_1.error)(updateEmployeeEmployeeType.error, "Failed to update employee")];
                    return [2 /*return*/, updatePermissions(client, { id: id, permissions: permissions, companyId: companyId })];
            }
        });
    });
}
function updatePermissions(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var claims, updatedPermissions_1, permissionsUpdate;
        var id = _b.id, permissions = _b.permissions, companyId = _b.companyId, _c = _b.addOnly, addOnly = _c === void 0 ? false : _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, client.rpc("is_claims_admin")];
                case 1:
                    if (!_d.sent()) return [3 /*break*/, 5];
                    return [4 /*yield*/, getClaims(client, id)];
                case 2:
                    claims = _d.sent();
                    if (claims.error)
                        return [2 /*return*/, (0, auth_1.error)(claims.error, "Failed to get claims")];
                    updatedPermissions_1 = (typeof claims.data !== "object" ||
                        Array.isArray(claims.data) ||
                        claims.data === null
                        ? {}
                        : claims.data);
                    // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
                    delete updatedPermissions_1["role"];
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
                            var _b, _c, _d, _e;
                            var name = _a[0], permission = _a[1];
                            var module = name.toLowerCase();
                            if (permission.view) {
                                if (!((_b = updatedPermissions_1["".concat(module, "_view")]) === null || _b === void 0 ? void 0 : _b.includes(companyId))) {
                                    updatedPermissions_1["".concat(module, "_view")] = __spreadArray(__spreadArray([], updatedPermissions_1["".concat(module, "_view")], true), [
                                        companyId
                                    ], false);
                                }
                            }
                            else {
                                updatedPermissions_1["".concat(module, "_view")] = updatedPermissions_1["".concat(module, "_view")].filter(function (c) { return c !== companyId; });
                            }
                            if (permission.create) {
                                if (!((_c = updatedPermissions_1["".concat(module, "_create")]) === null || _c === void 0 ? void 0 : _c.includes(companyId))) {
                                    updatedPermissions_1["".concat(module, "_create")] = __spreadArray(__spreadArray([], updatedPermissions_1["".concat(module, "_create")], true), [
                                        companyId
                                    ], false);
                                }
                            }
                            else {
                                updatedPermissions_1["".concat(module, "_create")] = updatedPermissions_1["".concat(module, "_create")].filter(function (c) { return c !== companyId; });
                            }
                            if (permission.update) {
                                if (!((_d = updatedPermissions_1["".concat(module, "_update")]) === null || _d === void 0 ? void 0 : _d.includes(companyId))) {
                                    updatedPermissions_1["".concat(module, "_update")] = __spreadArray(__spreadArray([], updatedPermissions_1["".concat(module, "_update")], true), [
                                        companyId
                                    ], false);
                                }
                            }
                            else {
                                updatedPermissions_1["".concat(module, "_update")] = updatedPermissions_1["".concat(module, "_update")].filter(function (c) { return c !== companyId; });
                            }
                            if (permission.delete) {
                                if (!((_e = updatedPermissions_1["".concat(module, "_delete")]) === null || _e === void 0 ? void 0 : _e.includes(companyId))) {
                                    updatedPermissions_1["".concat(module, "_delete")] = __spreadArray(__spreadArray([], updatedPermissions_1["".concat(module, "_delete")], true), [
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
                    return [4 /*yield*/, kv_1.redis.del(getPermissionCacheKey(id))];
                case 4:
                    _d.sent();
                    return [2 /*return*/, (0, auth_1.success)("Permissions updated")];
                case 5: return [2 /*return*/, (0, auth_1.error)(null, "You do not have permission to update permissions")];
            }
        });
    });
}
