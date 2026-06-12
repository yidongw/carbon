import { cn } from "@carbon/react";
import { AnimatePresence, animate as fmAnimate, motion, useMotionValue } from "framer-motion";
import { Provider as ChatStoreProvider } from "@ai-sdk-tools/store";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  LuBotMessageSquare,
  LuExpand,
  LuPanelBottom,
  LuPanelLeft,
  LuPanelRight,
  LuPanelTop,
  LuX
} from "react-icons/lu";
import { ChatInterface } from "./ChatInterface";

type ChatPosition =
  | "left-outside"
  | "right-outside"
  | "left-inside"
  | "right-inside"
  | "top"
  | "bottom"
  | "fullscreen";

const BUTTON_SIZE = 52;
const TOPBAR_HEIGHT = 49;
const NAV_WIDTH = 56;
const DEFAULT_PANEL_WIDTH = 440;
const DEFAULT_PANEL_HEIGHT = 460;
const MIN_PANEL_SIZE = 280;
const EDGE_MARGIN = 12;

function getSnapPositions() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const xL = EDGE_MARGIN;
  const xR = w - BUTTON_SIZE - EDGE_MARGIN;
  const xM = Math.round((xL + xR) / 2);
  const yT = TOPBAR_HEIGHT + EDGE_MARGIN;
  const yB = h - BUTTON_SIZE - EDGE_MARGIN;
  const yM = Math.round((yT + yB) / 2);
  return [
    { x: xL, y: yT }, { x: xM, y: yT }, { x: xR, y: yT },
    { x: xL, y: yM },                    { x: xR, y: yM },
    { x: xL, y: yB }, { x: xM, y: yB }, { x: xR, y: yB },
  ];
}

function nearestSnap(x: number, y: number) {
  const cx = x + BUTTON_SIZE / 2;
  const cy = y + BUTTON_SIZE / 2;
  return getSnapPositions().reduce((best, pos) => {
    const d = Math.hypot(pos.x + BUTTON_SIZE / 2 - cx, pos.y + BUTTON_SIZE / 2 - cy);
    const bd = Math.hypot(best.x + BUTTON_SIZE / 2 - cx, best.y + BUTTON_SIZE / 2 - cy);
    return d < bd ? pos : best;
  });
}

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readStorage(key, fallback));

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev: T) => {
        const result =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        writeStorage(key, result);
        return result;
      });
    },
    [key]
  );

  return [value, set] as const;
}

// ── Position-layout diagrams ────────────────────────────────────────────────

interface LayoutDiagramProps {
  position: ChatPosition;
  active?: boolean;
  isXs?: boolean;
}

function LayoutDiagram({ position, active, isXs }: LayoutDiagramProps) {
  const base = "rounded-[2px]";
  const nav = cn(base, "bg-current opacity-30", "w-[6px]");
  const page = cn(base, "bg-current opacity-10 flex-1");
  const panel = cn(
    base,
    active ? "bg-primary" : "bg-current opacity-50"
  );

  const diagrams: Record<ChatPosition, ReactNode> = {
    "left-outside": (
      <div className="flex gap-[2px] w-full h-full">
        <div className={cn(panel, "w-[10px]")} />
        <div className={cn(nav)} />
        <div className={cn(page)} />
      </div>
    ),
    "right-outside": (
      <div className="flex gap-[2px] w-full h-full">
        <div className={cn(nav)} />
        <div className={cn(page)} />
        <div className={cn(panel, "w-[10px]")} />
      </div>
    ),
    "left-inside": (
      <div className="flex gap-[2px] w-full h-full">
        <div className={cn(nav)} />
        <div className={cn(panel, "w-[10px]")} />
        <div className={cn(page)} />
      </div>
    ),
    "right-inside": (
      <div className="flex gap-[2px] w-full h-full">
        <div className={cn(nav)} />
        <div className={cn(page)} />
        <div className={cn(panel, "w-[10px]")} />
      </div>
    ),
    top: (
      <div className="flex gap-[2px] w-full h-full">
        {!isXs && <div className={cn(nav)} />}
        <div className="flex flex-col gap-[2px] flex-1">
          <div className={cn(panel, "h-[10px]")} />
          <div className={cn(page)} />
        </div>
      </div>
    ),
    bottom: (
      <div className="flex gap-[2px] w-full h-full">
        {!isXs && <div className={cn(nav)} />}
        <div className="flex flex-col gap-[2px] flex-1">
          <div className={cn(page)} />
          <div className={cn(panel, "h-[10px]")} />
        </div>
      </div>
    ),
    fullscreen: (
      <div className={cn(panel, "w-full h-full")} />
    )
  };

  return diagrams[position];
}

