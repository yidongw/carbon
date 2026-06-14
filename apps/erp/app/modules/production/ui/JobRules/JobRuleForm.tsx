import { ValidatedForm } from "@carbon/form";
import {
  Button,
  HStack,
  IconButton,
  Input as UIInput,
  ModalDrawer,
  ModalDrawerBody,
  ModalDrawerContent,
  ModalDrawerFooter,
  ModalDrawerHeader,
  ModalDrawerProvider,
  ModalDrawerTitle,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useState } from "react";
import { LuPlus, LuTrash } from "react-icons/lu";
import type { z } from "zod";
import { Boolean, Hidden, Input, Number, Select, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import {
  JOB_RULE_FIELDS,
  JOB_RULE_OPERATORS,
  jobAssignmentRuleValidator
} from "~/modules/people/people.models";
import { path } from "~/utils/path";

type Condition = {
  field: (typeof JOB_RULE_FIELDS)[number]["value"];
  operator: (typeof JOB_RULE_OPERATORS)[number]["value"];
  value: string;
};

type JobRuleFormProps = {
  // z.input gives us the raw form shape (conditions still a JSON string here)
  initialValues: z.input<typeof jobAssignmentRuleValidator>;
  groups: Array<{ id: string; name: string }>;
  onClose: () => void;
};

export default function JobRuleForm({
  initialValues,
  groups,
  onClose
}: JobRuleFormProps) {
  const permissions = usePermissions();
  const { t } = useLingui();

  const isEditing = !!initialValues.id;
  const isDisabled = isEditing
    ? !permissions.can("update", "production")
    : !permissions.can("create", "production");

  // Parse initial conditions from JSON string
  const parseConditions = (): Condition[] => {
    try {
      const parsed = JSON.parse(initialValues.conditions || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const [conditions, setConditions] = useState<Condition[]>(parseConditions);

  const addCondition = () => {
    setConditions((prev) => [
      ...prev,
      { field: "customerId", operator: "eq", value: "" }
    ]);
  };

  const removeCondition = (index: number) => {
    setConditions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCondition = (index: number, key: keyof Condition, value: string) => {
    setConditions((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [key]: value } : c))
    );
  };

  return (
    <ModalDrawerProvider type="drawer">
      <ModalDrawer open onOpenChange={(open) => !open && onClose()}>
        <ModalDrawerContent>
          <ValidatedForm
            validator={jobAssignmentRuleValidator}
            method="post"
            action={isEditing ? path.to.jobRule(initialValues.id!) : path.to.newJobRule}
            defaultValues={initialValues}
            className="flex flex-col h-full"
          >
            <ModalDrawerHeader>
              <ModalDrawerTitle>
                {isEditing ? <Trans>Edit Rule</Trans> : <Trans>New Assignment Rule</Trans>}
              </ModalDrawerTitle>
            </ModalDrawerHeader>

            <ModalDrawerBody>
              <VStack spacing={4}>
                <Hidden name="id" />
                {/* Hidden field carries serialized conditions */}
                <input
                  type="hidden"
                  name="conditions"
                  value={JSON.stringify(conditions)}
                />

                <Input name="name" label={t`Rule Name`} />
                <Input name="description" label={t`Description`} />

                <Select
                  name="targetGroupId"
                  label={t`Assign to Group`}
                  options={groups.map((g) => ({
                    label: g.name,
                    value: g.id
                  }))}
                />

                {/* Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <Number
                    name="priority"
                    label={t`Priority`}
                    min={0}
                    helperText={t`Lower runs first`}
                  />
                  <Boolean name="active" label={t`Active`} />
                </div>

                {/* Conditions builder */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      <Trans>Conditions</Trans>
                      <span className="text-muted-foreground ml-1 font-normal text-xs">
                        <Trans>(all must match)</Trans>
                      </span>
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={addCondition}
                    >
                      <LuPlus className="size-3.5 mr-1" />
                      <Trans>Add</Trans>
                    </Button>
                  </div>

                  {conditions.length === 0 && (
                    <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                      <Trans>No conditions — rule matches all jobs</Trans>
                    </div>
                  )}

                  {conditions.map((cond, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-md border bg-muted/30 p-2"
                    >
                      <select
                        value={cond.field}
                        onChange={(e) => updateCondition(i, "field", e.target.value)}
                        className="flex-1 rounded border border-input bg-background px-2 py-1.5 text-xs"
                      >
                        {JOB_RULE_FIELDS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <select
                        value={cond.operator}
                        onChange={(e) => updateCondition(i, "operator", e.target.value)}
                        className="w-28 rounded border border-input bg-background px-2 py-1.5 text-xs"
                      >
                        {JOB_RULE_OPERATORS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <UIInput
                        value={cond.value}
                        onChange={(e) => updateCondition(i, "value", e.target.value)}
                        placeholder={
                          cond.operator === "in"
                            ? t`comma separated IDs`
                            : t`value`
                        }
                        className="flex-1 h-8 text-xs"
                      />
                      <IconButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label={t`Remove condition`}
                        onClick={() => removeCondition(i)}
                        icon={<LuTrash className="size-3.5 text-destructive" />}
                      />
                    </div>
                  ))}
                </div>
              </VStack>
            </ModalDrawerBody>

            <ModalDrawerFooter>
              <HStack>
                <Submit isDisabled={isDisabled}>
                  <Trans>Save</Trans>
                </Submit>
                <Button size="md" variant="solid" onClick={onClose}>
                  <Trans>Cancel</Trans>
                </Button>
              </HStack>
            </ModalDrawerFooter>
          </ValidatedForm>
        </ModalDrawerContent>
      </ModalDrawer>
    </ModalDrawerProvider>
  );
}
