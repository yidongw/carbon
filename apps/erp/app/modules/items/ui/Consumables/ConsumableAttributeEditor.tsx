import { localizeStyleColorName } from "@carbon/database/style-reference";
import { Select, ValidatedForm } from "@carbon/form";
import { Badge, Combobox, toast, VStack } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect, useMemo, useState } from "react";
import { LuX } from "react-icons/lu";
import { useFetcher } from "react-router";
import { z } from "zod";
import { usePermissions } from "~/hooks";
import { path } from "~/utils/path";
import { useItemAttributeSetOptions } from "../useItemAttributeSetOptions";

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
  const saveFetcher = useFetcher<{ success?: boolean }>();
  const { sets } = useItemAttributeSetOptions("Consumable");
  const [setId, setSetId] = useState(attributeSetId ?? "");
  // Local, per-attribute selection state (value ids). Auto-saves on change.
  const [selected, setSelected] =
    useState<Record<string, string[]>>(selections);

  useEffect(() => {
    setSetId(attributeSetId ?? "");
  }, [attributeSetId]);

  useEffect(() => {
    setSelected(selections);
  }, [selections]);

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

  const setLabel = (id: string) => {
    const s = sets.find((x) => x.id === id);
    return s?.name || s?.code || id;
  };

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

  const onSetChange = (nextSetId: string) => {
    if (!nextSetId || nextSetId === setId) return;
    setSetId(nextSetId);
    // Switching Fabric ↔ Trim clears value selections for the previous set.
    const next: Record<string, string[]> = {};
    setSelected(next);
    save(next, nextSetId);
  };

  const addValue = (attrId: string, valueId: string) => {
    if (!valueId || !setId) return;
    setSelected((prev) => {
      const current = prev[attrId] ?? [];
      if (current.includes(valueId)) return prev;
      const next = { ...prev, [attrId]: [...current, valueId] };
      save(next, setId);
      return next;
    });
  };

  const removeValue = (attrId: string, valueId: string) => {
    if (!setId) return;
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
        <VStack spacing={1} className="w-full">
          <h3 className="text-xs text-muted-foreground">
            <Trans>Attribute Set</Trans>
          </h3>
          <Badge variant="secondary">
            {selectedSet ? setLabel(selectedSet.id) : attributeSetId}
          </Badge>
        </VStack>
        {selectedSet?.attributes.map((attr) => (
          <VStack key={attr.id} spacing={1} className="w-full">
            <h4 className="text-xs text-muted-foreground">{attr.name}</h4>
            <div className="flex flex-wrap items-center gap-2">
              {(selected[attr.id] ?? []).map((valueId) => {
                const option = attr.options.find((o) => o.id === valueId);
                if (!option) return null;
                return (
                  <Badge key={valueId} variant="secondary" title={option.code}>
                    {localizeStyleColorName(option.code, i18n.locale) ??
                      option.name ??
                      option.code}
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
      {sets.length > 0 ? (
        <ValidatedForm
          key={setId || "unset"}
          defaultValues={{ attributeSetId: setId || undefined }}
          validator={z.object({
            attributeSetId: z.string().optional()
          })}
          className="w-full"
        >
          <Select
            name="attributeSetId"
            label={t`Attribute Set`}
            inline={(value) => (
              <Badge variant="secondary">
                <span>{value ? setLabel(value) : t`Select…`}</span>
              </Badge>
            )}
            options={sets.map((s) => ({
              value: s.id,
              label: s.name || s.code
            }))}
            isReadOnly={saveFetcher.state !== "idle"}
            onChange={(option) => {
              onSetChange(option?.value ?? "");
            }}
          />
        </ValidatedForm>
      ) : null}

      {selectedSet?.attributes.map((attr) => {
        const chosen = selected[attr.id] ?? [];
        const chosenSet = new Set(chosen);
        const available = attr.options
          .filter((o) => !chosenSet.has(o.id))
          .map((o) => ({
            value: o.id,
            label:
              localizeStyleColorName(o.code, i18n.locale) ?? o.name ?? o.code,
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
                    {localizeStyleColorName(option.code, i18n.locale) ??
                      option.name ??
                      option.code}
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
                  isReadOnly={saveFetcher.state !== "idle" || !setId}
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
