import { MenuIcon, MenuItem } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import {
  LuBanknote,
  LuCalendar,
  LuCoins,
  LuHash,
  LuPencil,
  LuTrash,
  LuTruck
} from "react-icons/lu";
import { useNavigate } from "react-router";
import { Hyperlink, New, SupplierAvatar, Table } from "~/components";
import { useCurrencyFormatter, usePermissions, useUrlParams } from "~/hooks";
import { path } from "~/utils/path";
import type { PurchasePayment } from "../../types";

type SupplierPaymentsTableProps = {
  data: PurchasePayment[];
  count: number;
};

const SupplierPaymentsTable = memo(
  ({ data, count }: SupplierPaymentsTableProps) => {
    const { t } = useLingui();
    const [params] = useUrlParams();
    const navigate = useNavigate();
    const permissions = usePermissions();
    const currencyFormatter = useCurrencyFormatter({
      minimumFractionDigits: 2
    });

    const columns = useMemo<ColumnDef<PurchasePayment>[]>(() => {
      return [
        {
          accessorKey: "paymentId",
          header: t`Payment Reference`,
          cell: ({ row }) => (
            <Hyperlink to={`${row.original.id}?${params.toString()}`}>
              {row.original.paymentId}
            </Hyperlink>
          ),
          meta: {
            icon: <LuHash />
          }
        },
        {
          accessorKey: "supplierId",
          header: t`Supplier`,
          cell: ({ row }) => (
            <SupplierAvatar supplierId={row.original.supplierId} />
          ),
          meta: {
            icon: <LuTruck />
          }
        },
        {
          accessorKey: "paymentDate",
          header: t`Payment Date`,
          cell: ({ row }) => (
            <span className="text-sm whitespace-nowrap">
              {row.original.paymentDate ?? "—"}
            </span>
          ),
          meta: {
            icon: <LuCalendar />
          }
        },
        {
          accessorKey: "totalAmount",
          header: t`Amount`,
          cell: ({ row }) => (
            <span className="tabular-nums font-semibold">
              {currencyFormatter.format(row.original.totalAmount ?? 0)}
            </span>
          ),
          meta: {
            icon: <LuBanknote />,
            renderTotal: true,
            formatter: (val) => currencyFormatter.format(val)
          }
        },
        {
          accessorKey: "currencyCode",
          header: t`Currency`,
          cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
              {row.original.currencyCode}
            </span>
          ),
          meta: {
            icon: <LuCoins />
          }
        }
      ];
    }, [currencyFormatter, params, t]);

    const renderContextMenu = useCallback(
      (row: PurchasePayment) => {
        return (
          <>
            <MenuItem
              disabled={!permissions.can("update", "invoicing")}
              onClick={() => {
                navigate(
                  `${path.to.purchasePayment(row.id)}?${params.toString()}`
                );
              }}
            >
              <MenuIcon icon={<LuPencil />} />
              <Trans>Edit Payment</Trans>
            </MenuItem>
            <MenuItem
              disabled={!permissions.can("delete", "invoicing")}
              onClick={() => {
                navigate(
                  `${path.to.deletePurchasePayment(row.id)}?${params.toString()}`
                );
              }}
            >
              <MenuIcon icon={<LuTrash />} />
              <Trans>Delete Payment</Trans>
            </MenuItem>
          </>
        );
      },
      [navigate, params, permissions]
    );

    return (
      <Table<PurchasePayment>
        data={data}
        columns={columns}
        count={count}
        primaryAction={
          permissions.can("create", "invoicing") && (
            <New label={t`Payment`} to={`new?${params.toString()}`} />
          )
        }
        renderContextMenu={renderContextMenu}
        title={t`Supplier Payments`}
        withSearch
      />
    );
  }
);

SupplierPaymentsTable.displayName = "SupplierPaymentsTable";
export default SupplierPaymentsTable;
