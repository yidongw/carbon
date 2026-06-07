import { useRouteData } from "@carbon/react";
import { path } from "~/utils/path";

export function useSupplierApprovalRequired(): boolean {
  const routeData = useRouteData<{
    supplierApprovalRequired: boolean;
  }>(path.to.authenticatedRoot);
  return routeData?.supplierApprovalRequired ?? false;
}
