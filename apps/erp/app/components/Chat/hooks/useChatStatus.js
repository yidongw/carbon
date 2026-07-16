"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChatStatus = useChatStatus;
var store_1 = require("@ai-sdk-tools/store");
var react_1 = require("react");
/**
 * Hook to derive chat status indicators from messages and streaming state.
 *
 * This hook manages the logic for showing agent status and tool messages:
 * - Agent status: shown when routing or executing (before content starts)
 * - Tool message: shown when a tool is actively running
 * - Hidden: when text content is streaming or chat is ready
 */
function useChatStatus(messages, status) {
    var agentStatusData = (0, store_1.useDataPart)("agent-status")[0];
    var result = (0, react_1.useMemo)(function () {
        if (messages.length === 0) {
            return {
                agentStatus: agentStatusData,
                currentToolCall: null,
                hasTextContent: false
            };
        }
        var lastMessage = messages[messages.length - 1];
        if ((lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.role) !== "assistant") {
            return {
                agentStatus: agentStatusData,
                currentToolCall: null,
                hasTextContent: false
            };
        }
        // Check if we have text content streaming
        var textParts = lastMessage.parts.filter(function (part) { return part.type === "text"; });
        var hasTextContent = textParts.some(function (part) {
            var _a;
            var textPart = part;
            return (_a = textPart.text) === null || _a === void 0 ? void 0 : _a.trim();
        });
        // Find active tool calls - check ALL tool-related parts
        var allParts = lastMessage.parts;
        var toolParts = allParts.filter(function (part) {
            var type = part.type;
            return type.startsWith("tool-");
        });
        var currentToolCall = null;
        var _toolMetadata = null;
        // Check if any web search is still pending (no output yet)
        var hasPendingWebSearch = toolParts.some(function (part) {
            var type = part.type;
            var toolWithOutput = part;
            return type === "tool-webSearch" && !toolWithOutput.output;
        });
        // If web searches are active, prioritize showing that
        if (hasPendingWebSearch) {
            // Find the most recent web search for the query text
            for (var i = toolParts.length - 1; i >= 0; i--) {
                var tool = toolParts[i];
                var type = tool === null || tool === void 0 ? void 0 : tool.type;
                if (type === "tool-webSearch") {
                    var toolWithMeta = tool;
                    currentToolCall = "webSearch";
                    _toolMetadata = toolWithMeta;
                    break;
                }
            }
        }
        else if (toolParts.length > 0) {
            // No web searches active, get the most recent tool
            var tool = toolParts[toolParts.length - 1];
            var toolWithMeta = tool;
            var type = tool === null || tool === void 0 ? void 0 : tool.type;
            // Extract tool name from type (e.g., "tool-cashFlow" -> "cashFlow")
            var toolName = type === "dynamic-tool"
                ? toolWithMeta.toolName
                : type.replace(/^tool-/, "");
            currentToolCall = toolName;
            _toolMetadata = toolWithMeta;
        }
        // Hide tool when text starts streaming or when complete
        if (currentToolCall && (hasTextContent || status === "ready")) {
            currentToolCall = null;
            _toolMetadata = null;
        }
        // Hide agent status when streaming text, when complete, or when tool is showing
        var agentStatus = status === "ready" || hasTextContent || currentToolCall
            ? null
            : agentStatusData;
        return {
            agentStatus: agentStatus,
            currentToolCall: currentToolCall,
            hasTextContent: hasTextContent
        };
    }, [messages, status, agentStatusData]);
    return result;
}
