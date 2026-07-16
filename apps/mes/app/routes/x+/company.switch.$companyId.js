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
var company_server_1 = require("@carbon/auth/company.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_router_1 = require("react-router");
var location_server_1 = require("~/services/location.server");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, companies, _d, _e, companyId, matchedCompany, _f, _g, sessionCookie, companyIdCookie, storedLocations, locationCookie;
        var _h, _j, _k, _l;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _m.sent(), client = _c.client, userId = _c.userId;
                    return [4 /*yield*/, (0, auth_1.getCompanies)(client, userId)];
                case 2:
                    companies = _m.sent();
                    if (!companies.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [(_h = (0, path_1.requestReferrer)(request)) !== null && _h !== void 0 ? _h : path_1.path.to.authenticatedRoot];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(companies.error, "Failed to get companies"))];
                case 3: throw _d.apply(void 0, _e.concat([_m.sent()]));
                case 4:
                    companyId = params.companyId;
                    matchedCompany = (_j = companies.data) === null || _j === void 0 ? void 0 : _j.find(function (company) { return company.id === companyId; });
                    if (!!matchedCompany) return [3 /*break*/, 6];
                    _f = react_router_1.redirect;
                    _g = [(_k = (0, path_1.requestReferrer)(request)) !== null && _k !== void 0 ? _k : path_1.path.to.authenticatedRoot];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Company not found"))];
                case 5: throw _f.apply(void 0, _g.concat([_m.sent()]));
                case 6:
                    if (!!companyId) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, session_server_1.destroyAuthSession)(request)];
                case 7:
                    _m.sent();
                    _m.label = 8;
                case 8: return [4 /*yield*/, (0, session_server_1.updateCompanySession)(request, companyId, (_l = matchedCompany.companyGroupId) !== null && _l !== void 0 ? _l : "")];
                case 9:
                    sessionCookie = _m.sent();
                    companyIdCookie = (0, company_server_1.setCompanyId)(companyId);
                    return [4 /*yield*/, (0, location_server_1.getLocation)(request, client, {
                            userId: userId,
                            companyId: companyId
                        })];
                case 10:
                    storedLocations = _m.sent();
                    if (!storedLocations.updated) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, location_server_1.setLocation)(companyId, storedLocations.location)];
                case 11:
                    locationCookie = _m.sent();
                    throw (0, react_router_1.redirect)(path_1.path.to.authenticatedRoot, {
                        headers: [
                            ["Set-Cookie", sessionCookie],
                            ["Set-Cookie", companyIdCookie],
                            ["Set-Cookie", locationCookie]
                        ]
                    });
                case 12: throw (0, react_router_1.redirect)(path_1.path.to.authenticatedRoot, {
                    headers: [
                        ["Set-Cookie", sessionCookie],
                        ["Set-Cookie", companyIdCookie]
                    ]
                });
            }
        });
    });
}
