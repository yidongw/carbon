import { ValidatedForm } from "@carbon/form";
import {
  Button,
  HStack,
  ModalDrawer,
  ModalDrawerBody,
  ModalDrawerContent,
  ModalDrawerFooter,
  ModalDrawerHeader,
  ModalDrawerProvider,
  ModalDrawerTitle,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useFetcher } from "react-router";
import type { z } from "zod";
import { Hidden, Select, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { path } from "~/utils/path";
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
  type?: "modal" | "drawer";
  open?: boolean;
  onClose: () => void;
};

const ItemAttributeSetAssignmentForm = ({
  initialValues,
  attributeSetOptions,
  open = true,
  type = "drawer",
  onClose
}: ItemAttributeSetAssignmentFormProps) => {
  const { t } = useLingui();
  const permissions = usePermissions();
  const fetcher = useFetcher();

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "parts")
    : !permissions.can("create", "parts");

  const itemTypeOptions = ITEM_TYPE_OPTIONS.map((value) => ({
    label: value,
    value
  }));

  return (
    <ModalDrawerProvider type={type}>
      <ModalDrawer
        open={open}
        onOpenChange={(open) => {
          if (!open) onClose?.();
        }}
      >
        <ModalDrawerContent>
          <ValidatedForm
            validator={itemAttributeSetAssignmentValidator}
            method="post"
            action={
              isEditing
                ? path.to.itemAttributeSetAssignment(initialValues.id!)
                : path.to.newItemAttributeSetAssignment
            }
            defaultValues={initialValues}
            fetcher={fetcher}
            className="flex flex-col h-full"
          >
            <ModalDrawerHeader>
              <ModalDrawerTitle>
                {isEditing ? (
                  <Trans>Edit Set Assignment</Trans>
                ) : (
                  <Trans>New Set Assignment</Trans>
                )}
              </ModalDrawerTitle>
            </ModalDrawerHeader>
            <ModalDrawerBody>
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
            </ModalDrawerBody>
            <ModalDrawerFooter>
              <HStack>
                <Submit isDisabled={isDisabled}>
                  {isEditing ? <Trans>Save</Trans> : <Trans>Create</Trans>}
                </Submit>
                <Button size="md" variant="solid" onClick={onClose}>
                  <Trans>Cancel</Trans>
                </Button>
              </HStack>
            </ModalDrawerFooter>
          </ValidatedForm>
        </ModalDrawerContent>
      </ModalDrawer>
    </ModalDrawerProvider>
  );
};

export default ItemAttributeSetAssignmentForm;
