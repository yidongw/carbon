"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var asserts_ts_1 = require("https://deno.land/std@0.175.0/testing/asserts.ts");
var classify_import_row_ts_1 = require("./classify-import-row.ts");
var base = function () { return ({
    externalIdMap: new Map(),
    nameMap: new Map(),
    seenIds: new Set(),
    seenNames: new Set(),
}); };
Deno.test("skips a row whose name is blank", function () {
    (0, asserts_ts_1.assertEquals)((0, classify_import_row_ts_1.classifyImportRow)(__assign(__assign({}, base()), { id: "X", name: "   " })), { action: "skip", reason: "Missing required Name" });
});
Deno.test("blank-id rows each insert independently (no collapse on empty id)", function () {
    var ctx = base();
    var d1 = (0, classify_import_row_ts_1.classifyImportRow)(__assign(__assign({}, ctx), { id: "", name: "Acme" }));
    (0, asserts_ts_1.assertEquals)(d1, { action: "insert" });
    ctx.seenNames.add("Acme");
    var d2 = (0, classify_import_row_ts_1.classifyImportRow)(__assign(__assign({}, ctx), { id: "", name: "Globex" }));
    (0, asserts_ts_1.assertEquals)(d2, { action: "insert" });
});
Deno.test("updates when the id matches an existing external id", function () {
    (0, asserts_ts_1.assertEquals)((0, classify_import_row_ts_1.classifyImportRow)(__assign(__assign({}, base()), { id: "SUP-1", name: "Acme", externalIdMap: new Map([["SUP-1", "uuid-1"]]) })), { action: "update", entityId: "uuid-1" });
});
Deno.test("updates when only the name matches an existing record", function () {
    (0, asserts_ts_1.assertEquals)((0, classify_import_row_ts_1.classifyImportRow)(__assign(__assign({}, base()), { id: "", name: "Acme", nameMap: new Map([["Acme", "uuid-2"]]) })), { action: "update", entityId: "uuid-2" });
});
Deno.test("skips a duplicate non-empty id within the file", function () {
    (0, asserts_ts_1.assertEquals)((0, classify_import_row_ts_1.classifyImportRow)(__assign(__assign({}, base()), { id: "SUP-1", name: "Acme 2", seenIds: new Set(["SUP-1"]) })), { action: "skip", reason: 'Duplicate ID "SUP-1" in file' });
});
Deno.test("skips a duplicate name within the file", function () {
    (0, asserts_ts_1.assertEquals)((0, classify_import_row_ts_1.classifyImportRow)(__assign(__assign({}, base()), { id: "", name: "Acme", seenNames: new Set(["Acme"]) })), { action: "skip", reason: 'Duplicate name "Acme" in file' });
});
Deno.test("skips a repeated non-empty id once the caller has recorded it", function () {
    var ctx = base();
    var d1 = (0, classify_import_row_ts_1.classifyImportRow)(__assign(__assign({}, ctx), { id: "SUP-1", name: "Acme" }));
    (0, asserts_ts_1.assertEquals)(d1, { action: "insert" });
    ctx.seenIds.add("SUP-1");
    ctx.seenNames.add("Acme");
    var d2 = (0, classify_import_row_ts_1.classifyImportRow)(__assign(__assign({}, ctx), { id: "SUP-1", name: "Acme 2" }));
    (0, asserts_ts_1.assertEquals)(d2, { action: "skip", reason: 'Duplicate ID "SUP-1" in file' });
});
Deno.test("falls back to name match when a non-empty id has no id match", function () {
    (0, asserts_ts_1.assertEquals)((0, classify_import_row_ts_1.classifyImportRow)(__assign(__assign({}, base()), { id: "SUP-NEW", name: "Acme", nameMap: new Map([["Acme", "uuid-3"]]) })), { action: "update", entityId: "uuid-3" });
});
