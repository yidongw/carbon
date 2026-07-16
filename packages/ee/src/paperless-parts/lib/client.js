"use strict";
// This file is generated with the following command:
// npx swagger-typescript-api -p ~/Downloads/openapi.yaml -o ~/Downloads/
// Download the openapi.yaml file from https://docs.paperlessparts.com/v2
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaperlessPartsClient = exports.HttpClient = exports.ContentType = void 0;
var ContentType;
(function (ContentType) {
    ContentType["Json"] = "application/json";
    ContentType["FormData"] = "multipart/form-data";
    ContentType["UrlEncoded"] = "application/x-www-form-urlencoded";
    ContentType["Text"] = "text/plain";
})(ContentType || (exports.ContentType = ContentType = {}));
var HttpClient = /** @class */ (function () {
    function HttpClient(apiConfig) {
        var _a;
        if (apiConfig === void 0) { apiConfig = {}; }
        var _this = this;
        this.baseUrl = "https://api.paperlessparts.com";
        this.securityData = null;
        this.abortControllers = new Map();
        this.customFetch = function () {
            var fetchParams = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                fetchParams[_i] = arguments[_i];
            }
            return fetch.apply(void 0, fetchParams);
        };
        this.baseApiParams = {
            credentials: "same-origin",
            headers: {},
            redirect: "follow",
            referrerPolicy: "no-referrer"
        };
        this.setSecurityData = function (data) {
            _this.securityData = data;
        };
        this.contentFormatters = (_a = {},
            _a[ContentType.Json] = function (input) {
                return input !== null && (typeof input === "object" || typeof input === "string")
                    ? JSON.stringify(input)
                    : input;
            },
            _a[ContentType.Text] = function (input) {
                return input !== null && typeof input !== "string"
                    ? JSON.stringify(input)
                    : input;
            },
            _a[ContentType.FormData] = function (input) {
                return Object.keys(input || {}).reduce(function (formData, key) {
                    var property = input[key];
                    formData.append(key, property instanceof Blob
                        ? property
                        : typeof property === "object" && property !== null
                            ? JSON.stringify(property)
                            : "".concat(property));
                    return formData;
                }, new FormData());
            },
            _a[ContentType.UrlEncoded] = function (input) { return _this.toQueryString(input); },
            _a);
        this.createAbortSignal = function (cancelToken) {
            if (_this.abortControllers.has(cancelToken)) {
                var abortController_1 = _this.abortControllers.get(cancelToken);
                if (abortController_1) {
                    return abortController_1.signal;
                }
                return void 0;
            }
            var abortController = new AbortController();
            _this.abortControllers.set(cancelToken, abortController);
            return abortController.signal;
        };
        this.abortRequest = function (cancelToken) {
            var abortController = _this.abortControllers.get(cancelToken);
            if (abortController) {
                abortController.abort();
                _this.abortControllers.delete(cancelToken);
            }
        };
        this.request = function (_a) { return __awaiter(_this, void 0, void 0, function () {
            var secureParams, _b, requestParams, queryString, payloadFormatter, responseFormat;
            var _this = this;
            var body = _a.body, secure = _a.secure, path = _a.path, type = _a.type, query = _a.query, format = _a.format, baseUrl = _a.baseUrl, cancelToken = _a.cancelToken, params = __rest(_a, ["body", "secure", "path", "type", "query", "format", "baseUrl", "cancelToken"]);
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
                            this.securityWorker;
                        if (!_b) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.securityWorker(this.securityData)];
                    case 1:
                        _b = (_c.sent());
                        _c.label = 2;
                    case 2:
                        secureParams = (_b) ||
                            {};
                        requestParams = this.mergeRequestParams(params, secureParams);
                        queryString = query && this.toQueryString(query);
                        payloadFormatter = this.contentFormatters[type || ContentType.Json];
                        responseFormat = format || requestParams.format;
                        return [2 /*return*/, this.customFetch("".concat(baseUrl || this.baseUrl || "").concat(path).concat(queryString ? "?".concat(queryString) : ""), __assign(__assign({}, requestParams), { headers: __assign(__assign({}, (requestParams.headers || {})), (type && type !== ContentType.FormData
                                    ? { "Content-Type": type }
                                    : {})), signal: (cancelToken
                                    ? this.createAbortSignal(cancelToken)
                                    : requestParams.signal) || null, body: typeof body === "undefined" || body === null
                                    ? null
                                    : payloadFormatter(body) })).then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                                var r, data, _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            r = response.clone();
                                            r.data = null;
                                            r.error = null;
                                            if (!!responseFormat) return [3 /*break*/, 1];
                                            _a = r;
                                            return [3 /*break*/, 3];
                                        case 1: return [4 /*yield*/, response[responseFormat]()
                                                .then(function (data) {
                                                if (r.ok) {
                                                    r.data = data;
                                                }
                                                else {
                                                    r.error = data;
                                                }
                                                return r;
                                            })
                                                .catch(function (e) {
                                                r.error = e;
                                                return r;
                                            })];
                                        case 2:
                                            _a = _b.sent();
                                            _b.label = 3;
                                        case 3:
                                            data = _a;
                                            if (cancelToken) {
                                                this.abortControllers.delete(cancelToken);
                                            }
                                            if (!response.ok)
                                                throw data;
                                            return [2 /*return*/, data];
                                    }
                                });
                            }); })];
                }
            });
        }); };
        Object.assign(this, apiConfig);
    }
    HttpClient.prototype.encodeQueryParam = function (key, value) {
        var encodedKey = encodeURIComponent(key);
        return "".concat(encodedKey, "=").concat(encodeURIComponent(typeof value === "number" ? value : "".concat(value)));
    };
    HttpClient.prototype.addQueryParam = function (query, key) {
        return this.encodeQueryParam(key, query[key]);
    };
    HttpClient.prototype.addArrayQueryParam = function (query, key) {
        var _this = this;
        var value = query[key];
        return value.map(function (v) { return _this.encodeQueryParam(key, v); }).join("&");
    };
    HttpClient.prototype.toQueryString = function (rawQuery) {
        var _this = this;
        var query = rawQuery || {};
        var keys = Object.keys(query).filter(function (key) { return "undefined" !== typeof query[key]; });
        return keys
            .map(function (key) {
            return Array.isArray(query[key])
                ? _this.addArrayQueryParam(query, key)
                : _this.addQueryParam(query, key);
        })
            .join("&");
    };
    HttpClient.prototype.addQueryParams = function (rawQuery) {
        var queryString = this.toQueryString(rawQuery);
        return queryString ? "?".concat(queryString) : "";
    };
    HttpClient.prototype.mergeRequestParams = function (params1, params2) {
        return __assign(__assign(__assign(__assign({}, this.baseApiParams), params1), (params2 || {})), { headers: __assign(__assign(__assign({}, (this.baseApiParams.headers || {})), (params1.headers || {})), ((params2 && params2.headers) || {})) });
    };
    return HttpClient;
}());
exports.HttpClient = HttpClient;
/**
 * @title Paperless Parts API
 * @version 1.0
 * @termsOfService https://www.paperlessparts.com/web-service-agreement/
 * @baseUrl https://api.paperlessparts.com/
 * @contact Paperless Parts <support@paperlessparts.com> (https://www.paperlessparts.com)
 *
 *  The Paperless Parts API provides access to your data, enabling developers to easily integrate Paperless Parts with third-party systems, such as Customer Relationship Management (CRM) and Enterprise Resource Planning (ERP) tools. The API is designed to support two primary use case. First, reading all information associated with a particular order or quote for import into another system. Second, managing customer data, either for an initial bulk import or for on-going synchronization with an external database.
 * ## Authorization ##
 * Requests are authorized via an API key. Administrators of a Paperless Parts account can generate an API Token which grants access to all of the endpoints documented here. The token obtained from the application must be added to the header of all requests using the key `"Authorization"` with the value `"API-Token <api_token>"`, where `<api_token>` is your Paperless Parts API Token.
 *
 * You can use the "Execute" button in an endpoint's documentation on this page to try out the endpoint. This will send a request to the endpoint on the Paperless Parts server and display the result on this page. Before doing so, however, you'll need to click on the 'Authorize' button at the top of the screen, and in the "Value" field enter `"API-Token <api_token>"`, where `<api_token>` is your API token as described above.
 *
 * ## Overview ##
 * The API endpoints are organized around REST. API calls should be made to the `https://api.paperlessparts.com` base domain. URLs are designed to clearly describe an entity or collection of entities. HTTP verbs typically describe whether entities are being read, created, modified, or deleted. Where applicable, request and response bodies are in JSON format. Standard HTTP response codes, in addition to error messages, are used to help explain request failures.
 * ### Associations
 * Many entities in the API data model are associated with other entities. As a guiding principle, `GET` requests that fetch data nest associated entities in the JSON response. However, when creating or modifying entities, a flat (non-nested) object must be provided, as explained in the documentation for each endpoint. Associations are specified when writing data by using entity IDs in fields ending in `_id`.
 *
 * For example, consider the relationship where a Company has many Customers. When fetching a Customer via a `GET` request, the associated Company will be nested as an object with key `company` in the response. When creating a Customer, the Company is specified via its integer id using the key `company_id`.
 * ### HTTP Methods
 * The API endpoints support different HTTP methods depending on whether records are being read, created, or updated. To read an entity, use `GET`. To create a new entity, use `POST`. To modifying an entity, use `PATCH`. Note, `PATCH` is used rather than `PUT` to indicate that entities can be partially updated. In other words, in general, if a field is omitted from a `PATCH` request, that field's value will stay the same (rather than be set to `null`). All fields requiring values are required to be included in `POST` requests.
 * > Note: Endpoints with a documented `PATCH` method can generally be used with a `PUT` method. The `PUT` is implemented as a partial update (as opposed to a replacement) and is supported for maximum compatibilty.
 *
 * For example, consider the `email` field on the Customer entity, which is required. All Customers must have a non-null `email`. When creating a Customer via `POST`, the request body must contain an `email` key and its value cannot be `null` (other validation applies to that field, as well, including a valid email format and a unique value). When editing a Customer via `PATCH` request, it is not necessary to include an `email` key in the request body. If `email` is omitted, the existing email address will not be changed. If you send a `PATCH` request with `email=null`, then you will receive an error response indicating that a value for `email` is required.
 */
