"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainHeader = MainHeader;
var link_1 = require("next/link");
var search_command_1 = require("./search/search-command");
var NAV = [
    { key: "guides", label: "Guides", href: "/guides/order" },
    { key: "reference", label: "Reference", href: "/docs" },
    { key: "api", label: "API", href: "/api-reference" },
    { key: "mcp", label: "MCP", href: "/mcp" },
];
/** The single site-wide header: Carbon · Guide · Reference · API · Open Carbon. */
function MainHeader(_a) {
    var active = _a.active;
    return (<header className="fixed inset-x-0 top-0 z-[60] flex h-[64px] items-center justify-between px-[24px] md:px-[32px]" style={{ background: "#F5F5F2", borderBottom: "1px solid #E8E7E6", boxShadow: "0 1px 0 0 #fff" }}>
      <div className="flex items-center gap-[26px]">
        <link_1.default href="/" className="flex shrink-0 items-center no-underline" aria-label="Carbon home">
          <img src="/carbon-word-light.svg" alt="Carbon" width={99} height={24} className="block"/>
        </link_1.default>
        <nav className="hidden items-center gap-[2px] md:flex">
          {NAV.map(function (item) { return (<link_1.default key={item.key} href={item.href} aria-current={active === item.key ? "page" : undefined} className={"nav-link rounded-[7px] px-[10px] py-[6px] text-[15px] leading-[150%] tracking-[0.15px] no-underline transition-colors ".concat(active === item.key
                ? "text-ink-ui font-[530]"
                : "text-ink-faint font-[460] hover:text-ink-ui hover:bg-[rgba(231,231,227,0.55)]")}>
              {item.label}
            </link_1.default>); })}
        </nav>
      </div>

      <div className="flex items-center gap-[10px]">
        <search_command_1.SearchCommand />
        <a className="group relative inline-flex h-[40px] items-center justify-center rounded-[8px] px-[16px] no-underline" href="https://app.carbon.ms">
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[8px] cta-btn-dark"/>
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[8px] btn-dark-hover opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"/>
          <span className="text-on-dark relative z-10 text-[14px] font-[460] tracking-[0.15px]">Open Carbon</span>
        </a>
      </div>
    </header>);
}
