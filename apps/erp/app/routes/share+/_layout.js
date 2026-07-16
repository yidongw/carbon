"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExternalLayout;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
function ExternalLayout() {
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var mode = (0, react_1.useMode)();
    var revalidator = (0, react_router_1.useRevalidator)();
    return (<react_1.TooltipProvider>
      <div className="w-screen min-h-screen flex flex-col items-center justify-center">
        <div className="absolute top-4 right-4">
          <react_1.HStack>
            <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Refresh"], ["Refresh"])))} variant="ghost" size="sm" icon={<lu_1.LuRefreshCw />} onClick={function () { return revalidator.revalidate(); }}/>
            <react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Toggle dark/light mode"], ["Toggle dark/light mode"])))} variant="ghost" size="sm" icon={mode === "dark" ? <lu_1.LuMoon /> : <lu_1.LuSun />}/>
              </react_1.DropdownMenuTrigger>
              <react_1.DropdownMenuContent align="end">
                <react_1.DropdownMenuItem onClick={function () {
            fetcher.submit({ mode: "light" }, { method: "post", action: "/" });
        }}>
                  <lu_1.LuSun className="mr-2 h-4 w-4"/>
                  Light
                </react_1.DropdownMenuItem>
                <react_1.DropdownMenuItem onClick={function () {
            fetcher.submit({ mode: "dark" }, { method: "post", action: "/" });
        }}>
                  <lu_1.LuMoon className="mr-2 h-4 w-4"/>
                  Dark
                </react_1.DropdownMenuItem>
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>
          </react_1.HStack>
        </div>
        <react_router_1.Outlet />
      </div>
    </react_1.TooltipProvider>);
}
var templateObject_1, templateObject_2;
