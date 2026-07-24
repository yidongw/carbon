import {
  Badge,
  Button,
  MenuIcon,
  MenuItem,
  useDisclosure
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo, useState } from "react";
import {
  LuBookMarked,
  LuCalendar,
  LuEuro,
  LuGlobe,
  LuHash,
  LuPencil,
  LuPhone,
  LuPrinter,
  LuShapes,
  LuStar,
  LuTag,
  LuTrash,
  LuUser
} from "react-icons/lu";
import { Link, useNavigate } from "react-router";
import {
  CustomerAvatar,
  EmployeeAvatar,
  Hyperlink,
  New,
  Table
} from "~/components";
import { Enumerable } from "~/components/Enumerable";
import { useCustomerTypes } from "~/components/Form/CustomerType";
import { editableCell, TagsCell } from "~/components/InlineEditor";
import { ConfirmDelete } from "~/components/Modals";
import { useCompanySettings, useDateFormatter, usePermissions } from "~/hooks";
import { useCustomColumns } from "~/hooks/useCustomColumns";
import { usePeople } from "~/stores";
import { path } from "~/utils/path";
import { translateIfKnown } from "~/utils/translateIfKnown";
import type { Customer, CustomerStatus } from "../../types";

// Customer inline edits go through the shared customer bulk-update action.
const CUSTOMER_UPDATE = {
  action: path.to.bulkUpdateCustomer,
  idKey: "ids" as const
};

type CustomersTableProps = {
  data: Customer[];
  count: number;
  customerStatuses: CustomerStatus[];
  tags: { name: string }[];
};

