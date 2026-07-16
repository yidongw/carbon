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
var MaterialDimension_1 = require("~/components/Form/MaterialDimension");
var MaterialFinish_1 = require("~/components/Form/MaterialFinish");
var MaterialGrade_1 = require("~/components/Form/MaterialGrade");
var MaterialType_1 = require("~/components/Form/MaterialType");
var Shape_1 = require("~/components/Form/Shape");
var Substance_1 = require("~/components/Form/Substance");
var ItemThumnailUpload_1 = require("~/components/ItemThumnailUpload");
var hooks_1 = require("~/hooks");
var useSettings_1 = require("~/hooks/useSettings");
var shared_1 = require("~/modules/shared");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
var items_models_1 = require("../../items.models");
var Item_1 = require("../Item");
var MaterialProperties = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30;
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
    var _31 = (0, react_2.useState)(), substanceId = _31[0], setSubstanceId = _31[1];
    var _32 = (0, react_2.useState)(), formId = _32[0], setFormId = _32[1];
    var sharedMaterialsData = (0, hooks_1.useRouteData)(path_1.path.to.materialRoot);
    // When `data` is injected (subassembly context), this hook won't match a
    // route and returns undefined — harmless, hooks must be called unconditionally.
    var routeDataFromRoute = (0, hooks_1.useRouteData)(path_1.path.to.material(itemId));
    var routeData = data !== null && data !== void 0 ? data : routeDataFromRoute;
    var locations = (_d = (_c = data === null || data === void 0 ? void 0 : data.locations) !== null && _c !== void 0 ? _c : sharedMaterialsData === null || sharedMaterialsData === void 0 ? void 0 : sharedMaterialsData.locations) !== null && _d !== void 0 ? _d : [];
    var supplierParts = (_e = routeData === null || routeData === void 0 ? void 0 : routeData.supplierParts) !== null && _e !== void 0 ? _e : [];
    var pickMethods = (_f = routeData === null || routeData === void 0 ? void 0 : routeData.pickMethods) !== null && _f !== void 0 ? _f : [];
    // const optimisticAssignment = useOptimisticAssignment({
    //   id: itemId,
    //   table: "item",
    // });
    // const assignee =
    //   optimisticAssignment !== undefined
    //     ? optimisticAssignment
    //     : routeData?.materialSummary?.assignee;
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.error) {
            react_1.toast.error(fetcher.data.error.message);
        }
    }, [fetcher.data]);
    var confirmDisclosure = (0, react_1.useDisclosure)();
    var _33 = (0, react_2.useState)(null), materialPropertyUpdate = _33[0], setMaterialPropertyUpdate = _33[1];
    var settings = (0, useSettings_1.useSettings)();
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
    var handleUpdate = (0, react_2.useCallback)(function (field, value) {
        if (settings.materialGeneratedIds &&
            [
                "materialSubstanceId",
                "materialFormId",
                "dimensionId",
                "finishId",
                "materialTypeId",
                "gradeId"
            ].includes(field)) {
            setMaterialPropertyUpdate({
                // @ts-ignore
                field: field,
                value: value
            });
            confirmDisclosure.onOpen();
            return;
        }
        onUpdate(field, value);
    }, [confirmDisclosure, onUpdate, settings.materialGeneratedIds]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdateTags = (0, react_2.useCallback)(function (value) {
        var _a, _b;
        var formData = new FormData();
        formData.append("ids", (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _a === void 0 ? void 0 : _a.readableId) !== null && _b !== void 0 ? _b : "");
        formData.append("table", "material");
        value.forEach(function (v) {
            formData.append("value", v);
        });
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.tags
        });
    }, [(_g = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _g === void 0 ? void 0 : _g.readableId]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdateCustomFields = (0, react_2.useCallback)(function (value) {
        var _a, _b;
        var formData = new FormData();
        formData.append("ids", (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _a === void 0 ? void 0 : _a.readableId) !== null && _b !== void 0 ? _b : "");
        formData.append("table", "material");
        formData.append("value", value);
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.customFields
        });
    }, [(_h = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _h === void 0 ? void 0 : _h.readableId]);
    var suppliers = (0, stores_1.useSuppliers)()[0];
    // Initialize state with current material data
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) {
            setSubstanceId((_a = routeData.materialSummary.materialSubstanceId) !== null && _a !== void 0 ? _a : undefined);
            setFormId((_b = routeData.materialSummary.materialFormId) !== null && _b !== void 0 ? _b : undefined);
        }
    }, [routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary]);
    return (<>
      <react_1.VStack spacing={4} className="w-full min-w-0 bg-card h-full overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent px-4 py-2 text-sm">
        <react_1.VStack spacing={2}>
          <react_1.HStack className="w-full justify-between">
            <h3 className="text-xxs text-foreground/70 uppercase font-light tracking-wide">
              <macro_1.Trans>Properties</macro_1.Trans>
            </h3>
            <react_1.HStack spacing={1}>
              <react_1.Tooltip>
                <react_1.TooltipTrigger asChild>
                  <react_1.Button variant="ghost" aria-label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Link"], ["Link"])))} size="sm" className="p-1" onClick={function () {
            return (0, string_1.copyToClipboard)(window.location.origin + path_1.path.to.material(itemId));
        }}>
                    <lu_1.LuLink className="w-3 h-3"/>
                  </react_1.Button>
                </react_1.TooltipTrigger>
                <react_1.TooltipContent>
                  <span>
                    <macro_1.Trans>Copy link to material</macro_1.Trans>
                  </span>
                </react_1.TooltipContent>
              </react_1.Tooltip>
              <react_1.Tooltip>
                <react_1.TooltipTrigger asChild>
                  <react_1.Button variant="ghost" aria-label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Copy"], ["Copy"])))} size="sm" className="p-1" onClick={function () { var _a, _b; return (0, string_1.copyToClipboard)((_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : ""); }}>
                    <lu_1.LuKeySquare className="w-3 h-3"/>
                  </react_1.Button>
                </react_1.TooltipTrigger>
                <react_1.TooltipContent>
                  <span>
                    <macro_1.Trans>Copy material unique identifier</macro_1.Trans>
                  </span>
                </react_1.TooltipContent>
              </react_1.Tooltip>
              <react_1.Tooltip>
                <react_1.TooltipTrigger asChild>
                  <react_1.Button variant="ghost" aria-label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Copy"], ["Copy"])))} size="sm" className="p-1" onClick={function () {
            var _a, _b;
            return (0, string_1.copyToClipboard)((_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _a === void 0 ? void 0 : _a.readableId) !== null && _b !== void 0 ? _b : "");
        }}>
                    <lu_1.LuCopy className="w-3 h-3"/>
                  </react_1.Button>
                </react_1.TooltipTrigger>
                <react_1.TooltipContent>
                  <span>
                    <macro_1.Trans>Copy material number</macro_1.Trans>
                  </span>
                </react_1.TooltipContent>
              </react_1.Tooltip>
            </react_1.HStack>
          </react_1.HStack>
          <react_1.VStack spacing={1} className="pt-2">
            {settings.materialGeneratedIds ? (<span className="text-sm tracking-tight">
                {(_j = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _j === void 0 ? void 0 : _j.readableIdWithRevision}
              </span>) : (<form_1.ValidatedForm defaultValues={{
                materialId: (_l = (_k = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _k === void 0 ? void 0 : _k.readableIdWithRevision) !== null && _l !== void 0 ? _l : undefined
            }} validator={zod_1.z.object({
                materialId: zod_1.z.string()
            })} className="w-full -mt-2">
                <span className="text-sm">
                  <form_1.InputControlled label="" name="materialId" inline size="sm" value={(_o = (_m = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _m === void 0 ? void 0 : _m.readableId) !== null && _o !== void 0 ? _o : ""} onBlur={function (e) {
                var _a;
                onUpdate("materialId", (_a = e.target.value) !== null && _a !== void 0 ? _a : null);
            }} className="text-muted-foreground"/>
                </span>
              </form_1.ValidatedForm>)}
            <form_1.ValidatedForm defaultValues={{
            name: (_q = (_p = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _p === void 0 ? void 0 : _p.name) !== null && _q !== void 0 ? _q : undefined
        }} validator={zod_1.z.object({
            name: zod_1.z.string()
        })} className="w-full -mt-2">
              <span className="text-xs text-muted-foreground">
                <form_1.InputControlled label="" name="name" inline size="sm" value={(_s = (_r = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _r === void 0 ? void 0 : _r.name) !== null && _s !== void 0 ? _s : ""} onBlur={function (e) {
            var _a;
            onUpdate("name", (_a = e.target.value) !== null && _a !== void 0 ? _a : null);
        }} className="text-muted-foreground"/>
              </span>
            </form_1.ValidatedForm>
          </react_1.VStack>
          <ItemThumnailUpload_1.ItemThumbnailUpload path={(_t = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _t === void 0 ? void 0 : _t.thumbnailPath} itemId={itemId}/>
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
            itemPostingGroupId: (_v = (_u = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _u === void 0 ? void 0 : _u.itemPostingGroupId) !== null && _v !== void 0 ? _v : undefined
        }} validator={zod_1.z.object({
            itemPostingGroupId: zod_1.z.string().nullable().optional()
        })} className="w-full">
          <Form_1.ItemPostingGroup label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Item Group"], ["Item Group"])))} name="itemPostingGroupId" inline isClearable onChange={function (value) {
            var _a;
            onUpdate("itemPostingGroupId", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
        </form_1.ValidatedForm>

        <form_1.ValidatedForm defaultValues={{
            itemTrackingType: (_x = (_w = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _w === void 0 ? void 0 : _w.itemTrackingType) !== null && _x !== void 0 ? _x : undefined
        }} validator={zod_1.z.object({
            itemTrackingType: zod_1.z.string()
        })} className="w-full">
          <form_1.Select name="itemTrackingType" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Tracking Type"], ["Tracking Type"])))} inline={function (value) { return (<react_1.Badge variant="secondary">
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
            defaultMethodType: (_z = (_y = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _y === void 0 ? void 0 : _y.defaultMethodType) !== null && _z !== void 0 ? _z : undefined
        }} validator={zod_1.z.object({
            defaultMethodType: zod_1.z.string()
        })} className="w-full">
          <form_1.Select name="defaultMethodType" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Default Method Type"], ["Default Method Type"])))} inline={function (value) { return (<react_1.Badge variant="secondary">
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

        <form_1.ValidatedForm defaultValues={{
            materialFormId: (_1 = (_0 = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _0 === void 0 ? void 0 : _0.materialFormId) !== null && _1 !== void 0 ? _1 : undefined
        }} validator={zod_1.z.object({
            materialFormId: zod_1.z.string().nullable()
        })} className="w-full">
          <Shape_1.default label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Shape"], ["Shape"])))} name="materialFormId" inline onChange={function (value) {
            var _a;
            handleUpdate("materialFormId", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
        </form_1.ValidatedForm>

        <form_1.ValidatedForm defaultValues={{
            materialSubstanceId: (_3 = (_2 = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _2 === void 0 ? void 0 : _2.materialSubstanceId) !== null && _3 !== void 0 ? _3 : undefined
        }} validator={zod_1.z.object({
            materialSubstanceId: zod_1.z.string().nullable()
        })} className="w-full">
          <Substance_1.default label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Substance"], ["Substance"])))} name="materialSubstanceId" inline onChange={function (value) {
            var _a;
            handleUpdate("materialSubstanceId", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
        </form_1.ValidatedForm>

        <form_1.ValidatedForm defaultValues={{
            gradeId: (_5 = (_4 = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _4 === void 0 ? void 0 : _4.gradeId) !== null && _5 !== void 0 ? _5 : undefined
        }} validator={zod_1.z.object({
            gradeId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
          <MaterialGrade_1.default label={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Grade"], ["Grade"])))} name="gradeId" substanceId={substanceId} inline onChange={function (value) {
            var _a;
            handleUpdate("gradeId", (_a = value === null || value === void 0 ? void 0 : value.id) !== null && _a !== void 0 ? _a : null);
        }}/>
        </form_1.ValidatedForm>

        <form_1.ValidatedForm defaultValues={{
            dimensionId: (_7 = (_6 = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _6 === void 0 ? void 0 : _6.dimensionId) !== null && _7 !== void 0 ? _7 : undefined
        }} validator={zod_1.z.object({
            dimensionId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
          <MaterialDimension_1.default label={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Dimensions"], ["Dimensions"])))} name="dimensionId" formId={formId} inline onChange={function (value) {
            var _a;
            handleUpdate("dimensionId", (_a = value === null || value === void 0 ? void 0 : value.id) !== null && _a !== void 0 ? _a : null);
        }}/>
        </form_1.ValidatedForm>

        <form_1.ValidatedForm defaultValues={{
            finishId: (_9 = (_8 = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _8 === void 0 ? void 0 : _8.finishId) !== null && _9 !== void 0 ? _9 : undefined
        }} validator={zod_1.z.object({
            finishId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
        })} className="w-full">
          <MaterialFinish_1.default label={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Finish"], ["Finish"])))} name="finishId" substanceId={substanceId} inline onChange={function (value) {
            var _a;
            handleUpdate("finishId", (_a = value === null || value === void 0 ? void 0 : value.id) !== null && _a !== void 0 ? _a : null);
        }}/>
        </form_1.ValidatedForm>

        {substanceId && formId && (<form_1.ValidatedForm defaultValues={{
                materialTypeId: (_11 = (_10 = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _10 === void 0 ? void 0 : _10.materialTypeId) !== null && _11 !== void 0 ? _11 : undefined
            }} validator={zod_1.z.object({
                materialTypeId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
            })} className="w-full">
            <MaterialType_1.default label={t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Type"], ["Type"])))} name="materialTypeId" substanceId={substanceId} formId={formId} inline onChange={function (value) {
                var _a;
                handleUpdate("materialTypeId", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
            }}/>
          </form_1.ValidatedForm>)}

        <form_1.ValidatedForm defaultValues={{
            unitOfMeasureCode: (_13 = (_12 = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _12 === void 0 ? void 0 : _12.unitOfMeasureCode) !== null && _13 !== void 0 ? _13 : undefined
        }} validator={zod_1.z.object({
            unitOfMeasureCode: zod_1.z
                .string()
                .min(1, { message: "Unit of Measure is required" })
        })} className="w-full">
          <Form_1.UnitOfMeasure label={t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Unit of Measure"], ["Unit of Measure"])))} name="unitOfMeasureCode" inline onChange={function (value) {
            var _a;
            onUpdate("unitOfMeasureCode", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
        </form_1.ValidatedForm>

        <Item_1.ItemDescription value={(_15 = (_14 = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _14 === void 0 ? void 0 : _14.description) !== null && _15 !== void 0 ? _15 : ""} onChange={function (value) { return onUpdate("description", value); }}/>

        <react_1.VStack spacing={2}>
          <react_1.HStack className="w-full justify-between">
            <h3 className="text-xs text-muted-foreground">
              <macro_1.Trans>Methods</macro_1.Trans>
            </h3>
          </react_1.HStack>

          {((_17 = (_16 = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _16 === void 0 ? void 0 : _16.replenishmentSystem) === null || _17 === void 0 ? void 0 : _17.includes("Buy")) &&
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
            active: (_19 = (_18 = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _18 === void 0 ? void 0 : _18.active) !== null && _19 !== void 0 ? _19 : undefined
        }} validator={zod_1.z.object({
            active: zod_form_data_1.zfd.checkbox()
        })} className="w-full">
          <Form_1.Boolean label={t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Active"], ["Active"])))} name="active" variant="small" onChange={function (value) {
            onUpdate("active", value ? "on" : "off");
        }}/>
        </form_1.ValidatedForm>
        {((_21 = (_20 = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _20 === void 0 ? void 0 : _20.replenishmentSystem) === null || _21 === void 0 ? void 0 : _21.includes("Buy")) && (<form_1.ValidatedForm defaultValues={{
                requiresInspection: (_23 = (_22 = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _22 === void 0 ? void 0 : _22.requiresInspection) !== null && _23 !== void 0 ? _23 : false
            }} validator={zod_1.z.object({
                requiresInspection: zod_form_data_1.zfd.checkbox()
            })} className="w-full">
            <Form_1.Boolean label={t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Requires Inspection"], ["Requires Inspection"])))} name="requiresInspection" variant="small" onChange={function (value) {
                onUpdate("requiresInspection", value ? "on" : "off");
            }}/>
          </form_1.ValidatedForm>)}
        <form_1.ValidatedForm defaultValues={{
            tags: (_25 = (_24 = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _24 === void 0 ? void 0 : _24.tags) !== null && _25 !== void 0 ? _25 : []
        }} validator={zod_1.z.object({
            tags: zod_1.z.array(zod_1.z.string()).optional()
        })} className="w-full">
          <Form_1.Tags label={t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Tags"], ["Tags"])))} name="tags" availableTags={(_26 = routeData === null || routeData === void 0 ? void 0 : routeData.tags) !== null && _26 !== void 0 ? _26 : []} table="material" inline onChange={onUpdateTags}/>
        </form_1.ValidatedForm>

        <CustomFormInlineFields_1.default customFields={((_28 = (_27 = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _27 === void 0 ? void 0 : _27.customFields) !== null && _28 !== void 0 ? _28 : {})} table="material" tags={(_30 = (_29 = routeData === null || routeData === void 0 ? void 0 : routeData.materialSummary) === null || _29 === void 0 ? void 0 : _29.tags) !== null && _30 !== void 0 ? _30 : []} onUpdate={onUpdateCustomFields}/>

        <react_1.VStack spacing={2}>
          <react_1.HStack className="w-full justify-between">
            <h3 className="text-xs text-muted-foreground">
              <macro_1.Trans>Files</macro_1.Trans>
            </h3>
          </react_1.HStack>

          <react_2.Suspense fallback={null}>
            <react_router_1.Await resolve={routeData === null || routeData === void 0 ? void 0 : routeData.files}>
              {function (files) {
            return files === null || files === void 0 ? void 0 : files.map(function (file) { return (<Item_1.FileBadge key={file.id} file={file} itemId={itemId} itemType="Material"/>); });
        }}
            </react_router_1.Await>
          </react_2.Suspense>
        </react_1.VStack>
      </react_1.VStack>
      {confirmDisclosure.isOpen && (<ConfirmMaterialIdChange materialPropertyUpdate={materialPropertyUpdate} onClose={function () {
                // this is hacky but the value is already changed in the UI
                window.location.reload();
            }} onConfirm={function () {
                onUpdate(
                // @ts-ignore
                materialPropertyUpdate === null || materialPropertyUpdate === void 0 ? void 0 : materialPropertyUpdate.field, materialPropertyUpdate === null || materialPropertyUpdate === void 0 ? void 0 : materialPropertyUpdate.value);
                confirmDisclosure.onClose();
                setMaterialPropertyUpdate(null);
            }}/>)}
    </>);
};
exports.default = MaterialProperties;
function ConfirmMaterialIdChange(_a) {
    var _b;
    var materialPropertyUpdate = _a.materialPropertyUpdate, onClose = _a.onClose, onConfirm = _a.onConfirm;
    var propertyName = getPropertyName((_b = materialPropertyUpdate === null || materialPropertyUpdate === void 0 ? void 0 : materialPropertyUpdate.field) !== null && _b !== void 0 ? _b : "");
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open) {
                onClose();
            }
        }}>
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            <macro_1.Trans>Confirm ID Change</macro_1.Trans>
          </react_1.ModalTitle>
        </react_1.ModalHeader>
        <react_1.ModalBody className="space-y-4">
          <react_1.Alert variant="destructive">
            <lu_1.LuTriangleAlert className="h-4 w-4"/>
            <react_1.AlertTitle>
              <macro_1.Trans>Changing this will update the part ID</macro_1.Trans>
            </react_1.AlertTitle>
          </react_1.Alert>
          <p className="text-sm text-muted-foreground">
            <macro_1.Trans>
              Are you sure you want to change the {propertyName} property? Since
              you use generated material IDs this will change the part ID of
              this part, and all related revisions.
            </macro_1.Trans>
          </p>
        </react_1.ModalBody>
        <react_1.ModalFooter>
          <react_1.Button variant="secondary" onClick={onClose}>
            <macro_1.Trans>Cancel</macro_1.Trans>
          </react_1.Button>
          <react_1.Button variant="destructive" onClick={onConfirm}>
            <macro_1.Trans>Yes, Update IDs</macro_1.Trans>
          </react_1.Button>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>);
}
function getPropertyName(field) {
    switch (field) {
        case "materialFormId":
            return "shape";
        case "materialSubstanceId":
            return "substance";
        case "gradeId":
            return "grade";
        case "dimensionId":
            return "dimensions";
        case "finishId":
            return "finish";
        case "materialTypeId":
            return "type";
        default:
            return field;
    }
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23;
