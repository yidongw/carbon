"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ms = ms;
/**
 * Convert a human-readable duration string to milliseconds
 * Matches @upstash/ratelimit duration parsing
 *
 * @example
 * ms("10 s") // 10000
 * ms("1m")   // 60000
 * ms("1 h")  // 3600000
 */
function ms(d) {
    var match = d.match(/^(\d+)\s?(ms|s|m|h|d)$/);
    if (!match) {
        throw new Error("Unable to parse window size: ".concat(d));
    }
    var time = Number.parseInt(match[1]);
    var unit = match[2];
    switch (unit) {
        case "ms":
            return time;
        case "s":
            return time * 1000;
        case "m":
            return time * 1000 * 60;
        case "h":
            return time * 1000 * 60 * 60;
        case "d":
            return time * 1000 * 60 * 60 * 24;
        default:
            throw new Error("Unable to parse window size: ".concat(d));
    }
}
