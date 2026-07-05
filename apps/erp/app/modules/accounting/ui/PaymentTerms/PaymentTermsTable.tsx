import { MenuIcon, MenuItem } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import {
  LuBookMarked,
  LuCalendar,
  LuClock,
  LuPencil,
  LuPercent,
  LuTrash
} from "react-icons/lu";
import { useNavigate } from "react-router";
import { Hyperlink, New, Table } from "~/components";
import { Enumerable } from "~/components/Enumerable";
import { editableCell } from "~/components/InlineEditor";
import { usePermissions, useUrlParams } from "~/hooks";
import { useCustomColumns } from "~/hooks/useCustomColumns";
import { path } from "~/utils/path";
import { paymentTermsCalculationMethod } from "../../accounting.models";
import type { PaymentTerm } from "../../types";

// Payment-term inline edits go through the shared bulk-update action.
const PAYMENT_TERM_UPDATE = {
  action: path.to.bulkUpdatePaymentTerm,
  idKey: "ids" as const
};

type PaymentTermsTableProps = {
  data: PaymentTerm[];
  count: number;
};

const PaymentTermsTable = memo(({ data, count }: PaymentTermsTableProps) => {
  const { t } = useLingui();
  const [params] = useUrlParams();
  const navigate = useNavigate();
  const permissions = usePermissions();
  const customColumns = useCustomColumns<PaymentTerm>("paymentTerm");

  const columns = useMemo<ColumnDef<PaymentTerm>[]>(() => {
    const defaultColumns: ColumnDef<PaymentTerm>[] = [
      {
        accessorKey: "name",
        header: t`Name`,
        cell: ({ row }) => (
          <Hyperlink to={`${row.original.id}?${params.toString()}`}>
            <Enumerable value={row.original.name} />
          </Hyperlink>
        ),
        meta: {
          icon: <LuBookMarked />
        }
      },
      {
        accessorKey: "daysDue",
        header: t`Days Due`,
        cell: editableCell<PaymentTerm>({
          kind: "text",
          field: "daysDue",
          update: PAYMENT_TERM_UPDATE,
          value: (r) => (r.daysDue != null ? String(r.daysDue) : "")
        }),
        meta: {
          icon: <LuCalendar />
        }
      },
      {
        accessorKey: "daysDiscount",
        header: t`Days Discount`,
        cell: editableCell<PaymentTerm>({
          kind: "text",
          field: "daysDiscount",
          update: PAYMENT_TERM_UPDATE,
          value: (r) => (r.daysDiscount != null ? String(r.daysDiscount) : "")
        }),
        meta: {
          icon: <LuCalendar />
        }
      },
      {
        accessorKey: "discountPercentage",
        header: t`Discount Percentage`,
        cell: editableCell<PaymentTerm>({
          kind: "text",
          field: "discountPercentage",
          update: PAYMENT_TERM_UPDATE,
          value: (r) =>
            r.discountPercentage != null ? String(r.discountPercentage) : ""
        }),
        meta: {
          icon: <LuPercent />
        }
      },
      {
        accessorKey: "calculationMethod",
        header: t`Calculation Method`,
        cell: editableCell<PaymentTerm>({
          kind: "enum",
          field: "calculationMethod",
          update: PAYMENT_TERM_UPDATE,
          value: (r) => r.calculationMethod,
          options: paymentTermsCalculationMethod.map((v) => ({
            value: v,
            label: <Enumerable value={v} />
          })),
          renderInline: (v) => <Enumerable value={v} />
        }),
        meta: {
          filter: {
            type: "static",
            options: paymentTermsCalculationMethod.map((v) => ({
              label: <Enumerable value={v} />,
              value: v
            }))
          },
          icon: <LuClock />
        }
      }
    ];
    return [...defaultColumns, ...customColumns];
  }, [params, customColumns, t]);

  const renderContextMenu = useCallback(
    (row: PaymentTerm) => {
      return (
        <>
          <MenuItem
            disabled={!permissions.can("update", "accounting")}
            onClick={() => {
              navigate(`${path.to.paymentTerm(row.id)}?${params.toString()}`);
            }}
          >
            <MenuIcon icon={<LuPencil />} />
            <Trans>Edit Payment Term</Trans>
          </MenuItem>
          <MenuItem
            disabled={!permissions.can("delete", "accounting")}
            onClick={() => {
              navigate(
                `${path.to.deletePaymentTerm(row.id)}?${params.toString()}`
              );
            }}
          >
            <MenuIcon icon={<LuTrash />} />
            <Trans>Delete Payment Term</Trans>
          </MenuItem>
        </>
      );
    },
    [navigate, params, permissions]
  );

  return (
    <Table<PaymentTerm>
      data={data}
      columns={columns}
      count={count}
      primaryAction={
        permissions.can("create", "accounting") && (
          <New label={t`Payment Term`} to={`new?${params.toString()}`} />
        )
      }
      renderContextMenu={renderContextMenu}
      title={t`Payment Terms`}
    />
  );
});

PaymentTermsTable.displayName = "PaymentTermsTable";
export default PaymentTermsTable;
