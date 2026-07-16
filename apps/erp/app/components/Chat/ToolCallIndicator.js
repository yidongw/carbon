"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToolIcon = getToolIcon;
exports.getToolMessage = getToolMessage;
exports.ToolCallIndicator = ToolCallIndicator;
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
var config_1 = require("~/routes/api+/ai+/chat+/tools/config");
function getToolIcon(toolName) {
    var _a, _b;
    if (toolName === "handoff_to_agent") {
        return lu_1.LuBrain;
    }
    if (toolName === "updateWorkingMemory") {
        return lu_1.LuBrain;
    }
    return (_b = (_a = config_1.toolConfigs[toolName]) === null || _a === void 0 ? void 0 : _a.icon) !== null && _b !== void 0 ? _b : null;
}
function getToolMessage(toolName) {
    var _a, _b;
    if (toolName === "handoff_to_agent") {
        return "Connecting you with the right specialist...";
    }
    if (toolName === "updateWorkingMemory") {
        return "Updating working memory...";
    }
    return (_b = (_a = config_1.toolConfigs[toolName]) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : null;
}
function ToolCallIndicator(_a) {
    var _b;
    var toolName = _a.toolName, className = _a.className;
    var config = config_1.toolConfigs[toolName];
    if (!config) {
        return null;
    }
    return (<div className={(0, react_1.cn)("flex justify-start mt-3 animate-fade-in", className)}>
      <div className="border px-3 py-1 flex items-center gap-2 w-fit">
        <div className="flex items-center justify-center size-3.5">
          <config.icon size={14}/>
        </div>
        <react_1.TextShimmer className="text-xs text-muted-foreground" duration={1}>
          {(_b = config.displayText) !== null && _b !== void 0 ? _b : ""}
        </react_1.TextShimmer>
      </div>
    </div>);
}
