"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpNav = McpNav;
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var react_1 = require("react");
var CLASS_DOT = {
    READ: "bg-[#3F9142]",
    WRITE: "bg-[#1E84B0]",
    DESTRUCTIVE: "bg-[#B3261E]",
};
var MCP_LINKS = [
    { label: "Introduction", href: "/mcp" },
    { label: "Authentication", href: "/mcp/authentication" },
    { label: "Tools", href: "/mcp/tools" },
];
var GS_ACTIVE = "bg-[rgba(0,176,255,0.10)] font-[530] text-[#1E84B0]";
var GS_IDLE = "text-[rgba(38,35,35,0.8)] hover:bg-[rgba(231,231,227,0.55)] hover:text-[#262323]";
var SECTION_LABEL = "m-0 mb-[3px] px-[8px] py-[6px] font-[family-name:var(--font-mono)] text-[12.5px] font-[600] uppercase tracking-[0.06em] text-[rgba(38,35,35,0.6)]";
var GS_LINK = "block rounded-[6px] px-[8px] py-[3.5px] text-[14.5px] leading-[135%] transition-colors";
function Chevron(_a) {
    var open = _a.open;
    return (<svg width="11" height="11" viewBox="0 0 12 12" fill="none" className={"shrink-0 transition-transform duration-200 ".concat(open ? "rotate-90" : "")} aria-hidden="true">
      <path d="M4.5 3L7.5 6L4.5 9" stroke="rgba(38,35,35,0.48)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>);
}
/** Tools are grouped under their module, so drop the redundant `<module>_` prefix from the label. */
function toolLabel(name, moduleSlug) {
    return name.startsWith("".concat(moduleSlug, "_")) ? name.slice(moduleSlug.length + 1) : name;
}
function ClassDot(_a) {
    var c = _a.c;
    return (<span className={"h-[6px] w-[6px] shrink-0 rounded-full ".concat(CLASS_DOT[c] || "bg-[rgba(38,35,35,0.4)]")} aria-label={c}/>);
}
function McpNav(_a) {
    var tools = _a.tools;
    var pathname = (0, navigation_1.usePathname)();
    var parts = pathname.split("/");
    var activeTool = parts[1] === "mcp" && parts[2] === "tools" ? parts[3] : undefined;
    var activeToolModule = (0, react_1.useMemo)(function () {
        var _a;
        if (!activeTool)
            return undefined;
        return (_a = tools.find(function (m) { return m.tools.some(function (t) { return t.slug === activeTool; }); })) === null || _a === void 0 ? void 0 : _a.slug;
    }, [tools, activeTool]);
    var _b = (0, react_1.useState)(function () { return new Set(activeToolModule ? [activeToolModule] : []); }), open = _b[0], setOpen = _b[1];
    var activeRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        if (activeToolModule)
            setOpen(function (p) { return (p.has(activeToolModule) ? p : new Set(p).add(activeToolModule)); });
    }, [activeToolModule]);
    (0, react_1.useEffect)(function () {
        var _a;
        (_a = activeRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ block: "center" });
    }, []);
    return (<div>
      <nav className="flex flex-col gap-[2px]">
        <div className="mb-[10px]">
          <p className={SECTION_LABEL}>Getting Started</p>
          {MCP_LINKS.map(function (item) { return (<link_1.default key={item.href} href={item.href} className={"".concat(GS_LINK, " ").concat(pathname === item.href ? GS_ACTIVE : GS_IDLE)}>
              {item.label}
            </link_1.default>); })}
        </div>

        <p className={SECTION_LABEL}>Tools</p>
        {tools.map(function (m) {
            var isOpen = open.has(m.slug);
            return (<div key={m.slug}>
              <button type="button" onClick={function () {
                    return setOpen(function (prev) {
                        var next = new Set(prev);
                        if (next.has(m.slug))
                            next.delete(m.slug);
                        else
                            next.add(m.slug);
                        return next;
                    });
                }} className="flex w-full items-center justify-between gap-[8px] rounded-[7px] px-[8px] py-[5px] transition-colors hover:bg-[rgba(231,231,227,0.5)]">
                <span className="flex items-center gap-[7px]">
                  <Chevron open={isOpen}/>
                  <span className="font-[family-name:var(--font-mono)] text-[12.5px] font-[600] uppercase tracking-[0.06em] text-[rgba(38,35,35,0.6)]">
                    {m.name}
                  </span>
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[12px] tabular-nums text-[rgba(38,35,35,0.42)]">
                  {m.tools.length}
                </span>
              </button>

              {isOpen && (<ul className="mt-[2px] mb-[6px] ml-[13px] list-none border-l border-[#ECECE7] py-[2px] pl-[8px]">
                  {m.tools.map(function (t) {
                        var isActive = activeTool === t.slug;
                        return (<li key={t.slug}>
                        <link_1.default ref={isActive ? activeRef : undefined} href={"/mcp/tools/".concat(t.slug)} title={"".concat(t.name, " \u00B7 ").concat(t.classification)} className={"flex items-center gap-[8px] rounded-[6px] px-[8px] py-[3.5px] leading-[135%] transition-colors ".concat(isActive ? GS_ACTIVE : GS_IDLE)}>
                          <ClassDot c={t.classification}/>
                          <span className="truncate font-[family-name:var(--font-mono)] text-[13px]">
                            {toolLabel(t.name, m.slug)}
                          </span>
                        </link_1.default>
                      </li>);
                    })}
                </ul>)}
            </div>);
        })}
      </nav>
    </div>);
}