var PaperlessPartsClient = /** @class */ (function (_super) {
    __extends(PaperlessPartsClient, _super);
    function PaperlessPartsClient(apiKey, apiConfig) {
        if (apiConfig === void 0) { apiConfig = {}; }
        var _this = this;
        var _a;
        var baseApiParams = __assign(__assign({}, apiConfig.baseApiParams), { headers: __assign(__assign({}, (_a = apiConfig.baseApiParams) === null || _a === void 0 ? void 0 : _a.headers), { Authorization: "API-Token ".concat(apiKey) }) });
        _this = _super.call(this, __assign(__assign({}, apiConfig), { baseApiParams: baseApiParams })) || this;
        _this.quotes = {
            /**
             * @description List the numbers and revisions of new quotes that have been sent. If the number and (optional) revision of the last known sent quote is supplied, this endpoint will return a list of the numbers and revisions of the quotes sent after the specified quote. If no number is provided, this endpoint will return a list of the numbers and revisions of all sent quotes. Note that the quote numbers will be returned in the order the quotes were sent, not necessarily in ascending numerical order.
             *
             * @tags Quotes
             * @name NewQuoteNumbers
             * @summary List new quote numbers and revisions
             * @request GET:/quotes/public/new
             * @secure
             */
            newQuoteNumbers: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/quotes/public/new", method: "GET", query: query, secure: true, format: "json" }, params));
            },
            /**
             * @description Get the details for a specific quote.
             *
             * @tags Quotes
             * @name QuoteDetails
             * @summary Get quote details
             * @request GET:/quotes/public/{quoteNumber}
             * @secure
             */
            quoteDetails: function (quoteNumber, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/quotes/public/".concat(quoteNumber), method: "GET", query: query, secure: true, format: "json" }, params));
            },
            /**
             * @description Update fields on a Quote.
             *
             * @tags Quotes
             * @name UpdateQuote
             * @summary Update fields on a Quote
             * @request PATCH:/quotes/public/{quoteNumber}
             * @secure
             */
            updateQuote: function (quoteNumber, data, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/quotes/public/".concat(quoteNumber), method: "PATCH", query: query, body: data, secure: true, type: ContentType.Json, format: "json" }, params));
            },
            /**
             * @description Update a specific quote's status.
             *
             * @tags Quotes
             * @name SetQuoteStatus
             * @summary Update a quote's status
             * @request PATCH:/quotes/public/{quoteNumber}/status_change
             * @secure
             */
            setQuoteStatus: function (quoteNumber, data, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/quotes/public/".concat(quoteNumber, "/status_change"), method: "PATCH", query: query, body: data, secure: true, type: ContentType.Json, format: "json" }, params));
            }
        };
        _this.orders = {
            /**
             * @description List the numbers of new orders that have been created. If the number of the last known order is supplied, this endpoint will return a list of the numbers of the orders created after the specified order. If no number is provided, this endpoint will return a list of all available order numbers.
             *
             * @tags Orders
             * @name NewOrderNumbers
             * @summary List new order numbers
             * @request GET:/orders/public/new
             * @secure
             */
            newOrderNumbers: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/orders/public/new", method: "GET", query: query, secure: true, format: "json" }, params));
            },
            /**
             * @description Get the details for a specific order.
             *
             * @tags Orders
             * @name OrderDetails
             * @summary Get order details
             * @request GET:/orders/public/{orderNumber}
             * @secure
             */
            orderDetails: function (orderNumber, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/orders/public/".concat(orderNumber), method: "GET", secure: true, format: "json" }, params));
            },
            /**
             * @description Update fields on an Order.
             *
             * @tags Orders
             * @name UpdateOrder
             * @summary Update fields on an Order
             * @request PATCH:/orders/public/{orderNumber}
             * @secure
             */
            updateOrder: function (orderNumber, data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/orders/public/".concat(orderNumber), method: "PATCH", body: data, secure: true, type: ContentType.Json, format: "json" }, params));
            },
            /**
             * No description
             *
             * @tags Orders
             * @name PublicFacilitateOrderCreate
             * @summary Create an order from a quote
             * @request POST:/orders/public/facilitate_order
             * @secure
             */
            publicFacilitateOrderCreate: function (data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/orders/public/facilitate_order", method: "POST", body: data, secure: true, type: ContentType.Json }, params));
            }
        };
        _this.contacts = {
            /**
             * @description Returns a list of contacts. The contacts are returned 20 results at a time and can be iterated over by using the page parameter.
             *
             * @tags Customers
             * @name ListContacts
             * @summary List contacts
             * @request GET:/contacts/public
             * @secure
             */
            listContacts: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/contacts/public", method: "GET", query: query, secure: true, format: "json" }, params));
            },
            /**
             * @description Creates a new contact.
             *
             * @tags Customers
             * @name CreateContact
             * @summary Create new contact
             * @request POST:/contacts/public
             * @secure
             */
            createContact: function (data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/contacts/public", method: "POST", body: data, secure: true, type: ContentType.Json, format: "json" }, params));
            },
            /**
             * @description Get all Contact attributes
             *
             * @tags Customers
             * @name ContactDetails
             * @summary Get details about a Contact
             * @request GET:/contacts/public/{contactId}
             * @secure
             */
            contactDetails: function (contactId, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/contacts/public/".concat(contactId), method: "GET", secure: true, format: "json" }, params));
            },
            /**
             * @description Partially update Contact attributes (not including associated entities)
             *
             * @tags Customers
             * @name UpdateCustomer
             * @summary Update a Contact
             * @request PATCH:/contacts/public/{contactId}
             * @secure
             */
            updateCustomer: function (contactId, data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/contacts/public/".concat(contactId), method: "PATCH", body: data, secure: true, type: ContentType.Json, format: "json" }, params));
            }
        };
        _this.accounts = {
            /**
             * @description Returns a list of accounts. The accounts are returned 20 results at a time and can be iterated over by using the page parameter.
             *
             * @tags Customers
             * @name ListAccounts
             * @summary List accounts
             * @request GET:/accounts/public
             * @secure
             */
            listAccounts: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/accounts/public", method: "GET", query: query, secure: true, format: "json" }, params));
            },
            /**
             * @description Creates a new account.
             *
             * @tags Customers
             * @name CreateAccount
             * @summary Create new Account
             * @request POST:/accounts/public
             * @secure
             */
            createAccount: function (data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/accounts/public", method: "POST", body: data, secure: true, type: ContentType.Json, format: "json" }, params));
            },
            /**
             * @description Get all Account attributes, including a list of billing addresses.
             *
             * @tags Customers
             * @name AccountDetails
             * @summary Get details about an Account
             * @request GET:/accounts/public/{accountId}
             * @secure
             */
            accountDetails: function (accountId, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/accounts/public/".concat(accountId), method: "GET", secure: true, format: "json" }, params));
            },
            /**
             * @description Partially update Account attributes (not including associated entities)
             *
             * @tags Customers
             * @name UpdateCompany
             * @summary Update an Account
             * @request PATCH:/accounts/public/{accountId}
             * @secure
             */
            updateCompany: function (accountId, data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/accounts/public/".concat(accountId), method: "PATCH", body: data, secure: true, type: ContentType.Json, format: "json" }, params));
            },
            /**
             * @description List all billing addresses associated with an account
             *
             * @tags Customers
             * @name ListBillingAddresses
             * @summary List account billing addresses
             * @request GET:/accounts/public/{accountId}/billing_addresses
             * @secure
             */
            listBillingAddresses: function (accountId, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/accounts/public/".concat(accountId, "/billing_addresses"), method: "GET", secure: true, format: "json" }, params));
            },
            /**
             * No description
             *
             * @tags Customers
             * @name CreateBillingAddress
             * @summary Create a new billing address for an account
             * @request POST:/accounts/public/{accountId}/billing_addresses
             * @secure
             */
            createBillingAddress: function (accountId, data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/accounts/public/".concat(accountId, "/billing_addresses"), method: "POST", body: data, secure: true, type: ContentType.Json, format: "json" }, params));
            },
            /**
             * @description List all facilities associated with an account
             *
             * @tags Customers
             * @name ListFacilities
             * @summary List account facilites
             * @request GET:/accounts/public/{accountId}/facilities
             * @secure
             */
            listFacilities: function (accountId, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/accounts/public/".concat(accountId, "/facilities"), method: "GET", secure: true, format: "json" }, params));
            },
            /**
             * No description
             *
             * @tags Customers
             * @name CreateFacility
             * @summary Create a new facility for an account
             * @request POST:/accounts/public/{accountId}/facilities
             * @secure
             */
            createFacility: function (accountId, data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/accounts/public/".concat(accountId, "/facilities"), method: "POST", body: data, secure: true, type: ContentType.Json, format: "json" }, params));
            }
        };
        _this.billingAddresses = {
            /**
             * @description Get a sepecific billing address
             *
             * @tags Customers
             * @name BillingAddress
             * @summary Get Billing Address
             * @request GET:/billing_addresses/public/{billingAddressId}
             * @secure
             */
            billingAddress: function (billingAddressId, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/billing_addresses/public/".concat(billingAddressId), method: "GET", secure: true, format: "json" }, params));
            },
            /**
             * @description Partially update a Billing Address
             *
             * @tags Customers
             * @name UpdateBillingAddress
             * @summary Update a Billing Address
             * @request PATCH:/billing_addresses/public/{billingAddressId}
             * @secure
             */
            updateBillingAddress: function (billingAddressId, data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/billing_addresses/public/".concat(billingAddressId), method: "PATCH", body: data, secure: true, type: ContentType.Json, format: "json" }, params));
            }
        };
        _this.facilities = {
            /**
             * @description Get a sepecific facility
             *
             * @tags Customers
             * @name Facility
             * @summary Get A Facility
             * @request GET:/facilities/public/{facilityId}
             * @secure
             */
            facility: function (facilityId, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/facilities/public/".concat(facilityId), method: "GET", secure: true, format: "json" }, params));
            },
            /**
             * @description Partially update a Facility
             *
             * @tags Customers
             * @name UpdateFacility
             * @summary Update a Facility
             * @request PATCH:/facilities/public/{facilityId}
             * @secure
             */
            updateFacility: function (facilityId, data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/facilities/public/".concat(facilityId), method: "PATCH", body: data, secure: true, type: ContentType.Json, format: "json" }, params));
            }
        };
        _this.customers = {
            /**
             * @description Returns a list of payment terms available to be used for accounts.
             *
             * @tags Customers
             * @name ListPaymentTerms
             * @summary Returns a list of payment terms
             * @request GET:/customers/public/payment_terms
             * @secure
             */
            listPaymentTerms: function (params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/customers/public/payment_terms", method: "GET", secure: true, format: "json" }, params));
            }
        };
        _this.suppliers = {
            /**
             * @description Get a list of all the custom tables defined for this account.
             *
             * @tags Custom Tables
             * @name GetCustomTablesList
             * @summary Get a list of all the custom tables defined for this account.
             * @request GET:/suppliers/public/custom_tables
             * @secure
             */
            getCustomTablesList: function (params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/suppliers/public/custom_tables", method: "GET", secure: true, format: "json" }, params));
            },
            /**
             * @description Create a new custom table by supplying a name.
             *
             * @tags Custom Tables
             * @name CreateNewCustomTable
             * @summary Create a new custom table.
             * @request POST:/suppliers/public/custom_tables
             * @secure
             */
            createNewCustomTable: function (data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/suppliers/public/custom_tables", method: "POST", body: data, secure: true, type: ContentType.Json, format: "json" }, params));
            },
            /**
             * @description Get the details for a single table.
             *
             * @tags Custom Tables
             * @name GetCustomTableDetails
             * @summary Get the details for a single table.
             * @request GET:/suppliers/public/custom_tables/{tableName}
             * @secure
             */
            getCustomTableDetails: function (tableName, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/suppliers/public/custom_tables/".concat(tableName), method: "GET", secure: true, format: "json" }, params));
            },
            /**
             * @description Update a table's definition. You may rename the table, supply a new configuration, or supply new row data. Supplying new data without a new configuration will drop the existing data and populate the table with the new data (assuming the table has previously been configured) - this is not an append operation. Supplying a new configuration without new table data will apply the configuration and clear the table data. Supplying both a new configuration and new data will apply the configuration, drop the existing data, and populate the table with the new data.
             *
             * @tags Custom Tables
             * @name UpdateCustomTableDetails
             * @summary Update a table's definition.
             * @request PATCH:/suppliers/public/custom_tables/{tableName}
             * @secure
             */
            updateCustomTableDetails: function (tableName, data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/suppliers/public/custom_tables/".concat(tableName), method: "PATCH", body: data, secure: true, type: ContentType.Json, format: "json" }, params));
            },
            /**
             * @description List all purchased components
             *
             * @tags Purchased Components
             * @name ListPurchasedComponents
             * @summary List purchased components
             * @request GET:/suppliers/public/purchased_components
             * @secure
             */
            listPurchasedComponents: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/suppliers/public/purchased_components", method: "GET", query: query, secure: true, format: "json" }, params));
            },
            /**
             * @description Create a purchased component
             *
             * @tags Purchased Components
             * @name CreatePurchasedComponent
             * @summary Create purchased component
             * @request POST:/suppliers/public/purchased_components
             * @secure
             */
            createPurchasedComponent: function (data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/suppliers/public/purchased_components", method: "POST", body: data, secure: true, type: ContentType.Json, format: "json" }, params));
            },
            /**
             * @description Update a purchased component
             *
             * @tags Purchased Components
             * @name UpdatePurchasedComponent
             * @summary Update purchased component
             * @request PATCH:/suppliers/public/purchased_components/{purchasedComponentId}
             * @secure
             */
            updatePurchasedComponent: function (purchasedComponentId, data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/suppliers/public/purchased_components/".concat(purchasedComponentId), method: "PATCH", body: data, secure: true, type: ContentType.Json, format: "json" }, params));
            },
            /**
             * @description Delete a purchased component
             *
             * @tags Purchased Components
             * @name DeletePurchasedComponent
             * @summary Delete purchased component
             * @request DELETE:/suppliers/public/purchased_components/{purchasedComponentId}
             * @secure
             */
            deletePurchasedComponent: function (purchasedComponentId, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/suppliers/public/purchased_components/".concat(purchasedComponentId), method: "DELETE", secure: true }, params));
            },
            /**
             * @description List all custom purchased components columns
             *
             * @tags Purchased Components
             * @name ListPurchasedComponentsColumns
             * @summary List purchased components columns
             * @request GET:/suppliers/public/purchased_component_columns
             * @secure
             */
            listPurchasedComponentsColumns: function (params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/suppliers/public/purchased_component_columns", method: "GET", secure: true, format: "json" }, params));
            },
            /**
             * @description Creates a new custom purchased components columns
             *
             * @tags Purchased Components
             * @name CreatePurchasedComponentsColumn
             * @summary Create purchased components columns
             * @request POST:/suppliers/public/purchased_component_columns
             * @secure
             */
            createPurchasedComponentsColumn: function (data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/suppliers/public/purchased_component_columns", method: "POST", body: data, secure: true, type: ContentType.Json, format: "json" }, params));
            },
            /**
             * @description Updates an existing custom purchased components columns
             *
             * @tags Purchased Components
             * @name UpdatePurchasedComponentsColumn
             * @summary Update purchased components columns
             * @request PATCH:/suppliers/public/purchased_component_columns/{purchasedComponentsColumnId}
             * @secure
             */
            updatePurchasedComponentsColumn: function (purchasedComponentsColumnId, data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/suppliers/public/purchased_component_columns/".concat(purchasedComponentsColumnId), method: "PATCH", body: data, secure: true, type: ContentType.Json, format: "json" }, params));
            },
            /**
             * @description Deletes an existing custom purchased components columns
             *
             * @tags Purchased Components
             * @name DeletePurchasedComponentsColumn
             * @summary Delete purchased components columns
             * @request DELETE:/suppliers/public/purchased_component_columns/{purchasedComponentsColumnId}
             * @secure
             */
            deletePurchasedComponentsColumn: function (purchasedComponentsColumnId, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/suppliers/public/purchased_component_columns/".concat(purchasedComponentsColumnId), method: "DELETE", secure: true }, params));
            },
            /**
             * @description Retrieve all purchased components for account in csv format
             *
             * @tags Purchased Components
             * @name GetPurchasedComponentCsv
             * @summary Retrieve purchased components csv
             * @request GET:/suppliers/public/purchased_components_csv
             * @secure
             */
            getPurchasedComponentCsv: function (params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/suppliers/public/purchased_components_csv", method: "GET", secure: true }, params));
            },
            /**
             * @description Replace all purchased components for account based on uploaded csv
             *
             * @tags Purchased Components
             * @name PostPurchasedComponentCsv
             * @summary Upload purchased components csv
             * @request POST:/suppliers/public/purchased_components_csv
             * @secure
             */
            postPurchasedComponentCsv: function (data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/suppliers/public/purchased_components_csv", method: "POST", body: data, secure: true, type: ContentType.FormData }, params));
            }
        };
        _this.managedIntegrations = {
            /**
             * @description Returns a list of managed integrations. Use the ID provided from the managed integration to create integration actions
             *
             * @tags Integration Actions
             * @name ListManagedIntegrations
             * @summary Returns a list of managed integrations
             * @request GET:/managed_integrations/public
             * @secure
             */
            listManagedIntegrations: function (params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/managed_integrations/public", method: "GET", secure: true, format: "json" }, params));
            },
            /**
             * @description Creates a new managed integration. This is required to later create integration actions
             *
             * @tags Integration Actions
             * @name CreateManagedIntegration
             * @summary Create managed integration
             * @request POST:/managed_integrations/public
             * @secure
             */
            createManagedIntegration: function (data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/managed_integrations/public", method: "POST", body: data, secure: true, type: ContentType.Json, format: "json" }, params));
            },
            /**
             * @description Get the details for a managed integration
             *
             * @tags Integration Actions
             * @name GetManagedIntegration
             * @summary Get managed integration details
             * @request GET:/managed_integrations/public/{managedIntegrationId}
             * @secure
             */
            getManagedIntegration: function (managedIntegrationId, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/managed_integrations/public/".concat(managedIntegrationId), method: "GET", secure: true, format: "json" }, params));
            },
            /**
             * @description Update fields on a managed integration. Cannot update ID or erp_name
             *
             * @tags Integration Actions
             * @name UpdateManagedIntegration
             * @summary Update fields on a managed integration
             * @request PATCH:/managed_integrations/public/{managedIntegrationId}
             * @secure
             */
            updateManagedIntegration: function (managedIntegrationId, data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/managed_integrations/public/".concat(managedIntegrationId), method: "PATCH", body: data, secure: true, type: ContentType.Json, format: "json" }, params));
            },
            /**
             * @description Returns a list of integration actions available to be used for ERP integrations.
             *
             * @tags Integration Actions
             * @name ListIntegrationActions
             * @summary Returns a list of integration actions
             * @request GET:/managed_integrations/public/{managedIntegrationId}/integration_actions
             * @secure
             */
            listIntegrationActions: function (managedIntegrationId, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/managed_integrations/public/".concat(managedIntegrationId, "/integration_actions"), method: "GET", query: query, secure: true, format: "json" }, params));
            },
            /**
             * @description Creates a new integration action
             *
             * @tags Integration Actions
             * @name CreateIntegrationAction
             * @summary Create new integration action
             * @request POST:/managed_integrations/public/{managedIntegrationId}/integration_actions
             * @secure
             */
            createIntegrationAction: function (managedIntegrationId, data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/managed_integrations/public/".concat(managedIntegrationId, "/integration_actions"), method: "POST", body: data, secure: true, type: ContentType.Json, format: "json" }, params));
            },
            /**
             * @description Get the details for a specific integration action.
             *
             * @tags Integration Actions
             * @name GetIntegrationActionDetails
             * @summary Get integration action details
             * @request GET:/managed_integrations/public/{managedIntegrationId}/integration_actions/{action_uuid}
             * @secure
             */
            getIntegrationActionDetails: function (managedIntegrationId, actionUuid, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/managed_integrations/public/".concat(managedIntegrationId, "/integration_actions/").concat(actionUuid), method: "GET", secure: true, format: "json" }, params));
            },
            /**
             * @description Update fields on an integration action.
             *
             * @tags Integration Actions
             * @name UpdateOrder
             * @summary Update fields on an integration action
             * @request PATCH:/managed_integrations/public/{managedIntegrationId}/integration_actions/{action_uuid}
             * @secure
             */
            updateOrder: function (managedIntegrationId, actionUuid, data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/managed_integrations/public/".concat(managedIntegrationId, "/integration_actions/").concat(actionUuid), method: "PATCH", body: data, secure: true, type: ContentType.Json, format: "json" }, params));
            }
        };
        return _this;
    }
    return PaperlessPartsClient;
}(HttpClient));
exports.PaperlessPartsClient = PaperlessPartsClient;
