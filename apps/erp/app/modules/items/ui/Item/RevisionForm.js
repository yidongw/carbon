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
var path_1 = require("~/utils/path");
var items_models_1 = require("../../items.models");
var RevisionForm = function (_a) {
    var initialValues = _a.initialValues, _b = _a.hasSizesInsteadOfRevisions, hasSizesInsteadOfRevisions = _b === void 0 ? false : _b, _c = _a.open, open = _c === void 0 ? true : _c, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    var navigate = (0, react_router_1.useNavigate)();
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "parts")
        : !permissions.can("create", "parts");
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) {
            onClose();
            navigate(fetcher.data.link);
        }
        if (((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success) === false) {
            react_1.toast.error(fetcher.data.message);
        }
    }, [fetcher.data]);
    return (<react_1.ModalDrawerProvider type="modal">
      <react_1.ModalDrawer open={open} onOpenChange={function (open) {
            if (!open)
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm validator={items_models_1.revisionValidator} method="post" action={isEditing
            ? path_1.path.to.revision(initialValues.id)
            : path_1.path.to.newRevision} defaultValues={initialValues} fetcher={fetcher} className="flex flex-col h-full">
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>
                {isEditing
            ? hasSizesInsteadOfRevisions
                ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Edit Size"], ["Edit Size"]))) : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Edit Revision"], ["Edit Revision"])))
            : hasSizesInsteadOfRevisions
                ? t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["New Size"], ["New Size"]))) : t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["New Revision"], ["New Revision"])))}
              </react_1.ModalDrawerTitle>
              {!isEditing && (<react_1.ModalDrawerDescription>
                  {hasSizesInsteadOfRevisions
                ? t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["A new size will be created using a copy of the current size"], ["A new size will be created using a copy of the current size"]))) : t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["A new revision will be created using a copy of the current revision"], ["A new revision will be created using a copy of the current revision"])))}
                </react_1.ModalDrawerDescription>)}
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <Form_1.Hidden name="id"/>
              <Form_1.Hidden name="type"/>
              <Form_1.Hidden name="copyFromId"/>

              <react_1.VStack spacing={4}>
                <Form_1.Input name="revision" label={hasSizesInsteadOfRevisions ? t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Size"], ["Size"]))) : t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Revision"], ["Revision"])))} helperText={hasSizesInsteadOfRevisions
            ? t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["The size of the part"], ["The size of the part"]))) : t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["The revision number of the part"], ["The revision number of the part"])))}/>
              </react_1.VStack>
            </react_1.ModalDrawerBody>
            <react_1.ModalDrawerFooter>
              <react_1.HStack>
                <Form_1.Submit isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle" || isDisabled}>
                  <macro_1.Trans>Save</macro_1.Trans>
                </Form_1.Submit>
              </react_1.HStack>
            </react_1.ModalDrawerFooter>
          </form_1.ValidatedForm>
        </react_1.ModalDrawerContent>
      </react_1.ModalDrawer>
    </react_1.ModalDrawerProvider>);
};
exports.default = RevisionForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
