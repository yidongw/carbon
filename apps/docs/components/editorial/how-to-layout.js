"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HowToLayout = HowToLayout;
var page_feedback_1 = require("@/components/api/page-feedback");
var custom_scrollbar_1 = require("./custom-scrollbar");
var guide_context_1 = require("./guide-context");
var sidebar_nav_1 = require("./sidebar-nav");
function FooterChevron(_a) {
    var dir = _a.dir;
    return (<svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0">
      <path d={dir === "left" ? "M8.5 3.5L5 7l3.5 3.5" : "M5.5 3.5L9 7l-3.5 3.5"} stroke="rgba(38,35,35,0.55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>);
}
/** Prev/next chapter card — mirrors the ContentFooter cards, but switches chapter via goTo. */
function ChapterCard(_a) {
    var dir = _a.dir, title = _a.title, onSelect = _a.onSelect;
    var next = dir === "next";
    return (<button type="button" onClick={onSelect} className={"group flex w-full items-center gap-[10px] rounded-[12px] border border-[#E7E7E3] bg-[rgba(251,251,248,0.6)] px-[16px] py-[12px] text-left shadow-[inset_0_1px_0_#fff] transition-colors hover:border-[#D9D9D3] hover:bg-[rgba(255,255,255,0.7)] ".concat(next ? "flex-row-reverse text-right" : "")}>
      <FooterChevron dir={next ? "right" : "left"}/>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-[family-name:var(--font-mono)] text-[10.5px] font-[600] uppercase tracking-[0.08em] text-[rgba(38,35,35,0.5)]">
          {next ? "Next" : "Previous"}
        </span>
        <span className="truncate text-[15px] font-[560] text-ink-ui transition-colors group-hover:text-[#262323]">
          {title}
        </span>
      </span>
    </button>);
}
function HowToLayout(_a) {
    var bodies = _a.bodies;
    var _b = (0, guide_context_1.useGuide)(), active = _b.active, goTo = _b.goTo, registerScrollEl = _b.registerScrollEl, chapters = _b.chapters;
    var currentChapter = chapters[active.chapter];
    if (!currentChapter)
        return null;
    // Chapters of the current flow (with global indices) for the mobile selector and
    // the "read next" link — navigation stays within a flow, never spilling into the next.
    var flowChapters = (0, guide_context_1.chaptersInFlow)(chapters, currentChapter.flow);
    var posInFlow = flowChapters.findIndex(function (c) { return c.index === active.chapter; });
    var prevInFlow = flowChapters[posInFlow - 1];
    var nextInFlow = flowChapters[posInFlow + 1];
    return (<main className="bg-[#F5F5F2] overflow-hidden min-h-0" style={{ height: "100dvh", paddingTop: "116px" }}>
      <div className="mx-auto w-full max-w-[1440px] px-[20px] flex h-full min-h-0 overflow-hidden">
        {/* Sidebar (desktop) */}
        <div className="hidden min-[1000px]:flex shrink-0 w-[260px] flex-col overflow-y-auto scrollbar-hidden-until-scroll nav-scroll-fade pl-[50px] pr-[10px] pt-[40px] pb-[40px]">
          <sidebar_nav_1.SidebarNav chapters={chapters} active={active} onActiveChange={goTo}/>
        </div>

        {/* Content area */}
        <div className="flex-1 min-w-0 flex flex-col min-h-0">
          {/* Mobile chapter selector */}
          <div className="min-[1000px]:hidden px-[20px] pt-[20px] pb-[10px]">
            <div className="flex gap-[8px] overflow-x-auto scrollbar-none">
              {flowChapters.map(function (_a) {
            var chapter = _a.chapter, index = _a.index;
            return (<button key={chapter.slug} type="button" onClick={function () { return goTo({ chapter: index, item: 0 }); }} className={"shrink-0 whitespace-nowrap px-[14px] py-[8px] rounded-[8px] border-none cursor-pointer text-[14px] font-[460] tracking-[0.14px] transition-all duration-200 ".concat(active.chapter === index
                    ? "bg-[rgba(231,231,227,0.80)] text-ink-ui"
                    : "bg-transparent text-ink-faint hover:bg-[rgba(231,231,227,0.40)]")}>
                  {chapter.title}
                </button>);
        })}
            </div>
          </div>

          {/* Main content with custom scrollbar */}
          <div className="flex-1 min-h-0 flex">
            <custom_scrollbar_1.ScrollArea scrollbarOffset={20} onScrollElement={registerScrollEl}>
              <div className="px-[20px] min-[476px]:pl-[32px] min-[1000px]:pl-[130px] min-[1000px]:pr-[20px] pb-[100px]">
                <div className="max-w-[620px]">
                  <div className="pt-[44px]">
                    <span className="inline-flex items-center justify-center rounded-[100px] px-[8px] py-[4px] font-[family-name:var(--font-mono)] text-[12px] font-medium leading-[16px] text-[rgba(38,35,35,0.5)] whitespace-nowrap" style={{
            background: "linear-gradient(180deg, rgba(251, 251, 248, 0.50) 0%, rgba(251, 251, 248, 0.00) 100%)",
            boxShadow: "0 0 0 1px #FFF inset, 0 0 0 1px rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.02)",
        }}>
                      {currentChapter.label} — {currentChapter.slug.toUpperCase()}
                    </span>
                  </div>

                  {/* MDX body for the active chapter */}
                  {bodies[active.chapter]}

                  {/* Footer — feedback + within-flow prev/next, matching the docs pages. */}
                  <footer className="mt-[64px] border-t border-[rgba(38,35,35,0.12)] pt-[26px]">
                    <page_feedback_1.PageFeedback key={active.chapter} variant="editorial"/>
                    {(prevInFlow || nextInFlow) && (<nav className="mt-[22px] grid grid-cols-1 gap-[12px] sm:grid-cols-2">
                        <div>
                          {prevInFlow && (<ChapterCard dir="prev" title={prevInFlow.chapter.title} onSelect={function () { return goTo({ chapter: prevInFlow.index, item: 0 }); }}/>)}
                        </div>
                        <div>
                          {nextInFlow && (<ChapterCard dir="next" title={nextInFlow.chapter.title} onSelect={function () { return goTo({ chapter: nextInFlow.index, item: 0 }); }}/>)}
                        </div>
                      </nav>)}
                  </footer>
                </div>
              </div>
            </custom_scrollbar_1.ScrollArea>
          </div>
        </div>
      </div>
    </main>);
}
