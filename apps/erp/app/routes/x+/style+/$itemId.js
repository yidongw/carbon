"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.handle = void 0;
exports.loader = loader;
exports.default = StyleRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Layout_1 = require("~/components/Layout");
var TreeView_1 = require("~/components/TreeView");
var items_1 = require("~/modules/items");
var style_server_1 = require("~/modules/items/style.server");
var Item_1 = require("~/modules/items/ui/Item");
var UsedIn_1 = require("~/modules/items/ui/Item/UsedIn");
var Styles_1 = require("~/modules/items/ui/Styles");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Styles"], ["Styles"]))),
    to: path_1.path.to.styles,
    module: "items"
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, itemId, _d, styleSummary, makeMethods, tags, _e, _f, url, requestedMethodId, activeMakeMethod, methodData, _g, methodTree;
        var _this = this;
        var _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "parts",
                        bypassRls: true
                    })];
                case 1:
                    _c = _u.sent(), client = _c.client, companyId = _c.companyId;
                    itemId = params.itemId;
                    if (!itemId)
                        throw new Error("Could not find itemId");
                    return [4 /*yield*/, Promise.all([
                            (0, style_server_1.getStyle)(itemId, companyId),
                            (0, items_1.getMakeMethods)(client, itemId, companyId),
                            (0, shared_1.getTagsList)(client, companyId, "style")
                        ])];
                case 2:
                    _d = _u.sent(), styleSummary = _d[0], makeMethods = _d[1], tags = _d[2];
                    if (!(styleSummary.error || !styleSummary.data)) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.items];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(styleSummary.error, "Failed to load style summary"))];
                case 3: throw _e.apply(void 0, _f.concat([_u.sent()]));
                case 4:
                    url = new URL(request.url);
                    requestedMethodId = url.searchParams.get("methodId");
                    activeMakeMethod = requestedMethodId
                        ? ((_l = (_j = (_h = makeMethods.data) === null || _h === void 0 ? void 0 : _h.find(function (m) { return m.id === requestedMethodId; })) !== null && _j !== void 0 ? _j : (_k = makeMethods.data) === null || _k === void 0 ? void 0 : _k.find(function (m) { return m.status === "Active"; })) !== null && _l !== void 0 ? _l : (_m = makeMethods.data) === null || _m === void 0 ? void 0 : _m[0])
                        : ((_p = (_o = makeMethods.data) === null || _o === void 0 ? void 0 : _o.find(function (m) { return m.status === "Active"; })) !== null && _p !== void 0 ? _p : (_q = makeMethods.data) === null || _q === void 0 ? void 0 : _q[0]);
                    if (!activeMakeMethod) return [3 /*break*/, 6];
                    return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                            var fullMethod, _a, methodMaterials, methodOperations;
                            var _b, _c, _d, _e;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0: return [4 /*yield*/, (0, items_1.getMakeMethodById)(client, activeMakeMethod.id, companyId)];
                                    case 1:
                                        fullMethod = _f.sent();
                                        if (fullMethod.error || !fullMethod.data)
                                            return [2 /*return*/, null];
                                        return [4 /*yield*/, Promise.all([
                                                (0, items_1.getMethodMaterialsByMakeMethod)(client, fullMethod.data.id),
                                                (0, items_1.getMethodOperationsByMakeMethodId)(client, fullMethod.data.id)
                                            ])];
                                    case 2:
                                        _a = _f.sent(), methodMaterials = _a[0], methodOperations = _a[1];
                                        return [2 /*return*/, {
                                                makeMethod: fullMethod.data,
                                                methodMaterials: (_c = (_b = methodMaterials.data) === null || _b === void 0 ? void 0 : _b.map(function (m) {
                                                    var _a, _b;
                                                    return (__assign(__assign({}, m), { description: (_b = (_a = m.item) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "", methodType: m.methodType, itemType: m.itemType }));
                                                })) !== null && _c !== void 0 ? _c : [],
                                                methodOperations: (_e = (_d = methodOperations.data) === null || _d === void 0 ? void 0 : _d.map(function (operation) {
                                                    var _a, _b;
                                                    return (__assign(__assign({}, operation), { workCenterId: (_a = operation.workCenterId) !== null && _a !== void 0 ? _a : undefined, operationSupplierProcessId: (_b = operation.operationSupplierProcessId) !== null && _b !== void 0 ? _b : undefined, workInstruction: operation.workInstruction }));
                                                })) !== null && _e !== void 0 ? _e : []
                                            }];
                                }
                            });
                        }); })()];
                case 5:
                    _g = _u.sent();
                    return [3 /*break*/, 7];
                case 6:
                    _g = null;
                    _u.label = 7;
                case 7:
                    methodData = _g;
                    methodTree = Promise.resolve(makeMethods).then(function (resolvedMethods) { return __awaiter(_this, void 0, void 0, function () {
                        var makeMethod, fullMethod, tree, methods;
                        var _a, _b, _c, _d, _e, _f, _g, _h;
                        return __generator(this, function (_j) {
                            switch (_j.label) {
                                case 0:
                                    makeMethod = requestedMethodId
                                        ? ((_d = (_b = (_a = resolvedMethods.data) === null || _a === void 0 ? void 0 : _a.find(function (m) { return m.id === requestedMethodId; })) !== null && _b !== void 0 ? _b : (_c = resolvedMethods.data) === null || _c === void 0 ? void 0 : _c.find(function (m) { return m.status === "Active"; })) !== null && _d !== void 0 ? _d : (_e = resolvedMethods.data) === null || _e === void 0 ? void 0 : _e[0])
                                        : ((_g = (_f = resolvedMethods.data) === null || _f === void 0 ? void 0 : _f.find(function (m) { return m.status === "Active"; })) !== null && _g !== void 0 ? _g : (_h = resolvedMethods.data) === null || _h === void 0 ? void 0 : _h[0]);
                                    if (!makeMethod)
                                        return [2 /*return*/, null];
                                    return [4 /*yield*/, (0, items_1.getMakeMethodById)(client, makeMethod.id, companyId)];
                                case 1:
                                    fullMethod = _j.sent();
                                    if (fullMethod.error || !fullMethod.data)
                                        return [2 /*return*/, null];
                                    return [4 /*yield*/, (0, items_1.getMethodTree)(client, fullMethod.data.id)];
                                case 2:
                                    tree = _j.sent();
                                    if (tree.error)
                                        return [2 /*return*/, null];
                                    methods = tree.data.length > 0 ? (0, TreeView_1.flattenTree)(tree.data[0]) : [];
                                    return [2 /*return*/, {
                                            makeMethod: fullMethod.data,
                                            methods: methods
                                        }];
                            }
                        });
                    }); });
                    return [2 /*return*/, {
                            styleSummary: __assign(__assign({}, styleSummary.data), { styleColorBadges: (_r = styleSummary.data.colors) !== null && _r !== void 0 ? _r : [], styleSizeBadges: (_s = styleSummary.data.sizes) !== null && _s !== void 0 ? _s : [] }),
                            files: (0, items_1.getItemFiles)(client, itemId, companyId),
                            makeMethods: Promise.resolve(makeMethods),
                            usedIn: (0, items_1.getPartUsedIn)(client, itemId, companyId),
                            methodTree: methodTree,
                            tags: (_t = tags.data) !== null && _t !== void 0 ? _t : [],
                            methodData: methodData
                        }];
            }
        });
    });
}
function StyleRoute() {
    var t = (0, macro_2.useLingui)().t;
    var itemId = (0, react_router_1.useParams)().itemId;
    if (!itemId)
        throw new Error("Could not find itemId");
    var _a = (0, react_router_1.useLoaderData)(), styleSummary = _a.styleSummary, usedIn = _a.usedIn, methodTree = _a.methodTree;
    var isManufactured = styleSummary.replenishmentSystem !== "Buy";
    var _b = (0, react_2.useState)(""), filterText = _b[0], setFilterText = _b[1];
    return (<Layout_1.PanelProvider>
      <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full">
        <Styles_1.StyleHeader />
        <div className="flex h-[calc(100dvh-99px)] overflow-hidden w-full">
          <div className="flex flex-1 min-h-0 h-full overflow-hidden">
            <Layout_1.ResizablePanels explorer={<div className="flex flex-col h-full">
                  {isManufactured ? (<react_1.Tabs defaultValue="manufacturing" className="flex flex-col h-full">
                      <div className="px-2 pt-2 flex-shrink-0">
                        <react_1.TabsList className="grid grid-cols-2 w-full">
                          <react_1.TabsTrigger value="manufacturing">
                            <macro_2.Trans>Manufacturing</macro_2.Trans>
                          </react_1.TabsTrigger>
                          <react_1.TabsTrigger value="used-in">
                            <macro_2.Trans>Used In</macro_2.Trans>
                          </react_1.TabsTrigger>
                        </react_1.TabsList>
                      </div>
                      <react_1.HStack className="w-full justify-between flex-shrink-0 p-2 pb-0">
                        <react_1.InputGroup size="sm" className="flex flex-grow">
                          <react_1.InputLeftElement>
                            <lu_1.LuSearch className="h-4 w-4"/>
                          </react_1.InputLeftElement>
                          <react_1.Input placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Search..."], ["Search..."])))} value={filterText} onChange={function (e) { return setFilterText(e.target.value); }}/>
                        </react_1.InputGroup>
                        <react_2.Suspense fallback={null}>
                          <react_router_1.Await resolve={methodTree}>
                            {function (resolved) {
                    return resolved ? (<Item_1.BoMActions makeMethodId={resolved.makeMethod.id}/>) : null;
                }}
                          </react_router_1.Await>
                        </react_2.Suspense>
                      </react_1.HStack>
                      <div className="flex-1 overflow-y-auto">
                        <react_1.TabsContent value="manufacturing">
                          <react_2.Suspense fallback={<div className="flex w-full items-center justify-center p-4">
                                <react_1.Spinner className="h-6 w-6"/>
                              </div>}>
                            <react_router_1.Await resolve={methodTree}>
                              {function (resolved) {
                    return resolved ? (<div className="w-full p-2">
                                    <Item_1.BoMExplorer itemType="Style" makeMethod={resolved.makeMethod} methods={resolved.methods} methodId={resolved.makeMethod.id} filterText={filterText} hideSearch/>
                                  </div>) : null;
                }}
                            </react_router_1.Await>
                          </react_2.Suspense>
                        </react_1.TabsContent>
                        <react_1.TabsContent value="used-in">
                          <react_2.Suspense fallback={<UsedIn_1.UsedInSkeleton />}>
                            <react_router_1.Await resolve={usedIn}>
                              {function (resolvedUsedIn) {
                    var _a, _b;
                    var issues = resolvedUsedIn.issues, jobMaterials = resolvedUsedIn.jobMaterials, jobs = resolvedUsedIn.jobs, maintenanceDispatchItems = resolvedUsedIn.maintenanceDispatchItems, methodMaterials = resolvedUsedIn.methodMaterials, purchaseOrderLines = resolvedUsedIn.purchaseOrderLines, receiptLines = resolvedUsedIn.receiptLines, quoteLines = resolvedUsedIn.quoteLines, quoteMaterials = resolvedUsedIn.quoteMaterials, salesOrderLines = resolvedUsedIn.salesOrderLines, shipmentLines = resolvedUsedIn.shipmentLines, supplierQuotes = resolvedUsedIn.supplierQuotes, jobMaterialUsage = resolvedUsedIn.jobMaterialUsage;
                    var tree = [
                        {
                            key: "issues",
                            name: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Issues"], ["Issues"]))),
                            module: "quality",
                            children: issues
                        },
                        {
                            key: "jobs",
                            name: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Jobs"], ["Jobs"]))),
                            module: "production",
                            children: jobs.map(function (job) { return (__assign(__assign({}, job), { methodType: "Make to Order" })); })
                        },
                        {
                            key: "jobMaterials",
                            name: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Job Materials"], ["Job Materials"]))),
                            module: "production",
                            children: jobMaterials
                        },
                        {
                            key: "maintenanceDispatchItems",
                            name: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Maintenance"], ["Maintenance"]))),
                            module: "resources",
                            children: maintenanceDispatchItems
                        },
                        {
                            key: "methodMaterials",
                            name: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Method Materials"], ["Method Materials"]))),
                            module: "parts",
                            children: methodMaterials
                        },
                        {
                            key: "purchaseOrderLines",
                            name: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Purchase Orders"], ["Purchase Orders"]))),
                            module: "purchasing",
                            children: purchaseOrderLines.map(function (po) { return (__assign(__assign({}, po), { methodType: "Purchase to Order" })); })
                        },
                        {
                            key: "receiptLines",
                            name: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Receipts"], ["Receipts"]))),
                            module: "inventory",
                            children: receiptLines.map(function (receipt) { return (__assign(__assign({}, receipt), { methodType: "Pull from Inventory" })); })
                        },
                        {
                            key: "quoteLines",
                            name: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Quotes"], ["Quotes"]))),
                            module: "sales",
                            children: quoteLines
                        },
                        {
                            key: "quoteMaterials",
                            name: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Quote Materials"], ["Quote Materials"]))),
                            module: "sales",
                            children: quoteMaterials === null || quoteMaterials === void 0 ? void 0 : quoteMaterials.map(function (qm) {
                                var _a;
                                return (__assign(__assign({}, qm), { documentReadableId: (_a = qm.documentReadableId) !== null && _a !== void 0 ? _a : "" }));
                            })
                        },
                        {
                            key: "salesOrderLines",
                            name: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Sales Orders"], ["Sales Orders"]))),
                            module: "sales",
                            children: salesOrderLines
                        },
                        {
                            key: "shipmentLines",
                            name: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Shipments"], ["Shipments"]))),
                            module: "inventory",
                            children: shipmentLines.map(function (shipment) { return (__assign(__assign({}, shipment), { methodType: "Shipment" })); })
                        },
                        {
                            key: "supplierQuotes",
                            name: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Supplier Quotes"], ["Supplier Quotes"]))),
                            module: "purchasing",
                            children: supplierQuotes
                        }
                    ];
                    return (<UsedIn_1.UsedInTree tree={tree} itemReadableId={(_a = styleSummary.readableId) !== null && _a !== void 0 ? _a : ""} itemReadableIdWithRevision={(_b = styleSummary.readableIdWithRevision) !== null && _b !== void 0 ? _b : ""} jobMaterialUsage={jobMaterialUsage} filterText={filterText} hideSearch/>);
                }}
                            </react_router_1.Await>
                          </react_2.Suspense>
                        </react_1.TabsContent>
                      </div>
                    </react_1.Tabs>) : (<>
                      <react_1.HStack className="w-full justify-between flex-shrink-0 p-2 pb-0">
                        <react_1.InputGroup size="sm" className="flex flex-grow">
                          <react_1.InputLeftElement>
                            <lu_1.LuSearch className="h-4 w-4"/>
                          </react_1.InputLeftElement>
                          <react_1.Input placeholder={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Search..."], ["Search..."])))} value={filterText} onChange={function (e) { return setFilterText(e.target.value); }}/>
                        </react_1.InputGroup>
                      </react_1.HStack>
                      <div className="flex-1 overflow-y-auto">
                        <react_2.Suspense fallback={<UsedIn_1.UsedInSkeleton />}>
                          <react_router_1.Await resolve={usedIn}>
                            {function (resolvedUsedIn) {
                    var _a, _b;
                    var issues = resolvedUsedIn.issues, jobMaterials = resolvedUsedIn.jobMaterials, jobs = resolvedUsedIn.jobs, maintenanceDispatchItems = resolvedUsedIn.maintenanceDispatchItems, methodMaterials = resolvedUsedIn.methodMaterials, purchaseOrderLines = resolvedUsedIn.purchaseOrderLines, receiptLines = resolvedUsedIn.receiptLines, quoteLines = resolvedUsedIn.quoteLines, quoteMaterials = resolvedUsedIn.quoteMaterials, salesOrderLines = resolvedUsedIn.salesOrderLines, shipmentLines = resolvedUsedIn.shipmentLines, supplierQuotes = resolvedUsedIn.supplierQuotes, jobMaterialUsage = resolvedUsedIn.jobMaterialUsage;
                    var tree = [
                        {
                            key: "issues",
                            name: t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Issues"], ["Issues"]))),
                            module: "quality",
                            children: issues
                        },
                        {
                            key: "jobs",
                            name: t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Jobs"], ["Jobs"]))),
                            module: "production",
                            children: jobs.map(function (job) { return (__assign(__assign({}, job), { methodType: "Make to Order" })); })
                        },
                        {
                            key: "jobMaterials",
                            name: t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Job Materials"], ["Job Materials"]))),
                            module: "production",
                            children: jobMaterials
                        },
                        {
                            key: "maintenanceDispatchItems",
                            name: t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Maintenance"], ["Maintenance"]))),
                            module: "resources",
                            children: maintenanceDispatchItems
                        },
                        {
                            key: "methodMaterials",
                            name: t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Method Materials"], ["Method Materials"]))),
                            module: "parts",
                            children: methodMaterials
                        },
                        {
                            key: "purchaseOrderLines",
                            name: t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Purchase Orders"], ["Purchase Orders"]))),
                            module: "purchasing",
                            children: purchaseOrderLines.map(function (po) { return (__assign(__assign({}, po), { methodType: "Purchase to Order" })); })
                        },
                        {
                            key: "receiptLines",
                            name: t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Receipts"], ["Receipts"]))),
                            module: "inventory",
                            children: receiptLines.map(function (receipt) { return (__assign(__assign({}, receipt), { methodType: "Pull from Inventory" })); })
                        },
                        {
                            key: "quoteLines",
                            name: t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Quotes"], ["Quotes"]))),
                            module: "sales",
                            children: quoteLines
                        },
                        {
                            key: "quoteMaterials",
                            name: t(templateObject_24 || (templateObject_24 = __makeTemplateObject(["Quote Materials"], ["Quote Materials"]))),
                            module: "sales",
                            children: quoteMaterials === null || quoteMaterials === void 0 ? void 0 : quoteMaterials.map(function (qm) {
                                var _a;
                                return (__assign(__assign({}, qm), { documentReadableId: (_a = qm.documentReadableId) !== null && _a !== void 0 ? _a : "" }));
                            })
                        },
                        {
                            key: "salesOrderLines",
                            name: t(templateObject_25 || (templateObject_25 = __makeTemplateObject(["Sales Orders"], ["Sales Orders"]))),
                            module: "sales",
                            children: salesOrderLines
                        },
                        {
                            key: "shipmentLines",
                            name: t(templateObject_26 || (templateObject_26 = __makeTemplateObject(["Shipments"], ["Shipments"]))),
                            module: "inventory",
                            children: shipmentLines.map(function (shipment) { return (__assign(__assign({}, shipment), { methodType: "Shipment" })); })
                        },
                        {
                            key: "supplierQuotes",
                            name: t(templateObject_27 || (templateObject_27 = __makeTemplateObject(["Supplier Quotes"], ["Supplier Quotes"]))),
                            module: "purchasing",
                            children: supplierQuotes
                        }
                    ];
                    return (<UsedIn_1.UsedInTree tree={tree} itemReadableId={(_a = styleSummary.readableId) !== null && _a !== void 0 ? _a : ""} itemReadableIdWithRevision={(_b = styleSummary.readableIdWithRevision) !== null && _b !== void 0 ? _b : ""} jobMaterialUsage={jobMaterialUsage} filterText={filterText} hideSearch/>);
                }}
                          </react_router_1.Await>
                        </react_2.Suspense>
                      </div>
                    </>)}
                </div>} content={<div className="h-full min-h-0 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent w-full">
                  <react_router_1.Outlet />
                </div>} properties={<Styles_1.StyleProperties key={itemId}/>}/>
          </div>
        </div>
      </div>
    </Layout_1.PanelProvider>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27;
