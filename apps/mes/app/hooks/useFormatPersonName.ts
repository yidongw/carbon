import { formatPersonName, type PersonNameParts } from "@carbon/utils";
import { useCallback } from "react";
import { useRouteData } from "@carbon/react";
import { path } from "~/utils/path";

export function useFormatPersonName() {
  const routeData = useRouteData<{ lastNameFirst?: boolean }>(
    path.to.authenticatedRoot
  );
  const lastNameFirst = routeData?.lastNameFirst ?? false;

  return useCallback(
    (person: PersonNameParts) => formatPersonName(person, lastNameFirst),
    [lastNameFirst]
  );
}
