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
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
var items_models_1 = require("../../items.models");
var Item_1 = require("../Item");
var StyleProperties = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    var t = (0, macro_1.useLingui)().t;
    var itemId = (0, react_router_1.useParams)().itemId;
    if (!itemId)
        throw new Error("itemId not found");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.style(itemId));
    if (!routeData)
        throw new Error("Could not find style data");
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.error) {
            react_1.toast.error(fetcher.data.error.message);
        }
    }, [fetcher.data]);
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
    }, [fetcher, itemId]);
    var onUpdateTags = (0, react_2.useCallback)(function (value) {
        var _a;
        var formData = new FormData();
        formData.append("ids", (_a = routeData.styleSummary.readableId) !== null && _a !== void 0 ? _a : "");
        formData.append("table", "style");
        value.forEach(function (v) {
            formData.append("value", v);
        });
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.tags
        });
    }, [fetcher, routeData.styleSummary.readableId]);
    var onUpdateCustomFields = (0, react_2.useCallback)(function (value) {
        var _a;
        var formData = new FormData();
        formData.append("ids", (_a = routeData.styleSummary.readableId) !== null && _a !== void 0 ? _a : "");
        formData.append("table", "style");
        formData.append("value", value);
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.customFields
        });
    }, [fetcher, routeData.styleSummary.readableId]);
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
            return (0, string_1.copyToClipboard)(window.location.origin + path_1.path.to.style(itemId));
        }}>
                  <lu_1.LuLink className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy link to style</macro_1.Trans>
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
                  <macro_1.Trans>Copy style unique identifier</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Copy"], ["Copy"])))} size="sm" className="p-1" onClick={function () {
            var _a;
            return (0, string_1.copyToClipboard)((_a = routeData.styleSummary.readableIdWithRevision) !== null && _a !== void 0 ? _a : "");
        }}>
                  <lu_1.LuCopy className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy style number</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
          </react_1.HStack>
        </react_1.HStack>
        <react_1.VStack spacing={1} className="pt-2">
          <form_1.ValidatedForm defaultValues={{
            styleId: (_a = routeData.styleSummary.readableIdWithRevision) !== null && _a !== void 0 ? _a : undefined
        }} validator={zod_1.z.object({
            styleId: zod_1.z.string()
        })} className="w-full -mt-2">
            <span className="text-sm">
              <form_1.InputControlled label="" name="styleId" inline size="sm" value={(_b = routeData.styleSummary.readableId) !== null && _b !== void 0 ? _b : ""} onBlur={function (e) {
            var _a;
            onUpdate("partId", (_a = e.target.value) !== null && _a !== void 0 ? _a : null);
        }} className="text-muted-foreground"/>
            </span>
          </form_1.ValidatedForm>
          <form_1.ValidatedForm defaultValues={{
            name: (_c = routeData.styleSummary.name) !== null && _c !== void 0 ? _c : undefined
        }} validator={zod_1.z.object({
            name: zod_1.z.string()
        })} className="w-full -mt-2">
            <span className="text-xs text-muted-foreground">
              <form_1.InputControlled label="" name="name" inline size="sm" characterLimit={40} value={(_d = routeData.styleSummary.name) !== null && _d !== void 0 ? _d : ""} onBlur={function (e) {
            var _a;
            onUpdate("name", (_a = e.target.value) !== null && _a !== void 0 ? _a : null);
        }} className="text-muted-foreground"/>
            </span>
          </form_1.ValidatedForm>
        </react_1.VStack>
        <ItemThumnailUpload_1.ItemThumbnailUpload path={routeData.styleSummary.thumbnailPath} itemId={itemId}/>
      </react_1.VStack>

      <react_1.VStack spacing={2}>
        <h3 className="text-xs text-muted-foreground">
          <macro_1.Trans>Colors</macro_1.Trans>
        </h3>
        <div className="flex flex-wrap gap-2">
          {((_e = routeData.styleSummary.styleColorBadges) !== null && _e !== void 0 ? _e : []).map(function (color) { return (<react_1.Badge key={color.id} variant="secondary" title={color.colorCode}>
              {color.colorName || color.colorCode}
            </react_1.Badge>); })}
          {((_f = routeData.styleSummary.styleColorBadges) !== null && _f !== void 0 ? _f : []).length === 0 && (<span className="text-xs text-muted-foreground">
              <macro_1.Trans>No colors assigned</macro_1.Trans>
            </span>)}
        </div>
      </react_1.VStack>

      <react_1.VStack spacing={2}>
        <h3 className="text-xs text-muted-foreground">
          <macro_1.Trans>Sizes</macro_1.Trans>
        </h3>
        <div className="flex flex-wrap gap-2">
          {((_g = routeData.styleSummary.styleSizeBadges) !== null && _g !== void 0 ? _g : []).map(function (size) { return (<react_1.Badge key={size.id} variant="secondary">
              {size.sizeCode}
              {size.sizeName ? " - ".concat(size.sizeName) : ""}
            </react_1.Badge>); })}
          {((_h = routeData.styleSummary.styleSizeBadges) !== null && _h !== void 0 ? _h : []).length === 0 && (<span className="text-xs text-muted-foreground">
              <macro_1.Trans>No sizes assigned</macro_1.Trans>
            </span>)}
        </div>
      </react_1.VStack>

      <form_1.ValidatedForm defaultValues={{
            itemPostingGroupId: (_j = routeData.styleSummary.itemPostingGroupId) !== null && _j !== void 0 ? _j : undefined
        }} validator={zod_1.z.object({
            itemPostingGroupId: zod_1.z.string().nullable().optional()
        })} className="w-full">
        <Form_1.ItemPostingGroup label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Item Group"], ["Item Group"])))} name="itemPostingGroupId" inline isClearable onChange={function (value) {
            var _a;
            onUpdate("itemPostingGroupId", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            replenishmentSystem: (_k = routeData.styleSummary.replenishmentSystem) !== null && _k !== void 0 ? _k : undefined
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
            itemTrackingType: (_l = routeData.styleSummary.itemTrackingType) !== null && _l !== void 0 ? _l : undefined
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
            defaultMethodType: (_m = routeData.styleSummary.defaultMethodType) !== null && _m !== void 0 ? _m : undefined
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
            var replenishment = routeData.styleSummary.replenishmentSystem;
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

      <form_1.ValidatedForm defaultValues={{
            unitOfMeasureCode: (_o = routeData.styleSummary.unitOfMeasureCode) !== null && _o !== void 0 ? _o : undefined
        }} validator={zod_1.z.object({
            unitOfMeasureCode: zod_1.z
                .string()
                .min(1, { message: "Unit of Measure is required" })
        })} className="w-full">
        <Form_1.UnitOfMeasure label={t(templateObject_28 || (templateObject_28 = __makeTemplateObject(["Unit of Measure"], ["Unit of Measure"])))} name="unitOfMeasureCode" inline onChange={function (value) {
            var _a;
            onUpdate("unitOfMeasureCode", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
      </form_1.ValidatedForm>

      <Item_1.ItemDescription value={(_p = routeData.styleSummary.description) !== null && _p !== void 0 ? _p : ""} onChange={function (value) { return onUpdate("description", value); }}/>

      <react_1.VStack spacing={2}>
        <react_1.HStack className="w-full justify-between">
          <h3 className="text-xs text-muted-foreground">
            <macro_1.Trans>Methods</macro_1.Trans>
          </h3>
        </react_1.HStack>
        <react_2.Suspense fallback={null}>
          <react_router_1.Await resolve={routeData.makeMethods}>
            {function (makeMethods) {
            var _a;
            return (_a = makeMethods.data) === null || _a === void 0 ? void 0 : _a.sort(function (a, b) { return b.version - a.version; }).map(function (method) {
                var _a;
                var isActive = method.status === "Active" ||
                    ((_a = makeMethods.data) === null || _a === void 0 ? void 0 : _a.length) === 1;
                return (<components_1.MethodBadge key={method.id} type="Make to Order" text={"Version ".concat(method.version)} to={"".concat(path_1.path.to.style(itemId), "?methodId=").concat(method.id)} className={isActive ? undefined : "opacity-50"}/>);
            });
        }}
          </react_router_1.Await>
        </react_2.Suspense>
      </react_1.VStack>

      <form_1.ValidatedForm defaultValues={{
            active: (_q = routeData.styleSummary.active) !== null && _q !== void 0 ? _q : undefined
        }} validator={zod_1.z.object({
            active: zod_form_data_1.zfd.checkbox()
        })} className="w-full">
        <Form_1.Boolean label={t(templateObject_29 || (templateObject_29 = __makeTemplateObject(["Active"], ["Active"])))} name="active" variant="small" onChange={function (value) {
            onUpdate("active", value ? "on" : "off");
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            tags: (_r = routeData.styleSummary.tags) !== null && _r !== void 0 ? _r : []
        }} validator={zod_1.z.object({
            tags: zod_1.z.array(zod_1.z.string()).optional()
        })} className="w-full">
        <Form_1.Tags availableTags={(_s = routeData.tags) !== null && _s !== void 0 ? _s : []} label={t(templateObject_30 || (templateObject_30 = __makeTemplateObject(["Tags"], ["Tags"])))} name="tags" table="style" inline onChange={onUpdateTags}/>
      </form_1.ValidatedForm>

      <CustomFormInlineFields_1.default customFields={((_t = routeData.styleSummary.customFields) !== null && _t !== void 0 ? _t : {})} table="style" tags={(_u = routeData.styleSummary.tags) !== null && _u !== void 0 ? _u : []} onUpdate={onUpdateCustomFields}/>

      <react_1.VStack spacing={2}>
        <react_1.HStack className="w-full justify-between">
          <h3 className="text-xs text-muted-foreground">
            <macro_1.Trans>Files</macro_1.Trans>
          </h3>
        </react_1.HStack>
        <react_2.Suspense fallback={null}>
          <react_router_1.Await resolve={routeData.files}>
            {function (files) {
            return files === null || files === void 0 ? void 0 : files.map(function (file) { return (<Item_1.FileBadge key={file.id} file={file} itemId={itemId} itemType="Style"/>); });
        }}
          </react_router_1.Await>
        </react_2.Suspense>
      </react_1.VStack>
    </react_1.VStack>);
};
exports.default = StyleProperties;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27, templateObject_28, templateObject_29, templateObject_30;
