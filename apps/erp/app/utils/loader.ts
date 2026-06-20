import { isDeleted } from "@carbon/database";
import { redirect } from "react-router";

/**
 * Require that a record is not soft-deleted, or redirect to /x/deleted page.
 * Use this in detail page loaders after fetching a record.
 *
 * @example
 * export async function loader({ params, request }: LoaderFunctionArgs) {
 *   const { client } = await requirePermissions(request, { view: "items" });
 *   const item = await client.from("item").select("*").eq("id", params.id).single();
 *   assertNotDeleted(item.data);
 *   return json({ item: item.data });
 * }
 */
export function assertNotDeleted(
  record: { deletedAt?: string | null } | null
): asserts record is NonNullable<typeof record> {
  if (isDeleted(record)) {
    throw redirect("/x/deleted");
  }
}
