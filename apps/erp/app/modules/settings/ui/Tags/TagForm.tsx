import { ValidatedForm } from "@carbon/form";
import {
  Button,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  HStack,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useMemo } from "react";
import type { z } from "zod";
import { Hidden, Input, Select, Submit } from "~/components/Form";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import { usePermissions } from "~/hooks";
import { tagTables, tagValidator } from "~/modules/shared";

type TagFormProps = {
  initialValues: z.infer<typeof tagValidator>;
  /** When opened from a record's Tags field, lock the table to that field. */
  lockTable?: boolean;
} & Pick<OverlayFormInjectedProps, "onDismiss" | "fetcher" | "action">;

const TagForm = ({
  initialValues,
  lockTable = false,
  onDismiss,
  fetcher,
  action
}: TagFormProps) => {
  const permissions = usePermissions();
  const { t } = useLingui();

  const isDisabled = !permissions.is("employee");

  const tableOptions = useMemo(
    () => tagTables.map((t) => ({ value: t.table, label: t.label })),
    []
  );

  return (
    <ValidatedForm
      validator={tagValidator}
      method="post"
      action={action}
      defaultValues={initialValues}
      fetcher={fetcher}
      className="flex flex-col h-full"
    >
      <DrawerHeader>
        <DrawerTitle>
          <Trans>New Tag</Trans>
        </DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <VStack spacing={4}>
          <Input name="name" label={t`Name`} />
          {lockTable ? (
            // Opened from a record's Tags field — the table is fixed by that
            // field, so submit it silently rather than showing a picker.
            <Hidden name="table" value={initialValues.table} />
          ) : (
            <Select name="table" label={t`Applies to`} options={tableOptions} />
          )}
        </VStack>
      </DrawerBody>
      <DrawerFooter>
        <HStack>
          <Submit isDisabled={isDisabled}>
            <Trans>Save</Trans>
          </Submit>
          <Button variant="solid" type="button" onClick={onDismiss}>
            <Trans>Cancel</Trans>
          </Button>
        </HStack>
      </DrawerFooter>
    </ValidatedForm>
  );
};

export default TagForm;
