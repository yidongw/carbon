import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  Textarea,
  toast,
  VStack
} from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import type { ApprovalDecision } from "~/modules/shared/types";
import type { action as bulkApproveAction } from "~/routes/x+/purchase-order+/bulk-approve";
import { path } from "~/utils/path";

type Props = {
  ids: string[];
  decision: ApprovalDecision;
  isOpen: boolean;
  onClose: () => void;
};

export default function BulkApprovalConfirmModal({
  ids,
  decision,
  isOpen,
  onClose
}: Props) {
  const fetcher = useFetcher<typeof bulkApproveAction>();
  const [notes, setNotes] = useState("");
  const reportedRef = useRef(false);
  const isApproving = decision === "Approved";
  const isSubmitting = fetcher.state !== "idle";

  // Report the outcome once the action settles, then close.
  useEffect(() => {
    const data = fetcher.data;
    if (
      fetcher.state === "idle" &&
      data &&
      "approved" in data &&
      !reportedRef.current
    ) {
      reportedRef.current = true;
      const approved = data.approved ?? 0;
      const failedCount = data.failed?.length ?? 0;
      const verb = isApproving ? "批准" : "拒绝";
      const parts = [`已${verb} ${approved} 张`];
      if (failedCount) parts.push(`失败 ${failedCount} 张`);
      const message = parts.join(" · ");
      if (approved > 0 && failedCount === 0) {
        toast.success(message);
      } else if (approved === 0) {
        toast.error(message);
      } else {
        toast.success(message);
      }
      onClose();
    }
  }, [fetcher.state, fetcher.data, isApproving, onClose]);

  const onConfirm = () => {
    const formData = new FormData();
    formData.append("decision", decision);
    if (notes.trim()) formData.append("notes", notes.trim());
    ids.forEach((id) => {
      formData.append("ids", id);
    });
    fetcher.submit(formData, {
      method: "post",
      action: path.to.bulkApprovePurchaseOrder
    });
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {isApproving ? (
              <Trans>Approve Purchase Orders</Trans>
            ) : (
              <Trans>Reject Purchase Orders</Trans>
            )}
          </ModalTitle>
          <ModalDescription>
            {isApproving
              ? `将批准 ${ids.length} 张采购单的审批请求。`
              : `将拒绝 ${ids.length} 张采购单的审批请求，单据会退回被拒状态。`}
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <VStack spacing={2}>
            <label className="text-sm text-muted-foreground" htmlFor="notes">
              {isApproving ? "备注（可选）" : "拒绝原因（可选）"}
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isApproving ? "备注" : "填写拒绝原因"}
              rows={3}
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={onClose}>
            <Trans>Cancel</Trans>
          </Button>
          <Button
            variant={isApproving ? "primary" : "destructive"}
            onClick={onConfirm}
            isDisabled={isSubmitting || ids.length === 0}
            isLoading={isSubmitting}
          >
            {isApproving ? `批准 ${ids.length} 张` : `拒绝 ${ids.length} 张`}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
