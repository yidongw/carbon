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
exports.default = TrainingAssignmentDetailRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var resources_1 = require("~/modules/resources");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Detail"], ["Detail"]))),
    to: path_1.path.to.trainingAssignments
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, trainingId, _d, _e, _f, training, assignmentStatus, _g, _h, _j, _k;
        var _l;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "resources",
                        role: "employee"
                    })];
                case 1:
                    _c = _m.sent(), client = _c.client, companyId = _c.companyId;
                    trainingId = params.trainingId;
                    if (!!trainingId) return [3 /*break*/, 3];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.trainingAssignments];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Training ID is required"))];
                case 2: throw _d.apply(void 0, _e.concat([_m.sent()]));
                case 3: return [4 /*yield*/, Promise.all([
                        (0, resources_1.getTraining)(client, trainingId),
                        (0, resources_1.getTrainingAssignmentStatus)(client, companyId, {
                            trainingId: trainingId,
                            status: undefined,
                            search: undefined,
                            limit: 10000,
                            offset: 0,
                            sorts: [],
                            filters: []
                        })
                    ])];
                case 4:
                    _f = _m.sent(), training = _f[0], assignmentStatus = _f[1];
                    if (!training.error) return [3 /*break*/, 6];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.trainingAssignments];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(training.error, "Error loading training"))];
                case 5: throw _g.apply(void 0, _h.concat([_m.sent()]));
                case 6:
                    if (!assignmentStatus.error) return [3 /*break*/, 8];
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.trainingAssignments];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(assignmentStatus.error, "Error loading assignment status"))];
                case 7: throw _j.apply(void 0, _k.concat([_m.sent()]));
                case 8: return [2 /*return*/, {
                        training: training.data,
                        assignments: ((_l = assignmentStatus.data) !== null && _l !== void 0 ? _l : [])
                    }];
            }
        });
    });
}
function StatusBadge(_a) {
    var status = _a.status;
    switch (status) {
        case "Completed":
            return (<react_1.Badge variant="green">
          <lu_1.LuCircleCheck className="mr-1"/>
          <macro_2.Trans>Completed</macro_2.Trans>
        </react_1.Badge>);
        case "Pending":
            return (<react_1.Badge variant="secondary">
          <lu_1.LuClock className="mr-1"/>
          <macro_2.Trans>Pending</macro_2.Trans>
        </react_1.Badge>);
        case "Overdue":
            return (<react_1.Badge variant="red">
          <lu_1.LuTriangleAlert className="mr-1"/>
          <macro_2.Trans>Overdue</macro_2.Trans>
        </react_1.Badge>);
        case "Not Required":
            return (<react_1.Badge variant="outline">
          <macro_2.Trans>Not Required</macro_2.Trans>
        </react_1.Badge>);
        default:
            return <react_1.Badge variant="secondary">{status}</react_1.Badge>;
    }
}
function AssignmentListItem(_a) {
    var assignment = _a.assignment, currentPeriod = _a.currentPeriod, disabled = _a.disabled, isLast = _a.isLast;
    var fetcher = (0, react_router_1.useFetcher)();
    var locale = (0, i18n_1.useLocale)().locale;
    var isSubmitting = fetcher.state !== "idle";
    var canMarkComplete = assignment.status !== "Completed" && assignment.status !== "Not Required";
    return (<div className={(0, react_1.cn)("p-4", !isLast && "border-b w-full")}>
      <div className="flex flex-1 justify-between items-center w-full">
        <react_1.HStack spacing={4} className="flex-1">
          <react_1.VStack spacing={0} className="flex-1">
            <components_1.EmployeeAvatar employeeId={assignment.employeeId}/>
            {assignment.employeeStartDate && (<react_1.HStack spacing={1} className="text-xs text-muted-foreground">
                <lu_1.LuCalendar className="size-3"/>
                <span>
                  <macro_2.Trans>Started</macro_2.Trans>{" "}
                  {new Date(assignment.employeeStartDate).toLocaleDateString(locale)}
                </span>
              </react_1.HStack>)}
          </react_1.VStack>
        </react_1.HStack>
        <react_1.HStack spacing={4}>
          <StatusBadge status={assignment.status}/>
          {assignment.completedAt && (<span className="text-xs text-muted-foreground">
              <lu_1.LuClock className="inline mr-1 size-3"/>
              {new Date(assignment.completedAt).toLocaleDateString(locale)}
            </span>)}
          {canMarkComplete && (<fetcher.Form method="post" action={path_1.path.to.markTrainingComplete}>
              <input type="hidden" name="trainingAssignmentId" value={assignment.trainingAssignmentId}/>
              <input type="hidden" name="employeeId" value={assignment.employeeId}/>
              <input type="hidden" name="period" value={currentPeriod !== null && currentPeriod !== void 0 ? currentPeriod : ""}/>
              <react_1.Button type="submit" variant="secondary" size="sm" disabled={disabled || isSubmitting} isLoading={isSubmitting} leftIcon={<lu_1.LuCircleCheck />}>
                <macro_2.Trans>Mark Complete</macro_2.Trans>
              </react_1.Button>
            </fetcher.Form>)}
        </react_1.HStack>
      </div>
    </div>);
}
function TrainingAssignmentDetailRoute() {
    var t = (0, macro_2.useLingui)().t;
    var _a = (0, react_router_1.useLoaderData)(), training = _a.training, assignments = _a.assignments;
    var permissions = (0, hooks_1.usePermissions)();
    var navigate = (0, react_router_1.useNavigate)();
    var _b = (0, react_2.useState)(""), search = _b[0], setSearch = _b[1];
    var _c = (0, react_2.useState)("All"), statusFilter = _c[0], setStatusFilter = _c[1];
    var currentPeriod = assignments.length > 0 ? assignments[0].currentPeriod : null;
    var filteredAssignments = (0, react_2.useMemo)(function () {
        return assignments.filter(function (assignment) {
            var _a, _b;
            var matchesSearch = (_b = (search === "" ||
                ((_a = assignment.employeeName) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(search.toLowerCase())))) !== null && _b !== void 0 ? _b : false;
            var matchesStatus = statusFilter === "All" || assignment.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [assignments, search, statusFilter]);
    var statusCounts = (0, react_2.useMemo)(function () {
        return assignments.reduce(function (acc, assignment) {
            acc[assignment.status] = (acc[assignment.status] || 0) + 1;
            return acc;
        }, {});
    }, [assignments]);
    var onClose = function () { return navigate(path_1.path.to.trainingAssignments); };
    return (<react_1.Drawer open onOpenChange={function (open) { return !open && onClose(); }}>
      <react_1.DrawerContent size="lg">
        <react_1.DrawerHeader>
          <react_1.HStack className="justify-between w-full pr-8">
            <react_1.HStack spacing={2}>
              <react_1.DrawerTitle>{training === null || training === void 0 ? void 0 : training.name}</react_1.DrawerTitle>
              {currentPeriod && (<react_1.Badge variant="secondary">{currentPeriod}</react_1.Badge>)}
            </react_1.HStack>
          </react_1.HStack>
        </react_1.DrawerHeader>
        <react_1.DrawerBody className="p-0">
          <react_1.VStack spacing={0} className="h-full w-full">
            <div className="p-4 border-b flex flex-col gap-4 w-full">
              <div className="relative">
                <lu_1.LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"/>
                <react_1.Input placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Search employees..."], ["Search employees..."])))} value={search} onChange={function (e) { return setSearch(e.target.value); }} className="pl-9"/>
              </div>
              <react_1.ToggleGroup type="single" value={statusFilter} onValueChange={function (value) {
            if (value)
                setStatusFilter(value);
        }} className="justify-start flex-wrap">
                <react_1.ToggleGroupItem className="flex gap-1.5 items-center" size="sm" value="All">
                  <macro_2.Trans>All</macro_2.Trans> <react_1.Count count={assignments.length}/>
                </react_1.ToggleGroupItem>
                <react_1.ToggleGroupItem className="flex gap-1.5 items-center" size="sm" value="Completed">
                  <lu_1.LuCircleCheck className="mr-1 size-3"/>
                  <macro_2.Trans>Completed</macro_2.Trans>{" "}
                  {/** biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration */}
                  <react_1.Count count={statusCounts["Completed"] || 0}/>
                </react_1.ToggleGroupItem>
                <react_1.ToggleGroupItem className="flex gap-1.5 items-center" size="sm" value="Pending">
                  <lu_1.LuClock className="mr-1 size-3"/>
                  <macro_2.Trans>Pending</macro_2.Trans>{" "}
                  {/** biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration */}
                  <react_1.Count count={statusCounts["Pending"] || 0}/>
                </react_1.ToggleGroupItem>
                <react_1.ToggleGroupItem className="flex gap-1.5 items-center" size="sm" value="Overdue">
                  <lu_1.LuTriangleAlert className="mr-1 size-3"/>
                  <macro_2.Trans>Overdue</macro_2.Trans>{" "}
                  {/** biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration */}
                  <react_1.Count count={statusCounts["Overdue"] || 0}/>
                </react_1.ToggleGroupItem>
                <react_1.ToggleGroupItem className="flex gap-1.5 items-center" size="sm" value="Not Required">
                  <macro_2.Trans>Not Required</macro_2.Trans>{" "}
                  <react_1.Count count={statusCounts["Not Required"] || 0}/>
                </react_1.ToggleGroupItem>
              </react_1.ToggleGroup>
            </div>
            <div className="flex-1 overflow-y-auto w-full p-4">
              {filteredAssignments.length > 0 ? (<div className="border rounded-lg w-full">
                  {filteredAssignments.map(function (assignment, index) { return (<AssignmentListItem key={"".concat(assignment.employeeId, "-").concat(assignment.trainingAssignmentId)} assignment={assignment} currentPeriod={currentPeriod} disabled={!permissions.can("update", "resources")} isLast={index === filteredAssignments.length - 1}/>); })}
                </div>) : (<div className="flex items-center justify-center h-full text-muted-foreground p-8">
                  <react_1.VStack spacing={2} className="w-full items-center justify-center">
                    <components_1.Empty>
                      <macro_2.Trans>No employees found</macro_2.Trans>
                    </components_1.Empty>
                    {search && (<react_1.Button variant="ghost" size="sm" onClick={function () { return setSearch(""); }}>
                        <macro_2.Trans>Clear search</macro_2.Trans>
                      </react_1.Button>)}
                  </react_1.VStack>
                </div>)}
            </div>
          </react_1.VStack>
        </react_1.DrawerBody>
      </react_1.DrawerContent>
    </react_1.Drawer>);
}
var templateObject_1, templateObject_2;
