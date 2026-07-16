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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var useIntegrations_1 = require("~/hooks/useIntegrations");
var path_1 = require("~/utils/path");
var sales_models_1 = require("../../sales.models");
var sales_service_1 = require("../../sales.service");
var QuotationFinalizeModal = function (_a) {
    var _b, _c;
    var quote = _a.quote, onClose = _a.onClose, fetcher = _a.fetcher, shipment = _a.shipment, _d = _a.defaultCc, defaultCc = _d === void 0 ? [] : _d, pricing = _a.pricing;
    var t = (0, macro_1.useLingui)().t;
    var quoteId = (0, react_router_1.useParams)().quoteId;
    if (!quoteId)
        throw new Error("quoteId not found");
    var integrations = (0, useIntegrations_1.useIntegrations)();
    var canEmail = integrations.has("email");
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _e = (0, react_2.useState)(true), loading = _e[0], setLoading = _e[1];
    var _f = (0, react_2.useState)([]), lines = _f[0], setLines = _f[1];
    var _g = (0, react_2.useState)([]), prices = _g[0], setPrices = _g[1];
    var fetchQuoteData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, lines, prices;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/];
                    return [4 /*yield*/, Promise.all([
                            (0, sales_service_1.getQuoteLines)(carbon, quoteId),
                            (0, sales_service_1.getQuoteLinePricesByQuoteId)(carbon, quoteId)
                        ])];
                case 1:
                    _a = _d.sent(), lines = _a[0], prices = _a[1];
                    setLines((_b = lines.data) !== null && _b !== void 0 ? _b : []);
                    setPrices((_c = prices.data) !== null && _c !== void 0 ? _c : []);
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useMount)(function () {
        fetchQuoteData();
    });
    var _h = (0, react_2.useState)(canEmail ? "Email" : "Download"), notificationType = _h[0], setNotificationType = _h[1];
    var linesMissingQuoteLinePrices = lines
        .filter(function (line) {
        if (!line.quantity || !Array.isArray(line.quantity))
            return false;
        return line.quantity.some(function (qty) {
            return !prices.some(function (price) { return price.quoteLineId === line.id && price.quantity === qty; });
        });
    })
        .map(function (line) { return line.itemReadableId; })
        .filter(function (id) { return id !== undefined; });
    var linesWithZeroPriceOrLeadTime = prices
        .filter(function (price) { return price.unitPrice === 0 || price.leadTime === 0; })
        .map(function (price) {
        var line = lines.find(function (line) { return line.id === price.quoteLineId; });
        return line === null || line === void 0 ? void 0 : line.itemReadableId;
    })
        .filter(function (id) { return id !== undefined; });
    var warningLineReadableIds = __spreadArray([], new Set(__spreadArray(__spreadArray([], linesMissingQuoteLinePrices, true), linesWithZeroPriceOrLeadTime, true)), true);
    var hasShippingCost = (shipment === null || shipment === void 0 ? void 0 : shipment.shippingCost) && shipment.shippingCost > 0;
    var allLinesHaveShippingCosts = lines.every(function (line) {
        var linePrices = prices.filter(function (price) { return price.quoteLineId === line.id; });
        return linePrices.every(function (price) { return price.shippingCost && price.shippingCost > 0; });
    });
    var showShippingWarning = !hasShippingCost && !allLinesHaveShippingCosts;
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open) {
                onClose();
            }
        }}>
      <react_1.ModalContent>
        <form_1.ValidatedForm method="post" validator={sales_models_1.quoteFinalizeValidator} action={path_1.path.to.quoteFinalize(quoteId)} onSuccess={onClose} defaultValues={{
            notification: notificationType,
            customerContact: (_b = quote === null || quote === void 0 ? void 0 : quote.customerContactId) !== null && _b !== void 0 ? _b : undefined,
            cc: defaultCc
        }} fetcher={fetcher}>
          <react_1.ModalHeader>
            <react_1.ModalTitle>{"Finalize ".concat(quote === null || quote === void 0 ? void 0 : quote.quoteId)}</react_1.ModalTitle>
            <react_1.ModalDescription>
              <macro_1.Trans>Are you sure you want to finalize the quote?</macro_1.Trans>
            </react_1.ModalDescription>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <react_1.VStack spacing={4}>
              {warningLineReadableIds.length > 0 && (<react_1.Alert variant="destructive">
                  <lu_1.LuTriangleAlert className="h-4 w-4"/>
                  <react_1.AlertTitle>
                    <macro_1.Trans>Lines need prices or lead times</macro_1.Trans>
                  </react_1.AlertTitle>
                  <react_1.AlertDescription>
                    The following line items are missing prices or lead times:
                    <ul className="list-disc py-2 pl-4">
                      {warningLineReadableIds.map(function (readableId) { return (<li key={readableId}>{readableId}</li>); })}
                    </ul>
                  </react_1.AlertDescription>
                </react_1.Alert>)}
              {showShippingWarning && (<react_1.Alert variant="destructive">
                  <lu_1.LuTriangleAlert className="h-4 w-4"/>
                  <react_1.AlertTitle>
                    <macro_1.Trans>Missing Shipping Costs</macro_1.Trans>
                  </react_1.AlertTitle>
                  <react_1.AlertDescription>
                    This quote has no shipping costs defined. Please add
                    shipping costs either at the quote level or for individual
                    line items.
                  </react_1.AlertDescription>
                </react_1.Alert>)}
              {canEmail && (<Form_1.SelectControlled label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Send Via"], ["Send Via"])))} name="notification" options={[
                {
                    label: "None",
                    value: "None"
                },
                {
                    label: "Email",
                    value: "Email"
                }
            ]} value={notificationType} onChange={function (t) {
                if (t)
                    setNotificationType(t.value);
            }}/>)}
              {notificationType === "Email" && (<>
                  <Form_1.CustomerContact name="customerContact" customer={(_c = quote === null || quote === void 0 ? void 0 : quote.customerId) !== null && _c !== void 0 ? _c : undefined}/>
                  <Form_1.EmailRecipients name="cc" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["CC"], ["CC"])))} type="employee"/>
                </>)}
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.Button variant="secondary" onClick={onClose}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <react_1.Button isDisabled={loading} type="submit">
              <macro_1.Trans>Finalize</macro_1.Trans>
            </react_1.Button>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
};
exports.default = QuotationFinalizeModal;
var templateObject_1, templateObject_2;
