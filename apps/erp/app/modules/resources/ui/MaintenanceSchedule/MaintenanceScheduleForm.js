"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var bs_1 = require("react-icons/bs");
var react_router_1 = require("react-router");
var HighPriorityIcon_1 = require("~/assets/icons/HighPriorityIcon");
var LowPriorityIcon_1 = require("~/assets/icons/LowPriorityIcon");
var MediumPriorityIcon_1 = require("~/assets/icons/MediumPriorityIcon");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var productionLabels_1 = require("~/modules/production/productionLabels");
var path_1 = require("~/utils/path");
var resources_models_1 = require("../../resources.models");
function getPriorityIcon(priority) {
    switch (priority) {
        case "Critical":
            return <bs_1.BsExclamationSquareFill className="text-red-500"/>;
        case "High":
            return <HighPriorityIcon_1.HighPriorityIcon />;
        case "Medium":
            return <MediumPriorityIcon_1.MediumPriorityIcon />;
        case "Low":
            return <LowPriorityIcon_1.LowPriorityIcon />;
    }
}
// Component to show day selector and skip holidays when Daily frequency is selected
function DailyScheduleOptions() {
    var t = (0, macro_1.useLingui)().t;
    var frequency = (0, form_1.useControlField)("frequency")[0];
    var isDaily = frequency === "Daily";
    if (!isDaily)
        return null;
    return (<>
      <react_1.FormControl>
        <react_1.FormLabel>
          <macro_1.Trans>Days</macro_1.Trans>
        </react_1.FormLabel>
        <react_1.VStack>
          <form_1.Boolean name="monday" description={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Monday"], ["Monday"])))}/>
          <form_1.Boolean name="tuesday" description={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Tuesday"], ["Tuesday"])))}/>
          <form_1.Boolean name="wednesday" description={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Wednesday"], ["Wednesday"])))}/>
          <form_1.Boolean name="thursday" description={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Thursday"], ["Thursday"])))}/>
          <form_1.Boolean name="friday" description={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Friday"], ["Friday"])))}/>
          <form_1.Boolean name="saturday" description={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Saturday"], ["Saturday"])))}/>
          <form_1.Boolean name="sunday" description={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Sunday"], ["Sunday"])))}/>
        </react_1.VStack>
      </react_1.FormControl>
      <form_1.Boolean name="skipHolidays" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Skip Holidays"], ["Skip Holidays"])))} description={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Skip scheduled maintenance on company holidays"], ["Skip scheduled maintenance on company holidays"])))}/>
    </>);
}
var MaintenanceScheduleForm = function (_a) {
    var initialValues = _a.initialValues, _b = _a.open, open = _b === void 0 ? true : _b, _c = _a.type, type = _c === void 0 ? "drawer" : _c, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var getMaintenanceFrequencyLabel = (0, productionLabels_1.useMaintenanceFrequencyLabel)();
    var getMaintenanceDispatchPriorityLabel = (0, productionLabels_1.useMaintenanceDispatchPriorityLabel)();
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (type !== "modal")
            return;
        if (fetcher.state === "loading" && ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data)) {
            onClose === null || onClose === void 0 ? void 0 : onClose();
            react_1.toast.success(t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Created maintenance schedule"], ["Created maintenance schedule"]))));
        }
        else if (fetcher.state === "idle" && ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.error)) {
            react_1.toast.error(t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Failed to create maintenance schedule: ", ""], ["Failed to create maintenance schedule: ", ""])), fetcher.data.error.message));
        }
    }, [fetcher.data, fetcher.state, onClose, type, t]);
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "production")
        : !permissions.can("create", "production");
    return (<react_1.ModalDrawerProvider type={type}>
      <react_1.ModalDrawer open={open} onOpenChange={function (open) {
            if (!open)
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm validator={resources_models_1.maintenanceScheduleValidator} method="post" action={isEditing
            ? path_1.path.to.maintenanceSchedule(initialValues.id)
            : path_1.path.to.newMaintenanceSchedule} defaultValues={initialValues} fetcher={fetcher} className="flex flex-col h-full">
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>
                {isEditing ? (<macro_1.Trans>Edit Scheduled Maintenance</macro_1.Trans>) : (<macro_1.Trans>New Scheduled Maintenance</macro_1.Trans>)}
              </react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <Form_1.Hidden name="id"/>
              <Form_1.Hidden name="type" value={type}/>
              <react_1.VStack spacing={4}>
                <Form_1.Input name="name" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Schedule Name"], ["Schedule Name"])))}/>
                <Form_1.WorkCenter name="workCenterId" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Work Center"], ["Work Center"])))}/>
                <Form_1.Location name="locationId" label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Location"], ["Location"])))}/>
                <form_1.Select name="frequency" label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Frequency"], ["Frequency"])))} options={resources_models_1.maintenanceFrequency.map(function (freq) { return ({
            value: freq,
            label: getMaintenanceFrequencyLabel(freq)
        }); })}/>
                <form_1.Select name="priority" label={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Priority"], ["Priority"])))} options={resources_models_1.maintenanceDispatchPriority.map(function (priority) { return ({
            value: priority,
            label: (<div className="flex gap-1 items-center">
                        {getPriorityIcon(priority)}
                        <span>
                          {getMaintenanceDispatchPriorityLabel(priority)}
                        </span>
                      </div>)
        }); })}/>
                <form_1.Number name="estimatedDuration" label={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Estimated Duration (minutes)"], ["Estimated Duration (minutes)"])))} minValue={0}/>
                <Form_1.Procedure name="procedureId"/>
                <form_1.Boolean name="active" label={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Active"], ["Active"])))}/>
                <DailyScheduleOptions />
              </react_1.VStack>
            </react_1.ModalDrawerBody>
            <react_1.ModalDrawerFooter>
              <react_1.HStack>
                <Form_1.Submit isDisabled={isDisabled}>
                  <macro_1.Trans>Save</macro_1.Trans>
                </Form_1.Submit>
                <react_1.Button size="md" variant="solid" onClick={function () { return onClose(); }}>
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
              </react_1.HStack>
            </react_1.ModalDrawerFooter>
          </form_1.ValidatedForm>
        </react_1.ModalDrawerContent>
      </react_1.ModalDrawer>
    </react_1.ModalDrawerProvider>);
};
exports.default = MaintenanceScheduleForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18;
