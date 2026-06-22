export type ProductionQuantityPayStatus = "pending" | "approved" | "rejected";

export type ProductionQuantityPayScope =
  | { mode: "all" }
  | { mode: "single"; status: ProductionQuantityPayStatus }
  | { mode: "multiple"; statuses: ProductionQuantityPayStatus[] };

export type ProductionQuantityApprovalRequestStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Cancelled";

/** Row shape for the production quantities list (reports + approval + line summary). */
export type ProductionQuantityListRow = {
  approvalRequestId?: string;
  reportId: string;
  approvalStatus?: ProductionQuantityApprovalRequestStatus;
  amount: number | null;
  requestedBy: string | null;
  id: string;
  quantity: number;
  createdAt: string | null;
  employeeId: string | null;
  createdBy?: string | null;
  jobId?: string | null;
  itemId?: string | null;
  paymentYear: number | null;
  paymentMonth: number | null;
  invalidatedAt: string | null;
  configuration?: unknown;
  employee?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    fullName: string | null;
    avatarUrl: string | null;
  } | null;
  jobOperation?: unknown;
};

export type ProductionQuantityReportFilterOption = {
  id: string;
  label: string;
};
