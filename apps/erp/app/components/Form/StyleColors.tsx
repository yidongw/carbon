import type { MultiSelectProps } from "@carbon/form";
import { MultiSelect } from "@carbon/form";
import { useMount } from "@carbon/react";
import { useMemo } from "react";
import { useFetcher } from "react-router";
import type { getGarmentAttributeValueList } from "~/modules/items/itemAttribute.service";
import { path } from "~/utils/path";

type StyleColorsProps = Omit<MultiSelectProps, "options">;

const StyleColors = (props: StyleColorsProps) => {
  const fetcher =
    useFetcher<Awaited<ReturnType<typeof getGarmentAttributeValueList>>>();

  useMount(() => {
    fetcher.load(path.to.api.styleColors);
  });

  const options = useMemo(
    () =>
      fetcher.data?.data
        ? fetcher.data.data.map((c) => ({
            value: c.id,
            label: c.colorName || c.colorCode,
            helper: c.colorCode
          }))
        : [],
    [fetcher.data]
  );

  return (
    <MultiSelect
      options={options}
      {...props}
      label={props?.label ?? "Colors"}
    />
  );
};

StyleColors.displayName = "StyleColors";

export default StyleColors;
