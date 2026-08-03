import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import { getEmployeeProcessesByProcess } from "~/services/people.service";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {});

  const url = new URL(request.url);
  const processId = url.searchParams.get("processId");
  if (!processId) {
    return {
      data: [],
      error: null
    };
  }

  return await getEmployeeProcessesByProcess(client, processId, companyId);
}
