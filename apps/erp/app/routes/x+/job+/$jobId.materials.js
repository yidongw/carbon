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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = loader;
exports.default = JobMaterialsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var react_router_1 = require("react-router");
var Layout_1 = require("~/components/Layout");
var production_1 = require("~/modules/production");
var Jobs_1 = require("~/modules/production/ui/Jobs");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
var query_1 = require("~/utils/query");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, jobId, url, searchParams, search, _d, limit, offset, sorts, filters, job, _e, _f, materials, _g, _h, settings, inventoryShelfLife, nearExpiryWarningDays, expiredItemIds, itemIds, todayStr, expired;
        var _j, _k, _l, _m, _o;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "production",
                        role: "employee"
                    })];
                case 1:
                    _c = _p.sent(), client = _c.client, companyId = _c.companyId;
                    jobId = params.jobId;
                    if (!jobId)
                        throw new Error("Could not find jobId");
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    search = searchParams.get("search");
                    _d = (0, query_1.getGenericQueryFilters)(searchParams), limit = _d.limit, offset = _d.offset, sorts = _d.sorts, filters = _d.filters;
                    return [4 /*yield*/, (0, production_1.getJob)(client, jobId)];
                case 2:
                    job = _p.sent();
                    if (!job.error) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.jobs];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(job.error, "Failed to fetch job"))];
                case 3: throw _e.apply(void 0, _f.concat([_p.sent()]));
                case 4: return [4 /*yield*/, (0, production_1.getJobMaterialsWithQuantityOnHand)(client, jobId, companyId, (_j = job.data.locationId) !== null && _j !== void 0 ? _j : "", {
                        search: search,
                        limit: limit,
                        offset: offset,
                        sorts: sorts,
                        filters: filters
                    })];
                case 5:
                    materials = _p.sent();
                    if (!materials.error) return [3 /*break*/, 7];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.productionDashboard];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(materials.error, "Failed to fetch job materials"))];
                case 6:
                    _g.apply(void 0, _h.concat([_p.sent()]));
                    _p.label = 7;
                case 7: return [4 /*yield*/, (0, settings_1.getCompanySettings)(client, companyId)];
                case 8:
                    settings = _p.sent();
                    inventoryShelfLife = (_k = settings.data) === null || _k === void 0 ? void 0 : _k.inventoryShelfLife;
                    nearExpiryWarningDays = (_l = inventoryShelfLife === null || inventoryShelfLife === void 0 ? void 0 : inventoryShelfLife.nearExpiryWarningDays) !== null && _l !== void 0 ? _l : null;
                    expiredItemIds = new Set();
                    if (!(nearExpiryWarningDays !== null && materials.data)) return [3 /*break*/, 10];
                    itemIds = materials.data
                        .map(function (m) { return m.jobMaterialItemId; })
                        .filter(Boolean);
                    if (!(itemIds.length > 0)) return [3 /*break*/, 10];
                    todayStr = (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString();
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .select("sourceDocumentId")
                            .in("sourceDocumentId", itemIds)
                            .eq("companyId", companyId)
                            .not("expirationDate", "is", null)
                            .lt("expirationDate", todayStr)];
                case 9:
                    expired = (_p.sent()).data;
                    expiredItemIds = new Set((expired !== null && expired !== void 0 ? expired : [])
                        .map(function (e) { return e.sourceDocumentId; })
                        .filter(Boolean));
                    _p.label = 10;
                case 10: return [2 /*return*/, {
                        count: (_m = materials.count) !== null && _m !== void 0 ? _m : 0,
                        materials: ((_o = materials.data) !== null && _o !== void 0 ? _o : []).map(function (m) {
                            var _a;
                            return (__assign(__assign({}, m), { hasExpiredBatch: expiredItemIds.has((_a = m.jobMaterialItemId) !== null && _a !== void 0 ? _a : "") }));
                        }),
                        nearExpiryWarningDays: nearExpiryWarningDays
                    }];
            }
        });
    });
}
function JobMaterialsRoute() {
    var _a = (0, react_router_1.useLoaderData)(), count = _a.count, materials = _a.materials, nearExpiryWarningDays = _a.nearExpiryWarningDays;
    var setIsExplorerCollapsed = (0, Layout_1.usePanels)().setIsExplorerCollapsed;
    (0, react_1.useMount)(function () {
        setIsExplorerCollapsed(true);
    });
    return (<react_1.VStack spacing={0} className="h-[calc(100dvh-99px)]">
      <Jobs_1.JobMaterialsTable data={materials} count={count} nearExpiryWarningDays={nearExpiryWarningDays}/>
    </react_1.VStack>);
}
