import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  IconButton,
  Menu,
  MenuIcon,
  MenuItem,
  Spinner
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { LuCalendarClock, LuCopy, LuLink, LuShieldOff } from "react-icons/lu";
import { useFetcher, useRevalidator } from "react-router";
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

type RevokeFetcherData = {
  ok?: boolean;
  id?: string;
  revokedAt?: string | null;
};

type InviteLinkActionMenuProps = {
  row: InviteLinkRow;
  isRevoking: boolean;
  canUpdate: boolean;
  onCopy: () => void;
  onSetExpiry: () => void;
  onRevoke: () => void;
};

const InviteLinkActionMenu = ({
  row,
  isRevoking,
  canUpdate,
  onCopy,
  onSetExpiry,
  onRevoke
}: InviteLinkActionMenuProps) => {
  const { t } = useLingui();
  const [open, setOpen] = useState(false);
  const [pendingRevoke, setPendingRevoke] = useState(false);
  const wasRevoking = useRef(false);
  const expired = isInviteLinkExpired(row);
  const showRevokeLoading = pendingRevoke || isRevoking;

  useEffect(() => {
    if (isRevoking) {
      wasRevoking.current = true;
      setOpen(true);
      return;
    }

    if (wasRevoking.current) {
      wasRevoking.current = false;
      setPendingRevoke(false);
      setOpen(false);
    }
  }, [isRevoking]);

  return (
    <Menu type="dropdown">
      <DropdownMenu
        modal={false}
        open={open}
        onOpenChange={(next) => {
          if (showRevokeLoading && !next) return;
          setOpen(next);
        }}
      >
        <DropdownMenuTrigger asChild>
          <IconButton
            aria-label={t`Action Menu`}
            variant="secondary"
            icon={<BsThreeDotsVertical />}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <MenuItem disabled={showRevokeLoading} onClick={onCopy}>
            <MenuIcon icon={<LuCopy />} />
            <Trans>Copy Link</Trans>
          </MenuItem>
          <MenuItem
            disabled={!canUpdate || showRevokeLoading}
            onClick={onSetExpiry}
          >
            <MenuIcon icon={<LuCalendarClock />} />
            <Trans>Set Expiration</Trans>
          </MenuItem>
          <MenuItem
            destructive
            disabled={expired || !canUpdate}
            onSelect={(event) => {
              event.preventDefault();
              if (!showRevokeLoading && !expired && canUpdate) {
                setPendingRevoke(true);
                setOpen(true);
                onRevoke();
              }
            }}
          >
            <MenuIcon
              icon={
                showRevokeLoading ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <LuShieldOff />
                )
              }
            />
            <Trans>Revoke Link</Trans>
          </MenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Menu>
  );
};

