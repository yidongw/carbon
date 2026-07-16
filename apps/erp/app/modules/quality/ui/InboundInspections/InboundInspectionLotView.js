"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InboundInspectionLotView;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var items_1 = require("~/stores/items");
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
var ScanInspectionSample_1 = require("./ScanInspectionSample");
function InboundInspectionLotView(_a) {
    var _b, _c, _d, _e, _f;
    var inspection = _a.inspection, receiptReadableId = _a.receiptReadableId, receiverId = _a.receiverId, itemName = _a.itemName, itemTrackingType = _a.itemTrackingType, supplierName = _a.supplierName, samples = _a.samples, lotEntities = _a.lotEntities, issueTypes = _a.issueTypes, currentUserId = _a.currentUserId, enforceFourEyes = _a.enforceFourEyes, _g = _a.open, open = _g === void 0 ? true : _g;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var canUpdate = permissions.can("update", "quality");
    var items = (0, items_1.useItems)()[0];
    // Serial parts are inspected by scanning a discrete tracked entity. Batch /
    // inventory / non-inventory parts record pass/fail for each sampled item
    // without a tracked entity.
    var isSerial = itemTrackingType === "Serial";
    var scannerDisclosure = (0, react_1.useDisclosure)();
    var rejectConfirmDisclosure = (0, react_1.useDisclosure)();
    var acceptConfirmDisclosure = (0, react_1.useDisclosure)();
    var partialConfirmDisclosure = (0, react_1.useDisclosure)();
    // Look up the item in the live items store so we show the current
    // readable id (and revision) even if the snapshot stored on the
    // inspection row is stale.
    var item = items.find(function (i) { return i.id === inspection.itemId; });
    // The store exposes `readableIdWithRevision` pre-computed; split it so we
    // can run it through getReadableIdWithRevision for consistent formatting.
    var _h = (function () {
        var combined = item === null || item === void 0 ? void 0 : item.readableIdWithRevision;
        if (!combined)
            return [undefined, undefined];
        var dot = combined.lastIndexOf(".");
        if (dot < 0)
            return [combined, undefined];
        return [combined.slice(0, dot), combined.slice(dot + 1)];
    })(), storeReadableId = _h[0], storeRevision = _h[1];
    var displayReadableId = storeReadableId != null
        ? (0, string_1.getReadableIdWithRevision)(storeReadableId, storeRevision)
        : ((_b = inspection.itemReadableId) !== null && _b !== void 0 ? _b : "");
    var displayItemName = (_c = item === null || item === void 0 ? void 0 : item.name) !== null && _c !== void 0 ? _c : itemName;
    var passes = samples.filter(function (s) { return s.status === "Passed"; }).length;
    var fails = samples.filter(function (s) { return s.status === "Failed"; }).length;
    var inspected = passes + fails;
    var sampledIds = (0, react_2.useMemo)(function () { return new Set(samples.map(function (s) { return s.trackedEntityId; })); }, [samples]);
    var remaining = lotEntities.filter(function (e) { return !sampledIds.has(e.id); });
    var showFourEyesWarning = enforceFourEyes && !!receiverId && receiverId === currentUserId;
    // The lot is "closed" only after the inspector has pressed Accept or Reject
    // (setting dispositionedAt + a terminal status). Partial is explicitly not
    // closed — the inspector can keep scanning and disposition again later.
    var lotClosed = inspection.dispositionedAt != null &&
        (inspection.status === "Passed" || inspection.status === "Failed");
    var canAccept = !lotClosed &&
        inspected >= inspection.sampleSize &&
        fails <= inspection.acceptanceNumber;
    var canReject = !lotClosed && fails > inspection.acceptanceNumber;
    var canPartial = !lotClosed && inspected > 0;
    var failedTrackedEntityIds = samples
        .filter(function (s) { return s.status === "Failed"; })
        .map(function (s) { return s.trackedEntityId; });
    var newIssueHref = "/x/issue/new?itemId=".concat(encodeURIComponent(inspection.itemId), "&trackedEntityIds=").concat(encodeURIComponent(failedTrackedEntityIds.join(",")), "&sourceInspectionId=").concat(encodeURIComponent(inspection.id));
    var acceptUrl = "".concat(path_1.path.to.inboundInspection(inspection.id), "/accept");
    var rejectUrl = "".concat(path_1.path.to.inboundInspection(inspection.id), "/reject");
    var partialUrl = "".concat(path_1.path.to.inboundInspection(inspection.id), "/partial");
    return (<react_1.ModalDrawerProvider type="drawer">
      <react_1.ModalDrawer open={open} onOpenChange={function (next) {
            if (!next)
                navigate(-1);
        }}>
        <react_1.ModalDrawerContent size="full">
          <react_1.ModalDrawerHeader>
            <react_1.ModalDrawerTitle>
              <macro_1.Trans>Inspect</macro_1.Trans> {displayReadableId || displayItemName}
            </react_1.ModalDrawerTitle>
          </react_1.ModalDrawerHeader>
          <react_1.ModalDrawerBody>
            <react_1.VStack spacing={4} className="w-full">
              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full text-sm">
                <Kv label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Item"], ["Item"])))} value={displayReadableId} sub={displayItemName}/>
                <Kv label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Receipt"], ["Receipt"])))} value={receiptReadableId !== null && receiptReadableId !== void 0 ? receiptReadableId : ""} sub={supplierName !== null && supplierName !== void 0 ? supplierName : undefined}/>
                <Kv label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Plan"], ["Plan"])))} value={inspection.samplingPlanType === "AQL"
            ? "AQL ".concat((_d = inspection.aql) !== null && _d !== void 0 ? _d : "", " \u00B7 Lvl ").concat((_e = inspection.inspectionLevel) !== null && _e !== void 0 ? _e : "", " \u00B7 ").concat((_f = inspection.severity) !== null && _f !== void 0 ? _f : "")
            : inspection.samplingPlanType} sub={inspection.samplingStandard === "ANSI_Z1_4"
            ? "ANSI/ASQ Z1.4"
            : "ISO 2859-1"}/>
                <Kv label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Sample"], ["Sample"])))} value={"".concat(inspected, " / ").concat(inspection.sampleSize)} sub={"Ac ".concat(inspection.acceptanceNumber, " \u00B7 Re ").concat(inspection.rejectionNumber).concat(inspection.codeLetter ? " \u00B7 ".concat(inspection.codeLetter) : "")}/>
              </div>

              {showFourEyesWarning && (<react_1.Alert variant="warning">
                  <lu_1.LuTriangleAlert className="size-4"/>
                  <react_1.AlertTitle>
                    <macro_1.Trans>You received this lot</macro_1.Trans>
                  </react_1.AlertTitle>
                  <react_1.AlertDescription>
                    <macro_1.Trans>
                      Company policy asks for a different person to inspect
                      inbound items than the one who received them.
                    </macro_1.Trans>
                  </react_1.AlertDescription>
                </react_1.Alert>)}

              {/* Progress */}
              <react_1.BarProgress label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Progress"], ["Progress"])))} value={"".concat(inspected, " / ").concat(inspection.sampleSize, " \u00B7 ").concat(fails, " ").concat(fails === 1 ? "failure" : "failures", " \u00B7 Ac ").concat(inspection.acceptanceNumber)} progress={inspected} max={Math.max(1, inspection.sampleSize)} activeClassName={fails > inspection.acceptanceNumber
            ? "bg-red-500"
            : "bg-emerald-500"}/>

              {/* Scan button */}
              {!lotClosed && canUpdate && (<react_1.Button leftIcon={<lu_1.LuScan />} onClick={scannerDisclosure.onOpen} className="self-start">
                  <macro_1.Trans>Inspect Next Item</macro_1.Trans>
                </react_1.Button>)}

              {/* Samples */}
              <div className="w-full border rounded-md overflow-hidden">
                <table className="text-sm w-full">
                  <thead className="bg-muted text-xs text-muted-foreground">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium">
                        <macro_1.Trans>Entity</macro_1.Trans>
                      </th>
                      <th className="text-left px-3 py-2 font-medium">
                        <macro_1.Trans>Result</macro_1.Trans>
                      </th>
                      <th className="text-left px-3 py-2 font-medium">
                        <macro_1.Trans>Inspector</macro_1.Trans>
                      </th>
                      <th className="text-left px-3 py-2 font-medium">
                        <macro_1.Trans>Notes</macro_1.Trans>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {samples.length === 0 && (<tr>
                        <td colSpan={4} className="px-3 py-6 text-center text-muted-foreground">
                          <macro_1.Trans>No samples inspected yet.</macro_1.Trans>
                        </td>
                      </tr>)}
                    {samples.map(function (s, idx) {
            var _a, _b, _c, _d;
            var readable = (_b = (_a = s.trackedEntity) === null || _a === void 0 ? void 0 : _a.readableId) !== null && _b !== void 0 ? _b : null;
            return (<tr key={s.id} className="border-t">
                          <td className="px-3 py-2">
                            <div className="flex flex-col">
                              <span className="font-mono text-sm">
                                {(_c = readable !== null && readable !== void 0 ? readable : s.trackedEntityId) !== null && _c !== void 0 ? _c : t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Sample ", ""], ["Sample ", ""])), idx + 1)}
                              </span>
                              {readable && (<span className="text-xs text-muted-foreground">
                                  {s.trackedEntityId}
                                </span>)}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            {s.status === "Passed" ? (<react_1.Badge variant="green">
                                <lu_1.LuCircleCheck className="size-3 mr-1"/> Passed
                              </react_1.Badge>) : s.status === "Failed" ? (<react_1.Badge variant="red">
                                <lu_1.LuCircleX className="size-3 mr-1"/> Failed
                              </react_1.Badge>) : (<react_1.Badge variant="secondary">{s.status}</react_1.Badge>)}
                          </td>
                          <td className="px-3 py-2">
                            {s.inspectedBy ? (<components_1.EmployeeAvatar employeeId={s.inspectedBy}/>) : ("")}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">
                            {(_d = s.notes) !== null && _d !== void 0 ? _d : ""}
                          </td>
                        </tr>);
        })}
                  </tbody>
                </table>
              </div>
            </react_1.VStack>
          </react_1.ModalDrawerBody>
          <react_1.ModalDrawerFooter>
            <react_1.HStack spacing={2} className="w-full justify-between">
              <react_1.Button variant="secondary" leftIcon={<lu_1.LuShieldAlert />} asChild isDisabled={failedTrackedEntityIds.length === 0}>
                <a href={newIssueHref} target="_blank" rel="noreferrer">
                  <macro_1.Trans>Create Issue from Inspection</macro_1.Trans>
                </a>
              </react_1.Button>
              <react_1.HStack spacing={2}>
                <react_1.Button variant="secondary" onClick={partialConfirmDisclosure.onOpen} isDisabled={!canUpdate || !canPartial}>
                  <macro_1.Trans>Partial</macro_1.Trans>
                </react_1.Button>
                <react_1.Button variant="destructive" onClick={rejectConfirmDisclosure.onOpen} isDisabled={!canUpdate || !canReject}>
                  <macro_1.Trans>Reject Lot</macro_1.Trans>
                </react_1.Button>
                <react_1.Button onClick={acceptConfirmDisclosure.onOpen} isDisabled={!canUpdate || !canAccept}>
                  <macro_1.Trans>Accept Lot</macro_1.Trans>
                </react_1.Button>
              </react_1.HStack>
            </react_1.HStack>
          </react_1.ModalDrawerFooter>
        </react_1.ModalDrawerContent>
      </react_1.ModalDrawer>

      {scannerDisclosure.isOpen && (<ScanInspectionSample_1.default inspectionId={inspection.id} isSerial={isSerial} remaining={remaining} inspected={inspected} sampleSize={inspection.sampleSize} fails={fails} acceptanceNumber={inspection.acceptanceNumber} onClose={scannerDisclosure.onClose}/>)}

      {acceptConfirmDisclosure.isOpen && (<Modals_1.Confirm action={acceptUrl} title={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Accept lot?"], ["Accept lot?"])))} text={isSerial
                ? t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["", " un-sampled entities will be released to Available. Sampled passes stay Available and sampled failures stay Rejected."], ["", " un-sampled entities will be released to Available. Sampled passes stay Available and sampled failures stay Rejected."])), lotEntities.length - inspected) : t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["The lot will be marked Passed. ", " sampled failure(s) are recorded for your records."], ["The lot will be marked Passed. ", " sampled failure(s) are recorded for your records."])), fails)} confirmText={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Accept Lot"], ["Accept Lot"])))} onCancel={acceptConfirmDisclosure.onClose} onSubmit={acceptConfirmDisclosure.onClose}/>)}

      {partialConfirmDisclosure.isOpen && (<Modals_1.Confirm action={partialUrl} title={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Mark lot as partial?"], ["Mark lot as partial?"])))} text={isSerial
                ? t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Un-sampled entities will remain On Hold so you can keep inspecting and disposition later. Sampled outcomes are preserved."], ["Un-sampled entities will remain On Hold so you can keep inspecting and disposition later. Sampled outcomes are preserved."]))) : t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["The lot stays open so you can keep inspecting and disposition later. Sampled outcomes are preserved."], ["The lot stays open so you can keep inspecting and disposition later. Sampled outcomes are preserved."])))} confirmText={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Mark Partial"], ["Mark Partial"])))} onCancel={partialConfirmDisclosure.onClose} onSubmit={partialConfirmDisclosure.onClose}/>)}

      {rejectConfirmDisclosure.isOpen && (<RejectLotModal action={rejectUrl} issueTypes={issueTypes} summary={isSerial
                ? t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Statistical acceptance failed, so the entire lot is considered non-conforming (ISO 9001:2015 \u00A78.7). All ", " entities \u2014 ", " sampled pass(es), ", " failure(s), and ", " un-inspected \u2014 will be marked Rejected."], ["Statistical acceptance failed, so the entire lot is considered non-conforming (ISO 9001:2015 \u00A78.7). All ", " entities \u2014 ", " sampled pass(es), ", " failure(s), and ", " un-inspected \u2014 will be marked Rejected."])), lotEntities.length, passes, fails, Math.max(0, lotEntities.length - inspected)) : t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Statistical acceptance failed, so the entire lot of ", " is considered non-conforming (ISO 9001:2015 \u00A78.7) \u2014 ", " sampled pass(es) and ", " failure(s)."], ["Statistical acceptance failed, so the entire lot of ", " is considered non-conforming (ISO 9001:2015 \u00A78.7) \u2014 ", " sampled pass(es) and ", " failure(s)."])), inspection.lotSize, passes, fails)} onCancel={rejectConfirmDisclosure.onClose} onSubmit={rejectConfirmDisclosure.onClose}/>)}
    </react_1.ModalDrawerProvider>);
}
function RejectLotModal(_a) {
    var _b, _c;
    var action = _a.action, issueTypes = _a.issueTypes, summary = _a.summary, onCancel = _a.onCancel, onSubmit = _a.onSubmit;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var submitted = (0, react_2.useRef)(false);
    var _d = (0, react_2.useState)(true), createNcr = _d[0], setCreateNcr = _d[1];
    var _e = (0, react_2.useState)((_c = (_b = issueTypes[0]) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : ""), issueTypeId = _e[0], setIssueTypeId = _e[1];
    (0, react_2.useEffect)(function () {
        if (fetcher.state === "idle" && submitted.current) {
            onSubmit();
            submitted.current = false;
        }
    }, [fetcher.state, onSubmit]);
    var hasIssueTypes = issueTypes.length > 0;
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open)
                onCancel();
        }}>
      <react_1.ModalOverlay />
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            <macro_1.Trans>Reject Lot</macro_1.Trans>
          </react_1.ModalTitle>
        </react_1.ModalHeader>
        <react_1.ModalBody>
          <react_1.VStack spacing={4}>
            <p className="text-sm text-muted-foreground">{summary}</p>
            <label className="flex items-center gap-2 w-full cursor-pointer">
              <react_1.Checkbox isChecked={createNcr} onCheckedChange={function (checked) { return setCreateNcr(!!checked); }}/>
              <span className="text-sm font-medium">
                <macro_1.Trans>Open an NCR for MRB disposition</macro_1.Trans>
              </span>
            </label>
            {createNcr &&
            (hasIssueTypes ? (<div className="flex flex-col gap-2 w-full">
                  <react_1.Label htmlFor="nonConformanceTypeId">
                    <macro_1.Trans>Issue Type</macro_1.Trans>
                  </react_1.Label>
                  <react_1.Select value={issueTypeId} onValueChange={setIssueTypeId}>
                    <react_1.SelectTrigger id="nonConformanceTypeId">
                      <react_1.SelectValue placeholder={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Select an issue type"], ["Select an issue type"])))}/>
                    </react_1.SelectTrigger>
                    <react_1.SelectContent>
                      {issueTypes.map(function (type) { return (<react_1.SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </react_1.SelectItem>); })}
                    </react_1.SelectContent>
                  </react_1.Select>
                </div>) : (<react_1.Alert variant="warning">
                  <lu_1.LuTriangleAlert className="size-4"/>
                  <react_1.AlertTitle>
                    <macro_1.Trans>No issue types configured</macro_1.Trans>
                  </react_1.AlertTitle>
                  <react_1.AlertDescription>
                    <macro_1.Trans>
                      The lot will still be rejected, but an NCR cannot be
                      created until at least one Issue Type is configured.
                    </macro_1.Trans>
                  </react_1.AlertDescription>
                </react_1.Alert>))}
          </react_1.VStack>
        </react_1.ModalBody>
        <react_1.ModalFooter>
          <react_1.Button variant="secondary" onClick={onCancel}>
            <macro_1.Trans>Cancel</macro_1.Trans>
          </react_1.Button>
          <fetcher.Form method="post" action={action} onSubmit={function () { return (submitted.current = true); }}>
            <input type="hidden" name="createNcr" value={createNcr ? "true" : "false"}/>
            <input type="hidden" name="nonConformanceTypeId" value={createNcr ? issueTypeId : ""}/>
            <react_1.Button variant="destructive" type="submit" isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle" ||
            (createNcr && hasIssueTypes && !issueTypeId)}>
              <macro_1.Trans>Reject Lot</macro_1.Trans>
            </react_1.Button>
          </fetcher.Form>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>);
}
function Kv(_a) {
    var label = _a.label, value = _a.value, sub = _a.sub;
    return (<div className="flex flex-col gap-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium truncate">{value || "—"}</span>
      {sub && (<span className="text-xs text-muted-foreground truncate">{sub}</span>)}
    </div>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17;
