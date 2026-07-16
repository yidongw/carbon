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
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var resources_1 = require("~/modules/resources");
var path_1 = require("~/utils/path");
var WorkCenterForm = function (_a) {
    var _b;
    var initialValues = _a.initialValues, _c = _a.open, open = _c === void 0 ? true : _c, _d = _a.type, type = _d === void 0 ? "drawer" : _d, _e = _a.showProcesses, showProcesses = _e === void 0 ? true : _e, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    var company = (0, hooks_1.useUser)().company;
    var baseCurrency = (_b = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _b !== void 0 ? _b : "USD";
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (type !== "modal")
            return;
        if (fetcher.state === "loading" && ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data)) {
            onClose === null || onClose === void 0 ? void 0 : onClose();
            react_1.toast.success(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Created work center"], ["Created work center"]))));
        }
        else if (fetcher.state === "idle" && ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.error)) {
            react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to create work center: ", ""], ["Failed to create work center: ", ""])), fetcher.data.error.message));
        }
    }, [fetcher.data, fetcher.state, onClose, type, t]);
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "resources")
        : !permissions.can("create", "resources");
    return (<react_1.ModalDrawerProvider type={type}>
      <react_1.ModalDrawer open={open} onOpenChange={function (isOpen) {
            if (!isOpen)
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm validator={resources_1.workCenterValidator} method="post" action={isEditing
            ? path_1.path.to.workCenter(initialValues.id)
            : path_1.path.to.newWorkCenter} defaultValues={initialValues} fetcher={fetcher} className="flex flex-col h-full">
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>
                {isEditing ? (<macro_1.Trans>Edit Work Center</macro_1.Trans>) : (<macro_1.Trans>New Work Center</macro_1.Trans>)}
              </react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <Form_1.Hidden name="id"/>
              <Form_1.Hidden name="type" value={type}/>
              <react_1.VStack spacing={4}>
                <Form_1.Input name="name" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Name"], ["Name"])))}/>
                {showProcesses && (<Form_1.Processes name="processes" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Processes"], ["Processes"])))}/>)}
                <Form_1.TextArea name="description" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Description"], ["Description"])))}/>
                <Form_1.Location name="locationId" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Location"], ["Location"])))}/>
                <Form_1.Department name="departmentId" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Department"], ["Department"])))}/>

                <Form_1.Number name="laborRate" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Labor Rate (Hourly)"], ["Labor Rate (Hourly)"])))} formatOptions={{
            style: "currency",
            currency: baseCurrency
        }}/>
                <Form_1.Number name="machineRate" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Machine Rate (Hourly)"], ["Machine Rate (Hourly)"])))} formatOptions={{
            style: "currency",
            currency: baseCurrency
        }}/>
                <Form_1.Number name="overheadRate" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Overhead Rate (Hourly)"], ["Overhead Rate (Hourly)"])))} formatOptions={{
            style: "currency",
            currency: baseCurrency
        }}/>

                <Form_1.StandardFactor name="defaultStandardFactor" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Default Unit"], ["Default Unit"])))} value={initialValues.defaultStandardFactor}/>
                {/* <Ability
          name="requiredAbilityId"
          label="Required Ability"
          isClearable
        /> */}
                <Form_1.CustomFormFields table="workCenter"/>
              </react_1.VStack>
            </react_1.ModalDrawerBody>
            <react_1.ModalDrawerFooter>
              <react_1.HStack>
                <Form_1.Submit isDisabled={isDisabled}>
                  <macro_1.Trans>Save</macro_1.Trans>
                </Form_1.Submit>
                <react_1.Button size="md" variant="solid" onClick={function () { return onClose === null || onClose === void 0 ? void 0 : onClose(); }}>
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
              </react_1.HStack>
            </react_1.ModalDrawerFooter>
          </form_1.ValidatedForm>
        </react_1.ModalDrawerContent>
      </react_1.ModalDrawer>
    </react_1.ModalDrawerProvider>);
};
exports.default = WorkCenterForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11;
