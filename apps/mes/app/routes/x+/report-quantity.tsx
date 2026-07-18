import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { flash } from "@carbon/auth/session.server";
import { type ActionFunctionArgs, data } from "react-router";
import {
  finishJobOperation,
  insertProductionQuantity,
  insertReworkQuantity,
  insertScrapQuantity
} from "~/services/operations.service";

/** Non-negative integer from a form value; anything invalid becomes 0. */
function toCount(value: FormDataEntryValue | null): number {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/**
 * Report an operation's output in one shot: finished (Production, auto-issues
 * materials), plus the shortfall broken down into rework and scrap. Mirrors the
 * old bundle report form. Non-tracked operations only. Returns JSON so the
 * modal closes and the operation page revalidates in place.
 */
export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {});

  // Managers with production_update auto-approve their finished entries.
  let canAutoApprove = false;
  try {
    await requirePermissions(request, { update: "production" });
    canAutoApprove = true;
  } catch {
    canAutoApprove = false;
  }

  const formData = await request.formData();
  const jobOperationId = String(formData.get("jobOperationId") ?? "");
  // Credit the chosen employee (defaults to the assignee on the form); the
  // reporter stays the creator / data-entry user.
  const employeeId = String(formData.get("employeeId") ?? "").trim() || userId;
  const finished = toCount(formData.get("finished"));
  const rework = toCount(formData.get("rework"));
  const scrap = toCount(formData.get("scrap"));

  if (!jobOperationId) {
    return data(
      { success: false },
      await flash(request, error(null, "Missing operation"))
    );
  }
  if (finished + rework + scrap <= 0) {
    return data(
      { success: false },
      await flash(request, error(null, "Enter a quantity greater than zero"))
    );
  }

  const serviceRole = getCarbonServiceRole();
  const now = new Date();

  // When a report completes the operation, the finish-to-inventory trigger uses
  // jobOperation.updatedBy as the item ledger's createdBy. A never-touched op
  // (Todo / unassigned) has a null updatedBy, which makes that insert fail — so
  // stamp the reporter before recording quantities.
  await serviceRole
    .from("jobOperation")
    .update({ updatedBy: userId })
    .eq("id", jobOperationId)
    .eq("companyId", companyId);

  if (finished > 0) {
    const insert = await insertProductionQuantity(client, {
      jobOperationId,
      quantity: finished,
      employeeId,
      companyId,
      createdBy: userId,
      paymentYear: canAutoApprove ? now.getFullYear() : null,
      paymentMonth: canAutoApprove ? now.getMonth() + 1 : null
    });
    if (insert.error) {
      return data(
        { success: false },
        await flash(request, error(insert.error, "Failed to report quantity"))
      );
    }
    // Auto-issue materials for the finished quantity (mirrors /x/complete).
    await serviceRole.functions.invoke("issue", {
      body: {
        id: jobOperationId,
        type: "jobOperation",
        quantity: finished,
        companyId,
        userId
      }
    });
  }

  if (rework > 0) {
    const insert = await insertReworkQuantity(client, {
      jobOperationId,
      quantity: rework,
      employeeId,
      companyId,
      createdBy: userId
    });
    if (insert.error) {
      return data(
        { success: false },
        await flash(request, error(insert.error, "Failed to report rework"))
      );
    }
  }

  if (scrap > 0) {
    const insert = await insertScrapQuantity(client, {
      jobOperationId,
      quantity: scrap,
      employeeId,
      companyId,
      createdBy: userId
    });
    if (insert.error) {
      return data(
        { success: false },
        await flash(request, error(insert.error, "Failed to report scrap"))
      );
    }
  }

  // The quantity trigger has updated the operation totals; finish it if the
  // full target is now accounted for.
  const op = await serviceRole
    .from("jobOperation")
    .select(
      "quantityComplete, quantityReworked, quantityScrapped, targetQuantity, operationQuantity"
    )
    .eq("id", jobOperationId)
    .maybeSingle();
  if (op.data) {
    const target =
      op.data.targetQuantity && op.data.targetQuantity > 0
        ? op.data.targetQuantity
        : (op.data.operationQuantity ?? 0);
    const accounted =
      (op.data.quantityComplete ?? 0) +
      (op.data.quantityReworked ?? 0) +
      (op.data.quantityScrapped ?? 0);
    if (target > 0 && accounted >= target) {
      await finishJobOperation(serviceRole, {
        jobOperationId,
        userId,
        companyId
      });
    }
  }

  return data({ success: true });
}
