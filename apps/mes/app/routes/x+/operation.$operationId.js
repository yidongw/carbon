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
exports.default = OperationRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_router_1 = require("react-router");
var JobOperation_1 = require("~/components/JobOperation");
var inventory_service_1 = require("~/services/inventory.service");
var operations_service_1 = require("~/services/operations.service");
var durations_1 = require("~/utils/durations");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, userId, companyId, operationId, url, trackedEntityId, serviceRole, _d, events, quantities, job, operation, _e, _f, _g, _h, _j, _k, _l, thumbnailPath, trackedEntities, jobMakeMethod, kanban, bomIdMap, companySettings, inventoryShelfLife, expiredEntityPolicy, lastTrackedEntity, redirectUrl;
        var _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_7) {
            switch (_7.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _7.sent(), userId = _c.userId, companyId = _c.companyId;
                    operationId = params.operationId;
                    if (!operationId)
                        throw new Error("Operation ID is required");
                    url = new URL(request.url);
                    trackedEntityId = url.searchParams.get("trackedEntityId");
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 2:
                    serviceRole = _7.sent();
                    return [4 /*yield*/, Promise.all([
                            (0, operations_service_1.getProductionEventsForJobOperation)(serviceRole, {
                                operationId: operationId,
                                userId: userId
                            }),
                            (0, operations_service_1.getProductionQuantitiesForJobOperation)(serviceRole, operationId),
                            (0, operations_service_1.getJobByOperationId)(serviceRole, operationId),
                            (0, operations_service_1.getJobOperationById)(serviceRole, operationId)
                        ])];
                case 3:
                    _d = _7.sent(), events = _d[0], quantities = _d[1], job = _d[2], operation = _d[3];
                    if (!job.error) return [3 /*break*/, 5];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.operations];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(job.error, "Failed to fetch job"))];
                case 4: throw _e.apply(void 0, _f.concat([_7.sent()]));
                case 5:
                    if (!operation.error) return [3 /*break*/, 7];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.operations];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(operation.error, "Failed to fetch operation"))];
                case 6: throw _g.apply(void 0, _h.concat([_7.sent()]));
                case 7:
                    if (!!job.data.itemId) return [3 /*break*/, 9];
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.operations];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Item ID is required", "Failed to fetch item"))];
                case 8: throw _j.apply(void 0, _k.concat([_7.sent()]));
                case 9: return [4 /*yield*/, Promise.all([
                        (0, operations_service_1.getThumbnailPathByItemId)(serviceRole, (_m = operation.data) === null || _m === void 0 ? void 0 : _m[0].itemId),
                        (0, operations_service_1.getTrackedEntitiesByMakeMethodId)(serviceRole, (_o = operation.data) === null || _o === void 0 ? void 0 : _o[0].jobMakeMethodId),
                        (0, operations_service_1.getJobMakeMethod)(serviceRole, (_p = operation.data) === null || _p === void 0 ? void 0 : _p[0].jobMakeMethodId),
                        (0, operations_service_1.getKanbanByJobId)(serviceRole, job.data.id),
                        (0, operations_service_1.getJobMethodBomIdMap)(serviceRole, job.data.id),
                        (0, inventory_service_1.getCompanySettings)(serviceRole, companyId)
                    ])];
                case 10:
                    _l = _7.sent(), thumbnailPath = _l[0], trackedEntities = _l[1], jobMakeMethod = _l[2], kanban = _l[3], bomIdMap = _l[4], companySettings = _l[5];
                    inventoryShelfLife = ((_r = (_q = companySettings.data) === null || _q === void 0 ? void 0 : _q.inventoryShelfLife) !== null && _r !== void 0 ? _r : null);
                    expiredEntityPolicy = (_s = inventoryShelfLife === null || inventoryShelfLife === void 0 ? void 0 : inventoryShelfLife.expiredEntityPolicy) !== null && _s !== void 0 ? _s : "Block";
                    // If no trackedEntityId is provided in the URL but trackedEntities exist,
                    // redirect to the same URL with the last trackedEntityId as a search param
                    if (!trackedEntityId &&
                        trackedEntities.data &&
                        trackedEntities.data.length > 0 &&
                        // Check if any tracked entity has an attribute for this operation
                        !trackedEntities.data.every(function (entity) {
                            var attributes = entity.attributes;
                            return Object.keys(attributes).some(function (key) { return key.startsWith("Operation"); });
                        })) {
                        lastTrackedEntity = trackedEntities.data[trackedEntities.data.length - 1];
                        redirectUrl = new URL(request.url);
                        redirectUrl.searchParams.set("trackedEntityId", lastTrackedEntity.id);
                        throw (0, react_router_1.redirect)("".concat(redirectUrl.pathname).concat(redirectUrl.search));
                    }
                    return [2 /*return*/, {
                            bomIdMap: Object.fromEntries(bomIdMap),
                            events: (_t = events.data) !== null && _t !== void 0 ? _t : [],
                            productionQuantities: (_u = quantities.data) !== null && _u !== void 0 ? _u : [],
                            quantities: (_v = quantities.data) !== null && _v !== void 0 ? _v : [],
                            job: job.data,
                            jobMakeMethod: jobMakeMethod.data,
                            kanban: kanban.data,
                            files: (0, operations_service_1.getJobFiles)(serviceRole, companyId, job.data, operation.data),
                            materials: (0, operations_service_1.getJobMaterialsByOperationId)(serviceRole, {
                                operation: (_w = operation.data) === null || _w === void 0 ? void 0 : _w[0],
                                trackedEntityId: trackedEntityId !== null && trackedEntityId !== void 0 ? trackedEntityId : (_y = (_x = trackedEntities === null || trackedEntities === void 0 ? void 0 : trackedEntities.data) === null || _x === void 0 ? void 0 : _x[0]) === null || _y === void 0 ? void 0 : _y.id,
                                requiresSerialTracking: (_0 = (_z = jobMakeMethod.data) === null || _z === void 0 ? void 0 : _z.requiresSerialTracking) !== null && _0 !== void 0 ? _0 : false
                            }),
                            trackedEntities: (_1 = trackedEntities.data) !== null && _1 !== void 0 ? _1 : [],
                            nonConformanceActions: (0, operations_service_1.getNonConformanceActions)(serviceRole, {
                                itemId: (_2 = operation.data) === null || _2 === void 0 ? void 0 : _2[0].itemId,
                                processId: (_3 = operation.data) === null || _3 === void 0 ? void 0 : _3[0].processId,
                                companyId: companyId
                            }),
                            operation: (0, durations_1.makeDurations)((_4 = operation.data) === null || _4 === void 0 ? void 0 : _4[0]),
                            expiredEntityPolicy: expiredEntityPolicy,
                            procedure: (0, operations_service_1.getJobOperationProcedure)(serviceRole, (_5 = operation.data) === null || _5 === void 0 ? void 0 : _5[0].id),
                            workCenter: (0, operations_service_1.getWorkCenter)(serviceRole, (_6 = operation.data) === null || _6 === void 0 ? void 0 : _6[0].workCenterId),
                            thumbnailPath: thumbnailPath
                        }];
            }
        });
    });
}
function OperationRoute() {
    var operationId = (0, react_router_1.useParams)().operationId;
    if (!operationId)
        throw new Error("Operation ID is required");
    var _a = (0, react_router_1.useLoaderData)(), events = _a.events, expiredEntityPolicy = _a.expiredEntityPolicy, files = _a.files, job = _a.job, jobMakeMethod = _a.jobMakeMethod, kanban = _a.kanban, materials = _a.materials, operation = _a.operation, productionQuantities = _a.productionQuantities, quantities = _a.quantities, procedure = _a.procedure, thumbnailPath = _a.thumbnailPath, trackedEntities = _a.trackedEntities, workCenter = _a.workCenter, nonConformanceActions = _a.nonConformanceActions;
    return (<JobOperation_1.JobOperation key={"job-operation-".concat(operationId)} events={events} expiredEntityPolicy={expiredEntityPolicy} files={files} kanban={kanban} materials={materials} method={jobMakeMethod} productionQuantities={productionQuantities} quantities={quantities} trackedEntities={trackedEntities} nonConformanceActions={nonConformanceActions} operation={operation} procedure={procedure} job={job} thumbnailPath={thumbnailPath} workCenter={workCenter}/>);
}
