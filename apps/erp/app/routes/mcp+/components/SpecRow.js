"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecList = SpecList;
exports.SpecRow = SpecRow;
function SpecList(_a) {
    var children = _a.children;
    return (<div className="stagger border-t border-border mt-[2px]">{children}</div>);
}
function SpecRow(_a) {
    var label = _a.label, children = _a.children;
    return (<div className="grid grid-cols-[180px_1fr] gap-[28px] items-baseline py-[15px] border-b border-border">
      <div className="font-semibold text-[0.95rem] flex items-center gap-[9px]">
        {label}
      </div>
      <p className="text-muted-foreground text-[0.9rem] m-0 [text-wrap:pretty]">
        {children}
      </p>
    </div>);
}
