import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { trigger } from "@carbon/jobs";
import {
  Button,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  NumberField,
  NumberInput,
  toast,
  VStack
} from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { LuNfc, LuRotateCcw } from "react-icons/lu";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import {
  data,
  redirect,
  useFetcher,
  useLoaderData,
  useNavigate,
  useParams,
  useRevalidator
} from "react-router";
import { useRouteData } from "~/hooks";
import type { StockTransfer, StockTransferLine } from "~/modules/inventory";
import { getStockTransfer } from "~/modules/inventory";
import {
  normalizeScannedExternalCodes,
  resolveGarmentPiecesByScannedCodes,
  tallyLineGarmentPickScans
} from "~/modules/production";
import { getStyleVariantLineMetaByItemIds } from "~/modules/shared/styleVariantLineMeta.server";
import { requireUnlocked } from "~/utils/lockedGuard.server";
import { path } from "~/utils/path";

/**
 * Style garment pick hub on one stock-transfer line:
 * - Multi-round UHF scan confirm (partial OK)
 * - Manual qty confirm for remainder (no picker name)
 * - Settle: shrink line.quantity to picked ("只调度已扫")
 */

async function postInventoryPick(
  client: Awaited<ReturnType<typeof requirePermissions>>["client"],
  args: {
    stockTransferId: string;
    stockTransferLineId: string;
    quantity: number;
    locationId: string;
    userId: string;
    companyId: string;
  }
) {
  return client.functions.invoke("post-stock-transfer", {
    body: JSON.stringify({
      type: "inventory",
      stockTransferId: args.stockTransferId,
      stockTransferLineId: args.stockTransferLineId,
      quantity: args.quantity,
      locationId: args.locationId,
      userId: args.userId,
      companyId: args.companyId
    })
  });
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "inventory"
  });

  const { id, lineId } = params;
  if (!id) throw new Error("id is not found");
  if (!lineId) throw new Error("lineId is not found");

  const line = await client
    .from("stockTransferLine")
    .select("*")
    .eq("id", lineId)
    .eq("stockTransferId", id)
    .single();
  if (line.error || !line.data) {
    throw redirect(
      path.to.stockTransfer(id),
      await flash(request, error(line.error, "Stock transfer line not found"))
    );
  }

  const meta = await getStyleVariantLineMetaByItemIds(
    client,
    [line.data.itemId],
    companyId
  );
  const variantMeta = meta[line.data.itemId];
  if (!variantMeta) {
    throw redirect(
      path.to.stockTransfer(id),
      await flash(request, error(null, "This line is not a Style SKU"))
    );
  }

  const parent = await client
    .from("item")
    .select("id, type")
    .eq("id", variantMeta.parentItemId)
    .maybeSingle();
  if (parent.error || parent.data?.type !== "Style") {
    throw redirect(
      path.to.stockTransfer(id),
      await flash(
        request,
        error(null, "Garment scan pick is only for Style SKUs")
      )
    );
  }

  const quantity = line.data.quantity ?? 0;
  const pickedQuantity = line.data.pickedQuantity ?? 0;

  return {
    lineId,
    itemId: line.data.itemId,
    quantity,
    pickedQuantity,
    remaining: Math.max(0, quantity - pickedQuantity),
    itemReadableId: variantMeta.parentReadableId,
    attributeLabels: variantMeta.attributeLabels
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "inventory"
  });

  const { id, lineId } = params;
  if (!id) throw new Error("id is not found");
  if (!lineId) throw new Error("lineId is not found");

  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "scanPick");

  const line = await client
    .from("stockTransferLine")
    .select("*")
    .eq("id", lineId)
    .eq("stockTransferId", id)
    .single();
  if (line.error || !line.data) {
    return data(
      { intent, ok: false as const, message: "Line not found" },
      await flash(request, error(line.error, "Line not found"))
    );
  }

  const planned = line.data.quantity ?? 0;
  const alreadyPicked = line.data.pickedQuantity ?? 0;
  const remaining = Math.max(0, planned - alreadyPicked);
  const lineItemId = line.data.itemId;

  if (intent === "check") {
    const code = String(formData.get("code") ?? "").trim();
    if (!code) {
      return data({
        intent: "check" as const,
        ok: true as const,
        status: "empty" as const,
        code: ""
      });
    }

    const resolved = await resolveGarmentPiecesByScannedCodes(
      client,
      [code],
      companyId
    );
    if (resolved.error) {
      return data({
        intent: "check" as const,
        ok: false as const,
        status: "unknown" as const,
        code,
        message: "Failed to resolve scan"
      });
    }

    if (resolved.unknown.includes(code) || resolved.data.length === 0) {
      return data({
        intent: "check" as const,
        ok: true as const,
        status: "unknown" as const,
        code
      });
    }

    const piece = resolved.data[0];
    if (piece.variantItemId !== lineItemId) {
      return data({
        intent: "check" as const,
        ok: true as const,
        status: "wrongSku" as const,
        code,
        scannedLabel: piece.attributeLabel ?? piece.variantItemId
      });
    }

    return data({
      intent: "check" as const,
      ok: true as const,
      status: "match" as const,
      code
    });
  }

  const transfer = await getStockTransfer(client, id);
  await requireUnlocked({
    request,
    isLocked: transfer.data?.status === "Completed",
    redirectTo: path.to.stockTransfer(id),
    message: "Cannot pick from a completed stock transfer."
  });

  if (!["Released", "In Progress"].includes(transfer.data?.status ?? "")) {
    return data(
      { intent, ok: false as const, message: "Stock transfer is not pickable" },
      await flash(request, error(null, "Stock transfer is not pickable"))
    );
  }

  const locationId = String(
    formData.get("locationId") ?? transfer.data?.locationId ?? ""
  ).trim();

  // Shrink planned qty to already-picked ("只调度已扫").
  if (intent === "settleScanned") {
    if (alreadyPicked <= 0) {
      return data(
        { intent, ok: false as const, message: "Nothing scanned yet" },
        await flash(request, error(null, "Nothing scanned yet"))
      );
    }
    if (alreadyPicked >= planned) {
      return data({
        intent: "settleScanned" as const,
        ok: true as const,
        quantity: planned,
        pickedQuantity: alreadyPicked,
        remaining: 0
      });
    }

    const updated = await client
      .from("stockTransferLine")
      .update({
        quantity: alreadyPicked,
        updatedBy: userId,
        updatedAt: new Date().toISOString()
      })
      .eq("id", lineId)
      .eq("companyId", companyId)
      .select("quantity, pickedQuantity")
      .single();

    if (updated.error) {
      return data(
        { intent, ok: false as const, message: "Failed to settle line qty" },
        await flash(request, error(updated.error, "Failed to settle line qty"))
      );
    }

    try {
      await trigger(client, "stock-transfer-status", { stockTransferId: id });
    } catch {
      // Status job is best-effort; pick/settle must not fail if Inngest is down.
    }

    return data(
      {
        intent: "settleScanned" as const,
        ok: true as const,
        quantity: updated.data?.quantity ?? alreadyPicked,
        pickedQuantity: updated.data?.pickedQuantity ?? alreadyPicked,
        remaining: 0
      },
      await flash(
        request,
        success(`Settled line to scanned qty ${alreadyPicked}`)
      )
    );
  }

  if (remaining <= 0) {
    return data(
      { intent, ok: false as const, message: "Line already fully picked" },
      await flash(request, error(null, "Line already fully picked"))
    );
  }

  // Manual remainder pick: operator types a qty (no name recorded).
  if (intent === "manualPick") {
    const qty = Number(formData.get("quantity") ?? 0);
    if (!Number.isFinite(qty) || qty <= 0 || qty > remaining) {
      return data(
        {
          intent,
          ok: false as const,
          message: `Enter 1–${remaining}`
        },
        await flash(request, error(null, `Enter 1–${remaining}`))
      );
    }

    const { error: functionError } = await postInventoryPick(client, {
      stockTransferId: id,
      stockTransferLineId: lineId,
      quantity: qty,
      locationId,
      userId,
      companyId
    });

    if (functionError) {
      return data(
        {
          intent,
          ok: false as const,
          message: functionError.message || "Manual pick failed"
        },
        await flash(
          request,
          error(
            functionError.message || "Manual pick failed",
            "Failed to pick line"
          )
        )
      );
    }

    try {
      await trigger(client, "stock-transfer-status", { stockTransferId: id });
    } catch {
      // Status job is best-effort; pick must not fail if Inngest is down.
    }

    const newPicked = alreadyPicked + qty;
    return data(
      {
        intent: "manualPick" as const,
        ok: true as const,
        quantity: planned,
        pickedQuantity: newPicked,
        remaining: Math.max(0, planned - newPicked)
      },
      await flash(request, success(`Manually picked ${qty}`))
    );
  }

  // Scan pick: post matching unique EPC count (partial OK, capped by remaining).
  if (intent === "scanPick") {
    const rawCodes = formData.getAll("code").map(String);
    const uniqueCodes = normalizeScannedExternalCodes(rawCodes);
    const resolved = await resolveGarmentPiecesByScannedCodes(
      client,
      uniqueCodes,
      companyId
    );
    if (resolved.error) {
      return data(
        { intent, ok: false as const, message: "Failed to resolve scans" },
        await flash(request, error(resolved.error, "Failed to resolve scans"))
      );
    }

    const resolvedByCode: Record<string, { variantItemId: string }> = {};
    for (const piece of resolved.data) {
      resolvedByCode[piece.scannedCode] = {
        variantItemId: piece.variantItemId
      };
    }

    const tally = tallyLineGarmentPickScans({
      rawCodes: uniqueCodes,
      resolvedByCode,
      unknownCodes: resolved.unknown,
      lineItemId,
      // Gate on matchingCount > 0 separately; planned here is remaining cap.
      plannedQuantity: remaining
    });

    if (
      tally.matchingCount <= 0 ||
      tally.wrongSkuCodes.length > 0 ||
      tally.unknownCodes.length > 0
    ) {
      return data(
        {
          intent: "scanPick" as const,
          ok: false as const,
          matchingCount: tally.matchingCount,
          remaining,
          wrongSkuCodes: tally.wrongSkuCodes,
          unknownCodes: tally.unknownCodes,
          message:
            tally.matchingCount <= 0
              ? "No matching chips to pick"
              : "Remove wrong/unknown codes before confirming"
        },
        await flash(
          request,
          error(
            null,
            tally.matchingCount <= 0
              ? "No matching chips to pick"
              : "Remove wrong/unknown codes before confirming"
          )
        )
      );
    }

    const qty = Math.min(tally.matchingCount, remaining);

    const { error: functionError } = await postInventoryPick(client, {
      stockTransferId: id,
      stockTransferLineId: lineId,
      quantity: qty,
      locationId,
      userId,
      companyId
    });

    if (functionError) {
      return data(
        {
          intent: "scanPick" as const,
          ok: false as const,
          message: functionError.message || "Pick failed"
        },
        await flash(
          request,
          error(functionError.message || "Pick failed", "Failed to pick line")
        )
      );
    }

    try {
      await trigger(client, "stock-transfer-status", { stockTransferId: id });
    } catch {
      // Status job is best-effort; pick must not fail if Inngest is down.
    }

    const newPicked = alreadyPicked + qty;
    return data(
      {
        intent: "scanPick" as const,
        ok: true as const,
        quantity: planned,
        pickedQuantity: newPicked,
        remaining: Math.max(0, planned - newPicked)
      },
      await flash(request, success(`Scanned pick +${qty}`))
    );
  }

  return data({ intent, ok: false as const, message: "Unknown intent" });
}

