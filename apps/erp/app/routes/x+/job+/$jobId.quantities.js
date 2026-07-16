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
exports.default = ProductionQuantitiesRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var react_router_1 = require("react-router");
var Layout_1 = require("~/components/Layout");
var production_1 = require("~/modules/production");
var Jobs_1 = require("~/modules/production/ui/Jobs");
var unifiedQuantityFeeds_1 = require("~/modules/production/ui/Jobs/unifiedQuantityFeeds");
var path_1 = require("~/utils/path");
var query_1 = require("~/utils/query");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, jobId, url, searchParams, search, _d, limit, offset, sorts, filters, operations, _e, _f, operationIds, listQueryArgs, _g, employeeQuantities, supplierQuantities, scrapReasons, _h, _j, _k, _l, merged;
        var _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_x) {
            switch (_x.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "production"
                    })];
                case 1:
                    _c = _x.sent(), client = _c.client, companyId = _c.companyId;
                    jobId = params.jobId;
                    if (!jobId)
                        throw new Error("Could not find jobId");
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    search = searchParams.get("search");
                    _d = (0, query_1.getGenericQueryFilters)(searchParams), limit = _d.limit, offset = _d.offset, sorts = _d.sorts, filters = _d.filters;
                    return [4 /*yield*/, (0, production_1.getJobOperationsList)(client, jobId)];
                case 2:
                    operations = _x.sent();
                    if (!operations.error) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [(_m = (0, path_1.requestReferrer)(request)) !== null && _m !== void 0 ? _m : path_1.path.to.job(jobId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(operations.error, "Failed to fetch job operations"))];
                case 3: throw _e.apply(void 0, _f.concat([_x.sent()]));
                case 4:
                    if (((_o = operations.data) === null || _o === void 0 ? void 0 : _o.length) === 0) {
                        return [2 /*return*/, {
                                count: 0,
                                events: [],
                                operations: [],
                                scrapReasons: []
                            }];
                    }
                    operationIds = (_q = (_p = operations.data) === null || _p === void 0 ? void 0 : _p.map(function (o) { return o.id; })) !== null && _q !== void 0 ? _q : [];
                    listQueryArgs = { search: search, sorts: sorts, filters: filters };
                    return [4 /*yield*/, Promise.all([
                            (0, production_1.getProductionQuantities)(client, operationIds, __assign(__assign({}, listQueryArgs), { filters: (0, unifiedQuantityFeeds_1.partitionQuantityListFilters)(filters, "employee") })),
                            (0, production_1.getJobOperationSupplierQuantities)(client, operationIds, companyId, __assign(__assign({}, listQueryArgs), { filters: (0, unifiedQuantityFeeds_1.partitionQuantityListFilters)(filters, "supplier") })),
                            (0, production_1.getScrapReasons)(client, companyId)
                        ])];
                case 5:
                    _g = _x.sent(), employeeQuantities = _g[0], supplierQuantities = _g[1], scrapReasons = _g[2];
                    if (!employeeQuantities.error) return [3 /*break*/, 7];
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.productionDashboard];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(employeeQuantities.error, "Failed to fetch job events"))];
                case 6: throw _h.apply(void 0, _j.concat([_x.sent()]));
                case 7:
                    if (!supplierQuantities.error) return [3 /*break*/, 9];
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.productionDashboard];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(supplierQuantities.error, "Failed to fetch supplier quantities"))];
                case 8: throw _k.apply(void 0, _l.concat([_x.sent()]));
                case 9:
                    merged = (0, unifiedQuantityFeeds_1.mergeProductionQuantityListItems)((_r = employeeQuantities.data) !== null && _r !== void 0 ? _r : [], (_s = supplierQuantities.data) !== null && _s !== void 0 ? _s : [], sorts);
                    return [2 /*return*/, {
                            count: ((_t = employeeQuantities.count) !== null && _t !== void 0 ? _t : 0) + ((_u = supplierQuantities.count) !== null && _u !== void 0 ? _u : 0),
                            events: merged.slice(offset, offset + limit),
                            operations: (_v = operations.data) !== null && _v !== void 0 ? _v : [],
                            scrapReasons: (_w = scrapReasons.data) !== null && _w !== void 0 ? _w : []
                        }];
            }
        });
    });
}
function ProductionQuantitiesRoute() {
    var _a = (0, react_router_1.useLoaderData)(), count = _a.count, events = _a.events, operations = _a.operations, scrapReasons = _a.scrapReasons;
    var setIsExplorerCollapsed = (0, Layout_1.usePanels)().setIsExplorerCollapsed;
    (0, react_1.useMount)(function () {
        setIsExplorerCollapsed(true);
    });
    return (<>
      <react_1.VStack spacing={0} className="h-[calc(100dvh-99px)]">
        <Jobs_1.ProductionQuantitiesTable data={events} count={count} operations={operations} scrapReasons={scrapReasons}/>
      </react_1.VStack>
    </>);
}
