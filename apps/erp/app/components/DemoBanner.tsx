import type { ReactNode } from "react";
import { useFetcher } from "react-router";
import { path } from "~/utils/path";

export type DemoState = {
  id: string;
  expiresAt: string | null;
  isCurrent: boolean;
} | null;

type DemoBannerProps = {
  demo: DemoState;
  realCompanyId: string | null;
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
export function DemoBanner({ demo, realCompanyId }: DemoBannerProps) {
  const fetcher = useFetcher();

  const Action = ({
    action,
    children
  }: {
    action: string;
    children: ReactNode;
  }) => (
    <fetcher.Form method="post" action={action} className="inline">
      <button
        type="submit"
        className="underline underline-offset-2 font-medium hover:opacity-80"
      >
        {children}
      </button>
    </fetcher.Form>
  );

  let content: ReactNode;

  if (demo?.isCurrent) {
    const days = daysLeft(demo.expiresAt);
    content =
      days <= 0 ? (
        <>
          Your demo has ended.{" "}
          {realCompanyId && (
            <Action action={path.to.companySwitch(realCompanyId)}>
              Switch to your company
            </Action>
          )}
        </>
      ) : (
        <>
          You're exploring the demo — {days} {days === 1 ? "day" : "days"} left.{" "}
          {realCompanyId && (
            <Action action={path.to.companySwitch(realCompanyId)}>
              Switch to your company
            </Action>
          )}
        </>
      );
  } else if (demo) {
    content = (
      <>
        Want to see every module with sample data?{" "}
        <Action action={path.to.companySwitch(demo.id)}>Explore the demo</Action>
      </>
    );
  } else {
    content = (
      <>
        Want to explore all the modules?{" "}
        <Action action={path.to.tryDemo}>Try the demo</Action>
      </>
    );
  }

  return (
    <div className="w-full shrink-0 bg-primary px-4 py-1.5 text-center text-sm text-primary-foreground">
      {content}
    </div>
  );
}
