"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ApiReferenceLayout;
var api_nav_1 = require("@/components/api/api-nav");
var config_context_1 = require("@/components/api/config-context");
var configurator_1 = require("@/components/api/configurator");
var toc_1 = require("@/components/api/toc");
var main_header_1 = require("@/components/main-header");
var api_data_1 = require("@/lib/api-data");
function ApiReferenceLayout(_a) {
    var children = _a.children;
    return (<div className="min-h-screen w-full bg-[#FBFBF9]">
      <main_header_1.MainHeader active="api"/>

      <config_context_1.ApiConfigProvider>
        <div className="mx-auto flex w-full max-w-[1480px] pt-[64px]">
          <aside className="sticky top-[64px] hidden h-[calc(100dvh-64px)] w-[280px] shrink-0 overflow-y-auto border-r border-[#E7E7E3] px-[20px] py-[28px] scrollbar-hidden-until-scroll nav-scroll-fade lg:block">
            <configurator_1.Configurator />
            <api_nav_1.ApiNav tree={api_data_1.navTree}/>
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
