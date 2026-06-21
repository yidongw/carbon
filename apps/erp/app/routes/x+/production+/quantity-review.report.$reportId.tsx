import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { path } from "~/utils/path";

export async function loader({ params }: LoaderFunctionArgs) {
  const { reportId } = params;
  if (!reportId) {
    throw new Response("Missing reportId", { status: 400 });
  }
  throw redirect(path.to.productionQuantityReport(reportId));
}
