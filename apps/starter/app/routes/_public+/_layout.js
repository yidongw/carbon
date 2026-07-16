"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PublicRoute;
var react_1 = require("@carbon/react");
var react_router_1 = require("react-router");
function PublicRoute() {
    return (<div className="flex min-h-screen min-w-screen">
      <react_1.VStack spacing={8} className="items-center justify-start pt-[20vh] mx-auto max-w-lg z-[3]">
        <react_router_1.Outlet />
      </react_1.VStack>
      {/* <Background /> */}
    </div>);
}
