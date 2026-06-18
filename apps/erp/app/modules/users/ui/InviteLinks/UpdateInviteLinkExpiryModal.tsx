import { Hidden, ValidatedForm } from "@carbon/form";
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useFetcher } from "react-router";
import { Input } from "~/components/Form";
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
            <Hidden name="id" value={id} type="hidden" />
            <Input
              name="expiresAt"
              label={t`Expires At`}
              type="datetime-local"
            />
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
