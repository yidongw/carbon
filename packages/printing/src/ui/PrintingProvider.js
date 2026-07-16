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
exports.PrintingProvider = PrintingProvider;
exports.usePrinting = usePrinting;
var react_1 = require("react");
var assignments_1 = require("../assignments");
var PrintingContext = (0, react_1.createContext)(null);
function PrintingProvider(_a) {
    var value = _a.value, children = _a.children;
    return (<PrintingContext.Provider value={value}>
      {children}
    </PrintingContext.Provider>);
}
function usePrinting() {
    var context = (0, react_1.useContext)(PrintingContext);
    if (!context) {
        throw new Error("usePrinting must be used within a PrintingProvider");
    }
    var printing = context.printing, printerRoutes = context.printerRoutes;
    var routeMap = (0, react_1.useMemo)(function () { return new Map(printerRoutes.map(function (r) { return [r.id, r]; })); }, [printerRoutes]);
    var resolvePrinterRoute = (0, react_1.useCallback)(function (locationId, printerContext, workCenterId) {
        var _a, _b;
        if (!locationId || !printing)
            return null;
        var assignment = (_a = printing.assignments) === null || _a === void 0 ? void 0 : _a[locationId];
        if (!assignment)
            return null;
        var printerRouteId = (0, assignments_1.resolveContextAssignment)(assignment, printerContext, workCenterId).printerRouteId;
        if (!printerRouteId)
            return null;
        return (_b = routeMap.get(printerRouteId)) !== null && _b !== void 0 ? _b : null;
    }, [printing, routeMap]);
    var hasPrinter = (0, react_1.useCallback)(function (locationId, printerContext, workCenterId) {
        return (resolvePrinterRoute(locationId, printerContext, workCenterId) !== null);
    }, [resolvePrinterRoute]);
    return __assign(__assign({}, context), { resolvePrinterRoute: resolvePrinterRoute, hasPrinter: hasPrinter });
}
