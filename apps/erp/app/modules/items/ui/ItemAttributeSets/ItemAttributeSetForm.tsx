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
import { Hidden, Input, MultiSelect, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { path } from "~/utils/path";
import { itemAttributeSetValidator } from "../../itemAttribute.models";

type ItemAttributeSetFormProps = {
  initialValues: z.infer<typeof itemAttributeSetValidator>;
  attributeOptions: Array<{ label: string; value: string }>;
  /** System (shared) sets: code/name locked; attributes still editable. */
  isSystem?: boolean;
  type?: "modal" | "drawer";
  open?: boolean;
  onClose: () => void;
};

const ItemAttributeSetForm = ({
  initialValues,
  attributeOptions,
  isSystem = false,
  open = true,
  type = "drawer",
  onClose
}: ItemAttributeSetFormProps) => {
  const { t } = useLingui();
  const permissions = usePermissions();
  const fetcher = useFetcher();

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "parts")
    : !permissions.can("create", "parts");

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
            validator={itemAttributeSetValidator}
            method="post"
            action={
              isEditing
                ? path.to.itemAttributeSet(initialValues.id!)
                : path.to.newItemAttributeSet
            }
            defaultValues={initialValues}
            fetcher={fetcher}
            className="flex flex-col h-full"
          >
            <ModalDrawerHeader>
              <ModalDrawerTitle>
                {isEditing ? (
                  <Trans>Edit Attribute Set</Trans>
                ) : (
                  <Trans>New Attribute Set</Trans>
                )}
              </ModalDrawerTitle>
            </ModalDrawerHeader>
            <ModalDrawerBody>
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

export default ItemAttributeSetForm;
