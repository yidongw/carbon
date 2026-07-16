"use strict";
/**
 * Entity-Centric Audit Log Configuration
 *
 * Audit logging is organized around business entities (Customer, Sales Order, etc.),
 * not individual database tables. Each entity is composed of one or more tables.
 * When a row in any of those tables changes, the audit system attributes the change
 * to the correct business entity and records the actual field-level diff.
 *
 * The generated Supabase `Database` type (`./types`) is the source of truth for
 * table names and column names used throughout this config.
 *
 * Table roles:
 * - "root": The primary table for this entity. Its PK is the entity ID.
 * - "extension": A 1:1 extension table whose PK equals the parent FK
 *           (e.g., customerPayment PK = customerId). Entity ID resolution
 *           is the same as root, but INSERT events are skipped.
 * - { entityIdColumn }: A child table with its own surrogate PK. The named
 *           column contains the parent entity ID.
 * - { resolve: { junction, fk, entityIdColumn } }: An indirect child linked
 *           through a junction table. Requires a DB query at audit time.
 */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditConfig = void 0;
exports.isAuditableTable = isAuditableTable;
exports.getCreateFields = getCreateFields;
exports.getSnapshotFields = getSnapshotFields;
exports.isAuditableEntity = isAuditableEntity;
exports.getEntityConfigsForTable = getEntityConfigsForTable;
exports.getAuditableTableNames = getAuditableTableNames;
exports.getEntityTypes = getEntityTypes;
exports.getEntityLabel = getEntityLabel;
exports.getTableLabel = getTableLabel;
exports.isRootTable = isRootTable;
exports.isExtensionTable = isExtensionTable;
exports.isChildTable = isChildTable;
exports.isIndirectTable = isIndirectTable;
// ---------------------------------------------------------------------------
// Entity definitions
// ---------------------------------------------------------------------------
exports.auditConfig = {
    entities: {
        customer: {
            label: "Customer",
            tables: {
                customer: { role: "root" },
                customerPayment: { role: "extension" }, // PK = customerId
                customerShipping: { role: "extension" }, // PK = customerId
                customerTax: { role: "extension" }, // PK = customerId
                contact: {
                    resolve: {
                        junction: "customerContact",
                        fk: "contactId",
                        entityIdColumn: "customerId"
                    }
                },
                address: {
                    resolve: {
                        junction: "customerLocation",
                        fk: "addressId",
                        entityIdColumn: "customerId"
                    }
                }
            }
        },
        supplier: {
            label: "Supplier",
            tables: {
                supplier: { role: "root" },
                supplierPayment: { role: "extension" }, // PK = supplierId
                supplierShipping: { role: "extension" }, // PK = supplierId
                supplierTax: { role: "extension" }, // PK = supplierId
                contact: {
                    resolve: {
                        junction: "supplierContact",
                        fk: "contactId",
                        entityIdColumn: "supplierId"
                    }
                },
                address: {
                    resolve: {
                        junction: "supplierLocation",
                        fk: "addressId",
                        entityIdColumn: "supplierId"
                    }
                }
            }
        },
        item: {
            label: "Item",
            tables: {
                item: { role: "root" },
                itemShelfLife: { role: "root" },
                itemCost: { role: "extension" }, // PK = itemId
                itemPlanning: { role: "extension" }, // PK = itemId
                itemReplenishment: { role: "extension" }, // PK = itemId
                itemUnitSalePrice: { role: "extension" }, // PK = itemId
                supplierPart: { entityIdColumn: "itemId" },
                customerPartToItem: { entityIdColumn: "itemId" }
            }
        },
        itemShelfLife: {
            label: "Item Shelf Life",
            tables: {
                itemShelfLife: {
                    role: "root",
                    createFields: [
                        "mode",
                        "days",
                        "triggerProcessId",
                        "triggerTiming",
                        "calculateFromBom"
                    ],
                    snapshotFields: {
                        triggerProcessId: { table: "process", displayColumns: ["name"] }
                    }
                }
            }
        },
        salesOrder: {
            label: "Sales Order",
            tables: {
                salesOrder: { role: "root" },
                salesOrderLine: { entityIdColumn: "salesOrderId" },
                salesOrderPayment: { role: "extension" }, // PK = salesOrderId
                salesOrderShipment: { role: "extension" } // PK = salesOrderId
            }
        },
        purchaseOrder: {
            label: "Purchase Order",
            tables: {
                purchaseOrder: { role: "root" },
                purchaseOrderLine: { entityIdColumn: "purchaseOrderId" },
                purchaseOrderPayment: { role: "extension" }, // PK = purchaseOrderId
                purchaseOrderDelivery: { role: "extension" } // PK = purchaseOrderId
            }
        },
        salesInvoice: {
            label: "Sales Invoice",
            tables: {
                salesInvoice: { role: "root" },
                salesInvoiceLine: { entityIdColumn: "invoiceId" },
                salesInvoiceShipment: { role: "extension" } // PK = salesInvoiceId
            }
        },
        purchaseInvoice: {
            label: "Purchase Invoice",
            tables: {
                purchaseInvoice: { role: "root" },
                purchaseInvoiceLine: { entityIdColumn: "invoiceId" }
            }
        },
        salesQuote: {
            label: "Quote",
            tables: {
                quote: { role: "root" },
                quoteLine: { entityIdColumn: "quoteId" }
            }
        },
        supplierQuote: {
            label: "Supplier Quote",
            tables: {
                supplierQuote: { role: "root" },
                supplierQuoteLine: { entityIdColumn: "supplierQuoteId" }
            }
        },
        productionJob: {
            label: "Job",
            tables: {
                job: { role: "root" },
                jobOperation: { entityIdColumn: "jobId" },
                jobMaterial: { entityIdColumn: "jobId" },
                jobMakeMethod: { entityIdColumn: "jobId" }
            }
        },
        employee: {
            label: "Employee",
            tables: {
                employee: { role: "root" },
                employeeJob: { role: "extension" } // PK = employee id
            }
        },
        nonConformance: {
            label: "Non-Conformance",
            tables: {
                nonConformance: { role: "root" },
                nonConformanceItem: { entityIdColumn: "nonConformanceId" },
                nonConformanceActionTask: { entityIdColumn: "nonConformanceId" },
                nonConformanceApprovalTask: { entityIdColumn: "nonConformanceId" }
            }
        },
        gauge: {
            label: "Gauge",
            tables: {
                gauge: { role: "root" },
                gaugeCalibrationRecord: { entityIdColumn: "gaugeId" }
            }
        },
        shipment: {
            label: "Shipment",
            tables: {
                shipment: { role: "root" },
                shipmentLine: { entityIdColumn: "shipmentId" }
            }
        },
        receipt: {
            label: "Receipt",
            tables: {
                receipt: { role: "root" },
                receiptLine: { entityIdColumn: "receiptId" }
            }
        },
        warehouseTransfer: {
            label: "Warehouse Transfer",
            tables: {
                warehouseTransfer: { role: "root" },
                warehouseTransferLine: { entityIdColumn: "transferId" }
            }
        },
        stockTransfer: {
            label: "Stock Transfer",
            tables: {
                stockTransfer: { role: "root" },
                stockTransferLine: { entityIdColumn: "stockTransferId" }
            }
        },
        workCenter: {
            label: "Work Center",
            tables: {
                workCenter: { role: "root" },
                workCenterProcess: { entityIdColumn: "workCenterId" }
            }
        },
        maintenanceSchedule: {
            label: "Maintenance Schedule",
            tables: {
                maintenanceSchedule: { role: "root" },
                maintenanceScheduleItem: {
                    entityIdColumn: "maintenanceScheduleId"
                }
            }
        },
        maintenanceDispatch: {
            label: "Maintenance Dispatch",
            tables: {
                maintenanceDispatch: { role: "root" },
                maintenanceDispatchEvent: { entityIdColumn: "maintenanceDispatchId" },
                maintenanceDispatchComment: {
                    entityIdColumn: "maintenanceDispatchId"
                }
            }
        },
        pricingRule: {
            label: "Pricing Rule",
            tables: {
                pricingRule: { role: "root" }
            }
        },
        priceOverride: {
            label: "Price Override",
            tables: {
                customerItemPriceOverride: { role: "root" },
                customerItemPriceOverrideBreak: {
                    entityIdColumn: "customerItemPriceOverrideId"
                }
            }
        },
        priceOverrideBreak: {
            label: "Price Override Break",
            tables: {
                customerItemPriceOverrideBreak: {
                    role: "root",
                    createFields: ["quantity", "overridePrice", "active"]
                }
            }
        },
        fixedAsset: {
            label: "Fixed Asset",
            tables: {
                fixedAsset: { role: "root" }
            }
        }
    },
    /**
     * Human-readable labels for table names, used in the UI to show
     * provenance (e.g. "Contact" instead of "customerContact").
     * Tables not listed here fall back to a camelCase → Title Case conversion.
     */
    tableLabels: {
        customer: "Customer",
        customerPayment: "Payment",
        customerShipping: "Shipping",
        customerTax: "Tax",
        contact: "Contact",
        address: "Address",
        supplier: "Supplier",
        supplierPayment: "Payment",
        supplierShipping: "Shipping",
        supplierTax: "Tax",
        supplierPart: "Supplier Part",
        item: "Item",
        itemShelfLife: "Shelf Life",
        itemCost: "Cost",
        itemPlanning: "Planning",
        itemReplenishment: "Replenishment",
        itemUnitSalePrice: "Unit Sale Price",
        customerPartToItem: "Customer Part Mapping",
        salesOrder: "Sales Order",
        salesOrderLine: "Line Item",
        salesOrderPayment: "Payment",
        salesOrderShipment: "Shipment",
        purchaseOrder: "Purchase Order",
        purchaseOrderLine: "Line Item",
        purchaseOrderPayment: "Payment",
        purchaseOrderDelivery: "Delivery",
        salesInvoice: "Sales Invoice",
        salesInvoiceLine: "Line Item",
        salesInvoiceShipment: "Shipment",
        purchaseInvoice: "Purchase Invoice",
        purchaseInvoiceLine: "Line Item",
        quote: "Quote",
        quoteLine: "Line Item",
        supplierQuote: "Supplier Quote",
        supplierQuoteLine: "Line Item",
        job: "Job",
        jobOperation: "Operation",
        jobMaterial: "Material",
        jobMakeMethod: "Make Method",
        employee: "Employee",
        employeeJob: "Job Info",
        nonConformance: "Non-Conformance",
        nonConformanceItem: "Item",
        nonConformanceActionTask: "Action Task",
        nonConformanceApprovalTask: "Approval Task",
        gauge: "Gauge",
        gaugeCalibrationRecord: "Calibration Record",
        shipment: "Shipment",
        shipmentLine: "Line Item",
        receipt: "Receipt",
        receiptLine: "Line Item",
        warehouseTransfer: "Warehouse Transfer",
        warehouseTransferLine: "Line Item",
        stockTransfer: "Stock Transfer",
        stockTransferLine: "Line Item",
        workCenter: "Work Center",
        workCenterProcess: "Process",
        maintenanceSchedule: "Maintenance Schedule",
        maintenanceScheduleItem: "Schedule Item",
        maintenanceDispatch: "Dispatch",
        maintenanceDispatchEvent: "Dispatch Event",
        maintenanceDispatchComment: "Dispatch Comment",
        pricingRule: "Pricing Rule",
        customerItemPriceOverride: "Price Override",
        customerItemPriceOverrideBreak: "Quantity Break",
        fixedAsset: "Fixed Asset"
    },
    /** Fields to skip in diff computation */
    skipFields: ["updatedAt", "updatedBy", "embedding"],
    /** Retention period before archival (days) */
    retentionDays: 30,
    /** Archive storage path template */
    archivePath: "audit-logs/{companyId}/{year}/{month}.jsonl.gz",
    /** Storage bucket name for archives */
    archiveBucket: "private"
};
/** Map from table name → array of entity configs that include it */
var _tableIndex = new Map();
/** Deduplicated set of all auditable table names */
var _allTables = new Set();
for (var _i = 0, _b = Object.entries(exports.auditConfig.entities); _i < _b.length; _i++) {
    var _c = _b[_i], entityType = _c[0], entityConfig = _c[1];
    for (var _d = 0, _e = Object.entries(entityConfig.tables); _d < _e.length; _d++) {
        var _f = _e[_d], tableName = _f[0], tableConfig = _f[1];
        _allTables.add(tableName);
        var existing = (_a = _tableIndex.get(tableName)) !== null && _a !== void 0 ? _a : [];
        existing.push({
            entityType: entityType,
            label: entityConfig.label,
            tableConfig: tableConfig
        });
        _tableIndex.set(tableName, existing);
    }
}
// ---------------------------------------------------------------------------
// Public helpers
// ---------------------------------------------------------------------------
/** Check if a table is tracked by any audit entity */
function isAuditableTable(table) {
    return _tableIndex.has(table);
}
/**
 * Columns to include in the diff for INSERT events on this table.
 * Returns an empty array when no createFields are configured.
 */
