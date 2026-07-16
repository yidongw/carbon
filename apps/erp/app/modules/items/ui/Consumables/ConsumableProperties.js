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
var Enumerable_1 = require("~/components/Enumerable");
var Form_1 = require("~/components/Form");
var CustomFormInlineFields_1 = require("~/components/Form/CustomFormInlineFields");
var ItemThumnailUpload_1 = require("~/components/ItemThumnailUpload");
var hooks_1 = require("~/hooks");
var shared_1 = require("~/modules/shared");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
var items_models_1 = require("../../items.models");
var Item_1 = require("../Item");
var ConsumableProperties = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17;
    var data = _a.data;
    var t = (0, macro_1.useLingui)().t;
    var translateMethodType = function (v) {
        return v === "Purchase to Order"
            ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Purchase to Order"], ["Purchase to Order"]))) : v === "Pull from Inventory"
            ? t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Pull from Inventory"], ["Pull from Inventory"]))) : t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Make to Order"], ["Make to Order"])));
    };
    var translateTrackingType = function (v) {
        return v === "Inventory"
            ? t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Inventory"], ["Inventory"]))) : v === "Non-Inventory"
            ? t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Non-Inventory"], ["Non-Inventory"]))) : v === "Serial"
            ? t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Serial"], ["Serial"]))) : t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Batch"], ["Batch"])));
    };
    var params = (0, react_router_1.useParams)();
    var itemId = (_b = data === null || data === void 0 ? void 0 : data.itemId) !== null && _b !== void 0 ? _b : params.itemId;
    if (!itemId)
        throw new Error("itemId not found");
    var sharedConsumablesData = (0, hooks_1.useRouteData)(path_1.path.to.consumableRoot);
    // When `data` is injected (subassembly context), this hook won't match a
    // route and returns undefined — harmless, hooks must be called unconditionally.
    var routeDataFromRoute = (0, hooks_1.useRouteData)(path_1.path.to.consumable(itemId));
    var routeData = data !== null && data !== void 0 ? data : routeDataFromRoute;
    var locations = (_d = (_c = data === null || data === void 0 ? void 0 : data.locations) !== null && _c !== void 0 ? _c : sharedConsumablesData === null || sharedConsumablesData === void 0 ? void 0 : sharedConsumablesData.locations) !== null && _d !== void 0 ? _d : [];
    var supplierParts = (_e = routeData === null || routeData === void 0 ? void 0 : routeData.supplierParts) !== null && _e !== void 0 ? _e : [];
    var pickMethods = (_f = routeData === null || routeData === void 0 ? void 0 : routeData.pickMethods) !== null && _f !== void 0 ? _f : [];
    // const optimisticAssignment = useOptimisticAssignment({
    //   id: itemId,
    //   table: "item",
    // });
    // const assignee =
    //   optimisticAssignment !== undefined
    //     ? optimisticAssignment
    //     : routeData?.consumableSummary?.assignee;
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
        formData.append("ids", (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.consumableSummary) === null || _a === void 0 ? void 0 : _a.readableId) !== null && _b !== void 0 ? _b : "");
        formData.append("table", "consumable");
        value.forEach(function (v) {
            formData.append("value", v);
        });
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.tags
        });
    }, [(_g = routeData === null || routeData === void 0 ? void 0 : routeData.consumableSummary) === null || _g === void 0 ? void 0 : _g.readableId]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdateCustomFields = (0, react_2.useCallback)(function (value) {
        var _a, _b;
        var formData = new FormData();
        formData.append("ids", (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.consumableSummary) === null || _a === void 0 ? void 0 : _a.readableId) !== null && _b !== void 0 ? _b : "");
        formData.append("table", "consumable");
        formData.append("value", value);
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.customFields
        });
    }, [(_h = routeData === null || routeData === void 0 ? void 0 : routeData.consumableSummary) === null || _h === void 0 ? void 0 : _h.readableId]);
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
                <react_1.Button variant="ghost" aria-label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Link"], ["Link"])))} size="sm" className="p-1" onClick={function () {
            return (0, string_1.copyToClipboard)(window.location.origin + path_1.path.to.consumable(itemId));
        }}>
                  <lu_1.LuLink className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy link to consumable</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>

            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Copy"], ["Copy"])))} size="sm" className="p-1" onClick={function () {
            var _a, _b;
            return (0, string_1.copyToClipboard)((_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.consumableSummary) === null || _a === void 0 ? void 0 : _a.readableIdWithRevision) !== null && _b !== void 0 ? _b : "");
        }}>
                  <lu_1.LuCopy className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy consumable number</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
          </react_1.HStack>
        </react_1.HStack>
        <react_1.VStack spacing={1} className="pt-2">
          <form_1.ValidatedForm defaultValues={{
            consumableId: (_k = (_j = routeData === null || routeData === void 0 ? void 0 : routeData.consumableSummary) === null || _j === void 0 ? void 0 : _j.readableIdWithRevision) !== null && _k !== void 0 ? _k : undefined
        }} validator={zod_1.z.object({
            consumableId: zod_1.z.string()
        })} className="w-full -mt-2">
            <span className="text-sm">
              <form_1.InputControlled label="" name="consumableId" inline size="sm" value={(_m = (_l = routeData === null || routeData === void 0 ? void 0 : routeData.consumableSummary) === null || _l === void 0 ? void 0 : _l.readableId) !== null && _m !== void 0 ? _m : ""} onBlur={function (e) {
            var _a;
            onUpdate("consumableId", (_a = e.target.value) !== null && _a !== void 0 ? _a : null);
        }} className="text-muted-foreground"/>
            </span>
          </form_1.ValidatedForm>
          <form_1.ValidatedForm defaultValues={{
            name: (_p = (_o = routeData === null || routeData === void 0 ? void 0 : routeData.consumableSummary) === null || _o === void 0 ? void 0 : _o.name) !== null && _p !== void 0 ? _p : undefined
        }} validator={zod_1.z.object({
            name: zod_1.z.string()
        })} className="w-full -mt-2">
            <span className="text-xs text-muted-foreground">
              <form_1.InputControlled label="" name="name" inline size="sm" characterLimit={40} value={(_r = (_q = routeData === null || routeData === void 0 ? void 0 : routeData.consumableSummary) === null || _q === void 0 ? void 0 : _q.name) !== null && _r !== void 0 ? _r : ""} onBlur={function (e) {
            var _a;
            onUpdate("name", (_a = e.target.value) !== null && _a !== void 0 ? _a : null);
        }} className="text-muted-foreground"/>
            </span>
          </form_1.ValidatedForm>
        </react_1.VStack>
        <ItemThumnailUpload_1.ItemThumbnailUpload path={(_s = routeData === null || routeData === void 0 ? void 0 : routeData.consumableSummary) === null || _s === void 0 ? void 0 : _s.thumbnailPath} itemId={itemId}/>
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
            itemPostingGroupId: (_u = (_t = routeData === null || routeData === void 0 ? void 0 : routeData.consumableSummary) === null || _t === void 0 ? void 0 : _t.itemPostingGroupId) !== null && _u !== void 0 ? _u : undefined
        }} validator={zod_1.z.object({
            itemPostingGroupId: zod_1.z.string().nullable().optional()
        })} className="w-full">
        <Form_1.ItemPostingGroup label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Item Group"], ["Item Group"])))} name="itemPostingGroupId" inline isClearable onChange={function (value) {
            var _a;
            onUpdate("itemPostingGroupId", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            itemTrackingType: (_w = (_v = routeData === null || routeData === void 0 ? void 0 : routeData.consumableSummary) === null || _v === void 0 ? void 0 : _v.itemTrackingType) !== null && _w !== void 0 ? _w : undefined
        }} validator={zod_1.z.object({
            itemTrackingType: zod_1.z.string()
        })} className="w-full">
        <form_1.Select name="itemTrackingType" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Tracking Type"], ["Tracking Type"])))} inline={function (value) { return (<react_1.Badge variant="secondary">
              <components_1.TrackingTypeIcon type={value} className="mr-2"/>
              <span>{translateTrackingType(value)}</span>
            </react_1.Badge>); }} options={items_models_1.itemTrackingTypes.map(function (type) { return ({
            value: type,
            label: (<span className="flex items-center gap-2">
                <components_1.TrackingTypeIcon type={type}/>
                {translateTrackingType(type)}
              </span>)
        }); })} onChange={function (value) {
            var _a;
            onUpdate("itemTrackingType", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            defaultMethodType: (_y = (_x = routeData === null || routeData === void 0 ? void 0 : routeData.consumableSummary) === null || _x === void 0 ? void 0 : _x.defaultMethodType) !== null && _y !== void 0 ? _y : undefined
        }} validator={zod_1.z.object({
            defaultMethodType: zod_1.z.string()
        })} className="w-full">
        <form_1.Select name="defaultMethodType" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Default Method Type"], ["Default Method Type"])))} inline={function (value) { return (<react_1.Badge variant="secondary">
              <components_1.MethodIcon type={value} className="mr-2"/>
              <span>{translateMethodType(value)}</span>
            </react_1.Badge>); }} options={shared_1.methodType
            .filter(function (type) { return type !== "Make to Order"; })
            .map(function (type) { return ({
            value: type,
            label: (<span className="flex items-center gap-2">
                  <components_1.MethodIcon type={type}/>
                  {translateMethodType(type)}
                </span>)
        }); })} onChange={function (value) {
            var _a;
            onUpdate("defaultMethodType", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
      </form_1.ValidatedForm>

      <react_1.VStack spacing={2}>
        <h3 className="text-xs text-muted-foreground">
          <macro_1.Trans>Unit of Measure</macro_1.Trans>
        </h3>
        <Enumerable_1.Enumerable value={(_0 = (_z = routeData === null || routeData === void 0 ? void 0 : routeData.consumableSummary) === null || _z === void 0 ? void 0 : _z.unitOfMeasure) !== null && _0 !== void 0 ? _0 : null}/>
      </react_1.VStack>

      <Item_1.ItemDescription value={(_2 = (_1 = routeData === null || routeData === void 0 ? void 0 : routeData.consumableSummary) === null || _1 === void 0 ? void 0 : _1.description) !== null && _2 !== void 0 ? _2 : ""} onChange={function (value) { return onUpdate("description", value); }}/>

      <react_1.VStack spacing={2}>
        <react_1.HStack className="w-full justify-between">
          <h3 className="text-xs text-muted-foreground">
            <macro_1.Trans>Methods</macro_1.Trans>
          </h3>
        </react_1.HStack>

        {((_4 = (_3 = routeData === null || routeData === void 0 ? void 0 : routeData.consumableSummary) === null || _3 === void 0 ? void 0 : _3.replenishmentSystem) === null || _4 === void 0 ? void 0 : _4.includes("Buy")) &&
            supplierParts.map(function (method) {
                var _a, _b;
                return (<components_1.MethodBadge key={method.id} type="Purchase to Order" text={(_b = (_a = suppliers.find(function (s) { return s.id === method.supplierId; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : ""} to={path_1.path.to.consumablePurchasing(itemId)}/>);
            })}
        {pickMethods.map(function (method) {
            var _a, _b;
            return (<components_1.MethodBadge key={method.locationId} type="Pull from Inventory" text={(_b = (_a = locations.find(function (l) { return l.id === method.locationId; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : ""} to={path_1.path.to.consumableInventoryLocation(itemId, method.locationId)}/>);
        })}
      </react_1.VStack>
      <form_1.ValidatedForm defaultValues={{
            active: (_6 = (_5 = routeData === null || routeData === void 0 ? void 0 : routeData.consumableSummary) === null || _5 === void 0 ? void 0 : _5.active) !== null && _6 !== void 0 ? _6 : undefined
        }} validator={zod_1.z.object({
            active: zod_form_data_1.zfd.checkbox()
        })} className="w-full">
        <Form_1.Boolean label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Active"], ["Active"])))} name="active" variant="small" onChange={function (value) {
            onUpdate("active", value ? "on" : "off");
        }}/>
      </form_1.ValidatedForm>
      {((_8 = (_7 = routeData === null || routeData === void 0 ? void 0 : routeData.consumableSummary) === null || _7 === void 0 ? void 0 : _7.replenishmentSystem) === null || _8 === void 0 ? void 0 : _8.includes("Buy")) && (<form_1.ValidatedForm defaultValues={{
                requiresInspection: (_10 = (_9 = routeData === null || routeData === void 0 ? void 0 : routeData.consumableSummary) === null || _9 === void 0 ? void 0 : _9.requiresInspection) !== null && _10 !== void 0 ? _10 : false
            }} validator={zod_1.z.object({
                requiresInspection: zod_form_data_1.zfd.checkbox()
            })} className="w-full">
          <Form_1.Boolean label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Requires Inspection"], ["Requires Inspection"])))} name="requiresInspection" variant="small" onChange={function (value) {
                onUpdate("requiresInspection", value ? "on" : "off");
            }}/>
        </form_1.ValidatedForm>)}
      <form_1.ValidatedForm defaultValues={{
            tags: (_12 = (_11 = routeData === null || routeData === void 0 ? void 0 : routeData.consumableSummary) === null || _11 === void 0 ? void 0 : _11.tags) !== null && _12 !== void 0 ? _12 : []
        }} validator={zod_1.z.object({
            tags: zod_1.z.array(zod_1.z.string()).optional()
        })} className="w-full">
        <Form_1.Tags label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Tags"], ["Tags"])))} name="tags" availableTags={(_13 = routeData === null || routeData === void 0 ? void 0 : routeData.tags) !== null && _13 !== void 0 ? _13 : []} table="consumable" inline onChange={onUpdateTags}/>
      </form_1.ValidatedForm>

      <CustomFormInlineFields_1.default customFields={((_15 = (_14 = routeData === null || routeData === void 0 ? void 0 : routeData.consumableSummary) === null || _14 === void 0 ? void 0 : _14.customFields) !== null && _15 !== void 0 ? _15 : {})} table="consumable" tags={(_17 = (_16 = routeData === null || routeData === void 0 ? void 0 : routeData.consumableSummary) === null || _16 === void 0 ? void 0 : _16.tags) !== null && _17 !== void 0 ? _17 : []} onUpdate={onUpdateCustomFields}/>

      <react_1.VStack spacing={2}>
        <react_1.HStack className="w-full justify-between">
          <h3 className="text-xs text-muted-foreground">
            <macro_1.Trans>Files</macro_1.Trans>
          </h3>
        </react_1.HStack>

        <react_2.Suspense fallback={null}>
          <react_router_1.Await resolve={routeData === null || routeData === void 0 ? void 0 : routeData.files}>
            {function (files) {
            return files === null || files === void 0 ? void 0 : files.map(function (file) { return (<Item_1.FileBadge key={file.id} file={file} itemId={itemId} itemType="Consumable"/>); });
        }}
          </react_router_1.Await>
        </react_2.Suspense>
      </react_1.VStack>
    </react_1.VStack>);
};
exports.default = ConsumableProperties;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15;
