"use client";
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
exports.Toaster = exports.toast = void 0;
var sonner_1 = require("sonner");
Object.defineProperty(exports, "toast", { enumerable: true, get: function () { return sonner_1.toast; } });
var Toaster = function (_a) {
    var props = __rest(_a, []);
    return (<sonner_1.Toaster className="toaster group" closeButton toastOptions={{
            classNames: {
                toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg selection:bg-slate-900 selection:text-white",
                description: "group-[.toast]:text-muted-foreground",
                actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                closeButton: "group-[.toast]:!bg-transparent group-[.toast]:!text-current group-[.toast]:!border-transparent group-[.toast]:!size-5 group-[.toast]:!left-auto group-[.toast]:!right-2 group-[.toast]:!top-1/2 group-[.toast]:!-translate-y-1/2 group-[.toast]:!translate-x-0 group-[.toast]:!opacity-60 group-[.toast]:hover:!opacity-100 group-[.toast]:!transition-opacity group-[.toast]:!shadow-none",
                success: "group-[.toaster]:bg-blue-700 group-[.toaster]:text-white group-[.toaster]:border-blue-700 ",
                error: "group-[.toaster]:bg-red-600 group-[.toaster]:text-white group-[.toaster]:border-red-600 "
            }
        }} {...props}/>);
};
exports.Toaster = Toaster;
