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
exports.default = BundleWorkOrderLayoutRoute;
var auth_server_1 = require("@carbon/auth/auth.server");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var Layout_1 = require("~/components/Layout");
var production_1 = require("~/modules/production");
var Jobs_1 = require("~/modules/production/ui/Jobs");
var BundleWorkOrderHeader_1 = require("~/modules/production/ui/MasterWorkOrders/BundleWorkOrderHeader");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Bundle Work Orders"], ["Bundle Work Orders"]))),
    to: path_1.path.to.bundleWorkOrders,
    module: "production"
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, bundleWorkOrderId, bundleWorkOrder, jobId, _d, job, tags;
        var _e, _f, _g;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "production",
                        role: "employee"
                    })];
                case 1:
                    _c = _h.sent(), client = _c.client, companyId = _c.companyId;
                    bundleWorkOrderId = params.bundleWorkOrderId;
                    if (!bundleWorkOrderId)
                        throw new Error("Could not find bundleWorkOrderId");
                    return [4 /*yield*/, (0, production_1.getBundleWorkOrder)(client, bundleWorkOrderId, companyId)];
                case 2:
                    bundleWorkOrder = _h.sent();
                    if (bundleWorkOrder.error || !bundleWorkOrder.data) {
                        throw (0, react_router_1.redirect)(path_1.path.to.bundleWorkOrders);
                    }
                    jobId = (_e = bundleWorkOrder.data.jobId) !== null && _e !== void 0 ? _e : "";
                    return [4 /*yield*/, Promise.all([
                            jobId ? (0, production_1.getJob)(client, jobId) : null,
                            (0, shared_1.getTagsList)(client, companyId, "job")
                        ])];
                case 3:
                    _d = _h.sent(), job = _d[0], tags = _d[1];
                    return [2 /*return*/, {
                            bundleWorkOrder: bundleWorkOrder.data,
                            jobId: jobId,
                            job: (_f = job === null || job === void 0 ? void 0 : job.data) !== null && _f !== void 0 ? _f : null,
                            tags: (_g = tags.data) !== null && _g !== void 0 ? _g : [],
                            trackedEntities: jobId ? (0, production_1.getTrackedEntitiesByJobId)(client, jobId) : undefined
                        }];
            }
        });
    });
}
function BundleField(_a) {
    var label = _a.label, value = _a.value;
    return (<div className="flex flex-col gap-0.5 w-full">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value || "—"}</span>
    </div>);
}
function BundleWorkOrderLayoutRoute() {
    var _a = (0, react_router_1.useLoaderData)(), bundleWorkOrder = _a.bundleWorkOrder, jobId = _a.jobId, job = _a.job, tags = _a.tags, trackedEntities = _a.trackedEntities;
    var t = (0, macro_2.useLingui)().t;
    return (<Layout_1.PanelProvider>
      <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full">
        <BundleWorkOrderHeader_1.default />
        <div className="flex h-[calc(100dvh-99px)] overflow-hidden w-full">
          <div className="flex flex-1 min-h-0 h-full overflow-hidden">
            <Layout_1.ResizablePanels content={<react_router_1.Outlet />} properties={job ? (<Jobs_1.JobProperties jobId={jobId} validItemTypes={["Part", "Tool", "Style"]} readOnlyItem extraProperties={<>
                        <BundleField label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Color"], ["Color"])))} value={bundleWorkOrder.colorName ||
                    bundleWorkOrder.colorCode}/>
                        <BundleField label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Size"], ["Size"])))} value={bundleWorkOrder.sizeCode}/>
                      </>} routeData={{
                // biome-ignore lint/suspicious/noExplicitAny: job view -> Job
                job: job,
                tags: tags,
                // biome-ignore lint/suspicious/noExplicitAny: deferred
                trackedEntities: trackedEntities
            }}/>) : null}/>
          </div>
        </div>
      </div>
    </Layout_1.PanelProvider>);
}
var templateObject_1, templateObject_2, templateObject_3;
