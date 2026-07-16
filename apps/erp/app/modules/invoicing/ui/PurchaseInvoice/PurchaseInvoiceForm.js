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
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var PaymentTerm_1 = require("~/components/Form/PaymentTerm");
var hooks_1 = require("~/hooks");
var invoicing_1 = require("~/modules/invoicing");
var path_1 = require("~/utils/path");
var invoicing_models_1 = require("../../invoicing.models");
var PurchaseInvoiceForm = function (_a) {
    var _b;
    var initialValues = _a.initialValues;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var supplierApprovalRequired = (0, hooks_1.useSupplierApprovalRequired)();
    var carbon = (0, auth_1.useCarbon)().carbon;
    var isEditing = initialValues.id !== undefined;
    var invoiceId = (0, react_router_1.useParams)().invoiceId;
    var routeData = (0, hooks_1.useRouteData)(invoiceId ? path_1.path.to.purchaseInvoice(invoiceId) : "");
    var isLocked = (0, invoicing_models_1.isPurchaseInvoiceLocked)((_b = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseInvoice) === null || _b === void 0 ? void 0 : _b.status);
    var _c = (0, react_2.useState)({
        id: initialValues.invoiceSupplierId,
        invoiceSupplierContactId: initialValues.invoiceSupplierContactId,
        invoiceSupplierLocationId: initialValues.invoiceSupplierLocationId,
        currencyCode: initialValues.currencyCode,
        paymentTermId: initialValues.paymentTermId
    }), invoiceSupplier = _c[0], setInvoiceSupplier = _c[1];
    var _d = (0, react_2.useState)({
        id: initialValues.supplierId
    }), supplier = _d[0], setSupplier = _d[1];
    var onSupplierChange = function (newValue) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setSupplier({ id: newValue === null || newValue === void 0 ? void 0 : newValue.value });
            if ((newValue === null || newValue === void 0 ? void 0 : newValue.value) !== invoiceSupplier.id) {
                onInvoiceSupplierChange(newValue);
            }
            return [2 /*return*/];
        });
    }); };
    var onInvoiceSupplierChange = function (newValue) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, supplierData_1, paymentTermData_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!carbon) {
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Carbon client not found"], ["Carbon client not found"]))));
                        return [2 /*return*/];
                    }
                    if (!(newValue === null || newValue === void 0 ? void 0 : newValue.value)) return [3 /*break*/, 2];
                    (0, react_dom_1.flushSync)(function () {
                        // update the supplier immediately
                        setInvoiceSupplier({
                            id: newValue === null || newValue === void 0 ? void 0 : newValue.value,
                            currencyCode: undefined,
                            paymentTermId: undefined,
                            invoiceSupplierContactId: undefined,
                            invoiceSupplierLocationId: undefined
                        });
                    });
                    return [4 /*yield*/, Promise.all([
                            carbon === null || carbon === void 0 ? void 0 : carbon.from("supplier").select("currencyCode, purchasingContactId, supplierShipping!supplierId(shippingSupplierLocationId)").eq("id", newValue.value).single(),
                            carbon === null || carbon === void 0 ? void 0 : carbon.from("supplierPayment").select("*").eq("supplierId", newValue.value).single()
                        ])];
                case 1:
                    _a = _b.sent(), supplierData_1 = _a[0], paymentTermData_1 = _a[1];
                    if (supplierData_1.error || paymentTermData_1.error) {
                        react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Error fetching supplier data"], ["Error fetching supplier data"]))));
                    }
                    else {
                        setInvoiceSupplier(function (prev) {
                            var _a, _b, _c, _d, _e, _f, _g;
                            return (__assign(__assign({}, prev), { id: newValue.value, invoiceSupplierContactId: (_b = (_a = paymentTermData_1.data.invoiceSupplierContactId) !== null && _a !== void 0 ? _a : supplierData_1.data.purchasingContactId) !== null && _b !== void 0 ? _b : undefined, invoiceSupplierLocationId: (_e = (_c = paymentTermData_1.data.invoiceSupplierLocationId) !== null && _c !== void 0 ? _c : (_d = supplierData_1.data.supplierShipping) === null || _d === void 0 ? void 0 : _d.shippingSupplierLocationId) !== null && _e !== void 0 ? _e : undefined, currencyCode: (_f = supplierData_1.data.currencyCode) !== null && _f !== void 0 ? _f : undefined, paymentTermId: (_g = paymentTermData_1.data.paymentTermId) !== null && _g !== void 0 ? _g : undefined }));
                        });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    setInvoiceSupplier({
                        id: undefined,
                        currencyCode: undefined,
                        paymentTermId: undefined,
                        invoiceSupplierContactId: undefined,
                        invoiceSupplierLocationId: undefined
                    });
                    _b.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (<form_1.ValidatedForm method="post" validator={invoicing_1.purchaseInvoiceValidator} defaultValues={initialValues} isDisabled={isEditing && isLocked}>
      <react_1.Card>
        <react_1.CardHeader>
          <react_1.CardTitle>
            {isEditing ? "Purchase Invoice" : "New Purchase Invoice"}
          </react_1.CardTitle>
          {!isEditing && (<react_1.CardDescription>
              <macro_1.Trans>
                A purchase invoice is a document that specifies the products or
                services purchased by a customer and the corresponding cost.
              </macro_1.Trans>
            </react_1.CardDescription>)}
        </react_1.CardHeader>
        <react_1.CardContent>
          <Form_1.Hidden name="id"/>
          {isEditing && <Form_1.Hidden name="invoiceId"/>}
          <react_1.VStack>
            <div className={(0, react_1.cn)("grid w-full gap-x-8 gap-y-4", isEditing
            ? "grid-cols-1 lg:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2")}>
              {!isEditing && (<Form_1.SequenceOrCustomId name="invoiceId" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Invoice ID"], ["Invoice ID"])))} table="purchaseInvoice"/>)}
              <Form_1.Supplier name="supplierId" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Supplier"], ["Supplier"])))} onChange={onSupplierChange} onlyApproved={supplierApprovalRequired}/>
              <Form_1.Input name="supplierReference" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Supplier Invoice Number"], ["Supplier Invoice Number"])))}/>

              <Form_1.Supplier name="invoiceSupplierId" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Invoice Supplier"], ["Invoice Supplier"])))} value={invoiceSupplier.id} onChange={onInvoiceSupplierChange} onlyApproved={supplierApprovalRequired}/>
              <Form_1.SupplierLocation name="invoiceSupplierLocationId" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Invoice Supplier Location"], ["Invoice Supplier Location"])))} supplier={supplier.id} value={invoiceSupplier.invoiceSupplierLocationId} onChange={function (newValue) {
            if (newValue === null || newValue === void 0 ? void 0 : newValue.id) {
                setInvoiceSupplier(function (prevSupplier) { return (__assign(__assign({}, prevSupplier), { invoiceSupplierLocationId: newValue.id })); });
            }
        }}/>
              <Form_1.SupplierContact name="invoiceSupplierContactId" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Invoice Supplier Contact"], ["Invoice Supplier Contact"])))} supplier={supplier.id} value={invoiceSupplier.invoiceSupplierContactId} onChange={function (newValue) {
            if (newValue === null || newValue === void 0 ? void 0 : newValue.id) {
                setInvoiceSupplier(function (prevSupplier) { return (__assign(__assign({}, prevSupplier), { invoiceSupplierContactId: newValue.id })); });
            }
        }}/>

              <Form_1.DatePicker name="dateDue" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Due Date"], ["Due Date"])))}/>
              <Form_1.DatePicker name="dateIssued" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Date Issued"], ["Date Issued"])))}/>

              <PaymentTerm_1.default name="paymentTermId" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Payment Terms"], ["Payment Terms"])))} value={invoiceSupplier === null || invoiceSupplier === void 0 ? void 0 : invoiceSupplier.paymentTermId} onChange={function (newValue) {
            if (newValue === null || newValue === void 0 ? void 0 : newValue.value) {
                setInvoiceSupplier(function (prevSupplier) { return (__assign(__assign({}, prevSupplier), { paymentTermId: newValue.value })); });
            }
        }}/>
              <Form_1.Currency name="currencyCode" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Currency"], ["Currency"])))} value={invoiceSupplier === null || invoiceSupplier === void 0 ? void 0 : invoiceSupplier.currencyCode} onChange={function (newValue) {
            if (newValue === null || newValue === void 0 ? void 0 : newValue.value) {
                setInvoiceSupplier(function (prevSupplier) { return (__assign(__assign({}, prevSupplier), { currencyCode: newValue.value })); });
            }
        }}/>
              <Form_1.Location name="locationId" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Delivery Location"], ["Delivery Location"])))}/>
              <Form_1.CustomFormFields table="purchaseInvoice"/>
            </div>
          </react_1.VStack>
        </react_1.CardContent>
        <react_1.CardFooter>
          <Form_1.Submit isDisabled={isEditing
            ? !permissions.can("update", "invoicing")
            : !permissions.can("create", "invoicing")}>
            <macro_1.Trans>Save</macro_1.Trans>
          </Form_1.Submit>
        </react_1.CardFooter>
      </react_1.Card>
    </form_1.ValidatedForm>);
};
exports.default = PurchaseInvoiceForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13;
