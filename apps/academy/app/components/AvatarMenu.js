"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var AvatarMenu = function (_a) {
    var className = _a.className;
    var user = (0, hooks_1.useUser)();
    var name = "".concat(user.firstName, " ").concat(user.lastName);
    var mode = (0, react_1.useMode)();
    var nextMode = mode === "dark" ? "light" : "dark";
    var modeSubmitRef = (0, react_2.useRef)(null);
    var fetcher = (0, react_router_1.useFetcher)();
    var _b = (0, react_2.useState)(false), isOpen = _b[0], setIsOpen = _b[1];
    return (<react_1.DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <react_1.DropdownMenuTrigger className={(0, react_1.cn)("outline-none focus-visible:outline-none cursor-pointer", className)}>
        <components_1.Avatar path={user.avatarUrl} name={name}/>
      </react_1.DropdownMenuTrigger>
      <react_1.DropdownMenuContent align="end" className="w-56">
        <react_1.DropdownMenuLabel>Signed in as {name}</react_1.DropdownMenuLabel>
        <react_1.DropdownMenuSeparator />
        <react_1.DropdownMenuItem asChild>
          <react_router_1.Link to={path_1.path.to.dashboard}>
            <react_1.DropdownMenuIcon icon={<lu_1.LuHouse />}/>
            Dashboard
          </react_router_1.Link>
        </react_1.DropdownMenuItem>
        <react_1.DropdownMenuSeparator />
        <react_1.DropdownMenuItem asChild>
          <react_router_1.Link to={path_1.path.to.accountSettings}>
            <react_1.DropdownMenuIcon icon={<lu_1.LuUser />}/>
            Account Settings
          </react_router_1.Link>
        </react_1.DropdownMenuItem>
        <react_1.DropdownMenuSeparator />
        <react_1.DropdownMenuItem onSelect={function (e) { return e.preventDefault(); }}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center justify-start">
              <react_1.DropdownMenuIcon icon={mode === "dark" ? <lu_1.LuMoon /> : <lu_1.LuSun />}/>
              Dark Mode
            </div>
            <div>
              <react_1.Switch checked={mode === "dark"} onCheckedChange={function () { var _a; return (_a = modeSubmitRef.current) === null || _a === void 0 ? void 0 : _a.click(); }}/>
              <fetcher.Form action={path_1.path.to.root} method="post" onSubmit={function () {
            document.body.removeAttribute("style");
        }} className="sr-only">
                <input type="hidden" name="mode" value={nextMode}/>
                <button ref={modeSubmitRef} className="sr-only" type="submit"/>
              </fetcher.Form>
            </div>
          </div>
        </react_1.DropdownMenuItem>
        <react_1.DropdownMenuSeparator />
        <react_1.DropdownMenuItem onSelect={function (e) { return e.preventDefault(); }}>
          <react_router_1.Form method="post" action={path_1.path.to.logout}>
            <button type="submit" className="w-full flex items-center">
              <react_1.DropdownMenuIcon icon={<lu_1.LuLogOut />}/>
              <span>Sign Out</span>
            </button>
          </react_router_1.Form>
        </react_1.DropdownMenuItem>
      </react_1.DropdownMenuContent>
    </react_1.DropdownMenu>);
};
exports.default = AvatarMenu;
