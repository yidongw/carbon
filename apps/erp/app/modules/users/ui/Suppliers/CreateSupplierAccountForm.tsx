import { useControlField, useField, ValidatedForm } from "@carbon/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Combobox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FetcherWithComponents } from "react-router";
import { useFetcher } from "react-router";
import type { z } from "zod";
import { Submit, Supplier } from "~/components/Form";
import type {
  getSupplierContacts,
  SupplierContact as SupplierContactType
} from "~/modules/purchasing";
import { createSupplierAccountValidator } from "~/modules/users";
import type { Result } from "~/types";
import { path } from "~/utils/path";

type CreateSupplierAccountFormProps = {
  action?: string;
  fetcher?: FetcherWithComponents<Result>;
  initialValues?: Partial<z.infer<typeof createSupplierAccountValidator>>;
  searchParams: URLSearchParams;
};

export default function CreateSupplierAccountForm({
  action,
  fetcher,
  initialValues: initialValuesProp,
  searchParams
}: CreateSupplierAccountFormProps) {
  const { t } = useLingui();
  const internalFetcher = useFetcher<Result>();
  const submitFetcher = fetcher ?? internalFetcher;
  const initialValues = {
    id: searchParams.get("id") ?? "",
    supplier: searchParams.get("supplier") ?? "",
    ...initialValuesProp
  };
  const [supplier, setSupplier] = useState<string | undefined>(
    initialValues.supplier || undefined
  );
  const [contact, setContact] = useState<SupplierContactType["contact"] | null>(
    null
  );

  return (
    <Card>
      <ValidatedForm
        method="post"
        action={
          action ??
          `${path.to.newSupplierAccount}${
            searchParams.get("supplier")
              ? `?supplier=${searchParams.get("supplier")}`
              : ""
          }`
        }
        validator={createSupplierAccountValidator}
        defaultValues={initialValues}
        fetcher={submitFetcher}
      >
        <CardHeader className="pr-14 sm:pr-16">
          <CardTitle>
            <Trans>Create an account</Trans>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <VStack spacing={4}>
            <Supplier
              name="supplier"
              label={t`Supplier`}
              onChange={(newValue) =>
                setSupplier(newValue?.value as string | undefined)
              }
            />
            <SupplierContactField
              name="id"
              supplier={supplier}
              onChange={(newValue) => setContact(newValue?.contact ?? null)}
            />
            {contact && (
              <>
                <FormControl>
                  <FormLabel>
                    <Trans>Email</Trans>
                  </FormLabel>
                  <Input isReadOnly value={contact.email ?? ""} />
                </FormControl>
                <div className="grid grid-cols-1 gap-4 w-full md:grid-cols-2">
                  <FormControl>
                    <FormLabel>
                      <Trans>First Name</Trans>
                    </FormLabel>
                    <Input isReadOnly value={contact.firstName ?? ""} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>
                      <Trans>Last Name</Trans>
                    </FormLabel>
                    <Input isReadOnly value={contact.lastName ?? ""} />
                  </FormControl>
                </div>
              </>
            )}
          </VStack>
        </CardContent>
        <CardFooter>
          <HStack>
            <Submit isLoading={submitFetcher.state !== "idle"}>
              <Trans>Create User</Trans>
            </Submit>
          </HStack>
        </CardFooter>
      </ValidatedForm>
    </Card>
  );
}

function SupplierContactField({
  name,
  supplier,
  onChange
}: {
  name: string;
  supplier?: string;
  onChange?: (
    newValue: {
      id: string;
      contact: SupplierContactType["contact"];
    } | null
  ) => void;
}) {
  const initialLoad = useRef(true);
  const {
    error,
    defaultValue,
    isOptional: isSupplierContactOptional
  } = useField(name);
  const [value, setValue] = useControlField<string | null>(name);

  const supplierContactFetcher =
    useFetcher<Awaited<ReturnType<typeof getSupplierContacts>>>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  useEffect(() => {
    if (supplier) {
      supplierContactFetcher.load(path.to.api.supplierContacts(supplier));
    }

    if (initialLoad.current) {
      initialLoad.current = false;
    } else {
      setValue(null);
      onChange?.(null);
    }
  }, [supplier]);

  const options = useMemo(
    () =>
      supplierContactFetcher.data?.data
        ? supplierContactFetcher.data.data.map((c) => ({
            value: c.id,
            label: c.contact?.fullName ?? c.contact?.email ?? "Unknown"
          }))
        : [],
    [supplierContactFetcher.data]
  );

  const handleChange = (newValue: string) => {
    setValue(newValue ?? "");
    if (!onChange) return;
    if (!newValue) {
      onChange(null);
      return;
    }
    const contact = supplierContactFetcher.data?.data?.find(
      (entry) => entry.id === newValue
    );

    // @ts-expect-error TS2322 - TODO: fix type
    onChange({ id: newValue, contact: contact?.contact ?? null });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  useEffect(() => {
    if (value && value === defaultValue) {
      handleChange(value);
    }
  }, [value, supplierContactFetcher.data?.data]);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={name} isOptional={isSupplierContactOptional}>
        <Trans>Supplier Contact</Trans>
      </FormLabel>
      <input type="hidden" name={name} id={name} value={value ?? ""} />
      <Combobox
        id={name}
        value={value ?? undefined}
        options={options}
        onChange={handleChange}
        className="w-full"
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
}
