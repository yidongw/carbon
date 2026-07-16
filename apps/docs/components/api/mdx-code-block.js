"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MdxCodeBlock = MdxCodeBlock;
var react_1 = require("react");
/** Renders MDX fenced code in the same dark panel as the API playground CodeBlock. */
function MdxCodeBlock(_a) {
    var title = _a.title, children = _a.children;
    var ref = (0, react_1.useRef)(null);
    var _b = (0, react_1.useState)(false), copied = _b[0], setCopied = _b[1];
    var copy = function () {
        var _a, _b, _c;
        var text = (_b = (_a = ref.current) === null || _a === void 0 ? void 0 : _a.textContent) !== null && _b !== void 0 ? _b : "";
        (_c = navigator.clipboard) === null || _c === void 0 ? void 0 : _c.writeText(text);
        setCopied(true);
        setTimeout(function () { return setCopied(false); }, 1400);
    };
    return (<div className="my-[18px] overflow-hidden rounded-[12px] border border-[#2A2A28] bg-[#1B1B1A]">
      {title && (<div className="flex h-[38px] items-center border-b border-[#2A2A28] px-[14px]">
          <span className="font-[family-name:var(--font-mono)] text-[11.5px] tracking-[0.03em] text-[#9A9A96]">
            {title}
          </span>
        </div>)}
      <div className="relative">
        <button type="button" onClick={copy} className="absolute top-[10px] right-[10px] z-10 rounded-[6px] border border-[#3A3A38] bg-[#262624] px-[8px] py-[3px] font-[family-name:var(--font-mono)] text-[11px] text-[#C9C9C5] transition-colors hover:border-[#4A4A47] hover:text-white">
          {copied ? "Copied" : "Copy"}
        </button>
        <pre ref={ref} className="mdx-shiki m-0 overflow-x-auto">
          {children}
        </pre>
      </div>
    </div>);
}
