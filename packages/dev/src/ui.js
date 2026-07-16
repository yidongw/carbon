"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.portsTable = portsTable;
exports.servicesTable = servicesTable;
exports.worktreesTable = worktreesTable;
exports.summaryLines = summaryLines;
var cli_table3_1 = require("cli-table3");
var picocolors_1 = require("picocolors");
var constants_js_1 = require("./constants.js");
var worktree_js_1 = require("./worktree.js");
// ---------------------------------------------------------------------------
// Tables (status / list)
// ---------------------------------------------------------------------------
/** Common cli-table3 style: gray border, no inter-row separators. */
var BASE_STYLE = {
    style: { head: [], border: ["gray"] },
    chars: {
        mid: "",
        "left-mid": "",
        "mid-mid": "",
        "right-mid": ""
    }
};
/** Per-worktree port + redis-db assignment table. */
function portsTable(ports, redisDb) {
    var t = new cli_table3_1.default(__assign({ head: [picocolors_1.default.bold("Service"), picocolors_1.default.bold("Port")] }, BASE_STYLE));
    for (var _i = 0, PORT_NAMES_1 = worktree_js_1.PORT_NAMES; _i < PORT_NAMES_1.length; _i++) {
        var n = PORT_NAMES_1[_i];
        t.push([
            picocolors_1.default.cyan(n.replace("PORT_", "").toLowerCase()),
            picocolors_1.default.bold(String(ports[n]))
        ]);
    }
    t.push([
        picocolors_1.default.cyan("redis (shared)"),
        picocolors_1.default.bold(String(worktree_js_1.SHARED_REDIS_PORT)) +
            picocolors_1.default.dim(typeof redisDb === "number" ? " /db ".concat(redisDb) : " /db ?")
    ]);
    return t.toString();
}
/** Compose-stack health table for `dev status`. */
function servicesTable(containers) {
    var sorted = __spreadArray([], containers, true).sort(function (a, b) {
        return a.Service.localeCompare(b.Service);
    });
    var t = new cli_table3_1.default(__assign({ head: [picocolors_1.default.bold("Service"), picocolors_1.default.bold("Status"), picocolors_1.default.bold("Ports")] }, BASE_STYLE));
    for (var _i = 0, sorted_1 = sorted; _i < sorted_1.length; _i++) {
        var c = sorted_1[_i];
        t.push([picocolors_1.default.cyan(c.Service), colorState(c.State, c.Health), formatPorts(c)]);
    }
    return t.toString();
}
/** Worktree list table for `dev list`. */
function worktreesTable(rows) {
    var t = new cli_table3_1.default(__assign({ head: [picocolors_1.default.bold("Worktree"), picocolors_1.default.bold("Branch"), picocolors_1.default.bold("Stack")] }, BASE_STYLE));
    for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
        var r = rows_1[_i];
        var project = r.slug ? (0, worktree_js_1.projectName)(r.slug) : "—";
        var stack = !r.slug
            ? picocolors_1.default.gray("not initialized")
            : r.dockerState === "running"
                ? picocolors_1.default.green("\u25CF up \u00B7 ".concat(project))
                : r.dockerState
                    ? picocolors_1.default.yellow("".concat(r.dockerState, " \u00B7 ").concat(project))
                    : picocolors_1.default.dim("registered \u00B7 ".concat(project));
        t.push([
            r.current ? picocolors_1.default.bold(picocolors_1.default.cyan(r.path)) : r.path,
            r.branch ? picocolors_1.default.cyan(r.branch) : picocolors_1.default.dim("(detached)"),
            stack
        ]);
    }
    return t.toString();
}
function colorState(state, health) {
    var s = state.toLowerCase();
    if (s === "running" && health === "unhealthy")
        return picocolors_1.default.yellow("◑ unhealthy");
    if (s === "running" && health === "starting")
        return picocolors_1.default.yellow("◐ starting");
    if (s === "running")
        return picocolors_1.default.green("● running");
    if (s === "restarting")
        return picocolors_1.default.yellow("◌ restarting");
    if (s === "exited")
        return picocolors_1.default.red("✗ exited");
    if (s === "created")
        return picocolors_1.default.gray("○ created");
    return picocolors_1.default.dim(state);
}
function formatPorts(c) {
    if (c.Publishers.length === 0)
        return picocolors_1.default.dim("—");
    var seen = new Set();
    var out = [];
    for (var _i = 0, _a = c.Publishers; _i < _a.length; _i++) {
        var p = _a[_i];
        if (!p.PublishedPort)
            continue;
        var key = "".concat(p.PublishedPort, ":").concat(p.TargetPort);
        if (seen.has(key))
            continue;
        seen.add(key);
        out.push("".concat(picocolors_1.default.cyan(String(p.PublishedPort))).concat(picocolors_1.default.dim("→" + p.TargetPort)));
    }
    return out.length ? out.join(" ") : picocolors_1.default.dim("—");
}
// ---------------------------------------------------------------------------
// Summary (boxed URLs printed after `crbn up`)
// ---------------------------------------------------------------------------
/** Boxed list of URLs + DB DSN for the up-summary. */
function summaryLines(ports, apps, 
/** When provided, show portless hostnames; otherwise show localhost URLs. */
branchPrefix) {
    var url = branchPrefix
        ? function (sub, _port) { return "https://".concat(sub, ".").concat(branchPrefix, ".").concat(constants_js_1.TLD); }
        : function (sub, port) { return "http://localhost:".concat(port); };
    var dbUrl = "postgresql://postgres:postgres@localhost:".concat(ports.PORT_DB, "/postgres");
    var lines = [];
    if (apps.includes("erp"))
        lines.push(row(picocolors_1.default.cyan, "ERP", url("erp", ports.PORT_ERP)));
    if (apps.includes("mes"))
        lines.push(row(picocolors_1.default.magenta, "MES", url("mes", ports.PORT_MES)));
    lines.push(row(picocolors_1.default.green, "API", url("api", ports.PORT_API), branchPrefix ? ports.PORT_API : undefined), row(picocolors_1.default.green, "Studio", url("studio", ports.PORT_STUDIO), branchPrefix ? ports.PORT_STUDIO : undefined), row(picocolors_1.default.yellow, "Mail", url("mail", ports.PORT_INBUCKET), branchPrefix ? ports.PORT_INBUCKET : undefined), row(picocolors_1.default.blue, "Inngest", url("inngest", ports.PORT_INNGEST), branchPrefix ? ports.PORT_INNGEST : undefined), "".concat(picocolors_1.default.gray(picocolors_1.default.bold("Postgres".padEnd(8))), "  ").concat(picocolors_1.default.gray(dbUrl)));
    return lines;
}
/**
 * OSC 8 hyperlink. Supported by iTerm2, Terminal.app, Warp, kitty, etc.
 * Falls back to plain text in unsupported terminals.
 */
function link(url, text) {
    var label = text !== null && text !== void 0 ? text : url;
    return "\u001B]8;;".concat(url, "\u001B\\").concat(label, "\u001B]8;;\u001B\\");
}
function row(color, label, url, port) {
    var lbl = color(picocolors_1.default.bold(label.padEnd(8)));
    var target = color(link(url));
    var portTag = port ? "  ".concat(picocolors_1.default.dim(":".concat(port))) : "";
    return "".concat(lbl, "  ").concat(target).concat(portTag);
}
