import { ValidatedForm } from "@carbon/form";
import {
  HStack,
  ModalDrawer,
  ModalDrawerBody,
  ModalDrawerContent,
  ModalDrawerFooter,
  ModalDrawerHeader,
  ModalDrawerProvider,
  ModalDrawerTitle,
  toast,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { PostgrestResponse } from "@supabase/supabase-js";
import { useEffect } from "react";
import { useFetcher } from "react-router";
import type { z } from "zod";
import {
  Currency,
  DatePicker,
  Hidden,
  Input,
  Number,
  Submit,
  Supplier
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import { path } from "~/utils/path";
import { purchasePaymentValidator } from "../../accounting.models";

type SupplierPaymentFormProps = {
  initialValues: z.infer<typeof purchasePaymentValidator>;
  type?: "modal" | "drawer";
  open?: boolean;
  onClose: (data?: { id: string }) => void;
};

const SupplierPaymentForm = ({
  initialValues,
  open = true,
  type = "drawer",
  onClose
}: SupplierPaymentFormProps) => {
  const { t } = useLingui();
  const permissions = usePermissions();
  const fetcher = useFetcher<PostgrestResponse<{ id: string }>>();

  useEffect(() => {
    if (type !== "modal") return;

    if (fetcher.state === "loading" && fetcher.data?.data) {
      onClose?.();
      toast.success(t`Created supplier payment`);
    } else if (fetcher.state === "idle" && fetcher.data?.error) {
      toast.error(
        t`Failed to create supplier payment: ${fetcher.data.error.message}`
      );
    }
  }, [fetcher.data, fetcher.state, onClose, type, t]);

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "invoicing")
    : !permissions.can("create", "invoicing");

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
            validator={purchasePaymentValidator}
            method="post"
            action={
              isEditing
                ? path.to.purchasePayment(initialValues.id!)
                : path.to.newPurchasePayment
            }
            defaultValues={initialValues}
            fetcher={fetcher}
            className="flex flex-col h-full"
          >
            <ModalDrawerHeader>
              <ModalDrawerTitle>
                {isEditing ? (
                  <Trans>Edit Supplier Payment</Trans>
                ) : (
                  <Trans>New Supplier Payment</Trans>
                )}
              </ModalDrawerTitle>
            </ModalDrawerHeader>
            <ModalDrawerBody>
              <Hidden name="id" />
              <Hidden name="type" value={type} />
              <VStack spacing={4}>
                <Supplier name="supplierId" label={t`Supplier`} />
                <Input name="paymentId" label={t`Payment Reference`} />
                <DatePicker name="paymentDate" label={t`Payment Date`} />
                <Currency name="currencyCode" label={t`Currency`} />
                <Number
                  name="totalAmount"
                  label={t`Amount`}
                  minValue={0}
                  formatOptions={{
                    style: "decimal",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }}
                />
              </VStack>
            </ModalDrawerBody>
            <ModalDrawerFooter>
              <HStack>
                <Submit isDisabled={isDisabled}>
                  <Trans>Save</Trans>
                </Submit>
              </HStack>
            </ModalDrawerFooter>
          </ValidatedForm>
        </ModalDrawerContent>
      </ModalDrawer>
    </ModalDrawerProvider>
  );
};

export default SupplierPaymentForm;
