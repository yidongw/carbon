import { Hidden, ValidatedForm } from "@carbon/form";
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useState } from "react";
import { useFetcher } from "react-router";
import { Input, Select } from "~/components/Form";
import { updateInviteLinkExpiryValidator } from "~/modules/users";
import { path } from "~/utils/path";

type UpdateInviteLinkExpiryModalProps = {
  id: string;
  expiresAt: string | null;
  isOpen: boolean;
  onClose: () => void;
};

const toDateTimeLocal = (value: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
};

const UpdateInviteLinkExpiryModal = ({
  id,
  expiresAt,
  isOpen,
  onClose
}: UpdateInviteLinkExpiryModalProps) => {
  const { t } = useLingui();
  const fetcher = useFetcher();
  const [expirationOption, setExpirationOption] = useState<string>(
    expiresAt ? "custom" : "none"
  );

  const getExpirationLabel = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const formatted = date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    return `${days} days (${formatted})`;
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
    if (days === "none") return "";
    if (days === "custom") return toDateTimeLocal(expiresAt);
    const date = new Date();
    date.setDate(date.getDate() + parseInt(days));
    return date.toISOString().slice(0, 16);
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            <Trans>Update Expiration</Trans>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <ValidatedForm
            method="post"
            action={path.to.updateInviteLinkExpiry}
            validator={updateInviteLinkExpiryValidator}
            defaultValues={{
              id,
              expiresAt: toDateTimeLocal(expiresAt)
            }}
            onSuccess={onClose}
            fetcher={fetcher}
          >
            <VStack spacing={4}>
              <Hidden name="id" value={id} type="hidden" />
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
                  defaultValue={toDateTimeLocal(expiresAt)}
                  helperText={t`The invite link will expire on the selected date`}
                />
              )}
              {expirationOption !== "custom" && (
                <Input
                  name="expiresAt"
                  type="hidden"
                  value={calculateExpirationDate(expirationOption)}
                />
              )}
            </VStack>
            <ModalFooter>
              <HStack>
                <Button variant="ghost" onClick={onClose}>
                  <Trans>Cancel</Trans>
                </Button>
                <Button type="submit">
                  <Trans>Save</Trans>
                </Button>
              </HStack>
            </ModalFooter>
          </ValidatedForm>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UpdateInviteLinkExpiryModal;
