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
  useParams
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
 * Style garment pick: bulk UHF EPC must match this line's variant SKU and equal
 * planned quantity before posting Transfer via post-stock-transfer inventory.
 */
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

  return {
    lineId,
    itemId: line.data.itemId,
    quantity: line.data.quantity ?? 0,
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
  const intent = String(formData.get("intent") ?? "pick");

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
  const lineItemId = line.data.itemId;

  // Single-code check for live scan feedback (wrong SKU → warning + skip).
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

  const rawCodes = formData.getAll("code").map(String);
  const locationId = String(
    formData.get("locationId") ?? transfer.data?.locationId ?? ""
  ).trim();

  if (planned <= 0) {
    return data(
      { intent, ok: false as const, message: "Invalid line quantity" },
      await flash(request, error(null, "Invalid line quantity"))
    );
  }

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
    plannedQuantity: planned
  });

  if (!tally.canConfirm) {
    return data(
      {
        intent: "pick" as const,
        ok: false as const,
        matchingCount: tally.matchingCount,
        plannedQuantity: planned,
        wrongSkuCodes: tally.wrongSkuCodes,
        unknownCodes: tally.unknownCodes,
        message: `Need ${planned} matching chips; have ${tally.matchingCount}`
      },
      await flash(
        request,
        error(
          null,
          `Need ${planned} matching chips; have ${tally.matchingCount}`
        )
      )
    );
  }

  const { error: functionError } = await client.functions.invoke(
    "post-stock-transfer",
    {
      body: JSON.stringify({
        type: "inventory",
        stockTransferId: id,
        stockTransferLineId: lineId,
        quantity: planned,
        locationId,
        userId,
        companyId
      })
    }
  );

  if (functionError) {
    return data(
      {
        intent: "pick" as const,
        ok: false as const,
        message: functionError.message || "Pick failed"
      },
      await flash(
        request,
        error(functionError.message || "Pick failed", "Failed to pick line")
      )
    );
  }

  await trigger(client, "stock-transfer-status", { stockTransferId: id });

  throw redirect(
    path.to.stockTransfer(id),
    await flash(request, success(`Picked ${planned} via care-label scan`))
  );
}

type CheckActionData = {
  intent: "check";
  ok: boolean;
  status: "match" | "wrongSku" | "unknown" | "empty";
  code: string;
  scannedLabel?: string | null;
  message?: string;
};

type PickActionData = {
  intent?: "pick";
  ok: boolean;
  message?: string;
  matchingCount?: number;
  plannedQuantity?: number;
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
  const { id, lineId } = useParams();
  if (!id) throw new Error("id is not found");
  if (!lineId) throw new Error("lineId is not found");

  const loaderData = useLoaderData<typeof loader>();
  const routeData = useRouteData<{
    stockTransfer: StockTransfer;
    stockTransferLines: StockTransferLine[];
  }>(path.to.stockTransfer(id));

  const pickFetcher = useFetcher<PickActionData>();
  const checkFetcher = useFetcher<CheckActionData>();
  const inputRef = useRef<HTMLInputElement>(null);
  const lastChecked = useRef("");
  const [draft, setDraft] = useState("");
  const [acceptedCodes, setAcceptedCodes] = useState<string[]>([]);
  const [warning, setWarning] = useState<ScanWarning | null>(null);

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
      toast.error(pickFetcher.data.message ?? t`扫码拣货失败`);
      focusInput();
    }
  }, [pickFetcher.state, pickFetcher.data, focusInput, t]);

  // Apply single-code check result: match → accept; wrong/unknown → warning modal.
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
    if (warning) return; // must dismiss warning first
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

  const planned = loaderData.quantity;
  const canConfirm =
    planned > 0 &&
    acceptedCodes.length === planned &&
    pickFetcher.state === "idle" &&
    !warning;

  const submitPick = () => {
    if (!canConfirm) {
      toast.error(t`须扫满 ${planned} 件本行规格的水洗唛`);
      return;
    }
    const form = new FormData();
    form.set("intent", "pick");
    form.set("locationId", routeData?.stockTransfer?.locationId ?? "");
    for (const code of acceptedCodes) {
      form.append("code", code);
    }
    pickFetcher.submit(form, {
      method: "post",
      action: path.to.stockTransferGarmentPick(id, lineId)
    });
  };

  const busy =
    pickFetcher.state !== "idle" ||
    checkFetcher.state !== "idle" ||
    Boolean(warning);

  return (
    <>
      <Modal
        open
        onOpenChange={(open) => {
          if (!open && !warning) onClose();
        }}
      >
        <ModalContent size="medium">
          <ModalHeader>
            <ModalTitle>{t`扫码拣货`}</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <p className="text-sm text-muted-foreground">
                {t`成衣须用水洗唛 UHF 扫码确认。仅计入本行规格；不符或未识别会弹出警告，点跳过后继续扫。`}
              </p>
              <div className="rounded border p-3 text-sm space-y-1">
                <div className="font-medium">
                  {lineLabel || loaderData.itemId}
                </div>
                <div className="tabular-nums text-muted-foreground">
                  {t`计划数量`}: {planned}
                </div>
              </div>
              <HStack className="justify-between w-full text-sm">
                <span>
                  {t`已计入本行`}{" "}
                  <span className="font-semibold tabular-nums">
                    {acceptedCodes.length}
                  </span>
                  {" / "}
                  <span className="tabular-nums">{planned}</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<LuRotateCcw />}
                  onClick={clearScan}
                  isDisabled={
                    (acceptedCodes.length === 0 && !warning) ||
                    pickFetcher.state !== "idle"
                  }
                >
                  {t`重新扫描`}
                </Button>
              </HStack>
              <Input
                ref={inputRef}
                value={draft}
                autoFocus
                placeholder={t`等待 PDA 读入 EPC…`}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                isDisabled={busy}
              />
              {acceptedCodes.length > 0 ? (
                <div className="max-h-40 overflow-auto rounded border p-2 font-mono text-xs space-y-1">
                  {acceptedCodes.map((code) => (
                    <div key={code}>{code}</div>
                  ))}
                </div>
              ) : null}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="secondary"
              onClick={onClose}
              isDisabled={pickFetcher.state !== "idle"}
            >
              {t`取消`}
            </Button>
            <Button
              variant="primary"
              leftIcon={<LuNfc />}
              onClick={submitPick}
              isLoading={pickFetcher.state !== "idle"}
              isDisabled={!canConfirm}
            >
              {t`确认拣货`}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {warning ? (
        <Modal
          open
          onOpenChange={(open) => {
            // Must click 跳过 — ignore outside dismiss.
            if (!open) return;
          }}
        >
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
