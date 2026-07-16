"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vite_1 = require("@react-router/dev/vite");
var vite_2 = require("@tailwindcss/vite");
var vite_3 = require("vite");
exports.default = (0, vite_3.defineConfig)({
    build: {
        sourcemap: false,
        rolldownOptions: {
            onwarn: function (warning, defaultHandler) {
                if (warning.code === "SOURCEMAP_ERROR") {
                    return;
                }
                defaultHandler(warning);
            }
        }
    },
    define: {
        global: "globalThis"
    },
    optimizeDeps: {
        extensions: [".css", ".scss", ".sass"] // explicitly include CSS extensions if needed
    },
    ssr: {
        noExternal: ["react-dropzone", "react-icons", "tailwind-merge"]
    },
    server: {
        port: 5001,
        strictPort: true
    },
    resolve: {
        tsconfigPaths: true
    },
    plugins: [(0, vite_2.default)(), (0, vite_1.reactRouter)()]
});
