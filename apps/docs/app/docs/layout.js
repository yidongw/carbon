"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReferenceLayout;
var docs_nav_1 = require("@/components/api/docs-nav");
var toc_1 = require("@/components/api/toc");
var main_header_1 = require("@/components/main-header");
var nav_scroll_chevron_1 = require("@/components/nav-scroll-chevron");
var scroll_hints_1 = require("@/components/scroll-hints");
var source_1 = require("@/lib/source");
require("../reference.css");
var label = function (name) {
    return typeof name === "string" ? name : String(name !== null && name !== void 0 ? name : "");
};
var byLabel = function (a, b) {
    return a.label.localeCompare(b.label);
};
/** Convert the Fumadocs page tree into our serializable nav shape, with the pages in
 *  each group sorted alphabetically. */
function toNav(nodes) {
    return nodes.flatMap(function (n) {
        var _a, _b;
        if (n.type === "separator")
            return [];
        if (n.type === "folder") {
            return [
                {
                    label: label(n.name),
                    url: (_a = n.index) === null || _a === void 0 ? void 0 : _a.url,
                    children: toNav((_b = n.children) !== null && _b !== void 0 ? _b : []).sort(byLabel)
                }
            ];
        }
        return [{ label: label(n.name), url: n.url }];
    });
}
function ReferenceLayout(_a) {
    var _b;
    var children = _a.children;
    var tree = toNav((_b = source_1.source.getPageTree().children) !== null && _b !== void 0 ? _b : []);
    return (<div className="min-h-screen w-full bg-[#FBFBF9]">
      <main_header_1.MainHeader active="reference"/>

      <div className="mx-auto flex w-full max-w-[1480px] pt-[64px]">
        <aside className="nav-scroll-fade sticky top-[64px] hidden h-[calc(100dvh-64px)] w-[280px] shrink-0 overflow-y-auto border-r border-[#E7E7E3] px-[20px] py-[28px] scrollbar-hidden-until-scroll lg:block">
          <docs_nav_1.DocsNav tree={tree}/>
          <nav_scroll_chevron_1.NavScrollChevron />
        </aside>
        <main className="min-w-0 flex-1 px-[24px] pb-[140px] pt-[40px] lg:px-[56px]">
          {children}
        </main>
        <aside className="hidden w-[232px] shrink-0 px-[28px] pt-[40px] xl:block">
          <toc_1.TableOfContents />
        </aside>
      </div>

      <scroll_hints_1.ScrollHints />
    </div>);
}
