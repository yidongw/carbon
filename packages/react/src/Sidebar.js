"use client";
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.SidebarTrigger = exports.SidebarSeparator = exports.SidebarRail = exports.SidebarProvider = exports.SidebarMenuSubItem = exports.SidebarMenuSubButton = exports.SidebarMenuSub = exports.SidebarMenuSkeleton = exports.SidebarMenuItem = exports.SidebarMenuButton = exports.SidebarMenuBadge = exports.SidebarMenuAction = exports.SidebarMenu = exports.SidebarInset = exports.SidebarInput = exports.SidebarHeader = exports.SidebarGroupLabel = exports.SidebarGroupContent = exports.SidebarGroupAction = exports.SidebarGroup = exports.SidebarFooter = exports.SidebarContent = exports.Sidebar = void 0;
exports.useSidebar = useSidebar;
var macro_1 = require("@lingui/react/macro");
var react_slot_1 = require("@radix-ui/react-slot");
var class_variance_authority_1 = require("class-variance-authority");
var React = require("react");
var lu_1 = require("react-icons/lu");
var Drawer_1 = require("./Drawer");
var hooks_1 = require("./hooks");
var IconButton_1 = require("./IconButton");
var Input_1 = require("./Input");
var Separator_1 = require("./Separator");
var Skeleton_1 = require("./Skeleton");
var Tooltip_1 = require("./Tooltip");
var cn_1 = require("./utils/cn");
var SIDEBAR_COOKIE_NAME = "sidebar:state";
var SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
var SIDEBAR_WIDTH = "16rem";
var SIDEBAR_WIDTH_MOBILE = "18rem";
var SIDEBAR_WIDTH_ICON = "3rem";
var SIDEBAR_WIDTH_ICON_TOUCH = "4rem";
var SIDEBAR_KEYBOARD_SHORTCUT = "b";
var SidebarContext = React.createContext(null);
function useSidebar() {
    var context = React.useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider.");
    }
    return context;
}
var SidebarProvider = React.forwardRef(function (_a, ref) {
    var _b = _a.defaultOpen, defaultOpen = _b === void 0 ? true : _b, openProp = _a.open, setOpenProp = _a.onOpenChange, _c = _a.touch, touch = _c === void 0 ? false : _c, className = _a.className, style = _a.style, children = _a.children, props = __rest(_a, ["defaultOpen", "open", "onOpenChange", "touch", "className", "style", "children"]);
    var isMobile = (0, hooks_1.useIsMobile)();
    var _d = React.useState(false), openMobile = _d[0], setOpenMobile = _d[1];
    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    var _e = React.useState(defaultOpen), _open = _e[0], _setOpen = _e[1];
    var open = openProp !== null && openProp !== void 0 ? openProp : _open;
    var setOpen = React.useCallback(function (value) {
        var openState = typeof value === "function" ? value(open) : value;
        if (setOpenProp) {
            setOpenProp(openState);
        }
        else {
            _setOpen(openState);
        }
        // This sets the cookie to keep the sidebar state.
        document.cookie = "".concat(SIDEBAR_COOKIE_NAME, "=").concat(openState, "; path=/; max-age=").concat(SIDEBAR_COOKIE_MAX_AGE);
    }, [setOpenProp, open]);
    // Helper to toggle the sidebar.
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var toggleSidebar = React.useCallback(function () {
        return isMobile
            ? setOpenMobile(function (open) { return !open; })
            : setOpen(function (open) { return !open; });
    }, [isMobile, setOpen, setOpenMobile]);
    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(function () {
        var handleKeyDown = function (event) {
            if (event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
                (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                toggleSidebar();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return function () { return window.removeEventListener("keydown", handleKeyDown); };
    }, [toggleSidebar]);
    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    var state = open ? "expanded" : "collapsed";
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var contextValue = React.useMemo(function () { return ({
        state: state,
        open: open,
        setOpen: setOpen,
        isMobile: isMobile,
        openMobile: openMobile,
        setOpenMobile: setOpenMobile,
        toggleSidebar: toggleSidebar,
        touch: touch
    }); }, [
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
        touch
    ]);
    return (<SidebarContext.Provider value={contextValue}>
        <Tooltip_1.TooltipProvider delayDuration={0}>
          <div style={__assign({ "--sidebar-width": SIDEBAR_WIDTH, "--sidebar-width-icon": isMobile
                ? 0
                : touch
                    ? SIDEBAR_WIDTH_ICON_TOUCH
                    : SIDEBAR_WIDTH_ICON }, style)} className={(0, cn_1.cn)("group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar", className)} ref={ref} {...props}>
            {children}
          </div>
        </Tooltip_1.TooltipProvider>
      </SidebarContext.Provider>);
});
exports.SidebarProvider = SidebarProvider;
SidebarProvider.displayName = "SidebarProvider";
var Sidebar = React.forwardRef(function (_a, ref) {
    var _b = _a.side, side = _b === void 0 ? "left" : _b, _c = _a.variant, variant = _c === void 0 ? "sidebar" : _c, _d = _a.collapsible, collapsible = _d === void 0 ? "offcanvas" : _d, className = _a.className, children = _a.children, props = __rest(_a, ["side", "variant", "collapsible", "className", "children"]);
    var _e = useSidebar(), isMobile = _e.isMobile, state = _e.state, openMobile = _e.openMobile, setOpenMobile = _e.setOpenMobile;
    if (collapsible === "none") {
        return (<div className={(0, cn_1.cn)("flex h-full w-[var(--sidebar-width)] flex-col bg-sidebar text-sidebar-foreground", className)} ref={ref} {...props}>
          {children}
        </div>);
    }
    if (isMobile) {
        return (<Drawer_1.Drawer open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <Drawer_1.DrawerContent data-sidebar="sidebar" data-mobile="true" className="w-[var(--sidebar-width)] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden" style={{
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE
            }}>
            <div className="flex h-full w-full flex-col">{children}</div>
          </Drawer_1.DrawerContent>
        </Drawer_1.Drawer>);
    }
    return (<div ref={ref} className="group peer hidden md:block text-sidebar-foreground" data-state={state} data-collapsible={state === "collapsed" ? collapsible : ""} data-variant={variant} data-side={side}>
        {/* This is what handles the sidebar gap on desktop */}
        {/* ease-out-quint: fast start, smooth deceleration - feels snappy and responsive */}
        <div className={(0, cn_1.cn)("relative h-svh w-[var(--sidebar-width)] bg-transparent transition-[width] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none", "group-data-[collapsible=offcanvas]:w-0", "group-data-[side=right]:rotate-180", variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
            : "group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]")}/>
        <div className={(0, cn_1.cn)(
        // ease-out-quint (0.23,1,0.32,1): strong deceleration curve for snappy, spring-like feel
        "fixed inset-y-0 z-10 hidden h-svh w-[var(--sidebar-width)] transition-[left,right,width] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none md:flex", side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]", 
        // Adjust the padding for floating and inset variants.
        variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
            : "group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)] group-data-[side=left]:border-r group-data-[side=right]:border-l", className)} {...props}>
          <div data-sidebar="sidebar" className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow">
            {children}
          </div>
        </div>
      </div>);
});
exports.Sidebar = Sidebar;
Sidebar.displayName = "Sidebar";
var SidebarTrigger = React.forwardRef(function (_a, ref) {
    var className = _a.className, onClick = _a.onClick, props = __rest(_a, ["className", "onClick"]);
    var toggleSidebar = useSidebar().toggleSidebar;
    var t = (0, macro_1.useLingui)().t;
    return (<IconButton_1.IconButton ref={ref} icon={<lu_1.LuPanelLeft />} aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Toggle Sidebar"], ["Toggle Sidebar"])))} data-sidebar="trigger" variant="ghost" className={(0, cn_1.cn)("h-7 w-7", className)} onClick={function (event) {
            onClick === null || onClick === void 0 ? void 0 : onClick(event);
            toggleSidebar();
        }} {...props}/>);
});
exports.SidebarTrigger = SidebarTrigger;
SidebarTrigger.displayName = "SidebarTrigger";
var SidebarRail = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    var toggleSidebar = useSidebar().toggleSidebar;
    var t = (0, macro_1.useLingui)().t;
    return (<button ref={ref} data-sidebar="rail" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Toggle Sidebar"], ["Toggle Sidebar"])))} tabIndex={-1} onClick={toggleSidebar} title={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Toggle Sidebar"], ["Toggle Sidebar"])))} className={(0, cn_1.cn)("absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-opacity duration-150 ease-out motion-reduce:transition-none after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex", "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize", "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize", "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar", "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2", "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2", className)} {...props}/>);
});
exports.SidebarRail = SidebarRail;
SidebarRail.displayName = "SidebarRail";
var SidebarInset = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<main ref={ref} className={(0, cn_1.cn)("relative flex min-h-svh flex-1 flex-col bg-background", "peer-data-[variant=inset]:min-h-[calc(100sdvh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow", className)} {...props}/>);
});
exports.SidebarInset = SidebarInset;
SidebarInset.displayName = "SidebarInset";
var SidebarInput = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<Input_1.Input ref={ref} data-sidebar="input" className={(0, cn_1.cn)("h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring", className)} {...props}/>);
});
exports.SidebarInput = SidebarInput;
SidebarInput.displayName = "SidebarInput";
var SidebarHeader = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div ref={ref} data-sidebar="header" className={(0, cn_1.cn)("flex flex-col gap-2 p-2", className)} {...props}/>);
});
exports.SidebarHeader = SidebarHeader;
SidebarHeader.displayName = "SidebarHeader";
var SidebarFooter = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div ref={ref} data-sidebar="footer" className={(0, cn_1.cn)("flex flex-col gap-2 p-2", className)} {...props}/>);
});
exports.SidebarFooter = SidebarFooter;
SidebarFooter.displayName = "SidebarFooter";
var SidebarSeparator = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<Separator_1.Separator ref={ref} data-sidebar="separator" className={(0, cn_1.cn)("mx-2 w-auto bg-sidebar-border", className)} {...props}/>);
});
exports.SidebarSeparator = SidebarSeparator;
SidebarSeparator.displayName = "SidebarSeparator";
var SidebarContent = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div ref={ref} data-sidebar="content" className={(0, cn_1.cn)(
        // Tighter gap between groups (Vercel style)
        "flex min-h-0 flex-1 flex-col gap-1 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className)} {...props}/>);
});
exports.SidebarContent = SidebarContent;
SidebarContent.displayName = "SidebarContent";
var SidebarGroup = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div ref={ref} data-sidebar="group" className={(0, cn_1.cn)("relative flex w-full min-w-0 flex-col px-2 py-1.5", className)} {...props}/>);
});
exports.SidebarGroup = SidebarGroup;
SidebarGroup.displayName = "SidebarGroup";
var SidebarGroupLabel = React.forwardRef(function (_a, ref) {
    var className = _a.className, _b = _a.asChild, asChild = _b === void 0 ? false : _b, props = __rest(_a, ["className", "asChild"]);
    var Comp = asChild ? react_slot_1.Slot : "div";
    return (<Comp ref={ref} data-sidebar="group-label" className={(0, cn_1.cn)(
        // Vercel style: very muted, uppercase, smaller text
        // ease-out-quint for consistent spring-like feel with sidebar expansion
        "flex h-7 shrink-0 items-center rounded-md px-2 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/50 outline-none ring-sidebar-ring transition-[margin,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none focus-visible:ring-2 [&>svg]:size-3.5 [&>svg]:shrink-0", "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0", className)} {...props}/>);
});
exports.SidebarGroupLabel = SidebarGroupLabel;
SidebarGroupLabel.displayName = "SidebarGroupLabel";
var SidebarGroupAction = React.forwardRef(function (_a, ref) {
    var className = _a.className, _b = _a.asChild, asChild = _b === void 0 ? false : _b, props = __rest(_a, ["className", "asChild"]);
    var Comp = asChild ? react_slot_1.Slot : "button";
    return (<Comp ref={ref} data-sidebar="group-action" className={(0, cn_1.cn)(
        // Muted by default, brightens on hover (Vercel style)
        "absolute right-3 top-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground/50 outline-none ring-sidebar-ring transition-[background-color,color] duration-100 ease-out hover:bg-sidebar-accent/50 hover:text-sidebar-foreground focus-visible:ring-2 motion-reduce:transition-none [&>svg]:size-3.5 [&>svg]:shrink-0", 
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden", "group-data-[collapsible=icon]:hidden", className)} {...props}/>);
});
exports.SidebarGroupAction = SidebarGroupAction;
SidebarGroupAction.displayName = "SidebarGroupAction";
var SidebarGroupContent = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div ref={ref} data-sidebar="group-content" className={(0, cn_1.cn)("w-full text-sm", className)} {...props}/>);
});
exports.SidebarGroupContent = SidebarGroupContent;
SidebarGroupContent.displayName = "SidebarGroupContent";
var SidebarMenu = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<ul ref={ref} data-sidebar="menu" className={(0, cn_1.cn)("flex w-full min-w-0 flex-col gap-0.5", className)} {...props}/>);
});
exports.SidebarMenu = SidebarMenu;
SidebarMenu.displayName = "SidebarMenu";
var SidebarMenuItem = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<li ref={ref} data-sidebar="menu-item" className={(0, cn_1.cn)("group/menu-item relative", className)} {...props}/>);
});
exports.SidebarMenuItem = SidebarMenuItem;
SidebarMenuItem.displayName = "SidebarMenuItem";
/**
 * SidebarMenuButton - Vercel-inspired design:
 * - Muted text by default, brightens on hover/active
 * - Subtle hover background (barely visible tint)
 * - Active state: left accent border + brighter text (no heavy bg fill)
 * - Tight padding for compact feel
 * - Fast 100ms ease-out transitions
 */
