import type { ComboboxProps } from "@carbon/form";
import { Combobox } from "@carbon/form";
import { useMount } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { useMemo } from "react";
import { useFetcher } from "react-router";
import type { getTemplatesList } from "~/modules/items/template.service";
import { path } from "~/utils/path";

type TemplateSelectProps = Omit<ComboboxProps, "options">;

const Template = (props: TemplateSelectProps) => {
  const { t } = useLingui();
  const templateFetcher =
    useFetcher<Awaited<ReturnType<typeof getTemplatesList>>>();

  useMount(() => {
    templateFetcher.load(path.to.api.templates);
  });

  const options = useMemo(
    () =>
      (templateFetcher.data?.data ?? []).map((template) => ({
        value: template.id,
        label: template.name,
        helper: template.description ?? ""
      })),
    [templateFetcher.data?.data]
  );

  return (
    <Combobox
      options={options}
      {...props}
      label={props?.label ?? t`Template`}
      isLoading={templateFetcher.state === "loading"}
      isOptional
      itemHeight={56}
    />
  );
};

Template.displayName = "Template";

export default Template;
