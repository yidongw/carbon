import type { CreatableMultiSelectProps } from "@carbon/form";
import { CreatableMultiSelect } from "@carbon/form";
import { useDisclosure } from "@carbon/react";
import { useMemo, useRef, useState } from "react";
import { EntityFormModal } from "~/components/NewEntityModal";
import { SupplierForm } from "~/modules/purchasing/ui/Supplier";
import { useSuppliers } from "~/stores";

type SupplierSelectProps = Omit<CreatableMultiSelectProps, "options"> & {
  processId?: string;
};

const Suppliers = (props: SupplierSelectProps) => {
  const newSupplierModal = useDisclosure();

  const [created, setCreated] = useState<string>("");
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [suppliers] = useSuppliers();
  const options = useMemo(() => {
    return (
      suppliers.map((c) => ({
        value: c.id,
        label: c.name
      })) ?? []
    );
  }, [suppliers]);

  return (
    <>
      <CreatableMultiSelect
        ref={triggerRef}
        options={options}
        {...props}
        label={props?.label ?? "Work Center"}
        onCreateOption={(option) => {
          newSupplierModal.onOpen();
          setCreated(option);
        }}
      />
      {newSupplierModal.isOpen && (
        <EntityFormModal
          onClose={() => {
            setCreated("");
            newSupplierModal.onClose();
            triggerRef.current?.click();
          }}
        >
          <SupplierForm
            initialValues={{
              name: created
            }}
          />
        </EntityFormModal>
      )}
    </>
  );
};

Suppliers.displayName = "Supplier";

export default Suppliers;
