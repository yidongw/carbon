import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { flash } from "@carbon/auth/session.server";
import { validator } from "@carbon/form";
import { batchTrigger } from "@carbon/jobs";
import {
  parseDate,
  parseDateTime,
  toCalendarDateTime
} from "@internationalized/date";
import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { getDefaultStorageUnitForJob } from "~/modules/inventory";
import { getItemReplenishment } from "~/modules/items";
import {
  bulkJobValidator,
  upsertJob,
  upsertJobMethod
} from "~/modules/production";
import {
  isVariantsQuantityPayload,
  replaceJobVariantQuantitiesFromTable
} from "~/modules/production/jobVariantQuantity.service";
import { getNextSequence } from "~/modules/settings/settings.service";
import { getDatabaseClient } from "~/services/database.server";
import { setCustomFields } from "~/utils/form";
import { path } from "~/utils/path";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { companyId, userId } = await requirePermissions(request, {
    create: "production",
    bypassRls: true
  });

  const serviceRole = await getCarbonServiceRole();

  const formData = await request.formData();
  const validation = await validator(bulkJobValidator).validate(formData);
  let jobIds: string[] = [];

  if (!validation.data) {
    throw redirect(
      path.to.jobs,
      await flash(request, error(validation.error, "Invalid form data"))
    );
  }

  const {
    dueDateOfFirstJob,
    dueDateOfLastJob,
    scrapQuantityPerJob,
    jobCount,
    quantityPerJob,
    ...jobData
  } = validation.data;

  let configuration = undefined;
  let styleVariantQuantities = undefined;
  if (jobData.variantQuantities) {
    try {
      styleVariantQuantities =
        typeof jobData.variantQuantities === "string"
          ? JSON.parse(jobData.variantQuantities)
          : jobData.variantQuantities;
    } catch (error) {
      console.error(error);
    }
  }
  if (jobData.configuration) {
    try {
      configuration =
        typeof jobData.configuration === "string"
          ? JSON.parse(jobData.configuration)
          : jobData.configuration;
    } catch (error) {
      console.error(error);
    }
  }

  // Prefer dedicated variantQuantities FormData; legacy Style grids may still
  // arrive on configuration.
  const stylePayload =
    styleVariantQuantities && isVariantsQuantityPayload(styleVariantQuantities)
      ? styleVariantQuantities
      : isVariantsQuantityPayload(configuration)
        ? configuration
        : undefined;
  const isStyleQty = !!stylePayload;
  const variantsQuantityRows = isStyleQty
    ? (stylePayload.variantTable as Record<string, unknown>[])
    : [];
  const hasConfiguredJobs = variantsQuantityRows.length > 0;
  const flatPartConfiguration = isStyleQty ? undefined : configuration;
  const jobs = Math.max(1, Math.ceil(jobCount));

  // Combo-only: each row carries a single `Quantities` value.
  const getConfiguredJobQuantity = (row: Record<string, unknown>) =>
    Number(row.Quantities) || 0;

  const manufacturing = await getItemReplenishment(
    serviceRole,
    jobData.itemId,
    companyId
  );

  // Calculate due date distribution if both dates are provided
  let dueDateDistribution: string[] = [];
  if (dueDateOfFirstJob && dueDateOfLastJob) {
    const startDate = toCalendarDateTime(parseDateTime(dueDateOfFirstJob));
    const endDate = toCalendarDateTime(parseDateTime(dueDateOfLastJob));
    const daysBetween = endDate.compare(startDate);

    // Determine if we have multiple jobs per day or multiple days per job
    const jobsPerDay = (jobs - 1) / daysBetween;
    const daysPerJob = daysBetween / (jobs - 1);

    if (jobsPerDay >= 1) {
      // Multiple jobs per day - distribute jobs evenly across days
      let cumulativeJobs = 0;
      dueDateDistribution = Array.from({ length: jobs }, (_, i) => {
        if (i === jobs - 1) return dueDateOfLastJob;

        cumulativeJobs += 1;
        const dayOffset = Math.floor(cumulativeJobs / jobsPerDay);
        const jobDate = startDate.add({ days: dayOffset });
        return jobDate.toString();
      });
    } else {
      // Multiple days per job - distribute days evenly across jobs
      dueDateDistribution = Array.from({ length: jobs }, (_, i) => {
        if (i === jobs - 1) return dueDateOfLastJob;

        const dayOffset = Math.floor(i * daysPerJob);
        const jobDate = startDate.add({ days: dayOffset });
        return jobDate.toString();
      });
    }
  }

  const storageUnitId = await getDefaultStorageUnitForJob(
    serviceRole,
    jobData.itemId,
    jobData.locationId,
    companyId
  );

  for await (const [i] of Array.from({ length: jobs }, (_, i) => [i])) {
    const nextSequence = await getNextSequence(serviceRole, "job", companyId);
    if (nextSequence.error) {
      throw redirect(
        path.to.newJob,
        await flash(
          request,
          error(nextSequence.error, "Failed to get next sequence")
        )
      );
    }
    let jobId = nextSequence.data;
    const dueDate = (dueDateDistribution[i] || dueDateOfFirstJob)?.split(
      "T"
    )[0];

    const variantsQuantityRow = hasConfiguredJobs
      ? variantsQuantityRows[i % variantsQuantityRows.length]
      : undefined;
    const styleConfigurationForJob = variantsQuantityRow
      ? {
          variantTable: [variantsQuantityRow]
        }
      : undefined;
    const jobQuantity = variantsQuantityRow
      ? getConfiguredJobQuantity(variantsQuantityRow)
      : quantityPerJob;
    const scrapRatio =
      quantityPerJob > 0 ? scrapQuantityPerJob / quantityPerJob : 0;

    const createJob = await upsertJob(serviceRole, {
      jobId,
      ...jobData,
      quantity: jobQuantity,
      scrapQuantity: Math.ceil(jobQuantity * scrapRatio),
      dueDate,
      startDate: dueDate
        ? parseDate(dueDate)
            .subtract({ days: manufacturing.data?.leadTime ?? 7 })
            .toString()
        : undefined,
      storageUnitId: storageUnitId ?? undefined,
      configuration: flatPartConfiguration,
      companyId,
      createdBy: userId,
      customFields: setCustomFields(formData)
    });

    if (createJob.error) {
      throw redirect(
        path.to.newJob,
        await flash(request, error(createJob.error, "Failed to insert job"))
      );
    }

    const id = createJob.data?.id!;
    if (createJob.error || !jobId) {
      throw redirect(
        path.to.jobs,
        await flash(request, error(createJob.error, "Failed to insert job"))
      );
    }

    if (styleConfigurationForJob) {
      const replaced = await replaceJobVariantQuantitiesFromTable(
        serviceRole,
        getDatabaseClient(),
        {
          jobId: id,
          parentItemId: jobData.itemId,
          companyId,
          userId,
          variantQuantities: styleConfigurationForJob
        }
      );
      if (replaced.error) {
        throw redirect(
          path.to.newJob,
          await flash(
            request,
            error(replaced.error, "Failed to save job variant quantities")
          )
        );
      }
    }

    const upsertMethod = await upsertJobMethod(serviceRole, "itemToJob", {
      sourceId: jobData.itemId,
      targetId: id,
      companyId,
      userId,
      configuration: flatPartConfiguration
    });

    if (upsertMethod.error) {
      console.error("Failed to upsert job method", upsertMethod.error);
    }
    jobIds.push(id);
  }

  await batchTrigger(
    "recalculate",
    jobIds.map((id) => ({
      payload: {
        type: "jobRequirements",
        id,
        companyId,
        userId
      }
    }))
  );

  throw redirect(
    path.to.jobs,
    await flash(request, success(`Successfully created ${jobs} jobs`))
  );
}
