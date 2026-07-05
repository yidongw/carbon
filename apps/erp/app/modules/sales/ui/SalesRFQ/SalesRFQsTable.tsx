import { HStack, MenuIcon, MenuItem, useDisclosure } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo, useState } from "react";
import {
  LuBookMarked,
  LuCalendar,
  LuMap,
  LuPencil,
  LuQrCode,
  LuSquareUser,
  LuStar,
  LuTrash,
  LuUser
} from "react-icons/lu";
import { useNavigate } from "react-router";
import {
  Assignee,
  CustomerAvatar,
  EmployeeAvatar,
  Hyperlink,
  New,
  Table
} from "~/components";
import { Enumerable } from "~/components/Enumerable";
import { useLocations } from "~/components/Form/Location";
import { editableCell } from "~/components/InlineEditor";
import { ConfirmDelete } from "~/components/Modals";
import { useDateFormatter, usePermissions } from "~/hooks";
import { useCustomColumns } from "~/hooks/useCustomColumns";
import { useCustomers, usePeople } from "~/stores";
import { path } from "~/utils/path";
import { salesRFQStatusType } from "../../sales.models";
import type { SalesRFQ } from "../../types";
import { SalesRFQStatus } from ".";

// Sales RFQ inline edits go through the shared sales RFQ bulk-update action.
const SALES_RFQ_UPDATE = {
  action: path.to.bulkUpdateSalesRfq,
  idKey: "ids" as const
};

type SalesRFQsTableProps = {
  data: SalesRFQ[];
  count: number;
};

