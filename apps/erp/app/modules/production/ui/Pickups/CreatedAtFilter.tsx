import { Button, VStack } from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import { useState } from "react";
import type { CustomFilterRenderContext } from "~/components/Table/components/Filter/types";
import { useUrlParams } from "~/hooks";

export function CreatedAtFilter({ values, close }: CustomFilterRenderContext) {
  const [params, setParams] = useUrlParams();
  const currentValue = values[0] ?? "";
  const [rawStart, rawEnd] = currentValue.split("~");
  const [startDate, setStartDate] = useState(rawStart ?? "");
  const [endDate, setEndDate] = useState(rawEnd ?? "");

  const handleApply = () => {
    const existingFilters = params
      .getAll("filter")
      .filter((f) => !f.startsWith("createdAt:"));
    if (startDate || endDate) {
      existingFilters.push(`createdAt:eq:${startDate}~${endDate}`);
    }
    setParams({ filter: existingFilters.length > 0 ? existingFilters : null });
    close();
  };

  return (
    <VStack spacing={2} className="p-1 min-w-[220px]">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">
          <Trans>From</Trans>
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="h-8 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">
          <Trans>To</Trans>
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="h-8 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>
      <Button
        size="sm"
        variant="primary"
        onClick={handleApply}
        className="w-full"
      >
        <Trans>Apply</Trans>
      </Button>
    </VStack>
  );
}
