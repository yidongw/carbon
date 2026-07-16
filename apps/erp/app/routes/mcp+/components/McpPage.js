"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpPage = McpPage;
var Authentication_1 = require("./Authentication");
var Cta_1 = require("./Cta");
var Faq_1 = require("./Faq");
var Footer_1 = require("./Footer");
var Lede_1 = require("./Lede");
var Nav_1 = require("./Nav");
var OnThisPageNav_1 = require("./OnThisPageNav");
var Quickstart_1 = require("./Quickstart");
var Safety_1 = require("./Safety");
var Section_1 = require("./Section");
var ToolDiscovery_1 = require("./ToolDiscovery");
var Tools_1 = require("./Tools");
var WaveScrollRail_1 = require("./WaveScrollRail");
var WhatIsMcp_1 = require("./WhatIsMcp");
var WhatYouCanAsk_1 = require("./WhatYouCanAsk");
function McpPage(_a) {
    var catalog = _a.catalog;
    return (<div className="MCP bg-[var(--canvas)] text-foreground antialiased min-h-screen">
      <Nav_1.Nav />
      <WaveScrollRail_1.WaveScrollRail />
      <div className="container">
        <div className="grid grid-cols-1 min-[880px]:grid-cols-[200px_minmax(0,720px)] gap-12 pt-[52px] pb-10">
          <OnThisPageNav_1.OnThisPageNav />
          <main>
            <Lede_1.Lede total={catalog.total}/>
            <Section_1.Section id="whatis" fig="FIG.01" label="OVERVIEW" title="What is MCP?">
              <WhatIsMcp_1.WhatIsMcp />
            </Section_1.Section>
            <WhatYouCanAsk_1.WhatYouCanAsk />
            <Section_1.Section id="quickstart" fig="FIG.03" label="QUICKSTART" title="Quickstart">
              <Quickstart_1.Quickstart />
            </Section_1.Section>
            <Section_1.Section id="discovery" fig="FIG.04" label="ARCHITECTURE" title="How tool discovery works">
              <ToolDiscovery_1.ToolDiscovery total={catalog.total}/>
            </Section_1.Section>
            <Section_1.Section id="tools" fig="FIG.05" label="REFERENCE" title="Tools">
              <Tools_1.Tools catalog={catalog}/>
            </Section_1.Section>
            <Section_1.Section id="auth" fig="FIG.06" label="SECURITY" title="Authentication">
              <Authentication_1.Authentication />
            </Section_1.Section>
            <Section_1.Section id="safety" fig="FIG.07" label="SAFETY" title="Safety">
              <Safety_1.Safety />
            </Section_1.Section>
            <Section_1.Section id="faq" fig="FIG.08" label="FAQ" title="FAQ">
              <Faq_1.Faq />
            </Section_1.Section>
            <Cta_1.Cta />
          </main>
        </div>
      </div>
      <Footer_1.Footer />
    </div>);
}
