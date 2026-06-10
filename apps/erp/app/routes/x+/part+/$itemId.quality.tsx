import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { Suspense } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Await, redirect, useLoaderData, useParams } from "react-router";
import invariant from "tiny-invariant";
import {
  getItemSamplingPlan,
  itemSamplingPlanValidator,
  upsertItemSamplingPlan
} from "~/modules/quality";
import SamplingPlanForm from "~/modules/quality/ui/SamplingPlan/SamplingPlanForm";
import { getCompanySettings } from "~/modules/settings";
import { path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts"
  });
  const { itemId } = params;
  invariant(itemId, "itemId is required");

  const qualityData = (async () => {
    try {
      const [plan, settings] = await Promise.all([
        getItemSamplingPlan(client, itemId, companyId),
        getCompanySettings(client, companyId)
      ]);

      return {
        plan: plan.data,
        samplingStandard:
          ((settings.data as any)?.samplingStandard as
            | "ANSI_Z1_4"
            | "ISO_2859_1") ?? "ANSI_Z1_4"
      };
    } catch {
      return null;
    }
  })();

  return { qualityData };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "quality"
  });
  const { itemId } = params;
  invariant(itemId, "itemId is required");

  const formData = await request.formData();
  const validation = await validator(itemSamplingPlanValidator).validate(
    formData
  );
  if (validation.error) return validationError(validation.error);

  const result = await upsertItemSamplingPlan(client, {
    ...validation.data,
    companyId,
    updatedBy: userId
  });
  if (result.error) {
    throw redirect(
      path.to.partQuality(itemId),
      await flash(request, error(result.error, "Failed to save sampling plan"))
    );
  }

  throw redirect(
    path.to.partQuality(itemId),
    await flash(request, success("Sampling plan updated"))
  );
}

export default function PartQualityRoute() {
  const { qualityData } = useLoaderData<typeof loader>();
  const { itemId } = useParams();
  if (!itemId) throw new Error("itemId is required");

  return (
    <div className="p-4">
      <Suspense
        fallback={
          <div className="space-y-3 animate-pulse">
            <div className="h-48 bg-muted rounded-md" />
          </div>
        }
      >
        <Await resolve={qualityData}>
          {(resolved) => {
            if (!resolved) return null;
            return (
              <SamplingPlanForm
                action={path.to.partQuality(itemId)}
                itemId={itemId}
                standard={resolved.samplingStandard}
                initial={resolved.plan ?? undefined}
              />
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
