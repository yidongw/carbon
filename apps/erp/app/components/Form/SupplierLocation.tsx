import type { ComboboxProps } from "@carbon/form";
import { CreatableCombobox } from "@carbon/form";
import { useDisclosure } from "@carbon/react";
import { formatAddress } from "@carbon/utils";
import { useEffect, useMemo, useRef } from "react";
import { useFetcher } from "react-router";
import type {
  getSupplierLocations,
  SupplierLocation as SupplierLocationType
} from "~/modules/purchasing";
import { SupplierLocationForm } from "~/modules/purchasing/ui/Supplier";
import { path } from "~/utils/path";

type SupplierLocationSelectProps = Omit<
  ComboboxProps,
  "options" | "onChange" | "inline"
> & {
  supplier?: string;
  inline?: boolean;
  // Show only the location name (e.g. "Main Office"). Use where the address is
  // already shown separately. Falls back to the address when a location is unnamed.
  nameOnly?: boolean;
  onChange?: (supplier: SupplierLocationType | null) => void;
};

const SupplierLocationPreview = (
  value: string,
  options: { value: string; label: string | JSX.Element }[]
) => {
  const location = options.find((o) => o.value === value);
  if (!location) return null;
  return <span>{location.label}</span>;
};

const SupplierLocation = (props: SupplierLocationSelectProps) => {
  const newLocationModal = useDisclosure();
  // const [created, setCreated] = useState<string>("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const supplierLocationsFetcher =
    useFetcher<Awaited<ReturnType<typeof getSupplierLocations>>>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  useEffect(() => {
    if (props?.supplier) {
      supplierLocationsFetcher.load(
        path.to.api.supplierLocations(props.supplier)
      );
    }
  }, [props.supplier]);

  const nameOnly = props.nameOnly;
  const options = useMemo(
    () =>
      supplierLocationsFetcher.data?.data?.map((c) => {
        const address = formatAddress(
          c.address?.addressLine1,
          c.address?.addressLine2,
          c.address?.city,
          c.address?.stateProvince
        );
        return {
          value: c.id,
          label: nameOnly ? c.name || address : `${address} (${c.name})`
        };
      }) ?? [],

    [supplierLocationsFetcher.data, nameOnly]
  );

  const onChange = (
    newValue: { label: string | JSX.Element; value: string } | null
  ) => {
    const location =
      supplierLocationsFetcher.data?.data?.find(
        (location) => location.id === newValue?.value
      ) ?? null;

    props.onChange?.(location as SupplierLocationType | null);
  };

  return (
    <>
      <CreatableCombobox
        ref={triggerRef}
        options={options}
        {...props}
        inline={props?.inline ? SupplierLocationPreview : undefined}
        label={props?.label ?? "Supplier Location"}
        onChange={onChange}
        onCreateOption={(option) => {
          newLocationModal.onOpen();
          // setCreated(option);
        }}
      />
      {newLocationModal.isOpen && (
        <SupplierLocationForm
          supplierId={props.supplier!}
          type="modal"
          onClose={() => {
            // setCreated("");
            newLocationModal.onClose();
            triggerRef.current?.click();
          }}
          initialValues={{ name: "" }}
        />
      )}
    </>
  );
};

export default SupplierLocation;