const CustomersTable = memo(
  ({ data, count, customerStatuses, tags }: CustomersTableProps) => {
    const { t, i18n } = useLingui();
    const navigate = useNavigate();
    const permissions = usePermissions();
    const { formatDate } = useDateFormatter();
    const [people] = usePeople();
    const deleteModal = useDisclosure();
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
      null
    );

    const translateStatus = useCallback(
      (value: string) => translateIfKnown(i18n, value),
      [i18n]
    );

    const customerTypes = useCustomerTypes();
    const companySettings = useCompanySettings();
    const showCustomerReadableId =
      companySettings?.showCustomerReadableId ?? false;

    const customColumns = useCustomColumns<Customer>("customer");
    const columns = useMemo<ColumnDef<Customer>[]>(() => {
      const idColumn: ColumnDef<Customer> = {
        accessorKey: "readableId",
        header: t`ID`,
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.readableId ?? ""}
          </span>
        ),
        meta: {
          icon: <LuHash />
        }
      };
      const defaultColumns: ColumnDef<Customer>[] = [
        ...(showCustomerReadableId ? [idColumn] : []),
        {
          accessorKey: "name",
          header: t`Name`,
          cell: ({ row }) => (
            <div className="max-w-[320px] truncate">
              <Hyperlink to={path.to.customerDetails(row.original.id!)}>
                <CustomerAvatar customerId={row.original.id!} />
              </Hyperlink>
            </div>
          ),
          meta: {
            icon: <LuBookMarked />
          }
        },
        {
          accessorKey: "status",
          header: t`Status`,
          cell: editableCell<Customer>({
            kind: "picker",
            field: "customerStatusId",
            update: CUSTOMER_UPDATE,
            value: (r) => r.customerStatusId,
            clearable: true,
            options: customerStatuses.map((status) => ({
              value: status.id,
              label: <Enumerable value={translateStatus(status.name ?? "")} />
            })),
            renderInline: (v, _opts, r) => (
              <Enumerable
                value={translateStatus(
                  customerStatuses.find((s) => s.id === v)?.name ??
                    r.status ??
                    ""
                )}
              />
            )
          }),
          meta: {
            filter: {
              type: "static",
              options: customerStatuses?.map((status) => ({
                value: status.name,
                label: <Enumerable value={translateStatus(status.name ?? "")} />
              }))
            },
            pluralHeader: t`Statuses`,
            icon: <LuStar />
          }
        },
        {
          accessorKey: "customerTypeId",
          header: t`Type`,
          cell: editableCell<Customer>({
            kind: "picker",
            field: "customerTypeId",
            update: CUSTOMER_UPDATE,
            value: (r) => r.customerTypeId,
            clearable: true,
            options: customerTypes ?? [],
            renderInline: (v) => (
              <>{customerTypes?.find((ct) => ct.value === v)?.label}</>
            )
          }),
          meta: {
            icon: <LuShapes />,
            filter: {
              type: "static",
              options: customerTypes?.map((type) => ({
                value: type.value,
                label: <Enumerable value={type.label} />
              }))
            }
          }
        },
        {
          id: "accountManagerId",
          header: t`Account Manager`,
          cell: editableCell<Customer>({
            kind: "picker",
            field: "accountManagerId",
            update: CUSTOMER_UPDATE,
            value: (r) => r.accountManagerId,
            clearable: true,
            options: people.map((employee) => ({
              value: employee.id,
              label: employee.name
            })),
            renderInline: (v) => <EmployeeAvatar employeeId={v} />
          }),
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
          accessorKey: "tags",
          header: t`Tags`,
          cell: ({ row }) => (
            <TagsCell
              row={row.original}
              table="customer"
              availableTags={tags}
            />
          ),
          meta: {
            filter: {
              type: "static",
              options: tags?.map((tag) => ({
                value: tag.name,
                label: <Badge variant="secondary">{tag.name}</Badge>
              })),
              isArray: true
            },
            icon: <LuTag />
          }
        },
        {
          accessorKey: "currencyCode",
          header: t`Currency`,
          cell: (item) => item.getValue(),
          meta: {
            icon: <LuEuro />
          }
        },
        {
          accessorKey: "phone",
          header: t`Phone`,
          cell: editableCell<Customer>({
            kind: "text",
            field: "phone",
            update: CUSTOMER_UPDATE,
            value: (r) => r.phone
          }),
          meta: {
            icon: <LuPhone />
          }
        },
        {
          accessorKey: "fax",
          header: t`Fax`,
          cell: editableCell<Customer>({
            kind: "text",
            field: "fax",
            update: CUSTOMER_UPDATE,
            value: (r) => r.fax
          }),
          meta: {
            icon: <LuPrinter />
          }
        },
        {
          accessorKey: "website",
          header: t`Website`,
          cell: editableCell<Customer>({
            kind: "text",
            field: "website",
            update: CUSTOMER_UPDATE,
            value: (r) => r.website
          }),
          meta: {
            icon: <LuGlobe />
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
    }, [
      customerStatuses,
      customerTypes,
      people,
      customColumns,
      tags,
      t,
      translateStatus,
      formatDate,
      showCustomerReadableId
    ]);

    const renderContextMenu = useMemo(
      () => (row: Customer) => (
        <>
          <MenuItem onClick={() => navigate(path.to.customer(row.id!))}>
            <MenuIcon icon={<LuPencil />} />
            <Trans>Edit</Trans>
          </MenuItem>
          <MenuItem
            destructive
            disabled={!permissions.can("delete", "sales")}
            onClick={() => {
              setSelectedCustomer(row);
              deleteModal.onOpen();
            }}
          >
            <MenuIcon icon={<LuTrash />} />
            <Trans>Delete Customer</Trans>
          </MenuItem>
        </>
      ),
      [navigate, deleteModal, permissions]
    );

    return (
      <>
        <Table<Customer>
          count={count}
          columns={columns}
          data={data}
          defaultColumnPinning={{
            left: ["name"]
          }}
          defaultColumnVisibility={{
            currencyCode: false,
            phone: false,
            fax: false,
            website: false,
            createdBy: false,
            createdAt: false,
            updatedBy: false,
            updatedAt: false
          }}
          importCSV={[
            {
              table: "customer",
              label: t`Customers`
            },
            {
              table: "customerContact",
              label: t`Contacts`
            }
          ]}
          primaryAction={
            permissions.can("create", "sales") && (
              <div className="flex items-center gap-2">
                <Button
                  className="hidden md:inline-flex"
                  variant="secondary"
                  leftIcon={<LuShapes />}
                  asChild
                >
                  <Link to={path.to.customerTypes}>
                    <Trans>Customer Types</Trans>
                  </Link>
                </Button>
                <New label={t`Customer`} to={path.to.newCustomer} />
              </div>
            )
          }
          renderContextMenu={renderContextMenu}
          table="customer"
          title={t`Customers`}
          withSavedView
        />
        {selectedCustomer && selectedCustomer.id && (
          <ConfirmDelete
            action={path.to.deleteCustomer(selectedCustomer.id)}
            isOpen={deleteModal.isOpen}
            name={selectedCustomer.name!}
            text={t`Are you sure you want to delete ${selectedCustomer.name!}? This cannot be undone.`}
            onCancel={() => {
              deleteModal.onClose();
              setSelectedCustomer(null);
            }}
            onSubmit={() => {
              deleteModal.onClose();
              setSelectedCustomer(null);
            }}
          />
        )}
      </>
    );
  }
);

CustomersTable.displayName = "CustomerTable";

export default CustomersTable;
