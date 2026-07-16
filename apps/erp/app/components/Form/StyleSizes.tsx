import type { MultiSelectProps } from "@carbon/form";
import { MultiSelect } from "@carbon/form";
import { useMount } from "@carbon/react";
import { useMemo } from "react";
import { useFetcher } from "react-router";
import type { getStyleSizeList } from "~/modules/items";
import { path } from "~/utils/path";

type StyleSizesProps = Omit<MultiSelectProps, "options">;

const StyleSizes = (props: StyleSizesProps) => {
  const fetcher = useFetcher<Awaited<ReturnType<typeof getStyleSizeList>>>();

  useMount(() => {
    fetcher.load(path.to.api.styleSizes);
  });

  const options = useMemo(
    () =>
      fetcher.data?.data
        ? fetcher.data.data.map((s) => ({
            value: s.id,
            label: s.sizeCode,
            helper: s.sizeName
          }))
        : [],
    [fetcher.data]
  );

  return (
    <MultiSelect options={options} {...props} label={props?.label ?? "Sizes"} />
  );
};

StyleSizes.displayName = "StyleSizes";

export default StyleSizes;
