import { HStack, MenuIcon, MenuItem, useDisclosure } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo, useState } from "react";
import {
  LuBookMarked,
  LuCalendar,
  LuContainer,
  LuCreditCard,
  LuDollarSign,
  LuMapPin,
  LuPencil,
  LuQrCode,
  LuStar,
  LuTrash,
  LuUser
} from "react-icons/lu";
import { useNavigate } from "react-router";
import {
  Assignee,
  EmployeeAvatar,
  Hyperlink,
  ItemThumbnail,
  New,
  SupplierAvatar,
  Table
} from "~/components";
import { useLocations } from "~/components/Form/Location";
import { usePaymentTerm } from "~/components/Form/PaymentTerm";
import { editableCell } from "~/components/InlineEditor";
import { ConfirmDelete } from "~/components/Modals";
import {
  useCurrencyFormatter,
  useDateFormatter,
  usePermissions,
  useRealtime
} from "~/hooks";
import { useCustomColumns } from "~/hooks/useCustomColumns";
import type { PurchaseInvoice } from "~/modules/invoicing";
import {
  PurchaseInvoicingStatus,
  purchaseInvoiceStatusType
} from "~/modules/invoicing";
import { usePeople, useSuppliers } from "~/stores";
import { path } from "~/utils/path";

// Purchase invoice inline edits go through the shared bulk-update action.
const PURCHASE_INVOICE_UPDATE = {
  action: path.to.bulkUpdatePurchaseInvoice,
  idKey: "ids" as const
};

type PurchaseInvoicesTableProps = {
  data: PurchaseInvoice[];
  count: number;
};

