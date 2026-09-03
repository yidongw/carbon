import { Copy, IconButton } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { createPortal } from "react-dom";
import { LuPanelRight } from "react-icons/lu";
import { useParams } from "react-router";
import {
  DetailsTopbar,
  DetailTopbarContent,
  DetailTopbarId,
  usePanels,
  useTopbarLeft
} from "~/components/Layout";
import { useRouteData } from "~/hooks";
import type { BundleWorkOrder } from "~/modules/production";
import { path } from "~/utils/path";
import type { jobStatus } from "../../production.models";
import JobStatus from "../Jobs/JobStatus";

function BundleTopbarLeft({
  bundleWorkOrderId
}: {
  bundleWorkOrderId: string;
}) {
  const routeData = useRouteData<{ bundleWorkOrder: BundleWorkOrder }>(
    path.to.bundleWorkOrder(bundleWorkOrderId)
  );
  const readableId = routeData?.bundleWorkOrder?.jobReadableId ?? "";
  const status = routeData?.bundleWorkOrder?.status;

  return (
    <DetailTopbarContent>
      <DetailTopbarId>{readableId}</DetailTopbarId>
      <Copy text={readableId} />
      <JobStatus iconOnly status={status as (typeof jobStatus)[number]} />
    </DetailTopbarContent>
  );
}

const BundleWorkOrderHeader = () => {
  const { t } = useLingui();
  const { bundleWorkOrderId } = useParams();
  if (!bundleWorkOrderId) throw new Error("bundleWorkOrderId not found");

  const { toggleProperties } = usePanels();
  const { leftSlotEl } = useTopbarLeft();

  const links = [
    {
      name: t`Processes`,
      to: path.to.bundleWorkOrderProcesses(bundleWorkOrderId)
    },
    {
      name: t`Process Completions`,
      to: path.to.bundleWorkOrderQuantities(bundleWorkOrderId)
    },
    {
      name: t`Materials`,
      to: path.to.bundleWorkOrderMaterials(bundleWorkOrderId)
    },
    {
      name: t`RFID Codes`,
      to: path.to.bundleWorkOrderRfidCodes(bundleWorkOrderId)
    }
  ];

  return (
    <>
      {leftSlotEl &&
        createPortal(
          <BundleTopbarLeft bundleWorkOrderId={bundleWorkOrderId} />,
          leftSlotEl
        )}
      <div className="flex-shrink-0 h-[50px] flex items-center gap-1 px-2 bg-card border-b border-border dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]">
        <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide flex items-center">
          <DetailsTopbar links={links} />
        </div>
        <IconButton
          aria-label={t`Toggle Properties`}
          icon={<LuPanelRight />}
          onClick={toggleProperties}
          variant="ghost"
        />
      </div>
    </>
  );
};

export default BundleWorkOrderHeader;
