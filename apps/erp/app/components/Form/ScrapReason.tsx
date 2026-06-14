import type { ComboboxProps } from "@carbon/form";
import { Combobox } from "@carbon/form";
import { useMount } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { useMemo } from "react";
import { useFetcher } from "react-router";
import { useRouteData } from "~/hooks";
import type {
  getScrapReasonsList,
  ScrapReason as ScrapReasonType
} from "~/modules/production";
import { path } from "~/utils/path";
import { translateSeedDisplayName } from "~/utils/seedDataDisplayName";

type ScrapReasonSelectProps = Omit<ComboboxProps, "options">;

const ScrapReason = (props: ScrapReasonSelectProps) => {
  const options = useScrapReasons();

  return (
    <Combobox
      options={options}
      {...props}
      label={props?.label ?? "Scrap Reason"}
    />
  );
};

ScrapReason.displayName = "ScrapReason";

export default ScrapReason;

export const useScrapReasons = () => {
  const { i18n } = useLingui();
  const scrapReasonFetcher =
    useFetcher<Awaited<ReturnType<typeof getScrapReasonsList>>>();

  const sharedProductionData = useRouteData<{
    scrapReasons: ScrapReasonType[];
  }>(path.to.productionDashboard);

  const hasScrapReasonData = sharedProductionData?.scrapReasons;

  useMount(() => {
    if (!hasScrapReasonData) scrapReasonFetcher.load(path.to.api.scrapReasons);
  });

  const options = useMemo(() => {
    const dataSource =
      (hasScrapReasonData
        ? sharedProductionData.scrapReasons
        : scrapReasonFetcher.data?.data) ?? [];

    return dataSource.map((c) => ({
      value: c.id,
      label: translateSeedDisplayName(c.name, i18n)
    }));
  }, [
    scrapReasonFetcher.data?.data,
    hasScrapReasonData,
    sharedProductionData?.scrapReasons,
    i18n
  ]);

  return options;
};
