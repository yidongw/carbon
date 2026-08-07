import { path } from "~/utils/path";
import ItemAttributeEditor from "../Item/ItemAttributeEditor";

type ConsumableAttributeEditorProps = {
  itemId: string;
  attributeSetId: string | null;
  selections: Record<string, string[]>;
};

/** Consumable properties wrapper around the shared attribute editor. */
const ConsumableAttributeEditor = ({
  itemId,
  attributeSetId,
  selections
}: ConsumableAttributeEditorProps) => (
  <ItemAttributeEditor
    itemId={itemId}
    itemType="Consumable"
    attributeSetId={attributeSetId}
    selections={selections}
    saveAction={path.to.consumableAttributes(itemId)}
  />
);

export default ConsumableAttributeEditor;
