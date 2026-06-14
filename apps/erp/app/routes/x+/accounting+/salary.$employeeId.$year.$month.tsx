import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { msg } from "@lingui/core/macro";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData } from "react-router";
import {
  approveProductionQuantity,
  getEmployeeSalaryCompletions,
  getEmployeeSalaryPayments,
  getEmployeeSalaryRecord,
  getPendingSalaryCompletions
} from "~/modules/people";
import { SalaryDetailView } from "~/modules/people/ui/Salary";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Salary Detail`
};

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

  const [salaryRecord, completions, pending, employee] = await Promise.all([
    getEmployeeSalaryRecord(client, employeeId, companyId, year, month),
    getEmployeeSalaryCompletions(client, employeeId, companyId, year, month),
    getPendingSalaryCompletions(client, employeeId, companyId),
    client
      .from("employees")
      .select("id, name, firstName, lastName, avatarUrl")
      .eq("id", employeeId)
      .eq("companyId", companyId)
      .maybeSingle()
  ]);

  if (salaryRecord.error) {
    throw redirect(
      path.to.accountingSalary,
      await flash(
        request,
        error(salaryRecord.error, "Failed to load salary record")
      )
    );
  }

  let payments: Awaited<
    ReturnType<typeof getEmployeeSalaryPayments>
  >["data"] = [];
  if (salaryRecord.data?.id) {
    const paymentsResult = await getEmployeeSalaryPayments(
      client,
      salaryRecord.data.id
    );
    payments = paymentsResult.data ?? [];
  }

  return {
    employeeId,
    year,
    month,
    salaryRecord: salaryRecord.data,
    employee: employee.data,
    completions: completions.data ?? [],
    pending: pending.data ?? [],
    payments
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "people"
  });

  const { year: yearStr, month: monthStr } = params;
  const year = Number(yearStr);
  const month = Number(monthStr);

  const formData = await request.formData();
  const productionQuantityId = formData.get("productionQuantityId") as string;
  if (!productionQuantityId) return { error: "Missing productionQuantityId" };

  const result = await approveProductionQuantity(
    client,
    productionQuantityId,
    year,
    month,
    userId
  );
  if (result.error) return { error: result.error.message };

  return { ok: true };
}

export default function SalaryDetailRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <SalaryDetailView
      employeeId={data.employeeId}
      year={data.year}
      month={data.month}
      salaryRecord={data.salaryRecord}
      employee={data.employee}
      completions={data.completions}
      pending={data.pending}
      payments={data.payments}
    />
  );
}
