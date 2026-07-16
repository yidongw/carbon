"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PublicRoute;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
function PublicRoute() {
    return (<react_1.TooltipProvider>
      <div className="container relative h-full flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 lg:flex dark:border-r dark:bg-zinc-900 bg-zinc-100">
          <img src="/carbon-word-light.svg" alt="Carbon Logo" className={(0, react_1.cn)("max-w-[200px] mb-3 dark:hidden z-50", auth_1.CONTROLLED_ENVIRONMENT && "grayscale")}/>
          <img src="/carbon-word-dark.svg" alt="Carbon Logo" className={(0, react_1.cn)("max-w-[200px] mb-3 dark:block hidden z-50", auth_1.CONTROLLED_ENVIRONMENT && "grayscale")}/>

          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <react_1.Heading size="display" className="text-foreground">
                <macro_1.Trans>Let's build something</macro_1.Trans>
                <span className="inline-block">
                  <span className="loading-dot">.</span>
                  <span className="loading-dot">.</span>
                  <span className="loading-dot">.</span>
                </span>
              </react_1.Heading>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] ">
            <react_router_1.Outlet />
          </div>
        </div>
      </div>
    </react_1.TooltipProvider>);
}
