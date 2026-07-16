"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainingConfig = void 0;
exports.getTrainingForPath = getTrainingForPath;
exports.getTrainingKey = getTrainingKey;
exports.getVideoEmbedUrl = getVideoEmbedUrl;
/**
 * Central training config: submodule key → video data.
 * This is the ONLY place you need to edit to add/change training content.
 */
exports.trainingConfig = {
    quotes: {
        title: "Quotes in Carbon",
        description: "Learn how to record and manage quotes from customers in Carbon.",
        videoUrl: "https://www.loom.com/share/881c83e9df8044db848aee8c2ea782bd?sid=f4ca14ef-bc59-4a8f-94a6-d6e120ee3bb3",
        videoType: "loom",
        academyUrl: "https://learn.carbon.ms/course/selling/quoting-estimating"
    },
    salesOrders: {
        title: "Sales Orders in Carbon",
        description: "Learn how to create and manage sales orders in Carbon.",
        videoUrl: "https://www.loom.com/share/c5fa13046aaa445a99c43c24434ff2b0?sid=21e5dcc9-cc76-4098-b97e-069212095616",
        videoType: "loom",
        academyUrl: "https://learn.carbon.ms/course/selling/sales-shipment"
    },
    salesInvoices: {
        title: "Sales Invoices in Carbon",
        description: "Master the creation and management of sales invoices.",
        videoUrl: "https://www.loom.com/share/45713271bd444f939dcde717ca720faa?sid=9c45d855-b6fe-4b27-99f9-c019dc28d386",
        videoType: "loom",
        academyUrl: "https://learn.carbon.ms/course/selling/sales-shipment"
    },
    jobs: {
        title: "Production Jobs in Carbon",
        description: "Learn the fundamentals of job management and how jobs drive production in Carbon.",
        videoUrl: "https://www.loom.com/share/ad79b6a529fb43ff864f4908eeaf1511?sid=2a041ddf-50be-4e13-9885-694c253af623",
        videoType: "loom",
        academyUrl: "https://learn.carbon.ms/course/manufacturing/managing-production"
    },
    suppliers: {
        title: "Purchasing in Carbon",
        description: "Learn about the complete purchasing process from supplier selection to payment.",
        videoUrl: "https://www.loom.com/share/51e0c6dd053b4a3e904fc795d4fc298f?sid=0bb2081d-6bc4-4efb-8361-d2717dda9781",
        videoType: "loom",
        academyUrl: "https://learn.carbon.ms/course/buying/purchasing-basics"
    },
    purchaseOrders: {
        title: "Purchase Orders in Carbon",
        description: "Learn how to create and manage purchase orders effectively.",
        videoUrl: "https://www.loom.com/share/51e0c6dd053b4a3e904fc795d4fc298f?sid=0bb2081d-6bc4-4efb-8361-d2717dda9781",
        videoType: "loom",
        academyUrl: "https://learn.carbon.ms/course/buying/purchasing-basics"
    },
    parts: {
        title: "Parts & Materials in Carbon",
        description: "Learn the differences between item types and when to use each one in your business processes.",
        videoUrl: "https://www.loom.com/share/acad6206adde4d1185e83f57393f36e9?sid=3cec60b1-91e3-454b-a6dd-f08fe1035ef2",
        videoType: "loom",
        academyUrl: "https://learn.carbon.ms/course/parts-materials/defining-item"
    },
    inventory: {
        title: "Inventory in Carbon",
        description: "Learn how to monitor and manage inventory levels, set reorder points, and handle stock movements.",
        videoUrl: "https://www.loom.com/share/66045f3ef31c4d93b734fad7df0006dc?sid=5f896ab7-1765-411c-afd2-c320a4df18a7",
        videoType: "loom",
        academyUrl: "https://learn.carbon.ms/course/parts-materials/replenishing-item"
    },
    quality: {
        title: "Quality in Carbon",
        description: "Learn how to track and manage non-conforming materials and quality issues.",
        videoUrl: "https://www.loom.com/share/51e0c6dd053b4a3e904fc795d4fc298f?sid=0bb2081d-6bc4-4efb-8361-d2717dda9781",
        videoType: "loom",
        academyUrl: "https://learn.carbon.ms/course/quality/tracking-quality"
    }
};
/**
 * Maps pathname prefixes → submodule keys.
 * Each submodule can have multiple prefixes (list page + detail page).
 */
var routeToSubmodule = [
    { prefixes: ["/x/sales/quotes", "/x/quote/"], key: "quotes" },
    { prefixes: ["/x/sales/orders", "/x/sales-order/"], key: "salesOrders" },
    {
        prefixes: ["/x/sales/invoices", "/x/sales-invoice/"],
        key: "salesInvoices"
    },
    { prefixes: ["/x/production/jobs", "/x/job/"], key: "jobs" },
    {
        prefixes: ["/x/purchasing/suppliers", "/x/supplier/"],
        key: "suppliers"
    },
    {
        prefixes: ["/x/purchasing/orders", "/x/purchase-order/"],
        key: "purchaseOrders"
    },
    { prefixes: ["/x/items/parts", "/x/part/"], key: "parts" },
    {
        prefixes: [
            "/x/inventory/receipts",
            "/x/inventory/shipments",
            "/x/inventory/inventory",
            "/x/inventory/stock-transfers",
            "/x/receipt/",
            "/x/shipment/",
            "/x/stock-transfer/"
        ],
        key: "inventory"
    },
    {
        prefixes: ["/x/quality/issues", "/x/quality/actions", "/x/issue/"],
        key: "quality"
    }
];
/** Resolves current pathname to a TrainingVideo (or null). */
function getTrainingForPath(pathname) {
    var _a;
    for (var _i = 0, routeToSubmodule_1 = routeToSubmodule; _i < routeToSubmodule_1.length; _i++) {
        var _b = routeToSubmodule_1[_i], prefixes = _b.prefixes, key = _b.key;
        if (prefixes.some(function (p) { return pathname.startsWith(p); })) {
            return (_a = exports.trainingConfig[key]) !== null && _a !== void 0 ? _a : null;
        }
    }
    return null;
}
/** Returns submodule key for localStorage dismiss tracking. */
function getTrainingKey(pathname) {
    for (var _i = 0, routeToSubmodule_2 = routeToSubmodule; _i < routeToSubmodule_2.length; _i++) {
        var _a = routeToSubmodule_2[_i], prefixes = _a.prefixes, key = _a.key;
        if (prefixes.some(function (p) { return pathname.startsWith(p); })) {
            return key;
        }
    }
    return null;
}
/** Converts a share URL to an embeddable iframe URL. */
function getVideoEmbedUrl(videoUrl, videoType) {
    if (videoType === "loom") {
        var match = videoUrl.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
        return match
            ? "https://www.loom.com/embed/".concat(match[1], "?hideEmbedTopBar=true")
            : videoUrl;
    }
    if (videoType === "youtube") {
        var match = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
        return match ? "https://www.youtube.com/embed/".concat(match[1]) : videoUrl;
    }
    return videoUrl;
}
