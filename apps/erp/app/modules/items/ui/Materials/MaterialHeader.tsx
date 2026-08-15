import {
  Copy,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  IconButton,
  useDisclosure
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useMemo } from "react";
import { createPortal } from "react-dom";
import {
  LuEllipsisVertical,
  LuPanelLeft,
  LuPanelRight,
  LuTrash
} from "react-icons/lu";
import { useParams } from "react-router";
import { useAuditLog } from "~/components/AuditLog";
import {
  DetailsTopbar,
  DetailTopbarContent,
  DetailTopbarIdSelector,
  type SiblingOption,
  usePanels,
  useTopbarLeft
} from "~/components/Layout";
import ConfirmDelete from "~/components/Modals/ConfirmDelete";
import { usePermissions, useRouteData, useUser } from "~/hooks";
import { useMaterials } from "~/stores";
import { path } from "~/utils/path";
import type { Material } from "../../types";
import { useMaterialNavigation } from "./useMaterialNavigation";

function MaterialTopbarLeft({ itemId }: { itemId: string }) {
  const { t } = useLingui();
  const permissions = usePermissions();
  const { company } = useUser();
  const deleteModal = useDisclosure();
  const { trigger: auditLogTrigger, drawer: auditLogDrawer } = useAuditLog({
    entityType: "item",
    entityId: itemId,
    companyId: company.id,
    variant: "dropdown"
  });
  const routeData = useRouteData<{ materialSummary: Material }>(
    path.to.material(itemId)
  );
  const readableId = routeData?.materialSummary?.readableIdWithRevision ?? "";

  // Sibling materials come from the shared items store (hydrated globally), so
  // the selector opens instantly without a per-open fetch.
  const materials = useMaterials();
  const siblingOptions = useMemo<SiblingOption[]>(
    () =>
      materials.map((material) => ({
        value: material.id,
        label: material.readableIdWithRevision,
        helper: material.name,
        to: path.to.materialDetails(material.id)
      })),
    [materials]
  );

  return (
    <>
      <DetailTopbarContent>
        <DetailTopbarIdSelector
          readableId={readableId}
          activeId={itemId}
          options={siblingOptions}
          entityLabel={t`material`}
        />
        <Copy text={readableId} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton
              aria-label={t`More options`}
              icon={<LuEllipsisVertical />}
              size="sm"
              variant="secondary"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {auditLogTrigger}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={
                !permissions.can("delete", "parts") ||
                !permissions.is("employee")
              }
              destructive
              onClick={deleteModal.onOpen}
            >
              <DropdownMenuIcon icon={<LuTrash />} />
              <Trans>Delete Material</Trans>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </DetailTopbarContent>
      {auditLogDrawer}
      {deleteModal.isOpen && (
        <ConfirmDelete
          action={path.to.deleteItem(itemId)}
          isOpen={deleteModal.isOpen}
          name={readableId}
          text={t`Are you sure you want to delete ${readableId}? This cannot be undone.`}
          onCancel={deleteModal.onClose}
          onSubmit={deleteModal.onClose}
        />
      )}
    </>
  );
}

const MaterialHeader = () => {
  const { t } = useLingui();
  const links = useMaterialNavigation();
  const { itemId } = useParams();
  if (!itemId) throw new Error("itemId not found");

  const { leftSlotEl } = useTopbarLeft();
  const { hasExplorer, toggleExplorer, toggleProperties } = usePanels();

  return (
    <>
      {leftSlotEl &&
        createPortal(<MaterialTopbarLeft itemId={itemId} />, leftSlotEl)}
      <div className="flex-shrink-0 h-[50px] flex items-center gap-1 px-2 bg-card border-b border-border dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]">
        {hasExplorer && (
          <IconButton
            aria-label={t`Toggle Explorer`}
            icon={<LuPanelLeft />}
            onClick={toggleExplorer}
            variant="ghost"
          />
        )}
        <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide flex items-center">
          <DetailsTopbar links={links} />
        </div>
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

export default MaterialHeader;
