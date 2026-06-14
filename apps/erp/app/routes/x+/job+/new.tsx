import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { msg } from "@lingui/core/macro";
import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { useUrlParams, useUser } from "~/hooks";
import { insertJob, jobValidator } from "~/modules/production";
import { getDefaultStorageUnitForJob } from "~/modules/inventory";
import { getItemReplenishment } from "~/modules/items";
import {
  calculateJobPriority,
  jobValidator,
  upsertJob,
  upsertJobMethod
} from "~/modules/production";
import { jobConfigurationUpdateFields } from "~/modules/production/configTableOverlay.server";
import { JobForm } from "~/modules/production/ui/Jobs";
import type { MethodItemType } from "~/modules/shared";
import { setCustomFields } from "~/utils/form";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Jobs`,
  to: path.to.jobs,
  module: "production"
};

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { companyId, userId } = await requirePermissions(request, {
    create: "production",
    role: "employee"
  });

  const formData = await request.formData();
  const validation = await validator(jobValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id: _id, configuration: configStr, ...data } = validation.data;

  let configuration: Record<string, unknown> | undefined;
  if (configStr) {
    try {
      configuration = JSON.parse(configStr);
    } catch {
      // invalid JSON — skip configuration
    }
  }

  const result = await insertJob(getCarbonServiceRole(), {
    ...data,
    jobId: data.jobId || undefined,
  // Fetch manufacturing data for lead time and scrap percentage
  const [nextSequenceResult, manufacturing] = await Promise.all([
    useNextSequence
      ? getNextSequence(client, "job", companyId)
      : Promise.resolve({ data: null, error: null }),
    getItemReplenishment(client, validation.data.itemId, companyId)
  ]);

  if (useNextSequence) {
    if (nextSequenceResult.error) {
      throw redirect(
        path.to.newJob,
        await flash(
          request,
          error(nextSequenceResult.error, "Failed to get next sequence")
        )
      );
    }
    // @ts-expect-error TS2322 - TODO: fix type
    jobId = nextSequenceResult.data;
  }

  const leadTime = manufacturing.data?.leadTime ?? 7;

  if (!jobId) throw new Error("jobId is not defined");
  const { id: _id, ...d } = validation.data;

  // Calculate scrap quantity from the item's scrap percentage if not set
  const scrapPercentage = manufacturing.data?.scrapPercentage ?? 0;
  const calculatedScrapQuantity =
    scrapPercentage > 0
      ? Math.ceil(validation.data.quantity * scrapPercentage)
      : 0;
  // Use the form value if set, otherwise use calculated value
  const scrapQuantity =
    d.scrapQuantity && d.scrapQuantity > 0
      ? d.scrapQuantity
      : calculatedScrapQuantity;

  let configuration = undefined;
  let quantity = d.quantity;
  if (d.configuration) {
    try {
      const parsed = JSON.parse(d.configuration) as Record<string, unknown>;
      const fields = jobConfigurationUpdateFields(parsed);
      configuration = fields.configuration;
      quantity = fields.quantity;
    } catch (error) {
      console.error(error);
    }
  }

  const storageUnitId = await getDefaultStorageUnitForJob(
    client,
    validation.data.itemId,
    validation.data.locationId,
    companyId
  );

  // Calculate priority based on due date and deadline type
  const priority = await calculateJobPriority(client, {
    dueDate: d.dueDate ?? null,
    deadlineType: d.deadlineType,
    companyId,
    locationId: validation.data.locationId
  });

  const createJob = await upsertJob(client, {
    ...d,
    jobId,
    quantity,
    configuration,
    companyId,
    createdBy: userId,
    customFields: setCustomFields(formData)
  });

  if (result.error || !result.data) {
    throw redirect(
      path.to.jobs,
      await flash(request, error(result.error, "Failed to insert job"))
    );
  }

  throw redirect(path.to.job(result.data.id));
}

export default function JobNewRoute() {
  const { defaults } = useUser();
  const [params] = useUrlParams();
  const customerId = params.get("customerId");

  const initialValues = {
    customerId: customerId ?? "",
    deadlineType: "No Deadline" as const,
    description: "",
    dueDate: "",
    itemId: "",
    itemType: "Item" as MethodItemType,
    jobId: undefined,
    locationId: defaults?.locationId ?? "",
    quantity: 1,
    scrapQuantity: 0,
    status: "Draft" as const,
    unitOfMeasureCode: "EA"
  };

  return (
    <div className="max-w-4xl w-full p-2 sm:p-0 mx-auto mt-0 md:mt-8">
      <JobForm initialValues={initialValues} />
    </div>
  );
}
