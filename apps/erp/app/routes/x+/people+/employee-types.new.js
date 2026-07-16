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
exports.default = NewEmployeeTypesRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var users_1 = require("~/modules/users");
var users_server_1 = require("~/modules/users/users.server");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, modules, _c, _d;
        var request = _b.request;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        create: "users"
                    })];
                case 1:
                    client = (_e.sent()).client;
                    return [4 /*yield*/, (0, users_1.getModules)(client)];
                case 2:
                    modules = _e.sent();
                    if (!(modules.error || modules.data === null)) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.employeeTypes];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(modules.error, "Failed to get modules"))];
                case 3: throw _c.apply(void 0, _d.concat([_e.sent()]));
                case 4: return [2 /*return*/, {
                        permissions: (0, users_server_1.makeEmptyPermissionsFromModules)(modules.data)
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, validation, _d, _e, _f, name, mesOnly, permissionData, permissions, jsonValidation, _g, _h, createEmployeeType, _j, _k, employeeTypeId, _l, _m, insertEmployeeTypePermissions, _o, _p, _q, _r;
        var _s;
        var request = _b.request;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "users"
                        })];
                case 1:
                    _c = _t.sent(), client = _c.client, companyId = _c.companyId;
                    _e = (_d = (0, form_1.validator)(users_1.employeeTypeValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 2: return [4 /*yield*/, _e.apply(_d, [_t.sent()])];
                case 3:
                    validation = _t.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _f = validation.data, name = _f.name, mesOnly = _f.mesOnly, permissionData = _f.data;
                    permissions = JSON.parse(permissionData);
                    jsonValidation = users_1.employeeTypePermissionsValidator.safeParse(permissions);
                    if (!(jsonValidation.success === false)) return [3 /*break*/, 5];
                    _g = react_router_1.data;
                    _h = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(jsonValidation.error, "Failed to parse permissions"))];
                case 4: return [2 /*return*/, _g.apply(void 0, _h.concat([_t.sent()]))];
                case 5: return [4 /*yield*/, (0, users_1.insertEmployeeType)(client, {
                        name: name,
                        mesOnly: mesOnly,
                        companyId: companyId
                    })];
                case 6:
                    createEmployeeType = _t.sent();
                    if (!createEmployeeType.error) return [3 /*break*/, 8];
                    _j = react_router_1.data;
                    _k = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(createEmployeeType.error, "Failed to insert employee type"))];
                case 7: return [2 /*return*/, _j.apply(void 0, _k.concat([_t.sent()]))];
                case 8:
                    employeeTypeId = (_s = createEmployeeType.data) === null || _s === void 0 ? void 0 : _s.id;
                    if (!!employeeTypeId) return [3 /*break*/, 10];
                    _l = react_router_1.data;
                    _m = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(createEmployeeType, "Failed to insert employee type"))];
                case 9: return [2 /*return*/, _l.apply(void 0, _m.concat([_t.sent()]))];
                case 10: return [4 /*yield*/, (0, users_1.upsertEmployeeTypePermissions)(client, employeeTypeId, companyId, mesOnly ? users_1.MES_PERMISSIONS : permissions)];
                case 11:
                    insertEmployeeTypePermissions = _t.sent();
                    if (!insertEmployeeTypePermissions.error) return [3 /*break*/, 13];
                    _o = react_router_1.data;
                    _p = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(insertEmployeeTypePermissions.error, "Failed to insert employee type permissions"))];
                case 12: return [2 /*return*/, _o.apply(void 0, _p.concat([_t.sent()]))];
                case 13:
                    _q = react_router_1.redirect;
                    _r = [path_1.path.to.employeeTypes];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Employee type created"))];
                case 14: throw _q.apply(void 0, _r.concat([_t.sent()]));
            }
        });
    });
}
function NewEmployeeTypesRoute() {
    var permissions = (0, react_router_1.useLoaderData)().permissions;
    var initialValues = {
        name: "",
        mesOnly: false,
        data: "",
        permissions: permissions
    };
    return <users_1.EmployeeTypeForm initialValues={initialValues}/>;
}
