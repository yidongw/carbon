import type { ActionFunctionArgs } from "react-router";
import { itemAttributesAction } from "~/modules/items/itemAttributes.actions.server";
import { path } from "~/utils/path";

export async function action(args: ActionFunctionArgs) {
  return itemAttributesAction(args, path.to.part);
}

export default function PartAttributesRoute() {
  return null;
}
