import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useModules } from "~/hooks/useModules";
import { path } from "~/utils/path";

// Idle "screensaver" for kiosk/tablet displays: after a period of no
// interaction it navigates to the CURRENT module's dashboard (its landing
// route) and shows a full-screen capture layer; the first touch returns to
// wherever the user was. Keeps the screen awake while enabled.
//
// Enable per-device (so office desktops are unaffected): open the app with
// `?kiosk=1`, or run inside the native app. Timeout: `?idle=<seconds>` or
// localStorage `screensaver:timeoutMs`, default 3 minutes.

const DEFAULT_TIMEOUT_MS = 180_000;
const WAKE_GRACE_MS = 600; // ignore interaction right after activating
const MINUTES_KEY = "screensaver:minutes";

// "/x/sales/dashboard" -> "sales" (mirrors getModule in PrimaryNavigation)
const moduleSeg = (p: string) => p.split("/")?.[2];

// Per-device override (localStorage, this browser only): minutes > 0 = on with
// that timeout; 0 = off on this device; null/unset = fall back to kiosk default.
// Read/written by the account "This Device" settings page.
export function readScreensaverMinutes(): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(MINUTES_KEY);
  if (raw === null || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function writeScreensaverMinutes(minutes: number | null) {
  if (typeof window === "undefined") return;
  if (minutes === null) window.localStorage.removeItem(MINUTES_KEY);
  else window.localStorage.setItem(MINUTES_KEY, String(minutes));
}

function kioskMode(): boolean {
  if (typeof window === "undefined") return false;
  if (new URLSearchParams(window.location.search).get("kiosk") === "1")
    return true;
  const cap = (window as any).Capacitor;
  return !!cap?.isNativePlatform?.();
}

function readEnabled(): boolean {
  // Explicit per-device setting wins (enables/disables regardless of kiosk).
  const minutes = readScreensaverMinutes();
  if (minutes !== null) return minutes > 0;
  // Default: only in kiosk mode (native app or ?kiosk=1).
  return kioskMode();
}

function readTimeoutMs(): number {
  const minutes = readScreensaverMinutes();
  if (minutes !== null && minutes > 0) return minutes * 60_000;
  if (typeof window === "undefined") return DEFAULT_TIMEOUT_MS;
  const fromUrl = new URLSearchParams(window.location.search).get("idle");
  if (fromUrl && Number(fromUrl) > 0)
    return Math.max(15, Number(fromUrl)) * 1000;
  return DEFAULT_TIMEOUT_MS;
}

export function Screensaver() {
  const location = useLocation();
  const navigate = useNavigate();
  const modules = useModules();

  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);

  const activeRef = useRef(false);
  const activatedAtRef = useRef(0);
  const returnToRef = useRef("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wakeLockRef = useRef<any>(null);

  // Latest location without re-binding all listeners each navigation.
  const locRef = useRef(location);
  locRef.current = location;

  const timeoutMs = useMemo(() => readTimeoutMs(), []);

  useEffect(() => {
    setEnabled(readEnabled());
  }, []);

  const acquireWakeLock = useCallback(async () => {
    try {
      const wl = (navigator as any).wakeLock;
      if (wl?.request) wakeLockRef.current = await wl.request("screen");
    } catch {
      /* wake lock unsupported / rejected — harmless */
    }
  }, []);

  const activate = useCallback(() => {
    if (activeRef.current) return;
    const loc = locRef.current;
    const cur = moduleSeg(loc.pathname);
    const mod = modules.find((m) => moduleSeg(m.to) === cur);
    const target = mod?.to ?? path.to.authenticatedRoot;
    returnToRef.current = loc.pathname + loc.search;
    activeRef.current = true;
    activatedAtRef.current = Date.now();
    setActive(true);
    if (target !== loc.pathname) navigate(target);
  }, [modules, navigate]);

  const wake = useCallback(() => {
    if (!activeRef.current) return;
    if (Date.now() - activatedAtRef.current < WAKE_GRACE_MS) return;
    activeRef.current = false;
    setActive(false);
    const back = returnToRef.current;
    const here = locRef.current.pathname + locRef.current.search;
    if (back && back !== here) navigate(back);
  }, [navigate]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(activate, timeoutMs);
  }, [activate, timeoutMs]);

  useEffect(() => {
    if (!enabled) return;
    acquireWakeLock();

    const onInteract = () => {
      if (activeRef.current) wake();
      else resetTimer();
    };
    const events = [
      "pointerdown",
      "keydown",
      "touchstart",
      "mousemove",
      "wheel"
    ] as const;
    for (const e of events)
      window.addEventListener(e, onInteract, { passive: true });

    const onVisible = () => {
      if (document.visibilityState === "visible") acquireWakeLock();
    };
    document.addEventListener("visibilitychange", onVisible);

    resetTimer();

    return () => {
      for (const e of events) window.removeEventListener(e, onInteract);
      document.removeEventListener("visibilitychange", onVisible);
      if (timerRef.current) clearTimeout(timerRef.current);
      try {
        wakeLockRef.current?.release?.();
      } catch {
        /* ignore */
      }
    };
  }, [enabled, resetTimer, wake, acquireWakeLock]);

  if (!enabled || !active) return null;

  return (
    <div
      onPointerDown={wake}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "transparent",
        cursor: "none",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: 24
      }}
    >
      <div
        style={{
          padding: "6px 14px",
          borderRadius: 999,
          background: "rgba(0,0,0,0.45)",
          color: "#fff",
          fontSize: 13,
          fontFamily: "system-ui, sans-serif"
        }}
      >
        屏保 · 轻触唤醒
      </div>
    </div>
  );
}

export default Screensaver;
