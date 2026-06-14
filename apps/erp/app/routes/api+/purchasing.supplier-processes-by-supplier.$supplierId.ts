import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type {
  ClientLoaderFunctionArgs,
  LoaderFunctionArgs
} from "react-router";
import { data } from "react-router";
import { getSupplierProcessesBySupplier } from "~/modules/purchasing";
import { supplierProcessesBySupplierQuery } from "~/utils/react-query";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const authorized = await requirePermissions(request, {});

  const { supplierId } = params;

  if (!supplierId) {
    return {
      data: []
    };
  }

  const processes = await getSupplierProcessesBySupplier(
    authorized.client,
    supplierId
  );
  if (processes.error) {
    return data(
      processes,
      await flash(
        request,
        error(processes.error, "Failed to get supplier processes")
      )
    );
  }

  return processes;
}

export async function clientLoader({
  serverLoader,
  params
}: ClientLoaderFunctionArgs) {
  const { supplierId } = params;

  if (!supplierId) {
    return await serverLoader<typeof loader>();
  }

  const queryKey = supplierProcessesBySupplierQuery(supplierId).queryKey;
  const cached =
    window?.clientCache?.getQueryData<Awaited<ReturnType<typeof loader>>>(
      queryKey
    );

  if (!cached) {
    const serverData = await serverLoader<typeof loader>();
    window?.clientCache?.setQueryData(queryKey, serverData);
    return serverData;
  }

  return cached;
}
clientLoader.hydrate = true;
