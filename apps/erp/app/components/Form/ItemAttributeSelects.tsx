import {
  localizeStyleColorName,
  localizeStyleColorNameByName
} from "@carbon/database/style-reference";
import { MultiSelect, Select } from "@carbon/form";
import { useLingui } from "@lingui/react/macro";
import { useEffect, useState } from "react";
import { translateItemAttributeCatalogName } from "~/modules/items/itemAttributeDisplayName";
import { useItemAttributeSetOptions } from "~/modules/items/ui/useItemAttributeSetOptions";

type ItemAttributeSelectsProps = {
  /** Item type whose attribute set drives the fields (e.g. "Style"). */
  itemType: string;
  maxPreview?: number;
};

/**
 * Attribute-driven value selector for create forms. Reads the attribute sets
 * assigned to the item type; when more than one is assigned (e.g. Style ->
 * Garment or Shoes) the user picks which set applies, then one MultiSelect
 * renders per attribute of the chosen set (options from itemAttributeValue).
 * Submits `attributeSetId` plus `av__<attributeId>` arrays, which the action
 * parses via parseAttributeValueSelectionsFromFormData. Mirrors the Consumable
 * create form's attribute-set picker so Style and Consumable behave the same.
 */
const ItemAttributeSelects = ({
  itemType,
  maxPreview = 3
}: ItemAttributeSelectsProps) => {
  const { t, i18n } = useLingui();
  const { sets } = useItemAttributeSetOptions(itemType);

  const options = sets.map((s) => ({
    value: s.id,
    label: translateItemAttributeCatalogName(s.name, i18n)
  }));

  // Chosen set. One assigned set → auto-select it; more than one → the user
  // picks (matching the Consumable form).
  const [attributeSetId, setAttributeSetId] = useState<string>("");
  useEffect(() => {
    if (attributeSetId) return;
    if (sets.length === 1) setAttributeSetId(sets[0].id);
  }, [attributeSetId, sets]);

  const selectedSet = sets.find(
    (s) => s.id === (attributeSetId || (sets.length === 1 ? sets[0]?.id : ""))
  );
  if (sets.length === 0) return null;

  return (
    <>
      {sets.length === 1 ? (
        // Native hidden input (display:none) so it doesn't consume a grid cell —
        // a FormControl-wrapped field would push the attribute selects onto their
        // own line.
        <input type="hidden" name="attributeSetId" value={sets[0].id} />
      ) : (
        <Select
          name="attributeSetId"
          label={t`Attribute Set`}
          options={options}
          onChange={(option) => setAttributeSetId(option?.value ?? "")}
          helperText={t`Which set of attributes this item's variants use`}
        />
      )}
      {selectedSet?.attributes.map((attr) => (
        <MultiSelect
          key={attr.id}
          name={`av__${attr.id}`}
          label={translateItemAttributeCatalogName(attr.name, i18n)}
          maxPreview={maxPreview}
          options={attr.options.map((o) => ({
            value: o.id,
            label:
              localizeStyleColorName(o.code, i18n.locale) ||
              localizeStyleColorNameByName(o.name, i18n.locale) ||
              o.name ||
              o.code,
            helper: o.code
          }))}
          helperText={t`Selected values become variant SKUs`}
        />
      ))}
    </>
  );
};

ItemAttributeSelects.displayName = "ItemAttributeSelects";

export default ItemAttributeSelects;
