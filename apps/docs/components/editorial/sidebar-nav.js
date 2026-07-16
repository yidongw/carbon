"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidebarNav = SidebarNav;
var guide_context_1 = require("./guide-context");
// Show only the active flow's chapters; `chapterIdx` stays the GLOBAL index so it
// keeps addressing the right body/scroll position in the flat chapter list.
function SidebarNav(_a) {
    var _b;
    var chapters = _a.chapters, active = _a.active, onActiveChange = _a.onActiveChange;
    var activeFlow = (_b = chapters[active.chapter]) === null || _b === void 0 ? void 0 : _b.flow;
    var visible = activeFlow ? (0, guide_context_1.chaptersInFlow)(chapters, activeFlow) : [];
    return (<nav className="flex flex-col gap-[40px]">
      {visible.map(function (_a) {
            var chapter = _a.chapter, chapterIdx = _a.index;
            return (<div key={chapter.slug}>
          <div className="relative flex items-center">
            <span className="absolute right-[calc(100%+10px)] top-1/2 -translate-y-1/2 font-[family-name:var(--font-mono)] text-[12px] font-[500] text-ink-faint leading-[140%] tracking-[0.12px] whitespace-nowrap">
              {chapter.label}
            </span>
            <span className="text-[rgba(32,32,32,0.80)] text-[15px] font-[530] leading-[140%] tracking-[0.15px]">
              {chapter.title}
            </span>
          </div>
          <div className="mt-[24px] flex flex-col gap-[12px]">
            {chapter.items.map(function (item, itemIdx) {
                    var isActive = active.chapter === chapterIdx && active.item === itemIdx;
                    return (<button key={item.id} type="button" onClick={function () { return onActiveChange({ chapter: chapterIdx, item: itemIdx }); }} className="flex gap-[14px] text-left cursor-pointer bg-transparent border-none p-0 items-center">
                  <div className={"w-[8px] h-[8px] rounded-[5.5px] shrink-0 transition-all duration-200 ".concat(isActive
                            ? "bg-[#B2E7FF] shadow-[0_1px_1px_0_rgba(0,126,183,0.70),inset_0_0.5px_0.2px_0_#FFF,0_0_0_3px_#96DEFF]"
                            : "bg-[#F3F3F0] shadow-[0_1px_1px_0_rgba(0,0,0,0.25),0_0_0_3px_rgba(213,213,211,0.50),inset_0_0.5px_0.2px_0_#FFF]")}/>
                  <span className="text-[rgba(75,75,74,0.80)] text-[15px] font-[460] leading-[140%] tracking-[0.15px] whitespace-pre-line">
                    {item.title}
                  </span>
                </button>);
                })}
          </div>
        </div>);
        })}
    </nav>);
}
