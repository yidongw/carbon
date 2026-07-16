"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.default = JobMakeMethodRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Layout_1 = require("~/components/Layout");
var hooks_1 = require("~/hooks");
var production_1 = require("~/modules/production");
var Jobs_1 = require("~/modules/production/ui/Jobs");
var JobMakeMethodTools_1 = require("~/modules/production/ui/Jobs/JobMakeMethodTools");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, jobId, methodId, _d, job, makeMethod, materials, operations, tags, _e, _f, _g, _h, _j, _k, _l, _m;
        var _o, _p, _q, _r, _s;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "production",
                        bypassRls: true
                    })];
                case 1:
                    _c = _t.sent(), client = _c.client, companyId = _c.companyId;
                    jobId = params.jobId, methodId = params.methodId;
                    if (!jobId)
                        throw new Error("Could not find jobId");
                    if (!methodId)
                        throw new Error("Could not find methodId");
                    return [4 /*yield*/, Promise.all([
                            (0, production_1.getJob)(client, jobId),
                            (0, production_1.getJobMakeMethodById)(client, methodId, companyId),
                            (0, production_1.getJobMaterialsByMethodId)(client, methodId),
                            (0, production_1.getJobOperationsByMethodId)(client, methodId),
                            (0, shared_1.getTagsList)(client, companyId, "operation")
                        ])];
                case 2:
                    _d = _t.sent(), job = _d[0], makeMethod = _d[1], materials = _d[2], operations = _d[3], tags = _d[4];
                    if (!job.error) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.jobs];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(materials.error, "Failed to load job"))];
                case 3: throw _e.apply(void 0, _f.concat([_t.sent()]));
                case 4:
                    if (!makeMethod.error) return [3 /*break*/, 6];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.job(jobId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(makeMethod.error, "Failed to load job make method"))];
                case 5: throw _g.apply(void 0, _h.concat([_t.sent()]));
                case 6:
                    if (!materials.error) return [3 /*break*/, 8];
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.job(jobId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(materials.error, "Failed to load job materials"))];
                case 7: throw _j.apply(void 0, _k.concat([_t.sent()]));
                case 8:
                    if (!operations.error) return [3 /*break*/, 10];
                    _l = react_router_1.redirect;
                    _m = [path_1.path.to.job(jobId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(operations.error, "Failed to load job operations"))];
                case 9: throw _l.apply(void 0, _m.concat([_t.sent()]));
                case 10: return [2 /*return*/, {
                        job: job.data,
                        materials: (_o = materials === null || materials === void 0 ? void 0 : materials.data.map(function (m) {
                            var _a, _b;
                            return (__assign(__assign({}, m), { itemType: m.itemType, unitOfMeasureCode: (_a = m.unitOfMeasureCode) !== null && _a !== void 0 ? _a : "", jobOperationId: (_b = m.jobOperationId) !== null && _b !== void 0 ? _b : undefined }));
                        })) !== null && _o !== void 0 ? _o : [],
                        operations: (_q = (_p = operations.data) === null || _p === void 0 ? void 0 : _p.map(function (o) {
                            var _a, _b, _c, _d, _e, _f;
                            return (__assign(__assign({}, o), { description: (_a = o.description) !== null && _a !== void 0 ? _a : "", workCenterId: (_b = o.workCenterId) !== null && _b !== void 0 ? _b : undefined, laborRate: (_c = o.laborRate) !== null && _c !== void 0 ? _c : 0, machineRate: (_d = o.machineRate) !== null && _d !== void 0 ? _d : 0, operationSupplierProcessId: (_e = o.operationSupplierProcessId) !== null && _e !== void 0 ? _e : undefined, jobMakeMethodId: (_f = o.jobMakeMethodId) !== null && _f !== void 0 ? _f : methodId, workInstruction: o.workInstruction }));
                        })) !== null && _q !== void 0 ? _q : [],
                        makeMethod: makeMethod.data,
                        productionData: (0, production_1.getProductionDataByOperations)(client, (_r = operations === null || operations === void 0 ? void 0 : operations.data) === null || _r === void 0 ? void 0 : _r.map(function (o) { return o.id; })),
                        files: (0, production_1.getPartDocuments)(client, companyId, makeMethod.data),
                        model: (0, shared_1.getModelByItemId)(client, makeMethod.data.itemId),
                        tags: (_s = tags.data) !== null && _s !== void 0 ? _s : []
                    }];
            }
        });
    });
}
function JobMakeMethodRoute() {
    var _a, _b, _c;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var _d = (0, react_router_1.useParams)(), methodId = _d.methodId, jobId = _d.jobId;
    if (!methodId)
        throw new Error("Could not find methodId");
    if (!jobId)
        throw new Error("Could not find jobId");
    var loaderData = (0, react_router_1.useLoaderData)();
    var job = loaderData.job, makeMethod = loaderData.makeMethod, materials = loaderData.materials, operations = loaderData.operations, productionData = loaderData.productionData, tags = loaderData.tags, files = loaderData.files;
    var _e = (0, Layout_1.usePanels)(), setIsExplorerCollapsed = _e.setIsExplorerCollapsed, isExplorerCollapsed = _e.isExplorerCollapsed;
    (0, react_1.useMount)(function () {
        if (isExplorerCollapsed) {
            setIsExplorerCollapsed(false);
        }
    });
    return (<div className="h-[calc(100dvh-49px)] w-full items-start overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent">
      <react_1.VStack spacing={2} className="p-2">
        <JobMakeMethodTools_1.default makeMethod={makeMethod}/>

        <Jobs_1.JobBillOfMaterial key={"bom:".concat(methodId)} jobMakeMethodId={methodId} 
    // @ts-expect-error TS2322 - TODO: fix type
    materials={materials} 
    // @ts-expect-error
    operations={operations}/>
        <Jobs_1.JobBillOfProcess key={"bop:".concat(methodId)} jobMakeMethodId={methodId} materials={materials} 
    // @ts-expect-error
    operations={operations} locationId={(_a = job.locationId) !== null && _a !== void 0 ? _a : ""} tags={tags} itemId={makeMethod.itemId} salesOrderLineId={(_b = job.salesOrderLineId) !== null && _b !== void 0 ? _b : ""} customerId={(_c = job.customerId) !== null && _c !== void 0 ? _c : ""}/>
        <react_2.Suspense fallback={<div className="flex w-full h-full rounded bg-gradient-to-tr from-background to-card items-center justify-center min-h-[200px]">
              <react_1.Spinner className="h-10 w-10"/>
            </div>}>
          <react_router_1.Await resolve={productionData}>
            {function (resolvedProductionData) { return (<Jobs_1.JobEstimatesVsActuals materials={materials !== null && materials !== void 0 ? materials : []} 
        // @ts-expect-error
        operations={operations} productionEvents={resolvedProductionData.events} productionQuantities={resolvedProductionData.quantities} notes={resolvedProductionData.notes}/>); }}
          </react_router_1.Await>
        </react_2.Suspense>
        <components_1.DeferredFiles resolve={files}>
          {function (files) { return (<Jobs_1.JobDocuments files={files} jobId={jobId} bucket="parts" itemId={makeMethod.itemId} modelUpload={__assign({}, job)}/>); }}
        </components_1.DeferredFiles>
        <react_2.Suspense fallback={null}>
          <react_router_1.Await resolve={loaderData.model}>
            {function (model) {
            var _a, _b;
            return (<components_1.CadModel key={"cad:".concat(model.itemId)} isReadOnly={!permissions.can("update", "sales")} metadata={{
                    itemId: (_a = model === null || model === void 0 ? void 0 : model.itemId) !== null && _a !== void 0 ? _a : undefined
                }} modelPath={(_b = model === null || model === void 0 ? void 0 : model.modelPath) !== null && _b !== void 0 ? _b : null} title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["CAD Model"], ["CAD Model"])))} uploadClassName="aspect-square min-h-[420px] max-h-[70vh]" viewerClassName="aspect-square min-h-[420px] max-h-[70vh]"/>);
        }}
          </react_router_1.Await>
        </react_2.Suspense>
      </react_1.VStack>
    </div>);
}
var templateObject_1;
