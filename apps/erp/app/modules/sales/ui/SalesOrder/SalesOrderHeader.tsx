import { SelectControlled, ValidatedForm } from "@carbon/form";
import {
  Button,
  Copy,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  toast,
  useDisclosure,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { Suspense, useEffect, useMemo, useState } from "react";
import { CSVLink } from "react-csv";
import { createPortal } from "react-dom";
import {
  LuCheckCheck,
  LuChevronDown,
  LuCirclePlus,
  LuCircleStop,
  LuCreditCard,
  LuEllipsisVertical,
  LuFile,
  LuGitCompare,
  LuLoaderCircle,
  LuPanelLeft,
  LuPanelRight,
  LuTrash,
  LuTruck
} from "react-icons/lu";
import type { FetcherWithComponents } from "react-router";
import { Await, Link, useFetcher, useParams } from "react-router";
import { useAuditLog } from "~/components/AuditLog";
import { CustomerContact, EmailRecipients } from "~/components/Form";
import { usePanels, useTopbarLeft } from "~/components/Layout";
import Confirm from "~/components/Modals/Confirm/Confirm";
import ConfirmDelete from "~/components/Modals/ConfirmDelete";
import { usePermissions, useRouteData, useUser } from "~/hooks";
import { useIntegrations } from "~/hooks/useIntegrations";
import type { Shipment } from "~/modules/inventory/types";
import { ShipmentStatus } from "~/modules/inventory/ui/Shipments";
import type { SalesInvoice } from "~/modules/invoicing/types";
import SalesInvoiceStatus from "~/modules/invoicing/ui/SalesInvoice/SalesInvoiceStatus";
import type { Job } from "~/modules/production/types";
import type { action as confirmAction } from "~/routes/x+/sales-order+/$orderId.confirm";
import type { action as statusAction } from "~/routes/x+/sales-order+/$orderId.status";
import { useCustomers } from "~/stores/customers";
import { path } from "~/utils/path";
import { isSalesOrderLocked, salesConfirmValidator } from "../../sales.models";
import type { Opportunity, SalesOrder, SalesOrderLine } from "../../types";
import SalesStatus from "./SalesStatus";
import { useSalesOrder } from "./useSalesOrder";

const SalesOrderConfirmModal = ({
  fetcher,
  salesOrder,
  onClose,
  defaultCc = []
}: {
  fetcher: FetcherWithComponents<{ success: boolean; message: string }>;
  salesOrder?: SalesOrder;
  onClose: () => void;
  defaultCc?: string[];
}) => {
  const { t } = useLingui();
  const { orderId } = useParams();
  if (!orderId) throw new Error("orderId not found");

  const integrations = useIntegrations();
  const canEmail = integrations.has("email");

  const [notificationType, setNotificationType] = useState<"Email" | "None">(
    canEmail ? "Email" : "None"
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  useEffect(() => {
    if (fetcher.data?.success) {
      onClose();
    } else if (fetcher.data?.success === false && fetcher.data?.message) {
      toast.error(fetcher.data.message);
    }
  }, [fetcher.data?.success]);

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <ModalContent>
        <ValidatedForm
          method="post"
          action={path.to.salesOrderConfirm(orderId)}
          validator={salesConfirmValidator}
          onSuccess={onClose}
          defaultValues={{
            notification: notificationType,
            customerContact: salesOrder?.customerContactId ?? undefined,
            cc: defaultCc
          }}
          fetcher={fetcher}
        >
          <ModalHeader>
            <ModalTitle>{t`Confirm ${salesOrder?.salesOrderId}`}</ModalTitle>
            <ModalDescription>
              <Trans>
                Are you sure you want to confirm this sales order? Confirming
                the order will affect on order quantities used to calculate
                supply and demand.
              </Trans>
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              {canEmail && (
                <SelectControlled
                  label={t`Send Via`}
                  name="notification"
                  options={[
                    {
                      label: t`None`,
                      value: "None"
                    },
                    {
                      label: t`Email`,
                      value: "Email"
                    }
                  ]}
                  value={notificationType}
                  onChange={(t) => {
                    if (t) setNotificationType(t.value as "Email" | "None");
                  }}
                />
              )}
              {notificationType === "Email" && (
                <>
                  <CustomerContact
                    name="customerContact"
                    customer={salesOrder?.customerId ?? undefined}
                  />
                  <EmailRecipients name="cc" label={t`CC`} type="employee" />
                </>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={onClose}>
              <Trans>Cancel</Trans>
            </Button>
            <Button type="submit" isLoading={fetcher.state !== "idle"}>
              <Trans>Confirm</Trans>
            </Button>
          </ModalFooter>
        </ValidatedForm>
      </ModalContent>
    </Modal>
  );
};

function SalesOrderTopbarLeft({ orderId }: { orderId: string }) {
  const { t } = useLingui();
  const { company } = useUser();

  const routeData = useRouteData<{
    salesOrder: SalesOrder;
    lines: SalesOrderLine[];
    opportunity: Opportunity;
    relatedItems: Promise<{
      jobs: Job[];
      shipments: Shipment[];
      invoices: SalesInvoice[];
    }>;
    defaultCc: string[];
  }>(path.to.salesOrder(orderId));

  if (!routeData?.salesOrder) throw new Error("Failed to load sales order");

  const permissions = usePermissions();
  const isLocked = isSalesOrderLocked(routeData?.salesOrder?.status);

  const statusFetcher = useFetcher<typeof statusAction>();
  const confirmFetcher = useFetcher<typeof confirmAction>();
  const { ship, invoice } = useSalesOrder();

  // Check if there are any lines with "Make" method type that would require jobs
  const hasMakeItems =
    routeData?.lines?.some((line) => line.methodType === "Make to Order") ??
    false;

  const salesOrderToJobsModal = useDisclosure();
  const confirmDisclosure = useDisclosure();
  const deleteSalesOrderModal = useDisclosure();
  const [customers] = useCustomers();

  const { trigger: auditLogTrigger, drawer: auditLogDrawer } = useAuditLog({
    entityType: "salesOrder",
    entityId: orderId,
    companyId: company.id,
    variant: "dropdown"
  });

  const csvExportData = useMemo(() => {
    const headers = [
      "Part ID",
      "Quantity",
      "Customer",
      "Customer #",
      "Sales Order #",
      "Order Date",
      "Promised Date"
    ];
    if (!routeData?.lines) return [headers];
    return [
      headers,
      ...routeData?.lines.map((item) => [
        item.itemReadableId,
        item.saleQuantity,
        customers.find((c) => c.id === routeData?.salesOrder?.customerId)?.name,
        routeData?.salesOrder?.customerReference,
        routeData?.salesOrder?.salesOrderId,
        routeData?.salesOrder?.orderDate,
        item.promisedDate
      ])
    ];
  }, [
    customers,
    routeData?.lines,
    routeData?.salesOrder?.customerId,
    routeData?.salesOrder?.customerReference,
    routeData?.salesOrder?.orderDate,
    routeData?.salesOrder?.salesOrderId
  ]);

  return (
    <>
      <HStack className="items-center -ml-2" spacing={1}>
          <Link to={path.to.salesOrderDetails(orderId)}>
            <span className="font-semibold text-sm">
              {routeData?.salesOrder?.salesOrderId}
            </span>
          </Link>
          <Copy text={routeData?.salesOrder?.salesOrderId ?? ""} />
          <SalesStatus
            status={routeData?.salesOrder?.status}
            jobs={
              routeData?.salesOrder?.jobs as Array<{
                salesOrderLineId: string;
                productionQuantity: number;
                quantityComplete: number;
                status: string;
              }>
            }
            lines={
              routeData?.salesOrder?.lines as Array<{
                id: string;
                methodType:
                  | "Purchase to Order"
                  | "Make to Order"
                  | "Pull from Inventory";
                saleQuantity: number;
              }>
            }
          />
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
                href={path.to.file.salesOrder(orderId)}
                rel="noreferrer"
              >
                <DropdownMenuIcon icon={<LuFile />} />
                <Trans>Preview PDF</Trans>
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={
                confirmFetcher.state !== "idle" ||
                !["Draft", "Needs Approval"].includes(
                  routeData?.salesOrder?.status ?? ""
                ) ||
                routeData?.lines.length === 0 ||
                !permissions.can("update", "sales")
              }
              onClick={confirmDisclosure.onOpen}
            >
              <DropdownMenuIcon icon={<LuCheckCheck />} />
              <Trans>Confirm</Trans>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Suspense fallback={null}>
              <Await resolve={routeData?.relatedItems}>
                {(relatedItems) => {
                  const shipments = relatedItems?.shipments || [];
                  const invoices = relatedItems?.invoices || [];
                  return (
                    <>
                      <DropdownMenuItem
                        disabled={
                          !["To Ship", "To Ship and Invoice", "To Invoice"].includes(
                            routeData?.salesOrder?.status ?? ""
                          )
                        }
                        onClick={() => {
                          ship(routeData?.salesOrder);
                        }}
                      >
                        <DropdownMenuIcon icon={<LuTruck />} />
                        <Trans>New Shipment</Trans>
                      </DropdownMenuItem>
                      {shipments.map((shipment) => (
                        <DropdownMenuItem key={shipment.id} asChild>
                          <Link to={path.to.shipment(shipment.id)}>
                            <DropdownMenuIcon icon={<LuTruck />} />
                            <HStack spacing={8}>
                              <span>{shipment.shipmentId}</span>
                              <ShipmentStatus
                                status={shipment.status}
                                invoiced={shipment.invoiced}
                              />
                            </HStack>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        disabled={
                          !["To Invoice", "To Ship and Invoice"].includes(
                            routeData?.salesOrder?.status ?? ""
                          )
                        }
                        onClick={() => {
                          invoice(routeData?.salesOrder);
                        }}
                      >
                        <DropdownMenuIcon icon={<LuCirclePlus />} />
                        <Trans>New Invoice</Trans>
                      </DropdownMenuItem>
                      {invoices.map((inv) => (
                        <DropdownMenuItem key={inv.id} asChild>
                          <Link to={path.to.salesInvoice(inv.id!)}>
                            <DropdownMenuIcon icon={<LuCreditCard />} />
                            <HStack spacing={8}>
                              <span>{inv.invoiceId}</span>
                              <SalesInvoiceStatus status={inv.status} />
                            </HStack>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </>
                  );
                }}
              </Await>
            </Suspense>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={
                ["Cancelled", "Closed", "Completed", "Invoiced"].includes(
                  routeData?.salesOrder?.status ?? ""
                ) ||
                statusFetcher.state !== "idle" ||
                !permissions.can("update", "sales")
              }
              onClick={() => {
                statusFetcher.submit(
                  { status: "Cancelled" },
                  {
                    method: "post",
                    action: path.to.salesOrderStatus(orderId)
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
                !["To Ship and Invoice", "To Ship"].includes(
                  routeData?.salesOrder?.status ?? ""
                ) ||
                !permissions.can("create", "production") ||
                !permissions.is("employee") ||
                !!routeData?.salesOrder?.jobs ||
                !hasMakeItems
              }
              onClick={salesOrderToJobsModal.onOpen}
            >
              <DropdownMenuIcon icon={<LuGitCompare />} />
              <Trans>Convert Lines to Jobs</Trans>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <CSVLink
                data={csvExportData}
                filename={`${routeData?.salesOrder?.salesOrderId}.csv`}
              >
                <DropdownMenuIcon icon={<LuFile />} />
                <Trans>Export Lines to CSV</Trans>
              </CSVLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={
                ["Draft"].includes(routeData?.salesOrder?.status ?? "") ||
                statusFetcher.state !== "idle" ||
                !permissions.can("update", "sales")
              }
              onClick={() => {
                statusFetcher.submit(
                  { status: "Draft" },
                  {
                    method: "post",
                    action: path.to.salesOrderStatus(orderId)
                  }
                );
              }}
            >
              <DropdownMenuIcon icon={<LuLoaderCircle />} />
              <Trans>Reopen</Trans>
            </DropdownMenuItem>
            <DropdownMenuItem
              destructive
              disabled={
                isLocked ||
                !permissions.can("delete", "sales") ||
                !permissions.is("employee")
              }
              onClick={deleteSalesOrderModal.onOpen}
            >
              <DropdownMenuIcon icon={<LuTrash />} />
              <Trans>Delete Sales Order</Trans>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </HStack>

      {salesOrderToJobsModal.isOpen && (
        <Confirm
          title={t`Convert Lines to Jobs`}
          text={t`Are you sure you want to create jobs for this sales order? This will create jobs for all lines that don't already have jobs.`}
          confirmText={t`Create Jobs`}
          onCancel={salesOrderToJobsModal.onClose}
          onSubmit={salesOrderToJobsModal.onClose}
          action={path.to.salesOrderLinesToJobs(orderId)}
        />
      )}
      {confirmDisclosure.isOpen && (
        <SalesOrderConfirmModal
          fetcher={confirmFetcher}
          salesOrder={routeData?.salesOrder}
          onClose={confirmDisclosure.onClose}
          defaultCc={routeData?.defaultCc ?? []}
        />
      )}
      {deleteSalesOrderModal.isOpen && (
        <ConfirmDelete
          action={path.to.deleteSalesOrder(orderId)}
          isOpen={deleteSalesOrderModal.isOpen}
          name={routeData?.salesOrder?.salesOrderId!}
          text={t`Are you sure you want to delete ${routeData?.salesOrder
            ?.salesOrderId!}? This cannot be undone.`}
          onCancel={() => {
            deleteSalesOrderModal.onClose();
          }}
          onSubmit={() => {
            deleteSalesOrderModal.onClose();
          }}
        />
      )}
      {auditLogDrawer}
    </>
  );
}

const SalesOrderHeader = () => {
  const { orderId } = useParams();
  if (!orderId) throw new Error("orderId not found");

  const { leftSlotEl } = useTopbarLeft();
  const { t } = useLingui();
  const { hasExplorer, toggleExplorer, toggleProperties } = usePanels();

  return (
    <>
      {leftSlotEl && createPortal(<SalesOrderTopbarLeft orderId={orderId} />, leftSlotEl)}
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

export default SalesOrderHeader;
