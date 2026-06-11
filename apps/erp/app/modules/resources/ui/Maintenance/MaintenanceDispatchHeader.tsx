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
import {
  DetailTopbarContent,
  DetailTopbarId,
  usePanels,
  useTopbarLeft
} from "~/components/Layout";
import ConfirmDelete from "~/components/Modals/ConfirmDelete";
import { usePermissions, useRouteData } from "~/hooks";
import { path } from "~/utils/path";
import { isMaintenanceDispatchLocked } from "../../resources.models";
import type { MaintenanceDispatchDetail } from "../../types";
import MaintenanceStatus from "./MaintenanceStatus";

function MaintenanceDispatchTopbarLeft({ dispatchId }: { dispatchId: string }) {
  const { t } = useLingui();
  const permissions = usePermissions();
  const statusFetcher = useFetcher<{}>();
  const deleteModal = useDisclosure();

  const routeData = useRouteData<{
    dispatch: MaintenanceDispatchDetail;
  }>(path.to.maintenanceDispatch(dispatchId));

  const status = routeData?.dispatch?.status;
  const isLocked = isMaintenanceDispatchLocked(status);

  return (
    <>
      <DetailTopbarContent>
        <DetailTopbarId to={path.to.maintenanceDispatch(dispatchId)}>
          {routeData?.dispatch?.maintenanceDispatchId}
        </DetailTopbarId>
        <MaintenanceStatus iconOnly status={status} />
        <Copy text={routeData?.dispatch?.maintenanceDispatchId ?? ""} />
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
            <DropdownMenuItem
              disabled={
                !["Open", "Assigned"].includes(status ?? "") ||
                statusFetcher.state !== "idle" ||
                !permissions.can("update", "resources")
              }
              onClick={() => {
                statusFetcher.submit(
                  { status: "In Progress" },
                  {
                    method: "post",
                    action: path.to.maintenanceDispatchStatus(dispatchId)
                  }
                );
              }}
            >
              <DropdownMenuIcon icon={<LuCirclePlay />} />
              <Trans>Start</Trans>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={
                status !== "In Progress" ||
                statusFetcher.state !== "idle" ||
                !permissions.can("update", "resources")
              }
              onClick={() => {
                statusFetcher.submit(
                  { status: "Completed" },
                  {
                    method: "post",
                    action: path.to.maintenanceDispatchStatus(dispatchId)
                  }
                );
              }}
            >
              <DropdownMenuIcon icon={<LuCircleCheck />} />
              <Trans>Complete</Trans>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={
                !["In Progress", "Completed"].includes(status ?? "") ||
                statusFetcher.state !== "idle" ||
                !permissions.can("update", "resources")
              }
              onClick={() => {
                statusFetcher.submit(
                  { status: "Open" },
                  {
                    method: "post",
                    action: path.to.maintenanceDispatchStatus(dispatchId)
                  }
                );
              }}
            >
              <DropdownMenuIcon icon={<LuLoaderCircle />} />
              <Trans>Reopen</Trans>
            </DropdownMenuItem>
            <DropdownMenuItem
              destructive
              disabled={
                isLocked ||
                !permissions.can("delete", "resources") ||
                !permissions.is("employee")
              }
              onClick={deleteModal.onOpen}
            >
              <DropdownMenuIcon icon={<LuTrash />} />
              <Trans>Delete Dispatch</Trans>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </DetailTopbarContent>
      {deleteModal.isOpen && (
        <ConfirmDelete
          action={path.to.deleteMaintenanceDispatch(dispatchId)}
          isOpen={deleteModal.isOpen}
          name={routeData?.dispatch?.maintenanceDispatchId!}
          text={t`Are you sure you want to delete this maintenance dispatch? This cannot be undone.`}
          onCancel={() => {
            deleteModal.onClose();
          }}
          onSubmit={() => {
            deleteModal.onClose();
          }}
        />
      )}
    </>
  );
}

const MaintenanceDispatchHeader = () => {
  const { dispatchId } = useParams();
  if (!dispatchId) throw new Error("dispatchId not found");

  const { leftSlotEl } = useTopbarLeft();
  const { t } = useLingui();
  const { hasExplorer, toggleExplorer, toggleProperties } = usePanels();

  return (
    <>
      {leftSlotEl && createPortal(<MaintenanceDispatchTopbarLeft dispatchId={dispatchId} />, leftSlotEl)}
      <div className="flex-shrink-0 h-[50px] flex items-center gap-1 px-2 bg-card border-b border-border dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]">
        {hasExplorer && (
          <IconButton
            aria-label={t`Toggle Explorer`}
            icon={<LuPanelLeft />}
            onClick={toggleExplorer}
            variant="ghost"
          />
        )}
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

export default MaintenanceDispatchHeader;
