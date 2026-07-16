"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeBlock = CodeBlock;
var react_1 = require("react");
var config_context_1 = require("./config-context");
function CopyButton(_a) {
    var text = _a.text;
    var _b = (0, react_1.useState)(false), copied = _b[0], setCopied = _b[1];
    return (<button type="button" onClick={function () {
            var _a;
            (_a = navigator.clipboard) === null || _a === void 0 ? void 0 : _a.writeText(text);
            setCopied(true);
            setTimeout(function () { return setCopied(false); }, 1400);
        }} className="absolute top-[10px] right-[10px] z-10 rounded-[6px] border border-[#3A3A38] bg-[#262624] px-[8px] py-[3px] font-[family-name:var(--font-mono)] text-[11px] text-[#C9C9C5] transition-colors hover:border-[#4A4A47] hover:text-white">
      {copied ? "Copied" : "Copy"}
    </button>);
}
/** A standalone shiki-highlighted code block (intro / prose), dark panel + copy. */
function CodeBlock(_a) {
    var html = _a.html, code = _a.code, label = _a.label;
    var _b = (0, config_context_1.useApiConfig)(), base = _b.base, apiKey = _b.apiKey;
    return (<div className="my-[18px] overflow-hidden rounded-[12px] border border-[#2A2A28] bg-[#1B1B1A]">
      {label && (<div className="flex h-[38px] items-center border-b border-[#2A2A28] px-[14px]">
          <span className="font-[family-name:var(--font-mono)] text-[11.5px] tracking-[0.03em] text-[#9A9A96]">
            {label}
          </span>
        </div>)}
      <div className="relative">
        <CopyButton text={(0, config_context_1.applyConfig)(code, base, apiKey)}/>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: build-time shiki HTML */}
        <div className="api-shiki" dangerouslySetInnerHTML={{ __html: (0, config_context_1.applyConfig)(html, base, apiKey, true) }}/>
      </div>
    </div>);
}
