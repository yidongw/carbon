"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatStatusIndicators = ChatStatusIndicators;
var AnimatedStatus_1 = require("./AnimatedStatus");
var Loader_1 = require("./Loader");
var agent_1 = require("./lib/agent");
var ToolCallIndicator_1 = require("./ToolCallIndicator");
function ChatStatusIndicators(_a) {
    var agentStatus = _a.agentStatus, currentToolCall = _a.currentToolCall, status = _a.status;
    var statusMessage = (0, agent_1.getStatusMessage)(agentStatus);
    var toolMessage = currentToolCall ? (0, ToolCallIndicator_1.getToolMessage)(currentToolCall) : null;
    // Always prioritize tool message over agent status when a tool is running
    var displayMessage = toolMessage || statusMessage;
    // Get icon for current tool - always show icon when tool is running
    var toolIcon = currentToolCall ? (0, ToolCallIndicator_1.getToolIcon)(currentToolCall) : null;
    return (<div className="h-8 flex items-center">
      <AnimatedStatus_1.AnimatedStatus text={displayMessage !== null && displayMessage !== void 0 ? displayMessage : null} shimmerDuration={0.75} fadeDuration={0.1} variant="slide" className="text-xs font-normal" icon={toolIcon}/>

      {((agentStatus && !(0, agent_1.getStatusMessage)(agentStatus)) ||
            (status === "submitted" && !agentStatus && !currentToolCall)) && (<Loader_1.Loader />)}
    </div>);
}
