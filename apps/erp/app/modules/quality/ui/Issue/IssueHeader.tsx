import {
  Button,
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
  LuChevronDown,
  LuCircleCheck,
  LuCirclePlay,
  LuEllipsisVertical,
  LuExternalLink,
  LuFile,
  LuLoaderCircle,
  LuPanelLeft,
  LuPanelRight,
  LuTrash
} from "react-icons/lu";
import { createPortal } from "react-dom";
import { Link, useFetcher, useParams } from "react-router";
import {
  DetailTopbarContent,
  DetailTopbarId,
  usePanels,
  useTopbarLeft
} from "~/components/Layout";
import ConfirmDelete from "~/components/Modals/ConfirmDelete";
import { usePermissions, useRouteData } from "~/hooks";
import { useSuppliers } from "~/stores/suppliers";
import { path } from "~/utils/path";
import { isIssueLocked } from "../../quality.models";
import type { Issue } from "../../types";
import IssueStatus from "./IssueStatus";

function IssueTopbarLeft({ id }: { id: string }) {
  const { t } = useLingui();
  const permissions = usePermissions();
  const statusFetcher = useFetcher<{}>();
  const [suppliers] = useSuppliers();
  const deleteIssueModal = useDisclosure();

  const routeData = useRouteData<{
    nonConformance: Issue;
    suppliers: { supplierId: string; externalLinkId: string | null }[];
  }>(path.to.issue(id));

  const status = routeData?.nonConformance?.status;

  return (
    <>
      <DetailTopbarContent>
        <DetailTopbarId to={path.to.issueDetails(id)}>
          {routeData?.nonConformance?.nonConformanceId}
        </DetailTopbarId>
        <IssueStatus iconOnly status={status} />
        <Copy text={routeData?.nonConformance?.nonConformanceId ?? ""} />
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
                !["In Progress", "Closed"].includes(status ?? "") ||
                statusFetcher.state !== "idle" ||
                !permissions.can("update", "quality")
              }
              onClick={() => {
                statusFetcher.submit(
                  { status: "Registered" },
                  { method: "post", action: path.to.issueStatus(id) }
                );
              }}
            >
              <DropdownMenuIcon icon={<LuLoaderCircle />} />
              <Trans>Reopen</Trans>
            </DropdownMenuItem>
            <DropdownMenuItem
              destructive
              disabled={
                !permissions.can("delete", "quality") ||
                !permissions.is("employee") ||
                isIssueLocked(status)
              }
              onClick={deleteIssueModal.onOpen}
            >
              <DropdownMenuIcon icon={<LuTrash />} />
              <Trans>Delete Issue</Trans>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              leftIcon={<LuFile />}
              variant="secondary"
              rightIcon={<LuChevronDown />}
            >
              <Trans>Reports</Trans>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {routeData?.suppliers?.map((s) => {
              if (!s.externalLinkId) return null;
              const supplier = suppliers.find(
                (sup) => sup.id === s.supplierId
              );
              return (
                <DropdownMenuItem key={s.supplierId} asChild>
                  <Link to={path.to.externalScar(s.externalLinkId)}>
                    <DropdownMenuIcon icon={<LuExternalLink />} />
                    {supplier?.name} <Trans>SCAR</Trans>
                  </Link>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuItem asChild>
              <a
                target="_blank"
                href={path.to.file.nonConformance(id)}
                rel="noreferrer"
              >
                <DropdownMenuIcon icon={<LuFile />} />
                <Trans>Report</Trans>
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <statusFetcher.Form method="post" action={path.to.issueStatus(id)}>
          <input type="hidden" name="status" value="In Progress" />
          <Button
            type="submit"
            leftIcon={<LuCirclePlay />}
            variant={status === "Registered" ? "primary" : "secondary"}
            isDisabled={
              status !== "Registered" ||
              statusFetcher.state !== "idle" ||
              !permissions.can("update", "quality")
            }
            isLoading={
              statusFetcher.state !== "idle" &&
              statusFetcher.formData?.get("status") === "In Progress"
            }
          >
            <Trans>Start</Trans>
          </Button>
        </statusFetcher.Form>

        <statusFetcher.Form method="post" action={path.to.closeIssue(id)}>
          <Button
            type="submit"
            leftIcon={<LuCircleCheck />}
            variant={status === "In Progress" ? "primary" : "secondary"}
            isDisabled={
              status !== "In Progress" ||
              statusFetcher.state !== "idle" ||
              !permissions.can("update", "quality")
            }
            isLoading={
              statusFetcher.state !== "idle" &&
              statusFetcher.formAction === path.to.closeIssue(id)
            }
          >
            <Trans>Complete</Trans>
          </Button>
        </statusFetcher.Form>
      </DetailTopbarContent>
      {deleteIssueModal.isOpen && (
        <ConfirmDelete
          action={path.to.deleteIssue(id)}
          isOpen={deleteIssueModal.isOpen}
          name={routeData?.nonConformance?.nonConformanceId!}
          text={t`Are you sure you want to delete ${routeData?.nonConformance
            ?.nonConformanceId!}? This cannot be undone.`}
          onCancel={() => {
            deleteIssueModal.onClose();
          }}
          onSubmit={() => {
            deleteIssueModal.onClose();
          }}
        />
      )}
    </>
  );
}

const IssueHeader = () => {
  const { id } = useParams();
  if (!id) throw new Error("id not found");

  const { leftSlotEl } = useTopbarLeft();
  const { t } = useLingui();
  const { hasExplorer, toggleExplorer, toggleProperties } = usePanels();

  return (
    <>
      {leftSlotEl && createPortal(<IssueTopbarLeft id={id} />, leftSlotEl)}
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

export default IssueHeader;
