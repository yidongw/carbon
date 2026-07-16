"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CARD_ACTION_VALUE_CLASS = void 0;
exports.CardActionValue = CardActionValue;
exports.CardFieldChip = CardFieldChip;
exports.CardFieldChipBody = CardFieldChipBody;
var react_1 = require("@carbon/react");
var cardCell_1 = require("./cardCell");
/** Marker for non-link interactive values inside mobile card field chips. */
exports.CARD_ACTION_VALUE_CLASS = "card-action-value";
/** Wraps primary chip values that open drawers/modals instead of navigating via link. */
function CardActionValue(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <span className={(0, react_1.cn)(exports.CARD_ACTION_VALUE_CLASS, className)} {...props}/>;
}
function CardFieldChip(_a) {
    var variant = _a.variant, className = _a.className, children = _a.children;
    return (<div className={(0, react_1.cn)(cardCell_1.CARD_CHIP_BASE_CLASS, cardCell_1.CARD_CHIP_VARIANT_CLASS[variant], className)}>
      <cardCell_1.CardCellContext.Provider value={true}>
        {children}
      </cardCell_1.CardCellContext.Provider>
    </div>);
}
function CardFieldChipBody(_a) {
    var children = _a.children, rowNav = _a.rowNav, rowNavLabel = _a.rowNavLabel, onRowNav = _a.onRowNav, _b = _a.rowNavTabIndex, rowNavTabIndex = _b === void 0 ? 0 : _b;
    if (!rowNav || !onRowNav) {
        return <>{children}</>;
    }
    var excludeFromTabOrder = rowNavTabIndex < 0;
    return (<div className="relative min-w-0">
      {children}
      <button type="button" aria-label={excludeFromTabOrder ? undefined : rowNavLabel} aria-hidden={excludeFromTabOrder ? true : undefined} tabIndex={rowNavTabIndex} data-card-action className="absolute inset-0 z-[1] cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={onRowNav}/>
    </div>);
}
