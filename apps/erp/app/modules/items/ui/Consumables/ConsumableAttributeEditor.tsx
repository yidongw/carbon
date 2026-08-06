import { ValidatedForm } from "@carbon/form";
import { Badge, Button, HStack, toast, useMount, VStack } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect, useMemo, useState } from "react";
import { useFetcher } from "react-router";
import { z } from "zod";
import { Hidden, MultiSelect, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { path } from "~/utils/path";
import type { AttributeSetFormOption } from "../../itemAttribute.service";

type ConsumableAttributeEditorProps = {
  itemId: string;
  attributeSetId: string | null;
  selections: Record<string, string[]>;
};

const ConsumableAttributeEditor = ({
  itemId,
  attributeSetId,
  selections
}: ConsumableAttributeEditorProps) => {
  const { t } = useLingui();
  const permissions = usePermissions();
  const attributeSetsFetcher = useFetcher<{
    data: AttributeSetFormOption[];
    error: Error | null;
  }>();
  const saveFetcher = useFetcher<{ success?: boolean }>();

  useMount(() => {
    attributeSetsFetcher.load(path.to.api.attributeSetsForType("Consumable"));
  });

  const sets = attributeSetsFetcher.data?.data ?? [];
  const [setId, setSetId] = useState(attributeSetId ?? "");

  useEffect(() => {
    if (setId) return;
    if (attributeSetId) {
      setSetId(attributeSetId);
      return;
    }
    if (sets.length === 1) setSetId(sets[0].id);
  }, [attributeSetId, setId, sets]);

  const selectedSet = useMemo(
    () => sets.find((s) => s.id === setId),
    [sets, setId]
  );

  useEffect(() => {
    if (saveFetcher.state !== "idle" || !saveFetcher.data) return;
    if (saveFetcher.data.success === false) {
      toast.error(t`Failed to update attributes`);
    }
  }, [saveFetcher.data, saveFetcher.state, t]);

  if (!permissions.can("update", "parts")) {
    if (!attributeSetId) return null;
    return (
      <VStack spacing={2}>
        <h3 className="text-xs text-muted-foreground">
          <Trans>Attributes</Trans>
        </h3>
        <Badge variant="secondary">{selectedSet?.name ?? attributeSetId}</Badge>
      </VStack>
    );
  }

  if (sets.length === 0 && !attributeSetId) return null;

  const defaultValues: Record<string, string | string[]> = {
    attributeSetId: setId
  };
  for (const [attrId, valueIds] of Object.entries(selections)) {
    defaultValues[`av__${attrId}`] = valueIds;
  }

  return (
    <VStack spacing={2} className="w-full">
      <HStack className="w-full justify-between">
        <h3 className="text-xs text-muted-foreground">
          <Trans>Attributes</Trans>
        </h3>
        {selectedSet ? (
          <Badge variant="secondary">{selectedSet.name}</Badge>
        ) : null}
      </HStack>

      {!attributeSetId && sets.length > 1 ? (
        <div className="flex flex-wrap gap-1">
          {sets.map((s) => (
            <Button
              key={s.id}
              size="sm"
              variant={setId === s.id ? "primary" : "secondary"}
              onClick={() => setSetId(s.id)}
            >
              {s.code}
            </Button>
          ))}
        </div>
      ) : null}

      {setId ? (
        <ValidatedForm
          method="post"
          action={path.to.consumableAttributes(itemId)}
          validator={z.object({
            attributeSetId: z.string().min(1)
          })}
          defaultValues={defaultValues}
          fetcher={saveFetcher}
          className="w-full space-y-3"
        >
          <Hidden name="attributeSetId" value={setId} />
          {selectedSet?.attributes.map((attr) => (
            <MultiSelect
              key={attr.id}
              name={`av__${attr.id}`}
              label={attr.name}
              options={attr.options.map((o) => ({
                value: o.id,
                label: o.name || o.code,
                helper: o.code
              }))}
            />
          ))}
          <Submit
            size="sm"
            isLoading={saveFetcher.state !== "idle"}
            isDisabled={!permissions.can("update", "parts")}
          >
            <Trans>Save attributes</Trans>
          </Submit>
        </ValidatedForm>
      ) : null}
    </VStack>
  );
};

export default ConsumableAttributeEditor;
