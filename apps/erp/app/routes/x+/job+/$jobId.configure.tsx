import { error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { flash } from "@carbon/auth/session.server";
import { trigger } from "@carbon/jobs";
import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { resolveStyleMethodItemId } from "~/modules/items/styleMethod.service";
import { upsertJobMethod } from "~/modules/production";
import {
  isVariantsQuantityPayload,
  persistStyleJobVariantQuantities
} from "~/modules/production/jobVariantQuantity.service";
import { getDatabaseClient } from "~/services/database.server";
import { path, requestReferrer } from "~/utils/path";

export async function action({ request, params }: ActionFunctionArgs) {
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "production",
    role: "employee"
  });
  const { jobId } = params;
  if (!jobId) throw new Error("Could not find jobId");

  const configuration = await request.json();

  if (!configuration) {
    throw new Error("No configuration provided");
  }

  const job = await client
    .from("job")
    .select("itemId")
    .eq("id", jobId)
    .single();

  if (job.error || !job.data?.itemId) {
    throw redirect(
      requestReferrer(request) ?? path.to.job(jobId),
      await flash(request, error("Failed to get job"))
    );
  }

  // Style qty grid → jobVariantQuantity. Part flat params → job.configuration.
  if (isVariantsQuantityPayload(configuration)) {
    const parentItemId = await resolveStyleMethodItemId(client, {
      itemId: job.data.itemId,
      companyId
    });
    const replaced = await persistStyleJobVariantQuantities(
      client,
      getDatabaseClient(),
      {
        jobId,
        parentItemId,
        companyId,
        userId,
        variantQuantities: configuration as Record<string, unknown>
      }
    );
    if (replaced.error) {
      throw redirect(
        requestReferrer(request) ?? path.to.job(jobId),
        await flash(
          request,
          error(replaced.error, "Failed to update job variant quantities")
        )
      );
    }
  } else {
    const result = await client
      .from("job")
      .update({
        configuration: configuration as Record<string, unknown>,
        updatedAt: new Date().toISOString(),
        updatedBy: userId
      })
      .eq("id", jobId);

    if (result.error) {
      throw redirect(
        requestReferrer(request) ?? path.to.job(jobId),
        await flash(request, error("Failed to update job"))
      );
    }

    const serviceRole = await getCarbonServiceRole();
    const upsertMethod = await upsertJobMethod(serviceRole, "itemToJob", {
      sourceId: job.data.itemId,
      targetId: jobId,
      companyId,
      userId,
      configuration
    });

    if (upsertMethod.error) {
      throw redirect(
        requestReferrer(request) ?? path.to.job(jobId),
        await flash(request, error("Failed to update job method"))
      );
    }
  }

  await trigger("recalculate", {
    type: "jobRequirements",
    id: jobId,
    companyId,
    userId
  });

  throw redirect(
    requestReferrer(request) ?? path.to.job(jobId),
    await flash(request, success("Updated job"))
  );
}
