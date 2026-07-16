"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCP_BLOCKED_TOOL_NAMES = void 0;
exports.isMcpBlockedTool = isMcpBlockedTool;
/**
 * Tools excluded from MCP discovery (tool-metadata.json) and blocked at runtime.
 * Keep this list small; add only operations that must never run via /api/mcp.
 */
exports.MCP_BLOCKED_TOOL_NAMES = [
    "settings_seedCompany"
];
function isMcpBlockedTool(name) {
    return exports.MCP_BLOCKED_TOOL_NAMES.includes(name);
}
