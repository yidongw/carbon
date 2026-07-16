"use strict";
/**
 * Printing seed data for Carbon
 *
 * Seeds test data for the Print Manager: printer routes, printing settings,
 * items with tracking, receipts, shipments, kanbans, jobs, and a second
 * location with a location override for testing printer routing.
 *
 * This is called within an existing transaction — do NOT commit or rollback.
 *
 * Usage:
 *   import { seedPrinting } from "./seed-printing.ts";
 *   await seedPrinting(client, { companyId, userId, locationId });
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedPrinting = seedPrinting;
function seedPrinting(client, ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var companyId, userId, locationId, supplierResult, supplierId, customerResult, customerId, itemDefs, methodTypeMap, itemIds, _i, itemDefs_1, item, result, _a, itemIds_1, itemId, siResult, supplierInteractionId, poResult, purchaseOrderId, poLineIds, receiptQuantities, i, lineResult, receiptResult, receiptId, i, trackingType, isSerial, receiptLinesResult, receiptLines, widgetLine, i, bracketLine, fastenerLine, soResult, salesOrderId, shipmentResult, shipmentId, shipmentLinesResult, shipmentLineId, workCenterResult, workCenterId, processResult, processId, jobResult, jobId, jmmResult, methodId, jmmInsert, opResult, operationId, printerRouteResult, zplRouteId, location2Result, location2Id, route2Result, route2Id, po2Result, purchaseOrder2Id, po2LineResult, po2LineId, receipt2Result, receipt2Id, receipt2LineResult, receipt2LineId;
        var _b;
        var _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    companyId = ctx.companyId, userId = ctx.userId, locationId = ctx.locationId;
                    console.log("  Seeding printing test data...");
                    return [4 /*yield*/, client.query("INSERT INTO supplier (name, \"companyId\", \"createdBy\") VALUES ($1, $2, $3) RETURNING id", ["Test Parts Supplier", companyId, userId])];
                case 1:
                    supplierResult = _g.sent();
                    supplierId = supplierResult.rows[0].id;
                    return [4 /*yield*/, client.query("INSERT INTO customer (name, \"companyId\", \"createdBy\") VALUES ($1, $2, $3) RETURNING id", ["Test Customer", companyId, userId])];
                case 2:
                    customerResult = _g.sent();
                    customerId = customerResult.rows[0].id;
                    itemDefs = [
                        {
                            readableId: "WIDGET-001",
                            name: "Precision Widget",
                            trackingType: "Serial",
                            replenishment: "Buy"
                        },
                        {
                            readableId: "BRACKET-002",
                            name: "Mounting Bracket",
                            trackingType: "Serial",
                            replenishment: "Buy"
                        },
                        {
                            readableId: "FASTENER-003",
                            name: "Hex Fastener Kit",
                            trackingType: "Batch",
                            replenishment: "Buy"
                        },
                        {
                            readableId: "GEAR-004",
                            name: "Drive Gear Assembly",
                            trackingType: "Serial",
                            replenishment: "Make"
                        }
                    ];
                    methodTypeMap = {
                        Buy: "Purchase to Order",
                        Make: "Make to Order"
                    };
                    itemIds = [];
                    _i = 0, itemDefs_1 = itemDefs;
                    _g.label = 3;
                case 3:
                    if (!(_i < itemDefs_1.length)) return [3 /*break*/, 6];
                    item = itemDefs_1[_i];
                    return [4 /*yield*/, client.query("INSERT INTO item (\n        \"readableId\", name, type, \"replenishmentSystem\", \"defaultMethodType\",\n        \"itemTrackingType\", \"unitOfMeasureCode\", active, \"companyId\", \"createdBy\"\n      ) VALUES ($1, $2, 'Part', $3, $4, $5, 'EA', true, $6, $7) RETURNING id", [
                            item.readableId,
                            item.name,
                            item.replenishment,
                            (_c = methodTypeMap[item.replenishment]) !== null && _c !== void 0 ? _c : "Pull from Inventory",
                            item.trackingType,
                            companyId,
                            userId
                        ])];
                case 4:
                    result = _g.sent();
                    itemIds.push(result.rows[0].id);
                    _g.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    _a = 0, itemIds_1 = itemIds;
                    _g.label = 7;
                case 7:
                    if (!(_a < itemIds_1.length)) return [3 /*break*/, 10];
                    itemId = itemIds_1[_a];
                    return [4 /*yield*/, client.query("INSERT INTO \"itemCost\" (\"itemId\", \"costingMethod\", \"companyId\", \"createdBy\") VALUES ($1, 'Standard', $2, $3)", [itemId, companyId, userId])];
                case 8:
                    _g.sent();
                    _g.label = 9;
                case 9:
                    _a++;
                    return [3 /*break*/, 7];
                case 10: return [4 /*yield*/, client.query("INSERT INTO \"supplierInteraction\" (\"companyId\", \"supplierId\") VALUES ($1, $2) RETURNING id", [companyId, supplierId])];
                case 11:
                    siResult = _g.sent();
                    supplierInteractionId = siResult.rows[0].id;
                    // --- Flow 1: Receipt (auto-print receipt labels) ---
                    console.log("   Flow 1: Receipt RE000001...");
                    return [4 /*yield*/, client.query("INSERT INTO \"purchaseOrder\" (\n      \"purchaseOrderId\", \"supplierId\", \"supplierInteractionId\", status, \"purchaseOrderType\",\n      \"exchangeRate\", \"companyId\", \"createdBy\"\n    ) VALUES ('PO000001', $1, $2, 'To Receive', 'Purchase', 1, $3, $4) RETURNING id", [supplierId, supplierInteractionId, companyId, userId])];
                case 12:
                    poResult = _g.sent();
                    purchaseOrderId = poResult.rows[0].id;
                    return [4 /*yield*/, client.query("INSERT INTO \"purchaseOrderDelivery\" (id, \"companyId\") VALUES ($1, $2)", [purchaseOrderId, companyId])];
                case 13:
                    _g.sent();
                    // Bump sequences past the seeded data to avoid conflicts
                    return [4 /*yield*/, client.query("UPDATE sequence SET next = 3 WHERE \"table\" IN ('purchaseOrder', 'receipt') AND \"companyId\" = $1", [companyId])];
                case 14:
                    // Bump sequences past the seeded data to avoid conflicts
                    _g.sent();
                    return [4 /*yield*/, client.query("UPDATE sequence SET next = 2 WHERE \"table\" = 'job' AND \"companyId\" = $1", [companyId])];
                case 15:
                    _g.sent();
                    poLineIds = [];
                    receiptQuantities = [2, 1, 5];
                    i = 0;
                    _g.label = 16;
                case 16:
                    if (!(i < 3)) return [3 /*break*/, 19];
                    return [4 /*yield*/, client.query("INSERT INTO \"purchaseOrderLine\" (\n        \"purchaseOrderId\", \"purchaseOrderLineType\", \"itemId\",\n        \"purchaseQuantity\", \"quantityReceived\", \"quantityInvoiced\",\n        \"supplierUnitPrice\", \"supplierShippingCost\", \"supplierTaxAmount\",\n        \"exchangeRate\", \"setupPrice\", \"conversionFactor\",\n        \"purchaseUnitOfMeasureCode\", \"inventoryUnitOfMeasureCode\",\n        \"companyId\", \"createdBy\"\n      ) VALUES ($1, 'Part', $2, $3, 0, 0, 10.00, 0, 0, 1, 0, 1, 'EA', 'EA', $4, $5) RETURNING id", [purchaseOrderId, itemIds[i], receiptQuantities[i], companyId, userId])];
                case 17:
                    lineResult = _g.sent();
                    poLineIds.push(lineResult.rows[0].id);
                    _g.label = 18;
                case 18:
                    i++;
                    return [3 /*break*/, 16];
                case 19: return [4 /*yield*/, client.query("INSERT INTO receipt (\n      \"receiptId\", \"supplierId\", \"sourceDocument\", \"sourceDocumentId\",\n      \"locationId\", status, \"companyId\", \"createdBy\"\n    ) VALUES ('RE000001', $1, 'Purchase Order', $2, $3, 'Draft', $4, $5) RETURNING id", [supplierId, purchaseOrderId, locationId, companyId, userId])];
                case 20:
                    receiptResult = _g.sent();
                    receiptId = receiptResult.rows[0].id;
                    i = 0;
                    _g.label = 21;
                case 21:
                    if (!(i < 3)) return [3 /*break*/, 24];
                    trackingType = (_d = itemDefs[i]) === null || _d === void 0 ? void 0 : _d.trackingType;
                    isSerial = trackingType === "Serial";
                    return [4 /*yield*/, client.query("INSERT INTO \"receiptLine\" (\n        \"receiptId\", \"lineId\", \"itemId\", \"orderQuantity\", \"receivedQuantity\", \"unitPrice\",\n        \"unitOfMeasure\", \"locationId\",\n        \"requiresSerialTracking\", \"requiresBatchTracking\",\n        \"companyId\", \"createdBy\"\n      ) VALUES ($1, $2, $3, $4, $4, 10.00, 'EA', $5, $6, $7, $8, $9)", [
                            receiptId,
                            poLineIds[i],
                            itemIds[i],
                            receiptQuantities[i],
                            locationId,
                            isSerial,
                            !isSerial && trackingType === "Batch",
                            companyId,
                            userId
                        ])];
                case 22:
                    _g.sent();
                    _g.label = 23;
                case 23:
                    i++;
                    return [3 /*break*/, 21];
                case 24: return [4 /*yield*/, client.query("SELECT id, \"itemId\" FROM \"receiptLine\" WHERE \"receiptId\" = $1 ORDER BY \"createdAt\"", [receiptId])];
                case 25:
                    receiptLinesResult = _g.sent();
                    receiptLines = receiptLinesResult.rows;
                    widgetLine = receiptLines.find(function (rl) { return rl.itemId === itemIds[0]; });
                    if (!widgetLine) return [3 /*break*/, 29];
                    i = 0;
                    _g.label = 26;
                case 26:
                    if (!(i < 2)) return [3 /*break*/, 29];
                    return [4 /*yield*/, client.query("INSERT INTO \"trackedEntity\" (\"readableId\", quantity, \"sourceDocument\", \"sourceDocumentId\", attributes, \"companyId\", \"createdBy\")\n         VALUES ($1, 1, 'Item', $2, $3, $4, $5)", [
                            "SN-W".concat(1001 + i),
                            itemIds[0],
                            JSON.stringify({
                                Receipt: receiptId,
                                "Receipt Line": widgetLine.id,
                                "Receipt Line Index": i
                            }),
                            companyId,
                            userId
                        ])];
                case 27:
                    _g.sent();
                    _g.label = 28;
                case 28:
                    i++;
                    return [3 /*break*/, 26];
                case 29:
                    bracketLine = receiptLines.find(function (rl) { return rl.itemId === itemIds[1]; });
                    if (!bracketLine) return [3 /*break*/, 31];
                    return [4 /*yield*/, client.query("INSERT INTO \"trackedEntity\" (\"readableId\", quantity, \"sourceDocument\", \"sourceDocumentId\", attributes, \"companyId\", \"createdBy\")\n       VALUES ($1, 1, 'Item', $2, $3, $4, $5)", [
                            "SN-B3001",
                            itemIds[1],
                            JSON.stringify({
                                Receipt: receiptId,
                                "Receipt Line": bracketLine.id,
                                "Receipt Line Index": 0
                            }),
                            companyId,
                            userId
                        ])];
                case 30:
                    _g.sent();
                    _g.label = 31;
                case 31:
                    fastenerLine = receiptLines.find(function (rl) { return rl.itemId === itemIds[2]; });
                    if (!fastenerLine) return [3 /*break*/, 33];
                    return [4 /*yield*/, client.query("INSERT INTO \"trackedEntity\" (\"readableId\", quantity, \"sourceDocument\", \"sourceDocumentId\", attributes, \"companyId\", \"createdBy\")\n       VALUES ($1, 5, 'Item', $2, $3, $4, $5)", [
                            "BATCH-7042",
                            itemIds[2],
                            JSON.stringify({
                                Receipt: receiptId,
                                "Receipt Line": fastenerLine.id
                            }),
                            companyId,
                            userId
                        ])];
                case 32:
                    _g.sent();
                    _g.label = 33;
                case 33:
                    // --- Flow 2: Shipment (auto-print shipment labels) ---
                    console.log("   Flow 2: Shipment SH000001...");
                    return [4 /*yield*/, client.query("INSERT INTO \"salesOrder\" (\n      \"salesOrderId\", \"customerId\", \"currencyCode\", status, \"companyId\", \"createdBy\"\n    ) VALUES ('SO000001', $1, 'USD', 'To Ship', $2, $3) RETURNING id", [customerId, companyId, userId])];
                case 34:
                    soResult = _g.sent();
                    salesOrderId = soResult.rows[0].id;
                    return [4 /*yield*/, client.query("INSERT INTO \"salesOrderShipment\" (id, \"companyId\") VALUES ($1, $2)", [salesOrderId, companyId])];
                case 35:
                    _g.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"salesOrderLine\" (\n      \"salesOrderId\", \"salesOrderLineType\", \"itemId\",\n      \"saleQuantity\", \"unitPrice\", \"unitOfMeasureCode\",\n      \"companyId\", \"createdBy\"\n    ) VALUES ($1, 'Part', $2, 1, 10.00, 'EA', $3, $4)", [salesOrderId, itemIds[0], companyId, userId])];
                case 36:
                    _g.sent();
                    return [4 /*yield*/, client.query("INSERT INTO shipment (\n      \"shipmentId\", \"locationId\", status, \"companyId\", \"createdBy\"\n    ) VALUES ('SH000001', $1, 'Draft', $2, $3) RETURNING id", [locationId, companyId, userId])];
                case 37:
                    shipmentResult = _g.sent();
                    shipmentId = shipmentResult.rows[0].id;
                    return [4 /*yield*/, client.query("INSERT INTO \"shipmentLine\" (\n      \"shipmentId\", \"itemId\",\n      \"orderQuantity\", \"unitOfMeasure\", \"unitPrice\", \"locationId\",\n      \"requiresSerialTracking\",\n      \"companyId\", \"createdBy\"\n    ) VALUES ($1, $2, 1, 'EA', 10.00, $3, true, $4, $5)", [shipmentId, itemIds[0], locationId, companyId, userId])];
                case 38:
                    _g.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"shipmentLine\" WHERE \"shipmentId\" = $1 LIMIT 1", [shipmentId])];
                case 39:
                    shipmentLinesResult = _g.sent();
                    shipmentLineId = (_e = shipmentLinesResult.rows[0]) === null || _e === void 0 ? void 0 : _e.id;
                    if (!shipmentLineId) return [3 /*break*/, 41];
                    return [4 /*yield*/, client.query("INSERT INTO \"trackedEntity\" (\"readableId\", quantity, \"sourceDocument\", \"sourceDocumentId\", attributes, \"companyId\", \"createdBy\")\n       VALUES ($1, 1, 'Item', $2, $3, $4, $5)", [
                            "SN-W1001",
                            itemIds[0],
                            JSON.stringify({
                                Shipment: shipmentId,
                                "Shipment Line": shipmentLineId,
                                "Shipment Line Index": 0
                            }),
                            companyId,
                            userId
                        ])];
                case 40:
                    _g.sent();
                    _g.label = 41;
                case 41:
                    // --- Flow 3: Kanban (auto-print kanban cards) ---
                    console.log("   Flow 3: Kanban for FASTENER-003...");
                    return [4 /*yield*/, client.query("INSERT INTO kanban (\n      \"itemId\", \"replenishmentSystem\", quantity, \"locationId\",\n      \"supplierId\", \"companyId\", \"createdBy\"\n    ) VALUES ($1, 'Buy', 100, $2, $3, $4, $5)", [itemIds[2], locationId, supplierId, companyId, userId])];
                case 42:
                    _g.sent();
                    // --- Flow 4: MES Operation Completion (auto-print operation labels) ---
                    console.log("   Flow 4: Job J000001 with operation...");
                    return [4 /*yield*/, client.query("INSERT INTO \"workCenter\" (name, \"locationId\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4) RETURNING id", ["Assembly Station 1", locationId, companyId, userId])];
                case 43:
                    workCenterResult = _g.sent();
                    workCenterId = workCenterResult.rows[0].id;
                    return [4 /*yield*/, client.query("INSERT INTO process (name, \"defaultStandardFactor\", \"companyId\", \"createdBy\") VALUES ($1, 'Hours/Piece', $2, $3) RETURNING id", ["Assembly", companyId, userId])];
                case 44:
                    processResult = _g.sent();
                    processId = processResult.rows[0].id;
                    return [4 /*yield*/, client.query("INSERT INTO job (\n      \"jobId\", \"itemId\", quantity, \"locationId\", status,\n      \"unitOfMeasureCode\", \"companyId\", \"createdBy\"\n    ) VALUES ('J000001', $1, 2, $2, 'In Progress', 'EA', $3, $4) RETURNING id", [itemIds[3], locationId, companyId, userId])];
                case 45:
                    jobResult = _g.sent();
                    jobId = jobResult.rows[0].id;
                    return [4 /*yield*/, client.query("SELECT id FROM \"jobMakeMethod\" WHERE \"jobId\" = $1 LIMIT 1", [jobId])];
                case 46:
                    jmmResult = _g.sent();
                    if (!(jmmResult.rows.length > 0)) return [3 /*break*/, 47];
                    methodId = jmmResult.rows[0].id;
                    return [3 /*break*/, 49];
                case 47: return [4 /*yield*/, client.query("INSERT INTO \"jobMakeMethod\" (\"jobId\", \"itemId\", \"companyId\", \"createdBy\")\n       VALUES ($1, $2, $3, $4) RETURNING id", [jobId, itemIds[3], companyId, userId])];
                case 48:
                    jmmInsert = _g.sent();
                    methodId = jmmInsert.rows[0].id;
                    _g.label = 49;
                case 49: return [4 /*yield*/, client.query("INSERT INTO \"jobOperation\" (\n      \"jobId\", \"jobMakeMethodId\", \"processId\", \"workCenterId\",\n      \"operationQuantity\", status,\n      \"companyId\", \"createdBy\"\n    ) VALUES ($1, $2, $3, $4, 2, 'In Progress', $5, $6) RETURNING id", [jobId, methodId, processId, workCenterId, companyId, userId])];
                case 50:
                    opResult = _g.sent();
                    operationId = opResult.rows[0].id;
                    // Pre-create tracked entity for serial completion in MES
                    return [4 /*yield*/, client.query("INSERT INTO \"trackedEntity\" (\"readableId\", quantity, \"sourceDocument\", \"sourceDocumentId\", attributes, status, \"companyId\", \"createdBy\")\n     VALUES ($1, 1, 'Item', $2, $3, 'Reserved', $4, $5)", [
                            "SN-G4001",
                            itemIds[3],
                            JSON.stringify({
                                "Job Make Method": methodId,
                                "Job Operation": operationId
                            }),
                            companyId,
                            userId
                        ])];
                case 51:
                    // Pre-create tracked entity for serial completion in MES
                    _g.sent();
                    // --- Configure printing ---
                    console.log("  Configuring printing settings...");
                    return [4 /*yield*/, client.query("UPDATE \"companySettings\" SET printing = $1, \"productLabelSize\" = 'label2x1', \"kanbanOutput\" = 'url' WHERE id = $2", [
                            JSON.stringify({
                                assignments: {}
                            }),
                            companyId
                        ])];
                case 52:
                    _g.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"printerRoute\" (\"companyId\", \"name\", \"format\", \"mediaSizeId\", \"printerUrl\", \"templateId\")\n     VALUES ($1, 'Zebra 2x1', 'zpl', 'label2x1', 'https://your-proxybox-address.pbxz.cloud/api/v1/print/tag_2x1', 'carbon:product-label-2x1'),\n            ($1, 'Document Printer', 'pdf', NULL, 'https://your-proxybox-address.pbxz.cloud/api/v1/print/tag_BWLASER', NULL)\n     RETURNING id, name", [companyId])];
                case 53:
                    printerRouteResult = _g.sent();
                    zplRouteId = (_f = printerRouteResult.rows.find(function (r) { return r.name === "Zebra 2x1"; })) === null || _f === void 0 ? void 0 : _f.id;
                    // Wire the default location to use the ZPL printer with auto-print enabled
                    return [4 /*yield*/, client.query("UPDATE \"companySettings\" SET printing = $1 WHERE id = $2", [
                            JSON.stringify({
                                assignments: (_b = {},
                                    _b[locationId] = {
                                        defaultPrinterRouteId: zplRouteId,
                                        defaultAutoPrint: true,
                                        shipping: { printerRouteId: null, autoPrint: true },
                                        receiving: { printerRouteId: null, autoPrint: true },
                                        workCenters: {}
                                    },
                                    _b)
                            }),
                            companyId
                        ])];
                case 54:
                    // Wire the default location to use the ZPL printer with auto-print enabled
                    _g.sent();
                    // --- Second location + receipt for testing location overrides ---
                    console.log("  Creating second location and receipt for override testing...");
                    return [4 /*yield*/, client.query("INSERT INTO location (name, \"addressLine1\", city, \"stateProvince\", \"postalCode\", \"countryCode\", timezone, \"companyId\", \"createdBy\")\n     VALUES ('Warehouse B', '456 Industrial Blvd', 'Round Rock', 'TX', '78664', 'US', 'America/Chicago', $1, 'system') RETURNING id", [companyId])];
                case 55:
                    location2Result = _g.sent();
                    location2Id = location2Result.rows[0].id;
                    return [4 /*yield*/, client.query("INSERT INTO \"printerRoute\" (\"companyId\", \"locationId\", \"name\", \"format\", \"mediaSizeId\", \"printerUrl\")\n     VALUES ($1, $2, 'Warehouse B Rollo', 'pdf', 'label2x1', 'https://your-proxybox-address.pbxz.cloud/api/v1/print/tag_ROLLO-LABELS')\n     RETURNING id", [companyId, location2Id])];
                case 56:
                    route2Result = _g.sent();
                    route2Id = route2Result.rows[0].id;
                    // Add Warehouse B assignment with the Rollo as default
                    return [4 /*yield*/, client.query("UPDATE \"companySettings\" SET printing = jsonb_set(\n      printing, '{assignments,".concat(location2Id, "}', $1::jsonb\n    ) WHERE id = $2"), [
                            JSON.stringify({
                                defaultPrinterRouteId: route2Id,
                                defaultAutoPrint: false,
                                shipping: { printerRouteId: null, autoPrint: false },
                                receiving: { printerRouteId: null, autoPrint: true },
                                workCenters: {}
                            }),
                            companyId
                        ])];
                case 57:
                    // Add Warehouse B assignment with the Rollo as default
                    _g.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"purchaseOrder\" (\n      \"purchaseOrderId\", \"supplierId\", \"supplierInteractionId\", status, \"purchaseOrderType\",\n      \"exchangeRate\", \"companyId\", \"createdBy\"\n    ) VALUES ('PO000002', $1, $2, 'To Receive', 'Purchase', 1, $3, $4) RETURNING id", [supplierId, supplierInteractionId, companyId, userId])];
                case 58:
                    po2Result = _g.sent();
                    purchaseOrder2Id = po2Result.rows[0].id;
                    return [4 /*yield*/, client.query("INSERT INTO \"purchaseOrderDelivery\" (id, \"companyId\") VALUES ($1, $2)", [purchaseOrder2Id, companyId])];
                case 59:
                    _g.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"purchaseOrderLine\" (\n      \"purchaseOrderId\", \"purchaseOrderLineType\", \"itemId\",\n      \"purchaseQuantity\", \"quantityReceived\", \"quantityInvoiced\",\n      \"supplierUnitPrice\", \"supplierShippingCost\", \"supplierTaxAmount\",\n      \"exchangeRate\", \"setupPrice\", \"conversionFactor\",\n      \"purchaseUnitOfMeasureCode\", \"inventoryUnitOfMeasureCode\",\n      \"companyId\", \"createdBy\"\n    ) VALUES ($1, 'Part', $2, 1, 0, 0, 10.00, 0, 0, 1, 0, 1, 'EA', 'EA', $3, $4) RETURNING id", [purchaseOrder2Id, itemIds[0], companyId, userId])];
                case 60:
                    po2LineResult = _g.sent();
                    po2LineId = po2LineResult.rows[0].id;
                    return [4 /*yield*/, client.query("INSERT INTO receipt (\n      \"receiptId\", \"supplierId\", \"sourceDocument\", \"sourceDocumentId\",\n      \"locationId\", status, \"companyId\", \"createdBy\"\n    ) VALUES ('RE000002', $1, 'Purchase Order', $2, $3, 'Draft', $4, $5) RETURNING id", [supplierId, purchaseOrder2Id, location2Id, companyId, userId])];
                case 61:
                    receipt2Result = _g.sent();
                    receipt2Id = receipt2Result.rows[0].id;
                    return [4 /*yield*/, client.query("INSERT INTO \"receiptLine\" (\n      \"receiptId\", \"lineId\", \"itemId\", \"orderQuantity\", \"receivedQuantity\", \"unitPrice\",\n      \"unitOfMeasure\", \"locationId\",\n      \"requiresSerialTracking\", \"requiresBatchTracking\",\n      \"companyId\", \"createdBy\"\n    ) VALUES ($1, $2, $3, 1, 1, 10.00, 'EA', $4, true, false, $5, $6) RETURNING id", [receipt2Id, po2LineId, itemIds[0], location2Id, companyId, userId])];
                case 62:
                    receipt2LineResult = _g.sent();
                    receipt2LineId = receipt2LineResult.rows[0].id;
                    // Pre-populate tracked entity for receipt 2
                    return [4 /*yield*/, client.query("INSERT INTO \"trackedEntity\" (\"readableId\", quantity, \"sourceDocument\", \"sourceDocumentId\", attributes, \"companyId\", \"createdBy\")\n     VALUES ($1, 1, 'Item', $2, $3, $4, $5)", [
                            "SN-W2001",
                            itemIds[0],
                            JSON.stringify({
                                Receipt: receipt2Id,
                                "Receipt Line": receipt2LineId,
                                "Receipt Line Index": 0
                            }),
                            companyId,
                            userId
                        ])];
                case 63:
                    // Pre-populate tracked entity for receipt 2
                    _g.sent();
                    console.log("   Printing: auto-print ON, label2x1 → your-proxybox-address.pbxz.cloud");
                    console.log("   Receipt RE000001: WIDGET-001 x2, BRACKET-002 x1, FASTENER-003 x5 (tracking pre-filled)");
                    console.log("   Receipt RE000002: WIDGET-001 x1 at Warehouse B (location override test)");
                    console.log("   Shipment SH000001: WIDGET-001 x1 (tracking pre-filled)");
                    console.log("   Kanban: FASTENER-003 Buy x100");
                    console.log("   Job J000001: GEAR-004 x2, operation In Progress (tracked entity SN-G4001)");
                    return [2 /*return*/];
            }
        });
    });
}
