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
exports.generateStaticParams = generateStaticParams;
exports.generateMetadata = generateMetadata;
exports.default = ToolPage;
var navigation_1 = require("next/navigation");
var code_block_1 = require("@/components/api/code-block");
var doc_1 = require("@/components/api/doc");
var highlight_1 = require("@/lib/highlight");
var tools_data_1 = require("@/lib/tools-data");
function generateStaticParams() {
    return (0, tools_data_1.allToolParams)();
}
function generateMetadata(props) {
    return __awaiter(this, void 0, void 0, function () {
        var tool, found;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, props.params];
                case 1:
                    tool = (_a.sent()).tool;
                    found = (0, tools_data_1.getTool)(tool);
                    return [2 /*return*/, {
                            title: found ? "".concat(found.tool.name, " \u2014 Carbon MCP") : "Carbon MCP",
                            description: found === null || found === void 0 ? void 0 : found.tool.description
                        }];
            }
        });
    });
}
var BADGE = {
    READ: "bg-[#E4F8DA] text-[#3F9142] border-[#A8DB91]",
    WRITE: "bg-[#DFF5FF] text-[#1E84B0] border-[#A9DAF3]",
    DESTRUCTIVE: "bg-[#FCE8E6] text-[#B3261E] border-[#F2C0BC]"
};
function propType(p) {
    var _a, _b, _c, _d;
    if (Array.isArray(p.enum) && p.enum.length)
        return "enum";
    if (p.type === "array")
        return "".concat((_b = (_a = p.items) === null || _a === void 0 ? void 0 : _a.type) !== null && _b !== void 0 ? _b : "any", "[]");
    return (_d = (_c = p.format) !== null && _c !== void 0 ? _c : p.type) !== null && _d !== void 0 ? _d : "any";
}
/** Render a tool's input schema as a readable parameter list (required first). */
function Parameters(_a) {
    var _b, _c;
    var schema = _a.schema;
    var s = (schema !== null && schema !== void 0 ? schema : {});
    var props = (_b = s.properties) !== null && _b !== void 0 ? _b : {};
    var required = new Set((_c = s.required) !== null && _c !== void 0 ? _c : []);
    var names = Object.keys(props).sort(function (a, b) { return Number(required.has(b)) - Number(required.has(a)); });
    if (names.length === 0)
        return <doc_1.P>This tool takes no arguments.</doc_1.P>;
    return (<div className="mt-[10px] divide-y divide-[#E7E7E3] border-t border-[#E7E7E3]">
      {names.map(function (name) {
            var p = props[name];
            return (<div key={name} className="py-[13px]">
            <div className="flex flex-wrap items-center gap-[8px]">
              <code className="font-[family-name:var(--font-mono)] text-[13.5px] text-[#262323]">
                {name}
              </code>
              <span className="font-[family-name:var(--font-mono)] text-[12px] text-[rgba(38,35,35,0.54)]">
                {propType(p)}
              </span>
              {required.has(name) ? (<span className="text-[11px] font-medium text-[#9C7136]">
                  required
                </span>) : (<span className="text-[11px] font-medium text-[rgba(38,35,35,0.48)]">
                  optional
                </span>)}
            </div>
            {p.description && (<p className="m-0 mt-[6px] text-[14.5px] leading-[150%] text-[rgba(38,35,35,0.74)]">
                {p.description}
              </p>)}
          </div>);
        })}
    </div>);
}
function exampleArg(prop) {
    if (!prop || typeof prop !== "object")
        return "string";
    switch (prop.type) {
        case "number":
        case "integer":
            return 0;
        case "boolean":
            return true;
        case "array":
            return [];
        case "object":
            return {};
        default:
            return "string";
    }
}
function exampleArgs(schema) {
    var _a, _b;
    var s = (schema !== null && schema !== void 0 ? schema : {});
    var props = (_a = s.properties) !== null && _a !== void 0 ? _a : {};
    var required = (_b = s.required) !== null && _b !== void 0 ? _b : Object.keys(props);
    var out = {};
    for (var _i = 0, required_1 = required; _i < required_1.length; _i++) {
        var key = required_1[_i];
        out[key] = exampleArg(props[key]);
    }
    return out;
}
function ToolPage(props) {
    return __awaiter(this, void 0, void 0, function () {
        var tool, found, mod, t, schemaJson, callSnippet, _a, callHtml, schemaHtml, description;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, props.params];
                case 1:
                    tool = (_b.sent()).tool;
                    found = (0, tools_data_1.getTool)(tool);
                    if (!found)
                        (0, navigation_1.notFound)();
                    mod = found.module, t = found.tool;
                    schemaJson = JSON.stringify(t.schema, null, 2);
                    callSnippet = "call_tool(".concat(JSON.stringify({ name: t.name, arguments: exampleArgs(t.schema) }, null, 2), ")");
                    return [4 /*yield*/, Promise.all([
                            (0, highlight_1.highlight)(callSnippet, "javascript"),
                            (0, highlight_1.highlight)(schemaJson, "json")
                        ])];
                case 2:
                    _a = _b.sent(), callHtml = _a[0], schemaHtml = _a[1];
                    description = t.description
                        ? t.description.charAt(0).toUpperCase() + t.description.slice(1)
                        : "";
                    return [2 /*return*/, (<doc_1.DocPage>
      <doc_1.DocEyebrow>MCP · {mod.name}</doc_1.DocEyebrow>
      <div className="mt-[8px] flex flex-wrap items-center gap-[12px]">
        <h1 className="m-0 break-all font-[family-name:var(--font-mono)] text-[25px] font-[560] leading-[120%] text-[#262323]">
          {t.name}
        </h1>
        <span className={"inline-flex shrink-0 items-center rounded-[6px] border px-[8px] py-[2px] font-[family-name:var(--font-mono)] text-[11px] font-semibold ".concat(BADGE[t.classification])}>
          {t.classification}
        </span>
      </div>
      {description && <doc_1.P>{description}.</doc_1.P>}

      <doc_1.H2 id="parameters">Parameters</doc_1.H2>
      <Parameters schema={t.schema}/>

      <doc_1.H2 id="call">Call it</doc_1.H2>
      <doc_1.P>
        Invoke it through the <doc_1.Code>call_tool</doc_1.Code> meta-tool with its
        arguments:
      </doc_1.P>
      <code_block_1.CodeBlock html={callHtml} code={callSnippet} label="call_tool"/>

      <doc_1.H2 id="schema">Input schema</doc_1.H2>
      <doc_1.P>The raw JSON Schema the tool validates its arguments against.</doc_1.P>
      <code_block_1.CodeBlock html={schemaHtml} code={schemaJson} label="schema"/>
    </doc_1.DocPage>)];
            }
        });
    });
}
