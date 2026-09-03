import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { ActionFunctionArgs } from "react-router";

/**
 * Bulk "Post" for shipments: mirrors the single-shipment post
 * ($shipmentId.post.tsx) core — set Pending, invoke the post-shipment edge
 * function (inventory ledger + sales-order status advance), revert to Draft on
 * failure — for each selected Draft shipment. Packing-slip PDF and label
 * auto-print (interactive extras of the single post) are intentionally skipped.
 */
export async function action({ request }: ActionFunctionArgs) {
  const { companyId, userId } = await requirePermissions(request, {
    update: "inventory"
  });

  const formData = await request.formData();
  const ids = formData.getAll("ids") as string[];

  if (ids.length === 0) {
    return { error: { message: "No shipments selected" }, data: null };
  }

  const serviceRole = getCarbonServiceRole();

  // Only Draft shipments can be posted.
  const shipments = await serviceRole
    .from("shipment")
    .select("id, status")
    .in("id", ids);

  const postableIds = (shipments.data ?? [])
    .filter((s) => s.status === "Draft")
    .map((s) => s.id);
  const skippedCount = ids.length - postableIds.length;

  let postedCount = 0;
  const failedIds: string[] = [];

  for (const shipmentId of postableIds) {
    const setPending = await serviceRole
      .from("shipment")
      .update({ status: "Pending" })
      .eq("id", shipmentId);
    if (setPending.error) {
      failedIds.push(shipmentId);
      continue;
    }

    const posted = await serviceRole.functions.invoke("post-shipment", {
      body: {
        type: "post",
        shipmentId,
        userId,
        companyId
      }
    });

    if (posted.error) {
      console.error(posted.error);
      // Revert so the shipment stays editable.
      await serviceRole
        .from("shipment")
        .update({ status: "Draft" })
        .eq("id", shipmentId);
      failedIds.push(shipmentId);
      continue;
    }

    postedCount++;
  }

  if (postedCount === 0 && failedIds.length > 0) {
    return { error: { message: "Failed to post shipments" }, data: null };
  }

  return {
    error: null,
    data: {
      postedCount,
      skippedCount,
      failedCount: failedIds.length
    }
  };
}
