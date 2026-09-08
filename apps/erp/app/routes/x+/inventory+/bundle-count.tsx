import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { Button, Input, VStack } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import {
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import {
  data,
  useActionData,
  useFetcher,
  useLoaderData,
  useSubmit
} from "react-router";
import { useLocations } from "~/components/Form/Location";
import { insertManualInventoryAdjustment } from "~/modules/inventory";
import { getItemQuantities } from "~/modules/items";
import { getBundleByGarmentCode } from "~/modules/production";
import { getLocationsList } from "~/modules/resources";
import { getUserDefaults } from "~/modules/users/users.server";
import { path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId, userId } = await requirePermissions(request, {
    view: "inventory",
    role: "employee"
  });

  const url = new URL(request.url);
  const code = (url.searchParams.get("code") ?? "").trim();

  // A scan lookup (via fetcher) — resolve the code to its bundle + SKU item.
  if (code) {
    const resolved = await getBundleByGarmentCode(client, code, companyId);
    const b = resolved.data;
    return {
      defaultLocationId: null as string | null,
      scanned: b
        ? {
            code,
            found: true as const,
            bundleId: b.bundle.id ?? "",
            itemId: b.bundle.itemId ?? "",
            styleReadableId: b.bundle.styleReadableId,
            attributeLabel: b.bundle.attributeLabel,
            quantity: b.bundle.quantity ?? 0
          }
        : { code, found: false as const }
    };
  }

  // Initial page load — pick a default location for the count session:
  // URL ?location → user default → first company location.
  let locationId = url.searchParams.get("location");
  if (!locationId) {
    const userDefaults = await getUserDefaults(client, userId, companyId);
    locationId = userDefaults.data?.locationId ?? null;
  }
  if (!locationId) {
    const locations = await getLocationsList(client, companyId);
    locationId = locations.data?.[0]?.id ?? null;
  }
  return { defaultLocationId: locationId, scanned: null };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "inventory"
  });

  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");
  const locationId = String(formData.get("locationId") ?? "");
  const itemIds = formData.getAll("itemId").map(String);
  const counts = formData.getAll("countedQuantity").map((v) => Number(v));
  const items = itemIds.map((itemId, i) => ({
    itemId,
    counted: counts[i] ?? 0
  }));

  if (!locationId || items.length === 0) {
    return data({
      intent: "none" as const,
      onHand: {} as Record<string, number>
    });
  }

  // Review: fetch current system on-hand per counted item at this location.
  if (intent === "review") {
    const onHand: Record<string, number> = {};
    for (const it of items) {
      const q = await getItemQuantities(
        client,
        it.itemId,
        companyId,
        locationId
      );
      onHand[it.itemId] = q.data?.quantityOnHand ?? 0;
    }
    return data({ intent: "review" as const, onHand });
  }

  // Commit: overwrite on-hand for each counted item via the shared adjustment
  // service (Set Quantity → posts a Positive/Negative Adjmt. ledger row). Only
  // scanned items are touched — un-scanned stock is deliberately left alone.
  if (intent === "commit") {
    const failed: string[] = [];
    for (const it of items) {
      const result = await insertManualInventoryAdjustment(client, {
        itemId: it.itemId,
        locationId,
        adjustmentType: "Set Quantity",
        quantity: it.counted,
        comment: "Physical count (bundle scan)",
        companyId,
        createdBy: userId
      });
      if ("error" in result && result.error) failed.push(it.itemId);
    }
    return data(
      { intent: "commit" as const, committed: failed.length === 0, failed },
      await flash(
        request,
        failed.length
          ? error(null, `${failed.length} item(s) failed to post`)
          : success(`Count posted — updated ${items.length} item(s)`)
      )
    );
  }

  return data({ intent: "none" as const });
}

type SessionBundle = {
  itemId: string;
  styleReadableId: string | null;
  attributeLabel: string | null;
  quantity: number;
};

