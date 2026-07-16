import { Copy, IconButton } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { LuPanelRight } from "react-icons/lu";
import { createPortal } from "react-dom";
import { useParams } from "react-router";
import {
  DetailsTopbar,
  DetailTopbarContent,
  DetailTopbarId,
  usePanels,
  useTopbarLeft
} from "~/components/Layout";
import { useRouteData } from "~/hooks";
import type { MasterWorkOrder } from "~/modules/production";
import { path } from "~/utils/path";
import type { jobStatus } from "../../production.models";
import JobStatus from "../Jobs/JobStatus";

function MasterTopbarLeft({
  masterWorkOrderId
}: {
  masterWorkOrderId: string;
}) {
  const routeData = useRouteData<{ masterWorkOrder: MasterWorkOrder }>(
    path.to.masterWorkOrder(masterWorkOrderId)
  );
  const readableId = routeData?.masterWorkOrder?.jobReadableId ?? "";
  const status = routeData?.masterWorkOrder?.status;

  return (
    <DetailTopbarContent>
      <DetailTopbarId to={path.to.masterWorkOrder(masterWorkOrderId)}>
        {readableId}
      </DetailTopbarId>
      <Copy text={readableId} />
      <JobStatus iconOnly status={status as (typeof jobStatus)[number]} />
    </DetailTopbarContent>
  );
}

const MasterWorkOrderHeader = () => {
  const { t } = useLingui();
  const { masterWorkOrderId } = useParams();
  if (!masterWorkOrderId) throw new Error("masterWorkOrderId not found");

  const { toggleProperties } = usePanels();
  const { leftSlotEl } = useTopbarLeft();

  const links = [
    {
      name: t`Bundle Work Orders`,
      to: path.to.masterWorkOrderBundleWorkOrders(masterWorkOrderId)
    },
    {
      name: t`Processes`,
      to: path.to.masterWorkOrderProcesses(masterWorkOrderId)
    },
    {
      name: t`Process Completions`,
      to: path.to.masterWorkOrderQuantities(masterWorkOrderId)
    },
    {
      name: t`Materials`,
      to: path.to.masterWorkOrderMaterials(masterWorkOrderId)
    }
  ];

  return (
    <>
      {leftSlotEl &&
        createPortal(
          <MasterTopbarLeft masterWorkOrderId={masterWorkOrderId} />,
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

export default MasterWorkOrderHeader;
