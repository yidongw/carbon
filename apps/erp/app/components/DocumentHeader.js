"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var DocumentHeader = function (_a) {
    var title = _a.title, subtitle = _a.subtitle, status = _a.status, menuItems = _a.menuItems, actions = _a.actions;
    var t = (0, macro_1.useLingui)().t;
    return (<react_1.CardHeader className="flex-row items-center justify-between">
      <div>
        <react_1.HStack>
          <react_1.Heading as="h1" size="h3">
            {title}
          </react_1.Heading>
          <react_1.Copy text={title}/>
          {menuItems && (<react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["More options"], ["More options"])))} icon={<lu_1.LuEllipsisVertical />} variant="secondary" size="sm"/>
              </react_1.DropdownMenuTrigger>
              <react_1.DropdownMenuContent>{menuItems}</react_1.DropdownMenuContent>
            </react_1.DropdownMenu>)}
          {status}
        </react_1.HStack>
        {subtitle && (<p className="text-sm text-muted-foreground">{subtitle}</p>)}
      </div>
      {actions && <react_1.HStack>{actions}</react_1.HStack>}
    </react_1.CardHeader>);
};
exports.default = DocumentHeader;
var templateObject_1;
