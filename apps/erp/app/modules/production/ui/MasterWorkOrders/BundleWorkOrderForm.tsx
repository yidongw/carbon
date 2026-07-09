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
import { Hidden, Input, Number, Submit } from "~/components/Form";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import { usePermissions } from "~/hooks";
import { bundleWorkOrderValidator } from "~/modules/production";

type BundleWorkOrderFormProps = {
  initialValues: z.infer<typeof bundleWorkOrderValidator>;
} & Pick<OverlayFormInjectedProps, "onDismiss" | "fetcher" | "action">;

const BundleWorkOrderForm = ({
  initialValues,
  onDismiss,
  fetcher,
  action
}: BundleWorkOrderFormProps) => {
  const permissions = usePermissions();
  const { t } = useLingui();

  const isDisabled = !permissions.can("create", "production");

  return (
    <ValidatedForm
      validator={bundleWorkOrderValidator}
      method="post"
      action={action}
      defaultValues={initialValues}
      fetcher={fetcher}
      className="flex flex-col h-full"
    >
      <DrawerHeader>
        <DrawerTitle>
          <Trans>New Bundle Work Order</Trans>
        </DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <VStack spacing={4}>
          <Hidden name="masterWorkOrderId" />
          <Input name="colorCode" label={t`Color`} />
          <Input name="sizeCode" label={t`Size`} />
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

export default BundleWorkOrderForm;
