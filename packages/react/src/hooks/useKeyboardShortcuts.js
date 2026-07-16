"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useKeyboardShortcuts;
var react_1 = require("react");
function includes(array, element) {
    return array.indexOf(element) >= 0;
}
function useKeyboardShortcuts(keyMap) {
    var _a = (0, react_1.useState)(), lastKeydown = _a[0], setLastKeydown = _a[1];
    var handleKeydown = function (event) {
        if (!keyMap ||
            includes(["INPUT", "TEXTAREA", "SELECT"], event.target.nodeName) ||
            event.target.classList.contains("ProseMirror")) {
            return;
        }
        var keyPressed = getKeyPresses(event);
        if (keyMap[keyPressed]) {
            /**
             * combined keymap will trigger action on KeyDown event
             * while single keymap  will trigger action on KeyUp event
             */
            if (keyPressed.includes("+")) {
                event.preventDefault();
                keyMap[keyPressed](event);
                setLastKeydown(null);
            }
            else {
                setLastKeydown(event.key);
                event.preventDefault();
            }
        }
    };
    var handleKeyup = function (event) {
        if (!keyMap)
            return;
        if (keyMap[event.key] && lastKeydown === event.key) {
            event.preventDefault();
            keyMap[event.key](event);
            setLastKeydown(null);
        }
    };
    function getKeyPresses(event) {
        var commandKey = event.metaKey || event.ctrlKey;
        return commandKey && event.shiftKey
            ? "Command+Shift+".concat(event.key.toLowerCase())
            : commandKey
                ? "Command+".concat(event.key)
                : event.shiftKey && event.key === "Enter"
                    ? "Shift+".concat(event.key)
                    : event.key;
    }
    (0, react_1.useEffect)(function () {
        window.addEventListener("keydown", handleKeydown);
        window.addEventListener("keyup", handleKeyup);
        return function () {
            window.removeEventListener("keydown", handleKeydown);
            window.removeEventListener("keyup", handleKeyup);
        };
    });
}
