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
import { useFetcher, useNavigate } from "react-router";
import { Input, Location, Select, Submit } from "~/components/Form";
import { useUser } from "~/hooks";
import type { getEmployeeTypes } from "~/modules/users";
import { createInviteLinkValidator } from "~/modules/users";
import { path } from "~/utils/path";

const CreateInviteLinkModal = () => {
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
