"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SurfacesField;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var SURFACE_META = {
    receipt: {
        title: "Receipts",
        description: "When goods arrive at a location",
        icon: <lu_1.LuTruck />
    },
    shipment: {
        title: "Shipments",
        description: "When goods leave a location",
        icon: <lu_1.LuPackage />
    },
    stockTransfer: {
        title: "Stock transfers",
        description: "When goods move between storage units",
        icon: <lu_1.LuArrowRightLeft />
    },
    warehouseTransfer: {
        title: "Warehouse transfers",
        description: "When goods move between warehouses",
        icon: <lu_1.LuWarehouse />
    },
    inventoryAdjustment: {
        title: "Inventory adjustments",
        description: "Manual quantity edits at a storage unit",
        icon: <lu_1.LuScale />
    },
    place: {
        title: "Place",
        description: "When stock is placed into a storage unit",
        icon: <lu_1.LuPackage />
    },
    pick: {
        title: "Pick",
        description: "When stock is taken from a storage unit",
        icon: <lu_1.LuPackage />
    },
    operationStart: {
        title: "Operation start",
        description: "When an operator starts a job operation",
        icon: <lu_1.LuArrowRightLeft />
    },
    operationFinish: {
        title: "Operation finish",
        description: "When an operator completes a job operation",
        icon: <lu_1.LuArrowRightLeft />
    },
    materialIssue: {
        title: "Material issue",
        description: "When material is consumed by an operation",
        icon: <lu_1.LuScale />
    },
    materialReceive: {
        title: "Material receive",
        description: "When material is returned from an operation",
        icon: <lu_1.LuScale />
    }
};
/**
 * Multi-select for the rule's `surfaces` field. Uses ChoiceSelect's `multiple`
 * mode — same compact trigger style as the severity picker.
 *
 * Soft-guards against unchecking the last selected surface (zod `min(1)` is
 * the server-side backstop).
 */
function SurfacesField(_a) {
    var name = _a.name, label = _a.label, targetType = _a.targetType, onSurfacesChange = _a.onSurfacesChange;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, form_1.useField)(name), error = _b.error, isOptional = _b.isOptional;
    var _c = (0, form_1.useControlField)(name), value = _c[0], setValue = _c[1];
    var selected = value !== null && value !== void 0 ? value : [];
    // Mirror selection up to the form. Identity of `onSurfacesChange` not
    // tracked — parent wraps in `useCallback` if it needs stability.
    // biome-ignore lint/correctness/useExhaustiveDependencies: callback identity intentionally untracked
    (0, react_2.useEffect)(function () {
        onSurfacesChange === null || onSurfacesChange === void 0 ? void 0 : onSurfacesChange(selected);
    }, [selected]);
    var allowed = targetType
        ? new Set(utils_1.SURFACES_BY_TARGET_TYPE[targetType])
        : null;
    var visibleSurfaces = allowed
        ? utils_1.TRANSACTION_SURFACES.filter(function (s) { return allowed.has(s); })
        : utils_1.TRANSACTION_SURFACES;
    var options = visibleSurfaces.map(function (s) { return ({
        value: s,
        title: SURFACE_META[s].title,
        description: SURFACE_META[s].description,
        icon: SURFACE_META[s].icon
    }); });
    var handleChange = function (next) {
        if (next.length === 0)
            return; // soft guard — keep at least one
        setValue(next);
    };
    return (<react_1.FormControl isInvalid={!!error}>
      <react_1.FormLabel isOptional={isOptional} htmlFor={name}>
        {label !== null && label !== void 0 ? label : t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Triggers"], ["Triggers"])))}
      </react_1.FormLabel>

      {selected.map(function (surface, index) { return (<input key={surface} type="hidden" name={"".concat(name, "[").concat(index, "]")} value={surface}/>); })}

      <react_1.ChoiceSelect multiple value={selected} onChange={handleChange} options={options} placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Select surfaces"], ["Select surfaces"])))} aria-label={label !== null && label !== void 0 ? label : t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Applies to"], ["Applies to"])))}/>

      {error && <react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>}
    </react_1.FormControl>);
}
var templateObject_1, templateObject_2, templateObject_3;
