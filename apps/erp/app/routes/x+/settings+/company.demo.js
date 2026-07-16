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
var company_server_1 = require("@carbon/auth/company.server");
var session_server_1 = require("@carbon/auth/session.server");
var kv_1 = require("@carbon/kv");
var locale_1 = require("@carbon/locale");
var utils_1 = require("@carbon/utils");
var date_1 = require("@internationalized/date");
var react_router_1 = require("react-router");
var people_1 = require("~/modules/people");
var resources_1 = require("~/modules/resources");
var settings_1 = require("~/modules/settings");
var users_server_1 = require("~/modules/users/users.server");
var path_1 = require("~/utils/path");
// A demo company is accessible for this many days, then hidden and (30 days later) deleted
// by the demo-cleanup scheduled job (packages/jobs .../scheduled/demo-cleanup.ts).
var DEMO_ACCESS_DAYS = 30;
/**
 * "Try the demo" — lazily creates a single, full-feature demo company for the current user
 * (seeded like any new company) and switches the active company to it. If the user already
 * has a demo company, this just switches to it instead of creating another.
 *
 * Created lazily (on click) rather than at signup so we don't seed heavy data for users who
 * never engage, and so the 30-day clock starts when they actually try it.
 */
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var userId, client, links, companyIds, companyId, companyGroupId, existingDemo, demoExpiresAt, companyInsert, demoRow, language, seed, locationInsert, job, companyRecord, sessionCookie, companyIdCookie;
        var _c, _d, _e, _f;
        var request = _b.request;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    userId = (_g.sent()).userId;
                    client = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, client
                            .from("userToCompany")
                            .select("companyId")
                            .eq("userId", userId)];
                case 2:
                    links = (_g.sent()).data;
                    companyIds = (links !== null && links !== void 0 ? links : []).map(function (l) { return l.companyId; });
                    companyGroupId = "";
                    if (!(companyIds.length > 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, client
                            .from("company")
                            .select("id, companyGroupId")
                            .eq("isDemo", true)
                            .in("id", companyIds)
                            .maybeSingle()];
                case 3:
                    existingDemo = (_g.sent()).data;
                    if (existingDemo) {
                        companyId = existingDemo.id;
                        companyGroupId = (_c = existingDemo.companyGroupId) !== null && _c !== void 0 ? _c : "";
                    }
                    _g.label = 4;
                case 4:
                    if (!!companyId) return [3 /*break*/, 11];
                    demoExpiresAt = new Date(Date.now() + DEMO_ACCESS_DAYS * 24 * 60 * 60 * 1000).toISOString();
                    return [4 /*yield*/, client
                            .from("company")
                            .insert({
                            name: "Demo Company",
                            baseCurrencyCode: "USD",
                            isDemo: true
                        })
                            .select("id")
                            .single()];
                case 5:
                    companyInsert = _g.sent();
                    if (companyInsert.error || !((_d = companyInsert.data) === null || _d === void 0 ? void 0 : _d.id)) {
                        console.error(companyInsert.error);
                        throw new Error("Fatal: failed to insert demo company");
                    }
                    companyId = companyInsert.data.id;
                    return [4 /*yield*/, client.from("demoCompany").insert({
                            id: companyId,
                            expiresAt: demoExpiresAt,
                            seedStatus: "pending"
                        })];
                case 6:
                    demoRow = _g.sent();
                    if (demoRow.error) {
                        console.error(demoRow.error);
                        throw new Error("Fatal: failed to insert demo metadata");
                    }
                    language = (0, locale_1.resolveLanguage)((0, utils_1.getPreferenceHeaders)(request).locale);
                    return [4 /*yield*/, (0, settings_1.seedCompany)(client, companyId, userId, undefined, language)];
                case 7:
                    seed = _g.sent();
                    if (seed.error) {
                        console.error(seed.error);
                        throw new Error("Fatal: failed to seed demo company");
                    }
                    return [4 /*yield*/, (0, resources_1.upsertLocation)(client, {
                            name: "Headquarters",
                            companyId: companyId,
                            timezone: (0, date_1.getLocalTimeZone)(),
                            createdBy: userId,
                            addressLine1: "",
                            city: "",
                            stateProvince: "",
                            postalCode: "",
                            countryCode: ""
                        })];
                case 8:
                    locationInsert = _g.sent();
                    if (locationInsert.error || !((_e = locationInsert.data) === null || _e === void 0 ? void 0 : _e.id)) {
                        console.error(locationInsert.error);
                        throw new Error("Fatal: failed to insert demo location");
                    }
                    return [4 /*yield*/, Promise.all([
                            (0, people_1.insertEmployeeJob)(client, {
                                id: userId,
                                companyId: companyId,
                                locationId: locationInsert.data.id
                            }),
                            kv_1.redis.del((0, users_server_1.getPermissionCacheKey)(userId))
                        ])];
                case 9:
                    job = (_g.sent())[0];
                    if (job.error) {
                        console.error(job.error);
                        throw new Error("Fatal: failed to insert demo job");
                    }
                    return [4 /*yield*/, client
                            .from("company")
                            .select("companyGroupId")
                            .eq("id", companyId)
                            .single()];
                case 10:
                    companyRecord = (_g.sent()).data;
                    companyGroupId = (_f = companyRecord === null || companyRecord === void 0 ? void 0 : companyRecord.companyGroupId) !== null && _f !== void 0 ? _f : "";
                    _g.label = 11;
                case 11: return [4 /*yield*/, (0, session_server_1.updateCompanySession)(request, companyId, companyGroupId)];
                case 12:
                    sessionCookie = _g.sent();
                    companyIdCookie = (0, company_server_1.setCompanyId)(companyId);
                    throw (0, react_router_1.redirect)(path_1.path.to.authenticatedRoot, {
                        headers: [
                            ["Set-Cookie", sessionCookie],
                            ["Set-Cookie", companyIdCookie]
                        ]
                    });
            }
        });
    });
}
