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
exports.handle = void 0;
exports.loader = loader;
exports.default = JobsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var production_1 = require("~/modules/production");
var Jobs_1 = require("~/modules/production/ui/Jobs");
var resources_1 = require("~/modules/resources");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var query_1 = require("~/utils/query");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Jobs"], ["Jobs"]))),
    to: path_1.path.to.jobs
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, url, searchParams, search, _d, limit, offset, sorts, filters, _e, jobs, locations, tags, _f, _g, jobRows, jobMakeMethodIds, itemIds, _h, trackedEntities, itemIdsWithConfigurationParameters, currentProcessByJobId;
        var _j, _k, _l, _m;
        var request = _b.request;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "production",
                        role: "employee",
                        bypassRls: true
                    })];
                case 1:
                    _c = _o.sent(), client = _c.client, companyId = _c.companyId;
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    search = searchParams.get("search");
                    _d = (0, query_1.getGenericQueryFilters)(searchParams), limit = _d.limit, offset = _d.offset, sorts = _d.sorts, filters = _d.filters;
                    return [4 /*yield*/, Promise.all([
                            (0, production_1.getJobs)(client, companyId, {
                                search: search,
                                limit: limit,
                                offset: offset,
                                sorts: sorts,
                                filters: filters
                            }),
                            (0, resources_1.getLocationsList)(client, companyId),
                            (0, shared_1.getTagsList)(client, companyId, "job")
                        ])];
                case 2:
                    _e = _o.sent(), jobs = _e[0], locations = _e[1], tags = _e[2];
                    if (!jobs.error) return [3 /*break*/, 4];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.productionDashboard];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(jobs.error, "Failed to fetch jobs"))];
                case 3:
                    _f.apply(void 0, _g.concat([_o.sent()]));
                    _o.label = 4;
                case 4:
                    jobRows = (_j = jobs.data) !== null && _j !== void 0 ? _j : [];
                    jobMakeMethodIds = __spreadArray([], new Set(jobRows
                        .map(function (job) { return job.jobMakeMethodId; })
                        .filter(function (id) { return Boolean(id); })), true);
                    itemIds = __spreadArray([], new Set(jobRows.map(function (job) { return job.itemId; }).filter(function (id) { return Boolean(id); })), true);
                    return [4 /*yield*/, Promise.all([
                            (0, production_1.getTrackedEntitiesByJobMakeMethodIds)(client, companyId, jobMakeMethodIds),
                            (0, production_1.getItemIdsWithConfigurationParameters)(client, companyId, itemIds),
                            (0, production_1.getCurrentProcessByJobIds)(client, jobRows)
                        ])];
                case 5:
                    _h = _o.sent(), trackedEntities = _h[0], itemIdsWithConfigurationParameters = _h[1], currentProcessByJobId = _h[2];
                    return [2 /*return*/, {
                            count: (_k = jobs.count) !== null && _k !== void 0 ? _k : 0,
                            jobs: jobRows,
                            locations: (_l = locations.data) !== null && _l !== void 0 ? _l : [],
                            tags: (_m = tags.data) !== null && _m !== void 0 ? _m : [],
                            trackedEntities: trackedEntities,
                            itemIdsWithConfigurationParameters: itemIdsWithConfigurationParameters,
                            currentProcessByJobId: currentProcessByJobId
                        }];
            }
        });
    });
}
function JobsRoute() {
    var _a = (0, react_router_1.useLoaderData)(), count = _a.count, tags = _a.tags, jobs = _a.jobs, trackedEntities = _a.trackedEntities, itemIdsWithConfigurationParameters = _a.itemIdsWithConfigurationParameters, currentProcessByJobId = _a.currentProcessByJobId;
    return (<react_1.VStack spacing={0} className="h-full">
      <Jobs_1.JobsTable data={jobs} count={count} tags={tags} trackedEntities={trackedEntities} itemIdsWithConfigurationParameters={itemIdsWithConfigurationParameters} currentProcessByJobId={currentProcessByJobId}/>
      <react_router_1.Outlet />
    </react_1.VStack>);
}
var templateObject_1;
