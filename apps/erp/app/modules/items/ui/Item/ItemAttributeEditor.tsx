import { localizeStyleColorName } from "@carbon/database/style-reference";
import { Badge, Combobox, toast, useMount, VStack } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect, useMemo, useState } from "react";
import { useFetcher } from "react-router";
import { usePermissions } from "~/hooks";
import { path } from "~/utils/path";
import type { AttributeSetFormOption } from "../../itemAttribute.service";
import { translateItemAttributeCatalogName } from "../../itemAttributeDisplayName";

export type ItemAttributeEditorProps = {
  itemId: string;
  /** Drives which attribute sets are loaded (e.g. "Style", "Consumable"). */
  itemType: string;
  attributeSetId: string | null;
  selections: Record<string, string[]>;
  /** POST target that runs syncItemVariantsFromSelections. */
  saveAction: string;
};

/**
 * Generic attribute-set + value editor for item properties sidebars.
 * Style and Consumable share this; neither hardcodes Color/Size.
 *
 * The attribute set is fixed once an item is created: it can't be changed here,
 * nor added to an item that was created without one (the editor renders nothing
 * in that case). Assigned values are additive-only — there is no remove control
 * — because dropping a value would archive its variant SKU and orphan any
 * production/purchase/sales records. The server enforces the same rules.
 */
const ItemAttributeEditor = ({
  itemId,
  itemType,
  attributeSetId,
  selections,
  saveAction
}: ItemAttributeEditorProps) => {
  const { t, i18n } = useLingui();
  const permissions = usePermissions();
  const canEdit = permissions.can("update", "parts");
  const attributeSetsFetcher = useFetcher<{
    data: AttributeSetFormOption[];
    error: Error | null;
  }>();
  const saveFetcher = useFetcher<{ success?: boolean }>();

  useMount(() => {
    attributeSetsFetcher.load(path.to.api.attributeSetsForType(itemType));
  });

  const sets = attributeSetsFetcher.data?.data ?? [];
  const [setId, setSetId] = useState(attributeSetId ?? "");
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

  // The item's frozen attribute footprint: only the attributes it was created
  // with (i.e. that it already has a value for). An attribute added to the set
  // afterwards must not appear for — or gain a value on — this existing item.
  const itemAttributeIds = useMemo(
    () =>
      new Set(
        Object.entries(selections)
          .filter(([, ids]) => (ids?.length ?? 0) > 0)
          .map(([attrId]) => attrId)
      ),
    [selections]
  );

  const itemAttributes = useMemo(
    () =>
      (selectedSet?.attributes ?? []).filter((attr) =>
        itemAttributeIds.has(attr.id)
      ),
    [selectedSet, itemAttributeIds]
  );

  const setLabel = (id: string) => {
    const s = sets.find((x) => x.id === id);
    const raw = s?.name || s?.code || id;
    return translateItemAttributeCatalogName(raw, i18n);
  };

  const attrLabel = (name: string) =>
    translateItemAttributeCatalogName(name, i18n);

  useEffect(() => {
    if (saveFetcher.state !== "idle" || !saveFetcher.data) return;
    if (saveFetcher.data.success === false) {
      toast.error(t`Failed to update attributes`);
    }
  }, [saveFetcher.data, saveFetcher.state, t]);

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
      action: saveAction
    });
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
        {itemAttributes.map((attr) => (
          <VStack key={attr.id} spacing={1} className="w-full">
            <h4 className="text-xs text-muted-foreground">
              {attrLabel(attr.name)}
            </h4>
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

  // The attribute set is immutable after creation: an item created without one
  // can never gain one, so there is nothing to edit here.
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

      {itemAttributes.map((attr) => {
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
            <h4 className="text-xs text-muted-foreground">
              {attrLabel(attr.name)}
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              {chosen.map((valueId) => {
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

export default ItemAttributeEditor;
