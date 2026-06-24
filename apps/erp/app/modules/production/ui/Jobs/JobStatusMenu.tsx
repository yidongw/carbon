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
import { useFetcher, useRevalidator } from "react-router";
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
  const fetcher = useFetcher<{}>();
  const revalidator = useRevalidator();

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

  // Once a submit settles we keep showing its target until the loader catches
  // up. This applies the change only AFTER the server confirmed it (no premature
  // flip while a modal validates or a request is in flight) and survives
  // revalidation lag, where reading the row back can be momentarily stale.
  const [confirmed, setConfirmed] = useState<
    (typeof jobStatus)[number] | null
  >(null);
  const submittingRef = useRef<(typeof jobStatus)[number] | null>(null);
  const prevState = useRef(fetcher.state);
  useEffect(() => {
    if (submitting) submittingRef.current = submitting;
    if (prevState.current !== "idle" && fetcher.state === "idle") {
      if (submittingRef.current) setConfirmed(submittingRef.current);
      submittingRef.current = null;
      // Also refresh the table so the rest of the row reflects any side effects.
      revalidator.revalidate();
    }
    prevState.current = fetcher.state;
  }, [fetcher.state, submitting, revalidator]);

  // Drop the optimistic value once the loader actually reflects it.
  useEffect(() => {
    if (confirmed && job.status === confirmed) setConfirmed(null);
  }, [confirmed, job.status]);

  // While a change is in flight keep showing the prior status (with a spinner)
  // so the badge never flips before the server commits; once it settles show
  // the confirmed target.
  const status = inFlight ? job.status : confirmed ?? job.status;
  const busy = inFlight;

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
      { method: "post", action: path.to.jobStatus(job.id!) }
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
