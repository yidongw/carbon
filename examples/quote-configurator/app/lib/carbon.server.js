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
exports.carbon = exports.quoteStatusType = exports.quoteLineStatusType = void 0;
var supabase_js_1 = require("@supabase/supabase-js");
var config_1 = require("~/config");
exports.quoteLineStatusType = [
    "Not Started",
    "In Progress",
    "Complete",
    "No Quote"
];
exports.quoteStatusType = [
    "Draft",
    "Sent",
    "Ordered",
    "Partial",
    "Lost",
    "Cancelled",
    "Expired"
];
var CarbonClient = /** @class */ (function () {
    function CarbonClient() {
        this.appUrl = config_1.CARBON_APP_URL;
        this.companyId = config_1.CARBON_COMPANY_ID;
        this.client = (0, supabase_js_1.createClient)(config_1.CARBON_API_URL, config_1.CARBON_PUBLIC_KEY, {
            global: {
                headers: {
                    "carbon-key": config_1.CARBON_API_KEY
                }
            }
        });
    }
    CarbonClient.prototype.getCustomer = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.from("customer").select("*").eq("id", id).single()];
            });
        });
    };
    CarbonClient.prototype.getCustomerByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client
                            .from("customerContact")
                            .select("customerId, contact(email, companyId)")
                            .eq("contact.email", email)
                            .eq("contact.companyId", this.companyId)
                            .maybeSingle()];
                    case 1:
                        result = _a.sent();
                        if (result.error) {
                            return [2 /*return*/, result];
                        }
                        if (!result.data) {
                            return [2 /*return*/, {
                                    data: null,
                                    error: "Customer not found"
                                }];
                        }
                        return [2 /*return*/, {
                                data: result.data.customerId,
                                error: null
                            }];
                }
            });
        });
    };
    CarbonClient.prototype.getCustomerPayment = function (customerId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client
                        .from("customerPayment")
                        .select("*")
                        .eq("customerId", customerId)
                        .single()];
            });
        });
    };
    CarbonClient.prototype.getCustomerShipping = function (customerId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client
                        .from("customerShipping")
                        .select("*")
                        .eq("customerId", customerId)
                        .single()];
            });
        });
    };
    CarbonClient.prototype.getNextSequence = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.rpc("get_next_sequence", {
                        sequence_name: table,
                        company_id: this.companyId
                    })];
            });
        });
    };
    CarbonClient.prototype.deleteQuote = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.from("quote").delete().eq("id", id)];
            });
        });
    };
    CarbonClient.prototype.getQuote = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.from("quote").select("*").eq("id", id).single()];
            });
        });
    };
    CarbonClient.prototype.upsertQuote = function (quote) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, customerPayment, customerShipping, _b, paymentTermId, invoiceCustomerId, invoiceCustomerContactId, invoiceCustomerLocationId, _c, shippingMethodId, shippingTermId, insert, quoteId, _d, shipment, payment, opportunity, externalLink;
            var _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!!("id" in quote)) return [3 /*break*/, 12];
                        return [4 /*yield*/, Promise.all([
                                this.getCustomerPayment(quote.customerId),
                                this.getCustomerShipping(quote.customerId)
                            ])];
                    case 1:
                        _a = _f.sent(), customerPayment = _a[0], customerShipping = _a[1];
                        if (customerPayment.error)
                            return [2 /*return*/, customerPayment];
                        if (customerShipping.error)
                            return [2 /*return*/, customerShipping];
                        _b = customerPayment.data, paymentTermId = _b.paymentTermId, invoiceCustomerId = _b.invoiceCustomerId, invoiceCustomerContactId = _b.invoiceCustomerContactId, invoiceCustomerLocationId = _b.invoiceCustomerLocationId;
                        _c = customerShipping.data, shippingMethodId = _c.shippingMethodId, shippingTermId = _c.shippingTermId;
                        return [4 /*yield*/, this.client
                                .from("quote")
                                .insert([__assign(__assign({}, quote), { companyId: this.companyId })])
                                .select("id, quoteId")
                                .single()];
                    case 2:
                        insert = _f.sent();
                        if (insert.error) {
                            console.error(insert.error);
                            return [2 /*return*/, insert];
                        }
                        quoteId = (_e = insert.data) === null || _e === void 0 ? void 0 : _e.id;
                        if (!quoteId)
                            return [2 /*return*/, insert];
                        return [4 /*yield*/, Promise.all([
                                this.client.from("quoteShipment").insert([
                                    {
                                        id: quoteId,
                                        shippingMethodId: shippingMethodId,
                                        shippingTermId: shippingTermId,
                                        companyId: this.companyId
                                    }
                                ]),
                                this.client.from("quotePayment").insert([
                                    {
                                        id: quoteId,
                                        invoiceCustomerId: invoiceCustomerId,
                                        invoiceCustomerContactId: invoiceCustomerContactId,
                                        invoiceCustomerLocationId: invoiceCustomerLocationId,
                                        paymentTermId: paymentTermId,
                                        companyId: this.companyId
                                    }
                                ]),
                                this.client
                                    .from("opportunity")
                                    .insert([{ quoteId: quoteId, companyId: this.companyId }]),
                                this.upsertExternalLink({
                                    documentType: "Quote",
                                    documentId: quoteId,
                                    customerId: quote.customerId,
                                    expiresAt: quote.expirationDate,
                                    companyId: this.companyId
                                })
                            ])];
                    case 3:
                        _d = _f.sent(), shipment = _d[0], payment = _d[1], opportunity = _d[2], externalLink = _d[3];
                        if (!shipment.error) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.deleteQuote(quoteId)];
                    case 4:
                        _f.sent();
                        return [2 /*return*/, payment];
                    case 5:
                        if (!payment.error) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.deleteQuote(quoteId)];
                    case 6:
                        _f.sent();
                        return [2 /*return*/, payment];
                    case 7:
                        if (!opportunity.error) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.deleteQuote(quoteId)];
                    case 8:
                        _f.sent();
                        return [2 /*return*/, opportunity];
                    case 9:
                        if (!externalLink.data) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.client
                                .from("quote")
                                .update({ externalLinkId: externalLink.data.id })
                                .eq("id", quoteId)];
                    case 10:
                        _f.sent();
                        _f.label = 11;
                    case 11: return [2 /*return*/, insert];
                    case 12: return [2 /*return*/, this.client
                            .from("quote")
                            .update(__assign(__assign({}, this.sanitize(quote)), { updatedAt: new Date().toISOString() }))
                            .eq("id", quote.id)
                            .select("id, quoteId")
                            .single()];
                }
            });
        });
    };
    CarbonClient.prototype.upsertExternalLink = function (externalLink) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client
                        .from("externalLink")
                        .insert(externalLink)
                        .select("id")
                        .single()];
            });
        });
    };
    CarbonClient.prototype.upsertQuoteLine = function (quotationLine) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if ("id" in quotationLine) {
                    return [2 /*return*/, this.client
                            .from("quoteLine")
                            .update(this.sanitize(__assign(__assign({}, quotationLine), { companyId: this.companyId, updatedBy: "system" })))
                            .eq("id", quotationLine.id)
                            .select("id")
                            .single()];
                }
                return [2 /*return*/, this.client
                        .from("quoteLine")
                        .insert([
                        __assign(__assign({}, quotationLine), { companyId: this.companyId, createdBy: "system" })
                    ])
                        .select("*")
                        .single()];
            });
        });
    };
    CarbonClient.prototype.upsertQuoteLineMethod = function (lineMethod) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.functions.invoke("get-method", {
                        body: {
                            type: "itemToQuoteLine",
                            sourceId: lineMethod.itemId,
                            targetId: "".concat(lineMethod.quoteId, ":").concat(lineMethod.quoteLineId),
                            companyId: this.companyId,
                            configuration: lineMethod.configuration,
                            userId: "system"
                        }
                    })];
            });
        });
    };
    CarbonClient.prototype.sanitize = function (input) {
        var output = __assign({}, input);
        Object.keys(output).forEach(function (key) {
            if (output[key] === undefined && key !== "id") {
                output[key] = null;
            }
        });
        return output;
    };
    return CarbonClient;
}());
var carbon = new CarbonClient();
exports.carbon = carbon;
