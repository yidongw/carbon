"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettifyKeyboardShortcut = prettifyKeyboardShortcut;
function prettifyKeyboardShortcut(input, isMac) {
    if (isMac === void 0) { isMac = true; }
    if (isMac) {
        return input
            .split("+")
            .join("")
            .replace("ArrowRight", "→")
            .replace("ArrowLeft", "←")
            .replace("Command", "⌘")
            .replace("Shift", "⇧")
            .replace("Control", "⌃")
            .replace("Enter", "↩")
            .toUpperCase();
    }
    return input
        .replace("ArrowRight", "→")
        .replace("ArrowLeft", "←")
        .replace("Command", "Ctrl")
        .replace("Enter", "Enter");
}
