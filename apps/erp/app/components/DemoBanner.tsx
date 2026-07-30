import { useEdition, useHydrated } from "@carbon/react";
import { Edition } from "@carbon/utils";
import { useLingui } from "@lingui/react/macro";
import type { ReactNode } from "react";
import { LuBuilding2, LuCalendarPlus, LuFlaskConical } from "react-icons/lu";
import { useFetcher } from "react-router";
import { AppBanner } from "~/components/AppBanner";
import { path } from "~/utils/path";

// Defined outside DemoBanner so React doesn't remount the form/button subtree on
// every render (a component defined inside a render body gets a new reference each
// time, which forces React to unmount + remount it).
function Action({ action, children }: { action: string; children: ReactNode }) {
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="post" action={action} className="inline">
      <button
        type="submit"
        className="underline underline-offset-2 font-medium hover:opacity-80"
      >
        {children}
      </button>
    </fetcher.Form>
  );
}

function RequestExtensionAction({
  alreadyRequested
}: {
  alreadyRequested: boolean;
}) {
  const { t } = useLingui();
  const fetcher = useFetcher<{ ok: boolean }>();
  const done = alreadyRequested || fetcher.data?.ok === true;
  const busy = fetcher.state !== "idle";
  return (
    <fetcher.Form
      method="post"
      action={path.to.demoExtendRequest}
      className="inline"
    >
      <button
        type="submit"
        disabled={busy || done}
        className="underline underline-offset-2 font-medium hover:opacity-80 disabled:opacity-60 disabled:no-underline"
      >
        {extendIcon}
        {done ? t`Extension requested` : t`Request extension`}
      </button>
    </fetcher.Form>
  );
}

const demoIcon = (
  <LuFlaskConical className="mr-1 inline size-3.5 align-[-0.15em]" />
);
const companyIcon = (
  <LuBuilding2 className="mr-1 inline size-3.5 align-[-0.15em]" />
);
const extendIcon = (
  <LuCalendarPlus className="mr-1 inline size-3.5 align-[-0.15em]" />
);

export type DemoState = {
  id: string;
  expiresAt: string | null;
  isCurrent: boolean;
  extensionRequested: boolean;
} | null;

type DemoBannerProps = {
  demo: DemoState;
  realCompanyId: string | null;
  hasPaidPlan: boolean;
};

function daysLeft(expiresAt: string | null): number {
  if (!expiresAt) return 0;
  const ms = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

/**
 * Free-plan / demo banner. An inline action POSTs to a route (switch company or create the
 * demo). Kept brand-neutral (no product name) so rebranding is just a token change.
 *
 * States covered so far (Phase 3 will add the free-plan/upgrade framing once gating lands):
 *  - in the demo, active   → days left + switch back
 *  - in the demo, ended    → switch back
 *  - not in demo, has demo → explore the demo
 *  - not in demo, no demo  → try the demo
 */
export function DemoBanner({
  demo,
  realCompanyId,
  hasPaidPlan
}: DemoBannerProps) {
  const { t } = useLingui();
  const edition = useEdition();
  // Creating a demo ("Try the demo") is a cloud-only action, so that CTA is
  // gated below. Existing-demo states (explore / in the demo) render in every
  // edition — the demo company itself isn't cloud-only, only its creation is.
  const isCloud = edition === Edition.Cloud;
  // Only the "in the demo" branch derives its text/structure from daysLeft()
  // (which reads Date.now()); the server (UTC) and client can disagree at a day
  // boundary. Render that branch client-only to avoid a hydration mismatch. The
  // other branches carry no wall-clock and keep server-rendering normally.
  const hydrated = useHydrated();

  // A company that has already paid doesn't need the demo nudge. (When you're in
  // the demo, the current company has no paid plan, so this is false and the
  // "switch back" banner still shows.)
  if (hasPaidPlan) return null;

  let content: ReactNode;

  if (demo?.isCurrent) {
    if (!hydrated) return null;
    const days = daysLeft(demo.expiresAt);
    content =
      days <= 0 ? (
        <>
          {demoIcon}
          {t`You're in the demo company — it has ended.`}{" "}
          <RequestExtensionAction alreadyRequested={demo.extensionRequested} />{" "}
          {realCompanyId && (
            <Action action={path.to.companySwitch(realCompanyId)}>
              {companyIcon}
              {t`Switch to your company`}
            </Action>
          )}
        </>
      ) : (
        <>
          {demoIcon}
          {days === 1
            ? t`You're in the demo company — 1 day left.`
            : t`You're in the demo company — ${days} days left.`}{" "}
          {days <= 7 && (
            <>
              <RequestExtensionAction
                alreadyRequested={demo.extensionRequested}
              />{" "}
            </>
          )}
          {realCompanyId && (
            <Action action={path.to.companySwitch(realCompanyId)}>
              {companyIcon}
              {t`Switch to your company`}
            </Action>
          )}
        </>
      );
  } else if (demo) {
    content = (
      <>
        {companyIcon}
        {t`You're in your company.`}{" "}
        <Action action={path.to.companySwitch(demo.id)}>
          {demoIcon}
          {t`Explore the demo`}
        </Action>
      </>
    );
  } else {
    // No demo yet: the only action is to create one, which is cloud-only.
    if (!isCloud) return null;
    content = (
      <>
        {companyIcon}
        {t`You're in your company.`}{" "}
        <Action action={path.to.tryDemo}>
          {demoIcon}
          {t`Try the demo`}
        </Action>
      </>
    );
  }

  return <AppBanner>{content}</AppBanner>;
}
