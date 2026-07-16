"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = exports.meta = void 0;
exports.default = SettingsRoute;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var Layout_1 = require("~/components/Layout");
var Navigation_1 = require("~/components/Layout/Navigation");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
var meta = function () {
    return [{ title: "Carbon | Settings" }];
};
exports.meta = meta;
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Settings"], ["Settings"]))),
    to: path_1.path.to.company,
    module: "settings"
};
function SettingsRoute() {
    var groups = (0, settings_1.useSettingsSubmodules)().groups;
    return (<Navigation_1.CollapsibleSidebarProvider>
      <div className="flex flex-col md:grid md:grid-cols-[auto_1fr] w-full h-full bg-card">
        <Layout_1.GroupedContentSidebar groups={groups}/>
        <react_1.VStack spacing={0} className="overflow-y-auto overscroll-contain scrollbar-hide flex-1 min-h-0">
          <react_router_1.Outlet />
        </react_1.VStack>
      </div>
    </Navigation_1.CollapsibleSidebarProvider>);
}
var templateObject_1;
