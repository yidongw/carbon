import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { flash } from "@carbon/auth/session.server";
import type { ActionFunctionArgs } from "react-router";
import { data, redirect } from "react-router";
import {
  createPurchaseOrdersFromJob,
  jobStatus,
  recalculateJobRequirements,
  runMRP,
  updateJobStatus
} from "~/modules/production";
import { triggerJobRelease } from "~/modules/production/production.server";
import { path, requestReferrer } from "~/utils/path";

type StatusActionData = {
  success: boolean;
  status?: (typeof jobStatus)[number];
};

async function respondWithFlash(
  request: Request,
  {
    stay,
    jobId,
    result,
    payload
  }: {
    stay: boolean;
    jobId: string;
    result: ReturnType<typeof success> | ReturnType<typeof error>;
    payload?: StatusActionData;
  }
) {
  const init = await flash(request, result);
  if (stay) {
    return data(payload ?? { success: result.success === true }, init);
  }
  throw redirect(requestReferrer(request) ?? path.to.job(jobId), init);
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "production"
  });

  const { jobId: id } = params;
  if (!id) throw new Error("Could not find id");

  const url = new URL(request.url);
  const shouldSchedule = url.searchParams.get("schedule") === "1";
  // Inline callers (e.g. the jobs table status menu) stay on the referring page
  // instead of being sent to the job's sub-pages.
  const stay = url.searchParams.get("stay") === "1";

  const formData = await request.formData();
  const status = formData.get("status") as (typeof jobStatus)[number];
  const selectedPurchaseOrdersBySupplierId = formData.get(
    "selectedPurchaseOrdersBySupplierId"
  ) as string | null;

  if (!status || !jobStatus.includes(status)) {
    throw redirect(
      path.to.job(id),
      await flash(request, error(null, "Invalid status"))
    );
  }

  if (status === "Ready") {
    const { data: jobData } = await client
      .from("job")
      .select("item(itemReplenishment(manufacturingBlocked))")
      .eq("id", id)
      .single();

    if (jobData?.item?.itemReplenishment?.manufacturingBlocked) {
      if (stay) {
        return data(
          { success: false },
          await flash(request, error(null, "Manufacturing is blocked"))
        );
      }
      throw redirect(
        requestReferrer(request) ?? path.to.job(id),
        await flash(request, error(null, "Manufacturing is blocked"))
      );
    }
  }

  if (["Planned", "Ready"].includes(status) && !shouldSchedule) {
    const serviceRole = getCarbonServiceRole();
    await recalculateJobRequirements(serviceRole, {
      id,
      companyId,
      userId
    });
    await runMRP(getCarbonServiceRole(), {
      type: "job",
      id,
      companyId,
      userId
    });
  }

  if (["Ready", "Planned"].includes(status) && shouldSchedule) {
    try {
      const purchaseOrdersBySupplierId = JSON.parse(
        selectedPurchaseOrdersBySupplierId ?? "{}"
      );

      const { data: company, error: companyError } = await client
        .from("company")
        .select("companyGroupId")
        .eq("id", companyId)
        .single();

      if (companyError || !company?.companyGroupId) {
        return respondWithFlash(request, {
          stay,
          jobId: id,
          result: error(companyError, "Failed to load company for purchase orders"),
          payload: { success: false }
        });
      }

      const purchaseOrderCreate = await createPurchaseOrdersFromJob(client, {
        jobId: id,
        purchaseOrdersBySupplierId,
        companyId,
        companyGroupId: company.companyGroupId,
        userId
      });

      if (purchaseOrderCreate.error) {
        const message =
          purchaseOrderCreate.error instanceof Error
            ? purchaseOrderCreate.error.message
            : "Failed to create purchase orders for outside operations";
        return respondWithFlash(request, {
          stay,
          jobId: id,
          result: error(purchaseOrderCreate.error, message),
          payload: { success: false }
        });
      }

      const statusUpdate = await updateJobStatus(client, {
        id,
        status,
        updatedBy: userId
      });

      if (statusUpdate.error) {
        return respondWithFlash(request, {
          stay,
          jobId: id,
          result: error(statusUpdate.error, "Failed to update job status"),
          payload: { success: false }
        });
      }

      if (status === "Ready") {
        const { error: releasedDateError } = await client
          .from("job")
          .update({
            releasedDate: new Date().toISOString()
          })
          .eq("id", id);

        if (releasedDateError) {
          return respondWithFlash(request, {
            stay,
            jobId: id,
            result: error(releasedDateError, "Failed to set job release date"),
            payload: { success: false }
          });
        }
      }

      try {
        await triggerJobRelease(id, companyId, userId);
      } catch (releaseTriggerError) {
        // Status is already committed; background scheduling can be retried.
        console.error("Background release scheduling failed:", releaseTriggerError);
      }

      const releasedMessage =
        "Job released. Material requirements, MRP, and scheduling are updating in the background.";
      return respondWithFlash(request, {
        stay,
        jobId: id,
        result: success(releasedMessage),
        payload: { success: true, status }
      });
    } catch (err) {
      console.error(err);
      return respondWithFlash(request, {
        stay,
        jobId: id,
        result: error(err, "Failed to release job"),
        payload: { success: false }
      });
    }
  }

  const update = await updateJobStatus(client, {
    id,
    status,
    assignee: ["Cancelled"].includes(status) ? null : undefined,
    updatedBy: userId
  });
  if (update.error) {
    if (stay) {
      return data(
        { success: false },
        await flash(request, error(update.error, "Failed to update job status"))
      );
    }
    throw redirect(
      path.to.job(id),
      await flash(request, error(update.error, "Failed to update job status"))
    );
  }

  if (status === "Closed") {
    const serviceRole = await getCarbonServiceRole();
    await serviceRole.functions.invoke("close-job", {
      body: { jobId: id, userId, companyId }
    });
  }

  if (status === "Planned" && !stay) {
    throw redirect(
      path.to.jobMaterials(id),
      await flash(request, success("Job marked as planned"))
    );
  }

  // Inline callers (jobs table status menu) get a plain data response instead of
  // a redirect, so the fetcher keeps a clean submitting→loading→idle lifecycle.
  // That drives the inline spinner and lets React Router revalidate the row in
  // place (a redirect makes the fetcher hand off to a navigation, so neither
  // happens).
  if (stay) {
    // Echo the new status so the inline menu can show it immediately, without
    // waiting on the (laggy) row read-back.
    return data(
      { success: true, status },
      await flash(request, success("Updated job status"))
    );
  }

  throw redirect(
    requestReferrer(request) ?? path.to.job(id),
    await flash(request, success("Updated job status"))
  );
}
