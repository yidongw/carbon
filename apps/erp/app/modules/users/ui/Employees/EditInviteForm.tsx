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
import { Input, Select, Submit } from "~/components/Form";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import type { getEmployeeTypes } from "~/modules/users";
import { updateInviteValidator } from "~/modules/users";
import { path } from "~/utils/path";

type EditInviteFormProps = Pick<
  OverlayFormInjectedProps,
  "onDismiss" | "fetcher" | "action"
> & {
  userId: string;
  initialValues: {
    email?: string;
    phone?: string;
    employeeType: string;
  };
};

const EditInviteForm = ({
  onDismiss,
  fetcher,
  action,
  userId,
  initialValues
}: EditInviteFormProps) => {
  const { t } = useLingui();
  const phoneEnabled = getBrowserEnv()
    .AUTH_PROVIDERS.split(",")
    .includes("phone");

  const [inviteMethod, setInviteMethod] = useState<"email" | "phone">(() => {
    if (initialValues.phone) return "phone";
    return "email";
  });

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
      validator={updateInviteValidator}
      defaultValues={{
        userId,
        employeeType: initialValues.employeeType,
        ...(inviteMethod === "email"
          ? { email: initialValues.email }
          : { phone: initialValues.phone })
      }}
      fetcher={fetcher}
      className="flex flex-col h-full"
    >
      <input type="hidden" name="userId" value={userId} />
      <DrawerHeader>
        <DrawerTitle>
          <Trans>Edit Invite</Trans>
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
          <Select
            name="employeeType"
            label={t`Employee Type`}
            options={employeeTypeOptions}
            placeholder={t`Select Employee Type`}
          />
        </VStack>
      </DrawerBody>
      <DrawerFooter>
        <HStack>
          <Submit isLoading={fetcher.state !== "idle"}>
            <Trans>Save</Trans>
          </Submit>
          <Button size="md" variant="solid" type="button" onClick={onDismiss}>
            <Trans>Cancel</Trans>
          </Button>
        </HStack>
      </DrawerFooter>
    </ValidatedForm>
  );
};

export default EditInviteForm;
