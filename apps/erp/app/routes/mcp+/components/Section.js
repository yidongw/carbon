"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Section = Section;
var useInViewClass_1 = require("../hooks/useInViewClass");
function Section(_a) {
    var id = _a.id, fig = _a.fig, label = _a.label, title = _a.title, children = _a.children;
    var ref = (0, useInViewClass_1.useInViewClass)();
    return (<section ref={ref} id={id} className="reveal hr-wipe relative py-[54px] scroll-mt-20">
      <div className="font-[var(--mono)] text-[0.68rem] tracking-[0.18em] uppercase text-muted-foreground mb-4">
        <span className="text-[var(--acc)] font-medium">{fig}</span> · {label}
      </div>
      {title && (<h2 className="font-medium tracking-[-0.03em] text-[clamp(1.5rem,2.2vw,1.9rem)] leading-[1.12] mb-[9px] text-balance">
          {title}
        </h2>)}
      {children}
    </section>);
}
