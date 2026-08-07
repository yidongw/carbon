import {
  Badge,
  Button,
  Combobox,
  toast,
  useMount,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect, useMemo, useState } from "react";
import { LuX } from "react-icons/lu";
import { useFetcher } from "react-router";
import { usePermissions } from "~/hooks";
import { path } from "~/utils/path";
import { translateSeedDisplayName } from "~/utils/seedDataDisplayName";
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
  const { t, i18n } = useLingui();
  const permissions = usePermissions();
  const canEdit = permissions.can("update", "parts");
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
  // Local, per-attribute selection state (value ids). Auto-saves on change.
  const [selected, setSelected] =
    useState<Record<string, string[]>>(selections);

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

  // Persist the full selection set for the current attribute set.
  const save = (next: Record<string, string[]>, targetSetId: string) => {
    if (!targetSetId) return;
    const formData = new FormData();
    formData.append("attributeSetId", targetSetId);
    const set = sets.find((s) => s.id === targetSetId);
    for (const attr of set?.attributes ?? []) {
      (next[attr.id] ?? []).forEach((valueId, idx) => {
        formData.append(`av__${attr.id}[${idx}]`, valueId);
      });
    }
    saveFetcher.submit(formData, {
      method: "post",
      action: path.to.consumableAttributes(itemId)
    });
  };

  const addValue = (attrId: string, valueId: string) => {
    if (!valueId) return;
    setSelected((prev) => {
      const current = prev[attrId] ?? [];
      if (current.includes(valueId)) return prev;
      const next = { ...prev, [attrId]: [...current, valueId] };
      save(next, setId);
      return next;
    });
  };

  const removeValue = (attrId: string, valueId: string) => {
    setSelected((prev) => {
      const next = {
        ...prev,
        [attrId]: (prev[attrId] ?? []).filter((id) => id !== valueId)
      };
      save(next, setId);
      return next;
    });
  };

  if (!canEdit) {
    if (!attributeSetId) return null;
    return (
      <VStack spacing={2} className="w-full">
        <h3 className="text-xs text-muted-foreground">
          <Trans>Attributes</Trans>
        </h3>
        {selectedSet?.attributes.map((attr) => (
          <VStack key={attr.id} spacing={1} className="w-full">
            <h4 className="text-xs text-muted-foreground">{attr.name}</h4>
            <div className="flex flex-wrap items-center gap-2">
              {(selected[attr.id] ?? []).map((valueId) => {
                const option = attr.options.find((o) => o.id === valueId);
                if (!option) return null;
                return (
                  <Badge key={valueId} variant="secondary" title={option.code}>
                    {translateSeedDisplayName(option.name || option.code, i18n)}
                  </Badge>
                );
              })}
            </div>
          </VStack>
        ))}
      </VStack>
    );
  }

  if (sets.length === 0 && !attributeSetId) return null;

  return (
    <VStack spacing={2} className="w-full">
      <h3 className="text-xs text-muted-foreground">
        <Trans>Attributes</Trans>
      </h3>

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

      {selectedSet?.attributes.map((attr) => {
        const chosen = selected[attr.id] ?? [];
        const chosenSet = new Set(chosen);
        const available = attr.options
          .filter((o) => !chosenSet.has(o.id))
          .map((o) => ({
            value: o.id,
            label: translateSeedDisplayName(o.name || o.code, i18n),
            helper: o.code
          }));
        return (
          <VStack key={attr.id} spacing={1} className="w-full">
            <h4 className="text-xs text-muted-foreground">{attr.name}</h4>
            <div className="flex flex-wrap items-center gap-2">
              {chosen.map((valueId) => {
                const option = attr.options.find((o) => o.id === valueId);
                if (!option) return null;
                return (
                  <Badge
                    key={valueId}
                    variant="secondary"
                    title={option.code}
                    className="pr-1"
                  >
                    {translateSeedDisplayName(option.name || option.code, i18n)}
                    <button
                      type="button"
                      aria-label={t`Remove`}
                      className="ml-1 rounded-full p-0.5 hover:bg-accent"
                      onClick={() => removeValue(attr.id, valueId)}
                      disabled={saveFetcher.state !== "idle"}
                    >
                      <LuX className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
              <span className="inline-flex [&>div]:!w-auto">
                <Combobox
                  options={available}
                  inline={() => null}
                  onChange={(valueId) => addValue(attr.id, valueId)}
                  isReadOnly={saveFetcher.state !== "idle"}
                />
              </span>
            </div>
          </VStack>
        );
      })}
    </VStack>
  );
};

export default ConsumableAttributeEditor;
