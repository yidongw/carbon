import type { ComponentType, LazyExoticComponent, ReactElement } from "react";
import { createElement, lazy } from "react";
import { path } from "~/utils/path";

type CreatedRecord = Record<string, any> | null;
type RenderArgs = {
  loadedData?: unknown;
  onClose: () => void;
  searchParams: URLSearchParams;
};
export type RegisteredNewEntity =
  | "consumable"
  | "customer"
  | "customerAccount"
  | "employee"
  | "issue"
  | "issueWorkflow"
  | "job"
  | "maintenance"
  | "material"
  | "part"
  | "purchaseInvoice"
  | "purchaseOrder"
  | "purchasingRFQ"
  | "quote"
  | "salesInvoice"
  | "salesOrder"
  | "salesRFQ"
  | "supplier"
  | "supplierAccount"
  | "supplierQuote"
  | "tool"
  | "warehouseTransfer";

export type NewEntityModalRegistryEntry = {
  entity: RegisteredNewEntity;
  render: (args: RenderArgs) => ReactElement;
  to: string;
  getCreatedName?: (created: CreatedRecord) => string | null | undefined;
  getCreatedPath?: (
    created: CreatedRecord,
    searchParams: URLSearchParams
  ) => string | null | undefined;
  loadDataPath?: string;
};

function getLoadedProps(loadedData: unknown): Record<string, unknown> {
  if (
    loadedData &&
    typeof loadedData === "object" &&
    !Array.isArray(loadedData)
  ) {
    return loadedData as Record<string, unknown>;
  }

  return {};
}

function renderLazyForm(
  importer: () => Promise<{ default: ComponentType<any> }>
): NewEntityModalRegistryEntry["render"] {
  const Form = lazy(importer) as LazyExoticComponent<ComponentType<any>>;

  return ({ loadedData, onClose, searchParams }) =>
    createElement(Form, {
      onClose,
      searchParams,
      ...getLoadedProps(loadedData)
    });
}

/**
 * Registry of `/x/.../new` URLs to the metadata needed to render and submit
 * a state-based create modal in-place (no URL change).
 */
export const newEntityModalRegistry: Record<
  string,
  NewEntityModalRegistryEntry
