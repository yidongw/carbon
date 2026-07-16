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
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var components_1 = require("~/components");
var Form_1 = require("~/components/Form");
var CustomFormInlineFields_1 = require("~/components/Form/CustomFormInlineFields");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
var purchasing_models_1 = require("../../purchasing.models");
var Supplier_1 = require("../Supplier");
var PurchasingRFQProperties = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    var rfqId = (0, react_router_1.useParams)().rfqId;
    if (!rfqId)
        throw new Error("rfqId not found");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.purchasingRfq(rfqId));
    var t = (0, macro_1.useLingui)().t;
    var newSupplierModal = (0, react_1.useDisclosure)();
    var _q = (0, react_2.useState)(""), created = _q[0], setCreated = _q[1];
    var allSuppliers = (0, stores_1.useSuppliers)()[0];
    var supplierOptions = (0, react_2.useMemo)(function () {
        var _a;
        return ((_a = allSuppliers.map(function (c) { return ({
            value: c.id,
            label: c.name
        }); })) !== null && _a !== void 0 ? _a : []);
    }, [allSuppliers]);
    // Get current supplier IDs from the RFQ
    var currentSupplierIds = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.suppliers) === null || _a === void 0 ? void 0 : _a.map(function (s) { return s.supplierId; }).filter(Boolean)) !== null && _b !== void 0 ? _b : []);
    }, [routeData === null || routeData === void 0 ? void 0 : routeData.suppliers]);
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.error) {
            react_1.toast.error(fetcher.data.error.message);
        }
    }, [fetcher.data]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdate = (0, react_2.useCallback)(function (field, value) {
        if (value === (routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary[field])) {
            return;
        }
        var formData = new FormData();
        formData.append("ids", rfqId);
        formData.append("field", field);
        formData.append("value", value !== null && value !== void 0 ? value : "");
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.bulkUpdatePurchasingRfq
        });
    }, [rfqId, routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdateCustomFields = (0, react_2.useCallback)(function (value) {
        var formData = new FormData();
        formData.append("ids", rfqId);
        formData.append("table", "purchasingRfq");
        formData.append("value", value);
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.customFields
        });
    }, [rfqId]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdateSuppliers = (0, react_2.useCallback)(function (supplierIds) {
        var formData = new FormData();
        formData.append("ids", rfqId);
        formData.append("field", "supplierIds");
        for (var _i = 0, supplierIds_1 = supplierIds; _i < supplierIds_1.length; _i++) {
            var id = supplierIds_1[_i];
            formData.append("value", id);
        }
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.bulkUpdatePurchasingRfq
        });
    }, [rfqId]);
    var optimisticAssignment = (0, components_1.useOptimisticAssignment)({
        id: rfqId,
        table: "purchasingRfq"
    });
    var assignee = optimisticAssignment !== undefined
        ? optimisticAssignment
        : (_a = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _a === void 0 ? void 0 : _a.assignee;
    var permissions = (0, hooks_1.usePermissions)();
    var canUpdate = permissions.can("update", "purchasing");
    var isLocked = (0, purchasing_models_1.isRfqLocked)((_b = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _b === void 0 ? void 0 : _b.status);
    var isDisabled = !canUpdate || !(0, purchasing_models_1.isRfqEditable)((_c = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _c === void 0 ? void 0 : _c.status) || isLocked;
    return (<react_1.VStack spacing={4} className="w-full min-w-0 bg-card h-full overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent px-4 py-2 text-sm">
      <react_1.VStack spacing={4}>
        <react_1.HStack className="w-full justify-between">
          <h3 className="text-xxs text-foreground/70 uppercase font-light tracking-wide">
            <macro_1.Trans>Properties</macro_1.Trans>
          </h3>
          <react_1.HStack spacing={1}>
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Link"], ["Link"])))} size="sm" className="p-1" onClick={function () {
            return (0, string_1.copyToClipboard)(window.location.origin +
                path_1.path.to.purchasingRfqDetails(rfqId));
        }}>
                  <lu_1.LuLink className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>Copy link to RFQ</span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Copy"], ["Copy"])))} size="sm" className="p-1" onClick={function () { var _a, _b; return (0, string_1.copyToClipboard)((_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _a === void 0 ? void 0 : _a.rfqId) !== null && _b !== void 0 ? _b : ""); }}>
                  <lu_1.LuCopy className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>Copy RFQ number</span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
          </react_1.HStack>
        </react_1.HStack>
        <span className="text-sm">{(_d = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _d === void 0 ? void 0 : _d.rfqId}</span>
      </react_1.VStack>

      <components_1.Assignee id={rfqId} table="purchasingRfq" value={assignee !== null && assignee !== void 0 ? assignee : ""} variant="inline" isReadOnly={!canUpdate}/>

      <form_1.ValidatedForm defaultValues={{
            supplierIds: currentSupplierIds
        }} validator={zod_1.z.object({
            supplierIds: zod_1.z.array(zod_1.z.string()).optional()
        })} className="w-full">
        <form_1.CreatableMultiSelect name="supplierIds" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Suppliers"], ["Suppliers"])))} options={supplierOptions} value={currentSupplierIds} inline={SuppliersInlinePreview} isReadOnly={isDisabled} disabled={isDisabled} onChange={function (selected) {
            onUpdateSuppliers(selected);
        }} onCreateOption={function (option) {
            newSupplierModal.onOpen();
            setCreated(option);
        }}/>
        {newSupplierModal.isOpen && (<Supplier_1.SupplierForm type="modal" onClose={function () {
                setCreated("");
                newSupplierModal.onClose();
            }} initialValues={{
                name: created
            }}/>)}
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            rfqDate: (_f = (_e = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _e === void 0 ? void 0 : _e.rfqDate) !== null && _f !== void 0 ? _f : ""
        }} validator={zod_1.z.object({
            rfqDate: zod_1.z.string().min(1, { message: "RFQ Date is required" })
        })} className="w-full">
        <form_1.DatePicker name="rfqDate" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["RFQ Date"], ["RFQ Date"])))} inline onChange={function (date) {
            onUpdate("rfqDate", date);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            expirationDate: (_h = (_g = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _g === void 0 ? void 0 : _g.expirationDate) !== null && _h !== void 0 ? _h : ""
        }} validator={zod_1.z.object({
            expirationDate: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
        <form_1.DatePicker name="expirationDate" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Expiration Date"], ["Expiration Date"])))} inline onChange={function (date) {
            onUpdate("expirationDate", date);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            locationId: (_k = (_j = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _j === void 0 ? void 0 : _j.locationId) !== null && _k !== void 0 ? _k : undefined
        }} validator={zod_1.z.object({
            locationId: zod_1.z.string().min(1, { message: "Location is required" })
        })} className="w-full">
        <Form_1.Location label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["RFQ Location"], ["RFQ Location"])))} name="locationId" inline isReadOnly={isDisabled} onChange={function (value) {
            if (value === null || value === void 0 ? void 0 : value.value) {
                onUpdate("locationId", value.value);
            }
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            employeeId: (_m = (_l = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _l === void 0 ? void 0 : _l.employeeId) !== null && _m !== void 0 ? _m : undefined
        }} validator={zod_1.z.object({
            employeeId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
        <Form_1.Employee name="employeeId" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Buyer"], ["Buyer"])))} inline isReadOnly={isDisabled} onChange={function (value) {
            if (value === null || value === void 0 ? void 0 : value.value) {
                onUpdate("employeeId", value.value);
            }
        }}/>
      </form_1.ValidatedForm>

      <CustomFormInlineFields_1.default customFields={((_p = (_o = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _o === void 0 ? void 0 : _o.customFields) !== null && _p !== void 0 ? _p : {})} table="purchasingRfq" tags={[]} onUpdate={onUpdateCustomFields}/>
    </react_1.VStack>);
};
var SuppliersInlinePreview = function (value, options, maxPreview) {
    if (maxPreview === void 0) { maxPreview = 5; }
    var suppliers = (0, stores_1.useSuppliers)()[0];
    return (<react_1.AvatarGroup limit={maxPreview} className="relative z-10">
      <react_1.AvatarGroupList>
        {value.map(function (supplier, index) {
            var _a, _b;
            return (<react_1.Avatar key={index} name={(_b = (_a = suppliers.find(function (s) { return s.id === supplier; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : supplier}/>);
        })}
      </react_1.AvatarGroupList>
      <react_1.AvatarOverflowIndicator />
    </react_1.AvatarGroup>);
};
exports.default = PurchasingRFQProperties;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
