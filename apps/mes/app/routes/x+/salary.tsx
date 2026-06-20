import { requirePermissions } from "@carbon/auth/auth.server";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Heading,
  HStack,
  SidebarTrigger,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useRouteData
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import {
  LuBanknote,
  LuChevronLeft,
  LuChevronRight,
  LuCircleCheck,
  LuClock
} from "react-icons/lu";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useNavigate } from "react-router";
import {
  getMyCompletions,
  getMyPendingCompletions,
  getMySalaryHistory,
  getMySalaryRecord
} from "~/services/people.service";
import { path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, userId, companyId } = await requirePermissions(request, {});

  const url = new URL(request.url);
  const now = new Date();
  const year = Number(url.searchParams.get("year") ?? now.getFullYear());
  const month = Number(url.searchParams.get("month") ?? now.getMonth() + 1);

  const [salaryRecord, completions, pending, history] = await Promise.all([
    getMySalaryRecord(client, userId, companyId, year, month),
    getMyCompletions(client, userId, companyId, year, month),
    getMyPendingCompletions(client, userId, companyId),
    getMySalaryHistory(client, userId, companyId)
  ]);

  return {
    year,
    month,
    salaryRecord: salaryRecord.data,
    completions: completions.data ?? [],
    pending: pending.data ?? [],
    history: history.data ?? []
  };
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

function makeCurrencyFormatter(currency: string) {
  const fmt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2
  });
  return (amount: number | null | undefined) =>
    amount == null ? "—" : fmt.format(amount);
}

function makeUnitCostFormatter(currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 4
  });
}

function formatDateTime(dateStr: string | null | undefined) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getSalaryPaymentStatus(
  totalEarned: number | null | undefined,
  totalPaid: number | null | undefined
) {
  const earned = totalEarned ?? 0;
  const paid = totalPaid ?? 0;

  if (paid > 0 && earned > 0 && paid >= earned) return "Paid";
  if (paid > 0) return "Partially Paid";
  return "Unpaid";
}

function statusVariant(status: string | null | undefined) {
  switch (status) {
    case "Paid":
      return "green";
    case "Partially Paid":
      return "yellow";
    case "Unpaid":
    default:
      return "secondary";
  }
}

function getJobReadableId(c: any) {
  const jo = c.jobOperation;
  if (!jo) return "—";
  const job = Array.isArray(jo.job) ? jo.job[0] : jo.job;
  return job?.jobId ?? "—";
}

function getProcessName(c: any) {
  const jo = c.jobOperation;
  if (!jo) return null;
  const process = Array.isArray(jo.process) ? jo.process[0] : jo.process;
  return process?.name ?? null;
}

function getUnitCost(c: any): number {
  const jo = Array.isArray(c.jobOperation) ? c.jobOperation[0] : c.jobOperation;
  return jo?.insideUnitCost ?? 0;
}

function getEarned(c: any): number {
  return (c.quantity ?? 0) * getUnitCost(c);
}

