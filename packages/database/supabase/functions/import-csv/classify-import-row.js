"use strict";
// Pure per-row decision for supplier/customer CSV import. No DB, no I/O — so it
// is unit-testable with `deno test`. The driver loop owns the running `seenIds`
// / `seenNames` sets and applies the returned action.
//
// Root-cause fix: a blank CSV id must NEVER participate in in-file dedup. The
// previous loop added "" to a Set and then treated every later blank-id row as a
// duplicate, silently dropping them (1 of 58 imported). Here, dedup keys are the
// non-empty id and the (always-present) name.
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifyImportRow = classifyImportRow;
function classifyImportRow(params) {
    var id = params.id, name = params.name, externalIdMap = params.externalIdMap, nameMap = params.nameMap, seenIds = params.seenIds, seenNames = params.seenNames;
    // `name` can be undefined at runtime when the CSV's Name column is unmapped.
    if (!name || name.trim() === "") {
        return { action: "skip", reason: "Missing required Name" };
    }
    if (id && seenIds.has(id)) {
        return { action: "skip", reason: "Duplicate ID \"".concat(id, "\" in file") };
    }
    if (seenNames.has(name)) {
        return { action: "skip", reason: "Duplicate name \"".concat(name, "\" in file") };
    }
    // The CSV name is matched as-is. Whitespace/case normalization is intentionally
    // out of scope for this data-loss fix and is handled by the later identity redesign.
    var matchedById = id ? externalIdMap.get(id) : undefined;
    var matchedByName = matchedById === undefined ? nameMap.get(name) : undefined;
    var existingEntityId = matchedById !== null && matchedById !== void 0 ? matchedById : matchedByName;
    if (existingEntityId !== undefined) {
        return { action: "update", entityId: existingEntityId };
    }
    return { action: "insert" };
}
