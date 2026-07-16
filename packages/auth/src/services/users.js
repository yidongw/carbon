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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClaims = getClaims;
exports.getPermissionCacheKey = getPermissionCacheKey;
exports.isValidCachedClaims = isValidCachedClaims;
exports.getCompanies = getCompanies;
exports.getCompaniesForUser = getCompaniesForUser;
exports.getUser = getUser;
exports.makePermissionsFromClaims = makePermissionsFromClaims;
var env_1 = require("../config/env");
function getClaims(client, uid, company) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.rpc("get_claims", { uid: uid, company: company !== null && company !== void 0 ? company : "" })];
        });
    });
}
function getPermissionCacheKey(userId) {
    return "permissions:".concat(userId);
}
/** Reject stale Redis entries cached before the user had a company/role. */
function isValidCachedClaims(claims) {
    return (!!claims && !!claims.role && Object.keys(claims.permissions).length > 0);
}
function getCompanies(client, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var companies;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("companies")
                        .select("*, companyGroup(name)")
                        .eq("userId", userId)
                        .order("name")];
                case 1:
                    companies = _a.sent();
                    if (companies.error) {
                        return [2 /*return*/, companies];
                    }
                    return [2 /*return*/, {
                            data: companies.data.map(function (_a) {
                                var _b;
                                var companyGroup = _a.companyGroup, company = __rest(_a, ["companyGroup"]);
                                return (__assign(__assign({}, company), { companyGroupName: (_b = companyGroup === null || companyGroup === void 0 ? void 0 : companyGroup.name) !== null && _b !== void 0 ? _b : null, logoLightIcon: company.logoLightIcon
                                        ? "".concat(env_1.SUPABASE_URL, "/storage/v1/object/public/public/").concat(company.logoLightIcon)
                                        : null, logoDarkIcon: company.logoDarkIcon
                                        ? "".concat(env_1.SUPABASE_URL, "/storage/v1/object/public/public/").concat(company.logoDarkIcon)
                                        : null, logoLight: company.logoLight
                                        ? "".concat(env_1.SUPABASE_URL, "/storage/v1/object/public/public/").concat(company.logoLight)
                                        : null, logoDark: company.logoDark
                                        ? "".concat(env_1.SUPABASE_URL, "/storage/v1/object/public/public/").concat(company.logoDark)
                                        : null }));
                            }),
                            error: null
                        }];
            }
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
                        console.error(error, "Failed to get companies for user ".concat(userId));
                        return [2 /*return*/, []];
                    }
                    return [2 /*return*/, (_b = data === null || data === void 0 ? void 0 : data.map(function (row) { return row.companyId; })) !== null && _b !== void 0 ? _b : []];
            }
        });
    });
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
function isClaimPermission(key, value) {
    var action = key.split("_")[1];
    return (action !== undefined &&
        ["view", "create", "update", "delete"].includes(action) &&
        Array.isArray(value));
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
            var perm = permissions[module];
            switch (action) {
                case "view":
                    // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
                    perm["view"] = value;
                    break;
                case "create":
                    // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
                    perm["create"] = value;
                    break;
                case "update":
                    // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
                    perm["update"] = value;
                    break;
                case "delete":
                    // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
                    perm["delete"] = value;
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
    return { permissions: permissions, role: role };
}
