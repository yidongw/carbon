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
import { useEffect, useState } from "react";
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

  const inFlight = fetcher.state !== "idle";

  // Remember the status we asked for so the badge can show it the moment the
  // server confirms the change, instead of waiting on the row read-back (which
  // can lag several seconds).
  const [target, setTarget] = useState<(typeof jobStatus)[number] | null>(null);
  useEffect(() => {
    if (submitting) setTarget(submitting);
  }, [submitting]);

  // Drop the optimistic target once the loader reflects it, or the change
  // failed (the action returns { success: false } for inline calls).
  useEffect(() => {
    if (!target) return;
    if (job.status === target) {
      setTarget(null);
    } else if (!inFlight && fetcher.data?.success === false) {
      setTarget(null);
    }
  }, [target, job.status, inFlight, fetcher.data]);

  // While the change is in flight show the prior status with a spinner (never
  // flip early). Once the fetcher settles successfully, show the new status
  // right away and hold it until the row read-back catches up — so there's no
  // gap where the spinner is gone but the status hasn't updated yet.
  const settledOk =
    !inFlight && target !== null && fetcher.data?.success !== false;
  const status = settledOk ? target : job.status;
  const busy = inFlight;

  const canUpdate = permissions.can("update", "production");
  if (!job.id || !canUpdate) {
    return <JobStatus status={status} />;
  }

  const isDraft = ["Draft", "Planned"].includes(status ?? "");
  const isPaused = status === "Paused";
  const isRunning = ["Ready", "In Progress"].includes(status ?? "");
  const isDone = ["Completed", "Cancelled"].includes(status ?? "");

  const submitStatus = (next: (typeof jobStatus)[number]) => {
    setTarget(next);
    fetcher.submit(
      { status: next },
      // stay=1 keeps inline changes on the jobs list (e.g. "Mark as Planned"
      // would otherwise redirect to the job's materials page).
      { method: "post", action: `${path.to.jobStatus(job.id!)}?stay=1` }
    );
  };

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
