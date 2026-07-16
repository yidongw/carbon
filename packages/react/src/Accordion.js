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
exports.AccordionTrigger = exports.AccordionItem = exports.AccordionContent = exports.Accordion = void 0;
var AccordionPrimitive = require("@radix-ui/react-accordion");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var cn_1 = require("./utils/cn");
var Accordion = AccordionPrimitive.Root;
exports.Accordion = Accordion;
var AccordionItem = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<AccordionPrimitive.Item ref={ref} className={(0, cn_1.cn)("border-b", className)} {...props}/>);
});
exports.AccordionItem = AccordionItem;
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return (<AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger ref={ref} className={(0, cn_1.cn)("flex flex-1 items-center justify-between py-4 font-medium transition-colors text-muted-foreground hover:text-foreground [&[data-state=open]>svg]:rotate-180", className)} {...props}>
      {children}
      <lu_1.LuChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200"/>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>);
});
exports.AccordionTrigger = AccordionTrigger;
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
var AccordionContent = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return (<AccordionPrimitive.Content ref={ref} className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down" {...props}>
    <div className={(0, cn_1.cn)("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>);
});
exports.AccordionContent = AccordionContent;
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
