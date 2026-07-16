"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zoomable = Zoomable;
/* Click-to-enlarge for guide figures and screenshots. The thumbnail and the
 * fullscreen overlay share a Framer Motion `layoutId`, so opening morphs the image
 * up into a centered lightbox and closing morphs it back — no cut, no reload. Esc or
 * a backdrop click closes it; body scroll is locked while open. */
var framer_motion_1 = require("framer-motion");
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var spring = { type: "spring", stiffness: 280, damping: 32 };
function Zoomable(_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(false), open = _b[0], setOpen = _b[1];
    var _c = (0, react_1.useState)(false), mounted = _c[0], setMounted = _c[1];
    var id = (0, react_1.useId)();
    (0, react_1.useEffect)(function () { return setMounted(true); }, []);
    (0, react_1.useEffect)(function () {
        if (!open)
            return;
        var onKey = function (e) {
            if (e.key === "Escape")
                setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        var prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return function () {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open]);
    return (<>
      <framer_motion_1.motion.button type="button" layoutId={id} transition={spring} onClick={function () { return setOpen(true); }} aria-label="Enlarge" style={{ opacity: open ? 0 : 1 }} className="group relative block w-full cursor-zoom-in appearance-none border-0 bg-transparent p-0 text-left">
        {children}
        <span className="pointer-events-none absolute right-[14px] top-[14px] flex h-[28px] w-[28px] items-center justify-center rounded-[8px] border border-[#E7E7E3] bg-[#FBFBF8]/90 opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M6 2H2v4M10 2h4v4M6 14H2v-4M10 14h4v-4" stroke="rgba(38,35,35,0.55)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </framer_motion_1.motion.button>

      {mounted &&
            (0, react_dom_1.createPortal)(<framer_motion_1.AnimatePresence>
            {open && (<framer_motion_1.motion.div key="zoom-overlay" className="fixed inset-0 z-[300] flex items-center justify-center p-[20px] md:p-[56px]" onClick={function () { return setOpen(false); }}>
                <framer_motion_1.motion.div aria-hidden className="absolute inset-0 bg-[rgba(38,35,35,0.55)] backdrop-blur-[3px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}/>
                <framer_motion_1.motion.div layoutId={id} transition={spring} onClick={function (e) { return e.stopPropagation(); }} className="relative z-10 w-full max-w-[min(1100px,92vw)] max-h-[88vh] cursor-zoom-out overflow-auto">
                  {children}
                </framer_motion_1.motion.div>
              </framer_motion_1.motion.div>)}
          </framer_motion_1.AnimatePresence>, document.body)}
    </>);
}
