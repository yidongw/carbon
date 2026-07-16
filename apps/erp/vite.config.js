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
var vite_1 = require("@carbon/dev/vite");
var vite_plugin_1 = require("@lingui/vite-plugin");
var vite_2 = require("@react-router/dev/vite");
var vite_3 = require("@tailwindcss/vite");
var node_path_1 = require("node:path");
var vite_4 = require("vite");
var vite_plugin_babel_macros_1 = require("vite-plugin-babel-macros");
exports.default = (0, vite_4.defineConfig)(function (_a) {
    var isSsrBuild = _a.isSsrBuild, mode = _a.mode;
    (0, vite_1.applyDotenvToProcessEnv)(mode, __dirname);
    return {
        build: {
            minify: true,
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
        ssr: {
            noExternal: [
                "react-tweet",
                "react-dropzone",
                "react-icons",
                "react-phone-number-input",
                "tailwind-merge",
            ],
        },
        server: {
            port: 3000,
            strictPort: true,
            host: "0.0.0.0",
            allowedHosts: [
                ".ngrok-free.app",
                ".ngrok-free.dev",
                ".trycloudflare.com",
                ".foxhole.bot",
                ".dev",
                ".localhost"
            ],
            hmr: process.env.TUNNEL_HMR !== "1"
                ? { clientPort: 3000, host: "localhost" }
                : true,
            watch: {
                awaitWriteFinish: { stabilityThreshold: 250 },
            },
        },
        plugins: [
            (0, vite_3.default)(),
            (0, vite_plugin_babel_macros_1.default)(),
            (0, vite_plugin_1.lingui)(),
            (0, vite_2.reactRouter)(),
        ],
        resolve: {
            tsconfigPaths: true,
            alias: {
                /**
                 * Konva's Node entry (`index-node.js`) requires native `canvas`. Vite SSR
                 * can still load that graph; alias `canvas` to a stub (do not alias the
                 * whole `konva` package — react-konva imports `konva/lib/Core.js`, etc.).
                 */
                canvas: node_path_1.default.resolve(__dirname, "app/ssr-shims/canvas-stub.cjs"),
                "@carbon/utils": node_path_1.default.resolve(__dirname, "../../packages/utils/src/index.ts"),
                "@carbon/form": node_path_1.default.resolve(__dirname, "../../packages/form/src/index.tsx"),
            },
        },
    };
});
