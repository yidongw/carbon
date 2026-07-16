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
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var react_dropzone_1 = require("react-dropzone");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var Form_1 = require("~/components/Form");
var PaymentTerm_1 = require("~/components/Form/PaymentTerm");
var ShippingMethod_1 = require("~/components/Form/ShippingMethod");
var hooks_1 = require("~/hooks");
var useCurrencyFormatter_1 = require("~/hooks/useCurrencyFormatter");
var useIntegrations_1 = require("~/hooks/useIntegrations");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var sales_models_1 = require("../../sales.models");
var OpportunityDocuments_1 = require("../Opportunity/OpportunityDocuments");
var QuoteToOrderDrawer = function (_a) {
    var _b;
    var isOpen = _a.isOpen, quote = _a.quote, lines = _a.lines, pricing = _a.pricing, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var _c = (0, react_2.useState)(0), step = _c[0], setStep = _c[1];
    var _d = (0, react_2.useState)({}), selectedLines = _d[0], setSelectedLines = _d[1];
    var _e = (0, react_2.useState)(""), poNumber = _e[0], setPoNumber = _e[1];
    var carbon = (0, auth_1.useCarbon)().carbon;
    var quoteId = (0, react_router_1.useParams)().quoteId;
    if (!quoteId)
        throw new Error("Could not find quoteId");
    var quoteData = (0, hooks_1.useRouteData)(path_1.path.to.quote(quoteId));
    var _f = (0, OpportunityDocuments_1.useOpportunityDocuments)({
        opportunityId: quoteData === null || quoteData === void 0 ? void 0 : quoteData.opportunity.id,
        type: "Quote",
        id: quoteId
    }), deleteAttachment = _f.deleteAttachment, getPath = _f.getPath, upload = _f.upload;
    var _g = (0, react_2.useState)(null), purchaseOrder = _g[0], setPurchaseOrder = _g[1];
    var _h = (0, react_2.useState)(false), uploading = _h[0], setUploading = _h[1];
    var onDrop = function (acceptedFiles) { return __awaiter(void 0, void 0, void 0, function () {
        var file_1, extractedPoNumber, purchaseOrderDocumentPath, error;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!carbon) {
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Carbon client not available"], ["Carbon client not available"]))));
                        return [2 /*return*/];
                    }
                    if (!purchaseOrder) return [3 /*break*/, 2];
                    return [4 /*yield*/, removePurchaseOrder()];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2:
                    if (!(acceptedFiles.length > 0)) return [3 /*break*/, 4];
                    (0, react_dom_1.flushSync)(function () {
                        setUploading(true);
                    });
                    file_1 = acceptedFiles[0];
                    if (file_1) {
                        upload([file_1]);
                        // Extract PO number from filename if it's a PDF
                        if (file_1.name.toLowerCase().endsWith(".pdf") && poNumber === "") {
                            extractedPoNumber = file_1.name.replace(/\.pdf$/i, "");
                            setPoNumber(extractedPoNumber);
                        }
                    }
                    purchaseOrderDocumentPath = getPath(file_1);
                    return [4 /*yield*/, carbon
                            .from("opportunity")
                            .update({
                            purchaseOrderDocumentPath: purchaseOrderDocumentPath
                        })
                            .eq("id", (_a = quoteData === null || quoteData === void 0 ? void 0 : quoteData.opportunity) === null || _a === void 0 ? void 0 : _a.id)];
                case 3:
                    error = (_b.sent()).error;
                    if (error) {
                        console.error("Error updating opportunity:", error);
                        react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to update opportunity with purchase order"], ["Failed to update opportunity with purchase order"]))));
                    }
                    else {
                        setTimeout(function () {
                            setPurchaseOrder(file_1);
                            setUploading(false);
                        }, 2000);
                        setStep(1);
                    }
                    _b.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var removePurchaseOrder = function () { return __awaiter(void 0, void 0, void 0, function () {
        var opportunityDelete;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!carbon) {
                        react_1.toast.error(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Failed to initialize Carbon client"], ["Failed to initialize Carbon client"]))));
                        return [2 /*return*/];
                    }
                    setUploading(true);
                    return [4 /*yield*/, Promise.all([
                            carbon
                                .from("opportunity")
                                .update({
                                purchaseOrderDocumentPath: null
                            })
                                .eq("id", quoteData === null || quoteData === void 0 ? void 0 : quoteData.opportunity.id),
                            // @ts-expect-error
                            deleteAttachment(purchaseOrder)
                        ])];
                case 1:
                    opportunityDelete = (_a.sent())[0];
                    if (opportunityDelete.error) {
                        react_1.toast.error(t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Failed to remove purchase order"], ["Failed to remove purchase order"]))));
                    }
                    else {
                        setPurchaseOrder(null);
                        setPoNumber("");
                        react_1.toast.success(t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Purchase order removed successfully"], ["Purchase order removed successfully"]))));
                    }
                    setUploading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var _j = (0, react_dropzone_1.useDropzone)({
        onDrop: onDrop,
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
        disabled: uploading
    }), getRootProps = _j.getRootProps, getInputProps = _j.getInputProps, isDragActive = _j.isDragActive;
    var titles = [
        "Upload Customer Purchase Order",
        "Select Quantities",
        "Confirm Details"
    ];
    var hasPdf = purchaseOrder && (0, shared_1.getDocumentType)(purchaseOrder.name) === "PDF";
    var renderStep = function () {
        switch (step) {
            case 0:
                return (<react_1.VStack spacing={4}>
            <div {...getRootProps()} className={(0, react_1.cn)("w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer", isDragActive ? "border-primary" : "border-muted")}>
              <input {...getInputProps()}/>
              {uploading ? (<react_1.Spinner className="w-8 h-8"/>) : purchaseOrder ? (<p>{purchaseOrder.name}</p>) : (<p>
                  Drag and drop a Purchase Order PDF here, or click to select a
                  file
                </p>)}
              <lu_1.LuUpload className="mx-auto mt-4 h-12 w-12 text-muted-foreground"/>
            </div>

            <react_1.VStack spacing={2} className="w-full">
              <react_1.Label htmlFor="poNumber">Purchase Order Number</react_1.Label>
              <react_1.Input id="poNumber" value={poNumber} onChange={function (e) { return setPoNumber(e.target.value); }} placeholder={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Enter PO number"], ["Enter PO number"])))}/>
              {purchaseOrder && (<react_1.Button className="w-full" leftIcon={<lu_1.LuTrash />} size="lg" isDisabled={uploading} isLoading={uploading} variant="secondary" onClick={removePurchaseOrder}>
                  Remove
                </react_1.Button>)}
            </react_1.VStack>

            {!purchaseOrder && (<react_1.Button className="w-full" leftIcon={<lu_1.LuBan />} size="lg" variant="secondary" onClick={function () { return setStep(1); }}>
                Skip
              </react_1.Button>)}
          </react_1.VStack>);
            case 1:
                return (<react_1.HStack className="h-full w-full">
            {hasPdf ? (<iframe seamless title={getPath(purchaseOrder)} width="100%" height="100%" src={path_1.path.to.file.previewFile("private/".concat(getPath(purchaseOrder)))}/>) : purchaseOrder &&
                        (0, shared_1.getDocumentType)(purchaseOrder.name) === "Image" ? (<iframe seamless title={getPath(purchaseOrder)} width="100%" height="100%" src={path_1.path.to.file.previewImage("private", getPath(purchaseOrder))}/>) : null}
            <react_1.ScrollArea className="h-[calc(100dvh-145px)] flex-grow w-full">
              <LinePricingForm quote={quote} lines={lines} pricing={pricing} setSelectedLines={setSelectedLines}/>
            </react_1.ScrollArea>
          </react_1.HStack>);
            case 2:
                return (<react_1.VStack spacing={4}>
            <CustomerDetailsForm poNumber={poNumber}/>
            <PaymentDetailsForm />
            <ShippingDetailsForm />
            <NotificationOptionsForm quote={quote}/>
          </react_1.VStack>);
            default:
                return null;
        }
    };
    var navigation = (0, react_router_1.useNavigation)();
    var isSubmitting = navigation.state !== "idle";
    var isNextButtonDisabled = step === 1 && Object.keys(selectedLines).length === 0;
    return (<react_1.Drawer open={isOpen} onOpenChange={function (open) {
            if (!open) {
                onClose();
            }
        }}>
      <react_1.DrawerContent size={step === 1 ? (hasPdf ? "full" : "xl") : "md"}>
        <input type="hidden" name="quoteId" value={quote.id}/>

        <react_1.DrawerHeader>
          <react_1.DrawerTitle>{titles[step]}</react_1.DrawerTitle>
        </react_1.DrawerHeader>
        {step === 2 ? (<form_1.ValidatedForm method="post" action={path_1.path.to.convertQuoteToOrder(quote.id)} validator={sales_models_1.salesConfirmValidator} defaultValues={{
                notification: "None",
                customerContact: (_b = quote.customerContactId) !== null && _b !== void 0 ? _b : undefined,
                cc: []
            }}>
            <react_1.DrawerBody>{renderStep()}</react_1.DrawerBody>
            <react_1.DrawerFooter>
              <react_1.Button variant="secondary" onClick={function () { return setStep(step - 1); }}>
                Back
              </react_1.Button>
              <react_1.Button type="submit" isDisabled={isSubmitting} isLoading={isSubmitting}>
                <macro_1.Trans>Convert</macro_1.Trans>
              </react_1.Button>
              <input type="hidden" name="selectedLines" value={JSON.stringify(selectedLines)}/>
              <input type="hidden" name="poNumber" value={poNumber}/>
            </react_1.DrawerFooter>
          </form_1.ValidatedForm>) : (<>
            <react_1.DrawerBody>{renderStep()}</react_1.DrawerBody>
            <react_1.DrawerFooter>
              {step > 0 && (<react_1.Button variant="secondary" onClick={function () { return setStep(step - 1); }}>
                  Back
                </react_1.Button>)}
              <react_1.Button onClick={function () { return setStep(step + 1); }} isDisabled={isNextButtonDisabled}>
                Next
              </react_1.Button>
            </react_1.DrawerFooter>
          </>)}
      </react_1.DrawerContent>
    </react_1.Drawer>);
};
exports.default = QuoteToOrderDrawer;
var LinePricingForm = function (_a) {
    var _b, _c, _d;
    var quote = _a.quote, lines = _a.lines, pricing = _a.pricing, setSelectedLines = _a.setSelectedLines;
    var pricingByLine = (0, react_2.useMemo)(function () {
        return lines.reduce(function (acc, line) {
            acc[line.id] = pricing.filter(function (p) { return p.quoteLineId === line.id; });
            return acc;
        }, {});
    }, [lines, pricing]);
    var company = (0, hooks_1.useUser)().company;
    var baseCurrency = (_b = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _b !== void 0 ? _b : "USD";
    var quoteCurrency = (_c = quote.currencyCode) !== null && _c !== void 0 ? _c : baseCurrency;
    var shouldConvertCurrency = quoteCurrency !== baseCurrency;
    var quoteExchangeRate = (_d = quote.exchangeRate) !== null && _d !== void 0 ? _d : 1;
    var formatter = (0, useCurrencyFormatter_1.useCurrencyFormatter)({
        currency: quoteCurrency
    });
    return (<react_1.VStack spacing={8}>
      {lines.map(function (line) { return (<react_1.VStack key={line.id}>
          <react_1.HStack spacing={2} className="items-start">
            {line.thumbnailPath ? (<img alt={line.itemReadableId} className="w-24 h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg" src={(0, path_1.getPrivateUrl)(line.thumbnailPath)}/>) : (<div className="w-24 h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg p-4">
                <lu_1.LuImage className="w-16 h-16 text-muted-foreground"/>
              </div>)}

            <react_1.VStack spacing={0}>
              <react_1.Heading>{line.itemReadableId}</react_1.Heading>
              <span className="text-muted-foreground text-base truncate">
                {line.description}
              </span>
            </react_1.VStack>
          </react_1.HStack>
          <LinePricingOptions line={line} options={pricingByLine[line.id]} quoteCurrency={quoteCurrency} shouldConvertCurrency={shouldConvertCurrency} quoteExchangeRate={quoteExchangeRate} formatter={formatter} setSelectedLines={setSelectedLines}/>
        </react_1.VStack>); })}
    </react_1.VStack>);
};
var LinePricingOptions = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j;
    var line = _a.line, options = _a.options, quoteCurrency = _a.quoteCurrency, shouldConvertCurrency = _a.shouldConvertCurrency, quoteExchangeRate = _a.quoteExchangeRate, formatter = _a.formatter, setSelectedLines = _a.setSelectedLines;
    var _k = (0, react_2.useState)(""), selectedValue = _k[0], setSelectedValue = _k[1];
    var _l = (0, react_2.useState)(false), showOverride = _l[0], setShowOverride = _l[1];
    var _m = (0, react_2.useState)({
        quantity: 1,
        leadTime: 0,
        addOn: 0,
        convertedAddOn: 0,
        netUnitPrice: 0,
        convertedNetUnitPrice: 0,
        shippingCost: 0,
        convertedShippingCost: 0
    }), overridePricing = _m[0], setOverridePricing = _m[1];
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (selectedValue === "custom") {
            setSelectedLines(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[line.id] = {
                    quantity: overridePricing.quantity,
                    netUnitPrice: overridePricing.netUnitPrice,
                    convertedNetUnitPrice: overridePricing.convertedNetUnitPrice,
                    addOn: overridePricing.addOn,
                    convertedAddOn: overridePricing.convertedAddOn,
                    shippingCost: overridePricing.shippingCost,
                    convertedShippingCost: overridePricing.convertedShippingCost,
                    leadTime: overridePricing.leadTime
                }, _a)));
            });
        }
    }, [
        line.id,
        overridePricing,
        selectedValue,
        setSelectedLines,
        quoteExchangeRate
    ]);
    var additionalChargesByQuantity = (_c = (_b = line.quantity) === null || _b === void 0 ? void 0 : _b.reduce(function (acc, quantity) {
        var _a;
        var charges = Object.values((_a = line.additionalCharges) !== null && _a !== void 0 ? _a : {}).reduce(function (chargeAcc, charge) {
            var _a;
            var amount = (_a = charge.amounts) === null || _a === void 0 ? void 0 : _a[quantity];
            return chargeAcc + amount;
        }, 0);
        acc[quantity] = charges;
        return acc;
    }, {})) !== null && _c !== void 0 ? _c : {};
    var convertedAdditionalChargesByQuantity = Object.entries(additionalChargesByQuantity).reduce(function (acc, _a) {
        var quantity = _a[0], amount = _a[1];
        acc[Number(quantity)] = amount * quoteExchangeRate;
        return acc;
    }, {});
    var taxableAdditionalChargesByQuantity = (_e = (_d = line.quantity) === null || _d === void 0 ? void 0 : _d.reduce(function (acc, quantity) {
        var _a;
        var charges = Object.values((_a = line.additionalCharges) !== null && _a !== void 0 ? _a : {}).reduce(function (chargeAcc, charge) {
            var _a;
            if (charge.taxable === false)
                return chargeAcc;
            var amount = (_a = charge.amounts) === null || _a === void 0 ? void 0 : _a[quantity];
            return chargeAcc + amount;
        }, 0);
        acc[quantity] = charges;
        return acc;
    }, {})) !== null && _e !== void 0 ? _e : {};
    var convertedTaxableAdditionalChargesByQuantity = Object.entries(taxableAdditionalChargesByQuantity).reduce(function (acc, _a) {
        var quantity = _a[0], amount = _a[1];
        acc[Number(quantity)] = amount * quoteExchangeRate;
        return acc;
    }, {});
    // Sort options by quantity from least to greatest
    var sortedOptions = __spreadArray([], options, true).sort(function (a, b) { return a.quantity - b.quantity; });
    return (<react_1.VStack spacing={2}>
      <react_1.RadioGroup className="w-full" value={selectedValue} onValueChange={function (value) {
            var selectedOption = value === "custom"
                ? overridePricing
                : options.find(function (opt) { return opt.quantity.toString() === value; });
            if (selectedOption) {
                setSelectedLines(function (prev) {
                    var _a;
                    var _b, _c, _d, _e;
                    return (__assign(__assign({}, prev), (_a = {}, _a[line.id] = {
                        quantity: selectedOption.quantity,
                        netUnitPrice: (_b = selectedOption.netUnitPrice) !== null && _b !== void 0 ? _b : 0,
                        convertedNetUnitPrice: (_c = selectedOption.convertedNetUnitPrice) !== null && _c !== void 0 ? _c : 0,
                        addOn: additionalChargesByQuantity[selectedOption.quantity] || 0,
                        convertedAddOn: convertedAdditionalChargesByQuantity[selectedOption.quantity] || 0,
                        taxableAddOn: taxableAdditionalChargesByQuantity[selectedOption.quantity] ||
                            0,
                        convertedTaxableAddOn: convertedTaxableAdditionalChargesByQuantity[selectedOption.quantity] || 0,
                        shippingCost: (_d = selectedOption.shippingCost) !== null && _d !== void 0 ? _d : 0,
                        convertedShippingCost: (_e = selectedOption.convertedShippingCost) !== null && _e !== void 0 ? _e : 0,
                        leadTime: selectedOption.leadTime
                    }, _a)));
                });
                setSelectedValue(value);
            }
        }}>
        <react_1.Table>
          <react_1.Thead>
            <react_1.Tr>
              <react_1.Th></react_1.Th>
              <react_1.Th>
                <macro_1.Trans>Quantity</macro_1.Trans>
              </react_1.Th>
              <react_1.Th>
                <macro_1.Trans>Unit Price</macro_1.Trans>
              </react_1.Th>
              <react_1.Th>
                <macro_1.Trans>Shipping</macro_1.Trans>
              </react_1.Th>
              <react_1.Th>Add-Ons</react_1.Th>
              <react_1.Th>
                <macro_1.Trans>Lead Time</macro_1.Trans>
              </react_1.Th>
              <react_1.Th>
                <macro_1.Trans>Total Price</macro_1.Trans>
              </react_1.Th>
            </react_1.Tr>
          </react_1.Thead>
          <react_1.Tbody>
            {!Array.isArray(options) || options.length === 0 ? (<react_1.Tr>
                <react_1.Td colSpan={6} className="text-center py-8">
                  No pricing options found
                </react_1.Td>
              </react_1.Tr>) : (sortedOptions.map(function (option, index) {
            var _a, _b, _c, _d, _e;
            return ((_a = line === null || line === void 0 ? void 0 : line.quantity) === null || _a === void 0 ? void 0 : _a.includes(option.quantity)) && (<react_1.Tr key={index}>
                      <react_1.Td>
                        <react_1.RadioGroupItem value={option.quantity.toString()} id={"".concat(line.id, ":").concat(option.quantity.toString())}/>
                        <label htmlFor={"".concat(line.id, ":").concat(option.quantity.toString())} className="sr-only">
                          {option.quantity}
                        </label>
                      </react_1.Td>
                      <react_1.Td>{option.quantity}</react_1.Td>
                      <react_1.Td>
                        {formatter.format((_b = option.convertedNetUnitPrice) !== null && _b !== void 0 ? _b : 0)}
                      </react_1.Td>
                      <react_1.Td>
                        {formatter.format((_c = option.convertedShippingCost) !== null && _c !== void 0 ? _c : 0)}
                      </react_1.Td>
                      <react_1.Td>
                        {formatter.format(convertedAdditionalChargesByQuantity[option.quantity])}
                      </react_1.Td>
                      <react_1.Td>
                        {option.leadTime} {(0, utils_1.pluralize)(option.leadTime, "day")}
                      </react_1.Td>
                      <react_1.Td>
                        {formatter.format(((_d = option.convertedNetExtendedPrice) !== null && _d !== void 0 ? _d : 0) +
                    ((_e = option.convertedShippingCost) !== null && _e !== void 0 ? _e : 0) +
                    convertedAdditionalChargesByQuantity[option.quantity])}
                      </react_1.Td>
                    </react_1.Tr>);
        }))}
            {showOverride && (<react_1.Tr>
                <react_1.Td>
                  <react_1.RadioGroupItem value="custom" id={"".concat(line.id, ":custom")}/>
                  <label htmlFor={"".concat(line.id, ":custom")} className="sr-only"></label>
                </react_1.Td>
                <react_1.Td>
                  <react_1.NumberField className="w-[120px]" value={overridePricing.quantity} onChange={function (quantity) {
                return setOverridePricing(function (v) { return (__assign(__assign({}, v), { quantity: quantity })); });
            }}>
                    <react_1.NumberInput size="md" className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100"/>
                  </react_1.NumberField>
                </react_1.Td>
                <react_1.Td>
                  <react_1.NumberField className="w-[120px]" value={shouldConvertCurrency
                ? overridePricing.convertedNetUnitPrice
                : overridePricing.netUnitPrice} formatOptions={{
                style: "currency",
                currency: quoteCurrency
            }} onChange={function (netUnitPrice) {
                return setOverridePricing(function (v) { return (__assign(__assign({}, v), { netUnitPrice: shouldConvertCurrency
                        ? netUnitPrice / quoteExchangeRate
                        : netUnitPrice, convertedNetUnitPrice: shouldConvertCurrency
                        ? netUnitPrice
                        : netUnitPrice * quoteExchangeRate })); });
            }}>
                    <react_1.NumberInput size="md" className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100"/>
                  </react_1.NumberField>
                </react_1.Td>
                <react_1.Td>
                  <react_1.NumberField className="w-[120px]" value={shouldConvertCurrency
                ? overridePricing.convertedShippingCost
                : overridePricing.shippingCost} formatOptions={{
                style: "currency",
                currency: quoteCurrency
            }} onChange={function (shippingCost) {
                return setOverridePricing(function (v) { return (__assign(__assign({}, v), { shippingCost: shouldConvertCurrency
                        ? shippingCost / quoteExchangeRate
                        : shippingCost, convertedShippingCost: shouldConvertCurrency
                        ? shippingCost
                        : shippingCost * quoteExchangeRate })); });
            }}>
                    <react_1.NumberInput size="md" className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100"/>
                  </react_1.NumberField>
                </react_1.Td>
                <react_1.Td>
                  <react_1.NumberField className="w-[120px]" value={shouldConvertCurrency
                ? overridePricing.convertedAddOn
                : overridePricing.addOn} formatOptions={{
                style: "currency",
                currency: quoteCurrency
            }} onChange={function (addOn) {
                return setOverridePricing(function (v) { return (__assign(__assign({}, v), { addOn: shouldConvertCurrency
                        ? addOn / quoteExchangeRate
                        : addOn, convertedAddOn: shouldConvertCurrency
                        ? addOn
                        : addOn * quoteExchangeRate })); });
            }}>
                    <react_1.NumberInput size="md" className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100"/>
                  </react_1.NumberField>
                </react_1.Td>
                <react_1.Td>
                  <react_1.NumberField className="w-[120px]" formatOptions={{
                style: "unit",
                unit: "day",
                unitDisplay: "long"
            }} value={overridePricing.leadTime} onChange={function (leadTime) {
                return setOverridePricing(function (v) { return (__assign(__assign({}, v), { leadTime: leadTime })); });
            }}>
                    <react_1.NumberInput size="md" className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100"/>
                  </react_1.NumberField>
                </react_1.Td>
                <react_1.Td>
                  {formatter.format(shouldConvertCurrency
                ? overridePricing.convertedNetUnitPrice *
                    overridePricing.quantity +
                    ((_f = overridePricing.convertedShippingCost) !== null && _f !== void 0 ? _f : 0) +
                    ((_g = overridePricing.convertedAddOn) !== null && _g !== void 0 ? _g : 0)
                : overridePricing.netUnitPrice *
                    overridePricing.quantity +
                    ((_h = overridePricing.shippingCost) !== null && _h !== void 0 ? _h : 0) +
                    ((_j = overridePricing.addOn) !== null && _j !== void 0 ? _j : 0))}
                </react_1.Td>
              </react_1.Tr>)}
          </react_1.Tbody>
        </react_1.Table>
      </react_1.RadioGroup>
      {!showOverride && (<react_1.Button variant="secondary" onClick={function () {
                setShowOverride(true);
                setSelectedValue("custom");
            }}>
          Add Adjustment
        </react_1.Button>)}
    </react_1.VStack>);
};
function PaymentDetailsForm() {
    var _a, _b;
    var _c = (0, react_2.useState)(true), isExpanded = _c[0], setIsExpanded = _c[1];
    var quoteId = (0, react_router_1.useParams)().quoteId;
    if (!quoteId)
        throw new Error("Could not find quoteId");
    var quoteData = (0, hooks_1.useRouteData)(path_1.path.to.quote(quoteId));
    var paymentTerms = (0, PaymentTerm_1.usePaymentTerm)();
    var paymentTerm = paymentTerms === null || paymentTerms === void 0 ? void 0 : paymentTerms.find(function (pt) { var _a; return pt.value === ((_a = quoteData === null || quoteData === void 0 ? void 0 : quoteData.payment) === null || _a === void 0 ? void 0 : _a.paymentTermId); });
    return (<div className="border border-border rounded-md shadow-sm p-4 flex flex-col gap-4 w-full">
      <react_1.HStack className="w-full justify-between cursor-pointer" onClick={function () { return setIsExpanded(!isExpanded); }}>
        <react_1.HStack>
          <lu_1.LuCreditCard />
          <react_1.Label>
            <macro_1.Trans>Payment Terms</macro_1.Trans>
          </react_1.Label>
        </react_1.HStack>
        <lu_1.LuChevronDown className={"transition-transform ".concat(isExpanded ? "rotate-180" : "")}/>
      </react_1.HStack>
      {isExpanded && (<react_1.Table className="py-4">
          <react_1.Tbody>
            <react_1.Tr>
              <react_1.Td className="w-1/2">
                <macro_1.Trans>Bill To</macro_1.Trans>
              </react_1.Td>
              <react_1.Td>
                <components_1.CustomerAvatar customerId={(_a = quoteData === null || quoteData === void 0 ? void 0 : quoteData.payment.invoiceCustomerId) !== null && _a !== void 0 ? _a : null}/>
              </react_1.Td>
            </react_1.Tr>
            <react_1.Tr>
              <react_1.Td className="w-1/2">
                <macro_1.Trans>Payment Term</macro_1.Trans>
              </react_1.Td>
              <react_1.Td>
                <Enumerable_1.Enumerable value={(_b = paymentTerm === null || paymentTerm === void 0 ? void 0 : paymentTerm.label) !== null && _b !== void 0 ? _b : null}/>
              </react_1.Td>
            </react_1.Tr>
          </react_1.Tbody>
        </react_1.Table>)}
    </div>);
}
function CustomerDetailsForm(_a) {
    var _b;
    var poNumber = _a.poNumber;
    var _c = (0, react_2.useState)(true), isExpanded = _c[0], setIsExpanded = _c[1];
    var quoteId = (0, react_router_1.useParams)().quoteId;
    if (!quoteId)
        throw new Error("Could not find quoteId");
    var quoteData = (0, hooks_1.useRouteData)(path_1.path.to.quote(quoteId));
    return (<div className="border border-border rounded-md shadow-sm p-4 flex flex-col gap-4 w-full">
      <react_1.HStack className="w-full justify-between cursor-pointer" onClick={function () { return setIsExpanded(!isExpanded); }}>
        <react_1.HStack>
          <lu_1.LuSquareUser />
          <react_1.Label>
            <macro_1.Trans>Customer Details</macro_1.Trans>
          </react_1.Label>
        </react_1.HStack>
        <lu_1.LuChevronDown className={"transition-transform ".concat(isExpanded ? "rotate-180" : "")}/>
      </react_1.HStack>
      {isExpanded && (<react_1.Table className="py-4">
          <react_1.Tbody>
            <react_1.Tr>
              <react_1.Td className="w-1/2">
                <macro_1.Trans>Customer</macro_1.Trans>
              </react_1.Td>
              <react_1.Td>
                <components_1.CustomerAvatar customerId={(_b = quoteData === null || quoteData === void 0 ? void 0 : quoteData.quote.customerId) !== null && _b !== void 0 ? _b : null}/>
              </react_1.Td>
            </react_1.Tr>
            <react_1.Tr>
              <react_1.Td className="w-1/2">
                <macro_1.Trans>Customer RFQ</macro_1.Trans>
              </react_1.Td>
              <react_1.Td>{quoteData === null || quoteData === void 0 ? void 0 : quoteData.quote.customerReference}</react_1.Td>
            </react_1.Tr>
            {poNumber && (<react_1.Tr>
                <react_1.Td className="w-1/2">
                  <macro_1.Trans>Customer PO</macro_1.Trans>
                </react_1.Td>
                <react_1.Td>{poNumber}</react_1.Td>
              </react_1.Tr>)}
          </react_1.Tbody>
        </react_1.Table>)}
    </div>);
}
function ShippingDetailsForm() {
    var _a, _b;
    var _c = (0, react_2.useState)(true), isExpanded = _c[0], setIsExpanded = _c[1];
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var quoteId = (0, react_router_1.useParams)().quoteId;
    if (!quoteId)
        throw new Error("Could not find quoteId");
    var quoteData = (0, hooks_1.useRouteData)(path_1.path.to.quote(quoteId));
    var shippingMethods = (0, ShippingMethod_1.useShippingMethod)();
    var shippingMethod = shippingMethods === null || shippingMethods === void 0 ? void 0 : shippingMethods.find(function (sm) { var _a; return sm.value === ((_a = quoteData === null || quoteData === void 0 ? void 0 : quoteData.shipment) === null || _a === void 0 ? void 0 : _a.shippingMethodId); });
    return (<div className="border border-border rounded-md shadow-sm p-4 flex flex-col gap-4 w-full">
      <react_1.HStack className="w-full justify-between cursor-pointer" onClick={function () { return setIsExpanded(!isExpanded); }}>
        <react_1.HStack>
          <lu_1.LuTruck />
          <react_1.Label>
            <macro_1.Trans>Shipping</macro_1.Trans>
          </react_1.Label>
        </react_1.HStack>
        <lu_1.LuChevronDown className={"transition-transform ".concat(isExpanded ? "rotate-180" : "")}/>
      </react_1.HStack>
      {isExpanded && (<react_1.Table className="py-4">
          <react_1.Tbody>
            <react_1.Tr>
              <react_1.Td className="w-1/2">
                <macro_1.Trans>Shipping Method</macro_1.Trans>
              </react_1.Td>
              <react_1.Td className="w-1/2">
                <Enumerable_1.Enumerable value={(_a = shippingMethod === null || shippingMethod === void 0 ? void 0 : shippingMethod.label) !== null && _a !== void 0 ? _a : null}/>
              </react_1.Td>
            </react_1.Tr>
            <react_1.Tr>
              <react_1.Td>
                <macro_1.Trans>Requested Date</macro_1.Trans>
              </react_1.Td>
              <react_1.Td>
                {(quoteData === null || quoteData === void 0 ? void 0 : quoteData.shipment.receiptRequestedDate)
                ? formatDate((_b = quoteData === null || quoteData === void 0 ? void 0 : quoteData.shipment) === null || _b === void 0 ? void 0 : _b.receiptRequestedDate)
                : null}
              </react_1.Td>
            </react_1.Tr>
          </react_1.Tbody>
        </react_1.Table>)}
    </div>);
}
function NotificationOptionsForm(_a) {
    var _b;
    var quote = _a.quote;
    var t = (0, macro_1.useLingui)().t;
    var _c = (0, react_2.useState)(true), isExpanded = _c[0], setIsExpanded = _c[1];
    var integrations = (0, useIntegrations_1.useIntegrations)();
    var canEmail = integrations.has("email");
    var _d = (0, react_2.useState)(canEmail ? "Email" : "None"), notificationType = _d[0], setNotificationType = _d[1];
    if (!canEmail)
        return null;
    return (<div className="border border-border rounded-md shadow-sm p-4 flex flex-col gap-4 w-full">
      <react_1.HStack className="w-full justify-between cursor-pointer" onClick={function () { return setIsExpanded(!isExpanded); }}>
        <react_1.HStack>
          <lu_1.LuBell />
          <react_1.Label>
            <macro_1.Trans>Notification</macro_1.Trans>
          </react_1.Label>
        </react_1.HStack>
        <lu_1.LuChevronDown className={"transition-transform ".concat(isExpanded ? "rotate-180" : "")}/>
      </react_1.HStack>
      {isExpanded && (<react_1.VStack spacing={4}>
          <form_1.SelectControlled label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Send Via"], ["Send Via"])))} name="notification" options={[
                { label: "None", value: "None" },
                { label: "Email", value: "Email" }
            ]} value={notificationType} onChange={function (t) {
                if (t)
                    setNotificationType(t.value);
            }}/>
          {notificationType === "Email" && (<>
              <Form_1.CustomerContact name="customerContact" customer={(_b = quote.customerId) !== null && _b !== void 0 ? _b : undefined}/>
              <Form_1.EmailRecipients name="cc" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["CC"], ["CC"])))} type="employee"/>
            </>)}
        </react_1.VStack>)}
    </div>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
