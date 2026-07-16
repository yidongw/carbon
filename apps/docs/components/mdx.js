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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMDXComponents = void 0;
exports.getMDXComponents = getMDXComponents;
var steps_1 = require("fumadocs-ui/components/steps");
var tabs_1 = require("fumadocs-ui/components/tabs");
var mdx_1 = require("fumadocs-ui/mdx");
var mdx_code_block_1 = require("@/components/api/mdx-code-block");
var checklist_1 = require("@/components/checklist");
// Editorial Callout/Card so the Reference matches the Guide (not Fumadocs defaults).
var reference_components_1 = require("@/components/editorial/reference-components");
var feature_callout_1 = require("@/components/feature-callout");
var frame_1 = require("@/components/frame");
var prose_1 = require("@/components/prose");
var scroll_reveal_1 = require("@/components/scroll-reveal");
function getMDXComponents(components) {
    return __assign(__assign(__assign({}, mdx_1.default), { 
        // Fenced code → our dark API-playground panel (not Fumadocs' default block).
        pre: function (_a) {
            var title = _a.title, children = _a.children;
            return (<mdx_code_block_1.MdxCodeBlock title={typeof title === "string" ? title : undefined}>{children}</mdx_code_block_1.MdxCodeBlock>);
        }, Card: reference_components_1.Card, Cards: reference_components_1.Cards, Callout: reference_components_1.Callout, EnvVar: reference_components_1.EnvVar, EnvVars: reference_components_1.EnvVars, Step: steps_1.Step, Steps: steps_1.Steps, Tab: tabs_1.Tab, Tabs: tabs_1.Tabs, ScrollReveal: scroll_reveal_1.ScrollReveal, FeatureCallout: feature_callout_1.FeatureCallout, Checklist: checklist_1.Checklist, Check: checklist_1.Check, Frame: frame_1.Frame, Eyebrow: prose_1.Eyebrow }), components);
}
exports.useMDXComponents = getMDXComponents;
