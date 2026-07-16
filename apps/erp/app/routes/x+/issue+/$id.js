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
exports.handle = void 0;
exports.loader = loader;
exports.default = IssueRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Layout_1 = require("~/components/Layout");
var items_1 = require("~/modules/items");
var quality_1 = require("~/modules/quality");
var IssueAssociations_1 = require("~/modules/quality/ui/Issue/IssueAssociations");
var IssueHeader_1 = require("~/modules/quality/ui/Issue/IssueHeader");
var IssueProperties_1 = require("~/modules/quality/ui/Issue/IssueProperties");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Issues"], ["Issues"]))),
    to: path_1.path.to.issues,
    module: "quality"
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, id, _d, nonConformance, nonConformanceTypes, requiredActions, suppliers, tags, _e, _f;
        var _g, _h, _j, _k;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "quality",
                        bypassRls: true
                    })];
                case 1:
                    _c = _l.sent(), client = _c.client, companyId = _c.companyId;
                    id = params.id;
                    if (!id)
                        throw new Error("Could not find id");
                    return [4 /*yield*/, Promise.all([
                            (0, quality_1.getIssue)(client, id),
                            (0, quality_1.getIssueTypesList)(client, companyId),
                            (0, quality_1.getRequiredActionsList)(client, companyId),
                            (0, quality_1.getIssueSuppliers)(client, id, companyId),
                            (0, shared_1.getTagsList)(client, companyId, "nonConformance")
                        ])];
                case 2:
                    _d = _l.sent(), nonConformance = _d[0], nonConformanceTypes = _d[1], requiredActions = _d[2], suppliers = _d[3], tags = _d[4];
                    if (!nonConformance.error) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.issues];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(nonConformance.error, "Failed to load issue"))];
                case 3: throw _e.apply(void 0, _f.concat([_l.sent()]));
                case 4: return [2 /*return*/, {
                        associations: (0, quality_1.getIssueAssociations)(client, id, companyId),
                        files: (0, items_1.getItemFiles)(client, id, companyId),
                        nonConformance: nonConformance.data,
                        nonConformanceTypes: (_g = nonConformanceTypes.data) !== null && _g !== void 0 ? _g : [],
                        requiredActions: (_h = requiredActions.data) !== null && _h !== void 0 ? _h : [],
                        suppliers: (_j = suppliers.data) !== null && _j !== void 0 ? _j : [],
                        tags: (_k = tags.data) !== null && _k !== void 0 ? _k : []
                    }];
            }
        });
    });
}
function IssueRoute() {
    var t = (0, macro_2.useLingui)().t;
    var associations = (0, react_router_1.useLoaderData)().associations;
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("Could not find id");
    return (<Layout_1.PanelProvider>
      <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full">
        <IssueHeader_1.default />
        <div className="flex flex-1 min-h-0 overflow-hidden w-full">
          <div className="flex flex-1 min-h-0 h-full overflow-hidden">
            <Layout_1.ResizablePanels explorer={<react_2.Suspense fallback={<IssueAssociations_1.IssueAssociationsSkeleton />}>
                  <react_router_1.Await resolve={associations}>
                    {function (resolvedAssociations) {
                var _a, _b, _c;
                // Transform the raw associations data into the tree structure expected by IssueAssociationsTree
                var tree = [
                    {
                        key: "items",
                        name: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Item"], ["Item"]))),
                        pluralName: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Items"], ["Items"]))),
                        module: "parts",
                        children: resolvedAssociations.items
                    },
                    {
                        key: "jobOperations",
                        name: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Job Operation"], ["Job Operation"]))),
                        pluralName: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Job Operations"], ["Job Operations"]))),
                        module: "production",
                        children: resolvedAssociations.jobOperations
                    },
                    {
                        key: "purchaseOrderLines",
                        name: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Purchase Order"], ["Purchase Order"]))),
                        pluralName: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Purchase Orders"], ["Purchase Orders"]))),
                        module: "purchasing",
                        children: resolvedAssociations.purchaseOrderLines
                    },
                    {
                        key: "salesOrderLines",
                        name: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Sales Order"], ["Sales Order"]))),
                        pluralName: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Sales Orders"], ["Sales Orders"]))),
                        module: "sales",
                        children: resolvedAssociations.salesOrderLines
                    },
                    {
                        key: "shipmentLines",
                        name: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Shipment"], ["Shipment"]))),
                        pluralName: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Shipments"], ["Shipments"]))),
                        module: "shipping",
                        children: resolvedAssociations.shipmentLines
                    },
                    {
                        key: "receiptLines",
                        name: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Receipt"], ["Receipt"]))),
                        pluralName: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Receipts"], ["Receipts"]))),
                        module: "receiving",
                        children: resolvedAssociations.receiptLines
                    },
                    {
                        key: "trackedEntities",
                        name: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Tracked Entity"], ["Tracked Entity"]))),
                        pluralName: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Tracked Entities"], ["Tracked Entities"]))),
                        module: "inventory",
                        children: resolvedAssociations.trackedEntities
                    },
                    {
                        key: "customers",
                        name: t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Customer"], ["Customer"]))),
                        pluralName: t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Customers"], ["Customers"]))),
                        module: "sales",
                        children: resolvedAssociations.customers
                    },
                    {
                        key: "suppliers",
                        name: t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Supplier"], ["Supplier"]))),
                        pluralName: t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Suppliers"], ["Suppliers"]))),
                        module: "purchasing",
                        children: resolvedAssociations.suppliers
                    },
                    {
                        key: "inboundInspections",
                        name: t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Inbound Inspection"], ["Inbound Inspection"]))),
                        pluralName: t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Inbound Inspections"], ["Inbound Inspections"]))),
                        module: "quality",
                        children: (_a = resolvedAssociations.inboundInspections) !== null && _a !== void 0 ? _a : []
                    }
                ];
                return (<IssueAssociations_1.IssueAssociationsTree tree={tree} nonConformanceId={id} items={(_c = (_b = resolvedAssociations.items) === null || _b === void 0 ? void 0 : _b.map(function (i) { return i.documentId; })) !== null && _c !== void 0 ? _c : undefined}/>);
            }}
                  </react_router_1.Await>
                </react_2.Suspense>} content={<div className="h-full min-h-0 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent w-full">
                  <react_1.VStack spacing={2} className="p-2">
                    <react_router_1.Outlet />
                  </react_1.VStack>
                </div>} properties={<IssueProperties_1.default key={id}/>}/>
          </div>
        </div>
      </div>
    </Layout_1.PanelProvider>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21;
