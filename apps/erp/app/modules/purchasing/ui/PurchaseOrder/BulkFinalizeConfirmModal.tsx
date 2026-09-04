import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  Spinner,
  toast
} from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import { useEffect, useRef } from "react";
import { LuSettings2, LuTriangleAlert } from "react-icons/lu";
import { useFetcher, useNavigate } from "react-router";
import { useCurrencyFormatter } from "~/hooks";
import type { action as bulkFinalizeAction } from "~/routes/x+/purchase-order+/bulk-finalize";
import { path } from "~/utils/path";

type Props = {
  ids: string[];
  isOpen: boolean;
  onClose: () => void;
};

const REASON_LABEL: Record<string, string> = {
  approval: "超出免审额度 · 需审批",
  status: "状态不可确认",
  supplier: "供应商未批准"
};

export default function BulkFinalizeConfirmModal({
  ids,
  isOpen,
  onClose
}: Props) {
  const navigate = useNavigate();
  const currencyFormatter = useCurrencyFormatter();
  const previewFetcher = useFetcher<typeof bulkFinalizeAction>();
  const commitFetcher = useFetcher<typeof bulkFinalizeAction>();
  const committedRef = useRef(false);

  // Kick off the preview partition whenever the modal opens.
  // biome-ignore lint/correctness/useExhaustiveDependencies: run once per open
  useEffect(() => {
    if (!isOpen || ids.length === 0) return;
    const formData = new FormData();
    formData.append("mode", "preview");
    ids.forEach((id) => formData.append("ids", id));
    previewFetcher.submit(formData, {
      method: "post",
      action: path.to.bulkFinalizePurchaseOrder
    });
  }, [isOpen]);

  const previewData = previewFetcher.data;
  const preview =
    previewData && "mode" in previewData && previewData.mode === "preview"
      ? previewData
      : undefined;
  const eligible = preview?.eligible ?? [];
  const ineligible = preview?.ineligible ?? [];
  const isLoadingPreview = previewFetcher.state !== "idle" || !preview;
  const isCommitting = commitFetcher.state !== "idle";
  const hasApprovalBlocked = ineligible.some((o) => o.reason === "approval");

  // Report the commit outcome and close.
  useEffect(() => {
    const data = commitFetcher.data;
    if (
      commitFetcher.state === "idle" &&
      data &&
      "mode" in data &&
      data.mode === "commit" &&
      !committedRef.current
    ) {
      committedRef.current = true;
      const parts = [`已确认 ${data.confirmed} 张`];
      if (data.failed.length) parts.push(`失败 ${data.failed.length} 张`);
      if (data.skipped) parts.push(`需审批 ${data.skipped} 张`);
      const message = parts.join(" · ");
      if (data.confirmed > 0 && data.failed.length === 0) {
        toast.success(message);
      } else if (data.confirmed === 0) {
        toast.error(message);
      } else {
        toast.success(message);
      }
      onClose();
    }
  }, [commitFetcher.state, commitFetcher.data, onClose]);

  const onConfirm = () => {
    const formData = new FormData();
    formData.append("mode", "commit");
    ids.forEach((id) => formData.append("ids", id));
    commitFetcher.submit(formData, {
      method: "post",
      action: path.to.bulkFinalizePurchaseOrder
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
            <Trans>Confirm & Receive Purchase Orders</Trans>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          {isLoadingPreview ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="h-5 w-5" />
            </div>
          ) : (
            <div className="flex flex-col gap-4 text-sm">
              <p className="text-muted-foreground">
                将对{" "}
                <span className="font-medium text-foreground">
                  {eligible.length}
                </span>{" "}
                张免审采购单执行：定稿 → 自动收货 →
                推进到待开票（此操作会写入库存与财务台账，不可撤销）。
              </p>

              {ineligible.length > 0 && (
                <div className="flex flex-col gap-2 rounded-md border border-border p-3">
                  <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <LuTriangleAlert className="h-4 w-4 text-amber-500" />
                    以下 {ineligible.length} 张不会被确认
                  </p>
                  <ul className="flex flex-col gap-1">
                    {ineligible.map((o) => (
                      <li
                        key={o.id}
                        className="flex items-center justify-between gap-2"
                      >
                        <span className="font-mono">{o.purchaseOrderId}</span>
                        <span className="text-muted-foreground">
                          {currencyFormatter.format(o.orderTotal)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {REASON_LABEL[o.reason] ?? o.reason}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {eligible.length === 0 && (
                <p className="text-muted-foreground">
                  没有可一键确认的采购单。
                </p>
              )}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={onClose}>
            <Trans>Cancel</Trans>
          </Button>
          {hasApprovalBlocked && (
            <Button
              variant="secondary"
              leftIcon={<LuSettings2 />}
              onClick={() => navigate(path.to.approvalRules)}
            >
              去修改免审额度
            </Button>
          )}
          <Button
            onClick={onConfirm}
            isDisabled={
              isLoadingPreview || isCommitting || eligible.length === 0
            }
            isLoading={isCommitting}
          >
            确认 {eligible.length} 张
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
