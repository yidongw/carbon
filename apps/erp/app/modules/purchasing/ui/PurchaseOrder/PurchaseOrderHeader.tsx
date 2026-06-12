import {
  Copy,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  HStack,
  IconButton,
  Status,
  useDisclosure,
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  LuCheckCheck,
  LuCirclePlus,
  LuCircleStop,
  LuCreditCard,
  LuEllipsisVertical,
  LuFile,
  LuHandCoins,
  LuLoaderCircle,
  LuPanelLeft,
  LuPanelRight,
  LuTrash,
  LuTruck,
  LuX
} from "react-icons/lu";
import { Link, useFetcher, useNavigation, useParams } from "react-router";
import { useAuditLog } from "~/components/AuditLog";
import {
  DetailTopbarBadge,
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
import { ReceiptStatus } from "~/modules/inventory/ui/Receipts";
import { ShipmentStatus } from "~/modules/inventory/ui/Shipments";
import PurchaseInvoicingStatus from "~/modules/invoicing/ui/PurchaseInvoice/PurchaseInvoicingStatus";
import type { ApprovalDecision } from "~/modules/shared/types";
import { useSuppliers } from "~/stores/suppliers";
import { path } from "~/utils/path";
import { isPurchaseOrderLocked } from "../../purchasing.models";
import type { PurchaseOrder, PurchaseOrderLine } from "../../types";
import PurchaseOrderApprovalModal from "./PurchaseOrderApprovalModal";
import PurchaseOrderFinalizeModal from "./PurchaseOrderFinalizeModal";
import PurchasingStatus from "./PurchasingStatus";
import {
  usePurchaseOrder,
  usePurchaseOrderRelatedDocuments
} from "./usePurchaseOrder";

function PurchaseOrderTopbarLeft({ orderId }: { orderId: string }) {
  const { company } = useUser();
  const { t } = useLingui();
  const supplierApprovalRequired = useSupplierApprovalRequired();
  const routeData = useRouteData<{
    purchaseOrder: PurchaseOrder;
    lines: PurchaseOrderLine[];
    approvalRequest: { id: string } | null;
    canApprove: boolean;
    canReopen: boolean;
    canDelete: boolean;
    defaultCc: string[];
    supplier: { status: string | null } | null;
  }>(path.to.purchaseOrder(orderId));

  const [suppliers] = useSuppliers();
  const isSupplierApproved = useMemo(
    () =>
      !supplierApprovalRequired ||
      suppliers.find((s) => s.id === routeData?.purchaseOrder?.supplierId)
        ?.supplierStatus === "Active",
    [supplierApprovalRequired, routeData?.purchaseOrder?.supplierId, suppliers]
  );

  if (!routeData?.purchaseOrder)
    throw new Error("Failed to load purchase order");

  const permissions = usePermissions();

  const statusFetcher = useFetcher<{}>();
  const approvalFetcher = useFetcher<{}>();
  const navigation = useNavigation();
  const { receive, invoice, ship } = usePurchaseOrder();

  const isReceiving =
    navigation.state !== "idle" && navigation.formAction === path.to.newReceipt;
  const isInvoicing =
    navigation.state !== "idle" &&
    navigation.location?.pathname === path.to.newPurchaseInvoice;

  const isNeedsApproval = routeData?.purchaseOrder?.status === "Needs Approval";
  const hasApprovalRequest = !!routeData?.approvalRequest;
  const canApprove = routeData?.canApprove ?? false;
  const isLocked = isPurchaseOrderLocked(routeData?.purchaseOrder?.status);
  const { receipts, invoices, shipments } = usePurchaseOrderRelatedDocuments(
    routeData?.purchaseOrder?.supplierInteractionId ?? "",
    routeData?.purchaseOrder?.purchaseOrderType === "Outside Processing"
  );

  const { trigger: auditLogTrigger, drawer: auditLogDrawer } = useAuditLog({
    entityType: "purchaseOrder",
    entityId: orderId,
    companyId: company.id,
    variant: "dropdown"
  });

  const finalizeDisclosure = useDisclosure();
  const deleteModal = useDisclosure();
  const [approvalDecision, setApprovalDecision] =
    useState<ApprovalDecision | null>(null);

  const isOutsideProcessing =
    routeData?.purchaseOrder?.purchaseOrderType === "Outside Processing";
  const hasShipments = shipments.length > 0;
  const requiresShipment = isOutsideProcessing && !hasShipments;
  const hasReceivableLines = useMemo(
    () =>
      routeData?.lines?.some(
        (line) =>
          line.purchaseOrderLineType !== "Comment" &&
          line.purchaseOrderLineType !== "G/L Account"
      ) ?? false,
    [routeData?.lines]
  );

  const markAsPlanned = () => {
    statusFetcher.submit(
      { status: "Planned" },
      { method: "post", action: path.to.purchaseOrderStatus(orderId) }
    );
  };

  return (
    <>
      <DetailTopbarContent>
          <DetailTopbarId to={path.to.purchaseOrderDetails(orderId)}>
            {routeData?.purchaseOrder?.purchaseOrderId}
          </DetailTopbarId>
          <Copy text={routeData?.purchaseOrder?.purchaseOrderId ?? ""} />
          <PurchasingStatus iconOnly status={routeData?.purchaseOrder?.status} />
          {isOutsideProcessing && (
          <DetailTopbarBadge
            variant="default"
            label={routeData?.purchaseOrder?.purchaseOrderType}
          />
        )}
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
            <DropdownMenuItem asChild>
              <a
                target="_blank"
                href={path.to.file.purchaseOrder(orderId)}
                rel="noreferrer"
              >
                <DropdownMenuIcon icon={<LuFile />} />
                <Trans>Preview PDF</Trans>
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {isNeedsApproval && hasApprovalRequest && canApprove ? (
              <>
                <DropdownMenuItem
                  disabled={approvalFetcher.state !== "idle"}
                  onClick={() => setApprovalDecision("Approved")}
                >
                  <DropdownMenuIcon icon={<LuCheckCheck />} />
                  <Trans>Approve</Trans>
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={approvalFetcher.state !== "idle"}
                  destructive
                  onClick={() => setApprovalDecision("Rejected")}
                >
                  <DropdownMenuIcon icon={<LuX />} />
                  <Trans>Reject</Trans>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            ) : null}
            <DropdownMenuItem
              disabled={
                statusFetcher.state !== "idle" ||
                !["Draft", "Planned"].includes(
                  routeData?.purchaseOrder?.status ?? ""
                ) ||
                routeData?.lines.length === 0 ||
                !isSupplierApproved
              }
              onClick={finalizeDisclosure.onOpen}
            >
              <DropdownMenuIcon icon={<LuCheckCheck />} />
              <Trans>Finalize</Trans>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={
                !["Draft"].includes(
                  routeData?.purchaseOrder?.status ?? ""
                ) ||
                routeData?.lines.length === 0 ||
                !isSupplierApproved ||
                statusFetcher.state !== "idle"
              }
              onClick={markAsPlanned}
            >
              <DropdownMenuIcon icon={<LuCheckCheck />} />
              <Trans>Mark as Planned</Trans>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {routeData?.purchaseOrder?.purchaseOrderType ===
              "Outside Processing" && (
              <DropdownMenuItem
                disabled={
                  ![
                    "To Receive",
                    "To Receive and Invoice",
                    "To Invoice"
                  ].includes(routeData?.purchaseOrder?.status ?? "")
                }
                onClick={() => {
                  ship(routeData?.purchaseOrder);
                }}
              >
                <DropdownMenuIcon icon={<LuTruck />} />
                <Trans>New Shipment</Trans>
              </DropdownMenuItem>
            )}
            {shipments.map((shipment) => (
              <DropdownMenuItem key={shipment.id} asChild>
                <Link to={path.to.shipment(shipment.id)}>
                  <DropdownMenuIcon icon={<LuTruck />} />
                  <HStack spacing={8}>
                    <span>{shipment.shipmentId}</span>
                    <ShipmentStatus status={shipment.status} />
                  </HStack>
                </Link>
              </DropdownMenuItem>
            ))}
            {!isNeedsApproval && hasReceivableLines && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={
                    ![
                      "To Receive",
                      "To Receive and Invoice",
                      "To Invoice"
                    ].includes(routeData?.purchaseOrder?.status ?? "") ||
                    isReceiving
                  }
                  onClick={() => {
                    receive(routeData?.purchaseOrder);
                  }}
                >
                  <DropdownMenuIcon icon={<LuHandCoins />} />
                  <Trans>New Receipt</Trans>
                </DropdownMenuItem>
                {receipts.map((receipt) => (
                  <DropdownMenuItem key={receipt.id} asChild>
                    <Link to={path.to.receipt(receipt.id)}>
                      <DropdownMenuIcon icon={<LuHandCoins />} />
                      <HStack spacing={8}>
                        <span>{receipt.receiptId}</span>
                        <ReceiptStatus status={receipt.status} />
                      </HStack>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </>
            )}
            {!isNeedsApproval && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={
                    !["To Invoice", "To Receive and Invoice"].includes(
                      routeData?.purchaseOrder?.status ?? ""
                    ) || isInvoicing
                  }
                  onClick={() => {
                    invoice(routeData?.purchaseOrder);
                  }}
                >
                  <DropdownMenuIcon icon={<LuCirclePlus />} />
                  <Trans>New Invoice</Trans>
                </DropdownMenuItem>
                {invoices.map((inv) => (
                  <DropdownMenuItem key={inv.id} asChild>
                    <Link to={path.to.purchaseInvoice(inv.id!)}>
                      <DropdownMenuIcon icon={<LuCreditCard />} />
                      <HStack spacing={8}>
                        <span>{inv.invoiceId}</span>
                        <PurchaseInvoicingStatus
                          // @ts-expect-error - Return type is not defined
                          status={inv.status}
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
                ["Draft"].includes(
                  routeData?.purchaseOrder?.status ?? ""
                ) ||
                statusFetcher.state !== "idle" ||
                !permissions.can("update", "purchasing") ||
                (isNeedsApproval && !routeData?.canReopen)
              }
              onClick={() => {
                statusFetcher.submit(
                  { status: "Draft" },
                  {
                    method: "post",
                    action: path.to.purchaseOrderStatus(orderId)
                  }
                );
              }}
            >
              <DropdownMenuIcon icon={<LuLoaderCircle />} />
              <Trans>Reopen</Trans>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={
                ["Closed", "Completed"].includes(
                  routeData?.purchaseOrder?.status ?? ""
                ) ||
                statusFetcher.state !== "idle" ||
                !permissions.can("delete", "purchasing")
              }
              onClick={() => {
                statusFetcher.submit(
                  { status: "Closed" },
                  {
                    method: "post",
                    action: path.to.purchaseOrderStatus(orderId)
                  }
                );
              }}
            >
              <DropdownMenuIcon icon={<LuCircleStop />} />
              <Trans>Cancel</Trans>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={
                isLocked ||
                !permissions.can("delete", "purchasing") ||
                !permissions.is("employee") ||
                (isNeedsApproval && !routeData?.canDelete)
              }
              destructive
              onClick={deleteModal.onOpen}
            >
              <DropdownMenuIcon icon={<LuTrash />} />
              <Trans>Delete Purchase Order</Trans>
            </DropdownMenuItem>
          </DropdownMenuContent>
          </DropdownMenu>
      </DetailTopbarContent>

      {finalizeDisclosure.isOpen && (
        <PurchaseOrderFinalizeModal
          fetcher={statusFetcher}
          purchaseOrder={routeData?.purchaseOrder}
          onClose={finalizeDisclosure.onClose}
          defaultCc={routeData?.defaultCc ?? []}
        />
      )}
      {deleteModal.isOpen && (
        <ConfirmDelete
          action={path.to.deletePurchaseOrder(orderId)}
          isOpen={deleteModal.isOpen}
          name={routeData?.purchaseOrder?.purchaseOrderId ?? "purchase order"}
          text={t`Are you sure you want to delete ${routeData?.purchaseOrder?.purchaseOrderId}? This cannot be undone.`}
          onCancel={() => {
            deleteModal.onClose();
          }}
          onSubmit={() => {
            deleteModal.onClose();
          }}
        />
      )}
      {approvalDecision && routeData?.approvalRequest?.id && (
        <PurchaseOrderApprovalModal
          purchaseOrder={routeData?.purchaseOrder}
          approvalRequestId={routeData.approvalRequest.id}
          decision={approvalDecision}
          fetcher={approvalFetcher}
          onClose={() => setApprovalDecision(null)}
          defaultCc={routeData?.defaultCc ?? []}
        />
      )}
      {auditLogDrawer}
    </>
  );
}

const PurchaseOrderHeader = () => {
  const { orderId } = useParams();
  if (!orderId) throw new Error("orderId not found");

  const { leftSlotEl } = useTopbarLeft();
  const { t } = useLingui();
  const { hasExplorer, toggleExplorer, toggleProperties } = usePanels();

  return (
    <>
      {leftSlotEl && createPortal(<PurchaseOrderTopbarLeft orderId={orderId} />, leftSlotEl)}
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

export default PurchaseOrderHeader;
