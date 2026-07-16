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
exports.usePurchaseOrderRelatedDocuments = exports.usePurchaseOrder = void 0;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var usePurchaseOrder = function () {
    var navigate = (0, react_router_1.useNavigate)();
    var submit = (0, react_router_1.useSubmit)();
    var edit = (0, react_2.useCallback)(function (purchaseOrder) {
        return navigate(path_1.path.to.purchaseOrder(purchaseOrder.id));
    }, [navigate]);
    var invoice = (0, react_2.useCallback)(function (purchaseOrder) {
        return navigate("".concat(path_1.path.to.newPurchaseInvoice, "?sourceDocument=Purchase Order&sourceDocumentId=").concat(purchaseOrder.id));
    }, [navigate]);
    var receive = (0, react_2.useCallback)(function (purchaseOrder) {
        var formData = new FormData();
        formData.set("sourceDocument", "Purchase Order");
        formData.set("sourceDocumentId", purchaseOrder.id);
        submit(formData, { method: "post", action: path_1.path.to.newReceipt });
    }, [submit]);
    var ship = (0, react_2.useCallback)(function (purchaseOrder) {
        var formData = new FormData();
        formData.set("sourceDocument", "Purchase Order");
        formData.set("sourceDocumentId", purchaseOrder.id);
        submit(formData, { method: "post", action: path_1.path.to.newShipment });
    }, [submit]);
    return {
        edit: edit,
        invoice: invoice,
        receive: receive,
        ship: ship
    };
};
exports.usePurchaseOrder = usePurchaseOrder;
var usePurchaseOrderRelatedDocuments = function (supplierInteractionId, isOutsideProcessing) {
    var _a = (0, react_2.useState)([]), receipts = _a[0], setReceipts = _a[1];
    var _b = (0, react_2.useState)([]), invoices = _b[0], setInvoices = _b[1];
    var _c = (0, react_2.useState)([]), shipments = _c[0], setShipments = _c[1];
    var carbon = (0, auth_1.useCarbon)().carbon;
    var getRelatedDocuments = (0, react_2.useCallback)(function (supplierInteractionId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, receipts, invoices, shipments;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!carbon || !supplierInteractionId)
                        return [2 /*return*/];
                    return [4 /*yield*/, Promise.all([
                            carbon
                                .from("receipt")
                                .select("id, receiptId, status")
                                .eq("supplierInteractionId", supplierInteractionId),
                            carbon
                                .from("purchaseInvoice")
                                .select("id, invoiceId, status, datePaid, dateDue")
                                .eq("supplierInteractionId", supplierInteractionId),
                            isOutsideProcessing
                                ? carbon
                                    .from("shipment")
                                    .select("id, shipmentId, status")
                                    .eq("supplierInteractionId", supplierInteractionId)
                                : Promise.resolve({ data: [], error: null })
                        ])];
                case 1:
                    _a = _d.sent(), receipts = _a[0], invoices = _a[1], shipments = _a[2];
                    if (receipts.error) {
                        react_1.toast.error("Failed to load receipts");
                    }
                    else {
                        setReceipts(receipts.data);
                    }
                    if (invoices.error) {
                        react_1.toast.error("Failed to load invoices");
                    }
                    else {
                        setInvoices((_c = (_b = invoices.data) === null || _b === void 0 ? void 0 : _b.map(function (invoice) { return (__assign(__assign({}, invoice), { status: invoice.dateDue
                                ? !invoice.datePaid && new Date(invoice.dateDue) < new Date()
                                    ? "Overdue"
                                    : invoice.status
                                : invoice.status })); })) !== null && _c !== void 0 ? _c : []);
                    }
                    if (shipments.error) {
                        react_1.toast.error("Failed to load shipments");
                    }
                    else {
                        setShipments(shipments.data);
                    }
                    return [2 /*return*/];
            }
        });
    }); }, [carbon, isOutsideProcessing]);
    (0, react_2.useEffect)(function () {
        getRelatedDocuments(supplierInteractionId);
    }, [getRelatedDocuments, supplierInteractionId]);
    return { receipts: receipts, invoices: invoices, shipments: shipments };
};
exports.usePurchaseOrderRelatedDocuments = usePurchaseOrderRelatedDocuments;
