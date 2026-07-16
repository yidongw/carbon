"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var DetailTopbar = function (_a) {
    var links = _a.links, _b = _a.preserveParams, preserveParams = _b === void 0 ? false : _b;
    var navigate = (0, react_router_1.useNavigate)();
    var location = (0, hooks_1.useOptimisticLocation)();
    var params = (0, hooks_1.useUrlParams)()[0];
    var prettifyShortcut = (0, react_1.usePrettifyShortcut)();
    (0, react_1.useKeyboardShortcuts)(links.reduce(function (acc, link) {
        if (link.shortcut) {
            acc[link.shortcut] = function () {
                var url = preserveParams
                    ? "".concat(link.to, "?").concat(params.toString())
                    : link.to;
                navigate(url);
            };
        }
        return acc;
    }, {}));
    return (<div className="inline-flex h-9 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]  border-b border-border">
      {links.map(function (route) {
            var isActive = route.isActive
                ? route.isActive(location.pathname)
                : location.pathname.includes(route.to);
            var linkTo = preserveParams
                ? "".concat(route.to, "?").concat(params.toString())
                : route.to;
            return (<react_1.Tooltip key={route.name}>
            <react_1.TooltipTrigger className="w-full">
              <react_router_1.Link to={linkTo} prefetch="intent" className={(0, react_1.cn)("inline-flex items-center justify-center whitespace-nowrap rounded-[6px] px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", isActive && "bg-background text-foreground shadow-button-base")}>
                {route.icon && <route.icon className="mr-2"/>}
                <span>{route.name}</span>
                {route.count !== undefined && (<react_1.Count count={route.count} className="ml-auto"/>)}
              </react_router_1.Link>
            </react_1.TooltipTrigger>
            {route.shortcut && (<react_1.TooltipContent side="bottom">
                <react_1.HStack>{prettifyShortcut(route.shortcut)}</react_1.HStack>
              </react_1.TooltipContent>)}
          </react_1.Tooltip>);
        })}
    </div>);
};
exports.default = DetailTopbar;
