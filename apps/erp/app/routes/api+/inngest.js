"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = exports.loader = void 0;
var inngest_1 = require("@carbon/jobs/inngest");
var remix_1 = require("inngest/remix");
/**
 * Inngest API endpoint.
 *
 * Supports two modes via INNGEST_MODE env var:
 * - "serve" (default): Handle function execution via HTTP
 * - "connect": Return info message, execution handled by worker
 *
 * In "connect" mode, this endpoint still serves function discovery
 * but actual execution happens via the WebSocket worker.
 */
// const mode = process.env.INNGEST_MODE?.toLowerCase() || "serve";
var handler = (0, remix_1.serve)({
    client: inngest_1.inngest,
    functions: inngest_1.functions,
    // Enable streaming for long-running functions on Vercel
    streaming: "allow",
    serveHost: process.env.ERP_URL
});
// In connect mode, we still serve for discovery but can log/track differently
exports.loader = handler;
exports.action = handler;
