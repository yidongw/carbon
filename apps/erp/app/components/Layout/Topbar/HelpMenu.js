"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var HelpMenu = function () {
    var t = (0, macro_1.useLingui)().t;
    return (<react_1.DropdownMenu>
      <react_1.DropdownMenuTrigger asChild>
        <react_1.IconButton className="hidden sm:flex" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Help"], ["Help"])))} icon={<lu_1.LuCircleHelp />} variant="ghost"/>
      </react_1.DropdownMenuTrigger>
      <react_1.DropdownMenuContent align="end" className="w-48">
        <react_1.DropdownMenuItem asChild>
          <react_router_1.Link to={path_1.path.to.apiIntroduction}>
            <react_1.DropdownMenuIcon icon={<lu_1.LuFiles />}/>
            <macro_1.Trans>API Docs</macro_1.Trans>
          </react_router_1.Link>
        </react_1.DropdownMenuItem>
      </react_1.DropdownMenuContent>
    </react_1.DropdownMenu>);
};
exports.default = HelpMenu;
var templateObject_1;
