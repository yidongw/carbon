import { assertIsPost } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData } from "react-router";
import {
  getAmountOwed,
  getDepartmentsList,
  getEmployeeSalaryList,
  getEmployeeSalaryRecord
} from "~/modules/people";
import {
  SalaryPaymentForm,
  SalaryRecordPaymentPicker,
  SalaryTable
} from "~/modules/people/ui/Salary";
import { handleRecordSalaryPaymentAction } from "~/modules/people/salary-payment.server";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "people"
  });

  return handleRecordSalaryPaymentAction(
    request,
    client,
    companyId,
    userId,
    await request.formData()
  );
}

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
  const payEmployeeId = searchParams.get("pay");
  const recordPayment = searchParams.get("recordPayment") === "1";
  const returnToParam = searchParams.get("returnTo");
  const salaryReturnParams = new URLSearchParams(searchParams);
  salaryReturnParams.delete("pay");
  salaryReturnParams.delete("recordPayment");
  salaryReturnParams.delete("returnTo");
  const defaultReturnTo = `${path.to.accountingSalary}?${salaryReturnParams.toString()}`;
  const returnTo =
    returnToParam && returnToParam.startsWith("/")
      ? returnToParam
      : defaultReturnTo;
  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const [records, departments] = await Promise.all([
    getEmployeeSalaryList(client, companyId, year, month, {
      search,
      limit,
      offset,
      sorts,
      filters
    }),
    getDepartmentsList(client, companyId)
  ]);

  if (records.error) {
    console.error("Failed to load salary data", records.error);
  }

  let payment: {
    year: number;
    month: number;
    salaryRecordId: string;
    amountOwed: number;
    returnTo: string;
  } | null = null;

  if (payEmployeeId) {
    const record = await getEmployeeSalaryRecord(
      client,
      payEmployeeId,
      companyId,
      year,
      month
    );
    const amountOwed = record.data ? getAmountOwed(record.data) : 0;

    if (record.data?.id && amountOwed > 0) {
      payment = {
        year,
        month,
        salaryRecordId: record.data.id,
        amountOwed,
        returnTo
      };
    } else {
      throw redirect(returnTo);
    }
  }

  return {
    records: records.data ?? [],
    count: records.count ?? 0,
    departments: departments.data ?? [],
    year,
    month,
    payment,
    pickPayment: recordPayment && !payment,
    returnTo
  };
}

export default function SalaryRoute() {
  const {
    records,
    count,
    departments,
    year,
    month,
    payment,
    pickPayment,
    returnTo
  } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <SalaryTable
        data={records}
        count={count}
        departments={departments}
        year={year}
        month={month}
      />
      {pickPayment ? (
        <SalaryRecordPaymentPicker
          records={records}
          year={year}
          month={month}
          returnTo={returnTo}
        />
      ) : null}
      {payment ? (
        <SalaryPaymentForm
          salaryRecordId={payment.salaryRecordId}
          year={payment.year}
          month={payment.month}
          amountOwed={payment.amountOwed}
          returnTo={payment.returnTo}
        />
      ) : null}
    </VStack>
  );
}
