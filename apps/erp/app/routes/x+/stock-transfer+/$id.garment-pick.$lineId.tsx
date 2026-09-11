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
  useMemo,
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

  const transfer = await getStockTransfer(client, id);
  await requireUnlocked({
    request,
    isLocked: transfer.data?.status === "Completed",
    redirectTo: path.to.stockTransfer(id),
    message: "Cannot pick from a completed stock transfer."
  });

  if (!["Released", "In Progress"].includes(transfer.data?.status ?? "")) {
    return data(
      { ok: false as const, message: "Stock transfer is not pickable" },
      await flash(request, error(null, "Stock transfer is not pickable"))
    );
  }

  const formData = await request.formData();
  const rawCodes = formData.getAll("code").map(String);
  const locationId = String(
    formData.get("locationId") ?? transfer.data?.locationId ?? ""
  ).trim();

  const line = await client
    .from("stockTransferLine")
    .select("*")
    .eq("id", lineId)
    .eq("stockTransferId", id)
    .single();
  if (line.error || !line.data) {
    return data(
      { ok: false as const, message: "Line not found" },
      await flash(request, error(line.error, "Line not found"))
    );
  }

  const planned = line.data.quantity ?? 0;
  if (planned <= 0) {
    return data(
      { ok: false as const, message: "Invalid line quantity" },
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
      { ok: false as const, message: "Failed to resolve scans" },
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
    lineItemId: line.data.itemId,
    plannedQuantity: planned
  });

  if (!tally.canConfirm) {
    return data(
      {
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
      { ok: false as const, message: functionError.message || "Pick failed" },
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

type ActionData = {
  ok: boolean;
  message?: string;
  matchingCount?: number;
  plannedQuantity?: number;
  wrongSkuCodes?: string[];
  unknownCodes?: string[];
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

  const fetcher = useFetcher<ActionData>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState("");
  const [rawCodes, setRawCodes] = useState<string[]>([]);

  const uniqueCodes = useMemo(
    () => normalizeScannedExternalCodes(rawCodes),
    [rawCodes]
  );

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
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if (!fetcher.data.ok) {
      toast.error(fetcher.data.message ?? t`扫码拣货失败`);
      focusInput();
    }
  }, [fetcher.state, fetcher.data, focusInput, t]);

  const onClose = () => navigate(path.to.stockTransfer(id));

  const addCode = (value: string) => {
    const code = value.trim();
    if (!code) return;
    setRawCodes((prev) => [...prev, code]);
    setDraft("");
    focusInput();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    addCode(draft);
  };

  const clearScan = () => {
    setRawCodes([]);
    setDraft("");
    focusInput();
  };

  const planned = loaderData.quantity;
  // Client-side gate uses unique count only; server re-validates SKU match.
  const canConfirm =
    planned > 0 && uniqueCodes.length === planned && fetcher.state === "idle";

  const submitPick = () => {
    if (!canConfirm) {
      toast.error(t`须扫满 ${planned} 件本行规格的水洗唛`);
      return;
    }
    const form = new FormData();
    form.set("locationId", routeData?.stockTransfer?.locationId ?? "");
    for (const code of uniqueCodes) {
      form.append("code", code);
    }
    fetcher.submit(form, {
      method: "post",
      action: path.to.stockTransferGarmentPick(id, lineId)
    });
  };

  const busy = fetcher.state !== "idle";
  const wrongFromAction = fetcher.data?.wrongSkuCodes ?? [];
  const unknownFromAction = fetcher.data?.unknownCodes ?? [];

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <ModalContent size="medium">
        <ModalHeader>
          <ModalTitle>{t`扫码拣货`}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <p className="text-sm text-muted-foreground">
              {t`成衣须用水洗唛 UHF 扫码确认。唯一芯片数须等于本行数量，且规格须匹配。`}
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
                {t`已读唯一芯片`}{" "}
                <span className="font-semibold tabular-nums">
                  {uniqueCodes.length}
                </span>
                {" / "}
                <span className="tabular-nums">{planned}</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<LuRotateCcw />}
                onClick={clearScan}
                isDisabled={rawCodes.length === 0 || busy}
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
            {uniqueCodes.length > 0 ? (
              <div className="max-h-40 overflow-auto rounded border p-2 font-mono text-xs space-y-1">
                {uniqueCodes.map((code) => (
                  <div key={code}>{code}</div>
                ))}
              </div>
            ) : null}
            {unknownFromAction.length > 0 || wrongFromAction.length > 0 ? (
              <VStack spacing={1} className="text-xs text-red-600">
                {unknownFromAction.length > 0 ? (
                  <span>
                    {t`未识别`} ({unknownFromAction.length}):{" "}
                    {unknownFromAction.slice(0, 5).join(", ")}
                    {unknownFromAction.length > 5 ? "…" : ""}
                  </span>
                ) : null}
                {wrongFromAction.length > 0 ? (
                  <span>
                    {t`规格不符`} ({wrongFromAction.length}):{" "}
                    {wrongFromAction.slice(0, 5).join(", ")}
                    {wrongFromAction.length > 5 ? "…" : ""}
                  </span>
                ) : null}
              </VStack>
            ) : null}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={onClose} isDisabled={busy}>
            {t`取消`}
          </Button>
          <Button
            variant="primary"
            leftIcon={<LuNfc />}
            onClick={submitPick}
            isLoading={busy}
            isDisabled={!canConfirm}
          >
            {t`确认拣货`}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