// ── Position menu ────────────────────────────────────────────────────────────

const POSITIONS: { id: ChatPosition; label: string }[] = [
  { id: "left-outside", label: "Left outside" },
  { id: "right-outside", label: "Right outside" },
  { id: "left-inside", label: "Left side" },
  { id: "right-inside", label: "Right side" },
  { id: "top", label: "Top" },
  { id: "bottom", label: "Bottom" },
  { id: "fullscreen", label: "Full screen" }
];

interface PositionMenuProps {
  current: ChatPosition;
  onSelect: (p: ChatPosition) => void;
  onClose: () => void;
  viewportW: number;
}

function PositionMenu({ current, onSelect, onClose, viewportW }: PositionMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isXs = viewportW < 640;
  const isMd = viewportW >= 768;
  const isLg = viewportW >= 1024;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  // Filter positions based on viewport width
  const gridPositions = POSITIONS.filter((p) => {
    if (p.id === "fullscreen") return false;
    if ((p.id === "left-outside" || p.id === "right-outside") && !isLg) return false;
    if ((p.id === "left-inside" || p.id === "right-inside") && !isMd) return false;
    return true;
  });

  const gridCols = isLg ? "grid-cols-3" : "grid-cols-2";
  const fullscreenSpan = isLg ? "col-span-3" : "col-span-2";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -4 }}
      transition={{ type: "spring", duration: 0.25, bounce: 0 }}
      className={cn(
        "absolute top-full left-0 right-0 z-10 mt-0",
        "bg-card border-b border-x border-border/60",
        "p-3 shadow-lg"
      )}
    >
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2.5 px-0.5">
        Panel position
      </p>
      <div className={cn("grid gap-2", gridCols)}>
        {gridPositions.map((pos) => (
          <button
            key={pos.id}
            type="button"
            onClick={() => onSelect(pos.id)}
            className={cn(
              "flex flex-col gap-1.5 items-center rounded-lg p-2",
              "transition-colors duration-100",
              current === pos.id
                ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                : "hover:bg-accent text-foreground"
            )}
          >
            <div className="w-[44px] h-[32px]">
              <LayoutDiagram position={pos.id} active={current === pos.id} isXs={isXs} />
            </div>
            <span className="text-[10px] font-medium leading-none text-center whitespace-nowrap">
              {pos.label}
            </span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => onSelect("fullscreen")}
          className={cn(
            "flex flex-row gap-3 items-center rounded-lg px-3 py-2",
            fullscreenSpan,
            "transition-colors duration-100",
            current === "fullscreen"
              ? "bg-primary/10 text-primary ring-1 ring-primary/30"
              : "hover:bg-accent text-foreground"
          )}
        >
          <div className="w-[44px] h-[28px] shrink-0">
            <LayoutDiagram position="fullscreen" active={current === "fullscreen"} />
          </div>
          <span className="text-[10px] font-medium leading-none">
            Full screen
          </span>
        </button>
      </div>
    </motion.div>
  );
}

// ── Resize handle ────────────────────────────────────────────────────────────

interface ResizeHandleProps {
  position: ChatPosition;
  onResizeStart: (e: React.MouseEvent) => void;
}

function ResizeHandle({ position, onResizeStart }: ResizeHandleProps) {
  const isHorizontal = position === "top" || position === "bottom";
  const isInverted = position === "right-inside" || position === "bottom";

  const style: React.CSSProperties = isHorizontal
    ? {
        position: "absolute",
        left: 0,
        right: 0,
        height: 6,
        cursor: "ns-resize",
        ...(position === "bottom" ? { top: 0 } : { bottom: 0 })
      }
    : {
        position: "absolute",
        top: 0,
        bottom: 0,
        width: 6,
        cursor: "ew-resize",
        ...(isInverted ? { left: 0 } : { right: 0 })
      };

  return (
    <div
      style={style}
      className="group z-10"
      onMouseDown={onResizeStart}
    >
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100",
          "transition-opacity duration-150"
        )}
      >
        {isHorizontal ? (
          <div className="w-10 h-[3px] rounded-full bg-border" />
        ) : (
          <div className="h-10 w-[3px] rounded-full bg-border" />
        )}
      </div>
    </div>
  );
}

// ── Panel header ─────────────────────────────────────────────────────────────

interface PanelHeaderProps {
  position: ChatPosition;
  isPositionMenuOpen: boolean;
  onTogglePositionMenu: () => void;
  onPositionSelect: (p: ChatPosition) => void;
  onClose: () => void;
  viewportW: number;
  isShort?: boolean;
}

