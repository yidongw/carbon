"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpgradeOverlay = void 0;
exports.UpgradeOverlayActions = UpgradeOverlayActions;
exports.UpgradeOverlayCard = UpgradeOverlayCard;
exports.UpgradeOverlayContent = UpgradeOverlayContent;
exports.UpgradeOverlayDescription = UpgradeOverlayDescription;
exports.UpgradeOverlayDialog = UpgradeOverlayDialog;
exports.UpgradeOverlayIcon = UpgradeOverlayIcon;
exports.UpgradeOverlayInline = UpgradeOverlayInline;
exports.UpgradeOverlayPreview = UpgradeOverlayPreview;
exports.UpgradeOverlayStickyGradient = UpgradeOverlayStickyGradient;
exports.UpgradeOverlayTitle = UpgradeOverlayTitle;
exports.UpgradeOverlayUpgradeButton = UpgradeOverlayUpgradeButton;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
function UpgradeOverlayRoot(_a) {
    var children = _a.children, className = _a.className;
    return (<div className={(0, react_1.cn)("relative w-full h-full min-h-[calc(100dvh-49px)]", className)}>
      {children}
    </div>);
}
function UpgradeOverlayPreview(_a) {
    var children = _a.children, className = _a.className;
    return (<div aria-hidden="true" className={(0, react_1.cn)("blur-[2px] pointer-events-none select-none w-full h-full", className)}>
      {children}
    </div>);
}
function UpgradeOverlayCard(_a) {
    var children = _a.children, className = _a.className;
    return (<div className="absolute inset-0 flex items-center justify-center">
      <react_1.Card className={(0, react_1.cn)("max-w-md shadow-lg", className)}>
        <react_1.CardContent className="flex flex-col items-center text-center gap-4 pt-6">
          {children}
        </react_1.CardContent>
      </react_1.Card>
    </div>);
}
function UpgradeOverlayInline(_a) {
    var children = _a.children, className = _a.className;
    return (<div className={(0, react_1.cn)("flex flex-col items-center justify-start flex-1 w-full pt-[15dvh] text-center gap-4 px-4 h-full", className)}>
      {children}
    </div>);
}
function UpgradeOverlayIcon(_a) {
    var children = _a.children;
    return <div className="rounded-full bg-muted p-3">{children}</div>;
}
function UpgradeOverlayTitle(_a) {
    var children = _a.children;
    return <h3 className="text-lg font-semibold">{children}</h3>;
}
function UpgradeOverlayDescription(_a) {
    var children = _a.children;
    return (<p className="text-sm text-muted-foreground text-balance">{children}</p>);
}
function UpgradeOverlayContent(_a) {
    var children = _a.children;
    return <react_1.VStack className="gap-2 items-center">{children}</react_1.VStack>;
}
function UpgradeOverlayActions(_a) {
    var children = _a.children;
    return <div className="flex flex-col items-center gap-2">{children}</div>;
}
function UpgradeOverlayStickyGradient(_a) {
    var children = _a.children, className = _a.className, onClick = _a.onClick;
    return (<div className={(0, react_1.cn)("sticky bottom-0 left-0 right-0 z-40 pointer-events-none", "-mt-[100dvh] h-[100dvh] flex items-end justify-center pb-48", "bg-gradient-to-b from-transparent via-background/55 via-[50%] to-background", "transition-opacity duration-200 ease-out", "motion-reduce:transition-none", className)}>
      <div onClick={onClick} className="pointer-events-auto px-4 w-full flex flex-col items-center text-center gap-3 max-w-md mx-auto cursor-pointer rounded-md">
        {children}
      </div>
    </div>);
}
function UpgradeOverlayDialog(_a) {
    var open = _a.open, onOpenChange = _a.onOpenChange, children = _a.children;
    return (<react_1.Modal open={open} onOpenChange={onOpenChange}>
      <react_1.ModalContent className="max-w-md">
        <react_1.CardContent className="flex flex-col items-center text-center gap-4 pt-8 pb-6">
          {children}
        </react_1.CardContent>
      </react_1.ModalContent>
    </react_1.Modal>);
}
function UpgradeOverlayUpgradeButton(_a) {
    var children = _a.children, _b = _a.to, to = _b === void 0 ? path_1.path.to.billing : _b;
    return (<react_1.Button asChild>
      <react_router_1.Link to={to}>{children !== null && children !== void 0 ? children : <macro_1.Trans>Upgrade to Business</macro_1.Trans>}</react_router_1.Link>
    </react_1.Button>);
}
var UpgradeOverlay = UpgradeOverlayRoot;
exports.UpgradeOverlay = UpgradeOverlay;
