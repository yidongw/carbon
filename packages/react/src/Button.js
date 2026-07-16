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
exports.Button = exports.buttonVariants = void 0;
var react_slot_1 = require("@radix-ui/react-slot");
var class_variance_authority_1 = require("class-variance-authority");
var react_1 = require("react");
var Spinner_1 = require("./Spinner");
var cn_1 = require("./utils/cn");
exports.buttonVariants = (0, class_variance_authority_1.cva)([
    "relative font-medium shrink-0 group inline-flex items-center justify-center select-none transform-gpu initial:border-none disabled:opacity-50",
    "focus:!outline-none focus:!ring-0 active:!outline-none active:!ring-0 whitespace-nowrap",
    "after:pointer-events-none after:absolute after:-inset-[3px] after:rounded-lg after:border after:border-blue-500 after:opacity-0 after:ring-2 after:ring-blue-500/20 after:transition-opacity after:duration-150 after:ease-out focus-visible:after:opacity-100 active:after:opacity-0",
    // Transition: background/colors use 'ease' (150ms), transform uses 'ease-out' for responsive press feel
    "transform-gpu transition-[background-color,color,transform,box-shadow] duration-150 ease",
    // Active state: subtle scale down for tactile press feedback
    "active:scale-[0.96] active:duration-75 active:ease-out",
    // Accessibility: respect reduced motion preferences
    "motion-reduce:transform-none motion-reduce:transition-[background-color,color,box-shadow] corner-squircle"
], {
    variants: {
        variant: {
            primary: "bg-gradient-to-br from-primary/90 to-primary text-primary-foreground hover:bg-primary/90 saturate-[105%] shadow-[inset_0px_0.5px_0px_rgb(255_255_255_/_0.32)] before:pointer-events-none before:bg-gradient-to-b before:transition-opacity before:duration-100 before:ease before:from-white/[0.12] before:absolute before:inset-0 before:z-[1] before:rounded before:opacity-0 hover:before:opacity-100 active:before:opacity-0",
            active: "bg-active text-active-foreground hover:bg-active/90 hover:text-active-foreground dark:shadow-button-base before:hidden",
            secondary: "bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 shadow-button-base",
            solid: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-button-base",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[inset_0px_0.5px_0px_rgb(255_255_255_/_0.32)] before:pointer-events-none before:bg-gradient-to-b before:transition-opacity before:duration-100 before:ease before:from-white/[0.12] before:absolute before:inset-0 before:z-[1] before:rounded before:opacity-0 hover:before:opacity-100 active:before:opacity-0",
            ghost: "bg-transparent hover:bg-primary/10 text-accent-foreground hover:text-accent-foreground/90 before:hidden",
            outline: "bg-transparent border border-border text-foreground hover:bg-accent hover:text-accent-foreground before:hidden",
            link: "text-foreground hover:text-foreground underline-offset-4 hover:underline px-0 py-0 before:hidden"
        },
        size: {
            sm: "h-6 rounded-sm text-xs",
            md: "h-8 rounded-md text-sm",
            lg: "h-11 rounded-lg text-base"
        },
        isDisabled: {
            true: "opacity-50 disabled:cursor-not-allowed"
        },
        isLoading: {
            true: "opacity-50 pointer-events-none"
        },
        isIcon: {
            true: "",
            false: ""
        },
        isRound: {
            true: "rounded-full before:rounded-full after:rounded-full",
            false: "rounded-md"
        }
    },
    compoundVariants: [
        {
            size: "sm",
            isIcon: true,
            class: "w-6 p-1"
        },
        {
            size: "md",
            isIcon: true,
            class: "w-8 p-2"
        },
        {
            size: "lg",
            isIcon: true,
            class: "w-11 p-2"
        },
        {
            size: "sm",
            isIcon: false,
            class: "px-2"
        },
        {
            size: "md",
            isIcon: false,
            class: "px-4"
        },
        {
            size: "lg",
            isIcon: false,
            class: "px-6"
        },
        {
            variant: "link",
            size: "sm",
            class: "px-0 py-0"
        },
        {
            variant: "link",
            size: "md",
            class: "px-0 py-0"
        },
        {
            variant: "link",
            size: "lg",
            class: "px-0 py-0"
        }
    ],
    defaultVariants: {
        variant: "primary",
        size: "md",
        isRound: false
    }
});
var Button = (0, react_1.forwardRef)(function (_a, ref) {
    var _b, _c, _d;
    var _e = _a.asChild, asChild = _e === void 0 ? false : _e, className = _a.className, variant = _a.variant, size = _a.size, isDisabled = _a.isDisabled, _f = _a.isIcon, isIcon = _f === void 0 ? false : _f, isLoading = _a.isLoading, _g = _a.isRound, isRound = _g === void 0 ? false : _g, leftIcon = _a.leftIcon, rightIcon = _a.rightIcon, children = _a.children, props = __rest(_a, ["asChild", "className", "variant", "size", "isDisabled", "isIcon", "isLoading", "isRound", "leftIcon", "rightIcon", "children"]);
    var Comp = asChild ? react_slot_1.Slot : "button";
    var onPointerUp = props.onPointerUp, rest = __rest(props, ["onPointerUp"]);
    return (<Comp {...rest} onPointerUp={function (event) {
            onPointerUp === null || onPointerUp === void 0 ? void 0 : onPointerUp(event);
            if (!asChild && event.pointerType === "mouse") {
                event.currentTarget.blur();
            }
        }} className={(0, cn_1.cn)((0, exports.buttonVariants)({
            variant: variant,
            size: size,
            isDisabled: isDisabled,
            isIcon: isIcon,
            isLoading: isLoading,
            isRound: isRound,
            className: className
        }))} type={asChild ? undefined : ((_b = props.type) !== null && _b !== void 0 ? _b : "button")} disabled={isDisabled || props.disabled} role={asChild ? undefined : "button"} ref={ref}>
        {isLoading && <Spinner_1.Spinner className="mr-2 size-4"/>}
        {!isLoading &&
            leftIcon &&
            (0, react_1.cloneElement)(leftIcon, {
                className: !((_c = leftIcon.props) === null || _c === void 0 ? void 0 : _c.size)
                    ? (0, cn_1.cn)("mr-2 h-4 w-4 flex-shrink-0", leftIcon.props.className)
                    : (0, cn_1.cn)("mr-2 flex-shrink-0", leftIcon.props.className)
            })}
        <react_slot_1.Slottable>{children}</react_slot_1.Slottable>
        {rightIcon &&
            (0, react_1.cloneElement)(rightIcon, {
                className: !((_d = rightIcon.props) === null || _d === void 0 ? void 0 : _d.size)
                    ? (0, cn_1.cn)("ml-2 h-4 w-4 flex-shrink-0", rightIcon.props.className)
                    : (0, cn_1.cn)("ml-2 flex-shrink-0", rightIcon.props.className)
            })}
      </Comp>);
});
exports.Button = Button;
Button.displayName = "Button";
