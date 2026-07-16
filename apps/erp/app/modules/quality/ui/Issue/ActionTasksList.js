"use strict";
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
exports.ActionTasksList = ActionTasksList;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var IssueTask_1 = require("./IssueTask");
function ReorderableTaskItem(_a) {
    var taskId = _a.taskId, task = _a.task, suppliers = _a.suppliers, isDisabled = _a.isDisabled;
    var dragControls = (0, framer_motion_1.useDragControls)();
    return (<framer_motion_1.Reorder.Item key={taskId} value={taskId} dragListener={false} dragControls={dragControls}>
      <IssueTask_1.TaskItem task={task} type="action" suppliers={suppliers} isDisabled={isDisabled} showDragHandle={true} dragControls={dragControls}/>
    </framer_motion_1.Reorder.Item>);
}
function ActionTasksList(_a) {
    var tasks = _a.tasks, suppliers = _a.suppliers, isDisabled = _a.isDisabled;
    var sortOrderFetcher = (0, react_router_1.useFetcher)();
    // Initialize sort order state based on existing tasks
    var _b = (0, react_2.useState)(function () {
        return __spreadArray([], tasks, true).sort(function (a, b) { var _a, _b; return ((_a = a.sortOrder) !== null && _a !== void 0 ? _a : 0) - ((_b = b.sortOrder) !== null && _b !== void 0 ? _b : 0); })
            .map(function (task) { return task.id; });
    }), sortOrder = _b[0], setSortOrder = _b[1];
    // Update sort order when tasks change
    (0, react_2.useEffect)(function () {
        if (tasks && tasks.length > 0) {
            var sorted = __spreadArray([], tasks, true).sort(function (a, b) { var _a, _b; return ((_a = a.sortOrder) !== null && _a !== void 0 ? _a : 0) - ((_b = b.sortOrder) !== null && _b !== void 0 ? _b : 0); })
                .map(function (task) { return task.id; });
            setSortOrder(sorted);
        }
    }, [tasks]);
    var onReorder = function (newOrder) {
        if (isDisabled)
            return;
        var updates = {};
        newOrder.forEach(function (id, index) {
            updates[id] = index + 1;
        });
        setSortOrder(newOrder);
        updateSortOrder(updates);
    };
    var updateSortOrder = (0, react_1.useDebounce)(function (updates) {
        var formData = new FormData();
        formData.append("updates", JSON.stringify(updates));
        sortOrderFetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.issueActionTasksOrder
        });
    }, 1000, true);
    if (tasks.length === 0)
        return <NewAction isDisabled={isDisabled}/>;
    return (<react_1.Card className="w-full" isCollapsible>
      <react_1.HStack className="justify-between w-full">
        <react_1.CardHeader>
          <react_1.CardTitle className="flex items-center gap-2">
            <macro_1.Trans>Actions</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>
        <IssueTask_1.TaskProgress tasks={tasks}/>
      </react_1.HStack>
      <react_1.CardContent>
        <framer_motion_1.Reorder.Group axis="y" values={sortOrder} onReorder={onReorder} className="w-full space-y-3">
          {sortOrder.map(function (taskId) {
            var task = tasks.find(function (t) { return t.id === taskId; });
            if (!task)
                return null;
            return (<ReorderableTaskItem key={taskId} taskId={taskId} task={task} suppliers={suppliers} isDisabled={isDisabled}/>);
        })}
        </framer_motion_1.Reorder.Group>
      </react_1.CardContent>
    </react_1.Card>);
}
function NewAction(_a) {
    var isDisabled = _a.isDisabled;
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("id not found");
    var _b = (0, react_2.useState)(false), isOpen = _b[0], setIsOpen = _b[1];
    var _c = (0, react_2.useState)([]), selectedActionIds = _c[0], setSelectedActionIds = _c[1];
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.issue(id));
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        if (fetcher.state === "idle" && fetcher.data) {
            setIsOpen(false);
            setSelectedActionIds([]);
        }
    }, [fetcher.state, fetcher.data]);
    var handleSubmit = (0, react_2.useCallback)(function () {
        var formData = new FormData();
        formData.append("ids", id);
        formData.append("field", "requiredActionIds");
        formData.append("value", selectedActionIds.join(","));
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.bulkUpdateIssue
        });
    }, [id, selectedActionIds, fetcher]);
    var handleCheckboxChange = (0, react_2.useCallback)(function (actionId, checked) {
        setSelectedActionIds(function (prev) {
            return checked ? __spreadArray(__spreadArray([], prev, true), [actionId], false) : prev.filter(function (id) { return id !== actionId; });
        });
    }, []);
    return (<>
      <button className="flex items-center justify-start bg-card border-2 border-dashed border-background w-full hover:bg-background/80 rounded-lg px-10 py-6 text-muted-foreground hover:text-foreground gap-2 transition-colors duration-200 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" onClick={function () { return setIsOpen(true); }} disabled={isDisabled}>
        <lu_1.LuCirclePlus size={16}/> <span>Add Actions</span>
      </button>

      <react_1.Modal open={isOpen} onOpenChange={function (open) {
            if (!open) {
                setIsOpen(false);
                setSelectedActionIds([]);
            }
        }}>
        <react_1.ModalOverlay />
        <react_1.ModalContent>
          <react_1.ModalHeader>
            <react_1.ModalTitle>
              <macro_1.Trans>Add Required Actions</macro_1.Trans>
            </react_1.ModalTitle>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <react_1.VStack spacing={2}>
              {routeData === null || routeData === void 0 ? void 0 : routeData.requiredActions.map(function (action) { return (<label key={action.id} htmlFor={action.id} className="flex items-center gap-2 w-full px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground border border-border cursor-pointer">
                  <react_1.Checkbox id={action.id} isChecked={selectedActionIds.includes(action.id)} onCheckedChange={function (checked) {
                return handleCheckboxChange(action.id, !!checked);
            }}/>
                  <span className="text-sm font-medium">{action.name}</span>
                </label>); })}
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.Button variant="secondary" onClick={function () {
            setIsOpen(false);
            setSelectedActionIds([]);
        }}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <react_1.Button onClick={handleSubmit} disabled={selectedActionIds.length === 0 || fetcher.state !== "idle"} isLoading={fetcher.state === "submitting"}>
              {fetcher.state !== "idle" ? (<macro_1.Trans>Adding...</macro_1.Trans>) : (<macro_1.Trans>Add Actions</macro_1.Trans>)}
            </react_1.Button>
          </react_1.ModalFooter>
        </react_1.ModalContent>
      </react_1.Modal>
    </>);
}
