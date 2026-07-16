"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = exports.meta = void 0;
exports.default = AccountRoute;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var meta = function () {
    return [{ title: "Carbon | My Account" }];
};
exports.meta = meta;
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Account"], ["Account"]))),
    to: path_1.path.to.profile,
    module: "account"
};
function AccountRoute() {
    // const { links } = useAccountSubmodules();
    return (<react_1.VStack className="flex w-full h-full items-center justify-start gap-4 bg-card" spacing={0}>
      <div className="w-full shrink-0 border-b border-border">
        <div className="mx-auto w-full max-w-[60rem] px-2 py-8">
          <react_1.Heading size="h3">
            <macro_2.Trans>Account Settings</macro_2.Trans>
          </react_1.Heading>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[60rem] flex-1 min-h-0 overflow-y-auto px-2">
        <div className="grid w-full grid-cols-1 gap-8">
          {/* <DetailSidebar links={links} /> */}
          <react_1.VStack spacing={0} className="h-full w-full">
            <react_router_1.Outlet />
          </react_1.VStack>
        </div>
      </div>
    </react_1.VStack>);
}
var templateObject_1;
