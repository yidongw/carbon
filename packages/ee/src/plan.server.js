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
exports.companyHasPlan = companyHasPlan;
exports.requirePlan = requirePlan;
var auth_1 = require("@carbon/auth");
var session_server_1 = require("@carbon/auth/session.server");
var utils_1 = require("@carbon/utils");
var react_router_1 = require("react-router");
var plan_1 = require("./plan");
function isBypassCompany(companyId) {
    if (!auth_1.STRIPE_BYPASS_COMPANY_IDS)
        return false;
    return auth_1.STRIPE_BYPASS_COMPANY_IDS.split(",")
        .map(function (id) { return id.trim(); })
        .includes(companyId);
}
function getCompanyPlan(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("companyPlan")
                        .select("planId")
                        .eq("id", companyId)
                        .single()];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, (0, utils_1.normalizePlanId)(data === null || data === void 0 ? void 0 : data.planId)];
            }
        });
    });
}
/** Self-hosted and bypass-listed companies always pass. */
function companyHasPlan(client, companyId, spec) {
    return __awaiter(this, void 0, void 0, function () {
        var current;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (auth_1.CarbonEdition !== utils_1.Edition.Cloud)
                        return [2 /*return*/, true];
                    if (isBypassCompany(companyId))
                        return [2 /*return*/, true];
                    return [4 /*yield*/, getCompanyPlan(client, companyId)];
                case 1:
                    current = _a.sent();
                    return [2 /*return*/, (0, plan_1.planMeetsRequirement)(current, (0, plan_1.resolveRequirement)(spec))];
            }
        });
    });
}
/** Throws a redirect with flash error when the plan check fails. */
function requirePlan(_a) {
    return __awaiter(this, void 0, void 0, function () {
        var requirement, current, _b, _c;
        var request = _a.request, client = _a.client, companyId = _a.companyId, redirectTo = _a.redirectTo, message = _a.message, spec = __rest(_a, ["request", "client", "companyId", "redirectTo", "message"]);
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (auth_1.CarbonEdition !== utils_1.Edition.Cloud)
                        return [2 /*return*/];
                    if (isBypassCompany(companyId))
                        return [2 /*return*/];
                    requirement = (0, plan_1.resolveRequirement)(spec);
                    return [4 /*yield*/, getCompanyPlan(client, companyId)];
                case 1:
                    current = _d.sent();
                    if (!!(0, plan_1.planMeetsRequirement)(current, requirement)) return [3 /*break*/, 3];
                    _b = react_router_1.redirect;
                    _c = [redirectTo];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, message !== null && message !== void 0 ? message : (0, plan_1.defaultUpgradeMessage)(requirement)))];
                case 2: throw _b.apply(void 0, _c.concat([_d.sent()]));
                case 3: return [2 /*return*/];
            }
        });
    });
}
