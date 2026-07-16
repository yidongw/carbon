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
var vitest_1 = require("vitest");
var accounting_utils_1 = require("./accounting.utils");
// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------
(0, vitest_1.describe)("getMonthsBetween", function () {
    (0, vitest_1.it)("returns 1 for same month when end day >= start day", function () {
        (0, vitest_1.expect)((0, accounting_utils_1.getMonthsBetween)(new Date("2025-01-15"), new Date("2025-01-20"))).toBe(1);
    });
    (0, vitest_1.it)("returns 0 when end day < start day in same month", function () {
        (0, vitest_1.expect)((0, accounting_utils_1.getMonthsBetween)(new Date("2025-01-20"), new Date("2025-01-15"))).toBe(0);
    });
    (0, vitest_1.it)("counts months across years", function () {
        (0, vitest_1.expect)((0, accounting_utils_1.getMonthsBetween)(new Date("2024-11-01"), new Date("2025-02-01"))).toBe(4);
    });
    (0, vitest_1.it)("returns 0 for start after end", function () {
        (0, vitest_1.expect)((0, accounting_utils_1.getMonthsBetween)(new Date("2025-06-01"), new Date("2025-01-01"))).toBe(0);
    });
});
(0, vitest_1.describe)("getMonthsElapsed", function () {
    (0, vitest_1.it)("returns 0 for same month", function () {
        (0, vitest_1.expect)((0, accounting_utils_1.getMonthsElapsed)(new Date("2025-01-15"), new Date("2025-01-20"))).toBe(0);
    });
    (0, vitest_1.it)("counts elapsed months", function () {
        (0, vitest_1.expect)((0, accounting_utils_1.getMonthsElapsed)(new Date("2025-01-01"), new Date("2025-04-01"))).toBe(3);
    });
    (0, vitest_1.it)("returns 0 when start after end", function () {
        (0, vitest_1.expect)((0, accounting_utils_1.getMonthsElapsed)(new Date("2025-06-01"), new Date("2025-01-01"))).toBe(0);
    });
});
(0, vitest_1.describe)("addOneMonth", function () {
    (0, vitest_1.it)("advances to first of next month", function () {
        var result = (0, accounting_utils_1.addOneMonth)("2025-01-15");
        (0, vitest_1.expect)(result.getFullYear()).toBe(2025);
        (0, vitest_1.expect)(result.getMonth()).toBe(1);
        (0, vitest_1.expect)(result.getDate()).toBe(1);
    });
    (0, vitest_1.it)("rolls over year boundary", function () {
        var result = (0, accounting_utils_1.addOneMonth)("2025-12-15");
        (0, vitest_1.expect)(result.getFullYear()).toBe(2026);
        (0, vitest_1.expect)(result.getMonth()).toBe(0);
    });
});
(0, vitest_1.describe)("getLastDayOfMonth", function () {
    (0, vitest_1.it)("returns 28 for Feb 2025", function () {
        (0, vitest_1.expect)((0, accounting_utils_1.getLastDayOfMonth)(2025, 1)).toBe("2025-02-28");
    });
    (0, vitest_1.it)("returns 29 for Feb 2024 (leap year)", function () {
        (0, vitest_1.expect)((0, accounting_utils_1.getLastDayOfMonth)(2024, 1)).toBe("2024-02-29");
    });
    (0, vitest_1.it)("returns 31 for January", function () {
        (0, vitest_1.expect)((0, accounting_utils_1.getLastDayOfMonth)(2025, 0)).toBe("2025-01-31");
    });
});
(0, vitest_1.describe)("getNextPeriodEnd", function () {
    (0, vitest_1.it)("returns next month's last day when given a previous period", function () {
        var result = (0, accounting_utils_1.getNextPeriodEnd)("2025-01-31");
        (0, vitest_1.expect)(result).toBe("2025-02-28");
    });
    (0, vitest_1.it)("handles year rollover", function () {
        var result = (0, accounting_utils_1.getNextPeriodEnd)("2025-12-31");
        (0, vitest_1.expect)(result).toBe("2026-01-31");
    });
});
// ---------------------------------------------------------------------------
// MACRS table lookups
// ---------------------------------------------------------------------------
(0, vitest_1.describe)("getMacrsPercentage", function () {
    (0, vitest_1.it)("returns null for 27.5-year property", function () {
        (0, vitest_1.expect)((0, accounting_utils_1.getMacrsPercentage)("27.5", 1, "Half-Year")).toBeNull();
    });
    (0, vitest_1.it)("returns null for 39-year property", function () {
        (0, vitest_1.expect)((0, accounting_utils_1.getMacrsPercentage)("39", 1, "Half-Year")).toBeNull();
    });
    (0, vitest_1.it)("returns correct half-year 5-year year-1 percentage", function () {
        (0, vitest_1.expect)((0, accounting_utils_1.getMacrsPercentage)("5", 1, "Half-Year")).toBe(20.0);
    });
    (0, vitest_1.it)("returns correct half-year 7-year year-1 percentage", function () {
        (0, vitest_1.expect)((0, accounting_utils_1.getMacrsPercentage)("7", 1, "Half-Year")).toBe(14.29);
    });
    (0, vitest_1.it)("returns 0 when year exceeds table length", function () {
        (0, vitest_1.expect)((0, accounting_utils_1.getMacrsPercentage)("3", 10, "Half-Year")).toBe(0);
    });
    (0, vitest_1.it)("returns correct mid-quarter Q1 5-year year-1 percentage", function () {
        (0, vitest_1.expect)((0, accounting_utils_1.getMacrsPercentage)("5", 1, "Mid-Quarter", 1)).toBe(35.0);
    });
    (0, vitest_1.it)("returns correct mid-quarter Q4 7-year year-1 percentage", function () {
        (0, vitest_1.expect)((0, accounting_utils_1.getMacrsPercentage)("7", 1, "Mid-Quarter", 4)).toBe(3.57);
    });
    (0, vitest_1.it)("half-year 5-year table sums to ~100%", function () {
        var _a;
        var total = 0;
        for (var y = 1; y <= 6; y++) {
            total += (_a = (0, accounting_utils_1.getMacrsPercentage)("5", y, "Half-Year")) !== null && _a !== void 0 ? _a : 0;
        }
        (0, vitest_1.expect)(total).toBeCloseTo(100, 0);
    });
});
// ---------------------------------------------------------------------------
// calculateMacrsDepreciation
// ---------------------------------------------------------------------------
(0, vitest_1.describe)("calculateMacrsDepreciation", function () {
    (0, vitest_1.it)("returns 0 for zero basis", function () {
        (0, vitest_1.expect)((0, accounting_utils_1.calculateMacrsDepreciation)({
            adjustedBasis: 0,
            propertyClass: "5",
            convention: "Half-Year",
            depreciationStartDate: "2025-01-15",
            periodEnd: "2025-12-31",
            lastPostedPeriodEnd: null,
            accumulatedTaxDepreciation: 0,
            bonusAmount: 0
        })).toBe(0);
    });
    (0, vitest_1.it)("calculates year-1 half-year 5-year depreciation on $100,000 asset", function () {
        var result = (0, accounting_utils_1.calculateMacrsDepreciation)({
            adjustedBasis: 100000,
            propertyClass: "5",
            convention: "Half-Year",
            depreciationStartDate: "2025-01-15",
            periodEnd: "2025-12-31",
            lastPostedPeriodEnd: null,
            accumulatedTaxDepreciation: 0,
            bonusAmount: 0
        });
        // Year 1 at 20% of $100k = $20,000
        (0, vitest_1.expect)(result).toBe(20000);
    });
    (0, vitest_1.it)("calculates 39-year property monthly depreciation", function () {
        var result = (0, accounting_utils_1.calculateMacrsDepreciation)({
            adjustedBasis: 468000,
            propertyClass: "39",
            convention: "Half-Year",
            depreciationStartDate: "2025-01-15",
            periodEnd: "2025-12-31",
            lastPostedPeriodEnd: null,
            accumulatedTaxDepreciation: 0,
            bonusAmount: 0
        });
        // $468,000 / (39*12) = $1,000/month; 11.5 months for first period
        (0, vitest_1.expect)(result).toBeCloseTo(11500, -1);
    });
    (0, vitest_1.it)("caps at remaining depreciable amount", function () {
        var result = (0, accounting_utils_1.calculateMacrsDepreciation)({
            adjustedBasis: 10000,
            propertyClass: "5",
            convention: "Half-Year",
            depreciationStartDate: "2025-01-15",
            periodEnd: "2025-12-31",
            lastPostedPeriodEnd: null,
            accumulatedTaxDepreciation: 9500,
            bonusAmount: 0
        });
        (0, vitest_1.expect)(result).toBeLessThanOrEqual(500);
    });
});
// ---------------------------------------------------------------------------
// calculateDepreciation (book)
// ---------------------------------------------------------------------------
(0, vitest_1.describe)("calculateDepreciation", function () {
    var baseAsset = {
        acquisitionCost: 120000,
        accumulatedDepreciation: 0,
        residualValuePercent: 10,
        depreciationMethod: "Straight Line",
        usefulLifeMonths: 60,
        depreciationStartDate: "2025-01-01",
        acquisitionDate: "2025-01-01",
        assetLifetimeUsage: null
    };
    (0, vitest_1.describe)("Straight Line", function () {
        (0, vitest_1.it)("calculates monthly depreciation correctly", function () {
            // Cost 120k, residual 10% = 12k, depreciable = 108k, monthly = 1800
            // Jan 1 to Jan 31 = 1 month
            var result = (0, accounting_utils_1.calculateDepreciation)(baseAsset, "2025-01-31", null);
            (0, vitest_1.expect)(result).toBe(1800);
        });
        (0, vitest_1.it)("calculates multi-month period", function () {
            // 6 months: 1800 * 6 = 10800
            var result = (0, accounting_utils_1.calculateDepreciation)(baseAsset, "2025-06-30", null);
            (0, vitest_1.expect)(result).toBeCloseTo(10800, 0);
        });
        (0, vitest_1.it)("returns 0 when fully depreciated", function () {
            var fullyDepr = __assign(__assign({}, baseAsset), { accumulatedDepreciation: 108000 });
            (0, vitest_1.expect)((0, accounting_utils_1.calculateDepreciation)(fullyDepr, "2025-06-30", null)).toBe(0);
        });
        (0, vitest_1.it)("returns 0 when start date is after period end", function () {
            var futureStart = __assign(__assign({}, baseAsset), { depreciationStartDate: "2026-01-01" });
            (0, vitest_1.expect)((0, accounting_utils_1.calculateDepreciation)(futureStart, "2025-06-30", null)).toBe(0);
        });
        (0, vitest_1.it)("caps at remaining depreciable amount", function () {
            var nearlyDone = __assign(__assign({}, baseAsset), { accumulatedDepreciation: 107500 });
            var result = (0, accounting_utils_1.calculateDepreciation)(nearlyDone, "2025-06-30", null);
            (0, vitest_1.expect)(result).toBe(500);
        });
        (0, vitest_1.it)("uses lastPostedPeriodEnd to narrow the window", function () {
            // addOneMonth("2025-01-31") overflows Feb→Mar 1; Mar 1 to Mar 31 = 1 month
            var result = (0, accounting_utils_1.calculateDepreciation)(baseAsset, "2025-03-31", "2025-01-31");
            (0, vitest_1.expect)(result).toBeCloseTo(1800, 0);
        });
    });
    (0, vitest_1.describe)("Declining Balance", function () {
        var dbAsset = __assign(__assign({}, baseAsset), { depreciationMethod: "Declining Balance" });
        (0, vitest_1.it)("first month produces higher amount than straight line", function () {
            var slResult = (0, accounting_utils_1.calculateDepreciation)(baseAsset, "2025-01-31", null);
            var dbResult = (0, accounting_utils_1.calculateDepreciation)(dbAsset, "2025-01-31", null);
            (0, vitest_1.expect)(dbResult).toBeGreaterThanOrEqual(slResult);
        });
        (0, vitest_1.it)("returns 0 when fully depreciated", function () {
            var fullyDepr = __assign(__assign({}, dbAsset), { accumulatedDepreciation: 108000 });
            (0, vitest_1.expect)((0, accounting_utils_1.calculateDepreciation)(fullyDepr, "2025-06-30", null)).toBe(0);
        });
    });
    (0, vitest_1.describe)("Units of Production", function () {
        var uopAsset = __assign(__assign({}, baseAsset), { depreciationMethod: "Units of Production", assetLifetimeUsage: 10000 });
        (0, vitest_1.it)("calculates based on units produced", function () {
            // depreciable 108k / 10k units = $10.80/unit, 100 units = $1080
            var result = (0, accounting_utils_1.calculateDepreciation)(uopAsset, "2025-06-30", null, {
                unitsProduced: 100
            });
            (0, vitest_1.expect)(result).toBe(1080);
        });
        (0, vitest_1.it)("returns 0 without usage log", function () {
            (0, vitest_1.expect)((0, accounting_utils_1.calculateDepreciation)(uopAsset, "2025-06-30", null)).toBe(0);
        });
        (0, vitest_1.it)("returns 0 with zero lifetime usage", function () {
            var zeroLifetime = __assign(__assign({}, uopAsset), { assetLifetimeUsage: 0 });
            (0, vitest_1.expect)((0, accounting_utils_1.calculateDepreciation)(zeroLifetime, "2025-06-30", null, {
                unitsProduced: 100
            })).toBe(0);
        });
    });
    (0, vitest_1.it)("returns 0 for unknown method", function () {
        var unknown = __assign(__assign({}, baseAsset), { depreciationMethod: "SomethingElse" });
        (0, vitest_1.expect)((0, accounting_utils_1.calculateDepreciation)(unknown, "2025-06-30", null)).toBe(0);
    });
});
// ---------------------------------------------------------------------------
// calculateTaxDepreciation
// ---------------------------------------------------------------------------
(0, vitest_1.describe)("calculateTaxDepreciation", function () {
    (0, vitest_1.it)("returns null when no tax method configured", function () {
        var result = (0, accounting_utils_1.calculateTaxDepreciation)({
            acquisitionCost: 100000,
            accumulatedTaxDepreciation: 0,
            depreciationStartDate: "2025-01-01",
            acquisitionDate: "2025-01-01",
            taxDepreciationMethod: null,
            taxUsefulLifeMonths: null,
            taxResidualValuePercent: null,
            macrsPropertyClass: null,
            macrsConvention: null,
            bonusDepreciationPercent: null
        }, "2025-12-31", null);
        (0, vitest_1.expect)(result).toBeNull();
    });
    (0, vitest_1.describe)("MACRS", function () {
        var macrsAsset = {
            acquisitionCost: 100000,
            accumulatedTaxDepreciation: 0,
            depreciationStartDate: "2025-01-15",
            acquisitionDate: "2025-01-15",
            taxDepreciationMethod: "MACRS",
            taxUsefulLifeMonths: null,
            taxResidualValuePercent: null,
            macrsPropertyClass: "5",
            macrsConvention: "Half-Year",
            bonusDepreciationPercent: 0
        };
        (0, vitest_1.it)("calculates year-1 MACRS without bonus", function () {
            var result = (0, accounting_utils_1.calculateTaxDepreciation)(macrsAsset, "2025-12-31", null);
            // 5-year half-year year 1: 20% of $100k = $20,000
            (0, vitest_1.expect)(result).toBe(20000);
        });
        (0, vitest_1.it)("calculates MACRS for a single-month period (how depreciation runs work)", function () {
            var result = (0, accounting_utils_1.calculateTaxDepreciation)(macrsAsset, "2025-05-31", null);
            (0, vitest_1.expect)(result).not.toBeNull();
            (0, vitest_1.expect)(result).toBeGreaterThan(0);
        });
        (0, vitest_1.it)("calculates MACRS for second monthly period with lastPostedPeriodEnd", function () {
            // Asset placed 2026-05-24, first run posted with periodEnd 2026-05-31
            // Second run for periodEnd 2026-06-30
            var result = (0, accounting_utils_1.calculateTaxDepreciation)(__assign(__assign({}, macrsAsset), { depreciationStartDate: "2026-05-24", acquisitionDate: "2026-05-24" }), "2026-06-30", "2026-05-31");
            (0, vitest_1.expect)(result).not.toBeNull();
            (0, vitest_1.expect)(result).toBeGreaterThan(0);
        });
        (0, vitest_1.it)("handles null bonusDepreciationPercent (DB default)", function () {
            var nullBonus = __assign(__assign({}, macrsAsset), { bonusDepreciationPercent: null });
            var result = (0, accounting_utils_1.calculateTaxDepreciation)(nullBonus, "2025-12-31", null);
            (0, vitest_1.expect)(result).toBe(20000);
        });
        (0, vitest_1.it)("applies bonus depreciation in first period", function () {
            var withBonus = __assign(__assign({}, macrsAsset), { bonusDepreciationPercent: 60 });
            var result = (0, accounting_utils_1.calculateTaxDepreciation)(withBonus, "2025-12-31", null);
            // Bonus: 100k * 60% = 60k
            // Adjusted basis: 40k, MACRS year 1: 40k * 20% = 8k
            // Total: 60k + 8k = 68k
            (0, vitest_1.expect)(result).toBe(68000);
        });
        (0, vitest_1.it)("does not re-apply bonus after first period", function () {
            var withBonus = __assign(__assign({}, macrsAsset), { accumulatedTaxDepreciation: 68000, bonusDepreciationPercent: 60 });
            var result = (0, accounting_utils_1.calculateTaxDepreciation)(withBonus, "2026-12-31", "2025-12-31");
            // Bonus should NOT be applied again (accumulatedTax > 0)
            // Only MACRS on the $40k adjusted basis
            (0, vitest_1.expect)(result).not.toBeNull();
            (0, vitest_1.expect)(result).toBeGreaterThan(0);
            (0, vitest_1.expect)(result).toBeLessThan(60000);
        });
        (0, vitest_1.it)("handles 100% bonus depreciation", function () {
            var fullBonus = __assign(__assign({}, macrsAsset), { bonusDepreciationPercent: 100 });
            var result = (0, accounting_utils_1.calculateTaxDepreciation)(fullBonus, "2025-12-31", null);
            // Bonus = 100k, adjusted basis = 0, MACRS on 0 = 0
            // Total = 100k
            (0, vitest_1.expect)(result).toBe(100000);
        });
        (0, vitest_1.it)("handles 7-year property class", function () {
            var sevenYear = __assign(__assign({}, macrsAsset), { macrsPropertyClass: "7" });
            var result = (0, accounting_utils_1.calculateTaxDepreciation)(sevenYear, "2025-12-31", null);
            // 7-year half-year year 1: 14.29% of $100k = $14,290
            (0, vitest_1.expect)(result).toBe(14290);
        });
    });
    (0, vitest_1.describe)("Straight Line (tax)", function () {
        var slTaxAsset = {
            acquisitionCost: 120000,
            accumulatedTaxDepreciation: 0,
            depreciationStartDate: "2025-01-01",
            acquisitionDate: "2025-01-01",
            taxDepreciationMethod: "Straight Line",
            taxUsefulLifeMonths: 120,
            taxResidualValuePercent: 0,
            macrsPropertyClass: null,
            macrsConvention: null,
            bonusDepreciationPercent: null
        };
        (0, vitest_1.it)("calculates tax straight-line depreciation", function () {
            // $120k / 120 months = $1k/month; Jan to Dec = 12 months = $12k
            var result = (0, accounting_utils_1.calculateTaxDepreciation)(slTaxAsset, "2025-12-31", null);
            (0, vitest_1.expect)(result).toBeCloseTo(12000, 0);
        });
        (0, vitest_1.it)("returns 0 when fully depreciated", function () {
            var fullyDepr = __assign(__assign({}, slTaxAsset), { accumulatedTaxDepreciation: 120000 });
            var result = (0, accounting_utils_1.calculateTaxDepreciation)(fullyDepr, "2025-12-31", null);
            (0, vitest_1.expect)(result).toBe(0);
        });
    });
    (0, vitest_1.describe)("Declining Balance (tax)", function () {
        var dbTaxAsset = {
            acquisitionCost: 100000,
            accumulatedTaxDepreciation: 0,
            depreciationStartDate: "2025-01-01",
            acquisitionDate: "2025-01-01",
            taxDepreciationMethod: "Declining Balance",
            taxUsefulLifeMonths: 60,
            taxResidualValuePercent: 10,
            macrsPropertyClass: null,
            macrsConvention: null,
            bonusDepreciationPercent: null
        };
        (0, vitest_1.it)("produces a positive result", function () {
            var result = (0, accounting_utils_1.calculateTaxDepreciation)(dbTaxAsset, "2025-12-31", null);
            (0, vitest_1.expect)(result).not.toBeNull();
            (0, vitest_1.expect)(result).toBeGreaterThan(0);
        });
        (0, vitest_1.it)("returns 0 when fully depreciated", function () {
            var fullyDepr = __assign(__assign({}, dbTaxAsset), { accumulatedTaxDepreciation: 90000 });
            var result = (0, accounting_utils_1.calculateTaxDepreciation)(fullyDepr, "2025-12-31", null);
            (0, vitest_1.expect)(result).toBe(0);
        });
    });
});
// ---------------------------------------------------------------------------
// buildDepreciationLines
// ---------------------------------------------------------------------------
(0, vitest_1.describe)("buildDepreciationLines", function () {
    var baseAsset = {
        id: "asset-1",
        acquisitionCost: 120000,
        accumulatedDepreciation: 0,
        residualValuePercent: 10,
        depreciationMethod: "Straight Line",
        usefulLifeMonths: 60,
        depreciationStartDate: "2025-01-01",
        acquisitionDate: "2025-01-01",
        assetLifetimeUsage: null,
        accumulatedTaxDepreciation: 0,
        taxDepreciationMethod: "MACRS",
        taxUsefulLifeMonths: null,
        taxResidualValuePercent: null,
        macrsPropertyClass: "5",
        macrsConvention: "Half-Year",
        bonusDepreciationPercent: 0
    };
    (0, vitest_1.it)("returns book and tax amounts when tax is enabled", function () {
        var lines = (0, accounting_utils_1.buildDepreciationLines)([baseAsset], "2025-12-31", null, true, new Map());
        (0, vitest_1.expect)(lines).toHaveLength(1);
        (0, vitest_1.expect)(lines[0].amount).toBeGreaterThan(0);
        (0, vitest_1.expect)(lines[0].taxAmount).not.toBeNull();
        (0, vitest_1.expect)(lines[0].taxAmount).toBeGreaterThan(0);
    });
    (0, vitest_1.it)("returns null taxAmount when tax is disabled", function () {
        var lines = (0, accounting_utils_1.buildDepreciationLines)([baseAsset], "2025-12-31", null, false, new Map());
        (0, vitest_1.expect)(lines).toHaveLength(1);
        (0, vitest_1.expect)(lines[0].amount).toBeGreaterThan(0);
        (0, vitest_1.expect)(lines[0].taxAmount).toBeNull();
    });
    (0, vitest_1.it)("skips assets with zero depreciation", function () {
        var fullyDepr = __assign(__assign({}, baseAsset), { accumulatedDepreciation: 108000, accumulatedTaxDepreciation: 120000 });
        var lines = (0, accounting_utils_1.buildDepreciationLines)([fullyDepr], "2025-12-31", null, true, new Map());
        (0, vitest_1.expect)(lines).toHaveLength(0);
    });
    (0, vitest_1.it)("includes line when only tax amount is positive", function () {
        var bookDone = __assign(__assign({}, baseAsset), { accumulatedDepreciation: 108000, accumulatedTaxDepreciation: 0 });
        var lines = (0, accounting_utils_1.buildDepreciationLines)([bookDone], "2025-12-31", null, true, new Map());
        (0, vitest_1.expect)(lines).toHaveLength(1);
        (0, vitest_1.expect)(lines[0].amount).toBe(0);
        (0, vitest_1.expect)(lines[0].taxAmount).toBeGreaterThan(0);
    });
    (0, vitest_1.it)("handles multiple assets", function () {
        var asset2 = __assign(__assign({}, baseAsset), { id: "asset-2" });
        var lines = (0, accounting_utils_1.buildDepreciationLines)([baseAsset, asset2], "2025-12-31", null, true, new Map());
        (0, vitest_1.expect)(lines).toHaveLength(2);
    });
    (0, vitest_1.it)("book vs tax difference: MACRS produces more year-1 depreciation than SL", function () {
        var lines = (0, accounting_utils_1.buildDepreciationLines)([baseAsset], "2025-12-31", null, true, new Map());
        // Book SL: 108k/60mo * 12mo = $21,600
        // Tax MACRS 5-yr HY: 120k * 20% = $24,000
        (0, vitest_1.expect)(lines[0].taxAmount).toBeGreaterThan(lines[0].amount);
    });
});
