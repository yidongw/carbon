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
exports.handle = void 0;
exports.loader = loader;
exports.default = KanbansRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var inventory_1 = require("~/modules/inventory");
var KanbansTable_1 = require("~/modules/inventory/ui/Kanbans/KanbansTable");
var resources_1 = require("~/modules/resources");
var settings_1 = require("~/modules/settings");
var users_server_1 = require("~/modules/users/users.server");
var path_1 = require("~/utils/path");
var query_1 = require("~/utils/query");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Kanbans"], ["Kanbans"]))),
    to: path_1.path.to.kanbans,
    module: "inventory"
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, url, searchParams, search, _d, limit, offset, sorts, filters, locationId, userDefaults, _e, _f, locations, _g, _h, _j, kanbans, kanbanOutput, _k, _l;
        var _m, _o, _p, _q, _r, _s, _t, _u;
        var request = _b.request;
        return __generator(this, function (_v) {
            switch (_v.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "inventory",
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
                    _f = [path_1.path.to.kanbans];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(userDefaults.error, "Failed to load default location"))];
                case 3: throw _e.apply(void 0, _f.concat([_v.sent()]));
                case 4:
                    locationId = (_o = (_m = userDefaults.data) === null || _m === void 0 ? void 0 : _m.locationId) !== null && _o !== void 0 ? _o : null;
                    _v.label = 5;
                case 5:
                    if (!!locationId) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, resources_1.getLocationsList)(client, companyId)];
                case 6:
                    locations = _v.sent();
                    if (!(locations.error || !((_p = locations.data) === null || _p === void 0 ? void 0 : _p.length))) return [3 /*break*/, 8];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.kanbans];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(locations.error, "Failed to load any locations"))];
                case 7: throw _g.apply(void 0, _h.concat([_v.sent()]));
                case 8:
                    locationId = (_q = locations.data) === null || _q === void 0 ? void 0 : _q[0].id;
                    _v.label = 9;
                case 9: return [4 /*yield*/, Promise.all([
                        (0, inventory_1.getKanbans)(client, locationId, companyId, {
                            search: search,
                            limit: limit,
                            offset: offset,
                            sorts: sorts,
                            filters: filters
                        }),
                        (0, settings_1.getKanbanOutputSetting)(client, companyId)
                    ])];
                case 10:
                    _j = _v.sent(), kanbans = _j[0], kanbanOutput = _j[1];
                    if (!kanbans.error) return [3 /*break*/, 12];
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.authenticatedRoot];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(kanbans.error, "Failed to fetch kanbans"))];
                case 11: throw _k.apply(void 0, _l.concat([_v.sent()]));
                case 12: return [2 /*return*/, {
                        count: (_r = kanbans.count) !== null && _r !== void 0 ? _r : 0,
                        kanbans: (_s = kanbans.data) !== null && _s !== void 0 ? _s : [],
                        kanbanOutput: (_u = (_t = kanbanOutput.data) === null || _t === void 0 ? void 0 : _t.kanbanOutput) !== null && _u !== void 0 ? _u : "qrcode",
                        locationId: locationId
                    }];
            }
        });
    });
}
function KanbansRoute() {
    var _a = (0, react_router_1.useLoaderData)(), count = _a.count, kanbans = _a.kanbans, locationId = _a.locationId, kanbanOutput = _a.kanbanOutput;
    return (<react_1.VStack spacing={0} className="h-full">
      <KanbansTable_1.default data={kanbans} count={count} locationId={locationId} kanbanOutput={kanbanOutput}/>
      <react_router_1.Outlet />
    </react_1.VStack>);
}
var templateObject_1;
