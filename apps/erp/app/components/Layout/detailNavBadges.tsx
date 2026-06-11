import { LuCircleAlert, LuGitBranch, LuLock, LuTruck } from "react-icons/lu";
import type { DetailNavBadge } from "./DetailNav";

type StatusColor = "gray" | "yellow" | "blue" | "orange" | "green" | "red";

const STATUS_DOT_COLOR: Record<StatusColor, string> = {
  gray: "bg-muted-foreground",
  yellow: "bg-yellow-500",
  blue: "bg-blue-500",
  orange: "bg-orange-500",
  green: "bg-green-500",
  red: "bg-red-500"
};

export function statusBadge(
  key: string,
  label: string,
  color: StatusColor
): DetailNavBadge {
  return {
    key,
    label,
    icon: <span className={`size-2 rounded-full ${STATUS_DOT_COLOR[color]}`} />
  };
}

export function outsideProcessingBadge(label: string): DetailNavBadge {
  return {
    key: "outside-processing",
    label,
    icon: <LuTruck className="size-3.5" />
  };
}

export function unapprovedSupplierBadge(label: string): DetailNavBadge {
  return {
    key: "unapproved-supplier",
    label,
    icon: <LuCircleAlert className="size-3.5 text-red-500" />
  };
}

export function quoteStatusBadge(status: string): DetailNavBadge | null {
  switch (status) {
    case "Draft":
      return statusBadge("status", status, "gray");
    case "Sent":
      return statusBadge("status", status, "blue");
    case "Ordered":
    case "Partial":
      return statusBadge("status", status, "green");
    case "Cancelled":
    case "Expired":
      return statusBadge("status", status, "red");
    case "Lost":
      return statusBadge("status", status, "orange");
    default:
      return null;
  }
}

export function salesRfqStatusBadge(status: string): DetailNavBadge | null {
  switch (status) {
    case "Draft":
      return statusBadge("status", status, "gray");
    case "Ready for Quote":
      return statusBadge("status", status, "green");
    case "Quoted":
      return statusBadge("status", status, "blue");
    case "Closed":
      return statusBadge("status", status, "red");
    default:
      return null;
  }
}

export function salesOrderStatusBadge(
  status: string,
  label = status
): DetailNavBadge | null {
  switch (status) {
    case "Draft":
      return statusBadge("status", label, "gray");
    case "Cancelled":
    case "Closed":
      return statusBadge("status", label, "red");
    case "To Ship and Invoice":
    case "To Ship":
      return statusBadge("status", label, "orange");
    case "To Invoice":
    case "Confirmed":
      return statusBadge("status", label, "blue");
    case "Needs Approval":
    case "In Progress":
      return statusBadge("status", label, "yellow");
    case "Invoiced":
    case "Completed":
      return statusBadge("status", label, "green");
    default:
      return null;
  }
}

export function purchasingRfqStatusBadge(status: string): DetailNavBadge | null {
  switch (status) {
    case "Draft":
      return statusBadge("status", status, "gray");
    case "Requested":
      return statusBadge("status", status, "green");
    case "Closed":
      return statusBadge("status", status, "red");
    default:
      return null;
  }
}

export function supplierQuoteStatusBadge(status: string): DetailNavBadge | null {
  switch (status) {
    case "Active":
      return statusBadge("status", status, "green");
    case "Draft":
      return statusBadge("status", status, "gray");
    case "Declined":
      return statusBadge("status", status, "orange");
    case "Expired":
    case "Cancelled":
      return statusBadge("status", status, "red");
    default:
      return null;
  }
}

export function purchaseOrderStatusBadge(status: string): DetailNavBadge | null {
  switch (status) {
    case "Draft":
      return statusBadge("status", status, "gray");
    case "Planned":
    case "To Review":
    case "Needs Approval":
      return statusBadge("status", status, "yellow");
    case "To Receive":
    case "To Receive and Invoice":
      return statusBadge("status", status, "orange");
    case "To Invoice":
      return statusBadge("status", status, "blue");
    case "Completed":
      return statusBadge("status", status, "green");
    case "Closed":
    case "Rejected":
      return statusBadge("status", status, "red");
    default:
      return null;
  }
}

