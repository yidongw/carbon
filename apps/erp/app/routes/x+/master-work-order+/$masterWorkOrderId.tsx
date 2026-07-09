import { requirePermissions } from "@carbon/auth/auth.server";
import { Badge, Heading, HStack, VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ReactNode } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData } from "react-router";
import { getMasterWorkOrder } from "~/modules/production";
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

  const { masterWorkOrderId } = params;
  if (!masterWorkOrderId) throw new Error("Could not find masterWorkOrderId");

  const masterWorkOrder = await getMasterWorkOrder(
    client,
    masterWorkOrderId,
    companyId
  );
  if (masterWorkOrder.error || !masterWorkOrder.data) {
    throw redirect(path.to.masterWorkOrders);
  }

  return { masterWorkOrder: masterWorkOrder.data };
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <VStack spacing={1}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value ?? "—"}</span>
    </VStack>
  );
}

export default function MasterWorkOrderDetailRoute() {
  const { masterWorkOrder } = useLoaderData<typeof loader>();
  const { t } = useLingui();

  return (
    <div className="h-full min-h-0 overflow-y-auto w-full p-6">
      <VStack spacing={8} className="max-w-4xl mx-auto">
        <HStack className="justify-between w-full">
          <VStack spacing={1}>
            <Heading size="h3">
              {masterWorkOrder.itemName ??
                masterWorkOrder.readableIdWithRevision}
            </Heading>
            <span className="text-sm text-muted-foreground">
              <Trans>Master Work Order</Trans>
              {" · "}
              {masterWorkOrder.jobReadableId}
            </span>
          </VStack>
          {masterWorkOrder.status && (
            <Badge variant="outline">{masterWorkOrder.status}</Badge>
          )}
        </HStack>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full rounded-lg border border-border bg-card p-6">
          <Field
            label={t`Style`}
            value={masterWorkOrder.readableIdWithRevision}
          />
          <Field label={t`Quantity`} value={masterWorkOrder.quantity} />
          <Field label={t`Status`} value={masterWorkOrder.status} />
          <Field label={t`Due Date`} value={masterWorkOrder.dueDate} />
        </div>

        <VStack spacing={2} className="w-full">
          <Heading size="h4">
            <Trans>Bundle Work Orders</Trans>
          </Heading>
          <div className="w-full rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            <Trans>
              No bundle work orders yet. Bundles are generated when the master
              work order is split.
            </Trans>
          </div>
        </VStack>
      </VStack>
    </div>
  );
}
