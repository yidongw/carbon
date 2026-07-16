"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocsNav = DocsNav;
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var react_1 = require("react");
var GS_ACTIVE = "bg-[rgba(0,176,255,0.10)] font-[530] text-[#1E84B0]";
var GS_IDLE = "text-[rgba(38,35,35,0.8)] hover:bg-[rgba(231,231,227,0.55)] hover:text-[#262323]";
var GS_LINK = "block rounded-[6px] px-[8px] py-[4px] text-[14.5px] leading-[135%] transition-colors";
var SECTION_LABEL = "font-[family-name:var(--font-mono)] text-[12.5px] font-[600] uppercase tracking-[0.06em] text-[rgba(38,35,35,0.6)]";
function Chevron(_a) {
    var open = _a.open;
    return (<svg width="11" height="11" viewBox="0 0 12 12" fill="none" className={"shrink-0 transition-transform duration-200 ".concat(open ? "rotate-90" : "")} aria-hidden="true">
      <path d="M4.5 3L7.5 6L4.5 9" stroke="rgba(38,35,35,0.48)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>);
}
function DocsNav(_a) {
    var tree = _a.tree;
    var pathname = (0, navigation_1.usePathname)();
    var _b = (0, react_1.useState)(function () { return new Set(); }), collapsed = _b[0], setCollapsed = _b[1];
    var isActive = function (url) { return !!url && pathname === url; };
    return (<nav className="flex flex-col gap-[2px]">
      {tree.map(function (node) {
            var _a, _b;
            if (!((_a = node.children) === null || _a === void 0 ? void 0 : _a.length)) {
                return (<link_1.default key={node.label} href={(_b = node.url) !== null && _b !== void 0 ? _b : "#"} className={"".concat(GS_LINK, " ").concat(isActive(node.url) ? GS_ACTIVE : GS_IDLE)}>
              {node.label}
            </link_1.default>);
            }
            var isOpen = !collapsed.has(node.label);
            return (<div key={node.label} className="mt-[8px] first:mt-[2px]">
            <button type="button" onClick={function () {
                    return setCollapsed(function (prev) {
                        var next = new Set(prev);
                        if (next.has(node.label))
                            next.delete(node.label);
                        else
                            next.add(node.label);
                        return next;
                    });
                }} className="flex w-full items-center gap-[7px] rounded-[7px] px-[8px] py-[5px] transition-colors hover:bg-[rgba(231,231,227,0.5)]">
              <Chevron open={isOpen}/>
              <span className={SECTION_LABEL}>{node.label}</span>
            </button>

            {isOpen && (<ul className="mt-[2px] mb-[2px] ml-[13px] list-none border-l border-[#ECECE7] py-[2px] pl-[8px]">
                {node.url && (<li>
                    <link_1.default href={node.url} className={"".concat(GS_LINK, " ").concat(isActive(node.url) ? GS_ACTIVE : GS_IDLE)}>
                      Overview
                    </link_1.default>
                  </li>)}
                {node.children.map(function (child) {
                        var _a;
                        return (<li key={child.label}>
                    <link_1.default href={(_a = child.url) !== null && _a !== void 0 ? _a : "#"} className={"".concat(GS_LINK, " ").concat(isActive(child.url) ? GS_ACTIVE : GS_IDLE)}>
                      {child.label}
                    </link_1.default>
                  </li>);
                    })}
              </ul>)}
          </div>);
        })}
    </nav>);
}
