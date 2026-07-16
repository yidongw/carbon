"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SELECT_CLIENT_EVENT = void 0;
exports.goToQuickstart = goToQuickstart;
// Lets the hero CTAs drive the Quickstart: smooth-scroll to it and, optionally,
// preselect a client in the SetupPipeline (which listens for this event).
exports.SELECT_CLIENT_EVENT = "mcp:select-client";
function goToQuickstart(client) {
    var _a;
    (_a = document
        .getElementById("quickstart")) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth", block: "start" });
    if (client) {
        window.dispatchEvent(new CustomEvent(exports.SELECT_CLIENT_EVENT, { detail: client }));
    }
}
