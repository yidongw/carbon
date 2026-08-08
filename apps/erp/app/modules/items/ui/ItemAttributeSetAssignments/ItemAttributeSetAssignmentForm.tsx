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
import { Hidden, Select, Submit } from "~/components/Form";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import { usePermissions } from "~/hooks";
import { itemAttributeSetAssignmentValidator } from "../../itemAttribute.models";

const ITEM_TYPE_OPTIONS = [
  "Part",
  "Material",
  "Tool",
  "Consumable",
  "Fixture",
  "Service",
  "Style",
  "Sample"
] as const;

type ItemAttributeSetAssignmentFormProps = {
  initialValues: z.infer<typeof itemAttributeSetAssignmentValidator>;
  attributeSetOptions: Array<{ label: string; value: string }>;
} & Pick<OverlayFormInjectedProps, "onDismiss" | "fetcher" | "action">;

const ItemAttributeSetAssignmentForm = ({
  initialValues,
  attributeSetOptions,
  onDismiss,
  fetcher,
  action
}: ItemAttributeSetAssignmentFormProps) => {
  const { t } = useLingui();
  const permissions = usePermissions();

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "parts")
    : !permissions.can("create", "parts");

  const itemTypeOptions = ITEM_TYPE_OPTIONS.map((value) => ({
    label: value,
    value
  }));

  return (
    <ValidatedForm
      validator={itemAttributeSetAssignmentValidator}
      method="post"
      action={action}
      defaultValues={initialValues}
      fetcher={fetcher}
      className="flex flex-col h-full"
    >
      <DrawerHeader>
        <DrawerTitle>
          {isEditing ? (
            <Trans>Edit Item Attributes Set</Trans>
          ) : (
            <Trans>New Item Attributes Set</Trans>
          )}
        </DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <Hidden name="id" />
        <VStack spacing={4}>
          <Select
            name="itemType"
            label={t`Item Type`}
            options={itemTypeOptions}
          />
          <Select
            name="attributeSetId"
            label={t`Attribute Set`}
            options={attributeSetOptions}
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

export default ItemAttributeSetAssignmentForm;
