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
exports.assign = assign;
exports.getCustomFieldsCacheKey = getCustomFieldsCacheKey;
exports.getCustomFieldsSchemas = getCustomFieldsSchemas;
exports.generateAndAttachSalesOrderPdf = generateAndAttachSalesOrderPdf;
exports.sendSalesOrderEmail = sendSalesOrderEmail;
exports.getOrCreatePeriods = getOrCreatePeriods;
var email_1 = require("@carbon/documents/email");
var jobs_1 = require("@carbon/jobs");
var kv_1 = require("@carbon/kv");
var date_1 = require("@internationalized/date");
var components_1 = require("@react-email/components");
var accounting_1 = require("~/modules/accounting");
var sales_1 = require("~/modules/sales");
var settings_1 = require("~/modules/settings");
var users_server_1 = require("~/modules/users/users.server");
var database_server_1 = require("~/services/database.server");
var string_1 = require("~/utils/string");
var documents_service_1 = require("../documents/documents.service");
function assign(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var id, table, assignee;
        return __generator(this, function (_a) {
            id = args.id, table = args.table, assignee = args.assignee;
            return [2 /*return*/, (client
                    // @ts-ignore
                    .from(table)
                    .update(__assign({ assignee: assignee ? assignee : null }, (table === "job" || table === "jobOperation"
                    ? { assignedAt: assignee ? new Date().toISOString() : null }
                    : {})))
                    .eq("id", id))];
        });
    });
}
function getCustomFieldsCacheKey(args) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            return [2 /*return*/, "customFields:".concat(args === null || args === void 0 ? void 0 : args.companyId, ":").concat((_a = args === null || args === void 0 ? void 0 : args.module) !== null && _a !== void 0 ? _a : "", ":").concat((_b = args === null || args === void 0 ? void 0 : args.table) !== null && _b !== void 0 ? _b : "")];
        });
    });
}
function getCustomFieldsSchemas(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var key, schema, cachedSchema, query, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCustomFieldsCacheKey(args)];
                case 1:
                    key = _a.sent();
                    schema = null;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 8]);
                    return [4 /*yield*/, kv_1.redis.get(key)];
                case 3:
                    cachedSchema = _a.sent();
                    if (cachedSchema) {
                        schema = JSON.parse(cachedSchema);
                    }
                    return [3 /*break*/, 8];
                case 4:
                    if (schema) {
                        return [2 /*return*/, {
                                data: schema,
                                error: null
                            }];
                    }
                    query = client.from("customFieldTables").select("*");
                    if (args === null || args === void 0 ? void 0 : args.companyId) {
                        query.eq("companyId", args.companyId);
                    }
                    if (args === null || args === void 0 ? void 0 : args.module) {
                        query.eq("module", args.module);
                    }
                    if (args === null || args === void 0 ? void 0 : args.table) {
                        query.eq("table", args.table);
                    }
                    return [4 /*yield*/, query];
                case 5:
                    result = _a.sent();
                    if (!result.data) return [3 /*break*/, 7];
                    return [4 /*yield*/, kv_1.redis.set(key, JSON.stringify(result.data))];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [2 /*return*/, result];
                case 8: return [2 /*return*/];
            }
        });
    });
}
/**
 * Generates a sales order PDF via the pdfLoader, uploads it to Supabase
 * storage under the opportunity path, and creates a document DB record.
 *
 * Returns the PDF ArrayBuffer (useful for email attachments) and the
 * generated file name.
 */
