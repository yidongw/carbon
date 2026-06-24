"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Spinner,
  useDisclosure
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect, useRef, useState } from "react";
import {
  LuCheckCheck,
  LuCircleCheck,
  LuCirclePause,
  LuCirclePlay,
  LuCircleStop
} from "react-icons/lu";
import { useFetcher } from "react-router";
import { usePermissions } from "~/hooks";
import { path } from "~/utils/path";
import type { jobStatus } from "../../production.models";
import type { Job } from "../../types";
import { JobCancelModal, JobCompleteModal, JobStartModal } from "./JobHeader";
import JobStatus from "./JobStatus";

/**
 * Clickable status badge that opens a menu to change a job's status inline.
 * Mirrors the status actions in the job header (JobTopbarLeft) and reuses the
 * same modals so side-effect flows (release/complete/cancel) stay consistent.
 */
export default function JobStatusMenu({ job }: { job: Job }) {
  const { t } = useLingui();
  const permissions = usePermissions();
  const fetcher = useFetcher<{ success?: boolean }>();

  const releaseModal = useDisclosure();
  const cancelModal = useDisclosure();
  const completeModal = useDisclosure();

  // The status currently being submitted — a direct click, the cancel/release
  // modal forms (all send a `status` field), or the complete modal (posts to
  // the dedicated complete route).
  const submitting =
    (fetcher.formData?.get("status") as
      | (typeof jobStatus)[number]
      | undefined) ??
    (fetcher.formAction?.includes("/complete") ? "Completed" : undefined);

  // Show the new status the instant the server's success response lands.
  // fetcher.data is populated the moment the action returns — well before the
  // fetcher re-reads the table (that read-back lags several seconds). Keying off
  // the response (not the fetcher going idle, which waits on the read-back)
  // makes the badge flip in ~300ms, while never flipping before the server
  // actually confirms.
  const [confirmed, setConfirmed] = useState<
    (typeof jobStatus)[number] | null
  >(null);
  const targetRef = useRef<(typeof jobStatus)[number] | null>(null);
  useEffect(() => {
    if (submitting) targetRef.current = submitting;
    if (fetcher.data?.success === true && targetRef.current) {
      setConfirmed(targetRef.current);
    } else if (fetcher.data?.success === false) {
      targetRef.current = null;
    }
  }, [fetcher.data, submitting]);

  // Drop the optimistic value once the row read-back finally reflects it.
  useEffect(() => {
    if (confirmed && job.status === confirmed) setConfirmed(null);
  }, [confirmed, job.status]);

  // Old status + spinner until the server confirms, then the new status. Stop
  // the spinner as soon as we have the confirmed status (the fetcher may still
  // be busy doing its slow background read-back).
  const status = confirmed ?? job.status;
  const busy = fetcher.state !== "idle" && !confirmed;

  const canUpdate = permissions.can("update", "production");
  if (!job.id || !canUpdate) {
    return <JobStatus status={status} />;
  }

  const isDraft = ["Draft", "Planned"].includes(status ?? "");
  const isPaused = status === "Paused";
  const isRunning = ["Ready", "In Progress"].includes(status ?? "");
  const isDone = ["Completed", "Cancelled"].includes(status ?? "");

  const submitStatus = (next: (typeof jobStatus)[number]) =>
    fetcher.submit(
      { status: next },
      // stay=1 keeps inline changes on the jobs list (e.g. "Mark as Planned"
      // would otherwise redirect to the job's materials page).
      { method: "post", action: `${path.to.jobStatus(job.id!)}?stay=1` }
    );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={t`Change status`}
            disabled={busy}
            className="inline-flex items-center gap-1.5 cursor-pointer rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default disabled:hover:opacity-100"
          >
            <span className={busy ? "opacity-50" : undefined}>
              <JobStatus status={status} />
            </span>
            {busy && <Spinner className="size-4 text-foreground" />}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {isDraft && (
            <DropdownMenuItem
              disabled={busy}
              onClick={() => submitStatus("Planned")}
            >
              <DropdownMenuIcon className="text-yellow-500" icon={<LuCheckCheck />} />
              <Trans>Mark as Planned</Trans>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            disabled={
              !isDraft ||
              busy ||
              (job.quantity === 0 && job.scrapQuantity === 0)
            }
            onClick={releaseModal.onOpen}
          >
            <DropdownMenuIcon className="text-blue-600" icon={<LuCirclePlay />} />
            <Trans>Release</Trans>
          </DropdownMenuItem>
          {isPaused ? (
            <DropdownMenuItem
              disabled={busy}
              onClick={() => submitStatus("Ready")}
            >
              <DropdownMenuIcon className="text-blue-600" icon={<LuCirclePlay />} />
              <Trans>Resume</Trans>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              disabled={!isRunning || busy}
              onClick={() => submitStatus("Paused")}
            >
              <DropdownMenuIcon className="text-orange-500" icon={<LuCirclePause />} />
              <Trans>Pause</Trans>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            disabled={isDone || busy}
            onClick={completeModal.onOpen}
          >
            <DropdownMenuIcon className="text-green-600" icon={<LuCircleCheck />} />
            <Trans>Complete</Trans>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isDone || busy}
            onClick={cancelModal.onOpen}
          >
            <DropdownMenuIcon className="text-red-600" icon={<LuCircleStop />} />
            <Trans>Cancel</Trans>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={!isDone || busy}
            onClick={() =>
              submitStatus(status === "Cancelled" ? "Draft" : "In Progress")
            }
          >
            <DropdownMenuIcon className="text-blue-600" icon={<LuCirclePlay />} />
            <Trans>Reopen</Trans>
          </DropdownMenuItem>
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
