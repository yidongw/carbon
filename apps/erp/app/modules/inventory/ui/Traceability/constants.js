"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_RADIUS = exports.NODE_SIZE = exports.SPACING = exports.DEPTH = exports.TRACE_API = void 0;
exports.clampDepth = clampDepth;
exports.clampSpacing = clampSpacing;
exports.TRACE_API = {
    expand: "/api/traceability/expand",
    search: "/api/traceability/search"
};
exports.DEPTH = { min: 1, max: 5, default: 1 };
exports.SPACING = { min: 1, max: 5, default: 2 };
exports.NODE_SIZE = 44;
exports.NODE_RADIUS = exports.NODE_SIZE / 2;
function clampDepth(n) {
    return Math.min(Math.max(exports.DEPTH.min, n), exports.DEPTH.max);
}
function clampSpacing(n) {
    return Math.min(Math.max(exports.SPACING.min, n), exports.SPACING.max);
}
