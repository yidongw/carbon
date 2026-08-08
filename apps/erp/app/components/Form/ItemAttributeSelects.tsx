import {
  localizeStyleColorName,
  localizeStyleColorNameByName
} from "@carbon/database/style-reference";
import { MultiSelect } from "@carbon/form";
import { useLingui } from "@lingui/react/macro";
import { translateItemAttributeCatalogName } from "~/modules/items/itemAttributeDisplayName";
import { useItemAttributeSetOptions } from "~/modules/items/ui/useItemAttributeSetOptions";

type ItemAttributeSelectsProps = {
  /** Item type whose attribute set drives the fields (e.g. "Style"). */
  itemType: string;
  maxPreview?: number;
};

/**
 * Attribute-driven value selector for create forms. Reads the item type's
 * attribute set and renders one MultiSelect per attribute (options from
 * itemAttributeValue). Submits a Hidden `attributeSetId` plus `av__<attributeId>`
 * arrays, which the action parses via parseAttributeValueSelectionsFromFormData.
 * Shares its data with the Consumable properties editor via
 * useItemAttributeSetOptions.
 */
const ItemAttributeSelects = ({
  itemType,
  maxPreview = 3
}: ItemAttributeSelectsProps) => {
  const { i18n } = useLingui();
  const { sets } = useItemAttributeSetOptions(itemType);
  // A single set is assigned per item type today (e.g. Style -> Garment).
  const set = sets[0];
  if (!set) return null;

  return (
    <>
      {/* Native hidden input (display:none) so it doesn't consume a grid cell —
          the FormControl-wrapped <Hidden> would push the attribute selects onto
          their own line. */}
      <input type="hidden" name="attributeSetId" value={set.id} />
      {set.attributes.map((attr) => (
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
        />
      ))}
    </>
  );
};

ItemAttributeSelects.displayName = "ItemAttributeSelects";

export default ItemAttributeSelects;
