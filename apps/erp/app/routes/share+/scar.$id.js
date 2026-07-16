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
exports.scarValidator = exports.meta = void 0;
exports.loader = loader;
exports.action = action;
exports.TaskItem = TaskItem;
exports.TaskList = TaskList;
exports.default = ExternalQuote;
var auth_1 = require("@carbon/auth");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var Editor_1 = require("@carbon/react/Editor");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var purchasing_1 = require("~/modules/purchasing");
var quality_1 = require("~/modules/quality");
var Issue_1 = require("~/modules/quality/ui/Issue");
var IssueStatus_1 = require("~/modules/quality/ui/Issue/IssueStatus");
var settings_1 = require("~/modules/settings");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var quote__id_1 = require("./quote.$id");
var meta = function () {
    return [{ title: "SCAR Report" }];
};
exports.meta = meta;
var IssueState;
(function (IssueState) {
    IssueState[IssueState["Valid"] = 0] = "Valid";
    IssueState[IssueState["NotFound"] = 1] = "NotFound";
})(IssueState || (IssueState = {}));
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id, serviceRole, externalLink, issue, _c, company, supplier, actionTasks;
        var _d;
        var params = _b.params, request = _b.request;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    id = params.id;
                    if (!id) {
                        return [2 /*return*/, {
                                state: IssueState.NotFound,
                                data: null
                            }];
                    }
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, shared_1.getExternalLink)(serviceRole, id)];
                case 1:
                    externalLink = _e.sent();
                    if (!externalLink.data || !((_d = externalLink.data) === null || _d === void 0 ? void 0 : _d.documentId)) {
                        return [2 /*return*/, {
                                state: IssueState.NotFound,
                                data: null
                            }];
                    }
                    return [4 /*yield*/, (0, quality_1.getIssueFromExternalLink)(serviceRole, externalLink.data.documentId)];
                case 2:
                    issue = _e.sent();
                    if (!issue.data) {
                        return [2 /*return*/, {
                                state: IssueState.NotFound,
                                data: null
                            }];
                    }
                    return [4 /*yield*/, Promise.all([
                            (0, settings_1.getCompany)(serviceRole, externalLink.data.companyId),
                            (0, purchasing_1.getSupplier)(serviceRole, issue.data.supplierId),
                            (0, quality_1.getIssueActionTasks)(serviceRole, issue.data.nonConformanceId, externalLink.data.companyId, issue.data.supplierId)
                        ])];
                case 3:
                    _c = _e.sent(), company = _c[0], supplier = _c[1], actionTasks = _c[2];
                    return [2 /*return*/, {
                            state: IssueState.Valid,
                            data: {
                                issue: issue.data.nonConformance,
                                company: company.data,
                                supplier: supplier.data,
                                actionTasks: actionTasks.data
                            }
                        }];
            }
        });
    });
}
exports.scarValidator = zod_1.default.object({
    taskId: zod_form_data_1.zfd.text(zod_1.default.string()),
    type: zod_1.default.enum(["action"]),
    supplierId: zod_form_data_1.zfd.text(zod_1.default.string()),
    status: zod_1.default.enum(quality_1.nonConformanceTaskStatus).optional(),
    content: zod_1.default
        .string()
        .optional()
        .transform(function (str, ctx) {
        if (!str) {
            return;
        }
        try {
            return JSON.parse(str);
            // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
        }
        catch (e) {
            ctx.addIssue({ code: "custom", message: "Invalid JSON" });
            return zod_1.default.NEVER;
        }
    })
});
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var serviceRole, id, externalLink, issue, formData, validation, tasks, isTaskValid, statusUpdate, _c, _d, _e, _f, contentUpdate, _g, _h;
        var _j, _k;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    id = params.id;
                    if (!id)
                        throw new Error("Could not find id");
                    return [4 /*yield*/, (0, shared_1.getExternalLink)(serviceRole, id)];
                case 1:
                    externalLink = _l.sent();
                    if (!externalLink.data || !((_j = externalLink.data) === null || _j === void 0 ? void 0 : _j.documentId)) {
                        throw new Error("Could not find id");
                    }
                    return [4 /*yield*/, (0, quality_1.getIssueFromExternalLink)(serviceRole, externalLink.data.documentId)];
                case 2:
                    issue = _l.sent();
                    if (!issue.data) {
                        throw new Error("Could not find the issue");
                    }
                    if (issue.data.nonConformance.status === "Closed") {
                        throw new Error("Issue has been closed already. Unable to make changes");
                    }
                    return [4 /*yield*/, request.formData()];
                case 3:
                    formData = _l.sent();
                    return [4 /*yield*/, (0, form_1.validator)(exports.scarValidator).validate(formData)];
                case 4:
                    validation = _l.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    return [4 /*yield*/, (0, quality_1.getIssueActionTasks)(serviceRole, issue.data.nonConformanceId, externalLink.data.companyId, issue.data.supplierId)];
                case 5:
                    tasks = _l.sent();
                    isTaskValid = (_k = tasks.data) === null || _k === void 0 ? void 0 : _k.find(function (t) { return t.id === validation.data.taskId; });
                    if (!isTaskValid) {
                        throw new Error("Invalid task id");
                    }
                    if (!validation.data.status) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, quality_1.updateIssueTaskStatus)(serviceRole, {
                            id: validation.data.taskId,
                            status: validation.data.status,
                            type: validation.data.type
                        })];
                case 6:
                    statusUpdate = _l.sent();
                    if (!statusUpdate.error) return [3 /*break*/, 8];
                    _c = react_router_1.data;
                    _d = [{
                            success: false
                        }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(statusUpdate.error, "Failed to update task status"))];
                case 7: return [2 /*return*/, _c.apply(void 0, _d.concat([_l.sent()]))];
                case 8:
                    _e = react_router_1.data;
                    _f = [{
                            success: true
                        }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated task status"))];
                case 9: return [2 /*return*/, _e.apply(void 0, _f.concat([_l.sent()]))];
                case 10:
                    if (!validation.data.content) return [3 /*break*/, 14];
                    return [4 /*yield*/, (0, quality_1.updateIssueTaskContent)(serviceRole, {
                            id: validation.data.taskId,
                            content: validation.data.content,
                            type: validation.data.type
                        })];
                case 11:
                    contentUpdate = _l.sent();
                    if (!contentUpdate.error) return [3 /*break*/, 13];
                    _g = react_router_1.data;
                    _h = [{
                            success: false
                        }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(contentUpdate.error, "Failed to update content"))];
                case 12: return [2 /*return*/, _g.apply(void 0, _h.concat([_l.sent()]))];
                case 13: return [2 /*return*/, { succes: true }];
                case 14: return [2 /*return*/, {
                        success: true
                    }];
            }
        });
    });
}
var Header = function (_a) {
    var _b, _c;
    var company = _a.company, issue = _a.issue, supplier = _a.supplier;
    return (<react_1.CardHeader className="flex flex-col gap-4">
    <div className="flex items-center justify-center w-full">
      <IssueStatus_1.default status={issue.status}/>
    </div>
    <div className="flex sm:flex-row items-start sm:items-start justify-between space-y-4 sm:space-y-2">
      <div className="flex items-center space-x-4">
        <div>
          <react_1.CardTitle className="text-3xl">{(_b = company === null || company === void 0 ? void 0 : company.name) !== null && _b !== void 0 ? _b : ""}</react_1.CardTitle>
          {(issue === null || issue === void 0 ? void 0 : issue.nonConformanceId) && (<p className="text-lg text-muted-foreground">
              {issue.nonConformanceId}
            </p>)}
          {(issue === null || issue === void 0 ? void 0 : issue.name) && (<p className="text-lg text-muted-foreground">{issue.name}</p>)}
        </div>
      </div>
      <div className="flex flex-col gap-2 items-end justify-start">
        <p className="text-xl font-medium">{(_c = supplier === null || supplier === void 0 ? void 0 : supplier.name) !== null && _c !== void 0 ? _c : ""}</p>
      </div>
    </div>
  </react_1.CardHeader>);
};
function useTaskStatus(_a) {
    var task = _a.task, type = _a.type, onChange = _a.onChange;
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("Could not find external quote id");
    var submit = (0, react_router_1.useSubmit)();
    var onOperationStatusChange = (0, react_2.useCallback)(function (taskId, status) {
        var _a;
        onChange === null || onChange === void 0 ? void 0 : onChange(status);
        submit({
            taskId: taskId,
            status: status,
            type: type,
            supplierId: (_a = task.supplierId) !== null && _a !== void 0 ? _a : ""
        }, {
            method: "post",
            action: path_1.path.to.externalScar(id),
            navigate: false,
            fetcherKey: "externalScar:".concat(id)
        });
    }, [onChange, task.supplierId, type, id, submit]);
    var currentStatus = task.status;
    return {
        currentStatus: currentStatus,
        onOperationStatusChange: onOperationStatusChange
    };
}
function useTaskNotes(_a) {
    var _this = this;
    var initialContent = _a.initialContent, taskId = _a.taskId, supplierId = _a.supplierId, type = _a.type;
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("Could not find external quote id");
    var fetcher = (0, react_router_1.useFetcher)();
    var _b = (0, react_2.useState)(initialContent !== null && initialContent !== void 0 ? initialContent : {}), content = _b[0], setContent = _b[1];
    var onUpdateContent = (0, react_1.useDebounce)(function (content) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            fetcher.submit({ taskId: taskId, type: type, supplierId: supplierId, content: JSON.stringify(content) }, { method: "post", action: path_1.path.to.externalScar(id) });
            return [2 /*return*/];
        });
    }); }, 1000, true);
    return {
        content: content,
        setContent: setContent,
        onUpdateContent: onUpdateContent
    };
}
function TaskItem(_a) {
    var _b, _c;
    var task = _a.task, type = _a.type, _d = _a.isDisabled, isDisabled = _d === void 0 ? false : _d;
    // const permissions = usePermissions();
    var t = (0, macro_1.useLingui)().t;
    var disclosure = (0, react_1.useDisclosure)({
        defaultIsOpen: true
    });
    var _e = useTaskStatus({
        task: task,
        type: type
    }), currentStatus = _e.currentStatus, onOperationStatusChange = _e.onOperationStatusChange;
    var statusAction = Issue_1.statusActions[currentStatus];
    var _f = useTaskNotes({
        initialContent: ((_b = task.notes) !== null && _b !== void 0 ? _b : {}),
        taskId: task.id,
        type: type,
        supplierId: (_c = task.supplierId) !== null && _c !== void 0 ? _c : ""
    }), content = _f.content, setContent = _f.setContent, onUpdateContent = _f.onUpdateContent;
    var hasStartedRef = (0, react_2.useRef)(false);
    var taskTitle = task.name;
    return (<div className="rounded-lg border w-full flex flex-col">
      <div className="flex w-full justify-between px-4 py-2 items-center">
        <div className="flex flex-col">
          <span className="text-base font-semibold tracking-tight">
            {taskTitle}
          </span>
        </div>
        <react_1.IconButton icon={<lu_1.LuChevronRight />} variant="ghost" onClick={disclosure.onToggle} aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Open task details"], ["Open task details"])))} className={(0, react_1.cn)(disclosure.isOpen && "rotate-90")}/>
      </div>

      {disclosure.isOpen && (<div className="px-4 py-2 rounded">
          {!isDisabled ? (<Editor_1.Editor className="w-full min-h-[100px]" initialValue={content} disableFileUpload onChange={function (value) {
                    var _a;
                    setContent(value);
                    onUpdateContent(value);
                    // Auto-start issue when typing in task if issue status is "Registered"
                    if (task.status === "Pending" &&
                        !hasStartedRef.current &&
                        ((_a = value === null || value === void 0 ? void 0 : value.content) === null || _a === void 0 ? void 0 : _a.some(function (node) { var _a; return ((_a = node.content) === null || _a === void 0 ? void 0 : _a.length) > 0; }))) {
                        hasStartedRef.current = true;
                        onOperationStatusChange(task.id, "In Progress");
                    }
                }}/>) : (<div className="prose dark:prose-invert" dangerouslySetInnerHTML={{
                    __html: (0, react_1.generateHTML)(content)
                }}/>)}
        </div>)}
      <div className="bg-muted/30 border-t px-4 py-2 flex justify-end w-full">
        <react_1.HStack>
          <react_1.Button isDisabled={isDisabled} leftIcon={statusAction.icon} variant="secondary" size="sm" onClick={function () {
            onOperationStatusChange(task.id, statusAction.status);
        }}>
            {statusAction.action}
          </react_1.Button>
        </react_1.HStack>
      </div>
    </div>);
}
function TaskList(_a) {
    var tasks = _a.tasks, isDisabled = _a.isDisabled;
    if (tasks.length === 0)
        return null;
    return (<>
      <react_1.HStack className="justify-center w-full">
        <Issue_1.TaskProgress tasks={tasks} className="pr-0"/>
      </react_1.HStack>

      <react_1.VStack spacing={3}>
        {tasks
            .sort(function (a, b) { var _a, _b, _c; return (_c = (_a = a.name) === null || _a === void 0 ? void 0 : _a.localeCompare((_b = b.name) !== null && _b !== void 0 ? _b : "")) !== null && _c !== void 0 ? _c : 0; })
            .map(function (task) { return (<TaskItem key={task.id} task={task} type="action" isDisabled={isDisabled}/>); })}
      </react_1.VStack>
    </>);
}
var Issue = function (_a) {
    var _b;
    var data = _a.data;
    var company = data.company, issue = data.issue, actionTasks = data.actionTasks, supplier = data.supplier;
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("Could not find external quote id");
    var mode = (0, react_1.useMode)();
    var logo = mode === "dark" ? company === null || company === void 0 ? void 0 : company.logoDark : company === null || company === void 0 ? void 0 : company.logoLight;
    return (<react_1.VStack spacing={8} className="w-full items-center p-2 md:p-8">
      {logo && (<img src={logo} alt={(_b = company === null || company === void 0 ? void 0 : company.name) !== null && _b !== void 0 ? _b : ""} className="w-auto mx-auto max-w-5xl"/>)}
      <react_1.Card className="w-full max-w-5xl mx-auto gap-4">
        <Header company={company} issue={issue} supplier={supplier}/>
        <react_1.CardContent className="gap-4">
          {(actionTasks === null || actionTasks === void 0 ? void 0 : actionTasks.length) ? (<TaskList tasks={actionTasks} isDisabled={issue.status === "Closed"}/>) : null}
        </react_1.CardContent>
      </react_1.Card>
    </react_1.VStack>);
};
function ExternalQuote() {
    var _a = (0, react_router_1.useLoaderData)(), state = _a.state, data = _a.data;
    var t = (0, macro_1.useLingui)().t;
    switch (state) {
        case IssueState.Valid:
            if (data) {
                return <Issue data={data}/>;
            }
            return (<quote__id_1.ErrorMessage title={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Issue not found"], ["Issue not found"])))} message={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Oops! The link you're trying to access is not valid."], ["Oops! The link you're trying to access is not valid."])))}/>);
        case IssueState.NotFound:
            return (<quote__id_1.ErrorMessage title={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Issue not found"], ["Issue not found"])))} message={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Oops! The link you're trying to access is not valid."], ["Oops! The link you're trying to access is not valid."])))}/>);
    }
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
