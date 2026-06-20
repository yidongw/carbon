import { useUrlParams } from "~/hooks";
import { parseFilterParam } from "~/utils/query";

export function useFilters() {
  const [params, setParams] = useUrlParams();
  const urlFiltersParams = params.getAll("filter");
  const hasFilter = (searchKey: string, searchValue: string) => {
    return urlFiltersParams.some((filter) => {
      const parsed = parseFilterParam(filter);
      if (!parsed) return false;
      const { column: key, operator, value } = parsed;
      switch (operator) {
        case "eq":
          return key === searchKey && value === searchValue;
        case "in":
        case "contains": {
          const values = value.split(",");
          return key === searchKey && values.some((v) => v === searchValue);
        }
        default:
          return false;
      }
    });
  };

  const hasFilterKey = (searchKey: string) => {
    return urlFiltersParams.some((filter) => {
      const [key] = filter.split(":");
      return key === searchKey;
    });
  };

  const getFilterKeyIndex = (key: string) => {
    return urlFiltersParams.findIndex((f) => {
      let accessorKey = f.split(":")?.[0];
      return key === accessorKey;
    });
  };

  const getFilter = (searchKey: string): string[] => {
    const filter = urlFiltersParams.find((param) => {
      const parsed = parseFilterParam(param);
      return parsed?.column === searchKey;
    });

    if (!filter) {
      return [];
    }

    const parsed = parseFilterParam(filter);
    if (!parsed?.value) {
      return [];
    }

    if (["in", "contains"].includes(parsed.operator)) {
      return parsed.value.split(",");
    }

    return [parsed.value];
  };

  const addFilter = (newKey: string, newValue: string, isArray = false) => {
    if (hasFilterKey(newKey)) {
      const filterIndex = getFilterKeyIndex(newKey);
      const filter = urlFiltersParams[filterIndex];
      const parsed = parseFilterParam(filter);
      if (!parsed) return;
      const { column: key, operator, value } = parsed;

      let newFilter = "";
      if (["in", "contains"].includes(operator)) {
        newFilter = `${key}:${operator}:${value},${newValue}`;
      } else {
        newFilter = `${key}:in:${value},${newValue}`;
      }

      setParams({
        filter: urlFiltersParams.map((f, index) =>
          index === filterIndex ? newFilter : f
        )
      });
    } else {
      if (isArray) {
        setParams({
          filter: urlFiltersParams.concat(`${newKey}:contains:${newValue}`)
        });
      } else {
        setParams({
          filter: urlFiltersParams.concat(`${newKey}:eq:${newValue}`)
        });
      }
    }
  };

  const removeFilter = (oldKey: string, oldValue: string, isArray = false) => {
    const filterIndex = getFilterKeyIndex(oldKey);
    const filter = urlFiltersParams[filterIndex];
    const parsed = parseFilterParam(filter);
    if (!parsed) return;
    const { column: key, operator, value } = parsed;
    if (["in", "contains"].includes(operator)) {
      const values = value.split(",").filter((v) => v !== oldValue);
      if (operator === "in" && values.length === 1) {
        setParams({
          filter: urlFiltersParams.map((f, index) =>
            index === filterIndex ? `${key}:eq:${values[0]}` : f
          )
        });
      } else if (values.length === 0) {
        const newFilters = urlFiltersParams.filter(
          (_, index) => index !== filterIndex
        );
        setParams({
          filter: newFilters.length > 0 ? newFilters : undefined,
          ...(newFilters.length === 0 ? { offset: 0 } : {})
        });
      } else {
        setParams({
          filter: urlFiltersParams.map((f, index) =>
            index === filterIndex ? `${key}:${operator}:${values.join(",")}` : f
          )
        });
      }
    } else {
      const newFilters = urlFiltersParams.filter(
        (_, index) => index !== filterIndex
      );
      setParams({
        filter: newFilters.length > 0 ? newFilters : undefined,
        ...(newFilters.length === 0 ? { offset: 0 } : {})
      });
    }
  };

  const removeKey = (key: string) => {
    const newFilters = urlFiltersParams.filter((f) => {
      const [filterKey] = f.split(":");
      return filterKey !== key;
    });
    setParams({
      filter: newFilters.length > 0 ? newFilters : undefined,
      ...(newFilters.length === 0 ? { offset: 0 } : {})
    });
  };

  const toggleFilter = (key: string, value: string, isArray = false) => {
    if (hasFilter(key, value)) {
      removeFilter(key, value, isArray);
    } else {
      addFilter(key, value, isArray);
    }
  };

  const clearFilters = () => {
    setParams({
      filter: undefined,
      offset: 0
    });
  };

  const hasFilters = urlFiltersParams.filter(Boolean).length > 0;

  return {
    clearFilters,
    getFilter,
    hasFilter,
    hasFilters,
    hasFilterKey,
    removeKey,
    toggleFilter,
    urlFiltersParams
  };
}
