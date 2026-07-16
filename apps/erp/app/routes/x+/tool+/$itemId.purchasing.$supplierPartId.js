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
exports.default = EditToolSupplierRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_router_1 = require("react-router");
var items_1 = require("~/modules/items");
var Item_1 = require("~/modules/items/ui/Item");
var database_server_1 = require("~/services/database.server");
var form_2 = require("~/utils/form");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, supplierPartId, _d, supplierPartResult, priceBreaksResult, supplierPart, purchasingHistory;
        var _e, _f;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "parts"
                    })];
                case 1:
                    _c = _g.sent(), client = _c.client, companyId = _c.companyId;
                    supplierPartId = params.supplierPartId;
                    if (!supplierPartId)
                        throw new Error("Could not find supplierPartId");
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("supplierPart")
                                .select("*")
                                .eq("id", supplierPartId)
                                .eq("companyId", companyId)
                                .single(),
                            client
                                .from("supplierPartPrice")
                                .select("quantity, unitPrice, sourceType, sourceDocumentId, createdAt")
                                .eq("supplierPartId", supplierPartId)
                                .order("quantity", { ascending: true })
                        ])];
                case 2:
                    _d = _g.sent(), supplierPartResult = _d[0], priceBreaksResult = _d[1];
                    if (!(supplierPartResult === null || supplierPartResult === void 0 ? void 0 : supplierPartResult.data))
                        throw new Error("Could not find supplier part");
                    supplierPart = supplierPartResult.data;
                    return [4 /*yield*/, client
                            .from("purchaseOrderLine")
                            .select("id, purchaseQuantity, unitPrice, purchaseOrderId, purchaseOrder!inner(purchaseOrderId, supplierId, orderDate)")
                            .eq("itemId", supplierPart.itemId)
                            .eq("purchaseOrder.supplierId", supplierPart.supplierId)
                            .order("createdAt", { ascending: false })
                            .limit(10)];
                case 3:
                    purchasingHistory = _g.sent();
                    return [2 /*return*/, {
                            supplierPart: supplierPart,
                            priceBreaks: (_e = priceBreaksResult.data) !== null && _e !== void 0 ? _e : [],
                            purchasingHistory: (_f = purchasingHistory.data) !== null && _f !== void 0 ? _f : []
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, companyId, itemId, supplierPartId, formData, validation, _d, id, d, updatedSupplierPart, priceBreaksRaw, priceBreaks_1, db, _e, _f;
        var _this = this;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "parts"
                        })];
                case 1:
                    _c = _g.sent(), client = _c.client, userId = _c.userId, companyId = _c.companyId;
                    itemId = params.itemId, supplierPartId = params.supplierPartId;
                    if (!itemId)
                        throw new Error("Could not find itemId");
                    if (!supplierPartId)
                        throw new Error("Could not find supplierPartId");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _g.sent();
                    return [4 /*yield*/, (0, form_1.validator)(items_1.supplierPartValidator).validate(formData)];
                case 3:
                    validation = _g.sent();
                    if (validation.error) {
                        return [2 /*return*/, { success: false, message: "Invalid form data" }];
                    }
                    _d = validation.data, id = _d.id, d = __rest(_d, ["id"]);
                    return [4 /*yield*/, (0, items_1.upsertSupplierPart)(client, __assign(__assign({ id: supplierPartId }, d), { updatedBy: userId, customFields: (0, form_2.setCustomFields)(formData) }))];
                case 4:
                    updatedSupplierPart = _g.sent();
                    if (updatedSupplierPart.error) {
                        return [2 /*return*/, { success: false, message: "Failed to update supplier part" }];
                    }
                    priceBreaksRaw = formData.get("priceBreaks");
                    if (!priceBreaksRaw) return [3 /*break*/, 6];
                    priceBreaks_1 = JSON.parse(priceBreaksRaw);
                    db = (0, database_server_1.getDatabaseClient)();
                    return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, trx
                                            .deleteFrom("supplierPartPrice")
                                            .where("supplierPartId", "=", supplierPartId)
                                            .execute()];
                                    case 1:
                                        _a.sent();
                                        if (!(priceBreaks_1.length > 0)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, trx
                                                .insertInto("supplierPartPrice")
                                                .values(priceBreaks_1.map(function (pb) {
                                                var _a;
                                                return ({
                                                    supplierPartId: supplierPartId,
                                                    quantity: pb.quantity,
                                                    unitPrice: pb.unitPrice,
                                                    leadTime: (_a = pb.leadTime) !== null && _a !== void 0 ? _a : 0,
                                                    sourceType: "Manual Entry",
                                                    companyId: companyId,
                                                    createdBy: userId,
                                                    updatedBy: userId
                                                });
                                            }))
                                                .execute()];
                                    case 2:
                                        _a.sent();
                                        _a.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 5:
                    _g.sent();
                    _g.label = 6;
                case 6:
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.toolPurchasing(itemId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Supplier part updated"))];
                case 7: throw _e.apply(void 0, _f.concat([_g.sent()]));
            }
        });
    });
}
function EditToolSupplierRoute() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var itemId = (0, react_router_1.useParams)().itemId;
    var _j = (0, react_router_1.useLoaderData)(), supplierPart = _j.supplierPart, priceBreaks = _j.priceBreaks, purchasingHistory = _j.purchasingHistory;
    if (!itemId)
        throw new Error("itemId not found");
    var routeData = (0, react_1.useRouteData)(path_1.path.to.tool(itemId));
    var navigate = (0, react_router_1.useNavigate)();
    var onClose = function () { return navigate(path_1.path.to.toolPurchasing(itemId)); };
    var initialValues = {
        id: supplierPart.id,
        itemId: supplierPart.itemId,
        supplierId: supplierPart.supplierId,
        supplierPartId: (_a = supplierPart.supplierPartId) !== null && _a !== void 0 ? _a : "",
        unitPrice: (_b = supplierPart.unitPrice) !== null && _b !== void 0 ? _b : 0,
        supplierUnitOfMeasureCode: (_c = supplierPart.supplierUnitOfMeasureCode) !== null && _c !== void 0 ? _c : "EA",
        minimumOrderQuantity: (_d = supplierPart.minimumOrderQuantity) !== null && _d !== void 0 ? _d : 1,
        orderMultiple: (_e = supplierPart.orderMultiple) !== null && _e !== void 0 ? _e : 1,
        conversionFactor: (_f = supplierPart.conversionFactor) !== null && _f !== void 0 ? _f : 1
    };
    return (<Item_1.SupplierPartForm type="Tool" initialValues={initialValues} unitOfMeasureCode={(_h = (_g = routeData === null || routeData === void 0 ? void 0 : routeData.toolSummary) === null || _g === void 0 ? void 0 : _g.unitOfMeasureCode) !== null && _h !== void 0 ? _h : ""} priceBreaks={priceBreaks} purchasingHistory={purchasingHistory} onClose={onClose}/>);
}
