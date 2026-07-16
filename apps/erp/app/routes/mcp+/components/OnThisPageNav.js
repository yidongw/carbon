"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnThisPageNav = OnThisPageNav;
var react_1 = require("@carbon/react");
var useScrollSpy_1 = require("../hooks/useScrollSpy");
var mcp_content_1 = require("./mcp-content");
var TOC_IDS = mcp_content_1.TOC.map(function (t) { return t.id; });
function OnThisPageNav() {
    var active = (0, useScrollSpy_1.useScrollSpy)(TOC_IDS);
    var go = function (e, id) {
        e.preventDefault();
        var el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            history.replaceState(null, "", "#".concat(id));
        }
    };
    return (<aside className="hidden min-[880px]:block sticky top-[84px] self-start text-[0.85rem]">
      <div className="font-[var(--mono)] text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground mb-[13px]">
        On this page
      </div>
      <div className="toc-track">
        {mcp_content_1.TOC.map(function (t, i) { return (<a key={t.id} href={"#".concat(t.id)} onClick={function (e) { return go(e, t.id); }} className={(0, react_1.cn)("block py-[6px] text-muted-foreground hover:text-foreground transition-colors duration-[150ms]", i === active && "active text-foreground font-semibold", i < active && "passed")}>
            {t.label}
          </a>); })}
      </div>
    </aside>);
}
