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
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Form_1 = require("~/components/Form");
var SupplierProcess_1 = require("~/components/Form/SupplierProcess");
var WorkCenters_1 = require("~/components/Form/WorkCenters");
var hooks_1 = require("~/hooks");
var Supplier_1 = require("~/modules/purchasing/ui/Supplier");
var resources_1 = require("~/modules/resources");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var ProcessForm = function (_a) {
    var initialValues = _a.initialValues, _b = _a.open, open = _b === void 0 ? true : _b, _c = _a.type, type = _c === void 0 ? "drawer" : _c, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (type !== "modal")
            return;
        if (fetcher.state === "loading" && ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data)) {
            onClose === null || onClose === void 0 ? void 0 : onClose();
            react_1.toast.success(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Created process"], ["Created process"]))));
        }
        else if (fetcher.state === "idle" && ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.error)) {
            react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to create process: ", ""], ["Failed to create process: ", ""])), fetcher.data.error.message));
        }
    }, [fetcher.data, fetcher.state, onClose, type, t]);
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "resources")
        : !permissions.can("create", "resources");
    var _d = (0, react_2.useState)(initialValues.processType), processType = _d[0], setProcessType = _d[1];
    return (<react_1.ModalDrawerProvider type={type}>
      <react_1.ModalDrawer open={open} onOpenChange={function (open) {
            if (!open)
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm validator={resources_1.processValidator} method="post" action={isEditing
            ? path_1.path.to.process(initialValues.id)
            : path_1.path.to.newProcess} defaultValues={initialValues} fetcher={fetcher} className="flex flex-col h-full">
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>
                {isEditing ? (<macro_1.Trans>Edit Process</macro_1.Trans>) : (<macro_1.Trans>New Process</macro_1.Trans>)}
              </react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <Form_1.Hidden name="id"/>
              <Form_1.Hidden name="type" value={type}/>
              <react_1.VStack spacing={4}>
                <Form_1.Input name="name" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Process Name"], ["Process Name"])))}/>
                <Form_1.Select name="processType" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Process Type"], ["Process Type"])))} options={shared_1.processTypes.map(function (pt) { return ({
            value: pt,
            label: pt
        }); })} onChange={function (newValue) {
            setProcessType(newValue === null || newValue === void 0 ? void 0 : newValue.value);
        }}/>
                {processType !== "Outside" && (<>
                    <Form_1.StandardFactor name="defaultStandardFactor" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Default Unit"], ["Default Unit"])))} value={initialValues.defaultStandardFactor}/>
                    <WorkCenters_1.default name="workCenters" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Work Centers"], ["Work Centers"])))}/>
                  </>)}
                {processType !== "Inside" && (<SupplierProcesses processId={initialValues.id}/>)}
                <Form_1.Boolean name="completeAllOnScan" label="" description={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Complete all quantities on barcode scan"], ["Complete all quantities on barcode scan"])))}/>
                <Form_1.CustomFormFields table="process"/>
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
exports.default = ProcessForm;
function SupplierProcesses(_a) {
    var processId = _a.processId;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var processes = (0, SupplierProcess_1.useSupplierProcesses)({ processId: processId });
    var navigate = (0, react_router_1.useNavigate)();
    var isEditing = processId !== undefined;
    var newSupplierProcessModal = (0, react_1.useDisclosure)();
    return (<>
      <div className="flex flex-col gap-2 w-full">
        {processes.length > 0 && (<>
            <label className="text-muted-foreground text-xs">{t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Suppliers"], ["Suppliers"])))}</label>
            {processes.map(function (sp) { return (<react_1.HStack key={sp.id} className="w-full justify-between rounded-md border border-border p-2 text-sm">
                <components_1.SupplierAvatar supplierId={sp.supplierId}/>
                <react_1.DropdownMenu>
                  <react_1.DropdownMenuTrigger asChild>
                    <react_1.IconButton aria-label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Edit supplier process"], ["Edit supplier process"])))} icon={<lu_1.LuEllipsisVertical />} size="md" variant="ghost" onClick={function (e) { return e.stopPropagation(); }}/>
                  </react_1.DropdownMenuTrigger>
                  <react_1.DropdownMenuContent>
                    <react_1.DropdownMenuItem onClick={function () {
                    return navigate(path_1.path.to.supplierProcess(sp.supplierId, sp.id));
                }} disabled={!permissions.can("update", "purchasing")}>
                      <react_1.DropdownMenuIcon icon={<lu_1.LuPencil />}/>
                      <macro_1.Trans>Edit Process</macro_1.Trans>
                    </react_1.DropdownMenuItem>
                    <react_1.DropdownMenuItem onClick={function () {
                    return navigate(path_1.path.to.deleteSupplierProcess(sp.supplierId, sp.id));
                }} disabled={!permissions.can("delete", "purchasing")}>
                      <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                      <macro_1.Trans>Delete Process</macro_1.Trans>
                    </react_1.DropdownMenuItem>
                  </react_1.DropdownMenuContent>
                </react_1.DropdownMenu>
              </react_1.HStack>); })}
          </>)}
        <react_1.Button isDisabled={!isEditing} leftIcon={<lu_1.LuCirclePlus />} variant="secondary" onClick={newSupplierProcessModal.onOpen}>
          <macro_1.Trans>Add Supplier</macro_1.Trans>
        </react_1.Button>
      </div>
      {newSupplierProcessModal.isOpen && processId && (<Supplier_1.SupplierProcessForm type="modal" onClose={function () {
                newSupplierProcessModal.onClose();
            }} initialValues={{
                processId: processId,
                supplierId: "",
                minimumCost: 0,
                unitCost: 0,
                leadTime: 0
            }}/>)}
    </>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
