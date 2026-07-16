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
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var sales_models_1 = require("../../sales.models");
var SalesRFQForm = function (_a) {
    var _b, _c;
    var initialValues = _a.initialValues;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _d = (0, react_2.useState)({
        id: initialValues.customerId,
        customerContactId: initialValues.customerContactId,
        customerLocationId: initialValues.customerLocationId
    }), customer = _d[0], setCustomer = _d[1];
    var isEditing = initialValues.id !== undefined;
    var isCustomer = permissions.is("customer");
    var routeData = (0, hooks_1.useRouteData)(initialValues.id ? path_1.path.to.salesRfq(initialValues.id) : "");
    var isLocked = (0, sales_models_1.isSalesRfqLocked)((_b = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _b === void 0 ? void 0 : _b.status);
    var isDraft = ["Draft", "Ready to Quote"].includes((_c = initialValues.status) !== null && _c !== void 0 ? _c : "");
    var onCustomerChange = function (newValue) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data_1, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!carbon) {
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Carbon client not found"], ["Carbon client not found"]))));
                        return [2 /*return*/];
                    }
                    if (!(newValue === null || newValue === void 0 ? void 0 : newValue.value)) return [3 /*break*/, 2];
                    (0, react_dom_1.flushSync)(function () {
                        setCustomer({
                            id: newValue === null || newValue === void 0 ? void 0 : newValue.value,
                            customerContactId: undefined,
                            customerLocationId: undefined
                        });
                    });
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("customer").select("salesContactId, customerShipping!customerId(shippingCustomerLocationId)").eq("id", newValue.value).single())];
                case 1:
                    _a = _b.sent(), data_1 = _a.data, error = _a.error;
                    if (error) {
                        react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Error fetching customer data"], ["Error fetching customer data"]))));
                    }
                    else {
                        setCustomer(function (prev) {
                            var _a, _b, _c;
                            return (__assign(__assign({}, prev), { customerContactId: (_a = data_1.salesContactId) !== null && _a !== void 0 ? _a : undefined, customerLocationId: (_c = (_b = data_1.customerShipping) === null || _b === void 0 ? void 0 : _b.shippingCustomerLocationId) !== null && _c !== void 0 ? _c : undefined }));
                        });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    setCustomer({
                        id: undefined,
                        customerContactId: undefined,
                        customerLocationId: undefined
                    });
                    _b.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (<react_1.Card>
      <form_1.ValidatedForm method="post" validator={sales_models_1.salesRfqValidator} defaultValues={initialValues} isDisabled={isEditing && isLocked}>
        <react_1.CardHeader>
          <react_1.CardTitle>
            {isEditing ? <macro_1.Trans>RFQ</macro_1.Trans> : <macro_1.Trans>New RFQ</macro_1.Trans>}
          </react_1.CardTitle>
          {!isEditing && (<react_1.CardDescription>
              <macro_1.Trans>
                A sales request for quote (RFQ) is a customer inquiry for
                pricing on a set of parts and quantities. It may result in a
                quote.
              </macro_1.Trans>
            </react_1.CardDescription>)}
        </react_1.CardHeader>
        <react_1.CardContent>
          {isEditing && <Form_1.Hidden name="rfqId"/>}
          <react_1.VStack>
            <div className={(0, react_1.cn)("grid w-full gap-x-8 gap-y-4", isEditing
            ? "grid-cols-1 lg:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2")}>
              {!isEditing && (<Form_1.SequenceOrCustomId name="rfqId" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["RFQ ID"], ["RFQ ID"])))} placeholder={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Next Sequence"], ["Next Sequence"])))} table="salesRfq"/>)}
              <Form_1.Customer autoFocus={!isEditing} name="customerId" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Customer"], ["Customer"])))} onChange={onCustomerChange}/>
              <Form_1.Input name="customerReference" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Customer RFQ"], ["Customer RFQ"])))}/>
              <Form_1.CustomerContact name="customerContactId" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Purchasing Contact"], ["Purchasing Contact"])))} customer={customer.id} value={customer.customerContactId}/>
              <Form_1.CustomerContact name="customerEngineeringContactId" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Engineering Contact"], ["Engineering Contact"])))} customer={customer.id}/>
              <Form_1.CustomerLocation name="customerLocationId" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Customer Location"], ["Customer Location"])))} customer={customer.id} value={customer.customerLocationId}/>
              <Form_1.DatePicker name="rfqDate" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["RFQ Date"], ["RFQ Date"])))} isDisabled={isCustomer}/>
              <Form_1.DatePicker name="expirationDate" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Due Date"], ["Due Date"])))} isDisabled={isCustomer}/>
              <Form_1.Location name="locationId" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["RFQ Location"], ["RFQ Location"])))}/>
              <Form_1.Employee name="salesPersonId" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Sales Person"], ["Sales Person"])))}/>
              <Form_1.CustomFormFields table="salesRfq"/>
            </div>
          </react_1.VStack>
        </react_1.CardContent>
        <react_1.CardFooter>
          <Form_1.Submit isDisabled={!isDraft ||
            (isEditing
                ? !permissions.can("update", "sales")
                : !permissions.can("create", "sales"))}>
            <macro_1.Trans>Save</macro_1.Trans>
          </Form_1.Submit>
        </react_1.CardFooter>
      </form_1.ValidatedForm>
    </react_1.Card>);
};
exports.default = SalesRFQForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13;
