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
  IconButton,
  Status,
  useDisclosure,
} from "@carbon/react";
import { getItemReadableId } from "@carbon/utils";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect, useMemo, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import {
  LuCheckCheck,
  LuEllipsisVertical,
  LuHandCoins,
  LuPanelLeft,
  LuPanelRight,
  LuShoppingCart,
  LuTicketX,
  LuTrash
} from "react-icons/lu";
import { Link, useFetcher, useParams } from "react-router";
import { useAuditLog } from "~/components/AuditLog";
import {
  DetailTopbarContent,
  DetailTopbarId,
  usePanels,
  useTopbarLeft
} from "~/components/Layout";
import ConfirmDelete from "~/components/Modals/ConfirmDelete";
import {
  usePermissions,
  useRouteData,
  useSupplierApprovalRequired,
  useUser
} from "~/hooks";
import type { PurchaseInvoice, PurchaseInvoiceLine } from "~/modules/invoicing";
import { PurchaseInvoicingStatus } from "~/modules/invoicing";
import type { action as statusAction } from "~/routes/x+/purchase-invoice+/$invoiceId.status";
import { useItems } from "~/stores";
import { useSuppliers } from "~/stores/suppliers";
import { path } from "~/utils/path";
import { isPurchaseInvoiceLocked } from "../../invoicing.models";
import PurchaseInvoicePostModal from "./PurchaseInvoicePostModal";
import PurchaseInvoiceVoidModal from "./PurchaseInvoiceVoidModal";