const SalesRFQsTable = memo(({ data, count }: SalesRFQsTableProps) => {
  const { t } = useLingui();
  const permissions = usePermissions();
  const navigate = useNavigate();
  const { formatDate } = useDateFormatter();

  const [selectedSalesRFQ, setSelectedSalesRFQ] = useState<SalesRFQ | null>(
    null
  );
  const deleteSalesRFQModal = useDisclosure();

  const [customers] = useCustomers();
  const [people] = usePeople();
  const locations = useLocations();

  const customColumns = useCustomColumns<SalesRFQ>("salesRFQ");
  const columns = useMemo<ColumnDef<SalesRFQ>[]>(() => {
    const defaultColumns: ColumnDef<SalesRFQ>[] = [
      {
        accessorKey: "rfqId",
        header: t`RFQ Number`,
        cell: ({ row }) => (
          <HStack>
            <Hyperlink to={path.to.salesRfqDetails(row.original.id!)}>
              {row.original.rfqId}
            </Hyperlink>
          </HStack>
        ),
        meta: {
          icon: <LuBookMarked />
        }
      },

      {
        id: "customerId",
        header: t`Customer`,
        cell: editableCell<SalesRFQ>({
          kind: "picker",
          field: "customerId",
          update: SALES_RFQ_UPDATE,
          value: (r) => r.customerId,
          options:
            customers?.map((c) => ({ value: c.id, label: c.name })) ?? [],
          renderInline: (v) => <CustomerAvatar customerId={v} />
        }),
        meta: {
          filter: {
            type: "static",
            options: customers?.map((customer) => ({
              value: customer.id,
              label: customer.name
            }))
          },
          icon: <LuSquareUser />
        }
      },
      {
        accessorKey: "status",
        header: t`Status`,
        cell: (item) => {
          const status = item.getValue<(typeof salesRFQStatusType)[number]>();
          return <SalesRFQStatus status={status} />;
        },
        meta: {
          filter: {
            type: "static",
            options: salesRFQStatusType.map((status) => ({
              value: status,
              label: <SalesRFQStatus status={status} />
            }))
          },
          pluralHeader: t`Statuses`,
          icon: <LuStar />
        }
      },
      {
        accessorKey: "customerReference",
        header: t`Customer RFQ`,
        cell: editableCell<SalesRFQ>({
          kind: "text",
          field: "customerReference",
          update: SALES_RFQ_UPDATE,
          value: (r) => r.customerReference
        }),
        meta: {
          icon: <LuQrCode />
        }
      },
      {
        accessorKey: "rfqDate",
        header: t`RFQ Date`,
        cell: editableCell<SalesRFQ>({
          kind: "date",
          field: "rfqDate",
          update: SALES_RFQ_UPDATE,
          value: (r) => r.rfqDate,
          renderInline: (v) => formatDate(v)
        }),
        meta: {
          icon: <LuCalendar />
        }
      },
      {
        accessorKey: "expirationDate",
        header: t`Due Date`,
        cell: editableCell<SalesRFQ>({
          kind: "date",
          field: "expirationDate",
          update: SALES_RFQ_UPDATE,
          value: (r) => r.expirationDate,
          renderInline: (v) => formatDate(v)
        }),
        meta: {
          icon: <LuCalendar />
        }
      },

      {
        id: "assignee",
        header: t`Assignee`,
        cell: ({ row }) => (
          <Assignee
            id={row.original.id ?? ""}
            table="salesRfq"
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
        accessorKey: "locationName",
        header: t`Location`,
        cell: editableCell<SalesRFQ>({
          kind: "picker",
          field: "locationId",
          update: SALES_RFQ_UPDATE,
          value: (r) => r.locationId,
          options: locations,
          fallbackLabel: (r) => r.locationName
        }),
        meta: {
          filter: {
            type: "fetcher",
            endpoint: path.to.api.locations,
            transform: (data: { id: string; name: string }[] | null) =>
              data?.map(({ name }) => ({
                value: name,
                label: <Enumerable value={name} />
              })) ?? []
          },
          icon: <LuMap />
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
  }, [customers, people, customColumns, t, formatDate]);

  const renderContextMenu = useMemo(() => {
    return (row: SalesRFQ) => (
      <>
        <MenuItem onClick={() => navigate(path.to.salesRfqDetails(row.id!))}>
          <MenuIcon icon={<LuPencil />} />
          <Trans>Edit</Trans>
        </MenuItem>
        <MenuItem
          destructive
          disabled={!permissions.can("delete", "sales")}
          onClick={() => {
            setSelectedSalesRFQ(row);
            deleteSalesRFQModal.onOpen();
          }}
        >
          <MenuIcon icon={<LuTrash />} />
          <Trans>Delete</Trans>
        </MenuItem>
      </>
    );
  }, [deleteSalesRFQModal, navigate, permissions]);

  return (
    <>
      <Table<SalesRFQ>
        count={count}
        columns={columns}
        data={data}
        defaultColumnPinning={{
          left: ["rfqId"]
        }}
        defaultColumnVisibility={{
          createdAt: false,
          updatedAt: false,
          updatedBy: false
        }}
        primaryAction={
          permissions.can("create", "sales") && (
            <New label={t`RFQ`} to={path.to.newSalesRFQ} />
          )
        }
        renderContextMenu={renderContextMenu}
        title={t`RFQs`}
        table="salesRfq"
        withSavedView
      />
      {selectedSalesRFQ && selectedSalesRFQ.id && (
        <ConfirmDelete
          action={path.to.deleteSalesRfq(selectedSalesRFQ.id)}
          isOpen={deleteSalesRFQModal.isOpen}
          name={selectedSalesRFQ.rfqId!}
          text={t`Are you sure you want to delete ${selectedSalesRFQ.rfqId!}? This cannot be undone.`}
          onCancel={() => {
            deleteSalesRFQModal.onClose();
            setSelectedSalesRFQ(null);
          }}
          onSubmit={() => {
            deleteSalesRFQModal.onClose();
            setSelectedSalesRFQ(null);
          }}
        />
      )}
    </>
  );
});

SalesRFQsTable.displayName = "SalesRFQsTable";

export default SalesRFQsTable;
