"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var style_models_1 = require("../../style.models");
var StyleSizeForm = function (_a) {
    var initialValues = _a.initialValues, _b = _a.open, open = _b === void 0 ? true : _b, _c = _a.type, type = _c === void 0 ? "drawer" : _c, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "parts")
        : !permissions.can("create", "parts");
    return (<react_1.ModalDrawerProvider type={type}>
      <react_1.ModalDrawer open={open} onOpenChange={function (open) {
            if (!open)
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm validator={style_models_1.styleSizeValidator} method="post" action={isEditing
            ? path_1.path.to.styleSize(initialValues.id)
            : path_1.path.to.newStyleSize} defaultValues={initialValues} fetcher={fetcher} className="flex flex-col h-full">
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>
                {isEditing ? (<macro_1.Trans>Edit Style Size</macro_1.Trans>) : (<macro_1.Trans>New Style Size</macro_1.Trans>)}
              </react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <Form_1.Hidden name="id"/>
              <react_1.VStack spacing={4}>
                <Form_1.Input name="sizeCode" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Size Code"], ["Size Code"])))}/>
                <Form_1.Input name="sizeName" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Size Name"], ["Size Name"])))}/>
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
exports.default = StyleSizeForm;
var templateObject_1, templateObject_2;
