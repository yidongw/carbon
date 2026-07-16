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
var sales_models_1 = require("../../sales.models");
var QuoteProperties = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17;
    var t = (0, macro_1.useLingui)().t;
    var quoteId = (0, react_router_1.useParams)().quoteId;
    if (!quoteId)
        throw new Error("quoteId not found");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.quote(quoteId));
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
        if (value === (routeData === null || routeData === void 0 ? void 0 : routeData.quote[field])) {
            return;
        }
        var formData = new FormData();
        formData.append("ids", quoteId);
        formData.append("field", field);
        formData.append("value", value !== null && value !== void 0 ? value : "");
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.bulkUpdateQuote
        });
    }, [quoteId, routeData === null || routeData === void 0 ? void 0 : routeData.quote]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdateCustomFields = (0, react_2.useCallback)(function (value) {
        var formData = new FormData();
        formData.append("ids", quoteId);
        formData.append("table", "quote");
        formData.append("value", value);
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.customFields
        });
    }, [quoteId]);
    var optimisticAssignment = (0, components_1.useOptimisticAssignment)({
        id: quoteId,
        table: "quote"
    });
    var assignee = optimisticAssignment !== undefined
        ? optimisticAssignment
        : (_a = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _a === void 0 ? void 0 : _a.assignee;
    var permissions = (0, hooks_1.usePermissions)();
    var canUpdate = permissions.can("update", "sales");
    var isLocked = (0, sales_models_1.isQuoteLocked)((_b = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _b === void 0 ? void 0 : _b.status);
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
            return (0, string_1.copyToClipboard)(window.location.origin + path_1.path.to.quoteDetails(quoteId));
        }}>
                  <lu_1.LuLink className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>Copy link to Quote</span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Copy"], ["Copy"])))} size="sm" className="p-1" onClick={function () { var _a, _b; return (0, string_1.copyToClipboard)((_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _a === void 0 ? void 0 : _a.quoteId) !== null && _b !== void 0 ? _b : ""); }}>
                  <lu_1.LuCopy className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <macro_1.Trans>Copy Quote number</macro_1.Trans>
              </react_1.TooltipContent>
            </react_1.Tooltip>
          </react_1.HStack>
        </react_1.HStack>
        <span className="text-sm">{(_c = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _c === void 0 ? void 0 : _c.quoteId}</span>
      </react_1.VStack>
      <components_1.Assignee id={quoteId} table="quote" value={assignee !== null && assignee !== void 0 ? assignee : ""} variant="inline" isReadOnly={!canUpdate}/>
      <form_1.ValidatedForm defaultValues={{ customerId: (_d = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _d === void 0 ? void 0 : _d.customerId }} validator={zod_1.z.object({
            customerId: zod_1.z.string().min(1, { message: "Customer is required" })
        })} className="w-full">
        <Form_1.Customer name="customerId" inline isReadOnly={isDisabled} onChange={function (value) {
            if (value === null || value === void 0 ? void 0 : value.value) {
                onUpdate("customerId", value.value);
            }
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            customerReference: (_f = (_e = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _e === void 0 ? void 0 : _e.customerReference) !== null && _f !== void 0 ? _f : undefined
        }} validator={zod_1.z.object({
            customerReference: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
        <form_1.InputControlled name="customerReference" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Customer RFQ"], ["Customer RFQ"])))} value={(_h = (_g = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _g === void 0 ? void 0 : _g.customerReference) !== null && _h !== void 0 ? _h : ""} size="sm" inline isReadOnly={isDisabled} onBlur={function (e) {
            onUpdate("customerReference", e.target.value);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            customerLocationId: (_k = (_j = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _j === void 0 ? void 0 : _j.customerLocationId) !== null && _k !== void 0 ? _k : ""
        }} validator={zod_1.z.object({
            customerLocationId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
        <Form_1.CustomerLocation name="customerLocationId" customer={(_m = (_l = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _l === void 0 ? void 0 : _l.customerId) !== null && _m !== void 0 ? _m : ""} inline isReadOnly={isDisabled} onChange={function (customerLocation) {
            if (customerLocation === null || customerLocation === void 0 ? void 0 : customerLocation.id) {
                onUpdate("customerLocationId", customerLocation.id);
            }
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            customerContactId: (_p = (_o = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _o === void 0 ? void 0 : _o.customerContactId) !== null && _p !== void 0 ? _p : ""
        }} validator={zod_1.z.object({
            customerContactId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
        <Form_1.CustomerContact name="customerContactId" customer={(_r = (_q = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _q === void 0 ? void 0 : _q.customerId) !== null && _r !== void 0 ? _r : ""} inline label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Purchasing Contact"], ["Purchasing Contact"])))} isReadOnly={isDisabled} onChange={function (customerContact) {
            if (customerContact === null || customerContact === void 0 ? void 0 : customerContact.id) {
                onUpdate("customerContactId", customerContact.id);
            }
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            customerEngineeringContactId: (_t = (_s = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _s === void 0 ? void 0 : _s.customerEngineeringContactId) !== null && _t !== void 0 ? _t : ""
        }} validator={zod_1.z.object({
            customerEngineeringContactId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
        <Form_1.CustomerContact name="customerEngineeringContactId" customer={(_v = (_u = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _u === void 0 ? void 0 : _u.customerId) !== null && _v !== void 0 ? _v : ""} inline label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Engineering Contact"], ["Engineering Contact"])))} isReadOnly={isDisabled} onChange={function (customerEngineeringContact) {
            if (customerEngineeringContact === null || customerEngineeringContact === void 0 ? void 0 : customerEngineeringContact.id) {
                onUpdate("customerEngineeringContactId", customerEngineeringContact.id);
            }
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            expirationDate: (_x = (_w = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _w === void 0 ? void 0 : _w.expirationDate) !== null && _x !== void 0 ? _x : ""
        }} validator={zod_1.z.object({
            expirationDate: zod_1.z
                .string()
                .min(1, { message: "Expiration date is required" })
        })} className="w-full">
        <form_1.DatePicker name="expirationDate" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Expiration Date"], ["Expiration Date"])))} inline onChange={function (date) {
            onUpdate("expirationDate", date);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            dueDate: (_z = (_y = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _y === void 0 ? void 0 : _y.dueDate) !== null && _z !== void 0 ? _z : ""
        }} validator={zod_1.z.object({
            dueDate: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
        <form_1.DatePicker name="dueDate" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Due Date"], ["Due Date"])))} inline onChange={function (date) {
            onUpdate("dueDate", date);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{ locationId: (_0 = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _0 === void 0 ? void 0 : _0.locationId }} validator={zod_1.z.object({
            locationId: zod_1.z.string().min(1, { message: "Location is required" })
        })} className="w-full">
        <Form_1.Location label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Quote Location"], ["Quote Location"])))} name="locationId" inline isReadOnly={isDisabled} onChange={function (value) {
            if (value === null || value === void 0 ? void 0 : value.value) {
                onUpdate("locationId", value.value);
            }
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            salesPersonId: (_2 = (_1 = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _1 === void 0 ? void 0 : _1.salesPersonId) !== null && _2 !== void 0 ? _2 : undefined
        }} validator={zod_form_data_1.zfd.text(zod_1.z.string().optional())} className="w-full">
        <Form_1.Employee name="salesPersonId" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Sales Person"], ["Sales Person"])))} inline isReadOnly={isDisabled} onChange={function (value) {
            if (value === null || value === void 0 ? void 0 : value.value) {
                onUpdate("salesPersonId", value.value);
            }
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            estimatorId: (_4 = (_3 = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _3 === void 0 ? void 0 : _3.estimatorId) !== null && _4 !== void 0 ? _4 : undefined
        }} validator={zod_1.z.object({
            estimatorId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
        <Form_1.Employee name="estimatorId" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Estimator"], ["Estimator"])))} inline isReadOnly={isDisabled} onChange={function (value) {
            if (value === null || value === void 0 ? void 0 : value.value) {
                onUpdate("estimatorId", value.value);
            }
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            currencyCode: (_6 = (_5 = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _5 === void 0 ? void 0 : _5.currencyCode) !== null && _6 !== void 0 ? _6 : undefined
        }} validator={zod_1.z.object({
            currencyCode: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
        <Form_1.Currency name="currencyCode" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Currency"], ["Currency"])))} inline value={(_8 = (_7 = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _7 === void 0 ? void 0 : _7.currencyCode) !== null && _8 !== void 0 ? _8 : ""} isReadOnly={isDisabled} onChange={function (value) {
            if (value === null || value === void 0 ? void 0 : value.value) {
                onUpdate("currencyCode", value.value);
            }
        }}/>
      </form_1.ValidatedForm>

      {((_9 = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _9 === void 0 ? void 0 : _9.currencyCode) &&
            ((_10 = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _10 === void 0 ? void 0 : _10.currencyCode) !== company.baseCurrencyCode && (<react_1.VStack spacing={2}>
            <react_1.HStack spacing={1}>
              <span className="text-xs text-muted-foreground">
                Exchange Rate
              </span>
              {((_11 = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _11 === void 0 ? void 0 : _11.exchangeRateUpdatedAt) && (<react_1.Tooltip>
                  <react_1.TooltipTrigger tabIndex={-1}>
                    <lu_1.LuInfo className="w-4 h-4"/>
                  </react_1.TooltipTrigger>
                  <react_1.TooltipContent>
                    Last updated:{" "}
                    {formatter.format(new Date((_13 = (_12 = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _12 === void 0 ? void 0 : _12.exchangeRateUpdatedAt) !== null && _13 !== void 0 ? _13 : ""))}
                  </react_1.TooltipContent>
                </react_1.Tooltip>)}
            </react_1.HStack>
            <react_1.HStack className="w-full justify-between">
              <span>{(_14 = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _14 === void 0 ? void 0 : _14.exchangeRate}</span>
              <react_1.IconButton size="sm" variant="secondary" aria-label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Refresh"], ["Refresh"])))} icon={<lu_1.LuRefreshCcw />} isDisabled={isDisabled} onClick={function () {
                var _a, _b;
                var formData = new FormData();
                formData.append("currencyCode", (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _a === void 0 ? void 0 : _a.currencyCode) !== null && _b !== void 0 ? _b : "");
                exchangeRateFetcher.submit(formData, {
                    method: "post",
                    action: path_1.path.to.quoteExchangeRate(quoteId)
                });
            }}/>
            </react_1.HStack>
          </react_1.VStack>)}
      <react_1.VStack spacing={2}>
        <span className="text-xs font-medium text-muted-foreground">
          Created By
        </span>
        {/* @ts-expect-error TS2322 */}
        <components_1.EmployeeAvatar employeeId={(_15 = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _15 === void 0 ? void 0 : _15.createdBy}/>
      </react_1.VStack>

      <CustomFormInlineFields_1.default customFields={((_17 = (_16 = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _16 === void 0 ? void 0 : _16.customFields) !== null && _17 !== void 0 ? _17 : {})} table="quote" tags={[]} onUpdate={onUpdateCustomFields}/>
    </react_1.VStack>);
};
exports.default = QuoteProperties;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
