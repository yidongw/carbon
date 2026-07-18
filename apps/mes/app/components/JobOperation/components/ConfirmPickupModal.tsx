import {
  Button,
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
import { useEffect, useRef } from "react";
import { useFetcher } from "react-router";
import EmployeeAvatar from "~/components/EmployeeAvatar";
import type { OperationWithDetails } from "~/services/types";
import { path } from "~/utils/path";

/**
 * Confirm picking up (or taking over) a scanned bundle's operation. Assigns it
 * to the current worker.
 */
export function ConfirmPickupModal({
  operation,
  assignee,
  currentUserId,
  onClose
}: {
  operation: OperationWithDetails;
  assignee: string | null;
  currentUserId: string;
  onClose: () => void;
}) {
  const { t } = useLingui();
  const fetcher = useFetcher<{ success: boolean }>();
  const submitted = useRef(false);
  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (submitted.current && fetcher.state === "idle") onClose();
  }, [fetcher.state, onClose]);

  const isTakeover = Boolean(assignee) && assignee !== currentUserId;

  const submit = () => {
    submitted.current = true;
    fetcher.submit(
      { jobOperationId: operation.id },
      { method: "post", action: path.to.pickupOperation }
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
            {isTakeover
              ? t`Take over ${operation.itemReadableId}`
              : t`Pick up ${operation.itemReadableId}`}
          </ModalTitle>
          <ModalDescription>{operation.description}</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-2 rounded-lg border border-border p-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">{t`Quantity`}</span>
              <span className="font-medium">{operation.operationQuantity}</span>
            </div>
            {isTakeover && assignee ? (
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">{t`Currently`}</span>
                <EmployeeAvatar employeeId={assignee} />
              </div>
            ) : null}
          </div>
          {isTakeover ? (
            <VStack spacing={0} className="mt-3">
              <span className="text-sm text-muted-foreground">
                {t`This process is assigned to someone else. Taking over stops their running clock.`}
              </span>
            </VStack>
          ) : null}
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" size="lg" onClick={onClose}>
            {t`Cancel`}
          </Button>
          <Button
            size="lg"
            onClick={submit}
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
          >
            {isTakeover ? t`Take over` : t`Pick up`}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
