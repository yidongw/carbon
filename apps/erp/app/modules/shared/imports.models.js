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
exports.importSchemas = exports.importPermissions = exports.fieldMappings = exports.creatableLookups = void 0;
var zod_1 = require("zod");
var shared_models_1 = require("./shared.models");
// to avoid a circular dependency
var methodType = [
    "Purchase to Order",
    "Pull from Inventory",
    "Make to Order"
];
var itemReplenishmentSystems = ["Buy", "Make", "Buy and Make"];
var itemTrackingTypes = [
    "Inventory",
    "Non-Inventory",
    "Serial",
    "Batch"
];
var supplierStatusTypes = [
    "Active",
    "Inactive",
    "Pending",
    "Rejected"
];
// Name-only lookups that may be created inline during a CSV import. The value
// doubles as the lookup's table name; the create-lookup route's zod enum, its
// permission map, and the import modal's types all derive from this list.
exports.creatableLookups = [
    "supplierType",
    "customerType",
    "customerStatus"
];
// Shared supplier-part import fields. Spread into every item-type entry
// (part / material / tool / fixture / consumable) so a single CSV row can
// optionally create a supplierPart link alongside the item itself. All
// optional — rows without a Supplier column import as items only.
var supplierPartImportFields = {
    supplierId: {
        label: "Supplier",
        required: false,
        type: "enum",
        enumData: {
            description: "Optional — link this item to a supplier (match by Supplier ID or name)",
            fetcher: function (client, companyId) { return __awaiter(void 0, void 0, void 0, function () {
                var _a, data, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, client
                                .from("supplier")
                                .select("id, name, readableId")
                                .eq("companyId", companyId)
                                .order("name")];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error)
                                return [2 /*return*/, { data: null, error: error }];
                            // Return name and readableId as separate fields. FieldMappings chooses
                            // the display label per the showSupplierReadableId company setting and
                            // auto-matches on BOTH name and readableId — so a CSV that references
                            // suppliers by name still resolves when readable IDs are hidden.
                            return [2 /*return*/, {
                                    data: data.map(function (s) {
                                        var _a;
                                        return ({
                                            id: s.id,
                                            name: s.name,
                                            readableId: (_a = s.readableId) !== null && _a !== void 0 ? _a : undefined
                                        });
                                    })
                                }];
                    }
                });
            }); }
        }
    },
    supplierPartId: {
        label: "Supplier Part Number",
        required: false,
        type: "string"
    },
    supplierUnitOfMeasureCode: {
        label: "Supplier Unit of Measure",
        required: false,
        type: "enum",
        enumData: {
            description: "How the supplier sells this part (e.g., BOX)",
            fetcher: function (client, companyId) { return __awaiter(void 0, void 0, void 0, function () {
                var _a, data, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, client
                                .from("unitOfMeasure")
                                .select("name, code")
                                .eq("companyId", companyId)];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error)
                                return [2 /*return*/, { data: null, error: error }];
                            return [2 /*return*/, {
                                    data: data.map(function (u) { return ({ id: u.code, name: u.name }); })
                                }];
                    }
                });
            }); }
        }
    },
    minimumOrderQuantity: {
        label: "Minimum Order Quantity",
        required: false,
        type: "string"
    },
    orderMultiple: {
        label: "Order Multiple",
        required: false,
        type: "string"
    },
    conversionFactor: {
        label: "Conversion Factor",
        required: false,
        type: "string"
    },
    unitPrice: {
        label: "Supplier Unit Price",
        required: false,
        type: "string"
    }
};
// Item-level purchasing fields. Spread into every real item-type entry
// (part / material / tool / fixture / consumable). These write to the
// item's "itemReplenishment" row (auto-created by the create_item_related_records
// trigger) in the edge function's post-pass — the same fields the in-app
// "Purchasing" tab edits.
var itemPurchasingImportFields = {
    leadTime: {
        label: "Lead Time (Days)",
        required: false,
        type: "string"
    }
};
// Shared address + payment + incoterm fields. Spread into supplier and
// customer entries — they write to side-tables (supplierLocation/address +
// supplierPayment + supplierShipping; same for customer) in the edge
// function's post-pass.
var partnerLocationImportFields = {
    locationName: {
        label: "Location Name",
        required: false,
        type: "string"
    },
    addressLine1: {
        label: "Address Line 1",
        required: false,
        type: "string"
    },
    addressLine2: {
        label: "Address Line 2",
        required: false,
        type: "string"
    },
    city: {
        label: "City",
        required: false,
        type: "string"
    },
    state: {
        label: "State / Region",
        required: false,
        type: "string"
    },
    postalCode: {
        label: "Postal Code",
        required: false,
        type: "string"
    },
    countryCode: {
        label: "Country",
        required: false,
        type: "enum",
        enumData: {
            description: "Country — match by full name (e.g., United States)",
            fetcher: function (client, _companyId) { return __awaiter(void 0, void 0, void 0, function () {
                var _a, data, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, client
                                .from("country")
                                .select("alpha2, name")];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error)
                                return [2 /*return*/, { data: null, error: error }];
                            // address.countryCode is TEXT storing the ISO 3166-1 alpha-2 code
                            // (e.g., "US"). The country table's PK is alpha2 since migration
                            // 20240928155702_country-codes.sql.
                            return [2 /*return*/, {
                                    data: data.map(function (c) { return ({ id: c.alpha2, name: c.name }); })
                                }];
                    }
                });
            }); }
        }
    }
};
var partnerPaymentImportFields = {
    paymentTermId: {
        label: "Payment Term",
        required: false,
        type: "enum",
        enumData: {
            description: "Payment term (e.g., Net 30)",
            creatableForm: "paymentTerm",
            fetcher: function (client, companyId) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, client
                            .from("paymentTerm")
                            .select("id, name")
                            .eq("companyId", companyId)
                            .order("name")];
                });
            }); }
        }
    }
};
// Shipping/incoterm fields are supplier-only by design: businesses configure
// these when receiving goods (purchasing/import) but rarely set them on the
// outbound side. customerShipping.incoterm exists in the DB for completeness
// but is set via the in-app form when needed.
var supplierShippingImportFields = {
    shippingMethodId: {
        label: "Shipping Method",
        required: false,
        type: "enum",
        enumData: {
            description: "Carrier / shipping method (e.g., FedEx Ground)",
            creatableForm: "shippingMethod",
            fetcher: function (client, companyId) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, client
                            .from("shippingMethod")
                            .select("id, name")
                            .eq("companyId", companyId)
                            .order("name")];
                });
            }); }
        }
    },
    incoterm: {
        label: "Incoterm",
        required: false,
        type: "enum",
        enumData: {
            default: "",
            description: "International Commercial Term — one of: EXW, FCA, FAS, FOB, CPT, CIP, CFR, CIF, DAP, DPU, DDP",
            options: shared_models_1.incoterms
        }
    },
    incotermLocation: {
        label: "Incoterm Location",
        required: false,
        type: "string"
    }
};
exports.fieldMappings = {
    customer: __assign(__assign({ id: {
            label: "Unique ID",
            required: true,
            type: "string"
        }, name: {
            label: "Name",
            required: true,
            type: "string"
        }, accountManagerId: {
            label: "Account Manager",
            required: false,
            type: "enum",
            enumData: {
                description: "The account manager — match by employee email (e.g. jane@company.com)",
                fetcher: function (client, companyId) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, client
                                .from("employees")
                                .select("id, name, email, avatarUrl")
                                .eq("companyId", companyId)
                                .order("name")];
                    });
                }); }
            }
        }, customerStatusId: {
            label: "Status",
            required: false,
            type: "enum",
            enumData: {
                description: "The status of the customer (from your configured statuses)",
                creatableLookup: "customerStatus",
                fetcher: function (client, companyId) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, client
                                .from("customerStatus")
                                .select("id, name")
                                .eq("companyId", companyId)
                                .order("name")];
                    });
                }); }
            }
        }, customerTypeId: {
            label: "Type",
            required: false,
            type: "enum",
            enumData: {
                description: "The category/type of the customer (from your configured types)",
                creatableLookup: "customerType",
                fetcher: function (client, companyId) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, client
                                .from("customerType")
                                .select("id, name")
                                .eq("companyId", companyId)
                                .order("name")];
                    });
                }); }
            }
        }, fax: {
            label: "Fax",
            required: false,
            type: "string"
        }, taxId: {
            label: "Tax ID",
            required: false,
            type: "string"
        }, currencyCode: {
            label: "Currency Code",
            required: false,
            type: "string"
        }, website: {
            label: "Website",
            required: false,
            type: "string"
        } }, partnerLocationImportFields), partnerPaymentImportFields),
    customerContact: {
        id: {
            label: "Unique ID",
            required: true,
            type: "string"
        },
        companyId: {
            label: "External Company ID",
            required: true,
            type: "string"
        },
        firstName: {
            label: "First Name",
            required: true,
            type: "string"
        },
        lastName: {
            label: "Last Name",
            required: true,
            type: "string"
        },
        email: {
            label: "Email",
            type: "string",
            required: true
        },
        title: {
            label: "Title",
            type: "string",
            required: false
        },
        mobilePhone: {
            label: "Mobile Phone",
            type: "string",
            required: false
        },
        workPhone: {
            label: "Work Phone",
            type: "string",
            required: false
        },
        homePhone: {
            label: "Home Phone",
            type: "string",
            required: false
        },
        fax: {
            label: "Fax",
            type: "string",
            required: false
        },
        notes: {
            label: "Notes",
            type: "string",
            required: false
        }
    },
    supplier: __assign(__assign(__assign({ id: {
            label: "Unique ID",
            required: true,
            type: "string"
        }, name: {
            label: "Name",
            required: true,
            type: "string"
        }, accountManagerId: {
            label: "Account Manager",
            required: false,
            type: "enum",
            enumData: {
                description: "The account manager — match by employee email (e.g. jane@company.com)",
                fetcher: function (client, companyId) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, client
                                .from("employees")
                                .select("id, name, email, avatarUrl")
                                .eq("companyId", companyId)
                                .order("name")];
                    });
                }); }
            }
        }, supplierStatus: {
            label: "Status",
            required: false,
            type: "enum",
            enumData: {
                default: "",
                description: "The status of the supplier — one of: Active, Inactive, Pending, Rejected",
                options: supplierStatusTypes
            }
        }, supplierTypeId: {
            label: "Type",
            required: false,
            type: "enum",
            enumData: {
                description: "The category/type of the supplier (from your configured types)",
                creatableLookup: "supplierType",
                fetcher: function (client, companyId) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, client
                                .from("supplierType")
                                .select("id, name")
                                .eq("companyId", companyId)
                                .order("name")];
                    });
                }); }
            }
        }, phone: {
            label: "Phone",
            required: false,
            type: "string"
        }, fax: {
            label: "Fax",
            required: false,
            type: "string"
        }, taxId: {
            label: "Tax ID",
            required: false,
            type: "string"
        }, currencyCode: {
            label: "Currency Code",
            required: false,
            type: "string"
        }, website: {
            label: "Website",
            required: false,
            type: "string"
        } }, partnerLocationImportFields), partnerPaymentImportFields), supplierShippingImportFields),
    supplierContact: {
        id: {
            label: "Unique ID",
            required: true,
            type: "string"
        },
        companyId: {
            label: "External Company ID",
            required: true,
            type: "string"
        },
        firstName: {
            label: "First Name",
            required: true,
            type: "string"
        },
        lastName: {
            label: "Last Name",
            required: true,
            type: "string"
        },
        email: {
            label: "Email",
            type: "string",
            required: true
        },
        title: {
            label: "Title",
            type: "string",
            required: false
        },
        mobilePhone: {
            label: "Mobile Phone",
            type: "string",
            required: false
        },
        workPhone: {
            label: "Work Phone",
            type: "string",
            required: false
        },
        homePhone: {
            label: "Home Phone",
            type: "string",
            required: false
        },
        fax: {
            label: "Fax",
            type: "string",
            required: false
        },
        notes: {
            label: "Notes",
            type: "string",
            required: false
        }
    },
    part: __assign(__assign({ id: {
            label: "Unique ID",
            required: true,
            type: "string"
        }, readableId: {
            label: "Part Number",
            required: true,
            type: "string"
        }, revision: {
            label: "Revision",
            required: true,
            type: "string",
            default: "0"
        }, name: {
            label: "Description",
            required: true,
            type: "string"
        }, active: {
            label: "Active",
            required: false,
            type: "boolean"
        }, replenishmentSystem: {
            label: "Replenishment System",
            required: false,
            type: "enum",
            enumData: {
                description: "Whether demand for a part should be fulfilled by buying or making",
                options: itemReplenishmentSystems,
                default: "Buy and Make"
            }
        }, defaultMethodType: {
            label: "Default Method",
            required: false,
            type: "enum",
            enumData: {
                description: "How a part should be produced when it is required in production",
                options: methodType,
                default: "Make"
            }
        }, itemTrackingType: {
            label: "Tracking Type",
            required: false,
            type: "enum",
            enumData: {
                description: "Whether a part is tracked as inventory or not",
                options: itemTrackingTypes,
                default: "Inventory"
            }
        }, unitOfMeasureCode: {
            label: "Unit of Measure",
            required: false,
            type: "enum",
            enumData: {
                description: "The unit of measure of the part",
                fetcher: function (client, companyId) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, data, error;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, client
                                    .from("unitOfMeasure")
                                    .select("name, code")
                                    .eq("companyId", companyId)];
                            case 1:
                                _a = _b.sent(), data = _a.data, error = _a.error;
                                if (error) {
                                    return [2 /*return*/, { data: null, error: error }];
                                }
                                return [2 /*return*/, {
                                        data: data.map(function (item) { return ({
                                            name: item.name,
                                            id: item.code
                                        }); })
                                    }];
                        }
                    });
                }); },
                default: "EA"
            }
        } }, supplierPartImportFields), itemPurchasingImportFields),
    tool: __assign(__assign({ id: {
            label: "Unique ID",
            required: true,
            type: "string"
        }, readableId: {
            label: "Part Number",
            required: true,
            type: "string"
        }, revision: {
            label: "Revision",
            required: true,
            type: "string",
            default: "0"
        }, name: {
            label: "Description",
            required: true,
            type: "string"
        }, active: {
            label: "Active",
            required: false,
            type: "boolean"
        }, replenishmentSystem: {
            label: "Replenishment System",
            required: false,
            type: "enum",
            enumData: {
                description: "Whether demand for a part should be fulfilled by buying or making",
                options: itemReplenishmentSystems,
                default: "Buy and Make"
            }
        }, defaultMethodType: {
            label: "Default Method",
            required: false,
            type: "enum",
            enumData: {
                description: "How a part should be produced when it is required in production",
                options: methodType,
                default: "Make"
            }
        }, itemTrackingType: {
            label: "Tracking Type",
            required: false,
            type: "enum",
            enumData: {
                description: "Whether a part is tracked as inventory or not",
                options: itemTrackingTypes,
                default: "Inventory"
            }
        }, unitOfMeasureCode: {
            label: "Unit of Measure",
            required: false,
            type: "enum",
            enumData: {
                description: "The unit of measure of the part",
                fetcher: function (client, companyId) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, data, error;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, client
                                    .from("unitOfMeasure")
                                    .select("name, code")
                                    .eq("companyId", companyId)];
                            case 1:
                                _a = _b.sent(), data = _a.data, error = _a.error;
                                if (error) {
                                    return [2 /*return*/, { data: null, error: error }];
                                }
                                return [2 /*return*/, {
                                        data: data.map(function (item) { return ({
                                            name: item.name,
                                            id: item.code
                                        }); })
                                    }];
                        }
                    });
                }); },
                default: "EA"
            }
        } }, supplierPartImportFields), itemPurchasingImportFields),
    fixture: __assign(__assign({ id: {
            label: "Unique ID",
            required: true,
            type: "string"
        }, readableId: {
            label: "Part Number",
            required: true,
            type: "string"
        }, revision: {
            label: "Revision",
            required: true,
            type: "string",
            default: "0"
        }, name: {
            label: "Description",
            required: true,
            type: "string"
        }, active: {
            label: "Active",
            required: false,
            type: "boolean"
        }, replenishmentSystem: {
            label: "Replenishment System",
            required: false,
            type: "enum",
            enumData: {
                description: "Whether demand for a part should be fulfilled by buying or making",
                options: itemReplenishmentSystems,
                default: "Buy and Make"
            }
        }, defaultMethodType: {
            label: "Default Method",
            required: false,
            type: "enum",
            enumData: {
                description: "How a part should be produced when it is required in production",
                options: methodType,
                default: "Make"
            }
        }, itemTrackingType: {
            label: "Tracking Type",
            required: false,
            type: "enum",
            enumData: {
                description: "Whether a part is tracked as inventory or not",
                options: itemTrackingTypes,
                default: "Inventory"
            }
        }, unitOfMeasureCode: {
            label: "Unit of Measure",
            required: false,
            type: "enum",
            enumData: {
                description: "The unit of measure of the part",
                fetcher: function (client, companyId) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, data, error;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, client
                                    .from("unitOfMeasure")
                                    .select("name, code")
                                    .eq("companyId", companyId)];
                            case 1:
                                _a = _b.sent(), data = _a.data, error = _a.error;
                                if (error) {
                                    return [2 /*return*/, { data: null, error: error }];
                                }
                                return [2 /*return*/, {
                                        data: data.map(function (item) { return ({
                                            name: item.name,
                                            id: item.code
                                        }); })
                                    }];
                        }
                    });
                }); },
                default: "EA"
            }
        } }, supplierPartImportFields), itemPurchasingImportFields),
    consumable: __assign(__assign({ id: {
            label: "Unique ID",
            required: true,
            type: "string"
        }, readableId: {
            label: "Part Number",
            required: true,
            type: "string"
        }, revision: {
            label: "Revision",
            required: true,
            type: "string",
            default: "0"
        }, name: {
            label: "Description",
            required: true,
            type: "string"
        }, active: {
            label: "Active",
            required: false,
            type: "boolean"
        }, replenishmentSystem: {
            label: "Replenishment System",
            required: false,
            type: "enum",
            enumData: {
                description: "Whether demand for a part should be fulfilled by buying or making",
                options: itemReplenishmentSystems,
                default: "Buy and Make"
            }
        }, defaultMethodType: {
            label: "Default Method",
            required: false,
            type: "enum",
            enumData: {
                description: "How a part should be produced when it is required in production",
                options: methodType,
                default: "Make"
            }
        }, itemTrackingType: {
            label: "Tracking Type",
            required: false,
            type: "enum",
            enumData: {
                description: "Whether a part is tracked as inventory or not",
                options: itemTrackingTypes,
                default: "Inventory"
            }
        }, unitOfMeasureCode: {
            label: "Unit of Measure",
            required: false,
            type: "enum",
            enumData: {
                description: "The unit of measure of the part",
                fetcher: function (client, companyId) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, data, error;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, client
                                    .from("unitOfMeasure")
                                    .select("name, code")
                                    .eq("companyId", companyId)];
                            case 1:
                                _a = _b.sent(), data = _a.data, error = _a.error;
                                if (error) {
                                    return [2 /*return*/, { data: null, error: error }];
                                }
                                return [2 /*return*/, {
                                        data: data.map(function (item) { return ({
                                            name: item.name,
                                            id: item.code
                                        }); })
                                    }];
                        }
                    });
                }); },
                default: "EA"
            }
        } }, supplierPartImportFields), itemPurchasingImportFields),
    material: __assign(__assign({ id: {
            label: "Unique ID",
            required: true,
            type: "string"
        }, readableId: {
            label: "Part Number",
            required: true,
            type: "string"
        }, revision: {
            label: "Revision",
            required: true,
            type: "string",
            default: "0"
        }, name: {
            label: "Description",
            required: true,
            type: "string"
        }, active: {
            label: "Active",
            required: false,
            type: "boolean"
        }, materialSubstanceId: {
            label: "Substance",
            required: true,
            type: "enum",
            enumData: {
                description: "The substance of the material",
                fetcher: function (client, companyId) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, client
                                .from("materialSubstance")
                                .select("id, name")
                                .or("companyId.eq.".concat(companyId, ",companyId.is.null"))
                                .order("name")];
                    });
                }); },
                default: ""
            }
        }, materialFormId: {
            label: "Form",
            required: false,
            type: "enum",
            enumData: {
                description: "The form of the material",
                fetcher: function (client, companyId) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, client
                                .from("materialForm")
                                .select("id, name")
                                .or("companyId.eq.".concat(companyId, ",companyId.is.null"))
                                .order("name")];
                    });
                }); },
                default: ""
            }
        }, defaultMethodType: {
            label: "Default Method",
            required: false,
            type: "enum",
            enumData: {
                description: "How a part should be produced when it is required in production",
                options: ["Purchase to Order", "Pull from Inventory", "Make to Order"],
                default: "Purchase to Order"
            }
        }, itemTrackingType: {
            label: "Tracking Type",
            required: false,
            type: "enum",
            enumData: {
                description: "Whether a part is tracked as inventory or not",
                options: itemTrackingTypes,
                default: "Inventory"
            }
        }, finish: {
            label: "Finish",
            type: "string",
            required: false
        }, grade: {
            label: "Grade",
            type: "string",
            required: false
        }, dimensions: {
            label: "Dimensions",
            type: "string",
            required: false
        }, unitOfMeasureCode: {
            label: "Unit of Measure",
            required: false,
            type: "enum",
            enumData: {
                description: "The unit of measure of the part",
                fetcher: function (client, companyId) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, data, error;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, client
                                    .from("unitOfMeasure")
                                    .select("name, code")
                                    .eq("companyId", companyId)];
                            case 1:
                                _a = _b.sent(), data = _a.data, error = _a.error;
                                if (error) {
                                    return [2 /*return*/, { data: null, error: error }];
                                }
                                return [2 /*return*/, {
                                        data: data.map(function (item) { return ({
                                            name: item.name,
                                            id: item.code
                                        }); })
                                    }];
                        }
                    });
                }); },
                default: "EA"
            }
        } }, supplierPartImportFields), itemPurchasingImportFields),
    methodMaterial: __assign({ level: {
            label: "Level",
            required: false,
            type: "string"
        }, partId: {
            label: "Part ID",
            required: true,
            type: "string"
        }, description: {
            label: "Description",
            required: false,
            type: "string"
        }, methodType: {
            label: "Method Type",
            required: true,
            type: "enum",
            enumData: {
                description: "The method type of the part, which describes whether it is bought or made",
                options: methodType,
                default: "Pull from Inventory"
            }
        }, quantity: {
            label: "Quantity",
            required: true,
            type: "number"
        }, unitOfMeasureCode: {
            label: "Unit of Measure",
            required: true,
            type: "enum",
            enumData: {
                description: "The unit of measure of the part",
                fetcher: function (client, companyId) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, data, error;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, client
                                    .from("unitOfMeasure")
                                    .select("name, code")
                                    .eq("companyId", companyId)];
                            case 1:
                                _a = _b.sent(), data = _a.data, error = _a.error;
                                if (error) {
                                    return [2 /*return*/, { data: null, error: error }];
                                }
                                return [2 /*return*/, {
                                        data: data.map(function (item) { return ({
                                            name: item.name,
                                            id: item.code
                                        }); })
                                    }];
                        }
                    });
                }); },
                default: "EA"
            }
        } }, supplierPartImportFields),
    workCenter: {
        id: {
            label: "Unique ID",
            required: true,
            type: "string"
        },
        name: {
            label: "Name",
            required: true,
            type: "string"
        },
        description: {
            label: "Description",
            required: true,
            type: "string"
        },
        defaultStandardFactor: {
            label: "Standard Factor",
            required: false,
            type: "enum",
            enumData: {
                description: "The standard factor unit for time tracking",
                options: [
                    "Hours/Piece",
                    "Hours/100 Pieces",
                    "Hours/1000 Pieces",
                    "Minutes/Piece",
                    "Minutes/100 Pieces",
                    "Minutes/1000 Pieces",
                    "Pieces/Hour",
                    "Pieces/Minute",
                    "Seconds/Piece",
                    "Total Hours",
                    "Total Minutes"
                ],
                default: "Hours/Piece"
            }
        },
        laborRate: {
            label: "Labor Rate",
            required: true,
            type: "number"
        },
        machineRate: {
            label: "Machine Rate",
            required: true,
            type: "number"
        },
        overheadRate: {
            label: "Overhead Rate",
            required: true,
            type: "number"
        },
        locationId: {
            label: "Location",
            required: true,
            type: "enum",
            enumData: {
                description: "The location of the work center",
                fetcher: function (client, companyId) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, client
                                .from("location")
                                .select("id, name")
                                .eq("companyId", companyId)
                                .order("name")];
                    });
                }); }
            }
        }
    },
    process: {
        id: {
            label: "Unique ID",
            required: true,
            type: "string"
        },
        name: {
            label: "Name",
            required: true,
            type: "string"
        },
        processType: {
            label: "Process Type",
            required: false,
            type: "enum",
            enumData: {
                description: "Whether the process is Inside (in-house), Outside (outsourced), or both",
                options: ["Inside", "Outside", "Inside and Outside"],
                default: "Inside"
            }
        },
        defaultStandardFactor: {
            label: "Standard Factor",
            required: false,
            type: "enum",
            enumData: {
                description: "The standard factor unit for time tracking (required for Inside processes)",
                options: [
                    "Hours/Piece",
                    "Hours/100 Pieces",
                    "Hours/1000 Pieces",
                    "Minutes/Piece",
                    "Minutes/100 Pieces",
                    "Minutes/1000 Pieces",
                    "Pieces/Hour",
                    "Pieces/Minute",
                    "Seconds/Piece",
                    "Total Hours",
                    "Total Minutes"
                ],
                default: "Hours/Piece"
            }
        },
        completeAllOnScan: {
            label: "Complete All On Scan",
            required: false,
            type: "enum",
            enumData: {
                description: "Whether scanning a barcode should complete all operations for this process",
                options: ["true", "false"],
                default: "false"
            }
        }
    },
    fixedAsset: {
        name: {
            label: "Name",
            required: true,
            type: "string"
        },
        fixedAssetClassId: {
            label: "Asset Class ID",
            required: true,
            type: "string"
        },
        serialNumber: {
            label: "Serial Number",
            required: false,
            type: "string"
        },
        acquisitionCost: {
            label: "Acquisition Cost",
            required: true,
            type: "string"
        },
        acquisitionDate: {
            label: "Acquisition Date",
            required: true,
            type: "string"
        },
        accumulatedDepreciation: {
            label: "Accumulated Depreciation",
            required: false,
            type: "string"
        },
        depreciationMethod: {
            label: "Depreciation Method",
            required: false,
            type: "enum",
            enumData: {
                description: "The depreciation method for this asset",
                options: ["Straight Line", "Declining Balance", "Units of Production"],
                default: "Straight Line"
            }
        },
        usefulLifeMonths: {
            label: "Useful Life (Months)",
            required: false,
            type: "string"
        },
        residualValuePercent: {
            label: "Residual Value %",
            required: false,
            type: "string"
        },
        locationId: {
            label: "Location ID",
            required: false,
            type: "string"
        }
    }
};
exports.importPermissions = {
    customer: "sales",
    customerContact: "sales",
    supplier: "purchasing",
    supplierContact: "purchasing",
    part: "parts",
    material: "parts",
    methodMaterial: "parts",
    tool: "parts",
    fixture: "parts",
    consumable: "parts",
    workCenter: "production",
    process: "production",
    fixedAsset: "accounting"
};
exports.importSchemas = {
    customer: zod_1.z.object({
        id: zod_1.z
            .string()
            .min(1, { message: "ID is required" })
            .describe("The id of the customer, usually a number or set of alphanumeric characters."),
        name: zod_1.z
            .string()
            .min(1, { message: "Name is required" })
            .describe("The name of the customer. Sometimes contains Inc or LLC. Usually a proper noun."),
        accountManagerId: zod_1.z
            .string()
            .optional()
            .describe("The id of the account manager of the customer"),
        customerStatusId: zod_1.z
            .string()
            .optional()
            .describe("The id of the customer's status"),
        customerTypeId: zod_1.z
            .string()
            .optional()
            .describe("The id of the customer's type/category"),
        phone: zod_1.z.string().optional().describe("The phone number of the customer"),
        fax: zod_1.z.string().optional().describe("The fax number of the customer"),
        taxId: zod_1.z
            .string()
            .optional()
            .describe("The tax identification number of the customer. Usually numeric.")
            .nullable(),
        currencyCode: zod_1.z
            .string()
            .optional()
            .describe("The currency code of the customer. Usually a 3-letter code.")
            .nullable(),
        website: zod_1.z
            .string()
            .optional()
            .describe("The website url. Usually begins with http:// or https://")
            .nullable(),
        locationName: zod_1.z.string().optional(),
        addressLine1: zod_1.z.string().optional(),
        addressLine2: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        state: zod_1.z.string().optional(),
        postalCode: zod_1.z.string().optional(),
        countryCode: zod_1.z.string().optional(),
        paymentTermId: zod_1.z.string().optional()
    }),
    customerContact: zod_1.z.object({
        id: zod_1.z
            .string()
            .min(1, { message: "ID is required" })
            .describe("The id of the customer contact, usually a number or set of alphanumeric characters."),
        companyId: zod_1.z
            .string()
            .min(1, { message: "Company ID is required" })
            .describe("The id of the company the contact belongs to"),
        firstName: zod_1.z.string().describe("The first name of the customer contact"),
        lastName: zod_1.z.string().describe("The last name of the customer contact"),
        email: zod_1.z
            .string()
            .min(1, { message: "Email is required" })
            .describe("The email of the customer contact"),
        title: zod_1.z.string().optional().describe("The title of the customer contact"),
        mobilePhone: zod_1.z
            .string()
            .optional()
            .describe("The mobile phone of the customer contact"),
        workPhone: zod_1.z
            .string()
            .optional()
            .describe("The work phone of the customer contact"),
        homePhone: zod_1.z
            .string()
            .optional()
            .describe("The home phone of the customer contact"),
        fax: zod_1.z.string().optional().describe("The fax of the customer contact"),
        notes: zod_1.z.string().optional().describe("The notes of the customer contact")
    }),
    supplier: zod_1.z.object({
        id: zod_1.z
            .string()
            .min(1, { message: "ID is required" })
            .describe("The id of the supplier, usually a number or set of alphanumeric characters."),
        name: zod_1.z
            .string()
            .min(1, { message: "Name is required" })
            .describe("The name of the supplier. Sometimes contains Inc or LLC. Usually a proper noun."),
        accountManagerId: zod_1.z
            .string()
            .optional()
            .describe("The id of the account manager of the supplier"),
        supplierStatus: zod_1.z
            .string()
            .optional()
            .describe("The status of the supplier"),
        supplierTypeId: zod_1.z
            .string()
            .optional()
            .describe("The id of the supplier's type/category"),
        phone: zod_1.z.string().optional().describe("The phone number of the supplier"),
        fax: zod_1.z.string().optional().describe("The fax number of the supplier"),
        taxId: zod_1.z
            .string()
            .optional()
            .describe("The tax identification number of the supplier. Usually numeric.")
            .nullable(),
        currencyCode: zod_1.z
            .string()
            .optional()
            .describe("The currency code of the supplier. Usually a 3-letter code.")
            .nullable(),
        website: zod_1.z
            .string()
            .optional()
            .describe("The website url. Usually begins with http:// or https://")
            .nullable(),
        locationName: zod_1.z.string().optional(),
        addressLine1: zod_1.z.string().optional(),
        addressLine2: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        state: zod_1.z.string().optional(),
        postalCode: zod_1.z.string().optional(),
        countryCode: zod_1.z.string().optional(),
        paymentTermId: zod_1.z.string().optional(),
        shippingMethodId: zod_1.z.string().optional(),
        incoterm: zod_1.z.string().optional(),
        incotermLocation: zod_1.z.string().optional()
    }),
    supplierContact: zod_1.z.object({
        id: zod_1.z
            .string()
            .min(1, { message: "ID is required" })
            .describe("The id of the supplier contact, usually a number or set of alphanumeric characters."),
        companyId: zod_1.z
            .string()
            .min(1, { message: "Company ID is required" })
            .describe("The id of the company the contact belongs to"),
        firstName: zod_1.z
            .string()
            .describe("The first name of the supplier contact")
            .optional(),
        lastName: zod_1.z
            .string()
            .describe("The last name of the supplier contact")
            .optional(),
        email: zod_1.z
            .string()
            .min(1, { message: "Email is required" })
            .describe("The email of the supplier contact"),
        title: zod_1.z.string().optional().describe("The title of the supplier contact"),
        mobilePhone: zod_1.z
            .string()
            .optional()
            .describe("The mobile phone of the supplier contact"),
        workPhone: zod_1.z
            .string()
            .optional()
            .describe("The work phone of the supplier contact"),
        homePhone: zod_1.z
            .string()
            .optional()
            .describe("The home phone of the supplier contact"),
        fax: zod_1.z.string().optional().describe("The fax of the supplier contact"),
        notes: zod_1.z.string().optional().describe("The notes of the supplier contact")
    }),
    part: zod_1.z.object({
        id: zod_1.z
            .string()
            .min(1, { message: "ID is required" })
            .describe("The id of the part, usually a number or set of alphanumeric characters."),
        readableId: zod_1.z
            .string()
            .min(1, { message: "Part Number is required" })
            .describe("The readable id of the part. Usually a number or set of alphanumeric characters."),
        name: zod_1.z
            .string()
            .min(1, { message: "Name is required" })
            .describe("The description of the part"),
        active: zod_1.z.string().optional().describe("Whether the part is active"),
        unitOfMeasureCode: zod_1.z
            .string()
            .optional()
            .describe("The unit of measure of the part"),
        replenishmentSystem: zod_1.z
            .string()
            .optional()
            .describe("The replenishment system of the part"),
        defaultMethodType: zod_1.z
            .string()
            .optional()
            .describe("The default method type of the part"),
        itemTrackingType: zod_1.z
            .string()
            .optional()
            .describe("The item tracking type of the part"),
        supplierId: zod_1.z.string().optional(),
        supplierPartId: zod_1.z.string().optional(),
        supplierUnitOfMeasureCode: zod_1.z.string().optional(),
        minimumOrderQuantity: zod_1.z.string().optional(),
        orderMultiple: zod_1.z.string().optional(),
        conversionFactor: zod_1.z.string().optional(),
        unitPrice: zod_1.z.string().optional(),
        leadTime: zod_1.z.string().optional()
    }),
    tool: zod_1.z.object({
        id: zod_1.z
            .string()
            .min(1, { message: "ID is required" })
            .describe("The id of the tool, usually a number or set of alphanumeric characters."),
        readableId: zod_1.z
            .string()
            .min(1, { message: "Part Number is required" })
            .describe("The readable id of the tool. Usually a number or set of alphanumeric characters."),
        name: zod_1.z
            .string()
            .min(1, { message: "Name is required" })
            .describe("The description of the tool"),
        active: zod_1.z.string().optional().describe("Whether the tool is active"),
        unitOfMeasureCode: zod_1.z
            .string()
            .optional()
            .describe("The unit of measure of the tool"),
        replenishmentSystem: zod_1.z
            .string()
            .optional()
            .describe("The replenishment system of the tool"),
        defaultMethodType: zod_1.z
            .string()
            .optional()
            .describe("The default method type of the tool"),
        itemTrackingType: zod_1.z
            .string()
            .optional()
            .describe("The item tracking type of the tool"),
        supplierId: zod_1.z.string().optional(),
        supplierPartId: zod_1.z.string().optional(),
        supplierUnitOfMeasureCode: zod_1.z.string().optional(),
        minimumOrderQuantity: zod_1.z.string().optional(),
        orderMultiple: zod_1.z.string().optional(),
        conversionFactor: zod_1.z.string().optional(),
        unitPrice: zod_1.z.string().optional(),
        leadTime: zod_1.z.string().optional()
    }),
    fixture: zod_1.z.object({
        id: zod_1.z
            .string()
            .min(1, { message: "ID is required" })
            .describe("The id of the fixture, usually a number or set of alphanumeric characters."),
        readableId: zod_1.z
            .string()
            .min(1, { message: "Part Number is required" })
            .describe("The readable id of the fixture. Usually a number or set of alphanumeric characters."),
        name: zod_1.z
            .string()
            .min(1, { message: "Name is required" })
            .describe("The description of the fixture"),
        active: zod_1.z.string().optional().describe("Whether the fixture is active"),
        unitOfMeasureCode: zod_1.z
            .string()
            .optional()
            .describe("The unit of measure of the fixture"),
        replenishmentSystem: zod_1.z
            .string()
            .optional()
            .describe("The replenishment system of the fixture"),
        defaultMethodType: zod_1.z
            .string()
            .optional()
            .describe("The default method type of the fixture"),
        itemTrackingType: zod_1.z
            .string()
            .optional()
            .describe("The item tracking type of the fixture"),
        supplierId: zod_1.z.string().optional(),
        supplierPartId: zod_1.z.string().optional(),
        supplierUnitOfMeasureCode: zod_1.z.string().optional(),
        minimumOrderQuantity: zod_1.z.string().optional(),
        orderMultiple: zod_1.z.string().optional(),
        conversionFactor: zod_1.z.string().optional(),
        unitPrice: zod_1.z.string().optional(),
        leadTime: zod_1.z.string().optional()
    }),
    consumable: zod_1.z.object({
        id: zod_1.z
            .string()
            .min(1, { message: "ID is required" })
            .describe("The id of the part, usually a number or set of alphanumeric characters."),
        readableId: zod_1.z
            .string()
            .min(1, { message: "Part Number is required" })
            .describe("The readable id of the part. Usually a number or set of alphanumeric characters."),
        name: zod_1.z
            .string()
            .min(1, { message: "Name is required" })
            .describe("The description of the part"),
        active: zod_1.z.string().optional().describe("Whether the part is active"),
        unitOfMeasureCode: zod_1.z
            .string()
            .optional()
            .describe("The unit of measure of the part"),
        replenishmentSystem: zod_1.z
            .string()
            .optional()
            .describe("The replenishment system of the part"),
        defaultMethodType: zod_1.z
            .string()
            .optional()
            .describe("The default method type of the part"),
        itemTrackingType: zod_1.z
            .string()
            .optional()
            .describe("The item tracking type of the part"),
        supplierId: zod_1.z.string().optional(),
        supplierPartId: zod_1.z.string().optional(),
        supplierUnitOfMeasureCode: zod_1.z.string().optional(),
        minimumOrderQuantity: zod_1.z.string().optional(),
        orderMultiple: zod_1.z.string().optional(),
        conversionFactor: zod_1.z.string().optional(),
        unitPrice: zod_1.z.string().optional(),
        leadTime: zod_1.z.string().optional()
    }),
    material: zod_1.z.object({
        id: zod_1.z
            .string()
            .min(1, { message: "ID is required" })
            .describe("The id of the material, usually a number or set of alphanumeric characters."),
        readableId: zod_1.z
            .string()
            .min(1, { message: "Part Number is required" })
            .describe("The readable id of the material. Usually a number or set of alphanumeric characters."),
        name: zod_1.z
            .string()
            .min(1, { message: "Name is required" })
            .describe("The description of the material"),
        active: zod_1.z.string().optional().describe("Whether the material is active"),
        materialSubstanceId: zod_1.z
            .string()
            .optional()
            .describe("The substance of the material"),
        materialFormId: zod_1.z.string().optional().describe("The form of the material"),
        defaultMethodType: zod_1.z
            .string()
            .optional()
            .describe("The default method type of the material"),
        itemTrackingType: zod_1.z
            .string()
            .optional()
            .describe("The item tracking type of the material"),
        finish: zod_1.z.string().optional().describe("The finish of the material"),
        grade: zod_1.z.string().optional().describe("The grade of the material"),
        dimensions: zod_1.z
            .string()
            .optional()
            .describe("The dimensions of the material"),
        unitOfMeasureCode: zod_1.z
            .string()
            .optional()
            .describe("The unit of measure of the material"),
        supplierId: zod_1.z.string().optional(),
        supplierPartId: zod_1.z.string().optional(),
        supplierUnitOfMeasureCode: zod_1.z.string().optional(),
        minimumOrderQuantity: zod_1.z.string().optional(),
        orderMultiple: zod_1.z.string().optional(),
        conversionFactor: zod_1.z.string().optional(),
        unitPrice: zod_1.z.string().optional(),
        leadTime: zod_1.z.string().optional()
    }),
    methodMaterial: zod_1.z.object({
        level: zod_1.z.string().optional().describe("The level of the material"),
        partId: zod_1.z
            .string()
            .min(1, { message: "Part ID is required" })
            .describe("The id of the part"),
        description: zod_1.z.string().optional().describe("The description of the part"),
        quantity: zod_1.z.string().describe("The quantity of the part"),
        methodType: zod_1.z
            .string()
            .optional()
            .describe("The method type of the part, which describes whether it is bought or made"),
        unitOfMeasureCode: zod_1.z
            .string()
            .optional()
            .describe("The unit of measure of the part")
    }),
    workCenter: zod_1.z.object({
        id: zod_1.z
            .string()
            .min(1, { message: "ID is required" })
            .describe("The unique ID of the work center"),
        name: zod_1.z
            .string()
            .min(1, { message: "Name is required" })
            .describe("The name of the work center"),
        description: zod_1.z
            .string()
            .min(1, { message: "Description is required" })
            .describe("The description of the work center"),
        defaultStandardFactor: zod_1.z
            .string()
            .optional()
            .describe("The standard factor unit for time tracking"),
        laborRate: zod_1.z.string().describe("The labor rate for the work center"),
        machineRate: zod_1.z.string().describe("The machine rate for the work center"),
        overheadRate: zod_1.z.string().describe("The overhead rate for the work center"),
        locationId: zod_1.z
            .string()
            .min(1, { message: "Location is required" })
            .describe("The location ID of the work center")
    }),
    process: zod_1.z.object({
        id: zod_1.z
            .string()
            .min(1, { message: "ID is required" })
            .describe("The unique ID of the process"),
        name: zod_1.z
            .string()
            .min(1, { message: "Name is required" })
            .describe("The name of the process"),
        processType: zod_1.z
            .string()
            .optional()
            .describe("Whether the process is Inside (in-house), Outside (outsourced), or both"),
        defaultStandardFactor: zod_1.z
            .string()
            .optional()
            .describe("The standard factor unit for time tracking (required for Inside processes)"),
        completeAllOnScan: zod_1.z
            .string()
            .optional()
            .describe("Whether scanning a barcode should complete all operations for this process")
    }),
    fixedAsset: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(1, { message: "Name is required" })
            .describe("The name of the fixed asset"),
        fixedAssetClassId: zod_1.z
            .string()
            .min(1, { message: "Asset Class is required" })
            .describe("The ID of the fixed asset class"),
        serialNumber: zod_1.z
            .string()
            .optional()
            .describe("The serial number of the asset"),
        acquisitionCost: zod_1.z
            .string()
            .optional()
            .describe("The acquisition cost of the asset"),
        acquisitionDate: zod_1.z
            .string()
            .optional()
            .describe("The date the asset was acquired (YYYY-MM-DD)"),
        accumulatedDepreciation: zod_1.z
            .string()
            .optional()
            .describe("The accumulated depreciation to date"),
        depreciationMethod: zod_1.z
            .string()
            .optional()
            .describe("The depreciation method: Straight Line, Declining Balance, or Units of Production"),
        usefulLifeMonths: zod_1.z
            .string()
            .optional()
            .describe("The useful life of the asset in months"),
        residualValuePercent: zod_1.z
            .string()
            .optional()
            .describe("The residual value as a percentage of acquisition cost"),
        locationId: zod_1.z
            .string()
            .optional()
            .describe("The location ID where the asset is located")
    })
};
