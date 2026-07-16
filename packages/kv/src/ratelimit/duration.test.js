"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var duration_1 = require("./duration");
(0, vitest_1.describe)("duration parser", function () {
    (0, vitest_1.describe)("ms()", function () {
        (0, vitest_1.it)("should parse milliseconds", function () {
            (0, vitest_1.expect)((0, duration_1.ms)("100ms")).toBe(100);
            (0, vitest_1.expect)((0, duration_1.ms)("1ms")).toBe(1);
            (0, vitest_1.expect)((0, duration_1.ms)("1000ms")).toBe(1000);
        });
        (0, vitest_1.it)("should parse milliseconds with space", function () {
            (0, vitest_1.expect)((0, duration_1.ms)("100 ms")).toBe(100);
            (0, vitest_1.expect)((0, duration_1.ms)("1 ms")).toBe(1);
        });
        (0, vitest_1.it)("should parse seconds", function () {
            (0, vitest_1.expect)((0, duration_1.ms)("1s")).toBe(1000);
            (0, vitest_1.expect)((0, duration_1.ms)("10s")).toBe(10000);
            (0, vitest_1.expect)((0, duration_1.ms)("60s")).toBe(60000);
        });
        (0, vitest_1.it)("should parse seconds with space", function () {
            (0, vitest_1.expect)((0, duration_1.ms)("1 s")).toBe(1000);
            (0, vitest_1.expect)((0, duration_1.ms)("10 s")).toBe(10000);
        });
        (0, vitest_1.it)("should parse minutes", function () {
            (0, vitest_1.expect)((0, duration_1.ms)("1m")).toBe(60000);
            (0, vitest_1.expect)((0, duration_1.ms)("5m")).toBe(300000);
            (0, vitest_1.expect)((0, duration_1.ms)("60m")).toBe(3600000);
        });
        (0, vitest_1.it)("should parse minutes with space", function () {
            (0, vitest_1.expect)((0, duration_1.ms)("1 m")).toBe(60000);
            (0, vitest_1.expect)((0, duration_1.ms)("5 m")).toBe(300000);
        });
        (0, vitest_1.it)("should parse hours", function () {
            (0, vitest_1.expect)((0, duration_1.ms)("1h")).toBe(3600000);
            (0, vitest_1.expect)((0, duration_1.ms)("24h")).toBe(86400000);
        });
        (0, vitest_1.it)("should parse hours with space", function () {
            (0, vitest_1.expect)((0, duration_1.ms)("1 h")).toBe(3600000);
            (0, vitest_1.expect)((0, duration_1.ms)("24 h")).toBe(86400000);
        });
        (0, vitest_1.it)("should parse days", function () {
            (0, vitest_1.expect)((0, duration_1.ms)("1d")).toBe(86400000);
            (0, vitest_1.expect)((0, duration_1.ms)("7d")).toBe(604800000);
        });
        (0, vitest_1.it)("should parse days with space", function () {
            (0, vitest_1.expect)((0, duration_1.ms)("1 d")).toBe(86400000);
            (0, vitest_1.expect)((0, duration_1.ms)("7 d")).toBe(604800000);
        });
        (0, vitest_1.it)("should throw on invalid format", function () {
            (0, vitest_1.expect)(function () { return (0, duration_1.ms)("invalid"); }).toThrow("Unable to parse window size");
            (0, vitest_1.expect)(function () { return (0, duration_1.ms)("10"); }).toThrow("Unable to parse window size");
            (0, vitest_1.expect)(function () { return (0, duration_1.ms)("10x"); }).toThrow("Unable to parse window size");
            (0, vitest_1.expect)(function () { return (0, duration_1.ms)(""); }).toThrow("Unable to parse window size");
        });
        (0, vitest_1.it)("should handle edge cases", function () {
            (0, vitest_1.expect)((0, duration_1.ms)("0s")).toBe(0);
            (0, vitest_1.expect)((0, duration_1.ms)("0 s")).toBe(0);
            (0, vitest_1.expect)((0, duration_1.ms)("0m")).toBe(0);
        });
    });
});
