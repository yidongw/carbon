import { ValidatedForm } from "@carbon/form";
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
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import type { z } from "zod";
import { Boolean, Hidden, Input, Submit } from "~/components/Form";
import PermissionMatrix from "~/components/PermissionMatrix";
import { usePermissions } from "~/hooks";
import {
  fromEmployeeTypePermissions,
  toEmployeeTypePermissions,
  usePermissionMatrix
} from "~/hooks/usePermissionMatrix";
import type { CompanyPermission } from "~/modules/users";
import { employeeTypeValidator } from "~/modules/users";
import { path } from "~/utils/path";

// Mirrors MES_PERMISSIONS server constant — keyed by PascalCase module name
const MES_DISPLAY_PERMISSIONS: Record<string, CompanyPermission> = {
  Production: { view: true, create: true, update: true, delete: false },
  Inventory: { view: true, create: true, update: true, delete: false },
  Quality: { view: true, create: true, update: true, delete: false },
  Items: { view: true, create: false, update: false, delete: false },
  Resources: { view: true, create: false, update: false, delete: false },
  People: { view: true, create: false, update: false, delete: false },
  Documents: { view: true, create: false, update: false, delete: false }
};

type EmployeeTypeFormProps = {
  initialValues: z.infer<typeof employeeTypeValidator> & {
    permissions: Record<
      string,
      {
        name: string;
        permission: CompanyPermission;
      }
    >;
  };
};

const EmployeeTypeForm = ({ initialValues }: EmployeeTypeFormProps) => {
  const { t } = useLingui();
  const userPermissions = usePermissions();
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const [mesOnly, setMesOnly] = useState(initialValues.mesOnly ?? false);

  const { state: initialState, modules } = useMemo(
    () => fromEmployeeTypePermissions(initialValues.permissions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initialValues.permissions]
  );

  const matrix = usePermissionMatrix({ modules, initialState });

  // Pre-computed MES permission set for the read-only display when mesOnly is ON
  const mesDisplayPermissions = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(initialValues.permissions).map(([key, val]) => [
          key,
          {
            name: val.name,
            permission: MES_DISPLAY_PERMISSIONS[key] ?? {
              view: false,
              create: false,
              update: false,
              delete: false
            }
          }
        ])
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initialValues.permissions]
  );

  const { state: mesInitialState, modules: mesModules } = useMemo(
    () => fromEmployeeTypePermissions(mesDisplayPermissions),
    [mesDisplayPermissions]
  );
  const mesMatrix = usePermissionMatrix({
    modules: mesModules,
    initialState: mesInitialState
  });

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !userPermissions.can("update", "users")
    : !userPermissions.can("create", "users");

  // Serialize permissions to the format expected by the action
  const permissionsData = JSON.stringify(
    Object.values(toEmployeeTypePermissions(matrix.permissions))
  );

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <ModalContent size="xlarge">
        <ValidatedForm
          validator={employeeTypeValidator}
          method="post"
          action={
            isEditing
              ? path.to.employeeType(initialValues.id!)
              : path.to.newEmployeeType
          }
          defaultValues={initialValues}
          className="flex flex-col h-full"
        >
          <ModalHeader>
            <ModalTitle>
              {isEditing ? (
                <Trans>Edit Employee Type</Trans>
              ) : (
                <Trans>New Employee Type</Trans>
              )}
            </ModalTitle>
          </ModalHeader>
          <ModalBody className="max-h-[70dvh] overflow-y-auto">
            <Hidden name="id" />
            <VStack spacing={4}>
              <Input name="name" label={t`Employee Type`} />
              <Boolean
                name="mesOnly"
                label={t`MES only`}
                description={t`Shop-floor workers who can access the MES but not the ERP. They do not count as a billable seat.`}
                onChange={setMesOnly}
              />
              <Hidden name="data" value={mesOnly ? "[]" : permissionsData} />
            </VStack>
            <div className="mt-4">
              {mesOnly ? (
                <PermissionMatrix
                  matrix={mesMatrix}
                  label={t`Default Permissions`}
                  isDisabled
                />
              ) : (
                <PermissionMatrix
                  matrix={matrix}
                  label={t`Default Permissions`}
                />
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Submit isDisabled={isDisabled}>
                <Trans>Save</Trans>
              </Submit>
              <Button size="md" variant="solid" onClick={onClose}>
                <Trans>Cancel</Trans>
              </Button>
            </HStack>
          </ModalFooter>
        </ValidatedForm>
      </ModalContent>
    </Modal>
  );
};

export default EmployeeTypeForm;
