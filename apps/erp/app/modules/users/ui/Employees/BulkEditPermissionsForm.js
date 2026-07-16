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
var PermissionMatrix_1 = require("~/components/PermissionMatrix");
var usePermissionMatrix_1 = require("~/hooks/usePermissionMatrix");
var users_1 = require("~/modules/users");
var path_1 = require("~/utils/path");
var BulkEditPermissions = function (_a) {
    var userIds = _a.userIds, isOpen = _a.isOpen, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var emptyPermissionsFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        emptyPermissionsFetcher.load(path_1.path.to.api.emptyPermissions);
    });
    var _b = (0, react_2.useMemo)(function () {
        if (emptyPermissionsFetcher.data) {
            return (0, usePermissionMatrix_1.fromEmployeeTypePermissions)(emptyPermissionsFetcher.data.permissions);
        }
        return { state: {}, modules: {} };
    }, [emptyPermissionsFetcher.data]), initialState = _b.state, modules = _b.modules;
    var matrix = (0, usePermissionMatrix_1.usePermissionMatrix)({
        modules: modules,
        initialState: initialState
    });
    // When new empty permissions arrive, reset the matrix state
    (0, react_2.useEffect)(function () {
        if (emptyPermissionsFetcher.data) {
            var state = (0, usePermissionMatrix_1.fromEmployeeTypePermissions)(emptyPermissionsFetcher.data.permissions).state;
            matrix.setPermissions(state);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [emptyPermissionsFetcher.data, matrix.setPermissions]);
    // Serialize permissions to the format expected by the action
    var permissionsData = JSON.stringify((0, usePermissionMatrix_1.toCompanyPermissions)(matrix.permissions));
    var hasModules = Object.keys(modules).length > 0;
    return (<react_1.Drawer onOpenChange={function (open) {
            if (!open)
                onClose();
        }} open={isOpen}>
      <react_1.DrawerContent>
        <form_1.ValidatedForm validator={users_1.bulkPermissionsValidator} method="post" action={path_1.path.to.bulkEditPermissions} onSuccess={onClose} defaultValues={{ userIds: userIds }} className="flex flex-col h-full">
          <react_1.DrawerHeader>
            <react_1.DrawerTitle>
              <macro_1.Trans>Edit Permissions</macro_1.Trans>
            </react_1.DrawerTitle>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            <react_1.VStack spacing={4}>
              <div className="border border-border p-4 w-full rounded-lg">
                <Form_1.Radios name="editType" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Type of Permission Update"], ["Type of Permission Update"])))} options={[
            {
                label: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Add Permissions"], ["Add Permissions"]))),
                value: "add"
            },
            {
                label: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Update Permissions"], ["Update Permissions"]))),
                value: "update"
            }
        ]}/>
              </div>

              <Form_1.Employees name="userIds" selectionsMaxHeight={"calc(100vh - 330px)"} label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Users to Update"], ["Users to Update"])))}/>

              {hasModules && <PermissionMatrix_1.default matrix={matrix}/>}
              <Form_1.Hidden name="data" value={permissionsData}/>
            </react_1.VStack>
          </react_1.DrawerBody>
          <react_1.DrawerFooter>
            <react_1.HStack>
              <Form_1.Submit>
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
exports.default = BulkEditPermissions;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
