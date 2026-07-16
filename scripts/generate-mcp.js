"use strict";
/**
 * MCP Tool Metadata Generator
 *
 * Parses all *.service.ts files and generates tool-metadata.json
 * with descriptions and JSON Schema for each tool's parameters.
 *
 * Usage: npx tsx scripts/generate-mcp.ts
 */
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToolMetadata = generateToolMetadata;
var fs = require("fs");
var path = require("path");
var mcp_blocked_tools_1 = require("../apps/erp/app/routes/api+/mcp+/lib/mcp-blocked-tools");
var ROOT = path.resolve(__dirname, "..");
var MODULES_DIR = path.join(ROOT, "apps/erp/app/modules");
var METADATA_FILE = path.join(ROOT, "apps/erp/app/routes/api+/mcp+/lib/tool-metadata.json");
var MODULE_LIST = [
    "account",
    "accounting",
    "documents",
    "inventory",
    "invoicing",
    "items",
    "people",
    "production",
    "purchasing",
    "quality",
    "resources",
    "sales",
    "settings",
    "shared",
    "users",
];
var CONTEXT_PARAMS = new Set([
    "client",
    "db",
    "companyId",
    "userId",
    "createdBy",
    "updatedBy",
    "companyGroupId",
]);
var DESCRIPTION_OVERRIDES = {
    purchasing_insertPurchaseOrder: "Create a new purchase order with all business logic - generates sequence, creates supplier interaction, resolves payment/shipping defaults from supplier. LLM can create a PO with just supplierId.",
    purchasing_updatePurchaseOrder: "Update an existing purchase order - handles exchange rate updates when currency changes",
    purchasing_insertSupplierQuote: "Create a new supplier quote with all business logic - generates sequence, creates supplier interaction, sets up external link. LLM can create a quote with just supplierId.",
    purchasing_updateSupplierQuote: "Update an existing supplier quote - handles exchange rate updates when currency changes",
    sales_insertQuote: "Create a new quote with all business logic - generates sequence, creates opportunity, resolves payment/shipping defaults from customer. LLM can create a quote with just customerId.",
    sales_updateQuote: "Update an existing quote - handles exchange rate updates when currency changes, syncs customer to opportunity",
    sales_insertSalesOrder: "Create a new sales order with all business logic - generates sequence, creates opportunity, resolves payment/shipping defaults from customer. LLM can create a sales order with just customerId.",
    sales_updateSalesOrder: "Update an existing sales order - handles exchange rate updates when currency changes, syncs customer to opportunity",
    production_insertJob: "Create a new job with all business logic - generates sequence, resolves location, copies method from item, recalculates requirements. LLM can create a job with just itemId and quantity.",
    production_updateJob: "Update an existing job - handles priority recalculation when deadline changes",
    inventory_insertStockTransfer: "Create a stock transfer with lines. Generates sequence ID automatically.",
    inventory_updateStockTransfer: "Update an existing stock transfer",
    inventory_insertWarehouseTransfer: "Create a warehouse transfer between locations. Generates sequence ID automatically.",
    inventory_updateWarehouseTransfer: "Update an existing warehouse transfer",
};
// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------
function findMatchingBrace(content, openPos) {
    var open = content[openPos];
    var close = open === "(" ? ")" : open === "{" ? "}" : open === "[" ? "]" : ">";
    var depth = 1;
    var i = openPos + 1;
    while (i < content.length && depth > 0) {
        if (content[i] === open)
            depth++;
        else if (content[i] === close)
            depth--;
        i++;
    }
    return i - 1;
}
function splitAtTopLevel(str, delimiter) {
    var parts = [];
    var depth = 0;
    var current = "";
    for (var i = 0; i < str.length; i++) {
        var ch = str[i];
        if ("({[<".includes(ch))
            depth++;
        else if (")}]>".includes(ch))
            depth--;
        if (ch === delimiter && depth === 0) {
            parts.push(current.trim());
            current = "";
        }
        else {
            current += ch;
        }
    }
    if (current.trim())
        parts.push(current.trim());
    return parts;
}
function findTopLevelColon(str) {
    var depth = 0;
    for (var i = 0; i < str.length; i++) {
        var ch = str[i];
        if ("({[<".includes(ch))
            depth++;
        else if (")}]>".includes(ch))
            depth--;
        if (ch === ":" && depth === 0)
            return i;
    }
    return -1;
}
function parseExportedFunctions(content) {
    var results = [];
    var regex = /export\s+(?:async\s+)?function\s+(\w+)\s*\(/g;
    var match;
    while ((match = regex.exec(content)) !== null) {
        var name_1 = match[1];
        var openParen = match.index + match[0].length - 1;
        var closeParen = findMatchingBrace(content, openParen);
        var rawParams = content.substring(openParen + 1, closeParen).trim();
        if (!rawParams) {
            results.push({ name: name_1, params: [] });
            continue;
        }
        var paramStrings = splitAtTopLevel(rawParams, ",");
        var params = [];
        for (var _i = 0, paramStrings_1 = paramStrings; _i < paramStrings_1.length; _i++) {
            var p = paramStrings_1[_i];
            if (!p)
                continue;
            var colonIdx = findTopLevelColon(p);
            if (colonIdx === -1) {
                params.push({ name: p.trim(), typeStr: "unknown", optional: false });
                continue;
            }
            var before = p.substring(0, colonIdx).trim();
            var optional = before.endsWith("?");
            var paramName = before.replace(/\?$/, "").trim();
            var typeStr = p.substring(colonIdx + 1).trim();
            params.push({ name: paramName, typeStr: typeStr, optional: optional });
        }
        results.push({ name: name_1, params: params });
    }
    return results;
}
// ---------------------------------------------------------------------------
// Type → JSON Schema conversion
// ---------------------------------------------------------------------------
function typeToJsonSchema(typeStr) {
    var t = typeStr.trim();
    // Nullable: "Type | null"
    var nullableMatch = t.match(/^(.+?)\s*\|\s*null$/);
    if (nullableMatch) {
        var inner = typeToJsonSchema(nullableMatch[1].trim());
        if (inner.type) {
            return __assign(__assign({}, inner), { type: [inner.type, "null"] });
        }
        return inner;
    }
    // String literal union: "A" | "B" | "C"
    var literalParts = splitAtTopLevel(t, "|").map(function (s) { return s.trim(); });
    if (literalParts.length > 1 && literalParts.every(function (p) { return /^"[^"]*"$/.test(p); })) {
        return {
            type: "string",
            enum: literalParts.map(function (p) { return p.slice(1, -1); }),
        };
    }
    // Primitives
    if (t === "string")
        return { type: "string" };
    if (t === "number")
        return { type: "number" };
    if (t === "boolean")
        return { type: "boolean" };
    // Arrays
    if (t === "string[]")
        return { type: "array", items: { type: "string" } };
    if (t === "number[]")
        return { type: "array", items: { type: "number" } };
    if (t.endsWith("[]")) {
        var inner = typeToJsonSchema(t.slice(0, -2).trim());
        return { type: "array", items: inner };
    }
    // Json type
    if (t === "Json" || t === "Json | null")
        return {};
    // (typeof X)[number] — enum array reference
    if (t.match(/\(typeof\s+\w+\)\s*\[number\]/))
        return { type: "string" };
    // Inline object: { field: Type; ... }
    if (t.startsWith("{")) {
        return parseInlineObjectType(t);
    }
    // GenericQueryFilters & { ... }
    if (t.includes("GenericQueryFilters")) {
        var base = {
            type: "object",
            properties: {
                limit: { type: "integer", default: 100 },
                offset: { type: "integer", default: 0 },
            },
        };
        var intersectMatch = t.match(/&\s*(\{.+\})\s*$/s);
        if (intersectMatch) {
            var extra = parseInlineObjectType(intersectMatch[1]);
            if (extra.properties) {
                base.properties = __assign(__assign({}, base.properties), extra.properties);
            }
        }
        return base;
    }
    // Fallback
    return {};
}
function parseInlineObjectType(typeStr) {
    var inner = typeStr.trim();
    if (inner.startsWith("{"))
        inner = inner.slice(1);
    if (inner.endsWith("}"))
        inner = inner.slice(0, -1);
    inner = inner.trim();
    if (!inner)
        return { type: "object", properties: {} };
    var properties = {};
    var required = [];
    var fields = splitObjectFields(inner);
    for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
        var field = fields_1[_i];
        var f = field.trim();
        if (!f)
            continue;
        var optional = f.includes("?:");
        var colonIdx = f.indexOf("?:") !== -1 ? f.indexOf("?:") : f.indexOf(":");
        if (colonIdx === -1)
            continue;
        var fieldName = f.substring(0, colonIdx).replace("?", "").trim();
        if (CONTEXT_PARAMS.has(fieldName))
            continue;
        var fieldType = f
            .substring(colonIdx + (optional ? 2 : 1))
            .trim()
            .replace(/;$/, "")
            .trim();
        properties[fieldName] = typeToJsonSchema(fieldType);
        if (!optional)
            required.push(fieldName);
    }
    var schema = { type: "object", properties: properties };
    if (required.length > 0)
        schema.required = required;
    return schema;
}
function splitObjectFields(inner) {
    var fields = [];
    var depth = 0;
    var current = "";
    for (var i = 0; i < inner.length; i++) {
        var ch = inner[i];
        if ("({[<".includes(ch))
            depth++;
        else if (")}]>".includes(ch))
            depth--;
        if (ch === ";" && depth === 0) {
            fields.push(current.trim());
            current = "";
        }
        else {
            current += ch;
        }
    }
    if (current.trim())
        fields.push(current.trim());
    return fields;
}
// ---------------------------------------------------------------------------
// Validator resolution
// ---------------------------------------------------------------------------
function parseValidatorFields(validatorName, modelsContent) {
    var regex = new RegExp("export\\s+const\\s+".concat(validatorName, "\\s*=\\s*z\\.object\\(\\{"));
    var match = regex.exec(modelsContent);
    if (!match)
        return null;
    var braceStart = match.index + match[0].length - 1;
    var braceEnd = findMatchingBrace(modelsContent, braceStart);
    var inner = modelsContent.substring(braceStart + 1, braceEnd).trim();
    var properties = {};
    var required = [];
    // Validator fields are comma-separated, not semicolon-separated
    var fields = splitAtTopLevel(inner, ",");
    for (var _i = 0, fields_2 = fields; _i < fields_2.length; _i++) {
        var field = fields_2[_i];
        var f = field.trim();
        if (!f || f.startsWith("//"))
            continue;
        var colonMatch = f.match(/^(\w+)\s*:/);
        if (!colonMatch)
            continue;
        var fieldName = colonMatch[1];
        if (CONTEXT_PARAMS.has(fieldName))
            continue;
        var zodExpr = f.substring(colonMatch[0].length).trim();
        var schema = zodExprToJsonSchema(zodExpr);
        var isOptional = zodExpr.includes(".optional()") ||
            zodExpr.includes(".nullable()") ||
            zodExpr.startsWith("zfd.text(") ||
            zodExpr.startsWith("zfd.numeric(") ||
            zodExpr.includes(".default(");
        properties[fieldName] = schema;
        if (!isOptional)
            required.push(fieldName);
    }
    var result = { type: "object", properties: properties };
    if (required.length > 0)
        result.required = required;
    return result;
}
function zodExprToJsonSchema(expr) {
    var e = expr.trim();
    if (e.includes("z.enum(")) {
        var enumMatch = e.match(/z\.enum\(\[([^\]]+)\]\)/);
        if (enumMatch) {
            var values = enumMatch[1]
                .split(",")
                .map(function (s) { return s.trim().replace(/^["']|["']$/g, ""); })
                .filter(Boolean);
            return { type: "string", enum: values };
        }
    }
    if (e.startsWith("z.array("))
        return { type: "array" };
    if (e.includes("z.number()"))
        return { type: "number" };
    if (e.includes("z.boolean()"))
        return { type: "boolean" };
    if (e.includes("z.string()") || e.startsWith("zfd.text("))
        return { type: "string" };
    if (e.includes("z.any()"))
        return {};
    if (e.startsWith("zfd.numeric("))
        return { type: "number" };
    if (e.startsWith("z.preprocess(")) {
        if (e.includes("z.enum("))
            return zodExprToJsonSchema(e);
        if (e.includes("z.number()"))
            return { type: "number" };
        return { type: "string" };
    }
    return { type: "string" };
}
// ---------------------------------------------------------------------------
// Classification & auth
// ---------------------------------------------------------------------------
function classifyFunction(name) {
    if (/^delete/.test(name))
        return "DESTRUCTIVE";
    if (/^(get|list|fetch|search|find|count|check|is|has)/.test(name))
        return "READ";
    return "WRITE";
}
function computeInjectAuth(funcName, classification) {
    var lower = funcName.toLowerCase();
    if (classification === "READ" || classification === "DESTRUCTIVE") {
        return ["companyId"];
    }
    if (/^(upsert|create|insert|add|new|copy|duplicate|generate)/.test(lower)) {
        return ["companyId", "createdBy", "updatedBy"];
    }
    if (/^(update|modify|set|change|edit|approve|reject|finalize|toggle|move|reorder|recalculate|sync|favorite|unfavorite|send|release|close|convert|run)/.test(lower)) {
        return ["companyId", "updatedBy"];
    }
    return ["companyId"];
}
function generateDescription(funcName) {
    return funcName
        .replace(/([A-Z])/g, " $1")
        .trim()
        .toLowerCase();
}
// ---------------------------------------------------------------------------
// Schema building for a function
// ---------------------------------------------------------------------------
function buildToolSchema(func, modelsContent) {
    var _a, _b;
    var userParams = func.params.filter(function (p) { return !CONTEXT_PARAMS.has(p.name); });
    if (userParams.length === 0) {
        return { schema: { type: "object", properties: {} }, paramCount: 0 };
    }
    // Single object param — flatten its fields into the schema
    if (userParams.length === 1) {
        var param = userParams[0];
        // Check for validator reference: z.infer<typeof validatorName>
        var validatorMatch = param.typeStr.match(/z\.infer<typeof\s+(\w+)>/);
        if (validatorMatch && modelsContent) {
            var validatorName = validatorMatch[1];
            var resolved = parseValidatorFields(validatorName, modelsContent);
            if (resolved) {
                var propCount = Object.keys(resolved.properties || {}).length;
                return { schema: resolved, paramCount: propCount };
            }
        }
        // Inline object type
        if (param.typeStr.trim().startsWith("{")) {
            var schema_1 = parseInlineObjectType(param.typeStr);
            var propCount = Object.keys(schema_1.properties || {}).length;
            return { schema: schema_1, paramCount: propCount };
        }
        // GenericQueryFilters
        if (param.typeStr.includes("GenericQueryFilters")) {
            var innerSchema = typeToJsonSchema(param.typeStr);
            var schema_2 = {
                type: "object",
                properties: (_a = {}, _a[param.name] = innerSchema, _a),
            };
            var propCount = Object.keys(innerSchema.properties || {}).length;
            return { schema: schema_2, paramCount: propCount };
        }
        // Simple primitive param
        var propSchema = typeToJsonSchema(param.typeStr);
        var schema_3 = {
            type: "object",
            properties: (_b = {}, _b[param.name] = propSchema, _b),
            required: param.optional ? undefined : [param.name],
        };
        return { schema: schema_3, paramCount: 1 };
    }
    // Multiple params — each becomes a property (or flattened if inline object)
    var properties = {};
    var required = [];
    for (var _i = 0, userParams_1 = userParams; _i < userParams_1.length; _i++) {
        var param = userParams_1[_i];
        if (param.typeStr.trim().startsWith("{")) {
            // Inline object — wrap under param name
            properties[param.name] = parseInlineObjectType(param.typeStr);
        }
        else {
            properties[param.name] = typeToJsonSchema(param.typeStr);
        }
        if (!param.optional)
            required.push(param.name);
    }
    var schema = { type: "object", properties: properties };
    if (required.length > 0)
        schema.required = required;
    return { schema: schema, paramCount: Object.keys(properties).length };
}
// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function loadModelsContent(mod) {
    var modelsPath = path.join(MODULES_DIR, mod, "".concat(mod, ".models.ts"));
    if (fs.existsSync(modelsPath)) {
        return fs.readFileSync(modelsPath, "utf-8");
    }
    // Try shared models for cross-module validators
    var sharedPath = path.join(MODULES_DIR, "shared", "index.ts");
    if (fs.existsSync(sharedPath)) {
        return fs.readFileSync(sharedPath, "utf-8");
    }
    return null;
}
function generateToolMetadata() {
    console.log("Generating tool metadata from service files...");
    var allTools = [];
    for (var _i = 0, MODULE_LIST_1 = MODULE_LIST; _i < MODULE_LIST_1.length; _i++) {
        var mod = MODULE_LIST_1[_i];
        var serviceFile = path.join(MODULES_DIR, mod, "".concat(mod, ".service.ts"));
        if (!fs.existsSync(serviceFile)) {
            console.warn("  \u26A0 Service file not found: ".concat(serviceFile));
            continue;
        }
        var content = fs.readFileSync(serviceFile, "utf-8");
        var modelsContent = loadModelsContent(mod);
        var functions = parseExportedFunctions(content);
        var toolCount = 0;
        for (var _a = 0, functions_1 = functions; _a < functions_1.length; _a++) {
            var func = functions_1[_a];
            var toolName = "".concat(mod, "_").concat(func.name);
            if (mcp_blocked_tools_1.MCP_BLOCKED_TOOL_NAMES.includes(toolName))
                continue;
            var classification = classifyFunction(func.name);
            var injectAuth = computeInjectAuth(func.name, classification);
            var description = DESCRIPTION_OVERRIDES[toolName] || generateDescription(func.name);
            var serviceParams = func.params.map(function (p) { return p.name; });
            var _b = buildToolSchema(func, modelsContent), schema = _b.schema, paramCount = _b.paramCount;
            allTools.push({
                name: toolName,
                module: mod,
                classification: classification,
                description: description,
                paramCount: paramCount,
                serviceParams: serviceParams,
                injectAuth: injectAuth,
                schema: schema,
            });
            toolCount++;
        }
        console.log("  \u2713 ".concat(mod, ": ").concat(toolCount, " tools"));
    }
    var metadata = {
        generated: new Date().toISOString(),
        totalTools: allTools.length,
        modules: __spreadArray([], new Set(allTools.map(function (t) { return t.module; })), true).length,
        tools: allTools,
    };
    fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));
    console.log("\n\u2713 Generated metadata for ".concat(allTools.length, " tools"));
    console.log("  Output: ".concat(path.relative(ROOT, METADATA_FILE)));
}
if (require.main === module) {
    generateToolMetadata();
}