export function jobStatusBadge(status: string, label = status): DetailNavBadge | null {
  switch (status) {
    case "Draft":
    case "Closed":
      return statusBadge("status", label, "gray");
    case "Planned":
      return statusBadge("status", label, "yellow");
    case "Ready":
    case "In Progress":
      return statusBadge("status", label, "blue");
    case "Paused":
    case "Due Today":
      return statusBadge("status", label, "orange");
    case "Completed":
      return statusBadge("status", label, "green");
    case "Overdue":
    case "Cancelled":
      return statusBadge("status", label, "red");
    default:
      return null;
  }
}

export function salesInvoiceStatusBadge(status: string): DetailNavBadge | null {
  switch (status) {
    case "Draft":
    case "Return":
      return statusBadge("status", status, "gray");
    case "Submitted":
      return statusBadge("status", status, "blue");
    case "Pending":
    case "Partially Paid":
      return statusBadge("status", status, "yellow");
    case "Voided":
      return statusBadge("status", status, "red");
    case "Overdue":
      return statusBadge("status", status, "orange");
    case "Credit Note Issued":
    case "Paid":
      return statusBadge("status", status, "green");
    default:
      return null;
  }
}

export function purchaseInvoiceStatusBadge(status: string): DetailNavBadge | null {
  switch (status) {
    case "Draft":
      return statusBadge("status", status, "gray");
    case "Open":
      return statusBadge("status", status, "blue");
    case "Pending":
    case "Partially Paid":
      return statusBadge("status", status, "orange");
    case "Overdue":
    case "Voided":
      return statusBadge("status", status, "red");
    case "Debit Note Issued":
    case "Paid":
      return statusBadge("status", status, "green");
    default:
      return null;
  }
}

export function issueStatusBadge(status: string): DetailNavBadge | null {
  switch (status) {
    case "Registered":
      return statusBadge("status", status, "gray");
    case "In Progress":
      return statusBadge("status", status, "blue");
    case "Closed":
      return statusBadge("status", status, "green");
    default:
      return null;
  }
}

export function maintenanceStatusBadge(status: string): DetailNavBadge | null {
  switch (status) {
    case "Open":
      return statusBadge("status", status, "gray");
    case "Assigned":
      return statusBadge("status", status, "yellow");
    case "In Progress":
      return statusBadge("status", status, "blue");
    case "Completed":
      return statusBadge("status", status, "green");
    case "Cancelled":
      return statusBadge("status", status, "red");
    default:
      return null;
  }
}

export function versionBadge(version: number): DetailNavBadge {
  return {
    key: "version",
    label: `Version ${version}`,
    icon: <LuGitBranch className="size-3.5" />
  };
}

export function lockedStatusBadge(
  status: "Active" | "Archived"
): DetailNavBadge {
  return {
    key: "status",
    label: status,
    icon: (
      <LuLock
        className={`size-3.5 ${status === "Active" ? "text-green-500" : "text-red-500"}`}
      />
    )
  };
}

export function trainingStatusBadge(status: string): DetailNavBadge | null {
  switch (status) {
    case "Draft":
      return statusBadge("status", status, "gray");
    case "Active":
      return statusBadge("status", status, "green");
    case "Archived":
      return statusBadge("status", status, "red");
    default:
      return null;
  }
}

export function procedureOrDocumentStatusBadge(
  status: string
): DetailNavBadge | null {
  switch (status) {
    case "Draft":
      return statusBadge("status", status, "gray");
    case "Active":
      return lockedStatusBadge("Active");
    case "Archived":
      return lockedStatusBadge("Archived");
    default:
      return null;
  }
}

export function stockTransferStatusBadge(status: string): DetailNavBadge | null {
  switch (status) {
    case "Draft":
      return statusBadge("status", status, "gray");
    case "Released":
      return statusBadge("status", status, "orange");
    case "In Progress":
      return statusBadge("status", status, "blue");
    case "Completed":
      return statusBadge("status", status, "green");
    default:
      return null;
  }
}
