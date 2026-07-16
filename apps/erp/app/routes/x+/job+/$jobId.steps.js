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
exports.loader = loader;
exports.default = JobOperationStepRecordsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var react_router_1 = require("react-router");
var Layout_1 = require("~/components/Layout");
var production_1 = require("~/modules/production");
var Jobs_1 = require("~/modules/production/ui/Jobs");
var path_1 = require("~/utils/path");
var query_1 = require("~/utils/query");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, jobId, url, searchParams, search, _c, limit, offset, sorts, filters, stepRecords, _d, _e;
        var _f, _g;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "production",
                        role: "employee"
                    })];
                case 1:
                    client = (_h.sent()).client;
                    jobId = params.jobId;
                    if (!jobId)
                        throw new Error("Could not find jobId");
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    search = searchParams.get("search");
                    _c = (0, query_1.getGenericQueryFilters)(searchParams), limit = _c.limit, offset = _c.offset, sorts = _c.sorts, filters = _c.filters;
                    return [4 /*yield*/, (0, production_1.getJobOperationStepRecords)(client, jobId, {
                            limit: limit,
                            offset: offset,
                            sorts: sorts,
                            filters: filters,
                            search: search
                        })];
                case 2:
                    stepRecords = _h.sent();
                    if (!stepRecords.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.productionDashboard];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(stepRecords.error, "Failed to fetch job operation step records"))];
                case 3:
                    _d.apply(void 0, _e.concat([_h.sent()]));
                    _h.label = 4;
                case 4: return [2 /*return*/, {
                        count: (_f = stepRecords.count) !== null && _f !== void 0 ? _f : 0,
                        stepRecords: (_g = stepRecords.data) !== null && _g !== void 0 ? _g : []
                    }];
            }
        });
    });
}
function JobOperationStepRecordsRoute() {
    var _a = (0, react_router_1.useLoaderData)(), count = _a.count, stepRecords = _a.stepRecords;
    var setIsExplorerCollapsed = (0, Layout_1.usePanels)().setIsExplorerCollapsed;
    (0, react_1.useMount)(function () {
        setIsExplorerCollapsed(true);
    });
    return (<react_1.VStack spacing={0} className="h-[calc(100dvh-99px)]">
      {/* @ts-expect-error TS2322 */}
      <Jobs_1.JobOperationStepRecordsTable data={stepRecords} count={count}/>
    </react_1.VStack>);
}
