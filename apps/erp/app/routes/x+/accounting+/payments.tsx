import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { SalaryPaymentsTable } from "~/modules/accounting/ui/Payments";
import { getCompanySalaryPayments } from "~/modules/people";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Payments`,
  to: path.to.accountingPayments,
  module: "accounting"
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "people"
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const now = new Date();
  const year = Number(searchParams.get("year") ?? now.getFullYear());
  const month = Number(searchParams.get("month") ?? now.getMonth() + 1);
  const search = searchParams.get("search");
  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const payments = await getCompanySalaryPayments(
    client,
    companyId,
    year,
    month,
    { search, limit, offset, sorts, filters }
  );

  if (payments.error) {
    console.error("Failed to load payments", payments.error);
  }

  return {
    payments: payments.data ?? [],
    count: payments.count ?? 0,
    year,
    month
  };
}

export default function AccountingPaymentsRoute() {
  const { payments, count, year, month } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <SalaryPaymentsTable
        data={payments as any}
        count={count}
        year={year}
        month={month}
      />
    </VStack>
  );
}
