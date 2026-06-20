import { useCallback } from "react";
import { useSearchParams, useSubmit } from "react-router";

export function useUrlParams(): [
  URLSearchParams,
  (
    params: Record<string, string | string[] | number | undefined | null>
  ) => void
] {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();

  const setSearchParams = useCallback(
    (params: Record<string, string | string[] | number | undefined | null>) => {
      Object.entries(params).forEach(([name, value]) => {
        if (value === undefined || value === null || value === "") {
          searchParams.delete(name);
          return;
        }

        if (Array.isArray(value)) {
          if (value.length === 0) {
            searchParams.delete(name);
          } else {
            value.forEach((v, i) => {
              if (i === 0) {
                searchParams.set(name, v.toString());
              } else {
                searchParams.append(name, v.toString());
              }
            });
          }
          return;
        }

        searchParams.set(name, value.toString());
      });

      submit(searchParams);
    },
    [submit, searchParams]
  );

  return [searchParams, setSearchParams];
}
