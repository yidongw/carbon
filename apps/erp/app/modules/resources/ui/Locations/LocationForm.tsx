import { ValidatedForm } from "@carbon/form";
import {
  Button,
  HStack,
  ModalDrawer,
  ModalDrawerBody,
  ModalDrawerContent,
  ModalDrawerFooter,
  ModalDrawerHeader,
  ModalDrawerProvider,
  ModalDrawerTitle,
  toast,
  VStack
} from "@carbon/react";
import { formatAddress } from "@carbon/utils";
import { Trans, useLingui } from "@lingui/react/macro";
import type { PostgrestResponse } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import type { z } from "zod";
import {
  Customer,
  CustomerLocation,
  CustomFormFields,
  Hidden,
  Input,
  Submit,
  Supplier,
  SupplierLocation,
  Timezone
} from "~/components/Form";
import AddressAutocomplete from "~/components/Form/AddressAutocomplete";
import { usePermissions } from "~/hooks";
import { locationValidator } from "~/modules/resources";
import { path } from "~/utils/path";

type LocationFormProps = {
  initialValues: z.infer<typeof locationValidator>;
  type?: "modal" | "drawer";
  open?: boolean;
  onClose: () => void;
  // Customers/suppliers that already have a warehouse — hidden from the pickers so
  // a partner isn't given two warehouses.
  excludeCustomers?: string[];
  excludeSuppliers?: string[];
};

type InheritedAddress = {
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  stateProvince: string | null;
};

const LocationForm = ({
  initialValues,
  open = true,
  type = "drawer",
  onClose,
  excludeCustomers,
  excludeSuppliers
}: LocationFormProps) => {
  const { t } = useLingui();
  const permissions = usePermissions();
  const fetcher = useFetcher<PostgrestResponse<{ id: string }>>();

  // When the location is linked to a customer/supplier, it represents one of that
  // partner's locations and inherits its address (no manual address entry). Tracked
  // in state so the form reacts to picking a customer/supplier/location.
  const [customerId, setCustomerId] = useState(initialValues.customerId ?? "");
  const [supplierId, setSupplierId] = useState(initialValues.supplierId ?? "");
  const isPartner = !!(customerId || supplierId);
  // Address preview when inheriting: seeded from the already-resolved values (for an
  // existing partner warehouse), updated as a partner location is picked.
  const [inheritedAddress, setInheritedAddress] =
    useState<InheritedAddress | null>(
      initialValues.customerId || initialValues.supplierId
        ? {
            addressLine1: initialValues.addressLine1 ?? null,
            addressLine2: initialValues.addressLine2 ?? null,
            city: initialValues.city ?? null,
            stateProvince: initialValues.stateProvince ?? null
          }
        : null
    );
  const pickInherited = (loc: { address?: InheritedAddress | null } | null) =>
    setInheritedAddress(
      loc?.address
        ? {
            addressLine1: loc.address.addressLine1 ?? null,
            addressLine2: loc.address.addressLine2 ?? null,
            city: loc.address.city ?? null,
            stateProvince: loc.address.stateProvince ?? null
          }
        : null
    );

  useEffect(() => {
    if (type !== "modal") return;

    if (fetcher.state === "loading" && fetcher.data?.data) {
      onClose?.();
      toast.success(t`Created location`);
    } else if (fetcher.state === "idle" && fetcher.data?.error) {
      toast.error(t`Failed to create location: ${fetcher.data.error.message}`);
    }
  }, [fetcher.data, fetcher.state, onClose, type, t]);

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "resources")
    : !permissions.can("create", "resources");
  // Once a location is bound to a customer/supplier, the partner can't be changed
  // (re-keying an existing warehouse's partner would break inventory/transfers);
  // the specific partner location it points at stays editable.
  const partnerLocked =
    isEditing && !!(initialValues.customerId || initialValues.supplierId);

  return (
    <ModalDrawerProvider type={type}>
      <ModalDrawer
        open={open}
        onOpenChange={(open) => {
          if (!open) onClose?.();
        }}
      >
        <ModalDrawerContent>
          <ValidatedForm
            validator={locationValidator}
            method="post"
            action={
              isEditing
                ? path.to.location(initialValues.id!)
                : path.to.newLocation
            }
            defaultValues={initialValues}
            fetcher={fetcher}
            className="flex flex-col h-full"
          >
            <ModalDrawerHeader>
              <ModalDrawerTitle>
                {isEditing ? (
                  <Trans>Edit Location</Trans>
                ) : (
                  <Trans>New Location</Trans>
                )}
              </ModalDrawerTitle>
            </ModalDrawerHeader>
            <ModalDrawerBody>
              <Hidden name="id" />
              <Hidden name="type" value={type} />
              <VStack spacing={4}>
                <Input name="name" label={t`Location Name`} />
                {/* Link this warehouse to a customer or supplier (at most one). When
                    linked, it represents one of that partner's locations and
                    inherits its address instead of storing its own. */}
                {!supplierId && (
                  <Customer
                    name="customerId"
                    label={t`Customer`}
                    isReadOnly={partnerLocked}
                    exclude={excludeCustomers}
                    onChange={(o) => {
                      setCustomerId(o?.value ?? "");
                      if (o?.value) setSupplierId("");
                      setInheritedAddress(null);
                    }}
                  />
                )}
                {!customerId && (
                  <Supplier
                    name="supplierId"
                    label={t`Supplier`}
                    isReadOnly={partnerLocked}
                    exclude={excludeSuppliers}
                    onChange={(o) => {
                      setSupplierId(o?.value ?? "");
                      if (o?.value) setCustomerId("");
                      setInheritedAddress(null);
                    }}
                  />
                )}
                {customerId ? (
                  // key on the partner so switching it resets the location field.
                  <CustomerLocation
                    key={customerId}
                    name="customerLocationId"
                    customer={customerId}
                    label={t`Customer location`}
                    nameOnly
                    onChange={pickInherited}
                  />
                ) : supplierId ? (
                  <SupplierLocation
                    key={supplierId}
                    name="supplierLocationId"
                    supplier={supplierId}
                    label={t`Supplier location`}
                    nameOnly
                    onChange={pickInherited}
                  />
                ) : null}
                {isPartner ? (
                  <div className="flex w-full flex-col gap-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      <Trans>Address</Trans>
                    </span>
                    <div className="w-full rounded-lg border border-border bg-muted/40 p-3 text-sm">
                      {formatAddress(
                        inheritedAddress?.addressLine1 ?? null,
                        inheritedAddress?.addressLine2 ?? null,
                        inheritedAddress?.city ?? null,
                        inheritedAddress?.stateProvince ?? null
                      ) || <Trans>Inherited from the selected location</Trans>}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      <Trans>Inherited from the selected location.</Trans>
                    </span>
                  </div>
                ) : (
                  <AddressAutocomplete />
                )}
                <Timezone name="timezone" label={t`Timezone`} />
                {/* <Number name="latitude" label="Latitude" minValue={-90} maxValue={90} />
              <Number name="longitude" label="Longitude" minVale={-180} maxValue={180} /> */}
                <CustomFormFields table="location" />
              </VStack>
            </ModalDrawerBody>
            <ModalDrawerFooter>
              <HStack>
                <Submit isDisabled={isDisabled}>
                  <Trans>Save</Trans>
                </Submit>
                <Button size="md" variant="solid" onClick={() => onClose?.()}>
                  <Trans>Cancel</Trans>
                </Button>
              </HStack>
            </ModalDrawerFooter>
          </ValidatedForm>
        </ModalDrawerContent>
      </ModalDrawer>
    </ModalDrawerProvider>
  );
};

export default LocationForm;
