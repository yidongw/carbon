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
exports.default = JobRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var react_1 = require("react");
var react_router_1 = require("react-router");
var Layout_1 = require("~/components/Layout");
var Skeletons_1 = require("~/components/Skeletons");
var TreeView_1 = require("~/components/TreeView");
var items_1 = require("~/modules/items");
var production_1 = require("~/modules/production");
var Jobs_1 = require("~/modules/production/ui/Jobs");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Jobs"], ["Jobs"]))),
    to: path_1.path.to.jobs,
    module: "production"
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, jobId, _d, job, tags, _e, _f;
        var _g, _h;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "production",
                        bypassRls: true
                    })];
                case 1:
                    _c = _j.sent(), client = _c.client, companyId = _c.companyId;
                    jobId = params.jobId;
                    if (!jobId)
                        throw new Error("Could not find jobId");
                    return [4 /*yield*/, Promise.all([
                            (0, production_1.getJob)(client, jobId),
                            (0, shared_1.getTagsList)(client, companyId, "job")
                        ])];
                case 2:
                    _d = _j.sent(), job = _d[0], tags = _d[1];
                    if (companyId !== ((_g = job.data) === null || _g === void 0 ? void 0 : _g.companyId)) {
                        throw (0, react_router_1.redirect)(path_1.path.to.jobs);
                    }
                    if (!job.error) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.jobs];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(job.error, "Failed to load job"))];
                case 3: throw _e.apply(void 0, _f.concat([_j.sent()]));
                case 4: return [2 /*return*/, {
                        job: job.data,
                        tags: (_h = tags.data) !== null && _h !== void 0 ? _h : [],
                        files: (0, production_1.getJobDocuments)(client, companyId, job.data),
                        trackedEntities: (0, production_1.getTrackedEntitiesByJobId)(client, jobId),
                        method: (0, production_1.getJobMethodTree)(client, jobId), // returns a promise
                        configurationParameters: (0, items_1.getConfigurationParameters)(client, job.data.itemId, companyId)
                    }];
            }
        });
    });
}
function JobRoute() {
    var params = (0, react_router_1.useParams)();
    var jobId = params.jobId;
    if (!jobId)
        throw new Error("Could not find jobId");
    var method = (0, react_router_1.useLoaderData)().method;
    return (<Layout_1.PanelProvider>
      <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full">
        <Jobs_1.JobHeader />
        <div className="flex h-[calc(100dvh-99px)] overflow-hidden w-full">
          <div className="flex flex-1 min-h-0 h-full overflow-hidden">
            <Layout_1.ResizablePanels explorer={<div className="w-full h-full p-2">
                  <react_1.Suspense fallback={<Skeletons_1.ExplorerSkeleton />}>
                    <react_router_1.Await resolve={method} errorElement={<div className="p-2 text-red-500">
                          <macro_2.Trans>Error loading job tree.</macro_2.Trans>
                        </div>}>
                      {function (resolvedMethod) {
                var _a;
                return (<JobBoMExplorerWrapper method={(_a = resolvedMethod.data) !== null && _a !== void 0 ? _a : []}/>);
            }}
                    </react_router_1.Await>
                  </react_1.Suspense>
                </div>} content={<div className="h-full min-h-0 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent w-full">
                  <react_router_1.Outlet />
                </div>} properties={<Jobs_1.JobProperties key={jobId}/>}/>
          </div>
        </div>
      </div>
    </Layout_1.PanelProvider>);
}
function JobBoMExplorerWrapper(_a) {
    var method = _a.method;
    var memoizedMethod = (0, react_1.useMemo)(function () { return (method && method.length > 0 ? (0, TreeView_1.flattenTree)(method[0]) : []); }, [method]);
    return <Jobs_1.JobBoMExplorer method={memoizedMethod}/>;
}
var templateObject_1;
