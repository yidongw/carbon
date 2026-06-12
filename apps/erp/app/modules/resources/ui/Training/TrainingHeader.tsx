import {
  Copy,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconButton,
  useDisclosure,
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import {
  LuEllipsisVertical,
  LuPanelLeft,
  LuPanelRight,
  LuTrash
} from "react-icons/lu";
import { createPortal } from "react-dom";
import { useParams } from "react-router";
import {
  DetailTopbarContent,
  DetailTopbarId,
  usePanels,
  useTopbarLeft
} from "~/components/Layout";
import ConfirmDelete from "~/components/Modals/ConfirmDelete";
import { usePermissions, useRouteData } from "~/hooks";
import type { Training } from "~/modules/resources";
import { path } from "~/utils/path";
import TrainingStatus from "./TrainingStatus";

function TrainingTopbarLeft({ id }: { id: string }) {
  const { t } = useLingui();
  const permissions = usePermissions();
  const deleteDisclosure = useDisclosure();

  const routeData = useRouteData<{
    training: Training;
  }>(path.to.training(id));

  return (
    <>
      <DetailTopbarContent>
        <DetailTopbarId to={path.to.training(id)}>
          {routeData?.training?.name}
        </DetailTopbarId>
        {/* @ts-expect-error TS2322 */}
        <TrainingStatus iconOnly status={routeData?.training?.status} />
        <Copy text={routeData?.training?.name ?? ""} />
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
                !permissions.can("delete", "resources") ||
                !permissions.is("employee")
              }
              destructive
              onClick={deleteDisclosure.onOpen}
            >
              <DropdownMenuIcon icon={<LuTrash />} />
              <Trans>Delete Training</Trans>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </DetailTopbarContent>
      {deleteDisclosure.isOpen && (
        <ConfirmDelete
          action={path.to.deleteTraining(id)}
          isOpen={deleteDisclosure.isOpen}
          name={routeData?.training?.name ?? "training"}
          text={t`Are you sure you want to delete ${routeData?.training?.name}? This cannot be undone.`}
          onCancel={() => {
            deleteDisclosure.onClose();
          }}
          onSubmit={() => {
            deleteDisclosure.onClose();
          }}
        />
      )}
    </>
  );
}

const TrainingHeader = () => {
  const { id } = useParams();
  if (!id) throw new Error("id not found");

  const { leftSlotEl } = useTopbarLeft();
  const { t } = useLingui();
  const { hasExplorer, toggleExplorer, toggleProperties } = usePanels();

  return (
    <>
      {leftSlotEl && createPortal(<TrainingTopbarLeft id={id} />, leftSlotEl)}
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

export default TrainingHeader;
