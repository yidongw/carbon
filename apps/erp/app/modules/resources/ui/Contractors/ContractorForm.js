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
var ContractorForm = function (_a) {
    var _b;
    var initialValues = _a.initialValues;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var navigate = (0, react_router_1.useNavigate)();
    var location = (0, react_router_1.useLocation)();
    var onClose = function () { return navigate(-1); };
    var _c = (0, react_2.useState)((_b = initialValues === null || initialValues === void 0 ? void 0 : initialValues.supplierId) !== null && _b !== void 0 ? _b : null), supplier = _c[0], setSupplier = _c[1];
    var isEditing = !location.pathname.includes("new");
    var isDisabled = isEditing
        ? !permissions.can("update", "resources")
        : !permissions.can("create", "resources");
    return (<react_1.Drawer open onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.DrawerContent>
        <form_1.ValidatedForm validator={resources_1.contractorValidator} method="post" action={isEditing
            ? path_1.path.to.contractor(initialValues.id)
            : path_1.path.to.newContractor} defaultValues={initialValues} className="flex flex-col h-full">
          <react_1.DrawerHeader>
            <react_1.DrawerTitle>
              {isEditing ? (<macro_1.Trans>Edit Contractor</macro_1.Trans>) : (<macro_1.Trans>New Contractor</macro_1.Trans>)}
            </react_1.DrawerTitle>
            <react_1.DrawerDescription>
              <macro_1.Trans>
                A contractor is a supplier contact with particular abilities and
                available hours
              </macro_1.Trans>
            </react_1.DrawerDescription>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            <react_1.VStack spacing={4}>
              <Form_1.Supplier name="supplierId" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Supplier"], ["Supplier"])))} isReadOnly={isEditing} onChange={function (value) { return setSupplier(value === null || value === void 0 ? void 0 : value.value); }}/>
              <Form_1.SupplierContact name="id" supplier={supplier !== null && supplier !== void 0 ? supplier : undefined} isReadOnly={isEditing}/>
              {/* <Abilities name="abilities" label="Abilities" /> */}
              <Form_1.Number name="hoursPerWeek" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Hours per Week"], ["Hours per Week"])))} helperText={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["The number of hours per week the contractor is available to work."], ["The number of hours per week the contractor is available to work."])))} minValue={0} maxValue={10000}/>
              <Form_1.CustomFormFields table="contractor"/>
            </react_1.VStack>
          </react_1.DrawerBody>
          <react_1.DrawerFooter>
            <react_1.HStack>
              <Form_1.Submit isDisabled={isDisabled}>
                <macro_1.Trans>Save</macro_1.Trans>
              </Form_1.Submit>
              <react_1.Button size="md" variant="solid" onClick={onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
            </react_1.HStack>
          </react_1.DrawerFooter>
        </form_1.ValidatedForm>
      </react_1.DrawerContent>
    </react_1.Drawer>);
};
exports.default = ContractorForm;
var templateObject_1, templateObject_2, templateObject_3;
