"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapterNav = ChapterNav;
/**
 * ChapterNav — the editorial Guide sidebar: roman-numeral chapters, each a
 * vertical line of connected step-dots. The current step is filled with the
 * brand accent; completed steps are solid foreground; upcoming steps hollow.
 *
 * Reads as a *journey*, not a file tree. Mount in the Guide layout.
 *
 * The `chapters` prop should be derived from the Fumadocs page tree so it stays
 * in sync with meta.json (one source of truth). In your Guide layout:
 *
 *   import { source } from "@/lib/source";
 *   // walk source.pageTree: folders → chapters, pages → steps {title, url}
 *   <ChapterNav chapters={chapters} title="How to run your shop with Carbon" />
 *
 * Keeping it presentational (chapters passed in) makes it trivial to test and
 * avoids coupling to a specific Fumadocs tree shape.
 */
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
function dotClass(state) {
    if (state === "active")
        return "bg-brand";
    if (state === "done")
        return "bg-foreground";
    return "border border-border bg-transparent";
}
function ChapterNav(_a) {
    var chapters = _a.chapters, _b = _a.title, title = _b === void 0 ? "How to run your shop with Carbon" : _b;
    var pathname = (0, navigation_1.usePathname)();
    var flat = chapters.flatMap(function (c) { return c.steps; });
    var activeIndex = flat.findIndex(function (s) { return s.url === pathname; });
    var i = -1; // running index across all steps
    return (<nav className="text-sm">
      <p className="mb-6 max-w-[14rem] text-[13px] leading-snug text-muted-foreground">{title}</p>

      <ol className="space-y-7">
        {chapters.map(function (chapter, ci) {
            var _a;
            return (<li key={chapter.label}>
            <div className="mb-2 flex items-baseline gap-2">
              <span className="font-mono text-xs text-muted-foreground">{(_a = ROMAN[ci]) !== null && _a !== void 0 ? _a : ci + 1}.</span>
              <span className="font-medium text-foreground">{chapter.label}</span>
            </div>

            <ul className="ml-1 space-y-0.5 border-l border-border pl-4">
              {chapter.steps.map(function (step) {
                    i += 1;
                    var state = i === activeIndex ? "active" : activeIndex !== -1 && i < activeIndex ? "done" : "todo";
                    return (<li key={step.url} className="relative">
                    <span aria-hidden className={"absolute -left-[1.3rem] top-2 size-2 rounded-full ring-2 ring-[hsl(var(--background))] ".concat(dotClass(state))}/>
                    <link_1.default href={step.url} aria-current={state === "active" ? "page" : undefined} className={"block rounded-md px-2 py-1 transition-colors ".concat(state === "active"
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground")}>
                      {step.title}
                    </link_1.default>
                  </li>);
                })}
            </ul>
          </li>);
        })}
      </ol>
    </nav>);
}
