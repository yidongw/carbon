import { useCarbon } from "@carbon/auth";
import {
  Copy,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  HStack,
  IconButton,
  useDisclosure,
} from "@carbon/react";
import { getItemReadableId } from "@carbon/utils";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import {
  LuCheckCheck,
  LuEllipsisVertical,
  LuFile,
  LuPanelLeft,
  LuPanelRight,
  LuTicketX,
  LuTrash,
  LuTruck
} from "react-icons/lu";
import { RiProgress8Line } from "react-icons/ri";
import { Link, useFetcher, useParams } from "react-router";
import { useAuditLog } from "~/components/AuditLog";
import {
  DetailTopbarContent,
  DetailTopbarId,
  usePanels,
  useTopbarLeft
} from "~/components/Layout";
import ConfirmDelete from "~/components/Modals/ConfirmDelete";
import { usePermissions, useRouteData, useUser } from "~/hooks";
import { ShipmentStatus } from "~/modules/inventory/ui/Shipments";
import type { SalesInvoice, SalesInvoiceLine } from "~/modules/invoicing";
import { salesInvoiceStatusType } from "~/modules/invoicing";
import type { action } from "~/routes/x+/sales-invoice+/$invoiceId.post";
import type { action as statusAction } from "~/routes/x+/sales-invoice+/$invoiceId.status";
import { useItems } from "~/stores";
import { path } from "~/utils/path";
import SalesInvoicePostModal from "./SalesInvoicePostModal";
import SalesInvoiceStatus from "./SalesInvoiceStatus";
import SalesInvoiceVoidModal from "./SalesInvoiceVoidModal";