var sidebarMenuButtonVariants = (0, class_variance_authority_1.cva)([
    // Layout - tighter padding for Vercel-style compact feel
    "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md px-2 py-1.5 text-left text-sm outline-none",
    // Default: muted text color (Vercel style - text is subdued until interaction)
    "text-sidebar-foreground/70",
    // Icons inherit the muted color (size is applied per touch/non-touch mode below)
    "[&>svg]:shrink-0 [&>svg]:text-sidebar-foreground/70",
    // Focus ring
    "ring-sidebar-ring focus-visible:ring-2",
    // Transitions - fast and smooth
    "transition-[background-color,color,border-color] duration-100 ease-out motion-reduce:transition-none",
    // Hover: subtle background tint + brighten text
    "hover:bg-sidebar-accent/50 hover:text-sidebar-foreground [&:hover>svg]:text-sidebar-foreground",
    // Active (pressed): same as hover
    "active:bg-sidebar-accent/50 active:text-sidebar-foreground",
    // Disabled states
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    // Menu action padding adjustment
    "group-has-[[data-sidebar=menu-action]]/menu-item:pr-8",
    // Active/selected state - Vercel style: subtle left border accent + bright text
    "data-[active=true]:bg-sidebar-accent/50 data-[active=true]:text-sidebar-foreground data-[active=true]:font-medium",
    "[&[data-active=true]>svg]:text-sidebar-foreground",
    // Open state (for collapsible menus)
    "data-[state=open]:bg-sidebar-accent/50 data-[state=open]:text-sidebar-foreground",
    // Text truncation
    "[&>span:last-child]:truncate"
].join(" "), {
    variants: {
        variant: {
            default: "",
            outline: [
                "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))]",
                "hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
            ]
        },
        size: {
            default: "h-8 text-sm",
            sm: "h-7 text-xs",
            lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
var SidebarMenuButton = React.forwardRef(function (_a, ref) {
    var _b = _a.asChild, asChild = _b === void 0 ? false : _b, _c = _a.isActive, isActive = _c === void 0 ? false : _c, _d = _a.variant, variant = _d === void 0 ? "default" : _d, _e = _a.size, size = _e === void 0 ? "default" : _e, tooltip = _a.tooltip, className = _a.className, props = __rest(_a, ["asChild", "isActive", "variant", "size", "tooltip", "className"]);
    var Comp = asChild ? react_slot_1.Slot : "button";
    var _f = useSidebar(), isMobile = _f.isMobile, state = _f.state, touch = _f.touch;
    // Touch-first apps (MES) need larger hit areas: taller rows, bigger icons,
    // and a roomier square in the collapsed icon rail. Kept out of the cva base
    // so the !important collapsed sizing never conflicts between modes.
    var sizing = touch
        ? (0, cn_1.cn)(
        // Expanded / mobile sheet: taller rows + bigger icons
        "min-h-11 [&>svg]:size-5", 
        // Collapsed icon rail: a roomy centered square showing only the
        // leading icon/avatar (labels, counts, chevron clip away cleanly)
        "group-data-[collapsible=icon]:!size-12 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:[&>svg]:size-6 group-data-[collapsible=icon]:[&>:not(:first-child)]:hidden")
        : (0, cn_1.cn)("[&>svg]:size-4", "group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2");
    var button = (<Comp ref={ref} data-sidebar="menu-button" data-size={size} data-active={isActive} className={(0, cn_1.cn)(sidebarMenuButtonVariants({ variant: variant, size: size }), sizing, className)} {...props}/>);
    if (!tooltip) {
        return button;
    }
    if (typeof tooltip === "string") {
        tooltip = {
            children: tooltip
        };
    }
    return (<Tooltip_1.Tooltip>
        <Tooltip_1.TooltipTrigger asChild>{button}</Tooltip_1.TooltipTrigger>
        <Tooltip_1.TooltipContent side="right" align="center" hidden={state !== "collapsed" || isMobile} {...tooltip}/>
      </Tooltip_1.Tooltip>);
});
exports.SidebarMenuButton = SidebarMenuButton;
SidebarMenuButton.displayName = "SidebarMenuButton";
var SidebarMenuAction = React.forwardRef(function (_a, ref) {
    var className = _a.className, _b = _a.asChild, asChild = _b === void 0 ? false : _b, _c = _a.showOnHover, showOnHover = _c === void 0 ? false : _c, props = __rest(_a, ["className", "asChild", "showOnHover"]);
    var Comp = asChild ? react_slot_1.Slot : "button";
    return (<Comp ref={ref} data-sidebar="menu-action" className={(0, cn_1.cn)(
        // Muted by default (Vercel style)
        "absolute right-1 top-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground/50 outline-none ring-sidebar-ring transition-[background-color,color,opacity] duration-100 ease-out hover:bg-sidebar-accent/50 hover:text-sidebar-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-foreground motion-reduce:transition-none [&>svg]:size-3.5 [&>svg]:shrink-0", 
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden", "peer-data-[size=sm]/menu-button:top-0.5", "peer-data-[size=default]/menu-button:top-1", "peer-data-[size=lg]/menu-button:top-2.5", "group-data-[collapsible=icon]:hidden", showOnHover &&
            "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-foreground md:opacity-0", className)} {...props}/>);
});
exports.SidebarMenuAction = SidebarMenuAction;
SidebarMenuAction.displayName = "SidebarMenuAction";
var SidebarMenuBadge = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div ref={ref} data-sidebar="menu-badge" className={(0, cn_1.cn)(
        // Muted by default, brightens with parent (Vercel style)
        "absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground/50 select-none pointer-events-none transition-colors duration-100 ease-out", "peer-hover/menu-button:text-sidebar-foreground peer-data-[active=true]/menu-button:text-sidebar-foreground", "peer-data-[size=sm]/menu-button:top-0.5", "peer-data-[size=default]/menu-button:top-1", "peer-data-[size=lg]/menu-button:top-2.5", "group-data-[collapsible=icon]:hidden", className)} {...props}/>);
});
exports.SidebarMenuBadge = SidebarMenuBadge;
SidebarMenuBadge.displayName = "SidebarMenuBadge";
var SidebarMenuSkeleton = React.forwardRef(function (_a, ref) {
    var className = _a.className, _b = _a.showIcon, showIcon = _b === void 0 ? false : _b, props = __rest(_a, ["className", "showIcon"]);
    // Random width between 50 to 90%.
    var width = React.useMemo(function () {
        return "".concat(Math.floor(Math.random() * 40) + 50, "%");
    }, []);
    return (<div ref={ref} data-sidebar="menu-skeleton" className={(0, cn_1.cn)("rounded-md h-8 flex gap-2 px-2 items-center", className)} {...props}>
      {showIcon && (<Skeleton_1.Skeleton className="size-4 rounded-md" data-sidebar="menu-skeleton-icon"/>)}
      <Skeleton_1.Skeleton className="h-4 flex-1 max-w-[var(--skeleton-width)]" data-sidebar="menu-skeleton-text" style={{
            "--skeleton-width": width
        }}/>
    </div>);
});
exports.SidebarMenuSkeleton = SidebarMenuSkeleton;
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";
var SidebarMenuSub = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<ul ref={ref} data-sidebar="menu-sub" className={(0, cn_1.cn)(
        // Tighter spacing, subtle border (Vercel style)
        "text-sm ml-3.5 flex min-w-0 translate-x-px flex-col gap-0.5 border-l border-sidebar-border/50 pl-2.5 py-0.5", "group-data-[collapsible=icon]:hidden", className)} {...props}/>);
});
exports.SidebarMenuSub = SidebarMenuSub;
SidebarMenuSub.displayName = "SidebarMenuSub";
var SidebarMenuSubItem = React.forwardRef(function (_a, ref) {
    var props = __rest(_a, []);
    return <li ref={ref} {...props}/>;
});
exports.SidebarMenuSubItem = SidebarMenuSubItem;
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";
/**
 * SidebarMenuSubButton - Vercel-inspired nested menu items
 * - Muted text by default, brightens on hover/active
 * - Matches parent button styling
 */
