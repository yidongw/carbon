import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  throw redirect(`${path.to.accountingSalary}${url.search}`);
}

export default function PeopleSalaryIndexRedirect() {
  return null;
}
