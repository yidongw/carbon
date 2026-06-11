import {
  Badge,
  Button,
  Copy,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  HStack,
  IconButton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useDisclosure,
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { PostgrestResponse } from "@supabase/supabase-js";
import { Suspense, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  LuArrowLeft,
  LuCheckCheck,
  LuChevronDown,
  LuCirclePlus,
  LuClipboardCheck,
  LuEllipsisVertical,
  LuGitPullRequestArrow,
  LuPanelLeft,
  LuPanelRight,
  LuTrash,
  LuX
} from "react-icons/lu";
import { Await, useFetcher, useNavigate, useParams } from "react-router";
import { usePanels, useTopbarLeft } from "~/components/Layout";
import ConfirmDelete from "~/components/Modals/ConfirmDelete";
import { usePermissions, useRouteData } from "~/hooks";
import type { ApprovalDecision } from "~/modules/shared/types";
import { path } from "~/utils/path";
import type { QualityDocument } from "../../types";
import QualityDocumentApprovalModal from "./QualityDocumentApprovalModal";
import QualityDocumentForm from "./QualityDocumentForm";
import QualityDocumentStatus from "./QualityDocumentStatus";

function QualityDocumentTopbarLeft({ id }: { id: string }) {
  const navigate = useNavigate();
  const { t } = useLingui();
  const permissions = usePermissions();
  const newVersionDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();
  const statusFetcher = useFetcher<{ error?: { message: string } }>();
  const approvalFetcher = useFetcher<{
    error?: string;
    success?: boolean;
  }>();
  const [approvalDecision, setApprovalDecision] =
    useState<ApprovalDecision | null>(null);

  const routeData = useRouteData<{
    document: QualityDocument;
    versions: PostgrestResponse<QualityDocument>;
    approvalRequest: { id: string } | null;
    canApprove: boolean;
    canReopen: boolean;
    canDelete: boolean;
    isApprovalRequired: boolean;
  }>(path.to.qualityDocument(id));

  const status = routeData?.document?.status ?? null;
  const isDraft = status === "Draft";
  const isArchived = status === "Archived";
  const canActivate = isDraft || isArchived;
  const approvalRequestId = routeData?.approvalRequest?.id;
  const hasApprovalRequest = !!approvalRequestId;
  const canApprove = routeData?.canApprove ?? false;
  const canDelete = routeData?.canDelete ?? true;
  const isApprovalRequired = routeData?.isApprovalRequired ?? false;

  const statusIdle = statusFetcher.state === "idle";
  const submitLoading =
    !statusIdle &&
    statusFetcher.formData?.get("field") === "status" &&
    statusFetcher.formData?.get("value") === "Active";

  let submitButtonLabel: string;
  let submitButtonTooltip: string;
  if (isApprovalRequired) {
    submitButtonLabel = t`Submit for approval`;
    submitButtonTooltip = t`Sends this document for approval before it can go active.`;
  } else if (isArchived) {
    submitButtonLabel = t`Reactivate`;
    submitButtonTooltip = t`Makes this document active again.`;
  } else {
    submitButtonLabel = t`Publish`;
    submitButtonTooltip = t`Makes this document active and visible.`;
  }

  const submitForActivation = () => {
    const formData = new FormData();
    formData.append("ids", id);
    formData.append("field", "status");
    formData.append("value", "Active");
    statusFetcher.submit(formData, {
      method: "post",
      action: path.to.bulkUpdateQualityDocument
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  useEffect(() => {
    newVersionDisclosure.onClose();
  }, [id]);

  return (
    <>
      <HStack className="items-center -ml-2" spacing={1}>
        <IconButton
          aria-label={t`Back`}
          icon={<LuArrowLeft />}
          variant="ghost"
          onClick={() => navigate(path.to.qualityDocuments)}
        />
        <span className="font-semibold text-sm">{routeData?.document?.name}</span>
        <Badge variant="outline">V{routeData?.document?.version}</Badge>
        <QualityDocumentStatus status={routeData?.document?.status} />
        <Copy text={routeData?.document?.name ?? ""} />
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
                !permissions.can("delete", "quality") ||
                !permissions.is("employee") ||
                (canActivate && hasApprovalRequest && !canDelete)
              }
              destructive
              onClick={deleteDisclosure.onOpen}
            >
              <DropdownMenuIcon icon={<LuTrash />} />
              <Trans>Delete Document</Trans>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {canActivate && !hasApprovalRequest && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex">
                <Button
                  leftIcon={
                    isApprovalRequired ? <LuClipboardCheck /> : <LuCheckCheck />
                  }
                  variant="primary"
                  isLoading={submitLoading}
                  isDisabled={
                    !permissions.can("update", "quality") ||
                    !permissions.is("employee") ||
                    !statusIdle
                  }
                  onClick={submitForActivation}
                >
                  {submitButtonLabel}
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>{submitButtonTooltip}</TooltipContent>
          </Tooltip>
        )}
        {canActivate && hasApprovalRequest && (
          <>
            <Button
              leftIcon={<LuCheckCheck />}
              variant="primary"
              isDisabled={!canApprove}
              onClick={() => setApprovalDecision("Approved")}
            >
              <Trans>Approve</Trans>
            </Button>
            <Button
              leftIcon={<LuX />}
              variant="destructive"
              isDisabled={!canApprove}
              onClick={() => setApprovalDecision("Rejected")}
            >
              <Trans>Reject</Trans>
            </Button>
          </>
        )}
        <Suspense fallback={null}>
          <Await resolve={routeData?.versions}>
            {(versions) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    leftIcon={<LuGitPullRequestArrow />}
                    rightIcon={<LuChevronDown />}
                  >
                    <Trans>Versions</Trans>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {permissions.can("create", "quality") && (
                    <>
                      <DropdownMenuItem onClick={newVersionDisclosure.onOpen}>
                        <DropdownMenuIcon icon={<LuCirclePlus />} />
                        <Trans>New Version</Trans>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuRadioGroup
                    value={id}
                    onValueChange={(value) =>
                      navigate(path.to.qualityDocument(value))
                    }
                  >
                    {routeData?.document && (
                      <DropdownMenuRadioItem
                        key={routeData.document.id}
                        value={routeData.document.id}
                        className="flex items-center justify-between gap-2"
                      >
                        <Badge variant="outline">
                          V{routeData.document.version}
                        </Badge>
                        <span>{routeData.document.name}</span>
                        <QualityDocumentStatus
                          status={routeData.document.status}
                        />
                      </DropdownMenuRadioItem>
                    )}
                    {versions?.data
                      ?.filter((v) => v.id !== id)
                      .map((version) => (
                        <DropdownMenuRadioItem
                          key={version.id}
                          value={version.id}
                          className="flex items-center justify-between gap-2"
                        >
                          <Badge variant="outline">V{version.version}</Badge>
                          <span>{version.name}</span>
                          <QualityDocumentStatus status={version.status} />
                        </DropdownMenuRadioItem>
                      ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </Await>
        </Suspense>
      </HStack>
      {newVersionDisclosure.isOpen && (
        <QualityDocumentForm
          type="copy"
          initialValues={{
            name: routeData?.document?.name ?? "",
            version: (routeData?.document?.version ?? 0) + 1,
            content: JSON.stringify(routeData?.document?.content) ?? "",
            copyFromId: routeData?.document?.id ?? ""
          }}
          open={newVersionDisclosure.isOpen}
          onClose={newVersionDisclosure.onClose}
        />
      )}
      {deleteDisclosure.isOpen && (
        <ConfirmDelete
          action={path.to.deleteQualityDocument(id)}
          isOpen={deleteDisclosure.isOpen}
          name={routeData?.document?.name ?? "document"}
          text={t`Are you sure you want to delete ${routeData?.document?.name}? This cannot be undone.`}
          onCancel={() => {
            deleteDisclosure.onClose();
          }}
          onSubmit={() => {
            deleteDisclosure.onClose();
          }}
        />
      )}
      {approvalDecision && approvalRequestId && (
        <QualityDocumentApprovalModal
          qualityDocument={routeData?.document}
          approvalRequestId={approvalRequestId}
          decision={approvalDecision}
          fetcher={approvalFetcher}
          onClose={() => setApprovalDecision(null)}
        />
      )}
    </>
  );
}

const QualityDocumentHeader = () => {
  const { id } = useParams();
  if (!id) throw new Error("id not found");

  const { leftSlotEl } = useTopbarLeft();
  const { t } = useLingui();
  const { hasExplorer, toggleExplorer, toggleProperties } = usePanels();

  return (
    <>
      {leftSlotEl &&
        createPortal(<QualityDocumentTopbarLeft id={id} />, leftSlotEl)}
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

export default QualityDocumentHeader;
