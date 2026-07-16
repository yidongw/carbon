"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchLandingPage = SearchLandingPage;
var react_1 = require("@carbon/react");
var MAX_WIDTH = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg"
};
function SearchLandingPage(_a) {
    var Icon = _a.icon, heading = _a.heading, description = _a.description, children = _a.children, footerTip = _a.footerTip, _b = _a.maxWidth, maxWidth = _b === void 0 ? "md" : _b, className = _a.className;
    return (<div className={(0, react_1.cn)("relative flex w-full h-full flex-1 items-center justify-center bg-card overflow-hidden isolate pb-[10%]", className)}>
      <div className={(0, react_1.cn)("relative flex flex-col items-center w-full px-6 gap-6", MAX_WIDTH[maxWidth])}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center size-14 rounded-2xl bg-background border border-border text-foreground shadow-sm before:absolute before:inset-0 before:rounded-2xl before:bg-linear-to-b before:from-foreground/5 before:to-transparent before:pointer-events-none">
            <Icon className="size-6"/>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <react_1.Heading size="h1" className="tracking-tight text-balance font-semibold">
              {heading}
            </react_1.Heading>
            {description && (<p className="text-sm text-muted-foreground max-w-[44ch] text-pretty leading-6">
                {description}
              </p>)}
          </div>
        </div>

        <div className="mt-2 w-full">{children}</div>

        {footerTip && (<p className="text-[11px] text-muted-foreground/70 tabular-nums">
            {footerTip}
          </p>)}
      </div>
    </div>);
}
exports.default = SearchLandingPage;
