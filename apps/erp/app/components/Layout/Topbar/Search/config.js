"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entityTypeConfig = void 0;
exports.getEntityTypeConfig = getEntityTypeConfig;
exports.getEntityTypeLabel = getEntityTypeLabel;
var lu_1 = require("react-icons/lu");
var pi_1 = require("react-icons/pi");
var ri_1 = require("react-icons/ri");
// Entity type styling configuration
exports.entityTypeConfig = {
    customer: {
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        textColor: "text-blue-600 dark:text-blue-400",
        icon: lu_1.LuSquareUser
    },
    supplier: {
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
        textColor: "text-purple-600 dark:text-purple-400",
        icon: pi_1.PiShareNetworkFill
    },
    gauge: {
        bgColor: "",
        textColor: "",
        icon: lu_1.LuGauge
    },
    issue: {
        bgColor: "",
        textColor: "",
        icon: lu_1.LuOctagonAlert
    },
    item: {
        bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
        textColor: "text-emerald-600 dark:text-emerald-400",
        icon: lu_1.LuWrench
    },
    job: {
        bgColor: "bg-orange-100 dark:bg-orange-900/30",
        textColor: "text-orange-600 dark:text-orange-400",
        icon: lu_1.LuHardHat
    },
    employee: {
        bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
        textColor: "text-cyan-600 dark:text-cyan-400",
        icon: lu_1.LuUser
    },
    purchaseOrder: {
        bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
        textColor: "text-yellow-600 dark:text-yellow-400",
        icon: lu_1.LuShoppingCart
    },
    salesInvoice: {
        bgColor: "bg-green-100 dark:bg-green-900/30",
        textColor: "text-green-600 dark:text-green-400",
        icon: ri_1.RiProgress8Line
    },
    purchaseInvoice: {
        bgColor: "bg-red-100 dark:bg-red-900/30",
        textColor: "text-red-600 dark:text-red-400",
        icon: lu_1.LuFileCheck
    },
    quote: {
        bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
        textColor: "text-indigo-600 dark:text-indigo-400",
        icon: ri_1.RiProgress4Line
    },
    salesRfq: {
        bgColor: "bg-pink-100 dark:bg-pink-900/30",
        textColor: "text-pink-600 dark:text-pink-400",
        icon: ri_1.RiProgress2Line
    },
    salesOrder: {
        bgColor: "bg-teal-100 dark:bg-teal-900/30",
        textColor: "text-teal-600 dark:text-teal-400",
        icon: ri_1.RiProgress8Line
    },
    supplierQuote: {
        bgColor: "bg-violet-100 dark:bg-violet-900/30",
        textColor: "text-violet-600 dark:text-violet-400",
        icon: lu_1.LuPackageSearch
    }
};
function getEntityTypeConfig(entityType) {
    var _a;
    return ((_a = exports.entityTypeConfig[entityType]) !== null && _a !== void 0 ? _a : {
        bgColor: "bg-muted",
        textColor: "text-muted-foreground",
        icon: null
    });
}
function getEntityTypeLabel(entityType) {
    var _a;
    var labels = {
        customer: "Customer",
        supplier: "Supplier",
        gauge: "Gauge",
        issue: "Issue",
        item: "Item",
        job: "Job",
        employee: "Person",
        purchaseOrder: "Purchase Order",
        salesInvoice: "Sales Invoice",
        purchaseInvoice: "Purchase Invoice",
        quote: "Quote",
        salesRfq: "RFQ",
        salesOrder: "Sales Order",
        supplierQuote: "Supplier Quote"
    };
    return (_a = labels[entityType]) !== null && _a !== void 0 ? _a : entityType;
}
