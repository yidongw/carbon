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
exports.loader = loader;
exports.action = action;
exports.default = EditSalesOrderLineRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var items_1 = require("~/modules/items");
var production_1 = require("~/modules/production");
var sales_1 = require("~/modules/sales");
var Opportunity_1 = require("~/modules/sales/ui/Opportunity");
var SalesOrder_1 = require("~/modules/sales/ui/SalesOrder");
var SalesOrderLineShipments_1 = require("~/modules/sales/ui/SalesOrder/SalesOrderLineShipments");
var form_2 = require("~/utils/form");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var companyId, orderId, lineId, serviceRole, _c, line, jobs, shipments, _d, _e, itemId;
        var _f, _g, _h;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "sales",
                        bypassRls: true
                    })];
                case 1:
                    companyId = (_j.sent()).companyId;
                    orderId = params.orderId, lineId = params.lineId;
                    if (!orderId)
                        throw (0, auth_1.notFound)("orderId not found");
                    if (!lineId)
                        throw (0, auth_1.notFound)("lineId not found");
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 2:
                    serviceRole = _j.sent();
                    return [4 /*yield*/, Promise.all([
                            (0, sales_1.getSalesOrderLine)(serviceRole, lineId),
                            (0, production_1.getJobsBySalesOrderLine)(serviceRole, lineId),
                            (0, sales_1.getSalesOrderLineShipments)(serviceRole, lineId)
                        ])];
                case 3:
                    _c = _j.sent(), line = _c[0], jobs = _c[1], shipments = _c[2];
                    if (!line.error) return [3 /*break*/, 5];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.salesOrderDetails(orderId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(line.error, "Failed to load sales order line"))];
                case 4: throw _d.apply(void 0, _e.concat([_j.sent()]));
                case 5:
                    itemId = line.data.itemId;
                    return [2 /*return*/, {
                            line: (_f = line === null || line === void 0 ? void 0 : line.data) !== null && _f !== void 0 ? _f : null,
                            itemReplenishment: itemId && line.data.methodType === "Make to Order"
                                ? (0, items_1.getItemReplenishment)(serviceRole, itemId, companyId)
                                : Promise.resolve({ data: null }),
                            files: (0, sales_1.getOpportunityLineDocuments)(serviceRole, companyId, lineId, itemId),
                            jobs: (_g = jobs === null || jobs === void 0 ? void 0 : jobs.data) !== null && _g !== void 0 ? _g : [],
                            shipments: (_h = shipments === null || shipments === void 0 ? void 0 : shipments.data) !== null && _h !== void 0 ? _h : []
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var orderId, lineId, viewClient, salesOrder, _c, client, userId, formData, validation, _d, id, d, updateSalesOrderLine, _e, _f;
        var _g;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    orderId = params.orderId, lineId = params.lineId;
                    if (!orderId)
                        throw new Error("Could not find orderId");
                    if (!lineId)
                        throw new Error("Could not find lineId");
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "sales"
                        })];
                case 1:
                    viewClient = (_h.sent()).client;
                    return [4 /*yield*/, (0, sales_1.getSalesOrder)(viewClient, orderId)];
                case 2:
                    salesOrder = _h.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: (0, sales_1.isSalesOrderLocked)((_g = salesOrder.data) === null || _g === void 0 ? void 0 : _g.status),
                            redirectTo: path_1.path.to.salesOrderLine(orderId, lineId),
                            message: "Cannot modify a locked sales order. Reopen it first."
                        })];
                case 3:
                    _h.sent();
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "sales"
                        })];
                case 4:
                    _c = _h.sent(), client = _c.client, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 5:
                    formData = _h.sent();
                    return [4 /*yield*/, (0, form_1.validator)(sales_1.salesOrderLineValidator).validate(formData)];
                case 6:
                    validation = _h.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, id = _d.id, d = __rest(_d, ["id"]);
                    if (d.salesOrderLineType === "Comment") {
                        d.accountId = undefined;
                        d.assetId = undefined;
                        d.itemId = undefined;
                    }
                    else if (d.salesOrderLineType === "Fixed Asset") {
                        d.accountId = undefined;
                        d.itemId = undefined;
                    }
                    else {
                        d.accountId = undefined;
                        d.assetId = undefined;
                    }
                    return [4 /*yield*/, (0, sales_1.upsertSalesOrderLine)(client, __assign(__assign({ id: lineId }, d), { updatedBy: userId, customFields: (0, form_2.setCustomFields)(formData) }))];
                case 7:
                    updateSalesOrderLine = _h.sent();
                    if (!updateSalesOrderLine.error) return [3 /*break*/, 9];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.salesOrderLine(orderId, lineId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateSalesOrderLine.error, "Failed to update sales order line"))];
                case 8: throw _e.apply(void 0, _f.concat([_h.sent()]));
                case 9: throw (0, react_router_1.redirect)(path_1.path.to.salesOrderLine(orderId, lineId));
            }
        });
    });
}
function EditSalesOrderLineRoute() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
    var t = (0, macro_1.useLingui)().t;
    var _1 = (0, react_router_1.useLoaderData)(), line = _1.line, jobs = _1.jobs, itemReplenishment = _1.itemReplenishment, files = _1.files, shipments = _1.shipments;
    var permissions = (0, hooks_1.usePermissions)();
    var _2 = (0, react_router_1.useParams)(), orderId = _2.orderId, lineId = _2.lineId;
    if (!orderId)
        throw new Error("orderId not found");
    if (!lineId)
        throw new Error("lineId not found");
    var orderData = (0, hooks_1.useRouteData)(path_1.path.to.salesOrder(orderId));
    if (!(orderData === null || orderData === void 0 ? void 0 : orderData.opportunity))
        throw new Error("Failed to load opportunity");
    if (!(orderData === null || orderData === void 0 ? void 0 : orderData.salesOrder))
        throw new Error("Failed to load sales order");
    var isReadOnly = (0, sales_1.isSalesOrderLocked)(orderData.salesOrder.status);
    var initialValues = __assign({ id: (_a = line === null || line === void 0 ? void 0 : line.id) !== null && _a !== void 0 ? _a : undefined, salesOrderId: (_b = line === null || line === void 0 ? void 0 : line.salesOrderId) !== null && _b !== void 0 ? _b : "", salesOrderLineType: (_c = line === null || line === void 0 ? void 0 : line.salesOrderLineType) !== null && _c !== void 0 ? _c : "Part", itemId: (_d = line === null || line === void 0 ? void 0 : line.itemId) !== null && _d !== void 0 ? _d : "", accountId: (_e = line === null || line === void 0 ? void 0 : line.accountId) !== null && _e !== void 0 ? _e : "", addOnCost: (_f = line === null || line === void 0 ? void 0 : line.addOnCost) !== null && _f !== void 0 ? _f : 0, assetId: (_g = line === null || line === void 0 ? void 0 : line.assetId) !== null && _g !== void 0 ? _g : "", description: (_h = line === null || line === void 0 ? void 0 : line.description) !== null && _h !== void 0 ? _h : "", locationId: (_j = line === null || line === void 0 ? void 0 : line.locationId) !== null && _j !== void 0 ? _j : "", methodType: (_k = line === null || line === void 0 ? void 0 : line.methodType) !== null && _k !== void 0 ? _k : "Make to Order", nonTaxableAddOnCost: (_l = line === null || line === void 0 ? void 0 : line.nonTaxableAddOnCost) !== null && _l !== void 0 ? _l : 0, promisedDate: (_m = line === null || line === void 0 ? void 0 : line.promisedDate) !== null && _m !== void 0 ? _m : undefined, saleQuantity: (_o = line === null || line === void 0 ? void 0 : line.saleQuantity) !== null && _o !== void 0 ? _o : 1, setupPrice: (_p = line === null || line === void 0 ? void 0 : line.setupPrice) !== null && _p !== void 0 ? _p : 0, storageUnitId: (_q = line === null || line === void 0 ? void 0 : line.storageUnitId) !== null && _q !== void 0 ? _q : "", unitOfMeasureCode: (_r = line === null || line === void 0 ? void 0 : line.unitOfMeasureCode) !== null && _r !== void 0 ? _r : "", unitPrice: (_s = line === null || line === void 0 ? void 0 : line.unitPrice) !== null && _s !== void 0 ? _s : 0, taxPercent: (_t = line === null || line === void 0 ? void 0 : line.taxPercent) !== null && _t !== void 0 ? _t : 0, shippingCost: (_u = line === null || line === void 0 ? void 0 : line.shippingCost) !== null && _u !== void 0 ? _u : 0, assetReadableId: (_v = line === null || line === void 0 ? void 0 : line.assetReadableId) !== null && _v !== void 0 ? _v : undefined, assetName: (_w = line === null || line === void 0 ? void 0 : line.assetName) !== null && _w !== void 0 ? _w : undefined }, (0, form_2.getCustomFields)(line === null || line === void 0 ? void 0 : line.customFields));
    return (<react_2.Fragment key={lineId}>
      <SalesOrder_1.SalesOrderLineForm key={initialValues.id} 
    // @ts-ignore
    initialValues={initialValues}/>

      <Opportunity_1.OpportunityLineNotes id={line.id} table="salesOrderLine" title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Notes"], ["Notes"])))} subTitle={(_x = line.itemReadableId) !== null && _x !== void 0 ? _x : ""} internalNotes={line.internalNotes} externalNotes={line.externalNotes}/>

      {line.methodType === "Make to Order" && (<react_2.Suspense fallback={<react_1.Card className="min-h-[264px]">
              <react_1.CardHeader>
                <react_1.CardTitle>
                  <macro_1.Trans>Jobs</macro_1.Trans>
                </react_1.CardTitle>
              </react_1.CardHeader>
            </react_1.Card>}>
          <react_router_1.Await resolve={itemReplenishment} errorElement={<div>
                <macro_1.Trans>Error loading make method</macro_1.Trans>
              </div>}>
            {function (resolvedItemReplenishment) {
                var _a;
                return (<SalesOrder_1.SalesOrderLineJobs salesOrder={orderData.salesOrder} line={line} opportunity={orderData.opportunity} jobs={jobs} itemReplenishment={(_a = resolvedItemReplenishment.data) !== null && _a !== void 0 ? _a : {
                        lotSize: 0,
                        scrapPercentage: 0
                    }}/>);
            }}
          </react_router_1.Await>
        </react_2.Suspense>)}

      <SalesOrderLineShipments_1.SalesOrderLineShipments salesOrder={orderData.salesOrder} line={line} opportunity={orderData.opportunity} shipments={shipments}/>

      <components_1.DeferredFiles resolve={files}>
        {function (resolvedFiles) { return (<Opportunity_1.OpportunityLineDocuments files={resolvedFiles !== null && resolvedFiles !== void 0 ? resolvedFiles : []} id={orderId} lineId={lineId} itemId={line === null || line === void 0 ? void 0 : line.itemId} modelUpload={line !== null && line !== void 0 ? line : undefined} type="Sales Order"/>); }}
      </components_1.DeferredFiles>
      <components_1.CadModel isReadOnly={isReadOnly || !permissions.can("update", "sales")} metadata={{
            salesOrderLineId: (_y = line === null || line === void 0 ? void 0 : line.id) !== null && _y !== void 0 ? _y : undefined,
            itemId: (_z = line === null || line === void 0 ? void 0 : line.itemId) !== null && _z !== void 0 ? _z : undefined
        }} modelPath={(_0 = line === null || line === void 0 ? void 0 : line.modelPath) !== null && _0 !== void 0 ? _0 : null} title={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["CAD Model"], ["CAD Model"])))} uploadClassName="aspect-square min-h-[420px] max-h-[70vh]" viewerClassName="aspect-square min-h-[420px] max-h-[70vh]"/>

      <react_router_1.Outlet />
    </react_2.Fragment>);
}
var templateObject_1, templateObject_2;