const InviteLinksTable = ({ data, count }: InviteLinksTableProps) => {
  const { t } = useLingui();
  const [params] = useUrlParams();
  const permissions = usePermissions();
  const revokeFetcher = useFetcher<RevokeFetcherData>();
  const revalidator = useRevalidator();
  const revokeSubmitted = useRef(false);
  const pendingRevokeId = useRef<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [expiryModal, setExpiryModal] = useState<InviteLinkRow | null>(null);
  const [rows, setRows] = useState(data);

  useEffect(() => {
    setRows((current) => {
      const localRevoked = new Map(
        current
          .filter((row) => row.revokedAt)
          .map((row) => [row.id, row.revokedAt] as const)
      );

      return data.map((row) => {
        if (row.revokedAt || !localRevoked.has(row.id)) {
          return row;
        }

        return { ...row, revokedAt: localRevoked.get(row.id)! };
      });
    });
  }, [data]);

  const revokeLink = useCallback(
    (row: InviteLinkRow) => {
      revokeSubmitted.current = true;
      pendingRevokeId.current = row.id;
      setRevokingId(row.id);
      revokeFetcher.submit(
        { id: row.id },
        {
          method: "post",
          action: path.to.revokeInviteLink
        }
      );
    },
    [revokeFetcher]
  );

  useEffect(() => {
    if (revokeFetcher.state !== "idle" || !revokeSubmitted.current) {
      return;
    }

    revokeSubmitted.current = false;

    if (revokeFetcher.data?.ok === false && pendingRevokeId.current) {
      const failedId = pendingRevokeId.current;
      setRows((current) =>
        current.map((item) =>
          item.id === failedId ? { ...item, revokedAt: null } : item
        )
      );
      pendingRevokeId.current = null;
      setRevokingId(null);
      revalidator.revalidate();
      return;
    }

    if (revokeFetcher.data?.ok && revokeFetcher.data.id) {
      const { id, revokedAt } = revokeFetcher.data;
      setRows((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, revokedAt: revokedAt ?? item.revokedAt }
            : item
        )
      );
    }

    pendingRevokeId.current = null;
    setRevokingId(null);
  }, [revokeFetcher.state, revokeFetcher.data, revalidator]);

  const getStatus = useCallback((row: InviteLinkRow) => {
    if (isInviteLinkExpired(row)) {
      return row.revokedAt ? t`Revoked` : t`Expired`;
    }
    return t`Active`;
  }, [t]);

  const copyLink = useCallback(async (code: string) => {
    await navigator.clipboard.writeText(`${ERP_URL}${path.to.joinLink(code)}`);
  }, []);

  const columns = useMemo<ColumnDef<InviteLinkRow>[]>(
    () => [
      {
        id: "label",
        accessorFn: (row) => row.label || row.code,
        header: t`Label`,
        cell: ({ getValue }) => (
          <span className="font-medium">{getValue<string>()}</span>
        ),
        meta: { icon: <LuLink /> }
      },
      {
        id: "role",
        accessorFn: (row) => row.employeeType?.name ?? "—",
        header: t`Role`,
        cell: ({ getValue }) => <Enumerable value={getValue<string>()} />
      },
      {
        id: "inviter",
        accessorFn: (row) => row.inviter?.fullName ?? "—",
        header: t`Inviter`,
        cell: ({ getValue }) => getValue<string>()
      },
      {
        id: "status",
        accessorFn: (row) => getStatus(row),
        header: t`Status`,
        cell: ({ getValue }) => <Enumerable value={getValue<string>()} />
      },
      {
        id: "applications",
        accessorFn: (row) => row.membershipApplication?.[0]?.count ?? 0,
        header: t`Applications`,
        cell: ({ getValue }) => String(getValue<number>())
      },
      {
        id: "expiresAt",
        accessorFn: (row) => row.expiresAt,
        header: t`Expires`,
        cell: ({ getValue }) => {
          const value = getValue<string | null>();
          return value ? new Date(value).toLocaleDateString() : "—";
        }
      },
      {
        id: "actions",
        accessorFn: (row) =>
          `${row.id}:${row.revokedAt ?? ""}:${row.expiresAt ?? ""}:${revokingId === row.id}`,
        header: () => <span className="sr-only">{t`Actions`}</span>,
        cell: ({ row }) => {
          const currentRow =
            rows.find((item) => item.id === row.original.id) ?? row.original;
          const isRevoking = revokingId === currentRow.id;

          return (
            <div
              className="flex justify-end"
              data-prevent-row-nav
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
            >
              <InviteLinkActionMenu
                key={`${currentRow.id}:${currentRow.revokedAt ?? "active"}`}
                row={currentRow}
                isRevoking={isRevoking}
                canUpdate={permissions.can("update", "users")}
                onCopy={() => copyLink(currentRow.code)}
                onSetExpiry={() => setExpiryModal(currentRow)}
                onRevoke={() => revokeLink(currentRow)}
              />
            </div>
          );
        },
        size: 60,
        meta: {
          cellClassName: "transition-none"
        }
      }
    ],
    [copyLink, getStatus, permissions, revokeLink, revokingId, rows, t]
  );

  return (
    <>
      <Table<InviteLinkRow>
        data={rows}
        columns={columns}
        count={count}
        primaryAction={
          permissions.can("create", "users") && (
            <New label={t`Invite Link`} to={`new?${params.toString()}`} />
          )
        }
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
};

InviteLinksTable.displayName = "InviteLinksTable";

export default InviteLinksTable;
