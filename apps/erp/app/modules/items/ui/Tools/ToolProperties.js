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
var ToolProperties = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22;
    var data = _a.data;
    var t = (0, macro_1.useLingui)().t;
    var params = (0, react_router_1.useParams)();
    var itemId = (_b = data === null || data === void 0 ? void 0 : data.itemId) !== null && _b !== void 0 ? _b : params.itemId;
    if (!itemId)
        throw new Error("itemId not found");
    var sharedToolsData = (0, hooks_1.useRouteData)(path_1.path.to.toolRoot);
    // When `data` is injected (subassembly context), this hook won't match a
    // route and returns undefined — harmless, hooks must be called unconditionally.
    var routeDataFromRoute = (0, hooks_1.useRouteData)(path_1.path.to.tool(itemId));
    var routeData = data !== null && data !== void 0 ? data : routeDataFromRoute;
    var locations = (_d = (_c = data === null || data === void 0 ? void 0 : data.locations) !== null && _c !== void 0 ? _c : sharedToolsData === null || sharedToolsData === void 0 ? void 0 : sharedToolsData.locations) !== null && _d !== void 0 ? _d : [];
    var supplierParts = (_e = routeData === null || routeData === void 0 ? void 0 : routeData.supplierParts) !== null && _e !== void 0 ? _e : [];
    var pickMethods = (_f = routeData === null || routeData === void 0 ? void 0 : routeData.pickMethods) !== null && _f !== void 0 ? _f : [];
    // const optimisticAssignment = useOptimisticAssignment({
    //   id: itemId,
    //   table: "item",
    // });
    // const assignee =
    //   optimisticAssignment !== undefined
    //     ? optimisticAssignment
    //     : routeData?.toolSummary?.assignee;
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
    }, [itemId]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdateTags = (0, react_2.useCallback)(function (value) {
        var _a, _b;
        var formData = new FormData();
        formData.append("ids", (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _a === void 0 ? void 0 : _a.readableId) !== null && _b !== void 0 ? _b : "");
        formData.append("table", "tool");
        value.forEach(function (v) {
            formData.append("value", v);
        });
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.tags
        });
    }, [(_g = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _g === void 0 ? void 0 : _g.readableId]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdateCustomFields = (0, react_2.useCallback)(function (value) {
        var _a, _b;
        var formData = new FormData();
        formData.append("ids", (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _a === void 0 ? void 0 : _a.readableId) !== null && _b !== void 0 ? _b : "");
        formData.append("table", "tool");
        formData.append("value", value);
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.customFields
        });
    }, [(_h = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _h === void 0 ? void 0 : _h.readableId]);
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
            return (0, string_1.copyToClipboard)(window.location.origin + path_1.path.to.tool(itemId));
        }}>
                  <lu_1.LuLink className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy link to tool</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Copy"], ["Copy"])))} size="sm" className="p-1" onClick={function () { var _a, _b; return (0, string_1.copyToClipboard)((_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : ""); }}>
                  <lu_1.LuKeySquare className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy tool unique identifier</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Copy"], ["Copy"])))} size="sm" className="p-1" onClick={function () {
            var _a, _b;
            return (0, string_1.copyToClipboard)((_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _a === void 0 ? void 0 : _a.readableIdWithRevision) !== null && _b !== void 0 ? _b : "");
        }}>
                  <lu_1.LuCopy className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy tool number</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
          </react_1.HStack>
        </react_1.HStack>
        <react_1.VStack spacing={1} className="pt-2">
          <form_1.ValidatedForm defaultValues={{
            toolId: (_k = (_j = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _j === void 0 ? void 0 : _j.readableIdWithRevision) !== null && _k !== void 0 ? _k : undefined
        }} validator={zod_1.z.object({
            toolId: zod_1.z.string()
        })} className="w-full -mt-2">
            <span className="text-sm">
              <form_1.InputControlled label="" name="toolId" inline size="sm" value={(_m = (_l = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _l === void 0 ? void 0 : _l.readableId) !== null && _m !== void 0 ? _m : ""} onBlur={function (e) {
            var _a;
            onUpdate("toolId", (_a = e.target.value) !== null && _a !== void 0 ? _a : null);
        }} className="text-muted-foreground"/>
            </span>
          </form_1.ValidatedForm>
          <form_1.ValidatedForm defaultValues={{
            name: (_p = (_o = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _o === void 0 ? void 0 : _o.name) !== null && _p !== void 0 ? _p : undefined
        }} validator={zod_1.z.object({
            name: zod_1.z.string()
        })} className="w-full -mt-2">
            <span className="text-xs text-muted-foreground">
              <form_1.InputControlled label="" name="name" inline size="sm" characterLimit={40} value={(_r = (_q = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _q === void 0 ? void 0 : _q.name) !== null && _r !== void 0 ? _r : ""} onBlur={function (e) {
            var _a;
            onUpdate("name", (_a = e.target.value) !== null && _a !== void 0 ? _a : null);
        }} className="text-muted-foreground"/>
            </span>
          </form_1.ValidatedForm>
        </react_1.VStack>
        <ItemThumnailUpload_1.ItemThumbnailUpload path={(_s = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _s === void 0 ? void 0 : _s.thumbnailPath} itemId={itemId}/>
      </react_1.VStack>

      <form_1.ValidatedForm defaultValues={{
            itemPostingGroupId: (_u = (_t = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _t === void 0 ? void 0 : _t.itemPostingGroupId) !== null && _u !== void 0 ? _u : undefined
        }} validator={zod_1.z.object({
            itemPostingGroupId: zod_1.z.string().nullable().optional()
        })} className="w-full">
        <Form_1.ItemPostingGroup label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Item Group"], ["Item Group"])))} name="itemPostingGroupId" inline isClearable onChange={function (value) {
            var _a;
            onUpdate("itemPostingGroupId", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            replenishmentSystem: (_w = (_v = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _v === void 0 ? void 0 : _v.replenishmentSystem) !== null && _w !== void 0 ? _w : undefined
        }} validator={zod_1.z.object({
            replenishmentSystem: zod_1.z.string()
        })} className="w-full">
        <form_1.Select name="replenishmentSystem" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Replenishment"], ["Replenishment"])))} inline={function (value) { return (<react_1.Badge variant="secondary">
              <Icons_1.ReplenishmentSystemIcon type={value} className="mr-2"/>
              <span>
                {value === "Buy"
                ? t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Buy"], ["Buy"]))) : value === "Make"
                ? t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Make"], ["Make"]))) : t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Buy and Make"], ["Buy and Make"])))}
              </span>
            </react_1.Badge>); }} options={items_models_1.itemReplenishmentSystems.map(function (system) { return ({
            value: system,
            label: (<span className="flex items-center gap-2">
                <Icons_1.ReplenishmentSystemIcon type={system}/>
                {system === "Buy"
                    ? t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Buy"], ["Buy"]))) : system === "Make"
                    ? t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Make"], ["Make"]))) : t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Buy and Make"], ["Buy and Make"])))}
              </span>)
        }); })} onChange={function (value) {
            var _a;
            onUpdate("replenishmentSystem", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            itemTrackingType: (_y = (_x = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _x === void 0 ? void 0 : _x.itemTrackingType) !== null && _y !== void 0 ? _y : undefined
        }} validator={zod_1.z.object({
            itemTrackingType: zod_1.z.string()
        })} className="w-full">
        <form_1.Select name="itemTrackingType" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Tracking Type"], ["Tracking Type"])))} inline={function (value) { return (<react_1.Badge variant="secondary">
              <components_1.TrackingTypeIcon type={value} className="mr-2"/>
              <span>
                {value === "Inventory"
                ? t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Inventory"], ["Inventory"]))) : value === "Non-Inventory"
                ? t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Non-Inventory"], ["Non-Inventory"]))) : value === "Serial"
                ? t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Serial"], ["Serial"]))) : t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Batch"], ["Batch"])))}
              </span>
            </react_1.Badge>); }} options={items_models_1.itemTrackingTypes.map(function (type) { return ({
            value: type,
            label: (<span className="flex items-center gap-2">
                <components_1.TrackingTypeIcon type={type}/>
                {type === "Inventory"
                    ? t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Inventory"], ["Inventory"]))) : type === "Non-Inventory"
                    ? t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Non-Inventory"], ["Non-Inventory"]))) : type === "Serial"
                    ? t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Serial"], ["Serial"]))) : t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Batch"], ["Batch"])))}
              </span>)
        }); })} onChange={function (value) {
            var _a;
            onUpdate("itemTrackingType", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            defaultMethodType: (_0 = (_z = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _z === void 0 ? void 0 : _z.defaultMethodType) !== null && _0 !== void 0 ? _0 : undefined
        }} validator={zod_1.z.object({
            defaultMethodType: zod_1.z.string()
        })} className="w-full">
        <form_1.Select name="defaultMethodType" label={t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Default Method Type"], ["Default Method Type"])))} inline={function (value) { return (<react_1.Badge variant="secondary">
              <components_1.MethodIcon type={value} className="mr-2"/>
              <span>
                {value === "Purchase to Order"
                ? t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Purchase to Order"], ["Purchase to Order"]))) : value === "Pull from Inventory"
                ? t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Pull from Inventory"], ["Pull from Inventory"]))) : t(templateObject_24 || (templateObject_24 = __makeTemplateObject(["Make to Order"], ["Make to Order"])))}
              </span>
            </react_1.Badge>); }} options={shared_1.methodType
            .filter(function (type) {
            var _a;
            var replenishment = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _a === void 0 ? void 0 : _a.replenishmentSystem;
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
                    ? t(templateObject_25 || (templateObject_25 = __makeTemplateObject(["Purchase to Order"], ["Purchase to Order"]))) : type === "Pull from Inventory"
                    ? t(templateObject_26 || (templateObject_26 = __makeTemplateObject(["Pull from Inventory"], ["Pull from Inventory"]))) : t(templateObject_27 || (templateObject_27 = __makeTemplateObject(["Make to Order"], ["Make to Order"])))}
                </span>)
        }); })} onChange={function (value) {
            var _a;
            onUpdate("defaultMethodType", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
      </form_1.ValidatedForm>

      <Item_1.SourcingTypeProperty replenishmentSystem={(_1 = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _1 === void 0 ? void 0 : _1.replenishmentSystem} value={(_2 = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _2 === void 0 ? void 0 : _2.sourcingType} onChange={function (value) { return onUpdate("sourcingType", value); }}/>

      <react_1.VStack spacing={2}>
        <h3 className="text-xs text-muted-foreground">
          <macro_1.Trans>Unit of Measure</macro_1.Trans>
        </h3>
        {((_3 = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _3 === void 0 ? void 0 : _3.unitOfMeasure) && (<react_1.Badge variant="secondary">
            {routeData.toolSummary.unitOfMeasure}
          </react_1.Badge>)}
      </react_1.VStack>

      <Item_1.ItemDescription value={(_5 = (_4 = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _4 === void 0 ? void 0 : _4.description) !== null && _5 !== void 0 ? _5 : ""} onChange={function (value) { return onUpdate("description", value); }}/>

      <react_1.VStack spacing={2}>
        <react_1.HStack className="w-full justify-between">
          <h3 className="text-xs text-muted-foreground">
            <macro_1.Trans>Methods</macro_1.Trans>
          </h3>
        </react_1.HStack>
        {((_7 = (_6 = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _6 === void 0 ? void 0 : _6.replenishmentSystem) === null || _7 === void 0 ? void 0 : _7.includes("Make")) && (<react_2.Suspense fallback={null}>
            <react_router_1.Await resolve={routeData === null || routeData === void 0 ? void 0 : routeData.makeMethods}>
              {function (makeMethods) {
                var _a;
                return (_a = makeMethods.data) === null || _a === void 0 ? void 0 : _a.sort(function (a, b) { return b.version - a.version; }).map(function (method) {
                    return (<components_1.MethodBadge key={method.id} type="Make to Order" text={"Version ".concat(method.version)} to={"".concat(path_1.path.to.toolDetails(itemId), "?methodId=").concat(method.id)}/>);
                });
            }}
            </react_router_1.Await>
          </react_2.Suspense>)}
        {((_9 = (_8 = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _8 === void 0 ? void 0 : _8.replenishmentSystem) === null || _9 === void 0 ? void 0 : _9.includes("Buy")) &&
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
            active: (_11 = (_10 = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _10 === void 0 ? void 0 : _10.active) !== null && _11 !== void 0 ? _11 : undefined
        }} validator={zod_1.z.object({
            active: zod_form_data_1.zfd.checkbox()
        })} className="w-full">
        <Form_1.Boolean label={t(templateObject_28 || (templateObject_28 = __makeTemplateObject(["Active"], ["Active"])))} name="active" variant="small" onChange={function (value) {
            onUpdate("active", value ? "on" : "off");
        }}/>
      </form_1.ValidatedForm>
      {((_13 = (_12 = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _12 === void 0 ? void 0 : _12.replenishmentSystem) === null || _13 === void 0 ? void 0 : _13.includes("Buy")) && (<form_1.ValidatedForm defaultValues={{
                requiresInspection: (_15 = (_14 = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _14 === void 0 ? void 0 : _14.requiresInspection) !== null && _15 !== void 0 ? _15 : false
            }} validator={zod_1.z.object({
                requiresInspection: zod_form_data_1.zfd.checkbox()
            })} className="w-full">
          <Form_1.Boolean label={t(templateObject_29 || (templateObject_29 = __makeTemplateObject(["Requires Inspection"], ["Requires Inspection"])))} name="requiresInspection" variant="small" onChange={function (value) {
                onUpdate("requiresInspection", value ? "on" : "off");
            }}/>
        </form_1.ValidatedForm>)}
      <form_1.ValidatedForm defaultValues={{
            tags: (_17 = (_16 = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _16 === void 0 ? void 0 : _16.tags) !== null && _17 !== void 0 ? _17 : []
        }} validator={zod_1.z.object({
            tags: zod_1.z.array(zod_1.z.string()).optional()
        })} className="w-full">
        <Form_1.Tags label={t(templateObject_30 || (templateObject_30 = __makeTemplateObject(["Tags"], ["Tags"])))} name="tags" availableTags={(_18 = routeData === null || routeData === void 0 ? void 0 : routeData.tags) !== null && _18 !== void 0 ? _18 : []} table="tool" inline onChange={onUpdateTags}/>
      </form_1.ValidatedForm>

      <CustomFormInlineFields_1.default customFields={((_20 = (_19 = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _19 === void 0 ? void 0 : _19.customFields) !== null && _20 !== void 0 ? _20 : {})} table="tool" tags={(_22 = (_21 = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _21 === void 0 ? void 0 : _21.tags) !== null && _22 !== void 0 ? _22 : []} onUpdate={onUpdateCustomFields}/>

      <react_1.VStack spacing={2}>
        <react_1.HStack className="w-full justify-between">
          <h3 className="text-xs text-muted-foreground">
            <macro_1.Trans>Files</macro_1.Trans>
          </h3>
        </react_1.HStack>

        <react_2.Suspense fallback={null}>
          <react_router_1.Await resolve={routeData === null || routeData === void 0 ? void 0 : routeData.files}>
            {function (files) {
            return files === null || files === void 0 ? void 0 : files.map(function (file) { return (<Item_1.FileBadge key={file.id} file={file} itemId={itemId} itemType="Tool"/>); });
        }}
          </react_router_1.Await>
        </react_2.Suspense>
      </react_1.VStack>
    </react_1.VStack>);
};
exports.default = ToolProperties;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27, templateObject_28, templateObject_29, templateObject_30;
