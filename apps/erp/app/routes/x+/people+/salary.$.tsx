import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const splat = params["*"] ?? "";
  const url = new URL(request.url);
  throw redirect(`/x/accounting/salary/${splat}${url.search}`);
}

export default function PeopleSalaryRedirectSplat() {
  return null;
}
