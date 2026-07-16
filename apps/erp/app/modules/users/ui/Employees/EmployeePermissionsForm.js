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
var EmployeePermissionsForm = function (_a) {
    var _b;
    var name = _a.name, employeeTypes = _a.employeeTypes, employeeTypePermissions = _a.employeeTypePermissions, initialValues = _a.initialValues;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var onClose = function () { return navigate(-1); };
    var employeeTypeOptions = (_b = employeeTypes === null || employeeTypes === void 0 ? void 0 : employeeTypes.map(function (et) { return ({
        value: et.id,
        label: et.name
    }); })) !== null && _b !== void 0 ? _b : [];
    var _c = (0, react_2.useMemo)(function () { return (0, usePermissionMatrix_1.fromCompanyPermissions)(initialValues.permissions); }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initialValues.permissions]), initialState = _c.state, modules = _c.modules;
    var matrix = (0, usePermissionMatrix_1.usePermissionMatrix)({
        modules: modules,
        initialState: initialState
    });
    var _d = (0, react_2.useState)(null), pendingEmployeeTypeId = _d[0], setPendingEmployeeTypeId = _d[1];
    var handleEmployeeTypeChange = function (newValue) {
        if (!newValue)
            return;
        var newId = newValue.value;
        if (newId && newId !== initialValues.employeeType) {
            setPendingEmployeeTypeId(newId);
        }
    };
    var handleConfirmOverwrite = function () {
        var _a, _b, _c, _d, _e;
        if (pendingEmployeeTypeId) {
            var perms = (_a = employeeTypePermissions[pendingEmployeeTypeId]) !== null && _a !== void 0 ? _a : {};
            var nextState = {};
            for (var _i = 0, _f = matrix.modules; _i < _f.length; _i++) {
                var mod = _f[_i][0];
                var p = perms[mod];
                nextState["".concat(mod, "_view")] = (_b = p === null || p === void 0 ? void 0 : p.view) !== null && _b !== void 0 ? _b : false;
                nextState["".concat(mod, "_create")] = (_c = p === null || p === void 0 ? void 0 : p.create) !== null && _c !== void 0 ? _c : false;
                nextState["".concat(mod, "_update")] = (_d = p === null || p === void 0 ? void 0 : p.update) !== null && _d !== void 0 ? _d : false;
                nextState["".concat(mod, "_delete")] = (_e = p === null || p === void 0 ? void 0 : p.delete) !== null && _e !== void 0 ? _e : false;
            }
            matrix.setPermissions(nextState);
        }
        setPendingEmployeeTypeId(null);
    };
    var permissionsData = JSON.stringify((0, usePermissionMatrix_1.toCompanyPermissions)(matrix.permissions));
    return (<>
      <react_1.Modal open onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
        <react_1.ModalContent size="xlarge">
          <form_1.ValidatedForm validator={users_1.employeeValidator} method="post" action={path_1.path.to.employeeAccount(initialValues.id)} defaultValues={initialValues} className="flex flex-col h-full">
            <react_1.ModalHeader>
              <react_1.ModalTitle>{name}</react_1.ModalTitle>
            </react_1.ModalHeader>
            <react_1.ModalBody className="max-h-[70dvh] overflow-y-auto">
              <react_1.VStack spacing={4}>
                <Form_1.Select name="employeeType" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Employee Type"], ["Employee Type"])))} options={employeeTypeOptions} placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Select Employee Type"], ["Select Employee Type"])))} onChange={handleEmployeeTypeChange}/>
                <PermissionMatrix_1.default matrix={matrix}/>
                <Form_1.Hidden name="id"/>
                <Form_1.Hidden name="data" value={permissionsData}/>
              </react_1.VStack>
            </react_1.ModalBody>
            <react_1.ModalFooter>
              <react_1.HStack>
                <Form_1.Submit>
                  <macro_1.Trans>Save</macro_1.Trans>
                </Form_1.Submit>
                <react_1.Button size="md" variant="solid" onClick={onClose}>
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
              </react_1.HStack>
            </react_1.ModalFooter>
          </form_1.ValidatedForm>
        </react_1.ModalContent>
      </react_1.Modal>

      <react_1.Modal open={pendingEmployeeTypeId !== null} onOpenChange={function (open) {
            if (!open)
                setPendingEmployeeTypeId(null);
        }}>
        <react_1.ModalOverlay />
        <react_1.ModalContent>
          <react_1.ModalHeader>
            <react_1.ModalTitle>
              <macro_1.Trans>Update Permissions</macro_1.Trans>
            </react_1.ModalTitle>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <p className="text-sm text-muted-foreground">
              <macro_1.Trans>
                Do you want to overwrite the user's current permissions with the
                default permissions for this employee type?
              </macro_1.Trans>
            </p>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.Button variant="secondary" onClick={function () { return setPendingEmployeeTypeId(null); }}>
              <macro_1.Trans>Keep Current</macro_1.Trans>
            </react_1.Button>
            <react_1.Button variant="primary" onClick={handleConfirmOverwrite}>
              <macro_1.Trans>Overwrite Permissions</macro_1.Trans>
            </react_1.Button>
          </react_1.ModalFooter>
        </react_1.ModalContent>
      </react_1.Modal>
    </>);
};
exports.default = EmployeePermissionsForm;
var templateObject_1, templateObject_2;
