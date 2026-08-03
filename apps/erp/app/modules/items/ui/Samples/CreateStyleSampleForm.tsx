import { ValidatedForm } from "@carbon/form";
import {
  Button,
  IconButton,
  Input,
  ModalBody,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useRef, useState } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { Hidden, Location, Submit } from "~/components/Form";
import StorageUnit from "~/components/Form/StorageUnit";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import { createStyleSampleValidator } from "~/modules/items";
import { path } from "~/utils/path";

type Option = { value: string; label: string };
type SampleLine = {
  key: string;
  colorId: string;
  size: string;
  quantity: number;
};

type CreateStyleSampleFormProps = {
  styleId: string;
  styleDisplayId: string;
  colorOptions: Option[];
  sizeOptions: Option[];
  defaultColorIds: string[];
  defaultSize: string;
  defaultLocationId: string;
} & Pick<OverlayFormInjectedProps, "onDismiss" | "fetcher" | "action">;

export default function CreateStyleSampleForm({
  styleId,
  styleDisplayId,
  colorOptions,
  sizeOptions,
  defaultColorIds,
  defaultSize,
  defaultLocationId,
  onDismiss,
  fetcher,
  action
}: CreateStyleSampleFormProps) {
  const { t } = useLingui();
  const keyRef = useRef(0);
  const nextKey = () => `row-${keyRef.current++}`;

  const [locationId, setLocationId] = useState<string>(defaultLocationId);
  const [lines, setLines] = useState<SampleLine[]>(() => {
    const seed = defaultColorIds.length
      ? defaultColorIds
      : [colorOptions[0]?.value ?? ""];
    return seed.map((colorId) => ({
      key: nextKey(),
      colorId,
      size: defaultSize,
      quantity: 1
    }));
  });

  const updateLine = (key: string, patch: Partial<SampleLine>) =>
    setLines((prev) =>
      prev.map((l) => (l.key === key ? { ...l, ...patch } : l))
    );
  const addLine = () =>
    setLines((prev) => [
      ...prev,
      {
        key: nextKey(),
        colorId: colorOptions[0]?.value ?? "",
        size: defaultSize,
        quantity: 1
      }
    ]);
  const removeLine = (key: string) =>
    setLines((prev) => prev.filter((l) => l.key !== key));

  const linesJson = JSON.stringify(
    lines.map(({ colorId, size, quantity }) => ({ colorId, size, quantity }))
  );

  // Modal overlays don't inject an action (only confirmMode:"server" does), so
  // post explicitly to the overlay route with ?overlay=true — that makes the
  // action return { ok: true } so the host closes + revalidates.
  const formAction =
    action ?? `${path.to.newStyleSample(styleId)}?overlay=true`;

  return (
    <ValidatedForm
      validator={createStyleSampleValidator}
      method="post"
      action={formAction}
      fetcher={fetcher}
      defaultValues={{
        styleId,
        locationId: defaultLocationId,
        storageUnitId: ""
      }}
      className="flex flex-col"
    >
      <ModalHeader className="pt-6">
        <ModalTitle>{t`Create Sample`}</ModalTitle>
        <ModalDescription>{styleDisplayId}</ModalDescription>
      </ModalHeader>
      <ModalBody>
        <Hidden name="styleId" />
        <Hidden name="lines" value={linesJson} />
        <div className="flex w-[34rem] max-w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[1fr_1fr_5.5rem_2rem] gap-2 text-xs font-medium text-muted-foreground">
              <span>{t`Color`}</span>
              <span>{t`Size`}</span>
              <span>{t`Quantity`}</span>
              <span />
            </div>
            {lines.map((line) => (
              <div
                key={line.key}
                className="grid grid-cols-[1fr_1fr_5.5rem_2rem] items-center gap-2"
              >
                <Select
                  value={line.colorId}
                  onValueChange={(value) =>
                    updateLine(line.key, { colorId: value })
                  }
                >
                  <SelectTrigger className="w-full max-w-full">
                    <SelectValue placeholder={t`Color`} />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={line.size}
                  onValueChange={(value) =>
                    updateLine(line.key, { size: value })
                  }
                >
                  <SelectTrigger className="w-full max-w-full">
                    <SelectValue placeholder={t`Size`} />
                  </SelectTrigger>
                  <SelectContent>
                    {sizeOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min={1}
                  value={String(line.quantity)}
                  onChange={(e) =>
                    updateLine(line.key, {
                      quantity: Math.max(1, +e.target.value || 1)
                    })
                  }
                />
                <IconButton
                  variant="ghost"
                  aria-label={t`Remove row`}
                  icon={<LuTrash2 />}
                  disabled={lines.length === 1}
                  onClick={() => removeLine(line.key)}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full justify-center border border-dashed border-border text-muted-foreground"
              leftIcon={<LuPlus />}
              onClick={addLine}
            >
              <Trans>Add row</Trans>
            </Button>
          </div>
          <Location
            name="locationId"
            label={t`Location`}
            onChange={(option) => setLocationId(option?.value ?? "")}
          />
          <StorageUnit
            name="storageUnitId"
            label={t`Storage Unit`}
            locationId={locationId}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onDismiss}>
          <Trans>Cancel</Trans>
        </Button>
        <Submit>
          <Trans>Create</Trans>
        </Submit>
      </ModalFooter>
    </ValidatedForm>
  );
}
