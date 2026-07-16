"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var DetailSidebar = function (_a) {
    var links = _a.links;
    var navigate = (0, react_router_1.useNavigate)();
    var location = (0, hooks_1.useOptimisticLocation)();
    var prettifyShortcut = (0, react_1.usePrettifyShortcut)();
    (0, react_1.useKeyboardShortcuts)(links.reduce(function (acc, link) {
        if (link.shortcut) {
            acc[link.shortcut] = function () { return navigate(link.to); };
        }
        return acc;
    }, {}));
    return (<react_1.VStack className="overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent h-full" spacing={1}>
      {links.map(function (route) {
            var isActive = location.pathname.includes(route.to);
            return (<react_1.Tooltip key={route.name}>
            <react_1.TooltipTrigger className="w-full">
              <react_1.Button asChild variant={isActive ? "active" : "ghost"} className="w-full justify-start">
                <react_router_1.Link to={route.to} prefetch="intent" className="flex items-center justify-start gap-2">
                  {route.icon}
                  <span>{route.name}</span>
                  {route.count !== undefined && (<react_1.Count count={route.count} className="ml-auto"/>)}
                </react_router_1.Link>
              </react_1.Button>
            </react_1.TooltipTrigger>
            {route.shortcut && (<react_1.TooltipContent side="right">
                <react_1.HStack>{prettifyShortcut(route.shortcut)}</react_1.HStack>
              </react_1.TooltipContent>)}
          </react_1.Tooltip>);
        })}
    </react_1.VStack>);
};
exports.default = DetailSidebar;
