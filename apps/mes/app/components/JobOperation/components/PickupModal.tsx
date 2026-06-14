import {
  Hidden,
  NumberControlled,
  TextArea,
  ValidatedForm
} from "@carbon/form";
import {
  Button,
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
import { useUser } from "~/hooks";
import { jobOperationPickupValidator } from "~/services/models";
import { path } from "~/utils/path";

export function PickupModal({
  jobOperationId,
  configuration,
  onClose
}: {
  jobOperationId: string;
  configuration?: unknown;
  onClose: () => void;
}) {
  const { t } = useLingui();
  const user = useUser();
  const fetcher = useFetcher();
  const [quantity, setQuantity] = useState(0);

  const isSubmitting = fetcher.state !== "idle";

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <ModalContent>
        <ValidatedForm
          action={path.to.operationPickupNew}
          method="post"
          validator={jobOperationPickupValidator}
          defaultValues={{
            jobOperationId,
            employeeId: user.id,
            quantity: 0
          }}
          fetcher={fetcher}
          onSuccess={onClose}
        >
          <ModalHeader>
            <ModalTitle>
              <Trans>Log Pickup</Trans>
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <Hidden name="jobOperationId" />
              <Hidden name="employeeId" />
              {configuration && (
                <Hidden
                  name="configuration"
                  value={
                    typeof configuration === "string"
                      ? configuration
                      : JSON.stringify(configuration)
                  }
                />
              )}
              <NumberControlled
                name="quantity"
                label={t`Quantity`}
                value={quantity}
                onChange={setQuantity}
                minValue={0}
              />
              <TextArea name="notes" label={t`Notes`} />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={onClose}>
              <Trans>Cancel</Trans>
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              isDisabled={isSubmitting || quantity <= 0}
            >
              <Trans>Log Pickup</Trans>
            </Button>
          </ModalFooter>
        </ValidatedForm>
      </ModalContent>
    </Modal>
  );
}
