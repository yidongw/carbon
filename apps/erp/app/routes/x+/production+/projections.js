"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEEKS_TO_PROJECT = exports.handle = void 0;
exports.loader = loader;
exports.default = DemandProjectionsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var production_1 = require("~/modules/production");
var DemandProjectionTable_1 = require("~/modules/production/ui/Projection/DemandProjectionTable");
var resources_1 = require("~/modules/resources");
var shared_server_1 = require("~/modules/shared/shared.server");
var users_server_1 = require("~/modules/users/users.server");
var path_1 = require("~/utils/path");
var query_1 = require("~/utils/query");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Projections"], ["Projections"]))),
    to: path_1.path.to.demandProjections
};
exports.WEEKS_TO_PROJECT = 12 * 4;
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, url, searchParams, search, _d, limit, offset, sorts, filters, locationId, userDefaults, _e, _f, locations, _g, _h, periods, periodsError_1, _j, _k, projections, _l, _m;
        var _o, _p, _q, _r, _s, _t, _u;
        var request = _b.request;
        return __generator(this, function (_v) {
            switch (_v.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "production",
                        role: "employee",
                        bypassRls: true
                    })];
                case 1:
                    _c = _v.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    search = searchParams.get("search");
                    _d = (0, query_1.getGenericQueryFilters)(searchParams), limit = _d.limit, offset = _d.offset, sorts = _d.sorts, filters = _d.filters;
                    locationId = searchParams.get("location");
                    if (!!locationId) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, users_server_1.getUserDefaults)(client, userId, companyId)];
                case 2:
                    userDefaults = _v.sent();
                    if (!userDefaults.error) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.productionDashboard];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(userDefaults.error, "Failed to load default location"))];
                case 3: throw _e.apply(void 0, _f.concat([_v.sent()]));
                case 4:
                    locationId = (_p = (_o = userDefaults.data) === null || _o === void 0 ? void 0 : _o.locationId) !== null && _p !== void 0 ? _p : null;
                    _v.label = 5;
                case 5:
                    if (!!locationId) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, resources_1.getLocationsList)(client, companyId)];
                case 6:
                    locations = _v.sent();
                    if (!(locations.error || !((_q = locations.data) === null || _q === void 0 ? void 0 : _q.length))) return [3 /*break*/, 8];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.inventoryQuantities];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(locations.error, "Failed to load any locations"))];
                case 7: throw _g.apply(void 0, _h.concat([_v.sent()]));
                case 8:
                    locationId = (_r = locations.data) === null || _r === void 0 ? void 0 : _r[0].id;
                    _v.label = 9;
                case 9:
                    _v.trys.push([9, 11, , 13]);
                    return [4 /*yield*/, (0, shared_server_1.getOrCreatePeriods)((0, date_1.today)((0, date_1.getLocalTimeZone)()), exports.WEEKS_TO_PROJECT)];
                case 10:
                    periods = _v.sent();
                    return [3 /*break*/, 13];
                case 11:
                    periodsError_1 = _v.sent();
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.productionDashboard];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(periodsError_1, "Failed to load projection periods"))];
                case 12: throw _j.apply(void 0, _k.concat([_v.sent()]));
                case 13: return [4 /*yield*/, (0, production_1.getProductionProjections)(client, locationId, periods.map(function (p) { return p.id; }), companyId, {
                        search: search,
                        limit: limit,
                        offset: offset,
                        sorts: sorts,
                        filters: filters
                    })];
                case 14:
                    projections = _v.sent();
                    if (!projections.error) return [3 /*break*/, 16];
                    _l = react_router_1.redirect;
                    _m = [path_1.path.to.productionDashboard];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(projections.error, "Failed to get production projections"))];
                case 15: throw _l.apply(void 0, _m.concat([_v.sent()]));
                case 16: return [2 /*return*/, {
                        projections: (_s = projections.data) !== null && _s !== void 0 ? _s : [],
                        count: (_u = (_t = projections.data) === null || _t === void 0 ? void 0 : _t.length) !== null && _u !== void 0 ? _u : 0,
                        locationId: locationId,
                        periods: periods
                    }];
            }
        });
    });
}
function DemandProjectionsRoute() {
    var _a = (0, react_router_1.useLoaderData)(), projections = _a.projections, count = _a.count, locationId = _a.locationId, periods = _a.periods;
    return (<react_1.VStack spacing={0} className="h-full">
      <DemandProjectionTable_1.default data={projections} count={count} locationId={locationId} periods={periods}/>
      <react_router_1.Outlet />
    </react_1.VStack>);
}
var templateObject_1;
