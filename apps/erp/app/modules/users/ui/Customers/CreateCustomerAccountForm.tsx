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
import { Customer, Submit } from "~/components/Form";
import type {
  CustomerContact as CustomerContactType,
  getCustomerContacts
} from "~/modules/sales";
import { createCustomerAccountValidator } from "~/modules/users";
import type { Result } from "~/types";
import { path } from "~/utils/path";

type CreateCustomerAccountFormProps = {
  action?: string;
  fetcher?: FetcherWithComponents<Result>;
  initialValues?: Partial<z.infer<typeof createCustomerAccountValidator>>;
  searchParams: URLSearchParams;
};

export default function CreateCustomerAccountForm({
  action,
  fetcher,
  initialValues: initialValuesProp,
  searchParams
}: CreateCustomerAccountFormProps) {
  const { t } = useLingui();
  const internalFetcher = useFetcher<Result>();
  const submitFetcher = fetcher ?? internalFetcher;
  const initialValues = {
    id: searchParams.get("id") ?? "",
    customer: searchParams.get("customer") ?? "",
    ...initialValuesProp
  };
  const [customer, setCustomer] = useState<string | undefined>(
    initialValues.customer || undefined
  );
  const [contact, setContact] = useState<CustomerContactType["contact"] | null>(
    null
  );

  return (
    <Card>
      <ValidatedForm
        method="post"
        action={
          action ??
          `${path.to.newCustomerAccount}${
            searchParams.get("customer")
              ? `?customer=${searchParams.get("customer")}`
              : ""
          }`
        }
        validator={createCustomerAccountValidator}
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
            <Customer
              name="customer"
              label={t`Customer`}
              onChange={(newValue) =>
                setCustomer(newValue?.value as string | undefined)
              }
            />
            <CustomerContactField
              name="id"
              customer={customer}
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

function CustomerContactField({
  name,
  customer,
  onChange
}: {
  name: string;
  customer?: string;
  onChange?: (
    newValue: {
      id: string;
      contact: CustomerContactType["contact"];
    } | null
  ) => void;
}) {
  const initialLoad = useRef(true);
  const {
    error,
    defaultValue,
    isOptional: isCustomerContactOptional
  } = useField(name);
  const [value, setValue] = useControlField<string | null>(name);

  const customerContactFetcher =
    useFetcher<Awaited<ReturnType<typeof getCustomerContacts>>>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  useEffect(() => {
    if (customer) {
      customerContactFetcher.load(path.to.api.customerContacts(customer));
    }

    if (initialLoad.current) {
      initialLoad.current = false;
    } else {
      setValue(null);
      onChange?.(null);
    }
  }, [customer]);

  const options = useMemo(
    () =>
      customerContactFetcher.data?.data
        ? customerContactFetcher.data.data.map((c) => ({
            value: c.id,
            label: `${c.contact?.firstName} ${c.contact?.lastName}`
          }))
        : [],
    [customerContactFetcher.data]
  );

  const handleChange = (newValue: string) => {
    setValue(newValue ?? "");
    if (!onChange) return;
    if (!newValue) {
      onChange(null);
      return;
    }
    const contact = customerContactFetcher.data?.data?.find(
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
  }, [value, customerContactFetcher.data?.data]);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={name} isOptional={isCustomerContactOptional}>
        <Trans>Customer Contact</Trans>
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
