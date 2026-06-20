import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  HStack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  toast,
  Tr,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect } from "react";
import {
  LuBanknote,
  LuCircleCheck,
  LuClock,
  LuExternalLink
} from "react-icons/lu";
import { Outlet, useFetcher, useNavigate } from "react-router";
import { useCurrencyFormatter, usePermissions } from "~/hooks";
import { path } from "~/utils/path";
import {
  formatDateTime,
  getEarned,
  getEmployeeName,
  getJobOperationDescription,
  getJobReadableId,
  getProcessName,
  getSalaryPaymentStatus,
  getUnitCost,
  MONTH_NAMES,
  statusVariant,
  type SalaryCompletionRow
} from "./salaryDetail.utils";

type SalaryRecord = {
  id: string | null;
  status: string | null;
  totalEarned: number | null;
  totalPaid: number | null;
  employeeName?: string | null;
  avatarUrl?: string | null;
};

type Employee = {
  id: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
} | null;

type Payment = {
  id: string;
  amount: number | null;
  paidAt: string | null;
  notes: string | null;
  paidByUser?: {
    fullName?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  } | null;
};

type SalaryDetailViewProps = {
  employeeId: string;
  year: number;
  month: number;
  salaryRecord: SalaryRecord | null;
  employee: Employee;
  completions: SalaryCompletionRow[];
  pending: SalaryCompletionRow[];
  payments: Payment[];
};

