import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions, updateUserPhone } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { Input, Submit, ValidatedForm, validator } from "@carbon/form";
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
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, useFetcher, useLoaderData, useNavigate } from "react-router";
import { z } from "zod";
import { zfd } from "zod-form-data";
import type { Result } from "~/types";
import { path } from "~/utils/path";

const phoneUpdateValidator = z.object({
  phone: zfd.text(
    z
      .string()
      .regex(/^\+[1-9]\d{7,14}$/, {
        message: "Must be a valid E.164 phone number (e.g. +12125551234)"
      })
      .optional()
  )
});

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, { update: "users" });

  const { employeeId } = params;
  if (!employeeId) throw new Error("Employee ID is required");

  const user = await client
    .from("user")
    .select("id, firstName, lastName, phone")
    .eq("id", employeeId)
    .single();

  if (user.error || !user.data) {
    throw redirect(
      path.to.employeeAccounts,
      await flash(request, error(user.error, "Employee not found"))
    );
  }

  return { employee: user.data };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  await requirePermissions(request, { update: "users" });

  const { employeeId } = params;
  if (!employeeId) throw new Error("Employee ID is required");

  const validation = await validator(phoneUpdateValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return redirect(
      path.to.employeePhone(employeeId),
      await flash(request, error(validation.error, "Invalid phone number"))
    );
  }

  const { phone } = validation.data;
  const updated = await updateUserPhone(employeeId, phone ?? null);

  if (!updated) {
    return redirect(
      path.to.employeePhone(employeeId),
      await flash(request, error(null, "Failed to update phone number"))
    );
  }

  return redirect(
    path.to.employeeAccounts,
    await flash(request, success("Phone number updated"))
  );
}

export default function EmployeePhoneRoute() {
  const { t } = useLingui();
  const { employee } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const fetcher = useFetcher<Result>();

  const onClose = () => navigate(-1);
  const name = `${employee.firstName} ${employee.lastName}`.trim();

  return (
    <Modal open onOpenChange={(open) => { if (!open) onClose(); }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            <Trans>Phone Number — {name}</Trans>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <ValidatedForm
            id="phone-update-form"
            fetcher={fetcher}
            validator={phoneUpdateValidator}
            defaultValues={{ phone: employee.phone ?? "" }}
            method="post"
          >
            <VStack spacing={4}>
              <p className="text-sm text-muted-foreground">
                <Trans>
                  Set the employee's phone number in E.164 format (e.g.
                  +12125551234). This allows the employee to sign in using SMS
                  verification. Leave blank to remove phone login access.
                </Trans>
              </p>
              <Input
                name="phone"
                label={t`Phone Number`}
                placeholder="+12125551234"
              />
            </VStack>
          </ValidatedForm>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button variant="ghost" onClick={onClose}>
              <Trans>Cancel</Trans>
            </Button>
            <Submit form="phone-update-form" withBlocker={false}>
              <Trans>Save</Trans>
            </Submit>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
