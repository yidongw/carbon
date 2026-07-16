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
exports.default = JobDagRoute;
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var JobDag_1 = require("~/components/JobDag");
var operations_service_1 = require("~/services/operations.service");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var serviceRole, jobId, _c, job, operations, dependencies;
        var _d, _e, _f, _g;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _h.sent();
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    jobId = params.jobId;
                    if (!jobId)
                        throw new Error("Could not find jobId");
                    return [4 /*yield*/, Promise.all([
                            serviceRole.from("jobs").select("jobId").eq("id", jobId).single(),
                            (0, operations_service_1.getJobOperations)(serviceRole, jobId),
                            (0, operations_service_1.getJobOperationDependencies)(serviceRole, jobId)
                        ])];
                case 2:
                    _c = _h.sent(), job = _c[0], operations = _c[1], dependencies = _c[2];
                    return [2 /*return*/, {
                            readableId: (_e = (_d = job.data) === null || _d === void 0 ? void 0 : _d.jobId) !== null && _e !== void 0 ? _e : jobId,
                            operations: (_f = operations.data) !== null && _f !== void 0 ? _f : [],
                            dependencies: (_g = dependencies.data) !== null && _g !== void 0 ? _g : []
                        }];
            }
        });
    });
}
function JobDagRoute() {
    var _a = (0, react_router_1.useLoaderData)(), readableId = _a.readableId, operations = _a.operations, dependencies = _a.dependencies;
    return (<div className="flex flex-col flex-1">
      <header className="sticky top-0 z-10 flex h-[var(--header-height)] shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b bg-background">
        <div className="flex items-center gap-2 px-2">
          <react_1.SidebarTrigger className="md:hidden"/>
          <react_router_1.Link to={path_1.path.to.jobs} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <lu_1.LuArrowLeft className="w-4 h-4"/>
          </react_router_1.Link>
          <react_1.Heading size="h4">{readableId}</react_1.Heading>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <JobDag_1.JobDag operations={operations} dependencies={dependencies}/>
      </main>
    </div>);
}
