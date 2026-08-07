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
import { translateItemAttributeCatalogName } from "~/modules/items/itemAttributeDisplayName";
import { path } from "~/utils/path";

type Option = { value: string; label: string };
export type SampleAttributeField = {
  attributeId: string;
  code: string;
  name: string;
  options: Option[];
};

type SampleLine = {
  key: string;
  selections: Record<string, string>;
  quantity: number;
};

type CreateStyleSampleFormProps = {
  styleId: string;
  styleDisplayId: string;
  attributes: SampleAttributeField[];
  defaultLocationId: string;
} & Pick<OverlayFormInjectedProps, "onDismiss" | "fetcher" | "action">;

function emptySelections(attributes: SampleAttributeField[]) {
  const selections: Record<string, string> = {};
  for (const attr of attributes) {
    selections[attr.attributeId] = attr.options[0]?.value ?? "";
  }
  return selections;
}

export default function CreateStyleSampleForm({
  styleId,
  styleDisplayId,
  attributes,
  defaultLocationId,
  onDismiss,
  fetcher,
  action
}: CreateStyleSampleFormProps) {
  const { t, i18n } = useLingui();
  const keyRef = useRef(0);
  const nextKey = () => `row-${keyRef.current++}`;

  const [locationId, setLocationId] = useState<string>(defaultLocationId);
  const [lines, setLines] = useState<SampleLine[]>(() => [
    {
      key: nextKey(),
      selections: emptySelections(attributes),
      quantity: 1
    }
  ]);

  const updateLine = (key: string, patch: Partial<SampleLine>) =>
    setLines((prev) =>
      prev.map((l) => (l.key === key ? { ...l, ...patch } : l))
    );
  const addLine = () =>
    setLines((prev) => [
      ...prev,
      {
        key: nextKey(),
        selections: emptySelections(attributes),
        quantity: 1
      }
    ]);
  const removeLine = (key: string) =>
    setLines((prev) => prev.filter((l) => l.key !== key));

  const linesJson = JSON.stringify(
    lines.map(({ selections, quantity }) => ({ selections, quantity }))
  );

  const formAction =
    action ?? `${path.to.newStyleSample(styleId)}?overlay=true`;

  const attrCols = Math.max(attributes.length, 1);
  const gridTemplate = `repeat(${attrCols}, minmax(0, 1fr)) 5.5rem 2rem`;

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
        <div className="flex w-[min(42rem,100%)] max-w-full flex-col gap-4">
          {attributes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              <Trans>
                This style has no attribute selections yet. Add attributes on
                the style first.
              </Trans>
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              <div
                className="grid gap-2 text-xs font-medium text-muted-foreground"
                style={{ gridTemplateColumns: gridTemplate }}
              >
                {attributes.map((attr) => (
                  <span key={attr.attributeId}>
                    {translateItemAttributeCatalogName(attr.name, i18n)}
                  </span>
                ))}
                <span>{t`Quantity`}</span>
                <span />
              </div>
              {lines.map((line) => (
                <div
                  key={line.key}
                  className="grid items-center gap-2"
                  style={{ gridTemplateColumns: gridTemplate }}
                >
                  {attributes.map((attr) => (
                    <Select
                      key={attr.attributeId}
                      value={line.selections[attr.attributeId] ?? ""}
                      onValueChange={(value) =>
                        updateLine(line.key, {
                          selections: {
                            ...line.selections,
                            [attr.attributeId]: value
                          }
                        })
                      }
                    >
                      <SelectTrigger className="w-full max-w-full">
                        <SelectValue
                          placeholder={translateItemAttributeCatalogName(
                            attr.name,
                            i18n
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {attr.options.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ))}
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
          )}
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
        <Submit isDisabled={attributes.length === 0}>
          <Trans>Create</Trans>
        </Submit>
      </ModalFooter>
    </ValidatedForm>
  );
}
