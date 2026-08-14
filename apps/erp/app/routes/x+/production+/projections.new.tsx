import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { useRouteData } from "@carbon/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData, useNavigate } from "react-router";
import {
  expandVariantTableToLines,
  requireVariantQuantitiesIfAttributeParent,
  scaleVariantQuantitiesToTotal
} from "~/modules/items/styleOrderLines.server";
import { demandProjectionValidator } from "~/modules/production/production.models";
import { upsertDemandProjections } from "~/modules/production/production.service";
import DemandProjectionForm from "~/modules/production/ui/Projection/DemandProjectionForm";
import { readVariantQuantitiesFormRaw } from "~/modules/production/variantsQuantityOverlay.server";
import { getOrCreatePeriods } from "~/modules/shared/shared.server";
import { path } from "~/utils/path";

const WEEKS_TO_PROJECT = 52;

export async function loader({ request }: LoaderFunctionArgs) {
  await requirePermissions(request, {
    create: "production"
  });

  const url = new URL(request.url);
  const locationId = url.searchParams.get("location") ?? "";

  let periods;
  try {
    periods = await getOrCreatePeriods(
      today(getLocalTimeZone()),
      WEEKS_TO_PROJECT
    );
  } catch (periodsError) {
    throw redirect(
      path.to.demandProjections,
      await flash(
        request,
        error(periodsError, "Failed to load projection periods")
      )
    );
  }

  return { periods, locationId };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "production"
  });

  const formData = await request.formData();
  const validation = await validator(demandProjectionValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const {
    itemId,
    locationId,
    periods,
    variantQuantities: variantQuantitiesFromValidator,
    ...weekData
  } = validation.data;

  const variantQuantitiesRaw = readVariantQuantitiesFormRaw(
    formData,
    variantQuantitiesFromValidator
  );
  let variantQuantities: unknown;
  if (variantQuantitiesRaw) {
    try {
      variantQuantities = JSON.parse(variantQuantitiesRaw);
    } catch {
      variantQuantities = undefined;
    }
  }

  // Extract week values and create demand forecast records
  const weeks: Array<{ periodId: string; quantity: number }> = [];
  for (let i = 0; i < 52; i++) {
    const weekKey = `week${i}` as keyof typeof weekData;
    const quantity = weekData[weekKey];

    if (
      quantity !== undefined &&
      quantity !== null &&
      quantity > 0 &&
      periods?.[i]
    ) {
      weeks.push({
        periodId: periods[i],
        quantity: Number(quantity)
      });
    }
  }

  if (weeks.length === 0) {
    return data(
      {},
      await flash(request, error(null, "No forecast quantities provided"))
    );
  }

  const totalWeekQuantity = weeks.reduce((sum, week) => sum + week.quantity, 0);

  const required = await requireVariantQuantitiesIfAttributeParent(client, {
    parentItemId: itemId,
    companyId,
    variantQuantities,
    quantity: totalWeekQuantity
  });
  if (!required.ok) {
    return data(
      {},
      await flash(request, error(required.error, required.error))
    );
  }

  const demandProjections: Array<{
    itemId: string;
    locationId: string;
    periodId: string;
    forecastQuantity: number;
    companyId: string;
    createdBy: string;
  }> = [];

  if (variantQuantities) {
    const expanded = await expandVariantTableToLines(client, {
      parentItemId: itemId,
      companyId,
      variantQuantities
    });
    if (!expanded.ok) {
      return data(
        {},
        await flash(request, error(expanded.error, expanded.error))
      );
    }

    for (const week of weeks) {
      const scaled = scaleVariantQuantitiesToTotal(
        expanded.variants,
        week.quantity
      );
      for (const variant of scaled) {
        demandProjections.push({
          itemId: variant.variantItemId,
          locationId,
          periodId: week.periodId,
          forecastQuantity: variant.quantity,
          companyId,
          createdBy: userId
        });
      }
    }
  } else {
    for (const week of weeks) {
      demandProjections.push({
        itemId,
        locationId,
        periodId: week.periodId,
        forecastQuantity: week.quantity,
        companyId,
        createdBy: userId
      });
    }
  }

  if (demandProjections.length === 0) {
    return data(
      {},
      await flash(request, error(null, "No forecast quantities provided"))
    );
  }

  const result = await upsertDemandProjections(client, demandProjections);

  if (result.error) {
    return data(
      {},
      await flash(
        request,
        error(result.error, "Failed to save demand forecasts")
      )
    );
  }

  return redirect(
    path.to.demandProjections + `?location=${locationId}`,
    await flash(request, success("Demand forecasts created successfully"))
  );
}

export default function NewProjectionRoute() {
  const navigate = useNavigate();
  const { locationId: loaderLocationId } = useLoaderData<typeof loader>();
  const routeData = useRouteData<{
    locationId: string;
  }>(path.to.demandProjections);

  const initialValues = {
    itemId: "",
    locationId: loaderLocationId || routeData?.locationId || "",
    ...Object.fromEntries(Array.from({ length: 52 }, (_, i) => [`week${i}`, 0]))
  };

  return (
    <DemandProjectionForm
      onClose={() => navigate(-1)}
      initialValues={initialValues}
    />
  );
}
