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
exports.ModalTrigger = exports.ModalTitle = exports.ModalPortal = exports.ModalOverlay = exports.ModalHeader = exports.ModalFooter = exports.ModalDescription = exports.ModalContent = exports.ModalClose = exports.ModalBody = exports.Modal = void 0;
var DialogPrimitive = require("@radix-ui/react-dialog");
var class_variance_authority_1 = require("class-variance-authority");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var ClientOnly_1 = require("./ClientOnly");
var cn_1 = require("./utils/cn");
var Modal = DialogPrimitive.Root;
exports.Modal = Modal;
var ModalTrigger = DialogPrimitive.Trigger;
exports.ModalTrigger = ModalTrigger;
var ModalPortal = DialogPrimitive.Portal;
exports.ModalPortal = ModalPortal;
var ModalClose = DialogPrimitive.Close;
exports.ModalClose = ModalClose;
var ModalOverlay = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<DialogPrimitive.Overlay ref={ref} className={(0, cn_1.cn)(
        // 'z-50 fixed h-full w-full left-0 top-0',
        // 'bg-alternative/90 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        "bg-alternative/90 backdrop-blur-sm", "z-50 fixed inset-0 grid place-items-center overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent data-open:animate-overlay-show data-closed:animate-overlay-hide", className)} {...props}/>);
});
exports.ModalOverlay = ModalOverlay;
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;
var ModalContentVariants = (0, class_variance_authority_1.cva)((0, cn_1.cn)("px-0 pt-6", "relative z-50 grid w-full border dark:border-none gap-4 shadow-md dark:shadow-sm duration-200", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", "data-[state=closed]:slide-out-to-left-[0%] data-[state=closed]:slide-out-to-top-[0%", "data-[state=open]:slide-in-from-left-[0%] data-[state=open]:slide-in-from-top-[0%]", "sm:rounded-xl md:w-full", "bg-background focus-visible:outline-none focus-visible:ring-0", "dark:shadow-[inset_0_0.5px_0_rgb(255_255_255_/_0.08),_inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]"), {
    variants: {
        size: {
            tiny: "sm:align-middle sm:w-full sm:max-w-xs",
            small: "sm:align-middle sm:w-full sm:max-w-sm",
            medium: "sm:align-middle sm:w-full sm:max-w-lg",
            large: "sm:align-middle sm:w-full max-w-xl",
            xlarge: "sm:align-middle sm:w-full max-w-3xl",
            xxlarge: "sm:align-middle sm:w-full max-w-6xl",
            xxxlarge: "sm:align-middle sm:w-full max-w-7xl"
        }
    },
    defaultVariants: {
        size: "medium"
    }
});
var ModalContent = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, children = _a.children, size = _a.size, _b = _a.withCloseButton, withCloseButton = _b === void 0 ? true : _b, stackZIndex = _a.stackZIndex, props = __rest(_a, ["className", "children", "size", "withCloseButton", "stackZIndex"]);
    return (<ClientOnly_1.ClientOnly fallback={null}>
      {function () { return (<ModalPortal>
          <ModalOverlay style={stackZIndex !== undefined ? { zIndex: stackZIndex } : undefined}>
            <DialogPrimitive.Content ref={ref} className={(0, cn_1.cn)(ModalContentVariants({ size: size }), className)} style={stackZIndex !== undefined ? { zIndex: stackZIndex } : undefined} {...props}>
              {children}
              {withCloseButton && (<DialogPrimitive.Close type="button" className="absolute right-4 top-4 rounded-full opacity-70 transition-opacity hover:opacity-100 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-foreground-muted p-3 hover:bg-accent/80">
                  <lu_1.LuX className="h-4 w-4"/>
                  <span className="sr-only">Close</span>
                </DialogPrimitive.Close>)}
            </DialogPrimitive.Content>
          </ModalOverlay>
        </ModalPortal>); }}
    </ClientOnly_1.ClientOnly>);
});
exports.ModalContent = ModalContent;
ModalContent.displayName = DialogPrimitive.Content.displayName;
var ModalHeader = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div className={(0, cn_1.cn)("flex flex-col space-y-1.5 text-center sm:text-left mb-4 px-6", className)} {...props}/>);
};
exports.ModalHeader = ModalHeader;
ModalHeader.displayName = "ModalHeader";
var ModalBody = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div className={(0, cn_1.cn)(" w-full py-0 px-6 mb-4", className)} {...props}/>);
};
exports.ModalBody = ModalBody;
ModalBody.displayName = "ModalBody";
var ModalFooter = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div className={(0, cn_1.cn)("flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-6 py-3 border-t border-border bg-muted/40 sm:rounded-b-xl", className)} {...props}/>);
};
exports.ModalFooter = ModalFooter;
ModalFooter.displayName = "ModalFooter";
var ModalTitle = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<DialogPrimitive.Title ref={ref} className={(0, cn_1.cn)("text-base font-medium font-headline leading-none tracking-tight text-foreground text-balance", className)} {...props}/>);
});
exports.ModalTitle = ModalTitle;
ModalTitle.displayName = DialogPrimitive.Title.displayName;
var ModalDescription = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<DialogPrimitive.Description ref={ref} className={(0, cn_1.cn)("text-sm text-muted-foreground", className)} {...props}/>);
});
exports.ModalDescription = ModalDescription;
ModalDescription.displayName = DialogPrimitive.Description.displayName;
