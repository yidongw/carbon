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
exports.action = action;
exports.default = KanbanCollisionRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var inventory_1 = require("~/modules/inventory");
var production_service_1 = require("~/modules/production/production.service");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, id, kanban, job;
        var _c, _d;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    client = (_e.sent()).client;
                    id = params.id;
                    if (!id)
                        throw (0, auth_1.notFound)("id not found");
                    return [4 /*yield*/, (0, inventory_1.getKanban)(client, id)];
                case 2:
                    kanban = _e.sent();
                    if (((_c = kanban.data) === null || _c === void 0 ? void 0 : _c.replenishmentSystem) !== "Make" ||
                        !((_d = kanban.data) === null || _d === void 0 ? void 0 : _d.jobReadableId)) {
                        // false alarm, this is not a collision
                        throw (0, react_router_1.redirect)(path_1.path.to.api.kanban(id));
                    }
                    return [4 /*yield*/, (0, production_service_1.getJob)(client, kanban.data.jobId)];
                case 3:
                    job = _e.sent();
                    if (job.error) {
                        return [2 /*return*/, {
                                existingJob: null,
                                id: id
                            }];
                    }
                    return [2 /*return*/, {
                            existingJob: job.data,
                            id: id
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, companyId, id, kanbanUpdate, _d, _e, _f, _g;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _h.sent(), client = _c.client, userId = _c.userId, companyId = _c.companyId;
                    id = params.id;
                    if (!id)
                        throw (0, auth_1.notFound)("id not found");
                    return [4 /*yield*/, (0, production_service_1.updateKanbanJob)(client, {
                            id: id,
                            jobId: null,
                            userId: userId,
                            companyId: companyId
                        })];
                case 2:
                    kanbanUpdate = _h.sent();
                    if (!kanbanUpdate.error) return [3 /*break*/, 4];
                    _d = react_router_1.data;
                    _e = [{ success: false }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Failed to cancel job"))];
                case 3: return [2 /*return*/, _d.apply(void 0, _e.concat([_h.sent()]))];
                case 4:
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.api.kanban(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Job cancelled"))];
                case 5: return [2 /*return*/, _f.apply(void 0, _g.concat([_h.sent()]))];
            }
        });
    });
}
function KanbanCollisionRoute() {
    var _a = (0, react_router_1.useLoaderData)(), id = _a.id, existingJob = _a.existingJob;
    var fetcher = (0, react_router_1.useFetcher)();
    if (!existingJob)
        return null;
    return (<div className="flex flex-col gap-2 h-screen w-screen items-center justify-center">
      <lu_1.LuTriangleAlert className="size-12 text-muted-foreground"/>
      <react_1.Heading size="display">{existingJob === null || existingJob === void 0 ? void 0 : existingJob.jobId}</react_1.Heading>
      {/* <JobStatus status={existingJob?.status} /> */}
      <p className="text-lg text-muted-foreground max-w-md text-center mx-auto">
        There's already a job for this kanban.
      </p>
      <div className="flex gap-2 py-4">
        <react_1.Button size="lg" variant="secondary" asChild>
          <react_router_1.Link to={path_1.path.to.api.kanbanJobLink(id)}>View Job</react_router_1.Link>
        </react_1.Button>
        <fetcher.Form method="post">
          <react_1.Button isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"} variant="destructive" size="lg" type="submit">
            Remove Job
          </react_1.Button>
        </fetcher.Form>
      </div>
    </div>);
}
