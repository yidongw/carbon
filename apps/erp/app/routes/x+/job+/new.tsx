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
import {
  isVariantsQuantityPayload,
  replaceJobVariantQuantitiesFromTable
} from "~/modules/production/jobVariantQuantity.service";
import { JobForm } from "~/modules/production/ui/Jobs";
import { variantTableUpdateFields } from "~/modules/production/variantsQuantityOverlay.server";
import type { MethodItemType } from "~/modules/shared";
import { getDatabaseClient } from "~/services/database.server";
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

  const {
    id: _id,
    configuration: configurationRaw,
    variantQuantities: variantQuantitiesStr,
    ...data
  } = validation.data;

  // Two FormData fields:
  // - variantQuantities (Style/attribute qty grid) → jobVariantQuantity rows
  // - configuration (Part flat params) → job.configuration for method rules
  let configuration: Record<string, unknown> | undefined;
  let styleVariantsQuantity: Record<string, unknown> | undefined;
  let quantity = data.quantity;
  if (variantQuantitiesStr) {
    try {
      const parsed =
        typeof variantQuantitiesStr === "string"
          ? (JSON.parse(variantQuantitiesStr) as Record<string, unknown>)
          : (variantQuantitiesStr as Record<string, unknown>);
      if (isVariantsQuantityPayload(parsed)) {
        styleVariantsQuantity = parsed;
        quantity = variantTableUpdateFields(parsed).quantity;
      }
    } catch {
      // invalid JSON — skip variant quantities
    }
  }
  if (configurationRaw) {
    try {
      const parsed =
        typeof configurationRaw === "string"
          ? (JSON.parse(configurationRaw) as Record<string, unknown>)
          : (configurationRaw as Record<string, unknown>);
      // Legacy dual-submit: Style grids used to share the configuration field.
      if (isVariantsQuantityPayload(parsed)) {
        if (!styleVariantsQuantity) {
          styleVariantsQuantity = parsed;
          quantity = variantTableUpdateFields(parsed).quantity;
        }
      } else {
        configuration = parsed;
      }
    } catch {
      // invalid JSON — skip configuration
    }
  }

  const result = await insertJob(getCarbonServiceRole(), {
    ...data,
    jobId: data.jobId || undefined,
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

  if (styleVariantsQuantity) {
    const replaced = await replaceJobVariantQuantitiesFromTable(
      getCarbonServiceRole(),
      getDatabaseClient(),
      {
        jobId: result.data.id,
        parentItemId: data.itemId,
        companyId,
        userId,
        variantQuantities: styleVariantsQuantity
      }
    );
    if (replaced.error) {
      throw redirect(
        path.to.job(result.data.id),
        await flash(
          request,
          error(replaced.error, "Failed to save job variant quantities")
        )
      );
    }
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
