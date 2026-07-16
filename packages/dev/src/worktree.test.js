"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var pathe_1 = require("pathe");
var vitest_1 = require("vitest");
var worktree_js_1 = require("./worktree.js");
(0, vitest_1.describe)("slugify", function () {
    (0, vitest_1.it)("lowercases", function () {
        (0, vitest_1.expect)((0, worktree_js_1.slugify)("Foo")).toBe("foo");
    });
    (0, vitest_1.it)("collapses non-alphanumeric runs to single dash", function () {
        (0, vitest_1.expect)((0, worktree_js_1.slugify)("foo/bar baz")).toBe("foo-bar-baz");
        (0, vitest_1.expect)((0, worktree_js_1.slugify)("foo   bar")).toBe("foo-bar");
    });
    (0, vitest_1.it)("strips leading and trailing dashes", function () {
        (0, vitest_1.expect)((0, worktree_js_1.slugify)("--foo--")).toBe("foo");
        (0, vitest_1.expect)((0, worktree_js_1.slugify)("/foo/")).toBe("foo");
    });
    (0, vitest_1.it)("preserves embedded dashes", function () {
        (0, vitest_1.expect)((0, worktree_js_1.slugify)("feat-add-thing")).toBe("feat-add-thing");
    });
    (0, vitest_1.it)("collapses consecutive dashes", function () {
        (0, vitest_1.expect)((0, worktree_js_1.slugify)("foo--bar")).toBe("foo-bar");
    });
    (0, vitest_1.it)("handles unicode by replacing with dashes", function () {
        (0, vitest_1.expect)((0, worktree_js_1.slugify)("café/résumé")).toBe("caf-r-sum");
    });
    (0, vitest_1.it)("returns empty string when input is empty or all-symbol", function () {
        (0, vitest_1.expect)((0, worktree_js_1.slugify)("")).toBe("");
        (0, vitest_1.expect)((0, worktree_js_1.slugify)("///")).toBe("");
    });
});
(0, vitest_1.describe)("sameWorktreePath", function () {
    var real = (0, node_fs_1.mkdtempSync)((0, pathe_1.join)((0, node_os_1.tmpdir)(), "carbon-worktree-"));
    var link = "".concat(real, "-link");
    (0, node_fs_1.symlinkSync)(real, link);
    (0, vitest_1.afterAll)(function () {
        (0, node_fs_1.rmSync)(link, { force: true });
        (0, node_fs_1.rmSync)(real, { recursive: true, force: true });
    });
    (0, vitest_1.it)("treats a symlink and its real path as the same worktree", function () {
        (0, vitest_1.expect)((0, worktree_js_1.sameWorktreePath)(real, link)).toBe(true);
    });
    (0, vitest_1.it)("ignores trailing slashes", function () {
        (0, vitest_1.expect)((0, worktree_js_1.sameWorktreePath)("".concat(real, "/"), real)).toBe(true);
    });
    (0, vitest_1.it)("distinguishes unrelated paths", function () {
        (0, vitest_1.expect)((0, worktree_js_1.sameWorktreePath)(real, (0, node_os_1.tmpdir)())).toBe(false);
    });
});
