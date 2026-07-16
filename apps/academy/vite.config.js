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
var vite_1 = require("@react-router/dev/vite");
var vite_plugin_1 = require("@lingui/vite-plugin");
var vite_2 = require("@tailwindcss/vite");
var node_path_1 = require("node:path");
var vite_3 = require("vite");
var vite_plugin_babel_macros_1 = require("vite-plugin-babel-macros");
exports.default = (0, vite_3.defineConfig)(function (_a) {
    var isSsrBuild = _a.isSsrBuild;
    return ({
        build: {
            sourcemap: false,
            rolldownOptions: __assign({ onwarn: function (warning, defaultHandler) {
                    if (warning.code === "SOURCEMAP_ERROR") {
                        return;
                    }
                    defaultHandler(warning);
                } }, (isSsrBuild && { input: "./server/app.ts" })),
        },
        define: {
            global: "globalThis",
        },
        optimizeDeps: {
            extensions: [".css", ".scss", ".sass"], // explicitly include CSS extensions if needed
        },
        ssr: {
            noExternal: [
                "react-dropzone",
                "react-icons",
                "react-phone-number-input",
                "tailwind-merge",
            ],
        },
        server: {
            port: 4111,
            strictPort: true,
        },
        plugins: [
            (0, vite_2.default)(),
            (0, vite_plugin_babel_macros_1.default)(),
            (0, vite_plugin_1.lingui)(),
            (0, vite_1.reactRouter)(),
        ],
        resolve: {
            tsconfigPaths: true,
            alias: {
                "@carbon/utils": node_path_1.default.resolve(__dirname, "../../packages/utils/src/index.ts"),
                "@carbon/form": node_path_1.default.resolve(__dirname, "../../packages/form/src/index.tsx"),
            },
        },
    });
});
