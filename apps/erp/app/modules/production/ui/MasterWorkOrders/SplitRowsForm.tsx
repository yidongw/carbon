import { ValidatedForm } from "@carbon/form";
import {
  Button,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  HStack,
  IconButton,
  Input,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useState } from "react";
import { LuPlus, LuTrash } from "react-icons/lu";
import { Hidden, Submit } from "~/components/Form";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import { usePermissions } from "~/hooks";
import { splitRowsFormValidator } from "~/modules/production";

export type SplitRow = {
  id?: string;
  colorCode: string;
  sizeCode: string;
  quantity: number;
};

export type SplitRowsFormProps = {
  initialValues: {
    masterWorkOrderId: string;
    rows: SplitRow[];
  };
  mode: "cutting" | "split";
} & Pick<OverlayFormInjectedProps, "onDismiss" | "fetcher" | "action">;

const emptyRow = (): SplitRow => ({ colorCode: "", sizeCode: "", quantity: 0 });

const SplitRowsForm = ({
  initialValues,
  mode,
  onDismiss,
  fetcher,
  action
}: SplitRowsFormProps) => {
  const permissions = usePermissions();
  const { t } = useLingui();
  const isDisabled = !permissions.can("update", "production");

  const title = mode === "cutting" ? t`Report Cutting` : t`Confirm Split`;
  const submitLabel =
    mode === "cutting" ? t`Save Cutting Rows` : t`Confirm Split`;

  const [rows, setRows] = useState<SplitRow[]>(
    initialValues.rows.length > 0 ? initialValues.rows : [emptyRow()]
  );

  const update = (index: number, patch: Partial<SplitRow>) =>
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row))
    );
  const addRow = () => setRows((prev) => [...prev, emptyRow()]);
  const removeRow = (index: number) =>
    setRows((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== index) : prev
    );

  const payload = rows.filter((r) => r.quantity > 0);

  return (
    <ValidatedForm
      validator={splitRowsFormValidator}
      method="post"
      action={action}
      fetcher={fetcher}
      defaultValues={{
        masterWorkOrderId: initialValues.masterWorkOrderId,
        rows: JSON.stringify(payload)
      }}
      className="flex flex-col h-full"
    >
      <DrawerHeader>
        <DrawerTitle>{title}</DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <Hidden
          name="masterWorkOrderId"
          value={initialValues.masterWorkOrderId}
        />
        {/* rows are managed in state and mirrored to a hidden JSON field */}
        <input type="hidden" name="rows" value={JSON.stringify(payload)} />
        <VStack spacing={2}>
          <HStack className="w-full text-xs text-muted-foreground px-1">
            <span className="flex-1">
              <Trans>Color</Trans>
            </span>
            <span className="flex-1">
              <Trans>Size</Trans>
            </span>
            <span className="w-28">
              <Trans>Quantity</Trans>
            </span>
            <span className="w-8" />
          </HStack>
          {rows.map((row, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: rows are positional
            <HStack key={index} className="w-full items-center">
              <Input
                className="flex-1"
                value={row.colorCode}
                placeholder={t`Color`}
                onChange={(e) => update(index, { colorCode: e.target.value })}
              />
              <Input
                className="flex-1"
                value={row.sizeCode}
                placeholder={t`Size`}
                onChange={(e) => update(index, { sizeCode: e.target.value })}
              />
              <Input
                className="w-28"
                type="number"
                min={0}
                value={String(row.quantity)}
                onChange={(e) =>
                  update(index, { quantity: Number(e.target.value) || 0 })
                }
              />
              <IconButton
                aria-label={t`Remove row`}
                variant="ghost"
                icon={<LuTrash />}
                onClick={() => removeRow(index)}
                isDisabled={rows.length <= 1}
              />
            </HStack>
          ))}
          <Button
            variant="secondary"
            leftIcon={<LuPlus />}
            onClick={addRow}
            className="self-start"
          >
            <Trans>Add Row</Trans>
          </Button>
        </VStack>
      </DrawerBody>
      <DrawerFooter>
        <HStack>
          <Submit isDisabled={isDisabled || payload.length === 0}>
            {submitLabel}
          </Submit>
          <Button variant="solid" type="button" onClick={onDismiss}>
            <Trans>Cancel</Trans>
          </Button>
        </HStack>
      </DrawerFooter>
    </ValidatedForm>
  );
};

export default SplitRowsForm;
