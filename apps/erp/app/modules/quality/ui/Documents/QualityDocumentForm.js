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
var quality_models_1 = require("../../quality.models");
var QualityDocumentForm = function (_a) {
    var initialValues = _a.initialValues, _b = _a.type, type = _b === void 0 ? "new" : _b, _c = _a.open, open = _c === void 0 ? true : _c, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "quality")
        : !permissions.can("create", "quality");
    return (<react_1.ModalDrawerProvider type="modal">
      <react_1.ModalDrawer open={open} onOpenChange={function (open) {
            if (!open)
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm validator={quality_models_1.qualityDocumentValidator} method="post" action={isEditing
            ? path_1.path.to.qualityDocument(initialValues.id)
            : path_1.path.to.newQualityDocument} defaultValues={initialValues} fetcher={fetcher} className="flex flex-col h-full">
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>
                {type === "copy" ? "Copy" : "New"} Quality Document
              </react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <Form_1.Hidden name="id"/>
              <Form_1.Hidden name="copyFromId"/>
              {type === "copy" && (<>
                  <Form_1.Hidden name="name"/>
                  <Form_1.Hidden name="content"/>
                </>)}
              <react_1.VStack spacing={4}>
                {type === "new" && <Form_1.Input name="name" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Name"], ["Name"])))}/>}
                <Form_1.Number name="version" label={type === "copy" ? "New Version" : "Version"} minValue={0} helperText={type === "copy"
            ? "The new version number of the document"
            : "The version of the new document"}/>
              </react_1.VStack>
            </react_1.ModalDrawerBody>
            <react_1.ModalDrawerFooter>
              <react_1.HStack>
                <Form_1.Submit isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle" || isDisabled}>
                  Save
                </Form_1.Submit>
              </react_1.HStack>
            </react_1.ModalDrawerFooter>
          </form_1.ValidatedForm>
        </react_1.ModalDrawerContent>
      </react_1.ModalDrawer>
    </react_1.ModalDrawerProvider>);
};
exports.default = QualityDocumentForm;
var templateObject_1;
