"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierQuantityDispositionDrawer = SupplierQuantityDispositionDrawer;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var ProductionQuantityLinesEditor_1 = require("./ProductionQuantityLinesEditor");
function lineFromActive(line) {
    var _a, _b, _c;
    return {
        key: line.id,
        type: line.type,
        quantity: line.quantity,
        scrapReasonId: (_a = line.scrapReasonId) !== null && _a !== void 0 ? _a : undefined,
        notes: (_b = line.notes) !== null && _b !== void 0 ? _b : undefined,
        configuration: (_c = line.configuration) !== null && _c !== void 0 ? _c : undefined
    };
}
function SupplierQuantityDispositionDrawer(_a) {
    var _b;
    var report = _a.report, configurationParameters = _a.configurationParameters, itemId = _a.itemId, open = _a.open, onClose = _a.onClose, onSaved = _a.onSaved;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var _c = (0, react_2.useState)([]), lines = _c[0], setLines = _c[1];
    var _d = (0, react_2.useState)((_b = report.notes) !== null && _b !== void 0 ? _b : ""), notes = _d[0], setNotes = _d[1];
    (0, react_2.useEffect)(function () {
        var _a;
        if (!open)
            return;
        setLines((0, ProductionQuantityLinesEditor_1.normalizeUniqueLineTypes)(report.activeLines.map(lineFromActive)));
        setNotes((_a = report.notes) !== null && _a !== void 0 ? _a : "");
    }, [open, report]);
    (0, react_2.useEffect)(function () {
        if (fetcher.state !== "idle" || !fetcher.data)
            return;
        if (fetcher.data.error) {
            react_1.toast.error(fetcher.data.error);
            return;
        }
        if (fetcher.data.report) {
            react_1.toast.success(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Quantity report updated"], ["Quantity report updated"]))));
            onSaved(fetcher.data.report);
            onClose();
        }
    }, [fetcher.state, fetcher.data, onClose, onSaved, t]);
    var handleSave = function () {
        var activeLines = lines.filter(function (l) { return l.quantity > 0; });
        if (activeLines.length === 0) {
            react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Add at least one line with quantity greater than zero"], ["Add at least one line with quantity greater than zero"]))));
            return;
        }
        fetcher.submit(JSON.stringify({
            notes: notes.trim() ? notes : null,
            lines: activeLines.map(function (_a) {
                var _k = _a.key, line = __rest(_a, ["key"]);
                return line;
            })
        }), {
            method: "PATCH",
            encType: "application/json",
            action: path_1.path.to.api.supplierQuantityReportLines(report.id)
        });
    };
    return (<react_1.Drawer open={open} onOpenChange={function (v) { return !v && onClose(); }}>
      <react_1.DrawerContent>
        <react_1.DrawerHeader>
          <react_1.DrawerTitle>
            <macro_1.Trans>Edit supplier quantity report</macro_1.Trans>
          </react_1.DrawerTitle>
        </react_1.DrawerHeader>
        <react_1.DrawerBody className="flex w-full min-w-0 flex-col items-stretch gap-4">
          <react_1.VStack className="w-full gap-1">
            <react_1.Label>{t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Notes"], ["Notes"])))}</react_1.Label>
            <textarea className="min-h-[4rem] w-full rounded-md border border-border bg-background px-3 py-2 text-sm" value={notes} onChange={function (e) { return setNotes(e.target.value); }}/>
          </react_1.VStack>
          <ProductionQuantityLinesEditor_1.ProductionQuantityLinesEditor lines={lines} setLines={setLines} configurationParameters={configurationParameters} itemId={itemId} isDisabled={fetcher.state !== "idle"}/>
        </react_1.DrawerBody>
        <react_1.DrawerFooter>
          <react_1.Button variant="solid" onClick={onClose} className="transition-transform active:scale-[0.96]">
            <macro_1.Trans>Cancel</macro_1.Trans>
          </react_1.Button>
          <react_1.Button variant="primary" onClick={handleSave} isLoading={fetcher.state !== "idle"} className="transition-transform active:scale-[0.96]">
            <macro_1.Trans>Save</macro_1.Trans>
          </react_1.Button>
        </react_1.DrawerFooter>
      </react_1.DrawerContent>
    </react_1.Drawer>);
}
var templateObject_1, templateObject_2, templateObject_3;
