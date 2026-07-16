"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var UserStatus;
(function (UserStatus) {
    UserStatus[UserStatus["Active"] = 0] = "Active";
    UserStatus[UserStatus["Inactive"] = 1] = "Inactive";
    UserStatus[UserStatus["None"] = 2] = "None";
})(UserStatus || (UserStatus = {}));
var Contact = function (_a) {
    var _b;
    var contact = _a.contact, url = _a.url, user = _a.user, actions = _a.actions;
    var t = (0, macro_1.useLingui)().t;
    var formatPersonName = (0, hooks_1.useFormatPersonName)();
    var name = formatPersonName({
        firstName: contact.firstName,
        lastName: contact.lastName
    });
    var userStatus = user
        ? user.active
            ? UserStatus.Active
            : UserStatus.Inactive
        : UserStatus.None;
    return (<div className="grid w-full gap-4 grid-cols-[auto_1fr_auto]">
      <react_1.Avatar size="sm" name={"".concat(name)}/>
      <react_1.VStack spacing={0}>
        <react_1.HStack>
          {url ? (<react_router_1.Link to={url}>
              <p className="text-sm font-bold">{name}</p>
            </react_router_1.Link>) : (<p className="text-sm font-bold">{name}</p>)}

          {userStatus === UserStatus.Active && (<span title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Active"], ["Active"])))} className="inline-block bg-emerald-400 rounded-full w-3 h-3 ml-1.5"/>)}
          {userStatus === UserStatus.Inactive && (<span title={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Inactive"], ["Inactive"])))} className="inline-block bg-red-400 rounded-full w-3 h-3 ml-1.5"/>)}
        </react_1.HStack>

        <p className="text-sm text-muted-foreground line-clamp-1">
          {(_b = contact.email) !== null && _b !== void 0 ? _b : ""}
        </p>
      </react_1.VStack>
      {actions.length > 0 && (<react_1.ActionMenu>
          {actions.map(function (action) { return (<react_1.DropdownMenuItem key={action.label} onClick={action.onClick}>
              {action.icon && <react_1.DropdownMenuIcon icon={action.icon}/>}
              {action.label}
            </react_1.DropdownMenuItem>); })}
        </react_1.ActionMenu>)}
    </div>);
};
exports.default = Contact;
var templateObject_1, templateObject_2;
