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
var purchasing_models_1 = require("../../purchasing.models");
var PurchaseOrderProperties = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18;
    var orderId = (0, react_router_1.useParams)().orderId;
    if (!orderId)
        throw new Error("orderId not found");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.purchaseOrder(orderId));
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
    var t = (0, macro_1.useLingui)().t;
    var formatter = (0, react_2.useMemo)(function () {
        return new Intl.DateTimeFormat(locale, {
            dateStyle: "medium",
            timeStyle: "short"
        });
    }, [locale]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdate = (0, react_2.useCallback)(function (field, value) {
        if (value === (routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder[field])) {
            return;
        }
        var formData = new FormData();
        formData.append("ids", orderId);
        formData.append("field", field);
        formData.append("value", value !== null && value !== void 0 ? value : "");
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.bulkUpdatePurchaseOrder
        });
    }, [orderId, routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdateCustomFields = (0, react_2.useCallback)(function (value) {
        var formData = new FormData();
        formData.append("ids", orderId);
        formData.append("table", "purchaseOrder");
        formData.append("value", value);
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.customFields
        });
    }, [orderId]);
    var permissions = (0, hooks_1.usePermissions)();
    var supplierApprovalRequired = (0, hooks_1.useSupplierApprovalRequired)();
    var optimisticAssignment = (0, components_1.useOptimisticAssignment)({
        id: orderId,
        table: "purchaseOrder"
    });
    var assignee = optimisticAssignment !== undefined
        ? optimisticAssignment
        : (_a = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _a === void 0 ? void 0 : _a.assignee;
    var canUpdate = permissions.can("update", "purchasing");
    var isLocked = (0, purchasing_models_1.isPurchaseOrderLocked)((_b = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _b === void 0 ? void 0 : _b.status);
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
                path_1.path.to.purchaseOrderDetails(orderId));
        }}>
                  <lu_1.LuLink className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>Copy link to Purchase Order</span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Copy"], ["Copy"])))} size="sm" className="p-1" onClick={function () {
            var _a, _b;
            return (0, string_1.copyToClipboard)((_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _a === void 0 ? void 0 : _a.purchaseOrderId) !== null && _b !== void 0 ? _b : "");
        }}>
                  <lu_1.LuCopy className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>Copy Purchase Order number</span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
          </react_1.HStack>
        </react_1.HStack>
        <span className="text-sm">
          {(_c = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _c === void 0 ? void 0 : _c.purchaseOrderId}
        </span>
      </react_1.VStack>

      {((_d = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _d === void 0 ? void 0 : _d.jobId) && (<react_1.VStack spacing={2}>
          <span className="text-xs text-muted-foreground">Job</span>

          <components_1.Hyperlink to={path_1.path.to.jobDetails((_e = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _e === void 0 ? void 0 : _e.jobId)}>
            <react_1.Badge variant="secondary">
              <lu_1.LuCirclePlay className="w-3 h-3 mr-1"/>
              {(_g = (_f = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _f === void 0 ? void 0 : _f.jobReadableId) !== null && _g !== void 0 ? _g : "Job"}
            </react_1.Badge>
          </components_1.Hyperlink>
        </react_1.VStack>)}

      <components_1.Assignee id={orderId} table="purchaseOrder" value={assignee !== null && assignee !== void 0 ? assignee : ""} variant="inline" isReadOnly={!canUpdate}/>

      <form_1.ValidatedForm defaultValues={{ supplierId: (_h = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _h === void 0 ? void 0 : _h.supplierId }} validator={zod_1.z.object({
            supplierId: zod_1.z.string().min(1, { message: "Supplier is required" })
        })} className="w-full">
        <Form_1.Supplier name="supplierId" inline isReadOnly={isDisabled} onlyApproved={supplierApprovalRequired} onChange={function (value) {
            if (value === null || value === void 0 ? void 0 : value.value) {
                onUpdate("supplierId", value.value);
            }
        }}/>
      </form_1.ValidatedForm>

      {(routeData === null || routeData === void 0 ? void 0 : routeData.supplierQuote) && (<react_1.VStack spacing={2}>
          <span className="text-xs text-muted-foreground">
            <macro_1.Trans>Supplier Quote</macro_1.Trans>
          </span>

          <react_router_1.Link className="flex items-center justify-start gap-2" to={path_1.path.to.supplierQuote(routeData === null || routeData === void 0 ? void 0 : routeData.supplierQuote.id)} target="_blank">
            {routeData === null || routeData === void 0 ? void 0 : routeData.supplierQuote.supplierQuoteId}
            <lu_1.LuExternalLink />
          </react_router_1.Link>
        </react_1.VStack>)}

      <form_1.ValidatedForm defaultValues={{
            supplierReference: (_k = (_j = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _j === void 0 ? void 0 : _j.supplierReference) !== null && _k !== void 0 ? _k : undefined
        }} validator={zod_1.z.object({
            supplierReference: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
        <form_1.InputControlled name="supplierReference" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Supplier Ref. Number"], ["Supplier Ref. Number"])))} value={(_m = (_l = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _l === void 0 ? void 0 : _l.supplierReference) !== null && _m !== void 0 ? _m : ""} size="sm" inline isReadOnly={isDisabled} onBlur={function (e) {
            onUpdate("supplierReference", e.target.value);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            supplierLocationId: (_p = (_o = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _o === void 0 ? void 0 : _o.supplierLocationId) !== null && _p !== void 0 ? _p : ""
        }} validator={zod_1.z.object({
            supplierLocationId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
        <Form_1.SupplierLocation name="supplierLocationId" supplier={(_r = (_q = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _q === void 0 ? void 0 : _q.supplierId) !== null && _r !== void 0 ? _r : ""} inline isReadOnly={isDisabled} onChange={function (supplierLocation) {
            if (supplierLocation === null || supplierLocation === void 0 ? void 0 : supplierLocation.id) {
                onUpdate("supplierLocationId", supplierLocation.id);
            }
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            supplierContactId: (_t = (_s = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _s === void 0 ? void 0 : _s.supplierContactId) !== null && _t !== void 0 ? _t : ""
        }} validator={zod_1.z.object({
            supplierContactId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
        <Form_1.SupplierContact name="supplierContactId" supplier={(_v = (_u = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _u === void 0 ? void 0 : _u.supplierId) !== null && _v !== void 0 ? _v : ""} inline isReadOnly={isDisabled} onChange={function (supplierContact) {
            if (supplierContact === null || supplierContact === void 0 ? void 0 : supplierContact.id) {
                onUpdate("supplierContactId", supplierContact.id);
            }
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            orderDate: (_x = (_w = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _w === void 0 ? void 0 : _w.orderDate) !== null && _x !== void 0 ? _x : ""
        }} validator={zod_1.z.object({
            orderDate: zod_1.z.string().min(1, { message: "Order date is required" })
        })} className="w-full">
        <form_1.DatePicker name="orderDate" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Order Date"], ["Order Date"])))} inline isDisabled={isDisabled} onChange={function (date) {
            onUpdate("orderDate", date);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            receiptRequestedDate: (_z = (_y = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _y === void 0 ? void 0 : _y.receiptRequestedDate) !== null && _z !== void 0 ? _z : ""
        }} validator={zod_1.z.object({
            receiptRequestedDate: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
        <form_1.DatePicker name="receiptRequestedDate" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Receipt Requested Date"], ["Receipt Requested Date"])))} inline isDisabled={isDisabled} onChange={function (date) {
            onUpdate("receiptRequestedDate", date);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            receiptPromisedDate: (_1 = (_0 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _0 === void 0 ? void 0 : _0.receiptPromisedDate) !== null && _1 !== void 0 ? _1 : ""
        }} validator={zod_1.z.object({
            receiptPromisedDate: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
        <form_1.DatePicker name="receiptPromisedDate" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Receipt Promised Date"], ["Receipt Promised Date"])))} inline isDisabled={isDisabled} onChange={function (date) {
            onUpdate("receiptPromisedDate", date);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            deliveryDate: (_3 = (_2 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _2 === void 0 ? void 0 : _2.deliveryDate) !== null && _3 !== void 0 ? _3 : ""
        }} validator={zod_1.z.object({
            deliveryDate: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
        <form_1.DatePicker name="deliveryDate" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Delivery Date"], ["Delivery Date"])))} inline isDisabled={!canUpdate} onChange={function (date) {
            onUpdate("deliveryDate", date);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{ locationId: (_4 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _4 === void 0 ? void 0 : _4.locationId }} validator={zod_1.z.object({
            locationId: zod_1.z.string().min(1, { message: "Location is required" })
        })} className="w-full">
        <Form_1.Location label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Purchase Order Location"], ["Purchase Order Location"])))} name="locationId" inline isReadOnly={isDisabled} onChange={function (value) {
            if (value === null || value === void 0 ? void 0 : value.value) {
                onUpdate("locationId", value.value);
            }
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            currencyCode: (_6 = (_5 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _5 === void 0 ? void 0 : _5.currencyCode) !== null && _6 !== void 0 ? _6 : undefined
        }} validator={zod_1.z.object({
            currencyCode: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
        <Form_1.Currency name="currencyCode" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Currency"], ["Currency"])))} inline value={(_8 = (_7 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _7 === void 0 ? void 0 : _7.currencyCode) !== null && _8 !== void 0 ? _8 : ""} isReadOnly={isDisabled} onChange={function (value) {
            if (value === null || value === void 0 ? void 0 : value.value) {
                onUpdate("currencyCode", value.value);
            }
        }}/>
      </form_1.ValidatedForm>

      {((_9 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _9 === void 0 ? void 0 : _9.currencyCode) &&
            ((_10 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _10 === void 0 ? void 0 : _10.currencyCode) !== company.baseCurrencyCode && (<react_1.VStack spacing={2}>
            <react_1.HStack spacing={1}>
              <span className="text-xs text-muted-foreground">
                Exchange Rate
              </span>
              {((_11 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _11 === void 0 ? void 0 : _11.exchangeRateUpdatedAt) && (<react_1.Tooltip>
                  <react_1.TooltipTrigger tabIndex={-1}>
                    <lu_1.LuInfo className="w-4 h-4"/>
                  </react_1.TooltipTrigger>
                  <react_1.TooltipContent>
                    Last updated:{" "}
                    {formatter.format(new Date((_13 = (_12 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _12 === void 0 ? void 0 : _12.exchangeRateUpdatedAt) !== null && _13 !== void 0 ? _13 : ""))}
                  </react_1.TooltipContent>
                </react_1.Tooltip>)}
            </react_1.HStack>
            <react_1.HStack className="w-full justify-between">
              <span>{(_14 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _14 === void 0 ? void 0 : _14.exchangeRate}</span>
              <react_1.IconButton size="sm" variant="secondary" aria-label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Refresh"], ["Refresh"])))} icon={<lu_1.LuRefreshCcw />} isDisabled={isDisabled} onClick={function () {
                var _a, _b;
                var formData = new FormData();
                formData.append("currencyCode", (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _a === void 0 ? void 0 : _a.currencyCode) !== null && _b !== void 0 ? _b : "");
                exchangeRateFetcher.submit(formData, {
                    method: "post",
                    action: path_1.path.to.purchaseOrderExchangeRate(orderId)
                });
            }}/>
            </react_1.HStack>
          </react_1.VStack>)}

      <react_1.VStack spacing={2}>
        <span className="text-xs font-medium text-muted-foreground">
          Created By
        </span>
        <components_1.EmployeeAvatar employeeId={(_16 = (_15 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _15 === void 0 ? void 0 : _15.createdBy) !== null && _16 !== void 0 ? _16 : null}/>
      </react_1.VStack>

      <CustomFormInlineFields_1.default customFields={((_18 = (_17 = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _17 === void 0 ? void 0 : _17.customFields) !== null && _18 !== void 0 ? _18 : {})} table="purchaseOrder" tags={[]} onUpdate={onUpdateCustomFields}/>
    </react_1.VStack>);
};
exports.default = PurchaseOrderProperties;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
