"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopbarProvider = TopbarProvider;
exports.useTopbarLeft = useTopbarLeft;
var react_1 = require("react");
var TopbarContext = (0, react_1.createContext)({
    leftSlotEl: null,
    // biome-ignore lint/suspicious/noEmptyBlockStatements: suppressed due to migration
    setLeftSlotEl: function () { },
    hasDetailTopbar: false,
    // biome-ignore lint/suspicious/noEmptyBlockStatements: suppressed due to migration
    setHasDetailTopbar: function () { }
});
function TopbarProvider(_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(false), hasDetailTopbar = _b[0], setHasDetailTopbar = _b[1];
    var _c = (0, react_1.useState)(function () {
        // On client, the [data-topbar-slot] div is already in the SSR'd HTML, so
        // query it immediately so portals render on the first client paint.
        if (typeof document !== "undefined") {
            return document.querySelector("[data-topbar-slot]");
        }
        return null;
    }), leftSlotEl = _c[0], setLeftSlotEl = _c[1];
    return (<TopbarContext.Provider value={{ leftSlotEl: leftSlotEl, setLeftSlotEl: setLeftSlotEl, hasDetailTopbar: hasDetailTopbar, setHasDetailTopbar: setHasDetailTopbar }}>
      {children}
    </TopbarContext.Provider>);
}
function useTopbarLeft() {
    return (0, react_1.useContext)(TopbarContext);
}
