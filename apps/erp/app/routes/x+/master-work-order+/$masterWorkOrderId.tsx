import { requirePermissions } from "@carbon/auth/auth.server";
import { Badge, Button, Heading, HStack, VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ReactNode } from "react";
import { useCallback } from "react";
import { LuCirclePlus } from "react-icons/lu";
import type { LoaderFunctionArgs } from "react-router";
import { Link, redirect, useLoaderData, useRevalidator } from "react-router";
import { overlay, useOverlay } from "~/components/Overlay";
import { usePermissions } from "~/hooks";
import { getBundleWorkOrders, getMasterWorkOrder } from "~/modules/production";
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

  const bundles = await getBundleWorkOrders(
    client,
    masterWorkOrderId,
    companyId
  );

  return {
    masterWorkOrder: masterWorkOrder.data,
    bundles: bundles.data ?? []
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

export default function MasterWorkOrderDetailRoute() {
  const { masterWorkOrder, bundles } = useLoaderData<typeof loader>();
  const { t } = useLingui();
  const permissions = usePermissions();
  const { openOverlay } = useOverlay();
  const revalidator = useRevalidator();

  const openNewBundle = useCallback(() => {
    openOverlay(
      overlay.to.newBundleWorkOrder({ masterWorkOrderId: masterWorkOrder.id! }),
      { onCreated: () => revalidator.revalidate() }
    );
  }, [openOverlay, revalidator, masterWorkOrder.id]);

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
          <HStack className="justify-between w-full">
            <Heading size="h4">
              <Trans>Bundle Work Orders</Trans>
            </Heading>
            {permissions.can("create", "production") && (
              <Button
                variant="secondary"
                leftIcon={<LuCirclePlus />}
                onClick={openNewBundle}
              >
                <Trans>New Bundle</Trans>
              </Button>
            )}
          </HStack>
          {bundles.length === 0 ? (
            <div className="w-full rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              <Trans>
                No bundle work orders yet. Add bundles by color and size.
              </Trans>
            </div>
          ) : (
            <div className="w-full rounded-lg border border-border bg-card divide-y divide-border">
              {bundles.map((bundle) => (
                <Link
                  key={bundle.id}
                  to={path.to.bundleWorkOrder(bundle.id!)}
                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/50"
                >
                  <HStack spacing={4}>
                    <span className="text-sm font-medium">
                      {bundle.bundleNumber}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {[bundle.colorCode, bundle.sizeCode]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </span>
                  </HStack>
                  <HStack spacing={4}>
                    <span className="text-sm">{bundle.quantity}</span>
                    {bundle.status && (
                      <Badge variant="outline">{bundle.status}</Badge>
                    )}
                  </HStack>
                </Link>
              ))}
            </div>
          )}
        </VStack>
      </VStack>
    </div>
  );
}
