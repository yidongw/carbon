"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeToggle = ThemeToggle;
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var dom_1 = require("~/utils/dom");
var path_1 = require("~/utils/path");
function ThemeToggle() {
    var fetcher = (0, react_router_1.useFetcher)();
    var mode = (0, react_1.useMode)();
    var next = mode === "dark" ? "light" : "dark";
    var onClick = function () {
        // Persist host-only (no domain) so it survives regardless of the configured
        // cookie domain. The server's setMode adds a domain attribute that won't match
        // local/preview hosts, so its cookie gets dropped and the theme reverts on
        // revalidation — this host-only cookie is what getMode() reads instead.
        document.cookie = "mode=".concat(next, "; path=/; max-age=31536000; samesite=lax");
        var formData = new FormData();
        formData.append("mode", next);
        (0, dom_1.startModeTransition)(next, function () {
            fetcher.submit(formData, { method: "post", action: path_1.path.to.root });
        });
    };
    return (<button type="button" aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"} onClick={onClick} className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-card text-foreground hover:border-muted-foreground transition-[transform,border-color] duration-150 active:scale-[0.96]">
      {mode === "dark" ? <lu_1.LuSun size={16}/> : <lu_1.LuMoon size={16}/>}
    </button>);
}
