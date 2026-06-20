import { ValidatedForm } from "@carbon/form";
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  toast,
  useMount,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect, useRef } from "react";
import { useFetcher, useNavigate } from "react-router";
import { Hidden, Input, Location, Select, Submit } from "~/components/Form";
import { useUser } from "~/hooks";
import type { getEmployeeTypes, getInvitable } from "~/modules/users";
import { createEmployeeValidator } from "~/modules/users";
import { path } from "~/utils/path";

type CreateEmployeeModalResponse =
  | { success: true; userId: string; firstName: string; lastName: string }
  | { success: false; message: string };

type CreateEmployeeModalProps = {
  invitable?: NonNullable<Awaited<ReturnType<typeof getInvitable>>["data"]>;
  type?: "modal" | "route";
  open?: boolean;
  onClose?: () => void;
  onSuccess?: (data: {
    userId: string;
    firstName: string;
    lastName: string;
  }) => void;
};

const CreateEmployeeModal = ({
  type = "route",
  open = true,
  onClose,
  onSuccess
}: CreateEmployeeModalProps) => {
  const { t } = useLingui();
  const { defaults } = useUser();
  const navigate = useNavigate();
  const formFetcher = useFetcher<CreateEmployeeModalResponse>();
  const employeeTypeFetcher =
    useFetcher<Awaited<ReturnType<typeof getEmployeeTypes>>>();
  const handledSuccessRef = useRef(false);

  useMount(() => {
    employeeTypeFetcher.load(path.to.api.employeeTypes);
  });

  useEffect(() => {
    if (open) {
      handledSuccessRef.current = false;
    }
  }, [open]);

  useEffect(() => {
    if (type !== "modal") return;

    const data = formFetcher.data;
    if (!data || handledSuccessRef.current) return;

    if (formFetcher.state === "loading" && data.success === true) {
      handledSuccessRef.current = true;
      onSuccess?.({
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName
      });
      onClose?.();
      toast.success(t`Successfully invited employee`);
      return;
    }

    if (formFetcher.state === "idle" && data.success === false) {
      toast.error(data.message);
    }
  }, [formFetcher.data, formFetcher.state, onClose, onSuccess, type, t]);

  const employeeTypeOptions =
    employeeTypeFetcher.data?.data?.map((et) => ({
      value: et.id,
      label: et.name
    })) ?? [];

  const handleClose = () => {
    if (type === "modal") {
      onClose?.();
      return;
    }
    navigate(-1);
  };

  return (
    <Modal
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ValidatedForm
          method="post"
          action={path.to.newEmployee}
          validator={createEmployeeValidator}
          defaultValues={{
            locationId: defaults?.locationId ?? undefined
          }}
          fetcher={formFetcher}
          className="flex flex-col h-full"
        >
          {type === "modal" ? <Hidden name="type" value="modal" /> : null}
          <ModalHeader>
            <ModalTitle>
              <Trans>Create an account</Trans>
            </ModalTitle>
          </ModalHeader>

          <ModalBody>
            <VStack spacing={4}>
              <Input name="email" label={t`Email`} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
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
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Submit isLoading={formFetcher.state !== "idle"}>
                <Trans>Invite</Trans>
              </Submit>
              {type === "modal" ? (
                <Button size="md" variant="solid" onClick={handleClose}>
                  <Trans>Cancel</Trans>
                </Button>
              ) : null}
            </HStack>
          </ModalFooter>
        </ValidatedForm>
      </ModalContent>
    </Modal>
  );
};

export default CreateEmployeeModal;
