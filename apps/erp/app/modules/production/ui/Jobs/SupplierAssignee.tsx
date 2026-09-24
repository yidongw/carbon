import {
  buttonVariants,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  cn,
  HStack,
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useMemo, useState } from "react";
import { LuBuilding2 } from "react-icons/lu";
import { RxCheck } from "react-icons/rx";
import { useFetcher } from "react-router";
import { useSupplierProcesses } from "~/components/Form/SupplierProcess";
import SupplierAvatar from "~/components/SupplierAvatar";
import { usePermissions } from "~/hooks";
import { useSuppliers } from "~/stores";
import { path } from "~/utils/path";

type SupplierAssigneeProps = {
  /** jobOperation id */
  id: string;
  /** The operation's process, used to load the eligible supplier processes. */
  processId?: string | null;
  /** Current operationSupplierProcessId. */
  value?: string;
  size?: "sm" | "md";
  isReadOnly?: boolean;
};

/**
 * Assignee cell for OUTSIDE-processing operations. Subcontracted work is
 * performed by a supplier, so instead of the employee picker this lets the user
 * pick a supplier (via the operation's `supplierProcess`), persisting the choice
 * to `jobOperation.operationSupplierProcessId`.
 */
export function SupplierAssignee({
  id,
  processId,
  value,
  size = "sm",
  isReadOnly
}: SupplierAssigneeProps) {
  const { t } = useLingui();
  const [open, setOpen] = useState(false);
  const [suppliers] = useSuppliers();
  const supplierProcesses = useSupplierProcesses({
    processId: processId ?? undefined
  });
  const fetcher = useFetcher<{}>();
  const permissions = usePermissions();

  const handleChange = (next: string) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("operationSupplierProcessId", next);

    fetcher.submit(formData, {
      method: "post",
      action: path.to.jobOperationSupplierProcess
    });
  };

  // Reflect the pending selection optimistically while the fetcher is in flight.
  const pendingValue =
    fetcher.formData?.get("id") === id
      ? (fetcher.formData?.get("operationSupplierProcessId") as string)
      : undefined;
  const selectedValue = pendingValue ?? value ?? "";

  const options = useMemo(() => {
    const base = supplierProcesses
      .filter((sp): sp is typeof sp & { id: string } => Boolean(sp.id))
      .map((sp) => {
        const supplier = suppliers.find((s) => s.id === sp.supplierId);
        return {
          value: sp.id,
          supplierId: sp.supplierId ?? null,
          label: supplier?.name ?? t`Unknown Supplier`
        };
      });

    return [{ value: "", supplierId: null, label: t`Unassigned` }, ...base];
  }, [supplierProcesses, suppliers, t]);

  const selectedSupplierId =
    options.find((option) => option.value === selectedValue)?.supplierId ??
    null;

  return (
    <HStack className="w-full justify-between">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              buttonVariants({
                variant: "secondary",
                size,
                isDisabled:
                  isReadOnly || !permissions.can("update", "production"),
                isLoading: fetcher.state !== "idle",
                isIcon: false
              })
            )}
            role="combobox"
            aria-expanded={open}
            aria-controls="supplier-assignee-options"
            onClick={() => setOpen(true)}
            disabled={isReadOnly || !permissions.can("update", "production")}
          >
            {selectedSupplierId ? (
              <SupplierAvatar
                size={size === "sm" ? "xxs" : "xs"}
                supplierId={selectedSupplierId}
              />
            ) : (
              <div className="flex items-center justify-start gap-2">
                <LuBuilding2
                  className={size === "sm" ? "w-3 h-3" : "w-4 h-4"}
                />
                <span>
                  <Trans>Unassigned</Trans>
                </span>
              </div>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="min-w-[var(--radix-popover-trigger-width)] p-0"
        >
          <Command id="supplier-assignee-options">
            <CommandInput placeholder={t`Search...`} className="h-9" />
            <CommandEmpty>
              <Trans>No supplier found.</Trans>
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  value={option.label}
                  key={option.value || "unassigned"}
                  onSelect={() => {
                    handleChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <RxCheck
                    className={cn(
                      "ml-auto h-4 w-4",
                      option.value === selectedValue
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </HStack>
  );
}

export default SupplierAssignee;
