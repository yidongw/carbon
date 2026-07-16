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
var users_1 = require("~/modules/users");
var path_1 = require("~/utils/path");
var GroupForm = function (_a) {
    var initialValues = _a.initialValues;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var navigate = (0, react_router_1.useNavigate)();
    var onClose = function () { return navigate(-1); };
    var isEditing = !!initialValues.id;
    var isDisabled = isEditing
        ? !permissions.can("update", "users")
        : !permissions.can("create", "users");
    return (<react_1.Drawer open onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.DrawerContent>
        <form_1.ValidatedForm validator={users_1.groupValidator} method="post" action={isEditing ? path_1.path.to.group(initialValues.id) : path_1.path.to.newGroup} defaultValues={initialValues} className="flex flex-col h-full">
          <react_1.DrawerHeader>
            <react_1.DrawerTitle>
              {isEditing ? <macro_1.Trans>Edit Group</macro_1.Trans> : <macro_1.Trans>New Group</macro_1.Trans>}
            </react_1.DrawerTitle>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            <Form_1.Hidden name="id"/>
            <react_1.VStack spacing={4}>
              <Form_1.Input name="name" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Group Name"], ["Group Name"])))}/>
              <Form_1.Users name="selections" selectionsMaxHeight={"calc(100vh - 330px)"} label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Group Members"], ["Group Members"])))} verbose/>
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
exports.default = GroupForm;
var templateObject_1, templateObject_2;
