import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import { getConfigurationParameters } from "~/modules/items";
import {
  getProductionQuantityReportWithLines,
  getJobOperationActorContext
} from "~/modules/production";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "people"
  });

  const { reportId } = params;
  if (!reportId) {
    return data({ error: "Missing reportId" }, { status: 400 });
  }

  const serviceRole = getCarbonServiceRole();
  const reportResult = await getProductionQuantityReportWithLines(serviceRole, {
    reportId,
    companyId
  });

  if (reportResult.error || !reportResult.data) {
    return data({ error: "Report not found" }, { status: 404 });
  }

  const report = reportResult.data;

  const { data: job } = await serviceRole
    .from("job")
    .select("itemId")
    .eq("id", report.jobId)
    .eq("companyId", companyId)
    .single();

  const itemId = job?.itemId ?? null;
  const configurationParameters = itemId
    ? (await getConfigurationParameters(client, itemId, companyId)).parameters
    : [];

  const actorContext = await getJobOperationActorContext(
    client,
    report.jobOperationId,
    companyId
  );

  return {
    report,
    itemId,
    configurationParameters:
      configurationParameters.length > 0 ? configurationParameters : null,
    ...actorContext
  };
}
