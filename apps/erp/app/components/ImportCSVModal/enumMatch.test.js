"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var enumMatch_1 = require("./enumMatch");
(0, vitest_1.describe)("buildOptionLookup / matchCsvValue", function () {
    (0, vitest_1.it)("matches by label (case- and whitespace-insensitive)", function () {
        var lookup = (0, enumMatch_1.buildOptionLookup)([{ label: "TW Metals", value: "sup-1" }]);
        (0, vitest_1.expect)((0, enumMatch_1.matchCsvValue)(lookup, "  tw metals ")).toBe("sup-1");
    });
    (0, vitest_1.it)("matches by an alias (e.g. readableId) as well as the label", function () {
        var lookup = (0, enumMatch_1.buildOptionLookup)([
            { label: "TW Metals", value: "sup-1", aliases: ["SUP000001"] }
        ]);
        (0, vitest_1.expect)((0, enumMatch_1.matchCsvValue)(lookup, "TW Metals")).toBe("sup-1");
        (0, vitest_1.expect)((0, enumMatch_1.matchCsvValue)(lookup, "sup000001")).toBe("sup-1");
    });
    (0, vitest_1.it)("returns undefined when nothing matches", function () {
        var lookup = (0, enumMatch_1.buildOptionLookup)([
            { label: "TW Metals", value: "sup-1", aliases: ["SUP000001"] }
        ]);
        (0, vitest_1.expect)((0, enumMatch_1.matchCsvValue)(lookup, "Unknown Co")).toBeUndefined();
    });
    (0, vitest_1.it)("ignores empty / whitespace-only keys", function () {
        var lookup = (0, enumMatch_1.buildOptionLookup)([
            { label: "Acme", value: "sup-2", aliases: ["", "   "] }
        ]);
        (0, vitest_1.expect)((0, enumMatch_1.matchCsvValue)(lookup, "acme")).toBe("sup-2");
        (0, vitest_1.expect)((0, enumMatch_1.matchCsvValue)(lookup, "")).toBeUndefined();
    });
    (0, vitest_1.it)("keeps the first option on key collision (deterministic)", function () {
        var lookup = (0, enumMatch_1.buildOptionLookup)([
            { label: "Acme", value: "first" },
            { label: "ACME", value: "second" }
        ]);
        (0, vitest_1.expect)((0, enumMatch_1.matchCsvValue)(lookup, "acme")).toBe("first");
    });
    (0, vitest_1.it)("keeps the earlier option when an alias collides with a later option's label", function () {
        var lookup = (0, enumMatch_1.buildOptionLookup)([
            { label: "Alpha", value: "a", aliases: ["shared"] },
            { label: "shared", value: "b" }
        ]);
        (0, vitest_1.expect)((0, enumMatch_1.matchCsvValue)(lookup, "shared")).toBe("a");
    });
});
(0, vitest_1.describe)("toMatchableOption", function () {
    (0, vitest_1.it)("employees match by email only (name is not a match key)", function () {
        var option = (0, enumMatch_1.toMatchableOption)({ id: "e1", name: "Jane Doe", email: "jane@co.com" }, false);
        (0, vitest_1.expect)(option).toEqual({ label: "jane@co.com", value: "e1" });
    });
    (0, vitest_1.it)("supplier with readable IDs hidden: label is name, readableId is an alias", function () {
        var option = (0, enumMatch_1.toMatchableOption)({ id: "s1", name: "TW Metals", readableId: "SUP000001" }, false);
        (0, vitest_1.expect)(option).toEqual({
            label: "TW Metals",
            value: "s1",
            aliases: ["SUP000001"]
        });
    });
    (0, vitest_1.it)("supplier with readable IDs shown: label is readableId, name is an alias", function () {
        var option = (0, enumMatch_1.toMatchableOption)({ id: "s1", name: "TW Metals", readableId: "SUP000001" }, true);
        (0, vitest_1.expect)(option).toEqual({
            label: "SUP000001",
            value: "s1",
            aliases: ["TW Metals"]
        });
    });
    (0, vitest_1.it)("name-only lookup: label is name, no aliases", function () {
        var option = (0, enumMatch_1.toMatchableOption)({ id: "t1", name: "Raw Material" }, false);
        (0, vitest_1.expect)(option).toEqual({ label: "Raw Material", value: "t1", aliases: [] });
    });
});