function PanelHeader({
  position,
  isPositionMenuOpen,
  onTogglePositionMenu,
  onPositionSelect,
  onClose,
  viewportW,
  isShort
}: PanelHeaderProps) {
  const PositionIcon = {
    "left-outside": LuPanelLeft,
    "right-outside": LuPanelRight,
    "left-inside": LuPanelLeft,
    "right-inside": LuPanelRight,
    top: LuPanelTop,
    bottom: LuPanelBottom,
    fullscreen: LuExpand
  }[position];

  return (
    <div className="relative">
      <div className="flex items-center justify-between h-10 px-3 border-b border-border/60 bg-card/50 shrink-0 select-none">
        <div className="flex items-center gap-1.5">
          <LuBotMessageSquare className="size-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold tracking-tight text-foreground/80">
            Assistant
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          {!isShort && <button
            type="button"
            onClick={onTogglePositionMenu}
            title="Change panel position"
            className={cn(
              "inline-flex items-center gap-1.5 h-7 px-2 rounded-md text-xs",
              "transition-colors duration-100",
              isPositionMenuOpen
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent text-muted-foreground hover:text-foreground"
            )}
          >
            <PositionIcon className="size-3.5" />
            <span className="hidden sm:inline text-[11px]">
              {
                {
                  "left-outside": "Left outside",
                  "right-outside": "Right outside",
                  "left-inside": "Left side",
                  "right-inside": "Right side",
                  top: "Top",
                  bottom: "Bottom",
                  fullscreen: "Full screen"
                }[position]
              }
            </span>
          </button>}

          <button
            type="button"
            onClick={onClose}
            title="Close chat"
            className="inline-flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-100"
          >
            <LuX className="size-3.5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isPositionMenuOpen && (
          <PositionMenu
            current={position}
            onSelect={onPositionSelect}
            onClose={onTogglePositionMenu}
            viewportW={viewportW}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function FloatingChat() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useStored("carbon-chat-open", false);
  const [position, setPosition] = useStored<ChatPosition>(
    "carbon-chat-position",
    "right-outside"
  );
  const [panelWidth, setPanelWidth] = useStored(
    "carbon-chat-panel-width",
    DEFAULT_PANEL_WIDTH
  );
  const [panelHeight, setPanelHeight] = useStored(
    "carbon-chat-panel-height",
    DEFAULT_PANEL_HEIGHT
  );
  const [isPositionMenuOpen, setIsPositionMenuOpen] = useState(false);

  // Button position: stored as { x, y } (left/top from viewport)
  const [btnPos, setBtnPos] = useStored("carbon-chat-btn-pos", {
    x: -1,
    y: -1
  });

  // Motion values for instant drag tracking + animated snap on release
  const motionX = useMotionValue(btnPos.x);
  const motionY = useMotionValue(btnPos.y);

  // Track viewport dimensions for responsive layout
  const [viewportW, setViewportW] = useState(
    () => typeof window !== "undefined" ? window.innerWidth : 1280
  );
  const [viewportH, setViewportH] = useState(
    () => typeof window !== "undefined" ? window.innerHeight : 900
  );

  // Ref for native touch event attachment on the floating button
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const dragRef = useRef<{
    active: boolean;
    startMX: number;
    startMY: number;
    startBX: number;
    startBY: number;
    moved: boolean;
  } | null>(null);

  const resizeRef = useRef<{
    active: boolean;
    startMX: number;
    startMY: number;
    startSize: number;
    dimension: "width" | "height";
    inverted: boolean;
  } | null>(null);

  // Mount check for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Track viewport dimensions on resize
  useEffect(() => {
    const onResize = () => {
      setViewportW(window.innerWidth);
      setViewportH(window.innerHeight);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Snap button to nearest valid position on mount and whenever viewport width changes.
  // Runs on mount (catches stale stored positions from a different screen size) and on
  // every resize so the button never drifts off-screen.
  useEffect(() => {
    if (dragRef.current?.active) return;
    const x = motionX.get();
    const y = motionY.get();
    const rawX = x >= 0 ? x : window.innerWidth - BUTTON_SIZE - 24;
    const rawY = y >= 0 ? y : window.innerHeight - BUTTON_SIZE - 24;
    const snap = nearestSnap(rawX, rawY);
    if (snap.x !== x || snap.y !== y) {
      fmAnimate(motionX, snap.x, { type: "spring", duration: 0.4, bounce: 0.15 });
      fmAnimate(motionY, snap.y, { type: "spring", duration: 0.4, bounce: 0.15 });
      setBtnPos(snap);
    }
  }, [viewportW, viewportH, motionX, motionY, setBtnPos]);

  // Auto-correct stored position when viewport shrinks below the breakpoint that supports it.
  // Short-screen (landscape phone) forces fullscreen via effectivePosition — no stored change needed.
  useEffect(() => {
    const isMd = viewportW >= 768;
    const isLg = viewportW >= 1024;
    if (!isLg && (position === "left-outside" || position === "right-outside")) {
      setPosition("bottom");
    } else if (!isMd && (position === "left-inside" || position === "right-inside")) {
      setPosition("bottom");
    }
  }, [viewportW, position, setPosition]);

  // Button drag + click handlers
  const onBtnMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      dragRef.current = {
        active: true,
        startMX: e.clientX,
        startMY: e.clientY,
        startBX: motionX.get(),
        startBY: motionY.get(),
        moved: false
      };
    },
    [motionX, motionY]
  );

  useEffect(() => {
    const applyMove = (clientX: number, clientY: number) => {
      const d = dragRef.current;
      if (!d?.active) return;
      const dx = clientX - d.startMX;
      const dy = clientY - d.startMY;
      if (!d.moved && Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
      d.moved = true;
      const rawX = Math.max(0, Math.min(d.startBX + dx, window.innerWidth - BUTTON_SIZE));
      const rawY = Math.max(TOPBAR_HEIGHT, Math.min(d.startBY + dy, window.innerHeight - BUTTON_SIZE));
      motionX.set(rawX);
      motionY.set(rawY);
    };

    const applyUp = () => {
      const d = dragRef.current;
      if (!d) return;
      if (!d.moved) {
        setIsOpen((prev) => !prev);
      } else {
        const snap = nearestSnap(motionX.get(), motionY.get());
        setBtnPos(snap);
        fmAnimate(motionX, snap.x, { type: "spring", duration: 0.4, bounce: 0.15 });
        fmAnimate(motionY, snap.y, { type: "spring", duration: 0.4, bounce: 0.15 });
      }
      dragRef.current = null;
    };

    const onMouseMove = (e: MouseEvent) => applyMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      e.preventDefault(); // prevent page scroll during drag
      applyMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", applyUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", applyUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", applyUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", applyUp);
    };
  }, [motionX, motionY, setBtnPos, setIsOpen]);

  // Attach native touchstart (non-passive) to the button so touch-drag works on mobile
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      e.preventDefault();
      const t = e.touches[0];
      dragRef.current = {
        active: true,
        startMX: t.clientX,
        startMY: t.clientY,
        startBX: motionX.get(),
        startBY: motionY.get(),
        moved: false
      };
    };
    btn.addEventListener("touchstart", onTouchStart, { passive: false });
    return () => btn.removeEventListener("touchstart", onTouchStart);
  // Re-attaches when button mounts (isOpen → false) or motion values change
  }, [isOpen, motionX, motionY]);

  // Panel resize handlers
  const onResizeStart = useCallback(
    (e: React.MouseEvent, dimension: "width" | "height") => {
      e.preventDefault();
      e.stopPropagation();
      const inverted =
        dimension === "width"
          ? position === "right-inside" || position === "right-outside"
          : position === "bottom";
      resizeRef.current = {
        active: true,
        startMX: e.clientX,
        startMY: e.clientY,
        startSize: dimension === "width" ? panelWidth : panelHeight,
        dimension,
        inverted
      };

      const onMove = (e: MouseEvent) => {
        const r = resizeRef.current;
        if (!r?.active) return;
        if (r.dimension === "width") {
          const dx = r.inverted
            ? r.startMX - e.clientX
            : e.clientX - r.startMX;
          setPanelWidth(
            Math.max(
              MIN_PANEL_SIZE,
              Math.min(r.startSize + dx, window.innerWidth * 0.85)
            )
          );
        } else {
          const dy = r.inverted
            ? r.startMY - e.clientY
            : e.clientY - r.startMY;
          setPanelHeight(
            Math.max(
              MIN_PANEL_SIZE,
              Math.min(r.startSize + dy, window.innerHeight * 0.9)
            )
          );
        }
      };

      const onUp = () => {
        resizeRef.current = null;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [position, panelWidth, panelHeight, setPanelWidth, setPanelHeight]
  );

  // Short screen (landscape phone, h < 500px): force fullscreen without mutating stored position
  const isShort = viewportH < 500;
  const effectivePosition: ChatPosition = isShort ? "fullscreen" : position;

  // Compute panel CSS
  const panelStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "fixed",
      zIndex: effectivePosition === "fullscreen" ? 50 : 40
    };
    // On xs (<640px) top/bottom panels go full-width (no nav offset) and height is capped
    const isXs = viewportW < 640;
    const hOffset = isXs ? 0 : NAV_WIDTH;
    const safeH = isXs
      ? Math.min(panelHeight, Math.round(window.innerHeight * 0.6))
      : panelHeight;
    switch (effectivePosition) {
      case "left-outside":
        return { ...base, left: 0, top: TOPBAR_HEIGHT, bottom: 0, width: panelWidth };
      case "right-outside":
        return { ...base, right: 0, top: TOPBAR_HEIGHT, bottom: 0, width: panelWidth };
      case "left-inside":
        return { ...base, left: NAV_WIDTH, top: TOPBAR_HEIGHT, bottom: 0, width: panelWidth };
      case "right-inside":
        return { ...base, right: 0, top: TOPBAR_HEIGHT, bottom: 0, width: panelWidth };
      case "top":
        return { ...base, left: hOffset, right: 0, top: TOPBAR_HEIGHT, height: safeH };
      case "bottom":
        return { ...base, left: hOffset, right: 0, bottom: 0, height: safeH };
      case "fullscreen":
        return { ...base, inset: 0 };
    }
  };

  const panelEnterVariants = {
    "left-outside": { x: "-100%", opacity: 0 },
    "right-outside": { x: "100%", opacity: 0 },
    "left-inside": { x: "-100%", opacity: 0 },
    "right-inside": { x: "100%", opacity: 0 },
    top: { y: "-100%", opacity: 0 },
    bottom: { y: "100%", opacity: 0 },
    fullscreen: { opacity: 0, scale: 0.97 }
  };

  const isResizable = !isShort && [
    "left-outside",
    "right-outside",
    "left-inside",
    "right-inside",
    "top",
    "bottom"
  ].includes(effectivePosition);
  const resizeDimension =
    effectivePosition === "top" || effectivePosition === "bottom" ? "height" : "width";

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Floating trigger button */}
      <AnimatePresence initial={false}>
        {!isOpen && (
          <motion.button
            key="floating-btn"
            ref={btnRef}
            type="button"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0 }}
            style={{
              position: "fixed",
              left: motionX,
              top: motionY,
              width: BUTTON_SIZE,
              height: BUTTON_SIZE,
              zIndex: 50
            }}
            className={cn(
              "rounded-full",
              "bg-primary text-primary-foreground",
              "flex items-center justify-center",
              "shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.12),0_8px_24px_rgba(0,0,0,0.15)]",
              "hover:shadow-[0_0_0_1px_rgba(0,0,0,0.10),0_4px_8px_rgba(0,0,0,0.15),0_12px_32px_rgba(0,0,0,0.20)]",
              "cursor-grab active:cursor-grabbing",
              "select-none outline-none touch-none",
              "active:scale-[0.96]",
              "transition-[box-shadow] duration-200"
            )}
            onMouseDown={onBtnMouseDown}
            title="Open AI Assistant (drag to reposition)"
          >
            <LuBotMessageSquare className="size-[22px]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key={`panel-${effectivePosition}`}
            style={panelStyle()}
            initial={panelEnterVariants[effectivePosition]}
            animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            exit={panelEnterVariants[effectivePosition]}
            transition={{ type: "spring", duration: 0.35, bounce: 0 }}
            className={cn(
              "flex flex-col overflow-hidden",
              "bg-background",
              "shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_8px_32px_rgba(0,0,0,0.18),0_32px_64px_rgba(0,0,0,0.12)]"
            )}
          >
            {/* Resize handle (rendered before header so it's on the edge) */}
            {isResizable && (
              <ResizeHandle
                position={effectivePosition}
                onResizeStart={(e) => onResizeStart(e, resizeDimension)}
              />
            )}

            {/* Header */}
            <PanelHeader
              position={effectivePosition}
              isPositionMenuOpen={isPositionMenuOpen}
              onTogglePositionMenu={() =>
                setIsPositionMenuOpen((prev) => !prev)
              }
              onPositionSelect={(p) => {
                setPosition(p);
                setIsPositionMenuOpen(false);
              }}
              onClose={() => setIsOpen(false)}
              viewportW={viewportW}
              isShort={isShort}
            />

            {/* Chat interface */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <ChatStoreProvider>
                <ChatInterface containerClassName="h-full" />
              </ChatStoreProvider>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}