function PurchaseInvoiceTopbarLeft({ invoiceId }: { invoiceId: string }) {
  const { t } = useLingui();
  const permissions = usePermissions();
  const supplierApprovalRequired = useSupplierApprovalRequired();
  const { company } = useUser();
  const postingModal = useDisclosure();
  const voidModal = useDisclosure();
  const deleteModal = useDisclosure();
  const { trigger: auditLogTrigger, drawer: auditLogDrawer } = useAuditLog({
    entityType: "purchaseInvoice",
    // @ts-expect-error TS2322 - TODO: fix type
    entityId: invoiceId,
    companyId: company.id,
    variant: "dropdown"
  });

  const statusFetcher = useFetcher<typeof statusAction>();

  const { carbon } = useCarbon();
  const [linesNotAssociatedWithPO, setLinesNotAssociatedWithPO] = useState<
    {
      itemId: string | null;
      itemReadableId: string | null;
      description: string;
      quantity: number;
    }[]
  >([]);

  const [items] = useItems();
  const [suppliers] = useSuppliers();
  const routeData = useRouteData<{
    purchaseInvoice: PurchaseInvoice;
    purchaseInvoiceLines: PurchaseInvoiceLine[];
  }>(path.to.purchaseInvoice(invoiceId));

  const isSupplierApproved = useMemo(
    () =>
      !supplierApprovalRequired ||
      suppliers.find((s) => s.id === routeData?.purchaseInvoice?.supplierId)
        ?.supplierStatus === "Active",
    [
      supplierApprovalRequired,
      routeData?.purchaseInvoice?.supplierId,
      suppliers
    ]
  );

  if (!routeData?.purchaseInvoice) throw new Error("purchaseInvoice not found");
  const { purchaseInvoice } = routeData;
  const isPosted = purchaseInvoice.postingDate !== null;
  const isVoided = purchaseInvoice.status === "Voided";
  const hasPayment =
    purchaseInvoice.status === "Paid" ||
    purchaseInvoice.status === "Partially Paid";
  const canVoid = isPosted && !isVoided && !hasPayment;

  const [relatedDocs, setRelatedDocs] = useState<{
    purchaseOrders: { id: string; readableId: string }[];
    receipts: { id: string; readableId: string }[];
  }>({ purchaseOrders: [], receipts: [] });

  // Load related documents on mount
  useEffect(() => {
    async function loadRelatedDocs() {
      if (!carbon || !purchaseInvoice.supplierInteractionId) return;

      const [purchaseOrdersResult, receiptsResult] = await Promise.all([
        carbon
          .from("purchaseOrder")
          .select("id, purchaseOrderId")
          .eq("supplierInteractionId", purchaseInvoice.supplierInteractionId),
        carbon
          .from("receipt")
          .select("id, receiptId")
          .eq("supplierInteractionId", purchaseInvoice.supplierInteractionId)
      ]);

      if (purchaseOrdersResult.error)
        throw new Error(purchaseOrdersResult.error.message);
      if (receiptsResult.error) throw new Error(receiptsResult.error.message);

      setRelatedDocs({
        purchaseOrders:
          purchaseOrdersResult.data?.map((po) => ({
            id: po.id,
            readableId: po.purchaseOrderId
          })) ?? [],
        receipts:
          receiptsResult.data?.map((r) => ({
            id: r.id,
            readableId: r.receiptId
          })) ?? []
      });
    }

    loadRelatedDocs();
  }, [carbon, purchaseInvoice.supplierInteractionId]);

  const showPostModal = async () => {
    // check if there are any lines that are not associated with a PO
    if (!carbon) throw new Error("carbon not found");
    const { data, error } = await carbon
      .from("purchaseInvoiceLine")
      .select("itemId, description, quantity, conversionFactor")
      .eq("invoiceId", invoiceId)
      .in("invoiceLineType", ["Part", "Material", "Tool", "Consumable"])
      .is("purchaseOrderLineId", null);

    if (error) throw new Error(error.message);
    if (!data) return;

    // so that we can ask the user if they want to receive those lines
    flushSync(() =>
      setLinesNotAssociatedWithPO(
        data?.map((d) => ({
          ...d,
          itemReadableId: getItemReadableId(items, d.itemId) ?? null,
          description: d.description ?? "",
          quantity: d.quantity * (d.conversionFactor ?? 1)
        })) ?? []
      )
    );
    postingModal.onOpen();
  };

  const handleStatusChange = (status: string) => {
    statusFetcher.submit(
      { status },
      { method: "post", action: path.to.purchaseInvoiceStatus(invoiceId) }
    );
  };

  const isPaymentDisabled =
    purchaseInvoice.status === "Draft" ||
    purchaseInvoice.status === "Pending" ||
    isVoided ||
    !permissions.can("update", "invoicing");

  return (
    <>
      <DetailTopbarContent>
          <DetailTopbarId to={path.to.purchaseInvoiceDetails(invoiceId)}>
            {routeData?.purchaseInvoice?.invoiceId}
          </DetailTopbarId>
          <Copy text={routeData?.purchaseInvoice?.invoiceId ?? ""} />
          <PurchaseInvoicingStatus
            iconOnly
            // @ts-expect-error TS2322 - TODO: fix type
            status={routeData?.purchaseInvoice?.status}
          />
          {supplierApprovalRequired && !isSupplierApproved && (
          <Status iconOnly color="red">
            <Trans>Unapproved Supplier</Trans>
          </Status>
        )}
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
            {relatedDocs.purchaseOrders.length === 1 && (
              <DropdownMenuItem asChild>
                <Link
                  to={path.to.purchaseOrderDetails(
                    relatedDocs.purchaseOrders[0].id
                  )}
                >
                  <DropdownMenuIcon icon={<LuShoppingCart />} />
                  <Trans>Purchase Order</Trans>
                </Link>
              </DropdownMenuItem>
            )}
            {relatedDocs.purchaseOrders.length > 1 &&
              relatedDocs.purchaseOrders.map((po) => (
                <DropdownMenuItem key={po.id} asChild>
                  <Link to={path.to.purchaseOrderDetails(po.id)}>
                    <DropdownMenuIcon icon={<LuShoppingCart />} />
                    {po.readableId}
                  </Link>
                </DropdownMenuItem>
              ))}
            {relatedDocs.receipts.length === 1 && (
              <DropdownMenuItem asChild>
                <Link to={path.to.receipt(relatedDocs.receipts[0].id)}>
                  <DropdownMenuIcon icon={<LuHandCoins />} />
                  <Trans>Receipt</Trans>
                </Link>
              </DropdownMenuItem>
            )}
            {relatedDocs.receipts.length > 1 &&
              relatedDocs.receipts.map((receipt) => (
                <DropdownMenuItem key={receipt.id} asChild>
                  <Link to={path.to.receipt(receipt.id)}>
                    <DropdownMenuIcon icon={<LuHandCoins />} />
                    {receipt.readableId}
                  </Link>
                </DropdownMenuItem>
              ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={
                isPosted ||
                routeData?.purchaseInvoiceLines?.length === 0 ||
                !permissions.can("update", "invoicing") ||
                !isSupplierApproved
              }
              onClick={showPostModal}
            >
              <DropdownMenuIcon icon={<LuCheckCheck />} />
              <Trans>Post</Trans>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {isPaymentDisabled ? (
              <DropdownMenuItem disabled>
                <DropdownMenuIcon icon={<LuHandCoins />} />
                <Trans>Payment</Trans>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuRadioGroup
                value={purchaseInvoice.status ?? "Draft"}
                onValueChange={handleStatusChange}
              >
                {(["Paid", "Partially Paid"] as const).map((status) => (
                  <DropdownMenuRadioItem key={status} value={status}>
                    <PurchaseInvoicingStatus status={status} />
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            )}
            {isPosted && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={
                    !canVoid || !permissions.can("update", "invoicing")
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
                isPurchaseInvoiceLocked(
                  routeData?.purchaseInvoice?.status
                ) ||
                !permissions.can("delete", "invoicing") ||
                !permissions.is("employee")
              }
              destructive
              onClick={deleteModal.onOpen}
            >
              <DropdownMenuIcon icon={<LuTrash />} />
              <Trans>Delete Purchase Invoice</Trans>
            </DropdownMenuItem>
          </DropdownMenuContent>
          </DropdownMenu>
      </DetailTopbarContent>

      {postingModal.isOpen && (
        <PurchaseInvoicePostModal
          invoiceId={invoiceId}
          isOpen={postingModal.isOpen}
          onClose={postingModal.onClose}
          linesToReceive={linesNotAssociatedWithPO}
        />
      )}
      {voidModal.isOpen && (
        <PurchaseInvoiceVoidModal onClose={voidModal.onClose} />
      )}
      {deleteModal.isOpen && (
        <ConfirmDelete
          action={path.to.deletePurchaseInvoice(invoiceId)}
          isOpen={deleteModal.isOpen}
          name={routeData?.purchaseInvoice?.invoiceId ?? "purchase invoice"}
          text={t`Are you sure you want to delete ${routeData?.purchaseInvoice?.invoiceId}? This cannot be undone.`}
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

const PurchaseInvoiceHeader = () => {
  const { invoiceId } = useParams();
  if (!invoiceId) throw new Error("invoiceId not found");

  const { leftSlotEl } = useTopbarLeft();
  const { t } = useLingui();
  const { hasExplorer, toggleExplorer, toggleProperties } = usePanels();

  return (
    <>
      {leftSlotEl && createPortal(<PurchaseInvoiceTopbarLeft invoiceId={invoiceId} />, leftSlotEl)}
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

export default PurchaseInvoiceHeader;
