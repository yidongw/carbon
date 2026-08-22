import { ValidatedForm } from "@carbon/form";
import {
  Button,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  HStack,
  IconButton,
  Input as UiInput,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useState } from "react";
import { LuChevronDown, LuChevronUp, LuX } from "react-icons/lu";
import type { z } from "zod";
import { Hidden, Input, Submit } from "~/components/Form";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import { usePermissions } from "~/hooks";
import { itemAttributeValidator } from "../../itemAttribute.models";

type AttributeValueRow = {
  id?: string;
  code: string;
  name: string;
  /** Optional display color (hex) used for per-color BOM chips. */
  color?: string | null;
  /** System catalog rows cannot be removed or reordered. */
  isSystem?: boolean;
};

type ItemAttributeFormProps = {
  initialValues: Omit<z.infer<typeof itemAttributeValidator>, "values"> & {
    values?: AttributeValueRow[];
  };
  /** System (shared) attributes: code/name locked; system values read-only. */
  isSystem?: boolean;
} & Pick<OverlayFormInjectedProps, "onDismiss" | "fetcher" | "action">;

const ItemAttributeForm = ({
  initialValues,
  isSystem = false,
  onDismiss,
  fetcher,
  action
}: ItemAttributeFormProps) => {
  const { t } = useLingui();
  const permissions = usePermissions();

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "parts")
    : !permissions.can("create", "parts");

  // Order of values IS the attribute's display order (stored as sortOrder) —
  // same pattern as attributeIds on attribute sets.
  const [selected, setSelected] = useState<AttributeValueRow[]>(
    (initialValues.values ?? []).map((v) => ({
      id: v.id,
      code: v.code,
      name: v.name,
      color: v.color ?? null,
      isSystem: v.isSystem ?? false
    }))
  );
  const [draftCode, setDraftCode] = useState("");
  const [draftName, setDraftName] = useState("");
  const [addError, setAddError] = useState<string | null>(null);

  const addValue = () => {
    const code = draftCode.trim();
    const name = draftName.trim() || code;
    if (!code) {
      setAddError(t`Code is required`);
      return;
    }
    if (selected.some((v) => v.code.toLowerCase() === code.toLowerCase())) {
      setAddError(t`A value with this code already exists`);
      return;
    }
    setSelected((prev) => [...prev, { code, name, isSystem: false }]);
    setDraftCode("");
    setDraftName("");
    setAddError(null);
  };

  const removeValue = (index: number) =>
    setSelected((prev) => {
      if (prev[index]?.isSystem) return prev;
      return prev.filter((_, i) => i !== index);
    });

  const move = (index: number, direction: -1 | 1) =>
    setSelected((prev) => {
      const row = prev[index];
      if (!row || row.isSystem) return prev;
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      // Don't swap a company value into/over a system row's locked slot by
      // swapping with a system neighbor — skip moves that would.
      if (prev[target]?.isSystem) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const setColor = (index: number, color: string) =>
    setSelected((prev) =>
      prev.map((row, i) => (i === index ? { ...row, color } : row))
    );

  const valuesPayload = selected.map(({ id, code, name, color }) =>
    id
      ? { id, code, name, color: color ?? null }
      : { code, name, color: color ?? null }
  );

  return (
    <ValidatedForm
      validator={itemAttributeValidator}
      method="post"
      action={action}
      defaultValues={initialValues}
      fetcher={fetcher}
      className="flex flex-col h-full"
    >
      <DrawerHeader>
        <DrawerTitle>
          {isEditing ? (
            <Trans>Edit Attribute</Trans>
          ) : (
            <Trans>New Attribute</Trans>
          )}
        </DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <Hidden name="id" />
        <Hidden name="values" value={JSON.stringify(valuesPayload)} />
        <VStack spacing={4}>
          <Input name="code" label={t`Code`} isReadOnly={isSystem} />
          <Input name="name" label={t`Name`} isReadOnly={isSystem} />

          <VStack spacing={2} className="w-full">
            <h3 className="text-xs text-muted-foreground">
              <Trans>Values</Trans>
            </h3>

            {selected.length > 0 ? (
              <VStack spacing={1} className="w-full">
                {selected.map((row, index) => (
                  <HStack
                    key={row.id ?? `new-${row.code}-${index}`}
                    spacing={1}
                    className="w-full items-center rounded-md border border-border bg-card px-2 py-1"
                  >
                    <span className="w-5 shrink-0 text-xs tabular-nums text-muted-foreground">
                      {index + 1}
                    </span>
                    <span className="flex-1 truncate text-sm">
                      {row.code}
                      {row.name && row.name !== row.code
                        ? ` — ${row.name}`
                        : ""}
                    </span>
                    <label
                      className="relative h-6 w-6 shrink-0 cursor-pointer overflow-hidden rounded border border-border"
                      title={row.color ? t`Chip color` : t`Set chip color`}
                    >
                      <span
                        className="block h-full w-full"
                        style={
                          row.color
                            ? { backgroundColor: row.color }
                            : {
                                backgroundImage:
                                  "repeating-linear-gradient(45deg, #cbd5e1 0 2px, transparent 2px 5px)"
                              }
                        }
                      />
                      <input
                        type="color"
                        aria-label={t`Color`}
                        disabled={isDisabled || row.isSystem}
                        value={row.color ?? "#000000"}
                        onChange={(e) => setColor(index, e.target.value)}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                      />
                    </label>
                    <IconButton
                      aria-label={t`Move up`}
                      variant="ghost"
                      size="sm"
                      icon={<LuChevronUp />}
                      isDisabled={
                        isDisabled ||
                        row.isSystem ||
                        index === 0 ||
                        selected[index - 1]?.isSystem
                      }
                      onClick={() => move(index, -1)}
                    />
                    <IconButton
                      aria-label={t`Move down`}
                      variant="ghost"
                      size="sm"
                      icon={<LuChevronDown />}
                      isDisabled={
                        isDisabled ||
                        row.isSystem ||
                        index === selected.length - 1 ||
                        selected[index + 1]?.isSystem
                      }
                      onClick={() => move(index, 1)}
                    />
                    <IconButton
                      aria-label={t`Remove`}
                      variant="ghost"
                      size="sm"
                      icon={<LuX />}
                      isDisabled={isDisabled || row.isSystem}
                      onClick={() => removeValue(index)}
                    />
                  </HStack>
                ))}
              </VStack>
            ) : (
              <span className="text-sm text-muted-foreground">
                <Trans>No values yet.</Trans>
              </span>
            )}

            {!isDisabled ? (
              <VStack spacing={1} className="w-full">
                <HStack spacing={2} className="w-full items-end">
                  <div className="flex-1 min-w-0">
                    <UiInput
                      size="sm"
                      placeholder={t`Code`}
                      value={draftCode}
                      onChange={(e) => {
                        setDraftCode(e.target.value);
                        setAddError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addValue();
                        }
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <UiInput
                      size="sm"
                      placeholder={t`Name`}
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addValue();
                        }
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={addValue}
                  >
                    <Trans>Add</Trans>
                  </Button>
                </HStack>
                {addError ? (
                  <span className="text-xs text-destructive">{addError}</span>
                ) : null}
              </VStack>
            ) : null}

            <p className="text-xs text-muted-foreground">
              <Trans>
                Order determines how values appear in pickers and grids.
              </Trans>
            </p>
          </VStack>
        </VStack>
      </DrawerBody>
      <DrawerFooter>
        <HStack>
          <Submit isDisabled={isDisabled || selected.length === 0}>
            {isEditing ? <Trans>Save</Trans> : <Trans>Create</Trans>}
          </Submit>
          <Button size="md" variant="solid" type="button" onClick={onDismiss}>
            <Trans>Cancel</Trans>
          </Button>
        </HStack>
      </DrawerFooter>
    </ValidatedForm>
  );
};

export default ItemAttributeForm;
