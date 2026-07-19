import {
  Button,
  cn,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle
} from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { useEffect, useRef, useState } from "react";
import { LuMinus, LuPlus } from "react-icons/lu";
import { useFetcher } from "react-router";
import { path } from "~/utils/path";

/**
 * Manager modal to mark some of an operation's reworked units as fixed (moved
 * back into finished production). Defaults to all rework; can be reduced.
 */
export function MarkReworkFixedModal({
  jobOperationId,
  reworkQuantity,
  onClose
}: {
  jobOperationId: string;
  reworkQuantity: number;
  onClose: () => void;
}) {
  const { t } = useLingui();
  const fetcher = useFetcher<{ success: boolean }>();
  const submitted = useRef(false);
  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (submitted.current && fetcher.state === "idle") onClose();
  }, [fetcher.state, onClose]);

  const [qty, setQty] = useState(reworkQuantity);
  const clamp = (n: number) =>
    Math.max(
      0,
      Math.min(reworkQuantity, Number.isFinite(n) ? Math.floor(n) : 0)
    );

  const submit = () => {
    submitted.current = true;
    fetcher.submit(
      { jobOperationId, quantity: String(qty) },
      { method: "post", action: path.to.reworkToProduction }
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
          <ModalTitle>{t`Mark rework as fixed`}</ModalTitle>
          <ModalDescription>
            {t`Move reworked units back into finished production.`}
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="flex w-full flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium">{t`Fixed`}</span>
              <span className="text-xs text-muted-foreground tabular-nums">
                / {reworkQuantity}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <IconButton
                aria-label={t`Decrease`}
                icon={<LuMinus />}
                variant="secondary"
                size="lg"
                onClick={() => setQty(clamp(qty - 1))}
                isDisabled={qty <= 0}
              />
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={reworkQuantity}
                value={qty}
                onChange={(e) =>
                  setQty(clamp(Number.parseInt(e.target.value, 10)))
                }
                className={cn(
                  "min-w-0 flex-1 rounded-lg border border-input bg-background shadow-xs px-3 py-2 text-center text-2xl font-semibold tabular-nums outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                )}
              />
              <IconButton
                aria-label={t`Increase`}
                icon={<LuPlus />}
                variant="secondary"
                size="lg"
                onClick={() => setQty(clamp(qty + 1))}
                isDisabled={qty >= reworkQuantity}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" size="lg" onClick={onClose}>
            {t`Cancel`}
          </Button>
          <Button
            size="lg"
            onClick={submit}
            isLoading={isSubmitting}
            isDisabled={qty <= 0 || isSubmitting}
          >
            {t`Mark fixed`}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