function CompletionTable({
  rows,
  formatCurrency,
  formatUnitCost,
  showApprove,
  onApprove,
  isApproving
}: {
  rows: SalaryCompletionRow[];
  formatCurrency: (n: number | null | undefined) => string;
  formatUnitCost: (n: number | null | undefined) => string;
  showApprove?: boolean;
  onApprove?: (id: string) => void;
  isApproving?: boolean;
}) {
  const { t } = useLingui();

  if (rows.length === 0) {
    return (
      <p className="px-6 py-10 text-center text-sm text-muted-foreground">
        <Trans>No entries</Trans>
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <Thead>
          <Tr>
            <Th>{t`Job`}</Th>
            <Th>{t`Operation`}</Th>
            <Th className="text-right">{t`Qty`}</Th>
            <Th className="text-right">{t`Unit rate`}</Th>
            <Th className="text-right">{t`Amount`}</Th>
            <Th>{t`Submitted`}</Th>
            {showApprove && <Th className="w-28" />}
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((c) => (
            <Tr key={c.id}>
              <Td className="font-mono text-sm font-medium">
                {getJobReadableId(c)}
              </Td>
              <Td>
                <div className="text-sm">{getProcessName(c) ?? "—"}</div>
                {getJobOperationDescription(c) && (
                  <div className="text-xs text-muted-foreground truncate max-w-48">
                    {getJobOperationDescription(c)}
                  </div>
                )}
              </Td>
              <Td className="text-right tabular-nums">{c.quantity}</Td>
              <Td className="text-right tabular-nums">
                {formatUnitCost(getUnitCost(c))}
              </Td>
              <Td className="text-right tabular-nums font-semibold">
                {formatCurrency(getEarned(c))}
              </Td>
              <Td className="text-sm text-muted-foreground whitespace-nowrap">
                {formatDateTime(c.createdAt)}
              </Td>
              {showApprove && onApprove && (
                <Td>
                  <Button
                    size="sm"
                    variant="secondary"
                    leftIcon={<LuCircleCheck />}
                    onClick={() => onApprove(c.id)}
                    isDisabled={isApproving}
                  >
                    <Trans>Approve</Trans>
                  </Button>
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}

export default function SalaryDetailView({
  employeeId,
  year,
  month,
  salaryRecord,
  employee,
  completions,
  pending,
  payments
}: SalaryDetailViewProps) {
  const { t } = useLingui();
  const navigate = useNavigate();
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const permissions = usePermissions();
  const canUpdate = permissions.can("update", "people");
  const canCreatePayment = permissions.can("create", "people");

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if (fetcher.data.error) {
      toast.error(fetcher.data.error);
      return;
    }
    if (fetcher.data.ok) {
      toast.success(t`Saved`);
    }
  }, [fetcher.data, fetcher.state, t]);

  const currencyFormatter = useCurrencyFormatter({ minimumFractionDigits: 2 });
  const formatCurrency = (amount: number | null | undefined) =>
    amount == null ? "—" : currencyFormatter.format(amount);
  const unitCostFormatter = useCurrencyFormatter({ minimumFractionDigits: 4 });
  const formatUnitCost = (amount: number | null | undefined) =>
    amount == null ? "—" : unitCostFormatter.format(amount);

  const employeeName =
    getEmployeeName(
      employee
        ? { fullName: employee.name, firstName: employee.firstName, lastName: employee.lastName }
        : null,
      ""
    ) ||
    salaryRecord?.employeeName ||
    employeeId;
  const employeeAvatar = employee?.avatarUrl ?? salaryRecord?.avatarUrl ?? undefined;
  const periodLabel = `${MONTH_NAMES[month - 1]} ${year}`;

  const totalEarned = salaryRecord?.totalEarned ?? 0;
  const totalPaid = salaryRecord?.totalPaid ?? 0;
  const amountOwed = totalEarned - totalPaid;
  const paymentStatus = getSalaryPaymentStatus(totalEarned, totalPaid);
  const isApproving = fetcher.state !== "idle";

  const submitAction = path.to.employeeSalaryMonth(employeeId, year, month);

  const approveEntry = (productionQuantityId: string) => {
    const formData = new FormData();
    formData.append("productionQuantityId", productionQuantityId);
    fetcher.submit(formData, { method: "post", action: submitAction });
  };

  return (
    <div className="max-w-4xl w-full p-2 sm:px-0 mx-auto mt-0 md:mt-8 pb-8">
      <VStack spacing={4} className="w-full">
        <Card>
          <CardHeader>
            <HStack className="items-start justify-between gap-4 flex-wrap">
              <HStack spacing={3} className="items-center min-w-0">
                <Avatar className="size-11" src={employeeAvatar} name={employeeName} />
                <div className="min-w-0">
                  <CardTitle className="text-xl text-balance">{employeeName}</CardTitle>
                  <CardDescription className="mt-1">
                    <Trans>Salary for {periodLabel}</Trans>
                  </CardDescription>
                </div>
              </HStack>
              {salaryRecord && (
                <Badge variant={statusVariant(paymentStatus)} className="shrink-0">
                  {paymentStatus}
                </Badge>
              )}
            </HStack>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <HStack spacing={2} className="text-sm text-muted-foreground mb-2">
                  <LuBanknote className="size-4 shrink-0" />
                  <span>
                    <Trans>Total earned</Trans>
                  </span>
                </HStack>
                <p className="text-2xl font-medium tracking-tight tabular-nums">
                  {formatCurrency(totalEarned)}
                </p>
                <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                  {completions.length}{" "}
                  <Trans>approved completion(s)</Trans>
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <HStack spacing={2} className="text-sm text-muted-foreground mb-2">
                  <LuCircleCheck className="size-4 shrink-0" />
                  <span>
                    <Trans>Total paid</Trans>
                  </span>
                </HStack>
                <p className="text-2xl font-medium tracking-tight tabular-nums">
                  {formatCurrency(totalPaid)}
                </p>
                <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                  {payments.length}{" "}
                  <Trans>payment(s)</Trans>
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <HStack spacing={2} className="text-sm text-muted-foreground mb-2">
                  <LuClock className="size-4 shrink-0" />
                  <span>
                    <Trans>Outstanding</Trans>
                  </span>
                </HStack>
                <p
                  className={`text-2xl font-medium tracking-tight tabular-nums ${
                    amountOwed > 0 ? "text-amber-600 dark:text-amber-400" : ""
                  }`}
                >
                  {formatCurrency(amountOwed)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {amountOwed > 0 ? (
                    <Trans>Pending payment</Trans>
                  ) : (
                    <Trans>Fully paid</Trans>
                  )}
                </p>
              </div>
            </div>
          </CardContent>

          {canCreatePayment && amountOwed > 0 && salaryRecord?.id ? (
            <CardFooter className="flex flex-wrap gap-2 justify-end border-t border-border">
              <Button
                leftIcon={<LuBanknote />}
                onClick={() =>
                  navigate(path.to.newSalaryPayment(employeeId, year, month))
                }
              >
                <Trans>Record payment</Trans>
              </Button>
            </CardFooter>
          ) : null}
        </Card>

        {canUpdate && pending.length > 0 && (
          <Card>
            <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
              <div>
                <CardTitle>
                  <Trans>Pending approval</Trans>
                </CardTitle>
                <CardDescription className="mt-1">
                  <Trans>
                    Approve here or manage all pending items on the quantity review page.
                  </Trans>
                </CardDescription>
              </div>
              <HStack spacing={2} className="shrink-0">
                <Badge variant="secondary">{pending.length}</Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  rightIcon={<LuExternalLink />}
                  onClick={() => navigate(path.to.quantityReview)}
                >
                  <Trans>Quantity review</Trans>
                </Button>
              </HStack>
            </CardHeader>
            <CardContent className="p-0">
              <CompletionTable
                rows={pending}
                formatCurrency={formatCurrency}
                formatUnitCost={formatUnitCost}
                showApprove
                onApprove={approveEntry}
                isApproving={isApproving}
              />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>
              <Trans>Approved completions</Trans>
            </CardTitle>
            <CardDescription>
              <Trans>Production quantities approved for this pay period.</Trans>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {completions.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-muted-foreground">
                <Trans>No approved completions this period</Trans>
              </p>
            ) : (
              <CompletionTable
                rows={completions}
                formatCurrency={formatCurrency}
                formatUnitCost={formatUnitCost}
              />
            )}
          </CardContent>
        </Card>

        {payments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                <Trans>Payment history</Trans>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <Thead>
                    <Tr>
                      <Th>{t`Amount`}</Th>
                      <Th>{t`Paid at`}</Th>
                      <Th>{t`Paid by`}</Th>
                      <Th>{t`Notes`}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {payments.map((p) => (
                      <Tr key={p.id}>
                        <Td className="tabular-nums font-semibold">
                          {formatCurrency(p.amount)}
                        </Td>
                        <Td className="text-sm whitespace-nowrap">
                          {formatDateTime(p.paidAt)}
                        </Td>
                        <Td className="text-sm">
                          {getEmployeeName(p.paidByUser)}
                        </Td>
                        <Td className="text-sm text-muted-foreground max-w-xs truncate">
                          {p.notes ?? "—"}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        <Outlet />
      </VStack>
    </div>
  );
}
