import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  MenuIcon,
  useDisclosure
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo, useState } from "react";
import {
  LuBadgeCheck,
  LuBookMarked,
  LuCalendar,
  LuCircleX,
  LuContainer,
  LuDollarSign,
  LuUser
} from "react-icons/lu";
import { EmployeeAvatar, Hyperlink, Table } from "~/components";
import {
  useCurrencyFormatter,
  useDateFormatter,
  usePermissions
} from "~/hooks";
import type { ApprovalDecision } from "~/modules/shared/types";
import { path } from "~/utils/path";
import BulkApprovalConfirmModal from "./BulkApprovalConfirmModal";

export type ApprovalAwaitingUser = {
  id: string;
  documentType: string;
  documentId: string;
  amount: number | null;
  requestedBy: string;
  requestedAt: string;
  documentReadableId: string | null;
  documentDescription: string | null;
};

type PurchaseOrderApprovalsTableProps = {
  data: ApprovalAwaitingUser[];
  count: number;
};

const PurchaseOrderApprovalsTable = memo(
  ({ data, count }: PurchaseOrderApprovalsTableProps) => {
    const { t } = useLingui();
    const permissions = usePermissions();
    const currencyFormatter = useCurrencyFormatter();
    const { formatDate } = useDateFormatter();

    const bulkApprovalModal = useDisclosure();
    const [bulkIds, setBulkIds] = useState<string[]>([]);
    const [decision, setDecision] = useState<ApprovalDecision>("Approved");

    const columns = useMemo<ColumnDef<ApprovalAwaitingUser>[]>(
      () => [
        {
          accessorKey: "documentReadableId",
          header: t`PO Number`,
          cell: ({ row }) => (
            <Hyperlink to={path.to.purchaseOrder(row.original.documentId)}>
              {row.original.documentReadableId ?? row.original.documentId}
            </Hyperlink>
          ),
          meta: { icon: <LuBookMarked /> }
        },
        {
          accessorKey: "documentDescription",
          header: t`Supplier`,
          cell: ({ row }) => row.original.documentDescription ?? "—",
          meta: { icon: <LuContainer /> }
        },
        {
          accessorKey: "amount",
          header: t`Amount`,
          cell: ({ row }) =>
            row.original.amount != null
              ? currencyFormatter.format(row.original.amount)
              : "—",
          meta: { icon: <LuDollarSign /> }
        },
        {
          id: "requestedBy",
          header: t`Requested By`,
          cell: ({ row }) => (
            <EmployeeAvatar employeeId={row.original.requestedBy} />
          ),
          meta: { icon: <LuUser /> }
        },
        {
          accessorKey: "requestedAt",
          header: t`Requested At`,
          cell: ({ row }) => formatDate(row.original.requestedAt),
          meta: { icon: <LuCalendar /> }
        }
      ],
      [t, currencyFormatter, formatDate]
    );

    const openBulk = useCallback(
      (
        selectedRows: ApprovalAwaitingUser[],
        nextDecision: ApprovalDecision
      ) => {
        setBulkIds(selectedRows.map((row) => row.id).filter(Boolean));
        setDecision(nextDecision);
        bulkApprovalModal.onOpen();
      },
      [bulkApprovalModal]
    );

    const renderActions = useCallback(
      (selectedRows: ApprovalAwaitingUser[]) => {
        const canDecide = permissions.can("update", "purchasing");
        return (
          <DropdownMenuContent align="end" className="min-w-[220px]">
            <DropdownMenuLabel>
              <Trans>Decision</Trans>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                disabled={!canDecide}
                onClick={() => openBulk(selectedRows, "Approved")}
              >
                <MenuIcon icon={<LuBadgeCheck />} />
                <Trans>Approve</Trans>
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!canDecide}
                destructive
                onClick={() => openBulk(selectedRows, "Rejected")}
              >
                <MenuIcon icon={<LuCircleX />} />
                <Trans>Reject</Trans>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        );
      },
      [openBulk, permissions]
    );

    return (
      <>
        <Table<ApprovalAwaitingUser>
          count={count}
          columns={columns}
          data={data}
          getRowId={(row) => row.id}
          title={t`Approvals`}
          renderActions={renderActions}
          withSelectableRows
        />

        {bulkApprovalModal.isOpen && (
          <BulkApprovalConfirmModal
            ids={bulkIds}
            decision={decision}
            isOpen={bulkApprovalModal.isOpen}
            onClose={() => {
              bulkApprovalModal.onClose();
              setBulkIds([]);
            }}
          />
        )}
      </>
    );
  }
);
PurchaseOrderApprovalsTable.displayName = "PurchaseOrderApprovalsTable";

export default PurchaseOrderApprovalsTable;
