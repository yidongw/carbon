"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMcpServer = createMcpServer;
// @ts-nocheck
var mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
var zod_1 = require("zod");
var types_1 = require("./types");
var tool_metadata_json_1 = require("./tool-metadata.json");
var mcp_blocked_tools_1 = require("./mcp-blocked-tools");
var direct_executor_1 = require("./direct-executor");
function getServerInstructions() {
    var today = new Date().toISOString().split("T")[0];
    return "Carbon ERP Manufacturing System\n==========================================\nDate: ".concat(today, "\n\nIMPORTANT: Tool Discovery System\nThis server has ").concat(tool_metadata_json_1.default.totalTools, " tools available across ").concat(tool_metadata_json_1.default.modules, " modules.\n\nTo prevent context exhaustion, tools are loaded on-demand using call_tool.\n\nUSAGE:\n1. Use search_tools to discover available tool names\n2. Use describe_tool to get the schema for a specific tool\n3. Use call_tool to execute any tool with its parameters\n\nEXAMPLES:\n// Step 1: Discover tools\nsearch_tools({ query: \"customer\" })\n// Returns tool names like: sales_getCustomers, sales_getCustomersList\n\n// Step 2 (optional): Get tool schema\ndescribe_tool({ name: \"sales_getCustomers\" })\n\n// Step 3: Call the tool (arguments must be a JSON object, not a string)\ncall_tool({ \n  name: \"sales_getCustomers\",\n  arguments: { args: { limit: 10 } }\n})\n\nSEARCH EXAMPLES:\nsearch_tools({ query: \"customer\" })     // Find customer-related tools\nsearch_tools({ module: \"sales\" })       // Find all sales module tools\nsearch_tools({ classification: \"READ\" }) // Find read-only tools\n\nKEY PATTERNS:\n- companyId/userId are auto-filled\n- call_tool.arguments is always a JSON object (never a stringified JSON blob)\n- Responses: { data, error?, count? }\n- Dates: ISO 8601 (YYYY-MM-DD)\n- Pagination: limit/offset");
}
function createMcpServer(ctx) {
    var _this = this;
    var _a, _b;
    var server = new mcp_js_1.McpServer({
        name: "carbon-erp",
        version: (_b = (_a = process.env.VERCEL_GIT_COMMIT_SHA) === null || _a === void 0 ? void 0 : _a.slice(0, 7)) !== null && _b !== void 0 ? _b : "1.0.0",
    }, {
        instructions: getServerInstructions(),
    });
    // Register describe_tool to get schema information for any tool
    server.registerTool("describe_tool", {
        description: "Get the schema and description for a specific tool",
        inputSchema: zod_1.z.object({
            name: zod_1.z.string().describe("The name of the tool to describe")
        }),
        annotations: types_1.READ_ONLY_ANNOTATIONS
    }, (0, types_1.withErrorHandling)(function (params) { return __awaiter(_this, void 0, void 0, function () {
        var name, tool, output;
        return __generator(this, function (_a) {
            name = params.name;
            console.log("[MCP Server] describe_tool invoked for:", name);
            tool = tool_metadata_json_1.default.tools.find(function (t) { return t.name === name; });
            if (!tool) {
                console.error("[MCP Server] Tool not found:", name);
                return [2 /*return*/, {
                        content: [{ type: "text", text: "Tool '".concat(name, "' not found") }],
                        isError: true
                    }];
            }
            console.log("[MCP Server] Found tool:", tool.name, "in module:", tool.module);
            output = "Tool: ".concat(name, "\n");
            output += "Module: ".concat(tool.module, "\n");
            output += "Classification: ".concat(tool.classification, "\n");
            output += "Description: ".concat(tool.description, "\n\n");
            output += "Input Schema:\n";
            output += JSON.stringify(tool.schema || {}, null, 2);
            return [2 /*return*/, {
                    content: [{ type: "text", text: output }]
                }];
        });
    }); }, "Describe tool failed"));
    // Register call_tool with direct execution
    server.registerTool("call_tool", {
        description: "Call any ERP tool by name with the specified parameters",
        inputSchema: zod_1.z.object({
            name: zod_1.z.string().describe("The name of the tool to call"),
            arguments: zod_1.z.any().describe("The arguments to pass to the tool")
        }),
        annotations: types_1.WRITE_ANNOTATIONS
    }, (0, types_1.withErrorHandling)(function (params) { return __awaiter(_this, void 0, void 0, function () {
        var name, rawArgs, args, result, output, supabaseData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    name = params.name, rawArgs = params.arguments;
                    args = rawArgs;
                    // Some MCP clients send arguments as a JSON string; normalize to object.
                    if (typeof args === "string") {
                        try {
                            args = args.trim().length > 0 ? JSON.parse(args) : {};
                        }
                        catch (_b) {
                            return [2 /*return*/, {
                                    content: [{ type: "text", text: "Invalid JSON in call_tool.arguments" }],
                                    isError: true
                                }];
                        }
                    }
                    console.log("[MCP Server] call_tool invoked:", { name: name, arguments: args });
                    if ((0, mcp_blocked_tools_1.isMcpBlockedTool)(name)) {
                        return [2 /*return*/, {
                                content: [{
                                        type: "text",
                                        text: "Tool disabled: ".concat(name, " is not available via MCP.")
                                    }],
                                isError: true
                            }];
                    }
                    return [4 /*yield*/, (0, direct_executor_1.executeFunction)(name, ctx, args)];
                case 1:
                    result = _a.sent();
                    console.log("[MCP Server] Execution result:", {
                        success: result.success,
                        hasData: !!result.data,
                        error: result.error
                    });
                    if (result.success) {
                        output = "";
                        // Check if the result.data is a Supabase response format
                        if (result.data && typeof result.data === 'object' && 'data' in result.data) {
                            supabaseData = result.data.data;
                            console.log("[MCP Server] Detected Supabase response format");
                            console.log("[MCP Server] Data array length:", Array.isArray(supabaseData) ? supabaseData.length : 'not array');
                            if (result.data.error) {
                                console.error("[MCP Server] Supabase error:", result.data.error);
                                return [2 /*return*/, {
                                        content: [{ type: "text", text: "Database error: ".concat(JSON.stringify(result.data.error)) }],
                                        isError: true
                                    }];
                            }
                            output = JSON.stringify(supabaseData, null, 2);
                        }
                        else if (result.data) {
                            output = JSON.stringify(result.data, null, 2);
                            console.log("[MCP Server] Using result.data for output");
                        }
                        else {
                            output = "Operation completed successfully";
                            console.log("[MCP Server] No data in result, using default message");
                        }
                        console.log("[MCP Server] Returning output (truncated):", output.substring(0, 200));
                        return [2 /*return*/, {
                                content: [{ type: "text", text: output }]
                            }];
                    }
                    else {
                        console.error("[MCP Server] Tool execution failed:", result.error);
                        return [2 /*return*/, {
                                content: [{ type: "text", text: "Error: ".concat(result.error) }],
                                isError: true
                            }];
                    }
                    return [2 /*return*/];
            }
        });
    }); }, "Call tool failed"));
    // Register search_tools for discovery
    server.registerTool("search_tools", {
        description: "Search for ERP tools and automatically make them available for use",
        inputSchema: zod_1.z.object({
            query: zod_1.z.string().optional().describe("Search in tool names/descriptions"),
            module: zod_1.z.string().optional().describe("Filter by module name"),
            classification: zod_1.z.enum(["READ", "WRITE", "DESTRUCTIVE"]).optional(),
            limit: zod_1.z.number().int().min(1).max(100).default(20),
            offset: zod_1.z.number().int().min(0).default(0)
        }),
        annotations: types_1.READ_ONLY_ANNOTATIONS
    }, (0, types_1.withErrorHandling)(function (params) { return __awaiter(_this, void 0, void 0, function () {
        var query, module, classification, _a, limit, _b, offset, results, q_1, foundTools, toolNames, output, byModule, _i, foundTools_1, tool, _c, _d, _e, mod, tools, _f, tools_1, tool;
        return __generator(this, function (_g) {
            query = params.query, module = params.module, classification = params.classification, _a = params.limit, limit = _a === void 0 ? 20 : _a, _b = params.offset, offset = _b === void 0 ? 0 : _b;
            console.log("[MCP Server] search_tools invoked:", { query: query, module: module, classification: classification, limit: limit, offset: offset });
            results = tool_metadata_json_1.default.tools;
            console.log("[MCP Server] Total tools available:", results.length);
            // Apply filters
            if (module) {
                results = results.filter(function (t) { return t.module.toLowerCase().includes(module.toLowerCase()); });
            }
            if (classification) {
                results = results.filter(function (t) { return t.classification === classification; });
            }
            if (query) {
                q_1 = query.toLowerCase();
                results = results.filter(function (t) {
                    return t.name.toLowerCase().includes(q_1) ||
                        t.description.toLowerCase().includes(q_1) ||
                        t.module.toLowerCase().includes(q_1);
                });
            }
            foundTools = results.slice(offset, offset + limit);
            toolNames = foundTools.map(function (t) { return t.name; });
            console.log("[MCP Server] Found tools after filtering:", results.length);
            console.log("[MCP Server] Returning tools:", toolNames);
            output = "Found ".concat(results.length, " tools");
            if (results.length > limit) {
                output += " (showing ".concat(offset + 1, "-").concat(offset + foundTools.length, ")");
            }
            output += ":\n\n";
            byModule = new Map();
            for (_i = 0, foundTools_1 = foundTools; _i < foundTools_1.length; _i++) {
                tool = foundTools_1[_i];
                if (!byModule.has(tool.module)) {
                    byModule.set(tool.module, []);
                }
                byModule.get(tool.module).push(tool);
            }
            // Format results
            for (_c = 0, _d = byModule.entries(); _c < _d.length; _c++) {
                _e = _d[_c], mod = _e[0], tools = _e[1];
                output += "".concat(mod.toUpperCase(), " MODULE:\n");
                for (_f = 0, tools_1 = tools; _f < tools_1.length; _f++) {
                    tool = tools_1[_f];
                    output += "  \u2022 ".concat(tool.name, " [").concat(tool.classification, "]\n");
                    output += "    ".concat(tool.description, "\n");
                }
                output += "\n";
            }
            // Add instructions for using call_tool
            if (toolNames.length > 0) {
                output += "\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n";
                output += "To use these tools:\n";
                output += "1. Use describe_tool({ name: \"tool_name\" }) to see the schema\n";
                output += "2. Use call_tool({ name: \"tool_name\", arguments: {...} })\n\n";
                output += "Example:\n";
                output += "call_tool({ \n";
                output += "  name: \"".concat(toolNames[0], "\",\n");
                output += "  arguments: { /* tool parameters */ }\n";
                output += "})\n";
                output += "\nAvailable tools:\n";
                output += toolNames.map(function (name) { return "  \u2022 ".concat(name); }).join('\n');
                output += "\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n";
            }
            output += "\nSTATUS: ".concat(tool_metadata_json_1.default.totalTools, " tools available via call_tool");
            return [2 /*return*/, {
                    content: [{ type: "text", text: output }],
                    metadata: {
                        toolNames: toolNames,
                        totalResults: results.length
                    }
                }];
        });
    }); }, "Search failed"));
    return server;
}
