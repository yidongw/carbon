"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadingProgress = ReadingProgress;
/**
 * ReadingProgress — the right-edge tick ruler that fills as the reader scrolls.
 * Mount once in the Guide layout (not inside MDX). Hidden below lg.
 *
 * Design intent: make the page's length *finite and visible*. A reader who can
 * see they're 40% through keeps going. See references/design-language.md.
 */
var framer_motion_1 = require("framer-motion");
var TICKS = 32;
function Ticks(_a) {
    var className = _a.className;
    return (<div className={"flex h-full flex-col justify-between ".concat(className !== null && className !== void 0 ? className : "")}>
      {Array.from({ length: TICKS }).map(function (_, i) { return (<span key={i} className="h-px w-3 rounded-full bg-current"/>); })}
    </div>);
}
function ReadingProgress() {
    var scrollYProgress = (0, framer_motion_1.useScroll)().scrollYProgress;
    // Reveal the brand-colored copy of the ruler from the top down to scroll depth.
    var height = (0, framer_motion_1.useTransform)(scrollYProgress, function (v) { return "".concat(Math.min(Math.max(v, 0), 1) * 100, "%"); });
    return (<div aria-hidden className="pointer-events-none fixed right-5 top-1/2 z-30 hidden h-56 -translate-y-1/2 lg:block">
      <div className="relative h-full">
        {/* Base ticks (inactive) */}
        <Ticks className="text-border"/>
        {/* Accent overlay clipped to scroll progress; inner copy is full-height so ticks align */}
        <framer_motion_1.motion.div className="absolute inset-x-0 top-0 overflow-hidden text-brand" style={{ height: height }}>
          <div className="h-56">
            <Ticks className="text-brand"/>
          </div>
        </framer_motion_1.motion.div>
      </div>
    </div>);
}
