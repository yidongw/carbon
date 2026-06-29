import { toast } from "@carbon/react";
import { useEffect, useRef } from "react";
import { useFetcher, useRevalidator } from "react-router";
import { path } from "~/utils/path";

const TOAST_ID = "demo-seed";

type Counts = {
  items: number;
  customers: number;
  suppliers: number;
  salesOrders: number;
  jobs: number;
};
type SeedStatus = { status: string; counts: Counts | null };

/**
 * Rendered only while in a demo company. The first time the demo is unseeded it
 * kicks off the (detached, server-side) seed and shows a live progress toast that
 * polls real row counts until seeding completes, then revalidates so the freshly
 * seeded data shows up. Renders nothing.
 */
export function DemoSeedTrigger({
  needsSeed,
  status
}: {
  needsSeed: boolean;
  status: string | null;
}) {
  const trigger = useFetcher();
  const poll = useFetcher<SeedStatus>();
  const revalidator = useRevalidator();
  const startedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const doneRef = useRef(false);
  const pollCountRef = useRef(0);

  useEffect(() => {
    if (startedRef.current) return;
    // Seed when the demo is empty (needsSeed), or just resume polling if a seed is
    // already running (e.g. after a refresh mid-seed).
    if (!needsSeed && status !== "seeding") return;
    startedRef.current = true;

    if (needsSeed) {
      trigger.submit(null, { method: "post", action: path.to.demoSeed });
    }
    toast.loading("Setting up your demo data…", {
      id: TOAST_ID,
      duration: Number.POSITIVE_INFINITY
    });

    poll.load(path.to.demoSeed);
    // Run once on mount. Deps must stay [] — a [status] dep would clear this
    // interval (and not restart it, due to startedRef) the moment the loader
    // revalidates pending → seeding, killing the progress updates.
    intervalRef.current = setInterval(() => poll.load(path.to.demoSeed), 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const data = poll.data;
    if (!data || doneRef.current) return;
    pollCountRef.current += 1;

    const items = data.counts?.items ?? 0;
    // Done when the seed has actually produced data (not just a stale `seeded` flag),
    // when there's no demo to seed, or after a safety cap (~2 min).
    const finished =
      (data.status === "seeded" && items > 0) ||
      data.status === "none" ||
      pollCountRef.current > 40;
    if (finished) {
      doneRef.current = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (items > 0) {
        toast.success("Your demo is ready — explore every module!", {
          id: TOAST_ID,
          duration: 5000
        });
        revalidator.revalidate();
      } else {
        toast.dismiss(TOAST_ID);
      }
      return;
    }

    const c = data.counts;
    const parts: string[] = [];
    if (c?.items) parts.push(`${c.items} products`);
    if (c?.customers) parts.push(`${c.customers} customers`);
    if (c?.suppliers) parts.push(`${c.suppliers} suppliers`);
    if (c?.salesOrders) parts.push(`${c.salesOrders} orders`);
    if (c?.jobs) parts.push(`${c.jobs} job${c.jobs === 1 ? "" : "s"}`);
    toast.loading(
      parts.length
        ? `Building your demo — ${parts.join(", ")} so far…`
        : "Setting up your demo data…",
      { id: TOAST_ID, duration: Number.POSITIVE_INFINITY }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poll.data]);

  return null;
}
