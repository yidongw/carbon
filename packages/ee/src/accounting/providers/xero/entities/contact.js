"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactSyncer = void 0;
var external_mapping_1 = require("../../../core/external-mapping");
var types_1 = require("../../../core/types");
var utils_1 = require("../../../core/utils");
var models_1 = require("../models");
var ContactSyncer = /** @class */ (function (_super) {
    __extends(ContactSyncer, _super);
    function ContactSyncer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // =================================================================
    // 1. ID MAPPING (Override to check both customer and supplier)
    // =================================================================
    ContactSyncer.prototype.getRemoteId = function (localId) {
        return __awaiter(this, void 0, void 0, function () {
            var customerMapping, vendorMapping;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.mappingService.getExternalId("customer", localId, this.provider.id)];
                    case 1:
                        customerMapping = _a.sent();
                        if (customerMapping) {
                            return [2 /*return*/, customerMapping];
                        }
                        return [4 /*yield*/, this.mappingService.getExternalId("vendor", localId, this.provider.id)];
                    case 2:
                        vendorMapping = _a.sent();
                        return [2 /*return*/, vendorMapping];
                }
            });
        });
    };
    ContactSyncer.prototype.getLocalId = function (remoteId) {
        return __awaiter(this, void 0, void 0, function () {
            var customerMapping, vendorMapping;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.mappingService.getEntityId(this.provider.id, remoteId, "customer")];
                    case 1:
                        customerMapping = _a.sent();
                        if (customerMapping)
                            return [2 /*return*/, customerMapping];
                        return [4 /*yield*/, this.mappingService.getEntityId(this.provider.id, remoteId, "vendor")];
                    case 2:
                        vendorMapping = _a.sent();
                        return [2 /*return*/, vendorMapping];
                }
            });
        });
    };
    ContactSyncer.prototype.linkEntities = function (tx, localId, remoteId, remoteUpdatedAt) {
        return __awaiter(this, void 0, void 0, function () {
            var txMappingService;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        txMappingService = (0, external_mapping_1.createMappingService)(tx, this.companyId);
                        return [4 /*yield*/, txMappingService.link(this.entityType, localId, this.provider.id, remoteId, { remoteUpdatedAt: remoteUpdatedAt })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // =================================================================
    // 2. TIMESTAMP EXTRACTION
    // =================================================================
    ContactSyncer.prototype.getRemoteUpdatedAt = function (remote) {
        if (!remote.UpdatedDateUTC)
            return null;
        return (0, models_1.parseDotnetDate)(remote.UpdatedDateUTC);
    };
    // =================================================================
    // 3. LOCAL FETCH (Single + Batch)
    // =================================================================
    ContactSyncer.prototype.fetchLocal = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var customer, supplier;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.fetchCustomersByIds([id])];
                    case 1:
                        customer = _b.sent();
                        if (customer.has(id))
                            return [2 /*return*/, customer.get(id)];
                        return [4 /*yield*/, this.fetchSuppliersByIds([id])];
                    case 2:
                        supplier = _b.sent();
                        return [2 /*return*/, (_a = supplier.get(id)) !== null && _a !== void 0 ? _a : null];
                }
            });
        });
    };
    ContactSyncer.prototype.fetchLocalBatch = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var customers, remainingIds, suppliers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (ids.length === 0)
                            return [2 /*return*/, new Map()];
                        return [4 /*yield*/, this.fetchCustomersByIds(ids)];
                    case 1:
                        customers = _a.sent();
                        remainingIds = ids.filter(function (id) { return !customers.has(id); });
                        return [4 /*yield*/, this.fetchSuppliersByIds(remainingIds)];
                    case 2:
                        suppliers = _a.sent();
                        return [2 /*return*/, new Map(__spreadArray(__spreadArray([], customers, true), suppliers, true))];
                }
            });
        });
    };
    ContactSyncer.prototype.fetchCustomersByIds = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (ids.length === 0)
                            return [2 /*return*/, new Map()];
                        return [4 /*yield*/, this.database
                                .selectFrom("customer")
                                .leftJoin("customerTax", "customerTax.customerId", "customer.id")
                                .leftJoin("customerLocation", "customerLocation.customerId", "customer.id")
                                .leftJoin("address", "address.id", "customerLocation.addressId")
                                .leftJoin("customerContact", "customerContact.customerId", "customer.id")
                                .leftJoin("contact", "contact.id", "customerContact.contactId")
                                .select([
                                "customer.id",
                                "customer.name",
                                "customer.companyId",
                                "customerTax.taxId as taxId",
                                "customer.phone",
                                "customer.fax",
                                "customer.website",
                                "customer.currencyCode",
                                "customer.updatedAt",
                                "customerLocation.name as locationName",
                                "address.addressLine1",
                                "address.addressLine2",
                                "address.city",
                                "address.postalCode",
                                // Contact details from linked contact
                                "contact.firstName as contactFirstName",
                                "contact.lastName as contactLastName",
                                "contact.email as contactEmail",
                                "contact.mobilePhone as contactMobilePhone",
                                "contact.homePhone as contactHomePhone",
                                "contact.workPhone as contactWorkPhone"
                            ])
                                .where("customer.id", "in", ids)
                                .where("customer.companyId", "=", this.companyId)
                                .execute()];
                    case 1:
                        rows = _a.sent();
                        return [2 /*return*/, this.groupAndTransformRows(rows, true)];
                }
            });
        });
    };
    ContactSyncer.prototype.fetchSuppliersByIds = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (ids.length === 0)
                            return [2 /*return*/, new Map()];
                        return [4 /*yield*/, this.database
                                .selectFrom("supplier")
                                .leftJoin("supplierTax", "supplierTax.supplierId", "supplier.id")
                                .leftJoin("supplierLocation", "supplierLocation.supplierId", "supplier.id")
                                .leftJoin("address", "address.id", "supplierLocation.addressId")
                                .leftJoin("supplierContact", "supplierContact.supplierId", "supplier.id")
                                .leftJoin("contact", "contact.id", "supplierContact.contactId")
                                .select([
                                "supplier.id",
                                "supplier.name",
                                "supplier.companyId",
                                "supplierTax.taxId as taxId",
                                "supplier.phone",
                                "supplier.fax",
                                "supplier.website",
                                "supplier.currencyCode",
                                "supplier.updatedAt",
                                "supplierLocation.name as locationName",
                                "address.addressLine1",
                                "address.addressLine2",
                                "address.city",
                                "address.postalCode",
                                // Contact details from linked contact
                                "contact.firstName as contactFirstName",
                                "contact.lastName as contactLastName",
                                "contact.email as contactEmail",
                                "contact.mobilePhone as contactMobilePhone",
                                "contact.homePhone as contactHomePhone",
                                "contact.workPhone as contactWorkPhone"
                            ])
                                .where("supplier.id", "in", ids)
                                .where("supplier.companyId", "=", this.companyId)
                                .execute()];
                    case 1:
                        rows = _a.sent();
                        return [2 /*return*/, this.groupAndTransformRows(rows, false)];
                }
            });
        });
    };
    ContactSyncer.prototype.groupAndTransformRows = function (rows, isCustomer) {
        var _a;
        var result = new Map();
        // Group rows by ID
        var groups = new Map();
        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var row = rows_1[_i];
            var existing = (_a = groups.get(row.id)) !== null && _a !== void 0 ? _a : [];
            existing.push(row);
            groups.set(row.id, existing);
        }
        for (var _b = 0, groups_1 = groups; _b < groups_1.length; _b++) {
            var _c = groups_1[_b], id = _c[0], groupRows = _c[1];
            var addresses = this.transformAddressRows(groupRows);
            result.set(id, this.buildContact(groupRows[0], addresses, isCustomer));
        }
        return result;
    };
    ContactSyncer.prototype.transformAddressRows = function (rows) {
        return rows
            .filter(function (r) { return r.addressLine1 || r.city; })
            .map(function (r) {
            var _a, _b, _c, _d, _e;
            return ({
                label: (_a = r.locationName) !== null && _a !== void 0 ? _a : null,
                type: null,
                line1: (_b = r.addressLine1) !== null && _b !== void 0 ? _b : null,
                line2: (_c = r.addressLine2) !== null && _c !== void 0 ? _c : null,
                city: (_d = r.city) !== null && _d !== void 0 ? _d : null,
                country: null,
                region: null,
                postalCode: (_e = r.postalCode) !== null && _e !== void 0 ? _e : null
            });
        });
    };
    ContactSyncer.prototype.buildContact = function (row, addresses, isCustomer) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return {
            id: row.id,
            name: row.name,
            // Use contact details from linked contact if available
            firstName: (_a = row.contactFirstName) !== null && _a !== void 0 ? _a : "",
            lastName: (_b = row.contactLastName) !== null && _b !== void 0 ? _b : "",
            companyId: row.companyId,
            email: (_c = row.contactEmail) !== null && _c !== void 0 ? _c : undefined,
            website: (_d = row.website) !== null && _d !== void 0 ? _d : null,
            taxId: (_e = row.taxId) !== null && _e !== void 0 ? _e : null,
            currencyCode: (_f = row.currencyCode) !== null && _f !== void 0 ? _f : "USD",
            balance: null,
            creditLimit: null,
            paymentTerms: null,
            updatedAt: (_g = row.updatedAt) !== null && _g !== void 0 ? _g : new Date().toISOString(),
            // Prefer contact's phone numbers, fall back to customer/supplier phone
            workPhone: (_j = (_h = row.contactWorkPhone) !== null && _h !== void 0 ? _h : row.phone) !== null && _j !== void 0 ? _j : null,
            mobilePhone: (_k = row.contactMobilePhone) !== null && _k !== void 0 ? _k : null,
            fax: (_l = row.fax) !== null && _l !== void 0 ? _l : null,
            homePhone: (_m = row.contactHomePhone) !== null && _m !== void 0 ? _m : null,
            isVendor: !isCustomer,
            isCustomer: isCustomer,
            addresses: addresses,
            raw: row
        };
    };
    // =================================================================
    // 3. REMOTE FETCH (Single + Batch)
    // =================================================================
    ContactSyncer.prototype.fetchRemote = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.provider.request("GET", "/Contacts/".concat(id))];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, result.error ? null : ((_c = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.Contacts) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : null)];
                }
            });
        });
    };
    ContactSyncer.prototype.fetchRemoteBatch = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var result, response, _i, _a, contact;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = new Map();
                        if (ids.length === 0)
                            return [2 /*return*/, result];
                        return [4 /*yield*/, this.provider.request("GET", "/Contacts?IDs=".concat(ids.join(",")))];
                    case 1:
                        response = _c.sent();
                        if (response.error) {
                            (0, utils_1.throwXeroApiError)("fetch contacts batch", response);
                        }
                        if ((_b = response.data) === null || _b === void 0 ? void 0 : _b.Contacts) {
                            for (_i = 0, _a = response.data.Contacts; _i < _a.length; _i++) {
                                contact = _a[_i];
                                result.set(contact.ContactID, contact);
                            }
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // =================================================================
    // 4. TRANSFORMATION (Carbon -> Xero)
    // =================================================================
    ContactSyncer.prototype.mapToRemote = function (local) {
        return __awaiter(this, void 0, void 0, function () {
            var existingRemoteId, phones, addresses;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.getRemoteId(local.id)];
                    case 1:
                        existingRemoteId = _d.sent();
                        phones = [];
                        if (local.workPhone)
                            phones.push({ PhoneType: "DEFAULT", PhoneNumber: local.workPhone });
                        if (local.mobilePhone)
                            phones.push({ PhoneType: "MOBILE", PhoneNumber: local.mobilePhone });
                        if (local.fax)
                            phones.push({ PhoneType: "FAX", PhoneNumber: local.fax });
                        if (local.homePhone)
                            phones.push({ PhoneType: "DDI", PhoneNumber: local.homePhone });
                        addresses = local.addresses.map(function (a) {
                            var _a, _b, _c, _d, _e, _f, _g;
                            return ({
                                AddressType: "STREET",
                                AddressLine1: (_a = a.line1) !== null && _a !== void 0 ? _a : undefined,
                                AddressLine2: (_b = a.line2) !== null && _b !== void 0 ? _b : undefined,
                                City: (_c = a.city) !== null && _c !== void 0 ? _c : undefined,
                                Region: (_d = a.region) !== null && _d !== void 0 ? _d : undefined,
                                PostalCode: (_e = a.postalCode) !== null && _e !== void 0 ? _e : undefined,
                                Country: (_f = a.country) !== null && _f !== void 0 ? _f : undefined,
                                AttentionTo: (_g = a.label) !== null && _g !== void 0 ? _g : undefined
                            });
                        });
                        return [2 /*return*/, {
                                ContactID: existingRemoteId,
                                ContactStatus: "ACTIVE",
                                Name: local.name,
                                FirstName: local.firstName || undefined,
                                LastName: local.lastName || undefined,
                                EmailAddress: (_a = local.email) !== null && _a !== void 0 ? _a : undefined,
                                Website: (_b = local.website) !== null && _b !== void 0 ? _b : undefined,
                                TaxNumber: (_c = local.taxId) !== null && _c !== void 0 ? _c : undefined,
                                DefaultCurrency: local.currencyCode,
                                IsCustomer: local.isCustomer,
                                IsSupplier: local.isVendor,
                                Phones: phones,
                                Addresses: addresses,
                                ContactGroups: [],
                                ContactPersons: [],
                                HasAttachments: false,
                                HasValidationErrors: false
                            }];
                }
            });
        });
    };
    // =================================================================
    // 5. TRANSFORMATION (Xero -> Carbon)
    // =================================================================
    ContactSyncer.prototype.mapToLocal = function (remote) {
        return __awaiter(this, void 0, void 0, function () {
            var phones, findPhone, addresses;
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                phones = (_a = remote.Phones) !== null && _a !== void 0 ? _a : [];
                findPhone = function (type) { var _a, _b; return (_b = (_a = phones.find(function (p) { return p.PhoneType === type; })) === null || _a === void 0 ? void 0 : _a.PhoneNumber) !== null && _b !== void 0 ? _b : null; };
                addresses = ((_b = remote.Addresses) !== null && _b !== void 0 ? _b : []).map(function (a) {
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    return ({
                        label: (_a = a.AttentionTo) !== null && _a !== void 0 ? _a : null,
                        type: (_b = a.AddressType) !== null && _b !== void 0 ? _b : null,
                        line1: (_c = a.AddressLine1) !== null && _c !== void 0 ? _c : null,
                        line2: (_d = a.AddressLine2) !== null && _d !== void 0 ? _d : null,
                        city: (_e = a.City) !== null && _e !== void 0 ? _e : null,
                        region: (_f = a.Region) !== null && _f !== void 0 ? _f : null,
                        country: (_g = a.Country) !== null && _g !== void 0 ? _g : null,
                        postalCode: (_h = a.PostalCode) !== null && _h !== void 0 ? _h : null
                    });
                });
                return [2 /*return*/, {
                        name: remote.Name,
                        firstName: (_c = remote.FirstName) !== null && _c !== void 0 ? _c : "",
                        lastName: (_d = remote.LastName) !== null && _d !== void 0 ? _d : "",
                        email: (_e = remote.EmailAddress) !== null && _e !== void 0 ? _e : undefined,
                        website: (_f = remote.Website) !== null && _f !== void 0 ? _f : null,
                        taxId: (_g = remote.TaxNumber) !== null && _g !== void 0 ? _g : null,
                        currencyCode: (_h = remote.DefaultCurrency) !== null && _h !== void 0 ? _h : "USD",
                        isCustomer: remote.IsCustomer,
                        isVendor: remote.IsSupplier,
                        workPhone: findPhone("DEFAULT"),
                        mobilePhone: findPhone("MOBILE"),
                        fax: findPhone("FAX"),
                        homePhone: findPhone("DDI"),
                        addresses: addresses
                    }];
            });
        });
    };
    // =================================================================
    // 6. UPSERT LOCAL
    // =================================================================
    ContactSyncer.prototype.upsertLocal = function (tx, data, remoteId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingLocalId, isVendor, entityId;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getLocalId(remoteId)];
                    case 1:
                        existingLocalId = _b.sent();
                        isVendor = data.isVendor && !data.isCustomer ? true : false;
                        if (!(!existingLocalId && data.name)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.findLocalEntityByName(tx, data.name, isVendor)];
                    case 2:
                        existingLocalId = _b.sent();
                        _b.label = 3;
                    case 3: return [4 /*yield*/, this.upsertEntity(tx, data, existingLocalId, isVendor)];
                    case 4:
                        entityId = _b.sent();
                        return [4 /*yield*/, this.upsertEntityTax(tx, entityId, (_a = data.taxId) !== null && _a !== void 0 ? _a : null, isVendor)];
                    case 5:
                        _b.sent();
                        // 2. Upsert contact and link to customer/supplier
                        return [4 /*yield*/, this.upsertContactAndLink(tx, data, remoteId, entityId, isVendor)];
                    case 6:
                        // 2. Upsert contact and link to customer/supplier
                        _b.sent();
                        return [2 /*return*/, entityId];
                }
            });
        });
    };
    /**
     * Try to find an existing customer/supplier by name within the same company.
     * Used for smart matching during backfill when no ID mapping exists yet.
     */
    ContactSyncer.prototype.findLocalEntityByName = function (tx, name, isVendor) {
        return __awaiter(this, void 0, void 0, function () {
            var table, match;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        table = isVendor ? "supplier" : "customer";
                        return [4 /*yield*/, tx
                                .selectFrom(table)
                                .select("id")
                                .where("name", "=", name)
                                .where("companyId", "=", this.companyId)
                                .executeTakeFirst()];
                    case 1:
                        match = _b.sent();
                        return [2 /*return*/, (_a = match === null || match === void 0 ? void 0 : match.id) !== null && _a !== void 0 ? _a : null];
                }
            });
        });
    };
    ContactSyncer.prototype.upsertEntity = function (tx, data, existingId, isVendor) {
        return __awaiter(this, void 0, void 0, function () {
            var table, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        table = isVendor ? "supplier" : "customer";
                        if (!existingId) return [3 /*break*/, 2];
                        return [4 /*yield*/, tx
                                .updateTable(table)
                                .set({
                                name: data.name,
                                website: data.website,
                                phone: data.workPhone,
                                fax: data.fax,
                                currencyCode: data.currencyCode,
                                updatedAt: new Date().toISOString()
                            })
                                .where("id", "=", existingId)
                                .execute()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, existingId];
                    case 2: return [4 /*yield*/, tx
                            .insertInto(table)
                            .values({
                            companyId: this.companyId,
                            name: data.name,
                            website: data.website,
                            phone: data.workPhone,
                            fax: data.fax,
                            currencyCode: data.currencyCode,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        })
                            .returning("id")
                            .executeTakeFirstOrThrow()];
                    case 3:
                        result = _a.sent();
                        return [2 /*return*/, result.id];
                }
            });
        });
    };
    ContactSyncer.prototype.upsertEntityTax = function (tx, entityId, taxId, isVendor) {
        return __awaiter(this, void 0, void 0, function () {
            var table, fkColumn;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        table = isVendor ? "supplierTax" : "customerTax";
                        fkColumn = isVendor ? "supplierId" : "customerId";
                        return [4 /*yield*/, tx
                                .insertInto(table)
                                .values((_a = {},
                                _a[fkColumn] = entityId,
                                _a.taxId = taxId,
                                _a.companyId = this.companyId,
                                _a.updatedAt = new Date().toISOString(),
                                _a))
                                .onConflict(function (oc) {
                                return oc.column(fkColumn).doUpdateSet({
                                    taxId: taxId,
                                    updatedAt: new Date().toISOString()
                                });
                            })
                                .execute()];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContactSyncer.prototype.upsertContactAndLink = function (tx, data, _remoteId, entityId, isVendor) {
        return __awaiter(this, void 0, void 0, function () {
            var junctionTable, fkColumn, existingJunction, firstName, lastName, contactId, result;
            var _a;
            var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            return __generator(this, function (_o) {
                switch (_o.label) {
                    case 0:
                        junctionTable = isVendor ? "supplierContact" : "customerContact";
                        fkColumn = isVendor ? "supplierId" : "customerId";
                        return [4 /*yield*/, tx
                                .selectFrom(junctionTable)
                                .select("contactId")
                                .where(fkColumn, "=", entityId)
                                .executeTakeFirst()];
                    case 1:
                        existingJunction = _o.sent();
                        firstName = data.firstName || data.name || "";
                        lastName = (_b = data.lastName) !== null && _b !== void 0 ? _b : "";
                        if (!existingJunction) return [3 /*break*/, 3];
                        // Update existing contact person
                        return [4 /*yield*/, tx
                                .updateTable("contact")
                                .set({
                                email: (_c = data.email) !== null && _c !== void 0 ? _c : null,
                                firstName: firstName,
                                lastName: lastName,
                                workPhone: (_d = data.workPhone) !== null && _d !== void 0 ? _d : null,
                                mobilePhone: (_e = data.mobilePhone) !== null && _e !== void 0 ? _e : null,
                                homePhone: (_f = data.homePhone) !== null && _f !== void 0 ? _f : null,
                                fax: (_g = data.fax) !== null && _g !== void 0 ? _g : null
                            })
                                .where("id", "=", existingJunction.contactId)
                                .execute()];
                    case 2:
                        // Update existing contact person
                        _o.sent();
                        contactId = existingJunction.contactId;
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, tx
                            .insertInto("contact")
                            .values({
                            companyId: this.companyId,
                            email: (_h = data.email) !== null && _h !== void 0 ? _h : null,
                            firstName: firstName,
                            lastName: lastName,
                            workPhone: (_j = data.workPhone) !== null && _j !== void 0 ? _j : null,
                            mobilePhone: (_k = data.mobilePhone) !== null && _k !== void 0 ? _k : null,
                            homePhone: (_l = data.homePhone) !== null && _l !== void 0 ? _l : null,
                            fax: (_m = data.fax) !== null && _m !== void 0 ? _m : null,
                            isCustomer: !isVendor
                        })
                            .returning("id")
                            .executeTakeFirstOrThrow()];
                    case 4:
                        result = _o.sent();
                        contactId = result.id;
                        // Create the junction link
                        return [4 /*yield*/, tx
                                .insertInto(junctionTable)
                                .values((_a = {}, _a[fkColumn] = entityId, _a.contactId = contactId, _a))
                                .execute()];
                    case 5:
                        // Create the junction link
                        _o.sent();
                        _o.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // =================================================================
    // 7. UPSERT REMOTE (Single + Batch)
    // =================================================================
    ContactSyncer.prototype.upsertRemote = function (data, localId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingRemoteId, contacts, result;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.getRemoteId(localId)];
                    case 1:
                        existingRemoteId = _d.sent();
                        if (!(!existingRemoteId && data.Name)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.findRemoteContactByName(data.Name)];
                    case 2:
                        existingRemoteId = _d.sent();
                        _d.label = 3;
                    case 3:
                        contacts = existingRemoteId
                            ? [__assign(__assign({}, data), { ContactID: existingRemoteId })]
                            : [data];
                        return [4 /*yield*/, this.provider.request("POST", "/Contacts", { body: JSON.stringify({ Contacts: contacts }) })];
                    case 4:
                        result = _d.sent();
                        if (result.error) {
                            (0, utils_1.throwXeroApiError)(existingRemoteId ? "update contact" : "create contact", result);
                        }
                        if (!((_c = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.Contacts) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.ContactID)) {
                            throw new Error("Xero API returned success but no ContactID was returned");
                        }
                        return [2 /*return*/, result.data.Contacts[0].ContactID];
                }
            });
        });
    };
    /**
     * Search Xero for an existing contact by exact name match.
     * Used for smart matching during backfill when no ID mapping exists yet.
     */
    ContactSyncer.prototype.findRemoteContactByName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var escapedName, result;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        escapedName = name.replace(/"/g, '\\"');
                        return [4 /*yield*/, this.provider.request("GET", "/Contacts?where=Name==\"".concat(escapedName, "\""))];
                    case 1:
                        result = _d.sent();
                        if (!result.error && ((_c = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.Contacts) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.ContactID)) {
                            return [2 /*return*/, result.data.Contacts[0].ContactID];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    ContactSyncer.prototype.upsertRemoteBatch = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var result, contacts, localIdOrder, _i, data_1, _a, localId, payload, existingRemoteId, response, i, returnedContact, localId;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = new Map();
                        if (data.length === 0)
                            return [2 /*return*/, result];
                        contacts = [];
                        localIdOrder = [];
                        _i = 0, data_1 = data;
                        _c.label = 1;
                    case 1:
                        if (!(_i < data_1.length)) return [3 /*break*/, 4];
                        _a = data_1[_i], localId = _a.localId, payload = _a.payload;
                        return [4 /*yield*/, this.getRemoteId(localId)];
                    case 2:
                        existingRemoteId = _c.sent();
                        contacts.push(existingRemoteId
                            ? __assign(__assign({}, payload), { ContactID: existingRemoteId })
                            : payload);
                        localIdOrder.push(localId);
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, this.provider.request("POST", "/Contacts", { body: JSON.stringify({ Contacts: contacts }) })];
                    case 5:
                        response = _c.sent();
                        if (response.error) {
                            (0, utils_1.throwXeroApiError)("batch upsert contacts", response);
                        }
                        if (!((_b = response.data) === null || _b === void 0 ? void 0 : _b.Contacts)) {
                            throw new Error("Xero API returned success but no Contacts array was returned");
                        }
                        for (i = 0; i < response.data.Contacts.length; i++) {
                            returnedContact = response.data.Contacts[i];
                            localId = localIdOrder[i];
                            if ((returnedContact === null || returnedContact === void 0 ? void 0 : returnedContact.ContactID) && localId) {
                                result.set(localId, returnedContact.ContactID);
                            }
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return ContactSyncer;
}(types_1.BaseEntitySyncer));
exports.ContactSyncer = ContactSyncer;
