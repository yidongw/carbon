"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useShortcutKeys = useShortcutKeys;
var react_hotkeys_hook_1 = require("react-hotkeys-hook");
var OperatingSystem_1 = require("../OperatingSystem");
function useShortcutKeys(_a) {
    var shortcut = _a.shortcut, action = _a.action, _b = _a.disabled, disabled = _b === void 0 ? false : _b, enabledOnInputElements = _a.enabledOnInputElements;
    var platform = (0, OperatingSystem_1.useOperatingSystem)().platform;
    var isMac = platform === "mac";
    var relevantShortcut = shortcut && "mac" in shortcut
        ? isMac
            ? shortcut.mac
            : shortcut.windows
        : shortcut && "key" in shortcut
            ? shortcut
            : undefined;
    var keys = createKeysFromShortcut(relevantShortcut);
    (0, react_hotkeys_hook_1.useHotkeys)(keys, function (event, hotkeysEvent) {
        action(event);
    }, {
        enabled: !disabled,
        enableOnFormTags: enabledOnInputElements !== null && enabledOnInputElements !== void 0 ? enabledOnInputElements : relevantShortcut === null || relevantShortcut === void 0 ? void 0 : relevantShortcut.enabledOnInputElements,
        enableOnContentEditable: enabledOnInputElements !== null && enabledOnInputElements !== void 0 ? enabledOnInputElements : relevantShortcut === null || relevantShortcut === void 0 ? void 0 : relevantShortcut.enabledOnInputElements
    });
}
function createKeysFromShortcut(shortcut) {
    if (!shortcut) {
        return [];
    }
    var modifiers = shortcut.modifiers;
    var character = shortcut.key;
    return modifiers
        ? modifiers.map(function (k) { return k; }).join("+") + "+" + character
        : character;
}
