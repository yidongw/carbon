"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var accounting_models_1 = require("../../accounting.models");
var CostCenterForm = function (_a) {
    var _b;
    var initialValues = _a.initialValues, _c = _a.open, open = _c === void 0 ? true : _c, _d = _a.type, type = _d === void 0 ? "drawer" : _d, onClose = _a.onClose;
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.costCenters);
    var approvalsActive = (_b = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrderApprovalsActive) !== null && _b !== void 0 ? _b : false;
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (type !== "modal")
            return;
        if (fetcher.state === "loading" && ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data)) {
            onClose === null || onClose === void 0 ? void 0 : onClose();
            react_1.toast.success("Created cost center");
        }
        else if (fetcher.state === "idle" && ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.error)) {
            react_1.toast.error("Failed to create cost center: ".concat(fetcher.data.error.message));
        }
    }, [fetcher.data, fetcher.state, onClose, type]);
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "accounting")
        : !permissions.can("create", "accounting");
    return (<react_1.ModalDrawerProvider type={type}>
      <react_1.ModalDrawer open={open} onOpenChange={function (open) {
            if (!open)
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm validator={accounting_models_1.costCenterValidator} method="post" action={isEditing
            ? path_1.path.to.costCenter(initialValues.id)
            : path_1.path.to.newCostCenter} defaultValues={initialValues} fetcher={fetcher} className="flex flex-col h-full">
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>
                {isEditing ? "Edit" : "New"} Cost Center
              </react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <Form_1.Hidden name="id"/>
              <Form_1.Hidden name="type" value={type}/>
              <react_1.VStack spacing={4}>
                <Form_1.Input name="name" label="Cost Center Name"/>
                <Form_1.CostCenter name="parentCostCenterId" label="Parent Cost Center"/>
                <Form_1.Employee name="ownerId" label="Owner" isOptional={!approvalsActive}/>
                <Form_1.CustomFormFields table="costCenter"/>
              </react_1.VStack>
            </react_1.ModalDrawerBody>
            <react_1.ModalDrawerFooter>
              <react_1.HStack>
                <Form_1.Submit isDisabled={isDisabled}>Save</Form_1.Submit>
                <react_1.Button size="md" variant="solid" onClick={function () { return onClose === null || onClose === void 0 ? void 0 : onClose(); }}>
                  Cancel
                </react_1.Button>
              </react_1.HStack>
            </react_1.ModalDrawerFooter>
          </form_1.ValidatedForm>
        </react_1.ModalDrawerContent>
      </react_1.ModalDrawer>
    </react_1.ModalDrawerProvider>);
};
exports.default = CostCenterForm;
