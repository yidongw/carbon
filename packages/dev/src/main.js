"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var citty_1 = require("citty");
var copy_js_1 = require("./commands/copy.js");
var down_js_1 = require("./commands/down.js");
var list_js_1 = require("./commands/list.js");
var migrate_js_1 = require("./commands/migrate.js");
var new_js_1 = require("./commands/new.js");
var remove_js_1 = require("./commands/remove.js");
var reset_js_1 = require("./commands/reset.js");
var status_js_1 = require("./commands/status.js");
var up_js_1 = require("./commands/up.js");
var main = (0, citty_1.defineCommand)({
    meta: {
        name: "crbn",
        description: "Carbon dev CLI (heavy commands; bash router handles checkout)"
    },
    subCommands: {
        up: (0, citty_1.defineCommand)({
            meta: { description: "Boot the per-worktree compose stack and apps" },
            args: {
                migrate: {
                    type: "boolean",
                    default: true,
                    description: "Apply database migrations (use --no-migrate to skip)"
                },
                regen: {
                    type: "boolean",
                    default: true,
                    description: "Regenerate db types + swagger after migrations (use --no-regen to skip)"
                },
                apps: {
                    type: "boolean",
                    default: true,
                    description: "Spawn ERP/MES dev servers (use --no-apps for services-only boot)"
                },
                pull: {
                    type: "boolean",
                    default: false,
                    description: "Always docker compose pull (default: skip when all images exist locally)"
                },
                borrow: {
                    type: "boolean",
                    default: false,
                    description: "Pick another worktree's running containers to use instead of booting a new stack"
                },
                portless: {
                    type: "boolean",
                    default: true,
                    description: "Use portless .dev URLs (use --no-portless for localhost mode)"
                }
            },
            run: function (_a) {
                var args = _a.args;
                return (0, up_js_1.up)({
                    migrate: args.migrate !== false,
                    regen: args.regen !== false,
                    apps: args.apps !== false,
                    pull: args.pull === true,
                    borrow: args.borrow === true,
                    portless: args.portless !== false
                });
            }
        }),
        down: (0, citty_1.defineCommand)({
            meta: { description: "Stop the compose stack (volumes preserved)" },
            run: function () { return (0, down_js_1.down)(); }
        }),
        reset: (0, citty_1.defineCommand)({
            meta: { description: "Wipe volumes + flush redis db, then `up`" },
            run: function () { return (0, reset_js_1.reset)(); }
        }),
        status: (0, citty_1.defineCommand)({
            meta: { description: "Show port assignment + container health" },
            run: function () { return (0, status_js_1.status)(); }
        }),
        migrate: (0, citty_1.defineCommand)({
            meta: {
                description: "Apply database migrations against the worktree's stack (loads .env.local)"
            },
            args: {
                regen: {
                    type: "boolean",
                    default: true,
                    description: "Regenerate db types + swagger after migrations (use --no-regen to skip)"
                },
                force: {
                    type: "boolean",
                    default: false,
                    description: "Schema unreconcilable? Wipe the stack's volumes and re-provision from scratch (prompts to confirm)"
                }
            },
            run: function (_a) {
                var args = _a.args;
                return args.force ? (0, reset_js_1.reset)() : (0, migrate_js_1.migrate)({ regen: args.regen !== false });
            }
        }),
        new: (0, citty_1.defineCommand)({
            meta: { description: "Interactive: create a worktree on a fresh branch" },
            args: {
                branch: {
                    type: "positional",
                    required: false,
                    description: "Branch name (pre-fills the prompt)"
                }
            },
            run: function (_a) {
                var args = _a.args;
                return (0, new_js_1.newWorktree)({
                    branch: typeof args.branch === "string" ? args.branch : undefined
                });
            }
        }),
        list: (0, citty_1.defineCommand)({
            meta: { description: "List worktrees with stack status" },
            run: function () { return (0, list_js_1.listWorktrees)(); }
        }),
        remove: (0, citty_1.defineCommand)({
            meta: { description: "Pick a worktree to delete (with stack teardown)" },
            args: {
                prune: {
                    type: "boolean",
                    default: false,
                    description: "Also delete the git branch after removing the worktree"
                }
            },
            run: function (_a) {
                var args = _a.args;
                return (0, remove_js_1.removeWorktreeCmd)({ prune: args.prune === true });
            }
        }),
        copy: (0, citty_1.defineCommand)({
            meta: {
                description: "Copy file(s) from main checkout into current worktree"
            },
            args: {
                files: {
                    type: "positional",
                    required: true,
                    description: "File path(s) to copy from main checkout"
                }
            },
            run: function (_a) {
                var args = _a.args;
                var files = Array.isArray(args.files)
                    ? args.files.filter(function (f) { return typeof f === "string"; })
                    : typeof args.files === "string"
                        ? [args.files]
                        : [];
                return (0, copy_js_1.copy)(files);
            }
        }),
        env: (0, citty_1.defineCommand)({
            meta: { description: "Environment file management" },
            subCommands: {
                sync: (0, citty_1.defineCommand)({
                    meta: {
                        description: "Sync files listed in package.json#crbn.copy from main checkout"
                    },
                    run: function () { return (0, copy_js_1.envSync)(); }
                })
            }
        }),
        // Stubs so shell completion lists these — the bash router (`bin/crbn`)
        // intercepts them before tsx is invoked. Direct invocation lands here.
        checkout: (0, citty_1.defineCommand)({
            meta: {
                description: "Switch into worktree for <branch> (handled by bash router)"
            },
            run: function () {
                console.error("checkout is handled by the bash router (bin/crbn)");
                process.exit(1);
            }
        })
    }
});
try {
    var tab = (await Promise.resolve().then(function () { return require("@bomb.sh/tab/citty"); })).default;
    await tab(main);
}
catch (_a) {
    // Optional: shell completions only; continue if the package is missing (run `pnpm install`).
}
await (0, citty_1.runMain)(main);
