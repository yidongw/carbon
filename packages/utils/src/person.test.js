"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var person_1 = require("./person");
(0, vitest_1.describe)("formatPersonName", function () {
    (0, vitest_1.it)("formats first name first by default", function () {
        (0, vitest_1.expect)((0, person_1.formatPersonName)({ firstName: "Wei", lastName: "Zhang" })).toBe("Wei Zhang");
    });
    (0, vitest_1.it)("formats last name first when enabled", function () {
        (0, vitest_1.expect)((0, person_1.formatPersonName)({ firstName: "Wei", lastName: "Zhang" }, true)).toBe("Zhang Wei");
    });
    (0, vitest_1.it)("handles missing first or last name", function () {
        (0, vitest_1.expect)((0, person_1.formatPersonName)({ firstName: "Wei", lastName: null })).toBe("Wei");
        (0, vitest_1.expect)((0, person_1.formatPersonName)({ firstName: null, lastName: "Zhang" }, true)).toBe("Zhang");
    });
    (0, vitest_1.it)("falls back to fullName when parts are missing", function () {
        (0, vitest_1.expect)((0, person_1.formatPersonName)({ fullName: "Wei Zhang" })).toBe("Wei Zhang");
    });
});
