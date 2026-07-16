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
exports.CommandTrigger = exports.CommandShortcut = exports.CommandSeparator = exports.CommandLoading = exports.CommandList = exports.CommandItem = exports.CommandInputTextField = exports.CommandInput = exports.CommandGroup = exports.CommandEmpty = exports.CommandDialog = exports.Command = exports.multiSelectTriggerVariants = void 0;
var class_variance_authority_1 = require("class-variance-authority");
var cmdk_1 = require("cmdk");
var react_1 = require("react");
var rx_1 = require("react-icons/rx");
var Modal_1 = require("./Modal");
var cn_1 = require("./utils/cn");
var Command = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<cmdk_1.Command ref={ref} className={(0, cn_1.cn)("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className)} {...props}/>);
});
exports.Command = Command;
Command.displayName = cmdk_1.Command.displayName;
var CommandDialog = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    return (<Modal_1.Modal {...props}>
      <Modal_1.ModalContent className="overflow-hidden p-0 [&>button[type=button]]:top-1 [&>button[type=button]]:right-2 [&>button[type=button]]:p-3">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </Modal_1.ModalContent>
    </Modal_1.Modal>);
};
exports.CommandDialog = CommandDialog;
var commandInputVariants = (0, class_variance_authority_1.cva)("flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", {
    variants: {
        size: {
            lg: "h-12 px-4 py-3 rounded-lg text-base",
            md: "h-10 px-3 py-2 rounded-md text-base",
            sm: "h-8  px-3 py-2 rounded text-sm"
        }
    }
});
var CommandInput = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, size = _a.size, props = __rest(_a, ["className", "size"]);
    return (<div className="flex items-center border-b border-border px-3" cmdk-input-wrapper="">
    <rx_1.RxMagnifyingGlass className="mr-2 h-4 w-4 shrink-0 opacity-50"/>
    <cmdk_1.Command.Input ref={ref} className={(0, cn_1.cn)(commandInputVariants({
            size: size
        }), className)} {...props}/>
  </div>);
});
exports.CommandInput = CommandInput;
CommandInput.displayName = cmdk_1.Command.Input.displayName;
var commandInputTextFieldVariants = (0, class_variance_authority_1.cva)("flex w-full px-3 py-1 bg-transparent text-foreground transition-[color,box-shadow] placeholder:text-muted-foreground disabled:opacity-50 rounded-md border border-input shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed", {
    variants: {
        size: {
            lg: "h-12 rounded-lg px-4 text-base",
            md: "h-10 rounded-md px-4 text-sm",
            sm: "h-8 rounded-md px-3 text-sm",
            xs: "h-6 rounded px-2 text-sm"
        },
        isInvalid: {
            true: "border-destructive ring-destructive focus-visible:ring-destructive",
            false: ""
        },
        isReadOnly: {
            true: "bg-muted text-muted-foreground",
            false: ""
        },
        isDisabled: {
            true: "bg-muted text-muted-foreground",
            false: ""
        },
        borderless: {
            true: "border-none px-0 outline-none ring-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:ring-transparent focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none",
            false: ""
        }
    },
    defaultVariants: {
        size: "md",
        isInvalid: false,
        borderless: false
    }
});
var CommandInputTextField = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, size = _a.size, _b = _a.isInvalid, isInvalid = _b === void 0 ? false : _b, _c = _a.isDisabled, isDisabled = _c === void 0 ? false : _c, _d = _a.isReadOnly, isReadOnly = _d === void 0 ? false : _d, _e = _a.borderless, borderless = _e === void 0 ? false : _e, props = __rest(_a, ["className", "size", "isInvalid", "isDisabled", "isReadOnly", "borderless"]);
    return (<cmdk_1.Command.Input ref={ref} className={(0, cn_1.cn)(commandInputTextFieldVariants({
            size: size,
            isInvalid: isInvalid,
            isDisabled: isDisabled,
            isReadOnly: isReadOnly,
            borderless: borderless
        }), className)} disabled={isDisabled} readOnly={isReadOnly} {...props}/>);
});
exports.CommandInputTextField = CommandInputTextField;
CommandInputTextField.displayName = "CommandInputTextField";
var CommandList = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<cmdk_1.Command.List ref={ref} className={(0, cn_1.cn)("max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent overflow-x-hidden", className)} {...props}/>);
});
exports.CommandList = CommandList;
CommandList.displayName = cmdk_1.Command.List.displayName;
var CommandLoading = (0, react_1.forwardRef)(function (props, ref) { return <cmdk_1.Command.Loading ref={ref} {...props}/>; });
exports.CommandLoading = CommandLoading;
CommandLoading.displayName = cmdk_1.Command.Loading.displayName;
var CommandEmpty = (0, react_1.forwardRef)(function (props, ref) { return (<cmdk_1.Command.Empty ref={ref} className="py-6 text-center text-sm" {...props}/>); });
exports.CommandEmpty = CommandEmpty;
CommandEmpty.displayName = cmdk_1.Command.Empty.displayName;
var CommandGroup = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<cmdk_1.Command.Group ref={ref} className={(0, cn_1.cn)("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className)} {...props}/>);
});
exports.CommandGroup = CommandGroup;
CommandGroup.displayName = cmdk_1.Command.Group.displayName;
var CommandSeparator = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<cmdk_1.Command.Separator ref={ref} className={(0, cn_1.cn)("-mx-1 h-px bg-border", className)} {...props}/>);
});
exports.CommandSeparator = CommandSeparator;
CommandSeparator.displayName = cmdk_1.Command.Separator.displayName;
var CommandItem = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<cmdk_1.Command.Item ref={ref} className={(0, cn_1.cn)("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled='true']:pointer-events-none data-[disabled='true']:opacity-50", className)} {...props}/>);
});
exports.CommandItem = CommandItem;
CommandItem.displayName = cmdk_1.Command.Item.displayName;
var CommandShortcut = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<span className={(0, cn_1.cn)("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props}/>);
};
exports.CommandShortcut = CommandShortcut;
CommandShortcut.displayName = "CommandShortcut";
var commandTriggerVariants = (0, class_variance_authority_1.cva)("items-center justify-between [&>span]:line-clamp-1 overflow-hidden hover:scale-100 focus-visible:scale-100 transition-[background-color,color,transform] duration-150 ease-in-out", {
    variants: {
        size: {
            lg: "h-12 px-4 py-3 rounded-lg text-base space-x-4",
            md: "h-10 px-3 py-2 rounded-md text-sm space-x-3",
            sm: "h-8 px-3 py-2 rounded-md text-sm space-x-2"
        },
        asButton: {
            false: "text-foreground flex w-full whitespace-nowrap rounded-md border border-input shadow-xs data-[placeholder]:text-muted-foreground outline-none focus:border-ring focus:ring-[3px] focus:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 overflow-hidden",
            true: "text-foreground relative font-medium shrink-0 group inline-flex select-none transform-gpu initial:border-none disabled:opacity-50 focus:!outline-none focus:!ring-0 active:!outline-none active:!ring-0 after:pointer-events-none after:absolute after:-inset-[3px] after:rounded-lg after:border after:border-blue-500 after:opacity-0 after:ring-2 after:ring-blue-500/20 after:transition-opacity focus-visible:after:opacity-100 active:after:opacity-0 before:pointer-events-none before:bg-gradient-to-b before:transition-opacity before:from-white/[0.12] before:absolute before:inset-0 before:z-[1] before:rounded before:opacity-0 bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 shadow-button-base hover:scale-100 focus-visible:scale-100 transition-[background-color,color,transform,box-shadow] duration-150 ease-in-out"
        }
    },
    defaultVariants: {
        size: "md",
        asButton: false
    }
});
exports.multiSelectTriggerVariants = (0, class_variance_authority_1.cva)("w-full justify-between font-normal hover:scale-100 focus-visible:scale-100", {
    variants: {
        size: {
            lg: "text-base",
            md: "text-sm",
            sm: "text-xs"
        },
        hasSelections: {
            true: "h-auto",
            false: ""
        }
    },
    compoundVariants: [
        {
            size: "lg",
            hasSelections: true,
            class: "min-h-12 py-2 px-4"
        },
        {
            size: "lg",
            hasSelections: false,
            class: "h-12"
        },
        {
            size: "md",
            hasSelections: true,
            class: "min-h-10 py-1.5 px-3"
        },
        {
            size: "md",
            hasSelections: false,
            class: "h-10"
        },
        {
            size: "sm",
            hasSelections: true,
            class: "min-h-8 py-1 px-2"
        },
        {
            size: "sm",
            hasSelections: false,
            class: "h-8"
        }
    ],
    defaultVariants: {
        size: "md",
        hasSelections: false
    }
});
var CommandTrigger = (0, react_1.forwardRef)(function (_a, ref) {
    var _b = _a.asButton, asButton = _b === void 0 ? false : _b, size = _a.size, className = _a.className, children = _a.children, icon = _a.icon, props = __rest(_a, ["asButton", "size", "className", "children", "icon"]);
    return (<button ref={ref} type="button" className={(0, cn_1.cn)(commandTriggerVariants({
            size: size,
            asButton: asButton
        }), className)} {...props}>
      {children}
      {icon ? (icon) : (<rx_1.RxMagnifyingGlass className="size-4 flex-shrink-0 opacity-50"/>)}
    </button>);
});
exports.CommandTrigger = CommandTrigger;
CommandTrigger.displayName = "CommandTrigger";
