import { assertIsPost, error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect } from "react-router";
import {
  OVERLAY_PARAM,
  overlay,
  overlayToken,
  serializeSearch
} from "~/components/Overlay/overlay";
import { getStyle } from "~/modules/items";
import {
  createConfirmedSplitBatchForGroup,
  getJob,
  getPendingSplitGroupsForJob,
  isJobLocked,
  splitBatchConfirmValidator
} from "~/modules/production";
import { requireUnlocked } from "~/utils/lockedGuard.server";
import { path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const isOverlay = url.searchParams.get("overlay") === "true";
  const { jobId } = params;
  if (!jobId) throw notFound("jobId not found");

  if (!isOverlay) {
    const colorCode = url.searchParams.get("colorCode") ?? undefined;
    const sizeCode = url.searchParams.get("sizeCode") ?? undefined;
    const shadeLot = url.searchParams.get("shadeLot") ?? undefined;
    const configurationKey =
      url.searchParams.get("configurationKey") ?? undefined;
    const target = overlay.to.newJobSplitBatch({
      jobId,
      colorCode,
      sizeCode,
      shadeLot,
      configurationKey
    });
    const token = overlayToken(target);
    const redirectParams = new URLSearchParams();
    if (token) redirectParams.append(OVERLAY_PARAM, token);
    const query = serializeSearch(redirectParams);
    throw redirect(
      query ? `${path.to.job(jobId)}?${query}` : path.to.job(jobId)
    );
  }

  const { client, companyId } = await requirePermissions(request, {
    create: "production"
  });

  const [job, pendingGroups] = await Promise.all([
    getJob(client, jobId),
    getPendingSplitGroupsForJob(client, { companyId, jobId })
  ]);

  if (job.error || !job.data) {
    throw error(job.error, "Failed to load job");
  }

  if (pendingGroups.error || !pendingGroups.data) {
    throw error(pendingGroups.error, "Failed to load pending split groups");
  }

  if (!job.data.itemId) {
    throw error(new Error("Job has no style item"), "Job has no style item");
  }

  const style = await getStyle(client, job.data.itemId, companyId);
  if (style.error || !style.data) {
    throw error(style.error, "Failed to load style");
  }

  const colorCodeParam = url.searchParams.get("colorCode");
  const sizeCodeParam = url.searchParams.get("sizeCode");
  const shadeLotParam = url.searchParams.get("shadeLot");
  const configurationKeyParam = url.searchParams.get("configurationKey");

  const selectedGroup =
    pendingGroups.data.find(
      (group) =>
        (colorCodeParam == null || group.colorCode === colorCodeParam) &&
        (sizeCodeParam == null || (group.sizeCode ?? "") === sizeCodeParam) &&
        (shadeLotParam == null || (group.shadeLot ?? "") === shadeLotParam) &&
        (configurationKeyParam == null ||
          group.configurationKey === configurationKeyParam)
    ) ?? pendingGroups.data[0];

  if (!selectedGroup) {
    throw error(
      new Error("No pending split quantity available for this job"),
      "No pending split quantity available for this job"
    );
  }

  const styleCode =
    style.data.readableIdWithRevision ?? style.data.readableId ?? style.data.id;

  return {
    jobId,
    styleId: job.data.itemId,
    styleCode,
    colorCode: selectedGroup.colorCode,
    colorName: style.data.colorName,
    sizeCode: selectedGroup.sizeCode ?? null,
    shadeLot: selectedGroup.shadeLot ?? null,
    configurationKey: selectedGroup.configurationKey,
    pendingQuantity: selectedGroup.pendingQuantity,
    bundleDefaults: [selectedGroup.pendingQuantity]
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "production"
  });

  const { jobId } = params;
  if (!jobId) throw notFound("jobId not found");

  const { client: viewClient } = await requirePermissions(request, {
    view: "production"
  });
  const job = await getJob(viewClient, jobId);
  await requireUnlocked({
    request,
    isLocked: isJobLocked(job.data?.status),
    redirectTo: path.to.job(jobId),
    message: "Cannot modify a locked job. Reopen it first."
  });

  const formData = await request.formData();
  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";

  const bundleQuantities = formData
    .getAll("bundleQuantities")
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));

  const validation = splitBatchConfirmValidator.safeParse({
    jobId,
    jobOperationId: undefined,
    itemId: String(formData.get("itemId") ?? ""),
    styleCode: String(formData.get("styleCode") ?? ""),
    colorCode: String(formData.get("colorCode") ?? ""),
    colorName: String(formData.get("colorName") ?? ""),
    sizeCode: String(formData.get("sizeCode") ?? "") || undefined,
    shadeLot: String(formData.get("shadeLot") ?? "") || undefined,
    configurationKey: String(formData.get("configurationKey") ?? ""),
    notes: String(formData.get("notes") ?? "") || undefined,
    bundleQuantities
  });

  if (!validation.success) {
    return data({ errors: validation.error.flatten() }, { status: 400 });
  }

  const result = await createConfirmedSplitBatchForGroup(client, {
    companyId,
    jobId,
    itemId: validation.data.itemId,
    styleCode: validation.data.styleCode,
    colorCode: validation.data.colorCode,
    colorName: validation.data.colorName,
    sizeCode: validation.data.sizeCode ?? null,
    shadeLot: validation.data.shadeLot ?? null,
    configurationKey: validation.data.configurationKey,
    userId,
    notes: validation.data.notes,
    bundleQuantities: validation.data.bundleQuantities
  });

  if (result.error) {
    return data(
      { error: result.error.message ?? "Failed to confirm split batch" },
      { status: 400 }
    );
  }

  if (isOverlay) {
    return data(
      {
        ok: true,
        splitBatchId: result.data?.splitBatchId
      },
      await flash(request, success("Split batch confirmed"))
    );
  }

  return redirect(
    path.to.job(jobId),
    await flash(request, success("Split batch confirmed"))
  );
}

export default function NewJobSplitBatchRoute() {
  return null;
}
