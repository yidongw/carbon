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
var components_1 = require("~/components");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var inventory_1 = require("~/modules/inventory");
var path_1 = require("~/utils/path");
var StorageUnitParentSelect_1 = require("./StorageUnitParentSelect");
var StorageUnitForm = function (_a) {
    var _b;
    var locationId = _a.locationId, initialValues = _a.initialValues, _c = _a.open, open = _c === void 0 ? true : _c, _d = _a.type, type = _d === void 0 ? "drawer" : _d, onClose = _a.onClose, inheritedWorkCenter = _a.inheritedWorkCenter;
    var fetcher = (0, react_router_1.useFetcher)();
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var isEditing = !!(initialValues === null || initialValues === void 0 ? void 0 : initialValues.id);
    var isDisabled = isEditing
        ? !permissions.can("update", "parts")
        : !permissions.can("create", "parts");
    return (<react_1.ModalDrawerProvider type={type}>
      <react_1.ModalDrawer open={open} onOpenChange={function (open) {
            if (!open)
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm validator={inventory_1.storageUnitValidator} method="post" action={isEditing
            ? path_1.path.to.storageUnit(initialValues.id)
            : path_1.path.to.newStorageUnit} defaultValues={initialValues} fetcher={fetcher} onSubmit={function () {
            if (type === "modal") {
                onClose === null || onClose === void 0 ? void 0 : onClose();
            }
        }} className="flex flex-col h-full">
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>
                {isEditing ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Edit Storage Unit"], ["Edit Storage Unit"]))) : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["New Storage Unit"], ["New Storage Unit"])))}
              </react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <Form_1.Hidden name="id"/>
              <Form_1.Hidden name="type" value={type}/>

              <react_1.VStack spacing={4}>
                <Form_1.Input name="name" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Name"], ["Name"])))}/>
                <Form_1.Location isReadOnly={isEditing} name="locationId" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Location"], ["Location"])))}/>
                <StorageUnitParentSelect_1.StorageUnitParentSelect name="parentId" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Parent Storage Unit"], ["Parent Storage Unit"])))} locationId={locationId} isOptional helperText={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Must be in the same location"], ["Must be in the same location"])))} excludeDescendantsOf={initialValues.id}/>
                <Form_1.StorageTypes name="storageTypeIds" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Storage Types"], ["Storage Types"])))} isOptional/>
                {inheritedWorkCenter ? (<react_1.FormControl>
                    <react_1.FormLabel htmlFor="workCenterId-inherited">
                      {t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Work Center"], ["Work Center"])))}
                    </react_1.FormLabel>
                    <react_1.Input id="workCenterId-inherited" value={(_b = inheritedWorkCenter.workCenterName) !== null && _b !== void 0 ? _b : t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Unknown"], ["Unknown"])))} isReadOnly className="text-muted-foreground"/>
                    <react_1.FormHelperText>{t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Inherited from parent"], ["Inherited from parent"])))}</react_1.FormHelperText>
                  </react_1.FormControl>) : (<Form_1.WorkCenter name="workCenterId" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Work Center"], ["Work Center"])))} locationId={locationId} isOptional helperText={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Assigns this storage unit to a work center (lineside)"], ["Assigns this storage unit to a work center (lineside)"])))}/>)}
              </react_1.VStack>
            </react_1.ModalDrawerBody>
            <react_1.ModalDrawerFooter>
              <react_1.HStack>
                <Form_1.Submit isDisabled={isDisabled}>
                  <macro_1.Trans>Save</macro_1.Trans>
                </Form_1.Submit>
                <react_1.Button size="md" variant="solid" onClick={onClose}>
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
                {isEditing && initialValues.id && (<components_1.PrintButton sourceDocument="StorageUnit" sourceDocumentId={initialValues.id} locationId={locationId || undefined} context="inventory" fileRoutes={{
                pdf: function (id, opts) {
                    return path_1.path.to.file.storageUnitLabelsPdf(id, opts);
                },
                zpl: function (id, opts) {
                    return path_1.path.to.file.storageUnitLabelsZpl(id, opts);
                }
            }}/>)}
              </react_1.HStack>
            </react_1.ModalDrawerFooter>
          </form_1.ValidatedForm>
        </react_1.ModalDrawerContent>
      </react_1.ModalDrawer>
    </react_1.ModalDrawerProvider>);
};
exports.default = StorageUnitForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
