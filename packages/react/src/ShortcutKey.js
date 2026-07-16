"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortcutKey = exports.shortcutKeyVariants = void 0;
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var OperatingSystem_1 = require("./OperatingSystem");
var cn_1 = require("./utils/cn");
exports.shortcutKeyVariants = {
    small: "text-[0.6rem] font-medium min-w-[17px] rounded-[2px] px-1 ml-1 -mr-0.5 grid place-content-center border border-dimmed/40 text-text-dimmed group-hover:text-text-bright/80 group-hover:border-dimmed/60 transition uppercase",
    medium: "text-[0.75rem] font-medium min-w-[17px] rounded-[2px] px-1 ml-1 -mr-0.5 grid place-content-center border border-dimmed/40 text-text-dimmed group-hover:text-text-bright/80 group-hover:border-dimmed/60 transition uppercase"
};
var ShortcutKey = function (_a) {
    var _b;
    var shortcut = _a.shortcut, variant = _a.variant, className = _a.className;
    var platform = (0, OperatingSystem_1.useOperatingSystem)().platform;
    var isMac = platform === "mac";
    var relevantShortcut = "mac" in shortcut ? (isMac ? shortcut.mac : shortcut.windows) : shortcut;
    var modifiers = (_b = relevantShortcut.modifiers) !== null && _b !== void 0 ? _b : [];
    var character = keyString(relevantShortcut.key, isMac, variant);
    return (<span className={(0, cn_1.cn)(exports.shortcutKeyVariants[variant], className)}>
      {modifiers.map(function (k) { return (<react_1.Fragment key={k}>{modifierString(k, isMac)}</react_1.Fragment>); })}
      {character}
    </span>);
};
exports.ShortcutKey = ShortcutKey;
function keyString(key, isMac, size) {
    key = key.toLowerCase();
    var className = size === "small" ? "w-2.5 h-4" : "w-3 h-5";
    switch (key) {
        case "enter":
            return isMac ? "↵" : key;
        case "arrowdown":
            return <lu_1.LuChevronDown className={className}/>;
        case "arrowup":
            return <lu_1.LuChevronUp className={className}/>;
        case "arrowleft":
            return <lu_1.LuChevronLeft className={className}/>;
        case "arrowright":
            return <lu_1.LuChevronRight className={className}/>;
        default:
            return key;
    }
}
function modifierString(modifier, isMac) {
    switch (modifier) {
        case "alt":
            return isMac ? "⌥" : "Alt+";
        case "ctrl":
            return isMac ? "⌃" : "Ctrl+";
        case "meta":
            return isMac ? "⌘" : "⊞+";
        case "shift":
            return isMac ? "⇧" : "Shift+";
        case "mod":
            return isMac ? "⌘" : "Ctrl+";
    }
}
