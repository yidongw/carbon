import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import {
  Badge,
  Button,
  Input,
  ToggleGroup,
  ToggleGroupItem,
  VStack
} from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { useEffect, useRef } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import {
  Form,
  redirect,
  useLoaderData,
  useLocation,
  useSearchParams
} from "react-router";
import {
  getBundleByGarmentCode,
  getRecentBundleInventoryMovements,
  recordBundleInventoryMovement
} from "~/modules/production";
import { path } from "~/utils/path";

function parseDirection(value: unknown): "In" | "Out" {
  return value === "In" ? "In" : "Out";
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    role: "employee"
  });

  const url = new URL(request.url);
  const direction = parseDirection(url.searchParams.get("direction"));
  const code = (url.searchParams.get("code") ?? "").trim();

  const scanned = code
    ? await getBundleByGarmentCode(client, code, companyId)
    : { data: null, error: null };

  const recent = await getRecentBundleInventoryMovements(client, companyId, 12);

  return {
    direction,
    code,
    scanned: scanned.data,
    notFound: code.length > 0 && !scanned.data,
    recent: recent.data ?? []
  };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "production"
  });

  const formData = await request.formData();
  const bundleWorkOrderId = String(formData.get("bundleWorkOrderId") ?? "");
  const direction = parseDirection(formData.get("direction"));
  const quantity = Number(formData.get("quantity") ?? 0);
  const scannedCode = String(formData.get("scannedCode") ?? "");
  const back = `${path.to.bundleInventoryScan}?direction=${direction}`;

  if (
    !bundleWorkOrderId ||
    !scannedCode ||
    !Number.isFinite(quantity) ||
    quantity <= 0
  ) {
    throw redirect(
      back,
      await flash(request, error(null, "Incomplete scan — nothing recorded"))
    );
  }

  const result = await recordBundleInventoryMovement(client, {
    bundleWorkOrderId,
    direction,
    quantity,
    scannedCode,
    companyId,
    createdBy: userId
  });

  if (result.error) {
    throw redirect(
      back,
      await flash(request, error(result.error, "Failed to record movement"))
    );
  }

  throw redirect(
    back,
    await flash(
      request,
      success(direction === "In" ? "Recorded IN" : "Recorded OUT")
    )
  );
}

export default function BundleInventoryScanRoute() {
  const { t } = useLingui();
  const { direction, scanned, notFound, recent } =
    useLoaderData<typeof loader>();
  const [, setSearchParams] = useSearchParams();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the gun's cursor in the scan box after every scan / confirm.
  useEffect(() => {
    inputRef.current?.focus();
  });

  const setDirection = (value: string) => {
    if (value !== "In" && value !== "Out") return;
    setSearchParams(
      (prev) => {
        prev.set("direction", value);
        prev.delete("code");
        return prev;
      },
      { replace: true }
    );
  };

  return (
    <VStack
      spacing={4}
      className="p-4 h-[calc(100dvh-49px)] overflow-y-auto items-center"
    >
      <div className="w-full max-w-xl flex flex-col gap-4">
        <ToggleGroup
          type="single"
          value={direction}
          onValueChange={setDirection}
          className="w-full"
        >
          <ToggleGroupItem value="Out" className="flex-1">
            {t`Out`}
          </ToggleGroupItem>
          <ToggleGroupItem value="In" className="flex-1">
            {t`In`}
          </ToggleGroupItem>
        </ToggleGroup>

        <Form method="get">
          <input type="hidden" name="direction" value={direction} />
          <Input
            key={location.key}
            ref={inputRef}
            name="code"
            size="lg"
            autoFocus
            autoComplete="off"
            placeholder={t`Scan a care-label barcode…`}
          />
        </Form>

        {notFound ? (
          <div className="rounded-md border border-red-500/30 bg-red-50 p-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
            {t`No garment found for that code. Check the label, or generate RFID codes for the bundle first.`}
          </div>
        ) : null}

        {scanned ? (
          <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">
                {scanned.bundle.styleReadableId ?? scanned.bundle.jobReadableId}
              </span>
              <Badge variant={direction === "In" ? "green" : "yellow"}>
                {direction === "In" ? t`In` : t`Out`}
              </Badge>
            </div>
            {scanned.bundle.attributeLabel ? (
              <div className="text-sm text-muted-foreground">
                {scanned.bundle.attributeLabel}
              </div>
            ) : null}
            <div className="text-sm">
              {t`Bundle`}:{" "}
              <span className="font-mono">{scanned.bundle.jobReadableId}</span>
            </div>
            <div className="text-sm">
              {t`Quantity`}:{" "}
              <span className="font-semibold tabular-nums">
                {scanned.bundle.quantity}
              </span>
            </div>
            <div className="font-mono text-xs text-muted-foreground">
              {scanned.scannedCode}
            </div>
            <Form method="post" className="pt-2">
              <input
                type="hidden"
                name="bundleWorkOrderId"
                value={scanned.bundle.id ?? ""}
              />
              <input type="hidden" name="direction" value={direction} />
              <input
                type="hidden"
                name="quantity"
                value={scanned.bundle.quantity ?? 0}
              />
              <input
                type="hidden"
                name="scannedCode"
                value={scanned.scannedCode}
              />
              <Button type="submit" size="lg" className="w-full">
                {direction === "In" ? t`Confirm In` : t`Confirm Out`} ·{" "}
                {scanned.bundle.quantity} {t`pcs`}
              </Button>
            </Form>
          </div>
        ) : null}

        {recent.length > 0 ? (
          <div className="w-full">
            <div className="mb-2 text-xs uppercase text-muted-foreground">
              {t`Recent`}
            </div>
            <div className="flex flex-col divide-y divide-border rounded-md border border-border">
              {recent.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-2 px-3 py-2 text-sm"
                >
                  <Badge variant={m.direction === "In" ? "green" : "yellow"}>
                    {m.direction === "In" ? t`In` : t`Out`}
                  </Badge>
                  <span className="flex-1 truncate font-mono">
                    {m.scannedCode}
                  </span>
                  <span className="tabular-nums">{m.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </VStack>
  );
}