export default function BundleCountRoute() {
  const { t } = useLingui();
  const { defaultLocationId } = useLoaderData<typeof loader>();
  const lookupFetcher = useFetcher<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const locationOptions = useLocations();

  const [locationId, setLocationId] = useState(defaultLocationId ?? "");
  const [scanValue, setScanValue] = useState("");
  const [scanMsg, setScanMsg] = useState("");
  const [session, setSession] = useState<Record<string, SessionBundle>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const lastCode = useRef("");

  // Keep the gun's cursor in the scan box.
  useEffect(() => {
    inputRef.current?.focus();
  });

  // Fold a scan lookup result into the session (dedupe by bundle).
  useEffect(() => {
    const d = lookupFetcher.data?.scanned;
    if (!d || lookupFetcher.state !== "idle") return;
    if (d.code === lastCode.current) return;
    lastCode.current = d.code;
    if (!d.found) {
      setScanMsg(t`Not found: ${d.code}`);
      return;
    }
    if (!d.itemId) {
      setScanMsg(t`That bundle has no item — can't count`);
      return;
    }
    setSession((prev) =>
      prev[d.bundleId]
        ? prev
        : {
            ...prev,
            [d.bundleId]: {
              itemId: d.itemId,
              styleReadableId: d.styleReadableId,
              attributeLabel: d.attributeLabel,
              quantity: d.quantity
            }
          }
    );
    setScanMsg(`+ ${d.styleReadableId ?? d.itemId} · ${d.quantity} ${t`pcs`}`);
  }, [lookupFetcher.data, lookupFetcher.state, t]);

  // Clear the session after a successful post.
  useEffect(() => {
    if (actionData?.intent === "commit" && actionData.committed) {
      setSession({});
      setScanMsg("");
      lastCode.current = "";
    }
  }, [actionData]);

  const tally = useMemo(() => {
    const byItem = new Map<
      string,
      {
        itemId: string;
        styleReadableId: string | null;
        attributeLabel: string | null;
        counted: number;
        bundles: number;
      }
    >();
    for (const b of Object.values(session)) {
      const cur = byItem.get(b.itemId) ?? {
        itemId: b.itemId,
        styleReadableId: b.styleReadableId,
        attributeLabel: b.attributeLabel,
        counted: 0,
        bundles: 0
      };
      cur.counted += b.quantity;
      cur.bundles += 1;
      byItem.set(b.itemId, cur);
    }
    return [...byItem.values()];
  }, [session]);

  const post = (intent: "review" | "commit") => {
    const fd = new FormData();
    fd.set("intent", intent);
    fd.set("locationId", locationId);
    for (const it of tally) {
      fd.append("itemId", it.itemId);
      fd.append("countedQuantity", String(it.counted));
    }
    submit(fd, { method: "post" });
  };

  const onScanKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const code = scanValue.trim();
    setScanValue("");
    if (!code) return;
    if (!locationId) {
      setScanMsg(t`Pick a location first`);
      return;
    }
    lookupFetcher.load(
      `${path.to.bundleCount}?code=${encodeURIComponent(code)}`
    );
  };

  const reviewing = actionData?.intent === "review";
  const onHand = reviewing ? actionData.onHand : {};

  return (
    <VStack
      spacing={4}
      className="p-4 h-[calc(100dvh-49px)] overflow-y-auto items-center"
    >
      <div className="w-full max-w-2xl flex flex-col gap-4">
        <h1 className="text-lg font-semibold">{t`Bundle Count`}</h1>
        <div className="flex flex-col gap-1 rounded-lg border border-border bg-card p-3">
          <label
            htmlFor="count-location"
            className="text-xs font-medium uppercase text-muted-foreground"
          >
            {t`Count location`}
          </label>
          <select
            id="count-location"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            className="flex h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          >
            <option value="" disabled>
              {t`Select a location…`}
            </option>
            {locationOptions.length === 0 && locationId ? (
              <option value={locationId}>{locationId}</option>
            ) : null}
            {locationOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          ref={inputRef}
          value={scanValue}
          onChange={(e) => setScanValue(e.target.value)}
          onKeyDown={onScanKeyDown}
          size="lg"
          autoFocus
          autoComplete="off"
          placeholder={t`Scan a care-label barcode…`}
        />
        {scanMsg ? (
          <div className="text-xs text-muted-foreground">{scanMsg}</div>
        ) : null}

        {tally.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            {t`Scan garments to build the count. One scan per bundle counts the whole bundle.`}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col divide-y divide-border rounded-md border border-border">
              <div className="flex items-center gap-2 px-3 py-2 text-xs uppercase text-muted-foreground">
                <span className="flex-1">{t`Item`}</span>
                {reviewing ? (
                  <span className="w-16 text-right">{t`System`}</span>
                ) : null}
                <span className="w-16 text-right">{t`Counted`}</span>
                {reviewing ? (
                  <span className="w-16 text-right">{t`Diff`}</span>
                ) : null}
              </div>
              {tally.map((it) => {
                const sys = onHand[it.itemId] ?? 0;
                const diff = it.counted - sys;
                return (
                  <div
                    key={it.itemId}
                    className="flex items-center gap-2 px-3 py-2 text-sm"
                  >
                    <div className="flex-1">
                      <div className="font-medium">
                        {it.styleReadableId ?? it.itemId}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {it.attributeLabel} · {it.bundles} {t`bundles`}
                      </div>
                    </div>
                    {reviewing ? (
                      <span className="w-16 text-right tabular-nums">
                        {sys}
                      </span>
                    ) : null}
                    <span className="w-16 text-right font-semibold tabular-nums">
                      {it.counted}
                    </span>
                    {reviewing ? (
                      <span
                        className={`w-16 text-right tabular-nums ${
                          diff === 0
                            ? "text-muted-foreground"
                            : diff > 0
                              ? "text-green-600"
                              : "text-red-600"
                        }`}
                      >
                        {diff > 0 ? `+${diff}` : diff}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2">
              {reviewing ? (
                <>
                  <span className="flex-1 text-xs text-muted-foreground">
                    {t`Confirming overwrites on-hand for the items above at this location. Un-scanned items are left unchanged.`}
                  </span>
                  <Button variant="secondary" onClick={() => post("review")}>
                    {t`Refresh`}
                  </Button>
                  <Button onClick={() => post("commit")}>
                    {t`Confirm & Post`}
                  </Button>
                </>
              ) : (
                <Button isDisabled={!locationId} onClick={() => post("review")}>
                  {t`Review`}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </VStack>
  );
}
