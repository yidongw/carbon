import {
  Avatar,
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
import { Trans } from "@lingui/react/macro";
import { useNavigate, useSearchParams } from "react-router";
import { useCurrencyFormatter } from "~/hooks";
import { path } from "~/utils/path";
import { getEmployeeName, MONTH_NAMES } from "./salaryDetail.utils";

export type SalaryRecordPaymentOption = {
  employeeId: string | null;
  employeeName: string | null;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  amountOwed: number | null;
};

type SalaryRecordPaymentPickerProps = {
  records: SalaryRecordPaymentOption[];
  year: number;
  month: number;
  returnTo: string;
};

export default function SalaryRecordPaymentPicker({
  records,
  year,
  month,
  returnTo
}: SalaryRecordPaymentPickerProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currencyFormatter = useCurrencyFormatter({ minimumFractionDigits: 2 });
  const periodLabel = `${MONTH_NAMES[month - 1]} ${year}`;

  const payable = records.filter(
    (row) => row.employeeId && (row.amountOwed ?? 0) > 0
  );

  const onClose = () => navigate(returnTo);

  const onSelect = (employeeId: string) => {
    const next = new URLSearchParams(searchParams);
    next.delete("recordPayment");
    next.set("pay", employeeId);
    if (!next.has("returnTo")) {
      next.set("returnTo", returnTo);
    }
    navigate(`${path.to.accountingSalary}?${next.toString()}`);
  };

  return (
    <ModalDrawerProvider type="drawer">
      <ModalDrawer open onOpenChange={(open) => !open && onClose()}>
        <ModalDrawerContent>
          <ModalDrawerHeader>
            <ModalDrawerTitle>
              <Trans>Record payment</Trans>
            </ModalDrawerTitle>
            <p className="text-sm text-muted-foreground font-normal mt-1">
              <Trans>Select an employee for {periodLabel}</Trans>
            </p>
          </ModalDrawerHeader>
          <ModalDrawerBody className="w-full">
            {payable.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                <Trans>No employees have an outstanding balance this period.</Trans>
              </p>
            ) : (
              <VStack spacing={1} className="w-full">
                {payable.map((row) => {
                  const name = getEmployeeName(row);
                  const owed = row.amountOwed ?? 0;
                  return (
                    <button
                      key={row.employeeId!}
                      type="button"
                      className="flex w-full items-center justify-between gap-3 rounded-md border border-border px-3 py-2.5 text-left transition-colors hover:bg-muted/60"
                      onClick={() => onSelect(row.employeeId!)}
                    >
                      <HStack spacing={2} className="items-center min-w-0">
                        <Avatar
                          className="size-8 shrink-0"
                          src={row.avatarUrl ?? undefined}
                          name={name}
                        />
                        <span className="text-sm font-medium truncate">{name}</span>
                      </HStack>
                      <span className="text-sm font-semibold tabular-nums shrink-0">
                        {currencyFormatter.format(owed)}
                      </span>
                    </button>
                  );
                })}
              </VStack>
            )}
          </ModalDrawerBody>
          <ModalDrawerFooter>
            <HStack className="w-full justify-end">
              <Button size="md" variant="secondary" onClick={onClose}>
                <Trans>Cancel</Trans>
              </Button>
            </HStack>
          </ModalDrawerFooter>
        </ModalDrawerContent>
      </ModalDrawer>
    </ModalDrawerProvider>
  );
}