const PurchaseInvoicesTable = memo(
  ({ data, count }: PurchaseInvoicesTableProps) => {
    useRealtime(
      "purchaseInvoice",
      `id=in.(${data.map((d) => d.id).join(",")})`
    );

    const { t } = useLingui();
    const permissions = usePermissions();
    const navigate = useNavigate();
    const currencyFormatter = useCurrencyFormatter();
    const { formatDate } = useDateFormatter();

    const [selectedPurchaseInvoice, setSelectedPurchaseInvoice] =
      useState<PurchaseInvoice | null>(null);
    const closePurchaseInvoiceModal = useDisclosure();

    const [people] = usePeople();
    const [suppliers] = useSuppliers();
    const locations = useLocations();
    const paymentTerms = usePaymentTerm();
    const customColumns = useCustomColumns<PurchaseInvoice>("purchaseInvoice");

    const columns = useMemo<ColumnDef<PurchaseInvoice>[]>(() => {
      const defaultColumns: ColumnDef<PurchaseInvoice>[] = [
        {
          accessorKey: "invoiceId",
          header: t`Invoice Number`,
          cell: ({ row }) => (
            <HStack>
              <ItemThumbnail
                size="sm"
                thumbnailPath={row.original.thumbnailPath}
                // @ts-ignore
                type={row.original.itemType}
              />
              <Hyperlink to={path.to.purchaseInvoiceDetails(row.original.id!)}>
                {row.original?.invoiceId}
              </Hyperlink>
            </HStack>
          ),
          meta: {
            icon: <LuBookMarked />
          }
        },
        {
          id: "supplierId",
          header: t`Supplier`,
          cell: editableCell<PurchaseInvoice>({
            kind: "picker",
            field: "supplierId",
            update: PURCHASE_INVOICE_UPDATE,
            value: (r) => r.supplierId,
            options:
              suppliers?.map((s) => ({ value: s.id, label: s.name })) ?? [],
            renderInline: (v) => <SupplierAvatar supplierId={v} />
          }),
          meta: {
            filter: {
              type: "static",
              options: suppliers?.map((supplier) => ({
                value: supplier.id,
                label: supplier.name
              }))
            },
            icon: <LuContainer />
          }
        },
        {
          id: "invoiceSupplierId",
          header: t`Invoice Supplier`,
          cell: ({ row }) => (
            <SupplierAvatar supplierId={row.original.invoiceSupplierId} />
          ),
          meta: {
            filter: {
              type: "static",
              options: suppliers?.map((supplier) => ({
                value: supplier.id,
                label: supplier.name
              }))
            },
            icon: <LuContainer />
          }
        },
        {
          accessorKey: "supplierReference",
          header: t`Supplier Ref.`,
          cell: editableCell<PurchaseInvoice>({
            kind: "text",
            field: "supplierReference",
            update: PURCHASE_INVOICE_UPDATE,
            value: (r) => r.supplierReference
          }),
          meta: {
            icon: <LuQrCode />
          }
        },
        {
          accessorKey: "status",
          header: t`Status`,
          cell: (item) => {
            const status =
              item.getValue<(typeof purchaseInvoiceStatusType)[number]>();
            return <PurchaseInvoicingStatus status={status} />;
          },
          meta: {
            filter: {
              type: "static",
              options: purchaseInvoiceStatusType.map((status) => ({
                value: status,
                label: <PurchaseInvoicingStatus status={status} />
              }))
            },
            pluralHeader: t`Statuses`,
            icon: <LuStar />
          }
        },
        {
          accessorKey: "orderTotal",
          header: t`Order Total`,
          cell: (item) => currencyFormatter.format(item.getValue<number>()),
          meta: {
            icon: <LuDollarSign />,
            formatter: currencyFormatter.format,
            renderTotal: true
          }
        },
        {
          id: "assignee",
          header: t`Assignee`,
          cell: ({ row }) => (
            <Assignee
              id={row.original.id ?? ""}
              table="purchaseInvoice"
              value={row.original.assignee ?? ""}
              variant="button"
              size="sm"
            />
          ),
          meta: {
            filter: {
              type: "static",
              options: people.map((employee) => ({
                value: employee.id,
                label: employee.name
              }))
            },
            icon: <LuUser />
          }
        },
        {
          accessorKey: "dateIssued",
          header: t`Issued Date`,
          cell: editableCell<PurchaseInvoice>({
            kind: "date",
            field: "dateIssued",
            update: PURCHASE_INVOICE_UPDATE,
            value: (r) => r.dateIssued,
            renderInline: (v) => formatDate(v)
          }),
          meta: {
            icon: <LuCalendar />
          }
        },
        {
          accessorKey: "dateDue",
          header: t`Due Date`,
          cell: editableCell<PurchaseInvoice>({
            kind: "date",
            field: "dateDue",
            update: PURCHASE_INVOICE_UPDATE,
            value: (r) => r.dateDue,
            renderInline: (v) => formatDate(v)
          }),
          meta: {
            icon: <LuCalendar />
          }
        },
        {
          accessorKey: "datePaid",
          header: t`Paid Date`,
          cell: editableCell<PurchaseInvoice>({
            kind: "date",
            field: "datePaid",
            update: PURCHASE_INVOICE_UPDATE,
            value: (r) => r.datePaid,
            renderInline: (v) => formatDate(v)
          }),
          meta: {
            icon: <LuCalendar />
          }
        },
        {
          accessorKey: "postingDate",
          header: t`Posting Date`,
          cell: (item) => formatDate(item.getValue<string>()),
          meta: {
            icon: <LuCalendar />
          }
        },
        {
          accessorKey: "paymentTermName",
          header: t`Payment Method`,
          cell: editableCell<PurchaseInvoice>({
            kind: "picker",
            field: "paymentTermId",
            update: PURCHASE_INVOICE_UPDATE,
            value: (r) => r.paymentTermId,
            options: paymentTerms,
            fallbackLabel: (r) => r.paymentTermName
          }),
          meta: {
            icon: <LuCreditCard />
          }
        },
        {
          accessorKey: "locationName",
          header: t`Location`,
          cell: editableCell<PurchaseInvoice>({
            kind: "picker",
            field: "locationId",
            update: PURCHASE_INVOICE_UPDATE,
            value: (r) => r.locationId,
            options: locations,
            fallbackLabel: (r) => r.locationName
          }),
          meta: {
            icon: <LuMapPin />
          }
        },
        {
          id: "createdBy",
          header: t`Created By`,
          cell: ({ row }) => (
            <EmployeeAvatar employeeId={row.original.createdBy} />
          ),
          meta: {
            filter: {
              type: "static",
              options: people.map((employee) => ({
                value: employee.id,
                label: employee.name
              }))
            },
            icon: <LuUser />
          }
        },
        {
          accessorKey: "createdAt",
          header: t`Created At`,
          cell: (item) => formatDate(item.getValue<string>()),
          meta: {
            icon: <LuCalendar />
          }
        },
        {
          id: "updatedBy",
          header: t`Updated By`,
          cell: ({ row }) => (
            <EmployeeAvatar employeeId={row.original.updatedBy} />
          ),
          meta: {
            filter: {
              type: "static",
              options: people.map((employee) => ({
                value: employee.id,
                label: employee.name
              }))
            },
            icon: <LuUser />
          }
        },
        {
          accessorKey: "updatedAt",
          header: t`Updated At`,
          cell: (item) => formatDate(item.getValue<string>()),
          meta: {
            icon: <LuCalendar />
          }
        }
      ];

      return [...defaultColumns, ...customColumns];
    }, [currencyFormatter, customColumns, people, suppliers, t, formatDate]);

    const renderContextMenu = useMemo(() => {
      return (row: PurchaseInvoice) => (
        <>
          <MenuItem
            disabled={!permissions.can("view", "invoicing")}
            onClick={() => navigate(path.to.purchaseInvoice(row.id!))}
          >
            <MenuIcon icon={<LuPencil />} />
            <Trans>Edit</Trans>
          </MenuItem>
          <MenuItem
            disabled={
              row.status !== "Draft" || !permissions.can("delete", "invoicing")
            }
            destructive
            onClick={() => {
              setSelectedPurchaseInvoice(row);
              closePurchaseInvoiceModal.onOpen();
            }}
          >
            <MenuIcon icon={<LuTrash />} />
            <Trans>Delete</Trans>
          </MenuItem>
        </>
      );
    }, [closePurchaseInvoiceModal, navigate, permissions]);

    return (
      <>
        <Table<PurchaseInvoice>
          count={count}
          columns={columns}
          data={data}
          defaultColumnPinning={{
            left: ["invoiceId"]
          }}
          defaultColumnVisibility={{
            invoiceSupplierId: false,
            paymentTermName: false,
            locationName: false,
            dateIssued: false,
            datePaid: false,
            postingDate: false,
            createdAt: false,
            createdBy: false,
            updatedAt: false,
            updatedBy: false
          }}
          primaryAction={
            permissions.can("create", "invoicing") && (
              <New
                label={t`Purchase Invoice`}
                to={path.to.newPurchaseInvoice}
              />
            )
          }
          renderContextMenu={renderContextMenu}
          title={t`Purchase Invoices`}
          table="purchaseInvoice"
          withSavedView
        />

        {selectedPurchaseInvoice && selectedPurchaseInvoice.id && (
          <ConfirmDelete
            action={path.to.deletePurchaseInvoice(selectedPurchaseInvoice.id)}
            isOpen={closePurchaseInvoiceModal.isOpen}
            name={selectedPurchaseInvoice.invoiceId!}
            text={t`Are you sure you want to permanently delete ${selectedPurchaseInvoice.invoiceId!}?`}
            onCancel={() => {
              closePurchaseInvoiceModal.onClose();
              setSelectedPurchaseInvoice(null);
            }}
            onSubmit={() => {
              closePurchaseInvoiceModal.onClose();
              setSelectedPurchaseInvoice(null);
            }}
          />
        )}
      </>
    );
  }
);

PurchaseInvoicesTable.displayName = "PurchaseInvoicesTable";

export default PurchaseInvoicesTable;
