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
var Icons_1 = require("~/components/Icons");
var ItemThumnailUpload_1 = require("~/components/ItemThumnailUpload");
var hooks_1 = require("~/hooks");
var shared_1 = require("~/modules/shared");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
var items_models_1 = require("../../items.models");
var Item_1 = require("../Item");
var PartProperties = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28;
    var data = _a.data;
    var t = (0, macro_1.useLingui)().t;
    var params = (0, react_router_1.useParams)();
    var itemId = (_b = data === null || data === void 0 ? void 0 : data.itemId) !== null && _b !== void 0 ? _b : params.itemId;
    if (!itemId)
        throw new Error("itemId not found");
    var sharedPartsData = (0, hooks_1.useRouteData)(path_1.path.to.partRoot);
    // When `data` is injected (subassembly context), this hook won't match a
    // route and returns undefined — harmless, hooks must be called unconditionally.
    var routeDataFromRoute = (0, hooks_1.useRouteData)(path_1.path.to.part(itemId));
    var routeData = data !== null && data !== void 0 ? data : routeDataFromRoute;
    var locations = (_d = (_c = data === null || data === void 0 ? void 0 : data.locations) !== null && _c !== void 0 ? _c : sharedPartsData === null || sharedPartsData === void 0 ? void 0 : sharedPartsData.locations) !== null && _d !== void 0 ? _d : [];
    var supplierParts = (_e = routeData === null || routeData === void 0 ? void 0 : routeData.supplierParts) !== null && _e !== void 0 ? _e : [];
    var pickMethods = (_f = routeData === null || routeData === void 0 ? void 0 : routeData.pickMethods) !== null && _f !== void 0 ? _f : [];
    // const optimisticAssignment = useOptimisticAssignment({
    //   id: itemId,
    //   table: "item",
    // });
    // const assignee =
    //   optimisticAssignment !== undefined
    //     ? optimisticAssignment
    //     : routeData?.partSummary?.assignee;
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.error) {
            react_1.toast.error(fetcher.data.error.message);
        }
    }, [fetcher.data]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdate = (0, react_2.useCallback)(function (field, value) {
        var _a;
        var formData = new FormData();
        formData.append("items", itemId);
        formData.append("field", field);
        formData.append("value", (_a = value === null || value === void 0 ? void 0 : value.toString()) !== null && _a !== void 0 ? _a : "");
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.bulkUpdateItems
        });
    }, [(_g = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _g === void 0 ? void 0 : _g.id]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdateTags = (0, react_2.useCallback)(function (value) {
        var _a, _b;
        var formData = new FormData();
        formData.append("ids", (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _a === void 0 ? void 0 : _a.readableId) !== null && _b !== void 0 ? _b : "");
        formData.append("table", "part");
        value.forEach(function (v) {
            formData.append("value", v);
        });
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.tags
        });
    }, [(_h = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _h === void 0 ? void 0 : _h.readableId]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdateCustomFields = (0, react_2.useCallback)(function (value) {
        var _a, _b;
        var formData = new FormData();
        formData.append("ids", (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _a === void 0 ? void 0 : _a.readableId) !== null && _b !== void 0 ? _b : "");
        formData.append("table", "part");
        formData.append("value", value);
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.customFields
        });
    }, [(_j = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _j === void 0 ? void 0 : _j.readableId]);
    var suppliers = (0, stores_1.useSuppliers)()[0];
    return (<react_1.VStack spacing={4} className="w-full min-w-0 bg-card h-full overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent px-4 py-2 text-sm">
      <react_1.VStack spacing={2}>
        <react_1.HStack className="w-full justify-between">
          <h3 className="text-xxs text-foreground/70 uppercase font-light tracking-wide">
            <macro_1.Trans>Properties</macro_1.Trans>
          </h3>
          <react_1.HStack spacing={1}>
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Link"], ["Link"])))} size="sm" className="p-1" onClick={function () {
            return (0, string_1.copyToClipboard)(window.location.origin + path_1.path.to.part(itemId));
        }}>
                  <lu_1.LuLink className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy link to part</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Copy"], ["Copy"])))} size="sm" className="p-1" onClick={function () { return (0, string_1.copyToClipboard)(itemId); }}>
                  <lu_1.LuKeySquare className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy part unique identifier</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Copy"], ["Copy"])))} size="sm" className="p-1" onClick={function () {
            var _a, _b;
            return (0, string_1.copyToClipboard)((_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _a === void 0 ? void 0 : _a.readableIdWithRevision) !== null && _b !== void 0 ? _b : "");
        }}>
                  <lu_1.LuCopy className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy part number</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
          </react_1.HStack>
        </react_1.HStack>
        <react_1.VStack spacing={1} className="pt-2">
          <form_1.ValidatedForm defaultValues={{
            partId: (_l = (_k = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _k === void 0 ? void 0 : _k.readableIdWithRevision) !== null && _l !== void 0 ? _l : undefined
        }} validator={zod_1.z.object({
            partId: zod_1.z.string()
        })} className="w-full -mt-2">
            <span className="text-sm">
              <form_1.InputControlled label="" name="partId" inline size="sm" value={(_o = (_m = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _m === void 0 ? void 0 : _m.readableId) !== null && _o !== void 0 ? _o : ""} onBlur={function (e) {
            var _a;
            onUpdate("partId", (_a = e.target.value) !== null && _a !== void 0 ? _a : null);
        }} className="text-muted-foreground"/>
            </span>
          </form_1.ValidatedForm>
          <form_1.ValidatedForm defaultValues={{
            name: (_q = (_p = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _p === void 0 ? void 0 : _p.name) !== null && _q !== void 0 ? _q : undefined
        }} validator={zod_1.z.object({
            name: zod_1.z.string()
        })} className="w-full -mt-2">
            <span className="text-xs text-muted-foreground">
              <form_1.InputControlled label="" name="name" inline size="sm" characterLimit={40} value={(_s = (_r = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _r === void 0 ? void 0 : _r.name) !== null && _s !== void 0 ? _s : ""} onBlur={function (e) {
            var _a;
            onUpdate("name", (_a = e.target.value) !== null && _a !== void 0 ? _a : null);
        }} className="text-muted-foreground"/>
            </span>
          </form_1.ValidatedForm>
        </react_1.VStack>
        <ItemThumnailUpload_1.ItemThumbnailUpload path={(_t = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _t === void 0 ? void 0 : _t.thumbnailPath} itemId={itemId} modelId={(_u = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _u === void 0 ? void 0 : _u.modelId}/>
      </react_1.VStack>

      {/* <VStack spacing={2}>
          <h3 className="text-xs text-muted-foreground">Assignee</h3>
          <Assignee
            id={itemId}
            table="item"
            value={assignee ?? ""}
            isReadOnly={!permissions.can("update", "parts")}
          />
        </VStack> */}

      <form_1.ValidatedForm defaultValues={{
            itemPostingGroupId: (_w = (_v = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _v === void 0 ? void 0 : _v.itemPostingGroupId) !== null && _w !== void 0 ? _w : undefined
        }} validator={zod_1.z.object({
            itemPostingGroupId: zod_1.z.string().nullable().optional()
        })} className="w-full">
        <Form_1.ItemPostingGroup label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Item Group"], ["Item Group"])))} name="itemPostingGroupId" inline isClearable onChange={function (value) {
            var _a;
            onUpdate("itemPostingGroupId", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            templateId: (_y = (_x = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _x === void 0 ? void 0 : _x.templateId) !== null && _y !== void 0 ? _y : undefined
        }} validator={zod_1.z.object({
            templateId: zod_1.z.string().nullable().optional()
        })} className="w-full">
        <Form_1.Template label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Template"], ["Template"])))} name="templateId" inline onChange={function (value) {
            var _a;
            onUpdate("templateId", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            replenishmentSystem: (_0 = (_z = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _z === void 0 ? void 0 : _z.replenishmentSystem) !== null && _0 !== void 0 ? _0 : undefined
        }} validator={zod_1.z.object({
            replenishmentSystem: zod_1.z.string()
        })} className="w-full">
        <form_1.Select name="replenishmentSystem" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Replenishment"], ["Replenishment"])))} inline={function (value) { return (<react_1.Badge variant="secondary">
              <Icons_1.ReplenishmentSystemIcon type={value} className="mr-2"/>
              <span>
                {value === "Buy"
                ? t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Buy"], ["Buy"]))) : value === "Make"
                ? t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Make"], ["Make"]))) : t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Buy and Make"], ["Buy and Make"])))}
              </span>
            </react_1.Badge>); }} options={items_models_1.itemReplenishmentSystems.map(function (system) { return ({
            value: system,
            label: (<span className="flex items-center gap-2">
                <Icons_1.ReplenishmentSystemIcon type={system}/>
                {system === "Buy"
                    ? t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Buy"], ["Buy"]))) : system === "Make"
                    ? t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Make"], ["Make"]))) : t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Buy and Make"], ["Buy and Make"])))}
              </span>)
        }); })} onChange={function (value) {
            var _a;
            onUpdate("replenishmentSystem", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            itemTrackingType: (_2 = (_1 = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _1 === void 0 ? void 0 : _1.itemTrackingType) !== null && _2 !== void 0 ? _2 : undefined
        }} validator={zod_1.z.object({
            itemTrackingType: zod_1.z.string()
        })} className="w-full">
        <form_1.Select name="itemTrackingType" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Tracking Type"], ["Tracking Type"])))} inline={function (value) { return (<react_1.Badge variant="secondary">
              <components_1.TrackingTypeIcon type={value} className="mr-2"/>
              <span>
                {value === "Inventory"
                ? t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Inventory"], ["Inventory"]))) : value === "Non-Inventory"
                ? t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Non-Inventory"], ["Non-Inventory"]))) : value === "Serial"
                ? t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Serial"], ["Serial"]))) : t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Batch"], ["Batch"])))}
              </span>
            </react_1.Badge>); }} options={items_models_1.itemTrackingTypes.map(function (type) { return ({
            value: type,
            label: (<span className="flex items-center gap-2">
                <components_1.TrackingTypeIcon type={type}/>
                {type === "Inventory"
                    ? t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Inventory"], ["Inventory"]))) : type === "Non-Inventory"
                    ? t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Non-Inventory"], ["Non-Inventory"]))) : type === "Serial"
                    ? t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Serial"], ["Serial"]))) : t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Batch"], ["Batch"])))}
              </span>)
        }); })} onChange={function (value) {
            var _a;
            onUpdate("itemTrackingType", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            defaultMethodType: (_4 = (_3 = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _3 === void 0 ? void 0 : _3.defaultMethodType) !== null && _4 !== void 0 ? _4 : undefined
        }} validator={zod_1.z.object({
            defaultMethodType: zod_1.z.string()
        })} className="w-full">
        <form_1.Select name="defaultMethodType" label={t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Default Method Type"], ["Default Method Type"])))} inline={function (value) { return (<react_1.Badge variant="secondary">
              <components_1.MethodIcon type={value} className="mr-2"/>
              <span>
                {value === "Purchase to Order"
                ? t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Purchase to Order"], ["Purchase to Order"]))) : value === "Pull from Inventory"
                ? t(templateObject_24 || (templateObject_24 = __makeTemplateObject(["Pull from Inventory"], ["Pull from Inventory"]))) : t(templateObject_25 || (templateObject_25 = __makeTemplateObject(["Make to Order"], ["Make to Order"])))}
              </span>
            </react_1.Badge>); }} options={shared_1.methodType
            .filter(function (type) {
            var _a;
            var replenishment = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _a === void 0 ? void 0 : _a.replenishmentSystem;
            if (replenishment === "Buy")
                return type !== "Make to Order";
            if (replenishment === "Make")
                return type !== "Purchase to Order";
            return true;
        })
            .map(function (type) { return ({
            value: type,
            label: (<span className="flex items-center gap-2">
                  <components_1.MethodIcon type={type}/>
                  {type === "Purchase to Order"
                    ? t(templateObject_26 || (templateObject_26 = __makeTemplateObject(["Purchase to Order"], ["Purchase to Order"]))) : type === "Pull from Inventory"
                    ? t(templateObject_27 || (templateObject_27 = __makeTemplateObject(["Pull from Inventory"], ["Pull from Inventory"]))) : t(templateObject_28 || (templateObject_28 = __makeTemplateObject(["Make to Order"], ["Make to Order"])))}
                </span>)
        }); })} onChange={function (value) {
            var _a;
            onUpdate("defaultMethodType", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
      </form_1.ValidatedForm>

      <Item_1.SourcingTypeProperty replenishmentSystem={(_5 = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _5 === void 0 ? void 0 : _5.replenishmentSystem} value={(_6 = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _6 === void 0 ? void 0 : _6.sourcingType} onChange={function (value) { return onUpdate("sourcingType", value); }}/>

      <form_1.ValidatedForm defaultValues={{
            unitOfMeasureCode: (_8 = (_7 = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _7 === void 0 ? void 0 : _7.unitOfMeasureCode) !== null && _8 !== void 0 ? _8 : undefined
        }} validator={zod_1.z.object({
            unitOfMeasureCode: zod_1.z
                .string()
                .min(1, { message: "Unit of Measure is required" })
        })} className="w-full">
        <Form_1.UnitOfMeasure label={t(templateObject_29 || (templateObject_29 = __makeTemplateObject(["Unit of Measure"], ["Unit of Measure"])))} name="unitOfMeasureCode" inline onChange={function (value) {
            var _a;
            onUpdate("unitOfMeasureCode", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
      </form_1.ValidatedForm>

      <Item_1.ItemDescription value={(_10 = (_9 = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _9 === void 0 ? void 0 : _9.description) !== null && _10 !== void 0 ? _10 : ""} onChange={function (value) { return onUpdate("description", value); }}/>

      <react_1.VStack spacing={2}>
        <react_1.HStack className="w-full justify-between">
          <h3 className="text-xs text-muted-foreground">
            <macro_1.Trans>Methods</macro_1.Trans>
          </h3>
        </react_1.HStack>
        {((_12 = (_11 = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _11 === void 0 ? void 0 : _11.replenishmentSystem) === null || _12 === void 0 ? void 0 : _12.includes("Make")) && (<react_2.Suspense fallback={null}>
            <react_router_1.Await resolve={routeData === null || routeData === void 0 ? void 0 : routeData.makeMethods}>
              {function (makeMethods) {
                var _a;
                return (_a = makeMethods.data) === null || _a === void 0 ? void 0 : _a.sort(function (a, b) { return b.version - a.version; }).map(function (method) {
                    var _a;
                    var isActive = method.status === "Active" ||
                        ((_a = makeMethods.data) === null || _a === void 0 ? void 0 : _a.length) === 1;
                    return (<components_1.MethodBadge key={method.id} type="Make to Order" text={"Version ".concat(method.version)} to={"".concat(path_1.path.to.partDetails(itemId), "?methodId=").concat(method.id)} className={isActive ? undefined : "opacity-50"}/>);
                });
            }}
            </react_router_1.Await>
          </react_2.Suspense>)}
        {((_14 = (_13 = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _13 === void 0 ? void 0 : _13.replenishmentSystem) === null || _14 === void 0 ? void 0 : _14.includes("Buy")) &&
            supplierParts.map(function (method) {
                var _a, _b;
                return (<components_1.MethodBadge key={method.id} type="Purchase to Order" text={(_b = (_a = suppliers.find(function (s) { return s.id === method.supplierId; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : ""} to={path_1.path.to.partPurchasing(itemId)}/>);
            })}
        {pickMethods.map(function (method) {
            var _a, _b;
            return (<components_1.MethodBadge key={method.locationId} type="Pull from Inventory" text={(_b = (_a = locations.find(function (l) { return l.id === method.locationId; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : ""} to={path_1.path.to.partInventoryLocation(itemId, method.locationId)}/>);
        })}
      </react_1.VStack>
      <form_1.ValidatedForm defaultValues={{
            active: (_16 = (_15 = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _15 === void 0 ? void 0 : _15.active) !== null && _16 !== void 0 ? _16 : undefined
        }} validator={zod_1.z.object({
            active: zod_form_data_1.zfd.checkbox()
        })} className="w-full">
        <Form_1.Boolean label={t(templateObject_30 || (templateObject_30 = __makeTemplateObject(["Active"], ["Active"])))} name="active" variant="small" onChange={function (value) {
            onUpdate("active", value ? "on" : "off");
        }}/>
      </form_1.ValidatedForm>
      {((_18 = (_17 = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _17 === void 0 ? void 0 : _17.replenishmentSystem) === null || _18 === void 0 ? void 0 : _18.includes("Buy")) && (<form_1.ValidatedForm defaultValues={{
                requiresInspection: (_20 = (_19 = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _19 === void 0 ? void 0 : _19.requiresInspection) !== null && _20 !== void 0 ? _20 : false
            }} validator={zod_1.z.object({
                requiresInspection: zod_form_data_1.zfd.checkbox()
            })} className="w-full">
          <Form_1.Boolean label={t(templateObject_31 || (templateObject_31 = __makeTemplateObject(["Requires Inspection"], ["Requires Inspection"])))} name="requiresInspection" variant="small" onChange={function (value) {
                onUpdate("requiresInspection", value ? "on" : "off");
            }}/>
        </form_1.ValidatedForm>)}
      <form_1.ValidatedForm defaultValues={{
            tags: (_22 = (_21 = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _21 === void 0 ? void 0 : _21.tags) !== null && _22 !== void 0 ? _22 : []
        }} validator={zod_1.z.object({
            tags: zod_1.z.array(zod_1.z.string()).optional()
        })} className="w-full">
        <Form_1.Tags availableTags={(_23 = routeData === null || routeData === void 0 ? void 0 : routeData.tags) !== null && _23 !== void 0 ? _23 : []} label={t(templateObject_32 || (templateObject_32 = __makeTemplateObject(["Tags"], ["Tags"])))} name="tags" table="part" inline onChange={onUpdateTags}/>
      </form_1.ValidatedForm>

      <CustomFormInlineFields_1.default customFields={((_25 = (_24 = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _24 === void 0 ? void 0 : _24.customFields) !== null && _25 !== void 0 ? _25 : {})} table="part" tags={(_27 = (_26 = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _26 === void 0 ? void 0 : _26.tags) !== null && _27 !== void 0 ? _27 : []} onUpdate={onUpdateCustomFields}/>

      <react_1.VStack spacing={2}>
        <react_1.HStack className="w-full justify-between">
          <h3 className="text-xs text-muted-foreground">
            <macro_1.Trans>Files</macro_1.Trans>
          </h3>
        </react_1.HStack>
        {((_28 = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _28 === void 0 ? void 0 : _28.modelId) && (<react_router_1.Link className="group flex items-center gap-1" to={path_1.path.to.file.cadModel(routeData === null || routeData === void 0 ? void 0 : routeData.partSummary.modelId)} target="_blank">
            <react_1.Badge variant="secondary">
              <lu_1.LuMove3D className="w-3 h-3 mr-1 text-emerald-500"/>
              <macro_1.Trans>3D Model</macro_1.Trans>
            </react_1.Badge>
            <span className="group-hover:opacity-100 opacity-0 transition-opacity duration-200 w-4 h-4 text-foreground">
              <lu_1.LuExternalLink />
            </span>
          </react_router_1.Link>)}

        <react_2.Suspense fallback={null}>
          <react_router_1.Await resolve={routeData === null || routeData === void 0 ? void 0 : routeData.files}>
            {function (files) {
            return files === null || files === void 0 ? void 0 : files.map(function (file) { return (<Item_1.FileBadge key={file.id} file={file} itemId={itemId} itemType="Part"/>); });
        }}
          </react_router_1.Await>
        </react_2.Suspense>
      </react_1.VStack>
    </react_1.VStack>);
};
exports.default = PartProperties;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27, templateObject_28, templateObject_29, templateObject_30, templateObject_31, templateObject_32;
