# Approvals Workflow (generic, multi-document)

Generic approval engine shared by purchase orders, quality documents, suppliers,
and production quantity reports. A per-document-type **handler registry** plugs
in the document-specific status changes; `approveRequest`/`rejectRequest` are
generic and should not need editing to add a new approvable type.

## Core (apps/erp/app/modules/shared/shared.service.ts)

- `approvalHandlers` (registry keyed by document type): `onApproveInTransaction`,
  `onRejectInTransaction`, `afterApprove`, `afterReject`, `validateOptions`. PO
  handler recomputes status via `getPurchaseOrderStatus`, updates PO **only where
  `status = 'Needs Approval'`** (optimistic guard).
- `approveRequest(db: Kysely, id, userId, notes?, options?)` /
  `rejectRequest(db: Kysely, ...)` — Kysely transaction; take a raw db from
  `getDatabaseClient()`, NOT a Supabase client.
- `canApproveRequest(client, {amount, documentType, companyId}, userId)` —
  **upward authority**: user may approve at the amount's matched tier or any
  higher tier (a $1k approver cannot approve $1M; a $1M approver can approve
  $1k). Matches by `defaultApproverId`, direct id in `approverGroupIds`, or group
  membership (rpc `groups_for_user`).
- `canApproveRequestInWindow(...)` — stricter: user must be on the **exact** tier
  matching the amount. Used for "assigned to me" style lists.
- `isApprovalRequired(client, documentType, companyId, amount?)` — is there an
  enabled matching `approvalRule`.
- `getApprovalsForUser` — returns **both** the user's own submitted requests AND
  pending requests they can approve (mixed). Do NOT use for a pure "awaiting my
  decision" list.

## "Awaiting my approval" inbox (added on branch discord/locate-purchase-order-…)

- **Service** (shared.service.ts): `getApprovalsAwaitingUser(client, userId,
  companyId, documentType?)` and `getApprovalCountAwaitingUser(...)`; private core
  `getPendingApprovalsAwaitingUser` — pending requests NOT submitted by the user,
  filtered through `canApproveRequest` (**upward authority**, matching the approve
  action's enforcement — unlike the dashboard's `getPendingApprovalsForApprover`
  which uses the window check). List variant enriches with `documentReadableId` /
  `documentDescription` from the `approvalRequests` view.
- **List page**: `routes/x+/purchasing+/approvals.tsx` → `/x/purchasing/approvals`
  (`path.to.purchasingApprovals`); loader uses `bypassRls: true`. UI:
  `modules/purchasing/ui/PurchaseOrder/PurchaseOrderApprovalsTable.tsx`
  (selectable rows + bulk Approve/Reject) + `BulkApprovalConfirmModal.tsx`.
- **Bulk action**: `routes/x+/purchase-order+/bulk-approve.tsx`
  (`path.to.bulkApprovePurchaseOrder`); re-verifies `canApproveRequest`
  server-side per request, processes independently, notifies requester
  (`NotificationEvent.ApprovalApproved/Rejected`). Response
  `{ decision, approved, failed[] }`.
- **Sidebar badge**: `usePurchasingSubmodules(pendingApprovalCount)` sets a
  `Count` on the Approvals item's `tag`; count comes from the purchasing
  `_layout.tsx` loader. `GroupedContentSidebar.tsx` renders `route.tag` (desktop +
  mobile) — before this it was defined on the `Route` type but never rendered.
- **Notification bell** (`components/Layout/Topbar/Notifications.tsx`): red dot →
  numeric unread count; approval-request notifications get a highlight prop on the
  `Notification` component; inbox footer has a "查看全部待审批" link to the page.

## Single-document approve UI (pre-existing)

PO detail: `PurchaseOrderHeader.tsx` Approve/Reject buttons (shown when
`isNeedsApproval && hasApprovalRequest && canApprove`) → `PurchaseOrderApprovalModal`
→ action in `routes/x+/purchase-order+/$orderId.tsx`. Same pattern for supplier
(`$supplierId.approval.tsx`) and quality document (`$id.tsx`).

## Data model

- Table `approvalRequest`: `documentType`, `documentId`, `status`
  (Pending/Approved/Rejected/Cancelled), `amount`, `requestedBy`, `decisionBy`,
  `decisionNotes`, `companyId`.
- Table `approvalRule`: `documentType`, `enabled`, `approverGroupIds[]`,
  `defaultApproverId`, `lowerBoundAmount` (tier floor). Configured in
  `settings/approval-rules`.
- View `approvalRequests`: joins request → PO/supplier/quality doc, exposes
  `documentReadableId` + `documentDescription`. Does **not** expose amount.
- PO "pending approval" status is `"Needs Approval"` (distinct from `"To Review"`).
