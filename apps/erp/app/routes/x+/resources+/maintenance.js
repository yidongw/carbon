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
exports.default = MaintenanceRoute;
var auth_server_1 = require("@carbon/auth/auth.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var resources_1 = require("~/modules/resources");
var MaintenanceDispatchesTable_1 = require("~/modules/resources/ui/Maintenance/MaintenanceDispatchesTable");
var path_1 = require("~/utils/path");
var query_1 = require("~/utils/query");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Maintenance"], ["Maintenance"]))),
    to: path_1.path.to.maintenanceDispatches
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, url, searchParams, search, status, locationId, _d, limit, offset, sorts, filters, locations, locationsList, selectedLocationId, _e, dispatches, failureModes;
        var _f, _g, _h, _j, _k, _l;
        var request = _b.request;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "resources",
                        role: "employee"
                    })];
                case 1:
                    _c = _m.sent(), client = _c.client, companyId = _c.companyId;
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    search = searchParams.get("search");
                    status = (_f = searchParams.get("status")) !== null && _f !== void 0 ? _f : undefined;
                    locationId = searchParams.get("location");
                    _d = (0, query_1.getGenericQueryFilters)(searchParams), limit = _d.limit, offset = _d.offset, sorts = _d.sorts, filters = _d.filters;
                    return [4 /*yield*/, (0, resources_1.getLocationsList)(client, companyId)];
                case 2:
                    locations = _m.sent();
                    locationsList = (_g = locations.data) !== null && _g !== void 0 ? _g : [];
                    selectedLocationId = locationId !== null && locationId !== void 0 ? locationId : (_h = locationsList[0]) === null || _h === void 0 ? void 0 : _h.id;
                    if (!selectedLocationId) {
                        return [2 /*return*/, {
                                dispatches: [],
                                count: 0,
                                failureModes: [],
                                locations: locationsList,
                                locationId: null
                            }];
                    }
                    return [4 /*yield*/, Promise.all([
                            (0, resources_1.getMaintenanceDispatchesByLocation)(client, companyId, selectedLocationId, {
                                search: search,
                                status: status,
                                limit: limit,
                                offset: offset,
                                sorts: sorts,
                                filters: filters
                            }),
                            (0, resources_1.getFailureModesList)(client, companyId)
                        ])];
                case 3:
                    _e = _m.sent(), dispatches = _e[0], failureModes = _e[1];
                    return [2 /*return*/, {
                            dispatches: (_j = dispatches.data) !== null && _j !== void 0 ? _j : [],
                            count: (_k = dispatches.count) !== null && _k !== void 0 ? _k : 0,
                            failureModes: (_l = failureModes.data) !== null && _l !== void 0 ? _l : [],
                            locations: locationsList,
                            locationId: selectedLocationId
                        }];
            }
        });
    });
}
function MaintenanceRoute() {
    var _a = (0, react_router_1.useLoaderData)(), dispatches = _a.dispatches, count = _a.count, failureModes = _a.failureModes, locations = _a.locations, locationId = _a.locationId;
    return (<react_1.VStack spacing={0} className="h-full">
      <MaintenanceDispatchesTable_1.default 
    // @ts-expect-error TS2322 - TODO: fix type
    data={dispatches !== null && dispatches !== void 0 ? dispatches : []} count={count !== null && count !== void 0 ? count : 0} failureModes={failureModes !== null && failureModes !== void 0 ? failureModes : []} locations={locations} locationId={locationId}/>
      <react_router_1.Outlet />
    </react_1.VStack>);
}
var templateObject_1;
