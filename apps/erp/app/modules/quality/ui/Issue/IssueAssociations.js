"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.IssueAssociationsSkeleton = IssueAssociationsSkeleton;
exports.IssueAssociationsTree = IssueAssociationsTree;
exports.IssueAssociationItem = IssueAssociationItem;
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var ai_1 = require("react-icons/ai");
var lu_1 = require("react-icons/lu");
var ri_1 = require("react-icons/ri");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var Modals_1 = require("~/components/Modals");
var TreeView_1 = require("~/components/TreeView");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var quality_models_1 = require("../../quality.models");
function IssueAssociationsSkeleton() {
    return (<div className="flex flex-col gap-1 w-full">
      <react_1.Skeleton className="h-7 w-full"/>
      <react_1.Skeleton className="h-7 w-full"/>
      <react_1.Skeleton className="h-7 w-3/4"/>
      <react_1.Skeleton className="h-7 w-1/2"/>
    </div>);
}
function IssueAssociationsTree(_a) {
    var _b;
    var tree = _a.tree, nonConformanceId = _a.nonConformanceId, items = _a.items;
    var t = (0, macro_1.useLingui)().t;
    var _c = (0, react_2.useState)(""), filterText = _c[0], setFilterText = _c[1];
    var deleteDisclosure = (0, react_1.useDisclosure)();
    var _d = (0, react_2.useState)(null), selectedChild = _d[0], setSelectedChild = _d[1];
    var onDelete = function (child) {
        (0, react_dom_1.flushSync)(function () {
            setSelectedChild(child);
        });
        deleteDisclosure.onOpen();
    };
    var onDeleteCancel = function () {
        setSelectedChild(null);
        deleteDisclosure.onClose();
    };
    return (<react_1.ScrollArea className="h-full">
      <react_1.VStack className="px-2">
        <react_1.HStack className="w-full py-2">
          <react_1.InputGroup size="sm" className="flex flex-grow">
            <react_1.InputLeftElement>
              <lu_1.LuSearch className="h-4 w-4"/>
            </react_1.InputLeftElement>
            <react_1.Input placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Search..."], ["Search..."])))} value={filterText} onChange={function (e) { return setFilterText(e.target.value); }}/>
          </react_1.InputGroup>
        </react_1.HStack>
        <react_1.VStack spacing={0}>
          {tree
            .sort(function (a, b) { return a.name.localeCompare(b.name); })
            .filter(function (node) {
            if (node.key === "trackedEntities" &&
                (!Array.isArray(items) || items.length == 0)) {
                return false;
            }
            return true;
        })
            .map(function (node) { return (<IssueAssociationItem key={node.key} filterText={filterText} items={items} node={node} nonConformanceId={nonConformanceId} onDelete={onDelete}/>); })}
        </react_1.VStack>
      </react_1.VStack>
      {deleteDisclosure.isOpen && (selectedChild === null || selectedChild === void 0 ? void 0 : selectedChild.id) && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteIssueAssociation(nonConformanceId, selectedChild.type, selectedChild.id)} name={"".concat((_b = selectedChild === null || selectedChild === void 0 ? void 0 : selectedChild.documentReadableId) !== null && _b !== void 0 ? _b : "")} text={"Are you sure you want to deactivate the association with ".concat(selectedChild === null || selectedChild === void 0 ? void 0 : selectedChild.documentReadableId, "?")} isOpen={deleteDisclosure.isOpen} onCancel={onDeleteCancel} onSubmit={onDeleteCancel}/>)}
    </react_1.ScrollArea>);
}
function IssueAssociationItem(_a) {
    var node = _a.node, filterText = _a.filterText, nonConformanceId = _a.nonConformanceId, items = _a.items, onDelete = _a.onDelete;
    var newAssociationModal = (0, react_1.useDisclosure)();
    var _b = (0, react_2.useState)(node.children.length > 0 && node.children.length < 10), isExpanded = _b[0], setIsExpanded = _b[1];
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    if (!permissions.can("view", node.module)) {
        return null;
    }
    var filteredChildren = node.children.filter(function (child) {
        return child.documentReadableId.toLowerCase().includes(filterText.toLowerCase());
    });
    return (<>
      <div className="flex h-8 items-center overflow-hidden rounded-sm px-2 gap-2 text-sm w-full hover:bg-accent">
        <button className="flex flex-grow cursor-pointer items-center overflow-hidden font-medium" onClick={function (e) {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
        }}>
          <div className="h-8 w-4 flex items-center justify-center">
            <lu_1.LuChevronRight className={(0, react_1.cn)("size-4", isExpanded && "rotate-90")}/>
          </div>
          <div className="flex flex-grow items-center justify-between gap-2">
            <span>{node.pluralName}</span>
            {filteredChildren.length > 0 && (<react_1.Count count={filteredChildren.length}/>)}
          </div>
        </button>
        {permissions.can("create", node.module) && (<react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Add"], ["Add"])))} size="sm" variant="ghost" icon={<lu_1.LuCirclePlus />} className="ml-auto" onClick={function () {
                newAssociationModal.onOpen();
            }}/>)}
      </div>

      {isExpanded && (<div className="flex flex-col w-full px-2">
          {node.children.length === 0 ? (<div className="flex h-8 items-center overflow-hidden rounded-sm px-2 gap-4">
              <TreeView_1.LevelLine isSelected={false}/>
              <div className="text-xs text-muted-foreground">
                No {node.name.toLowerCase()} found
              </div>
            </div>) : (filteredChildren.map(function (child, index) {
                var _a;
                return (<div key={index} className="group/association relative flex w-full">
                <react_router_1.Link to={getAssociationLink(child, node.key)} className="flex pr-7 h-8 cursor-pointer items-center overflow-hidden rounded-sm px-1 gap-2 text-sm hover:bg-accent w-full font-medium whitespace-nowrap">
                  <TreeView_1.LevelLine isSelected={false}/>
                  <div className="flex flex-grow justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getAssociationIcon(node.key)}
                      <span className="truncate">
                        {child.documentReadableId}
                      </span>
                    </div>
                    {node.key === "items" && (<react_1.Count count={(_a = child.quantity) !== null && _a !== void 0 ? _a : 0}/>)}
                  </div>
                </react_router_1.Link>
                {permissions.can("delete", node.module) && (<react_1.DropdownMenu>
                    <react_1.DropdownMenuTrigger asChild>
                      <react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Options"], ["Options"])))} icon={<lu_1.LuEllipsisVertical />} variant="ghost" size="sm" className="absolute right-1 top-1 flex-shrink-0 opacity-0 group-hover/association:opacity-100 data-[state=open]:opacity-100 text-foreground/70 hover:text-foreground"/>
                    </react_1.DropdownMenuTrigger>
                    <react_1.DropdownMenuContent>
                      <react_1.DropdownMenuItem destructive onSelect={function () {
                            onDelete(child);
                        }}>
                        <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                        <macro_1.Trans>Delete Association</macro_1.Trans>
                      </react_1.DropdownMenuItem>
                    </react_1.DropdownMenuContent>
                  </react_1.DropdownMenu>)}
              </div>);
            }))}
        </div>)}
      {newAssociationModal.isOpen && (<NewAssociationModal open={newAssociationModal.isOpen} onClose={newAssociationModal.onClose} type={node.key} name={node.name} items={items}/>)}
    </>);
}
function getAssociationIcon(key) {
    switch (key) {
        case "items":
            return <ai_1.AiOutlinePartition />;
        case "customers":
            return <lu_1.LuSquareUser />;
        case "suppliers":
            return <lu_1.LuContainer />;
        case "jobOperations":
            return <lu_1.LuCirclePlay className="text-amber-600"/>;
        case "purchaseOrderLines":
            return <lu_1.LuShoppingCart className="text-blue-600"/>;
        case "salesOrderLines":
            return <ri_1.RiProgress8Line className="text-green-600"/>;
        case "shipmentLines":
            return <lu_1.LuTruck className="text-indigo-600"/>;
        case "receiptLines":
            return <lu_1.LuHandCoins className="text-red-600"/>;
        case "trackedEntities":
            return <lu_1.LuQrCode />;
        case "inboundInspections":
            return <lu_1.LuClipboardCheck className="text-teal-600"/>;
        default:
            return <lu_1.LuFileText />;
    }
}
function NewItemAssociation() {
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, react_2.useState)("Item"), itemType = _a[0], setItemType = _a[1];
    var onTypeChange = function (t) {
        setItemType(t);
    };
    return (<>
      <Form_1.Item name="id" label={itemType} 
    // @ts-ignore
    type={itemType} onTypeChange={onTypeChange}/>
      <form_1.Number name="quantity" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Quantity"], ["Quantity"])))} minValue={0} defaultValue={0}/>
    </>);
}
function NewCustomerAssociation() {
    var t = (0, macro_1.useLingui)().t;
    return (<>
      <Form_1.Customer name="id" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Customer"], ["Customer"])))}/>
    </>);
}
function NewSupplierAssociation() {
    var t = (0, macro_1.useLingui)().t;
    return (<>
      <Form_1.Supplier name="id" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Supplier"], ["Supplier"])))}/>
    </>);
}
function NewJobOperationAssociation(_a) {
    var items = _a.items;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_2.useState)([]), jobs = _b[0], setJobs = _b[1];
    var _c = (0, react_2.useState)(true), jobsAreLoading = _c[0], setJobsAreLoading = _c[1];
    var _d = (0, react_2.useState)([]), jobOperations = _d[0], setJobOperations = _d[1];
    var _e = (0, react_2.useState)(false), jobOperationsAreLoading = _e[0], setJobOperationsAreLoading = _e[1];
    var carbon = (0, auth_1.useCarbon)().carbon;
    function fetchJobs() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!carbon) {
                            react_1.toast.error(t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Failed to load data"], ["Failed to load data"]))));
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, carbon.from("job").select("id, jobId")];
                    case 1:
                        _a = _c.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            react_1.toast.error(t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Failed to load jobs"], ["Failed to load jobs"]))));
                        }
                        setJobs((_b = data === null || data === void 0 ? void 0 : data.map(function (job) { return ({ label: job.jobId, value: job.id }); })) !== null && _b !== void 0 ? _b : []);
                        setJobsAreLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    function fetchJobOperations(jobId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!carbon) {
                            react_1.toast.error(t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Failed to load data"], ["Failed to load data"]))));
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, carbon
                                .from("jobOperation")
                                .select("id, description")
                                .eq("jobId", jobId)];
                    case 1:
                        _a = _c.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            react_1.toast.error(t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Failed to load job operations"], ["Failed to load job operations"]))));
                        }
                        setJobOperations((_b = data === null || data === void 0 ? void 0 : data.map(function (job) { var _a; return ({ label: (_a = job.description) !== null && _a !== void 0 ? _a : "", value: job.id }); })) !== null && _b !== void 0 ? _b : []);
                        setJobOperationsAreLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    (0, react_1.useMount)(function () {
        fetchJobs();
    });
    return (<>
      <form_1.Combobox name="id" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Job"], ["Job"])))} options={jobs} isLoading={jobsAreLoading} onChange={function (value) {
            if (value) {
                (0, react_dom_1.flushSync)(function () {
                    setJobOperationsAreLoading(true);
                });
                fetchJobOperations(value.value);
            }
            else {
                setJobOperations([]);
            }
        }}/>
      <form_1.Combobox name="lineId" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Job Operation"], ["Job Operation"])))} options={jobOperations} isLoading={jobOperationsAreLoading}/>
    </>);
}
function NewPurchaseOrderLineAssociation(_a) {
    var items = _a.items;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_2.useState)([]), purchaseOrders = _b[0], setPurchaseOrders = _b[1];
    var _c = (0, react_2.useState)(true), purchaseOrdersAreLoading = _c[0], setPurchaseOrdersAreLoading = _c[1];
    var _d = (0, react_2.useState)([]), purchaseOrderLines = _d[0], setPurchaseOrderLines = _d[1];
    var _e = (0, react_2.useState)(false), purchaseOrderLinesAreLoading = _e[0], setPurchaseOrderLinesAreLoading = _e[1];
    var carbon = (0, auth_1.useCarbon)().carbon;
    function fetchPurchaseOrders() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!carbon) {
                            react_1.toast.error(t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Failed to load data"], ["Failed to load data"]))));
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, carbon
                                .from("purchaseOrder")
                                .select("id, purchaseOrderId")];
                    case 1:
                        _a = _c.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            react_1.toast.error(t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Failed to load purchase orders"], ["Failed to load purchase orders"]))));
                            return [2 /*return*/];
                        }
                        setPurchaseOrders((_b = data === null || data === void 0 ? void 0 : data.map(function (po) {
                            var _a;
                            return ({
                                label: (_a = po.purchaseOrderId) !== null && _a !== void 0 ? _a : "",
                                value: po.id
                            });
                        })) !== null && _b !== void 0 ? _b : []);
                        setPurchaseOrdersAreLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    function fetchPurchaseOrderLines(purchaseOrderId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, _a, data, error;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!carbon) {
                            react_1.toast.error(t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Failed to load data"], ["Failed to load data"]))));
                            return [2 /*return*/];
                        }
                        if (!purchaseOrderId) {
                            setPurchaseOrderLines([]);
                            setPurchaseOrderLinesAreLoading(false);
                            return [2 /*return*/];
                        }
                        query = carbon
                            .from("purchaseOrderLine")
                            .select("id, itemId, item(name)")
                            .eq("purchaseOrderId", purchaseOrderId);
                        if (items) {
                            query = query.in("itemId", items);
                        }
                        return [4 /*yield*/, query];
                    case 1:
                        _a = _c.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            react_1.toast.error(t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Failed to load purchase order lines"], ["Failed to load purchase order lines"]))));
                        }
                        setPurchaseOrderLines((_b = data === null || data === void 0 ? void 0 : data.map(function (line) {
                            var _a, _b;
                            return ({
                                label: (_b = (_a = line.item) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "Line ".concat(line.id),
                                value: line.id
                            });
                        })) !== null && _b !== void 0 ? _b : []);
                        setPurchaseOrderLinesAreLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    (0, react_1.useMount)(function () {
        fetchPurchaseOrders();
    });
    return (<>
      <form_1.Combobox name="id" label={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Purchase Order"], ["Purchase Order"])))} options={purchaseOrders} isLoading={purchaseOrdersAreLoading} onChange={function (value) {
            if (value) {
                (0, react_dom_1.flushSync)(function () {
                    setPurchaseOrderLinesAreLoading(true);
                });
                fetchPurchaseOrderLines(value.value);
            }
            else {
                setPurchaseOrderLines([]);
            }
        }}/>
      <form_1.Combobox name="lineId" label={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Purchase Order Line"], ["Purchase Order Line"])))} options={purchaseOrderLines} isLoading={purchaseOrderLinesAreLoading}/>
    </>);
}
function NewSalesOrderLineAssociation(_a) {
    var items = _a.items;
    var t = (0, macro_1.useLingui)().t;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _b = (0, react_2.useState)([]), salesOrders = _b[0], setSalesOrders = _b[1];
    var _c = (0, react_2.useState)(true), salesOrdersAreLoading = _c[0], setSalesOrdersAreLoading = _c[1];
    var _d = (0, react_2.useState)([]), salesOrderLines = _d[0], setSalesOrderLines = _d[1];
    var _e = (0, react_2.useState)(false), salesOrderLinesAreLoading = _e[0], setSalesOrderLinesAreLoading = _e[1];
    function fetchSalesOrders() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!carbon) {
                            react_1.toast.error(t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Failed to load data"], ["Failed to load data"]))));
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, carbon
                                .from("salesOrder")
                                .select("id, salesOrderId")];
                    case 1:
                        _a = _c.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            react_1.toast.error(t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Failed to load sales orders"], ["Failed to load sales orders"]))));
                        }
                        setSalesOrders((_b = data === null || data === void 0 ? void 0 : data.map(function (order) {
                            var _a;
                            return ({
                                label: (_a = order.salesOrderId) !== null && _a !== void 0 ? _a : "",
                                value: order.id
                            });
                        })) !== null && _b !== void 0 ? _b : []);
                        setSalesOrdersAreLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    function fetchSalesOrderLines(salesOrderId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, _a, data, error;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!carbon) {
                            react_1.toast.error(t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Failed to load data"], ["Failed to load data"]))));
                            return [2 /*return*/];
                        }
                        if (!salesOrderId) {
                            setSalesOrderLines([]);
                            setSalesOrderLinesAreLoading(false);
                            return [2 /*return*/];
                        }
                        query = carbon
                            .from("salesOrderLine")
                            .select("id, itemId, item(name)")
                            .eq("salesOrderId", salesOrderId);
                        if (items) {
                            query = query.in("itemId", items);
                        }
                        return [4 /*yield*/, query];
                    case 1:
                        _a = _c.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            react_1.toast.error(t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Failed to load sales order lines"], ["Failed to load sales order lines"]))));
                        }
                        setSalesOrderLines((_b = data === null || data === void 0 ? void 0 : data.map(function (line) {
                            var _a, _b;
                            return ({
                                label: (_b = (_a = line.item) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "Line ".concat(line.id),
                                value: line.id
                            });
                        })) !== null && _b !== void 0 ? _b : []);
                        setSalesOrderLinesAreLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    (0, react_1.useMount)(function () {
        fetchSalesOrders();
    });
    return (<>
      <form_1.Combobox name="id" label={t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Sales Order"], ["Sales Order"])))} options={salesOrders} isLoading={salesOrdersAreLoading} onChange={function (value) {
            if (value) {
                (0, react_dom_1.flushSync)(function () {
                    setSalesOrderLinesAreLoading(true);
                });
                fetchSalesOrderLines(value.value);
            }
            else {
                setSalesOrderLines([]);
            }
        }}/>
      <form_1.Combobox name="lineId" label={t(templateObject_24 || (templateObject_24 = __makeTemplateObject(["Sales Order Line"], ["Sales Order Line"])))} options={salesOrderLines} isLoading={salesOrderLinesAreLoading}/>
    </>);
}
function NewShipmentLineAssociation(_a) {
    var items = _a.items;
    var t = (0, macro_1.useLingui)().t;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var storedItems = (0, stores_1.useItems)()[0];
    var _b = (0, react_2.useState)([]), shipments = _b[0], setShipments = _b[1];
    var _c = (0, react_2.useState)(true), shipmentsAreLoading = _c[0], setShipmentsAreLoading = _c[1];
    var _d = (0, react_2.useState)([]), shipmentLines = _d[0], setShipmentLines = _d[1];
    var _e = (0, react_2.useState)(false), shipmentLinesAreLoading = _e[0], setShipmentLinesAreLoading = _e[1];
    function fetchShipments() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!carbon) {
                            react_1.toast.error(t(templateObject_25 || (templateObject_25 = __makeTemplateObject(["Failed to load data"], ["Failed to load data"]))));
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, carbon
                                .from("shipment")
                                .select("id, shipmentId")];
                    case 1:
                        _a = _c.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            react_1.toast.error(t(templateObject_26 || (templateObject_26 = __makeTemplateObject(["Failed to load shipments"], ["Failed to load shipments"]))));
                        }
                        setShipments((_b = data === null || data === void 0 ? void 0 : data.map(function (shipment) { return ({
                            label: "Shipment ".concat(shipment.shipmentId),
                            value: shipment.id
                        }); })) !== null && _b !== void 0 ? _b : []);
                        setShipmentsAreLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    function fetchShipmentLines(shipmentId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, _a, data, error;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!carbon) {
                            react_1.toast.error(t(templateObject_27 || (templateObject_27 = __makeTemplateObject(["Failed to load data"], ["Failed to load data"]))));
                            return [2 /*return*/];
                        }
                        query = carbon
                            .from("shipmentLine")
                            .select("id, itemId")
                            .eq("shipmentId", shipmentId);
                        if (items) {
                            query = query.in("itemId", items);
                        }
                        return [4 /*yield*/, query];
                    case 1:
                        _a = _c.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            react_1.toast.error(t(templateObject_28 || (templateObject_28 = __makeTemplateObject(["Failed to load shipment lines"], ["Failed to load shipment lines"]))));
                        }
                        setShipmentLines((_b = data === null || data === void 0 ? void 0 : data.map(function (line) {
                            var _a;
                            return ({
                                label: (_a = (0, utils_1.getItemReadableId)(storedItems, line.itemId)) !== null && _a !== void 0 ? _a : "Line ".concat(line.id),
                                value: line.id
                            });
                        })) !== null && _b !== void 0 ? _b : []);
                        setShipmentLinesAreLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    (0, react_1.useMount)(function () {
        fetchShipments();
    });
    return (<>
      <form_1.Combobox name="id" label={t(templateObject_29 || (templateObject_29 = __makeTemplateObject(["Shipment"], ["Shipment"])))} options={shipments} isLoading={shipmentsAreLoading} onChange={function (value) {
            if (value) {
                (0, react_dom_1.flushSync)(function () {
                    setShipmentLinesAreLoading(true);
                });
                fetchShipmentLines(value.value);
            }
            else {
                setShipmentLines([]);
            }
        }}/>
      <form_1.Combobox name="lineId" label={t(templateObject_30 || (templateObject_30 = __makeTemplateObject(["Shipment Line"], ["Shipment Line"])))} options={shipmentLines} isLoading={shipmentLinesAreLoading}/>
    </>);
}
function NewReceiptLineAssociation(_a) {
    var items = _a.items;
    var t = (0, macro_1.useLingui)().t;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var storedItems = (0, stores_1.useItems)()[0];
    var _b = (0, react_2.useState)([]), receipts = _b[0], setReceipts = _b[1];
    var _c = (0, react_2.useState)(true), receiptsAreLoading = _c[0], setReceiptsAreLoading = _c[1];
    var _d = (0, react_2.useState)([]), receiptLines = _d[0], setReceiptLines = _d[1];
    var _e = (0, react_2.useState)(false), receiptLinesAreLoading = _e[0], setReceiptLinesAreLoading = _e[1];
    function fetchReceipts() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!carbon) {
                            react_1.toast.error(t(templateObject_31 || (templateObject_31 = __makeTemplateObject(["Failed to load data"], ["Failed to load data"]))));
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, carbon
                                .from("receipt")
                                .select("id, receiptId")];
                    case 1:
                        _a = _c.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            react_1.toast.error(t(templateObject_32 || (templateObject_32 = __makeTemplateObject(["Failed to load receipts"], ["Failed to load receipts"]))));
                        }
                        setReceipts((_b = data === null || data === void 0 ? void 0 : data.map(function (receipt) { return ({
                            label: "Receipt ".concat(receipt.receiptId),
                            value: receipt.id
                        }); })) !== null && _b !== void 0 ? _b : []);
                        setReceiptsAreLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    function fetchReceiptLines(receiptId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, _a, data, error;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!carbon) {
                            react_1.toast.error(t(templateObject_33 || (templateObject_33 = __makeTemplateObject(["Failed to load data"], ["Failed to load data"]))));
                            return [2 /*return*/];
                        }
                        query = carbon
                            .from("receiptLine")
                            .select("id, itemId")
                            .eq("receiptId", receiptId);
                        if (items) {
                            query = query.in("itemId", items);
                        }
                        return [4 /*yield*/, query];
                    case 1:
                        _a = _c.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            react_1.toast.error(t(templateObject_34 || (templateObject_34 = __makeTemplateObject(["Failed to load receipt lines"], ["Failed to load receipt lines"]))));
                        }
                        setReceiptLines((_b = data === null || data === void 0 ? void 0 : data.map(function (line) {
                            var _a;
                            return ({
                                label: (_a = (0, utils_1.getItemReadableId)(storedItems, line.itemId)) !== null && _a !== void 0 ? _a : "Line ".concat(line.id),
                                value: line.id
                            });
                        })) !== null && _b !== void 0 ? _b : []);
                        setReceiptLinesAreLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    (0, react_1.useMount)(function () {
        fetchReceipts();
    });
    return (<>
      <form_1.Combobox name="id" label={t(templateObject_35 || (templateObject_35 = __makeTemplateObject(["Receipt"], ["Receipt"])))} options={receipts} isLoading={receiptsAreLoading} onChange={function (value) {
            if (value) {
                (0, react_dom_1.flushSync)(function () {
                    setReceiptLinesAreLoading(true);
                });
                fetchReceiptLines(value.value);
            }
            else {
                setReceiptLines([]);
            }
        }}/>
      <form_1.Combobox name="documentLineId" label={t(templateObject_36 || (templateObject_36 = __makeTemplateObject(["Receipt Line"], ["Receipt Line"])))} options={receiptLines} isLoading={receiptLinesAreLoading}/>
    </>);
}
function NewTrackedEntityAssociation(_a) {
    var items = _a.items;
    var t = (0, macro_1.useLingui)().t;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _b = (0, react_2.useState)([]), trackedEntities = _b[0], setTrackedEntities = _b[1];
    var _c = (0, react_2.useState)(true), trackedEntitiesAreLoading = _c[0], setTrackedEntitiesAreLoading = _c[1];
    (0, react_1.useMount)(function () {
        fetchTrackedEntities();
    });
    function fetchTrackedEntities() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!carbon || !items) {
                            react_1.toast.error(t(templateObject_37 || (templateObject_37 = __makeTemplateObject(["Failed to load data"], ["Failed to load data"]))));
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, carbon
                                .from("trackedEntity")
                                .select("id, readableId, sourceDocumentReadableId")
                                .eq("sourceDocument", "Item")
                                .in("sourceDocumentId", items)];
                    case 1:
                        _a = _c.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            react_1.toast.error(t(templateObject_38 || (templateObject_38 = __makeTemplateObject(["Failed to load tracked entities"], ["Failed to load tracked entities"]))));
                        }
                        setTrackedEntities((_b = data === null || data === void 0 ? void 0 : data.map(function (entity) { return ({
                            label: entity.readableId
                                ? "".concat(entity.readableId, " \u2014 ").concat(entity.id)
                                : entity.id,
                            value: entity.id
                        }); })) !== null && _b !== void 0 ? _b : []);
                        setTrackedEntitiesAreLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    return (<form_1.Combobox name="id" label={t(templateObject_39 || (templateObject_39 = __makeTemplateObject(["Tracked Entity"], ["Tracked Entity"])))} options={trackedEntities} isLoading={trackedEntitiesAreLoading}/>);
}
function NewInboundInspectionAssociation() {
    var t = (0, macro_1.useLingui)().t;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var storedItems = (0, stores_1.useItems)()[0];
    var _a = (0, react_2.useState)([]), inspections = _a[0], setInspections = _a[1];
    var _b = (0, react_2.useState)(true), inspectionsAreLoading = _b[0], setInspectionsAreLoading = _b[1];
    function fetchInspections() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!carbon) {
                            react_1.toast.error(t(templateObject_40 || (templateObject_40 = __makeTemplateObject(["Failed to load data"], ["Failed to load data"]))));
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, carbon
                                .from("inboundInspection")
                                .select("id, inboundInspectionId, itemId, status")];
                    case 1:
                        _a = _c.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            react_1.toast.error(t(templateObject_41 || (templateObject_41 = __makeTemplateObject(["Failed to load inbound inspections"], ["Failed to load inbound inspections"]))));
                        }
                        setInspections((_b = data === null || data === void 0 ? void 0 : data.map(function (inspection) {
                            var _a;
                            return ({
                                label: (_a = inspection.inboundInspectionId) !== null && _a !== void 0 ? _a : inspection.id,
                                value: inspection.id,
                                helper: [
                                    (0, utils_1.getItemReadableId)(storedItems, inspection.itemId),
                                    inspection.status
                                ]
                                    .filter(Boolean)
                                    .join(" · ")
                            });
                        })) !== null && _b !== void 0 ? _b : []);
                        setInspectionsAreLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    (0, react_1.useMount)(function () {
        fetchInspections();
    });
    return (<form_1.Combobox name="id" label={t(templateObject_42 || (templateObject_42 = __makeTemplateObject(["Inbound Inspection"], ["Inbound Inspection"])))} options={inspections} isLoading={inspectionsAreLoading}/>);
}
function NewAssociationModal(_a) {
    var _b, _c;
    var open = _a.open, onClose = _a.onClose, type = _a.type, name = _a.name, items = _a.items;
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("No issue ID found");
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a, _b, _c, _d;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) {
            onClose();
        }
        if (((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success) === false && ((_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.message)) {
            react_1.toast.error((_d = fetcher === null || fetcher === void 0 ? void 0 : fetcher.data) === null || _d === void 0 ? void 0 : _d.message);
        }
    }, [(_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.message, (_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.success, onClose]);
    function renderFields(type) {
        switch (type) {
            case "items":
                return <NewItemAssociation />;
            case "customers":
                return <NewCustomerAssociation />;
            case "suppliers":
                return <NewSupplierAssociation />;
            case "jobOperations":
                return <NewJobOperationAssociation items={items}/>;
            case "purchaseOrderLines":
                return <NewPurchaseOrderLineAssociation items={items}/>;
            case "salesOrderLines":
                return <NewSalesOrderLineAssociation items={items}/>;
            case "shipmentLines":
                return <NewShipmentLineAssociation items={items}/>;
            case "receiptLines":
                return <NewReceiptLineAssociation items={items}/>;
            case "trackedEntities":
                return <NewTrackedEntityAssociation items={items}/>;
            case "inboundInspections":
                return <NewInboundInspectionAssociation />;
            default:
                return null;
        }
    }
    return (<react_1.Modal open={open} onOpenChange={function (open) {
            if (!open) {
                onClose();
            }
        }}>
      <react_1.ModalContent>
        <form_1.ValidatedForm method="post" action={path_1.path.to.newIssueAssociation(id)} validator={quality_models_1.issueAssociationValidator} fetcher={fetcher}>
          <react_1.ModalHeader>
            <react_1.ModalTitle>New {name}</react_1.ModalTitle>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <form_1.Hidden name="type" value={type}/>
            <react_1.VStack spacing={4}>{renderFields(type)}</react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.Button variant="secondary" onClick={onClose}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <form_1.Submit>
              <macro_1.Trans>Add</macro_1.Trans>
            </form_1.Submit>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
}
function getAssociationLink(child, key) {
    switch (key) {
        case "jobOperations":
            if (child.type === "jobOperationsInspection") {
                return path_1.path.to.jobInspectionSteps(child.documentId);
            }
            return path_1.path.to.jobDetails(child.documentId);
        case "purchaseOrderLines":
            if (!child.documentLineId)
                return "#";
            return path_1.path.to.purchaseOrderLine(child.documentId, child.documentLineId);
        case "salesOrderLines":
            if (!child.documentLineId)
                return "#";
            return path_1.path.to.salesOrderLine(child.documentId, child.documentLineId);
        case "shipmentLines":
            if (!child.documentLineId)
                return "#";
            return path_1.path.to.shipment(child.documentId);
        case "receiptLines":
            if (!child.documentLineId)
                return "#";
            return path_1.path.to.receipt(child.documentId);
        case "trackedEntities":
            return "".concat(path_1.path.to.traceabilityGraph, "?trackedEntityId=").concat(child.documentId);
        case "customers":
            return path_1.path.to.customer(child.documentId);
        case "suppliers":
            return path_1.path.to.supplier(child.documentId);
        case "inboundInspections":
            return path_1.path.to.inboundInspection(child.documentId);
        default:
            return "#";
    }
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27, templateObject_28, templateObject_29, templateObject_30, templateObject_31, templateObject_32, templateObject_33, templateObject_34, templateObject_35, templateObject_36, templateObject_37, templateObject_38, templateObject_39, templateObject_40, templateObject_41, templateObject_42;
