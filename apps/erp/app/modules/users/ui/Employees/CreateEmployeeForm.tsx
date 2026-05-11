import { ValidatedForm } from "@carbon/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  HStack,
  useMount,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { FetcherWithComponents } from "react-router";
import { useFetcher } from "react-router";
import type { z } from "zod";
import { Input, Location, Select, Submit } from "~/components/Form";
import { useUser } from "~/hooks";
import type { getEmployeeTypes } from "~/modules/users";
import { createEmployeeValidator } from "~/modules/users";
import type { Result } from "~/types";
import { path } from "~/utils/path";

type CreateEmployeeFormProps = {
  action?: string;
  fetcher?: FetcherWithComponents<Result>;
  initialValues?: Partial<z.infer<typeof createEmployeeValidator>>;
};

export default function CreateEmployeeForm({
  action,
  fetcher,
  initialValues: initialValuesProp
}: CreateEmployeeFormProps) {
  const { t } = useLingui();
  const { defaults } = useUser();
  const internalFetcher = useFetcher<Result>();
  const submitFetcher = fetcher ?? internalFetcher;
  const employeeTypeFetcher =
    useFetcher<Awaited<ReturnType<typeof getEmployeeTypes>>>();
  const initialValues = {
    locationId: defaults?.locationId ?? undefined,
    ...initialValuesProp
  };

  useMount(() => {
    employeeTypeFetcher.load(path.to.api.employeeTypes);
  });

  const employeeTypeOptions =
    employeeTypeFetcher.data?.data?.map((et) => ({
      value: et.id,
      label: et.name
    })) ?? [];

  return (
    <Card>
      <ValidatedForm
        method="post"
        action={action ?? path.to.newEmployee}
        validator={createEmployeeValidator}
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
            <Input name="email" label={t`Email`} />
            <div className="grid grid-cols-1 gap-4 w-full md:grid-cols-2">
              <Input name="firstName" label={t`First Name`} />
              <Input name="lastName" label={t`Last Name`} />
            </div>
            <Select
              name="employeeType"
              label={t`Employee Type`}
              options={employeeTypeOptions}
              placeholder={t`Select Employee Type`}
            />
            <Location name="locationId" label={t`Location`} />
          </VStack>
        </CardContent>
        <CardFooter>
          <HStack>
            <Submit isLoading={submitFetcher.state !== "idle"}>
              <Trans>Invite</Trans>
            </Submit>
          </HStack>
        </CardFooter>
      </ValidatedForm>
    </Card>
  );
}
