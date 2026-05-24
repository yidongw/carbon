import {
  ActionMenu,
  Button,
  MenuIcon,
  MenuItem
} from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import { memo, useMemo } from "react";
import { LuBanknote, LuClipboardCheck, LuEye } from "react-icons/lu";
import { Link, useSearchParams } from "react-router";
import { RowActionsContainer } from "~/components/Table/components";
import { usePermissions } from "~/hooks";
import { path } from "~/utils/path";

type SalaryRowActionsProps = {
  employeeId: string;
  salaryRecordId: string | null;
  amountOwed: number | null;
  pendingAmount: number | null;
  year: number;
  month: number;
};

function SalaryRowActions({
  employeeId,
  salaryRecordId,
  amountOwed,
  pendingAmount,
  year,
  month
}: SalaryRowActionsProps) {
  const permissions = usePermissions();
  const [searchParams] = useSearchParams();
  const detailTo = path.to.employeeSalaryMonth(employeeId, year, month);
  const hasPending = (pendingAmount ?? 0) > 0;
  const primaryTo = hasPending
    ? path.to.quantityReviewForEmployee(employeeId)
    : detailTo;

  const paymentTo = useMemo(() => {
    if (
      !permissions.can("create", "people") ||
      !salaryRecordId ||
      (amountOwed ?? 0) <= 0
    ) {
      return null;
    }
    const params = new URLSearchParams(searchParams);
    params.set("year", String(year));
    params.set("month", String(month));
    params.set("pay", employeeId);
    return `${path.to.accountingSalary}?${params.toString()}`;
  }, [
    amountOwed,
    employeeId,
    month,
    permissions,
    salaryRecordId,
    searchParams,
    year
  ]);

  return (
    <RowActionsContainer className="gap-1">
      <Button
        asChild
        size="sm"
        variant={hasPending ? "primary" : "secondary"}
      >
        <Link to={primaryTo}>
          {hasPending ? (
            <>
              <LuClipboardCheck className="size-3.5 mr-1.5" />
              <Trans>Review</Trans>
            </>
          ) : (
            <>
              <LuEye className="size-3.5 mr-1.5" />
              <Trans>View</Trans>
            </>
          )}
        </Link>
      </Button>
      {paymentTo ? (
        <ActionMenu>
          <MenuItem asChild>
            <Link to={paymentTo}>
              <MenuIcon icon={<LuBanknote />} />
              <Trans>Record payment</Trans>
            </Link>
          </MenuItem>
        </ActionMenu>
      ) : null}
    </RowActionsContainer>
  );
}

export default memo(SalaryRowActions);
