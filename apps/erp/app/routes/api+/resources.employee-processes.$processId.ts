import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type {
  ClientLoaderFunctionArgs,
  LoaderFunctionArgs
} from "react-router";
import { data } from "react-router";
import { getEmployeeProcessesByProcess } from "~/modules/resources";
import { employeeProcessesQuery } from "~/utils/react-query";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const authorized = await requirePermissions(request, {});

  const { processId } = params;

  if (!processId)
    return {
      data: []
    };

  const employeeProcesses = await getEmployeeProcessesByProcess(
    authorized.client,
    processId
  );
  if (employeeProcesses.error) {
    return data(
      employeeProcesses,
      await flash(
        request,
        error(employeeProcesses.error, "Failed to get employee processes")
      )
    );
  }

  return employeeProcesses;
}

export async function clientLoader({
  serverLoader,
  params
}: ClientLoaderFunctionArgs) {
  const { processId } = params;

  if (!processId) {
    return await serverLoader<typeof loader>();
  }

  const queryKey = employeeProcessesQuery(processId).queryKey;
  const data =
    window?.clientCache?.getQueryData<Awaited<ReturnType<typeof loader>>>(
      queryKey
    );

  if (!data) {
    const serverData = await serverLoader<typeof loader>();
    window?.clientCache?.setQueryData(queryKey, serverData);
    return serverData;
  }

  return data;
}
clientLoader.hydrate = true;
