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
exports.loader = loader;
exports.default = BundleWorkOrderProcessesRoute;
var auth_server_1 = require("@carbon/auth/auth.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var production_1 = require("~/modules/production");
var Jobs_1 = require("~/modules/production/ui/Jobs");
var path_1 = require("~/utils/path");
var query_1 = require("~/utils/query");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, bundleWorkOrderId, bundleWorkOrder, jobId, searchParams, _d, limit, offset, sorts, filters, operations;
        var _e, _f, _g, _h;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "production",
                        role: "employee"
                    })];
                case 1:
                    _c = _j.sent(), client = _c.client, companyId = _c.companyId;
                    bundleWorkOrderId = params.bundleWorkOrderId;
                    if (!bundleWorkOrderId)
                        throw new Error("Could not find bundleWorkOrderId");
                    return [4 /*yield*/, (0, production_1.getBundleWorkOrder)(client, bundleWorkOrderId, companyId)];
                case 2:
                    bundleWorkOrder = _j.sent();
                    if (bundleWorkOrder.error || !((_e = bundleWorkOrder.data) === null || _e === void 0 ? void 0 : _e.jobId)) {
                        throw (0, react_router_1.redirect)(path_1.path.to.bundleWorkOrders);
                    }
                    jobId = bundleWorkOrder.data.jobId;
                    searchParams = new URLSearchParams(new URL(request.url).search);
                    _d = (0, query_1.getGenericQueryFilters)(searchParams), limit = _d.limit, offset = _d.offset, sorts = _d.sorts, filters = _d.filters;
                    return [4 /*yield*/, (0, production_1.getJobOperations)(client, jobId, {
                            search: searchParams.get("search"),
                            limit: limit,
                            offset: offset,
                            sorts: sorts,
                            filters: filters
                        })];
                case 3:
                    operations = _j.sent();
                    return [2 /*return*/, {
                            operations: (_f = operations.data) !== null && _f !== void 0 ? _f : [],
                            count: (_g = operations.count) !== null && _g !== void 0 ? _g : 0,
                            jobId: jobId,
                            jobStatus: (_h = bundleWorkOrder.data.status) !== null && _h !== void 0 ? _h : ""
                        }];
            }
        });
    });
}
function BundleWorkOrderProcessesRoute() {
    var _a = (0, react_router_1.useLoaderData)(), operations = _a.operations, count = _a.count, jobId = _a.jobId, jobStatus = _a.jobStatus;
    var bundleWorkOrderId = (0, react_router_1.useParams)().bundleWorkOrderId;
    var t = (0, macro_1.useLingui)().t;
    return (<react_1.VStack spacing={0} className="h-[calc(100dvh-99px)]">
      <Jobs_1.JobOperationsTable data={operations} count={count} jobId={jobId} isPaused={jobStatus === "Paused"} title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Processes"], ["Processes"])))} disableNavigation disableInlineEditing hideMes showAssignee quantitiesPath={bundleWorkOrderId
            ? path_1.path.to.bundleWorkOrderQuantities(bundleWorkOrderId)
            : undefined}/>
    </react_1.VStack>);
}
var templateObject_1;
