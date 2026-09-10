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
import { useFetcher, useRevalidator } from "react-router";
import { normalizeScannedExternalCodes } from "~/modules/production";
import { path } from "~/utils/path";

type BindCareLabelChipsModalProps = {
  bundleWorkOrderId: string;
  expectedCount: number;
  onClose: () => void;
};

type BindActionData = {
  ok: boolean;
  bound: number;
  reason?: string;
  uniqueCount?: number;
  expectedCount?: number;
};

/**
 * Handheld UHF PDA bulk-bind: keyboard-wedge EPCs accumulate here until the
 * unique count matches the bundle's system codes, then Confirm posts the bind.
 */
const BindCareLabelChipsModal = ({
  bundleWorkOrderId,
  expectedCount,
  onClose
}: BindCareLabelChipsModalProps) => {
  const { t } = useLingui();
  const revalidator = useRevalidator();
  const fetcher = useFetcher<BindActionData>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState("");
  const [rawCodes, setRawCodes] = useState<string[]>([]);

  const uniqueCodes = useMemo(
    () => normalizeScannedExternalCodes(rawCodes),
    [rawCodes]
  );

  const focusInput = useCallback(() => {
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if (fetcher.data.ok) {
      toast.success(t`已绑定 ${fetcher.data.bound} 件`);
      revalidator.revalidate();
      onClose();
      return;
    }
    // Keep collected codes so the operator can clear and re-scan.
    focusInput();
  }, [fetcher.state, fetcher.data, focusInput, onClose, revalidator, t]);

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

  const canConfirm =
    expectedCount > 0 &&
    uniqueCodes.length === expectedCount &&
    fetcher.state === "idle";

  const submitBind = () => {
    if (!canConfirm) {
      toast.error(
        uniqueCodes.length < expectedCount
          ? t`数量不足，请重新扫描`
          : uniqueCodes.length > expectedCount
            ? t`数量过多，请重新扫描`
            : t`请先生成系统编码`
      );
      return;
    }
    const form = new FormData();
    form.set("bundleWorkOrderId", bundleWorkOrderId);
    for (const code of uniqueCodes) {
      form.append("externalCode", code);
    }
    fetcher.submit(form, {
      method: "post",
      action: path.to.rfidCodesBind
    });
  };

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <ModalContent size="medium">
        <ModalHeader>
          <ModalTitle>{t`水洗唛扫码绑定`}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <p className="text-sm text-muted-foreground">
              {t`用 UHF PDA 对本扎批量读芯片。读到的唯一数量须等于系统编码件数，再确认绑定。`}
            </p>
            <HStack className="justify-between w-full text-sm">
              <span>
                {t`已读唯一芯片`}{" "}
                <span className="font-semibold tabular-nums">
                  {uniqueCodes.length}
                </span>
                {" / "}
                <span className="tabular-nums">{expectedCount}</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<LuRotateCcw />}
                onClick={clearScan}
                isDisabled={rawCodes.length === 0 || fetcher.state !== "idle"}
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
              isDisabled={fetcher.state !== "idle"}
            />
            {uniqueCodes.length > 0 ? (
              <div className="max-h-40 overflow-auto rounded border p-2 font-mono text-xs space-y-1">
                {uniqueCodes.map((code) => (
                  <div key={code}>{code}</div>
                ))}
              </div>
            ) : null}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={onClose}>
            {t`Cancel`}
          </Button>
          <Button
            leftIcon={<LuNfc />}
            onClick={submitBind}
            isLoading={fetcher.state !== "idle"}
            isDisabled={!canConfirm}
          >
            {t`确认绑定`}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BindCareLabelChipsModal;
