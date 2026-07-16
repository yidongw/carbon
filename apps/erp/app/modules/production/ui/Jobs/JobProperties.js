"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var ri_1 = require("react-icons/ri");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var components_1 = require("~/components");
var Form_1 = require("~/components/Form");
var CustomFormInlineFields_1 = require("~/components/Form/CustomFormInlineFields");
var Overlay_1 = require("~/components/Overlay");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
var production_models_1 = require("../../production.models");
var Deadline_1 = require("./Deadline");
var jobLabels_1 = require("./jobLabels");
var JobProperties = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27;
    var _28 = _a === void 0 ? {} : _a, jobIdProp = _28.jobId, routeDataProp = _28.routeData, _29 = _28.validItemTypes, validItemTypes = _29 === void 0 ? ["Part", "Tool"] : _29, extraProperties = _28.extraProperties, readOnlyItem = _28.readOnlyItem;
    var params = (0, react_router_1.useParams)();
    var jobId = jobIdProp !== null && jobIdProp !== void 0 ? jobIdProp : params.jobId;
    var t = (0, macro_1.useLingui)().t;
    var getDeadlineTypeLabel = (0, jobLabels_1.useDeadlineTypeLabel)();
    if (!jobId)
        throw new Error("jobId not found");
    var routeFromContext = (0, hooks_1.useRouteData)(path_1.path.to.job(jobId));
    var routeData = routeDataProp !== null && routeDataProp !== void 0 ? routeDataProp : routeFromContext;
    var unlinkDisclosure = (0, react_1.useDisclosure)();
    var carbon = (0, auth_1.useCarbon)().carbon;
    var company = (0, hooks_1.useUser)().company;
    var openOverlay = (0, Overlay_1.useOverlay)().openOverlay;
    var revalidate = (0, react_router_1.useRevalidator)().revalidate;
    var _30 = (0, react_2.useState)(null), configurationParameters = _30[0], setConfigurationParameters = _30[1];
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        var _a;
        var itemId = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _a === void 0 ? void 0 : _a.itemId;
        if (!itemId || !carbon || !(company === null || company === void 0 ? void 0 : company.id))
            return;
        Promise.all([
            carbon
                .from("configurationParameter")
                .select("*")
                .eq("itemId", itemId)
                .eq("companyId", company.id),
            carbon
                .from("configurationParameterGroup")
                .select("*")
                .eq("itemId", itemId)
                .eq("companyId", company.id)
        ]).then(function (_a) {
            var _b, _c;
            var parameters = _a[0], groups = _a[1];
            var params = (_b = parameters.data) !== null && _b !== void 0 ? _b : [];
            if (params.length > 0) {
                setConfigurationParameters({
                    parameters: params,
                    groups: (_c = groups.data) !== null && _c !== void 0 ? _c : []
                });
            }
        });
    }, [(_b = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _b === void 0 ? void 0 : _b.itemId]);
    var fetcher = (0, react_router_1.useFetcher)();
    var prevFetcherState = (0, react_2.useRef)(fetcher.state);
    (0, react_2.useEffect)(function () {
        var _a;
        var finishedSubmitting = prevFetcherState.current !== "idle" && fetcher.state === "idle";
        prevFetcherState.current = fetcher.state;
        if (!finishedSubmitting || !fetcher.data)
            return;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.error) {
            react_1.toast.error(fetcher.data.error.message);
            return;
        }
        revalidate();
    }, [fetcher.state, fetcher.data, revalidate]);
    var _31 = (0, react_2.useState)(((_d = (_c = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _c === void 0 ? void 0 : _c.itemType) !== null && _d !== void 0 ? _d : "Part")), type = _31[0], setType = _31[1];
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdate = (0, react_2.useCallback)(function (field, value) {
        var _a;
        if (value === (routeData === null || routeData === void 0 ? void 0 : routeData.job[field])) {
            return;
        }
        var formData = new FormData();
        formData.append("ids", jobId);
        formData.append("field", field);
        formData.append("value", (_a = value === null || value === void 0 ? void 0 : value.toString()) !== null && _a !== void 0 ? _a : "");
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.bulkUpdateJob
        });
    }, [jobId, routeData === null || routeData === void 0 ? void 0 : routeData.job]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdateCustomFields = (0, react_2.useCallback)(function (value) {
        var formData = new FormData();
        formData.append("ids", jobId);
        formData.append("table", "job");
        formData.append("value", value);
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.customFields
        });
    }, [jobId]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdateTags = (0, react_2.useCallback)(function (value) {
        var formData = new FormData();
        formData.append("ids", jobId);
        formData.append("table", "job");
        value.forEach(function (v) {
            formData.append("value", v);
        });
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.tags
        });
    }, [jobId]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdateBatchNumber = (0, react_2.useCallback)(function (trackedEntityId, value) {
        var formData = new FormData();
        if (!trackedEntityId) {
            react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Tracked entity ID is required but none was found"], ["Tracked entity ID is required but none was found"]))));
            return;
        }
        formData.append("id", trackedEntityId);
        formData.append("value", value);
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.jobBatchNumber(jobId)
        });
    }, []);
    var permissions = (0, hooks_1.usePermissions)();
    var optimisticAssignment = (0, components_1.useOptimisticAssignment)({
        id: jobId,
        table: "job"
    });
    var assignee = optimisticAssignment !== undefined
        ? optimisticAssignment
        : (_e = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _e === void 0 ? void 0 : _e.assignee;
    var canUpdate = permissions.can("update", "production");
    var isLocked = (0, production_models_1.isJobLocked)((_f = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _f === void 0 ? void 0 : _f.status);
    var isDisabled = !canUpdate || isLocked;
    var quantity = (_h = (_g = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _g === void 0 ? void 0 : _g.quantity) !== null && _h !== void 0 ? _h : 0;
    // Only offer the config-table quantity editor when the job actually carries a
    // configuration (a non-empty color/size breakdown). Bundle jobs carry none —
    // they're a single fixed color/size — so their quantity is a plain field.
    var jobConfig = (_j = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _j === void 0 ? void 0 : _j.configuration;
    var jobIsConfigured = Array.isArray(jobConfig === null || jobConfig === void 0 ? void 0 : jobConfig.configTable) && jobConfig.configTable.length > 0;
    return (<react_1.VStack spacing={4} className="w-full min-w-0 bg-card h-full overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent px-4 py-2 text-sm">
      <react_1.VStack spacing={4}>
        <react_1.HStack className="w-full justify-between">
          <h3 className="text-xxs text-foreground/70 uppercase font-light tracking-wide">
            <macro_1.Trans>Properties</macro_1.Trans>
          </h3>
          <react_1.HStack spacing={1}>
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Link"], ["Link"])))} size="sm" className="p-1" onClick={function () {
            return (0, string_1.copyToClipboard)(window.location.origin + path_1.path.to.jobDetails(jobId));
        }}>
                  <lu_1.LuLink className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy link to Job</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Copy"], ["Copy"])))} size="sm" className="p-1" onClick={function () { var _a, _b; return (0, string_1.copyToClipboard)((_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _a === void 0 ? void 0 : _a.jobId) !== null && _b !== void 0 ? _b : ""); }}>
                  <lu_1.LuCopy className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy Job number</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
          </react_1.HStack>
        </react_1.HStack>
        <span className="text-sm">{(_k = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _k === void 0 ? void 0 : _k.jobId}</span>
      </react_1.VStack>

      <react_1.VStack spacing={2}>
        <react_2.Suspense fallback={null}>
          <react_router_1.Await resolve={routeData === null || routeData === void 0 ? void 0 : routeData.trackedEntities}>
            {function (entities) {
            var _a, _b, _c;
            var trackingType = (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _a === void 0 ? void 0 : _a.itemTrackingType) !== null && _b !== void 0 ? _b : "";
            if (!["Batch", "Serial"].includes(trackingType)) {
                return null;
            }
            var trackedEntities = (_c = entities === null || entities === void 0 ? void 0 : entities.data) !== null && _c !== void 0 ? _c : [];
            return (<>
                  {trackedEntities.map(function (entity, index) {
                    var _a;
                    var trackingNumber = (_a = entity === null || entity === void 0 ? void 0 : entity.readableId) !== null && _a !== void 0 ? _a : "";
                    var label = trackedEntities.length > 1
                        ? "".concat(trackingType, " ").concat(index + 1)
                        : "".concat(trackingType, " Number");
                    return (<form_1.ValidatedForm key={entity.id} defaultValues={{
                            trackingNumber: trackingNumber
                        }} validator={zod_1.z.object({
                            trackingNumber: zod_form_data_1.zfd.text(zod_1.z.string().optional())
                        })} className="w-full">
                        <form_1.InputControlled name="trackingNumber" label={label} value={trackingNumber} size="sm" inline onBlur={function (e) {
                            var next = e.target.value.trim();
                            if (next === (trackingNumber !== null && trackingNumber !== void 0 ? trackingNumber : "").trim())
                                return;
                            onUpdateBatchNumber(entity.id, next);
                        }}/>
                      </form_1.ValidatedForm>);
                })}
                </>);
        }}
          </react_router_1.Await>
        </react_2.Suspense>
      </react_1.VStack>

      {extraProperties}

      {((_l = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _l === void 0 ? void 0 : _l.customerId) &&
            ((_m = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _m === void 0 ? void 0 : _m.salesOrderId) &&
            ((_o = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _o === void 0 ? void 0 : _o.salesOrderLineId) ? (<react_1.VStack spacing={0}>
          <span className="text-xs text-muted-foreground">
            <macro_1.Trans>Target</macro_1.Trans>
          </span>
          <react_1.HStack className="group w-full justify-between" spacing={0}>
            <components_1.Hyperlink to={path_1.path.to.salesOrderLine(routeData.job.salesOrderId, routeData === null || routeData === void 0 ? void 0 : routeData.job.salesOrderLineId)}>
              <react_1.Badge variant="secondary">
                <ri_1.RiProgress8Line className="w-3 h-3 mr-1"/>
                {(_p = routeData === null || routeData === void 0 ? void 0 : routeData.job.salesOrderReadableId) !== null && _p !== void 0 ? _p : "Make to Order"}
              </react_1.Badge>
            </components_1.Hyperlink>
            <react_1.Button className="group-hover:opacity-100 opacity-0 transition-opacity duration-200" variant="ghost" size="sm" leftIcon={<lu_1.LuUnlink2 className="w-3 h-3"/>} onClick={unlinkDisclosure.onOpen}>
              Unlink
            </react_1.Button>
          </react_1.HStack>
        </react_1.VStack>) : (<form_1.ValidatedForm defaultValues={{
                storageUnitId: (_r = (_q = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _q === void 0 ? void 0 : _q.storageUnitId) !== null && _r !== void 0 ? _r : undefined
            }} validator={zod_1.z.object({
                storageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
            })} className="w-full">
          <Form_1.StorageUnit label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Target"], ["Target"])))} name="storageUnitId" inline locationId={(_t = (_s = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _s === void 0 ? void 0 : _s.locationId) !== null && _t !== void 0 ? _t : undefined} isReadOnly={isDisabled} onChange={function (value) {
                var _a;
                onUpdate("storageUnitId", (_a = value === null || value === void 0 ? void 0 : value.id) !== null && _a !== void 0 ? _a : null);
            }}/>
        </form_1.ValidatedForm>)}

      <components_1.Assignee id={jobId} table="job" value={assignee !== null && assignee !== void 0 ? assignee : ""} variant="inline" isReadOnly={!canUpdate}/>

      <form_1.ValidatedForm defaultValues={{ itemId: (_v = (_u = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _u === void 0 ? void 0 : _u.itemId) !== null && _v !== void 0 ? _v : undefined }} validator={zod_1.z.object({
            itemId: zod_1.z.string().min(1, { message: "Item is required" })
        })} className="w-full">
        <Form_1.Item name="itemId" inline isReadOnly={isDisabled || readOnlyItem} type={type} locationId={(_x = (_w = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _w === void 0 ? void 0 : _w.locationId) !== null && _x !== void 0 ? _x : undefined} validItemTypes={validItemTypes} onChange={function (value) {
            var _a;
            onUpdate("itemId", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }} onTypeChange={function (value) {
            setType(value);
        }}/>
      </form_1.ValidatedForm>
      {configurationParameters && jobIsConfigured ? (<react_1.VStack className="w-full">
          <span className="text-xs text-muted-foreground">{t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Quantity"], ["Quantity"])))}</span>
          <react_1.HStack spacing={0} className="w-full justify-between">
            <span className="flex flex-grow line-clamp-1 items-center">
              {quantity}
            </span>
            <react_1.IconButton icon={<lu_1.LuTable size="1em" strokeWidth="3"/>} aria-label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Configure quantities"], ["Configure quantities"])))} size="sm" variant="secondary" className={(0, react_1.cn)(quantity > 0 && "text-emerald-500 hover:text-emerald-500")} isDisabled={isDisabled} onClick={function () {
                return openOverlay(Overlay_1.overlay.to.jobConfigTable({ jobId: jobId }), {
                    onCreated: revalidate
                });
            }}/>
          </react_1.HStack>
        </react_1.VStack>) : (<form_1.ValidatedForm defaultValues={{ quantity: (_z = (_y = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _y === void 0 ? void 0 : _y.quantity) !== null && _z !== void 0 ? _z : undefined }} validator={zod_1.z.object({
                quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0, { message: "Quantity is required" }))
            })} className="w-full">
          <form_1.NumberControlled label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Quantity"], ["Quantity"])))} name="quantity" inline isReadOnly={isDisabled} value={(_1 = (_0 = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _0 === void 0 ? void 0 : _0.quantity) !== null && _1 !== void 0 ? _1 : 0} onChange={function (value) {
                onUpdate("quantity", value);
            }}/>
        </form_1.ValidatedForm>)}
      <form_1.ValidatedForm defaultValues={{
            scrapQuantity: (_3 = (_2 = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _2 === void 0 ? void 0 : _2.scrapQuantity) !== null && _3 !== void 0 ? _3 : undefined
        }} validator={zod_1.z.object({
            scrapQuantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0, { message: "Quantity is required" }))
        })} className="w-full">
        <form_1.NumberControlled label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Estimated Scrap Quantity"], ["Estimated Scrap Quantity"])))} name="scrapQuantity" inline isReadOnly={isDisabled} value={(_5 = (_4 = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _4 === void 0 ? void 0 : _4.scrapQuantity) !== null && _5 !== void 0 ? _5 : 0} onChange={function (value) {
            onUpdate("scrapQuantity", value);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            startDate: (_7 = (_6 = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _6 === void 0 ? void 0 : _6.startDate) !== null && _7 !== void 0 ? _7 : ""
        }} validator={zod_1.z.object({
            startDate: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
        <form_1.DatePicker name="startDate" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Start Date"], ["Start Date"])))} inline isDisabled={isDisabled} onChange={function (date) {
            onUpdate("startDate", date);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            dueDate: (_9 = (_8 = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _8 === void 0 ? void 0 : _8.dueDate) !== null && _9 !== void 0 ? _9 : ""
        }} validator={zod_1.z.object({
            dueDate: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
        <form_1.DatePicker name="dueDate" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Due Date"], ["Due Date"])))} inline isDisabled={isDisabled} onChange={function (date) {
            onUpdate("dueDate", date);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            deadlineType: (_11 = (_10 = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _10 === void 0 ? void 0 : _10.deadlineType) !== null && _11 !== void 0 ? _11 : ""
        }} validator={zod_1.z.object({
            deadlineType: zod_1.z
                .string()
                .min(1, { message: "Deadline Type is required" })
        })} className="w-full">
        <form_1.Select name="deadlineType" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Deadline Type"], ["Deadline Type"])))} inline={function (value, options) {
            var deadlineType = value;
            return (<div className="flex gap-1 items-center">
                {(0, Deadline_1.getDeadlineIcon)(deadlineType)}
                <span>{getDeadlineTypeLabel(deadlineType)}</span>
              </div>);
        }} isReadOnly={isDisabled} options={production_models_1.deadlineTypes.map(function (d) { return ({
            value: d,
            label: getDeadlineTypeLabel(d)
        }); })} onChange={function (value) {
            var _a;
            onUpdate("deadlineType", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{ customerId: (_13 = (_12 = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _12 === void 0 ? void 0 : _12.customerId) !== null && _13 !== void 0 ? _13 : undefined }} validator={zod_1.z.object({
            customerId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
        <Form_1.Customer name="customerId" inline isOptional isReadOnly={isDisabled || !!((_14 = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _14 === void 0 ? void 0 : _14.salesOrderId)} onChange={function (value) {
            var _a;
            onUpdate("customerId", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            unitOfMeasureCode: (_16 = (_15 = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _15 === void 0 ? void 0 : _15.unitOfMeasureCode) !== null && _16 !== void 0 ? _16 : undefined
        }} validator={zod_1.z.object({
            unitOfMeasureCode: zod_1.z
                .string()
                .min(1, { message: "Unit of Measure is required" })
        })} className="w-full">
        <Form_1.UnitOfMeasure label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Unit of Measure"], ["Unit of Measure"])))} name="unitOfMeasureCode" inline isReadOnly={isDisabled} onChange={function (value) {
            var _a;
            onUpdate("unitOfMeasureCode", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{ locationId: (_18 = (_17 = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _17 === void 0 ? void 0 : _17.locationId) !== null && _18 !== void 0 ? _18 : undefined }} validator={zod_1.z.object({
            locationId: zod_1.z.string().min(1, { message: "Location is required" })
        })} className="w-full">
        <Form_1.Location label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Job Location"], ["Job Location"])))} name="locationId" inline isReadOnly={isDisabled} onChange={function (value) {
            if (value === null || value === void 0 ? void 0 : value.value) {
                onUpdate("locationId", value.value);
            }
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            tags: (_19 = routeData === null || routeData === void 0 ? void 0 : routeData.job.tags) !== null && _19 !== void 0 ? _19 : []
        }} validator={zod_1.z.object({
            tags: zod_1.z.array(zod_1.z.string()).optional()
        })} className="w-full">
        <Form_1.Tags availableTags={(_20 = routeData === null || routeData === void 0 ? void 0 : routeData.tags) !== null && _20 !== void 0 ? _20 : []} label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Tags"], ["Tags"])))} name="tags" table="job" inline onChange={onUpdateTags}/>
      </form_1.ValidatedForm>

      <react_1.VStack spacing={2}>
        <span className="text-xs font-medium text-muted-foreground">
          Created By
        </span>
        <components_1.EmployeeAvatar employeeId={(_22 = (_21 = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _21 === void 0 ? void 0 : _21.createdBy) !== null && _22 !== void 0 ? _22 : null}/>
      </react_1.VStack>

      <CustomFormInlineFields_1.default customFields={((_24 = (_23 = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _23 === void 0 ? void 0 : _23.customFields) !== null && _24 !== void 0 ? _24 : {})} table="job" tags={(_25 = routeData === null || routeData === void 0 ? void 0 : routeData.job.tags) !== null && _25 !== void 0 ? _25 : []} onUpdate={onUpdateCustomFields}/>

      {unlinkDisclosure.isOpen && (<react_1.Modal open={unlinkDisclosure.isOpen} onOpenChange={function (open) {
                if (!open)
                    unlinkDisclosure.onClose();
            }}>
          <react_1.ModalOverlay />
          <react_1.ModalContent>
            <react_1.ModalHeader>
              <react_1.ModalTitle>
                <macro_1.Trans>Unlink job from sales order?</macro_1.Trans>
              </react_1.ModalTitle>
            </react_1.ModalHeader>
            <react_1.ModalBody>
              <p className="text-sm text-muted-foreground">
                <macro_1.Trans>
                  This will remove {(_26 = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _26 === void 0 ? void 0 : _26.jobId}'s link to{" "}
                  {(_27 = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _27 === void 0 ? void 0 : _27.salesOrderReadableId}. The job will no longer
                  appear under the sales order and shipments won't find it.
                </macro_1.Trans>
              </p>
            </react_1.ModalBody>
            <react_1.ModalFooter>
              <react_1.Button variant="secondary" onClick={unlinkDisclosure.onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
              <react_1.Button variant="destructive" leftIcon={<lu_1.LuUnlink2 className="w-3 h-3"/>} onClick={function () {
                onUpdate("salesOrderLineId", null);
                unlinkDisclosure.onClose();
            }}>
                <macro_1.Trans>Unlink</macro_1.Trans>
              </react_1.Button>
            </react_1.ModalFooter>
          </react_1.ModalContent>
        </react_1.Modal>)}
    </react_1.VStack>);
};
exports.default = JobProperties;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14;
