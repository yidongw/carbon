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

  useMount(() => {
    employeeTypeFetcher.load(path.to.api.employeeTypes);
  });

  const employeeTypeOptions =
    employeeTypeFetcher.data?.data?.map((et) => ({
      value: et.id,
      label: et.name
    })) ?? [];

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
              <Input
                name="expiresAt"
                label={t`Expires At (optional)`}
                type="datetime-local"
              />
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
