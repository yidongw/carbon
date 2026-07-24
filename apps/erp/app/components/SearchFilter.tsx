import type { InputProps } from "@carbon/react";
import {
  Input,
  InputGroup,
  InputLeftElement,
  useDebounce
} from "@carbon/react";
import { useState } from "react";
import { LuSearch } from "react-icons/lu";
import { useUrlParams } from "~/hooks";

type SearchFilterProps = InputProps & {
  param: string;
  /**
   * When true, applying the search performs a full-document navigation
   * (window.location) instead of a client-side React Router navigation.
   * Needed for routes whose client-rendered tree does not reflect loaderData
   * updates (e.g. /x/items/styles), where a client-side search leaves the list
   * frozen on the previous result — a full load re-runs SSR and renders the
   * filtered result correctly.
   */
  reloadDocument?: boolean;
};

const SearchFilter = ({
  param,
  size,
  reloadDocument,
  ...props
}: SearchFilterProps) => {
  const [params, setParams] = useUrlParams();
  const [query, setQuery] = useState(params.get(param) || "");
  const debounceQuery = useDebounce((q: string) => {
    if (reloadDocument && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (q) {
        url.searchParams.set(param, q);
      } else {
        url.searchParams.delete(param);
      }
      url.searchParams.delete("offset");
      url.searchParams.delete("limit");
      window.location.assign(url.toString());
      return;
    }
    setParams({ [param]: q, offset: null, limit: null });
  }, 500);

  return (
    <InputGroup size={size}>
      <InputLeftElement>
        <LuSearch className="text-muted-foreground w-3.5 h-3.5 mt-[-2px]" />
      </InputLeftElement>
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          debounceQuery(e.target.value);
        }}
        className="w-[100px] sm:w-[200px] text-sm"
        {...props}
      />
    </InputGroup>
  );
};

export default SearchFilter;
