"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SurfaceChips;
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var SURFACE_VISUALS = {
    receipt: { label: "Receipts", icon: <lu_1.LuTruck className="size-3.5"/> },
    shipment: { label: "Shipments", icon: <lu_1.LuPackage className="size-3.5"/> },
    stockTransfer: {
        label: "Stock transfers",
        icon: <lu_1.LuArrowRightLeft className="size-3.5"/>
    },
    warehouseTransfer: {
        label: "Warehouse transfers",
        icon: <lu_1.LuWarehouse className="size-3.5"/>
    },
    inventoryAdjustment: {
        label: "Inventory adjustments",
        icon: <lu_1.LuScale className="size-3.5"/>
    },
    place: { label: "Place", icon: <lu_1.LuPackage className="size-3.5"/> },
    pick: { label: "Pick", icon: <lu_1.LuPackage className="size-3.5"/> },
    operationStart: {
        label: "Operation start",
        icon: <lu_1.LuArrowRightLeft className="size-3.5"/>
    },
    operationFinish: {
        label: "Operation finish",
        icon: <lu_1.LuArrowRightLeft className="size-3.5"/>
    },
    materialIssue: {
        label: "Material issue",
        icon: <lu_1.LuScale className="size-3.5"/>
    },
    materialReceive: {
        label: "Material receive",
        icon: <lu_1.LuScale className="size-3.5"/>
    }
};
function SurfaceChips(_a) {
    var surfaces = _a.surfaces, targetType = _a.targetType, className = _a.className;
    var t = (0, macro_1.useLingui)().t;
    // Scope rendered set to the targetType's valid surfaces; fall back to all
    // when no targetType is supplied (callers that haven't been updated yet).
    var universe = targetType
        ? utils_1.SURFACES_BY_TARGET_TYPE[targetType]
        : utils_1.TRANSACTION_SURFACES;
    var active = new Set(surfaces && surfaces.length > 0 ? surfaces : universe);
    return (<div className={(0, react_1.cn)("flex items-center gap-1 text-muted-foreground", className)} role="group" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Transaction surfaces"], ["Transaction surfaces"])))}>
      {universe.map(function (s) {
            var meta = SURFACE_VISUALS[s];
            var isOn = active.has(s);
            return (<span key={s} title={"".concat(meta.label).concat(isOn ? "" : " (off)")} className={(0, react_1.cn)("flex size-5 items-center justify-center rounded", isOn ? "bg-muted text-foreground" : "opacity-30")}>
            {meta.icon}
          </span>);
        })}
    </div>);
}
var templateObject_1;
