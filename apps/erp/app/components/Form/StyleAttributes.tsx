import { MultiSelect } from "@carbon/form";
import { useMount } from "@carbon/react";
import { useFetcher } from "react-router";
import type { AttributeSetFormOption } from "~/modules/items/itemAttribute.service";
import { path } from "~/utils/path";

// The standard Color/Size attributes keep the existing create-form field names
// so the create action + upsertStyle behavior is unchanged (and defaultValues
// binding still works). Any other attribute in the set submits generically as
// av__<attributeId>. "iat_color"/"iat_size" are the stable SYSTEM_ATTRIBUTE ids.
const fieldNameForAttribute = (attributeId: string): string => {
  if (attributeId === "iat_color") return "styleColorIds";
  if (attributeId === "iat_size") return "styleSizeIds";
  return `av__${attributeId}`;
};

type StyleAttributesProps = {
  /** Item type whose attribute set drives the fields (Style -> Garment). */
  itemType?: string;
  maxPreview?: number;
};

/**
 * Renders a style's attribute set (e.g. Garment -> Color, Size) as one
 * MultiSelect per attribute, sourced from itemAttributeValue. Replaces the
 * hardcoded StyleColors/StyleSizes pickers with the attribute-driven model,
 * while preserving the create behavior.
 */
const StyleAttributes = ({
  itemType = "Style",
  maxPreview = 3
}: StyleAttributesProps) => {
  const fetcher = useFetcher<{
    data: AttributeSetFormOption[];
    error: Error | null;
  }>();

  useMount(() => {
    fetcher.load(path.to.api.attributeSetsForType(itemType));
  });

  const set = fetcher.data?.data?.[0];
  if (!set) return null;

  return (
    <>
      {set.attributes.map((attr) => (
        <MultiSelect
          key={attr.id}
          name={fieldNameForAttribute(attr.id)}
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

StyleAttributes.displayName = "StyleAttributes";

export default StyleAttributes;
