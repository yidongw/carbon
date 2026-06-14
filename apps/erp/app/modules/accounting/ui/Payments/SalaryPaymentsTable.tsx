import { Avatar, HStack } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { LuBanknote, LuCalendar, LuUser } from "react-icons/lu";
import { useNavigate, useSearchParams } from "react-router";
import { Hyperlink, New, Table } from "~/components";
import { useCurrencyFormatter, usePermissions } from "~/hooks";
import SalaryPeriodPicker from "~/modules/people/ui/Salary/SalaryPeriodPicker";
import {
  formatDateTime,
  getEmployeeName
} from "~/modules/people/ui/Salary/salaryDetail.utils";
import { path } from "~/utils/path";

export type SalaryPaymentRow = {
  id: string;
  amount: number | null;
  paidAt: string | null;
  notes: string | null;
  salaryRecord?: {
    employeeId: string | null;
    employeeName: string | null;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    year: number | null;
    month: number | null;
  } | null;
  paidByUser?: {
    fullName?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  } | null;
};

type SalaryPaymentsTableProps = {
  data: SalaryPaymentRow[];
  count: number;
  year: number;
  month: number;
};

const SalaryPaymentsTable = memo(
  ({ data, count, year, month }: SalaryPaymentsTableProps) => {
    const { t } = useLingui();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const permissions = usePermissions();
    const currencyFormatter = useCurrencyFormatter({
      minimumFractionDigits: 2
    });
    const canCreatePayment = permissions.can("create", "people");

    const paymentsReturnTo = useMemo(() => {
      const params = new URLSearchParams(searchParams);
      params.set("year", String(year));
      params.set("month", String(month));
      return `${path.to.accountingPayments}?${params.toString()}`;
    }, [month, searchParams, year]);

    const recordPaymentTo = useMemo(
      () => path.to.recordSalaryPayment(year, month, paymentsReturnTo),
      [month, paymentsReturnTo, year]
    );

    const goToMonth = useCallback(
      (y: number, m: number) => {
        const next = new URLSearchParams(searchParams);
        next.set("year", String(y));
        next.set("month", String(m));
        navigate(`${path.to.accountingPayments}?${next.toString()}`);
      },
      [navigate, searchParams]
    );

    const columns = useMemo<ColumnDef<SalaryPaymentRow>[]>(() => {
      const formatCurrency = (amount: number | null) =>
        amount == null ? "—" : currencyFormatter.format(amount);

      return [
        {
          header: t`Employee`,
          cell: ({ row }) => {
            const sr = row.original.salaryRecord;
            const employeeId = sr?.employeeId;
            const name = getEmployeeName(
              sr ? { fullName: sr.employeeName, ...sr } : null
            );
            return (
              <HStack className="items-center gap-2">
                <Avatar
                  className="size-7"
                  src={sr?.avatarUrl ?? undefined}
                  name={name}
                />
                {employeeId && sr?.year && sr?.month ? (
                  <Hyperlink
                    to={path.to.employeeSalaryMonth(
                      employeeId,
                      sr.year,
                      sr.month
                    )}
                    prefetch="none"
                  >
                    <span className="font-medium text-sm">{name}</span>
                  </Hyperlink>
                ) : (
                  <span className="font-medium text-sm">{name}</span>
                )}
              </HStack>
            );
          },
          meta: { icon: <LuUser /> }
        },
        {
          accessorKey: "amount",
          header: t`Amount`,
          cell: ({ row }) => (
            <span className="tabular-nums font-semibold">
              {formatCurrency(row.original.amount)}
            </span>
          ),
          meta: {
            icon: <LuBanknote />,
            renderTotal: true,
            formatter: (val) => currencyFormatter.format(val)
          }
        },
        {
          accessorKey: "paidAt",
          header: t`Paid at`,
          cell: ({ row }) => (
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {formatDateTime(row.original.paidAt)}
            </span>
          ),
          meta: { icon: <LuCalendar /> }
        },
        {
          id: "paidBy",
          header: t`Paid by`,
          cell: ({ row }) => (
            <span className="text-sm">
              {getEmployeeName(row.original.paidByUser)}
            </span>
          )
        },
        {
          accessorKey: "notes",
          header: t`Notes`,
          cell: ({ row }) => (
            <span className="text-sm text-muted-foreground max-w-xs truncate">
              {row.original.notes ?? "—"}
            </span>
          )
        }
      ];
    }, [currencyFormatter, t]);

    return (
      <Table<SalaryPaymentRow>
        data={data}
        count={count}
        columns={columns}
        getRowHref={(row) => {
          const sr = row.salaryRecord;
          if (!sr?.employeeId || sr.year == null || sr.month == null) {
            return undefined;
          }
          return path.to.employeeSalaryMonth(sr.employeeId, sr.year, sr.month);
        }}
        primaryAction={
          <HStack spacing={2} className="items-center">
            <SalaryPeriodPicker
              year={year}
              month={month}
              onChange={goToMonth}
            />
            {canCreatePayment ? (
              <New label={t`Payment`} to={recordPaymentTo} />
            ) : null}
          </HStack>
        }
        withSearch
        withPagination
        title={t`Payments`}
        table="employeeSalaryPayment"
      />
    );
  }
);

SalaryPaymentsTable.displayName = "SalaryPaymentsTable";
export default SalaryPaymentsTable;
