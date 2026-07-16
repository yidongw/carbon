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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.MES_PERMISSIONS = void 0;
exports.deleteEmployeeType = deleteEmployeeType;
exports.deleteGroup = deleteGroup;
exports.getCompaniesForUser = getCompaniesForUser;
exports.getCustomers = getCustomers;
exports.getEmployee = getEmployee;
exports.getUnrevokedInviteEmails = getUnrevokedInviteEmails;
exports.getEmployees = getEmployees;
exports.getConsoleOperators = getConsoleOperators;
exports.getEmployeeType = getEmployeeType;
exports.getEmployeeTypes = getEmployeeTypes;
exports.getInvitable = getInvitable;
exports.getModules = getModules;
exports.getGroup = getGroup;
exports.getGroupMembers = getGroupMembers;
exports.getGroups = getGroups;
exports.getGroupEmails = getGroupEmails;
exports.getPermissionsByEmployeeType = getPermissionsByEmployeeType;
exports.getSuppliers = getSuppliers;
exports.getUsers = getUsers;
exports.getUserEmails = getUserEmails;
exports.insertEmployeeType = insertEmployeeType;
exports.insertGroup = insertGroup;
exports.upsertEmployeeType = upsertEmployeeType;
exports.upsertEmployeeTypePermissions = upsertEmployeeTypePermissions;
exports.upsertGroup = upsertGroup;
exports.upsertGroupMembers = upsertGroupMembers;
var database_1 = require("@carbon/database");
var query_1 = require("~/utils/query");
var string_1 = require("~/utils/string");
var supabase_1 = require("~/utils/supabase");
function deleteEmployeeType(client, employeeTypeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("employeeType")
                    .delete()
                    .eq("id", employeeTypeId)
                    .eq("protected", false)];
        });
    });
}
function deleteGroup(client, groupId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("group").delete().eq("id", groupId)];
        });
    });
}
function getCompaniesForUser(client, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client
                        .from("userToCompany")
                        .select("companyId")
                        .eq("userId", userId)];
                case 1:
                    _a = _c.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.log("Failed to get companies for user ".concat(userId), error);
                        return [2 /*return*/, []];
                    }
                    return [2 /*return*/, (_b = data === null || data === void 0 ? void 0 : data.map(function (row) { return row.companyId; })) !== null && _b !== void 0 ? _b : []];
            }
        });
    });
}
function getCustomers(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("customerAccount")
                .select("active, user!inner(id, fullName, firstName, lastName, email, avatarUrl),\n      customer!inner(name, customerType!left(name))", { count: "exact" })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.ilike("user.fullName", "%".concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "user(lastName)", ascending: true }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getEmployee(client, id, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("employees")
                    .select("*")
                    .eq("id", id)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function getUnrevokedInviteEmails(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("invite")
                    .select("email")
                    .eq("companyId", companyId)
                    .is("revokedAt", null)];
        });
    });
}
function getEmployees(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query, hasStatusFilter;
        var _a;
        return __generator(this, function (_b) {
            query = client
                .from("employees")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            hasStatusFilter = (_a = args.filters) === null || _a === void 0 ? void 0 : _a.some(function (f) { return f.column === "status" || f.column === "active"; });
            if (!hasStatusFilter) {
                query = query.eq("active", true);
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "lastName", ascending: true }
            ]);
            return [2 /*return*/, query];
        });
    });
}
/**
 * Gets console operators — users with @console.internal emails.
 * Uses the employees view (which joins user + employee) and filters
 * by the synthetic email pattern since there's no FK from employee to user
 * for PostgREST to use directly.
 *
 * TODO: After running db:generate, replace email pattern filter with
 * .eq("isConsoleOperator", true) once the column is in the employees view.
 */
