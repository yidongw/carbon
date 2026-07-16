"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cta = Cta;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var useInViewClass_1 = require("../hooks/useInViewClass");
var quickstart_nav_1 = require("./quickstart-nav");
function Cta() {
    var ref = (0, useInViewClass_1.useInViewClass)();
    // Read the real <html> .dark class (useMode lags the toggle), and track toggles.
    var _a = (0, react_2.useState)((0, react_1.useMode)() === "dark"), isDark = _a[0], setIsDark = _a[1];
    (0, react_2.useEffect)(function () {
        var html = document.documentElement;
        var update = function () { return setIsDark(html.classList.contains("dark")); };
        update();
        var observer = new MutationObserver(update);
        observer.observe(html, { attributes: true, attributeFilter: ["class"] });
        return function () { return observer.disconnect(); };
    }, []);
    return (<section ref={ref} className="reveal relative py-[54px] scroll-mt-20">
      <div className={isDark
            ? "bg-muted bg-cover bg-center border border-border rounded-[14px] px-[24px] py-[50px] text-center"
            : "bg-muted bg-[url(/cta.webp)] bg-cover bg-center border border-border rounded-[14px] px-[24px] py-[50px] text-center"}>
        <h2 className="font-medium tracking-[-0.035em] leading-[1.05] m-0 mb-[8px] text-foreground [text-wrap:balance] text-[clamp(1.8rem,2.8vw,2.4rem)]">
          Build something with Carbon
        </h2>
        <p className="text-muted-foreground m-0 mb-[20px]">
          Bring your manufacturing system into every AI assistant.
        </p>
        <div className="flex gap-[10px] flex-wrap justify-center">
          <react_1.Button variant="primary" size="lg" onClick={function () { return (0, quickstart_nav_1.goToQuickstart)("Claude Code"); }}>
            Connect to Claude
          </react_1.Button>
          <react_1.Button asChild variant="secondary" size="lg">
            <a href="https://www.carbon.ms/sales" target="_blank" rel="noopener">
              Talk to sales
            </a>
          </react_1.Button>
        </div>
      </div>
    </section>);
}
