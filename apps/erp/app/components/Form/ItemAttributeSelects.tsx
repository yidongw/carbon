import { Hidden, MultiSelect } from "@carbon/form";
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
  const { sets } = useItemAttributeSetOptions(itemType);
  // A single set is assigned per item type today (e.g. Style -> Garment).
  const set = sets[0];
  if (!set) return null;

  return (
    <>
      <Hidden name="attributeSetId" value={set.id} />
      {set.attributes.map((attr) => (
        <MultiSelect
          key={attr.id}
          name={`av__${attr.id}`}
          label={attr.name}
          maxPreview={maxPreview}
          options={attr.options.map((o) => ({
            value: o.id,
            label: o.name || o.code,
            helper: o.code
          }))}
        />
      ))}
    </>
  );
};

ItemAttributeSelects.displayName = "ItemAttributeSelects";

export default ItemAttributeSelects;
