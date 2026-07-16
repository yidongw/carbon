"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodePanel = CodePanel;
var react_1 = require("react");
var config_context_1 = require("./config-context");
var method_badge_1 = require("./method-badge");
var LANGS = [
    { key: "curl", label: "cURL" },
    { key: "javascript", label: "JavaScript" },
    { key: "python", label: "Python" },
    { key: "go", label: "Go" },
];
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
function Panel(_a) {
    var children = _a.children;
    return (<div className="overflow-hidden rounded-[12px] border border-[#0e2a3f] bg-[#011627] shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
      {children}
    </div>);
}
function CodePanel(_a) {
    var samples = _a.samples, highlighted = _a.highlighted, method = _a.method, fullPath = _a.fullPath, response = _a.response, responseHtml = _a.responseHtml;
    var _b = (0, react_1.useState)("curl"), lang = _b[0], setLang = _b[1];
    var _c = (0, config_context_1.useApiConfig)(), base = _c.base, apiKey = _c.apiKey;
    return (<div className="sticky top-[88px] flex flex-col gap-[16px]">
      <Panel>
        <div className="flex h-[44px] items-center justify-between gap-[8px] border-b border-[#0e2a3f] pr-[10px] pl-[14px]">
          <div className="flex min-w-0 items-center gap-[8px]">
            <method_badge_1.MethodBadge method={method}/>
            <span className="truncate font-[family-name:var(--font-mono)] text-[12px] text-[#9A9A96]">
              {(0, config_context_1.applyBase)(fullPath, base)}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-[2px]">
            {LANGS.map(function (l) { return (<button key={l.key} type="button" onClick={function () { return setLang(l.key); }} className={"rounded-[6px] px-[8px] py-[4px] text-[12px] transition-colors ".concat(lang === l.key ? "bg-[#2E2E2B] text-white" : "text-[#8C8C88] hover:text-[#C9C9C5]")}>
                {l.label}
              </button>); })}
          </div>
        </div>
        <div className="relative">
          <CopyButton text={(0, config_context_1.applyConfig)(samples[lang], base, apiKey)}/>
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: build-time shiki HTML */}
          <div className="api-shiki" dangerouslySetInnerHTML={{ __html: (0, config_context_1.applyConfig)(highlighted[lang], base, apiKey, true) }}/>
        </div>
      </Panel>

      {response ? (<Panel>
          <div className="flex h-[40px] items-center border-b border-[#0e2a3f] px-[14px]">
            <span className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.04em] text-[#9A9A96]">
              Response
            </span>
          </div>
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: build-time shiki HTML */}
          <div className="api-shiki-response" dangerouslySetInnerHTML={{ __html: responseHtml }}/>
        </Panel>) : (<div className="rounded-[10px] border border-[#E7E7E3] bg-[#FBFBF8] px-[14px] py-[12px] font-[family-name:var(--font-mono)] text-[13px] text-[rgba(38,35,35,0.63)]">
          204 No Content
        </div>)}
    </div>);
}
