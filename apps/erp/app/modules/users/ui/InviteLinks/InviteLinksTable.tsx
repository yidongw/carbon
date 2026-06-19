import { MenuIcon, MenuItem } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
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

const InviteLinksTable = memo(({ data, count }: InviteLinksTableProps) => {
  const { t } = useLingui();
  const [params] = useUrlParams();
  const permissions = usePermissions();
  const revokeFetcher = useFetcher();
  const revalidator = useRevalidator();
  const [expiryModal, setExpiryModal] = useState<InviteLinkRow | null>(null);
  // Track locally-revoked IDs that haven't yet been confirmed by the server
  const [locallyRevoked, setLocallyRevoked] = useState<Set<string>>(new Set());
  const prevFetcherStateRef = useRef(revokeFetcher.state);
  // Capture pending id so we can still reference it after fetcher returns to idle
  const lastSubmittedIdRef = useRef<string | null>(null);

  // ID currently being submitted to the server
  const pendingRevokeId = revokeFetcher.formData?.get("id") as string | null;

  // Keep latest submitted ID so the post-completion effect knows which row was revoked
  if (pendingRevokeId && pendingRevokeId !== lastSubmittedIdRef.current) {
    lastSubmittedIdRef.current = pendingRevokeId;
  }

  // After fetcher completes successfully, mark as locally revoked and revalidate
  useEffect(() => {
    const wasSubmitting = prevFetcherStateRef.current !== "idle";
    const nowIdle = revokeFetcher.state === "idle";

    if (wasSubmitting && nowIdle && revokeFetcher.data !== undefined) {
      const submittedId = lastSubmittedIdRef.current;
      if (submittedId) {
        setLocallyRevoked((prev) => new Set([...prev, submittedId]));
      }
      // Force loader to re-run so we get fresh server data
      revalidator.revalidate();
    }
    prevFetcherStateRef.current = revokeFetcher.state;
  }, [revokeFetcher.state, revokeFetcher.data, revalidator]);

  // Clean up locallyRevoked entries once server data confirms them
  useEffect(() => {
    if (locallyRevoked.size === 0) return;
    const confirmedIds = new Set(
      data.filter((row) => row.revokedAt != null).map((row) => row.id)
    );
    const stillPending = new Set(
      [...locallyRevoked].filter((id) => !confirmedIds.has(id))
    );
    if (stillPending.size !== locallyRevoked.size) {
      setLocallyRevoked(stillPending);
    }
  }, [data, locallyRevoked]);

  // Merge server data with optimistic + locally-confirmed revoked state
  const displayData = useMemo(() => {
    if (!pendingRevokeId && locallyRevoked.size === 0) return data;
    const nowIso = new Date().toISOString();
    return data.map((row) => {
      const isOptimisticallyRevoking = row.id === pendingRevokeId;
      const isLocallyRevoked = locallyRevoked.has(row.id);
      if ((isOptimisticallyRevoking || isLocallyRevoked) && !row.revokedAt) {
        return { ...row, revokedAt: nowIso };
      }
      return row;
    });
  }, [data, pendingRevokeId, locallyRevoked]);

  const getStatus = useCallback(
    (row: InviteLinkRow) => {
      if (isInviteLinkExpired(row)) {
        return row.revokedAt ? t`Revoked` : t`Expired`;
      }
      return t`Active`;
    },
    [t]
  );

  const columns = useMemo<ColumnDef<InviteLinkRow>[]>(() => {
    return [
      {
        accessorKey: "label",
        header: t`Label`,
        cell: ({ row }) => (
          <span className="font-medium">
            {row.original.label ?? row.original.code}
          </span>
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
        cell: ({ row }) => {
          const isPending =
            pendingRevokeId === row.original.id &&
            revokeFetcher.state !== "idle";
          return (
            <div className="flex items-center gap-2">
              <Enumerable value={getStatus(row.original)} />
              {isPending && (
                <span className="text-xs text-muted-foreground">
                  <Trans>Revoking...</Trans>
                </span>
              )}
            </div>
          );
        }
      },
      {
        id: "applications",
        header: t`Applications`,
        cell: ({ row }) =>
          String(row.original.membershipApplication?.[0]?.count ?? 0)
      },
      {
        accessorKey: "expiresAt",
        header: t`Expires`,
        cell: ({ row }) =>
          row.original.expiresAt
            ? new Date(row.original.expiresAt).toLocaleDateString()
            : "—"
      }
    ];
  }, [getStatus, pendingRevokeId, revokeFetcher.state, t]);

  const copyLink = useCallback(async (code: string) => {
    await navigator.clipboard.writeText(`${ERP_URL}${path.to.joinLink(code)}`);
  }, []);

  const renderContextMenu = useCallback(
    (row: InviteLinkRow) => {
      const expired = isInviteLinkExpired(row);
      const isPending =
        pendingRevokeId === row.id && revokeFetcher.state !== "idle";

      return (
        <>
          <MenuItem onClick={() => copyLink(row.code)}>
            <MenuIcon icon={<LuCopy />} />
            <Trans>Copy Link</Trans>
          </MenuItem>
          <MenuItem
            disabled={expired || !permissions.can("update", "users")}
            onClick={() => setExpiryModal(row)}
          >
            <MenuIcon icon={<LuCalendarClock />} />
            <Trans>Set Expiration</Trans>
          </MenuItem>
          <MenuItem
            destructive
            disabled={
              expired || isPending || !permissions.can("update", "users")
            }
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
            {isPending ? <Trans>Revoking...</Trans> : <Trans>Revoke Link</Trans>}
          </MenuItem>
        </>
      );
    },
    [copyLink, pendingRevokeId, permissions, revokeFetcher]
  );

  return (
    <>
      <Table<InviteLinkRow>
        data={displayData}
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
