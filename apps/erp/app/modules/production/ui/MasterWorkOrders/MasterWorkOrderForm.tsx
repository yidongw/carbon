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
import { Item, Number, Submit } from "~/components/Form";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import { usePermissions } from "~/hooks";
import { masterWorkOrderValidator } from "~/modules/production";

type MasterWorkOrderFormProps = {
  initialValues: z.infer<typeof masterWorkOrderValidator>;
} & Pick<OverlayFormInjectedProps, "onDismiss" | "fetcher" | "action">;

const MasterWorkOrderForm = ({
  initialValues,
  onDismiss,
  fetcher,
  action
}: MasterWorkOrderFormProps) => {
  const permissions = usePermissions();
  const { t } = useLingui();

  const isDisabled = !permissions.can("create", "production");

  return (
    <ValidatedForm
      validator={masterWorkOrderValidator}
      method="post"
      action={action}
      defaultValues={initialValues}
      fetcher={fetcher}
      className="flex flex-col h-full"
    >
      <DrawerHeader>
        <DrawerTitle>
          <Trans>New Master Work Order</Trans>
        </DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <VStack spacing={4}>
          <Item
            name="itemId"
            label={t`Style`}
            type="Style"
            validItemTypes={["Style"]}
          />
          <Number name="quantity" label={t`Quantity`} minValue={0} />
        </VStack>
      </DrawerBody>
      <DrawerFooter>
        <HStack>
          <Submit isDisabled={isDisabled}>
            <Trans>Save</Trans>
          </Submit>
          <Button variant="solid" type="button" onClick={onDismiss}>
            <Trans>Cancel</Trans>
          </Button>
        </HStack>
      </DrawerFooter>
    </ValidatedForm>
  );
};

export default MasterWorkOrderForm;
