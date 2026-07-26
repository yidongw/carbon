import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { type LoaderFunctionArgs, redirect } from "react-router";
import {
  findCurrentOperation,
  getBundleForScan,
  getBundleOperations
} from "~/services/bundle.service";
import { path } from "~/utils/path";

type ScanIntent = "view" | "pickup" | "report";

/**
 * Bundle scan resolver — a bundle has no page of its own. Resolve it to its
 * current operation and redirect to the operation page. Scanning the label QR
 * (which carries no `intent`) just *views* the operation; claiming/reporting is
 * explicit opt-in:
 *   - (no intent)      → operation page, read-only (default for a plain scan)
 *   - `?intent=report` → operation page with the record-quantity overlay
 *   - `?intent=pickup` → operation page (confirm-pickup overlay unless it's
 *     already ours)
 * A bundle with no open operation goes to the job's process graph. Reached only
 * via QR scan / the scan pages; the bundle list links straight to the job page.
 */
export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId, userId } = await requirePermissions(request, {});
  const { bundleWorkOrderId } = params;
  if (!bundleWorkOrderId) throw new Error("Missing bundle work order id");

  const rawIntent = new URL(request.url).searchParams.get("intent");
  const intent: ScanIntent =
    rawIntent === "report"
      ? "report"
      : rawIntent === "pickup"
        ? "pickup"
        : "view";

  const bundle = await getBundleForScan(client, bundleWorkOrderId, companyId);
  if (bundle.error || !bundle.data?.jobId) {
    throw redirect(
      path.to.home,
      await flash(request, error(bundle.error, "Bundle not found"))
    );
  }
  const jobId = bundle.data.jobId;

  const ops = await getBundleOperations(client, jobId);
  const cur = findCurrentOperation(ops.data ?? []);

  // No open operation (done / cancelled) → show the job's process graph.
  if (!cur) throw redirect(path.to.jobDag(jobId));

  if (intent === "report") {
    throw redirect(`${path.to.operation(cur.id)}?record=complete`);
  }

  if (intent === "pickup") {
    // Already ours → straight to the operation page; otherwise the
    // confirm-pickup overlay handles picking up / taking over.
    throw redirect(
      cur.assignee === userId
        ? path.to.operation(cur.id)
        : `${path.to.operation(cur.id)}?pickup=confirm`
    );
  }

  // Default (plain QR scan): view the operation, read-only. No take-over.
  throw redirect(path.to.operation(cur.id));
}

export default function BundleScanResolver() {
  return null;
}
