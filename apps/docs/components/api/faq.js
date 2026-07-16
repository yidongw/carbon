"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Faq = Faq;
var react_1 = require("react");
function FaqItem(_a) {
    var q = _a.q, a = _a.a;
    var _b = (0, react_1.useState)(false), open = _b[0], setOpen = _b[1];
    return (<div className="rounded-[10px] border border-[#E7E7E3] bg-white transition-colors hover:border-[#D6D6D0]">
      <button type="button" aria-expanded={open} onClick={function () { return setOpen(function (o) { return !o; }); }} className="flex w-full items-center justify-between gap-[12px] px-[16px] py-[13px] text-left">
        <span className="text-[14.5px] font-[560] text-[#262323]">{q}</span>
        <span className={"shrink-0 text-[19px] leading-none text-[#1E84B0] transition-transform duration-200 ".concat(open ? "rotate-45" : "")} aria-hidden="true">
          +
        </span>
      </button>
      <div className={"grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out ".concat(open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="min-h-0 overflow-hidden">
          <p className="m-0 px-[16px] pb-[14px] text-[14px] leading-[165%] text-[rgba(38,35,35,0.7)]">{a}</p>
        </div>
      </div>
    </div>);
}
function Faq(_a) {
    var items = _a.items;
    return (<div className="mt-[16px] flex flex-col gap-[8px]">
      {items.map(function (it) { return (<FaqItem key={it.q} q={it.q} a={it.a}/>); })}
    </div>);
}
