"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionMenu = void 0;
var macro_1 = require("@lingui/react/macro");
var react_1 = require("react");
var bs_1 = require("react-icons/bs");
var Dropdown_1 = require("./Dropdown");
var IconButton_1 = require("./IconButton");
var Menu_1 = require("./Menu");
var TAP_MOVEMENT_THRESHOLD = 8;
var ActionMenu = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    var t = (0, macro_1.useLingui)().t;
    var pointerStart = (0, react_1.useRef)(null);
    var suppressTap = (0, react_1.useRef)(false);
    var onPointerDown = function (event) {
        pointerStart.current = { x: event.clientX, y: event.clientY };
        suppressTap.current = false;
        event.stopPropagation();
    };
    var onPointerMove = function (event) {
        var start = pointerStart.current;
        if (!start || suppressTap.current)
            return;
        var deltaX = Math.abs(event.clientX - start.x);
        var deltaY = Math.abs(event.clientY - start.y);
        if (deltaX > TAP_MOVEMENT_THRESHOLD || deltaY > TAP_MOVEMENT_THRESHOLD) {
            suppressTap.current = true;
        }
    };
    var onPointerUp = function (event) {
        if (suppressTap.current) {
            event.preventDefault();
            event.stopPropagation();
        }
        pointerStart.current = null;
    };
    var onClick = function (event) {
        if (suppressTap.current) {
            event.preventDefault();
            event.stopPropagation();
            suppressTap.current = false;
            return;
        }
        event.stopPropagation();
    };
    return (<Menu_1.Menu type="dropdown">
      <Dropdown_1.DropdownMenu modal={false}>
        <Dropdown_1.DropdownMenuTrigger asChild>
          <IconButton_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Action Menu"], ["Action Menu"])))} variant="secondary" icon={<bs_1.BsThreeDotsVertical />} 
    // Stop at pointerdown for parents that activate on pointer events
    // (drag handlers, row navigation) and at click as a fallback.
    onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onClick={onClick} {...props}/>
        </Dropdown_1.DropdownMenuTrigger>
        <Dropdown_1.DropdownMenuContent align="end" className="w-56">
          {children}
        </Dropdown_1.DropdownMenuContent>
      </Dropdown_1.DropdownMenu>
    </Menu_1.Menu>);
};
exports.ActionMenu = ActionMenu;
var templateObject_1;
