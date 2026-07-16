"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolBrowser = ToolBrowser;
var macro_1 = require("@lingui/react/macro");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var tools_filter_1 = require("../tools-filter");
var FilterSelect_1 = require("./FilterSelect");
var ModuleCards_1 = require("./ModuleCards");
var Tag_1 = require("./Tag");
var PAGE = 30;
function ToolBrowser(_a) {
    var tools = _a.tools, modules = _a.modules;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_1.useState)(""), q = _b[0], setQ = _b[1];
    var _c = (0, react_1.useState)(""), module = _c[0], setModule = _c[1];
    var _d = (0, react_1.useState)(""), classification = _d[0], setClassification = _d[1];
    var _e = (0, react_1.useState)(PAGE), limit = _e[0], setLimit = _e[1];
    var filtered = (0, react_1.useMemo)(function () { return (0, tools_filter_1.filterTools)(tools, { q: q, module: module, classification: classification }); }, [tools, q, module, classification]);
    var shown = filtered.slice(0, limit);
    var remaining = filtered.length - shown.length;
    return (<div>
      <ModuleCards_1.ModuleCards modules={modules} total={tools.length} value={module} onChange={function (v) {
            setModule(v);
            setLimit(PAGE);
        }}/>
      <div className="border border-border rounded-[11px] overflow-hidden bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_26px_-18px_rgba(0,0,0,0.14)]">
        <div className="flex gap-2 items-center p-[11px] border-b border-border">
          <input className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground text-[0.85rem] font-[inherit] outline-none focus:border-[var(--acc)]" placeholder={"Search ".concat(tools.length.toLocaleString(), " tools\u2026")} value={q} onChange={function (e) {
            setQ(e.target.value);
            setLimit(PAGE);
        }}/>
          <FilterSelect_1.FilterSelect value={classification} placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["All types"], ["All types"])))} options={[
            { value: "READ", label: "READ" },
            { value: "WRITE", label: "WRITE" },
            { value: "DESTRUCTIVE", label: "DESTRUCTIVE" }
        ]} onChange={function (v) {
            setClassification(v);
            setLimit(PAGE);
        }}/>
        </div>
        {shown.map(function (t) { return (<div className="flex items-center gap-[11px] p-[11px] border-b border-border last:border-b-0 hover:bg-muted" key={t.name}>
            <Tag_1.Tag kind={t.classification}/>
            <span className="font-[var(--mono)] font-medium text-[0.78rem]">
              {t.name}
            </span>
            <span className="text-muted-foreground flex-1 text-[0.8rem]">
              {t.description}
            </span>
            <span className="text-muted-foreground text-[0.72rem] whitespace-nowrap">
              {t.paramCount} params
            </span>
          </div>); })}
        {remaining > 0 ? (<button type="button" onClick={function () { return setLimit(function (l) { return l + PAGE; }); }} className="w-full flex items-center justify-center gap-[8px] px-[11px] py-[12px] text-[0.8rem] font-semibold text-foreground bg-muted border-t border-border cursor-pointer transition-colors hover:text-[var(--acc)]">
            <lu_1.LuChevronDown size={15}/>
            Load {Math.min(PAGE, remaining).toLocaleString()} more
            <span className="font-[var(--mono)] text-[0.7rem] font-normal text-muted-foreground tabular-nums">
              {shown.length.toLocaleString()} /{" "}
              {filtered.length.toLocaleString()}
            </span>
          </button>) : (<div className="px-[11px] py-[10px] text-[0.75rem] text-muted-foreground bg-muted border-t border-border font-[var(--mono)] tabular-nums">
            {filtered.length === 0
                ? "No tools match your filters."
                : "All ".concat(filtered.length.toLocaleString(), " tools shown")}
          </div>)}
      </div>
    </div>);
}
var templateObject_1;