var SidebarMenuSubButton = React.forwardRef(function (_a, ref) {
    var _b = _a.asChild, asChild = _b === void 0 ? false : _b, _c = _a.size, size = _c === void 0 ? "md" : _c, isActive = _a.isActive, className = _a.className, props = __rest(_a, ["asChild", "size", "isActive", "className"]);
    var Comp = asChild ? react_slot_1.Slot : "a";
    return (<Comp ref={ref} data-sidebar="menu-sub-button" data-size={size} data-active={isActive} className={(0, cn_1.cn)(
        // Layout - compact
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2", 
        // Default: muted text (Vercel style)
        "text-sidebar-foreground/70", 
        // Focus ring
        "outline-none ring-sidebar-ring focus-visible:ring-2", 
        // Transitions
        "transition-[background-color,color] duration-100 ease-out motion-reduce:transition-none", 
        // Hover: subtle tint + brighten
        "hover:bg-sidebar-accent/50 hover:text-sidebar-foreground", 
        // Active (pressed)
        "active:bg-sidebar-accent/50 active:text-sidebar-foreground", 
        // Disabled
        "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50", 
        // Icons
        "[&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-foreground/70", "[&:hover>svg]:text-sidebar-foreground", 
        // Selected state
        "data-[active=true]:bg-sidebar-accent/50 data-[active=true]:text-sidebar-foreground data-[active=true]:font-medium", "[&[data-active=true]>svg]:text-sidebar-foreground", 
        // Size variants
        size === "sm" && "text-xs", size === "md" && "text-sm", 
        // Collapsed mode
        "group-data-[collapsible=icon]:hidden", className)} {...props}/>);
});
exports.SidebarMenuSubButton = SidebarMenuSubButton;
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";
var templateObject_1, templateObject_2, templateObject_3;
