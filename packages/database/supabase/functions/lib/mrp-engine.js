"use strict";
// Pure MRP engine functions shared across Supabase edge functions.
// The same algorithm is independently available (with unit tests) at
// packages/mrp/src/engine.ts.
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitKey = splitKey;
exports.makeKey = makeKey;
exports.computeLowLevelCodes = computeLowLevelCodes;
exports.explodeBom = explodeBom;
function splitKey(key) {
    var parts = key.split("-");
    return [parts[0], parts[1], parts.slice(2).join("-")];
}
function makeKey(locationId, periodId, itemId) {
    return "".concat(locationId, "-").concat(periodId, "-").concat(itemId);
}
function effectiveReplenishment(repSys) {
    return repSys === "Buy and Make"
        ? "Buy"
        : repSys;
}
function computeLowLevelCodes(bomByItem) {
    var llc = new Map();
    function assignLevel(itemId, level, visited) {
        var _a, _b;
        if (visited.has(itemId))
            return;
        visited.add(itemId);
        var currentLLC = (_a = llc.get(itemId)) !== null && _a !== void 0 ? _a : -1;
        if (level > currentLLC) {
            llc.set(itemId, level);
        }
        var children = (_b = bomByItem.get(itemId)) !== null && _b !== void 0 ? _b : [];
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var child = children_1[_i];
            assignLevel(child.itemId, level + 1, new Set(visited));
        }
    }
    for (var _i = 0, _a = bomByItem.keys(); _i < _a.length; _i++) {
        var itemId = _a[_i];
        assignLevel(itemId, 0, new Set());
    }
    return llc;
}
function explodeBom(input) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var bomByItem = input.bomByItem, replenishmentSystemByItem = input.replenishmentSystemByItem, leadTimeByItem = input.leadTimeByItem, periods = input.periods, topLevelContributors = input.topLevelContributors;
    var grossDemand = new Map(input.grossDemand);
    var onHandByLocationItem = new Map(input.onHandByLocationItem);
    var jobSupply = input.jobSupplyByLocationPeriodItem;
    var bomDerivedDemand = new Map();
    var demandContributors = new Map();
    var llc = computeLowLevelCodes(bomByItem);
    var maxLevel = llc.size > 0 ? Math.max.apply(Math, llc.values()) : 0;
    var periodIndexById = new Map(periods.map(function (p, i) { return [p.id, i]; }));
    for (var level = 0; level <= maxLevel; level++) {
        // LLC layer: ensure every parent's netting is done before its children
        // get demand added — otherwise we'd miss BOM-derived demand mid-walk.
        var locItemsAtLevel = new Set();
        for (var _i = 0, grossDemand_1 = grossDemand; _i < grossDemand_1.length; _i++) {
            var _o = grossDemand_1[_i], key = _o[0], qty = _o[1];
            if (qty <= 0)
                continue;
            var _p = splitKey(key), locationId = _p[0], itemId = _p[2];
            if (((_a = llc.get(itemId)) !== null && _a !== void 0 ? _a : 0) === level) {
                locItemsAtLevel.add("".concat(locationId, "|").concat(itemId));
            }
        }
        for (var _q = 0, locItemsAtLevel_1 = locItemsAtLevel; _q < locItemsAtLevel_1.length; _q++) {
            var locItem = locItemsAtLevel_1[_q];
            var sepIdx = locItem.indexOf("|");
            var locationId = locItem.slice(0, sepIdx);
            var itemId = locItem.slice(sepIdx + 1);
            var effRepSys = effectiveReplenishment(replenishmentSystemByItem.get(itemId));
            var invKey = "".concat(locationId, "-").concat(itemId);
            // Running balance for this (location, item) across the planning
            // horizon: starts at on-hand, +supply as each period passes,
            // −demand as we hit it. Floored at 0 because any shortfall is
            // converted into child demand below.
            var running = (_b = onHandByLocationItem.get(invKey)) !== null && _b !== void 0 ? _b : 0;
            for (var _r = 0, periods_1 = periods; _r < periods_1.length; _r++) {
                var period = periods_1[_r];
                var periodKey = makeKey(locationId, period.id, itemId);
                running += (_c = jobSupply.get(periodKey)) !== null && _c !== void 0 ? _c : 0;
                var grossQty = (_d = grossDemand.get(periodKey)) !== null && _d !== void 0 ? _d : 0;
                if (grossQty <= 0)
                    continue;
                var netRequirement = Math.max(0, grossQty - Math.max(0, running));
                running = Math.max(0, running - grossQty);
                // Buy items never explode — their shortfall surfaces directly in
                // demandForecast / quantityToOrder via the caller.
                if (netRequirement <= 0 || effRepSys !== "Make")
                    continue;
                var children = (_e = bomByItem.get(itemId)) !== null && _e !== void 0 ? _e : [];
                for (var _s = 0, children_2 = children; _s < children_2.length; _s++) {
                    var child = children_2[_s];
                    var childEffRepSys = effectiveReplenishment(replenishmentSystemByItem.get(child.itemId));
                    // MTO + Make = "subjob will be auto-spawned at parent release";
                    // skip the forecast write to avoid double-counting once it exists.
                    var isInlineProduction = child.methodType === "Make to Order" && childEffRepSys === "Make";
                    var childQty = child.quantity * netRequirement;
                    var childLeadTimeDays = (_f = leadTimeByItem.get(child.itemId)) !== null && _f !== void 0 ? _f : 7;
                    var childLeadTimeWeeks = Math.ceil(childLeadTimeDays / 7);
                    // Pull the child demand earlier by lead time so the order/job
                    // arrives in time for the parent's period; floor at period[0].
                    var currentPeriodIndex = (_g = periodIndexById.get(period.id)) !== null && _g !== void 0 ? _g : 0;
                    var targetPeriodIndex = Math.max(0, currentPeriodIndex - childLeadTimeWeeks);
                    var targetPeriod = periods[targetPeriodIndex];
                    if (!targetPeriod)
                        continue;
                    var childKey = makeKey(locationId, targetPeriod.id, child.itemId);
                    grossDemand.set(childKey, ((_h = grossDemand.get(childKey)) !== null && _h !== void 0 ? _h : 0) + childQty);
                    if (!isInlineProduction) {
                        bomDerivedDemand.set(childKey, ((_j = bomDerivedDemand.get(childKey)) !== null && _j !== void 0 ? _j : 0) + childQty);
                    }
                    var parentContributors = __spreadArray(__spreadArray([], ((_k = demandContributors.get(periodKey)) !== null && _k !== void 0 ? _k : []), true), ((_l = topLevelContributors.get(periodKey)) !== null && _l !== void 0 ? _l : []), true);
                    if (parentContributors.length > 0) {
                        var childContributors = (_m = demandContributors.get(childKey)) !== null && _m !== void 0 ? _m : [];
                        for (var _t = 0, parentContributors_1 = parentContributors; _t < parentContributors_1.length; _t++) {
                            var pc = parentContributors_1[_t];
                            childContributors.push(__assign(__assign({}, pc), { quantity: pc.quantity * child.quantity }));
                        }
                        demandContributors.set(childKey, childContributors);
                    }
                }
            }
            // Persist the trailing balance so the next LLC layer (or a later
            // call) sees the consumed/produced state of this item.
            onHandByLocationItem.set(invKey, running);
        }
    }
    return { grossDemand: grossDemand, bomDerivedDemand: bomDerivedDemand, demandContributors: demandContributors };
}
