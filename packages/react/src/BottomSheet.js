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
exports.BottomSheetTrigger = exports.BottomSheetTitle = exports.BottomSheetHeader = exports.BottomSheetDescription = exports.BottomSheetContent = exports.BottomSheetClose = exports.BottomSheetBody = exports.BottomSheet = void 0;
var DialogPrimitive = require("@radix-ui/react-dialog");
var react_1 = require("react");
var ClientOnly_1 = require("./ClientOnly");
var cn_1 = require("./utils/cn");
var BottomSheet = DialogPrimitive.Root;
exports.BottomSheet = BottomSheet;
var BottomSheetTrigger = DialogPrimitive.Trigger;
exports.BottomSheetTrigger = BottomSheetTrigger;
var BottomSheetClose = DialogPrimitive.Close;
exports.BottomSheetClose = BottomSheetClose;
var BottomSheetOverlay = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<DialogPrimitive.Overlay ref={ref} className={(0, cn_1.cn)("fixed inset-0 z-[70] bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className)} {...props}/>);
});
BottomSheetOverlay.displayName = "BottomSheetOverlay";
var BottomSheetContent = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return (<ClientOnly_1.ClientOnly fallback={null}>
    {function () { return (<DialogPrimitive.Portal>
        <BottomSheetOverlay />
        <DialogPrimitive.Content ref={ref} className={(0, cn_1.cn)("fixed inset-x-0 bottom-0 z-[70] flex flex-col rounded-t-2xl bg-background shadow-lg duration-300", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom", className)} {...props}>
          <div className="mx-auto mt-3 mb-2 h-1.5 w-12 shrink-0 rounded-full bg-muted-foreground/20"/>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>); }}
  </ClientOnly_1.ClientOnly>);
});
exports.BottomSheetContent = BottomSheetContent;
BottomSheetContent.displayName = "BottomSheetContent";
var BottomSheetHeader = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div className={(0, cn_1.cn)("px-6 pb-2 text-center", className)} {...props}/>);
};
exports.BottomSheetHeader = BottomSheetHeader;
BottomSheetHeader.displayName = "BottomSheetHeader";
var BottomSheetBody = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div className={(0, cn_1.cn)("px-6 pb-6", className)} {...props}/>);
};
exports.BottomSheetBody = BottomSheetBody;
BottomSheetBody.displayName = "BottomSheetBody";
var BottomSheetTitle = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<DialogPrimitive.Title ref={ref} className={(0, cn_1.cn)("text-sm font-medium text-muted-foreground", className)} {...props}/>);
});
exports.BottomSheetTitle = BottomSheetTitle;
BottomSheetTitle.displayName = "BottomSheetTitle";
var BottomSheetDescription = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<DialogPrimitive.Description ref={ref} className={(0, cn_1.cn)("text-xs text-muted-foreground", className)} {...props}/>);
});
exports.BottomSheetDescription = BottomSheetDescription;
BottomSheetDescription.displayName = "BottomSheetDescription";
