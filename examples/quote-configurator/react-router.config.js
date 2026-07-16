"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vite_1 = require("@vercel/react-router/vite");
exports.default = {
    ssr: true,
    presets: process.env.VERCEL ? [(0, vite_1.vercelPreset)()] : undefined
};
