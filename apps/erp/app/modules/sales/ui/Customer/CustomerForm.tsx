import { ValidatedForm } from "@carbon/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cn,
  HStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { PostgrestResponse } from "@supabase/supabase-js";
import type { FetcherWithComponents } from "react-router";
import { useFetcher } from "react-router";
import type { z } from "zod";
import {
  Currency,
  CustomerContact,
  CustomerStatus,
  CustomerType,
  CustomFormFields,
  Employee,
  Hidden,
  Input,
  Number,
  Submit
} from "~/components/Form";
import { useNewEntityForm } from "~/components/NewEntityModal";
import { usePermissions, useUser } from "~/hooks";
import { path } from "~/utils/path";
import { customerValidator } from "../../sales.models";
import type { Customer } from "../../types";

type CustomerFormValues = z.infer<typeof customerValidator>;

type CustomerFormProps = {
  initialValues?: Partial<CustomerFormValues>;
  fetcher?: FetcherWithComponents<PostgrestResponse<Customer>>;
};

const CustomerForm = ({
  initialValues: initialValuesProp,
  fetcher
}: CustomerFormProps) => {
  const { t } = useLingui();
  const permissions = usePermissions();
  const { company } = useUser();
  const modalFetcher = useNewEntityForm<Customer>(path.to.newCustomer);
  const internalFetcher = useFetcher<PostgrestResponse<Customer>>();
  const submitFetcher = fetcher ?? modalFetcher ?? internalFetcher;
  const initialValues = {
    name: "",
    currencyCode: company?.baseCurrencyCode ?? undefined,
    phone: "",
    fax: "",
    website: "",
    taxPercent: 0,
    ...initialValuesProp
  };

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "sales")
    : !permissions.can("create", "sales");

  return (
    <Card>
      <ValidatedForm
        method="post"
        action={isEditing ? undefined : path.to.newCustomer}
        validator={customerValidator}
        defaultValues={initialValues}
        fetcher={submitFetcher}
      >
        <CardHeader className="pr-14 sm:pr-16">
          <CardTitle>
            {isEditing ? (
              <Trans>Customer Overview</Trans>
            ) : (
              <Trans>New Customer</Trans>
            )}
          </CardTitle>
          {!isEditing && (
            <CardDescription>
              <Trans>
                A customer is a business or person who buys your parts or
                services.
              </Trans>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <Hidden name="id" />
          <div
            className={cn(
              "grid w-full gap-x-8 gap-y-4",
              isEditing
                ? "grid-cols-1 lg:grid-cols-3"
                : "grid-cols-1 md:grid-cols-2"
            )}
          >
            <Input name="name" label={t`Name`} autoFocus={!isEditing} />

            <CustomerStatus
              name="customerStatusId"
              label={t`Customer Status`}
              placeholder={t`Select Customer Status`}
            />
            <CustomerType
              name="customerTypeId"
              label={t`Customer Type`}
              placeholder={t`Select Customer Type`}
            />
            <Employee name="accountManagerId" label={t`Account Manager`} />
            {isEditing && (
              <CustomerContact
                customer={initialValues.id}
                name="salesContactId"
                label={t`Sales Contact`}
              />
            )}
            <Currency name="currencyCode" label={t`Currency`} />

            <Number
              name="taxPercent"
              label={t`Tax Percent`}
              minValue={0}
              maxValue={1}
              step={0.0001}
              formatOptions={{
                style: "percent",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
              }}
            />

            <Input name="website" label={t`Website`} />

            {/* <EmailRecipients name="defaultCc" label="Default CC" /> */}
            <CustomFormFields table="customer" />
          </div>
        </CardContent>
        <CardFooter>
          <HStack>
            <Submit isDisabled={isDisabled}>
              <Trans>Save</Trans>
            </Submit>
          </HStack>
        </CardFooter>
      </ValidatedForm>
    </Card>
  );
};

export default CustomerForm;
