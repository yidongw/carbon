import { NumberControlled } from "@carbon/form";
import { useLingui } from "@lingui/react/macro";
import type { ComponentProps } from "react";

type QuantityWithConfigTableProps = ComponentProps<typeof NumberControlled> & {
  hasConfigurationParameters: boolean;
  onOpenConfigTable: () => void;
};

export function QuantityWithConfigTable({
  hasConfigurationParameters,
  onOpenConfigTable,
  ...props
}: QuantityWithConfigTableProps) {
  const { t } = useLingui();

  if (!hasConfigurationParameters) {
    return <NumberControlled {...props} />;
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={t`Configure quantities`}
      className="w-full cursor-pointer [&_input]:pointer-events-none [&_input]:cursor-pointer"
      onClick={onOpenConfigTable}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenConfigTable();
        }
      }}
    >
      <NumberControlled {...props} />
    </div>
  );
}
