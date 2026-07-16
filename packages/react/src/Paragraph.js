"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paragraph = Paragraph;
var react_1 = require("@carbon/react");
var paragraphVariants = {
    base: {
        text: "font-sans text-base font-normal text-muted-foreground text-pretty",
        spacing: "mb-3"
    },
    "base/bright": {
        text: "font-sans text-base font-normal text-foreground",
        spacing: "mb-3"
    },
    small: {
        text: "font-sans text-sm font-normal text-muted-foreground",
        spacing: "mb-2"
    },
    "small/bright": {
        text: "font-sans text-sm font-normal text-foreground",
        spacing: "mb-2"
    },
    "extra-small": {
        text: "font-sans text-xs font-normal text-muted-foreground",
        spacing: "mb-1.5"
    },
    "extra-small/bright": {
        text: "font-sans text-xs font-normal text-foreground",
        spacing: "mb-1.5"
    },
    "extra-small/mono": {
        text: "font-mono text-xs font-normal text-muted-foreground",
        spacing: "mb-1.5"
    },
    "extra-small/bright/mono": {
        text: "font-mono text-xs text-foreground",
        spacing: "mb-1.5"
    },
    "extra-small/caps": {
        text: "font-sans text-xs uppercase tracking-wider font-normal text-muted-foreground",
        spacing: "mb-1.5"
    },
    "extra-small/bright/caps": {
        text: "font-sans text-xs uppercase tracking-wider font-normal text-foreground",
        spacing: "mb-1.5"
    },
    "extra-extra-small": {
        text: "font-sans text-xxs font-normal text-muted-foreground",
        spacing: "mb-1"
    },
    "extra-extra-small/bright": {
        text: "font-sans text-xxs font-normal text-foreground",
        spacing: "mb-1"
    },
    "extra-extra-small/caps": {
        text: "font-sans text-xxs uppercase tracking-wider font-normal text-muted-foreground",
        spacing: "mb-1"
    },
    "extra-extra-small/bright/caps": {
        text: "font-sans text-xxs uppercase tracking-wider font-normal text-foreground",
        spacing: "mb-1"
    },
    "extra-extra-small/dimmed/caps": {
        text: "font-sans text-xxs uppercase tracking-wider font-normal text-muted-foreground",
        spacing: "mb-1"
    }
};
function Paragraph(_a) {
    var _b = _a.variant, variant = _b === void 0 ? "base" : _b, className = _a.className, _c = _a.spacing, spacing = _c === void 0 ? false : _c, children = _a.children, props = __rest(_a, ["variant", "className", "spacing", "children"]);
    return (<p className={(0, react_1.cn)(paragraphVariants[variant].text, spacing === true && paragraphVariants[variant].spacing, className)} {...props}>
      {children}
    </p>);
}
