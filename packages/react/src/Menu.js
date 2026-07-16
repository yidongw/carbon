"use strict";
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
exports.MenuSubTrigger = exports.MenuSubContent = exports.MenuSub = exports.MenuShortcut = exports.MenuSeparator = exports.MenuRadioItem = exports.MenuRadioGroup = exports.MenuLabel = exports.MenuItem = exports.MenuIcon = exports.MenuGroup = exports.MenuCheckboxItem = exports.Menu = void 0;
var react_1 = require("react");
var Context_1 = require("./Context");
var Dropdown_1 = require("./Dropdown");
var MenuTypeContext = (0, react_1.createContext)("dropdown");
var MenuTypeProvider = MenuTypeContext.Provider;
var Menu = function (_a) {
    var _b = _a.type, type = _b === void 0 ? "dropdown" : _b, props = __rest(_a, ["type"]);
    return <MenuTypeProvider value={type} {...props}/>;
};
exports.Menu = Menu;
var useMenuType = function () {
    var type = (0, react_1.useContext)(MenuTypeContext);
    return type;
};
var MenuCheckboxItem = (0, react_1.forwardRef)(function (props, ref) {
    var type = useMenuType();
    if (type === "context") {
        return <Context_1.ContextMenuCheckboxItem {...props} ref={ref}/>;
    }
    return <Dropdown_1.DropdownMenuCheckboxItem {...props} ref={ref}/>;
});
exports.MenuCheckboxItem = MenuCheckboxItem;
MenuCheckboxItem.displayName = "MenuCheckboxItem";
var MenuGroup = (0, react_1.forwardRef)(function (props, ref) {
    var type = useMenuType();
    if (type === "context") {
        return <Context_1.ContextMenuGroup {...props} ref={ref}/>;
    }
    return <Dropdown_1.DropdownMenuGroup {...props} ref={ref}/>;
});
exports.MenuGroup = MenuGroup;
MenuGroup.displayName = "MenuGroup";
var MenuIcon = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <Dropdown_1.DropdownMenuIcon ref={ref} {...props}/>;
});
exports.MenuIcon = MenuIcon;
MenuIcon.displayName = "MenuIcon";
var MenuItem = (0, react_1.forwardRef)(function (props, ref) {
    var type = useMenuType();
    if (type === "context") {
        return <Context_1.ContextMenuItem {...props} ref={ref}/>;
    }
    return <Dropdown_1.DropdownMenuItem {...props} ref={ref}/>;
});
exports.MenuItem = MenuItem;
MenuItem.displayName = "MenuItem";
var MenuLabel = (0, react_1.forwardRef)(function (props, ref) {
    var type = useMenuType();
    if (type === "context") {
        return <Context_1.ContextMenuLabel {...props} ref={ref}/>;
    }
    return <Dropdown_1.DropdownMenuLabel {...props} ref={ref}/>;
});
exports.MenuLabel = MenuLabel;
MenuLabel.displayName = "MenuLabel";
var MenuRadioGroup = (0, react_1.forwardRef)(function (props, ref) {
    var type = useMenuType();
    if (type === "context") {
        return <Context_1.ContextMenuRadioGroup {...props} ref={ref}/>;
    }
    return <Dropdown_1.DropdownMenuRadioGroup {...props} ref={ref}/>;
});
exports.MenuRadioGroup = MenuRadioGroup;
MenuRadioGroup.displayName = "MenuRadioGroup";
var MenuRadioItem = (0, react_1.forwardRef)(function (props, ref) {
    var type = useMenuType();
    if (type === "context") {
        return <Context_1.ContextMenuRadioItem {...props} ref={ref}/>;
    }
    return <Dropdown_1.DropdownMenuRadioItem {...props} ref={ref}/>;
});
exports.MenuRadioItem = MenuRadioItem;
MenuRadioItem.displayName = "MenuRadioItem";
var MenuSeparator = (0, react_1.forwardRef)(function (props, ref) {
    var type = useMenuType();
    if (type === "context") {
        return <Context_1.ContextMenuSeparator {...props} ref={ref}/>;
    }
    return <Dropdown_1.DropdownMenuSeparator {...props}/>;
});
exports.MenuSeparator = MenuSeparator;
MenuSeparator.displayName = "MenuSeparator";
var MenuShortcut = function (props) {
    var type = useMenuType();
    if (type === "context") {
        return <Context_1.ContextMenuShortcut {...props}/>;
    }
    return <Dropdown_1.DropdownMenuShortcut {...props}/>;
};
exports.MenuShortcut = MenuShortcut;
var MenuSub = function (props) {
    var type = useMenuType();
    if (type === "context") {
        return <Context_1.ContextMenuSub {...props}/>;
    }
    return <Dropdown_1.DropdownMenuSub {...props}/>;
};
exports.MenuSub = MenuSub;
var MenuSubContent = (0, react_1.forwardRef)(function (props, ref) {
    var type = useMenuType();
    if (type === "context") {
        return <Context_1.ContextMenuSubContent {...props} ref={ref}/>;
    }
    return <Dropdown_1.DropdownMenuSubContent {...props} ref={ref}/>;
});
exports.MenuSubContent = MenuSubContent;
MenuSubContent.displayName = "MenuSubContent";
var MenuSubTrigger = (0, react_1.forwardRef)(function (props, ref) {
    var type = useMenuType();
    if (type === "context") {
        return <Context_1.ContextMenuSubTrigger {...props} ref={ref}/>;
    }
    return <Dropdown_1.DropdownMenuSubTrigger {...props} ref={ref}/>;
});
exports.MenuSubTrigger = MenuSubTrigger;
MenuSubTrigger.displayName = "MenuSubTrigger";
