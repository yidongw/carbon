"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preventDismissOnPortaledContent = preventDismissOnPortaledContent;
exports.scrollIntoView = scrollIntoView;
exports.startModeTransition = startModeTransition;
/** Keep drawers/dialogs open when the user interacts with portaled select menus. */
function preventDismissOnPortaledContent(event) {
    var target = event.target;
    if ((target === null || target === void 0 ? void 0 : target.closest('[role="listbox"]')) ||
        (target === null || target === void 0 ? void 0 : target.closest("[data-radix-select-viewport]")) ||
        (target === null || target === void 0 ? void 0 : target.closest("[data-radix-popper-content-wrapper]"))) {
        event.preventDefault();
    }
}
function scrollIntoView(element) {
    element === null || element === void 0 ? void 0 : element.scrollIntoView({
        inline: "nearest",
        block: "nearest"
    });
}
function startModeTransition(nextMode, persist) {
    var html = document.documentElement;
    var apply = function () {
        html.classList.remove("light", "dark");
        html.classList.add(nextMode);
        document.body.removeAttribute("style");
        persist();
    };
    var start = document.startViewTransition;
    if (!start) {
        apply();
        return;
    }
    html.classList.add("mode-transitioning");
    var transition = start.call(document, apply);
    transition.ready.then(function () {
        html.animate({ clipPath: ["inset(0 0 100% 0)", "inset(0)"] }, {
            pseudoElement: "::view-transition-new(root)",
            duration: 600,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)"
        });
    });
    transition.finished.finally(function () {
        html.classList.remove("mode-transitioning");
    });
}
