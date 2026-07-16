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
exports.loader = void 0;
exports.action = action;
exports.default = QuoteLine;
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
var sales_1 = require("~/modules/sales");
var Opportunity_1 = require("~/modules/sales/ui/Opportunity");
var Quotes_1 = require("~/modules/sales/ui/Quotes");
var QuoteLinePricingHistory_1 = require("~/modules/sales/ui/Quotes/QuoteLinePricingHistory");
var QuoteLineRiskRegister_1 = require("~/modules/sales/ui/Quotes/QuoteLineRiskRegister");
var shared_1 = require("~/modules/shared");
var form_2 = require("~/utils/form");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
var loader = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var _c, client, companyId, quoteId, lineId, serviceRole, _d, line, operations, prices, _e, _f, itemId, rootMethod, methodData, _g;
    var _h, _j;
    var request = _b.request, params = _b.params;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                    view: "sales"
                })];
            case 1:
                _c = _k.sent(), client = _c.client, companyId = _c.companyId;
                quoteId = params.quoteId, lineId = params.lineId;
                if (!quoteId)
                    throw new Error("Could not find quoteId");
                if (!lineId)
                    throw new Error("Could not find lineId");
                return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
            case 2:
                serviceRole = _k.sent();
                return [4 /*yield*/, Promise.all([
                        (0, sales_1.getQuoteLine)(serviceRole, lineId),
                        (0, sales_1.getQuoteOperationsByLine)(serviceRole, lineId),
                        (0, sales_1.getQuoteLinePrices)(serviceRole, lineId)
                    ])];
            case 3:
                _d = _k.sent(), line = _d[0], operations = _d[1], prices = _d[2];
                if (!line.error) return [3 /*break*/, 5];
                _e = react_router_1.redirect;
                _f = [path_1.path.to.quote(quoteId)];
                return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(line.error, "Failed to load line"))];
            case 4: throw _e.apply(void 0, _f.concat([_k.sent()]));
            case 5:
                itemId = line.data.itemId;
                return [4 /*yield*/, (0, sales_1.getRootQuoteMakeMethod)(serviceRole, lineId)];
            case 6:
                rootMethod = _k.sent();
                if (!rootMethod.data) return [3 /*break*/, 8];
                return [4 /*yield*/, (function () { return __awaiter(void 0, void 0, void 0, function () {
                        var methodId, _a, materials, methodOperations, tags;
                        var _b, _c, _d, _e, _f;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    methodId = rootMethod.data.id;
                                    return [4 /*yield*/, Promise.all([
                                            (0, sales_1.getQuoteMaterialsByMethodId)(serviceRole, methodId),
                                            (0, sales_1.getQuoteOperationsByMethodId)(serviceRole, methodId),
                                            (0, shared_1.getTagsList)(client, companyId, "operation")
                                        ])];
                                case 1:
                                    _a = _g.sent(), materials = _a[0], methodOperations = _a[1], tags = _a[2];
                                    return [2 /*return*/, {
                                            methodMaterials: (_c = (_b = materials === null || materials === void 0 ? void 0 : materials.data) === null || _b === void 0 ? void 0 : _b.map(function (m) {
                                                var _a, _b;
                                                return (__assign(__assign({}, m), { itemType: m.itemType, unitOfMeasureCode: (_a = m.unitOfMeasureCode) !== null && _a !== void 0 ? _a : "", quoteOperationId: (_b = m.quoteOperationId) !== null && _b !== void 0 ? _b : undefined }));
                                            })) !== null && _c !== void 0 ? _c : [],
                                            methodOperations: (_e = (_d = methodOperations.data) === null || _d === void 0 ? void 0 : _d.map(function (o) {
                                                var _a, _b, _c, _d, _e, _f, _g;
                                                return (__assign(__assign({}, o), { description: (_a = o.description) !== null && _a !== void 0 ? _a : "", workCenterId: (_b = o.workCenterId) !== null && _b !== void 0 ? _b : undefined, laborRate: (_c = o.laborRate) !== null && _c !== void 0 ? _c : 0, machineRate: (_d = o.machineRate) !== null && _d !== void 0 ? _d : 0, operationSupplierProcessId: (_e = o.operationSupplierProcessId) !== null && _e !== void 0 ? _e : undefined, quoteMakeMethodId: (_f = o.quoteMakeMethodId) !== null && _f !== void 0 ? _f : methodId, workInstruction: o.workInstruction, tags: (_g = o.tags) !== null && _g !== void 0 ? _g : [] }));
                                            })) !== null && _e !== void 0 ? _e : [],
                                            configurationParameters: (0, sales_1.getConfigurationParametersByQuoteLineId)(serviceRole, lineId, companyId),
                                            model: (0, sales_1.getModelByQuoteLineId)(serviceRole, lineId),
                                            tags: (_f = tags.data) !== null && _f !== void 0 ? _f : [],
                                            rootMethodId: methodId
                                        }];
                            }
                        });
                    }); })()];
            case 7:
                _g = _k.sent();
                return [3 /*break*/, 9];
            case 8:
                _g = null;
                _k.label = 9;
            case 9:
                methodData = _g;
                return [2 /*return*/, {
                        line: line.data,
                        operations: (_h = operations === null || operations === void 0 ? void 0 : operations.data) !== null && _h !== void 0 ? _h : [],
                        files: (0, sales_1.getOpportunityLineDocuments)(serviceRole, companyId, lineId, itemId),
                        pricesByQuantity: ((_j = prices === null || prices === void 0 ? void 0 : prices.data) !== null && _j !== void 0 ? _j : []).reduce(function (acc, price) {
                            acc[price.quantity] = price;
                            return acc;
                        }, {}),
                        relatedPrices: (0, sales_1.getRelatedPricesForQuoteLine)(serviceRole, itemId, quoteId),
                        methodData: methodData
                    }];
        }
    });
}); };
exports.loader = loader;
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, quoteId, lineId, viewClient, quote, formData, validation, _d, id, d, updateQuotationLine, _e, _f, methodType, needsSeed, serviceRole, existingPrices, existingQuantities_1, addedQuantities, priceResult, _g, _h, _j, _k;
        var _l, _m, _o, _p;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "sales"
                        })];
                case 1:
                    _c = _q.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    quoteId = params.quoteId, lineId = params.lineId;
                    if (!quoteId)
                        throw new Error("Could not find quoteId");
                    if (!lineId)
                        throw new Error("Could not find lineId");
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "sales"
                        })];
                case 2:
                    viewClient = (_q.sent()).client;
                    return [4 /*yield*/, (0, sales_1.getQuote)(viewClient, quoteId)];
                case 3:
                    quote = _q.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: (0, sales_1.isQuoteLocked)((_l = quote.data) === null || _l === void 0 ? void 0 : _l.status),
                            redirectTo: path_1.path.to.quote(quoteId),
                            message: "Cannot modify a locked quote. Reopen it first."
                        })];
                case 4:
                    _q.sent();
                    return [4 /*yield*/, request.formData()];
                case 5:
                    formData = _q.sent();
                    return [4 /*yield*/, (0, form_1.validator)(sales_1.quoteLineValidator).validate(formData)];
                case 6:
                    validation = _q.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, id = _d.id, d = __rest(_d, ["id"]);
                    return [4 /*yield*/, (0, sales_1.upsertQuoteLine)(client, __assign(__assign({ id: lineId }, d), { updatedBy: userId, customFields: (0, form_2.setCustomFields)(formData) }))];
                case 7:
                    updateQuotationLine = _q.sent();
                    if (!updateQuotationLine.error) return [3 /*break*/, 9];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.quoteLine(quoteId, lineId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateQuotationLine.error, "Failed to update quote line"))];
                case 8: throw _e.apply(void 0, _f.concat([_q.sent()]));
                case 9:
                    methodType = d.methodType;
                    needsSeed = (methodType === "Make to Order" ||
                        methodType === "Pull from Inventory" ||
                        methodType === "Purchase to Order") &&
                        !!((_m = d.quantity) === null || _m === void 0 ? void 0 : _m.length);
                    if (!needsSeed) return [3 /*break*/, 19];
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("quoteLinePrice")
                            .select("quantity")
                            .eq("quoteLineId", lineId)];
                case 10:
                    existingPrices = _q.sent();
                    existingQuantities_1 = new Set(((_o = existingPrices.data) !== null && _o !== void 0 ? _o : []).map(function (p) { return p.quantity; }));
                    addedQuantities = ((_p = d.quantity) !== null && _p !== void 0 ? _p : []).filter(function (q) { return !existingQuantities_1.has(q); });
                    if (!(addedQuantities.length > 0)) return [3 /*break*/, 19];
                    if (!(methodType === "Make to Order")) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, sales_1.calculatePricesForQuantities)(serviceRole, quoteId, lineId, addedQuantities, userId)];
                case 11:
                    _g = _q.sent();
                    return [3 /*break*/, 17];
                case 12:
                    if (!(methodType === "Pull from Inventory")) return [3 /*break*/, 14];
                    return [4 /*yield*/, (0, sales_1.resolveQuoteLinePrices)(serviceRole, companyId, quoteId, lineId, addedQuantities, userId)];
                case 13:
                    _h = _q.sent();
                    return [3 /*break*/, 16];
                case 14: return [4 /*yield*/, (0, sales_1.resolvePurchaseToOrderPrices)(serviceRole, companyId, quoteId, lineId, addedQuantities, userId)];
                case 15:
                    _h = _q.sent();
                    _q.label = 16;
                case 16:
                    _g = _h;
                    _q.label = 17;
                case 17:
                    priceResult = _g;
                    if (!(priceResult === null || priceResult === void 0 ? void 0 : priceResult.error)) return [3 /*break*/, 19];
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.quoteLine(quoteId, lineId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(priceResult.error, "Failed to seed ".concat(methodType, " prices for new quantities")))];
                case 18: throw _j.apply(void 0, _k.concat([_q.sent()]));
                case 19: throw (0, react_router_1.redirect)(path_1.path.to.quoteLine(quoteId, lineId));
            }
        });
    });
}
function QuoteLine() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
    var t = (0, macro_1.useLingui)().t;
    var _2 = (0, react_router_1.useLoaderData)(), line = _2.line, operations = _2.operations, files = _2.files, pricesByQuantity = _2.pricesByQuantity, relatedPrices = _2.relatedPrices, methodData = _2.methodData;
    var permissions = (0, hooks_1.usePermissions)();
    var _3 = (0, react_router_1.useParams)(), quoteId = _3.quoteId, lineId = _3.lineId;
    if (!quoteId)
        throw new Error("Could not find quoteId");
    if (!lineId)
        throw new Error("Could not find lineId");
    var company = (0, hooks_1.useUser)().company;
    var baseCurrency = (_a = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _a !== void 0 ? _a : "USD";
    // useRealtime("quoteLine", `id=eq.${lineId}`);
    (0, hooks_1.useRealtime)("quoteMaterial", "quoteLineId=eq.".concat(lineId));
    (0, hooks_1.useRealtime)("quoteOperation", "quoteLineId=eq.".concat(lineId));
    var quoteData = (0, hooks_1.useRouteData)(path_1.path.to.quote(quoteId));
    var methodTree = (0, react_2.useMemo)(function () { var _a; return (_a = quoteData === null || quoteData === void 0 ? void 0 : quoteData.methods) === null || _a === void 0 ? void 0 : _a.find(function (m) { return m.data.quoteLineId === line.id; }); }, [quoteData, line.id]);
    var getLineCosts = (0, Quotes_1.useLineCosts)({
        methodTree: methodTree,
        operations: operations,
        line: line,
        supplierPriceMap: (_b = quoteData === null || quoteData === void 0 ? void 0 : quoteData.supplierPriceMap) !== null && _b !== void 0 ? _b : {}
    });
    var initialValues = __assign(__assign(__assign({}, line), { id: (_c = line.id) !== null && _c !== void 0 ? _c : undefined, quoteId: (_d = line.quoteId) !== null && _d !== void 0 ? _d : "", customerPartId: (_e = line.customerPartId) !== null && _e !== void 0 ? _e : "", customerPartRevision: (_f = line.customerPartRevision) !== null && _f !== void 0 ? _f : "", description: (_g = line.description) !== null && _g !== void 0 ? _g : "", estimatorId: (_h = line.estimatorId) !== null && _h !== void 0 ? _h : "", itemId: (_j = line.itemId) !== null && _j !== void 0 ? _j : "", methodType: (_k = line.methodType) !== null && _k !== void 0 ? _k : "Make to Order", modelUploadId: (_l = line.modelUploadId) !== null && _l !== void 0 ? _l : undefined, noQuoteReason: (_m = line.noQuoteReason) !== null && _m !== void 0 ? _m : undefined, status: (_o = line.status) !== null && _o !== void 0 ? _o : "Not Started", quantity: (_p = line.quantity) !== null && _p !== void 0 ? _p : [1], unitOfMeasureCode: (_q = line.unitOfMeasureCode) !== null && _q !== void 0 ? _q : "", taxPercent: (_r = line.taxPercent) !== null && _r !== void 0 ? _r : 0 }), (0, form_2.getCustomFields)(line.customFields));
    return (<react_2.Fragment key={lineId}>
      <Quotes_1.QuoteMakeMethodTools />
      <Quotes_1.QuoteLineForm key={lineId} initialValues={initialValues}/>
      <Opportunity_1.OpportunityLineNotes id={line.id} table="quoteLine" title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Notes"], ["Notes"])))} subTitle={(_s = line.itemReadableId) !== null && _s !== void 0 ? _s : ""} internalNotes={line.internalNotes} externalNotes={line.externalNotes}/>

      {methodData && (<react_1.VStack spacing={2}>
          <Quotes_1.QuoteBillOfMaterial key={"bom:".concat(methodData.rootMethodId)} quoteMakeMethodId={methodData.rootMethodId} 
        // @ts-ignore
        materials={methodData.methodMaterials} 
        // @ts-expect-error
        operations={methodData.methodOperations}/>
          <Quotes_1.QuoteBillOfProcess key={"bop:".concat(methodData.rootMethodId)} quoteMakeMethodId={methodData.rootMethodId} 
        // @ts-expect-error
        operations={methodData.methodOperations} tags={(_t = methodData.tags) !== null && _t !== void 0 ? _t : []}/>
        </react_1.VStack>)}

      {line.methodType === "Make to Order" &&
            line.status !== "No Quote" &&
            permissions.is("employee") && (<Quotes_1.QuoteLineCosting quantities={(_u = line.quantity) !== null && _u !== void 0 ? _u : [1]} getLineCosts={getLineCosts} unitPricePrecision={(_v = line.unitPricePrecision) !== null && _v !== void 0 ? _v : 2}/>)}
      {line.status !== "No Quote" && (<>
          <react_2.Suspense fallback={null}>
            <react_router_1.Await resolve={relatedPrices}>
              {function (resolvedPrices) {
                var _a, _b;
                var hasRelatedOrders = (resolvedPrices === null || resolvedPrices === void 0 ? void 0 : resolvedPrices.relatedSalesOrderLines) &&
                    resolvedPrices.relatedSalesOrderLines.length > 0;
                var hasHistoricalPrices = (resolvedPrices === null || resolvedPrices === void 0 ? void 0 : resolvedPrices.historicalQuoteLinePrices) &&
                    resolvedPrices.historicalQuoteLinePrices.length > 0;
                return ((hasRelatedOrders || hasHistoricalPrices) && (<QuoteLinePricingHistory_1.default relatedSalesOrderLines={(_a = resolvedPrices === null || resolvedPrices === void 0 ? void 0 : resolvedPrices.relatedSalesOrderLines) !== null && _a !== void 0 ? _a : []} historicalQuoteLinePrices={(_b = resolvedPrices === null || resolvedPrices === void 0 ? void 0 : resolvedPrices.historicalQuoteLinePrices) !== null && _b !== void 0 ? _b : []} baseCurrency={baseCurrency}/>));
            }}
            </react_router_1.Await>
          </react_2.Suspense>
          <Quotes_1.QuoteLinePricing key={lineId} line={line} exchangeRate={(_x = (_w = quoteData === null || quoteData === void 0 ? void 0 : quoteData.quote) === null || _w === void 0 ? void 0 : _w.exchangeRate) !== null && _x !== void 0 ? _x : 1} pricesByQuantity={pricesByQuantity} getLineCosts={getLineCosts}/>
        </>)}

      <components_1.DeferredFiles resolve={files}>
        {function (resolvedFiles) { return (<Opportunity_1.OpportunityLineDocuments files={resolvedFiles !== null && resolvedFiles !== void 0 ? resolvedFiles : []} id={quoteId} lineId={lineId} itemId={line === null || line === void 0 ? void 0 : line.itemId} modelUpload={line !== null && line !== void 0 ? line : undefined} type="Quote"/>); }}
      </components_1.DeferredFiles>

      {methodData ? (<react_2.Suspense fallback={null}>
          <react_router_1.Await resolve={methodData.model}>
            {function (model) {
                var _a, _b;
                return (<components_1.CadModel key={"cad:".concat(model === null || model === void 0 ? void 0 : model.itemId)} isReadOnly={!permissions.can("update", "sales")} metadata={{
                        quoteLineId: lineId !== null && lineId !== void 0 ? lineId : undefined,
                        itemId: (_a = model === null || model === void 0 ? void 0 : model.itemId) !== null && _a !== void 0 ? _a : undefined
                    }} modelPath={(_b = model === null || model === void 0 ? void 0 : model.modelPath) !== null && _b !== void 0 ? _b : null} title={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["CAD Model"], ["CAD Model"])))} uploadClassName="aspect-square min-h-[420px] max-h-[70vh]" viewerClassName="aspect-square min-h-[420px] max-h-[70vh]"/>);
            }}
          </react_router_1.Await>
        </react_2.Suspense>) : (<components_1.CadModel isReadOnly={!permissions.can("update", "sales")} metadata={{
                quoteLineId: (_y = line.id) !== null && _y !== void 0 ? _y : undefined,
                itemId: (_z = line.itemId) !== null && _z !== void 0 ? _z : undefined
            }} modelPath={(_0 = line === null || line === void 0 ? void 0 : line.modelPath) !== null && _0 !== void 0 ? _0 : null} title={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["CAD Model"], ["CAD Model"])))} uploadClassName="aspect-square min-h-[420px] max-h-[70vh]" viewerClassName="aspect-square min-h-[420px] max-h-[70vh]"/>)}

      <QuoteLineRiskRegister_1.default quoteLineId={lineId} itemId={(_1 = line.itemId) !== null && _1 !== void 0 ? _1 : ""}/>

      <react_router_1.Outlet />
    </react_2.Fragment>);
}
var templateObject_1, templateObject_2, templateObject_3;
