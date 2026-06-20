import { Avatar, Badge, HStack } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import {
  LuBanknote,
  LuBuilding2,
  LuCircleCheck,
  LuCircle,
  LuClock,
  LuUser
} from "react-icons/lu";
import { useNavigate, useSearchParams } from "react-router";
import { Hyperlink, Table } from "~/components";
import { useCurrencyFormatter } from "~/hooks";
import { path } from "~/utils/path";
import SalaryPeriodPicker from "./SalaryPeriodPicker";
import SalaryRowActions from "./SalaryRowActions";
import {
  getEmployeeName,
  getSalaryPaymentStatus,
  statusVariant
} from "./salaryDetail.utils";

type DepartmentOption = {
  id: string;
  name: string;
};

type SalaryRecord = {
  id: string | null;
  employeeId: string | null;
  employeeName: string | null;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  departmentId: string | null;
  departmentName: string | null;
  year: number | null;
  month: number | null;
  totalEarned: number | null;
  totalPaid: number | null;
  amountOwed: number | null;
  pendingAmount: number | null;
  pendingCount: number | null;
  status: string | null;
};

type SalaryTableProps = {
  data: SalaryRecord[];
  count: number;
  departments: DepartmentOption[];
  year: number;
  month: number;
};

const SalaryTable = memo(({ data, count, departments, year, month }: SalaryTableProps) => {
  const { t } = useLingui();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currencyFormatter = useCurrencyFormatter({ minimumFractionDigits: 2 });

  const goToMonth = useCallback(
    (y: number, m: number) => {
      const next = new URLSearchParams(searchParams);
      next.set("year", String(y));
      next.set("month", String(m));
      navigate(`${path.to.accountingSalary}?${next.toString()}`);
    },
    [navigate, searchParams]
  );

  const columns = useMemo<ColumnDef<SalaryRecord>[]>(() => {
    const formatCurrency = (amount: number | null) =>
      amount == null ? "—" : currencyFormatter.format(amount);

    return [
      {
        header: t`Employee`,
        cell: ({ row }) => {
          const name = getEmployeeName({
            fullName: row.original.employeeName,
            firstName: row.original.firstName,
            lastName: row.original.lastName
          });
          return (
            <HStack className="items-center gap-2">
              <Avatar
                className="size-7"
                src={row.original.avatarUrl ?? undefined}
                name={name}
              />
              <span className="font-medium text-sm">{name}</span>
            </HStack>
          );
        },
        meta: { icon: <LuUser /> }
      },
      {
        accessorKey: "departmentId",
        header: t`Department`,
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.departmentName ?? "—"}
          </span>
        ),
        meta: {
          icon: <LuBuilding2 />,
          filter: {
            type: "static" as const,
            options: departments.map((department) => ({
              value: department.id,
              label: department.name
            }))
          }
        }
      },
      {
        accessorKey: "pendingAmount",
        header: t`Pending`,
        cell: ({ row }) => {
          const pending = row.original.pendingAmount ?? 0;
          const employeeId = row.original.employeeId;
          if (pending <= 0 || !employeeId) {
            return <span className="text-muted-foreground tabular-nums">—</span>;
          }
          return (
            <Hyperlink
              to={path.to.quantityReviewForEmployee(employeeId)}
              prefetch="none"
              data-prevent-row-nav
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <span className="tabular-nums font-semibold text-amber-600 dark:text-amber-400">
                {formatCurrency(pending)}
              </span>
            </Hyperlink>
          );
        },
        meta: {
          icon: <LuClock />,
          renderTotal: true,
          formatter: (val: number) => currencyFormatter.format(val)
        }
      },
      {
        accessorKey: "totalEarned",
        header: t`Earned`,
        cell: ({ row }) => (
          <span className="tabular-nums font-medium">
            {formatCurrency(row.original.totalEarned)}
          </span>
        ),
        meta: {
          icon: <LuBanknote />,
          renderTotal: true,
          formatter: (val: number) => currencyFormatter.format(val)
        }
      },
      {
        accessorKey: "totalPaid",
        header: t`Paid`,
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground">
            {formatCurrency(row.original.totalPaid)}
          </span>
        ),
        meta: {
          icon: <LuCircleCheck />,
          renderTotal: true,
          formatter: (val: number) => currencyFormatter.format(val)
        }
      },
      {
        accessorKey: "amountOwed",
        header: t`Outstanding`,
        cell: ({ row }) => {
          const owed = row.original.amountOwed ?? 0;
          return (
            <span
              className={`tabular-nums font-semibold ${owed > 0 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}
            >
              {formatCurrency(owed)}
            </span>
          );
        },
        meta: {
          icon: <LuCircle />,
          renderTotal: true,
          formatter: (val: number) => currencyFormatter.format(val)
        }
      },
      {
        accessorKey: "status",
        header: t`Status`,
        cell: ({ row }) => {
          const paymentStatus = getSalaryPaymentStatus(
            row.original.totalEarned,
            row.original.totalPaid
          );
          return (
            <Badge variant={statusVariant(paymentStatus)}>{paymentStatus}</Badge>
          );
        },
        meta: {
          filter: {
            type: "static" as const,
            options: [
              { value: "Unpaid", label: <Badge variant="secondary">Unpaid</Badge> },
              { value: "Partially Paid", label: <Badge variant="yellow">Partially Paid</Badge> },
              { value: "Paid", label: <Badge variant="green">Paid</Badge> }
            ],
            isArray: false
          }
        }
      },
      {
        id: "salaryActions",
        header: () => <span className="sr-only">{t`Actions`}</span>,
        cell: ({ row }) =>
          row.original.employeeId ? (
            <SalaryRowActions
              employeeId={row.original.employeeId}
              salaryRecordId={row.original.id}
              amountOwed={row.original.amountOwed}
              pendingAmount={row.original.pendingAmount}
              year={year}
              month={month}
            />
          ) : null,
        size: 140,
        enablePinning: false,
        meta: {
          cellClassName: "transition-none"
        }
      }
    ];
  }, [currencyFormatter, departments, month, t, year]);

  return (
    <Table<SalaryRecord>
      data={data}
      count={count}
      columns={columns}
      getRowHref={(row) =>
        row.employeeId
          ? path.to.employeeSalaryMonth(row.employeeId, year, month)
          : undefined
      }
      primaryAction={
        <SalaryPeriodPicker year={year} month={month} onChange={goToMonth} />
      }
      withSearch
      withPagination
      title={t`Salary`}
    />
  );
});

SalaryTable.displayName = "SalaryTable";
export default SalaryTable;
