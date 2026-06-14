import { useCarbon } from "@carbon/auth";
import {
  InputControlled,
  TextAreaControlled,
  ValidatedForm
} from "@carbon/form";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  HStack,
  toast,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useUser } from "~/hooks";

type TemplatePropertiesProps = {
  template: {
    id: string;
    name: string;
    description: string | null;
  };
};

const TemplateProperties = ({ template }: TemplatePropertiesProps) => {
  const { t } = useLingui();
  const { carbon } = useCarbon();
  const { id: userId, company } = useUser();

  const [name, setName] = useState(template.name);
  const [description, setDescription] = useState(template.description ?? "");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  useEffect(() => {
    setName(template.name);
    setDescription(template.description ?? "");
    setIsEditingName(false);
    setIsEditingDescription(false);
  }, [template.name, template.description]);

  const onSave = async () => {
    if (!carbon) return;

    const result = await carbon
      .from("template")
      .update({
        name,
        description: description.trim() ? description : null,
        updatedBy: userId,
        updatedAt: new Date().toISOString()
      })
      .eq("id", template.id)
      .eq("companyId", company.id);

    const maybeError = (result as { error?: { message?: string } | null })
      ?.error;
    if (maybeError) {
      toast.error(t`Failed to update template`);
      return;
    }

    setIsEditingName(false);
    setIsEditingDescription(false);
  };

  const onSubmit = (
    _data:
      | { name: string; description?: string | undefined }
      | { __subaction__: string },
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    void onSave();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Trans>Properties</Trans>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ValidatedForm
          validator={z.object({
            name: z.string().min(1),
            description: z.string().optional()
          })}
          defaultValues={{
            name: template.name,
            description: template.description ?? ""
          }}
          className="w-full"
          onSubmit={onSubmit}
        >
          <VStack spacing={3} className="pt-2">
            <VStack spacing={1} className="w-full items-stretch">
              <HStack className="w-full justify-between items-center">
                <h4 className="text-sm font-medium">{t`Name`}</h4>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsEditingName((prev) => !prev)}
                >
                  {isEditingName ? t`Done` : t`Edit`}
                </Button>
              </HStack>
              {isEditingName ? (
                <InputControlled
                  label=""
                  name="name"
                  size="sm"
                  value={name}
                  onChange={(value) => setName(value)}
                />
              ) : (
                <div className="min-h-[40px] rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
                  {name}
                </div>
              )}
            </VStack>
            <VStack spacing={1} className="w-full items-stretch">
              <HStack className="w-full justify-between items-center">
                <h4 className="text-sm font-medium">{t`Description`}</h4>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsEditingDescription((prev) => !prev)}
                >
                  {isEditingDescription ? t`Done` : t`Edit`}
                </Button>
              </HStack>
              {isEditingDescription ? (
                <TextAreaControlled
                  label=""
                  name="description"
                  value={description}
                  onChange={(value) => setDescription(value)}
                  className="text-muted-foreground"
                />
              ) : (
                <div className="min-h-[72px] rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground whitespace-pre-wrap">
                  {description.trim() ? description : t`No description`}
                </div>
              )}
            </VStack>
          </VStack>
        </ValidatedForm>
      </CardContent>
    </Card>
  );
};

export default TemplateProperties;
