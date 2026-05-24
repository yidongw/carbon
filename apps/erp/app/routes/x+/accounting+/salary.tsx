import { msg } from "@lingui/core/macro";
import { Outlet } from "react-router";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Salary`,
  to: path.to.accountingSalary,
  module: "accounting"
};

export default function SalaryLayout() {
  return <Outlet />;
}
