"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.ProductionQuantityDispositionDrawer = ProductionQuantityDispositionDrawer;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Modals_1 = require("~/components/Modals");
var Overlay_1 = require("~/components/Overlay");
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
function ProductionQuantityDispositionDrawer(_a) {
    var _b;
    var report = _a.report, configurationParameters = _a.configurationParameters, itemId = _a.itemId, open = _a.open, onClose = _a.onClose, onSaved = _a.onSaved, saveAction = _a.saveAction, deleteAction = _a.deleteAction, title = _a.title, _c = _a.saveMethod, saveMethod = _c === void 0 ? "PATCH" : _c, getSaveBody = _a.getSaveBody, externalFetcher = _a.fetcher;
    var t = (0, macro_1.useLingui)().t;
    var internalFetcher = (0, react_router_1.useFetcher)();
    var fetcher = externalFetcher !== null && externalFetcher !== void 0 ? externalFetcher : internalFetcher;
    var overlayInstances = (0, Overlay_1.useOverlay)().instances;
    var deleteModal = (0, react_1.useDisclosure)();
    var _d = (0, react_2.useState)([]), lines = _d[0], setLines = _d[1];
    var _e = (0, react_2.useState)((_b = report.notes) !== null && _b !== void 0 ? _b : ""), notes = _e[0], setNotes = _e[1];
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
        // Ignore stale fetcher results from unrelated actions (e.g. approve on the same fetcher).
        if (externalFetcher && fetcher.formData == null)
            return;
        if (fetcher.data.error) {
            react_1.toast.error(fetcher.data.error);
            return;
        }
        if (fetcher.data.report || fetcher.data.ok) {
            if (!externalFetcher) {
                react_1.toast.success(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Quantity report updated"], ["Quantity report updated"]))));
            }
            if (fetcher.data.report) {
                onSaved(fetcher.data.report);
            }
            else {
                onSaved(report);
            }
            onClose();
        }
    }, [
        externalFetcher,
        fetcher.state,
        fetcher.data,
        fetcher.formData,
        onClose,
        onSaved,
        report,
        t
    ]);
    var save = function () {
        var _a;
        var zeroQuantityLine = lines.find(function (line) { return line.quantity <= 0; });
        if (zeroQuantityLine) {
            react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Each line must have a quantity greater than zero (", ")"], ["Each line must have a quantity greater than zero (", ")"])), zeroQuantityLine.type));
            return;
        }
        var lineTotal = lines.reduce(function (sum, line) { return sum + line.quantity; }, 0);
        if (Math.abs(lineTotal - report.originalQuantity) > 0.0001) {
            react_1.toast.warning(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Active line total (", ") differs from originally reported (", "). Saving anyway."], ["Active line total (", ") differs from originally reported (", "). Saving anyway."])), lineTotal, report.originalQuantity));
        }
        var payload = {
            notes: notes || undefined,
            lines: lines.map(function (_a) {
                var _key = _a.key, line = __rest(_a, ["key"]);
                return (__assign(__assign({}, line), { scrapReasonId: line.type === "Scrap" ? line.scrapReasonId : undefined }));
            })
        };
        var body = (_a = getSaveBody === null || getSaveBody === void 0 ? void 0 : getSaveBody(payload)) !== null && _a !== void 0 ? _a : JSON.stringify(payload);
        var encType = body instanceof FormData ? undefined : "application/json";
        void fetcher.submit(body, __assign({ method: saveMethod, action: saveAction !== null && saveAction !== void 0 ? saveAction : path_1.path.to.api.quantityReportLines(report.id) }, (encType ? { encType: encType } : {})));
    };
    var isSaving = fetcher.state !== "idle";
    var canSave = lines.length > 0 && lines.every(function (line) { return line.quantity > 0; });
    var preventDismissWhileOverlayOpen = function (event) {
        if (overlayInstances.length > 0 || deleteModal.isOpen) {
            event.preventDefault();
        }
    };
    return (<>
      <react_1.Drawer open={open} onOpenChange={function (isOpen) {
            if (!isOpen && overlayInstances.length === 0 && !deleteModal.isOpen) {
                onClose();
            }
        }}>
        <react_1.DrawerContent className="flex w-full max-w-lg flex-col sm:max-w-lg" onPointerDownOutside={preventDismissWhileOverlayOpen} onInteractOutside={preventDismissWhileOverlayOpen}>
          <react_1.DrawerHeader>
            <react_1.DrawerTitle>{title !== null && title !== void 0 ? title : <macro_1.Trans>Disposition</macro_1.Trans>}</react_1.DrawerTitle>
          </react_1.DrawerHeader>
          <react_1.DrawerBody className="flex w-full min-w-0 flex-col items-stretch gap-4">
            <react_1.VStack className="w-full gap-1">
              <react_1.Label>{t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Notes"], ["Notes"])))}</react_1.Label>
              <textarea className="min-h-[4rem] w-full rounded-md border border-border bg-background px-3 py-2 text-sm" value={notes} onChange={function (e) { return setNotes(e.target.value); }}/>
            </react_1.VStack>

            <ProductionQuantityLinesEditor_1.ProductionQuantityLinesEditor lines={lines} setLines={setLines} configurationParameters={configurationParameters} itemId={itemId} configReferenceContext={{
            originalConfiguration: report.originalConfiguration
        }}/>
          </react_1.DrawerBody>
          <react_1.DrawerFooter>
            {deleteAction ? (<react_1.Button type="button" variant="destructive" leftIcon={<lu_1.LuTrash2 />} onClick={deleteModal.onOpen} isDisabled={isSaving} className="sm:mr-auto">
                <macro_1.Trans>Delete</macro_1.Trans>
              </react_1.Button>) : null}
            <react_1.Button type="button" variant="secondary" onClick={onClose}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <react_1.Button type="button" onClick={save} isLoading={isSaving} isDisabled={!canSave}>
              <macro_1.Trans>Save</macro_1.Trans>
            </react_1.Button>
          </react_1.DrawerFooter>
        </react_1.DrawerContent>
      </react_1.Drawer>
      {deleteAction && deleteModal.isOpen ? (<Modals_1.ConfirmDelete action={deleteAction} isOpen name={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["this quantity report"], ["this quantity report"])))} text={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["This permanently deletes the quantity report and its entire history. This action cannot be undone."], ["This permanently deletes the quantity report and its entire history. This action cannot be undone."])))} onCancel={deleteModal.onClose} onSubmit={function () {
                deleteModal.onClose();
                onClose();
            }}/>) : null}
    </>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
