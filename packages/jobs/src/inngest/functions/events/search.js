"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.searchFunction = void 0;
var client_server_1 = require("@carbon/auth/client.server");
var utils_1 = require("@carbon/utils");
var zod_1 = require("zod");
var client_1 = require("../../client");
// Entity configurations matching the existing sync functions
var SEARCH_ENTITY_CONFIGS = {
    employee: {
        entityType: "employee",
        getTitle: function (r) { return r.fullName || ""; },
        getLink: function (r) { return "/x/person/".concat(r.id); },
        getTags: function (r) { return [r.employeeTypeName].filter(Boolean); },
        getMetadata: function (r) { return ({ active: r.active }); },
        enrichRecord: function (record, client) { return __awaiter(void 0, void 0, void 0, function () {
            var user, empType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client
                            .from("user")
                            .select("fullName")
                            .eq("id", record.id)
                            .single()];
                    case 1:
                        user = (_a.sent()).data;
                        return [4 /*yield*/, client
                                .from("employeeType")
                                .select("name")
                                .eq("id", record.employeeTypeId)
                                .single()];
                    case 2:
                        empType = (_a.sent()).data;
                        return [2 /*return*/, __assign(__assign({}, record), { fullName: user === null || user === void 0 ? void 0 : user.fullName, employeeTypeName: empType === null || empType === void 0 ? void 0 : empType.name })];
                }
            });
        }); }
    },
    customer: {
        entityType: "customer",
        getTitle: function (r) { return r.name; },
        getLink: function (r) { return "/x/customer/".concat(r.id); },
        getTags: function (r) { return [r.customerTypeName, r.customerStatusName].filter(Boolean); },
        getMetadata: function (r) { return ({ taxId: r.taxId }); },
        enrichRecord: function (record, client) { return __awaiter(void 0, void 0, void 0, function () {
            var custType, custStatus, tax;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client
                            .from("customerType")
                            .select("name")
                            .eq("id", record.customerTypeId)
                            .single()];
                    case 1:
                        custType = (_a.sent()).data;
                        return [4 /*yield*/, client
                                .from("customerStatus")
                                .select("name")
                                .eq("id", record.customerStatusId)
                                .single()];
                    case 2:
                        custStatus = (_a.sent()).data;
                        return [4 /*yield*/, client
                                .from("customerTax")
                                .select("taxId")
                                .eq("customerId", record.id)
                                .single()];
                    case 3:
                        tax = (_a.sent()).data;
                        return [2 /*return*/, __assign(__assign({}, record), { customerTypeName: custType === null || custType === void 0 ? void 0 : custType.name, customerStatusName: custStatus === null || custStatus === void 0 ? void 0 : custStatus.name, taxId: tax === null || tax === void 0 ? void 0 : tax.taxId })];
                }
            });
        }); }
    },
    supplier: {
        entityType: "supplier",
        getTitle: function (r) { return r.name; },
        getLink: function (r) { return "/x/supplier/".concat(r.id); },
        getTags: function (r) { return [r.supplierTypeName, r.supplierStatus].filter(Boolean); },
        getMetadata: function (r) { return ({ taxId: r.taxId }); },
        enrichRecord: function (record, client) { return __awaiter(void 0, void 0, void 0, function () {
            var suppType, tax;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client
                            .from("supplierType")
                            .select("name")
                            .eq("id", record.supplierTypeId)
                            .single()];
                    case 1:
                        suppType = (_a.sent()).data;
                        return [4 /*yield*/, client
                                .from("supplierTax")
                                .select("taxId")
                                .eq("supplierId", record.id)
                                .single()];
                    case 2:
                        tax = (_a.sent()).data;
                        return [2 /*return*/, __assign(__assign({}, record), { supplierTypeName: suppType === null || suppType === void 0 ? void 0 : suppType.name, taxId: tax === null || tax === void 0 ? void 0 : tax.taxId })];
                }
            });
        }); }
    },
    item: {
        entityType: "item",
        getTitle: function (r) { return r.readableId; },
        getDescription: function (r) { return "".concat(r.name, " ").concat(r.description || ""); },
        getLink: function (r) {
            var typeLinks = {
                Part: "/x/part/",
                Service: "/x/service/",
                Tool: "/x/tool/",
                Consumable: "/x/consumable/",
                Material: "/x/material/",
                Fixture: "/x/fixture/"
            };
            return (typeLinks[r.type] || "/x/part/") + r.id;
        },
        getTags: function (r) { return [r.type, r.replenishmentSystem].filter(Boolean); },
        getMetadata: function (r) { return ({ active: r.active }); }
    },
    job: {
        entityType: "job",
        getTitle: function (r) { return r.jobId; },
        getDescription: function (r) { return "".concat(r.itemName || "", " ").concat(r.customerName || ""); },
        getLink: function (r) { return "/x/job/".concat(r.id); },
        getTags: function (r) { return [r.status, r.deadlineType].filter(Boolean); },
        getMetadata: function (r) { return ({ quantity: r.quantity, dueDate: r.dueDate }); },
        enrichRecord: function (record, client) { return __awaiter(void 0, void 0, void 0, function () {
            var item, customer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client
                            .from("item")
                            .select("name")
                            .eq("id", record.itemId)
                            .single()];
                    case 1:
                        item = (_a.sent()).data;
                        return [4 /*yield*/, client
                                .from("customer")
                                .select("name")
                                .eq("id", record.customerId)
                                .single()];
                    case 2:
                        customer = (_a.sent()).data;
                        return [2 /*return*/, __assign(__assign({}, record), { itemName: item === null || item === void 0 ? void 0 : item.name, customerName: customer === null || customer === void 0 ? void 0 : customer.name })];
                }
            });
        }); }
    },
    purchaseOrder: {
        entityType: "purchaseOrder",
        getTitle: function (r) { return r.purchaseOrderId; },
        getDescription: function (r) { return r.supplierName || ""; },
        getLink: function (r) { return "/x/purchase-order/".concat(r.id); },
        getTags: function (r) { return [r.status].filter(Boolean); },
        getMetadata: function (r) { return ({
            orderDate: r.orderDate,
            supplierReference: r.supplierReference
        }); },
        enrichRecord: function (record, client) { return __awaiter(void 0, void 0, void 0, function () {
            var supplier;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client
                            .from("supplier")
                            .select("name")
                            .eq("id", record.supplierId)
                            .single()];
                    case 1:
                        supplier = (_a.sent()).data;
                        return [2 /*return*/, __assign(__assign({}, record), { supplierName: supplier === null || supplier === void 0 ? void 0 : supplier.name })];
                }
            });
        }); }
    },
    salesInvoice: {
        entityType: "salesInvoice",
        getTitle: function (r) { return r.invoiceId; },
        getDescription: function (r) { return r.customerName || ""; },
        getLink: function (r) { return "/x/sales-invoice/".concat(r.id); },
        getTags: function (r) { return [r.status].filter(Boolean); },
        getMetadata: function (r) { return ({ totalAmount: r.totalAmount, dateDue: r.dateDue }); },
        enrichRecord: function (record, client) { return __awaiter(void 0, void 0, void 0, function () {
            var customer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client
                            .from("customer")
                            .select("name")
                            .eq("id", record.customerId)
                            .single()];
                    case 1:
                        customer = (_a.sent()).data;
                        return [2 /*return*/, __assign(__assign({}, record), { customerName: customer === null || customer === void 0 ? void 0 : customer.name })];
                }
            });
        }); }
    },
    purchaseInvoice: {
        entityType: "purchaseInvoice",
        getTitle: function (r) { return r.invoiceId; },
        getDescription: function (r) { return r.supplierName || ""; },
        getLink: function (r) { return "/x/purchase-invoice/".concat(r.id); },
        getTags: function (r) { return [r.status].filter(Boolean); },
        getMetadata: function (r) { return ({ totalAmount: r.totalAmount, dateDue: r.dateDue }); },
        enrichRecord: function (record, client) { return __awaiter(void 0, void 0, void 0, function () {
            var supplier;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client
                            .from("supplier")
                            .select("name")
                            .eq("id", record.supplierId)
                            .single()];
                    case 1:
                        supplier = (_a.sent()).data;
                        return [2 /*return*/, __assign(__assign({}, record), { supplierName: supplier === null || supplier === void 0 ? void 0 : supplier.name })];
                }
            });
        }); }
    },
    nonConformance: {
        entityType: "issue",
        getTitle: function (r) { return r.nonConformanceId; },
        getDescription: function (r) { return "".concat(r.name, " ").concat(r.description || ""); },
        getLink: function (r) { return "/x/issue/".concat(r.id); },
        getTags: function (r) { return [r.status, r.priority, r.ncTypeName].filter(Boolean); },
        getMetadata: function (r) { return ({ source: r.source, dueDate: r.dueDate }); },
        enrichRecord: function (record, client) { return __awaiter(void 0, void 0, void 0, function () {
            var ncType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client
                            .from("nonConformanceType")
                            .select("name")
                            .eq("id", record.nonConformanceTypeId)
                            .single()];
                    case 1:
                        ncType = (_a.sent()).data;
                        return [2 /*return*/, __assign(__assign({}, record), { ncTypeName: ncType === null || ncType === void 0 ? void 0 : ncType.name })];
                }
            });
        }); }
    },
    gauge: {
        entityType: "gauge",
        getTitle: function (r) { return r.gaugeId; },
        getDescription: function (r) { return "".concat(r.description || "", " ").concat(r.serialNumber || ""); },
        getLink: function (r) { return "/x/quality/gauges/".concat(r.id); },
        getTags: function (r) {
            return [r.gaugeStatus, r.gaugeCalibrationStatus, r.gaugeTypeName].filter(Boolean);
        },
        getMetadata: function (r) { return ({
            nextCalibrationDate: r.nextCalibrationDate,
            serialNumber: r.serialNumber
        }); },
        enrichRecord: function (record, client) { return __awaiter(void 0, void 0, void 0, function () {
            var gaugeType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client
                            .from("gaugeType")
                            .select("name")
                            .eq("id", record.gaugeTypeId)
                            .single()];
                    case 1:
                        gaugeType = (_a.sent()).data;
                        return [2 /*return*/, __assign(__assign({}, record), { gaugeTypeName: gaugeType === null || gaugeType === void 0 ? void 0 : gaugeType.name })];
                }
            });
        }); }
    },
    quote: {
        entityType: "quote",
        getTitle: function (r) { return r.quoteId; },
        getDescription: function (r) {
            return "".concat(r.customerName || "", " ").concat(r.customerReference || "");
        },
        getLink: function (r) { return "/x/quote/".concat(r.id); },
        getTags: function (r) { return [r.status].filter(Boolean); },
        getMetadata: function (r) { return ({
            customerId: r.customerId,
            expirationDate: r.expirationDate,
            customerReference: r.customerReference
        }); },
        enrichRecord: function (record, client) { return __awaiter(void 0, void 0, void 0, function () {
            var customer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client
                            .from("customer")
                            .select("name")
                            .eq("id", record.customerId)
                            .single()];
                    case 1:
                        customer = (_a.sent()).data;
                        return [2 /*return*/, __assign(__assign({}, record), { customerName: customer === null || customer === void 0 ? void 0 : customer.name })];
                }
            });
        }); }
    },
    salesRfq: {
        entityType: "salesRfq",
        getTitle: function (r) { return r.rfqId; },
        getDescription: function (r) { return r.customerName || ""; },
        getLink: function (r) { return "/x/rfq/".concat(r.id); },
        getTags: function (r) { return [r.status].filter(Boolean); },
        getMetadata: function (r) { return ({
            customerId: r.customerId,
            expirationDate: r.expirationDate
        }); },
        enrichRecord: function (record, client) { return __awaiter(void 0, void 0, void 0, function () {
            var customer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client
                            .from("customer")
                            .select("name")
                            .eq("id", record.customerId)
                            .single()];
                    case 1:
                        customer = (_a.sent()).data;
                        return [2 /*return*/, __assign(__assign({}, record), { customerName: customer === null || customer === void 0 ? void 0 : customer.name })];
                }
            });
        }); }
    },
    salesOrder: {
        entityType: "salesOrder",
        getTitle: function (r) { return r.salesOrderId; },
        getDescription: function (r) {
            return "".concat(r.customerName || "", " ").concat(r.customerReference || "");
        },
        getLink: function (r) { return "/x/sales-order/".concat(r.id); },
        getTags: function (r) { return [r.status].filter(Boolean); },
        getMetadata: function (r) { return ({
            customerId: r.customerId,
            orderDate: r.orderDate,
            customerReference: r.customerReference
        }); },
        enrichRecord: function (record, client) { return __awaiter(void 0, void 0, void 0, function () {
            var customer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client
                            .from("customer")
                            .select("name")
                            .eq("id", record.customerId)
                            .single()];
                    case 1:
                        customer = (_a.sent()).data;
                        return [2 /*return*/, __assign(__assign({}, record), { customerName: customer === null || customer === void 0 ? void 0 : customer.name })];
                }
            });
        }); }
    },
    supplierQuote: {
        entityType: "supplierQuote",
        getTitle: function (r) { return r.supplierQuoteId; },
        getDescription: function (r) { return r.supplierName || ""; },
        getLink: function (r) { return "/x/supplier-quote/".concat(r.id); },
        getTags: function (r) { return [r.status].filter(Boolean); },
        getMetadata: function (r) { return ({
            supplierId: r.supplierId,
            expirationDate: r.expirationDate
        }); },
        enrichRecord: function (record, client) { return __awaiter(void 0, void 0, void 0, function () {
            var supplier;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client
                            .from("supplier")
                            .select("name")
                            .eq("id", record.supplierId)
                            .single()];
                    case 1:
                        supplier = (_a.sent()).data;
                        return [2 /*return*/, __assign(__assign({}, record), { supplierName: supplier === null || supplier === void 0 ? void 0 : supplier.name })];
                }
            });
        }); }
    }
};
var SearchRecordSchema = zod_1.z.object({
    event: zod_1.z.object({
        table: zod_1.z.string(),
        operation: zod_1.z.enum(["INSERT", "UPDATE", "DELETE", "TRUNCATE"]),
        recordId: zod_1.z.string(),
        new: zod_1.z.record(zod_1.z.any()).nullable(),
        old: zod_1.z.record(zod_1.z.any()).nullable(),
        timestamp: zod_1.z.string()
    }),
    companyId: zod_1.z.string()
});
var SearchPayloadSchema = zod_1.z.object({
    records: zod_1.z.array(SearchRecordSchema)
});
exports.searchFunction = client_1.inngest.createFunction({
    id: "event-handler-search",
    retries: 3
}, { event: "carbon/event-search" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var payload, results, client, byCompany, _loop_1, _i, _c, _d, companyId, records;
    var event = _b.event, step = _b.step;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                payload = SearchPayloadSchema.parse(event.data);
                console.log("Processing ".concat(payload.records.length, " search index events"));
                results = {
                    updated: 0,
                    deleted: 0,
                    skipped: 0,
                    failed: 0
                };
                client = (0, client_server_1.getCarbonServiceRole)();
                byCompany = (0, utils_1.groupBy)(payload.records, function (r) { return r.companyId; });
                _loop_1 = function (companyId, records) {
                    var companyResult;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                if (!companyId || companyId === "undefined") {
                                    results.skipped += records.length;
                                    return [2 /*return*/, "continue"];
                                }
                                return [4 /*yield*/, step.run("search-index-".concat(companyId), function () { return __awaiter(void 0, void 0, void 0, function () {
                                        var stepResults, deletes, _i, deletes_1, del, config, error_1, upserts, _a, upserts_1, upsert, config, record, title, description, link, tags, metadata, error_2;
                                        var _b;
                                        return __generator(this, function (_c) {
                                            switch (_c.label) {
                                                case 0:
                                                    stepResults = { updated: 0, deleted: 0, skipped: 0, failed: 0 };
                                                    deletes = records.filter(function (r) {
                                                        return r.event.operation === "DELETE" || r.event.operation === "TRUNCATE";
                                                    });
                                                    _i = 0, deletes_1 = deletes;
                                                    _c.label = 1;
                                                case 1:
                                                    if (!(_i < deletes_1.length)) return [3 /*break*/, 6];
                                                    del = deletes_1[_i];
                                                    config = SEARCH_ENTITY_CONFIGS[del.event.table];
                                                    if (!config) {
                                                        stepResults.skipped++;
                                                        return [3 /*break*/, 5];
                                                    }
                                                    _c.label = 2;
                                                case 2:
                                                    _c.trys.push([2, 4, , 5]);
                                                    return [4 /*yield*/, client.rpc("delete_from_search_index", {
                                                            p_company_id: companyId,
                                                            p_entity_type: config.entityType,
                                                            p_entity_id: del.event.recordId
                                                        })];
                                                case 3:
                                                    _c.sent();
                                                    stepResults.deleted++;
                                                    return [3 /*break*/, 5];
                                                case 4:
                                                    error_1 = _c.sent();
                                                    console.error("Failed to delete from search index:", {
                                                        error: error_1,
                                                        record: del
                                                    });
                                                    stepResults.failed++;
                                                    return [3 /*break*/, 5];
                                                case 5:
                                                    _i++;
                                                    return [3 /*break*/, 1];
                                                case 6:
                                                    upserts = records.filter(function (r) {
                                                        return r.event.operation === "INSERT" || r.event.operation === "UPDATE";
                                                    });
                                                    _a = 0, upserts_1 = upserts;
                                                    _c.label = 7;
                                                case 7:
                                                    if (!(_a < upserts_1.length)) return [3 /*break*/, 16];
                                                    upsert = upserts_1[_a];
                                                    config = SEARCH_ENTITY_CONFIGS[upsert.event.table];
                                                    if (!config) {
                                                        stepResults.skipped++;
                                                        return [3 /*break*/, 15];
                                                    }
                                                    _c.label = 8;
                                                case 8:
                                                    _c.trys.push([8, 14, , 15]);
                                                    record = upsert.event.new;
                                                    if (!(upsert.event.table === "employee" &&
                                                        record.active === false)) return [3 /*break*/, 10];
                                                    return [4 /*yield*/, client.rpc("delete_from_search_index", {
                                                            p_company_id: companyId,
                                                            p_entity_type: config.entityType,
                                                            p_entity_id: upsert.event.recordId
                                                        })];
                                                case 9:
                                                    _c.sent();
                                                    stepResults.deleted++;
                                                    return [3 /*break*/, 15];
                                                case 10:
                                                    if (!config.enrichRecord) return [3 /*break*/, 12];
                                                    return [4 /*yield*/, config.enrichRecord(record, client)];
                                                case 11:
                                                    record = _c.sent();
                                                    _c.label = 12;
                                                case 12:
                                                    title = config.getTitle(record);
                                                    description = ((_b = config.getDescription) === null || _b === void 0 ? void 0 : _b.call(config, record)) || "";
                                                    link = config.getLink(record);
                                                    tags = config.getTags(record);
                                                    metadata = config.getMetadata(record);
                                                    return [4 /*yield*/, client.rpc("upsert_to_search_index", {
                                                            p_company_id: companyId,
                                                            p_entity_type: config.entityType,
                                                            p_entity_id: upsert.event.recordId,
                                                            p_title: title,
                                                            p_description: description,
                                                            p_link: link,
                                                            p_tags: tags,
                                                            p_metadata: metadata
                                                        })];
                                                case 13:
                                                    _c.sent();
                                                    stepResults.updated++;
                                                    return [3 /*break*/, 15];
                                                case 14:
                                                    error_2 = _c.sent();
                                                    console.error("Failed to update search index:", {
                                                        error: error_2,
                                                        record: upsert
                                                    });
                                                    stepResults.failed++;
                                                    return [3 /*break*/, 15];
                                                case 15:
                                                    _a++;
                                                    return [3 /*break*/, 7];
                                                case 16: return [2 /*return*/, stepResults];
                                            }
                                        });
                                    }); })];
                            case 1:
                                companyResult = _f.sent();
                                results.updated += companyResult.updated;
                                results.deleted += companyResult.deleted;
                                results.skipped += companyResult.skipped;
                                results.failed += companyResult.failed;
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _c = Object.entries(byCompany);
                _e.label = 1;
            case 1:
                if (!(_i < _c.length)) return [3 /*break*/, 4];
                _d = _c[_i], companyId = _d[0], records = _d[1];
                return [5 /*yield**/, _loop_1(companyId, records)];
            case 2:
                _e.sent();
                _e.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                console.log("Search function completed", results);
                return [2 /*return*/, results];
        }
    });
}); });
