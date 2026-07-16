"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = McpAuthenticationPage;
var config_inline_1 = require("@/components/api/config-inline");
var doc_1 = require("@/components/api/doc");
var page_footer_1 = require("@/components/api/page-footer");
exports.metadata = {
    title: "MCP Authentication — Carbon",
    description: "How MCP clients authenticate — connector OAuth or a scoped API key."
};
function McpAuthenticationPage() {
    return (<doc_1.DocPage>
      <doc_1.DocEyebrow>MCP</doc_1.DocEyebrow>
      <doc_1.DocTitle>Authentication</doc_1.DocTitle>
      <doc_1.Lead>
        An MCP client inherits exactly the identity it authenticates as — and
        can only do what that identity can. There are two flows, by client type.
      </doc_1.Lead>

      <doc_1.H2 id="connector">Connector (OAuth)</doc_1.H2>
      <doc_1.P>
        Claude.ai, Claude Desktop, and ChatGPT authorize over OAuth — add the
        server URL and approve the connection in your browser. There's no key to
        manage. The connection inherits the <strong>role and company</strong> of
        whoever authorized it.
      </doc_1.P>

      <doc_1.H2 id="api-key">API key</doc_1.H2>
      <doc_1.P>
        Claude Code, Cursor, VS Code, Codex, and any headless or CI client send
        a scoped key as a bearer token: <config_inline_1.AuthHeader />. Create one in{" "}
        <config_inline_1.ApiKeysLink>Settings → API Keys</config_inline_1.ApiKeysLink>; the key carries its own
        scopes. stdio-only clients bridge through <doc_1.Code>mcp-remote</doc_1.Code>.
      </doc_1.P>

      <doc_1.H2 id="permissions">Permissions</doc_1.H2>
      <doc_1.P>
        Either way, the assistant can only do what that identity can — a
        connector inherits your role and company, a key carries the scopes you
        granted it. Use a separate key per client, so revoking one doesn't break
        the rest.
      </doc_1.P>

      <doc_1.H2 id="errors">Errors</doc_1.H2>
      <doc_1.Table>
        <doc_1.Row head cols="72px 1fr" cells={["Status", "When it happens"]}/>
        <doc_1.Row cols="72px 1fr" cells={[
            <doc_1.Code key="a">401</doc_1.Code>,
            "Connector: re-authorize from your client. Key: it's missing, malformed, expired, or deleted — recreate it and update the Authorization header."
        ]}/>
        <doc_1.Row cols="72px 1fr" cells={[
            <doc_1.Code key="b">403</doc_1.Code>,
            "The identity lacks the required module permission (or the company is on the Starter plan)."
        ]}/>
      </doc_1.Table>

      <page_footer_1.ContentFooter prev={{ label: "Introduction", url: "/mcp" }}/>
    </doc_1.DocPage>);
}
