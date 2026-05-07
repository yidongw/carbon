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
import type { z } from "zod";
import { Hidden, Input, Submit, TextArea } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { templateCreateValidator } from "~/modules/items";
import { path } from "~/utils/path";

type TemplateFormProps = {
  initialValues: z.infer<typeof templateCreateValidator>;
  type?: "modal" | "drawer";
  open?: boolean;
  onClose: () => void;
};

const TemplateForm = ({
  initialValues,
  open = true,
  type = "drawer",
  onClose
}: TemplateFormProps) => {
  const permissions = usePermissions();
  const { t } = useLingui();

  return (
    <ModalDrawerProvider type={type}>
      <ModalDrawer
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) onClose();
        }}
      >
        <ModalDrawerContent>
          <ValidatedForm
            validator={templateCreateValidator}
            method="post"
            action={`${path.to.templates}/new`}
            defaultValues={initialValues}
            className="flex flex-col h-full"
          >
            <ModalDrawerHeader>
              <ModalDrawerTitle>{t`New Template`}</ModalDrawerTitle>
            </ModalDrawerHeader>
            <ModalDrawerBody>
              <Hidden name="type" value={type} />
              <VStack spacing={4}>
                <Input name="name" label={t`Name`} />
                <TextArea name="description" label={t`Description`} />
              </VStack>
            </ModalDrawerBody>
            <ModalDrawerFooter>
              <HStack>
                <Submit isDisabled={!permissions.can("create", "parts")}>
                  <Trans>Save</Trans>
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

export default TemplateForm;