function getConsoleOperators(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("employees")
                .select("*", { count: "exact" })
                .eq("companyId", companyId)
                .like("email", "%@console.internal");
            if (args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "lastName", ascending: true }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getEmployeeType(client, employeeTypeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("employeeType")
                    .select("*")
                    .eq("id", employeeTypeId)
                    .single()];
        });
    });
}
function getEmployeeTypes(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("employeeType")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "name", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getInvitable(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("employeesAcrossCompanies")
                    .select("*")
                    .eq("active", true)
                    .not("companyId", "cs", "{\"".concat(companyId, "\"}"))
                    .order("lastName")];
        });
    });
}
function getModules(client) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("modules").select("name").order("name")];
        });
    });
}
function getGroup(client, groupId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("group").select("id, name").eq("id", groupId).single()];
        });
    });
}
function getGroupMembers(client, groupId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("groupMembers")
                    .select("name, groupId, memberGroupId, memberUserId")
                    .eq("groupId", groupId)];
        });
    });
}
function getGroups(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        var _a, _b;
        return __generator(this, function (_c) {
            query = client
                .rpc("groups_query", {
                _uid: (_a = args === null || args === void 0 ? void 0 : args.uid) !== null && _a !== void 0 ? _a : "",
                _name: (_b = args === null || args === void 0 ? void 0 : args.search) !== null && _b !== void 0 ? _b : ""
            })
                .eq("companyId", companyId);
            if (args)
                query = (0, query_1.setGenericQueryFilters)(query, args);
            return [2 /*return*/, query];
        });
    });
}
function getGroupEmails(client, groupIds) {
    return __awaiter(this, void 0, void 0, function () {
        var userIdsResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!groupIds || groupIds.length === 0)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, client.rpc("users_for_groups", {
                            groups: groupIds
                        })];
                case 1:
                    userIdsResult = (_a.sent());
                    if (userIdsResult.error || !Array.isArray(userIdsResult.data))
                        return [2 /*return*/, []];
                    return [2 /*return*/, getUserEmails(client, userIdsResult.data)];
            }
        });
    });
}
function getPermissionsByEmployeeType(client, employeeTypeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("employeeTypePermission")
                    .select("view, create, update, delete, module")
                    .eq("employeeTypeId", employeeTypeId)];
        });
    });
}
function getSuppliers(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("supplierAccount")
                .select("active, user!inner(id, fullName, firstName, lastName, email, avatarUrl),\n      supplier!inner(name, supplierType!left(name))", { count: "exact" })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.ilike("user.fullName", "%".concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "user(lastName)", ascending: true }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getUsers(client) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, database_1.fetchAllFromTable)(client, "user", "id, firstName, lastName, fullName, email, avatarUrl, number", function (query) { return query.eq("active", true).order("lastName"); })];
        });
    });
}
function getUserEmails(client, userIds) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!userIds || userIds.length === 0)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, client
                            .from("user")
                            .select("email")
                            .in("id", userIds)
                            .eq("active", true)];
                case 1:
                    result = _a.sent();
                    if (result.error || !result.data)
                        return [2 /*return*/, []];
                    return [2 /*return*/, result.data
                            .map(function (u) { return u.email; })
                            .filter(function (email) { return !!email; })];
            }
        });
    });
}
// Fixed permission set for MES-only employee types.
// Mirrors the Console Operator seeding — only modules the MES app actually uses.
// These are written to employeeTypePermission whenever a MES-only type is saved,
// regardless of what the admin submitted, so ERP modules can never be granted.
exports.MES_PERMISSIONS = [
    {
        name: "production",
        permission: { view: true, create: true, update: true, delete: false }
    },
    {
        name: "inventory",
        permission: { view: true, create: true, update: true, delete: false }
    },
    {
        name: "quality",
        permission: { view: true, create: true, update: true, delete: false }
    },
    {
        name: "items",
        permission: { view: true, create: false, update: false, delete: false }
    },
    {
        name: "resources",
        permission: { view: true, create: false, update: false, delete: false }
    },
    {
        name: "people",
        permission: { view: true, create: false, update: false, delete: false }
    },
    {
        name: "documents",
        permission: { view: true, create: false, update: false, delete: false }
    }
];
function insertEmployeeType(client, employeeType) {
    return __awaiter(this, void 0, void 0, function () {
        var mesOnly, base, row;
        return __generator(this, function (_a) {
            mesOnly = employeeType.mesOnly, base = __rest(employeeType, ["mesOnly"]);
            row = mesOnly ? __assign(__assign({}, base), { mesOnly: mesOnly }) : base;
            return [2 /*return*/, client.from("employeeType").insert([row]).select("id").single()];
        });
    });
}
function insertGroup(client, group) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("group").insert(group).select("*").single()];
        });
    });
}
function upsertEmployeeType(client, employeeType) {
    return __awaiter(this, void 0, void 0, function () {
        var mesOnly_1, base_1, row_1, mesOnly, base, row;
        return __generator(this, function (_a) {
            if ("id" in employeeType) {
                mesOnly_1 = employeeType.mesOnly, base_1 = __rest(employeeType, ["mesOnly"]);
                row_1 = mesOnly_1 !== undefined ? __assign(__assign({}, base_1), { mesOnly: mesOnly_1 }) : base_1;
                return [2 /*return*/, client
                        .from("employeeType")
                        .update((0, supabase_1.sanitize)(row_1))
                        .eq("id", employeeType.id)
                        .select("id")
                        .single()];
            }
            mesOnly = employeeType.mesOnly, base = __rest(employeeType, ["mesOnly"]);
            row = mesOnly ? __assign(__assign({}, base), { mesOnly: mesOnly }) : base;
            return [2 /*return*/, client.from("employeeType").insert([row]).select("id").single()];
        });
    });
}
function upsertEmployeeTypePermissions(client, employeeTypeId, companyId, permissions) {
    return __awaiter(this, void 0, void 0, function () {
        var employeeTypePermissions;
        return __generator(this, function (_a) {
            employeeTypePermissions = permissions.map(function (_a) {
                var name = _a.name, permission = _a.permission;
                return ({
                    employeeTypeId: employeeTypeId,
                    module: (0, string_1.capitalize)(name),
                    view: permission.view ? [companyId] : [],
                    create: permission.create ? [companyId] : [],
                    update: permission.update ? [companyId] : [],
                    delete: permission.delete ? [companyId] : []
                });
            });
            return [2 /*return*/, client.from("employeeTypePermission").upsert(employeeTypePermissions)];
        });
    });
}
function upsertGroup(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var id = _b.id, name = _b.name, companyId = _b.companyId;
        return __generator(this, function (_c) {
            return [2 /*return*/, client.from("group").upsert([{ id: id, name: name, companyId: companyId }])];
        });
    });
}
function upsertGroupMembers(client, groupId, selections) {
    return __awaiter(this, void 0, void 0, function () {
        var deleteExisting, memberGroups, memberUsers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("membership")
                        .delete()
                        .eq("groupId", groupId)];
                case 1:
                    deleteExisting = _a.sent();
                    if (deleteExisting.error)
                        return [2 /*return*/, deleteExisting];
                    memberGroups = selections
                        .filter(function (id) { return id.startsWith("group_"); })
                        .map(function (id) { return ({
                        groupId: groupId,
                        memberGroupId: id.slice(6)
                    }); });
                    memberUsers = selections
                        .filter(function (id) { return id.startsWith("user_"); })
                        .map(function (id) { return ({
                        groupId: groupId,
                        memberUserId: id.slice(5)
                    }); });
                    return [2 /*return*/, client.from("membership").insert(__spreadArray(__spreadArray([], memberGroups, true), memberUsers, true))];
            }
        });
    });
}
