import { ValidatedForm } from "@carbon/form";
import {
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  useMount,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useState } from "react";
import { LuMail, LuPhone } from "react-icons/lu";
import { SiGoogle, SiWechat } from "react-icons/si";
import { useFetcher, useNavigate } from "react-router";
import { Input, Location, Select, Submit } from "~/components/Form";
import { useUser } from "~/hooks";
import type { getEmployeeTypes } from "~/modules/users";
import { createInviteLinkValidator } from "~/modules/users";
import { path } from "~/utils/path";

const METHOD_META: Record<string, { label: string; icon: React.ReactElement }> =
  {
    wechat: {
      label: "WeChat",
      icon: <SiWechat className="size-4" style={{ color: "#07C160" }} />
    },
    phone: { label: "Phone", icon: <LuPhone className="size-4" /> },
    email: { label: "Email", icon: <LuMail className="size-4" /> },
    google: { label: "Google", icon: <SiGoogle className="size-4" /> },
    azure: { label: "Outlook", icon: <LuMail className="size-4" /> }
  };

// Ordered picker: click a method to add it (its order badge appears); click a
// selected method to remove it (remaining ones re-number). The order is what the
// joiner must complete, in sequence. Empty selection = allow any login method.
function LoginMethodsPicker({ available }: { available: string[] }) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (method: string) => {
    setSelected((current) =>
      current.includes(method)
        ? current.filter((m) => m !== method)
        : [...current, method]
    );
  };

  return (
    <VStack spacing={2}>
      <input type="hidden" name="loginMethods" value={selected.join(",")} />
      <span className="text-sm font-medium">
        {/* Reuses the existing "Login methods" catalog message. Empty = any
            method; the numbered badges convey the required completion order. */}
        <Trans>Login methods</Trans>
      </span>
      <div className="flex flex-col gap-2 w-full">
        {available.map((method) => {
          const meta = METHOD_META[method];
          if (!meta) return null;
          const index = selected.indexOf(method);
          const isSelected = index >= 0;
          return (
            <button
              key={method}
              type="button"
              onClick={() => toggle(method)}
              className={`flex items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted"
              }`}
            >
              <HStack spacing={2}>
                {meta.icon}
                <span className="text-sm font-medium">{meta.label}</span>
              </HStack>
              {isSelected && (
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {index + 1}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </VStack>
  );
}

const CreateInviteLinkModal = ({
  availableMethods = []
}: {
  availableMethods?: string[];
}) => {
  const { t } = useLingui();
  const { defaults } = useUser();
  const navigate = useNavigate();
  const employeeTypeFetcher =
    useFetcher<Awaited<ReturnType<typeof getEmployeeTypes>>>();
  const [expirationOption, setExpirationOption] = useState<string>("none");

  useMount(() => {
    employeeTypeFetcher.load(path.to.api.employeeTypes);
  });

  const employeeTypeOptions =
    employeeTypeFetcher.data?.data?.map((et) => ({
      value: et.id,
      label: et.name
    })) ?? [];

  const getExpirationLabel = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const formatted = date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    return t`${days} days (${formatted})`;
  };

  const expirationOptions = [
    { value: "none", label: t`No expiration` },
    { value: "7", label: getExpirationLabel(7) },
    { value: "30", label: getExpirationLabel(30) },
    { value: "60", label: getExpirationLabel(60) },
    { value: "90", label: getExpirationLabel(90) },
    { value: "custom", label: t`Custom` }
  ];

  const calculateExpirationDate = (days: string) => {
    if (days === "none") return undefined;
    if (days === "custom") return undefined;
    const date = new Date();
    date.setDate(date.getDate() + parseInt(days));
    return date.toISOString().slice(0, 16);
  };

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) navigate(-1);
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ValidatedForm
          method="post"
          action={path.to.newInviteLink}
          validator={createInviteLinkValidator}
          defaultValues={{
            locationId: defaults?.locationId ?? undefined
          }}
        >
          <ModalHeader>
            <ModalTitle>
              <Trans>Create Invite Link</Trans>
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <Input name="label" label={t`Label (optional)`} />
              <Select
                name="employeeTypeId"
                label={t`Employee Type`}
                options={employeeTypeOptions}
                isRequired
              />
              <Location name="locationId" label={t`Default Location`} />
              <Select
                name="expiration"
                label={t`Expiration`}
                options={expirationOptions}
                value={expirationOption}
                onChange={(newValue) => {
                  if (newValue) {
                    setExpirationOption(newValue.value);
                  }
                }}
              />
              {expirationOption === "custom" && (
                <Input
                  name="expiresAt"
                  label={t`Select date *`}
                  type="datetime-local"
                />
              )}
              {expirationOption !== "custom" && expirationOption !== "none" && (
                <Input
                  name="expiresAt"
                  type="hidden"
                  value={calculateExpirationDate(expirationOption)}
                />
              )}
              {availableMethods.length > 0 && (
                <LoginMethodsPicker available={availableMethods} />
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Submit>
                <Trans>Create Link</Trans>
              </Submit>
            </HStack>
          </ModalFooter>
        </ValidatedForm>
      </ModalContent>
    </Modal>
  );
};

export default CreateInviteLinkModal;
