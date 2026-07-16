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
var hooks_1 = require("~/hooks");
var usePermissionMatrix_1 = require("~/hooks/usePermissionMatrix");
var users_1 = require("~/modules/users");
var path_1 = require("~/utils/path");
// Mirrors MES_PERMISSIONS server constant — keyed by PascalCase module name
var MES_DISPLAY_PERMISSIONS = {
    Production: { view: true, create: true, update: true, delete: false },
    Inventory: { view: true, create: true, update: true, delete: false },
    Quality: { view: true, create: true, update: true, delete: false },
    Items: { view: true, create: false, update: false, delete: false },
    Resources: { view: true, create: false, update: false, delete: false },
    People: { view: true, create: false, update: false, delete: false },
    Documents: { view: true, create: false, update: false, delete: false }
};
var EmployeeTypeForm = function (_a) {
    var _b;
    var initialValues = _a.initialValues;
    var t = (0, macro_1.useLingui)().t;
    var userPermissions = (0, hooks_1.usePermissions)();
    var navigate = (0, react_router_1.useNavigate)();
    var onClose = function () { return navigate(-1); };
    var _c = (0, react_2.useState)((_b = initialValues.mesOnly) !== null && _b !== void 0 ? _b : false), mesOnly = _c[0], setMesOnly = _c[1];
    var _d = (0, react_2.useMemo)(function () { return (0, usePermissionMatrix_1.fromEmployeeTypePermissions)(initialValues.permissions); }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initialValues.permissions]), initialState = _d.state, modules = _d.modules;
    var matrix = (0, usePermissionMatrix_1.usePermissionMatrix)({ modules: modules, initialState: initialState });
    // Pre-computed MES permission set for the read-only display when mesOnly is ON
    var mesDisplayPermissions = (0, react_2.useMemo)(function () {
        return Object.fromEntries(Object.entries(initialValues.permissions).map(function (_a) {
            var _b;
            var key = _a[0], val = _a[1];
            return [
                key,
                {
                    name: val.name,
                    permission: (_b = MES_DISPLAY_PERMISSIONS[key]) !== null && _b !== void 0 ? _b : {
                        view: false,
                        create: false,
                        update: false,
                        delete: false
                    }
                }
            ];
        }));
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initialValues.permissions]);
    var _e = (0, react_2.useMemo)(function () { return (0, usePermissionMatrix_1.fromEmployeeTypePermissions)(mesDisplayPermissions); }, [mesDisplayPermissions]), mesInitialState = _e.state, mesModules = _e.modules;
    var mesMatrix = (0, usePermissionMatrix_1.usePermissionMatrix)({
        modules: mesModules,
        initialState: mesInitialState
    });
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !userPermissions.can("update", "users")
        : !userPermissions.can("create", "users");
    // Serialize permissions to the format expected by the action
    var permissionsData = JSON.stringify(Object.values((0, usePermissionMatrix_1.toEmployeeTypePermissions)(matrix.permissions)));
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.ModalContent size="xlarge">
        <form_1.ValidatedForm validator={users_1.employeeTypeValidator} method="post" action={isEditing
            ? path_1.path.to.employeeType(initialValues.id)
            : path_1.path.to.newEmployeeType} defaultValues={initialValues} className="flex flex-col h-full">
          <react_1.ModalHeader>
            <react_1.ModalTitle>
              {isEditing ? (<macro_1.Trans>Edit Employee Type</macro_1.Trans>) : (<macro_1.Trans>New Employee Type</macro_1.Trans>)}
            </react_1.ModalTitle>
          </react_1.ModalHeader>
          <react_1.ModalBody className="max-h-[70dvh] overflow-y-auto">
            <Form_1.Hidden name="id"/>
            <react_1.VStack spacing={4}>
              <Form_1.Input name="name" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Employee Type"], ["Employee Type"])))}/>
              <Form_1.Boolean name="mesOnly" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["MES only"], ["MES only"])))} description={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Shop-floor workers who can access the MES but not the ERP. They do not count as a billable seat."], ["Shop-floor workers who can access the MES but not the ERP. They do not count as a billable seat."])))} onChange={setMesOnly}/>
              <Form_1.Hidden name="data" value={mesOnly ? "[]" : permissionsData}/>
            </react_1.VStack>
            <div className="mt-4">
              {mesOnly ? (<PermissionMatrix_1.default matrix={mesMatrix} label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Default Permissions"], ["Default Permissions"])))} isDisabled/>) : (<PermissionMatrix_1.default matrix={matrix} label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Default Permissions"], ["Default Permissions"])))}/>)}
            </div>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.HStack>
              <Form_1.Submit isDisabled={isDisabled}>
                <macro_1.Trans>Save</macro_1.Trans>
              </Form_1.Submit>
              <react_1.Button size="md" variant="solid" onClick={onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
            </react_1.HStack>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
};
exports.default = EmployeeTypeForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
