import {
  Copy,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconButton,
  useDisclosure
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { LuEllipsisVertical, LuPanelLeft, LuPanelRight, LuTrash } from "react-icons/lu";
import { createPortal } from "react-dom";
import {
  DetailTopbarContent,
  DetailTopbarPlainId,
  usePanels,
  useTopbarLeft
} from "~/components/Layout";
import ConfirmDelete from "~/components/Modals/ConfirmDelete";
import { usePermissions } from "~/hooks";
import { path } from "~/utils/path";

type TemplateRow = {
  id: string;
  name: string;
};

function TemplateTopbarLeft({ template }: { template: TemplateRow }) {
  const { t } = useLingui();
  const permissions = usePermissions();
  const deleteModal = useDisclosure();

  return (
    <>
      <DetailTopbarContent>
        <DetailTopbarPlainId>{template.name}</DetailTopbarPlainId>
        <Copy text={template.name ?? ""} />
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
            <DropdownMenuItem
              disabled={
                !permissions.can("delete", "parts") ||
                !permissions.is("employee")
              }
              destructive
              onClick={deleteModal.onOpen}
            >
              <DropdownMenuIcon icon={<LuTrash />} />
              <Trans>Delete Template</Trans>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </DetailTopbarContent>
      {deleteModal.isOpen && (
        <ConfirmDelete
          action={path.to.deleteTemplate(template.id)}
          isOpen={deleteModal.isOpen}
          name={template.name}
          text={t`Are you sure you want to delete ${template.name}? This cannot be undone.`}
          onCancel={deleteModal.onClose}
          onSubmit={deleteModal.onClose}
        />
      )}
    </>
  );
}

const TemplateHeader = ({ template }: { template: TemplateRow }) => {
  const { t } = useLingui();
  const { leftSlotEl } = useTopbarLeft();
  const { hasExplorer, toggleExplorer, toggleProperties } = usePanels();

  return (
    <>
      {leftSlotEl &&
        createPortal(<TemplateTopbarLeft template={template} />, leftSlotEl)}
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

export default TemplateHeader;
