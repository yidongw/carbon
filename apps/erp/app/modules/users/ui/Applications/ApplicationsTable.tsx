import { MenuIcon, MenuItem } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { LuCheck, LuUsers, LuX } from "react-icons/lu";
import { useFetcher } from "react-router";
import { Table } from "~/components";
import { Enumerable } from "~/components/Enumerable";
import { usePermissions } from "~/hooks";
import { path } from "~/utils/path";

export type MembershipApplicationRow = {
  id: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  applicant: {
    id: string;
    email: string | null;
    fullName: string | null;
    firstName: string | null;
    lastName: string | null;
  } | null;
  employeeType: { name: string } | null;
  location: { name: string } | null;
  inviteLink: {
    label: string | null;
    inviter: { fullName: string | null } | null;
  } | null;
};

type ApplicationsTableProps = {
  data: MembershipApplicationRow[];
  count: number;
};

const ApplicationsTable = memo(({ data, count }: ApplicationsTableProps) => {
  const { t } = useLingui();
  const permissions = usePermissions();
  const fetcher = useFetcher();

  const getApplicationStatus = useCallback(
    (status: MembershipApplicationRow["status"]) => {
      switch (status) {
        case "pending":
          return t`Pending`;
        case "approved":
          return t`Approved`;
        case "rejected":
          return t`Rejected`;
        default:
          return status;
      }
    },
    [t]
  );

  const getApplicantName = useCallback((row: MembershipApplicationRow) => {
    return (
      row.applicant?.fullName ??
      [row.applicant?.firstName, row.applicant?.lastName]
        .filter(Boolean)
        .join(" ") ??
      row.applicant?.email ??
      "—"
    );
  }, []);

  const columns = useMemo<ColumnDef<MembershipApplicationRow>[]>(() => {
    return [
      {
        id: "applicant",
        header: t`Applicant`,
        cell: ({ row }) => (
          <span className="font-medium">{getApplicantName(row.original)}</span>
        ),
        meta: { icon: <LuUsers /> }
      },
      {
        id: "email",
        header: t`Email`,
        cell: ({ row }) => row.original.applicant?.email ?? "—"
      },
      {
        id: "role",
        header: t`Role`,
        cell: ({ row }) => row.original.employeeType?.name ?? "—"
      },
      {
        id: "inviter",
        header: t`Invited By`,
        cell: ({ row }) => row.original.inviteLink?.inviter?.fullName ?? "—"
      },
      {
        id: "status",
        header: t`Status`,
        cell: ({ row }) => (
          <Enumerable value={getApplicationStatus(row.original.status)} />
        )
      },
      {
        accessorKey: "createdAt",
        header: t`Submitted`,
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleString()
      }
    ];
  }, [getApplicantName, getApplicationStatus, t]);

  const renderContextMenu = useCallback(
    (row: MembershipApplicationRow) => {
      if (row.status !== "pending") return null;

      return (
        <>
          <MenuItem
            disabled={!permissions.can("update", "users")}
            onClick={() => {
              fetcher.submit(
                { id: row.id, action: "approve" },
                {
                  method: "post",
                  action: path.to.reviewMembershipApplication
                }
              );
            }}
          >
            <MenuIcon icon={<LuCheck />} />
            <Trans>Approve</Trans>
          </MenuItem>
          <MenuItem
            destructive
            disabled={!permissions.can("update", "users")}
            onClick={() => {
              fetcher.submit(
                { id: row.id, action: "reject" },
                {
                  method: "post",
                  action: path.to.reviewMembershipApplication
                }
              );
            }}
          >
            <MenuIcon icon={<LuX />} />
            <Trans>Reject</Trans>
          </MenuItem>
        </>
      );
    },
    [fetcher, permissions]
  );

  return (
    <Table<MembershipApplicationRow>
      data={data}
      columns={columns}
      count={count}
      renderContextMenu={renderContextMenu}
      title={t`Applications`}
    />
  );
});

ApplicationsTable.displayName = "ApplicationsTable";

export default ApplicationsTable;