export default function MesSalaryRoute() {
  const { year, month, salaryRecord, completions, pending, history } =
    useLoaderData<typeof loader>();
  const { t } = useLingui();
  const navigate = useNavigate();
  const layoutData = useRouteData<{ company: { baseCurrencyCode?: string } }>(
    path.to.authenticatedRoot
  );
  const baseCurrencyCode = layoutData?.company?.baseCurrencyCode ?? "USD";
  const formatCurrency = makeCurrencyFormatter(baseCurrencyCode);
  const unitCostFormatter = makeUnitCostFormatter(baseCurrencyCode);

  const totalEarned = salaryRecord?.totalEarned ?? 0;
  const totalPaid = salaryRecord?.totalPaid ?? 0;
  const amountOwed = totalEarned - totalPaid;
  const paymentStatus = getSalaryPaymentStatus(totalEarned, totalPaid);

  const goToMonth = (y: number, m: number) => {
    navigate(`${path.to.salary}?year=${y}&month=${m}`);
  };
  const prevMonth = () =>
    month === 1 ? goToMonth(year - 1, 12) : goToMonth(year, month - 1);
  const nextMonth = () =>
    month === 12 ? goToMonth(year + 1, 1) : goToMonth(year, month + 1);

  return (
    <div className="flex flex-col flex-1">
      <header className="sticky top-0 z-10 flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b bg-background">
        <div className="flex items-center gap-2 px-2">
          <SidebarTrigger />
          <Heading size="h4">
            <Trans>My Salary</Trans>
          </Heading>
        </div>
      </header>

      <main className="h-[calc(100dvh-var(--header-height))] w-full overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent">
        <div className="p-4 flex flex-col gap-4">
          <HStack className="w-full justify-between items-center">
            <HStack spacing={2}>
              <Button size="sm" variant="ghost" onClick={prevMonth}>
                <LuChevronLeft className="size-4" />
              </Button>
              <span className="font-semibold text-base min-w-[10rem] text-center">
                {MONTH_NAMES[month - 1]} {year}
              </span>
              <Button size="sm" variant="ghost" onClick={nextMonth}>
                <LuChevronRight className="size-4" />
              </Button>
            </HStack>
            {salaryRecord && (
              <Badge variant={statusVariant(paymentStatus)}>{paymentStatus}</Badge>
            )}
          </HStack>

          <div className="grid w-full gap-4 grid-cols-1 sm:grid-cols-3">
            <Card>
              <CardHeader className="flex-row gap-2">
                <LuBanknote className="text-muted-foreground" />
                <CardTitle>
                  <Trans>Earned</Trans>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-medium tracking-tighter tabular-nums">
                  {formatCurrency(totalEarned)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {completions.length} <Trans>approved</Trans>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex-row gap-2">
                <LuCircleCheck className="text-muted-foreground" />
                <CardTitle>
                  <Trans>Paid</Trans>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-medium tracking-tighter tabular-nums">
                  {formatCurrency(totalPaid)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex-row gap-2">
                <LuClock className="text-muted-foreground" />
                <CardTitle>
                  <Trans>Owed</Trans>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-medium tracking-tighter tabular-nums">
                  {formatCurrency(amountOwed)}
                </p>
              </CardContent>
            </Card>
          </div>

          {pending.length > 0 && (
            <Card>
              <CardHeader className="flex-row items-center gap-2">
                <CardTitle>
                  <Trans>Pending Approval</Trans>
                </CardTitle>
                <Badge variant="secondary">{pending.length}</Badge>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {pending.map((c: any) => (
                  <div
                    key={c.id}
                    className="rounded-md border bg-card p-3 flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <HStack spacing={2} className="mb-0.5">
                        <span className="font-mono font-medium text-sm">
                          {getJobReadableId(c)}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          <Trans>Pending</Trans>
                        </Badge>
                      </HStack>
                      <div className="text-xs text-muted-foreground">
                        {getProcessName(c) ??
                          c.jobOperation?.description ??
                          "—"}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {formatDateTime(c.createdAt)}
                        {" · "}
                        <Trans>Qty</Trans>: {c.quantity}
                        {" · "}@{" "}
                        {unitCostFormatter.format(getUnitCost(c))}/{t`unit`}
                      </div>
                    </div>
                    <span className="font-semibold tabular-nums whitespace-nowrap">
                      {formatCurrency(getEarned(c))}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>
                <Trans>This Period</Trans>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {completions.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-6">
                  <Trans>No approved completions this period</Trans>
                </p>
              ) : (
                completions.map((c: any) => (
                  <div
                    key={c.id}
                    className="rounded-md border bg-card p-3 flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <HStack spacing={2} className="mb-0.5">
                        <span className="font-mono font-medium text-sm">
                          {getJobReadableId(c)}
                        </span>
                        <Badge variant="green" className="text-xs">
                          <Trans>Approved</Trans>
                        </Badge>
                      </HStack>
                      <div className="text-xs text-muted-foreground">
                        {getProcessName(c) ??
                          c.jobOperation?.description ??
                          "—"}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {formatDateTime(c.createdAt)}
                        {" · "}
                        <Trans>Qty</Trans>: {c.quantity}
                        {" · "}@{" "}
                        {unitCostFormatter.format(getUnitCost(c))}/{t`unit`}
                      </div>
                    </div>
                    <span className="font-semibold tabular-nums whitespace-nowrap">
                      {formatCurrency(getEarned(c))}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {history.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  <Trans>History</Trans>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <Thead>
                    <Tr>
                      <Th>{t`Period`}</Th>
                      <Th className="text-right">{t`Earned`}</Th>
                      <Th className="text-right">{t`Paid`}</Th>
                      <Th>{t`Status`}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {history
                      .filter(
                        (h: any) => !(h.year === year && h.month === month)
                      )
                      .map((h: any) => (
                        <Tr
                          key={`${h.year}-${h.month}`}
                          className="cursor-pointer hover:bg-muted/40"
                          onClick={() => goToMonth(h.year, h.month)}
                        >
                          <Td className="text-sm">
                            {MONTH_NAMES[(h.month as number) - 1]} {h.year}
                          </Td>
                          <Td className="text-right tabular-nums font-medium text-sm">
                            {formatCurrency(h.totalEarned)}
                          </Td>
                          <Td className="text-right tabular-nums text-sm text-muted-foreground">
                            {formatCurrency(h.totalPaid)}
                          </Td>
                          <Td>
                            <Badge
                              variant={statusVariant(
                                getSalaryPaymentStatus(h.totalEarned, h.totalPaid)
                              )}
                            >
                              {getSalaryPaymentStatus(h.totalEarned, h.totalPaid)}
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
