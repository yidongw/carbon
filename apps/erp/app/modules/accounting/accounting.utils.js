"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.macrsConventions = exports.macrsPropertyClasses = void 0;
exports.getMacrsPercentage = getMacrsPercentage;
exports.calculateMacrsDepreciation = calculateMacrsDepreciation;
exports.getMonthsBetween = getMonthsBetween;
exports.getMonthsElapsed = getMonthsElapsed;
exports.addOneMonth = addOneMonth;
exports.getLastDayOfMonth = getLastDayOfMonth;
exports.getNextPeriodEnd = getNextPeriodEnd;
exports.calculateDepreciation = calculateDepreciation;
exports.calculateTaxDepreciation = calculateTaxDepreciation;
exports.buildDepreciationLines = buildDepreciationLines;
exports.macrsPropertyClasses = [
    "3",
    "5",
    "7",
    "10",
    "15",
    "20",
    "27.5",
    "39"
];
exports.macrsConventions = ["Half-Year", "Mid-Quarter"];
// IRS Revenue Procedure 87-57, Table 1 (GDS, Half-Year Convention)
var MACRS_HALF_YEAR = {
    "3": [33.33, 44.45, 14.81, 7.41],
    "5": [20.0, 32.0, 19.2, 11.52, 11.52, 5.76],
    "7": [14.29, 24.49, 17.49, 12.49, 8.93, 8.92, 8.93, 4.46],
    "10": [10.0, 18.0, 14.4, 11.52, 9.22, 7.37, 6.55, 6.55, 6.56, 6.55, 3.28],
    "15": [
        5.0, 9.5, 8.55, 7.7, 6.93, 6.23, 5.9, 5.9, 5.91, 5.9, 5.91, 5.9, 5.91, 5.9,
        5.91, 2.95
    ],
    "20": [
        3.75, 7.219, 6.677, 6.177, 5.713, 5.285, 4.888, 4.522, 4.462, 4.461, 4.462,
        4.461, 4.462, 4.461, 4.462, 4.461, 4.462, 4.461, 4.462, 4.461, 2.231
    ]
};
// IRS Tables 2-5 (GDS, Mid-Quarter Convention)
var MACRS_MID_QUARTER = {
    "3": {
        1: [58.33, 27.78, 12.35, 1.54],
        2: [41.67, 38.89, 14.14, 5.3],
        3: [25.0, 50.0, 16.67, 8.33],
        4: [8.33, 61.11, 20.37, 10.19]
    },
    "5": {
        1: [35.0, 26.0, 15.6, 11.01, 11.01, 1.38],
        2: [25.0, 30.0, 18.0, 11.37, 11.37, 4.26],
        3: [15.0, 34.0, 20.4, 12.24, 11.3, 7.06],
        4: [5.0, 38.0, 22.8, 13.68, 10.94, 9.58]
    },
    "7": {
        1: [25.0, 21.43, 15.31, 10.93, 8.75, 8.74, 8.75, 1.09],
        2: [17.85, 23.47, 16.76, 11.97, 8.87, 8.87, 8.87, 3.34],
        3: [10.71, 25.51, 18.22, 13.02, 9.3, 8.85, 8.86, 5.53],
        4: [3.57, 27.55, 19.68, 14.06, 10.04, 8.73, 8.73, 7.64]
    },
    "10": {
        1: [17.5, 16.5, 13.2, 10.56, 8.45, 6.76, 6.55, 6.55, 6.56, 6.55, 0.82],
        2: [12.5, 17.5, 14.0, 11.2, 8.96, 7.17, 6.55, 6.55, 6.56, 6.55, 2.46],
        3: [7.5, 18.5, 14.8, 11.84, 9.47, 7.58, 6.55, 6.55, 6.56, 6.55, 4.1],
        4: [2.5, 19.5, 15.6, 12.48, 9.98, 7.99, 6.55, 6.55, 6.56, 6.55, 5.74]
    },
    "15": {
        1: [
            8.75, 9.13, 8.21, 7.39, 6.65, 5.99, 5.9, 5.9, 5.91, 5.9, 5.91, 5.9, 5.91,
            5.9, 5.91, 0.74
        ],
        2: [
            6.25, 9.38, 8.44, 7.59, 6.83, 6.15, 5.9, 5.9, 5.91, 5.9, 5.91, 5.9, 5.91,
            5.9, 5.91, 2.21
        ],
        3: [
            3.75, 9.63, 8.66, 7.8, 7.02, 6.31, 5.9, 5.9, 5.91, 5.9, 5.91, 5.9, 5.91,
            5.9, 5.91, 3.69
        ],
        4: [
            1.25, 9.88, 8.89, 8.0, 7.2, 6.48, 5.9, 5.9, 5.91, 5.9, 5.91, 5.9, 5.91,
            5.9, 5.91, 5.17
        ]
    },
    "20": {
        1: [
            6.563, 7.0, 6.482, 5.996, 5.546, 5.13, 4.746, 4.459, 4.459, 4.459, 4.459,
            4.46, 4.459, 4.46, 4.459, 4.46, 4.459, 4.46, 4.459, 4.46, 0.557
        ],
        2: [
            4.688, 7.148, 6.612, 6.116, 5.658, 5.233, 4.841, 4.478, 4.463, 4.463,
            4.463, 4.463, 4.463, 4.463, 4.463, 4.462, 4.463, 4.462, 4.463, 4.462,
            1.673
        ],
        3: [
            2.813, 7.289, 6.742, 6.237, 5.769, 5.336, 4.936, 4.566, 4.46, 4.46, 4.46,
            4.461, 4.46, 4.461, 4.46, 4.461, 4.46, 4.461, 4.46, 4.461, 2.788
        ],
        4: [
            0.938, 7.43, 6.872, 6.357, 5.88, 5.439, 5.031, 4.654, 4.458, 4.458, 4.458,
            4.458, 4.458, 4.458, 4.458, 4.458, 4.458, 4.458, 4.459, 4.458, 3.901
        ]
    }
};
function getMacrsPercentage(propertyClass, yearInService, convention, quarterPlacedInService) {
    if (propertyClass === "27.5" || propertyClass === "39") {
        return null;
    }
    var yearIndex = yearInService - 1;
    if (convention === "Half-Year") {
        var table_1 = MACRS_HALF_YEAR[propertyClass];
        if (!table_1 || yearIndex >= table_1.length)
            return 0;
        return table_1[yearIndex];
    }
    var quarter = quarterPlacedInService !== null && quarterPlacedInService !== void 0 ? quarterPlacedInService : 1;
    var classTable = MACRS_MID_QUARTER[propertyClass];
    if (!classTable)
        return 0;
    var table = classTable[quarter];
    if (!table || yearIndex >= table.length)
        return 0;
    return table[yearIndex];
}
function calculateMacrsDepreciation(args) {
    var adjustedBasis = args.adjustedBasis, propertyClass = args.propertyClass, convention = args.convention, depreciationStartDate = args.depreciationStartDate, periodEnd = args.periodEnd, lastPostedPeriodEnd = args.lastPostedPeriodEnd, accumulatedTaxDepreciation = args.accumulatedTaxDepreciation, bonusAmount = args.bonusAmount;
    if (adjustedBasis <= 0)
        return 0;
    var startDate = new Date(depreciationStartDate);
    var periodEndDate = new Date(periodEnd);
    var fromDate = lastPostedPeriodEnd
        ? new Date(lastPostedPeriodEnd)
        : startDate;
    // 27.5 and 39-year property: straight-line with mid-month convention
    if (propertyClass === "27.5" || propertyClass === "39") {
        var lifeMonths = propertyClass === "27.5" ? 27.5 * 12 : 39 * 12;
        var monthlyAmount = adjustedBasis / lifeMonths;
        var monthsElapsed = (periodEndDate.getFullYear() - fromDate.getFullYear()) * 12 +
            (periodEndDate.getMonth() - fromDate.getMonth());
        var months = lastPostedPeriodEnd ? monthsElapsed : monthsElapsed + 0.5;
        var amount = monthlyAmount * Math.max(0, months);
        var remaining_1 = adjustedBasis - (accumulatedTaxDepreciation - bonusAmount);
        return Math.min(Math.round(amount * 100) / 100, Math.max(0, remaining_1));
    }
    // Table-based MACRS: compute cumulative depreciation through periodEnd,
    // then subtract what has already been taken (accumulatedTaxDepreciation - bonusAmount).
    // MACRS years are calendar years. The IRS percentages already incorporate the
    // convention (half-year or mid-quarter), so year 1 = the full first calendar year amount.
    // Year 1 is spread across months from placed-in-service through Dec 31.
    // Subsequent years are spread evenly across 12 calendar months.
    var quarterPlaced = Math.ceil((startDate.getMonth() + 1) / 3);
    var startYear = startDate.getFullYear();
    var periodEndYear = periodEndDate.getFullYear();
    var lastYearToCalc = periodEndYear - startYear + 1;
    var startMonth = startDate.getMonth(); // 0-based
    var cumulativeThrough = 0;
    for (var year = 1; year <= lastYearToCalc; year++) {
        var pct = getMacrsPercentage(propertyClass, year, convention, quarterPlaced);
        if (pct === null || pct === 0)
            continue;
        var annualAmount = adjustedBasis * (pct / 100);
        var totalMonthsInYear = year === 1 ? 12 - startMonth : 12;
        var monthlyAmount = annualAmount / totalMonthsInYear;
        if (year < lastYearToCalc) {
            cumulativeThrough += annualAmount;
        }
        else {
            // Count months from the start of this MACRS year through periodEnd
            var yearStartMonth = year === 1 ? startMonth : 0;
            var calendarYear = startYear + year - 1;
            var periodEndMonth = periodEndDate.getFullYear() === calendarYear
                ? periodEndDate.getMonth()
                : 11;
            var monthsElapsed = periodEndMonth - yearStartMonth + 1;
            cumulativeThrough +=
                monthlyAmount * Math.min(monthsElapsed, totalMonthsInYear);
        }
    }
    var alreadyTaken = accumulatedTaxDepreciation - bonusAmount;
    var periodAmount = cumulativeThrough - Math.max(0, alreadyTaken);
    var remaining = adjustedBasis - Math.max(0, alreadyTaken);
    return Math.min(Math.round(Math.max(0, periodAmount) * 100) / 100, Math.max(0, remaining));
}
function getMonthsBetween(start, end) {
    var years = end.getFullYear() - start.getFullYear();
    var months = end.getMonth() - start.getMonth();
    var total = years * 12 + months;
    if (end.getDate() >= start.getDate())
        total += 1;
    return Math.max(0, total);
}
function getMonthsElapsed(start, end) {
    var years = end.getFullYear() - start.getFullYear();
    var months = end.getMonth() - start.getMonth();
    return Math.max(0, years * 12 + months);
}
function addOneMonth(dateStr) {
    var d = new Date(dateStr);
    d.setMonth(d.getMonth() + 1);
    d.setDate(1);
    return d;
}
function getLastDayOfMonth(year, month) {
    var d = new Date(year, month + 1, 0);
    return d.toISOString().split("T")[0];
}
function getNextPeriodEnd(lastPeriodEnd) {
    if (lastPeriodEnd) {
        var last = new Date(lastPeriodEnd);
        var nextMonth = last.getMonth() + 1;
        var nextYear = last.getFullYear() + (nextMonth > 11 ? 1 : 0);
        return getLastDayOfMonth(nextYear, nextMonth % 12);
    }
    var now = new Date();
    return getLastDayOfMonth(now.getFullYear(), now.getMonth());
}
function calculateDepreciation(asset, periodEnd, lastPostedPeriodEnd, usageLog) {
    var _a;
    var cost = Number(asset.acquisitionCost);
    var residualValue = cost * (Number(asset.residualValuePercent) / 100);
    var depreciableBase = cost - residualValue;
    var accumulated = Number(asset.accumulatedDepreciation);
    var remainingDepreciable = depreciableBase - accumulated;
    if (remainingDepreciable <= 0)
        return 0;
    var periodEndDate = new Date(periodEnd);
    var startDate = new Date((_a = asset.depreciationStartDate) !== null && _a !== void 0 ? _a : asset.acquisitionDate);
    if (startDate > periodEndDate)
        return 0;
    switch (asset.depreciationMethod) {
        case "Straight Line": {
            var monthlyAmount = depreciableBase / asset.usefulLifeMonths;
            var from = lastPostedPeriodEnd
                ? addOneMonth(lastPostedPeriodEnd)
                : startDate;
            var monthsToDepreciate = getMonthsBetween(from, periodEndDate);
            var amount = monthlyAmount * monthsToDepreciate;
            return Math.min(Math.round(amount * 100) / 100, remainingDepreciable);
        }
        case "Declining Balance": {
            var annualRate = (1 / (asset.usefulLifeMonths / 12)) * 2;
            var monthlyRate = annualRate / 12;
            var from = lastPostedPeriodEnd
                ? addOneMonth(lastPostedPeriodEnd)
                : startDate;
            var monthsToDepreciate = getMonthsBetween(from, periodEndDate);
            var totalDepr = 0;
            var nbv = cost - accumulated;
            for (var i = 0; i < monthsToDepreciate; i++) {
                var dbAmount = nbv * monthlyRate;
                var remainingMonths = Math.max(1, asset.usefulLifeMonths -
                    getMonthsElapsed(startDate, periodEndDate) +
                    monthsToDepreciate -
                    i);
                var slAmount = (nbv - residualValue) / remainingMonths;
                var amount = Math.max(dbAmount, slAmount);
                var capped = Math.min(amount, nbv - residualValue);
                if (capped <= 0)
                    break;
                totalDepr += capped;
                nbv -= capped;
            }
            return Math.min(Math.round(totalDepr * 100) / 100, remainingDepreciable);
        }
        case "Units of Production": {
            if (!usageLog ||
                !asset.assetLifetimeUsage ||
                Number(asset.assetLifetimeUsage) <= 0)
                return 0;
            var ratePerUnit = depreciableBase / Number(asset.assetLifetimeUsage);
            var amount = ratePerUnit * usageLog.unitsProduced;
            return Math.min(Math.round(amount * 100) / 100, remainingDepreciable);
        }
        default:
            return 0;
    }
}
function calculateTaxDepreciation(asset, periodEnd, lastPostedPeriodEnd) {
    var _a, _b, _c, _d;
    var taxMethod = asset.taxDepreciationMethod;
    if (!taxMethod)
        return null;
    var cost = Number(asset.acquisitionCost);
    var accumulatedTax = Number(asset.accumulatedTaxDepreciation);
    var startDate = (_a = asset.depreciationStartDate) !== null && _a !== void 0 ? _a : asset.acquisitionDate;
    if (taxMethod === "MACRS") {
        var propertyClass = asset.macrsPropertyClass;
        var convention = ((_b = asset.macrsConvention) !== null && _b !== void 0 ? _b : "Half-Year");
        var bonusPct = Number((_c = asset.bonusDepreciationPercent) !== null && _c !== void 0 ? _c : 0);
        var bonusAmount = cost * (bonusPct / 100);
        var adjustedBasis = cost - bonusAmount;
        var bonus = 0;
        if (accumulatedTax === 0 && bonusAmount > 0) {
            bonus = bonusAmount;
        }
        var macrsAmount = calculateMacrsDepreciation({
            adjustedBasis: adjustedBasis,
            propertyClass: propertyClass,
            convention: convention,
            depreciationStartDate: startDate,
            periodEnd: periodEnd,
            lastPostedPeriodEnd: lastPostedPeriodEnd,
            accumulatedTaxDepreciation: accumulatedTax,
            bonusAmount: bonusAmount
        });
        return Math.round((bonus + macrsAmount) * 100) / 100;
    }
    var taxLife = asset.taxUsefulLifeMonths;
    var taxResidualPct = Number((_d = asset.taxResidualValuePercent) !== null && _d !== void 0 ? _d : 0);
    var residualValue = cost * (taxResidualPct / 100);
    var depreciableBase = cost - residualValue;
    var remainingDepreciable = depreciableBase - accumulatedTax;
    if (remainingDepreciable <= 0)
        return 0;
    var periodEndDate = new Date(periodEnd);
    var depStartDate = new Date(startDate);
    if (depStartDate > periodEndDate)
        return 0;
    var from = lastPostedPeriodEnd
        ? addOneMonth(lastPostedPeriodEnd)
        : depStartDate;
    var monthsToDepreciate = getMonthsBetween(from, periodEndDate);
    if (taxMethod === "Straight Line") {
        var monthlyAmount = depreciableBase / taxLife;
        var amount = monthlyAmount * monthsToDepreciate;
        return Math.min(Math.round(amount * 100) / 100, remainingDepreciable);
    }
    if (taxMethod === "Declining Balance") {
        var annualRate = (1 / (taxLife / 12)) * 2;
        var monthlyRate = annualRate / 12;
        var totalDepr = 0;
        var nbv = cost - accumulatedTax;
        for (var i = 0; i < monthsToDepreciate; i++) {
            var dbAmount = nbv * monthlyRate;
            var remainingMonths = Math.max(1, taxLife -
                getMonthsElapsed(depStartDate, periodEndDate) +
                monthsToDepreciate -
                i);
            var slAmount = (nbv - residualValue) / remainingMonths;
            var amount = Math.max(dbAmount, slAmount);
            var capped = Math.min(amount, nbv - residualValue);
            if (capped <= 0)
                break;
            totalDepr += capped;
            nbv -= capped;
        }
        return Math.min(Math.round(totalDepr * 100) / 100, remainingDepreciable);
    }
    return null;
}
function buildDepreciationLines(assets, periodEnd, lastPostedPeriodEnd, taxEnabled, usageMap) {
    var _a;
    var lines = [];
    for (var _i = 0, assets_1 = assets; _i < assets_1.length; _i++) {
        var asset = assets_1[_i];
        var usageLog = usageMap.get(asset.id);
        var amount = calculateDepreciation({
            acquisitionCost: Number(asset.acquisitionCost),
            accumulatedDepreciation: Number(asset.accumulatedDepreciation),
            residualValuePercent: Number(asset.residualValuePercent),
            depreciationMethod: asset.depreciationMethod,
            usefulLifeMonths: asset.usefulLifeMonths,
            depreciationStartDate: asset.depreciationStartDate,
            acquisitionDate: asset.acquisitionDate,
            assetLifetimeUsage: asset.assetLifetimeUsage
                ? Number(asset.assetLifetimeUsage)
                : null
        }, periodEnd, lastPostedPeriodEnd, usageLog);
        var taxAmount = null;
        if (taxEnabled) {
            taxAmount = calculateTaxDepreciation({
                acquisitionCost: Number(asset.acquisitionCost),
                accumulatedTaxDepreciation: Number((_a = asset.accumulatedTaxDepreciation) !== null && _a !== void 0 ? _a : 0),
                depreciationStartDate: asset.depreciationStartDate,
                acquisitionDate: asset.acquisitionDate,
                taxDepreciationMethod: asset.taxDepreciationMethod,
                taxUsefulLifeMonths: asset.taxUsefulLifeMonths,
                taxResidualValuePercent: asset.taxResidualValuePercent,
                macrsPropertyClass: asset.macrsPropertyClass,
                macrsConvention: asset.macrsConvention,
                bonusDepreciationPercent: asset.bonusDepreciationPercent
            }, periodEnd, lastPostedPeriodEnd);
            if (taxAmount === null) {
                taxAmount = amount;
            }
        }
        if (amount > 0 || (taxAmount !== null && taxAmount > 0)) {
            lines.push({ fixedAssetId: asset.id, amount: amount, taxAmount: taxAmount });
        }
    }
    return lines;
}
