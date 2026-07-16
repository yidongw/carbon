"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Frame = Frame;
function Frame(_a) {
    var children = _a.children, caption = _a.caption;
    return (<figure className="not-prose my-8">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm [&_img]:m-0 [&_img]:block [&_img]:w-full">
        {children}
      </div>
      {caption && (<figcaption className="mt-3 text-center text-xs text-muted-foreground">{caption}</figcaption>)}
    </figure>);
}
