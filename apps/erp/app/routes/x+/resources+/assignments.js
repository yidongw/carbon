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
exports.default = TrainingAssignmentsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var resources_1 = require("~/modules/resources");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Assignments"], ["Assignments"]))),
    to: path_1.path.to.trainingAssignments
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, _d, summary, assignments, _e, _f, assignmentsByTraining;
        var _g, _h;
        var request = _b.request;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "resources",
                        role: "employee"
                    })];
                case 1:
                    _c = _j.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, Promise.all([
                            (0, resources_1.getTrainingAssignmentSummary)(client, companyId),
                            (0, resources_1.getTrainingAssignments)(client, companyId)
                        ])];
                case 2:
                    _d = _j.sent(), summary = _d[0], assignments = _d[1];
                    if (!summary.error) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.authenticatedRoot];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(summary.error, "Error loading training assignments"))];
                case 3: throw _e.apply(void 0, _f.concat([_j.sent()]));
                case 4:
                    assignmentsByTraining = ((_g = assignments.data) !== null && _g !== void 0 ? _g : []).reduce(function (acc, assignment) {
                        if (!acc[assignment.trainingId]) {
                            acc[assignment.trainingId] = [];
                        }
                        acc[assignment.trainingId].push(assignment.id);
                        return acc;
                    }, {});
                    return [2 /*return*/, {
                            summary: ((_h = summary.data) !== null && _h !== void 0 ? _h : []),
                            assignmentsByTraining: assignmentsByTraining
                        }];
            }
        });
    });
}
var TrainingAssignmentsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, assignmentsByTraining = _a.assignmentsByTraining;
    var t = (0, macro_2.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    var columns = (0, react_2.useMemo)(function () { return [
        {
            accessorKey: "trainingName",
            header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Training"], ["Training"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<components_1.Hyperlink to={path_1.path.to.trainingAssignmentDetail(row.original.trainingId)}>
              {row.original.trainingName}
            </components_1.Hyperlink>);
            },
            meta: {
                icon: <lu_1.LuBookOpen />
            }
        },
        {
            accessorKey: "frequency",
            header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Frequency"], ["Frequency"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<react_1.Badge variant="secondary">{row.original.frequency}</react_1.Badge>);
            },
            meta: {
                icon: <lu_1.LuRepeat />
            }
        },
        {
            accessorKey: "currentPeriod",
            header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Period"], ["Period"]))),
            cell: function (_a) {
                var _b;
                var row = _a.row;
                return (_b = row.original.currentPeriod) !== null && _b !== void 0 ? _b : "-";
            },
            meta: {
                icon: <lu_1.LuClock />
            }
        },
        {
            accessorKey: "totalAssigned",
            header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Assigned"], ["Assigned"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<react_1.HStack spacing={2}>
              <lu_1.LuUsers />
              <span className="text-muted-foreground ">
                {row.original.totalAssigned}
              </span>
            </react_1.HStack>);
            },
            meta: {
                icon: <lu_1.LuUsers />
            }
        },
        {
            accessorKey: "completed",
            header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Completed"], ["Completed"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<react_1.HStack spacing={2}>
              <lu_1.LuCircleCheck className="text-emerald-500"/>
              <span className="text-muted-foreground">
                {row.original.completed}
              </span>
            </react_1.HStack>);
            },
            meta: {
                icon: <lu_1.LuCircleCheck />
            }
        },
        {
            accessorKey: "pending",
            header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Pending"], ["Pending"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<react_1.HStack spacing={2}>
              <lu_1.LuClock className="text-yellow-500"/>
              <span className="text-muted-foreground text-xs">
                {row.original.pending}
              </span>
            </react_1.HStack>);
            },
            meta: {
                icon: <lu_1.LuClock />
            }
        },
        {
            accessorKey: "overdue",
            header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Overdue"], ["Overdue"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<react_1.HStack spacing={2}>
              <lu_1.LuTriangleAlert className="text-red-500"/>
              <span className="text-muted-foreground text-xs">
                {row.original.overdue}
              </span>
            </react_1.HStack>);
            },
            meta: {
                icon: <lu_1.LuTriangleAlert />
            }
        },
        {
            accessorKey: "completionPercent",
            header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Progress"], ["Progress"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<react_1.BarProgress progress={row.original.completionPercent} value={"".concat(row.original.completionPercent, "%")}/>);
            },
            meta: {
                icon: <lu_1.LuChartColumnIncreasing />
            }
        }
    ]; }, [t]);
    var renderContextMenu = (0, react_2.useMemo)(function () {
        return function (row) {
            var _a;
            var assignmentIds = (_a = assignmentsByTraining[row.trainingId]) !== null && _a !== void 0 ? _a : [];
            // If there are multiple assignments for this training, we need a different approach
            // For now, we'll use the first one (or show nothing if no assignments)
            var assignmentId = assignmentIds[0];
            if (!assignmentId)
                return null;
            return (<>
            <react_1.MenuItem asChild>
              <react_router_1.Link to={path_1.path.to.trainingAssignmentDetail(row.trainingId)}>
                <react_1.MenuIcon icon={<lu_1.LuEye />}/>
                <macro_2.Trans>View Status</macro_2.Trans>
              </react_router_1.Link>
            </react_1.MenuItem>
            {permissions.can("update", "resources") && (<react_1.MenuItem asChild>
                <react_router_1.Link to={path_1.path.to.trainingAssignment(assignmentId)}>
                  <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
                  <macro_2.Trans>Edit Assignment</macro_2.Trans>
                </react_router_1.Link>
              </react_1.MenuItem>)}
            {permissions.can("delete", "resources") && (<react_1.MenuItem onClick={function () {
                        fetcher.submit(null, {
                            method: "post",
                            action: path_1.path.to.deleteTrainingAssignment(assignmentId)
                        });
                    }}>
                <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
                <macro_2.Trans>Delete Assignment</macro_2.Trans>
              </react_1.MenuItem>)}
          </>);
        };
    }, [assignmentsByTraining, permissions, fetcher]);
    return (<components_1.Table data={data} columns={columns} count={data.length} primaryAction={permissions.can("create", "resources") && (<components_1.New label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Assignment"], ["Assignment"])))} to={path_1.path.to.newTrainingAssignment}/>)} title={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Training Assignments"], ["Training Assignments"])))} table="trainingAssignmentSummary" renderContextMenu={renderContextMenu}/>);
});
TrainingAssignmentsTable.displayName = "TrainingAssignmentsTable";
function TrainingAssignmentsRoute() {
    var _a = (0, react_router_1.useLoaderData)(), summary = _a.summary, assignmentsByTraining = _a.assignmentsByTraining;
    return (<react_1.VStack spacing={0} className="h-full">
      <TrainingAssignmentsTable data={summary} assignmentsByTraining={assignmentsByTraining}/>
      <react_router_1.Outlet />
    </react_1.VStack>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11;
