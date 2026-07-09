import { requirePermissions } from "@carbon/auth/auth.server";
import { Badge, Heading, HStack, VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ReactNode } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Link, redirect, useLoaderData } from "react-router";
import { getBundleWorkOrder } from "~/modules/production";
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

  return { bundleWorkOrder: bundleWorkOrder.data };
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <VStack spacing={1}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value ?? "—"}</span>
    </VStack>
  );
}

export default function BundleWorkOrderDetailRoute() {
  const { bundleWorkOrder } = useLoaderData<typeof loader>();
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
          <div className="w-full rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            <Trans>
              Downstream process reports (production, rework, scrap) will appear
              here.
            </Trans>
          </div>
        </VStack>
      </VStack>
    </div>
  );
}