> = {
  [path.to.newCustomer]: {
    entity: "customer",
    to: path.to.newCustomer,
    render: renderLazyForm(
      () => import("~/modules/sales/ui/Customer/CustomerForm")
    ),
    getCreatedName: (created) => created?.name,
    getCreatedPath: (created) =>
      created?.id ? path.to.customer(created.id) : undefined
  },
  [path.to.newSupplier]: {
    entity: "supplier",
    to: path.to.newSupplier,
    render: renderLazyForm(
      () => import("~/modules/purchasing/ui/Supplier/SupplierForm")
    ),
    getCreatedName: (created) => created?.name,
    getCreatedPath: (created) =>
      created?.id ? path.to.supplier(created.id) : undefined
  },
  [path.to.newPart]: {
    entity: "part",
    to: path.to.newPart,
    render: renderLazyForm(() => import("~/modules/items/ui/Parts/PartForm")),
    getCreatedPath: (created) =>
      created?.id ? path.to.part(created.id) : undefined
  },
  [path.to.newMaterial]: {
    entity: "material",
    to: path.to.newMaterial,
    render: renderLazyForm(
      () => import("~/modules/items/ui/Materials/MaterialForm")
    ),
    getCreatedPath: (created) =>
      created?.id ? path.to.material(created.id) : undefined
  },
  [path.to.newTool]: {
    entity: "tool",
    to: path.to.newTool,
    render: renderLazyForm(() => import("~/modules/items/ui/Tools/ToolForm")),
    getCreatedPath: (created) =>
      created?.id ? path.to.tool(created.id) : undefined
  },
  [path.to.newConsumable]: {
    entity: "consumable",
    to: path.to.newConsumable,
    render: renderLazyForm(
      () => import("~/modules/items/ui/Consumables/ConsumableForm")
    ),
    getCreatedPath: (created) =>
      created?.id ? path.to.consumable(created.id) : undefined
  },
  [path.to.newJob]: {
    entity: "job",
    to: path.to.newJob,
    render: renderLazyForm(
      () => import("~/modules/production/ui/Jobs/JobForm")
    ),
    getCreatedPath: (created) =>
      created?.id ? path.to.job(created.id) : undefined
  },
  [path.to.newMaintenanceDispatch]: {
    entity: "maintenance",
    to: path.to.newMaintenanceDispatch,
    render: renderLazyForm(
      () => import("~/modules/resources/ui/Maintenance/MaintenanceDispatchForm")
    ),
    getCreatedPath: (created) =>
      created?.id ? path.to.maintenanceDispatch(created.id) : undefined,
    loadDataPath: path.to.newMaintenanceDispatch
  },
  [path.to.newIssue]: {
    entity: "issue",
    to: path.to.newIssue,
    render: renderLazyForm(
      () => import("~/modules/quality/ui/Issue/IssueForm")
    ),
    getCreatedPath: (created) =>
      created?.id ? path.to.issue(created.id) : undefined,
    loadDataPath: path.to.newIssue
  },
  [path.to.newIssueWorkflow]: {
    entity: "issueWorkflow",
    to: path.to.newIssueWorkflow,
    render: renderLazyForm(
      () => import("~/modules/quality/ui/IssueWorkflows/IssueWorkflowForm")
    ),
    getCreatedPath: (created) =>
      created?.id ? path.to.issueWorkflow(created.id) : undefined,
    loadDataPath: path.to.newIssueWorkflow
  },
  [path.to.newPurchaseOrder]: {
    entity: "purchaseOrder",
    to: path.to.newPurchaseOrder,
    render: renderLazyForm(
      () => import("~/modules/purchasing/ui/PurchaseOrder/PurchaseOrderForm")
    ),
    getCreatedPath: (created) =>
      created?.id ? path.to.purchaseOrder(created.id) : undefined
  },
  [path.to.newSalesOrder]: {
    entity: "salesOrder",
    to: path.to.newSalesOrder,
    render: renderLazyForm(
      () => import("~/modules/sales/ui/SalesOrder/SalesOrderForm")
    ),
    getCreatedPath: (created) =>
      created?.id ? path.to.salesOrder(created.id) : undefined
  },
  [path.to.newSalesRFQ]: {
    entity: "salesRFQ",
    to: path.to.newSalesRFQ,
    render: renderLazyForm(
      () => import("~/modules/sales/ui/SalesRFQ/SalesRFQForm")
    ),
    getCreatedPath: (created) =>
      created?.id ? path.to.salesRfq(created.id) : undefined
  },
  [path.to.newQuote]: {
    entity: "quote",
    to: path.to.newQuote,
    render: renderLazyForm(() => import("~/modules/sales/ui/Quotes/QuoteForm")),
    getCreatedPath: (created) =>
      created?.id ? path.to.quote(created.id) : undefined
  },
  [path.to.newPurchaseInvoice]: {
    entity: "purchaseInvoice",
    to: path.to.newPurchaseInvoice,
    render: renderLazyForm(
      () => import("~/modules/invoicing/ui/PurchaseInvoice/PurchaseInvoiceForm")
    ),
    getCreatedPath: (created) =>
      created?.id ? path.to.purchaseInvoice(created.id) : undefined
  },
  [path.to.newSalesInvoice]: {
    entity: "salesInvoice",
    to: path.to.newSalesInvoice,
    render: renderLazyForm(
      () => import("~/modules/invoicing/ui/SalesInvoice/SalesInvoiceForm")
    ),
    getCreatedPath: (created) =>
      created?.id ? path.to.salesInvoice(created.id) : undefined
  },
  [path.to.newPurchasingRFQ]: {
    entity: "purchasingRFQ",
    to: path.to.newPurchasingRFQ,
    render: renderLazyForm(
      () => import("~/modules/purchasing/ui/PurchasingRfq/PurchasingRFQForm")
    ),
    getCreatedPath: (created) =>
      created?.id ? path.to.purchasingRfqDetails(created.id) : undefined
  },
  [path.to.newSupplierQuote]: {
    entity: "supplierQuote",
    to: path.to.newSupplierQuote,
    render: renderLazyForm(
      () => import("~/modules/purchasing/ui/SupplierQuote/SupplierQuoteForm")
    ),
    getCreatedPath: (created) =>
      created?.id ? path.to.supplierQuote(created.id) : undefined
  },
  [path.to.newWarehouseTransfer]: {
    entity: "warehouseTransfer",
    to: path.to.newWarehouseTransfer,
    render: renderLazyForm(
      () =>
        import(
          "~/modules/inventory/ui/WarehouseTransfers/WarehouseTransferForm"
        )
    ),
    getCreatedPath: (created) =>
      created?.id ? path.to.warehouseTransferDetails(created.id) : undefined
  },
  [path.to.newEmployee]: {
    entity: "employee",
    to: path.to.newEmployee,
    render: renderLazyForm(
      () => import("~/modules/users/ui/Employees/CreateEmployeeForm")
    ),
    getCreatedPath: (created) =>
      created?.userId
        ? path.to.personJob(created.userId)
        : path.to.employeeAccounts
  },
  [path.to.newCustomerAccount]: {
    entity: "customerAccount",
    to: path.to.newCustomerAccount,
    render: renderLazyForm(
      () => import("~/modules/users/ui/Customers/CreateCustomerAccountForm")
    ),
    getCreatedPath: (_, searchParams) =>
      searchParams.get("customer")
        ? path.to.customerContacts(searchParams.get("customer")!)
        : path.to.customerAccounts
  },
  [path.to.newSupplierAccount]: {
    entity: "supplierAccount",
    to: path.to.newSupplierAccount,
    render: renderLazyForm(
      () => import("~/modules/users/ui/Suppliers/CreateSupplierAccountForm")
    ),
    getCreatedPath: (_, searchParams) =>
      searchParams.get("supplier")
        ? path.to.supplierContacts(searchParams.get("supplier")!)
        : path.to.supplierAccounts
  }
};

export function getNewEntityModalEntry(
  to: string
): NewEntityModalRegistryEntry {
  const pathOnly = to.split("?")[0];
  const entry = newEntityModalRegistry[pathOnly];

  if (!entry) {
    throw new Error(`No new entity modal registered for path: ${to}`);
  }

  return entry;
}

export function isNewEntityModalRoute(to: string): boolean {
  const pathOnly = to.split("?")[0];
  return pathOnly in newEntityModalRegistry;
}
