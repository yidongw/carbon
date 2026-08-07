import { ValidatedForm } from "@carbon/form";
import {
  Button,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  HStack,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { z } from "zod";
import { Hidden, Input, MultiSelect, Submit } from "~/components/Form";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import { usePermissions } from "~/hooks";
import { itemAttributeSetValidator } from "../../itemAttribute.models";

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
  const { t } = useLingui();
  const permissions = usePermissions();

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "parts")
    : !permissions.can("create", "parts");

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
        <VStack spacing={4}>
          <Input name="code" label={t`Code`} isReadOnly={isSystem} />
          <Input name="name" label={t`Name`} isReadOnly={isSystem} />
          <MultiSelect
            name="attributeIds"
            label={t`Attributes`}
            options={attributeOptions}
          />
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
