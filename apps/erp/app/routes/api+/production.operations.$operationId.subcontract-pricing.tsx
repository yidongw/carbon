import { notFound } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import { getSubcontractPricingPreview } from "~/modules/production";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production"
  });

  const { operationId } = params;
  if (!operationId) throw notFound("operationId not found");

  const url = new URL(request.url);
  const supplierProcessId = url.searchParams.get("supplierProcessId");
  if (!supplierProcessId) {
    return data({ error: "supplierProcessId is required" }, { status: 400 });
  }

  const { data: operation, error: operationError } = await client
    .from("jobOperation")
    .select("jobId")
    .eq("id", operationId)
    .eq("companyId", companyId)
    .single();

  if (operationError || !operation?.jobId) {
    return data({ error: "Operation not found" }, { status: 404 });
  }

  const result = await getSubcontractPricingPreview(client, {
    companyId,
    jobId: operation.jobId,
    jobOperationId: operationId,
    supplierProcessId
  });

  if (result.error) {
    return data(
      {
        error:
          result.error instanceof Error
            ? result.error.message
            : String(result.error)
      },
      { status: 500 }
    );
  }

  return { pricing: result.data };
}
