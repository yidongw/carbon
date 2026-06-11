import {
  Button,
  Copy,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuTrigger,
  HStack,
  IconButton,
  useDisclosure,
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import {
  LuArrowLeft,
  LuChevronDown,
  LuCircleCheck,
  LuCirclePlay,
  LuEllipsisVertical,
  LuExternalLink,
  LuFile,
  LuLoaderCircle,
  LuTrash
} from "react-icons/lu";
import { createPortal } from "react-dom";
import { Link, useFetcher, useNavigate, useParams } from "react-router";
import { useTopbarLeft } from "~/components/Layout";
import ConfirmDelete from "~/components/Modals/ConfirmDelete";
import { usePermissions, useRouteData } from "~/hooks";
import { useSuppliers } from "~/stores/suppliers";
import { path } from "~/utils/path";
import { isIssueLocked } from "../../quality.models";
import type { Issue } from "../../types";
import IssueStatus from "./IssueStatus";

function IssueTopbarLeft({ id }: { id: string }) {
  const { t } = useLingui();
  const navigate = useNavigate();
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
      <HStack className="items-center -ml-2" spacing={1}>
        <IconButton
          aria-label={t`Back`}
          icon={<LuArrowLeft />}
          variant="ghost"
          onClick={() => navigate(path.to.issues)}
        />
        <Link to={path.to.issueDetails(id)}>
          <span className="font-semibold text-sm">{routeData?.nonConformance?.nonConformanceId}</span>
        </Link>
        <IssueStatus status={status} />
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
      </HStack>
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

  return (
    <>
      {leftSlotEl && createPortal(<IssueTopbarLeft id={id} />, leftSlotEl)}
    </>
  );
};

export default IssueHeader;
