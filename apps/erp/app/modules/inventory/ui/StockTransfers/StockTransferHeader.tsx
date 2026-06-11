import type { Result } from "@carbon/auth";
import {
  Copy,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  IconButton,
  useDisclosure,
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import {
  LuBarcode,
  LuCircleCheck,
  LuCirclePlay,
  LuEllipsisVertical,
  LuLoaderCircle,
  LuPanelLeft,
  LuPanelRight,
  LuTrash
} from "react-icons/lu";
import { createPortal } from "react-dom";
import { useFetcher, useParams } from "react-router";
import Assignee, { useOptimisticAssignment } from "~/components/Assignee";
import { useAuditLog } from "~/components/AuditLog";
import {
  DetailTopbarContent,
  DetailTopbarPlainId,
  usePanels,
  useTopbarLeft
} from "~/components/Layout";
import ConfirmDelete from "~/components/Modals/ConfirmDelete";
import { usePermissions, useRouteData, useUser } from "~/hooks";
import { useItemRuleViolations } from "~/hooks/useItemRuleViolations";
import {
  isStockTransferLocked,
  type StockTransfer,
  type StockTransferLine
} from "~/modules/inventory";
import { path } from "~/utils/path";
import StockTransferCompleteModal from "./StockTransferCompleteModal";
import StockTransferStatus from "./StockTransferStatus";

function StockTransferTopbarLeft({ id }: { id: string }) {
  const routeData = useRouteData<{
    stockTransfer: StockTransfer;
    stockTransferLines: StockTransferLine[];
  }>(path.to.stockTransfer(id));

  if (!routeData?.stockTransfer)
    throw new Error("Failed to load stockTransfer");
  const status = routeData.stockTransfer.status;

  const { t } = useLingui();
  const { company } = useUser();
  const permissions = usePermissions();
  const postModal = useDisclosure();
  const deleteModal = useDisclosure();
  const statusFetcher = useFetcher<Result>();
  // Item rules fire on Release + Complete (the "go" transitions). Each gets
  // its own fetcher so Release's loading state doesn't disable Complete and
  // vice versa, and violations surface via a single shared modal.
  const releaseRules = useItemRuleViolations({
    action: path.to.stockTransferStatus(id)
  });
  const releaseFetcher = releaseRules.fetcher;
  const completeRules = useItemRuleViolations({
    action: path.to.stockTransferStatus(id)
  });
  const completeFetcher = completeRules.fetcher;
  const { trigger: auditLogTrigger, drawer: auditLogDrawer } = useAuditLog({
    entityType: "stockTransfer",
    entityId: id,
    companyId: company.id,
    variant: "dropdown"
  });

  const canComplete =
    routeData.stockTransferLines.length > 0 &&
    routeData.stockTransferLines.some(
      (line) => (line.pickedQuantity ?? 0) !== 0
    ) &&
    ["Released", "In Progress"].includes(status);

  const isCompleted = status === "Completed";
  const isLocked = isStockTransferLocked(status);

  const hasPickedItems = routeData?.stockTransferLines.some(
    (line) => line.pickedQuantity && line.pickedQuantity > 0
  );

  return (
    <>
      <DetailTopbarContent>
        <DetailTopbarPlainId>
          {routeData?.stockTransfer?.stockTransferId}
        </DetailTopbarPlainId>
        <StockTransferStatus iconOnly status={routeData?.stockTransfer?.status} />
        <Copy text={routeData?.stockTransfer?.stockTransferId ?? ""} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton
              aria-label={t`More options`}
              icon={<LuEllipsisVertical />}
              variant="secondary"
              size="sm"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {auditLogTrigger}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a
                target="_blank"
                href={path.to.file.stockTransfer(id)}
                rel="noreferrer"
              >
                <DropdownMenuIcon icon={<LuBarcode />} />
                <Trans>Pick List</Trans>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={
                status !== "Draft" ||
                releaseFetcher.state !== "idle" ||
                !permissions.can("update", "inventory")
              }
              onClick={() => {
                const fd = new FormData();
                fd.set("status", "Released");
                releaseRules.submit(fd);
              }}
            >
              <DropdownMenuIcon icon={<LuCirclePlay />} />
              <Trans>Release</Trans>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={
                !canComplete ||
                isCompleted ||
                !permissions.is("employee") ||
                completeFetcher.state !== "idle"
              }
              onClick={() => {
                const fd = new FormData();
                fd.set("status", "Completed");
                completeRules.submit(fd);
              }}
            >
              <DropdownMenuIcon icon={<LuCircleCheck />} />
              <Trans>Complete</Trans>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={
                ["Draft"].includes(
                  routeData?.stockTransfer?.status ?? ""
                ) ||
                statusFetcher.state !== "idle" ||
                !permissions.can("update", "purchasing")
              }
              onClick={() => {
                statusFetcher.submit(
                  { status: "Draft" },
                  {
                    method: "post",
                    action: path.to.stockTransferStatus(id)
                  }
                );
              }}
            >
              <DropdownMenuIcon icon={<LuLoaderCircle />} />
              <Trans>Reopen</Trans>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={
                !permissions.can("delete", "inventory") ||
                !permissions.is("employee") ||
                !["Released", "Draft"].includes(status) ||
                hasPickedItems ||
                isLocked
              }
              destructive
              onClick={deleteModal.onOpen}
            >
              <DropdownMenuIcon icon={<LuTrash />} />
              <Trans>Delete Stock Transfer</Trans>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <releaseRules.ViolationModal />
        <completeRules.ViolationModal />
      </DetailTopbarContent>

      {postModal.isOpen && (
        <StockTransferCompleteModal onClose={postModal.onClose} />
      )}
      {deleteModal.isOpen && (
        <ConfirmDelete
          action={path.to.deleteStockTransfer(id)}
          isOpen={deleteModal.isOpen}
          name={routeData?.stockTransfer?.stockTransferId ?? "stockTransfer"}
          text={t`Are you sure you want to delete ${routeData?.stockTransfer?.stockTransferId}? This cannot be undone.`}
          onCancel={() => {
            deleteModal.onClose();
          }}
          onSubmit={() => {
            deleteModal.onClose();
          }}
        />
      )}
      {auditLogDrawer}
    </>
  );
}

const StockTransferHeader = () => {
  const { id } = useParams();
  if (!id) throw new Error("id not found");

  const { leftSlotEl } = useTopbarLeft();
  const { t } = useLingui();
  const permissions = usePermissions();
  const { hasExplorer, toggleExplorer, toggleProperties } = usePanels();
  const routeData = useRouteData<{
    stockTransfer: StockTransfer;
  }>(path.to.stockTransfer(id));
  const optimisticAssignment = useOptimisticAssignment({
    id,
    table: "stockTransfer"
  });
  const assignee =
    optimisticAssignment !== undefined
      ? optimisticAssignment
      : routeData?.stockTransfer?.assignee;

  return (
    <>
      {leftSlotEl && createPortal(<StockTransferTopbarLeft id={id} />, leftSlotEl)}
      <div className="flex-shrink-0 h-[50px] flex items-center gap-1 px-2 bg-card border-b border-border dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]">
        {hasExplorer && (
          <IconButton
            aria-label={t`Toggle Explorer`}
            icon={<LuPanelLeft />}
            onClick={toggleExplorer}
            variant="ghost"
          />
        )}
        <Assignee
          size="sm"
          id={id}
          value={assignee ?? ""}
          table="stockTransfer"
          isReadOnly={!permissions.can("update", "inventory")}
        />
        <div className="flex-1" />
        <IconButton
          aria-label={t`Toggle Properties`}
          icon={<LuPanelRight />}
          onClick={toggleProperties}
          variant="ghost"
        />
      </div>
    </>
  );
};

export default StockTransferHeader;
