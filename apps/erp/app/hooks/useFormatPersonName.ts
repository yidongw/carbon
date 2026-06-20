import { formatPersonName, type PersonNameParts } from "@carbon/utils";
import { useCallback } from "react";
import { useSettings } from "./useSettings";

export function useFormatPersonName() {
  const { lastNameFirst } = useSettings();

  return useCallback(
    (person: PersonNameParts) => formatPersonName(person, lastNameFirst),
    [lastNameFirst]
  );
}
