import { useLingui } from "@lingui/react/macro";

/** Outside op pill for BOP cards — plain span so parent truncate cannot collapse it. */
export function OutsideOperationBadge() {
  const { t } = useLingui();

  return (
    <span className="inline-flex shrink-0 items-center rounded-md bg-primary px-2 min-h-5 text-[11px] font-bold uppercase tracking-tight text-primary-foreground shadow-sm whitespace-nowrap">
      {t`Outside`}
    </span>
  );
}
