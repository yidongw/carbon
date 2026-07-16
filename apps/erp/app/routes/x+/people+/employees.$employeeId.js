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
exports.loader = loader;
exports.action = action;
exports.default = UsersEmployeeRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var users_1 = require("~/modules/users");
var users_server_1 = require("~/modules/users/users.server");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var companyId, employeeId, client, _c, rawClaims, employee, employeeTypes, _d, _e, claims, _f, _g, types, permissionsByType, employeeTypePermissions;
        var _h;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "users",
                        role: "employee"
                    })];
                case 1:
                    companyId = (_j.sent()).companyId;
                    employeeId = params.employeeId;
                    if (!employeeId)
                        throw (0, auth_1.notFound)("employeeId not found");
                    client = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, Promise.all([
                            (0, users_server_1.getClaims)(client, employeeId, companyId),
                            (0, users_1.getEmployee)(client, employeeId, companyId),
                            (0, users_1.getEmployeeTypes)(client, companyId)
                        ])];
                case 2:
                    _c = _j.sent(), rawClaims = _c[0], employee = _c[1], employeeTypes = _c[2];
                    if (!(rawClaims.error || employee.error || rawClaims.data === null)) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.employeeAccounts];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)({ rawClaims: rawClaims.error, employee: employee.error }, "Failed to load employee"))];
                case 3:
                    _d.apply(void 0, _e.concat([_j.sent()]));
                    _j.label = 4;
                case 4:
                    claims = (0, users_server_1.makeCompanyPermissionsFromClaims)(rawClaims.data, companyId);
                    if (!(claims === null)) return [3 /*break*/, 6];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.employeeAccounts];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Failed to parse claims"))];
                case 5:
                    _f.apply(void 0, _g.concat([_j.sent()]));
                    _j.label = 6;
                case 6:
                    types = (_h = employeeTypes.data) !== null && _h !== void 0 ? _h : [];
                    return [4 /*yield*/, Promise.all(types.map(function (t) { return (0, users_1.getPermissionsByEmployeeType)(client, t.id); }))];
                case 7:
                    permissionsByType = _j.sent();
                    employeeTypePermissions = {};
                    types.forEach(function (t, i) {
                        var _a;
                        var result = permissionsByType[i];
                        var raw = (0, users_server_1.makeCompanyPermissionsFromEmployeeType)((_a = result.data) !== null && _a !== void 0 ? _a : [], companyId);
                        var perms = {};
                        for (var _i = 0, _b = Object.entries(raw); _i < _b.length; _i++) {
                            var _c = _b[_i], mod = _c[0], entry = _c[1];
                            perms[mod.toLowerCase()] = entry.permission;
                        }
                        employeeTypePermissions[t.id] = perms;
                    });
                    return [2 /*return*/, {
                            permissions: claims === null || claims === void 0 ? void 0 : claims.permissions,
                            employee: employee.data,
                            employeeTypes: types,
                            employeeTypePermissions: employeeTypePermissions
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, validation, _d, _e, _f, id, employeeType, permissionData, permissions, _g, _h, result, _j, _k;
        var request = _b.request;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "users"
                        })];
                case 1:
                    _c = _l.sent(), client = _c.client, companyId = _c.companyId;
                    _e = (_d = (0, form_1.validator)(users_1.employeeValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 2: return [4 /*yield*/, _e.apply(_d, [_l.sent()])];
                case 3:
                    validation = _l.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _f = validation.data, id = _f.id, employeeType = _f.employeeType, permissionData = _f.data;
                    permissions = JSON.parse(permissionData);
                    if (!!Object.values(permissions).every(function (permission) { return users_1.userPermissionsValidator.safeParse(permission).success; })) return [3 /*break*/, 5];
                    _g = react_router_1.data;
                    _h = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(permissions, "Failed to parse permissions"))];
                case 4: return [2 /*return*/, _g.apply(void 0, _h.concat([_l.sent()]))];
                case 5: return [4 /*yield*/, (0, users_server_1.updateEmployee)(client, {
                        id: id,
                        employeeType: employeeType,
                        permissions: permissions,
                        companyId: companyId
                    })];
                case 6:
                    result = _l.sent();
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.employeeAccounts];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, result)];
                case 7: throw _j.apply(void 0, _k.concat([_l.sent()]));
            }
        });
    });
}
function UsersEmployeeRoute() {
    var _a = (0, react_router_1.useLoaderData)(), permissions = _a.permissions, employee = _a.employee, employeeTypes = _a.employeeTypes, employeeTypePermissions = _a.employeeTypePermissions;
    var initialValues = {
        id: (employee === null || employee === void 0 ? void 0 : employee.id) || "",
        employeeType: employee === null || employee === void 0 ? void 0 : employee.employeeTypeId,
        permissions: permissions || {}
    };
    return (<users_1.EmployeePermissionsForm key={initialValues.id} name={(employee === null || employee === void 0 ? void 0 : employee.name) || ""} employeeTypes={employeeTypes} employeeTypePermissions={employeeTypePermissions} 
    // @ts-expect-error
    initialValues={initialValues}/>);
}
