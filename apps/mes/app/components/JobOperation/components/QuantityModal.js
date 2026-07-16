"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuantityModal = QuantityModal;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var models_1 = require("~/services/models");
var path_1 = require("~/utils/path");
var ScrapReason_1 = require("./ScrapReason");
function QuantityModal(_a) {
    var _b = _a.allStepsRecorded, allStepsRecorded = _b === void 0 ? true : _b, laborProductionEvent = _a.laborProductionEvent, machineProductionEvent = _a.machineProductionEvent, _c = _a.materials, materials = _c === void 0 ? [] : _c, operation = _a.operation, _d = _a.parentIsSerial, parentIsSerial = _d === void 0 ? false : _d, _e = _a.parentIsBatch, parentIsBatch = _e === void 0 ? false : _e, _f = _a.productionQuantities, productionQuantities = _f === void 0 ? [] : _f, setupProductionEvent = _a.setupProductionEvent, suggestedQuantity = _a.suggestedQuantity, trackedEntityId = _a.trackedEntityId, type = _a.type, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var _g = (0, react_2.useState)(parentIsSerial ? 1 : (suggestedQuantity !== null && suggestedQuantity !== void 0 ? suggestedQuantity : 0)), quantity = _g[0], setQuantity = _g[1];
    var _h = (0, react_2.useState)(false), confirmedUnissued = _h[0], setConfirmedUnissued = _h[1];
    var submitted = (0, react_2.useRef)(false);
    var isSubmitting = fetcher.state !== "idle";
    (0, react_2.useEffect)(function () {
        if (submitted.current && fetcher.state === "idle") {
            onClose();
        }
    }, [fetcher.state, onClose]);
    var titleMap = {
        scrap: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Log scrap for ", ""], ["Log scrap for ", ""])), operation.itemReadableId),
        rework: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Log rework for ", ""], ["Log rework for ", ""])), operation.itemReadableId),
        complete: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Log completed for ", ""], ["Log completed for ", ""])), operation.itemReadableId),
        finish: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Finish ", ""], ["Finish ", ""])), operation.itemReadableId)
    };
    var isOperationComplete = operation.quantityComplete >= operation.operationQuantity;
    var descriptionMap = {
        scrap: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Select a scrap quantity and reason"], ["Select a scrap quantity and reason"]))),
        rework: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Select a rework quantity"], ["Select a rework quantity"]))),
        complete: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Select a completion quantity"], ["Select a completion quantity"]))),
        finish: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Are you sure you want to finish this operation? This will end all active production events for this operation."], ["Are you sure you want to finish this operation? This will end all active production events for this operation."])))
    };
    var actionMap = {
        scrap: path_1.path.to.scrap,
        rework: path_1.path.to.rework,
        complete: path_1.path.to.complete,
        finish: path_1.path.to.finish
    };
    var actionButtonMap = {
        scrap: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Log Scrap"], ["Log Scrap"]))),
        rework: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Log Rework"], ["Log Rework"]))),
        complete: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Log Completed"], ["Log Completed"]))),
        finish: isOperationComplete ? t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Finish"], ["Finish"]))) : t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Finish Anyways"], ["Finish Anyways"])))
    };
    var validatorMap = {
        scrap: models_1.scrapQuantityValidator,
        rework: models_1.nonScrapQuantityValidator,
        complete: models_1.nonScrapQuantityValidator,
        finish: models_1.finishValidator
    };
    var hasUnissuedTrackedMaterials = (0, react_2.useMemo)(function () {
        var totalPartsAfterCompletion = parentIsSerial
            ? 1
            : operation.quantityComplete + quantity;
        return materials.some(function (material) {
            var _a, _b;
            return (material.requiresSerialTracking || material.requiresBatchTracking) &&
                material.jobOperationId === operation.id &&
                ((_a = material === null || material === void 0 ? void 0 : material.quantityIssued) !== null && _a !== void 0 ? _a : 0) <
                    ((_b = material === null || material === void 0 ? void 0 : material.quantity) !== null && _b !== void 0 ? _b : 0) * totalPartsAfterCompletion;
        });
    }, [
        materials,
        operation.id,
        operation.quantityComplete,
        quantity,
        parentIsSerial
    ]);
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open) {
                onClose();
            }
        }}>
      <react_1.ModalContent>
        <form_1.ValidatedForm action={actionMap[type]} method="post" validator={validatorMap[type]} defaultValues={{
            // @ts-ignore
            trackedEntityId: parentIsSerial || parentIsBatch ? trackedEntityId : undefined,
            jobOperationId: operation.id,
            // @ts-ignore
            quantity: type === "finish" ? undefined : 0,
            setupProductionEventId: setupProductionEvent === null || setupProductionEvent === void 0 ? void 0 : setupProductionEvent.id,
            laborProductionEventId: laborProductionEvent === null || laborProductionEvent === void 0 ? void 0 : laborProductionEvent.id,
            machineProductionEventId: machineProductionEvent === null || machineProductionEvent === void 0 ? void 0 : machineProductionEvent.id
        }} fetcher={fetcher} onSubmit={function () {
            submitted.current = true;
        }}>
          <react_1.ModalHeader>
            <react_1.ModalTitle>{titleMap[type]}</react_1.ModalTitle>
            <react_1.ModalDescription>{descriptionMap[type]}</react_1.ModalDescription>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <form_1.Hidden name="trackedEntityId"/>
            <form_1.Hidden name="trackingType" value={parentIsSerial ? "Serial" : parentIsBatch ? "Batch" : undefined}/>
            <form_1.Hidden name="jobOperationId"/>
            <form_1.Hidden name="setupProductionEventId"/>
            <form_1.Hidden name="laborProductionEventId"/>
            <form_1.Hidden name="machineProductionEventId"/>
            <react_1.VStack spacing={2}>
              {hasUnissuedTrackedMaterials && type === "complete" && (<react_1.Alert variant="destructive">
                  <lu_1.LuTriangleAlert className="h-4 w-4"/>
                  <react_1.AlertTitle>
                    <macro_1.Trans>Unissued serial/batch materials</macro_1.Trans>
                  </react_1.AlertTitle>
                  <react_1.AlertDescription>
                    <macro_1.Trans>
                      There are serial or batch tracked materials on the bill of
                      material that have not been fully issued. Completing
                      without issuing may result in incorrect traceability
                      records.
                    </macro_1.Trans>
                  </react_1.AlertDescription>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <react_1.Checkbox isChecked={confirmedUnissued} onCheckedChange={function (checked) {
                return setConfirmedUnissued(checked === true);
            }} className="bg-primary"/>
                    <span className="text-sm">
                      <macro_1.Trans>
                        I understand and want to complete without issuing
                      </macro_1.Trans>
                    </span>
                  </label>
                </react_1.Alert>)}

              {type === "finish" && !isOperationComplete && (<react_1.Alert variant="destructive">
                  <lu_1.LuTriangleAlert className="h-4 w-4"/>
                  <react_1.AlertTitle>
                    <macro_1.Trans>Insufficient quantity</macro_1.Trans>
                  </react_1.AlertTitle>
                  <react_1.AlertDescription>
                    <macro_1.Trans>
                      The completed quantity for this operation is less than the
                      required quantity of {operation.operationQuantity}.
                    </macro_1.Trans>
                  </react_1.AlertDescription>
                </react_1.Alert>)}
              {type === "finish" && !allStepsRecorded && (<react_1.Alert variant="destructive">
                  <lu_1.LuTriangleAlert className="h-4 w-4"/>
                  <react_1.AlertTitle>
                    <macro_1.Trans>Steps are missing</macro_1.Trans>
                  </react_1.AlertTitle>
                  <react_1.AlertDescription>
                    <macro_1.Trans>
                      Please record all steps for this operation before closing.
                    </macro_1.Trans>
                  </react_1.AlertDescription>
                </react_1.Alert>)}
              {type !== "finish" && (<>
                  <form_1.NumberControlled name="quantity" label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Quantity"], ["Quantity"])))} value={quantity} onChange={setQuantity} isReadOnly={parentIsSerial} minValue={0}/>
                </>)}
              {type === "scrap" ? (<>
                  <ScrapReason_1.default name="scrapReasonId" label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Scrap Reason"], ["Scrap Reason"])))} size="lg"/>
                  <form_1.TextArea label={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Notes"], ["Notes"])))} name="notes" size="lg"/>
                </>) : (<>
                  <form_1.NumberControlled name="totalQuantity" label={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Total Quantity"], ["Total Quantity"])))} size="lg" value={quantity +
                (type === "rework"
                    ? operation.quantityReworked
                    : operation.quantityComplete)} isReadOnly/>
                </>)}
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.Button variant="secondary" size="lg" onClick={onClose}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>

            <react_1.Button size="lg" variant={type === "scrap" || (!isOperationComplete && type === "finish")
            ? "destructive"
            : "primary"} type="submit" isLoading={isSubmitting} disabled={isSubmitting ||
            (type === "complete" &&
                hasUnissuedTrackedMaterials &&
                !confirmedUnissued)}>
              {actionButtonMap[type]}
            </react_1.Button>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17;
