import { ValidatedForm } from "@carbon/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { z } from "zod";
import { Hidden, Submit } from "~/components/Form";
import Processes from "~/components/Form/Processes";
import { usePermissions } from "~/hooks";
import { employeeProcessesValidator } from "~/modules/resources";

type PersonProcessesProps = {
  initialValues: z.infer<typeof employeeProcessesValidator>;
};

const PersonProcesses = ({ initialValues }: PersonProcessesProps) => {
  const { t } = useLingui();
  const permissions = usePermissions();
  const isDisabled = !permissions.can("update", "people");

  return (
    <ValidatedForm
      validator={employeeProcessesValidator}
      method="post"
      defaultValues={initialValues}
    >
      <Card>
        <CardHeader>
          <CardTitle>
            <Trans>Processes</Trans>
          </CardTitle>
          <CardDescription>
            <Trans>
              Assign the processes this employee can perform. They appear when
              reporting production quantity for those processes.
            </Trans>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Hidden name="employeeId" />
          <Processes name="processes" label={t`Processes`} />
          <div>
            <Submit isDisabled={isDisabled}>
              <Trans>Save</Trans>
            </Submit>
          </div>
        </CardContent>
      </Card>
    </ValidatedForm>
  );
};

export default PersonProcesses;
