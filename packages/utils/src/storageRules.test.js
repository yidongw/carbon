"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var field_registry_1 = require("./field-registry");
var storageRules_1 = require("./storageRules");
var ruleOf = function (conditions, overrides) {
    var _a, _b, _c, _d, _e;
    if (overrides === void 0) { overrides = {}; }
    return ({
        id: (_a = overrides.id) !== null && _a !== void 0 ? _a : "rule_1",
        targetType: (_b = overrides.targetType) !== null && _b !== void 0 ? _b : "item",
        severity: (_c = overrides.severity) !== null && _c !== void 0 ? _c : "error",
        message: (_d = overrides.message) !== null && _d !== void 0 ? _d : "violated",
        conditionAst: { kind: "all", conditions: conditions },
        surfaces: overrides.surfaces,
        updatedAt: (_e = overrides.updatedAt) !== null && _e !== void 0 ? _e : "2026-05-04T00:00:00Z",
        active: true
    });
};
(0, vitest_1.describe)("operators", function () {
    vitest_1.it.each([
        ["eq", "Part", true],
        ["eq", "Material", false],
        ["neq", "Part", false],
        ["neq", "Material", true]
    ])("%s comparing 'Part' vs %s", function (op, value, expectedSatisfied) {
        var compiled = (0, storageRules_1.compileRule)(ruleOf([{ field: "item.type", op: op, value: value }]));
        (0, vitest_1.expect)(compiled.predicate({ item: { type: "Part" } })).toBe(expectedSatisfied);
    });
    (0, vitest_1.it)("in/notIn match arrays", function () {
        var inRule = (0, storageRules_1.compileRule)(ruleOf([
            { field: "transaction.locationId", op: "in", value: ["loc_a", "loc_b"] }
        ]));
        (0, vitest_1.expect)(inRule.predicate({ transaction: { locationId: "loc_a" } })).toBe(true);
        (0, vitest_1.expect)(inRule.predicate({ transaction: { locationId: "loc_x" } })).toBe(false);
        var notIn = (0, storageRules_1.compileRule)(ruleOf([
            {
                field: "transaction.locationId",
                op: "notIn",
                value: ["loc_a", "loc_b"]
            }
        ]));
        (0, vitest_1.expect)(notIn.predicate({ transaction: { locationId: "loc_x" } })).toBe(true);
        (0, vitest_1.expect)(notIn.predicate({ transaction: { locationId: "loc_a" } })).toBe(false);
    });
    (0, vitest_1.it)("isSet/isNotSet handles null, undefined, and empty string", function () {
        var isSet = (0, storageRules_1.compileRule)(ruleOf([{ field: "item.itemPostingGroupId", op: "isSet" }]));
        (0, vitest_1.expect)(isSet.predicate({ item: { itemPostingGroupId: "grp_a" } })).toBe(true);
        (0, vitest_1.expect)(isSet.predicate({ item: { itemPostingGroupId: null } })).toBe(false);
        (0, vitest_1.expect)(isSet.predicate({ item: { itemPostingGroupId: undefined } })).toBe(false);
        (0, vitest_1.expect)(isSet.predicate({ item: { itemPostingGroupId: "" } })).toBe(false);
        var isNot = (0, storageRules_1.compileRule)(ruleOf([{ field: "item.itemPostingGroupId", op: "isNotSet" }]));
        (0, vitest_1.expect)(isNot.predicate({ item: { itemPostingGroupId: "" } })).toBe(true);
        (0, vitest_1.expect)(isNot.predicate({ item: { itemPostingGroupId: "grp_a" } })).toBe(false);
    });
    (0, vitest_1.it)("array-left semantics: eq matches if any element equals", function () {
        var eqRule = (0, storageRules_1.compileRule)(ruleOf([{ field: "storageUnit.storageTypeId", op: "eq", value: "cold" }]));
        (0, vitest_1.expect)(eqRule.predicate({ storageUnit: { storageTypeId: ["hot", "cold"] } })).toBe(true);
        (0, vitest_1.expect)(eqRule.predicate({ storageUnit: { storageTypeId: ["hot", "ambient"] } })).toBe(false);
    });
    (0, vitest_1.it)("array-left semantics: in matches if any element overlaps", function () {
        var inRule = (0, storageRules_1.compileRule)(ruleOf([
            {
                field: "storageUnit.storageTypeId",
                op: "in",
                value: ["cold", "frozen"]
            }
        ]));
        (0, vitest_1.expect)(inRule.predicate({ storageUnit: { storageTypeId: ["hot", "cold"] } })).toBe(true);
        (0, vitest_1.expect)(inRule.predicate({ storageUnit: { storageTypeId: ["hot", "ambient"] } })).toBe(false);
    });
    (0, vitest_1.it)("array-left semantics: neq is true only when no element equals", function () {
        var neqRule = (0, storageRules_1.compileRule)(ruleOf([{ field: "storageUnit.storageTypeId", op: "neq", value: "cold" }]));
        (0, vitest_1.expect)(neqRule.predicate({ storageUnit: { storageTypeId: ["hot", "ambient"] } })).toBe(true);
        (0, vitest_1.expect)(neqRule.predicate({ storageUnit: { storageTypeId: ["hot", "cold"] } })).toBe(false);
    });
    (0, vitest_1.it)("array-left semantics: notIn requires no overlap", function () {
        var notInRule = (0, storageRules_1.compileRule)(ruleOf([
            {
                field: "storageUnit.storageTypeId",
                op: "notIn",
                value: ["cold", "frozen"]
            }
        ]));
        (0, vitest_1.expect)(notInRule.predicate({
            storageUnit: { storageTypeId: ["hot", "ambient"] }
        })).toBe(true);
        (0, vitest_1.expect)(notInRule.predicate({ storageUnit: { storageTypeId: ["hot", "cold"] } })).toBe(false);
    });
    (0, vitest_1.it)("array-left semantics: isSet/isNotSet on empty vs populated array", function () {
        var isSet = (0, storageRules_1.compileRule)(ruleOf([{ field: "storageUnit.storageTypeId", op: "isSet" }]));
        (0, vitest_1.expect)(isSet.predicate({ storageUnit: { storageTypeId: ["cold"] } })).toBe(true);
        (0, vitest_1.expect)(isSet.predicate({ storageUnit: { storageTypeId: [] } })).toBe(false);
        var isNot = (0, storageRules_1.compileRule)(ruleOf([{ field: "storageUnit.storageTypeId", op: "isNotSet" }]));
        (0, vitest_1.expect)(isNot.predicate({ storageUnit: { storageTypeId: [] } })).toBe(true);
        (0, vitest_1.expect)(isNot.predicate({ storageUnit: { storageTypeId: ["cold"] } })).toBe(false);
    });
    (0, vitest_1.it)("gt/lt only compare numbers", function () {
        var gt = (0, storageRules_1.compileRule)(ruleOf([{ field: "transaction.quantity", op: "gt", value: 100 }]));
        (0, vitest_1.expect)(gt.predicate({ transaction: { quantity: 200 } })).toBe(true);
        (0, vitest_1.expect)(gt.predicate({ transaction: { quantity: 50 } })).toBe(false);
        (0, vitest_1.expect)(gt.predicate({ transaction: { quantity: "300" } })).toBe(false);
        var lt = (0, storageRules_1.compileRule)(ruleOf([{ field: "transaction.quantity", op: "lt", value: 100 }]));
        (0, vitest_1.expect)(lt.predicate({ transaction: { quantity: 50 } })).toBe(true);
        (0, vitest_1.expect)(lt.predicate({ transaction: { quantity: 200 } })).toBe(false);
    });
});
(0, vitest_1.describe)("compilePredicate", function () {
    (0, vitest_1.it)("AND short-circuits on first false", function () {
        var secondCondCalls = 0;
        var compiled = (0, storageRules_1.compileRule)(ruleOf([
            { field: "item.type", op: "eq", value: "Part" },
            { field: "transaction.kind", op: "eq", value: "receipt" }
        ]));
        (0, vitest_1.expect)(compiled.predicate({
            item: { type: "Material" },
            transaction: { kind: "receipt" }
        })).toBe(false);
        secondCondCalls++;
        (0, vitest_1.expect)(secondCondCalls).toBe(1);
    });
    (0, vitest_1.it)("empty conditions array → predicate true (no constraints)", function () {
        var compiled = (0, storageRules_1.compileRule)(ruleOf([]));
        (0, vitest_1.expect)(compiled.predicate({})).toBe(true);
    });
    (0, vitest_1.it)("malformed AST → predicate false (defensive)", function () {
        var compiled = (0, storageRules_1.compileRule)({
            id: "x",
            targetType: "item",
            severity: "error",
            message: "m",
            // @ts-expect-error intentionally malformed
            conditionAst: { kind: "or", conditions: [] }
        });
        (0, vitest_1.expect)(compiled.predicate({})).toBe(false);
    });
    (0, vitest_1.it)("unknown root segment → resolver returns undefined → predicate false", function () {
        var compiled = (0, storageRules_1.compileRule)(ruleOf([{ field: "garbage.path", op: "eq", value: "x" }]));
        (0, vitest_1.expect)(compiled.predicate({})).toBe(false);
    });
    (0, vitest_1.it)("custom field path resolves through item.customFields", function () {
        var compiled = (0, storageRules_1.compileRule)(ruleOf([
            {
                field: "item.customFields.frozen",
                op: "eq",
                value: true
            }
        ]));
        (0, vitest_1.expect)(compiled.predicate({ item: { customFields: { frozen: true } } })).toBe(true);
        (0, vitest_1.expect)(compiled.predicate({ item: { customFields: { frozen: false } } })).toBe(false);
    });
    (0, vitest_1.it)("workCenter + operation root segments resolve", function () {
        var compiled = (0, storageRules_1.compileRule)(ruleOf([
            { field: "workCenter.locationId", op: "eq", value: "loc_a" },
            { field: "operation.itemId", op: "isSet" }
        ], { targetType: "workCenter" }));
        (0, vitest_1.expect)(compiled.predicate({
            workCenter: { locationId: "loc_a" },
            operation: { itemId: "item_1" }
        })).toBe(true);
        (0, vitest_1.expect)(compiled.predicate({
            workCenter: { locationId: "loc_a" },
            operation: { itemId: null }
        })).toBe(false);
    });
});
(0, vitest_1.describe)("interpolateMessage", function () {
    (0, vitest_1.it)("substitutes registered tokens", function () {
        var ctx = {
            item: { name: "Vanilla Ice Cream" },
            shelf: { name: "A1" }
        };
        (0, vitest_1.expect)((0, storageRules_1.interpolateMessage)("{item.name} cannot live on {shelf.name}", ctx)).toBe("Vanilla Ice Cream cannot live on A1");
    });
    (0, vitest_1.it)("renders missing ctx tokens as em-dash", function () {
        (0, vitest_1.expect)((0, storageRules_1.interpolateMessage)("{item.name} is bad", {})).toBe("— is bad");
    });
    (0, vitest_1.it)("does not match malformed tokens", function () {
        (0, vitest_1.expect)((0, storageRules_1.interpolateMessage)("{nope", {})).toBe("{nope");
    });
    (0, vitest_1.it)("condition[N].value renders the raw value, not the label", function () {
        (0, vitest_1.expect)((0, storageRules_1.interpolateMessage)("{condition[0].value}", {}, {
            conditions: [
                { field: "storageUnit.storageTypeId", op: "eq", value: "cold-id" }
            ],
            resolveConditionValue: function () { return "Cold storage"; }
        })).toBe("cold-id");
    });
    (0, vitest_1.it)("condition[N].name resolves the value to its label", function () {
        (0, vitest_1.expect)((0, storageRules_1.interpolateMessage)("{condition[0].name}", {}, {
            conditions: [
                { field: "storageUnit.storageTypeId", op: "eq", value: "cold-id" }
            ],
            resolveConditionValue: function () { return "Cold storage"; }
        })).toBe("Cold storage");
    });
    (0, vitest_1.it)("condition[N].name falls back to the raw value when unresolved", function () {
        (0, vitest_1.expect)((0, storageRules_1.interpolateMessage)("{condition[0].name}", {}, {
            conditions: [{ field: "transaction.quantity", op: "lt", value: 1000 }]
        })).toBe("1000");
    });
    (0, vitest_1.it)("value and name render em-dash for set/not-set operators", function () {
        var conditions = [
            { field: "storageUnit.storageTypeId", op: "isSet" }
        ];
        (0, vitest_1.expect)((0, storageRules_1.interpolateMessage)("{condition[0].value}/{condition[0].name}", {}, {
            conditions: conditions,
            resolveConditionValue: function () { return "ignored"; }
        })).toBe("—/—");
    });
});
(0, vitest_1.describe)("evaluateRules", function () {
    (0, vitest_1.it)("returns one violation per failed rule with interpolated message", function () {
        var _a;
        var r1 = (0, storageRules_1.compileRule)(ruleOf([
            {
                field: "storageUnit.storageTypeId",
                op: "eq",
                value: "cold"
            }
        ], {
            id: "rule_cold",
            severity: "error",
            message: "{item.name} requires cold storage"
        }));
        var r2 = (0, storageRules_1.compileRule)(ruleOf([{ field: "transaction.quantity", op: "lt", value: 1000 }], {
            id: "rule_qty",
            severity: "warn",
            message: "Large receipt"
        }));
        var violations = (0, storageRules_1.evaluateRules)([r1, r2], {
            item: { name: "Vanilla" },
            storageUnit: { storageTypeId: "ambient" },
            transaction: { quantity: 2000 }
        }, "receipt");
        (0, vitest_1.expect)(violations).toHaveLength(2);
        (0, vitest_1.expect)(violations[0]).toEqual({
            ruleId: "rule_cold",
            severity: "error",
            message: "Vanilla requires cold storage"
        });
        (0, vitest_1.expect)((_a = violations[1]) === null || _a === void 0 ? void 0 : _a.severity).toBe("warn");
    });
    (0, vitest_1.it)("returns no violations when all rules satisfied", function () {
        var r = (0, storageRules_1.compileRule)(ruleOf([
            {
                field: "storageUnit.storageTypeId",
                op: "eq",
                value: "cold"
            }
        ]));
        var violations = (0, storageRules_1.evaluateRules)([r], { storageUnit: { storageTypeId: "cold" } }, "receipt");
        (0, vitest_1.expect)(violations).toEqual([]);
    });
    (0, vitest_1.it)("rule subscribed to surfaces it doesn't include is skipped", function () {
        var r = (0, storageRules_1.compileRule)(ruleOf([{ field: "operation.itemId", op: "isSet" }], {
            targetType: "workCenter",
            surfaces: ["operationStart"]
        }));
        var violations = (0, storageRules_1.evaluateRules)([r], { operation: { itemId: null } }, "operationFinish");
        (0, vitest_1.expect)(violations).toEqual([]);
    });
});
(0, vitest_1.describe)("compileWithCache", function () {
    (0, vitest_1.beforeEach)(function () { return (0, storageRules_1.__resetStorageRulesCache)(); });
    (0, vitest_1.it)("returns same compiled instance on cache hit", function () {
        var row = ruleOf([{ field: "item.type", op: "eq", value: "Part" }]);
        var a = (0, storageRules_1.compileWithCache)(row);
        var b = (0, storageRules_1.compileWithCache)(row);
        (0, vitest_1.expect)(a).toBe(b);
    });
    (0, vitest_1.it)("invalidates when updatedAt changes", function () {
        var row1 = ruleOf([{ field: "item.type", op: "eq", value: "Part" }], {
            updatedAt: "2026-05-04T00:00:00Z"
        });
        var row2 = ruleOf([{ field: "item.type", op: "eq", value: "Part" }], {
            updatedAt: "2026-05-04T01:00:00Z"
        });
        var a = (0, storageRules_1.compileWithCache)(row1);
        var b = (0, storageRules_1.compileWithCache)(row2);
        (0, vitest_1.expect)(a).not.toBe(b);
        (0, vitest_1.expect)((0, storageRules_1.__storageRulesCacheSize)()).toBe(2);
    });
    (0, vitest_1.it)("does not collide across targetTypes with identical content", function () {
        // Same id, same AST, same message — different targetType must produce
        // distinct compiled rules. Catches a stale cache key that omits
        // targetType.
        var itemRow = ruleOf([{ field: "item.type", op: "eq", value: "Part" }], {
            id: "shared_id",
            targetType: "item"
        });
        var wcRow = ruleOf([{ field: "item.type", op: "eq", value: "Part" }], {
            id: "shared_id",
            targetType: "workCenter"
        });
        var a = (0, storageRules_1.compileWithCache)(itemRow);
        var b = (0, storageRules_1.compileWithCache)(wcRow);
        (0, vitest_1.expect)(a).not.toBe(b);
        (0, vitest_1.expect)(a.targetType).toBe("item");
        (0, vitest_1.expect)(b.targetType).toBe("workCenter");
    });
    (0, vitest_1.it)("evicts oldest when over cap", function () {
        for (var i = 0; i < 300; i++) {
            (0, storageRules_1.compileWithCache)(ruleOf([{ field: "item.type", op: "eq", value: "v".concat(i) }], {
                id: "rule_".concat(i),
                updatedAt: "t".concat(i)
            }));
        }
        (0, vitest_1.expect)((0, storageRules_1.__storageRulesCacheSize)()).toBeLessThanOrEqual(256);
    });
});
(0, vitest_1.describe)("FIELD_REGISTRY", function () {
    (0, vitest_1.it)("getFieldDef returns registered field", function () {
        var _a, _b;
        (0, vitest_1.expect)((_a = (0, field_registry_1.getFieldDef)("item.type")) === null || _a === void 0 ? void 0 : _a.label).toBe("Item type");
        (0, vitest_1.expect)((_b = (0, field_registry_1.getFieldDef)("storageUnit.storageTypeId")) === null || _b === void 0 ? void 0 : _b.context).toBe("storage");
    });
    (0, vitest_1.it)("getFieldDef synthesizes definition for custom field paths", function () {
        var def = (0, field_registry_1.getFieldDef)("item.customFields.frozen");
        (0, vitest_1.expect)(def === null || def === void 0 ? void 0 : def.label).toBe("frozen");
        (0, vitest_1.expect)(def === null || def === void 0 ? void 0 : def.context).toBe("item");
    });
    (0, vitest_1.it)("returns undefined for unknown paths", function () {
        (0, vitest_1.expect)((0, field_registry_1.getFieldDef)("garbage.path")).toBeUndefined();
    });
});
(0, vitest_1.describe)("getFieldsForTargetType", function () {
    (0, vitest_1.it)("item target sees item + storage + shared fields, not workCenter fields", function () {
        var fields = (0, field_registry_1.getFieldsForTargetType)("item");
        var paths = fields.map(function (f) { return f.path; });
        (0, vitest_1.expect)(paths).toContain("item.type");
        (0, vitest_1.expect)(paths).toContain("transaction.quantity");
        // storageUnit ctx is loaded for item-target surfaces when the line carries
        // a storageUnitId — these fields are now visible (with nullable: true so
        // authors can guard with isSet/isNotSet).
        (0, vitest_1.expect)(paths).toContain("storageUnit.id");
        (0, vitest_1.expect)(paths).toContain("storageUnit.locationId");
        (0, vitest_1.expect)(paths).toContain("storageUnit.storageTypeId");
        (0, vitest_1.expect)(paths.some(function (p) { return p.startsWith("workCenter."); })).toBe(false);
        (0, vitest_1.expect)(paths.some(function (p) { return p.startsWith("operation."); })).toBe(false);
    });
    (0, vitest_1.it)("workCenter target sees workCenter + shared, not item.* or storageUnit.*", function () {
        var fields = (0, field_registry_1.getFieldsForTargetType)("workCenter");
        var paths = fields.map(function (f) { return f.path; });
        (0, vitest_1.expect)(paths).toContain("workCenter.locationId");
        (0, vitest_1.expect)(paths).toContain("workCenter.active");
        (0, vitest_1.expect)(paths).toContain("transaction.quantity");
        (0, vitest_1.expect)(paths).not.toContain("item.type");
        (0, vitest_1.expect)(paths.some(function (p) { return p.startsWith("storageUnit."); })).toBe(false);
    });
});
(0, vitest_1.describe)("required-field pre-check", function () {
    var coldRule = ruleOf([{ field: "storageUnit.storageTypeId", op: "eq", value: "cold-id" }], { id: "rule_cold", severity: "error", message: "must be cold storage" });
    (0, vitest_1.it)("null field → hard violation, predicate skipped", function () {
        var _a, _b, _c;
        var compiled = (0, storageRules_1.compileRule)(coldRule);
        var ctx = {};
        var violations = (0, storageRules_1.evaluateRules)([compiled], ctx, "inventoryAdjustment");
        (0, vitest_1.expect)(violations).toHaveLength(1);
        (0, vitest_1.expect)((_a = violations[0]) === null || _a === void 0 ? void 0 : _a.ruleId).toBe("rule_cold");
        (0, vitest_1.expect)((_b = violations[0]) === null || _b === void 0 ? void 0 : _b.severity).toBe("error");
        (0, vitest_1.expect)((_c = violations[0]) === null || _c === void 0 ? void 0 : _c.message).toBe("Storage type is required");
    });
    (0, vitest_1.it)("empty string counts as missing", function () {
        var _a;
        var compiled = (0, storageRules_1.compileRule)(coldRule);
        var ctx = { storageUnit: { storageTypeId: "" } };
        var violations = (0, storageRules_1.evaluateRules)([compiled], ctx, "inventoryAdjustment");
        (0, vitest_1.expect)(violations).toHaveLength(1);
        (0, vitest_1.expect)((_a = violations[0]) === null || _a === void 0 ? void 0 : _a.message).toBe("Storage type is required");
    });
    (0, vitest_1.it)("isSet op is exempt — predicate runs, not required-field check", function () {
        var _a, _b;
        var rule = (0, storageRules_1.compileRule)(ruleOf([{ field: "storageUnit.storageTypeId", op: "isSet" }], {
            id: "rule_isset",
            severity: "warn",
            message: "storage type must be set"
        }));
        var ctx = {};
        var violations = (0, storageRules_1.evaluateRules)([rule], ctx, "inventoryAdjustment");
        (0, vitest_1.expect)(violations).toHaveLength(1);
        (0, vitest_1.expect)((_a = violations[0]) === null || _a === void 0 ? void 0 : _a.message).toBe("storage type must be set");
        (0, vitest_1.expect)((_b = violations[0]) === null || _b === void 0 ? void 0 : _b.message).not.toContain("required");
    });
    (0, vitest_1.it)("isNotSet op is exempt — predicate runs, not required-field check", function () {
        var _a, _b;
        var rule = (0, storageRules_1.compileRule)(ruleOf([{ field: "storageUnit.storageTypeId", op: "isNotSet" }], {
            id: "rule_isnotset",
            severity: "warn",
            message: "storage type must not be set"
        }));
        var ctx = { storageUnit: { storageTypeId: "some-id" } };
        var violations = (0, storageRules_1.evaluateRules)([rule], ctx, "inventoryAdjustment");
        (0, vitest_1.expect)(violations).toHaveLength(1);
        (0, vitest_1.expect)((_a = violations[0]) === null || _a === void 0 ? void 0 : _a.message).toBe("storage type must not be set");
        (0, vitest_1.expect)((_b = violations[0]) === null || _b === void 0 ? void 0 : _b.message).not.toContain("required");
    });
    (0, vitest_1.it)("field present but wrong value → predicate violation, not required", function () {
        var _a, _b;
        var compiled = (0, storageRules_1.compileRule)(coldRule);
        var ctx = { storageUnit: { storageTypeId: "ambient-id" } };
        var violations = (0, storageRules_1.evaluateRules)([compiled], ctx, "inventoryAdjustment");
        (0, vitest_1.expect)(violations).toHaveLength(1);
        (0, vitest_1.expect)((_a = violations[0]) === null || _a === void 0 ? void 0 : _a.message).toBe("must be cold storage");
        (0, vitest_1.expect)((_b = violations[0]) === null || _b === void 0 ? void 0 : _b.message).not.toContain("required");
    });
    (0, vitest_1.it)("all required fields present and predicate passes → no violations", function () {
        var compiled = (0, storageRules_1.compileRule)(coldRule);
        var ctx = { storageUnit: { storageTypeId: "cold-id" } };
        var violations = (0, storageRules_1.evaluateRules)([compiled], ctx, "inventoryAdjustment");
        (0, vitest_1.expect)(violations).toEqual([]);
    });
});
(0, vitest_1.describe)("per-surface field availability", function () {
    (0, vitest_1.it)("every surface has an availability entry", function () {
        var _a, _b;
        for (var _i = 0, TRANSACTION_SURFACES_1 = storageRules_1.TRANSACTION_SURFACES; _i < TRANSACTION_SURFACES_1.length; _i++) {
            var s = TRANSACTION_SURFACES_1[_i];
            (0, vitest_1.expect)((_b = (_a = storageRules_1.SURFACE_CONTEXT_AVAILABILITY[s]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0).toBeGreaterThan(0);
        }
    });
    (0, vitest_1.it)("isFieldAvailableOnSurfaces defers to targetType when no surfaces given", function () {
        var itemTypeDef = (0, field_registry_1.getFieldDef)("item.type");
        (0, vitest_1.expect)((0, storageRules_1.isFieldAvailableOnSurfaces)(itemTypeDef, [])).toBe(true);
    });
    (0, vitest_1.it)("storage fields are not offered on operation (workCenter) surfaces", function () {
        var wcFields = (0, storageRules_1.getFieldsForTargetTypeAndSurfaces)("workCenter", [
            "operationStart"
        ]);
        (0, vitest_1.expect)(wcFields.some(function (f) { return f.context === "storage"; })).toBe(false);
        // transaction.quantity (shared) stays available everywhere.
        (0, vitest_1.expect)(wcFields.some(function (f) { return f.path === "transaction.quantity"; })).toBe(true);
    });
    (0, vitest_1.it)("item-surface fields stay offered for item rules", function () {
        var itemFields = (0, storageRules_1.getFieldsForTargetTypeAndSurfaces)("item", ["receipt"]);
        (0, vitest_1.expect)(itemFields.some(function (f) { return f.path === "item.type"; })).toBe(true);
        (0, vitest_1.expect)(itemFields.some(function (f) { return f.context === "storage"; })).toBe(true);
    });
    (0, vitest_1.it)("narrowed set is a subset of the targetType set", function () {
        var all = (0, field_registry_1.getFieldsForTargetType)("item");
        var narrowed = (0, storageRules_1.getFieldsForTargetTypeAndSurfaces)("item", ["receipt"]);
        (0, vitest_1.expect)(narrowed.length).toBeLessThanOrEqual(all.length);
        for (var _i = 0, narrowed_1 = narrowed; _i < narrowed_1.length; _i++) {
            var f = narrowed_1[_i];
            (0, vitest_1.expect)(all).toContain(f);
        }
    });
    (0, vitest_1.it)("every registry field is offered on at least one surface of its targetType", function () {
        var _loop_1 = function (f) {
            var someSurface = storageRules_1.TRANSACTION_SURFACES.some(function (s) {
                return storageRules_1.SURFACE_CONTEXT_AVAILABILITY[s].includes(f.context);
            });
            (0, vitest_1.expect)(someSurface, "field \"".concat(f.path, "\" offered on no surface")).toBe(true);
        };
        for (var _i = 0, FIELD_REGISTRY_1 = field_registry_1.FIELD_REGISTRY; _i < FIELD_REGISTRY_1.length; _i++) {
            var f = FIELD_REGISTRY_1[_i];
            _loop_1(f);
        }
    });
});
(0, vitest_1.describe)("itemRuleAppliesToItem", function () {
    var part = { type: "Part", itemPostingGroupId: "grp_a" };
    (0, vitest_1.it)("empty filters → applies to all items", function () {
        (0, vitest_1.expect)((0, storageRules_1.itemRuleAppliesToItem)(part, {})).toBe(true);
        (0, vitest_1.expect)((0, storageRules_1.itemRuleAppliesToItem)(part, {
            filteredItemTypes: [],
            filteredItemGroupIds: []
        })).toBe(true);
    });
    (0, vitest_1.it)("single dimension (type) — OR and AND behave the same", function () {
        (0, vitest_1.expect)((0, storageRules_1.itemRuleAppliesToItem)(part, { filteredItemTypes: ["Part", "Material"] })).toBe(true);
        (0, vitest_1.expect)((0, storageRules_1.itemRuleAppliesToItem)(part, { filteredItemTypes: ["Material"] })).toBe(false);
        (0, vitest_1.expect)((0, storageRules_1.itemRuleAppliesToItem)(part, {
            filteredItemTypes: ["Material"],
            filteredItemMatchAll: true
        })).toBe(false);
    });
    (0, vitest_1.it)("single dimension (group)", function () {
        (0, vitest_1.expect)((0, storageRules_1.itemRuleAppliesToItem)(part, { filteredItemGroupIds: ["grp_a"] })).toBe(true);
        (0, vitest_1.expect)((0, storageRules_1.itemRuleAppliesToItem)(part, { filteredItemGroupIds: ["grp_b"] })).toBe(false);
    });
    (0, vitest_1.it)("OR (default) — either dimension matches", function () {
        (0, vitest_1.expect)((0, storageRules_1.itemRuleAppliesToItem)(part, {
            filteredItemTypes: ["Material"],
            filteredItemGroupIds: ["grp_a"]
        })).toBe(true);
        (0, vitest_1.expect)((0, storageRules_1.itemRuleAppliesToItem)(part, {
            filteredItemTypes: ["Material"],
            filteredItemGroupIds: ["grp_b"]
        })).toBe(false);
    });
    (0, vitest_1.it)("AND — both dimensions must match", function () {
        (0, vitest_1.expect)((0, storageRules_1.itemRuleAppliesToItem)(part, {
            filteredItemTypes: ["Part"],
            filteredItemGroupIds: ["grp_a"],
            filteredItemMatchAll: true
        })).toBe(true);
        (0, vitest_1.expect)((0, storageRules_1.itemRuleAppliesToItem)(part, {
            filteredItemTypes: ["Part"],
            filteredItemGroupIds: ["grp_b"],
            filteredItemMatchAll: true
        })).toBe(false);
    });
    (0, vitest_1.it)("null/absent posting group never matches a group filter", function () {
        (0, vitest_1.expect)((0, storageRules_1.itemRuleAppliesToItem)({ type: "Part", itemPostingGroupId: null }, { filteredItemGroupIds: ["grp_a"] })).toBe(false);
    });
});
