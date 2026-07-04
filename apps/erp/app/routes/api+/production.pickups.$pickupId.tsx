import { requirePermissions } from "@carbon/auth/auth.server";
import type { Json } from "@carbon/database";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== "PATCH") {
    return data({ error: "Method not allowed" }, { status: 405 });
  }

  const { client, companyId, userId } = await requirePermissions(request, {
    update: "production"
  });

  const { pickupId } = params;
  if (!pickupId) return data({ error: "pickupId not found" }, { status: 400 });

  const body = await request.json();
  const { quantity, notes, configuration } = body as {
    quantity: unknown;
    notes: unknown;
    configuration: unknown;
  };

  if (typeof quantity !== "number" || quantity <= 0) {
    return data(
      { error: "quantity must be a positive number" },
      { status: 400 }
    );
  }

  const { error: updateError } = await client
    .from("jobOperationPickup")
    .update({
      quantity,
      notes: typeof notes === "string" ? notes || null : null,
      ...(configuration !== undefined
        ? { configuration: configuration as Json }
        : {}),
      updatedBy: userId,
      updatedAt: new Date().toISOString()
    })
    .eq("id", pickupId)
    .eq("companyId", companyId);

  if (updateError) {
    return data({ error: updateError.message }, { status: 500 });
  }

  return data({ ok: true });
}
