"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lede = Lede;
var react_1 = require("@carbon/react");
var CopyButton_1 = require("./CopyButton");
var mcp_content_1 = require("./mcp-content");
var quickstart_nav_1 = require("./quickstart-nav");
function Lede(_a) {
    var total = _a.total;
    return (<div className="pb-[10px] mb-12">
      <h1 className="font-medium tracking-[-0.045em] text-[clamp(2.7rem,5.2vw,4.1rem)] leading-[0.98] m-0 mb-4 [text-wrap:balance]">
        Carbon MCP server
      </h1>
      <p className="text-muted-foreground max-w-[58ch] m-0 mb-[18px] text-[1.0625rem] [text-wrap:pretty]">
        Connect Claude, ChatGPT, Cursor, or any MCP client to Carbon. It gets{" "}
        <span className="font-medium text-foreground">
          {total.toLocaleString()} tools
        </span>{" "}
        across 15 modules — sales orders, production jobs, inventory,
        purchasing, quality — and you drive them in plain language.
      </p>
      <div className="inline-flex items-center gap-[11px] bg-card border border-border rounded-[11px] py-[7px] pr-[7px] pl-[13px] mb-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_18px_-10px_rgba(0,0,0,0.12)]">
        <span className="font-[var(--mono)] text-[0.65rem] font-bold text-[var(--acc)] border border-[var(--acc)] py-[3px] px-[7px] rounded-[5px]">
          POST
        </span>
        <span className="font-[var(--mono)] text-[0.875rem] font-variant-numeric-tabular">
          {mcp_content_1.ENDPOINT}
        </span>
        <CopyButton_1.CopyButton className="bg-muted border border-border rounded-[6px] w-7 h-7 inline-flex items-center justify-center p-0 cursor-pointer transition-[transform,background] duration-[150ms] [transition-timing-function:cubic-bezier(0.2,0,0,1)] hover:bg-card active:scale-[0.96]" text={mcp_content_1.ENDPOINT} label="Copy endpoint"/>
      </div>
      <div className="flex gap-[10px] flex-wrap">
        <react_1.Button variant="primary" size="lg" onClick={function () { return (0, quickstart_nav_1.goToQuickstart)(); }}>
          Get started
        </react_1.Button>
        <react_1.Button variant="secondary" size="lg" onClick={function () { return (0, quickstart_nav_1.goToQuickstart)("Claude Code"); }}>
          Connect to Claude
        </react_1.Button>
      </div>
    </div>);
}
