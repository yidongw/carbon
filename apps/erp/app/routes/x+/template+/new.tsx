import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import {
  Input,
  Submit,
  ValidatedForm,
  validationError,
  validator
} from "@carbon/form";
import { VStack } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { insertTemplate, templateCreateValidator } from "~/modules/items";
import { path } from "~/utils/path";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "parts"
  });

  const formData = await request.formData();
  const validation = await validator(templateCreateValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const created = await insertTemplate(client, {
    ...validation.data,
    companyId,
    createdBy: userId
  });

  if (created.error || !created.data?.id) {
    return redirect(
      path.to.templates,
      await flash(
        request,
        error(created.error ?? null, "Failed to create template")
      )
    );
  }

  throw redirect(path.to.templateDetails(created.data.id));
}

export default function TemplateNewRoute() {
  const { t } = useLingui();

  return (
    <div className="max-w-lg w-full p-4 mx-auto">
      <ValidatedForm
        method="post"
        validator={templateCreateValidator}
        defaultValues={{ name: "", description: "" }}
        className="w-full"
      >
        <VStack spacing={4}>
          <Input name="name" label={t`Name`} />
          <Input name="description" label={t`Description`} />
          <Submit>
            <Trans>Create</Trans>
          </Submit>
        </VStack>
      </ValidatedForm>
    </div>
  );
}
