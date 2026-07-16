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
exports.handle = void 0;
exports.loader = loader;
exports.default = DepreciationRunsRoute;
var auth_server_1 = require("@carbon/auth/auth.server");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var accounting_1 = require("~/modules/accounting");
var accounting_utils_1 = require("~/modules/accounting/accounting.utils");
var FixedAssets_1 = require("~/modules/accounting/ui/FixedAssets");
var path_1 = require("~/utils/path");
var query_1 = require("~/utils/query");
exports.handle = {
    breadcrumb: "Depreciation",
    to: path_1.path.to.depreciationRuns
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, url, searchParams, search, _d, limit, offset, sorts, filters, _e, runs, lastRun, lastRunData, nextPeriodEnd, hasDraftBlocking;
        var _f, _g, _h;
        var request = _b.request;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "accounting",
                        role: "employee"
                    })];
                case 1:
                    _c = _j.sent(), client = _c.client, companyId = _c.companyId;
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    search = searchParams.get("search");
                    _d = (0, query_1.getGenericQueryFilters)(searchParams), limit = _d.limit, offset = _d.offset, sorts = _d.sorts, filters = _d.filters;
                    return [4 /*yield*/, Promise.all([
                            (0, accounting_1.getDepreciationRuns)(client, companyId, {
                                search: search,
                                limit: limit,
                                offset: offset,
                                sorts: sorts,
                                filters: filters
                            }),
                            client
                                .from("depreciationRun")
                                .select("periodEnd, status")
                                .eq("companyId", companyId)
                                .order("periodEnd", { ascending: false })
                                .limit(1)
                        ])];
                case 2:
                    _e = _j.sent(), runs = _e[0], lastRun = _e[1];
                    lastRunData = lastRun.data && lastRun.data.length > 0 ? lastRun.data[0] : null;
                    nextPeriodEnd = (0, accounting_utils_1.getNextPeriodEnd)((_f = lastRunData === null || lastRunData === void 0 ? void 0 : lastRunData.periodEnd) !== null && _f !== void 0 ? _f : null);
                    hasDraftBlocking = (lastRunData === null || lastRunData === void 0 ? void 0 : lastRunData.status) === "Draft";
                    return [2 /*return*/, {
                            data: (_g = runs.data) !== null && _g !== void 0 ? _g : [],
                            count: (_h = runs.count) !== null && _h !== void 0 ? _h : 0,
                            nextPeriodEnd: nextPeriodEnd,
                            hasDraftBlocking: hasDraftBlocking
                        }];
            }
        });
    });
}
function DepreciationRunsRoute() {
    var _a = (0, react_router_1.useLoaderData)(), data = _a.data, count = _a.count, nextPeriodEnd = _a.nextPeriodEnd, hasDraftBlocking = _a.hasDraftBlocking;
    var permissions = (0, hooks_1.usePermissions)();
    var navigate = (0, react_router_1.useNavigate)();
    var confirmModal = (0, react_1.useDisclosure)();
    var canCreate = permissions.can("create", "accounting") && !hasDraftBlocking;
    return (<react_1.VStack spacing={0} className="h-full">
      <FixedAssets_1.DepreciationRunTable data={data} count={count} primaryAction={permissions.can("create", "accounting") && (<react_1.TooltipProvider>
              <react_1.Tooltip>
                <react_1.TooltipTrigger asChild>
                  <span>
                    <react_1.Button leftIcon={<lu_1.LuCirclePlus />} variant="primary" onClick={confirmModal.onOpen} isDisabled={!canCreate}>
                      Run Next Period
                    </react_1.Button>
                  </span>
                </react_1.TooltipTrigger>
                {hasDraftBlocking && (<react_1.TooltipContent>
                    A draft run must be posted or deleted first.
                  </react_1.TooltipContent>)}
              </react_1.Tooltip>
            </react_1.TooltipProvider>)}/>

      <Modals_1.Confirm action={path_1.path.to.newDepreciationRun} isOpen={confirmModal.isOpen} title="Run Next Period" text={"This will create a draft depreciation run for the period ending ".concat((0, utils_1.formatDate)(nextPeriodEnd), ". All active assets will be calculated automatically.")} confirmText="Create Run" onCancel={confirmModal.onClose} onSubmit={function () {
            confirmModal.onClose();
            navigate(path_1.path.to.depreciationRuns);
        }}/>
    </react_1.VStack>);
}
