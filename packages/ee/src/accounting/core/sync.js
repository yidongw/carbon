"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncFactory = void 0;
var bill_1 = require("../providers/xero/entities/bill");
var contact_1 = require("../providers/xero/entities/contact");
var inventory_adjustment_1 = require("../providers/xero/entities/inventory-adjustment");
var invoice_1 = require("../providers/xero/entities/invoice");
var item_1 = require("../providers/xero/entities/item");
var purchase_order_1 = require("../providers/xero/entities/purchase-order");
var sales_order_1 = require("../providers/xero/entities/sales-order");
exports.SyncFactory = {
    /**
     * Instantiates the correct Syncer class based on the Entity Type from context.
     * @param context - The execution context (DB connection, Provider, Config, entityType)
     */
    getSyncer: function (context) {
        switch (context.entityType) {
            // Master Data
            case "vendor":
            case "customer":
                return new contact_1.ContactSyncer(context);
            case "item":
                return new item_1.ItemSyncer(context);
            // Transaction Data
            case "bill":
                return new bill_1.BillSyncer(context);
            case "invoice":
                return new invoice_1.SalesInvoiceSyncer(context);
            case "purchaseOrder":
                return new purchase_order_1.PurchaseOrderSyncer(context);
            case "inventoryAdjustment":
                return new inventory_adjustment_1.InventoryAdjustmentSyncer(context);
            case "salesOrder":
                return new sales_order_1.SalesOrderSyncer(context);
            // Not yet implemented
            // case "employee":
            //   Xero no longer supports the Employees API
            // case "payment":
            //   return new PaymentSyncer(context);
            default:
                throw new Error("No Syncer implementation found for entity type: ".concat(context.entityType));
        }
    }
};
