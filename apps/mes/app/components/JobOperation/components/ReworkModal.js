"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReworkModal = ReworkModal;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var models_1 = require("~/services/models");
var path_1 = require("~/utils/path");
function ReworkModal(_a) {
    var _b, _c, _d, _e, _f;
    var operation = _a.operation, jobId = _a.jobId, isOpen = _a.isOpen, onClose = _a.onClose, _g = _a.trackedEntities, trackedEntities = _g === void 0 ? [] : _g, parentIsSerial = _a.parentIsSerial, parentIsBatch = _a.parentIsBatch;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var targetsFetcher = (0, react_router_1.useFetcher)();
    var maxQuantity = (_b = operation.operationQuantity) !== null && _b !== void 0 ? _b : 0;
    var defaultQuantity = Math.max(maxQuantity -
        ((_c = operation.quantityComplete) !== null && _c !== void 0 ? _c : 0) -
        ((_d = operation.quantityScrapped) !== null && _d !== void 0 ? _d : 0), 1);
    var _h = (0, react_2.useState)(defaultQuantity), quantity = _h[0], setQuantity = _h[1];
    var _j = (0, react_2.useState)(new Set()), selectedEntityIds = _j[0], setSelectedEntityIds = _j[1];
    var _k = (0, react_2.useState)(""), scanInput = _k[0], setScanInput = _k[1];
    var _l = (0, react_2.useState)(""), selectedBatchId = _l[0], setSelectedBatchId = _l[1];
    var targets = (_f = (_e = targetsFetcher.data) === null || _e === void 0 ? void 0 : _e.operations) !== null && _f !== void 0 ? _f : [];
    (0, react_2.useEffect)(function () {
        if (isOpen) {
            targetsFetcher.load(path_1.path.to.reworkTargets(operation.id));
            setSelectedEntityIds(parentIsSerial && trackedEntities.length === 1
                ? new Set([trackedEntities[0].id])
                : new Set());
            setScanInput("");
            setSelectedBatchId(parentIsBatch && trackedEntities.length === 1
                ? trackedEntities[0].id
                : "");
        }
    }, [
        isOpen,
        operation.id,
        parentIsSerial,
        parentIsBatch,
        trackedEntities,
        targetsFetcher.load
    ]);
    (0, react_2.useEffect)(function () {
        var _a;
        if (fetcher.state === "idle" && ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success)) {
            react_1.toast.success(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Rework created successfully"], ["Rework created successfully"]))));
            onClose();
        }
    }, [fetcher.state, fetcher.data, onClose, t]);
    var filteredEntities = (0, react_2.useMemo)(function () {
        if (!scanInput)
            return trackedEntities;
        var search = scanInput.toLowerCase();
        return trackedEntities.filter(function (e) {
            var _a;
            return e.id.toLowerCase().includes(search) ||
                ((_a = e.readableId) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(search));
        });
    }, [trackedEntities, scanInput]);
    var toggleEntity = function (id) {
        setSelectedEntityIds(function (prev) {
            var next = new Set(prev);
            if (next.has(id))
                next.delete(id);
            else
                next.add(id);
            return next;
        });
    };
    var handleScanKeyDown = function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            var match_1 = trackedEntities.find(function (entity) { return entity.id === scanInput || entity.readableId === scanInput; });
            if (match_1) {
                setSelectedEntityIds(function (prev) { return new Set(prev).add(match_1.id); });
                setScanInput("");
            }
        }
    };
    var serialQuantity = selectedEntityIds.size;
    var selectedBatch = trackedEntities.find(function (e) { return e.id === selectedBatchId; });
    var batchMaxQuantity = selectedBatch
        ? Number(selectedBatch.quantity)
        : maxQuantity;
    var trackedEntityIdsValue = parentIsSerial
        ? JSON.stringify(Array.from(selectedEntityIds))
        : parentIsBatch && selectedBatchId
            ? JSON.stringify([selectedBatchId])
            : undefined;
    if (!isOpen)
        return null;
    return (<react_1.Modal open={isOpen} onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.ModalContent>
        <form_1.ValidatedForm method="post" action={path_1.path.to.triggerRework} validator={models_1.triggerReworkValidator} defaultValues={{
            jobId: jobId,
            triggeredAtJobOperationId: operation.id,
            targetJobOperationId: "",
            reason: "",
            quantity: defaultQuantity
        }} fetcher={fetcher}>
          <react_1.ModalHeader>
            <react_1.ModalTitle>
              <macro_1.Trans>Create Rework</macro_1.Trans>
            </react_1.ModalTitle>
            <react_1.ModalDescription>
              <macro_1.Trans>
                Select the operation to go back to. All operations from that
                point to the current operation will be redone.
              </macro_1.Trans>
            </react_1.ModalDescription>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <form_1.Hidden name="jobId" value={jobId}/>
            <form_1.Hidden name="triggeredAtJobOperationId" value={operation.id}/>
            {trackedEntityIdsValue && (<form_1.Hidden name="trackedEntityIds" value={trackedEntityIdsValue}/>)}
            <react_1.VStack spacing={2}>
              <form_1.Select name="targetJobOperationId" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Go back to operation"], ["Go back to operation"])))} size="lg" options={targets.map(function (op) {
            var _a, _b;
            return ({
                value: op.id,
                label: ((_b = (_a = op.jobMakeMethod) === null || _a === void 0 ? void 0 : _a.item) === null || _b === void 0 ? void 0 : _b.name) ? (<span>
                      {op.description || op.processId}
                      <span className="text-muted-foreground text-xs ml-2">
                        {op.jobMakeMethod.item.name}
                      </span>
                    </span>) : (op.description || op.processId)
            });
        })}/>

              {parentIsSerial ? (<div>
                  <form_1.Hidden name="quantity" value={String(serialQuantity || 1)}/>
                  <div className="w-full flex flex-col gap-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      <macro_1.Trans>Serial numbers</macro_1.Trans>
                      {serialQuantity > 0 && (<span className="ml-1.5">
                          ({serialQuantity} selected)
                        </span>)}
                    </label>
                    <react_1.Input value={scanInput} onChange={function (e) { return setScanInput(e.target.value); }} onKeyDown={handleScanKeyDown} placeholder={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Scan or search serial number..."], ["Scan or search serial number..."])))} size="lg"/>
                    <div className="max-h-48 overflow-y-auto rounded-lg border">
                      {filteredEntities.length === 0 ? (<div className="py-6 text-center text-sm text-muted-foreground">
                          <macro_1.Trans>No serial numbers found</macro_1.Trans>
                        </div>) : (filteredEntities.map(function (entity) { return (<label key={entity.id} className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors hover:bg-muted/50 border-b last:border-b-0">
                            <react_1.Checkbox isChecked={selectedEntityIds.has(entity.id)} onCheckedChange={function () { return toggleEntity(entity.id); }} aria-label={entity.readableId || entity.id}/>
                            <div className="flex flex-col min-w-0">
                              {entity.readableId ? (<>
                                  <span className="text-sm font-medium truncate">
                                    {entity.readableId}
                                  </span>
                                  <span className="text-xs text-muted-foreground font-mono truncate">
                                    {entity.id}
                                  </span>
                                </>) : (<span className="text-xs text-muted-foreground font-mono truncate">
                                  {entity.id}
                                </span>)}
                            </div>
                          </label>); }))}
                    </div>
                  </div>
                </div>) : parentIsBatch ? (<>
                  <form_1.Select name="_batchSelect" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Batch"], ["Batch"])))} size="lg" options={trackedEntities.map(function (entity) { return ({
                value: entity.id,
                label: "".concat(entity.readableId || entity.id, " (qty: ").concat(entity.quantity, ")")
            }); })} onChange={function (option) {
                var _a;
                setSelectedBatchId((_a = option === null || option === void 0 ? void 0 : option.value) !== null && _a !== void 0 ? _a : "");
                setQuantity(1);
            }}/>
                  <form_1.NumberControlled name="quantity" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Quantity"], ["Quantity"])))} value={quantity} onChange={setQuantity} minValue={1} maxValue={batchMaxQuantity} size="lg"/>
                </>) : (<form_1.NumberControlled name="quantity" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Quantity"], ["Quantity"])))} value={quantity} onChange={setQuantity} minValue={1} maxValue={maxQuantity} size="lg"/>)}

              <form_1.TextArea name="reason" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Reason for rework"], ["Reason for rework"])))} placeholder={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Describe what needs to be reworked..."], ["Describe what needs to be reworked..."])))} size="lg"/>
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.HStack>
              <react_1.Button variant="secondary" size="lg" onClick={onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
              <react_1.Button type="submit" size="lg" isDisabled={fetcher.state !== "idle" ||
            (parentIsSerial && serialQuantity === 0)} isLoading={fetcher.state !== "idle"}>
                <macro_1.Trans>Create Rework</macro_1.Trans>
              </react_1.Button>
            </react_1.HStack>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
