"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var components_1 = require("~/components");
var Form_1 = require("~/components/Form");
var CustomFormInlineFields_1 = require("~/components/Form/CustomFormInlineFields");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
var invoicing_models_1 = require("../../invoicing.models");
var PurchaseInvoiceProperties = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12;
    var t = (0, macro_1.useLingui)().t;
    var invoiceId = (0, react_router_1.useParams)().invoiceId;
    if (!invoiceId)
        throw new Error("invoiceId not found");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.purchaseInvoice(invoiceId));
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.error) {
            react_1.toast.error(fetcher.data.error.message);
        }
    }, [fetcher.data]);
    var company = (0, hooks_1.useUser)().company;
    var exchangeRateFetcher = (0, react_router_1.useFetcher)();
    var locale = (0, i18n_1.useLocale)().locale;
    var formatter = (0, react_2.useMemo)(function () {
        return new Intl.DateTimeFormat(locale, {
            dateStyle: "medium",
            timeStyle: "short"
        });
    }, [locale]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdate = (0, react_2.useCallback)(function (field, value) {
        if (value === (routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice[field])) {
            return;
        }
        var formData = new FormData();
        formData.append("ids", invoiceId);
        formData.append("field", field);
        formData.append("value", value !== null && value !== void 0 ? value : "");
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.bulkUpdatePurchaseInvoice
        });
    }, [invoiceId, routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdateCustomFields = (0, react_2.useCallback)(function (value) {
        var formData = new FormData();
        formData.append("ids", invoiceId);
        formData.append("table", "purchaseInvoice");
        formData.append("value", value);
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.customFields
        });
    }, [invoiceId]);
    var permissions = (0, hooks_1.usePermissions)();
    var supplierApprovalRequired = (0, hooks_1.useSupplierApprovalRequired)();
    var optimisticAssignment = (0, components_1.useOptimisticAssignment)({
        id: invoiceId,
        table: "purchaseInvoice"
    });
    var assignee = optimisticAssignment !== undefined
        ? optimisticAssignment
        : (_a = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _a === void 0 ? void 0 : _a.assignee;
    var canUpdate = permissions.can("update", "invoicing");
    var isLocked = (0, invoicing_models_1.isPurchaseInvoiceLocked)((_b = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _b === void 0 ? void 0 : _b.status);
    var isDisabled = !canUpdate || isLocked;
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
                path_1.path.to.purchaseInvoiceDetails(invoiceId));
        }}>
                  <lu_1.LuLink className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>Copy link to Purchase Invoice</span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Copy"], ["Copy"])))} size="sm" className="p-1" onClick={function () { var _a, _b; return (0, string_1.copyToClipboard)((_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _a === void 0 ? void 0 : _a.invoiceId) !== null && _b !== void 0 ? _b : ""); }}>
                  <lu_1.LuCopy className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>Copy Purchase Invoice number</span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
          </react_1.HStack>
        </react_1.HStack>
        <span className="text-sm">{(_c = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _c === void 0 ? void 0 : _c.invoiceId}</span>
      </react_1.VStack>

      <components_1.Assignee id={invoiceId} table="purchaseInvoice" value={assignee !== null && assignee !== void 0 ? assignee : ""} variant="inline" isReadOnly={!canUpdate}/>

      <form_1.ValidatedForm defaultValues={{ supplierId: (_d = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _d === void 0 ? void 0 : _d.supplierId }} validator={zod_1.z.object({
            supplierId: zod_1.z.string().min(1, { message: "Supplier is required" })
        })} className="w-full">
        <Form_1.Supplier name="supplierId" inline isReadOnly={isDisabled} onlyApproved={supplierApprovalRequired} onChange={function (value) {
            if (value === null || value === void 0 ? void 0 : value.value) {
                onUpdate("supplierId", value.value);
            }
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            supplierReference: (_f = (_e = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _e === void 0 ? void 0 : _e.supplierReference) !== null && _f !== void 0 ? _f : undefined
        }} validator={zod_1.z.object({
            supplierReference: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
        <form_1.InputControlled name="supplierReference" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Supplier Ref. Number"], ["Supplier Ref. Number"])))} value={(_h = (_g = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _g === void 0 ? void 0 : _g.supplierReference) !== null && _h !== void 0 ? _h : ""} size="sm" inline isReadOnly={isDisabled} onBlur={function (e) {
            onUpdate("supplierReference", e.target.value);
        }}/>
      </form_1.ValidatedForm>
      <form_1.ValidatedForm defaultValues={{
            invoiceSupplierId: (_j = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _j === void 0 ? void 0 : _j.invoiceSupplierId
        }} validator={zod_1.z.object({
            invoiceSupplierId: zod_1.z
                .string()
                .min(1, { message: "Supplier is required" })
        })} className="w-full">
        <Form_1.Supplier name="invoiceSupplierId" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Invoice Supplier"], ["Invoice Supplier"])))} inline isReadOnly={isDisabled} onlyApproved={supplierApprovalRequired} onChange={function (value) {
            if (value === null || value === void 0 ? void 0 : value.value) {
                onUpdate("invoiceSupplierId", value.value);
            }
        }}/>
      </form_1.ValidatedForm>
      <form_1.ValidatedForm defaultValues={{
            invoiceSupplierLocationId: (_l = (_k = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _k === void 0 ? void 0 : _k.invoiceSupplierLocationId) !== null && _l !== void 0 ? _l : ""
        }} validator={zod_1.z.object({
            invoiceSupplierLocationId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
        <Form_1.SupplierLocation name="invoiceSupplierLocationId" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Invoice Supplier Location"], ["Invoice Supplier Location"])))} supplier={(_o = (_m = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _m === void 0 ? void 0 : _m.invoiceSupplierId) !== null && _o !== void 0 ? _o : ""} inline isReadOnly={isDisabled} onChange={function (supplierLocation) {
            if (supplierLocation === null || supplierLocation === void 0 ? void 0 : supplierLocation.id) {
                onUpdate("invoiceSupplierLocationId", supplierLocation.id);
            }
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            invoiceSupplierContactId: (_q = (_p = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _p === void 0 ? void 0 : _p.invoiceSupplierContactId) !== null && _q !== void 0 ? _q : ""
        }} validator={zod_1.z.object({
            invoiceSupplierContactId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
        <Form_1.SupplierContact name="invoiceSupplierContactId" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Invoice Supplier Contact"], ["Invoice Supplier Contact"])))} supplier={(_s = (_r = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _r === void 0 ? void 0 : _r.invoiceSupplierId) !== null && _s !== void 0 ? _s : ""} inline isReadOnly={isDisabled} onChange={function (supplierContact) {
            if (supplierContact === null || supplierContact === void 0 ? void 0 : supplierContact.id) {
                onUpdate("invoiceSupplierContactId", supplierContact.id);
            }
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            dateIssued: (_u = (_t = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _t === void 0 ? void 0 : _t.dateIssued) !== null && _u !== void 0 ? _u : ""
        }} validator={zod_1.z.object({
            dateIssued: zod_1.z.string().min(1, { message: "Invoice date is required" })
        })} className="w-full">
        <form_1.DatePicker name="dateIssued" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Date Issued"], ["Date Issued"])))} inline isDisabled={!canUpdate} onChange={function (date) {
            onUpdate("dateIssued", date);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            dateDue: (_w = (_v = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _v === void 0 ? void 0 : _v.dateDue) !== null && _w !== void 0 ? _w : ""
        }} validator={zod_1.z.object({
            dateDue: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
        <form_1.DatePicker name="dateDue" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Date Due"], ["Date Due"])))} inline isDisabled={!canUpdate} onChange={function (date) {
            onUpdate("dateDue", date);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            datePaid: (_y = (_x = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _x === void 0 ? void 0 : _x.datePaid) !== null && _y !== void 0 ? _y : ""
        }} validator={zod_1.z.object({
            datePaid: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
        <form_1.DatePicker name="datePaid" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Date Paid"], ["Date Paid"])))} inline isDisabled={!canUpdate} onChange={function (date) {
            onUpdate("datePaid", date);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{ locationId: (_z = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _z === void 0 ? void 0 : _z.locationId }} validator={zod_1.z.object({
            locationId: zod_1.z.string().min(1, { message: "Location is required" })
        })} className="w-full">
        <Form_1.Location label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Location"], ["Location"])))} name="locationId" inline isReadOnly={isDisabled} onChange={function (value) {
            if (value === null || value === void 0 ? void 0 : value.value) {
                onUpdate("locationId", value.value);
            }
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            paymentTermId: (_0 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _0 === void 0 ? void 0 : _0.paymentTermId
        }} validator={zod_1.z.object({
            paymentTermId: zod_1.z
                .string()
                .min(1, { message: "Payment term is required" })
        })} className="w-full">
        <Form_1.PaymentTerm label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Payment Term"], ["Payment Term"])))} name="paymentTermId" inline isReadOnly={isDisabled} onChange={function (value) {
            if (value === null || value === void 0 ? void 0 : value.value) {
                onUpdate("paymentTermId", value.value);
            }
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            currencyCode: (_2 = (_1 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _1 === void 0 ? void 0 : _1.currencyCode) !== null && _2 !== void 0 ? _2 : undefined
        }} validator={zod_1.z.object({
            currencyCode: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
        <Form_1.Currency name="currencyCode" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Currency"], ["Currency"])))} inline value={(_4 = (_3 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _3 === void 0 ? void 0 : _3.currencyCode) !== null && _4 !== void 0 ? _4 : ""} isReadOnly={isDisabled} onChange={function (value) {
            if (value === null || value === void 0 ? void 0 : value.value) {
                onUpdate("currencyCode", value.value);
            }
        }}/>
      </form_1.ValidatedForm>

      {((_5 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _5 === void 0 ? void 0 : _5.currencyCode) &&
            ((_6 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _6 === void 0 ? void 0 : _6.currencyCode) !==
                company.baseCurrencyCode && (<react_1.VStack spacing={2}>
            <react_1.HStack spacing={1}>
              <span className="text-xs text-muted-foreground">
                Exchange Rate
              </span>
              {((_7 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _7 === void 0 ? void 0 : _7.exchangeRateUpdatedAt) && (<react_1.Tooltip>
                  <react_1.TooltipTrigger tabIndex={-1}>
                    <lu_1.LuInfo className="w-4 h-4"/>
                  </react_1.TooltipTrigger>
                  <react_1.TooltipContent>
                    Last updated:{" "}
                    {formatter.format(new Date((_9 = (_8 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _8 === void 0 ? void 0 : _8.exchangeRateUpdatedAt) !== null && _9 !== void 0 ? _9 : ""))}
                  </react_1.TooltipContent>
                </react_1.Tooltip>)}
            </react_1.HStack>
            <react_1.HStack className="w-full justify-between">
              <span>{(_10 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _10 === void 0 ? void 0 : _10.exchangeRate}</span>
              <react_1.IconButton size="sm" variant="secondary" aria-label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Refresh"], ["Refresh"])))} icon={<lu_1.LuRefreshCcw />} isDisabled={isDisabled} onClick={function () {
                var _a, _b;
                var formData = new FormData();
                formData.append("currencyCode", (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _a === void 0 ? void 0 : _a.currencyCode) !== null && _b !== void 0 ? _b : "");
                exchangeRateFetcher.submit(formData, {
                    method: "post",
                    action: path_1.path.to.purchaseInvoiceExchangeRate(invoiceId)
                });
            }}/>
            </react_1.HStack>
          </react_1.VStack>)}
      <CustomFormInlineFields_1.default customFields={((_12 = (_11 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _11 === void 0 ? void 0 : _11.customFields) !== null && _12 !== void 0 ? _12 : {})} table="purchaseInvoice" tags={[]} onUpdate={onUpdateCustomFields}/>
    </react_1.VStack>);
};
exports.default = PurchaseInvoiceProperties;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13;
