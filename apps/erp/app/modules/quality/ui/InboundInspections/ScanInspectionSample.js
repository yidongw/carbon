"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ScanInspectionSample;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var quality_models_1 = require("~/modules/quality/quality.models");
var path_1 = require("~/utils/path");
function ScanInspectionSample(_a) {
    var _b, _c, _d, _e;
    var inspectionId = _a.inspectionId, isSerial = _a.isSerial, remaining = _a.remaining, inspected = _a.inspected, sampleSize = _a.sampleSize, fails = _a.fails, acceptanceNumber = _a.acceptanceNumber, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var _f = (0, react_2.useState)(""), serial = _f[0], setSerial = _f[1];
    var _g = (0, react_2.useState)(null), selected = _g[0], setSelected = _g[1];
    var _h = (0, react_2.useState)("Passed"), pendingStatus = _h[0], setPendingStatus = _h[1];
    // Bumped after each successful save so the form (notes) remounts and clears,
    // even for non-serial parts where there's no entity selection to change.
    var _j = (0, react_2.useState)(0), resetKey = _j[0], setResetKey = _j[1];
    var findMatch = function (value) {
        var _a;
        if (!value)
            return null;
        var needle = value.toLowerCase();
        return ((_a = remaining.find(function (e) {
            if (e.id === value)
                return true;
            if (e.readableId && e.readableId.toLowerCase() === needle)
                return true;
            return false;
        })) !== null && _a !== void 0 ? _a : null);
    };
    // biome-ignore lint/correctness/useExhaustiveDependencies: keep findMatch around for future UI without re-introducing unused-variable churn
    (0, react_2.useEffect)(function () {
        setSelected(findMatch(serial));
    }, [serial, remaining]);
    (0, react_2.useEffect)(function () {
        if (fetcher.state === "idle" && fetcher.data && !fetcher.data.error) {
            setSerial("");
            setSelected(null);
            setResetKey(function (k) { return k + 1; });
        }
    }, [fetcher.state, fetcher.data]);
    var isSubmitting = fetcher.state !== "idle";
    // Serial parts require a scanned/selected tracked entity; other tracking
    // types record pass/fail without one.
    var canRecord = isSerial ? !!selected : true;
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.ModalContent size="large">
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            <macro_1.Trans>Inspect Item</macro_1.Trans>
          </react_1.ModalTitle>
          <react_1.ModalDescription>
            {isSerial ? (<macro_1.Trans>
                Scan or select a tracked entity from this lot and record the
                inspection result.
              </macro_1.Trans>) : (<macro_1.Trans>Record the inspection result for this sample.</macro_1.Trans>)}
          </react_1.ModalDescription>
        </react_1.ModalHeader>
        <form_1.ValidatedForm key={"".concat((_b = selected === null || selected === void 0 ? void 0 : selected.id) !== null && _b !== void 0 ? _b : "none", "-").concat(resetKey)} fetcher={fetcher} method="post" action={"".concat(path_1.path.to.inboundInspection(inspectionId), "/sample")} validator={quality_models_1.inboundInspectionSampleValidator} defaultValues={{
            inspectionId: inspectionId,
            trackedEntityId: (_c = selected === null || selected === void 0 ? void 0 : selected.id) !== null && _c !== void 0 ? _c : "",
            status: pendingStatus,
            notes: ""
        }}>
          <react_1.ModalBody>
            <Form_1.Hidden name="inspectionId" value={inspectionId}/>
            <Form_1.Hidden name="trackedEntityId" value={(_d = selected === null || selected === void 0 ? void 0 : selected.id) !== null && _d !== void 0 ? _d : ""}/>
            <Form_1.Hidden name="status" value={pendingStatus}/>

            <react_1.VStack spacing={4} className="w-full">
              <react_1.BarProgress label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Progress"], ["Progress"])))} value={"".concat(inspected, " / ").concat(sampleSize, " \u00B7 ").concat(fails, " ").concat(fails === 1 ? "failure" : "failures", " \u00B7 Ac ").concat(acceptanceNumber)} progress={inspected} max={Math.max(1, sampleSize)} activeClassName={fails > acceptanceNumber ? "bg-red-500" : "bg-emerald-500"}/>

              {isSerial && (<react_1.Tabs defaultValue="scan" className="w-full">
                  <react_1.TabsList className="grid w-full grid-cols-2 mb-4">
                    <react_1.TabsTrigger value="scan">
                      <lu_1.LuQrCode className="mr-2"/>
                      <macro_1.Trans>Scan</macro_1.Trans>
                    </react_1.TabsTrigger>
                    <react_1.TabsTrigger value="select">
                      <lu_1.LuList className="mr-2"/>
                      <macro_1.Trans>Select</macro_1.Trans>
                    </react_1.TabsTrigger>
                  </react_1.TabsList>
                  <react_1.TabsContent value="scan" className="mt-0 w-full">
                    <react_1.VStack spacing={3} className="w-full">
                      <react_1.InputGroup className="w-full">
                        <react_1.Input autoFocus placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Scan or enter tracked entity ID, serial, or batch"], ["Scan or enter tracked entity ID, serial, or batch"])))} value={serial} onChange={function (e) { return setSerial(e.target.value); }}/>
                        <react_1.InputRightElement>
                          {serial &&
                (selected ? (<lu_1.LuCheck className="text-green-500"/>) : (<lu_1.LuX className="text-red-500"/>))}
                        </react_1.InputRightElement>
                      </react_1.InputGroup>

                      {selected && (<div className="w-full rounded-md border p-3">
                          <div className="text-xs text-muted-foreground">
                            <macro_1.Trans>Tracked Entity</macro_1.Trans>
                          </div>
                          <div className="font-mono text-sm">
                            {(_e = selected.readableId) !== null && _e !== void 0 ? _e : selected.id}
                          </div>
                          {selected.readableId && (<div className="text-xs text-muted-foreground mt-1">
                              {selected.id}
                            </div>)}
                        </div>)}
                    </react_1.VStack>
                  </react_1.TabsContent>
                  <react_1.TabsContent value="select" className="mt-0 w-full">
                    <react_1.ScrollArea className="h-[40dvh] w-full">
                      <react_1.VStack spacing={2} className="w-full pr-3">
                        {remaining.length === 0 ? (<p className="text-center text-muted-foreground w-full py-6">
                            <macro_1.Trans>No remaining entities to inspect.</macro_1.Trans>
                          </p>) : (remaining.map(function (e) {
                var _a;
                var isSelected = (selected === null || selected === void 0 ? void 0 : selected.id) === e.id;
                return (<react_1.HStack key={e.id} className="w-full justify-between p-4 border rounded-md">
                                <react_1.VStack spacing={0} className="w-full items-start min-w-0">
                                  <p className="font-mono text-sm truncate w-full">
                                    {(_a = e.readableId) !== null && _a !== void 0 ? _a : e.id}
                                  </p>
                                  {e.readableId && (<p className="text-xs text-muted-foreground truncate w-full">
                                      {e.id}
                                    </p>)}
                                </react_1.VStack>
                                <react_1.Button size="sm" variant={isSelected ? "primary" : "secondary"} onClick={function () { return setSerial(e.id); }}>
                                  {isSelected ? (<macro_1.Trans>Selected</macro_1.Trans>) : (<macro_1.Trans>Select</macro_1.Trans>)}
                                </react_1.Button>
                              </react_1.HStack>);
            }))}
                      </react_1.VStack>
                    </react_1.ScrollArea>
                  </react_1.TabsContent>
                </react_1.Tabs>)}

              <Form_1.TextArea name="notes" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Notes"], ["Notes"])))} isDisabled={!canRecord}/>
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.HStack spacing={2}>
              <react_1.Button variant="secondary" onClick={onClose}>
                <macro_1.Trans>Close</macro_1.Trans>
              </react_1.Button>
              <Form_1.Submit variant="destructive" leftIcon={<lu_1.LuCircleX />} isDisabled={!canRecord || isSubmitting} onClick={function () { return setPendingStatus("Failed"); }}>
                <macro_1.Trans>Fail</macro_1.Trans>
              </Form_1.Submit>
              <Form_1.Submit leftIcon={<lu_1.LuCircleCheck />} isDisabled={!canRecord || isSubmitting} onClick={function () { return setPendingStatus("Passed"); }}>
                <macro_1.Trans>Pass</macro_1.Trans>
              </Form_1.Submit>
            </react_1.HStack>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
}
var templateObject_1, templateObject_2, templateObject_3;
