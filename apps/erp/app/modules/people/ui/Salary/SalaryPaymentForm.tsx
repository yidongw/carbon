import { ValidatedForm } from "@carbon/form";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input as InputBase,
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
import { useLocale } from "@react-aria/i18n";
import type { ReactNode } from "react";
import { useFormAction, useNavigate } from "react-router";
import {
  DatePicker,
  Hidden,
  Number,
  Submit,
  TextArea
} from "~/components/Form";
import { useCurrencyFormatter } from "~/hooks";
import { salaryPaymentValidator } from "~/modules/people/people.models";
import { formatSalaryPeriod } from "./salaryDetail.utils";

type SalaryPaymentFormProps = {
  salaryRecordId: string;
  year: number;
  month: number;
  amountOwed: number;
  returnTo: string;
};

function ReadOnlyField({ label, value }: { label: ReactNode; value: string }) {
  return (
    <FormControl isReadOnly className="w-full">
      <FormLabel>{label}</FormLabel>
      <InputBase
        value={value}
        isReadOnly
        tabIndex={-1}
        className="w-full tabular-nums"
      />
    </FormControl>
  );
}

export default function SalaryPaymentForm({
  salaryRecordId,
  year,
  month,
  amountOwed,
  returnTo
}: SalaryPaymentFormProps) {
  const { t } = useLingui();
  const { locale } = useLocale();
  const navigate = useNavigate();
  const formAction = useFormAction();
  const currencyFormatter = useCurrencyFormatter({ minimumFractionDigits: 2 });
  const onClose = () => navigate(returnTo);

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const periodLabel = formatSalaryPeriod(year, month, locale);

  return (
    <ModalDrawerProvider type="drawer">
      <ModalDrawer open onOpenChange={(open) => !open && onClose()}>
        <ModalDrawerContent>
          <ValidatedForm
            validator={salaryPaymentValidator}
            method="post"
            action={formAction}
            defaultValues={{
              paidAt: today,
              amount: amountOwed > 0 ? amountOwed : undefined
            }}
            className="flex flex-col h-full w-full"
          >
            <ModalDrawerHeader>
              <ModalDrawerTitle>
                <Trans>Record payment</Trans>
              </ModalDrawerTitle>
            </ModalDrawerHeader>
            <ModalDrawerBody className="w-full">
              <VStack spacing={4} className="w-full">
                <Hidden name="salaryRecordId" value={salaryRecordId} />
                <Hidden name="returnTo" value={returnTo} />

                <ReadOnlyField label={t`Pay period`} value={periodLabel} />
                <ReadOnlyField
                  label={t`Outstanding balance`}
                  value={currencyFormatter.format(amountOwed)}
                />

                <div className="w-full space-y-4 border-t border-border pt-4">
                  <div className="w-full">
                    <Number
                      name="amount"
                      label={t`Amount`}
                      minValue={0.01}
                      step={0.01}
                      helperText={t`Defaults to the full outstanding amount`}
                    />
                  </div>
                  <div className="w-full">
                    <DatePicker name="paidAt" label={t`Payment date`} />
                  </div>
                  <div className="w-full">
                    <TextArea
                      name="notes"
                      label={t`Notes`}
                      placeholder={t`Optional payment notes`}
                    />
                  </div>
                </div>
              </VStack>
            </ModalDrawerBody>
            <ModalDrawerFooter>
              <HStack className="w-full justify-end">
                <Button size="md" variant="secondary" onClick={onClose}>
                  <Trans>Cancel</Trans>
                </Button>
                <Submit>
                  <Trans>Record payment</Trans>
                </Submit>
              </HStack>
            </ModalDrawerFooter>
          </ValidatedForm>
        </ModalDrawerContent>
      </ModalDrawer>
    </ModalDrawerProvider>
  );
}
