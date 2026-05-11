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
  CustomFormFields,
  Employee,
  Hidden,
  Input,
  Submit,
  SupplierContact,
  SupplierStatus,
  SupplierType
} from "~/components/Form";
import { usePermissions, useSupplierApprovalRequired, useUser } from "~/hooks";
import type { Supplier } from "~/modules/purchasing";
import {
  supplierApprovalValidator,
  supplierValidator
} from "~/modules/purchasing";
import { path } from "~/utils/path";

type SupplierFormValues = z.infer<typeof supplierValidator>;

type SupplierFormProps = {
  initialValues?: Partial<SupplierFormValues>;
  action?: string;
  fetcher?: FetcherWithComponents<PostgrestResponse<Supplier>>;
};

const SupplierForm = ({
  initialValues: initialValuesProp,
  action,
  fetcher
}: SupplierFormProps) => {
  const { t } = useLingui();
  const permissions = usePermissions();
  const internalFetcher = useFetcher<PostgrestResponse<Supplier>>();
  const submitFetcher = fetcher ?? internalFetcher;
  const { company } = useUser();
  const supplierApprovalRequired = useSupplierApprovalRequired();
  const initialValues = {
    name: "",
    supplierStatus: (supplierApprovalRequired ? "Pending" : undefined) as
      | "Pending"
      | undefined,
    currencyCode: company?.baseCurrencyCode ?? undefined,
    phone: "",
    fax: "",
    website: "",
    ...initialValuesProp
  };

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "purchasing")
    : !permissions.can("create", "purchasing");

  return (
    <Card>
      <ValidatedForm
        key={initialValues.supplierStatus}
        method="post"
        action={action ?? (isEditing ? undefined : path.to.newSupplier)}
        validator={
          supplierApprovalRequired
            ? supplierApprovalValidator
            : supplierValidator
        }
        defaultValues={initialValues}
        fetcher={submitFetcher}
      >
        <CardHeader className="pr-14 sm:pr-16">
          <CardTitle>
            {isEditing ? (
              <Trans>Supplier Overview</Trans>
            ) : (
              <Trans>New Supplier</Trans>
            )}
          </CardTitle>
          {!isEditing && (
            <CardDescription>
              <Trans>
                {" "}
                A supplier is a business or person who sells you parts or
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
            <Input autoFocus={!isEditing} name="name" label={t`Name`} />
            <SupplierStatus
              name="supplierStatus"
              label={t`Supplier Status`}
              placeholder={t`Select Supplier Status`}
              disabled={supplierApprovalRequired}
            />
            <SupplierType
              name="supplierTypeId"
              label={t`Supplier Type`}
              placeholder={t`Select Supplier Type`}
            />
            <Employee name="accountManagerId" label={t`Account Manager`} />
            {isEditing && (
              <SupplierContact
                supplier={initialValues.id}
                name="purchasingContactId"
                label={t`Purchasing Contact`}
              />
            )}
            <Currency name="currencyCode" label={t`Currency`} />
            <Input name="website" label={t`Website`} />

            {/* <EmailRecipients name="defaultCc" label={t`Default CC`} /> */}
            <CustomFormFields table="supplier" />
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

export default SupplierForm;
