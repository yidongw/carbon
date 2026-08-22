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
import { Color, Hidden, Input, Number, Submit } from "~/components/Form";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import { usePermissions } from "~/hooks";
import { itemAttributeValueValidator } from "../../itemAttribute.models";

type ItemAttributeValueFormProps = {
  attributeId: string;
  initialValues: z.infer<typeof itemAttributeValueValidator>;
} & Pick<OverlayFormInjectedProps, "onDismiss" | "fetcher" | "action">;

const ItemAttributeValueForm = ({
  attributeId,
  initialValues,
  onDismiss,
  fetcher,
  action
}: ItemAttributeValueFormProps) => {
  const { t } = useLingui();
  const permissions = usePermissions();

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "parts")
    : !permissions.can("create", "parts");

  return (
    <ValidatedForm
      validator={itemAttributeValueValidator}
      method="post"
      action={action}
      defaultValues={initialValues}
      fetcher={fetcher}
      className="flex flex-col h-full"
    >
      <DrawerHeader>
        <DrawerTitle>
          {isEditing ? (
            <Trans>Edit Attribute Value</Trans>
          ) : (
            <Trans>New Attribute Value</Trans>
          )}
        </DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <Hidden name="id" />
        <Hidden name="attributeId" value={attributeId} />
        <VStack spacing={4}>
          <Input name="code" label={t`Code`} />
          <Input name="name" label={t`Name`} />
          <Number name="sortOrder" label={t`Sort Order`} />
          <Color name="color" label={t`Color`} />
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

export default ItemAttributeValueForm;
