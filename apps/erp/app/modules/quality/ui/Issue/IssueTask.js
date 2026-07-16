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
exports.statusActions = void 0;
exports.TaskProgress = TaskProgress;
exports.ItemProgress = ItemProgress;
exports.TaskItem = TaskItem;
exports.IssueTaskStatus = IssueTaskStatus;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var Editor_1 = require("@carbon/react/Editor");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var nanoid_1 = require("nanoid");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var rx_1 = require("react-icons/rx");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Process_1 = require("~/components/Form/Process");
var Icons_1 = require("~/components/Icons");
var SupplierAvatar_1 = require("~/components/SupplierAvatar");
var hooks_1 = require("~/hooks");
var useIntegrations_1 = require("~/hooks/useIntegrations");
var useRealtime_1 = require("~/hooks/useRealtime");
var quality_1 = require("~/modules/quality");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var IssueDialog_1 = require("./Jira/IssueDialog");
var IssueDialog_2 = require("./Linear/IssueDialog");
function TaskProgress(_a) {
    var tasks = _a.tasks, className = _a.className;
    var completedOrSkippedTasks = tasks.filter(function (task) { return task.status === "Completed" || task.status === "Skipped"; }).length;
    var progressPercentage = (completedOrSkippedTasks / tasks.length) * 100;
    return (<div className={(0, react_1.cn)("flex flex-col items-end gap-2 py-3 pr-14 w-[120px]", className)}>
      <react_1.BarProgress gradient progress={progressPercentage} value={"".concat(completedOrSkippedTasks, "/").concat(tasks.length)}/>
    </div>);
}
function ItemProgress(_a) {
    var items = _a.items;
    var completedOrSkippedItems = items.filter(function (item) { return item.disposition; }).length;
    var progressPercentage = (completedOrSkippedItems / items.length) * 100;
    return (<div className="flex flex-col items-end gap-2 pt-2 pr-14">
      <react_1.BarProgress gradient progress={progressPercentage} value={"".concat(completedOrSkippedItems, "/").concat(items.length)}/>
    </div>);
}
exports.statusActions = {
    Completed: {
        action: "Reopen",
        icon: <lu_1.LuLoaderCircle />,
        status: "Pending"
    },
    Pending: {
        action: "Start",
        icon: <lu_1.LuCirclePlay />,
        status: "In Progress"
    },
    Skipped: {
        action: "Reopen",
        icon: <lu_1.LuLoaderCircle />,
        status: "Pending"
    },
    "In Progress": {
        action: "Complete",
        icon: <lu_1.LuCircleCheck />,
        status: "Completed"
    }
};
function SupplierAssignment(_a) {
    var _b, _c;
    var task = _a.task, type = _a.type, supplierIds = _a.supplierIds, _d = _a.isDisabled, isDisabled = _d === void 0 ? false : _d;
    var _e = (0, react_2.useState)(false), open = _e[0], setOpen = _e[1];
    var suppliers = (0, stores_1.useSuppliers)()[0];
    var submit = (0, react_router_1.useSubmit)();
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var fetchers = (0, react_router_1.useFetchers)();
    var canEdit = permissions.can("update", "quality") && !isDisabled;
    // Check for optimistic update
    var pendingUpdate = fetchers.find(function (f) {
        var _a;
        return ((_a = f.formData) === null || _a === void 0 ? void 0 : _a.get("id")) === task.id &&
            f.key === "supplierAssignment:".concat(task.id);
    });
    var currentSupplierId = (_c = (_b = pendingUpdate === null || pendingUpdate === void 0 ? void 0 : pendingUpdate.formData) === null || _b === void 0 ? void 0 : _b.get("supplierId")) !== null && _c !== void 0 ? _c : task.supplierId;
    var handleChange = function (supplierId) {
        var table = type === "investigation"
            ? "nonConformanceInvestigationTask"
            : "nonConformanceActionTask";
        submit({
            id: task.id,
            supplierId: supplierId || "",
            table: table
        }, {
            method: "post",
            action: path_1.path.to.issueTaskSupplier,
            navigate: false,
            fetcherKey: "supplierAssignment:".concat(task.id)
        });
        setOpen(false);
    };
    // Filter suppliers to only those passed in supplierIds
    var options = (0, react_2.useMemo)(function () {
        var filteredSuppliers = suppliers
            .filter(function (supplier) { return supplierIds.includes(supplier.id); })
            .map(function (supplier) { return ({
            value: supplier.id,
            label: supplier.name
        }); });
        return __spreadArray([{ value: "", label: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Unassigned"], ["Unassigned"]))) }], filteredSuppliers, true);
    }, [suppliers, supplierIds, t]);
    var isPending = pendingUpdate && (pendingUpdate === null || pendingUpdate === void 0 ? void 0 : pendingUpdate.state) !== "idle";
    return (<react_1.Popover open={open} onOpenChange={setOpen}>
      <react_1.PopoverTrigger asChild>
        <react_1.Button variant="secondary" size="sm" leftIcon={<lu_1.LuContainer />} isDisabled={isDisabled || !canEdit} isLoading={isPending}>
          {currentSupplierId ? (<SupplierAvatar_1.default supplierId={currentSupplierId} size="xxs" className="text-sm"/>) : (<span>
              <macro_1.Trans>Supplier</macro_1.Trans>
            </span>)}
        </react_1.Button>
      </react_1.PopoverTrigger>
      {canEdit && (<react_1.PopoverContent align="start" className="min-w-[var(--radix-popover-trigger-width)] p-0">
          <react_1.Command>
            <react_1.CommandInput placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Search suppliers..."], ["Search suppliers..."])))} className="h-9"/>
            <react_1.CommandEmpty>No supplier found.</react_1.CommandEmpty>
            <react_1.CommandGroup className="max-h-[300px] overflow-y-auto">
              {options.map(function (option) { return (<react_1.CommandItem value={option.label} key={option.value} onSelect={function () { return handleChange(option.value); }}>
                  {option.label}
                  <rx_1.RxCheck className={(0, react_1.cn)("ml-auto h-4 w-4", option.value === currentSupplierId
                    ? "opacity-100"
                    : "opacity-0")}/>
                </react_1.CommandItem>); })}
            </react_1.CommandGroup>
          </react_1.Command>
        </react_1.PopoverContent>)}
    </react_1.Popover>);
}
function TaskItem(_a) {
    var _b, _c;
    var task = _a.task, type = _a.type, suppliers = _a.suppliers, _d = _a.isDisabled, isDisabled = _d === void 0 ? false : _d, _e = _a.showDragHandle, showDragHandle = _e === void 0 ? false : _e, dragControls = _a.dragControls;
    (0, useRealtime_1.useRealtime)("nonConformanceActionTask", "id=eq.".concat(task.id));
    var t = (0, macro_1.useLingui)().t;
    var integrations = (0, useIntegrations_1.useIntegrations)();
    var permissions = (0, hooks_1.usePermissions)();
    var disclosure = (0, react_1.useDisclosure)({
        defaultIsOpen: true
    });
    var _f = useTaskStatus({
        task: task,
        type: type,
        disabled: isDisabled
    }), currentStatus = _f.currentStatus, onOperationStatusChange = _f.onOperationStatusChange;
    var statusAction = exports.statusActions[currentStatus];
    // Check if this action task has a linked Linear or Jira issue
    var hasLinearLink = type === "action" && !!task.linearIssue;
    var hasJiraLink = type === "action" && !!task.jiraIssue;
    var _g = useTaskNotes({
        initialContent: ((_b = task.notes) !== null && _b !== void 0 ? _b : {}),
        taskId: task.id,
        type: type,
        hasLinearLink: hasLinearLink,
        hasJiraLink: hasJiraLink
    }), content = _g.content, setContent = _g.setContent, onUpdateContent = _g.onUpdateContent, onUploadImage = _g.onUploadImage;
    var id = (0, react_router_1.useParams)().id;
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.issue(id));
    var submit = (0, react_router_1.useSubmit)();
    var hasStartedRef = (0, react_2.useRef)(false);
    var taskTitle = type === "action"
        ? task.name
        : task.title;
    if (type === "action" && task.supplierId) {
        taskTitle = "Supplier ".concat(taskTitle);
    }
    return (<div className="rounded-lg border w-full flex flex-col bg-card">
      <div className="flex w-full justify-between px-4 py-2 items-center">
        <div className="flex flex-col flex-1">
          <span className="text-base font-semibold tracking-tight">
            {taskTitle}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {showDragHandle && !isDisabled && dragControls && (<button className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1" onPointerDown={function (e) { return dragControls.start(e); }}>
              <lu_1.LuGripVertical size={16}/>
            </button>)}

          {/* @ts-expect-error TS2322 */}
          {integrations.has("linear") && <IssueDialog_2.LinearIssueDialog task={task}/>}
          {/* @ts-expect-error TS2322 */}
          {integrations.has("jira") && <IssueDialog_1.JiraIssueDialog task={task}/>}

          <react_1.IconButton icon={<lu_1.LuChevronRight />} variant="ghost" onClick={disclosure.onToggle} aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Open task details"], ["Open task details"])))} className={(0, react_1.cn)(disclosure.isOpen && "rotate-90")}/>
        </div>
      </div>

      {disclosure.isOpen && (<div className="px-4 py-2 rounded">
          {permissions.can("update", "quality") && !isDisabled ? (<Editor_1.Editor className="w-full min-h-[100px]" initialValue={content} onUpload={onUploadImage} onChange={function (value) {
                    var _a, _b;
                    setContent(value);
                    onUpdateContent(value);
                    // Auto-start issue when typing in task if issue status is "Registered"
                    if (((_a = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _a === void 0 ? void 0 : _a.status) === "Registered" &&
                        !hasStartedRef.current &&
                        ((_b = value === null || value === void 0 ? void 0 : value.content) === null || _b === void 0 ? void 0 : _b.some(function (node) { var _a; return ((_a = node.content) === null || _a === void 0 ? void 0 : _a.length) > 0; }))) {
                        hasStartedRef.current = true;
                        submit({ status: "In Progress" }, {
                            method: "post",
                            action: path_1.path.to.issueStatus(id),
                            navigate: false
                        });
                    }
                }}/>) : (<div className="prose dark:prose-invert" dangerouslySetInnerHTML={{
                    __html: (0, react_1.generateHTML)(content)
                }}/>)}
        </div>)}

      <div className="bg-muted/30 border-t px-4 py-2 flex justify-between w-full">
        <react_1.HStack>
          <IssueTaskStatus task={task} type="investigation" isDisabled={isDisabled}/>
          <components_1.Assignee table={getTable(type)} id={task.id} size="sm" value={(_c = task.assignee) !== null && _c !== void 0 ? _c : undefined} disabled={isDisabled}/>
          {type === "action" && (<>
              <TaskDueDate task={task} isDisabled={isDisabled}/>
              <TaskProcesses task={task} isDisabled={isDisabled}/>
            </>)}
          {(type === "investigation" || type === "action") && (<SupplierAssignment task={task} type={type} supplierIds={suppliers.map(function (s) { return s.supplierId; })} isDisabled={isDisabled}/>)}
        </react_1.HStack>
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
function useTaskNotes(_a) {
    var _this = this;
    var initialContent = _a.initialContent, taskId = _a.taskId, type = _a.type, _b = _a.hasLinearLink, hasLinearLink = _b === void 0 ? false : _b, _c = _a.hasJiraLink, hasJiraLink = _c === void 0 ? false : _c;
    var t = (0, macro_1.useLingui)().t;
    var _d = (0, hooks_1.useUser)(), userId = _d.id, companyId = _d.company.id;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _e = (0, react_2.useState)(initialContent !== null && initialContent !== void 0 ? initialContent : {}), content = _e[0], setContent = _e[1];
    var onUploadImage = function (file) { return __awaiter(_this, void 0, void 0, function () {
        var fileType, fileName, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileType = file.name.split(".").pop();
                    fileName = "".concat(companyId, "/parts/").concat((0, nanoid_1.nanoid)(), ".").concat(fileType);
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.storage.from("private").upload(fileName, file))];
                case 1:
                    result = _a.sent();
                    if (result === null || result === void 0 ? void 0 : result.error) {
                        react_1.toast.error(t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Failed to upload image"], ["Failed to upload image"]))));
                        throw new Error(result.error.message);
                    }
                    if (!(result === null || result === void 0 ? void 0 : result.data)) {
                        throw new Error("Failed to upload image");
                    }
                    return [2 /*return*/, (0, path_1.getPrivateUrl)(result.data.path)];
            }
        });
    }); };
    var table = getTable(type);
    var onUpdateContent = (0, react_1.useDebounce)(function (content) { return __awaiter(_this, void 0, void 0, function () {
        var e_1, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Update notes in Carbon database
                return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon
                    // @ts-expect-error -
                    .from(table).update({
                        notes: content,
                        updatedBy: userId
                    }).eq("id", taskId))];
                case 1:
                    // Update notes in Carbon database
                    _a.sent();
                    if (!(type === "action" && hasLinearLink)) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, fetch(path_1.path.to.api.linearSyncNotes, {
                            method: "POST",
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            body: new URLSearchParams({
                                actionId: taskId,
                                notes: JSON.stringify(content)
                            })
                        })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    // Silently fail Linear sync - not critical
                    console.error("Failed to sync notes to Linear:", e_1);
                    return [3 /*break*/, 5];
                case 5:
                    if (!(type === "action" && hasJiraLink)) return [3 /*break*/, 9];
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, fetch(path_1.path.to.api.jiraSyncNotes, {
                            method: "POST",
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            body: new URLSearchParams({
                                actionId: taskId,
                                notes: JSON.stringify(content)
                            })
                        })];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 8:
                    e_2 = _a.sent();
                    // Silently fail Jira sync - not critical
                    console.error("Failed to sync notes to Jira:", e_2);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); }, 2500, true);
    return {
        content: content,
        setContent: setContent,
        onUpdateContent: onUpdateContent,
        onUploadImage: onUploadImage
    };
}
function useOptimisticTaskStatus(taskId) {
    var _a;
    var fetchers = (0, react_router_1.useFetchers)();
    var pendingUpdate = fetchers.find(function (f) {
        var _a;
        return ((_a = f.formData) === null || _a === void 0 ? void 0 : _a.get("id")) === taskId &&
            f.key === "nonConformanceTask:".concat(taskId);
    });
    return (_a = pendingUpdate === null || pendingUpdate === void 0 ? void 0 : pendingUpdate.formData) === null || _a === void 0 ? void 0 : _a.get("status");
}
function useTaskStatus(_a) {
    var _b = _a.disabled, disabled = _b === void 0 ? false : _b, task = _a.task, type = _a.type, onChange = _a.onChange;
    var submit = (0, react_router_1.useSubmit)();
    var permissions = (0, hooks_1.usePermissions)();
    var optimisticStatus = useOptimisticTaskStatus(task.id);
    var isDisabled = !permissions.can("update", "production") || disabled;
    var onOperationStatusChange = (0, react_2.useCallback)(function (id, status) {
        var _a;
        onChange === null || onChange === void 0 ? void 0 : onChange(status);
        submit({
            id: id,
            status: status,
            type: type,
            assignee: (_a = task.assignee) !== null && _a !== void 0 ? _a : ""
        }, {
            method: "post",
            action: path_1.path.to.issueTaskStatus(id),
            navigate: false,
            fetcherKey: "nonConformanceTask:".concat(id)
        });
    }, [onChange, submit, task.assignee, type]);
    var currentStatus = optimisticStatus || task.status;
    return {
        currentStatus: currentStatus,
        onOperationStatusChange: onOperationStatusChange,
        isDisabled: isDisabled
    };
}
function IssueTaskStatus(_a) {
    var task = _a.task, type = _a.type, className = _a.className, onChange = _a.onChange, isDisabled = _a.isDisabled;
    var t = (0, macro_1.useLingui)().t;
    var _b = useTaskStatus({
        task: task,
        type: type,
        onChange: onChange,
        disabled: isDisabled
    }), currentStatus = _b.currentStatus, onOperationStatusChange = _b.onOperationStatusChange;
    return (<react_1.DropdownMenu>
      <react_1.DropdownMenuTrigger asChild>
        <react_1.IconButton size="sm" variant="ghost" className={className} aria-label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Change status"], ["Change status"])))} icon={<Icons_1.IssueTaskStatusIcon status={currentStatus}/>} isDisabled={isDisabled}/>
      </react_1.DropdownMenuTrigger>
      {!isDisabled && (<react_1.DropdownMenuContent align="start">
          <react_1.DropdownMenuRadioGroup value={currentStatus} onValueChange={function (status) {
                return onOperationStatusChange(task.id, status);
            }}>
            {quality_1.nonConformanceTaskStatus.map(function (status) { return (<react_1.DropdownMenuRadioItem key={status} value={status}>
                <react_1.DropdownMenuIcon icon={<Icons_1.IssueTaskStatusIcon status={status}/>}/>
                <span>{status}</span>
              </react_1.DropdownMenuRadioItem>); })}
          </react_1.DropdownMenuRadioGroup>
        </react_1.DropdownMenuContent>)}
    </react_1.DropdownMenu>);
}
function getTable(type) {
    switch (type) {
        case "investigation":
            return "nonConformanceInvestigationTask";
        case "action":
            return "nonConformanceActionTask";
        case "approval":
            return "nonConformanceApprovalTask";
        case "review":
            return "nonConformanceReviewer";
    }
}
function TaskDueDate(_a) {
    var _b, _c;
    var task = _a.task, isDisabled = _a.isDisabled;
    var t = (0, macro_1.useLingui)().t;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var submit = (0, react_router_1.useSubmit)();
    var _d = (0, react_2.useState)(false), isOpen = _d[0], setIsOpen = _d[1];
    var permissions = (0, hooks_1.usePermissions)();
    var canEdit = permissions.can("update", "quality") && !isDisabled;
    var fetchers = (0, react_router_1.useFetchers)();
    var pendingUpdate = fetchers.find(function (f) {
        var _a;
        return ((_a = f.formData) === null || _a === void 0 ? void 0 : _a.get("id")) === task.id &&
            f.key === "nonConformanceTask:".concat(task.id);
    });
    var pendingValue = (_c = (_b = pendingUpdate === null || pendingUpdate === void 0 ? void 0 : pendingUpdate.formData) === null || _b === void 0 ? void 0 : _b.get("dueDate")) !== null && _c !== void 0 ? _c : task.dueDate;
    var handleDateChange = function (date) {
        submit({
            id: task.id,
            dueDate: date || ""
        }, {
            method: "post",
            action: path_1.path.to.issueActionDueDate(task.id),
            navigate: false,
            fetcherKey: "nonConformanceTask:".concat(task.id)
        });
    };
    if (!canEdit) {
        return (<react_1.Button variant="secondary" size="sm" leftIcon={<lu_1.LuCalendar />} isDisabled>
        <span>{task.dueDate ? formatDate(task.dueDate) : t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["No due date"], ["No due date"])))}</span>
      </react_1.Button>);
    }
    return (<react_1.Popover open={isOpen} onOpenChange={setIsOpen}>
      <react_1.PopoverTrigger disabled={isDisabled} asChild>
        <react_1.Button variant="secondary" size="sm" leftIcon={<lu_1.LuCalendar />} isDisabled={isDisabled}>
          {pendingValue ? formatDate(String(pendingValue)) : t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Due Date"], ["Due Date"])))}
        </react_1.Button>
      </react_1.PopoverTrigger>
      <react_1.PopoverContent className="w-auto p-3" align="start">
        <div className="space-y-2">
          <react_1.DatePicker value={pendingValue ? (0, date_1.parseDate)(String(pendingValue)) : null} onChange={function (date) { return handleDateChange((date === null || date === void 0 ? void 0 : date.toString()) || null); }}/>
          {pendingValue && (<react_1.Button variant="secondary" size="sm" onClick={function () { return handleDateChange(null); }} className="w-full">
              <macro_1.Trans>Clear due date</macro_1.Trans>
            </react_1.Button>)}
        </div>
      </react_1.PopoverContent>
    </react_1.Popover>);
}
function TaskProcesses(_a) {
    var _b;
    var task = _a.task, isDisabled = _a.isDisabled;
    var t = (0, macro_1.useLingui)().t;
    var submit = (0, react_router_1.useSubmit)();
    var _c = (0, react_2.useState)(false), isOpen = _c[0], setIsOpen = _c[1];
    var permissions = (0, hooks_1.usePermissions)();
    var processOptions = (0, Process_1.useProcesses)();
    // Get current process IDs from the task (memoized to prevent unnecessary re-renders)
    var currentProcessIds = (0, react_2.useMemo)(function () { var _a, _b; return (_b = (_a = task.nonConformanceActionProcess) === null || _a === void 0 ? void 0 : _a.map(function (p) { return p.processId; })) !== null && _b !== void 0 ? _b : []; }, [task.nonConformanceActionProcess]);
    // Local state for immediate UI updates
    var _d = (0, react_2.useState)(currentProcessIds), localProcessIds = _d[0], setLocalProcessIds = _d[1];
    // Sync local state when task data changes (after revalidation)
    (0, react_2.useEffect)(function () {
        setLocalProcessIds(currentProcessIds);
    }, [currentProcessIds]);
    var canEdit = permissions.can("update", "quality") && !isDisabled;
    var fetchers = (0, react_router_1.useFetchers)();
    var pendingUpdate = fetchers.find(function (f) {
        var _a;
        return ((_a = f.json) === null || _a === void 0 ? void 0 : _a.id) === task.id &&
            f.key === "nonConformanceTaskProcesses:".concat(task.id);
    });
    var pendingProcessIds = (_b = pendingUpdate === null || pendingUpdate === void 0 ? void 0 : pendingUpdate.json) === null || _b === void 0 ? void 0 : _b.processIds;
    var activeProcessIds = pendingProcessIds !== null && pendingProcessIds !== void 0 ? pendingProcessIds : localProcessIds;
    var handleProcessToggle = function (processId) {
        var newProcessIds = activeProcessIds.includes(processId)
            ? activeProcessIds.filter(function (id) { return id !== processId; })
            : __spreadArray(__spreadArray([], activeProcessIds, true), [processId], false);
        // Update local state immediately for instant UI feedback
        setLocalProcessIds(newProcessIds);
        submit({
            id: task.id,
            processIds: newProcessIds
        }, {
            method: "post",
            action: path_1.path.to.issueActionProcesses(task.id),
            navigate: false,
            fetcherKey: "nonConformanceTaskProcesses:".concat(task.id),
            encType: "application/json"
        });
    };
    var selectedProcesses = processOptions.filter(function (p) {
        return activeProcessIds.includes(p.value);
    });
    var buttonLabel = selectedProcesses.length === 0
        ? t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Processes"], ["Processes"]))) : selectedProcesses.length === 1
        ? selectedProcesses[0].label
        : t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["", " Processes"], ["", " Processes"])), selectedProcesses.length);
    if (!canEdit) {
        return (<react_1.Button variant="secondary" size="sm" leftIcon={<lu_1.LuCog />} isDisabled>
        <span>{buttonLabel}</span>
      </react_1.Button>);
    }
    return (<react_1.Popover open={isOpen} onOpenChange={setIsOpen}>
      <react_1.PopoverTrigger disabled={isDisabled} asChild>
        <react_1.Button variant="secondary" size="sm" leftIcon={<lu_1.LuCog />} isDisabled={isDisabled}>
          {buttonLabel}
        </react_1.Button>
      </react_1.PopoverTrigger>
      <react_1.PopoverContent className="w-[250px] p-0" align="start">
        <react_1.Command>
          <react_1.CommandInput placeholder={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Search processes..."], ["Search processes..."])))} className="h-9"/>
          <react_1.CommandEmpty>No process found.</react_1.CommandEmpty>
          <react_1.CommandGroup className="max-h-[300px] overflow-y-auto">
            {processOptions.map(function (option) { return (<react_1.CommandItem key={option.value} value={option.label} onSelect={function () { return handleProcessToggle(option.value); }}>
                <div className={(0, react_1.cn)("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", activeProcessIds.includes(option.value)
                ? "bg-primary text-primary-foreground"
                : "opacity-50 [&_svg]:invisible")}>
                  <rx_1.RxCheck className="h-4 w-4"/>
                </div>
                <span>{option.label}</span>
              </react_1.CommandItem>); })}
          </react_1.CommandGroup>
        </react_1.Command>
      </react_1.PopoverContent>
    </react_1.Popover>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
