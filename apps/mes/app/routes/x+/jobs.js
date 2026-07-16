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
exports.default = JobsRoute;
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var EmployeeAvatar_1 = require("~/components/EmployeeAvatar");
var context_1 = require("~/context");
var operations_service_1 = require("~/services/operations.service");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var companyId, serviceRole, locationId, jobs, jobMakeMethodIds, trackedEntities;
        var _c, _d, _e;
        var context = _b.context, request = _b.request;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    companyId = (_f.sent()).companyId;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    locationId = (_c = context.get(context_1.userContext)) === null || _c === void 0 ? void 0 : _c.locationId;
                    return [4 /*yield*/, (0, operations_service_1.getOpenJobs)(serviceRole, { companyId: companyId, locationId: locationId })];
                case 2:
                    jobs = _f.sent();
                    if (jobs.error) {
                        console.error("getOpenJobs error:", jobs.error);
                    }
                    jobMakeMethodIds = ((_d = jobs.data) !== null && _d !== void 0 ? _d : []).reduce(function (acc, job) {
                        if (job.jobMakeMethodId)
                            acc.push(job.jobMakeMethodId);
                        return acc;
                    }, []);
                    return [4 /*yield*/, (0, operations_service_1.getTrackedEntitiesByJobMakeMethodIds)(serviceRole, jobMakeMethodIds, companyId)];
                case 3:
                    trackedEntities = _f.sent();
                    return [2 /*return*/, {
                            jobs: (_e = jobs.data) !== null && _e !== void 0 ? _e : [],
                            trackedEntities: trackedEntities
                        }];
            }
        });
    });
}
var STATUS_COLORS = {
    Draft: "gray",
    Planned: "yellow",
    Ready: "blue",
    "In Progress": "blue",
    Paused: "orange",
    Completed: "green",
    Closed: "gray",
    Cancelled: "red"
};
function JobStatus(_a) {
    var _b;
    var status = _a.status;
    if (!status)
        return null;
    var color = (_b = STATUS_COLORS[status]) !== null && _b !== void 0 ? _b : "gray";
    return (<react_1.Status color={color}>{status === "Ready" ? "Released" : status}</react_1.Status>);
}
function formatDate(value) {
    if (!value)
        return "—";
    var date = new Date(value + "T00:00:00");
    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}
function JobsRoute() {
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, react_router_1.useLoaderData)(), jobs = _a.jobs, trackedEntities = _a.trackedEntities;
    var _b = (0, react_2.useState)(""), searchTerm = _b[0], setSearchTerm = _b[1];
    var filteredJobs = (0, react_2.useMemo)(function () {
        if (!searchTerm)
            return jobs;
        var term = searchTerm.toLowerCase();
        return jobs.filter(function (job) {
            var _a, _b, _c;
            return ((_a = job.jobId) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(term)) ||
                ((_b = job.itemReadableIdWithRevision) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(term)) ||
                ((_c = job.name) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes(term));
        });
    }, [jobs, searchTerm]);
    return (<div className="flex flex-col flex-1">
      <header className="sticky top-0 z-10 flex h-[var(--header-height)] shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b bg-background">
        <div className="flex items-center gap-2 px-2">
          <react_1.SidebarTrigger className="md:hidden"/>
          <react_1.Heading size="h4">
            <macro_1.Trans>Open Jobs</macro_1.Trans>
          </react_1.Heading>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent">
        <div className="p-4">
          <div className="relative mb-4">
            <lu_1.LuSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
            <react_1.Input value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Search by job or item ID"], ["Search by job or item ID"])))} className="pl-8"/>
          </div>

          {filteredJobs.length > 0 ? (<react_1.Table>
              <react_1.Thead>
                <react_1.Tr>
                  <react_1.Th>
                    <macro_1.Trans>Job</macro_1.Trans>
                  </react_1.Th>
                  <react_1.Th>
                    <macro_1.Trans>Item</macro_1.Trans>
                  </react_1.Th>
                  <react_1.Th>
                    <macro_1.Trans>Quantity</macro_1.Trans>
                  </react_1.Th>
                  <react_1.Th>
                    <macro_1.Trans>Tracking</macro_1.Trans>
                  </react_1.Th>
                  <react_1.Th>
                    <macro_1.Trans>Assignee</macro_1.Trans>
                  </react_1.Th>
                  <react_1.Th>
                    <macro_1.Trans>Due Date</macro_1.Trans>
                  </react_1.Th>
                  <react_1.Th>
                    <macro_1.Trans>Deadline</macro_1.Trans>
                  </react_1.Th>
                  <react_1.Th>
                    <macro_1.Trans>Status</macro_1.Trans>
                  </react_1.Th>
                </react_1.Tr>
              </react_1.Thead>
              <react_1.Tbody>
                {filteredJobs.map(function (job) {
                var _a, _b, _c;
                var trackingId = job.jobMakeMethodId
                    ? trackedEntities[job.jobMakeMethodId]
                    : null;
                return (<react_1.Tr key={job.id}>
                      <react_1.Td>
                        <react_router_1.Link to={path_1.path.to.jobDag(job.id)} className="font-medium text-foreground hover:underline">
                          {job.jobId}
                        </react_router_1.Link>
                      </react_1.Td>
                      <react_1.Td>
                        <react_1.VStack spacing={0}>
                          <span>{(_a = job.itemReadableIdWithRevision) !== null && _a !== void 0 ? _a : "—"}</span>
                          {job.name && (<span className="text-xs text-muted-foreground">
                              {job.name}
                            </span>)}
                        </react_1.VStack>
                      </react_1.Td>
                      <react_1.Td className="text-muted-foreground">
                        {(_b = job.quantity) !== null && _b !== void 0 ? _b : "—"}
                      </react_1.Td>
                      <react_1.Td className="text-muted-foreground">
                        {trackingId !== null && trackingId !== void 0 ? trackingId : "—"}
                      </react_1.Td>
                      <react_1.Td>
                        <EmployeeAvatar_1.default employeeId={job.assignee}/>
                      </react_1.Td>
                      <react_1.Td className="text-muted-foreground">
                        {formatDate(job.dueDate)}
                      </react_1.Td>
                      <react_1.Td className="text-muted-foreground">
                        {(_c = job.deadlineType) !== null && _c !== void 0 ? _c : "—"}
                      </react_1.Td>
                      <react_1.Td>
                        <JobStatus status={job.status}/>
                      </react_1.Td>
                    </react_1.Tr>);
            })}
              </react_1.Tbody>
            </react_1.Table>) : searchTerm ? (<div className="flex flex-col items-center justify-center gap-4 py-16">
              <div className="flex justify-center items-center h-12 w-12 rounded-full bg-foreground text-background">
                <lu_1.LuTriangleAlert className="h-6 w-6"/>
              </div>
              <span className="text-xs font-mono font-light text-foreground uppercase">
                <macro_1.Trans>No results</macro_1.Trans>
              </span>
              <react_1.Button onClick={function () { return setSearchTerm(""); }}>
                <macro_1.Trans>Clear Search</macro_1.Trans>
              </react_1.Button>
            </div>) : (<div className="flex flex-col items-center justify-center gap-4 py-16">
              <div className="flex justify-center items-center h-12 w-12 rounded-full bg-foreground text-background">
                <lu_1.LuTriangleAlert className="h-6 w-6"/>
              </div>
              <span className="text-xs font-mono font-light text-foreground uppercase">
                <macro_1.Trans>No open jobs</macro_1.Trans>
              </span>
            </div>)}
        </div>
      </main>
    </div>);
}
var templateObject_1;
