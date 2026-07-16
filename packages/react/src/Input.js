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
exports.InputRightElement = exports.InputRightAddon = exports.InputLeftElement = exports.InputLeftAddon = exports.InputGroup = exports.Input = exports.inputVariants = void 0;
var class_variance_authority_1 = require("class-variance-authority");
var react_1 = require("react");
var ReactAria = require("react-aria-components");
var cn_1 = require("./utils/cn");
var react_2 = require("./utils/react");
var InputGroupContext = (0, react_1.createContext)(false);
var inputGroupVariants = (0, class_variance_authority_1.cva)("flex relative w-full bg-transparent text-foreground focus-within:outline-none border border-input", {
    variants: {
        size: {
            lg: "h-12 rounded-lg",
            md: "h-10 rounded-md",
            sm: "h-8 rounded-md",
            xs: "h-6 rounded"
        },
        isDisabled: {
            true: "opacity-50 disabled:cursor-not-allowed",
            false: ""
        },
        isInvalid: {
            true: "border-destructive focus-within:ring-destructive",
            false: ""
        },
        insetRing: {
            false: "outline-none focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
            true: "focus-within:outline-none focus-within:box-shadow-[inset 0 0 0 2px var(--ring-color)]"
        }
    },
    defaultVariants: {
        size: "md",
        isDisabled: false,
        isInvalid: false,
        insetRing: false
    }
});
var InputGroup = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, _b = _a.isInvalid, isInvalid = _b === void 0 ? false : _b, _c = _a.isDisabled, isDisabled = _c === void 0 ? false : _c, insetRing = _a.insetRing, size = _a.size, children = _a.children, props = __rest(_a, ["className", "isInvalid", "isDisabled", "insetRing", "size", "children"]);
    var validChildren = (0, react_2.getValidChildren)(children);
    var _children = validChildren.map(function (child, index) {
        return (0, react_1.cloneElement)(child, {
            isFirstChild: index === 0,
            isLastChild: index === validChildren.length - 1,
            className: child.props.className,
            childtype: child.type,
            size: size,
            isInvalid: isInvalid,
            isDisabled: isDisabled,
            key: index
        });
    });
    return (<InputGroupContext.Provider value={true}>
        <div className={(0, cn_1.cn)(inputGroupVariants({
            size: size,
            isDisabled: isDisabled,
            isInvalid: isInvalid,
            insetRing: insetRing,
            className: className
        }))} {...props} ref={ref}>
          {_children}
        </div>
      </InputGroupContext.Provider>);
});
exports.InputGroup = InputGroup;
InputGroup.displayName = "InputGroup";
exports.inputVariants = (0, class_variance_authority_1.cva)("flex w-full px-3 py-1 bg-transparent text-foreground transition-colors placeholder:text-muted-foreground disabled:opacity-50 rounded-md ", {
    variants: {
        size: {
            lg: "h-12 rounded-lg px-4 text-base",
            md: "h-10 rounded-md px-4 text-sm",
            sm: "h-8 rounded-md px-3 text-sm",
            xs: "h-6 rounded px-2 text-sm"
        },
        isInputGroup: {
            true: "h-auto outline-none focus-within:outline-none",
            false: "border border-input shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed file:border-0 file:bg-transparent file:text-sm file:font-medium"
        },
        isFirstChild: {
            true: "",
            false: ""
        },
        isLastChild: {
            true: "",
            false: ""
        },
        isInvalid: {
            true: "border-destructive ring-destructive focus-visible:ring-destructive",
            false: ""
        },
        isReadOnly: {
            true: "text-muted-foreground",
            false: ""
        },
        isDisabled: {
            true: "text-muted-foreground",
            false: ""
        },
        borderless: {
            true: "border-none px-0 outline-none ring-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:ring-transparent focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none",
            false: ""
        }
    },
    compoundVariants: [
        {
            isFirstChild: false,
            isInputGroup: true,
            class: "rounded-l-none border-l-0"
        },
        {
            isLastChild: false,
            isInputGroup: true,
            class: "rounded-r-none border-r-0"
        },
        {
            isInvalid: true,
            isInputGroup: false,
            class: "focus-visible:ring-destructive"
        }
    ],
    defaultVariants: {
        size: "md",
        isInputGroup: false,
        isFirstChild: false,
        isLastChild: false,
        isInvalid: false,
        borderless: false
    }
});
var Input = (0, react_1.forwardRef)(function (_a, ref) {
    var _b;
    var className = _a.className, size = _a.size, _c = _a.isFirstChild, isFirstChild = _c === void 0 ? true : _c, _d = _a.isLastChild, isLastChild = _d === void 0 ? true : _d, _e = _a.isInvalid, isInvalid = _e === void 0 ? false : _e, _f = _a.isDisabled, isDisabled = _f === void 0 ? false : _f, _g = _a.isReadOnly, isReadOnly = _g === void 0 ? false : _g, _h = _a.borderless, borderless = _h === void 0 ? false : _h, _j = _a.type, type = _j === void 0 ? "text" : _j, props = __rest(_a, ["className", "size", "isFirstChild", "isLastChild", "isInvalid", "isDisabled", "isReadOnly", "borderless", "type"]);
    var isInputGroup = (_b = (0, react_1.useContext)(InputGroupContext)) !== null && _b !== void 0 ? _b : false;
    return (<ReactAria.Input className={(0, cn_1.cn)((0, exports.inputVariants)({
            size: size,
            isInputGroup: isInputGroup,
            isFirstChild: isFirstChild,
            isLastChild: isLastChild,
            isInvalid: isInvalid,
            isReadOnly: isReadOnly,
            isDisabled: isDisabled,
            borderless: borderless
        }), className)} {...props} disabled={isDisabled} readOnly={isReadOnly} ref={ref} type={type}/>);
});
exports.Input = Input;
Input.displayName = "Input";
var inputAddonVariants = (0, class_variance_authority_1.cva)("flex items-center justify-center bg-muted text-muted-foreground border border-input", {
    variants: {
        placement: {
            left: "",
            right: ""
        },
        size: {
            lg: "h-12 px-3",
            md: "h-10 px-3",
            sm: "h-8 px-2",
            xs: "h-6 px-1"
        },
        isDisabled: {
            true: "opacity-50 cursor-not-allowed bg-muted text-muted-foreground",
            false: ""
        }
    },
    compoundVariants: [
        {
            placement: "left",
            size: "lg",
            class: "rounded-l-lg"
        },
        {
            placement: "left",
            size: "md",
            class: "rounded-l-md"
        },
        {
            placement: "left",
            size: "sm",
            class: "rounded-l"
        },
        {
            placement: "left",
            size: "xs",
            class: "rounded-l"
        },
        {
            placement: "right",
            size: "lg",
            class: "rounded-r-lg"
        },
        {
            placement: "right",
            size: "md",
            class: "rounded-r-md"
        },
        {
            placement: "right",
            size: "sm",
            class: "rounded-r"
        },
        {
            placement: "right",
            size: "xs",
            class: "rounded-r"
        }
    ],
    defaultVariants: {
        size: "md",
        isDisabled: false
    }
});
var InputLeftAddon = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, size = _a.size, _b = _a.isDisabled, isDisabled = _b === void 0 ? false : _b, props = __rest(_a, ["className", "size", "isDisabled"]);
    return (<div className={(0, cn_1.cn)(inputAddonVariants({
            placement: "left",
            size: size,
            isDisabled: isDisabled,
            className: className
        }))} {...props} ref={ref}/>);
});
exports.InputLeftAddon = InputLeftAddon;
InputLeftAddon.displayName = "InputLeftAddon";
var InputRightAddon = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, size = _a.size, _b = _a.isDisabled, isDisabled = _b === void 0 ? false : _b, props = __rest(_a, ["className", "size", "isDisabled"]);
    return (<div className={(0, cn_1.cn)(inputAddonVariants({
            placement: "right",
            size: size,
            isDisabled: isDisabled,
            className: className
        }))} {...props} ref={ref}/>);
});
exports.InputRightAddon = InputRightAddon;
InputRightAddon.displayName = "InputRightAddon";
var inputElementVariants = (0, class_variance_authority_1.cva)("flex w-auto h-full space-x-2 whitespace-nowrap items-center justify-center", {
    variants: {
        size: {
            lg: "h-12",
            md: "h-10",
            sm: "h-8",
            xs: "h-6"
        },
        placement: {
            left: "pl-2",
            right: "pr-2"
        },
        isDisabled: {
            true: "opacity-50 cursor-not-allowed",
            false: ""
        }
    },
    defaultVariants: {
        isDisabled: false
    }
});
var InputLeftElement = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, size = _a.size, isFirstChild = _a.isFirstChild, isLastChild = _a.isLastChild, _b = _a.isDisabled, isDisabled = _b === void 0 ? false : _b, isInvalid = _a.isInvalid, props = __rest(_a, ["className", "size", "isFirstChild", "isLastChild", "isDisabled", "isInvalid"]);
    return (<div className={(0, cn_1.cn)(inputElementVariants({
            size: size,
            placement: "left",
            isDisabled: isDisabled,
            className: className
        }))} {...props} ref={ref}/>);
});
exports.InputLeftElement = InputLeftElement;
InputLeftElement.displayName = "InputLeftElement";
var InputRightElement = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, size = _a.size, isFirstChild = _a.isFirstChild, isLastChild = _a.isLastChild, _b = _a.isDisabled, isDisabled = _b === void 0 ? false : _b, props = __rest(_a, ["className", "size", "isFirstChild", "isLastChild", "isDisabled"]);
    return (<div className={(0, cn_1.cn)(inputElementVariants({
            size: size,
            placement: "right",
            isDisabled: isDisabled,
            className: className
        }))} {...props} ref={ref}/>);
});
exports.InputRightElement = InputRightElement;
InputRightElement.displayName = "InputRightElement";
