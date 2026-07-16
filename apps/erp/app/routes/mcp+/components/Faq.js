"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Faq = Faq;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var mcp_content_1 = require("./mcp-content");
function FaqItem(_a) {
    var q = _a.q, a = _a.a;
    var _b = (0, react_2.useState)(false), open = _b[0], setOpen = _b[1];
    return (<div className="bg-card border border-border rounded-[10px] px-[15px] py-[13px] mb-[8px] cursor-pointer transition-[border-color] duration-200 hover:border-[var(--acc)]">
      <button type="button" className="w-full bg-transparent border-none cursor-pointer font-[inherit] text-foreground text-left flex justify-between items-center font-semibold text-[0.9rem]" aria-expanded={open} onClick={function () { return setOpen(function (o) { return !o; }); }}>
        {q}{" "}
        <span className={(0, react_1.cn)("text-[var(--acc)] transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)]", open && "rotate-45")}>
          +
        </span>
      </button>
      <div className={(0, react_1.cn)("text-muted-foreground text-[0.84rem] overflow-hidden transition-[max-height,margin] duration-300 ease-in-out", open ? "max-h-[260px] mt-[9px]" : "max-h-0")}>
        {a}
      </div>
    </div>);
}
function Faq() {
    return (<div className="flex flex-col">
      {mcp_content_1.FAQ.map(function (f) { return (<FaqItem key={f.q} q={f.q} a={f.a}/>); })}
    </div>);
}
