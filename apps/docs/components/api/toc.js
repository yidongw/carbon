"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableOfContents = TableOfContents;
var navigation_1 = require("next/navigation");
var react_1 = require("react");
/** "On this page" rail. Scans the rendered <main> for headings and scroll-spies the active one. */
function TableOfContents() {
    var pathname = (0, navigation_1.usePathname)();
    var _a = (0, react_1.useState)([]), headings = _a[0], setHeadings = _a[1];
    var _b = (0, react_1.useState)(""), active = _b[0], setActive = _b[1];
    (0, react_1.useEffect)(function () {
        var _a, _b;
        var nodes = Array.from(document.querySelectorAll("main h2[id], main h3[id]"));
        setHeadings(nodes.map(function (n) { var _a; return ({ id: n.id, text: (_a = n.textContent) !== null && _a !== void 0 ? _a : "", level: n.tagName === "H3" ? 3 : 2 }); }));
        setActive((_b = (_a = nodes[0]) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "");
        if (nodes.length === 0)
            return;
        var observer = new IntersectionObserver(function (entries) {
            var visible = entries.filter(function (e) { return e.isIntersecting; });
            if (visible.length === 0)
                return;
            var top = visible.reduce(function (a, b) {
                return a.boundingClientRect.top < b.boundingClientRect.top ? a : b;
            });
            setActive(top.target.id);
        }, { rootMargin: "-88px 0px -68% 0px", threshold: 0 });
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var n = nodes_1[_i];
            observer.observe(n);
        }
        return function () { return observer.disconnect(); };
    }, [pathname]);
    if (headings.length === 0)
        return null;
    return (<nav className="sticky top-[88px] max-h-[calc(100dvh-120px)] overflow-y-auto scrollbar-hidden-until-scroll">
      <p className="m-0 mb-[10px] font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.08em] text-[rgba(38,35,35,0.5)]">
        On this page
      </p>
      <ul className="m-0 list-none border-l border-[#E7E7E3] p-0">
        {headings.map(function (h) { return (<li key={h.id}>
            <a href={"#".concat(h.id)} className={"-ml-px block border-l py-[5px] text-[13.5px] leading-[140%] transition-colors ".concat(h.level === 3 ? "pl-[24px]" : "pl-[14px]", " ").concat(active === h.id
                ? "border-[#1E84B0] text-[#1E84B0]"
                : "border-transparent text-[rgba(38,35,35,0.68)] hover:text-[#262323]")}>
              {h.text}
            </a>
          </li>); })}
      </ul>
    </nav>);
}
