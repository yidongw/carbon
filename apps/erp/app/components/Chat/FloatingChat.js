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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloatingChat = FloatingChat;
var store_1 = require("@ai-sdk-tools/store");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var ChatInterface_1 = require("./ChatInterface");
var BUTTON_SIZE = 52;
var TOPBAR_HEIGHT = 49;
var NAV_WIDTH = 56;
var DEFAULT_PANEL_WIDTH = 440;
var DEFAULT_PANEL_HEIGHT = 460;
var MIN_PANEL_SIZE = 280;
var EDGE_MARGIN = 12;
function getSnapPositions() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var xL = EDGE_MARGIN;
    var xR = w - BUTTON_SIZE - EDGE_MARGIN;
    var xM = Math.round((xL + xR) / 2);
    var yT = TOPBAR_HEIGHT + EDGE_MARGIN;
    var yB = h - BUTTON_SIZE - EDGE_MARGIN;
    var yM = Math.round((yT + yB) / 2);
    return [
        { x: xL, y: yT },
        { x: xM, y: yT },
        { x: xR, y: yT },
        { x: xL, y: yM },
        { x: xR, y: yM },
        { x: xL, y: yB },
        { x: xM, y: yB },
        { x: xR, y: yB }
    ];
}
function nearestSnap(x, y) {
    var cx = x + BUTTON_SIZE / 2;
    var cy = y + BUTTON_SIZE / 2;
    return getSnapPositions().reduce(function (best, pos) {
        var d = Math.hypot(pos.x + BUTTON_SIZE / 2 - cx, pos.y + BUTTON_SIZE / 2 - cy);
        var bd = Math.hypot(best.x + BUTTON_SIZE / 2 - cx, best.y + BUTTON_SIZE / 2 - cy);
        return d < bd ? pos : best;
    });
}
function readStorage(key, fallback) {
    if (typeof window === "undefined")
        return fallback;
    try {
        var raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    }
    catch (_a) {
        return fallback;
    }
}
function writeStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch (_a) { }
}
function useStored(key, fallback) {
    var _a = (0, react_2.useState)(function () { return readStorage(key, fallback); }), value = _a[0], setValue = _a[1];
    var set = (0, react_2.useCallback)(function (next) {
        setValue(function (prev) {
            var result = typeof next === "function" ? next(prev) : next;
            writeStorage(key, result);
            return result;
        });
    }, [key]);
    return [value, set];
}
function LayoutDiagram(_a) {
    var position = _a.position, active = _a.active, isXs = _a.isXs;
    var base = "rounded-[2px]";
    var nav = (0, react_1.cn)(base, "bg-current opacity-30", "w-[6px]");
    var page = (0, react_1.cn)(base, "bg-current opacity-10 flex-1");
    var panel = (0, react_1.cn)(base, active ? "bg-primary" : "bg-current opacity-50");
    var diagrams = {
        "left-outside": (<div className="flex gap-[2px] w-full h-full">
        <div className={(0, react_1.cn)(panel, "w-[10px]")}/>
        <div className={(0, react_1.cn)(nav)}/>
        <div className={(0, react_1.cn)(page)}/>
      </div>),
        "right-outside": (<div className="flex gap-[2px] w-full h-full">
        <div className={(0, react_1.cn)(nav)}/>
        <div className={(0, react_1.cn)(page)}/>
        <div className={(0, react_1.cn)(panel, "w-[10px]")}/>
      </div>),
        "left-inside": (<div className="flex gap-[2px] w-full h-full">
        <div className={(0, react_1.cn)(nav)}/>
        <div className={(0, react_1.cn)(panel, "w-[10px]")}/>
        <div className={(0, react_1.cn)(page)}/>
      </div>),
        "right-inside": (<div className="flex gap-[2px] w-full h-full">
        <div className={(0, react_1.cn)(nav)}/>
        <div className={(0, react_1.cn)(page)}/>
        <div className={(0, react_1.cn)(panel, "w-[10px]")}/>
      </div>),
        top: (<div className="flex gap-[2px] w-full h-full">
        {!isXs && <div className={(0, react_1.cn)(nav)}/>}
        <div className="flex flex-col gap-[2px] flex-1">
          <div className={(0, react_1.cn)(panel, "h-[10px]")}/>
          <div className={(0, react_1.cn)(page)}/>
        </div>
      </div>),
        bottom: (<div className="flex gap-[2px] w-full h-full">
        {!isXs && <div className={(0, react_1.cn)(nav)}/>}
        <div className="flex flex-col gap-[2px] flex-1">
          <div className={(0, react_1.cn)(page)}/>
          <div className={(0, react_1.cn)(panel, "h-[10px]")}/>
        </div>
      </div>),
        fullscreen: <div className={(0, react_1.cn)(panel, "w-full h-full")}/>
    };
    return diagrams[position];
}
// ── Position menu ────────────────────────────────────────────────────────────
var POSITIONS = [
    { id: "left-outside", label: "Left outside" },
    { id: "right-outside", label: "Right outside" },
    { id: "left-inside", label: "Left side" },
    { id: "right-inside", label: "Right side" },
    { id: "top", label: "Top" },
    { id: "bottom", label: "Bottom" },
    { id: "fullscreen", label: "Full screen" }
];
function PositionMenu(_a) {
    var current = _a.current, onSelect = _a.onSelect, onClose = _a.onClose, viewportW = _a.viewportW;
    var ref = (0, react_2.useRef)(null);
    var isXs = viewportW < 640;
    var isMd = viewportW >= 768;
    var isLg = viewportW >= 1024;
    (0, react_2.useEffect)(function () {
        var handleClick = function (e) {
            if (ref.current && !ref.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClick);
        return function () { return document.removeEventListener("mousedown", handleClick); };
    }, [onClose]);
    // Filter positions based on viewport width
    var gridPositions = POSITIONS.filter(function (p) {
        if (p.id === "fullscreen")
            return false;
        if ((p.id === "left-outside" || p.id === "right-outside") && !isLg)
            return false;
        if ((p.id === "left-inside" || p.id === "right-inside") && !isMd)
            return false;
        return true;
    });
    var gridCols = isLg ? "grid-cols-3" : "grid-cols-2";
    var fullscreenSpan = isLg ? "col-span-3" : "col-span-2";
    return (<framer_motion_1.motion.div ref={ref} initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -4 }} transition={{ type: "spring", duration: 0.25, bounce: 0 }} className={(0, react_1.cn)("absolute top-full left-0 right-0 z-10 mt-0", "bg-card border-b border-x border-border/60", "p-3 shadow-lg")}>
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2.5 px-0.5">
        Panel position
      </p>
      <div className={(0, react_1.cn)("grid gap-2", gridCols)}>
        {gridPositions.map(function (pos) { return (<button key={pos.id} type="button" onClick={function () { return onSelect(pos.id); }} className={(0, react_1.cn)("flex flex-col gap-1.5 items-center rounded-lg p-2", "transition-colors duration-100", current === pos.id
                ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                : "hover:bg-accent text-foreground")}>
            <div className="w-[44px] h-[32px]">
              <LayoutDiagram position={pos.id} active={current === pos.id} isXs={isXs}/>
            </div>
            <span className="text-[10px] font-medium leading-none text-center whitespace-nowrap">
              {pos.label}
            </span>
          </button>); })}
        <button type="button" onClick={function () { return onSelect("fullscreen"); }} className={(0, react_1.cn)("flex flex-col gap-1.5 items-center rounded-lg p-2", fullscreenSpan, "transition-colors duration-100", current === "fullscreen"
            ? "bg-primary/10 text-primary ring-1 ring-primary/30"
            : "hover:bg-accent text-foreground")}>
          <div className="w-full h-[32px]">
            <LayoutDiagram position="fullscreen" active={current === "fullscreen"}/>
          </div>
          <span className="text-[10px] font-medium leading-none text-center whitespace-nowrap">
            Full screen
          </span>
        </button>
      </div>
    </framer_motion_1.motion.div>);
}
function ResizeHandle(_a) {
    var position = _a.position, onResizeStart = _a.onResizeStart;
    var isHorizontal = position === "top" || position === "bottom";
    // "inverted" means the resizable edge is at the start of the handle div
    // (left for right-side panels, top for bottom panel)
    var isInverted = position === "right-inside" ||
        position === "right-outside" ||
        position === "bottom";
    var style = isHorizontal
        ? __assign({ position: "absolute", left: 0, right: 0, height: 20, cursor: "ns-resize" }, (position === "bottom" ? { top: 0 } : { bottom: 0 })) : __assign({ position: "absolute", top: 0, bottom: 0, width: 20, cursor: "ew-resize" }, (isInverted ? { left: 0 } : { right: 0 }));
    return (<div style={style} className="group z-10 flex items-center justify-center touch-none" onMouseDown={function (e) {
            e.preventDefault();
            onResizeStart(e.clientX, e.clientY);
        }} onTouchStart={function (e) {
            e.preventDefault();
            var touch = e.touches[0];
            if (touch)
                onResizeStart(touch.clientX, touch.clientY);
        }}>
      <div className={(0, react_1.cn)("transition-[opacity,background-color] duration-150", "group-hover:opacity-100", isHorizontal
            ? "w-24 h-1 rounded-full bg-border/50 group-hover:bg-border"
            : "h-24 w-1 rounded-full bg-border/50 group-hover:bg-border")}/>
    </div>);
}
function PanelHeader(_a) {
    var position = _a.position, isPositionMenuOpen = _a.isPositionMenuOpen, onTogglePositionMenu = _a.onTogglePositionMenu, onPositionSelect = _a.onPositionSelect, onClose = _a.onClose, viewportW = _a.viewportW, isShort = _a.isShort;
    var t = (0, macro_1.useLingui)().t;
    var PositionIcon = {
        "left-outside": lu_1.LuPanelLeft,
        "right-outside": lu_1.LuPanelRight,
        "left-inside": lu_1.LuPanelLeft,
        "right-inside": lu_1.LuPanelRight,
        top: lu_1.LuPanelTop,
        bottom: lu_1.LuPanelBottom,
        fullscreen: lu_1.LuExpand
    }[position];
    return (<div className="relative">
      <div className="flex items-center justify-between h-10 px-3 border-b border-border/60 bg-card/50 shrink-0 select-none">
        <div className="flex items-center gap-1.5">
          <lu_1.LuBotMessageSquare className="size-3.5 text-muted-foreground"/>
          <span className="text-xs font-semibold tracking-tight text-foreground/80">
            Assistant
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          {!isShort && (<button type="button" onClick={onTogglePositionMenu} title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Change panel position"], ["Change panel position"])))} className={(0, react_1.cn)("inline-flex items-center gap-1.5 h-7 px-2 rounded-md text-xs", "transition-colors duration-100", isPositionMenuOpen
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent text-muted-foreground hover:text-foreground")}>
              <PositionIcon className="size-3.5"/>
              <span className="hidden sm:inline text-[11px]">
                {{
                "left-outside": "Left outside",
                "right-outside": "Right outside",
                "left-inside": "Left side",
                "right-inside": "Right side",
                top: "Top",
                bottom: "Bottom",
                fullscreen: "Full screen"
            }[position]}
              </span>
            </button>)}

          <button type="button" onClick={onClose} title={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Close chat"], ["Close chat"])))} className="inline-flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-100">
            <lu_1.LuX className="size-3.5"/>
          </button>
        </div>
      </div>

      <framer_motion_1.AnimatePresence>
        {isPositionMenuOpen && (<PositionMenu current={position} onSelect={onPositionSelect} onClose={onTogglePositionMenu} viewportW={viewportW}/>)}
      </framer_motion_1.AnimatePresence>
    </div>);
}
// ── Main component ────────────────────────────────────────────────────────────
function FloatingChat() {
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, react_2.useState)(false), mounted = _a[0], setMounted = _a[1];
    var _b = useStored("carbon-chat-open", false), isOpen = _b[0], setIsOpen = _b[1];
    var _c = useStored("carbon-chat-position", "right-outside"), position = _c[0], setPosition = _c[1];
    var _d = useStored("carbon-chat-panel-width", DEFAULT_PANEL_WIDTH), panelWidth = _d[0], setPanelWidth = _d[1];
    var _f = useStored("carbon-chat-panel-height", DEFAULT_PANEL_HEIGHT), panelHeight = _f[0], setPanelHeight = _f[1];
    var _g = (0, react_2.useState)(false), isPositionMenuOpen = _g[0], setIsPositionMenuOpen = _g[1];
    // Button position: stored as { x, y } (left/top from viewport)
    var _h = useStored("carbon-chat-btn-pos", {
        x: -1,
        y: -1
    }), btnPos = _h[0], setBtnPos = _h[1];
    // Motion values for instant drag tracking + animated snap on release
    var motionX = (0, framer_motion_1.useMotionValue)(btnPos.x);
    var motionY = (0, framer_motion_1.useMotionValue)(btnPos.y);
    // Track viewport dimensions for responsive layout
    var _j = (0, react_2.useState)(function () {
        return typeof window !== "undefined" ? window.innerWidth : 1280;
    }), viewportW = _j[0], setViewportW = _j[1];
    var _k = (0, react_2.useState)(function () {
        return typeof window !== "undefined" ? window.innerHeight : 900;
    }), viewportH = _k[0], setViewportH = _k[1];
    var dragRef = (0, react_2.useRef)(null);
    var resizeRef = (0, react_2.useRef)(null);
    // Mount check for portal
    (0, react_2.useEffect)(function () {
        setMounted(true);
    }, []);
    // Track viewport dimensions on resize
    (0, react_2.useEffect)(function () {
        var onResize = function () {
            setViewportW(window.innerWidth);
            setViewportH(window.innerHeight);
        };
        window.addEventListener("resize", onResize);
        return function () { return window.removeEventListener("resize", onResize); };
    }, []);
    // Snap button to nearest valid position on mount and whenever viewport width changes.
    // Runs on mount (catches stale stored positions from a different screen size) and on
    // every resize so the button never drifts off-screen.
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = dragRef.current) === null || _a === void 0 ? void 0 : _a.active)
            return;
        var x = motionX.get();
        var y = motionY.get();
        var rawX = x >= 0 ? x : window.innerWidth - BUTTON_SIZE - 24;
        var rawY = y >= 0 ? y : window.innerHeight - BUTTON_SIZE - 24;
        var snap = nearestSnap(rawX, rawY);
        if (snap.x !== x || snap.y !== y) {
            (0, framer_motion_1.animate)(motionX, snap.x, {
                type: "spring",
                duration: 0.4,
                bounce: 0.15
            });
            (0, framer_motion_1.animate)(motionY, snap.y, {
                type: "spring",
                duration: 0.4,
                bounce: 0.15
            });
            setBtnPos(snap);
        }
    }, [viewportW, viewportH, motionX, motionY, setBtnPos]);
    // Auto-correct stored position when viewport shrinks below the breakpoint that supports it.
    // Short-screen (landscape phone) forces fullscreen via effectivePosition — no stored change needed.
    (0, react_2.useEffect)(function () {
        var isMd = viewportW >= 768;
        var isLg = viewportW >= 1024;
        if (!isLg &&
            (position === "left-outside" || position === "right-outside")) {
            setPosition("bottom");
        }
        else if (!isMd &&
            (position === "left-inside" || position === "right-inside")) {
            setPosition("bottom");
        }
    }, [viewportW, position, setPosition]);
    // Pointer-based drag handlers (covers mouse + touch via setPointerCapture).
    // setPointerCapture routes all pointer events to the button for the drag duration,
    // which also suppresses browser scroll (respecting the button's touch-action:none).
    var onBtnPointerDown = (0, react_2.useCallback)(function (e) {
        if (e.pointerType === "mouse" && e.button !== 0)
            return;
        e.currentTarget.setPointerCapture(e.pointerId);
        dragRef.current = {
            active: true,
            startMX: e.clientX,
            startMY: e.clientY,
            startBX: motionX.get(),
            startBY: motionY.get(),
            moved: false
        };
    }, [motionX, motionY]);
    var onBtnPointerMove = (0, react_2.useCallback)(function (e) {
        var d = dragRef.current;
        if (!(d === null || d === void 0 ? void 0 : d.active))
            return;
        var dx = e.clientX - d.startMX;
        var dy = e.clientY - d.startMY;
        if (!d.moved && Math.abs(dx) < 4 && Math.abs(dy) < 4)
            return;
        d.moved = true;
        var rawX = Math.max(0, Math.min(d.startBX + dx, window.innerWidth - BUTTON_SIZE));
        var rawY = Math.max(TOPBAR_HEIGHT, Math.min(d.startBY + dy, window.innerHeight - BUTTON_SIZE));
        motionX.set(rawX);
        motionY.set(rawY);
    }, [motionX, motionY]);
    var onBtnPointerUp = (0, react_2.useCallback)(function (_e) {
        var d = dragRef.current;
        if (!d)
            return;
        dragRef.current = null;
        if (!d.moved) {
            setIsOpen(function (prev) { return !prev; });
        }
        else {
            var snap = nearestSnap(motionX.get(), motionY.get());
            setBtnPos(snap);
            (0, framer_motion_1.animate)(motionX, snap.x, {
                type: "spring",
                duration: 0.4,
                bounce: 0.15
            });
            (0, framer_motion_1.animate)(motionY, snap.y, {
                type: "spring",
                duration: 0.4,
                bounce: 0.15
            });
        }
    }, [motionX, motionY, setBtnPos, setIsOpen]);
    var onBtnPointerCancel = (0, react_2.useCallback)(function (_e) {
        var d = dragRef.current;
        if (!d)
            return;
        dragRef.current = null;
        if (d.moved) {
            var snap = nearestSnap(motionX.get(), motionY.get());
            setBtnPos(snap);
            (0, framer_motion_1.animate)(motionX, snap.x, {
                type: "spring",
                duration: 0.4,
                bounce: 0.15
            });
            (0, framer_motion_1.animate)(motionY, snap.y, {
                type: "spring",
                duration: 0.4,
                bounce: 0.15
            });
        }
    }, [motionX, motionY, setBtnPos]);
    // Panel resize handlers
    var onResizeStart = (0, react_2.useCallback)(function (startX, startY, dimension) {
        var inverted = dimension === "width"
            ? position === "right-inside" || position === "right-outside"
            : position === "bottom";
        resizeRef.current = {
            active: true,
            startMX: startX,
            startMY: startY,
            startSize: dimension === "width" ? panelWidth : panelHeight,
            dimension: dimension,
            inverted: inverted
        };
        var onMove = function (e) {
            var r = resizeRef.current;
            if (!(r === null || r === void 0 ? void 0 : r.active))
                return;
            var cx;
            var cy;
            if (typeof TouchEvent !== "undefined" && e instanceof TouchEvent) {
                var t_1 = e.touches[0];
                if (!t_1)
                    return;
                cx = t_1.clientX;
                cy = t_1.clientY;
                e.preventDefault();
            }
            else {
                cx = e.clientX;
                cy = e.clientY;
            }
            if (r.dimension === "width") {
                var dx = r.inverted ? r.startMX - cx : cx - r.startMX;
                var isOutside = position === "left-outside" || position === "right-outside";
                var maxWidth = isOutside
                    ? Math.max(MIN_PANEL_SIZE, window.innerWidth - 640)
                    : window.innerWidth * 0.85;
                setPanelWidth(Math.max(MIN_PANEL_SIZE, Math.min(r.startSize + dx, maxWidth)));
            }
            else {
                var dy = r.inverted ? r.startMY - cy : cy - r.startMY;
                setPanelHeight(Math.max(MIN_PANEL_SIZE, Math.min(r.startSize + dy, window.innerHeight * 0.9)));
            }
        };
        var onUp = function () {
            resizeRef.current = null;
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
            window.removeEventListener("touchmove", onMove);
            window.removeEventListener("touchend", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        window.addEventListener("touchmove", onMove, {
            passive: false
        });
        window.addEventListener("touchend", onUp);
    }, [position, panelWidth, panelHeight, setPanelWidth, setPanelHeight]);
    // Short screen (landscape phone, h < 500px): force fullscreen without mutating stored position
    var isShort = viewportH < 500;
    var effectivePosition = isShort ? "fullscreen" : position;
    // Push the page layout sideways when an outside panel is open by setting CSS vars on <html>.
    // The layout shell reads --chat-panel-left / --chat-panel-right and applies them as padding.
    // Must be placed after effectivePosition is declared to avoid temporal dead zone.
    (0, react_2.useEffect)(function () {
        var root = document.documentElement;
        if (isOpen && effectivePosition === "left-outside") {
            root.style.setProperty("--chat-panel-left", "".concat(panelWidth, "px"));
            root.style.setProperty("--chat-panel-right", "0px");
        }
        else if (isOpen && effectivePosition === "right-outside") {
            root.style.setProperty("--chat-panel-left", "0px");
            root.style.setProperty("--chat-panel-right", "".concat(panelWidth, "px"));
        }
        else {
            root.style.setProperty("--chat-panel-left", "0px");
            root.style.setProperty("--chat-panel-right", "0px");
        }
        return function () {
            root.style.setProperty("--chat-panel-left", "0px");
            root.style.setProperty("--chat-panel-right", "0px");
        };
    }, [isOpen, effectivePosition, panelWidth]);
    // Compute panel CSS
    var panelStyle = function () {
        var base = {
            position: "fixed",
            zIndex: effectivePosition === "fullscreen" ? 50 : 40
        };
        // On xs (<640px) top/bottom panels go full-width (no nav offset) and height is capped
        var isXs = viewportW < 640;
        var hOffset = isXs ? 0 : NAV_WIDTH;
        var safeH = isXs
            ? Math.min(panelHeight, Math.round(window.innerHeight * 0.6))
            : panelHeight;
        switch (effectivePosition) {
            case "left-outside":
                return __assign(__assign({}, base), { left: 0, top: TOPBAR_HEIGHT, bottom: 0, width: panelWidth });
            case "right-outside":
                return __assign(__assign({}, base), { right: 0, top: TOPBAR_HEIGHT, bottom: 0, width: panelWidth });
            case "left-inside":
                return __assign(__assign({}, base), { left: NAV_WIDTH, top: TOPBAR_HEIGHT, bottom: 0, width: panelWidth });
            case "right-inside":
                return __assign(__assign({}, base), { right: 0, top: TOPBAR_HEIGHT, bottom: 0, width: panelWidth });
            case "top":
                return __assign(__assign({}, base), { left: hOffset, right: 0, top: TOPBAR_HEIGHT, height: safeH });
            case "bottom":
                return __assign(__assign({}, base), { left: hOffset, right: 0, bottom: 0, height: safeH });
            case "fullscreen":
                return __assign(__assign({}, base), { inset: 0 });
        }
    };
    var panelEnterVariants = {
        "left-outside": { x: "-100%", opacity: 0 },
        "right-outside": { x: "100%", opacity: 0 },
        "left-inside": { x: "-100%", opacity: 0 },
        "right-inside": { x: "100%", opacity: 0 },
        top: { y: "-100%", opacity: 0 },
        bottom: { y: "100%", opacity: 0 },
        fullscreen: { opacity: 0, scale: 0.97 }
    };
    var isResizable = !isShort &&
        [
            "left-outside",
            "right-outside",
            "left-inside",
            "right-inside",
            "top",
            "bottom"
        ].includes(effectivePosition);
    var resizeDimension = effectivePosition === "top" || effectivePosition === "bottom"
        ? "height"
        : "width";
    if (!mounted)
        return null;
    return (0, react_dom_1.createPortal)(<>
      {/* Floating trigger button */}
      <framer_motion_1.AnimatePresence initial={false}>
        {!isOpen && (<framer_motion_1.motion.button key="floating-btn" type="button" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ type: "spring", duration: 0.35, bounce: 0 }} style={{
                position: "fixed",
                left: motionX,
                top: motionY,
                width: BUTTON_SIZE,
                height: BUTTON_SIZE,
                zIndex: 50
            }} className={(0, react_1.cn)("rounded-full", "bg-primary text-primary-foreground", "flex items-center justify-center", "shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.12),0_8px_24px_rgba(0,0,0,0.15)]", "hover:shadow-[0_0_0_1px_rgba(0,0,0,0.10),0_4px_8px_rgba(0,0,0,0.15),0_12px_32px_rgba(0,0,0,0.20)]", "cursor-grab active:cursor-grabbing", "select-none outline-none touch-none", "active:scale-[0.96]", "transition-[box-shadow] duration-200")} onPointerDown={onBtnPointerDown} onPointerMove={onBtnPointerMove} onPointerUp={onBtnPointerUp} onPointerCancel={onBtnPointerCancel} title={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Open AI Assistant (drag to reposition)"], ["Open AI Assistant (drag to reposition)"])))}>
            <lu_1.LuBotMessageSquare className="size-[22px]"/>
          </framer_motion_1.motion.button>)}
      </framer_motion_1.AnimatePresence>

      {/* Chat panel */}
      <framer_motion_1.AnimatePresence initial={false}>
        {isOpen && (<framer_motion_1.motion.div key={"panel-".concat(effectivePosition)} style={panelStyle()} initial={panelEnterVariants[effectivePosition]} animate={{ x: 0, y: 0, opacity: 1, scale: 1 }} exit={panelEnterVariants[effectivePosition]} transition={{ type: "spring", duration: 0.35, bounce: 0 }} className={(0, react_1.cn)("flex flex-col overflow-hidden", "bg-background", "shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_8px_32px_rgba(0,0,0,0.18),0_32px_64px_rgba(0,0,0,0.12)]", effectivePosition === "left-outside" &&
                "rounded-tr-2xl border-r border-border")}>
            {/* Resize handle (rendered before header so it's on the edge) */}
            {isResizable && (<ResizeHandle position={effectivePosition} onResizeStart={function (x, y) { return onResizeStart(x, y, resizeDimension); }}/>)}

            {/* Header */}
            <PanelHeader position={effectivePosition} isPositionMenuOpen={isPositionMenuOpen} onTogglePositionMenu={function () {
                return setIsPositionMenuOpen(function (prev) { return !prev; });
            }} onPositionSelect={function (p) {
                setPosition(p);
                setIsPositionMenuOpen(false);
            }} onClose={function () { return setIsOpen(false); }} viewportW={viewportW} isShort={isShort}/>

            {/* Chat interface */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <store_1.Provider>
                <ChatInterface_1.ChatInterface containerClassName="h-full"/>
              </store_1.Provider>
            </div>
          </framer_motion_1.motion.div>)}
      </framer_motion_1.AnimatePresence>
    </>, document.body);
}
var templateObject_1, templateObject_2, templateObject_3;
