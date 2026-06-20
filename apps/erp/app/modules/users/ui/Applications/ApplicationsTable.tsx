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
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { LuCheck, LuUsers, LuX } from "react-icons/lu";
import { useFetcher, useRevalidator } from "react-router";
import { Table, Avatar } from "~/components";
import { Enumerable } from "~/components/Enumerable";
import { usePermissions, useUrlParams } from "~/hooks";
import { path } from "~/utils/path";
import { parseFilterParam } from "~/utils/query";

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
    avatarUrl: string | null;
    phone: string | null;
    wechat_unionid: string | null;
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

type ReviewFetcherData = {
  ok?: boolean;
  id?: string;
  action?: "approve" | "reject";
};

type ApplicationActionMenuProps = {
  row: MembershipApplicationRow;
  isReviewing: boolean;
  reviewAction: "approve" | "reject" | null;
  canUpdate: boolean;
  onApprove: () => void;
  onReject: () => void;
};

const ApplicationActionMenu = ({
  row,
  isReviewing,
  reviewAction,
  canUpdate,
  onApprove,
  onReject
}: ApplicationActionMenuProps) => {
  const { t } = useLingui();
  const [open, setOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "approve" | "reject" | null
  >(null);
  const wasReviewing = useRef(false);
  const showApproveLoading =
    pendingAction === "approve" ||
    (isReviewing && reviewAction === "approve");
  const showRejectLoading =
    pendingAction === "reject" ||
    (isReviewing && reviewAction === "reject");
  const showReviewLoading = showApproveLoading || showRejectLoading;

  useEffect(() => {
    if (isReviewing) {
      wasReviewing.current = true;
      setOpen(true);
      return;
    }

    if (wasReviewing.current) {
      wasReviewing.current = false;
      setPendingAction(null);
      setOpen(false);
    }
  }, [isReviewing]);

  if (row.status !== "pending") return null;

  return (
    <Menu type="dropdown">
      <DropdownMenu
        modal={false}
        open={open}
        onOpenChange={(next) => {
          if (showReviewLoading && !next) return;
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
          <MenuItem
            disabled={!canUpdate || showReviewLoading}
            onSelect={(event) => {
              event.preventDefault();
              if (!showReviewLoading && canUpdate) {
                setPendingAction("approve");
                setOpen(true);
                onApprove();
              }
            }}
          >
            <MenuIcon
              icon={
                showApproveLoading ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <LuCheck />
                )
              }
            />
            <Trans>Approve</Trans>
          </MenuItem>
          <MenuItem
            destructive
            disabled={!canUpdate || showReviewLoading}
            onSelect={(event) => {
              event.preventDefault();
              if (!showReviewLoading && canUpdate) {
                setPendingAction("reject");
                setOpen(true);
                onReject();
              }
            }}
          >
            <MenuIcon
              icon={
                showRejectLoading ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <LuX />
                )
              }
            />
            <Trans>Reject</Trans>
          </MenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Menu>
  );
};

const ApplicationsTable = memo(({ data, count }: ApplicationsTableProps) => {
  const { t } = useLingui();
  const permissions = usePermissions();
  const [params] = useUrlParams();
  const reviewFetcher = useFetcher<ReviewFetcherData>();
  const revalidator = useRevalidator();
  const reviewSubmitted = useRef(false);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewAction, setReviewAction] = useState<
    "approve" | "reject" | null
  >(null);
  const [tableKey, setTableKey] = useState(0);
  const [rows, setRows] = useState(data);

  const pendingFilterActive = useMemo(
    () =>
      params
        .getAll("filter")
        .some((filter) => {
          const parsed = parseFilterParam(filter);
          return parsed?.column === "status" && parsed.value === "pending";
        }),
    [params]
  );

  const visibleRows = useMemo(() => {
    if (!pendingFilterActive) {
      return rows;
    }

    return rows.filter((row) => row.status === "pending");
  }, [pendingFilterActive, rows]);

  useEffect(() => {
    setRows(data);
  }, [data]);

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

  const reviewApplication = useCallback(
    (row: MembershipApplicationRow, action: "approve" | "reject") => {
      reviewSubmitted.current = true;
      flushSync(() => {
        setReviewingId(row.id);
        setReviewAction(action);
      });
      reviewFetcher.submit(
        { id: row.id, action },
        {
          method: "post",
          action: path.to.reviewMembershipApplication
        }
      );
    },
    [reviewFetcher]
  );

  useEffect(() => {
    if (reviewFetcher.state !== "idle" || !reviewSubmitted.current) {
      return;
    }

    reviewSubmitted.current = false;

    setReviewingId(null);
    setReviewAction(null);
    setTableKey((current) => current + 1);

    if (reviewFetcher.data?.ok && reviewFetcher.data.id) {
      revalidator.revalidate();
    }
  }, [reviewFetcher.state, reviewFetcher.data, revalidator]);

  const columns = useMemo<ColumnDef<MembershipApplicationRow>[]>(() => {
    return [
      {
        id: "applicant",
        accessorFn: (row) => {
          const applicant = row.applicant;
          return [
            applicant?.fullName ??
              [applicant?.firstName, applicant?.lastName].filter(Boolean).join(" "),
            applicant?.email,
            applicant?.phone,
            applicant?.wechat_unionid,
            applicant?.avatarUrl
          ]
            .filter(Boolean)
            .join("|");
        },
        header: t`Applicant`,
        cell: ({ row }) => {
          const applicant = row.original.applicant;
          if (!applicant) return "—";

          const name = getApplicantName(row.original);

          return (
            <div className="flex items-center gap-3 min-w-0">
              <Avatar path={applicant.avatarUrl} name={name} size="sm" />
              <div className="min-w-0">
                <div className="font-medium truncate">{name}</div>
                {applicant.wechat_unionid && (
                  <div
                    className="text-xs text-muted-foreground truncate"
                    title={applicant.wechat_unionid}
                  >
                    {t`WeChat`} · {applicant.wechat_unionid.slice(-8)}
                  </div>
                )}
                {applicant.phone && (
                  <div className="text-xs text-muted-foreground tabular-nums">
                    {applicant.phone}
                  </div>
                )}
              </div>
            </div>
          );
        },
        meta: { icon: <LuUsers /> }
      },
      {
        id: "email",
        header: t`Email`,
        accessorFn: (row) =>
          row.applicant?.email ??
          (row.applicant?.wechat_unionid ? "wechat" : null),
        cell: ({ row }) => {
          if (row.original.applicant?.email) {
            return row.original.applicant.email;
          }
          if (row.original.applicant?.wechat_unionid) {
            return t`WeChat sign-in`;
          }
          return "—";
        }
      },
      {
        id: "role",
        header: t`Role`,
        cell: ({ row }) => (
          <Enumerable value={row.original.employeeType?.name ?? "—"} />
        )
      },
      {
        id: "inviter",
        header: t`Invited By`,
        cell: ({ row }) => row.original.inviteLink?.inviter?.fullName ?? "—"
      },
      {
        accessorKey: "status",
        header: t`Status`,
        cell: ({ row }) => (
          <Enumerable value={getApplicationStatus(row.original.status)} />
        ),
        meta: {
          filter: {
            type: "static" as const,
            options: [
              { value: "pending", label: t`Pending` },
              { value: "approved", label: t`Approved` },
              { value: "rejected", label: t`Rejected` }
            ],
            isArray: false
          }
        }
      },
      {
        accessorKey: "createdAt",
        header: t`Submitted`,
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleString()
      },
      {
        id: "actions",
        header: () => <span className="sr-only">{t`Actions`}</span>,
        cell: ({ row }) => {
          const currentRow =
            rows.find((item) => item.id === row.original.id) ?? row.original;
          const isReviewing = reviewingId === currentRow.id;

          return (
            <div
              className="flex justify-end"
              data-prevent-row-nav
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
            >
              <ApplicationActionMenu
                key={currentRow.id}
                row={currentRow}
                isReviewing={isReviewing}
                reviewAction={isReviewing ? reviewAction : null}
                canUpdate={permissions.can("update", "users")}
                onApprove={() => reviewApplication(currentRow, "approve")}
                onReject={() => reviewApplication(currentRow, "reject")}
              />
            </div>
          );
        },
        size: 60,
        meta: {
          cellClassName: "transition-none"
        }
      }
    ];
  }, [
    getApplicantName,
    getApplicationStatus,
    permissions,
    reviewAction,
    reviewApplication,
    reviewingId,
    rows,
    t
  ]);

  return (
    <Table<MembershipApplicationRow>
      key={tableKey}
      data={visibleRows}
      columns={columns}
      count={count}
      title={t`Applications`}
      withPagination
    />
  );
});

ApplicationsTable.displayName = "ApplicationsTable";

export default ApplicationsTable;