type CheckActionData = {
  intent: "check";
  ok: boolean;
  status: "match" | "wrongSku" | "unknown" | "empty";
  code: string;
  scannedLabel?: string | null;
  message?: string;
};

type MutateActionData = {
  intent?: "scanPick" | "manualPick" | "settleScanned";
  ok: boolean;
  message?: string;
  quantity?: number;
  pickedQuantity?: number;
  remaining?: number;
  matchingCount?: number;
  wrongSkuCodes?: string[];
  unknownCodes?: string[];
};

type ScanWarning = {
  code: string;
  reason: "wrongSku" | "unknown";
  scannedLabel?: string | null;
};

export default function StockTransferGarmentPickRoute() {
  const { t } = useLingui();
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const { id, lineId } = useParams();
  if (!id) throw new Error("id is not found");
  if (!lineId) throw new Error("lineId is not found");

  const loaderData = useLoaderData<typeof loader>();
  const routeData = useRouteData<{
    stockTransfer: StockTransfer;
    stockTransferLines: StockTransferLine[];
  }>(path.to.stockTransfer(id));

  const pickFetcher = useFetcher<MutateActionData>();
  const checkFetcher = useFetcher<CheckActionData>();
  const inputRef = useRef<HTMLInputElement>(null);
  const lastChecked = useRef("");
  const [draft, setDraft] = useState("");
  const [acceptedCodes, setAcceptedCodes] = useState<string[]>([]);
  const [warning, setWarning] = useState<ScanWarning | null>(null);
  const [manualQty, setManualQty] = useState<number>(
    loaderData.remaining > 0 ? loaderData.remaining : 1
  );
  const [pickedQuantity, setPickedQuantity] = useState(
    loaderData.pickedQuantity
  );
  const [quantity, setQuantity] = useState(loaderData.quantity);
  const remaining = Math.max(0, quantity - pickedQuantity);

  useEffect(() => {
    setPickedQuantity(loaderData.pickedQuantity);
    setQuantity(loaderData.quantity);
    setManualQty(loaderData.remaining > 0 ? loaderData.remaining : 1);
  }, [loaderData.pickedQuantity, loaderData.quantity, loaderData.remaining]);

  const lineLabel = [
    loaderData.itemReadableId,
    ...(loaderData.attributeLabels ?? [])
  ]
    .filter(Boolean)
    .join(" / ");

  const focusInput = useCallback(() => {
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  useEffect(() => {
    if (pickFetcher.state !== "idle" || !pickFetcher.data) return;
    if (pickFetcher.data.intent === "check") return;
    if (!pickFetcher.data.ok) {
      toast.error(pickFetcher.data.message ?? t`操作失败`);
      focusInput();
      return;
    }
    toast.success(pickFetcher.data.message ?? t`已更新`);
    if (typeof pickFetcher.data.pickedQuantity === "number") {
      setPickedQuantity(pickFetcher.data.pickedQuantity);
    }
    if (typeof pickFetcher.data.quantity === "number") {
      setQuantity(pickFetcher.data.quantity);
    }
    setAcceptedCodes([]);
    setManualQty(Math.max(1, pickFetcher.data.remaining ?? 0) || 1);
    revalidator.revalidate();
    focusInput();
  }, [pickFetcher.state, pickFetcher.data, focusInput, revalidator, t]);

  useEffect(() => {
    if (checkFetcher.state !== "idle" || !checkFetcher.data) return;
    if (checkFetcher.data.intent !== "check") return;
    const result = checkFetcher.data;
    if (!result.code || result.code === lastChecked.current) return;
    lastChecked.current = result.code;

    if (result.status === "match") {
      setAcceptedCodes((prev) =>
        prev.includes(result.code) ? prev : [...prev, result.code]
      );
      focusInput();
      return;
    }

    if (result.status === "wrongSku" || result.status === "unknown") {
      setWarning({
        code: result.code,
        reason: result.status,
        scannedLabel: result.scannedLabel
      });
    }
  }, [checkFetcher.state, checkFetcher.data, focusInput]);

  const onClose = () => navigate(path.to.stockTransfer(id));

  const submitCheck = (value: string) => {
    const code = value.trim();
    if (!code) return;
    if (acceptedCodes.includes(code)) {
      toast.error(t`该芯片已计入`);
      setDraft("");
      focusInput();
      return;
    }
    if (remaining <= 0) {
      toast.error(t`本行已拣满`);
      return;
    }
    if (acceptedCodes.length >= remaining) {
      toast.error(t`本轮扫描已达剩余数量，请先确认`);
      return;
    }
    if (warning) return;
    lastChecked.current = "";
    setDraft("");
    const form = new FormData();
    form.set("intent", "check");
    form.set("code", code);
    checkFetcher.submit(form, {
      method: "post",
      action: path.to.stockTransferGarmentPick(id, lineId)
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    submitCheck(draft);
  };

  const clearScan = () => {
    setAcceptedCodes([]);
    setDraft("");
    setWarning(null);
    lastChecked.current = "";
    focusInput();
  };

  const dismissWarning = () => {
    setWarning(null);
    focusInput();
  };

  const locationId = routeData?.stockTransfer?.locationId ?? "";
  const mutating = pickFetcher.state !== "idle";
  const checking = checkFetcher.state !== "idle";

  const submitScanPick = () => {
    if (acceptedCodes.length === 0) {
      toast.error(t`请先扫描本行规格芯片`);
      return;
    }
    const form = new FormData();
    form.set("intent", "scanPick");
    form.set("locationId", locationId);
    for (const code of acceptedCodes) {
      form.append("code", code);
    }
    pickFetcher.submit(form, {
      method: "post",
      action: path.to.stockTransferGarmentPick(id, lineId)
    });
  };

  const submitManualPick = () => {
    if (remaining <= 0) return;
    if (
      !Number.isFinite(manualQty) ||
      manualQty <= 0 ||
      manualQty > remaining
    ) {
      toast.error(t`人工数量须在 1–${remaining}`);
      return;
    }
    const form = new FormData();
    form.set("intent", "manualPick");
    form.set("locationId", locationId);
    form.set("quantity", String(manualQty));
    pickFetcher.submit(form, {
      method: "post",
      action: path.to.stockTransferGarmentPick(id, lineId)
    });
  };

  const submitSettle = () => {
    if (pickedQuantity <= 0) {
      toast.error(t`还没有已扫数量`);
      return;
    }
    const form = new FormData();
    form.set("intent", "settleScanned");
    form.set("locationId", locationId);
    pickFetcher.submit(form, {
      method: "post",
      action: path.to.stockTransferGarmentPick(id, lineId)
    });
  };

  return (
    <>
      <Modal
        open
        onOpenChange={(open) => {
          if (!open && !warning) onClose();
        }}
      >
        <ModalContent size="large">
          <ModalHeader>
            <ModalTitle>{t`扫码拣货`}</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <p className="text-sm text-muted-foreground">
                {t`可多次扫码确认；剩余可用人工补数，或选择只调度已扫货物。规格不符点跳过不计入。`}
              </p>
              <div className="rounded border p-3 text-sm space-y-1">
                <div className="font-medium">
                  {lineLabel || loaderData.itemId}
                </div>
                <div className="tabular-nums text-muted-foreground">
                  {t`计划`} {quantity} · {t`已拣`} {pickedQuantity} ·{" "}
                  {t`未调度`} {remaining}
                </div>
              </div>

              <VStack spacing={2} className="w-full">
                <HStack className="justify-between w-full text-sm">
                  <span>
                    {t`本轮已匹配`}{" "}
                    <span className="font-semibold tabular-nums">
                      {acceptedCodes.length}
                    </span>
                    {remaining > 0 ? (
                      <>
                        {" / "}
                        <span className="tabular-nums">{remaining}</span>
                      </>
                    ) : null}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<LuRotateCcw />}
                    onClick={clearScan}
                    isDisabled={
                      (acceptedCodes.length === 0 && !warning) || mutating
                    }
                  >
                    {t`清空本轮`}
                  </Button>
                </HStack>
                <Input
                  ref={inputRef}
                  value={draft}
                  autoFocus
                  placeholder={t`等待 PDA 读入 EPC…`}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={onKeyDown}
                  isDisabled={
                    mutating || checking || Boolean(warning) || remaining <= 0
                  }
                />
                {acceptedCodes.length > 0 ? (
                  <div className="max-h-32 overflow-auto rounded border p-2 font-mono text-xs space-y-1 w-full">
                    {acceptedCodes.map((code) => (
                      <div key={code}>{code}</div>
                    ))}
                  </div>
                ) : null}
                <Button
                  variant="primary"
                  leftIcon={<LuNfc />}
                  onClick={submitScanPick}
                  isLoading={mutating}
                  isDisabled={
                    acceptedCodes.length === 0 || mutating || remaining <= 0
                  }
                >
                  {t`确认本轮扫码`}
                </Button>
              </VStack>

              {remaining > 0 ? (
                <VStack spacing={2} className="w-full border-t pt-4">
                  <p className="text-sm font-medium">{t`剩余未调度`}</p>
                  <HStack className="w-full items-end gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground">
                        {t`人工确认件数`}
                      </label>
                      <NumberField
                        value={manualQty}
                        onChange={(v) => {
                          if (Number.isFinite(v)) setManualQty(v);
                        }}
                        minValue={1}
                        maxValue={Math.max(1, remaining)}
                        isDisabled={mutating}
                      >
                        <NumberInput />
                      </NumberField>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={submitManualPick}
                      isLoading={mutating}
                      isDisabled={mutating || remaining <= 0}
                    >
                      {t`人工确认`}
                    </Button>
                  </HStack>
                  {pickedQuantity > 0 ? (
                    <Button
                      variant="ghost"
                      onClick={submitSettle}
                      isDisabled={mutating || remaining <= 0}
                    >
                      {t`只调度已扫货物`}
                    </Button>
                  ) : null}
                </VStack>
              ) : (
                <p className="text-sm text-emerald-700">{t`本行已拣满`}</p>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={onClose} isDisabled={mutating}>
              {t`关闭`}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {warning ? (
        <Modal open onOpenChange={() => undefined}>
          <ModalContent size="small">
            <ModalHeader>
              <ModalTitle>
                {warning.reason === "wrongSku" ? t`规格不符` : t`未识别芯片`}
              </ModalTitle>
            </ModalHeader>
            <ModalBody>
              <VStack spacing={2}>
                <p className="text-sm">
                  {warning.reason === "wrongSku"
                    ? t`扫到的水洗唛不是本行要调度的规格，已不计入。`
                    : t`扫到的码无法识别为已绑定水洗唛，已不计入。`}
                </p>
                <p className="font-mono text-xs break-all">{warning.code}</p>
                {warning.reason === "wrongSku" && warning.scannedLabel ? (
                  <p className="text-sm text-muted-foreground">
                    {t`扫到`}: {warning.scannedLabel}
                  </p>
                ) : null}
                <p className="text-sm text-muted-foreground">
                  {t`本行需要`}: {lineLabel || loaderData.itemId}
                </p>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="primary" onClick={dismissWarning}>
                {t`跳过`}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ) : null}
    </>
  );
}
