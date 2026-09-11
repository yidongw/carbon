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
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
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
import { LuRotateCcw } from "react-icons/lu";
import { useFetcher, useRevalidator } from "react-router";
import StorageUnit from "~/components/Form/StorageUnit";
import { normalizeScannedExternalCodes } from "~/modules/production";
import { path } from "~/utils/path";

type ReviewLine = {
  variantItemId: string;
  counted: number;
  onHand: number;
  readableId?: string;
};

type ScanCountActionData =
  | {
      intent: "review";
      ok: true;
      lines: ReviewLine[];
      foreignCodes: string[];
      unknownCodes: string[];
      inScopeCount: number;
    }
  | {
      intent: "commit";
      ok: boolean;
      committed?: boolean;
      failed?: string[];
      updated?: number;
      message?: string;
    }
  | {
      intent: string;
      ok: false;
      message?: string;
    };

type ScanCountModalProps = {
  itemId: string;
  locationId: string;
  /** Prefill when opened from a storage-unit row. */
  initialStorageUnitId?: string | null;
  storageUnitOptions: { value: string; label: string }[];
  onClose: () => void;
};

/**
 * Style UHF piece count for one storage unit. PDA bulk-reads EPCs; confirm
 * posts Set Quantity per SKU and zeros unscanned family stock in that bin.
 */
const ScanCountModal = ({
  itemId,
  locationId,
  initialStorageUnitId = null,
  storageUnitOptions,
  onClose
}: ScanCountModalProps) => {
  const { t } = useLingui();
  const revalidator = useRevalidator();
  const fetcher = useFetcher<ScanCountActionData>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState("");
  const [rawCodes, setRawCodes] = useState<string[]>([]);
  const [storageUnitId, setStorageUnitId] = useState<string | null>(
    initialStorageUnitId
  );
  const [reviewLines, setReviewLines] = useState<ReviewLine[] | null>(null);
  const [foreignCodes, setForeignCodes] = useState<string[]>([]);
  const [unknownCodes, setUnknownCodes] = useState<string[]>([]);

  const uniqueCodes = useMemo(
    () => normalizeScannedExternalCodes(rawCodes),
    [rawCodes]
  );

  const storageUnitLabel =
    storageUnitOptions.find((s) => s.value === storageUnitId)?.label ??
    storageUnitId ??
    "";

  const focusInput = useCallback(() => {
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if (!fetcher.data.ok) {
      toast.error(fetcher.data.message ?? t`盘点失败`);
      focusInput();
      return;
    }
    if (fetcher.data.intent === "review") {
      setReviewLines(fetcher.data.lines);
      setForeignCodes(fetcher.data.foreignCodes);
      setUnknownCodes(fetcher.data.unknownCodes);
      return;
    }
    if (fetcher.data.intent === "commit" && fetcher.data.ok) {
      toast.success(t`扫码盘点已过账`);
      revalidator.revalidate();
      onClose();
    }
  }, [fetcher.state, fetcher.data, focusInput, onClose, revalidator, t]);

  const addCode = (value: string) => {
    const code = value.trim();
    if (!code) return;
    setRawCodes((prev) => [...prev, code]);
    setDraft("");
    setReviewLines(null);
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
    setReviewLines(null);
    setForeignCodes([]);
    setUnknownCodes([]);
    focusInput();
  };

  const buildForm = (intent: "review" | "commit") => {
    const form = new FormData();
    form.set("intent", intent);
    form.set("locationId", locationId);
    form.set("storageUnitId", storageUnitId ?? "");
    for (const code of uniqueCodes) {
      form.append("code", code);
    }
    return form;
  };

  const submitReview = () => {
    if (!storageUnitId) {
      toast.error(t`请选择存储单元`);
      return;
    }
    fetcher.submit(buildForm("review"), {
      method: "post",
      action: path.to.inventoryItemScanCount(itemId)
    });
  };

  const submitCommit = () => {
    if (!storageUnitId || !reviewLines) return;
    fetcher.submit(buildForm("commit"), {
      method: "post",
      action: path.to.inventoryItemScanCount(itemId)
    });
  };

  const busy = fetcher.state !== "idle";

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <ModalContent size="large">
        <ModalHeader>
          <ModalTitle>{t`扫码盘点`}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <p className="text-sm text-muted-foreground">
              {t`选择存储单元后，用 UHF PDA 批量读取本款水洗唛芯片。确认过账会按件写入该货位，并将本款未扫到的 SKU 清零。`}
            </p>
            <StorageUnit
              locationId={locationId}
              label={t`存储单元`}
              value={storageUnitId}
              onChange={(unit) => {
                setStorageUnitId(unit?.id ?? null);
                setReviewLines(null);
              }}
            />
            {storageUnitId ? (
              <p className="text-xs text-muted-foreground">
                {t`当前货位`}: {storageUnitLabel}
              </p>
            ) : null}
            <HStack className="justify-between w-full text-sm">
              <span>
                {t`已读唯一芯片`}{" "}
                <span className="font-semibold tabular-nums">
                  {uniqueCodes.length}
                </span>
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
              isDisabled={busy || !storageUnitId}
            />
            {uniqueCodes.length > 0 ? (
              <div className="max-h-32 overflow-auto rounded border p-2 font-mono text-xs space-y-1">
                {uniqueCodes.map((code) => (
                  <div key={code}>{code}</div>
                ))}
              </div>
            ) : null}
            {foreignCodes.length > 0 || unknownCodes.length > 0 ? (
              <VStack spacing={1} className="text-xs text-red-600">
                {unknownCodes.length > 0 ? (
                  <span>
                    {t`未识别`} ({unknownCodes.length}):{" "}
                    {unknownCodes.slice(0, 5).join(", ")}
                    {unknownCodes.length > 5 ? "…" : ""}
                  </span>
                ) : null}
                {foreignCodes.length > 0 ? (
                  <span>
                    {t`非本款`} ({foreignCodes.length}):{" "}
                    {foreignCodes.slice(0, 5).join(", ")}
                    {foreignCodes.length > 5 ? "…" : ""}
                  </span>
                ) : null}
              </VStack>
            ) : null}
            {reviewLines ? (
              <Table>
                <Thead>
                  <Tr>
                    <Th>{t`SKU`}</Th>
                    <Th className="text-right">{t`账面`}</Th>
                    <Th className="text-right">{t`实盘`}</Th>
                    <Th className="text-right">{t`差异`}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {reviewLines.map((line) => {
                    const diff = line.counted - line.onHand;
                    return (
                      <Tr key={line.variantItemId}>
                        <Td className="font-mono text-xs">
                          {line.readableId ?? line.variantItemId}
                        </Td>
                        <Td className="text-right tabular-nums">
                          {line.onHand}
                        </Td>
                        <Td className="text-right tabular-nums">
                          {line.counted}
                        </Td>
                        <Td className="text-right tabular-nums">{diff}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            ) : null}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={onClose} isDisabled={busy}>
            {t`取消`}
          </Button>
          {reviewLines ? (
            <Button
              variant="primary"
              onClick={submitCommit}
              isLoading={busy}
              isDisabled={busy || !storageUnitId}
            >
              {t`确认过账`}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={submitReview}
              isLoading={busy}
              isDisabled={busy || !storageUnitId}
            >
              {t`审阅`}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ScanCountModal;
