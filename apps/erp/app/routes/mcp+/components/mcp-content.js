"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIENTS = exports.TOC = exports.FAQ = exports.SPECIFICITY = exports.PROMPTS = exports.ENDPOINT = void 0;
exports.ENDPOINT = "https://app.carbon.ms/api/mcp";
exports.PROMPTS = [
    "Show all open sales orders due to ship this week.",
    "Create a job for 50 units of SKU-1042 on the CNC work center.",
    "Which purchase orders are past their promised receipt date?",
    "What's the on-hand quantity and reorder point for BRACKET-200 across locations?",
    "Draft a quote for Acme for 200 aluminum housings.",
    "List every job behind schedule and who's assigned."
];
exports.SPECIFICITY = {
    broad: "“Sort out my late orders.”",
    specific: "“Release every sales order stuck in Needs Approval for 3+ days.”"
};
exports.FAQ = [
    {
        q: "What can the assistant actually do?",
        a: "Read and write across every module the identity can reach — query orders and inventory, create jobs, draft quotes, update statuses. It acts as that user, so it can only touch what you've granted."
    },
    {
        q: "Do I need an API key?",
        a: "Not for connector clients — Claude.ai, Claude Desktop, and ChatGPT add the URL and authorize in your browser. Keys are for command and config clients (Claude Code, Cursor, VS Code, Codex) and any headless or CI use."
    },
    {
        q: "Which clients are supported?",
        a: "Any MCP client that speaks HTTP. Connector clients authorize over OAuth; command clients send the key as a bearer header; stdio-only clients bridge through mcp-remote."
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
exports.TOC = [
    { id: "whatis", label: "What is MCP?" },
    { id: "ask", label: "What you can ask" },
    { id: "quickstart", label: "Quickstart" },
    { id: "discovery", label: "Tool discovery" },
    { id: "tools", label: "Tools" },
    { id: "auth", label: "Authentication" },
    { id: "safety", label: "Safety" },
    { id: "faq", label: "FAQ" }
];
// The major clients only — everything else follows one of these two patterns
// (see the Authentication section / the note below the pipeline).
exports.CLIENTS = [
    {
        name: "Claude Code",
        slug: "claude-code",
        flow: "command",
        target: "Terminal · Claude Code",
        action: "Run the command",
        code: "claude mcp add --transport http \\\n  carbon ".concat(exports.ENDPOINT, " \\\n  --header \"Authorization: Bearer crbn_\u2026\"")
    },
    {
        name: "Claude Desktop & Web",
        slug: "claude-ai",
        flow: "connector",
        where: "Settings → Connectors"
    },
    {
        name: "Cursor",
        slug: "cursor",
        flow: "command",
        target: ".cursor/mcp.json",
        action: "Add to your config",
        code: "{\n  \"mcpServers\": {\n    \"carbon\": {\n      \"url\": \"".concat(exports.ENDPOINT, "\",\n      \"headers\": { \"Authorization\": \"Bearer crbn_\u2026\" }\n    }\n  }\n}")
    }
];
