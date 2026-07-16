"use client";
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
exports.SelectValue = exports.SelectTrigger = exports.SelectSeparator = exports.SelectScrollUpButton = exports.SelectScrollDownButton = exports.SelectLabel = exports.SelectItem = exports.SelectGroup = exports.SelectContent = exports.Select = void 0;
var SelectPrimitive = require("@radix-ui/react-select");
var class_variance_authority_1 = require("class-variance-authority");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var cn_1 = require("./utils/cn");
var dom_1 = require("./utils/dom");
var Select = SelectPrimitive.Root;
exports.Select = Select;
var SelectGroup = SelectPrimitive.Group;
exports.SelectGroup = SelectGroup;
var SelectValue = SelectPrimitive.Value;
exports.SelectValue = SelectValue;
var selectTriggerVariants = (0, class_variance_authority_1.cva)("bg-transparent text-foreground flex w-full items-center justify-between whitespace-nowrap rounded-md border border-input shadow-xs transition-[color,box-shadow] data-[placeholder]:text-muted-foreground outline-none focus:border-ring focus:ring-[3px] focus:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>span]:line-clamp-1", {
    variants: {
        size: {
            lg: "h-12 px-4 py-3 rounded-lg text-base space-x-4",
            md: "h-10 px-3 py-2 rounded-md text-sm space-x-3",
            sm: "h-8  px-3 py-2 rounded text-xs space-x-2"
        }
    },
    defaultVariants: {
        size: "md"
    }
});
var SelectTrigger = (0, react_1.forwardRef)(function (_a, ref) {
    var size = _a.size, className = _a.className, children = _a.children, hideIcon = _a.hideIcon, inline = _a.inline, props = __rest(_a, ["size", "className", "children", "hideIcon", "inline"]);
    return (<SelectPrimitive.Trigger ref={ref} className={(0, cn_1.cn)(!inline &&
            selectTriggerVariants({
                size: size
            }), className)} {...props}>
    {children}
    {!hideIcon && !inline && (<SelectPrimitive.Icon asChild>
        <lu_1.LuChevronsUpDown className="h-4 w-4 opacity-50"/>
      </SelectPrimitive.Icon>)}
  </SelectPrimitive.Trigger>);
});
exports.SelectTrigger = SelectTrigger;
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
var SelectScrollUpButton = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<SelectPrimitive.ScrollUpButton ref={ref} className={(0, cn_1.cn)("flex cursor-default items-center justify-center py-1", className)} {...props}>
    <lu_1.LuChevronUp />
  </SelectPrimitive.ScrollUpButton>);
});
exports.SelectScrollUpButton = SelectScrollUpButton;
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
var SelectScrollDownButton = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<SelectPrimitive.ScrollDownButton ref={ref} className={(0, cn_1.cn)("flex cursor-default items-center justify-center py-1", className)} {...props}>
    <lu_1.LuChevronDown />
  </SelectPrimitive.ScrollDownButton>);
});
exports.SelectScrollDownButton = SelectScrollDownButton;
SelectScrollDownButton.displayName =
    SelectPrimitive.ScrollDownButton.displayName;
var SelectContent = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, children = _a.children, _b = _a.position, position = _b === void 0 ? "popper" : _b, onCloseAutoFocus = _a.onCloseAutoFocus, props = __rest(_a, ["className", "children", "position", "onCloseAutoFocus"]);
    return (<SelectPrimitive.Portal>
      <SelectPrimitive.Content ref={ref} onCloseAutoFocus={(0, dom_1.preventOverlayCloseAutoFocus)(onCloseAutoFocus)} className={(0, cn_1.cn)("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className)} position={position} {...props}>
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className={(0, cn_1.cn)("p-1", position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] max-h-[300px] overflow-y-auto")}>
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>);
});
exports.SelectContent = SelectContent;
SelectContent.displayName = SelectPrimitive.Content.displayName;
var SelectLabel = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<SelectPrimitive.Label ref={ref} className={(0, cn_1.cn)("px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase", className)} {...props}/>);
});
exports.SelectLabel = SelectLabel;
SelectLabel.displayName = SelectPrimitive.Label.displayName;
var SelectItem = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return (<SelectPrimitive.Item ref={ref} className={(0, cn_1.cn)("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)} {...props}>
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <lu_1.LuCheck className="h-4 w-4"/>
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>);
});
exports.SelectItem = SelectItem;
SelectItem.displayName = SelectPrimitive.Item.displayName;
var SelectSeparator = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<SelectPrimitive.Separator ref={ref} className={(0, cn_1.cn)("-mx-1 my-1 h-px bg-muted", className)} {...props}/>);
});
exports.SelectSeparator = SelectSeparator;
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