function generateAndAttachSalesOrderPdf(args) {
    return __awaiter(this, void 0, void 0, function () {
        var routeArgs, salesOrderId, salesOrderIdentifier, opportunityId, companyId, userId, serviceRole, pdfLoader, pdfArgs, pdf, file, fileName, documentFilePath, uploadResult, documentResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    routeArgs = args.routeArgs, salesOrderId = args.salesOrderId, salesOrderIdentifier = args.salesOrderIdentifier, opportunityId = args.opportunityId, companyId = args.companyId, userId = args.userId, serviceRole = args.serviceRole, pdfLoader = args.pdfLoader;
                    pdfArgs = __assign(__assign({}, routeArgs), { params: __assign(__assign({}, routeArgs.params), { id: salesOrderId }) });
                    return [4 /*yield*/, pdfLoader(pdfArgs)];
                case 1:
                    pdf = _a.sent();
                    if (pdf.headers.get("content-type") !== "application/pdf") {
                        throw new Error("Failed to generate PDF");
                    }
                    return [4 /*yield*/, pdf.arrayBuffer()];
                case 2:
                    file = _a.sent();
                    fileName = (0, string_1.stripSpecialCharacters)("".concat(salesOrderIdentifier, " - ").concat(new Date().toISOString().slice(0, -5), ".pdf"));
                    documentFilePath = "".concat(companyId, "/opportunity/").concat(opportunityId, "/").concat(fileName);
                    return [4 /*yield*/, serviceRole.storage
                            .from("private")
                            .upload(documentFilePath, file, {
                            cacheControl: "".concat(12 * 60 * 60),
                            contentType: "application/pdf",
                            upsert: true
                        })];
                case 3:
                    uploadResult = _a.sent();
                    if (uploadResult.error) {
                        throw new Error("Failed to upload PDF to storage");
                    }
                    return [4 /*yield*/, (0, documents_service_1.upsertDocument)(serviceRole, {
                            path: documentFilePath,
                            name: fileName,
                            size: Math.round(file.byteLength / 1024),
                            sourceDocument: "Sales Order",
                            sourceDocumentId: salesOrderId,
                            readGroups: [userId],
                            writeGroups: [userId],
                            createdBy: userId,
                            companyId: companyId
                        })];
                case 4:
                    documentResult = _a.sent();
                    if (documentResult.error) {
                        throw new Error("Failed to create document record");
                    }
                    return [2 /*return*/, { file: file, fileName: fileName, documentFilePath: documentFilePath }];
            }
        });
    });
}
/**
 * Sends a sales order confirmation email with the PDF attached.
 *
 * This mirrors the email-sending logic originally in the confirm action
 * and can be reused by the quote-to-order conversion flow.
 */
