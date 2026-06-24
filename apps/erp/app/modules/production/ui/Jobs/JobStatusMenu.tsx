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

  // Remember the requested status so the badge keeps a spinner from the
  // click/confirm until the row actually reflects it. This avoids a premature
  // flip (we never show the new status early) AND the gap where the spinner
  // disappears a beat before the new status arrives.
  const [pending, setPending] = useState<(typeof jobStatus)[number] | null>(
    null
  );
  useEffect(() => {
    if (submitting) setPending(submitting);
  }, [submitting]);

  // Clear once the row reflects the target (success), or the request reported a
  // failure, so the spinner never sticks.
  useEffect(() => {
    if (!pending) return;
    if (job.status === pending) {
      setPending(null);
    } else if (fetcher.state === "idle" && fetcher.data?.success === false) {
      setPending(null);
    }
  }, [pending, job.status, fetcher.state, fetcher.data]);

  // Safety net: if the row never catches up (e.g. a modal flow failed without a
  // success flag), stop the spinner after a grace period.
  useEffect(() => {
    if (!pending || fetcher.state !== "idle") return;
    const timer = setTimeout(() => setPending(null), 10000);
    return () => clearTimeout(timer);
  }, [pending, fetcher.state, job.status]);

  // Always show the real status; the spinner conveys the in-progress change,
  // and the badge only changes once the row genuinely reflects it.
  const status = job.status;
  const busy = pending !== null && job.status !== pending;

  const canUpdate = permissions.can("update", "production");
  if (!job.id || !canUpdate) {
    return <JobStatus status={status} />;
  }

  const isDraft = ["Draft", "Planned"].includes(status ?? "");
  const isPaused = status === "Paused";
  const isRunning = ["Ready", "In Progress"].includes(status ?? "");
  const isDone = ["Completed", "Cancelled"].includes(status ?? "");

  const submitStatus = (next: (typeof jobStatus)[number]) => {
    setPending(next);
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