function SalesInvoiceTopbarLeft({ invoiceId }: { invoiceId: string }) {
  const { t } = useLingui();
  const permissions = usePermissions();
  const { company } = useUser();
  const postingModal = useDisclosure();
  const voidModal = useDisclosure();
  const deleteModal = useDisclosure();
  const { trigger: auditLogTrigger, drawer: auditLogDrawer } = useAuditLog({
    entityType: "salesInvoice",
    // @ts-expect-error TS2322 - TODO: fix type
    entityId: invoiceId,
    companyId: company.id,
    variant: "dropdown"
  });

  const postFetcher = useFetcher<typeof action>();
  const statusFetcher = useFetcher<typeof statusAction>();

  const { carbon } = useCarbon();
  const [linesNotAssociatedWithSO, setLinesNotAssociatedWithSO] = useState<
    {
      itemId: string | null;
      itemReadableId: string | null;
      description: string;
      quantity: number;
    }[]
  >([]);

  const [items] = useItems();
  const routeData = useRouteData<{
    salesInvoice: SalesInvoice;
    salesInvoiceLines: SalesInvoiceLine[];
    defaultCc: string[];
  }>(path.to.salesInvoice(invoiceId));

  if (!routeData?.salesInvoice) throw new Error("salesInvoice not found");
  const { salesInvoice } = routeData;
  const isPosted = salesInvoice.postingDate !== null;
  const isVoided = salesInvoice.status === "Voided";

  const [relatedDocs, setRelatedDocs] = useState<{
    salesOrders: { id: string; readableId: string }[];
    shipments: { id: string; readableId: string; status: string }[];
  }>({ salesOrders: [], shipments: [] });

  // Load related documents on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  useEffect(() => {
    async function getRelatedDocuments() {
      if (!carbon || !salesInvoice.opportunityId) return;

      const [salesOrdersResult, shipmentsResult] = await Promise.all([
        carbon
          .from("salesOrder")
          .select("id, salesOrderId")
          .eq("opportunityId", salesInvoice.opportunityId),
        carbon
          .from("shipment")
          .select("id, shipmentId, status")
          .eq("opportunityId", salesInvoice.opportunityId)
      ]);

      if (salesOrdersResult.error)
        throw new Error(salesOrdersResult.error.message);
      if (shipmentsResult.error) throw new Error(shipmentsResult.error.message);

      setRelatedDocs({
        salesOrders:
          salesOrdersResult.data?.map((po) => ({
            id: po.id,
            readableId: po.salesOrderId
          })) ?? [],
        shipments:
          shipmentsResult.data?.map((r) => ({
            id: r.id,
            readableId: r.shipmentId,
            status: r.status
          })) ?? []
      });
    }

    getRelatedDocuments();
  }, [carbon, salesInvoice.opportunityId, salesInvoice.status]);

  const showPostModal = async () => {
    // check if there are any lines that are not associated with a SO
    if (!carbon) throw new Error("carbon not found");
    const { data, error } = await carbon
      .from("salesInvoiceLine")
      .select("itemId, description, quantity")
      .eq("invoiceId", invoiceId)
      .in("invoiceLineType", ["Part", "Material", "Tool", "Consumable"])
      .is("salesOrderLineId", null);

    if (error) throw new Error(error.message);
    if (!data) return;

    // so that we can ask the user if they want to receive those lines
    flushSync(() =>
      setLinesNotAssociatedWithSO(
        data?.map((d) => ({
          ...d,
          itemReadableId: getItemReadableId(items, d.itemId) ?? null,
          description: d.description ?? "",
          quantity: d.quantity
        })) ?? []
      )
    );
    postingModal.onOpen();
  };

  const handleStatusChange = (status: string) => {
    statusFetcher.submit(
      { status },
      { method: "post", action: path.to.salesInvoiceStatus(invoiceId) }
    );
  };

  const IS_PAYMENT_DROPDOWN_DISABLED =
    ["Voided", "Draft", "Pending"].includes(salesInvoice.status ?? "") ||
    !permissions.can("update", "invoicing");

  return (
    <>
      <DetailTopbarContent>
          <DetailTopbarId to={path.to.salesInvoiceDetails(invoiceId)}>
            {routeData?.salesInvoice?.invoiceId}
          </DetailTopbarId>
          <Copy text={routeData?.salesInvoice?.invoiceId ?? ""} />
          <SalesInvoiceStatus iconOnly status={salesInvoice.status} />
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton
              aria-label={t`More options`}
              icon={<LuEllipsisVertical />}
              size="sm"
              variant="secondary"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {auditLogTrigger}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a
                target="_blank"
                href={path.to.file.salesInvoice(invoiceId)}
                rel="noreferrer"
              >
                <DropdownMenuIcon icon={<LuFile />} />
                <Trans>Preview PDF</Trans>
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {relatedDocs.salesOrders.length === 1 && (
              <DropdownMenuItem asChild>
                <Link
                  to={path.to.salesOrderDetails(relatedDocs.salesOrders[0].id)}
                >
                  <DropdownMenuIcon icon={<RiProgress8Line />} />
                  <Trans>Sales Order</Trans>
                </Link>
              </DropdownMenuItem>
            )}
            {relatedDocs.salesOrders.length > 1 &&
              relatedDocs.salesOrders.map((so) => (
                <DropdownMenuItem key={so.id} asChild>
                  <Link to={path.to.salesOrderDetails(so.id)}>
                    <DropdownMenuIcon icon={<RiProgress8Line />} />
                    {so.readableId}
                  </Link>
                </DropdownMenuItem>
              ))}
            {relatedDocs.shipments.length > 0 && (
              <>
                {relatedDocs.shipments.map((shipment) => (
                  <DropdownMenuItem key={shipment.id} asChild>
                    <Link to={path.to.shipment(shipment.id)}>
                      <DropdownMenuIcon icon={<LuTruck />} />
                      <HStack spacing={8}>
                        <span>{shipment.readableId}</span>
                        <ShipmentStatus
                          status={shipment.status as "Posted"}
                        />
                      </HStack>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={
                postFetcher.state !== "idle" ||
                isPosted ||
                routeData?.salesInvoiceLines?.length === 0 ||
                !permissions.can("update", "invoicing")
              }
              onClick={showPostModal}
            >
              <DropdownMenuIcon icon={<LuCheckCheck />} />
              <Trans>Post</Trans>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {IS_PAYMENT_DROPDOWN_DISABLED ? (
              <DropdownMenuItem disabled>
                <Trans>Payment</Trans>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuRadioGroup
                value={salesInvoice.status ?? "Draft"}
                onValueChange={handleStatusChange}
              >
                {salesInvoiceStatusType
                  .filter(
                    (status) =>
                      !["Draft", "Pending", "Voided"].includes(status)
                  )
                  .map((status) => (
                    <DropdownMenuRadioItem key={status} value={status}>
                      <SalesInvoiceStatus status={status} />
                    </DropdownMenuRadioItem>
                  ))}
              </DropdownMenuRadioGroup>
            )}
            {isPosted && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={
                    isVoided || !permissions.can("update", "invoicing")
                  }
                  destructive
                  onClick={voidModal.onOpen}
                >
                  <DropdownMenuIcon icon={<LuTicketX />} />
                  <Trans>Void</Trans>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={
                salesInvoice.status !== "Draft" ||
                !permissions.can("delete", "invoicing") ||
                !permissions.is("employee")
              }
              destructive
              onClick={deleteModal.onOpen}
            >
              <DropdownMenuIcon icon={<LuTrash />} />
              <Trans>Delete Sales Invoice</Trans>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </DetailTopbarContent>

      {postingModal.isOpen && (
        <SalesInvoicePostModal
          invoiceId={invoiceId}
          customerId={salesInvoice.invoiceCustomerId}
          customerContactId={salesInvoice.invoiceCustomerContactId}
          isOpen={postingModal.isOpen}
          onClose={postingModal.onClose}
          linesToShip={linesNotAssociatedWithSO}
          fetcher={postFetcher}
          defaultCc={routeData?.defaultCc ?? []}
        />
      )}
      {voidModal.isOpen && (
        <SalesInvoiceVoidModal onClose={voidModal.onClose} />
      )}
      {deleteModal.isOpen && (
        <ConfirmDelete
          action={path.to.deleteSalesInvoice(invoiceId)}
          isOpen={deleteModal.isOpen}
          name={salesInvoice.invoiceId ?? "sales invoice"}
          text={t`Are you sure you want to delete ${salesInvoice.invoiceId}? This cannot be undone.`}
          onCancel={() => {
            deleteModal.onClose();
          }}
          onSubmit={() => {
            deleteModal.onClose();
          }}
        />
      )}
      {auditLogDrawer}
    </>
  );
}

const SalesInvoiceHeader = () => {
  const { invoiceId } = useParams();
  if (!invoiceId) throw new Error("invoiceId not found");

  const { leftSlotEl } = useTopbarLeft();
  const { t } = useLingui();
  const { hasExplorer, toggleExplorer, toggleProperties } = usePanels();

  return (
    <>
      {leftSlotEl && createPortal(<SalesInvoiceTopbarLeft invoiceId={invoiceId} />, leftSlotEl)}
      <div className="flex-shrink-0 h-[50px] flex items-center gap-1 px-2 bg-card border-b border-border dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]">
        {hasExplorer && (
          <IconButton
            aria-label={t`Toggle Explorer`}
            icon={<LuPanelLeft />}
            onClick={toggleExplorer}
            variant="ghost"
          />
        )}
        <div className="flex-1" />
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

export default SalesInvoiceHeader;
