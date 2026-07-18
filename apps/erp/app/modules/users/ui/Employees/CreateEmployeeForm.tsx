import { getBrowserEnv } from "@carbon/auth";
import { ValidatedForm } from "@carbon/form";
import {
  Button,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  HStack,
  useMount,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useState } from "react";
import { useFetcher } from "react-router";
import {
  Input,
  Location,
  Select,
  SequenceOrCustomId,
  Submit
} from "~/components/Form";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import { useUser } from "~/hooks";
import type { getEmployeeTypes } from "~/modules/users";
import { createEmployeeValidator } from "~/modules/users";
import { path } from "~/utils/path";

type CreateEmployeeFormProps = Pick<
  OverlayFormInjectedProps,
  "onDismiss" | "fetcher" | "action"
>;

const CreateEmployeeForm = ({
  onDismiss,
  fetcher,
  action
}: CreateEmployeeFormProps) => {
  const { t } = useLingui();
  const { defaults } = useUser();
  const phoneEnabled = getBrowserEnv()
    .AUTH_PROVIDERS.split(",")
    .includes("phone");
  // Prefer phone where SMS-OTP login exists; otherwise fall back to email.
  const [inviteMethod, setInviteMethod] = useState<"email" | "phone">(
    phoneEnabled ? "phone" : "email"
  );
  const employeeTypeFetcher =
    useFetcher<Awaited<ReturnType<typeof getEmployeeTypes>>>();

  useMount(() => {
    employeeTypeFetcher.load(path.to.api.employeeTypes);
  });

  const employeeTypeOptions =
    employeeTypeFetcher.data?.data?.map((et) => ({
      value: et.id,
      label: et.name
    })) ?? [];

  return (
    <ValidatedForm
      method="post"
      action={action}
      validator={createEmployeeValidator}
      defaultValues={{
        locationId: defaults?.locationId ?? undefined
      }}
      fetcher={fetcher}
      className="flex flex-col h-full"
    >
      <DrawerHeader>
        <DrawerTitle>
          <Trans>Create an account</Trans>
        </DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <VStack spacing={4}>
          {phoneEnabled && (
            <div className="flex w-full items-center gap-1 rounded-xl bg-muted p-1">
              {(["phone", "email"] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  className={`flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    inviteMethod === method
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setInviteMethod(method)}
                >
                  {method === "email" ? (
                    <Trans>Email</Trans>
                  ) : (
                    <Trans>Phone</Trans>
                  )}
                </button>
              ))}
            </div>
          )}
          {inviteMethod === "phone" ? (
            <Input
              key="phone"
              name="phone"
              label={t`Phone`}
              placeholder="13800138000"
              isRequired
            />
          ) : (
            <Input key="email" name="email" label={t`Email`} isRequired />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <Input name="firstName" label={t`First Name`} />
            <Input name="lastName" label={t`Last Name`} />
          </div>
          <SequenceOrCustomId
            name="number"
            label={t`ID Number`}
            table="user"
            isOptional
          />
          <Select
            name="employeeType"
            label={t`Employee Type`}
            options={employeeTypeOptions}
            placeholder={t`Select Employee Type`}
          />
          <Location name="locationId" label={t`Location`} />
        </VStack>
      </DrawerBody>
      <DrawerFooter>
        <HStack>
          <Submit isLoading={fetcher.state !== "idle"}>
            <Trans>Invite</Trans>
          </Submit>
          <Button size="md" variant="solid" type="button" onClick={onDismiss}>
            <Trans>Cancel</Trans>
          </Button>
        </HStack>
      </DrawerFooter>
    </ValidatedForm>
  );
};

export default CreateEmployeeForm;
