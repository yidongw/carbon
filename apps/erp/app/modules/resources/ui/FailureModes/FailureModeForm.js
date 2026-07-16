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
var Enumerable_1 = require("~/components/Enumerable");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var resources_models_1 = require("../../resources.models");
var FailureModeForm = function (_a) {
    var initialValues = _a.initialValues, _b = _a.open, open = _b === void 0 ? true : _b, _c = _a.type, type = _c === void 0 ? "drawer" : _c, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (type !== "modal")
            return;
        if (fetcher.state === "loading" && ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data)) {
            onClose === null || onClose === void 0 ? void 0 : onClose();
            react_1.toast.success(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Created failure mode"], ["Created failure mode"]))));
        }
        else if (fetcher.state === "idle" && ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.error)) {
            react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to create failure mode: ", ""], ["Failed to create failure mode: ", ""])), fetcher.data.error.message));
        }
    }, [fetcher.data, fetcher.state, onClose, type, t]);
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "resources")
        : !permissions.can("create", "resources");
    return (<react_1.ModalDrawerProvider type={type}>
      <react_1.ModalDrawer open={open} onOpenChange={function (open) {
            if (!open)
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm validator={resources_models_1.failureModeValidator} method="post" action={isEditing
            ? path_1.path.to.failureMode(initialValues.id)
            : path_1.path.to.newFailureMode} defaultValues={initialValues} fetcher={fetcher} className="flex flex-col h-full">
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>
                {isEditing ? (<macro_1.Trans>Edit Failure Mode</macro_1.Trans>) : (<macro_1.Trans>New Failure Mode</macro_1.Trans>)}
              </react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <Form_1.Hidden name="id"/>
              <Form_1.Hidden name="formType" value={type}/>
              <react_1.VStack spacing={4}>
                <Form_1.Input name="name" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Failure Mode"], ["Failure Mode"])))}/>
                <Form_1.Select name="type" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Type"], ["Type"])))} options={resources_models_1.maintenanceFailureModeType.map(function (t) { return ({
            value: t,
            label: <Enumerable_1.Enumerable value={t}/>
        }); })}/>
                <Form_1.CustomFormFields table="maintenanceFailureMode"/>
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
exports.default = FailureModeForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
