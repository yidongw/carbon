"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.AssignmentsCard = AssignmentsCard;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
function AssignmentsCard(_a) {
    var _b, _c;
    var printing = _a.printing, printerRoutes = _a.printerRoutes, locations = _a.locations, workCenters = _a.workCenters;
    var t = (0, macro_1.useLingui)().t;
    var assignmentFetcher = (0, react_router_1.useFetcher)();
    var printerRouteOptions = (0, react_2.useMemo)(function () { return __spreadArray([
        { value: "", label: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["None"], ["None"]))) }
    ], printerRoutes.map(function (r) { return ({
        value: r.id,
        label: r.name
    }); }), true); }, [printerRoutes, t]);
    var printerRouteMap = (0, react_2.useMemo)(function () { return new Map(printerRoutes.map(function (r) { return [r.id, r.name]; })); }, [printerRoutes]);
    var workCentersByLocation = (0, react_2.useMemo)(function () {
        var _a;
        var map = new Map();
        for (var _i = 0, workCenters_1 = workCenters; _i < workCenters_1.length; _i++) {
            var wc = workCenters_1[_i];
            if (!wc.id || !wc.name || !wc.locationId)
                continue;
            var existing = (_a = map.get(wc.locationId)) !== null && _a !== void 0 ? _a : [];
            existing.push({ id: wc.id, name: wc.name });
            map.set(wc.locationId, existing);
        }
        return map;
    }, [workCenters]);
    (0, react_2.useEffect)(function () {
        var _a, _b, _c, _d;
        if (((_a = assignmentFetcher.data) === null || _a === void 0 ? void 0 : _a.success) === true &&
            ((_b = assignmentFetcher.data) === null || _b === void 0 ? void 0 : _b.message)) {
            react_1.toast.success(assignmentFetcher.data.message);
        }
        if (((_c = assignmentFetcher.data) === null || _c === void 0 ? void 0 : _c.success) === false &&
            ((_d = assignmentFetcher.data) === null || _d === void 0 ? void 0 : _d.message)) {
            react_1.toast.error(assignmentFetcher.data.message);
        }
    }, [(_b = assignmentFetcher.data) === null || _b === void 0 ? void 0 : _b.message, (_c = assignmentFetcher.data) === null || _c === void 0 ? void 0 : _c.success]);
    var submitAssignment = (0, react_2.useCallback)(function (data) {
        var formData = new FormData();
        formData.set("intent", "updateAssignment");
        formData.set("locationId", data.locationId);
        formData.set("context", data.context);
        if (data.contextId)
            formData.set("contextId", data.contextId);
        if (data.printerRouteId)
            formData.set("printerRouteId", data.printerRouteId);
        if (data.autoPrint)
            formData.set("autoPrint", "on");
        assignmentFetcher.submit(formData, { method: "POST" });
    }, [assignmentFetcher]);
    return (<react_1.Card>
      <react_1.CardHeader>
        <react_1.CardTitle>
          <macro_1.Trans>Assignments</macro_1.Trans>
        </react_1.CardTitle>
        <react_1.CardDescription>
          <macro_1.Trans>
            Assign printers to locations. Shipping, receiving, and work centers
            inherit the location default unless overridden.
          </macro_1.Trans>
        </react_1.CardDescription>
      </react_1.CardHeader>
      <react_1.CardContent>
        {locations.length > 0 ? (<div className="flex flex-col">
            {locations.map(function (location) {
                var _a, _b, _c;
                return (<LocationSection key={location.id} locationId={location.id} locationName={location.name} assignment={(_b = (_a = printing === null || printing === void 0 ? void 0 : printing.assignments) === null || _a === void 0 ? void 0 : _a[location.id]) !== null && _b !== void 0 ? _b : null} workCenters={(_c = workCentersByLocation.get(location.id)) !== null && _c !== void 0 ? _c : []} printerRouteOptions={printerRouteOptions} printerRouteMap={printerRouteMap} onUpdate={submitAssignment}/>);
            })}
          </div>) : (<p className="text-sm text-muted-foreground">
            <macro_1.Trans>No locations found.</macro_1.Trans>
          </p>)}
      </react_1.CardContent>
    </react_1.Card>);
}
function LocationSection(_a) {
    var _b, _c, _d, _e, _f;
    var locationId = _a.locationId, locationName = _a.locationName, assignment = _a.assignment, workCenters = _a.workCenters, printerRouteOptions = _a.printerRouteOptions, printerRouteMap = _a.printerRouteMap, onUpdate = _a.onUpdate;
    var defaultPrinterId = (_b = assignment === null || assignment === void 0 ? void 0 : assignment.defaultPrinterRouteId) !== null && _b !== void 0 ? _b : null;
    var defaultPrinterName = defaultPrinterId
        ? ((_c = printerRouteMap.get(defaultPrinterId)) !== null && _c !== void 0 ? _c : null)
        : null;
    var rows = __spreadArray([
        {
            context: "default",
            label: locationName,
            icon: <lu_1.LuMapPin />,
            isDefault: true,
            explicit: assignment
                ? {
                    printerRouteId: assignment.defaultPrinterRouteId,
                    autoPrint: assignment.defaultAutoPrint
                }
                : null
        },
        {
            context: "shipping",
            label: "Shipping",
            icon: <lu_1.LuTruck />,
            explicit: (_d = assignment === null || assignment === void 0 ? void 0 : assignment.shipping) !== null && _d !== void 0 ? _d : null
        },
        {
            context: "receiving",
            label: "Receiving",
            icon: <lu_1.LuHandCoins />,
            explicit: (_e = assignment === null || assignment === void 0 ? void 0 : assignment.receiving) !== null && _e !== void 0 ? _e : null
        },
        {
            context: "inventory",
            label: "Inventory",
            icon: <lu_1.LuPackage />,
            explicit: (_f = assignment === null || assignment === void 0 ? void 0 : assignment.inventory) !== null && _f !== void 0 ? _f : null
        }
    ], workCenters.map(function (wc) {
        var _a, _b;
        return ({
            context: "workCenter",
            contextId: wc.id,
            label: wc.name,
            icon: <lu_1.LuWrench />,
            explicit: (_b = (_a = assignment === null || assignment === void 0 ? void 0 : assignment.workCenters) === null || _a === void 0 ? void 0 : _a[wc.id]) !== null && _b !== void 0 ? _b : null
        });
    }), true);
    return (<div className="border-b border-border last:border-b-0">
      {rows.map(function (row) {
            var _a, _b, _c, _d, _e;
            return (<AssignmentRow key={(_a = row.contextId) !== null && _a !== void 0 ? _a : row.context} label={row.label} icon={row.icon} isBold={row.isDefault} isIndented={!row.isDefault} printerRouteId={(_c = (_b = row.explicit) === null || _b === void 0 ? void 0 : _b.printerRouteId) !== null && _c !== void 0 ? _c : null} inheritedName={row.isDefault ? null : defaultPrinterName} autoPrint={(_e = (_d = row.explicit) === null || _d === void 0 ? void 0 : _d.autoPrint) !== null && _e !== void 0 ? _e : true} printerRouteOptions={printerRouteOptions} onPrinterChange={function (printerRouteId) {
                    var _a, _b;
                    return onUpdate({
                        locationId: locationId,
                        context: row.context,
                        contextId: row.contextId,
                        printerRouteId: printerRouteId,
                        autoPrint: printerRouteId
                            ? true
                            : ((_b = (_a = row.explicit) === null || _a === void 0 ? void 0 : _a.autoPrint) !== null && _b !== void 0 ? _b : false)
                    });
                }} onAutoPrintChange={function (autoPrint) {
                    var _a, _b;
                    return onUpdate({
                        locationId: locationId,
                        context: row.context,
                        contextId: row.contextId,
                        printerRouteId: (_b = (_a = row.explicit) === null || _a === void 0 ? void 0 : _a.printerRouteId) !== null && _b !== void 0 ? _b : undefined,
                        autoPrint: autoPrint
                    });
                }}/>);
        })}
    </div>);
}
function AssignmentRow(_a) {
    var label = _a.label, icon = _a.icon, isBold = _a.isBold, isIndented = _a.isIndented, printerRouteId = _a.printerRouteId, inheritedName = _a.inheritedName, autoPrint = _a.autoPrint, printerRouteOptions = _a.printerRouteOptions, onPrinterChange = _a.onPrinterChange, onAutoPrintChange = _a.onAutoPrintChange;
    var displayState = printerRouteId
        ? "assigned"
        : inheritedName
            ? "inherited"
            : "missing";
    var placeholder = displayState === "inherited"
        ? "inherits ".concat(inheritedName)
        : displayState === "missing"
            ? "No printer"
            : undefined;
    return (<div className={"flex items-center justify-between py-2.5 ".concat(isIndented ? "pl-7" : "", " ").concat(!isBold ? "border-t border-border/50" : "")}>
      <div className="flex items-center gap-2">
        <div className="size-7 bg-muted rounded-lg flex items-center justify-center shrink-0">
          <span className="size-4 text-muted-foreground">{icon}</span>
        </div>
        <span className={"text-sm ".concat(isBold ? "font-medium" : "text-muted-foreground")}>
          {label}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-[320px]">
          <react_1.Combobox size="sm" value={printerRouteId !== null && printerRouteId !== void 0 ? printerRouteId : ""} options={printerRouteOptions} onChange={function (selected) { return onPrinterChange(selected); }} isClearable placeholder={placeholder}/>
        </div>

        <div className="flex items-center gap-1.5">
          <react_1.Switch variant="small" checked={autoPrint} onCheckedChange={onAutoPrintChange}/>
          <span className="text-xs text-muted-foreground">Auto-print</span>
        </div>
      </div>
    </div>);
}
var templateObject_1;
