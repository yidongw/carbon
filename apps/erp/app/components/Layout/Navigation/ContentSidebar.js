"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var CollapsibleSidebar_1 = require("./CollapsibleSidebar");
var ContentSidebar = function (_a) {
    var _b;
    var links = _a.links;
    var isMobile = (0, react_1.useIsMobile)();
    var location = (0, hooks_1.useOptimisticLocation)();
    var params = (0, hooks_1.useUrlParams)()[0];
    var filter = (_b = params.get("q")) !== null && _b !== void 0 ? _b : undefined;
    if (isMobile) {
        return (<div className="flex items-center gap-1 px-2 py-1.5 bg-card border-b border-border overflow-x-auto shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {links.map(function (route) {
                var isActive = location.pathname.includes(route.to) && route.q === filter;
                return (<react_1.Button key={route.name} asChild leftIcon={route.icon} variant={isActive ? "active" : "ghost"} size="sm" className="shrink-0">
              <react_router_1.Link to={route.to + (route.q ? "?q=".concat(route.q) : "")} prefetch="intent" replace>
                {route.name}
              </react_router_1.Link>
            </react_1.Button>);
            })}
      </div>);
    }
    return (<CollapsibleSidebar_1.CollapsibleSidebar>
      <div className="overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent h-full w-full pb-8">
        <react_1.VStack>
          <react_1.VStack spacing={1} className="p-2">
            {links.map(function (route) {
            var isActive = location.pathname.includes(route.to) && route.q === filter;
            return (<react_1.Button key={route.name} asChild leftIcon={route.icon} variant={isActive ? "active" : "ghost"} className="w-full justify-start">
                  <react_router_1.Link to={route.to + (route.q ? "?q=".concat(route.q) : "")} prefetch="intent">
                    {route.name}
                  </react_router_1.Link>
                </react_1.Button>);
        })}
          </react_1.VStack>
        </react_1.VStack>
      </div>
    </CollapsibleSidebar_1.CollapsibleSidebar>);
};
exports.default = ContentSidebar;
