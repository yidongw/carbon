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
exports.CardTitle = exports.CardHeader = exports.CardFooter = exports.CardDescription = exports.CardContent = exports.CardAttributeValue = exports.CardAttributes = exports.CardAttributeLabel = exports.CardAttribute = exports.CardAction = exports.Card = void 0;
var macro_1 = require("@lingui/react/macro");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var IconButton_1 = require("./IconButton");
var cn_1 = require("./utils/cn");
var CardContext = (0, react_1.createContext)(undefined);
var Card = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, _b = _a.isCollapsible, isCollapsible = _b === void 0 ? false : _b, _c = _a.defaultCollapsed, defaultCollapsed = _c === void 0 ? false : _c, controlledIsCollapsed = _a.isCollapsed, onCollapsedChange = _a.onCollapsedChange, children = _a.children, props = __rest(_a, ["className", "isCollapsible", "defaultCollapsed", "isCollapsed", "onCollapsedChange", "children"]);
    var t = (0, macro_1.useLingui)().t;
    var _d = (0, react_1.useState)(defaultCollapsed), uncontrolledIsCollapsed = _d[0], setUncontrolledIsCollapsed = _d[1];
    var isCollapsed = controlledIsCollapsed !== null && controlledIsCollapsed !== void 0 ? controlledIsCollapsed : uncontrolledIsCollapsed;
    var toggle = function () {
        if (onCollapsedChange) {
            onCollapsedChange(!isCollapsed);
        }
        else {
            setUncontrolledIsCollapsed(!isCollapsed);
        }
    };
    return (<CardContext.Provider value={{ isCollapsed: isCollapsed, toggle: toggle }}>
        <div ref={ref} className={(0, cn_1.cn)("relative flex flex-col rounded-2xl shadow-button-base dark:shadow-[inset_0_0.5px_0_rgb(255_255_255_/_0.08),_inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)] bg-accent dark:bg-card text-card-foreground p-0 w-full", className)} {...props}>
          {isCollapsible && (<IconButton_1.IconButton aria-label={isCollapsed ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Expand"], ["Expand"]))) : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Collapse"], ["Collapse"])))} variant="ghost" onClick={toggle} className="absolute right-2 top-2" icon={isCollapsed ? (<lu_1.LuChevronDown className="size-6"/>) : (<lu_1.LuChevronUp className="size-6"/>)}/>)}
          {children}
        </div>
      </CardContext.Provider>);
});
exports.Card = Card;
Card.displayName = "Card";
var CardAction = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div ref={ref} className={(0, cn_1.cn)("flex flex-col py-2 px-4", className)} {...props}/>);
});
exports.CardAction = CardAction;
CardAction.displayName = "CardAction";
var CardAttribute = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div ref={ref} className={(0, cn_1.cn)("flex flex-row md:flex-col items-start justify-start gap-2", className)} {...props}/>);
});
exports.CardAttribute = CardAttribute;
CardAttribute.displayName = "CardAttribute";
var CardAttributes = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div ref={ref} className={(0, cn_1.cn)("flex flex-col md:flex-row gap-8", className)} {...props}/>);
});
exports.CardAttributes = CardAttributes;
CardAttributes.displayName = "CardAttributes";
var CardAttributeLabel = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div ref={ref} className={(0, cn_1.cn)("font-medium text-xs text-muted-foreground", className)} {...props}/>);
});
exports.CardAttributeLabel = CardAttributeLabel;
CardAttributeLabel.displayName = "CardAttributeLabel";
var CardAttributeValue = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div ref={ref} className={(0, cn_1.cn)("font-medium text-sm text-foreground", className)} {...props}/>);
});
exports.CardAttributeValue = CardAttributeValue;
CardAttributeValue.displayName = "CardAttributeValue";
var CardHeader = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    var context = (0, react_1.useContext)(CardContext);
    var handleClick = function () {
        if (context === null || context === void 0 ? void 0 : context.isCollapsed) {
            context.toggle();
        }
    };
    return (<div ref={ref} className={(0, cn_1.cn)("flex flex-col gap-1 px-6 py-4 text-muted-foreground", (context === null || context === void 0 ? void 0 : context.isCollapsed) && "cursor-pointer", className)} onClick={handleClick} {...props}/>);
});
exports.CardHeader = CardHeader;
CardHeader.displayName = "CardHeader";
var CardTitle = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<h3 ref={ref} className={(0, cn_1.cn)("text-base font-medium font-headline leading-none tracking-tight text-foreground/90 text-pretty line-clamp-2", className)} {...props}/>);
});
exports.CardTitle = CardTitle;
CardTitle.displayName = "CardTitle";
var CardDescription = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<p ref={ref} className={(0, cn_1.cn)("text-xs text-muted-foreground tracking-tight", className)} {...props}/>);
});
exports.CardDescription = CardDescription;
CardDescription.displayName = "CardDescription";
var CardContent = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    var context = (0, react_1.useContext)(CardContext);
    if (context === null || context === void 0 ? void 0 : context.isCollapsed) {
        return null;
    }
    return (<div ref={ref} className={(0, cn_1.cn)("flex flex-col flex-1 p-6 rounded-2xl border border-border bg-card dark:bg-muted/40", className)} {...props}/>);
});
exports.CardContent = CardContent;
CardContent.displayName = "CardContent";
var CardFooter = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    var context = (0, react_1.useContext)(CardContext);
    if (context === null || context === void 0 ? void 0 : context.isCollapsed) {
        return null;
    }
    return (<div ref={ref} className={(0, cn_1.cn)("flex items-center py-4 px-6 gap-2", className)} {...props}/>);
});
exports.CardFooter = CardFooter;
CardFooter.displayName = "CardFooter";
var templateObject_1, templateObject_2;
