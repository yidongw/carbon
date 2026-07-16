"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Checklist = Checklist;
exports.Check = Check;
/**
 * Checklist / Check — a stateful, tickable checklist. State persists per page
 * in localStorage; checked items strike through. Turns "read these N things"
 * into "did these N things".
 *
 * Usage in MDX:
 *   <Checklist>
 *     <Check>Item has an active revision</Check>
 *     <Check>Routing has at least one operation</Check>
 *   </Checklist>
 */
var react_1 = require("react");
var navigation_1 = require("next/navigation");
function Checklist(_a) {
    var children = _a.children;
    var index = 0;
    return (<ul className="not-prose my-6 space-y-2">
      {react_1.Children.map(children, function (child) {
            return (0, react_1.isValidElement)(child) ? (0, react_1.cloneElement)(child, { _index: index++ }) : child;
        })}
    </ul>);
}
function Check(_a) {
    var children = _a.children, _b = _a._index, _index = _b === void 0 ? 0 : _b;
    var pathname = (0, navigation_1.usePathname)();
    var key = "carbon-docs:check:".concat(pathname, ":").concat(_index);
    var _c = (0, react_1.useState)(false), done = _c[0], setDone = _c[1];
    // Read persisted state after mount (avoids SSR/client mismatch).
    (0, react_1.useEffect)(function () {
        setDone(window.localStorage.getItem(key) === "1");
    }, [key]);
    function toggle() {
        var next = !done;
        setDone(next);
        window.localStorage.setItem(key, next ? "1" : "0");
    }
    return (<li>
      <button type="button" onClick={toggle} aria-pressed={done} className="group flex w-full items-start gap-3 text-left">
        <span className={"mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ".concat(done ? "border-brand bg-brand text-primary-foreground" : "border-border bg-card group-hover:border-brand/60")}>
          {done && (<svg viewBox="0 0 16 16" fill="none" className="size-3.5" aria-hidden>
              <path d="M3.5 8.5l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>)}
        </span>
        <span className={"text-[15px] leading-relaxed ".concat(done ? "text-muted-foreground line-through" : "text-foreground")}>
          {children}
        </span>
      </button>
    </li>);
}
