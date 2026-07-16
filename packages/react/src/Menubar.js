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
exports.MenubarItem = exports.Menubar = void 0;
var react_1 = require("react");
var Button_1 = require("./Button");
var cn_1 = require("./utils/cn");
var Menubar = (0, react_1.forwardRef)(function (_a, ref) {
    var children = _a.children, className = _a.className, props = __rest(_a, ["children", "className"]);
    return (<div {...props} className={(0, cn_1.cn)("min-h-[2.5rem] flex items-center bg-card border border-border rounded-lg justify-start p-1 w-full space-x-1 scrollbar-hide dark:border-none dark:shadow-[inset_0_0.5px_0_rgb(255_255_255_/_0.08),_inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]", className)}>
        {children}
      </div>);
});
exports.Menubar = Menubar;
Menubar.displayName = "Menubar";
var MenubarItem = (0, react_1.forwardRef)(function (_a, ref) {
    var children = _a.children, props = __rest(_a, ["children"]);
    return (<Button_1.Button className="rounded-md" ref={ref} variant="ghost" {...props}>
        {children}
      </Button_1.Button>);
});
exports.MenubarItem = MenubarItem;
MenubarItem.displayName = "MenubarItem";
