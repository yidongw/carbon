import { MenuIcon, MenuItem } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo, useState } from "react";
import { LuCalendarClock, LuCopy, LuLink, LuShieldOff } from "react-icons/lu";
import { useFetcher } from "react-router";
import { New, Table } from "~/components";
import { Enumerable } from "~/components/Enumerable";
import { usePermissions, useUrlParams } from "~/hooks";
import { isInviteLinkExpired } from "~/modules/users/invite-links.service";
import { ERP_URL, path } from "~/utils/path";
import UpdateInviteLinkExpiryModal from "./UpdateInviteLinkExpiryModal";

export type InviteLinkRow = {
  id: string;
  code: string;
  label: string | null;
  createdAt: string;
  expiresAt: string | null;
  revokedAt: string | null;
  employeeType: { name: string } | null;
  inviter: { fullName: string | null } | null;
  location: { name: string } | null;
  membershipApplication: { count: number }[] | null;
};

type InviteLinksTableProps = {
  data: InviteLinkRow[];
  count: number;
};

const InviteLinksTable = memo(({ data, count }: InviteLinksTableProps) => {
  const { t } = useLingui();
  const [params] = useUrlParams();
  const permissions = usePermissions();
  const revokeFetcher = useFetcher();
  const [expiryModal, setExpiryModal] = useState<InviteLinkRow | null>(null);

  const getStatus = useCallback((row: InviteLinkRow) => {
    if (isInviteLinkExpired(row)) {
      return row.revokedAt ? t`Revoked` : t`Expired`;
    }
    return t`Active`;
  }, [t]);

  const columns = useMemo<ColumnDef<InviteLinkRow>[]>(() => {
    return [
      {
        accessorKey: "label",
        header: t`Label`,
        cell: ({ row }) => (
          <Enumerable
            value={row.original.label ?? row.original.code}
            className="font-medium"
          />
        ),
        meta: { icon: <LuLink /> }
      },
      {
        id: "role",
        header: t`Role`,
        cell: ({ row }) => row.original.employeeType?.name ?? "—"
      },
      {
        id: "inviter",
        header: t`Inviter`,
        cell: ({ row }) => row.original.inviter?.fullName ?? "—"
      },
      {
        id: "status",
        header: t`Status`,
        cell: ({ row }) => <Enumerable value={getStatus(row.original)} />
      },
      {
        id: "applications",
        header: t`Applications`,
        cell: ({ row }) => String(
          row.original.membershipApplication?.[0]?.count ?? 0
        )
      },
      {
        accessorKey: "expiresAt",
        header: t`Expires`,
        cell: ({ row }) => row.original.expiresAt
          ? new Date(row.original.expiresAt).toLocaleDateString()
          : "—"
      }
    ];
  }, [getStatus, t]);

  const copyLink = useCallback(async (code: string) => {
    await navigator.clipboard.writeText(`${ERP_URL}${path.to.joinLink(code)}`);
  }, []);

  const renderContextMenu = useCallback(
    (row: InviteLinkRow) => {
      const expired = isInviteLinkExpired(row);

      return (
        <>
          <MenuItem onClick={() => copyLink(row.code)}>
            <MenuIcon icon={<LuCopy />} />
            <Trans>Copy Link</Trans>
          </MenuItem>
          <MenuItem
            disabled={!permissions.can("update", "users")}
            onClick={() => setExpiryModal(row)}
          >
            <MenuIcon icon={<LuCalendarClock />} />
            <Trans>Set Expiration</Trans>
          </MenuItem>
          <MenuItem
            destructive
            disabled={expired || !permissions.can("update", "users")}
            onClick={() => {
              revokeFetcher.submit(
                { id: row.id },
                {
                  method: "post",
                  action: path.to.revokeInviteLink
                }
              );
            }}
          >
            <MenuIcon icon={<LuShieldOff />} />
            <Trans>Revoke Link</Trans>
          </MenuItem>
        </>
      );
    },
    [copyLink, permissions, revokeFetcher]
  );

  return (
    <>
      <Table<InviteLinkRow>
        data={data}
        columns={columns}
        count={count}
        primaryAction={
          permissions.can("create", "users") && (
            <New label={t`Invite Link`} to={`new?${params.toString()}`} />
          )
        }
        renderContextMenu={renderContextMenu}
        title={t`Invite Links`}
      />
      {expiryModal && (
        <UpdateInviteLinkExpiryModal
          id={expiryModal.id}
          expiresAt={expiryModal.expiresAt}
          isOpen
          onClose={() => setExpiryModal(null)}
        />
      )}
    </>
  );
});

InviteLinksTable.displayName = "InviteLinksTable";

export default InviteLinksTable;
