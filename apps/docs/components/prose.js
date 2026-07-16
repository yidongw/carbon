"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eyebrow = Eyebrow;
function Eyebrow(_a) {
    var children = _a.children;
    return (<span className="not-prose mb-3 inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground">
      {children}
    </span>);
}