function sendSalesOrderEmail(args) {
    return __awaiter(this, void 0, void 0, function () {
        var salesOrderId, companyId, userId, customerContactId, ccSelections, documentFilePath, fileName, serviceRole, locales, _a, company, customer, salesOrder, salesOrderLines, salesOrderLocations, seller, paymentTerms, emailTemplate, html, text, signedUrlData;
        var _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    salesOrderId = args.salesOrderId, companyId = args.companyId, userId = args.userId, customerContactId = args.customerContactId, ccSelections = args.cc, documentFilePath = args.documentFilePath, fileName = args.fileName, serviceRole = args.serviceRole, locales = args.locales;
                    return [4 /*yield*/, Promise.all([
                            (0, settings_1.getCompany)(serviceRole, companyId),
                            (0, sales_1.getCustomerContact)(serviceRole, customerContactId),
                            (0, sales_1.getSalesOrder)(serviceRole, salesOrderId),
                            (0, sales_1.getSalesOrderLines)(serviceRole, salesOrderId),
                            (0, sales_1.getSalesOrderCustomerDetails)(serviceRole, salesOrderId),
                            (0, users_server_1.getUser)(serviceRole, userId),
                            (0, accounting_1.getPaymentTermsList)(serviceRole, companyId)
                        ])];
                case 1:
                    _a = _k.sent(), company = _a[0], customer = _a[1], salesOrder = _a[2], salesOrderLines = _a[3], salesOrderLocations = _a[4], seller = _a[5], paymentTerms = _a[6];
                    if (!((_b = customer === null || customer === void 0 ? void 0 : customer.data) === null || _b === void 0 ? void 0 : _b.contact)) {
                        return [2 /*return*/, { success: false, message: "Failed to get customer contact" }];
                    }
                    if (!company.data) {
                        return [2 /*return*/, { success: false, message: "Failed to get company" }];
                    }
                    if (!seller.data) {
                        return [2 /*return*/, { success: false, message: "Failed to get user" }];
                    }
                    if (!salesOrder.data) {
                        return [2 /*return*/, { success: false, message: "Failed to get sales order" }];
                    }
                    if (!salesOrderLocations.data) {
                        return [2 /*return*/, { success: false, message: "Failed to get sales order locations" }];
                    }
                    if (!paymentTerms.data) {
                        return [2 /*return*/, { success: false, message: "Failed to get payment terms" }];
                    }
                    emailTemplate = (0, email_1.SalesOrderEmail)({
                        company: company.data,
                        locale: (_c = locales === null || locales === void 0 ? void 0 : locales[0]) !== null && _c !== void 0 ? _c : "en-US",
                        salesOrder: salesOrder.data,
                        salesOrderLines: (_d = salesOrderLines.data) !== null && _d !== void 0 ? _d : [],
                        salesOrderLocations: salesOrderLocations.data,
                        recipient: {
                            email: customer.data.contact.email,
                            firstName: (_e = customer.data.contact.firstName) !== null && _e !== void 0 ? _e : undefined,
                            lastName: (_f = customer.data.contact.lastName) !== null && _f !== void 0 ? _f : undefined
                        },
                        sender: {
                            email: (_g = seller.data.email) !== null && _g !== void 0 ? _g : "",
                            firstName: seller.data.firstName,
                            lastName: seller.data.lastName
                        },
                        paymentTerms: paymentTerms.data
                    });
                    return [4 /*yield*/, (0, components_1.renderAsync)(emailTemplate)];
                case 2:
                    html = _k.sent();
                    return [4 /*yield*/, (0, components_1.renderAsync)(emailTemplate, { plainText: true })];
                case 3:
                    text = _k.sent();
                    return [4 /*yield*/, serviceRole.storage
                            .from("private")
                            .createSignedUrl(documentFilePath, 3600)];
                case 4:
                    signedUrlData = (_k.sent()).data;
                    return [4 /*yield*/, (0, jobs_1.trigger)("send-email", {
                            to: [(_h = seller.data.email) !== null && _h !== void 0 ? _h : "", customer.data.contact.email],
                            cc: (ccSelections === null || ccSelections === void 0 ? void 0 : ccSelections.length) ? ccSelections : undefined,
                            from: (_j = seller.data.email) !== null && _j !== void 0 ? _j : "",
                            subject: "Order ".concat(salesOrder.data.salesOrderId, " from ").concat(company.data.name),
                            html: html,
                            text: text,
                            attachments: (signedUrlData === null || signedUrlData === void 0 ? void 0 : signedUrlData.signedUrl)
                                ? [
                                    {
                                        path: signedUrlData.signedUrl,
                                        filename: fileName
                                    }
                                ]
                                : undefined,
                            companyId: companyId
                        })];
                case 5:
                    _k.sent();
                    return [2 /*return*/, { success: true }];
            }
        });
    });
}
function getOrCreatePeriods(today, weeksToProject) {
    return __awaiter(this, void 0, void 0, function () {
        var start, ranges, currentStart, i, periodEnd, db, existingPeriods, periodByStartDate, _i, existingPeriods_1, period, startDate, periodsToCreate, created, _a, created_1, period, startDate;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    start = (0, date_1.startOfWeek)(today, "en-US");
                    ranges = [];
                    currentStart = start;
                    for (i = 0; i < weeksToProject; i++) {
                        periodEnd = currentStart.add({ days: 6 });
                        ranges.push({
                            startDate: currentStart.toString(),
                            endDate: periodEnd.toString()
                        });
                        currentStart = periodEnd.add({ days: 1 });
                    }
                    db = (0, database_server_1.getDatabaseClient)();
                    return [4 /*yield*/, db
                            .selectFrom("period")
                            .selectAll()
                            .where("startDate", "in", ranges.map(function (r) { return r.startDate; }))
                            .where("periodType", "=", "Week")
                            .orderBy("createdAt", "asc")
                            .execute()];
                case 1:
                    existingPeriods = _b.sent();
                    periodByStartDate = new Map();
                    for (_i = 0, existingPeriods_1 = existingPeriods; _i < existingPeriods_1.length; _i++) {
                        period = existingPeriods_1[_i];
                        startDate = dateToString(period.startDate);
                        if (!periodByStartDate.has(startDate)) {
                            periodByStartDate.set(startDate, period);
                        }
                    }
                    periodsToCreate = ranges.filter(function (r) { return !periodByStartDate.has(r.startDate); });
                    if (periodsToCreate.length === 0) {
                        return [2 /*return*/, ranges.map(function (r) {
                                return toPlainPeriod(periodByStartDate.get(r.startDate));
                            })];
                    }
                    return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, trx
                                            .insertInto("period")
                                            .values(periodsToCreate.map(function (p) { return ({
                                            startDate: p.startDate,
                                            endDate: p.endDate,
                                            periodType: "Week",
                                            createdAt: new Date().toISOString()
                                        }); }))
                                            .returningAll()
                                            .execute()];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                case 2:
                    created = _b.sent();
                    for (_a = 0, created_1 = created; _a < created_1.length; _a++) {
                        period = created_1[_a];
                        startDate = dateToString(period.startDate);
                        if (!periodByStartDate.has(startDate)) {
                            periodByStartDate.set(startDate, period);
                        }
                    }
                    return [2 /*return*/, ranges.map(function (r) { return toPlainPeriod(periodByStartDate.get(r.startDate)); })];
            }
        });
    });
}
/** Convert a pg DATE value (Date object or string) to an ISO date string. */
function dateToString(value) {
    if (value instanceof Date) {
        // Use local date parts to avoid timezone shift from toISOString()
        var y = value.getFullYear();
        var m = String(value.getMonth() + 1).padStart(2, "0");
        var d = String(value.getDate()).padStart(2, "0");
        return "".concat(y, "-").concat(m, "-").concat(d);
    }
    return String(value);
}
/** Return a plain JSON-safe object with only the fields consumers need. */
function toPlainPeriod(p) {
    return {
        id: String(p.id),
        startDate: dateToString(p.startDate),
        endDate: dateToString(p.endDate),
        periodType: p.periodType
    };
}
