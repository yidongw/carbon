"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatIsMcp = WhatIsMcp;
var SpecRow_1 = require("./SpecRow");
function WhatIsMcp() {
    return (<>
      <p className="text-muted-foreground max-w-[64ch] mb-6 text-[0.95rem] text-pretty">
        MCP is an open standard from Anthropic. It gives AI assistants one
        consistent way to reach outside systems, so any MCP client can work with
        Carbon without custom integration code.
      </p>
      <SpecRow_1.SpecList>
        <SpecRow_1.SpecRow label="Hosts">
          The assistants you already use — Claude (web, Desktop, Code), Cursor,
          VS Code, Codex.
        </SpecRow_1.SpecRow>
        <SpecRow_1.SpecRow label="Clients">
          The MCP transport inside the host. Carbon speaks Streamable HTTP.
        </SpecRow_1.SpecRow>
        <SpecRow_1.SpecRow label="Server">
          Carbon's remote MCP server — backed by your ERP, secured by a scoped
          API key.
        </SpecRow_1.SpecRow>
      </SpecRow_1.SpecList>
      <p className="text-muted-foreground text-[0.9rem] mt-3 max-w-[64ch] text-pretty">
        Carbon runs a remote server, so there's nothing to install. Every client
        points at the same{" "}
        <span className="font-[var(--mono)] tabular-nums">/api/mcp</span>{" "}
        endpoint, and new tools become available without any update on your
        side.
      </p>
    </>);
}
