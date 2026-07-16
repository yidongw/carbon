"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = McpLayout;
var config_context_1 = require("@/components/api/config-context");
var configurator_1 = require("@/components/api/configurator");
var mcp_nav_1 = require("@/components/api/mcp-nav");
var toc_1 = require("@/components/api/toc");
var main_header_1 = require("@/components/main-header");
var tools_data_1 = require("@/lib/tools-data");
function McpLayout(_a) {
    var children = _a.children;
    return (<div className="min-h-screen w-full bg-[#FBFBF9]">
      <main_header_1.MainHeader active="mcp"/>

      <config_context_1.ApiConfigProvider>
        <div className="mx-auto flex w-full max-w-[1480px] pt-[64px]">
          <aside className="sticky top-[64px] hidden h-[calc(100dvh-64px)] w-[280px] shrink-0 overflow-y-auto border-r border-[#E7E7E3] px-[20px] py-[28px] scrollbar-hidden-until-scroll nav-scroll-fade lg:block">
            <configurator_1.Configurator />
            <mcp_nav_1.McpNav tools={tools_data_1.toolsNavTree}/>
          </aside>
          <main className="min-w-0 flex-1 px-[24px] pb-[140px] pt-[40px] lg:px-[56px]">
            {children}
          </main>
          <aside className="hidden w-[232px] shrink-0 px-[28px] pt-[40px] xl:block">
            <toc_1.TableOfContents />
          </aside>
        </div>
      </config_context_1.ApiConfigProvider>
    </div>);
}
