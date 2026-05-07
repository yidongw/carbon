import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { path } from "~/utils/path";

export async function loader({ params }: LoaderFunctionArgs) {
  const { templateId } = params;
  if (!templateId) throw new Error("Could not find templateId");
  throw redirect(path.to.templateDetails(templateId));
}
