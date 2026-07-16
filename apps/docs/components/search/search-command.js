"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchCommand = SearchCommand;
var Dialog = require("@radix-ui/react-dialog");
var client_1 = require("fumadocs-core/search/client");
var fetch_1 = require("fumadocs-core/search/client/fetch");
var navigation_1 = require("next/navigation");
var react_1 = require("react");
/* Site-wide ⌘K search. Headless fumadocs `useDocsSearch` over the single /api/search
 * endpoint; the surface pills set the Orama `tag` filter. Everything visual here is the
 * warm-paper design — fumadocs-ui's dialog is intentionally not used. */
// Don't query orama below this — a single letter just substring-matches everything.
var MIN_QUERY = 3;
// Strip markdown emphasis/code markers from snippet text. Underscores stay: tool names use them.
var clean = function (s) { return s.replace(/[*`]/g, ""); };
// Keep the palette scannable. Fumadocs has no server-side limit, so cap here: results come
// back grouped by page (a page row then its heading/text rows), so keep the first N groups
// and a few rows each.
var MAX_PAGES = 8;
var MAX_ROWS_PER_PAGE = 4;
function capResults(rows) {
    var out = [];
    var perPage = new Map();
    for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
        var r = rows_1[_i];
        var base = r.url.split("#")[0];
        var n = perPage.get(base);
        if (n === undefined) {
            if (perPage.size >= MAX_PAGES)
                continue;
            n = 0;
            perPage.set(base, 0);
        }
        if (n >= MAX_ROWS_PER_PAGE)
            continue;
        perPage.set(base, n + 1);
        out.push(r);
    }
    return out;
}
var SURFACES = [
    { key: "all", label: "All", tag: undefined },
    { key: "guide", label: "Guide", tag: "guide" },
    { key: "docs", label: "Reference", tag: "docs" },
    { key: "resources", label: "API", tag: "resources" },
    { key: "tools", label: "MCP", tag: "tools" },
];
var surfaceToneClasses = {
    guide: "border-[#A9DAF3] bg-[#DFF5FF] text-[#3583A8]",
    api: "border-[#A8DB91] bg-[#E4F8DA] text-[#4F9140]",
    mcp: "border-[#E6CFA3] bg-[#FFF2D8] text-[#9C7136]",
    docs: "border-[#DADAD5] bg-[#EFEFEB] text-[rgba(38,35,35,0.6)]",
};
// Which surface a result belongs to is read back off its URL — the flat result list
// from fetchClient doesn't echo the index `tag`.
function surfaceOf(url) {
    if (url.startsWith("/guides"))
        return { label: "Guide", key: "guide" };
    if (url.startsWith("/api-reference"))
        return { label: "API", key: "api" };
    if (url.startsWith("/mcp"))
        return { label: "MCP", key: "mcp" };
    return { label: "Reference", key: "docs" };
}
function SearchGlyph(_a) {
    var className = _a.className;
    return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
      <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>);
}
function SearchCommand() {
    var _a = (0, react_1.useState)(false), open = _a[0], setOpen = _a[1];
    var _b = (0, react_1.useState)(undefined), tag = _b[0], setTag = _b[1];
    var _c = (0, react_1.useState)(0), active = _c[0], setActive = _c[1];
    var _d = (0, react_1.useState)("⌘"), modKey = _d[0], setModKey = _d[1];
    var router = (0, navigation_1.useRouter)();
    var listRef = (0, react_1.useRef)(null);
    // Recreated only when the surface filter changes; `customDeps` re-queries on tag switch.
    var client = (0, react_1.useMemo)(function () { return (0, fetch_1.fetchClient)({ api: "/api/search", tag: tag }); }, [tag]);
    var _e = (0, client_1.useDocsSearch)({ client: client, delayMs: 80 }, [tag]), setSearch = _e.setSearch, query = _e.query;
    // Local input value; the orama query only fires at >= MIN_QUERY chars.
    var _f = (0, react_1.useState)(""), value = _f[0], setValue = _f[1];
    var onChange = (0, react_1.useCallback)(function (v) {
        setValue(v);
        setSearch(v.trim().length >= MIN_QUERY ? v.trim() : "");
    }, [setSearch]);
    var results = capResults(query.data && query.data !== "empty" ? query.data : []);
    var ready = value.trim().length >= MIN_QUERY;
    // ⌘K / Ctrl+K toggles the palette from anywhere.
    (0, react_1.useEffect)(function () {
        if (navigator.platform && !/mac/i.test(navigator.platform))
            setModKey("Ctrl ");
        function onKey(e) {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setOpen(function (o) { return !o; });
            }
        }
        window.addEventListener("keydown", onKey);
        return function () { return window.removeEventListener("keydown", onKey); };
    }, []);
    // Keep the highlighted row in range and scrolled into view as results change.
    (0, react_1.useEffect)(function () {
        setActive(0);
    }, [results.length, tag]);
    (0, react_1.useEffect)(function () {
        var _a, _b;
        (_b = (_a = listRef.current) === null || _a === void 0 ? void 0 : _a.querySelector("[data-row=\"".concat(active, "\"]"))) === null || _b === void 0 ? void 0 : _b.scrollIntoView({ block: "nearest" });
    }, [active]);
    var go = (0, react_1.useCallback)(function (url) {
        setOpen(false);
        router.push(url);
    }, [router]);
    function onInputKey(e) {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive(function (a) { return Math.min(a + 1, results.length - 1); });
        }
        else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive(function (a) { return Math.max(a - 1, 0); });
        }
        else if (e.key === "Enter" && results[active]) {
            e.preventDefault();
            go(results[active].url);
        }
    }
    return (<Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button type="button" aria-label="Search docs" className="group inline-flex h-[38px] items-center gap-[8px] rounded-[8px] border border-[rgba(32,32,32,0.1)] bg-[#F5F5F2] pl-[10px] pr-[8px] text-ink-faint shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] transition-colors hover:text-ink-ui sm:w-[260px] sm:justify-between">
          <span className="flex items-center gap-[8px]">
            <SearchGlyph />
            <span className="hidden text-[14px] font-[460] tracking-[0.15px] sm:inline">Search</span>
          </span>
          <kbd className="hidden items-center rounded-[5px] border border-[#DEDEDA] bg-[#FBFBF8] px-[5px] py-[1px] font-[family-name:var(--font-mono)] text-[11px] leading-[16px] text-[rgba(38,35,35,0.5)] sm:inline-flex">
            {modKey}K
          </kbd>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-[rgba(38,35,35,0.32)] backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"/>
        <Dialog.Content onOpenAutoFocus={function (e) {
            var _a;
            // Focus the input, not Radix's default first-focusable.
            e.preventDefault();
            (_a = e.currentTarget.querySelector("input")) === null || _a === void 0 ? void 0 : _a.focus();
        }} className="fixed left-1/2 top-[11vh] z-[101] flex max-h-[72vh] w-[calc(100vw-32px)] max-w-[600px] -translate-x-1/2 flex-col overflow-hidden rounded-[14px] border border-[#E3E3DF] bg-[#FBFBF8] shadow-[0_24px_60px_-12px_rgba(38,35,35,0.28)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <Dialog.Title className="sr-only">Search Carbon docs</Dialog.Title>
          <Dialog.Description className="sr-only">
            Search the guide, reference, API resources, and MCP tools.
          </Dialog.Description>

          {/* Search field */}
          <div className="flex h-[56px] shrink-0 items-center gap-[12px] border-b border-[#EAEAE6] px-[18px]">
            <SearchGlyph className="shrink-0 text-[rgba(38,35,35,0.4)]"/>
            <input value={value} onChange={function (e) { return onChange(e.target.value); }} onKeyDown={onInputKey} placeholder="Search docs, API resources, MCP tools…" className="h-full flex-1 border-0 bg-transparent text-[16px] leading-[150%] text-ink outline-none placeholder:text-[rgba(38,35,35,0.42)]" spellCheck={false} autoComplete="off"/>
            <kbd className="shrink-0 rounded-[5px] border border-[#DEDEDA] bg-[#F5F5F2] px-[6px] py-[2px] font-[family-name:var(--font-mono)] text-[11px] text-[rgba(38,35,35,0.5)]">
              esc
            </kbd>
          </div>

          {/* Surface filter pills */}
          <div className="flex shrink-0 items-center gap-[6px] border-b border-[#EAEAE6] px-[14px] py-[9px]">
            {SURFACES.map(function (s) {
            var on = tag === s.tag;
            return (<button key={s.key} type="button" onClick={function () { return setTag(s.tag); }} className={"rounded-[100px] px-[11px] py-[4px] text-[12.5px] font-[460] leading-[16px] transition-colors ".concat(on
                    ? "bg-[#262323] text-[#F5F5F2]"
                    : "text-ink-faint hover:bg-[rgba(231,231,227,0.7)] hover:text-ink-ui")}>
                  {s.label}
                </button>);
        })}
          </div>

          {/* Results */}
          <div ref={listRef} className="scrollbar-hidden-until-scroll min-h-[120px] flex-1 overflow-y-auto p-[8px]">
            {!ready ? (<Hint />) : query.isLoading && results.length === 0 ? (<Status>Searching…</Status>) : results.length === 0 ? (<Status>
                No results for <span className="text-ink">“{value.trim()}”</span>
              </Status>) : (results.map(function (r, i) { return (<ResultRow key={r.id} result={r} index={i} active={i === active} onHover={function () { return setActive(i); }} onClick={function () { return go(r.url); }}/>); }))}
          </div>

          {/* Footer */}
          <div className="flex h-[40px] shrink-0 items-center gap-[16px] border-t border-[#EAEAE6] px-[16px] text-[12px] text-[rgba(38,35,35,0.5)]">
            <FooterKey k="↑↓" label="navigate"/>
            <FooterKey k="↵" label="open"/>
            <FooterKey k="esc" label="close"/>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>);
}
function ResultRow(_a) {
    var result = _a.result, index = _a.index, active = _a.active, onHover = _a.onHover, onClick = _a.onClick;
    var isPage = result.type === "page";
    var surface = surfaceOf(result.url);
    return (<button type="button" data-row={index} onMouseMove={onHover} onClick={onClick} className={"flex w-full items-center gap-[12px] rounded-[8px] px-[12px] text-left transition-colors ".concat(isPage ? "mt-[6px] py-[10px] first:mt-0" : "py-[7px] pl-[34px]", " ").concat(active ? "bg-[rgba(231,231,227,0.75)]" : "")}>
      {!isPage && (<span className="shrink-0 text-[rgba(38,35,35,0.32)]" aria-hidden>
          ↳
        </span>)}
      <span className={"min-w-0 flex-1 truncate ".concat(isPage
            ? "text-[14.5px] font-[530] text-ink"
            : result.type === "heading"
                ? "text-[13.5px] font-[460] text-[rgba(38,35,35,0.82)]"
                : "text-[13px] font-[440] text-[rgba(38,35,35,0.62)]")}>
        <Highlighted content={result.content}/>
      </span>
      {isPage && (<span className={"shrink-0 rounded-[100px] border px-[7px] py-[2px] font-[family-name:var(--font-mono)] text-[10px] leading-[12px] ".concat(surfaceToneClasses[surface.key])}>
          {surface.label}
        </span>)}
    </button>);
}
function Highlighted(_a) {
    var content = _a.content;
    // fumadocs wraps matched substrings in literal <mark> tags inside the result string.
    // Split on the tags and style the marked parts — rendered as escaped text, never raw HTML.
    var parts = content.split(/(<mark>|<\/mark>)/g);
    var marked = false;
    return (<>
      {parts.map(function (part, i) {
            if (part === "<mark>") {
                marked = true;
                return null;
            }
            if (part === "</mark>") {
                marked = false;
                return null;
            }
            var text = clean(part);
            if (!text)
                return null;
            return marked ? (<mark key={i} className="bg-transparent font-[600] text-[#A76451]">
            {text}
          </mark>) : (<span key={i}>{text}</span>);
        })}
    </>);
}
function Hint() {
    return (<div className="flex flex-col items-center justify-center gap-[8px] px-6 py-[40px] text-center">
      <SearchGlyph className="text-[rgba(38,35,35,0.28)]"/>
      <p className="m-0 text-[14px] leading-[150%] text-[rgba(38,35,35,0.55)]">
        Search the guide, reference, API resources, and MCP tools.
      </p>
    </div>);
}
function Status(_a) {
    var children = _a.children;
    return (<div className="px-[12px] py-[36px] text-center text-[14px] leading-[150%] text-[rgba(38,35,35,0.55)]">
      {children}
    </div>);
}
function FooterKey(_a) {
    var k = _a.k, label = _a.label;
    return (<span className="inline-flex items-center gap-[6px]">
      <kbd className="inline-flex items-center rounded-[5px] border border-[#DEDEDA] bg-[#F5F5F2] px-[5px] py-[1px] font-[family-name:var(--font-mono)] text-[11px] leading-[14px]">
        {k}
      </kbd>
      {label}
    </span>);
}
