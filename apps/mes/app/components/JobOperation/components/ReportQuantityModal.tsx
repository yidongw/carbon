import { localizeVariantAttributeLabel } from "@carbon/database/style-reference";
import {
  Button,
  Combobox,
  cn,
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
import { useLingui } from "@lingui/react/macro";
import { useEffect, useMemo, useRef, useState } from "react";
import { LuMinus, LuPlus } from "react-icons/lu";
import { useFetcher } from "react-router";
import { OperationStatusIcon } from "~/components/Icons";
import type { getEmployeeProcessesByProcess } from "~/services/people.service";
import type { Operation, OperationWithDetails } from "~/services/types";
import { usePeople } from "~/stores";
import { path } from "~/utils/path";

type Bundle = {
  attributeLabel: string | null;
  valuesKey: string | null;
} | null;

/**
 * The garment report-quantity modal: an info summary + a Completed stepper that
 * defaults to the remaining quantity and, when reduced, asks for the reason for
 * the shortfall (rework / scrap / not finished) — the same behaviour as the old
 * bundle report form. Records finished + rework + scrap in one submit.
 */
export function ReportQuantityModal({
  operation,
  bundle,
  defaultEmployeeId,
  onClose
}: {
  operation: OperationWithDetails;
  bundle: Bundle;
  defaultEmployeeId: string;
  onClose: () => void;
}) {
  const { t, i18n } = useLingui();
  const [people] = usePeople();
  const { ids: assignedEmployeeIds, isLoading: assignedEmployeesLoading } =
    useEmployeesByProcess(operation.processId);
  const [employeeId, setEmployeeId] = useState(defaultEmployeeId);
  const fetcher = useFetcher<{ success: boolean }>();
  const submitted = useRef(false);
  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (submitted.current && fetcher.state === "idle") onClose();
  }, [fetcher.state, onClose]);

  const operationTotal =
    operation.targetQuantity > 0
      ? operation.targetQuantity
      : operation.operationQuantity;
  const total = Math.max(0, operationTotal - operation.quantityComplete);

  // Start at the full remaining (all good); the worker only reduces it and gives
  // a reason for the shortfall, so nothing can exceed the total.
  const [completed, setCompleted] = useState(total);
  const [rework, setRework] = useState(0);
  const [scrap, setScrap] = useState(0);

  const clamp = (n: number, max: number) =>
    Math.max(0, Math.min(max, Number.isFinite(n) ? Math.floor(n) : 0));

  const shortfall = total - completed;
  const notFinished = Math.max(0, shortfall - rework - scrap);

  const updateCompleted = (n: number) => {
    const c = clamp(n, total);
    setCompleted(c);
    const nextShortfall = total - c;
    if (rework + scrap > nextShortfall) {
      const r = Math.min(rework, nextShortfall);
      setRework(r);
      setScrap(Math.min(scrap, nextShortfall - r));
    }
  };

  const reported = completed + rework + scrap;
  const invalid = reported <= 0;

  const colorSize = localizeVariantAttributeLabel(
    bundle?.attributeLabel?.trim() ||
      bundle?.valuesKey?.replace(/\|/g, " · ").trim() ||
      "",
    i18n.locale
  );

  const statusLabels: Record<string, string> = {
    Todo: t`Todo`,
    Ready: t`Ready`,
    Waiting: t`Waiting`,
    "In Progress": t`In Progress`,
    Paused: t`Paused`,
    Done: t`Done`,
    Canceled: t`Canceled`
  };

  // Only show employees assigned to this operation's process. Show nothing
  // while the assignments load (avoids flashing the full list), then fall back
  // to everyone when the process has no assignments so reporting is never
  // blocked.
  const eligiblePeople = assignedEmployeesLoading
    ? []
    : assignedEmployeeIds.size > 0
      ? people.filter((p) => assignedEmployeeIds.has(p.id))
      : people;
  const employeeOptions = eligiblePeople.map((p) => ({
    label: p.name,
    value: p.id
  }));

  const submit = () => {
    submitted.current = true;
    fetcher.submit(
      {
        jobOperationId: operation.id,
        employeeId,
        finished: String(completed),
        rework: String(rework),
        scrap: String(scrap)
      },
      { method: "post", action: path.to.reportQuantity }
    );
  };

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {t`Record completed quantity for ${operation.itemReadableId}`}
          </ModalTitle>
          {colorSize && (
            <ModalDescription>
              {`${operation.itemReadableId} — ${colorSize}`}
            </ModalDescription>
          )}
        </ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <div className="flex w-full flex-col gap-2 rounded-lg border border-border p-4 text-sm">
              <InfoRow
                label={t`Quantity`}
                value={operation.operationQuantity}
              />
              <InfoRow
                label={t`Current process`}
                value={operation.description}
              />
              <InfoRow
                label={t`Produced`}
                value={`${operation.quantityComplete} / ${operationTotal}`}
              />
              <InfoRow label={t`Rework`} value={operation.quantityReworked} />
              <InfoRow label={t`Scrap`} value={operation.quantityScrapped} />
              {operation.operationStatus && (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">{t`Status`}</span>
                  <span className="flex items-center gap-2 text-right font-medium">
                    <OperationStatusIcon
                      status={
                        operation.operationStatus as Operation["operationStatus"]
                      }
                    />
                    {statusLabels[operation.operationStatus] ??
                      operation.operationStatus}
                  </span>
                </div>
              )}
            </div>

            <div className="flex w-full flex-col gap-4 rounded-lg border border-border p-4">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">{t`Employee`}</span>
                <Combobox
                  value={employeeId}
                  onChange={setEmployeeId}
                  options={employeeOptions}
                  placeholder={t`Select employee`}
                  size="lg"
                />
              </div>

              <div className="flex flex-col gap-2 border-t border-border pt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium">{t`Completed`}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    / {total}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <IconButton
                    aria-label={t`Decrease`}
                    icon={<LuMinus />}
                    variant="secondary"
                    size="lg"
                    onClick={() => updateCompleted(completed - 1)}
                    isDisabled={completed <= 0}
                  />
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={total}
                    value={completed}
                    onChange={(e) =>
                      updateCompleted(Number.parseInt(e.target.value, 10))
                    }
                    className={cn(
                      inputClass,
                      "flex-1 text-center text-2xl font-semibold"
                    )}
                  />
                  <IconButton
                    aria-label={t`Increase`}
                    icon={<LuPlus />}
                    variant="secondary"
                    size="lg"
                    onClick={() => updateCompleted(completed + 1)}
                    isDisabled={completed >= total}
                  />
                </div>
              </div>

              {shortfall > 0 && (
                <div className="flex flex-col gap-3 border-t border-border pt-4">
                  <span className="text-xs text-muted-foreground">
                    {t`Reason for the remaining ${shortfall}`}
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <ReasonField
                      label={t`Rework`}
                      value={rework}
                      onChange={(n) => setRework(clamp(n, shortfall - scrap))}
                    />
                    <ReasonField
                      label={t`Scrap`}
                      value={scrap}
                      onChange={(n) => setScrap(clamp(n, shortfall - rework))}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t`Not finished yet`}
                    </span>
                    <span className="font-medium tabular-nums">
                      {notFinished}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" size="lg" onClick={onClose}>
            {t`Cancel`}
          </Button>
          <Button
            size="lg"
            onClick={submit}
            isLoading={isSubmitting}
            isDisabled={invalid || isSubmitting}
          >
            {t`Report`}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// Match the shared @carbon/react Input styling (border, shadow, focus ring).
const inputClass =
  "min-w-0 rounded-lg border border-input bg-background shadow-xs px-3 py-2 text-lg tabular-nums outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

function ReasonField({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        value={value === 0 ? "" : value}
        placeholder="0"
        onChange={(e) => onChange(Number.parseInt(e.target.value, 10) || 0)}
        className={cn(inputClass, "w-full")}
      />
    </label>
  );
}

function InfoRow({
  label,
  value
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">
        {value === null || value === undefined || value === "" ? "—" : value}
      </span>
    </div>
  );
}

// Loads the set of employee ids assigned to a process. Empty while loading or
// when nobody is assigned — callers fall back to the full people list.
function useEmployeesByProcess(processId?: string | null) {
  const fetcher =
    useFetcher<Awaited<ReturnType<typeof getEmployeeProcessesByProcess>>>();

  useEffect(() => {
    if (processId) {
      fetcher.load(path.to.api.employeesByProcess(processId));
    }
  }, [processId, fetcher.load]);

  const ids = useMemo(
    () =>
      new Set(
        (fetcher.data?.data ?? [])
          .map((row) => row.employeeId)
          .filter((id): id is string => Boolean(id))
      ),
    [fetcher.data]
  );

  // Loading until the first response arrives, so the caller can avoid flashing
  // the full employee list before the assignments are known.
  const isLoading = Boolean(processId) && fetcher.data === undefined;

  return { ids, isLoading };
}
