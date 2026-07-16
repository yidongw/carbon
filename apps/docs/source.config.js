"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guide = exports.docs = void 0;
var config_1 = require("fumadocs-mdx/config");
var zod_1 = require("zod");
exports.docs = (0, config_1.defineDocs)({
    dir: "content/docs",
});
// The editorial Guide. Same MDX pipeline as the Reference, but each file is a
// chapter: `label` is its display marker (e.g. "(I)") and `index` orders the rail.
exports.guide = (0, config_1.defineDocs)({
    dir: "content/guides",
    docs: {
        schema: config_1.frontmatterSchema.extend({
            label: zod_1.z.string(),
            index: zod_1.z.number(),
            // Each chapter belongs to a flow (a self-contained tour). `flow` is the
            // stable id, `flowName` its display label, `flowIndex` orders the flows in
            // the subnav. Existing chapters default into the original make-to-order flow.
            flow: zod_1.z.string().default("make-to-order"),
            flowName: zod_1.z.string().default("Make to order"),
            flowIndex: zod_1.z.number().default(0),
        }),
    },
});
exports.default = (0, config_1.defineConfig)({
    mdxOptions: {
        // Dark code blocks everywhere, themed with Night Owl. Provide BOTH themes
        // explicitly (same theme) so fumadocs replaces its default github-light/github-dark-default
        // pair — a single `theme` leaves the default light theme referenced and shiki throws
        // "Theme `github-light` not found". Tokens then carry --shiki-light/--shiki-dark
        // vars, which the editorial code panel resolves to a color in reference.css.
        rehypeCodeOptions: {
            themes: { light: "github-dark-default", dark: "github-dark-default" },
        },
    },
});
