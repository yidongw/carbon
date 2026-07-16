"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inngest = void 0;
var inngest_1 = require("inngest");
/**
 * The Inngest client for Carbon jobs.
 * This client is used to define functions and send events.
 */
exports.inngest = new inngest_1.Inngest({ id: "carbon" });
