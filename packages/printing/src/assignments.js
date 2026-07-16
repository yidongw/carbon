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
exports.printerContexts = void 0;
exports.getPrinterContextForSource = getPrinterContextForSource;
exports.resolveContextAssignment = resolveContextAssignment;
exports.emptyLocationAssignment = emptyLocationAssignment;
exports.setContextAssignment = setContextAssignment;
exports.printerContexts = [
    "default",
    "shipping",
    "receiving",
    "inventory",
    "workCenter"
];
var sourceDocumentContexts = {
    Shipment: "shipping",
    Receipt: "receiving",
    StockTransfer: "inventory",
    StorageUnit: "inventory"
};
/**
 * Maps a print job's source document to the printer context whose
 * assignment should be used.
 */
function getPrinterContextForSource(sourceDocument, workCenterId) {
    var _a;
    return ((_a = sourceDocumentContexts[sourceDocument]) !== null && _a !== void 0 ? _a : (workCenterId ? "workCenter" : "default"));
}
/**
 * Resolves the effective printer assignment for a context within a location.
 *
 * - "default" returns the location default.
 * - "workCenter" with no explicit entry inherits the location default outright.
 * - Other contexts fall back to the location's default printer when they have
 *   no printer of their own, but keep their own autoPrint flag.
 */
function resolveContextAssignment(assignment, context, workCenterId) {
    var _a, _b, _c, _d, _e;
    var fallback = {
        printerRouteId: (_a = assignment.defaultPrinterRouteId) !== null && _a !== void 0 ? _a : null,
        autoPrint: (_b = assignment.defaultAutoPrint) !== null && _b !== void 0 ? _b : true
    };
    if (context === "default")
        return fallback;
    var explicit = context === "workCenter"
        ? workCenterId
            ? (_c = assignment.workCenters) === null || _c === void 0 ? void 0 : _c[workCenterId]
            : undefined
        : assignment[context];
    if (context === "workCenter" && !explicit)
        return fallback;
    return {
        printerRouteId: (_d = explicit === null || explicit === void 0 ? void 0 : explicit.printerRouteId) !== null && _d !== void 0 ? _d : fallback.printerRouteId,
        autoPrint: (_e = explicit === null || explicit === void 0 ? void 0 : explicit.autoPrint) !== null && _e !== void 0 ? _e : true
    };
}
function emptyLocationAssignment() {
    return {
        defaultPrinterRouteId: null,
        defaultAutoPrint: true,
        shipping: { printerRouteId: null, autoPrint: true },
        receiving: { printerRouteId: null, autoPrint: true },
        inventory: { printerRouteId: null, autoPrint: true },
        workCenters: {}
    };
}
/**
 * Returns a copy of the settings with one context assignment replaced.
 */
function setContextAssignment(settings, locationId, context, value, workCenterId) {
    var _a, _b;
    var assignment = settings.assignments[locationId]
        ? __assign({}, settings.assignments[locationId]) : emptyLocationAssignment();
    switch (context) {
        case "default":
            assignment.defaultPrinterRouteId = value.printerRouteId;
            assignment.defaultAutoPrint = value.autoPrint;
            break;
        case "workCenter":
            if (!workCenterId) {
                throw new Error("workCenterId is required for workCenter assignments");
            }
            assignment.workCenters = __assign(__assign({}, assignment.workCenters), (_a = {}, _a[workCenterId] = value, _a));
            break;
        default:
            assignment[context] = value;
    }
    return __assign(__assign({}, settings), { assignments: __assign(__assign({}, settings.assignments), (_b = {}, _b[locationId] = assignment, _b)) });
}
