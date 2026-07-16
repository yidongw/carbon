"use strict";
// Direct executor for ERP functions without MCP protocol wrapper
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.executeFunction = executeFunction;
exports.searchFunctions = searchFunctions;
var accountFunctions = require("~/modules/account/account.service");
var accountingFunctions = require("~/modules/accounting/accounting.service");
var documentsFunctions = require("~/modules/documents/documents.service");
var inventoryFunctions = require("~/modules/inventory/inventory.service");
var invoicingFunctions = require("~/modules/invoicing/invoicing.service");
var itemsFunctions = require("~/modules/items/items.service");
var peopleFunctions = require("~/modules/people/people.service");
var productionFunctions = require("~/modules/production/production.service");
var purchasingFunctions = require("~/modules/purchasing/purchasing.service");
var qualityFunctions = require("~/modules/quality/quality.service");
var resourcesFunctions = require("~/modules/resources/resources.service");
var salesFunctions = require("~/modules/sales/sales.service");
var settingsFunctions = require("~/modules/settings/settings.service");
var sharedFunctions = require("~/modules/shared/shared.service");
var usersFunctions = require("~/modules/users/users.service");
var mcp_blocked_tools_1 = require("./mcp-blocked-tools");
var tool_metadata_json_1 = require("./tool-metadata.json");
// Combine all functions into a single registry
var functionRegistry = {
    account: accountFunctions,
    accounting: accountingFunctions,
    documents: documentsFunctions,
    inventory: inventoryFunctions,
    invoicing: invoicingFunctions,
    items: itemsFunctions,
    people: peopleFunctions,
    production: productionFunctions,
    purchasing: purchasingFunctions,
    quality: qualityFunctions,
    resources: resourcesFunctions,
    sales: salesFunctions,
    settings: settingsFunctions,
    shared: sharedFunctions,
    users: usersFunctions
};
// Stamps auth identity onto typed payloads. Carbon's services expect auth
// fields inside the payload (predates MCP). `fields` is per-tool from
// tool-metadata.json so reads stay clean and updates don't overwrite createdBy.
function enrichWithAuthContext(value, context, fields) {
    if (!value || typeof value !== "object" || Array.isArray(value))
        return value;
    if (fields.length === 0)
        return value;
    var enriched = __assign({}, value);
    if (fields.includes("createdBy") && !("createdBy" in enriched)) {
        enriched.createdBy = context.userId;
    }
    if (fields.includes("updatedBy")) {
        enriched.updatedBy = context.userId;
    }
    if (fields.includes("companyId")) {
        enriched.companyId = context.companyId;
    }
    if (fields.includes("companyGroupId")) {
        enriched.companyGroupId = context.companyGroupId;
    }
    return enriched;
}
function executeFunction(functionName, context, args) {
    return __awaiter(this, void 0, void 0, function () {
        var normalizedArgs, parts, moduleName, funcName, moduleFunctions, func, toolMeta, paramNames, injectAuth, functionArgs, _i, paramNames_1, paramName, argsValue, value, result, executedResult, queryError_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof args === "string") {
                        try {
                            args = args.trim().length > 0 ? JSON.parse(args) : {};
                        }
                        catch (_b) {
                            return [2 /*return*/, {
                                    success: false,
                                    error: "Invalid JSON arguments"
                                }];
                        }
                    }
                    normalizedArgs = args && typeof args === "object" ? args : undefined;
                    if ((0, mcp_blocked_tools_1.isMcpBlockedTool)(functionName)) {
                        return [2 /*return*/, {
                                success: false,
                                error: "Tool disabled: ".concat(functionName, " is not available via MCP.")
                            }];
                    }
                    parts = functionName.split("_");
                    if (parts.length < 2) {
                        console.error("[DirectExecutor] Invalid function name format:", functionName);
                        throw new Error("Invalid function name format: ".concat(functionName));
                    }
                    moduleName = parts[0];
                    funcName = parts.slice(1).join("_");
                    moduleFunctions = functionRegistry[moduleName];
                    if (!moduleFunctions) {
                        console.error("[DirectExecutor] Module not found:", moduleName);
                        throw new Error("Module not found: ".concat(moduleName));
                    }
                    func = moduleFunctions[funcName];
                    if (!func || typeof func !== "function") {
                        console.error("[DirectExecutor] Function not found:", funcName, "in module", moduleName);
                        throw new Error("Function not found: ".concat(funcName, " in module ").concat(moduleName));
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    toolMeta = tool_metadata_json_1.default.tools.find(function (t) { return t.name === functionName; });
                    paramNames = toolMeta && "serviceParams" in toolMeta
                        ? toolMeta.serviceParams
                        : [];
                    injectAuth = toolMeta && "injectAuth" in toolMeta
                        ? toolMeta.injectAuth
                        : [];
                    functionArgs = [];
                    for (_i = 0, paramNames_1 = paramNames; _i < paramNames_1.length; _i++) {
                        paramName = paramNames_1[_i];
                        if (paramName === "client") {
                            functionArgs.push(context.client);
                        }
                        else if (paramName === "userId") {
                            functionArgs.push(context.userId);
                        }
                        else if (paramName === "companyId") {
                            functionArgs.push(context.companyId);
                        }
                        else if (paramName === "companyGroupId") {
                            functionArgs.push(context.companyGroupId);
                        }
                        else if (paramName === "args") {
                            argsValue = normalizedArgs || {};
                            functionArgs.push(argsValue);
                        }
                        else if (normalizedArgs && paramName in normalizedArgs) {
                            functionArgs.push(enrichWithAuthContext(normalizedArgs[paramName], context, injectAuth));
                        }
                        else if (normalizedArgs &&
                            Object.keys(normalizedArgs).length === 1 &&
                            !paramNames.some(function (p) { return p in normalizedArgs; }) &&
                            typeof Object.values(normalizedArgs)[0] === "object" &&
                            Object.values(normalizedArgs)[0] !== null) {
                            value = Object.values(normalizedArgs)[0];
                            functionArgs.push(enrichWithAuthContext(value, context, injectAuth));
                        }
                        else if (normalizedArgs && Object.keys(normalizedArgs).length > 0) {
                            // No key matched — pass the entire args object as a positional param.
                            // Handles functions like upsertPart(client, part) where the caller
                            // passes flat fields instead of nesting under the param name.
                            functionArgs.push(enrichWithAuthContext(__assign({}, normalizedArgs), context, injectAuth));
                        }
                        else {
                            // Skip optional parameters
                            continue;
                        }
                    }
                    return [4 /*yield*/, func.apply(void 0, functionArgs)];
                case 2:
                    result = _a.sent();
                    if (!(result &&
                        typeof result === "object" &&
                        typeof result.then === "function")) return [3 /*break*/, 6];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, result];
                case 4:
                    executedResult = _a.sent();
                    result = executedResult;
                    return [3 /*break*/, 6];
                case 5:
                    queryError_1 = _a.sent();
                    console.error("[DirectExecutor] Query execution failed:", queryError_1);
                    throw queryError_1;
                case 6: return [2 /*return*/, {
                        success: true,
                        data: result
                    }];
                case 7:
                    error_1 = _a.sent();
                    console.error("[DirectExecutor] Function execution failed:", error_1);
                    console.error("[DirectExecutor] Error stack:", error_1.stack);
                    return [2 /*return*/, {
                            success: false,
                            error: error_1.message || "Function execution failed"
                        }];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// Helper to search available functions
function searchFunctions(query, module) {
    var results = [];
    Object.entries(functionRegistry).forEach(function (_a) {
        var moduleName = _a[0], functions = _a[1];
        if (module && moduleName !== module)
            return;
        Object.keys(functions).forEach(function (funcName) {
            var fullName = "".concat(moduleName, "_").concat(funcName);
            if ((0, mcp_blocked_tools_1.isMcpBlockedTool)(fullName))
                return;
            if (!query || fullName.toLowerCase().includes(query.toLowerCase())) {
                results.push(fullName);
            }
        });
    });
    return results;
}
