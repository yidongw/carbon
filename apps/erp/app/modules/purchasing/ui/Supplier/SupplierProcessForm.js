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
var Process_1 = require("~/components/Form/Process");
var SupplierProcess_1 = require("~/components/Form/SupplierProcess");
var hooks_1 = require("~/hooks");
var purchasing_1 = require("~/modules/purchasing");
var path_1 = require("~/utils/path");
var SupplierProcessForm = function (_a) {
    var _b, _c;
    var initialValues = _a.initialValues, _d = _a.type, type = _d === void 0 ? "drawer" : _d, _e = _a.open, open = _e === void 0 ? true : _e, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    var routeSupplierId = (0, react_router_1.useParams)().supplierId;
    var _f = (0, react_2.useState)(routeSupplierId || initialValues.supplierId || undefined), supplier = _f[0], setSupplier = _f[1];
    var resolvedSupplierId = routeSupplierId || supplier || initialValues.supplierId;
    var navigate = (0, react_router_1.useNavigate)();
    var company = (0, hooks_1.useUser)().company;
    var baseCurrency = (_b = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _b !== void 0 ? _b : "USD";
    (0, react_2.useEffect)(function () {
        var _a, _b, _c;
        if (type !== "modal")
            return;
        if (fetcher.state === "idle" && ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data)) {
            onClose === null || onClose === void 0 ? void 0 : onClose();
            react_1.toast.success(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Created supplier process"], ["Created supplier process"]))));
        }
        else if (fetcher.state === "idle" && ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.error)) {
            react_1.toast.error((_c = fetcher.data.error.message) !== null && _c !== void 0 ? _c : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to create supplier process"], ["Failed to create supplier process"]))));
        }
    }, [fetcher.data, fetcher.state, onClose, type, t]);
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "purchasing")
        : !permissions.can("create", "purchasing");
    var processIdPreset = !isEditing && Boolean(initialValues.processId);
    var allProcesses = (0, Process_1.useProcesses)();
    var routeProcesses = (0, react_1.useRouteData)(routeSupplierId ? path_1.path.to.supplierProcesses(routeSupplierId) : "");
    var fetchedSupplierProcesses = (0, SupplierProcess_1.useSupplierProcessesBySupplier)({
        supplierId: routeSupplierId ? undefined : resolvedSupplierId || undefined
    });
    var existingSupplierProcesses = (_c = routeProcesses === null || routeProcesses === void 0 ? void 0 : routeProcesses.processes) !== null && _c !== void 0 ? _c : fetchedSupplierProcesses;
    var assignedProcessIds = (0, react_2.useMemo)(function () {
        return new Set(existingSupplierProcesses
            .filter(function (supplierProcess) { return supplierProcess.id !== initialValues.id; })
            .map(function (supplierProcess) { return supplierProcess.processId; })
            .filter(Boolean));
    }, [existingSupplierProcesses, initialValues.id]);
    var processOptions = (0, react_2.useMemo)(function () {
        if (!resolvedSupplierId) {
            return allProcesses;
        }
        return allProcesses.filter(function (process) { return !assignedProcessIds.has(process.value); });
    }, [allProcesses, assignedProcessIds, resolvedSupplierId]);
    return (<react_1.ModalDrawerProvider type={type}>
      <react_1.ModalDrawer open={open} onOpenChange={function (isOpen) {
            if (!isOpen) {
                if (type === "modal") {
                    onClose === null || onClose === void 0 ? void 0 : onClose();
                }
                else {
                    navigate(-1);
                }
            }
        }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm validator={purchasing_1.supplierProcessValidator} method="post" action={isEditing
            ? path_1.path.to.supplierProcess(resolvedSupplierId, initialValues.id)
            : path_1.path.to.newSupplierProcess(resolvedSupplierId)} defaultValues={initialValues} fetcher={fetcher} className="flex flex-col h-full">
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>
                {isEditing ? "Edit" : "New"} Supplier Process
              </react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <Form_1.Hidden name="id"/>
              <Form_1.Hidden name="type" value={type}/>
              {routeSupplierId && (<Form_1.Hidden name="supplierId" value={routeSupplierId}/>)}
              <react_1.VStack spacing={4}>
                {!routeSupplierId && (<Form_1.Supplier name="supplierId" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Supplier"], ["Supplier"])))} onChange={function (newValue) { return setSupplier(newValue === null || newValue === void 0 ? void 0 : newValue.value); }}/>)}
                {processIdPreset ? (<Form_1.Hidden name="processId" value={initialValues.processId}/>) : (<Process_1.default name="processId" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Process"], ["Process"])))} options={processOptions}/>)}
                <Form_1.Number name="minimumCost" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Minimum Cost"], ["Minimum Cost"])))} formatOptions={{
            style: "currency",
            currency: baseCurrency
        }} minValue={0}/>
                <Form_1.Number name="unitCost" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Unit Cost"], ["Unit Cost"])))} formatOptions={{
            style: "currency",
            currency: baseCurrency
        }} minValue={0}/>
                <Form_1.Number name="leadTime" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Standard Lead Time"], ["Standard Lead Time"])))} minValue={0}/>

                <Form_1.CustomFormFields table="supplierProcess"/>
              </react_1.VStack>
            </react_1.ModalDrawerBody>
            <react_1.ModalDrawerFooter>
              <react_1.HStack>
                <Form_1.Submit isDisabled={isDisabled}>
                  <macro_1.Trans>Save</macro_1.Trans>
                </Form_1.Submit>
                <react_1.Button size="md" variant="solid" onClick={function () { return onClose === null || onClose === void 0 ? void 0 : onClose(); }}>
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
              </react_1.HStack>
            </react_1.ModalDrawerFooter>
          </form_1.ValidatedForm>
        </react_1.ModalDrawerContent>
      </react_1.ModalDrawer>
    </react_1.ModalDrawerProvider>);
};
exports.default = SupplierProcessForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
