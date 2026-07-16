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
exports.handle = exports.links = void 0;
exports.loader = loader;
exports.default = TraceabilityRoute;
var auth_server_1 = require("@carbon/auth/auth.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var responsive_1 = require("@visx/responsive");
var react_2 = require("@xyflow/react");
var style_css_url_1 = require("@xyflow/react/dist/style.css?url");
var react_3 = require("react");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var lineage_server_1 = require("~/modules/inventory/lineage.server");
var constants_1 = require("~/modules/inventory/ui/Traceability/constants");
var TraceabilityGraph_1 = require("~/modules/inventory/ui/Traceability/TraceabilityGraph");
var TraceabilitySidebar_1 = require("~/modules/inventory/ui/Traceability/TraceabilitySidebar");
var path_1 = require("~/utils/path");
var links = function () { return [
    { rel: "stylesheet", href: style_css_url_1.default }
]; };
exports.links = links;
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Traceability"], ["Traceability"]))),
    to: path_1.path.to.traceability,
    module: "inventory"
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, url, trackedEntityId, trackedActivityId, jobId, depthParam, depth, payload, rootEntity, associatedJobId, jobPayload, jobReadableId, containments_1, jobReadableId, payload, _c, _d, activity, directInputs, directOutputs, directEntityIds, directEntities, _e, additionalInputs, additionalOutputs, additionalActivityIds, additionalActivities, allEntities, allActivities, containments;
        var _f, _g, _h, _j, _k;
        var request = _b.request;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "inventory",
                        bypassRls: true
                    })];
                case 1:
                    client = (_l.sent()).client;
                    url = new URL(request.url);
                    trackedEntityId = url.searchParams.get("trackedEntityId");
                    trackedActivityId = url.searchParams.get("trackedActivityId");
                    jobId = url.searchParams.get("jobId");
                    depthParam = url.searchParams.get("depth");
                    depth = (0, constants_1.clampDepth)(Number(depthParam) || 1);
                    if (!trackedEntityId && !trackedActivityId && !jobId) {
                        throw (0, react_router_1.redirect)(path_1.path.to.traceability);
                    }
                    if (!trackedEntityId) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, lineage_server_1.fetchLineageSubgraph)(client, trackedEntityId, depth, "both")];
                case 2:
                    payload = _l.sent();
                    rootEntity = payload.entities.find(function (e) { return e.id === trackedEntityId; });
                    associatedJobId = jobId !== null && jobId !== void 0 ? jobId : getEntityJobId(rootEntity);
                    if (!associatedJobId) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, lineage_server_1.fetchJobScopedLineage)(client, associatedJobId, depth)];
                case 3:
                    jobPayload = _l.sent();
                    return [4 /*yield*/, getJobReadableId(client, associatedJobId)];
                case 4:
                    jobReadableId = _l.sent();
                    payload = mergeLineagePayloads(payload, withJobNode(jobPayload, associatedJobId, jobReadableId));
                    _l.label = 5;
                case 5: return [4 /*yield*/, (0, lineage_server_1.fetchContainmentsForEntities)(client, payload.entities.map(function (e) { return e.id; }))];
                case 6:
                    containments_1 = _l.sent();
                    return [2 /*return*/, __assign(__assign({}, payload), { containments: containments_1, rootId: trackedEntityId, rootType: "entity", depth: depth })];
                case 7:
                    if (!jobId) return [3 /*break*/, 10];
                    return [4 /*yield*/, getJobReadableId(client, jobId)];
                case 8:
                    jobReadableId = _l.sent();
                    _c = withJobNode;
                    return [4 /*yield*/, (0, lineage_server_1.fetchJobScopedLineage)(client, jobId, depth)];
                case 9:
                    payload = _c.apply(void 0, [_l.sent(), jobId,
                        jobReadableId]);
                    return [2 /*return*/, __assign(__assign({}, payload), { rootId: jobId, rootType: "job", depth: depth })];
                case 10: return [4 /*yield*/, Promise.all([
                        client.from("trackedActivity").select("*").eq("id", trackedActivityId),
                        client
                            .from("trackedActivityInput")
                            .select("*")
                            .eq("trackedActivityId", trackedActivityId),
                        client
                            .from("trackedActivityOutput")
                            .select("*")
                            .eq("trackedActivityId", trackedActivityId)
                    ])];
                case 11:
                    _d = _l.sent(), activity = _d[0], directInputs = _d[1], directOutputs = _d[2];
                    directEntityIds = Array.from(new Set(__spreadArray(__spreadArray([], (((_f = directInputs === null || directInputs === void 0 ? void 0 : directInputs.data) === null || _f === void 0 ? void 0 : _f.map(function (input) { return input.trackedEntityId; })) || []), true), (((_g = directOutputs === null || directOutputs === void 0 ? void 0 : directOutputs.data) === null || _g === void 0 ? void 0 : _g.map(function (output) { return output.trackedEntityId; })) || []), true)));
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .select("*")
                            .in("id", directEntityIds)];
                case 12:
                    directEntities = _l.sent();
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("trackedActivityInput")
                                .select("*")
                                .in("trackedEntityId", directEntityIds)
                                .neq("trackedActivityId", trackedActivityId),
                            client
                                .from("trackedActivityOutput")
                                .select("*")
                                .in("trackedEntityId", directEntityIds)
                                .neq("trackedActivityId", trackedActivityId)
                        ])];
                case 13:
                    _e = _l.sent(), additionalInputs = _e[0], additionalOutputs = _e[1];
                    additionalActivityIds = Array.from(new Set(__spreadArray(__spreadArray([], (((_h = additionalInputs === null || additionalInputs === void 0 ? void 0 : additionalInputs.data) === null || _h === void 0 ? void 0 : _h.map(function (input) { return input.trackedActivityId; })) ||
                        []), true), (((_j = additionalOutputs === null || additionalOutputs === void 0 ? void 0 : additionalOutputs.data) === null || _j === void 0 ? void 0 : _j.map(function (output) { return output.trackedActivityId; })) ||
                        []), true)));
                    return [4 /*yield*/, client
                            .from("trackedActivity")
                            .select("*")
                            .in("id", additionalActivityIds)];
                case 14:
                    additionalActivities = _l.sent();
                    allEntities = ((_k = directEntities === null || directEntities === void 0 ? void 0 : directEntities.data) !== null && _k !== void 0 ? _k : []);
                    allActivities = __spreadArray(__spreadArray([], ((activity === null || activity === void 0 ? void 0 : activity.data) || []), true), ((additionalActivities === null || additionalActivities === void 0 ? void 0 : additionalActivities.data) || []), true);
                    return [4 /*yield*/, (0, lineage_server_1.fetchContainmentsForEntities)(client, allEntities.map(function (e) { return e.id; }))];
                case 15:
                    containments = _l.sent();
                    return [2 /*return*/, {
                            entities: allEntities,
                            inputs: __spreadArray(__spreadArray([], ((directInputs === null || directInputs === void 0 ? void 0 : directInputs.data) || []), true), ((additionalInputs === null || additionalInputs === void 0 ? void 0 : additionalInputs.data) || []), true),
                            outputs: __spreadArray(__spreadArray([], ((directOutputs === null || directOutputs === void 0 ? void 0 : directOutputs.data) || []), true), ((additionalOutputs === null || additionalOutputs === void 0 ? void 0 : additionalOutputs.data) || []), true),
                            activities: allActivities,
                            containments: containments,
                            rootId: trackedActivityId,
                            rootType: "activity",
                            depth: 1
                        }];
            }
        });
    });
}
function getEntityJobId(entity) {
    var attrs = entity === null || entity === void 0 ? void 0 : entity.attributes;
    if (!attrs || typeof attrs !== "object" || Array.isArray(attrs))
        return null;
    var job = attrs.Job;
    return typeof job === "string" && job.length > 0 ? job : null;
}
function getJobReadableId(client, jobId) {
    return __awaiter(this, void 0, void 0, function () {
        var job;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client.from("job").select("jobId").eq("id", jobId).single()];
                case 1:
                    job = _c.sent();
                    return [2 /*return*/, (_b = (_a = job.data) === null || _a === void 0 ? void 0 : _a.jobId) !== null && _b !== void 0 ? _b : jobId];
            }
        });
    });
}
function withJobNode(payload, jobId, jobReadableId) {
    var jobNodeId = "job:".concat(jobId);
    var existingActivityIds = new Set(payload.activities.map(function (a) { return a.id; }));
    var existingOutputKeys = new Set(payload.outputs.map(function (o) { return "".concat(o.trackedActivityId, ":").concat(o.trackedEntityId); }));
    var jobEntities = payload.entities.filter(function (entity) {
        if (getEntityJobId(entity) !== jobId)
            return false;
        return entity.status === "Reserved" || entity.sourceDocument === "Item";
    });
    return __assign(__assign({}, payload), { activities: existingActivityIds.has(jobNodeId)
            ? payload.activities
            : __spreadArray([
                {
                    id: jobNodeId,
                    type: "Job",
                    sourceDocument: "Job",
                    sourceDocumentId: jobId,
                    sourceDocumentReadableId: jobReadableId,
                    attributes: { Job: jobId }
                }
            ], payload.activities, true), outputs: __spreadArray(__spreadArray([], payload.outputs, true), jobEntities
            .map(function (entity) { return ({
            trackedActivityId: jobNodeId,
            trackedEntityId: entity.id,
            quantity: entity.quantity
        }); })
            .filter(function (output) {
            return !existingOutputKeys.has("".concat(output.trackedActivityId, ":").concat(output.trackedEntityId));
        }), true) });
}
function mergeLineagePayloads(base, incoming) {
    var _a, _b, _c;
    var entityIds = new Set(base.entities.map(function (e) { return e.id; }));
    var activityIds = new Set(base.activities.map(function (a) { return a.id; }));
    var inputKeys = new Set(base.inputs.map(function (i) { return "".concat(i.trackedActivityId, ":").concat(i.trackedEntityId); }));
    var outputKeys = new Set(base.outputs.map(function (o) { return "".concat(o.trackedActivityId, ":").concat(o.trackedEntityId); }));
    var baseContainments = (_a = base.containments) !== null && _a !== void 0 ? _a : [];
    var incomingContainments = (_b = incoming.containments) !== null && _b !== void 0 ? _b : [];
    var containmentKeys = new Set(baseContainments.map(function (c) { return "".concat(c.id, ":").concat(c.trackedEntityId); }));
    return {
        entities: __spreadArray(__spreadArray([], base.entities, true), incoming.entities.filter(function (e) { return !entityIds.has(e.id); }), true),
        activities: __spreadArray(__spreadArray([], base.activities, true), incoming.activities.filter(function (a) { return !activityIds.has(a.id); }), true),
        inputs: __spreadArray(__spreadArray([], base.inputs, true), incoming.inputs.filter(function (i) { return !inputKeys.has("".concat(i.trackedActivityId, ":").concat(i.trackedEntityId)); }), true),
        outputs: __spreadArray(__spreadArray([], base.outputs, true), incoming.outputs.filter(function (o) { return !outputKeys.has("".concat(o.trackedActivityId, ":").concat(o.trackedEntityId)); }), true),
        stepRecords: (_c = base.stepRecords) !== null && _c !== void 0 ? _c : incoming.stepRecords,
        containments: incomingContainments.length === 0 && baseContainments.length === 0
            ? undefined
            : __spreadArray(__spreadArray([], baseContainments, true), incomingContainments.filter(function (c) { return !containmentKeys.has("".concat(c.id, ":").concat(c.trackedEntityId)); }), true)
    };
}
function TraceabilityRoute() {
    return (<react_2.ReactFlowProvider>
      <TraceabilityRouteInner />
    </react_2.ReactFlowProvider>);
}
function TraceabilityRouteInner() {
    var _a, _b, _c, _d, _e, _f, _g;
    var _h = (0, react_router_1.useLoaderData)(), entities = _h.entities, inputs = _h.inputs, outputs = _h.outputs, activities = _h.activities, containments = _h.containments, rootId = _h.rootId, rootType = _h.rootType;
    var isEmpty = (0, react_3.useMemo)(function () { return entities.length === 0 && activities.length === 0; }, [entities, activities]);
    var isHydrated = (0, react_1.useHydrated)();
    var navigation = (0, react_router_1.useNavigation)();
    // Selection lives in the React Flow store. Subscribe to the nodes ref
    // (stable until xyflow updates it) and derive ids via useMemo so the
    // returned array stays referentially stable across unrelated renders.
    var flowNodes = (0, react_2.useStore)(function (s) { return s.nodes; });
    var selectedIds = (0, react_3.useMemo)(function () {
        var ids = [];
        for (var i = 0; i < flowNodes.length; i++) {
            if (flowNodes[i].selected)
                ids.push(flowNodes[i].id);
        }
        return ids;
    }, [flowNodes]);
    var _j = (0, react_3.useState)(0), focusedIndex = _j[0], setFocusedIndex = _j[1];
    var safeIndex = selectedIds.length > 0 ? Math.min(focusedIndex, selectedIds.length - 1) : 0;
    var focusedSelectedId = (_a = selectedIds[safeIndex]) !== null && _a !== void 0 ? _a : null;
    var rootHasNode = entities.some(function (e) { return (e === null || e === void 0 ? void 0 : e.id) === rootId; }) ||
        activities.some(function (a) { return (a === null || a === void 0 ? void 0 : a.id) === rootId; });
    var fallbackSidebarId = rootHasNode
        ? rootId
        : ((_e = (_c = (_b = entities[0]) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : (_d = activities[0]) === null || _d === void 0 ? void 0 : _d.id) !== null && _e !== void 0 ? _e : rootId);
    var sidebarId = focusedSelectedId !== null && focusedSelectedId !== void 0 ? focusedSelectedId : fallbackSidebarId;
    var setNodes = (0, react_2.useReactFlow)().setNodes;
    var selectNode = (0, react_3.useCallback)(function (id) {
        setNodes(function (nodes) {
            return nodes.map(function (n) {
                var wantsSelected = id !== null && n.id === id;
                if (n.selected === wantsSelected)
                    return n;
                return __assign(__assign({}, n), { selected: wantsSelected });
            });
        });
    }, [setNodes]);
    var selectedEntity = (_f = entities.find(function (e) { return (e === null || e === void 0 ? void 0 : e.id) === sidebarId; })) !== null && _f !== void 0 ? _f : null;
    var selectedActivity = (_g = activities.find(function (a) { return (a === null || a === void 0 ? void 0 : a.id) === sidebarId; })) !== null && _g !== void 0 ? _g : null;
    return (<div className="flex bg-card h-[calc(100dvh-49px)] w-full overflow-hidden scrollbar-hide">
      <react_1.VStack className="flex-1 min-w-0 h-full" spacing={0}>
        <div className="flex flex-1 w-full h-full overflow-hidden">
          <div className="w-full h-full">
            {isEmpty ? (<components_1.Empty className="h-full w-full">
                <react_1.Button asChild>
                  <react_router_1.Link to={path_1.path.to.traceability}>
                    <macro_2.Trans>Back to traceability</macro_2.Trans>
                  </react_router_1.Link>
                </react_1.Button>
              </components_1.Empty>) : (<responsive_1.ParentSize>
                {function (_a) {
                var width = _a.width, height = _a.height;
                return (<react_1.Loading isLoading={!isHydrated || navigation.state !== "idle"}>
                    <TraceabilityGraph_1.TraceabilityGraph key={"graph-".concat(rootId)} entities={entities} activities={activities} inputs={inputs} outputs={outputs} containments={containments} rootId={rootId} rootType={rootType} width={width} height={height}/>
                  </react_1.Loading>);
            }}
              </responsive_1.ParentSize>)}
          </div>
        </div>
      </react_1.VStack>
      {!isEmpty && (<TraceabilitySidebar_1.TraceabilitySidebar key={"sidebar-".concat(sidebarId)} entity={selectedEntity} activity={selectedActivity} payload={{
                entities: entities,
                activities: activities,
                inputs: inputs,
                outputs: outputs,
                containments: containments
            }} onSelect={selectNode} focusedIndex={safeIndex} onFocusedIndexChange={setFocusedIndex} selectedIds={selectedIds}/>)}
    </div>);
}
var templateObject_1;
