import {
  Copy,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  HStack,
  IconButton,
  useDisclosure
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect } from "react";
import { LuArrowLeft, LuEllipsisVertical, LuTrash } from "react-icons/lu";
import { Link, useNavigate, useParams } from "react-router";
import { useAuditLog } from "~/components/AuditLog";
import { DetailsTopbar, useTopbarLeft } from "~/components/Layout";
import ConfirmDelete from "~/components/Modals/ConfirmDelete";
import { usePermissions, useRouteData, useUser } from "~/hooks";
import { path } from "~/utils/path";
import type { Consumable } from "../../types";
import { useConsumableNavigation } from "./useConsumableNavigation";

function ConsumableTopbarLeft({ itemId }: { itemId: string }) {
  const { t } = useLingui();
  const navigate = useNavigate();
  const permissions = usePermissions();
  const { company } = useUser();
  const deleteModal = useDisclosure();
  const { trigger: auditLogTrigger, drawer: auditLogDrawer } = useAuditLog({
    entityType: "item",
    entityId: itemId,
    companyId: company.id,
    variant: "dropdown"
  });
  const routeData = useRouteData<{ consumableSummary: Consumable }>(
    path.to.consumable(itemId)
  );
  const readableId = routeData?.consumableSummary?.readableIdWithRevision ?? "";

  return (
    <>
      <HStack className="items-center -ml-2" spacing={1}>
        <IconButton
          aria-label={t`Back`}
          icon={<LuArrowLeft />}
          variant="ghost"
          onClick={() => navigate(path.to.consumables)}
        />
        <Link to={path.to.consumableDetails(itemId)}>
          <span className="font-semibold text-sm">{readableId}</span>
        </Link>
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
              <Trans>Delete Consumable</Trans>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </HStack>
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

const ConsumableHeader = () => {
  const links = useConsumableNavigation();
  const { itemId } = useParams();
  if (!itemId) throw new Error("itemId not found");

  const { setLeftContent, clearLeftContent } = useTopbarLeft();

  useEffect(() => {
    setLeftContent(<ConsumableTopbarLeft itemId={itemId} />);
    return clearLeftContent;
  }, [itemId, setLeftContent, clearLeftContent]);

  return (
    <div className="flex-shrink-0 h-[50px] px-4 py-2 bg-card border-b border-border overflow-x-auto overflow-y-hidden scrollbar-hide flex items-center dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]">
      <DetailsTopbar links={links} />
    </div>
  );
};

export default ConsumableHeader;
