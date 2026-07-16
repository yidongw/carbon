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
exports.DrawerTrigger = exports.DrawerTitle = exports.DrawerHeader = exports.DrawerFooter = exports.DrawerDescription = exports.DrawerContent = exports.DrawerCloseButton = exports.DrawerBody = exports.Drawer = void 0;
var DialogPrimitive = require("@radix-ui/react-dialog");
var class_variance_authority_1 = require("class-variance-authority");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var ClientOnly_1 = require("./ClientOnly");
var cn_1 = require("./utils/cn");
var Drawer = DialogPrimitive.Root;
exports.Drawer = Drawer;
var DrawerTrigger = DialogPrimitive.Trigger;
exports.DrawerTrigger = DrawerTrigger;
var DrawerCloseButton = DialogPrimitive.Close;
exports.DrawerCloseButton = DrawerCloseButton;
var portalVariants = (0, class_variance_authority_1.cva)("fixed inset-0 z-50 flex p-3", {
    variants: {
        position: {
            top: "items-start",
            bottom: "items-end",
            left: "justify-start",
            right: "justify-end"
        }
    },
    defaultVariants: { position: "right" }
});
var DrawerPortal = function (_a) {
    var position = _a.position, children = _a.children, props = __rest(_a, ["position", "children"]);
    return (<DialogPrimitive.Portal {...props}>
    <div className={portalVariants({ position: position })}>{children}</div>
  </DialogPrimitive.Portal>);
};
DrawerPortal.displayName = DialogPrimitive.Portal.displayName;
var DrawerOverlay = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return (<DialogPrimitive.Overlay className={(0, cn_1.cn)("fixed inset-0 z-50 bg-black/10 backdrop-blur-sm  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className)} {...props} ref={ref}/>);
});
DrawerOverlay.displayName = DialogPrimitive.Overlay.displayName;
var DrawerBody = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div className={(0, cn_1.cn)("flex flex-col flex-1 items-start justify-start overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent w-full p-6 bg-card dark:bg-muted/40 rounded-xl border border-border", className)} {...props}/>);
};
exports.DrawerBody = DrawerBody;
DrawerBody.displayName = "DrawerBody";
var sheetVariants = (0, class_variance_authority_1.cva)("flex flex-col z-50 scale-100 bg-accent dark:bg-card opacity-100 shadow-button-base dark:shadow-[inset_0_0.5px_0_rgb(255_255_255_/_0.08),_inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)] border border-border transition-[background-color,box-shadow,border-color] duration-100 focus-visible:outline-none focus-visible:ring-0 rounded-2xl", {
    variants: {
        position: {
            top: "animate-in slide-in-from-top w-full duration-300",
            bottom: "animate-in slide-in-from-bottom w-full duration-300",
            left: "animate-in slide-in-from-left h-full duration-300",
            right: "animate-in slide-in-from-right h-full duration-300"
        },
        size: {
            content: "",
            sm: "",
            md: "",
            lg: "",
            xl: "",
            full: ""
        }
    },
    compoundVariants: [
        {
            position: ["top", "bottom"],
            size: "content",
            class: "max-h-full"
        },
        {
            position: ["top", "bottom"],
            size: "md",
            class: "h-1/3"
        },
        {
            position: ["top", "bottom"],
            size: "sm",
            class: "h-1/4"
        },
        {
            position: ["top", "bottom"],
            size: "lg",
            class: "h-1/2"
        },
        {
            position: ["top", "bottom"],
            size: "xl",
            class: "h-5/6"
        },
        {
            position: ["top", "bottom"],
            size: "full",
            class: "h-full"
        },
        {
            position: ["right", "left"],
            size: "content",
            class: "max-w-full"
        },
        {
            position: ["right", "left"],
            size: "md",
            class: "w-full lg:w-1/3"
        },
        {
            position: ["right", "left"],
            size: "sm",
            class: "w-full lg:w-1/4"
        },
        {
            position: ["right", "left"],
            size: "lg",
            class: "w-full lg:w-1/2"
        },
        {
            position: ["right", "left"],
            size: "xl",
            class: "w-full lg:w-2/3"
        },
        {
            position: ["right", "left"],
            size: "full",
            class: "w-full"
        }
    ],
    defaultVariants: {
        position: "right",
        size: "md"
    }
});
var DrawerContent = (0, react_1.forwardRef)(function (_a, ref) {
    var position = _a.position, size = _a.size, _b = _a.overlay, overlay = _b === void 0 ? true : _b, container = _a.container, className = _a.className, children = _a.children, props = __rest(_a, ["position", "size", "overlay", "container", "className", "children"]);
    return (<ClientOnly_1.ClientOnly fallback={null}>
      {function () { return (<DrawerPortal position={position} container={container}>
          {overlay && <DrawerOverlay />}
          <DialogPrimitive.Content ref={ref} className={(0, cn_1.cn)(sheetVariants({ position: position, size: size }), className)} {...props}>
            {children}
            <DialogPrimitive.Close type="button" className="absolute right-4 top-3 rounded-full p-2 opacity-70 transition-opacity hover:opacity-100 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none data-[state=open]:bg-secondary">
              <lu_1.LuX className="h-5 w-5"/>
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DrawerPortal>); }}
    </ClientOnly_1.ClientOnly>);
});
exports.DrawerContent = DrawerContent;
DrawerContent.displayName = DialogPrimitive.Content.displayName;
var DrawerHeader = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div className={(0, cn_1.cn)("flex flex-col flex-0 gap-1 text-left px-6 py-4 text-muted-foreground", className)} {...props}/>);
};
exports.DrawerHeader = DrawerHeader;
DrawerHeader.displayName = "DrawerHeader";
var DrawerFooter = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div className={(0, cn_1.cn)("flex flex-0 sm:flex-row flex-col-reverse px-6 py-4 sm:justify-end sm:space-x-2", className)} {...props}/>);
};
exports.DrawerFooter = DrawerFooter;
DrawerFooter.displayName = "DrawerFooter";
var DrawerTitle = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return (<DialogPrimitive.Title ref={ref} className={(0, cn_1.cn)("text-base font-medium font-headline leading-none tracking-tight text-foreground/90 text-balance line-clamp-1", className)} {...props}>
    {children}
  </DialogPrimitive.Title>);
});
exports.DrawerTitle = DrawerTitle;
DrawerTitle.displayName = DialogPrimitive.Title.displayName;
var DrawerDescription = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<DialogPrimitive.Description ref={ref} className={(0, cn_1.cn)("text-xs text-muted-foreground", className)} {...props}/>);
});
exports.DrawerDescription = DrawerDescription;
DrawerDescription.displayName = DialogPrimitive.Description.displayName;
