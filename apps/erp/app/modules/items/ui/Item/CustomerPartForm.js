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
var items_models_1 = require("../../items.models");
var CustomerPartForm = function (_a) {
    var initialValues = _a.initialValues;
    var permissions = (0, hooks_1.usePermissions)();
    var navigate = (0, react_router_1.useNavigate)();
    var t = (0, macro_1.useLingui)().t;
    var itemId = (0, react_router_1.useParams)().itemId;
    if (!itemId)
        throw new Error("itemId not found");
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "parts")
        : !permissions.can("create", "parts");
    var onClose = function () { return navigate(-1); };
    return (<react_1.Drawer open onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.DrawerContent>
        <form_1.ValidatedForm defaultValues={initialValues} validator={items_models_1.customerPartValidator} method="post" action={isEditing ? undefined : path_1.path.to.newCustomerPart(itemId)} className="flex flex-col h-full">
          <react_1.DrawerHeader>
            <react_1.DrawerTitle>
              {isEditing ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Edit Customer Part"], ["Edit Customer Part"]))) : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["New Customer Part"], ["New Customer Part"])))}
            </react_1.DrawerTitle>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            <Form_1.Hidden name="id"/>
            <Form_1.Hidden name="itemId"/>

            <react_1.VStack spacing={4}>
              <Form_1.Input name="readableId" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Part ID"], ["Part ID"])))} isDisabled/>
              <Form_1.Customer name="customerId" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Customer"], ["Customer"])))}/>
              <Form_1.Input name="customerPartId" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Customer Part ID"], ["Customer Part ID"])))}/>
              <Form_1.Input name="customerPartRevision" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Customer Part Revision"], ["Customer Part Revision"])))}/>
            </react_1.VStack>
          </react_1.DrawerBody>
          <react_1.DrawerFooter>
            <react_1.HStack>
              <Form_1.Submit isDisabled={isDisabled}>
                <macro_1.Trans>Save</macro_1.Trans>
              </Form_1.Submit>
              <react_1.Button size="md" variant="solid" onClick={onClose}>
                Cancel
              </react_1.Button>
            </react_1.HStack>
          </react_1.DrawerFooter>
        </form_1.ValidatedForm>
      </react_1.DrawerContent>
    </react_1.Drawer>);
};
exports.default = CustomerPartForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
