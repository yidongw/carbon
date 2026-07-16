"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupPipeline = SetupPipeline;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var CopyButton_1 = require("./CopyButton");
var mcp_content_1 = require("./mcp-content");
var quickstart_nav_1 = require("./quickstart-nav");
var Screenshot_1 = require("./Screenshot");
var FLOW_META = {
    connector: { Icon: lu_1.LuPlug, label: "OAuth · no key" },
    command: { Icon: lu_1.LuTerminal, label: "API key" }
};
// Builds the three-step walkthrough for the selected client. Steps 1 and 3 are
// shared within a flow; step 2 carries the client-specific command/config.
function stepsFor(c) {
    var verify = {
        num: "03",
        crumb: c.name,
        title: "Verify",
        caption: "Ask it to search Carbon. If it lists tools, you’re connected to your ERP.",
        alt: "".concat(c.name, " \u2014 \u201CSearch Carbon for sales-order tools\u201D returning a list of tools"),
        img: "/mcp/verify-".concat(c.slug, ".png")
    };
    if (c.flow === "connector") {
        return [
            {
                num: "01",
                crumb: c.where,
                title: "Add a custom connector",
                caption: "Open ".concat(c.where, ", choose Add custom connector, then paste the endpoint."),
                code: mcp_content_1.ENDPOINT,
                alt: "".concat(c.name, " \u2014 the \u201CAdd custom connector\u201D dialog with the Carbon MCP URL"),
                img: "/mcp/add-".concat(c.slug, ".png")
            },
            {
                num: "02",
                crumb: "app.carbon.ms/oauth/authorize",
                title: "Authorize",
                caption: "Sign in, choose your company, and click Authorize. The connection inherits your Carbon permissions — no key to paste.",
                alt: "Carbon — the “Authorize Application” screen: choose your company, then Authorize",
                img: "/mcp/authorize-connector.png"
            },
            verify
        ];
    }
    return [
        {
            num: "01",
            crumb: "Carbon · Settings → API Keys",
            title: "Create an API key",
            caption: "Settings → API Keys → New. The modal hands you a ready-to-paste snippet — you only see the key once.",
            alt: "Carbon — Settings → API Keys → the new-key modal with the snippet",
            img: "/mcp/api-key.png"
        },
        {
            num: "02",
            crumb: c.target,
            title: c.action,
            caption: "Paste it in, swapping in the key the modal gave you:",
            code: c.code,
            alt: "".concat(c.name, " \u2014 the Carbon MCP server configured with your key"),
            img: "/mcp/add-".concat(c.slug, ".png")
        },
        verify
    ];
}
function SetupPipeline() {
    var _a;
    var _b = (0, react_2.useState)("Claude Code"), name = _b[0], setName = _b[1];
    var client = (_a = mcp_content_1.CLIENTS.find(function (c) { return c.name === name; })) !== null && _a !== void 0 ? _a : mcp_content_1.CLIENTS[0];
    var steps = stepsFor(client);
    // The hero "Connect to Claude" CTA preselects a client via this event.
    (0, react_2.useEffect)(function () {
        var onSelect = function (e) {
            var wanted = e.detail;
            if (mcp_content_1.CLIENTS.some(function (c) { return c.name === wanted; }))
                setName(wanted);
        };
        window.addEventListener(quickstart_nav_1.SELECT_CLIENT_EVENT, onSelect);
        return function () { return window.removeEventListener(quickstart_nav_1.SELECT_CLIENT_EVENT, onSelect); };
    }, []);
    return (<div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px] mb-[24px]">
        {mcp_content_1.CLIENTS.map(function (c) {
            var _a = FLOW_META[c.flow], Icon = _a.Icon, label = _a.label;
            var isActive = c.name === client.name;
            return (<button key={c.name} type="button" onClick={function () { return setName(c.name); }} aria-pressed={isActive} className={(0, react_1.cn)("flex flex-col items-start gap-[6px] text-left p-[13px] rounded-xl border cursor-pointer transition-[border-color,background,transform] duration-150 active:scale-[0.97]", isActive
                    ? "border-[var(--acc)] bg-[var(--acc-tint)] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                    : "border-border bg-card hover:border-muted-foreground")}>
              <Icon size={17} className={(0, react_1.cn)(isActive ? "text-[var(--acc)]" : "text-muted-foreground")}/>
              <span className="font-semibold text-[0.85rem] text-foreground">
                {c.name}
              </span>
              <span className="font-[var(--mono)] text-[0.6rem] tracking-[0.04em] uppercase text-muted-foreground">
                {label}
              </span>
            </button>);
        })}
      </div>

      <div className="stagger" key={client.flow}>
        {steps.map(function (s, i) { return (<div key={s.num}>
            <div className="bg-card border border-border rounded-xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_26px_-20px_rgba(0,0,0,0.18)]">
              <div className="flex items-center gap-[10px] mb-[10px]">
                <span className="font-[var(--mono)] text-[0.72rem] text-[var(--acc)] font-medium">
                  {s.num}
                </span>
                <span className="font-[var(--mono)] text-[0.64rem] tracking-[0.04em] text-muted-foreground bg-muted border border-border rounded-md px-[7px] py-[2px]">
                  {s.crumb}
                </span>
              </div>
              <div className="font-semibold text-[0.98rem] tracking-[-0.01em] mb-[3px]">
                {s.title}
              </div>
              <p className="text-muted-foreground text-[0.85rem] mb-[13px] max-w-[60ch] [text-wrap:pretty]">
                {s.caption}
              </p>
              {s.code && (<div className="relative mb-[13px]">
                  <CopyButton_1.CopyButton text={s.code} className="absolute top-[8px] right-[8px] w-[28px] h-[28px] inline-flex items-center justify-center bg-zinc-800 text-zinc-500 hover:text-zinc-100 rounded-md cursor-pointer transition-[transform,color] active:scale-[0.96] [&.done]:bg-[var(--acc)] [&.done]:text-white"/>
                  <pre className="m-0 overflow-auto rounded-[9px] bg-zinc-900 border border-zinc-800 text-zinc-200 font-[var(--mono)] text-[0.76rem] leading-[1.6] px-[13px] py-[11px] pr-[42px] whitespace-pre">
                    {s.code}
                  </pre>
                </div>)}
              <Screenshot_1.Screenshot src={s.img} alt={s.alt}/>
            </div>
            {i < steps.length - 1 && (<div className="flex flex-col items-center py-[7px]" aria-hidden="true">
                <span className="w-px h-[12px] bg-border"/>
                <lu_1.LuArrowDown size={16} className="text-[var(--acc)]"/>
              </div>)}
          </div>); })}
      </div>
    </div>);
}
