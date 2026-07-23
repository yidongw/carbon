import { Hidden, TextArea, ValidatedForm } from "@carbon/form";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Checkbox,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect, useMemo, useRef, useState } from "react";
import { LuMinus, LuPlus, LuTriangleAlert } from "react-icons/lu";
import { useFetcher } from "react-router";
import {
  finishValidator,
  nonScrapQuantityValidator,
  scrapQuantityValidator
} from "~/services/models";
import type {
  JobMaterial,
  OperationWithDetails,
  ProductionEvent,
  ProductionQuantity
} from "~/services/types";
import { path } from "~/utils/path";
import ScrapReason from "./ScrapReason";

export function QuantityModal({
  allStepsRecorded = true,
  laborProductionEvent,
  machineProductionEvent,
  materials = [],
  operation,
  parentIsSerial = false,
  parentIsBatch = false,
  productionQuantities = [],
  setupProductionEvent,
  suggestedQuantity,
  trackedEntityId,
  type,
  onClose
}: {
  allStepsRecorded?: boolean;
  laborProductionEvent: ProductionEvent | undefined;
  machineProductionEvent: ProductionEvent | undefined;
  materials?: JobMaterial[];
  operation: OperationWithDetails;
  parentIsSerial?: boolean;
  parentIsBatch?: boolean;
  productionQuantities?: ProductionQuantity[];
  setupProductionEvent: ProductionEvent | undefined;
  suggestedQuantity?: number;
  trackedEntityId: string;
  type: "scrap" | "rework" | "complete" | "finish";
  onClose: () => void;
}) {
  const { t } = useLingui();
  const fetcher = useFetcher<ProductionQuantity>();

  // Remaining quantity still to complete on this operation — the "Completed"
  // stepper defaults to it and can't exceed it.
  const operationTotal =
    operation.targetQuantity > 0
      ? operation.targetQuantity
      : operation.operationQuantity;
  const remaining = Math.max(0, operationTotal - operation.quantityComplete);

  const [quantity, setQuantity] = useState(
    parentIsSerial
      ? 1
      : type === "complete"
        ? (suggestedQuantity ?? remaining)
        : (suggestedQuantity ?? 0)
  );

  // Clamp to a whole number ≥ 0; "complete" is additionally capped at remaining.
  const clampQuantity = (n: number) => {
    const floored = Math.max(0, Number.isFinite(n) ? Math.floor(n) : 0);
    return type === "complete" ? Math.min(remaining, floored) : floored;
  };
  const [confirmedUnissued, setConfirmedUnissued] = useState(false);
  const submitted = useRef(false);
  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (submitted.current && fetcher.state === "idle") {
      onClose();
    }
  }, [fetcher.state, onClose]);

  const titleMap = {
    scrap: t`Log scrap for ${operation.itemReadableId}`,
    rework: t`Log rework for ${operation.itemReadableId}`,
    complete: t`Log completed for ${operation.itemReadableId}`,
    finish: t`Finish ${operation.itemReadableId}`
  };

  const isOperationComplete =
    operation.quantityComplete >= operation.operationQuantity;

  const descriptionMap = {
    scrap: t`Select a scrap quantity and reason`,
    rework: t`Select a rework quantity`,
    complete: t`Select a completion quantity`,
    finish: t`Are you sure you want to finish this operation? This will end all active production events for this operation.`
  };

  const actionMap = {
    scrap: path.to.scrap,
    rework: path.to.rework,
    complete: path.to.complete,
    finish: path.to.finish
  };

  const actionButtonMap = {
    scrap: t`Log Scrap`,
    rework: t`Log Rework`,
    complete: t`Log Completed`,
    finish: isOperationComplete ? t`Finish` : t`Finish Anyways`
  };

  const quantityLabelMap = {
    scrap: t`Scrap`,
    rework: t`Rework`,
    complete: t`Completed`,
    finish: ""
  };

  const validatorMap = {
    scrap: scrapQuantityValidator,
    rework: nonScrapQuantityValidator,
    complete: nonScrapQuantityValidator,
    finish: finishValidator
  };

  const hasUnissuedTrackedMaterials = useMemo(() => {
    const totalPartsAfterCompletion = parentIsSerial
      ? 1
      : operation.quantityComplete + quantity;

    return materials.some(
      (material) =>
        (material.requiresSerialTracking || material.requiresBatchTracking) &&
        material.jobOperationId === operation.id &&
        (material?.quantityIssued ?? 0) <
          (material?.quantity ?? 0) * totalPartsAfterCompletion
    );
  }, [
    materials,
    operation.id,
    operation.quantityComplete,
    quantity,
    parentIsSerial
  ]);

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <ModalContent>
        <ValidatedForm
          action={actionMap[type]}
          method="post"
          validator={validatorMap[type]}
          defaultValues={{
            // @ts-ignore
            trackedEntityId:
              parentIsSerial || parentIsBatch ? trackedEntityId : undefined,
            jobOperationId: operation.id,
            // @ts-ignore
            quantity: type === "finish" ? undefined : 0,
            setupProductionEventId: setupProductionEvent?.id,
            laborProductionEventId: laborProductionEvent?.id,
            machineProductionEventId: machineProductionEvent?.id
          }}
          fetcher={fetcher}
          onSubmit={() => {
            submitted.current = true;
          }}
        >
          <ModalHeader>
            <ModalTitle>{titleMap[type]}</ModalTitle>
            <ModalDescription>{descriptionMap[type]}</ModalDescription>
          </ModalHeader>
          <ModalBody>
            <Hidden name="trackedEntityId" />
            <Hidden
              name="trackingType"
              value={
                parentIsSerial ? "Serial" : parentIsBatch ? "Batch" : undefined
              }
            />
            <Hidden name="jobOperationId" />
            <Hidden name="setupProductionEventId" />
            <Hidden name="laborProductionEventId" />
            <Hidden name="machineProductionEventId" />
            <VStack spacing={2}>
              {hasUnissuedTrackedMaterials && type === "complete" && (
                <Alert variant="destructive">
                  <LuTriangleAlert className="h-4 w-4" />
                  <AlertTitle>
                    <Trans>Unissued serial/batch materials</Trans>
                  </AlertTitle>
                  <AlertDescription>
                    <Trans>
                      There are serial or batch tracked materials on the bill of
                      material that have not been fully issued. Completing
                      without issuing may result in incorrect traceability
                      records.
                    </Trans>
                  </AlertDescription>
                  <label className="col-start-2 flex items-center gap-2 mt-2 cursor-pointer">
                    <Checkbox
                      isChecked={confirmedUnissued}
                      onCheckedChange={(checked) =>
                        setConfirmedUnissued(checked === true)
                      }
                      className="bg-primary"
                    />
                    <span className="text-sm">
                      <Trans>
                        I understand and want to complete without issuing
                      </Trans>
                    </span>
                  </label>
                </Alert>
              )}

              {type === "finish" && !isOperationComplete && (
                <Alert variant="destructive">
                  <LuTriangleAlert className="h-4 w-4" />
                  <AlertTitle>
                    <Trans>Insufficient quantity</Trans>
                  </AlertTitle>
                  <AlertDescription>
                    <Trans>
                      The completed quantity for this operation is less than the
                      required quantity of {operation.operationQuantity}.
                    </Trans>
                  </AlertDescription>
                </Alert>
              )}
              {type === "finish" && !allStepsRecorded && (
                <Alert variant="destructive">
                  <LuTriangleAlert className="h-4 w-4" />
                  <AlertTitle>
                    <Trans>Steps are missing</Trans>
                  </AlertTitle>
                  <AlertDescription>
                    <Trans>
                      Please record all steps for this operation before closing.
                    </Trans>
                  </AlertDescription>
                </Alert>
              )}
              {type !== "finish" && (
                <>
                  <Hidden name="quantity" value={quantity} />
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-medium">
                        {quantityLabelMap[type]}
                      </span>
                      {type === "complete" && (
                        <span className="text-xs text-muted-foreground tabular-nums">
                          / {remaining}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <IconButton
                        aria-label={t`Decrease`}
                        icon={<LuMinus />}
                        variant="secondary"
                        size="lg"
                        onClick={() => setQuantity(clampQuantity(quantity - 1))}
                        isDisabled={parentIsSerial || quantity <= 0}
                      />
                      <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        value={quantity}
                        readOnly={parentIsSerial}
                        onChange={(e) =>
                          setQuantity(
                            clampQuantity(
                              Number.parseInt(e.target.value, 10) || 0
                            )
                          )
                        }
                        className="min-w-0 flex-1 rounded-lg border border-input bg-background shadow-xs px-3 py-2 text-center text-2xl font-semibold tabular-nums outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                      />
                      <IconButton
                        aria-label={t`Increase`}
                        icon={<LuPlus />}
                        variant="secondary"
                        size="lg"
                        onClick={() => setQuantity(clampQuantity(quantity + 1))}
                        isDisabled={
                          parentIsSerial ||
                          (type === "complete" && quantity >= remaining)
                        }
                      />
                    </div>
                  </div>
                </>
              )}
              {type === "scrap" ? (
                <>
                  <ScrapReason
                    name="scrapReasonId"
                    label={t`Scrap Reason`}
                    size="lg"
                  />
                  <TextArea label={t`Notes`} name="notes" size="lg" />
                </>
              ) : (
                <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
                  <span className="text-muted-foreground">
                    <Trans>Total Quantity</Trans>
                  </span>
                  <span className="font-medium tabular-nums">
                    {quantity +
                      (type === "rework"
                        ? operation.quantityReworked
                        : operation.quantityComplete)}
                  </span>
                </div>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" size="lg" onClick={onClose}>
              <Trans>Cancel</Trans>
            </Button>

            <Button
              size="lg"
              variant={
                type === "scrap" || (!isOperationComplete && type === "finish")
                  ? "destructive"
                  : "primary"
              }
              type="submit"
              isLoading={isSubmitting}
              disabled={
                isSubmitting ||
                (type !== "finish" && quantity <= 0) ||
                (type === "complete" &&
                  hasUnissuedTrackedMaterials &&
                  !confirmedUnissued)
              }
            >
              {actionButtonMap[type]}
            </Button>
          </ModalFooter>
        </ValidatedForm>
      </ModalContent>
    </Modal>
  );
}