function getCreateFields(config) {
    var _a;
    return (_a = config.createFields) !== null && _a !== void 0 ? _a : [];
}
/**
 * FK columns on this table whose target row's display values should be
 * snapshotted into the diff at write time. Each entry maps a column name
 * to its target table and the columns on that table to read as the human
 * display values. A single-column list yields a Linear-style inline pill
 * in the audit drawer; a multi-column list renders as an expanded section.
 */
function getSnapshotFields(config) {
    var snapshot = config.snapshotFields;
    if (!snapshot)
        return [];
    var entries = [];
    for (var _i = 0, _a = Object.entries(snapshot); _i < _a.length; _i++) {
        var _b = _a[_i], column = _b[0], spec = _b[1];
        if (!spec)
            continue;
        entries.push({
            column: column,
            table: spec.table,
            displayColumns: spec.displayColumns
        });
    }
    return entries;
}
/** @deprecated Use isAuditableTable instead */
function isAuditableEntity(table) {
    return isAuditableTable(table);
}
/**
 * Get all entity configs that track a given table.
 * Returns an array because a table can belong to multiple entities
 * (e.g. `contact` belongs to both `customer` and `supplier`).
 */
function getEntityConfigsForTable(table) {
    var _a;
    return (_a = _tableIndex.get(table)) !== null && _a !== void 0 ? _a : [];
}
/** Get deduplicated list of all auditable table names */
function getAuditableTableNames() {
    return Array.from(_allTables);
}
/** Get list of all entity type keys */
function getEntityTypes() {
    return Object.keys(exports.auditConfig.entities);
}
/** Get human-readable label for an entity type */
function getEntityLabel(entityType) {
    var _a, _b;
    return (_b = (_a = exports.auditConfig.entities[entityType]) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : entityType;
}
/** Get human-readable label for a table name */
function getTableLabel(tableName) {
    var _a;
    var labels = exports.auditConfig.tableLabels;
    return (_a = labels[tableName]) !== null && _a !== void 0 ? _a : tableName.replace(/([A-Z])/g, " $1").trim();
}
/**
 * Check if a table config is a root table (PK = entity ID)
 */
function isRootTable(config) {
    return "role" in config && config.role === "root";
}
/**
 * Check if a table config is a 1:1 extension table (PK = parent FK).
 * Entity ID resolution is the same as root (use recordId), but
 * INSERT events are skipped since they are just empty default rows.
 */
function isExtensionTable(config) {
    return "role" in config && config.role === "extension";
}
/**
 * Check if a table config is a direct child (has entityIdColumn)
 */
function isChildTable(config) {
    return "entityIdColumn" in config && !("resolve" in config);
}
/**
 * Check if a table config requires junction table resolution
 */
function isIndirectTable(config) {
    return "resolve" in config;
}
