"use strict";
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
exports.meta = void 0;
exports.loader = loader;
exports.default = CustomerPortal;
var client_server_1 = require("@carbon/auth/client.server");
var plan_server_1 = require("@carbon/ee/plan.server");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var production_1 = require("~/modules/production");
var sales_models_1 = require("~/modules/sales/sales.models");
var sales_service_1 = require("~/modules/sales/sales.service");
var CustomerPortal_1 = require("~/modules/sales/ui/CustomerPortal");
var SalesOrder_1 = require("~/modules/sales/ui/SalesOrder");
var settings_service_1 = require("~/modules/settings/settings.service");
var shared_service_1 = require("~/modules/shared/shared.service");
var path_1 = require("~/utils/path");
var query_1 = require("~/utils/query");
var meta = function () {
    return [{ title: "Customer Portal" }];
};
exports.meta = meta;
var defaultColumnPinning = {
    left: ["customerReference"]
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id, serviceRole, customer, hasPlan, url, searchParams, search, _c, limit, offset, sorts, filters, _d, company, salesOrderLines, jobOperationIds, thumbnailPaths, _e, thumbnails, jobOperationAttachments, _f, _g, _h;
        var _j, _k, _l, _m, _o, _p;
        var params = _b.params, request = _b.request;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    id = params.id;
                    if (!id) {
                        throw new Error("Customer ID is required");
                    }
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, shared_service_1.getCustomerPortal)(serviceRole, id)];
                case 1:
                    customer = _q.sent();
                    if (customer.error) {
                        console.error(customer.error);
                        throw new Error("Customer not found");
                    }
                    if (!customer.data.customerId) {
                        console.error(customer.error);
                        throw new Error("Customer not found");
                    }
                    return [4 /*yield*/, (0, plan_server_1.companyHasPlan)(serviceRole, customer.data.companyId, {
                            feature: "CUSTOMER_PORTALS"
                        })];
                case 2:
                    hasPlan = _q.sent();
                    if (!hasPlan) {
                        throw new Response("Not found", { status: 404 });
                    }
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    search = searchParams.get("search");
                    _c = (0, query_1.getGenericQueryFilters)(searchParams), limit = _c.limit, offset = _c.offset, sorts = _c.sorts, filters = _c.filters;
                    return [4 /*yield*/, Promise.all([
                            (0, settings_service_1.getCompany)(serviceRole, customer.data.companyId),
                            (0, sales_service_1.getExternalSalesOrderLines)(serviceRole, customer.data.customerId, {
                                search: search,
                                limit: limit,
                                offset: offset,
                                sorts: sorts,
                                filters: filters
                            })
                        ])];
                case 3:
                    _d = _q.sent(), company = _d[0], salesOrderLines = _d[1];
                    if (salesOrderLines.error) {
                        console.error(salesOrderLines.error);
                        throw new Error("Sales order lines not found");
                    }
                    jobOperationIds = (_k = CustomerPortal_1.jobOperationValidator
                        .safeParse((_j = salesOrderLines.data) === null || _j === void 0 ? void 0 : _j.flatMap(function (line) { return line.jobOperations; }))
                        .data) === null || _k === void 0 ? void 0 : _k.map(function (operation) { return operation.id; });
                    thumbnailPaths = (_l = salesOrderLines.data) === null || _l === void 0 ? void 0 : _l.reduce(function (acc, line) {
                        if (line.thumbnailPath) {
                            acc[line.readableIdWithRevision] = line.thumbnailPath;
                        }
                        return acc;
                    }, {});
                    _g = (_f = Promise).all;
                    if (!thumbnailPaths) return [3 /*break*/, 5];
                    return [4 /*yield*/, Promise.all(Object.entries(thumbnailPaths).map(function (_a) {
                            var id = _a[0], path = _a[1];
                            if (!path) {
                                return null;
                            }
                            return (0, shared_service_1.getBase64ImageFromSupabase)(serviceRole, path).then(function (data) { return ({
                                id: id,
                                data: data
                            }); });
                        }))];
                case 4:
                    _h = _q.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _h = [];
                    _q.label = 6;
                case 6: return [4 /*yield*/, _g.apply(_f, [[
                            (_o = (_m = (_h)) === null || _m === void 0 ? void 0 : _m.reduce(function (acc, thumbnail) {
                                if (thumbnail) {
                                    acc[thumbnail.id] = thumbnail.data;
                                }
                                return acc;
                            }, {})) !== null && _o !== void 0 ? _o : {},
                            (0, production_1.getJobOperationAttachments)(serviceRole, jobOperationIds !== null && jobOperationIds !== void 0 ? jobOperationIds : [])
                        ]])];
                case 7:
                    _e = _q.sent(), thumbnails = _e[0], jobOperationAttachments = _e[1];
                    return [2 /*return*/, {
                            customer: customer.data,
                            company: company.data,
                            salesOrderLines: (_p = salesOrderLines.data) !== null && _p !== void 0 ? _p : [],
                            jobOperationAttachments: jobOperationAttachments,
                            count: salesOrderLines.count,
                            thumbnails: thumbnails
                        }];
            }
        });
    });
}
function CustomerPortal() {
    var _a;
    var _b = (0, react_router_1.useLoaderData)(), count = _b.count, customer = _b.customer, company = _b.company, salesOrderLines = _b.salesOrderLines, thumbnails = _b.thumbnails, jobOperationAttachments = _b.jobOperationAttachments;
    var locale = (0, i18n_1.useLocale)().locale;
    var formatter = (0, i18n_1.useNumberFormatter)({
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
    var columns = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "customerReference",
                header: "PO/SO #",
                size: 180,
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<div className="flex items-center gap-1 min-w-0">
            {thumbnails[row.original.readableIdWithRevision] ? (<img alt={row.original.readableIdWithRevision} className="size-8 bg-gradient-to-bl from-muted to-muted/40 rounded-lg flex-shrink-0" src={(_b = thumbnails[row.original.readableIdWithRevision]) !== null && _b !== void 0 ? _b : undefined}/>) : (<div className="size-8 bg-gradient-to-bl from-muted to-muted/40 rounded-lg p-1 flex-shrink-0">
                <lu_1.LuImage className="size-6 text-muted-foreground"/>
              </div>)}
            {row.original.customerReference ? (<>
                <lu_1.LuShieldCheck className="text-emerald-500 flex-shrink-0"/>
                <span className="text-xs font-medium truncate">
                  {row.original.customerReference}
                </span>
              </>) : (<>
                <lu_1.LuShield className="flex-shrink-0"/>
                <span className="text-xs font-medium truncate">
                  {row.original.salesOrderId}
                </span>
              </>)}
          </div>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                accessorKey: "salesOrderStatus",
                header: "Status",
                enableSorting: false,
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    var jobOperations = CustomerPortal_1.jobOperationValidator.safeParse(row.original.jobOperations);
                    return (<CustomerPortal_1.PortalLineStatus quantityOrdered={row.original.saleQuantity} quantityShipped={row.original.quantitySent} jobStatus={row.original.jobStatus} jobOperations={(_b = jobOperations.data) !== null && _b !== void 0 ? _b : []} salesOrderStatus={row.original.salesOrderStatus}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: sales_models_1.salesOrderStatusType.map(function (status) { return ({
                            value: status,
                            label: <SalesOrder_1.SalesStatus status={status} disableTooltip/>
                        }); })
                    },
                    pluralHeader: "Statuses"
                }
            },
            {
                accessorKey: "customerContactName",
                header: "Buyer",
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.customerContactName ? (<div className="flex items-center gap-2">
              <react_1.Avatar name={row.original.customerContactName} size="xs"/>
              <span>{row.original.customerContactName}</span>
            </div>) : null;
                }
            },
            {
                accessorKey: "customerEngineeringContactName",
                header: "Engineer",
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.customerEngineeringContactName ? (<div className="flex items-center gap-2">
              <react_1.Avatar name={row.original.customerEngineeringContactName} size="xs"/>
              <span>{row.original.customerEngineeringContactName}</span>
            </div>) : null;
                }
            },
            {
                accessorKey: "orderDate",
                header: "Order Date",
                cell: function (_a) {
                    var row = _a.row;
                    return (0, utils_1.formatDate)(row.original.orderDate, undefined, locale);
                }
            },
            {
                accessorKey: "promisedDate",
                header: "Due Date",
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (0, utils_1.formatDate)((_c = (_b = row.original.promisedDate) !== null && _b !== void 0 ? _b : row.original.receiptPromisedDate) !== null && _c !== void 0 ? _c : row.original.receiptRequestedDate, undefined, locale);
                }
            },
            {
                accessorKey: "readableId",
                header: "Part Number",
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.readableId;
                }
            },
            {
                accessorKey: "revision",
                header: "Rev.",
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.revision;
                }
            },
            {
                id: "quantity",
                header: "Complete",
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return ((_b = row.original) === null || _b === void 0 ? void 0 : _b.jobProductionQuantity) ? (<div className="flex items-center gap-1.5">
              <components_1.MethodIcon type="Make to Order"/>
              <span>
                {"".concat(formatter.format(row.original.jobQuantityComplete), "/").concat(formatter.format(row.original.jobProductionQuantity))}
              </span>
            </div>) : (<div className="flex items-center gap-1.5">
              <components_1.MethodIcon type="Pull from Inventory"/>
              <span>{formatter.format((_c = row.original.saleQuantity) !== null && _c !== void 0 ? _c : 0)}</span>
            </div>);
                }
            },
            {
                id: "shipped",
                header: "Shipped",
                cell: function (_a) {
                    var _b, _c, _d;
                    var row = _a.row;
                    return ((_b = row.original) === null || _b === void 0 ? void 0 : _b.jobProductionQuantity)
                        ? "".concat(formatter.format(row.original.jobQuantityShipped), "/").concat(formatter.format(row.original.jobProductionQuantity))
                        : "".concat(formatter.format((_c = row.original.quantitySent) !== null && _c !== void 0 ? _c : 0), "/").concat(formatter.format((_d = row.original.saleQuantity) !== null && _d !== void 0 ? _d : 0));
                }
            },
            {
                id: "jobOperations",
                header: "Progress",
                cell: function (_a) {
                    var row = _a.row;
                    var jobOperations = CustomerPortal_1.jobOperationValidator.safeParse(row.original.jobOperations);
                    if (!jobOperations.success) {
                        return null;
                    }
                    if (!row.original.jobProductionQuantity) {
                        return null;
                    }
                    return (<CustomerPortal_1.JobOperationProgress customerId={customer.id} jobOperations={jobOperations.data} jobOperationAttachments={jobOperationAttachments}/>);
                }
            }
        ];
    }, [formatter, thumbnails, jobOperationAttachments, locale, customer.id]);
    var sortableColumns = (0, react_2.useMemo)(function () {
        return columns.flatMap(function (c) {
            return "accessorKey" in c &&
                typeof c.accessorKey === "string" &&
                typeof c.header === "string" &&
                c.enableSorting !== false
                ? [{ value: c.accessorKey, label: c.header }]
                : [];
        });
    }, [columns]);
    return (<div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      <div className="flex justify-between items-center py-3 px-4 bg-background border-b w-full">
        <components_1.Breadcrumbs>
          <components_1.BreadcrumbItem>
            <components_1.BreadcrumbLink isCurrentPage to="#">
              {company === null || company === void 0 ? void 0 : company.name}
            </components_1.BreadcrumbLink>
          </components_1.BreadcrumbItem>
          {(customer === null || customer === void 0 ? void 0 : customer.customerId) && (<components_1.BreadcrumbItem>
              <components_1.BreadcrumbLink to={path_1.path.to.externalCustomer(customer.id)}>
                {(_a = customer === null || customer === void 0 ? void 0 : customer.customer) === null || _a === void 0 ? void 0 : _a.name}
              </components_1.BreadcrumbLink>
            </components_1.BreadcrumbItem>)}
        </components_1.Breadcrumbs>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <components_1.Table data={salesOrderLines} columns={columns} count={count !== null && count !== void 0 ? count : 0} compact defaultColumnPinning={defaultColumnPinning} sort={<CustomerPortal_1.PortalSort columns={sortableColumns}/>}/>
      </div>
    </div>);
}
