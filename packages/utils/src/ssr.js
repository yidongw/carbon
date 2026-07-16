"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBrowser = void 0;
exports.isBrowser = typeof document !== "undefined" &&
    typeof globalThis.process === "undefined";
