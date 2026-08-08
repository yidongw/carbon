import { ValidatedForm } from "@carbon/form";
import {
  Button,
  Combobox,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  HStack,
  IconButton,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useState } from "react";
import { LuChevronDown, LuChevronUp, LuX } from "react-icons/lu";
import type { z } from "zod";
import { Hidden, Input, Submit } from "~/components/Form";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import { usePermissions } from "~/hooks";
import { itemAttributeSetValidator } from "../../itemAttribute.models";
import { translateItemAttributeCatalogName } from "../../itemAttributeDisplayName";

type ItemAttributeSetFormProps = {
  initialValues: z.infer<typeof itemAttributeSetValidator>;
  attributeOptions: Array<{ label: string; value: string }>;
  /** System (shared) sets: code/name locked; attributes still editable. */
  isSystem?: boolean;
} & Pick<OverlayFormInjectedProps, "onDismiss" | "fetcher" | "action">;

const ItemAttributeSetForm = ({
  initialValues,
  attributeOptions,
  isSystem = false,
  onDismiss,
  fetcher,
  action
}: ItemAttributeSetFormProps) => {
  const { t, i18n } = useLingui();
  const permissions = usePermissions();

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "parts")
    : !permissions.can("create", "parts");

  // The order of attributes IS the set's ordering (stored as sortOrder) — it
  // drives how Color · Size renders in grids/chips. Manage it explicitly here so
  // the order is visible and reorderable, then submit it as attributeIds.
  const [selected, setSelected] = useState<string[]>(
    initialValues.attributeIds ?? []
  );

  const labelFor = (id: string) => {
    const raw = attributeOptions.find((o) => o.value === id)?.label ?? id;
    return translateItemAttributeCatalogName(raw, i18n);
  };
  const available = attributeOptions.filter((o) => !selected.includes(o.value));

  const addAttribute = (id: string) => {
    if (!id) return;
    setSelected((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };
  const removeAttribute = (id: string) =>
    setSelected((prev) => prev.filter((x) => x !== id));
  const move = (index: number, direction: -1 | 1) =>
    setSelected((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  return (
    <ValidatedForm
      validator={itemAttributeSetValidator}
      method="post"
      action={action}
      defaultValues={initialValues}
      fetcher={fetcher}
      className="flex flex-col h-full"
    >
      <DrawerHeader>
        <DrawerTitle>
          {isEditing ? (
            <Trans>Edit Attribute Set</Trans>
          ) : (
            <Trans>New Attribute Set</Trans>
          )}
        </DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <Hidden name="id" />
        <Hidden name="attributeIds" value={JSON.stringify(selected)} />
        <VStack spacing={4}>
          <Input name="code" label={t`Code`} isReadOnly={isSystem} />
          <Input name="name" label={t`Name`} isReadOnly={isSystem} />

          <VStack spacing={2} className="w-full">
            <h3 className="text-xs text-muted-foreground">
              <Trans>Attributes</Trans>
            </h3>

            {selected.length > 0 ? (
              <VStack spacing={1} className="w-full">
                {selected.map((id, index) => (
                  <HStack
                    key={id}
                    spacing={1}
                    className="w-full items-center rounded-md border border-border bg-card px-2 py-1"
                  >
                    <span className="w-5 shrink-0 text-xs tabular-nums text-muted-foreground">
                      {index + 1}
                    </span>
                    <span className="flex-1 truncate text-sm">
                      {labelFor(id)}
                    </span>
                    <IconButton
                      aria-label={t`Move up`}
                      variant="ghost"
                      size="sm"
                      icon={<LuChevronUp />}
                      isDisabled={index === 0}
                      onClick={() => move(index, -1)}
                    />
                    <IconButton
                      aria-label={t`Move down`}
                      variant="ghost"
                      size="sm"
                      icon={<LuChevronDown />}
                      isDisabled={index === selected.length - 1}
                      onClick={() => move(index, 1)}
                    />
                    <IconButton
                      aria-label={t`Remove`}
                      variant="ghost"
                      size="sm"
                      icon={<LuX />}
                      onClick={() => removeAttribute(id)}
                    />
                  </HStack>
                ))}
              </VStack>
            ) : (
              <span className="text-sm text-muted-foreground">
                <Trans>No attributes yet.</Trans>
              </span>
            )}

            {available.length > 0 ? (
              // Force the combobox trigger to fill the row like the attribute
              // rows and the Code/Name inputs (its default is content-width).
              <div className="w-full [&>div]:w-full [&_button]:w-full">
                <Combobox
                  options={available.map((o) => ({
                    value: o.value,
                    label: translateItemAttributeCatalogName(o.label, i18n)
                  }))}
                  value=""
                  placeholder={t`Add attribute…`}
                  onChange={(id) => addAttribute(id)}
                />
              </div>
            ) : null}

            <p className="text-xs text-muted-foreground">
              <Trans>
                Order determines how attribute values read in grids and chips
                (e.g. Color · Size).
              </Trans>
            </p>
          </VStack>
        </VStack>
      </DrawerBody>
      <DrawerFooter>
        <HStack>
          <Submit isDisabled={isDisabled}>
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

export default ItemAttributeSetForm;
