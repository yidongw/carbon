import { requirePermissions } from "@carbon/auth/auth.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData } from "react-router";
import { getAmountOwed, getEmployeeSalaryRecord } from "~/modules/people";
import { handleRecordSalaryPaymentAction } from "~/modules/people/salary-payment.server";
import { SalaryPaymentForm } from "~/modules/people/ui/Salary";
import { path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "people"
  });

  const { employeeId, year: yearStr, month: monthStr } = params;
  const year = Number(yearStr);
  const month = Number(monthStr);

  if (!employeeId || isNaN(year) || isNaN(month)) {
    throw redirect(path.to.accountingSalary);
  }

  const record = await getEmployeeSalaryRecord(
    client,
    employeeId,
    companyId,
    year,
    month
  );

  if (!record.data?.id) {
    throw redirect(path.to.employeeSalaryMonth(employeeId, year, month));
  }

  const amountOwed = getAmountOwed(record.data);
  if (amountOwed <= 0) {
    throw redirect(path.to.employeeSalaryMonth(employeeId, year, month));
  }

  return {
    year,
    month,
    salaryRecordId: record.data.id,
    amountOwed,
    returnTo: path.to.employeeSalaryMonth(employeeId, year, month)
  };
}

export async function action({ request }: ActionFunctionArgs) {
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

export default function SalaryPayRoute() {
  const { year, month, salaryRecordId, amountOwed, returnTo } =
    useLoaderData<typeof loader>();

  return (
    <SalaryPaymentForm
      salaryRecordId={salaryRecordId}
      year={year}
      month={month}
      amountOwed={amountOwed}
      returnTo={returnTo}
    />
  );
}
