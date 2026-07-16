"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var resources_1 = require("~/modules/resources");
var path_1 = require("~/utils/path");
function StatusBadge(_a) {
    var status = _a.status;
    switch (status) {
        case "Completed":
            return (<react_1.Badge variant="green">
          <lu_1.LuCircleCheck className="mr-1"/>
          Completed
        </react_1.Badge>);
        case "Pending":
            return (<react_1.Badge variant="secondary">
          <lu_1.LuClock className="mr-1"/>
          Pending
        </react_1.Badge>);
        case "Overdue":
            return (<react_1.Badge variant="red">
          <lu_1.LuTriangleAlert className="mr-1"/>
          Overdue
        </react_1.Badge>);
        case "Not Required":
            return <react_1.Badge variant="outline">Not Required</react_1.Badge>;
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
                  Started{" "}
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
                <macro_1.Trans>Mark Complete</macro_1.Trans>
              </react_1.Button>
            </fetcher.Form>)}
        </react_1.HStack>
      </div>
    </div>);
}
var StatusList = (0, react_2.memo)(function (_a) {
    var data = _a.data, currentPeriod = _a.currentPeriod;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var _b = (0, react_2.useState)(""), search = _b[0], setSearch = _b[1];
    var _c = (0, react_2.useState)("All"), statusFilter = _c[0], setStatusFilter = _c[1];
    var filteredAssignments = (0, react_2.useMemo)(function () {
        return data.filter(function (assignment) {
            var _a, _b;
            var matchesSearch = (_b = (search === "" ||
                ((_a = assignment.employeeName) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(search.toLowerCase())))) !== null && _b !== void 0 ? _b : false;
            var matchesStatus = statusFilter === "All" || assignment.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [data, search, statusFilter]);
    var statusCounts = (0, react_2.useMemo)(function () {
        return data.reduce(function (acc, assignment) {
            acc[assignment.status] = (acc[assignment.status] || 0) + 1;
            return acc;
        }, {});
    }, [data]);
    return (<react_1.VStack spacing={0} className="h-full w-full">
        <div className="flex flex-col gap-4 w-full">
          <div className="relative">
            <lu_1.LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"/>
            <react_1.Input placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Search employees..."], ["Search employees..."])))} value={search} onChange={function (e) { return setSearch(e.target.value); }} className="pl-9"/>
          </div>
          <react_1.ToggleGroup type="single" value={statusFilter} onValueChange={function (value) {
            if (value)
                setStatusFilter(value);
        }} className="justify-start flex-wrap">
            <react_1.ToggleGroupItem className="flex gap-1.5 items-center" size="sm" value="All">
              All <react_1.Count count={data.length}/>
            </react_1.ToggleGroupItem>
            <react_1.ToggleGroupItem className="flex gap-1.5 items-center" size="sm" value="Completed">
              <lu_1.LuCircleCheck className="mr-1 size-3"/>
              Completed{" "}
              {/** biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration */}
              <react_1.Count count={statusCounts["Completed"] || 0}/>
            </react_1.ToggleGroupItem>
            <react_1.ToggleGroupItem className="flex gap-1.5 items-center" size="sm" value="Pending">
              <lu_1.LuClock className="mr-1 size-3"/>
              Pending{" "}
              {/** biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration */}
              <react_1.Count count={statusCounts["Pending"] || 0}/>
            </react_1.ToggleGroupItem>
            <react_1.ToggleGroupItem className="flex gap-1.5 items-center" size="sm" value="Overdue">
              <lu_1.LuTriangleAlert className="mr-1 size-3"/>
              Overdue{" "}
              {/** biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration */}
              <react_1.Count count={statusCounts["Overdue"] || 0}/>
            </react_1.ToggleGroupItem>
            <react_1.ToggleGroupItem className="flex gap-1.5 items-center" size="sm" value="Not Required">
              Not Required <react_1.Count count={statusCounts["Not Required"] || 0}/>
            </react_1.ToggleGroupItem>
          </react_1.ToggleGroup>
        </div>
        <div className="flex-1 overflow-y-auto w-full pt-4">
          {filteredAssignments.length > 0 ? (<div className="border rounded-lg w-full">
              {filteredAssignments.map(function (assignment, index) { return (<AssignmentListItem key={"".concat(assignment.employeeId, "-").concat(assignment.trainingAssignmentId)} assignment={assignment} currentPeriod={currentPeriod} disabled={!permissions.can("update", "resources")} isLast={index === filteredAssignments.length - 1}/>); })}
            </div>) : (<div className="flex items-center justify-center h-full text-muted-foreground p-8">
              <react_1.VStack spacing={2} className="w-full items-center justify-center">
                <components_1.Empty>
                  <macro_1.Trans>No employees found</macro_1.Trans>
                </components_1.Empty>
                {search && (<react_1.Button variant="ghost" size="sm" onClick={function () { return setSearch(""); }}>
                    <macro_1.Trans>Clear search</macro_1.Trans>
                  </react_1.Button>)}
              </react_1.VStack>
            </div>)}
        </div>
      </react_1.VStack>);
});
StatusList.displayName = "StatusList";
var TrainingAssignmentForm = function (_a) {
    var initialValues = _a.initialValues, trainings = _a.trainings, _b = _a.assignmentStatus, assignmentStatus = _b === void 0 ? [] : _b, _c = _a.currentPeriod, currentPeriod = _c === void 0 ? null : _c, _d = _a.open, open = _d === void 0 ? true : _d, onClose = _a.onClose;
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "resources")
        : !permissions.can("create", "resources");
    var _e = (0, react_2.useState)("details"), activeTab = _e[0], setActiveTab = _e[1];
    // Drawer grows when status tab is visible
    var drawerSize = activeTab === "status" ? "lg" : undefined;
    return (<react_1.ModalDrawerProvider type="drawer">
      <react_1.ModalDrawer open={open} onOpenChange={function (open) {
            if (!open)
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
        <react_1.ModalDrawerContent size={drawerSize}>
          <react_1.Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <form_1.ValidatedForm method="post" validator={resources_1.trainingAssignmentValidator} defaultValues={initialValues} fetcher={fetcher} action={isEditing
            ? path_1.path.to.trainingAssignment(initialValues.id)
            : path_1.path.to.newTrainingAssignment} className="flex flex-col h-full">
              <react_1.ModalDrawerHeader className="flex flex-col gap-4">
                <react_1.HStack className="w-full justify-between pr-8">
                  <react_1.VStack>
                    <react_1.ModalDrawerTitle>
                      {isEditing ? (<macro_1.Trans>Edit Assignment</macro_1.Trans>) : (<macro_1.Trans>New Assignment</macro_1.Trans>)}
                    </react_1.ModalDrawerTitle>
                  </react_1.VStack>

                  {isEditing && (<div>
                      <react_1.TabsList>
                        <react_1.TabsTrigger value="details">
                          <macro_1.Trans>Details</macro_1.Trans>
                        </react_1.TabsTrigger>
                        <react_1.TabsTrigger value="status">
                          <macro_1.Trans>Status</macro_1.Trans>
                        </react_1.TabsTrigger>
                      </react_1.TabsList>
                    </div>)}
                </react_1.HStack>
              </react_1.ModalDrawerHeader>
              <react_1.ModalDrawerBody className="w-full">
                <Form_1.Hidden name="id"/>

                {isEditing ? (<>
                    <react_1.TabsContent value="details" className="w-full">
                      <AssignmentFormContent trainings={trainings} isEditing={isEditing}/>
                    </react_1.TabsContent>
                    <react_1.TabsContent value="status" className="w-full flex flex-col gap-4">
                      {assignmentStatus.length > 0 ? (<StatusList data={assignmentStatus} currentPeriod={currentPeriod}/>) : (<div className="py-8 text-center text-muted-foreground">
                          <macro_1.Trans>
                            No employees assigned yet. Add groups to see status.
                          </macro_1.Trans>
                        </div>)}
                    </react_1.TabsContent>
                  </>) : (<AssignmentFormContent trainings={trainings} isEditing={isEditing}/>)}
              </react_1.ModalDrawerBody>
              <react_1.ModalDrawerFooter>
                <react_1.HStack>
                  <Form_1.Submit isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle" || isDisabled}>
                    <macro_1.Trans>Save</macro_1.Trans>
                  </Form_1.Submit>
                  <react_1.Button size="md" variant="solid" onClick={onClose}>
                    <macro_1.Trans>Cancel</macro_1.Trans>
                  </react_1.Button>
                </react_1.HStack>
              </react_1.ModalDrawerFooter>
            </form_1.ValidatedForm>
          </react_1.Tabs>
        </react_1.ModalDrawerContent>
      </react_1.ModalDrawer>
    </react_1.ModalDrawerProvider>);
};
function AssignmentFormContent(_a) {
    var trainings = _a.trainings, isEditing = _a.isEditing;
    var t = (0, macro_1.useLingui)().t;
    return (<react_1.VStack spacing={4}>
      <form_1.Select name="trainingId" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Training"], ["Training"])))} isReadOnly={isEditing} options={trainings.map(function (training) {
            var _a, _b;
            return ({
                label: (_a = training.name) !== null && _a !== void 0 ? _a : "",
                value: (_b = training.id) !== null && _b !== void 0 ? _b : ""
            });
        })}/>
      <Form_1.Users name="groupIds" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Assign to Groups"], ["Assign to Groups"])))} type="employee" helperText={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Select the groups that should complete this training"], ["Select the groups that should complete this training"])))}/>
    </react_1.VStack>);
}
exports.default = TrainingAssignmentForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
