import { requirePermissions } from "@carbon/auth/auth.server";
import { Badge, Heading, HStack, VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ReactNode } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Link, redirect, useLoaderData } from "react-router";
import {
  getBundleProcessReports,
  getBundleWorkOrder
} from "~/modules/production";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Master Work Orders`,
  to: path.to.masterWorkOrders,
  module: "production"
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    role: "employee"
  });

  const { bundleWorkOrderId } = params;
  if (!bundleWorkOrderId) throw new Error("Could not find bundleWorkOrderId");

  const bundleWorkOrder = await getBundleWorkOrder(
    client,
    bundleWorkOrderId,
    companyId
  );
  if (bundleWorkOrder.error || !bundleWorkOrder.data) {
    throw redirect(path.to.masterWorkOrders);
  }

  const reports = bundleWorkOrder.data.jobId
    ? await getBundleProcessReports(
        client,
        bundleWorkOrder.data.jobId,
        companyId
      )
    : null;

  return {
    bundleWorkOrder: bundleWorkOrder.data,
    reports: reports?.data ?? []
  };
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <VStack spacing={1}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value ?? "—"}</span>
    </VStack>
  );
}

const reportTypeVariant: Record<string, "green" | "yellow" | "red"> = {
  Production: "green",
  Rework: "yellow",
  Scrap: "red"
};

export default function BundleWorkOrderDetailRoute() {
  const { bundleWorkOrder, reports } = useLoaderData<typeof loader>();
  const { t } = useLingui();

  return (
    <div className="h-full min-h-0 overflow-y-auto w-full p-6">
      <VStack spacing={8} className="max-w-4xl mx-auto">
        <HStack className="justify-between w-full">
          <VStack spacing={1}>
            <Heading size="h3">{bundleWorkOrder.bundleNumber}</Heading>
            <span className="text-sm text-muted-foreground">
              <Trans>Bundle Work Order</Trans>
              {" · "}
              <Link
                to={path.to.masterWorkOrder(bundleWorkOrder.masterWorkOrderId!)}
                className="underline"
              >
                {bundleWorkOrder.itemName ??
                  bundleWorkOrder.readableIdWithRevision}
              </Link>
            </span>
          </VStack>
          {bundleWorkOrder.status && (
            <Badge variant="outline">{bundleWorkOrder.status}</Badge>
          )}
        </HStack>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full rounded-lg border border-border bg-card p-6">
          <Field label={t`Color`} value={bundleWorkOrder.colorCode} />
          <Field label={t`Size`} value={bundleWorkOrder.sizeCode} />
          <Field label={t`Quantity`} value={bundleWorkOrder.quantity} />
          <Field label={t`Status`} value={bundleWorkOrder.status} />
        </div>

        <VStack spacing={2} className="w-full">
          <Heading size="h4">
            <Trans>Process Reports</Trans>
          </Heading>
          {reports.length === 0 ? (
            <div className="w-full rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              <Trans>
                No process reports yet. Report production, rework, or scrap
                against this bundle's operations.
              </Trans>
            </div>
          ) : (
            <div className="w-full rounded-lg border border-border bg-card divide-y divide-border">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <HStack spacing={4}>
                    <Badge variant={reportTypeVariant[report.type] ?? "gray"}>
                      {report.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {report.jobOperation?.description ?? "—"}
                    </span>
                  </HStack>
                  <span className="text-sm font-medium">{report.quantity}</span>
                </div>
              ))}
            </div>
          )}
        </VStack>
      </VStack>
    </div>
  );
}
