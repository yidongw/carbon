"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = McpPage;
var code_block_1 = require("@/components/api/code-block");
var config_inline_1 = require("@/components/api/config-inline");
var doc_1 = require("@/components/api/doc");
var faq_1 = require("@/components/api/faq");
var page_footer_1 = require("@/components/api/page-footer");
var highlight_1 = require("@/lib/highlight");
exports.metadata = {
    title: "MCP — Carbon",
    description: "Connect Carbon's MCP server from Claude Code, Claude Desktop, Cursor, and other AI clients."
};
var ENDPOINT = "https://app.carbon.ms/api/mcp";
var CLAUDE_CODE = "claude mcp add --transport http carbon \\\n  ".concat(ENDPOINT, " \\\n  --header \"Authorization: Bearer <api-key>\"");
var CURSOR = "{\n  \"mcpServers\": {\n    \"carbon\": {\n      \"url\": \"".concat(ENDPOINT, "\",\n      \"headers\": { \"Authorization\": \"Bearer <api-key>\" }\n    }\n  }\n}");
var PROMPTS = [
    "Show all open sales orders due to ship this week.",
    "Which purchase orders are past their promised receipt date?",
    "What's the on-hand quantity and reorder point for a part across locations?",
    "Draft a quote for a customer for 200 aluminum housings.",
    "List every job behind schedule and who's assigned."
];
var FAQ = [
    {
        q: "What can the assistant actually do?",
        a: "Read and write across every module the identity can reach — query orders and inventory, create jobs, draft quotes, update statuses. It acts as that user, so it can only touch what you've granted."
    },
    {
        q: "Do I need an API key?",
        a: "Not for connector clients — Claude.ai, Claude Desktop, and ChatGPT add the URL and authorize in your browser. Keys are for command and config clients (Claude Code, Cursor, VS Code, Codex) and any headless or CI use."
    },
    {
        q: "Does it respect my Carbon permissions?",
        a: "Yes — there's no way around them. A connector inherits the role and company of whoever authorized it; a key carries its own scopes. The assistant can never do what that identity can't."
    },
    {
        q: "Can I give it read-only access?",
        a: "Yes. Scope a key to only the modules and actions it needs — View with no Create, Update, or Delete makes it read-only. Use a separate key per client so you can re-scope or revoke one without touching the rest."
    },
    {
        q: "Where does my data go?",
        a: "Carbon doesn't send it anywhere new — your MCP client does, to whatever model provider it runs on, under that provider's terms. Scope keys tightly and prefer a read-only key when you only need to read."
    },
    {
        q: "Is MCP available on my plan?",
        a: "On Carbon Cloud, API and MCP access is a Business-plan feature — Starter keys are rejected with 403. Self-hosted instances aren't gated."
    },
    {
        q: "Is there a rate limit?",
        a: "Each key has its own limit and window, set in Settings → API Keys. Go over it and calls return 429 with X-RateLimit-* headers telling the client when to retry."
    },
    {
        q: "I'm getting 401 Unauthorized",
        a: "Key clients: the key is missing, malformed, expired, or deleted — recreate it in Settings → API Keys and update the Authorization header. Connector clients: re-authorize the connection from your client."
    },
    {
        q: "I'm getting 403 Forbidden",
        a: "The identity is authenticated but lacks the module permission for that action — or, on Cloud, the company is on the Starter plan. Grant the scope, or switch to a key that has it."
    },
    {
        q: "How do I manage or revoke a key?",
        a: "Each key in Settings → API Keys shows its scopes, rate limit, expiry, and who created it. Delete a key to revoke it instantly; nothing else breaks if you key each client separately."
    }
];
function McpPage() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, code, cursor;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        (0, highlight_1.highlight)(CLAUDE_CODE, "curl"),
                        (0, highlight_1.highlight)(CURSOR, "json")
                    ])];
                case 1:
                    _a = _b.sent(), code = _a[0], cursor = _a[1];
                    return [2 /*return*/, (<doc_1.DocPage>
      <doc_1.DocEyebrow>MCP</doc_1.DocEyebrow>
      <doc_1.DocTitle>Model Context Protocol</doc_1.DocTitle>
      <doc_1.Lead>
        Carbon runs an MCP server, so AI clients — Claude Code, Claude Desktop,
        Cursor, ChatGPT — can read and write your manufacturing data in plain
        language.
      </doc_1.Lead>
      <doc_1.P>
        The server lives at <config_inline_1.McpEndpoint />. Connect it one of two ways,
        depending on your client.
      </doc_1.P>

      <doc_1.H2 id="connect">Connect</doc_1.H2>
      <doc_1.P>
        <strong>Connector clients</strong> — Claude.ai, Claude Desktop, ChatGPT
        — add the URL and authorize in your browser. No key needed.
      </doc_1.P>
      <doc_1.P>
        <strong>Command &amp; key clients</strong> — Claude Code, Cursor, VS
        Code, Codex — paste a snippet carrying a scoped API key.
      </doc_1.P>
      <code_block_1.CodeBlock html={code} code={CLAUDE_CODE} label="Terminal · Claude Code"/>
      <code_block_1.CodeBlock html={cursor} code={CURSOR} label=".cursor/mcp.json"/>

      <doc_1.H2 id="ask">What you can ask</doc_1.H2>
      <doc_1.P>Once connected, ask in natural language:</doc_1.P>
      <ul className="m-0 mt-[12px] flex list-none flex-col gap-[8px] p-0">
        {PROMPTS.map(function (p) { return (<li key={p} className="flex gap-[10px] text-[15px] leading-[160%] text-[rgba(38,35,35,0.82)]">
            <span className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-[rgba(38,35,35,0.4)]"/>
            <span>{p}</span>
          </li>); })}
      </ul>
      <doc_1.P>
        Next: <doc_1.DocLink href="/mcp/authentication">Authentication</doc_1.DocLink> for
        the auth flows, and <doc_1.DocLink href="/mcp/tools">Tools</doc_1.DocLink> for how
        the assistant finds what it needs.
      </doc_1.P>

      <doc_1.H2 id="faq">FAQ</doc_1.H2>
      <faq_1.Faq items={FAQ}/>

      <page_footer_1.ContentFooter next={{ label: "Authentication", url: "/mcp/authentication" }}/>
    </doc_1.DocPage>)];
            }
        });
    });
}
