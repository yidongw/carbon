import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requirePermissions(request, { view: "people" });

  const { employeeId } = params;
  if (!employeeId) throw redirect(path.to.accountingSalary);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  throw redirect(path.to.employeeSalaryMonth(employeeId, year, month));
}
