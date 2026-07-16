"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatusMessage = void 0;
// Generate user-friendly status messages
var getStatusMessage = function (status) {
    if (!status) {
        return null;
    }
    var agent = status.agent, state = status.status;
    if (state === "executing") {
        var messages = {
            triage: "Thinking...",
            general: "Searching the web...",
            purchasing: "Calling the purchasing agent...",
            parts: "Calling the parts agent...",
            suppliers: "Calling the suppliers agent..."
        };
        return messages[agent];
    }
    return null;
};
exports.getStatusMessage = getStatusMessage;
