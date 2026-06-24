"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  useDisclosure
} from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { useEffect, useRef } from "react";
import { useFetcher, useRevalidator } from "react-router";
import { usePermissions } from "~/hooks";
import { path } from "~/utils/path";
import { jobStatus } from "../../production.models";
import type { Job } from "../../types";
import { JobCancelModal, JobCompleteModal, JobStartModal } from "./JobHeader";
import JobStatus, { JobStatusIcon, useJobStatusDisplayText } from "./JobStatus";

type Status = (typeof jobStatus)[number];

// Statuses offered in the inline menu (the two deprecated, derived-only badges
// are display-only and never set directly).
const SELECTABLE_STATUSES = jobStatus.filter(
  (s) => s !== "Overdue" && s !== "Due Today"
);

/**
 * Clickable status badge that opens a colorful radio menu to change a job's
 * status inline (modeled on the operation status menu). Transitions with side
 * effects (Release / Complete / Cancel) open the existing modals so the proper
 * flows run; the rest post directly. The table is revalidated on completion.
 */
export default function JobStatusMenu({ job }: { job: Job }) {
  const { t } = useLingui();
  const permissions = usePermissions();
  const getDisplayText = useJobStatusDisplayText();
  const fetcher = useFetcher<{}>();
  const { revalidate } = useRevalidator();

  const releaseModal = useDisclosure();
  const cancelModal = useDisclosure();
  const completeModal = useDisclosure();

  // Refresh the table once a status change settles (the action redirects to the
  // referrer, but revalidating explicitly keeps the inline row in sync).
  const prevState = useRef(fetcher.state);
  useEffect(() => {
    if (prevState.current !== "idle" && fetcher.state === "idle") {
      revalidate();
    }
    prevState.current = fetcher.state;
  }, [fetcher.state, revalidate]);

  const optimisticStatus = fetcher.formData?.get("status") as Status | undefined;
  const status = (optimisticStatus ?? job.status) as Status | null;

  const canUpdate = permissions.can("update", "production");
  if (!job.id || !canUpdate) {
    return <JobStatus status={status} />;
  }

  const submitStatus = (next: Status) =>
    fetcher.submit(
      { status: next },
      { method: "post", action: path.to.jobStatus(job.id!) }
    );

  const onSelect = (next: Status) => {
    if (next === status) return;
    switch (next) {
      case "Ready":
        // Resuming a paused job is a direct transition; releasing a
        // draft/planned job needs the release modal (PO selection, scheduling).
        if (status === "Paused") submitStatus("Ready");
        else releaseModal.onOpen();
        break;
      case "Completed":
        completeModal.onOpen();
        break;
      case "Cancelled":
        cancelModal.onOpen();
        break;
      default:
        submitStatus(next);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={t`Change status`}
            className="cursor-pointer rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <JobStatus status={status} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuRadioGroup
            value={status ?? undefined}
            onValueChange={(value) => onSelect(value as Status)}
          >
            {SELECTABLE_STATUSES.map((s) => (
              <DropdownMenuRadioItem key={s} value={s}>
                <DropdownMenuIcon icon={<JobStatusIcon status={s} />} />
                <span>{getDisplayText(s)}</span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {releaseModal.isOpen && (
        <JobStartModal
          job={job}
          onClose={releaseModal.onClose}
          fetcher={fetcher}
        />
      )}
      {cancelModal.isOpen && (
        <JobCancelModal
          job={job}
          onClose={cancelModal.onClose}
          fetcher={fetcher}
        />
      )}
      {completeModal.isOpen && (
        <JobCompleteModal
          job={job}
          onClose={completeModal.onClose}
          fetcher={fetcher}
        />
      )}
    </>
  );
}
