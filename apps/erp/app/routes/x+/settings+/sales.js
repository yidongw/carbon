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
exports.action = action;
exports.default = SalesSettingsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var Country_1 = require("~/components/Form/Country");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Sales"], ["Sales"]))),
    to: path_1.path.to.salesSettings
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, _d, companySettings, arBillingAddress, _e, _f;
        var request = _b.request;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "settings"
                    })];
                case 1:
                    _c = _g.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, Promise.all([
                            (0, settings_1.getCompanySettings)(client, companyId),
                            (0, settings_1.getAccountsReceivableBillingAddress)(client, companyId)
                        ])];
                case 2:
                    _d = _g.sent(), companySettings = _d[0], arBillingAddress = _d[1];
                    if (!!companySettings.data) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.settings];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(companySettings.error, "Failed to get company settings"))];
                case 3: throw _e.apply(void 0, _f.concat([_g.sent()]));
                case 4: return [2 /*return*/, {
                        companySettings: companySettings.data,
                        arBillingAddress: arBillingAddress.data
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, formData, intent, _d, arToggleEnabled, arToggleResult, showCustomerReadableId, showCustomerReadableIdResult, validation, digitalQuote, rfqValidation, rfqSettings, categoryMarkupsValidation, categoryMarkupsResult, arBillingValidation, arBillingResult, defaultCustomerCcValidation, defaultCustomerCcResult;
        var _e, _f, _g;
        var request = _b.request;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "settings"
                    })];
                case 1:
                    _c = _h.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _h.sent();
                    intent = formData.get("intent");
                    _d = intent;
                    switch (_d) {
                        case "accountsReceivableAddressToggle": return [3 /*break*/, 3];
                        case "showCustomerReadableIdToggle": return [3 /*break*/, 5];
                        case "digitalQuote": return [3 /*break*/, 7];
                        case "rfq": return [3 /*break*/, 10];
                        case "categoryMarkups": return [3 /*break*/, 13];
                        case "accountsReceivableBillingAddress": return [3 /*break*/, 16];
                        case "emails": return [3 /*break*/, 19];
                    }
                    return [3 /*break*/, 22];
                case 3:
                    arToggleEnabled = formData.get("enabled") === "true";
                    return [4 /*yield*/, (0, settings_1.updateAccountsReceivableAddressSetting)(client, companyId, arToggleEnabled)];
                case 4:
                    arToggleResult = _h.sent();
                    if (arToggleResult.error) {
                        return [2 /*return*/, { success: false, message: arToggleResult.error.message }];
                    }
                    return [2 /*return*/, {
                            success: true,
                            message: "Accounts receivable billing address ".concat(arToggleEnabled ? "enabled" : "disabled")
                        }];
                case 5:
                    showCustomerReadableId = formData.get("enabled") === "true";
                    return [4 /*yield*/, (0, settings_1.updateShowCustomerReadableIdSetting)(client, companyId, showCustomerReadableId)];
                case 6:
                    showCustomerReadableIdResult = _h.sent();
                    if (showCustomerReadableIdResult.error) {
                        return [2 /*return*/, {
                                success: false,
                                message: showCustomerReadableIdResult.error.message
                            }];
                    }
                    return [2 /*return*/, {
                            success: true,
                            message: "Customer IDs ".concat(showCustomerReadableId ? "shown" : "hidden")
                        }];
                case 7: return [4 /*yield*/, (0, form_1.validator)(settings_1.digitalQuoteValidator).validate(formData)];
                case 8:
                    validation = _h.sent();
                    if (validation.error) {
                        return [2 /*return*/, { success: false, message: "Invalid form data" }];
                    }
                    return [4 /*yield*/, (0, settings_1.updateDigitalQuoteSetting)(client, companyId, validation.data.digitalQuoteEnabled, (_e = validation.data.digitalQuoteNotificationGroup) !== null && _e !== void 0 ? _e : [], validation.data.digitalQuoteIncludesPurchaseOrders)];
                case 9:
                    digitalQuote = _h.sent();
                    if (digitalQuote.error)
                        return [2 /*return*/, { success: false, message: digitalQuote.error.message }];
                    return [2 /*return*/, { success: true, message: "Digital quote setting updated" }];
                case 10: return [4 /*yield*/, (0, form_1.validator)(settings_1.rfqReadyValidator).validate(formData)];
                case 11:
                    rfqValidation = _h.sent();
                    if (rfqValidation.error) {
                        return [2 /*return*/, { success: false, message: "Invalid form data" }];
                    }
                    return [4 /*yield*/, (0, settings_1.updateRfqReadySetting)(client, companyId, (_f = rfqValidation.data.rfqReadyNotificationGroup) !== null && _f !== void 0 ? _f : [])];
                case 12:
                    rfqSettings = _h.sent();
                    if (rfqSettings.error)
                        return [2 /*return*/, { success: false, message: rfqSettings.error.message }];
                    return [2 /*return*/, { success: true, message: "RFQ setting updated" }];
                case 13: return [4 /*yield*/, (0, form_1.validator)(settings_1.quoteLineCategoryMarkupsSettingsValidator).validate(formData)];
                case 14:
                    categoryMarkupsValidation = _h.sent();
                    if (categoryMarkupsValidation.error) {
                        return [2 /*return*/, { success: false, message: "Invalid form data" }];
                    }
                    return [4 /*yield*/, (0, settings_1.updateQuoteLineCategoryMarkups)(client, companyId, categoryMarkupsValidation.data)];
                case 15:
                    categoryMarkupsResult = _h.sent();
                    if (categoryMarkupsResult.error)
                        return [2 /*return*/, {
                                success: false,
                                message: categoryMarkupsResult.error.message
                            }];
                    return [2 /*return*/, {
                            success: true,
                            message: "Default category markups updated"
                        }];
                case 16: return [4 /*yield*/, (0, form_1.validator)(settings_1.accountsReceivableBillingAddressValidator).validate(formData)];
                case 17:
                    arBillingValidation = _h.sent();
                    if (arBillingValidation.error) {
                        return [2 /*return*/, { success: false, message: "Invalid form data" }];
                    }
                    return [4 /*yield*/, (0, settings_1.updateAccountsReceivableBillingAddress)(client, companyId, arBillingValidation.data, userId)];
                case 18:
                    arBillingResult = _h.sent();
                    if (arBillingResult.error) {
                        return [2 /*return*/, { success: false, message: arBillingResult.error.message }];
                    }
                    return [2 /*return*/, {
                            success: true,
                            message: "Accounts receivable billing address updated"
                        }];
                case 19: return [4 /*yield*/, (0, form_1.validator)(settings_1.defaultCustomerCcValidator).validate(formData)];
                case 20:
                    defaultCustomerCcValidation = _h.sent();
                    if (defaultCustomerCcValidation.error) {
                        return [2 /*return*/, { success: false, message: "Invalid form data" }];
                    }
                    return [4 /*yield*/, (0, settings_1.updateDefaultCustomerCc)(client, companyId, (_g = defaultCustomerCcValidation.data.defaultCustomerCc) !== null && _g !== void 0 ? _g : [])];
                case 21:
                    defaultCustomerCcResult = _h.sent();
                    if (defaultCustomerCcResult.error) {
                        return [2 /*return*/, {
                                success: false,
                                message: defaultCustomerCcResult.error.message
                            }];
                    }
                    return [2 /*return*/, {
                            success: true,
                            message: "Customer email settings updated"
                        }];
                case 22: return [2 /*return*/, { success: false, message: "Unknown intent" }];
            }
        });
    });
}
function SalesSettingsRoute() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
    var t = (0, macro_2.useLingui)().t;
    var _2 = (0, react_router_1.useLoaderData)(), companySettings = _2.companySettings, arBillingAddress = _2.arBillingAddress;
    var fetcher = (0, react_router_1.useFetcher)();
    var toggleFetcher = (0, react_router_1.useFetcher)();
    var _3 = (0, react_2.useState)((_a = companySettings.accountsReceivableAddress) !== null && _a !== void 0 ? _a : false), arAddressEnabled = _3[0], setArAddressEnabled = _3[1];
    var handleArAddressToggle = (0, react_2.useCallback)(function (checked) {
        setArAddressEnabled(checked);
        toggleFetcher.submit({
            intent: "accountsReceivableAddressToggle",
            enabled: checked.toString()
        }, { method: "POST" });
    }, [toggleFetcher]);
    var _4 = (0, react_2.useState)((_b = companySettings.showCustomerReadableId) !== null && _b !== void 0 ? _b : false), showCustomerReadableIdEnabled = _4[0], setShowCustomerReadableIdEnabled = _4[1];
    var handleShowCustomerReadableIdToggle = (0, react_2.useCallback)(function (checked) {
        setShowCustomerReadableIdEnabled(checked);
        toggleFetcher.submit({ intent: "showCustomerReadableIdToggle", enabled: checked.toString() }, { method: "POST" });
    }, [toggleFetcher]);
    var _5 = (0, react_2.useState)((_c = companySettings.digitalQuoteEnabled) !== null && _c !== void 0 ? _c : false), digitalQuoteEnabled = _5[0], setDigitalQuoteEnabled = _5[1];
    (0, react_2.useEffect)(function () {
        var _a, _b, _c, _d;
        if (((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) === true && ((_b = fetcher === null || fetcher === void 0 ? void 0 : fetcher.data) === null || _b === void 0 ? void 0 : _b.message)) {
            react_1.toast.success(fetcher.data.message);
        }
        if (((_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.success) === false && ((_d = fetcher === null || fetcher === void 0 ? void 0 : fetcher.data) === null || _d === void 0 ? void 0 : _d.message)) {
            react_1.toast.error(fetcher.data.message);
        }
    }, [(_d = fetcher.data) === null || _d === void 0 ? void 0 : _d.message, (_e = fetcher.data) === null || _e === void 0 ? void 0 : _e.success]);
    (0, react_2.useEffect)(function () {
        var _a, _b, _c, _d;
        if (((_a = toggleFetcher.data) === null || _a === void 0 ? void 0 : _a.success) === true && ((_b = toggleFetcher === null || toggleFetcher === void 0 ? void 0 : toggleFetcher.data) === null || _b === void 0 ? void 0 : _b.message)) {
            react_1.toast.success(toggleFetcher.data.message);
        }
        if (((_c = toggleFetcher.data) === null || _c === void 0 ? void 0 : _c.success) === false && ((_d = toggleFetcher === null || toggleFetcher === void 0 ? void 0 : toggleFetcher.data) === null || _d === void 0 ? void 0 : _d.message)) {
            react_1.toast.error(toggleFetcher.data.message);
        }
    }, [(_f = toggleFetcher.data) === null || _f === void 0 ? void 0 : _f.message, (_g = toggleFetcher.data) === null || _g === void 0 ? void 0 : _g.success]);
    return (<react_1.ScrollArea className="w-full h-[calc(100dvh-49px)]">
      <react_1.VStack spacing={4} className="py-12 px-4 max-w-[60rem] h-full mx-auto gap-4">
        <react_1.Heading size="h3">
          <macro_2.Trans>Sales</macro_2.Trans>
        </react_1.Heading>

        <p className="mt-4 text-xxs text-foreground/70 uppercase font-light tracking-wide">
          <macro_2.Trans>Documents</macro_2.Trans>
        </p>

        <react_1.Card>
          <form_1.ValidatedForm method="post" validator={settings_1.defaultCustomerCcValidator} defaultValues={{
            defaultCustomerCc: (_h = companySettings.defaultCustomerCc) !== null && _h !== void 0 ? _h : []
        }} fetcher={fetcher}>
            <input type="hidden" name="intent" value="emails"/>
            <react_1.CardHeader>
              <react_1.CardTitle>
                <macro_2.Trans>Emails</macro_2.Trans>
              </react_1.CardTitle>
              <react_1.CardDescription>
                <macro_2.Trans>
                  These email addresses will be automatically CC'd on all quote
                  emails sent to customers.
                </macro_2.Trans>
              </react_1.CardDescription>
            </react_1.CardHeader>
            <react_1.CardContent>
              <div className="flex flex-col gap-8 max-w-[400px]">
                <Form_1.EmailRecipients name="defaultCustomerCc" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Default CC Recipients"], ["Default CC Recipients"])))}/>
              </div>
            </react_1.CardContent>
            <react_1.CardFooter>
              <form_1.Submit isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle" &&
            ((_j = fetcher.formData) === null || _j === void 0 ? void 0 : _j.get("intent")) === "defaultCustomerCc"}>
                <macro_2.Trans>Save</macro_2.Trans>
              </form_1.Submit>
            </react_1.CardFooter>
          </form_1.ValidatedForm>
        </react_1.Card>
        <react_1.Card>
          <react_1.CardHeader>
            <react_1.HStack className="justify-between items-center">
              <div>
                <react_1.CardTitle>
                  <macro_2.Trans>Centralized Billing Address</macro_2.Trans>
                </react_1.CardTitle>
                <react_1.CardDescription>
                  <macro_2.Trans>
                    Route all AR invoices to one address (e.g. corporate
                    headquarters) instead of individual locations.
                  </macro_2.Trans>
                </react_1.CardDescription>
              </div>
              <react_1.Switch checked={arAddressEnabled} onCheckedChange={handleArAddressToggle} disabled={toggleFetcher.state !== "idle"}/>
            </react_1.HStack>
          </react_1.CardHeader>
        </react_1.Card>
        {arAddressEnabled && (<react_1.Card>
            <form_1.ValidatedForm method="post" validator={settings_1.accountsReceivableBillingAddressValidator} defaultValues={{
                name: (_k = arBillingAddress === null || arBillingAddress === void 0 ? void 0 : arBillingAddress.name) !== null && _k !== void 0 ? _k : "",
                addressLine1: (_l = arBillingAddress === null || arBillingAddress === void 0 ? void 0 : arBillingAddress.addressLine1) !== null && _l !== void 0 ? _l : "",
                addressLine2: (_m = arBillingAddress === null || arBillingAddress === void 0 ? void 0 : arBillingAddress.addressLine2) !== null && _m !== void 0 ? _m : "",
                city: (_o = arBillingAddress === null || arBillingAddress === void 0 ? void 0 : arBillingAddress.city) !== null && _o !== void 0 ? _o : "",
                state: (_p = arBillingAddress === null || arBillingAddress === void 0 ? void 0 : arBillingAddress.state) !== null && _p !== void 0 ? _p : "",
                postalCode: (_q = arBillingAddress === null || arBillingAddress === void 0 ? void 0 : arBillingAddress.postalCode) !== null && _q !== void 0 ? _q : "",
                countryCode: (_r = arBillingAddress === null || arBillingAddress === void 0 ? void 0 : arBillingAddress.countryCode) !== null && _r !== void 0 ? _r : "",
                phone: (_s = arBillingAddress === null || arBillingAddress === void 0 ? void 0 : arBillingAddress.phone) !== null && _s !== void 0 ? _s : "",
                fax: (_t = arBillingAddress === null || arBillingAddress === void 0 ? void 0 : arBillingAddress.fax) !== null && _t !== void 0 ? _t : "",
                email: (_u = arBillingAddress === null || arBillingAddress === void 0 ? void 0 : arBillingAddress.email) !== null && _u !== void 0 ? _u : ""
            }} fetcher={fetcher}>
              <input type="hidden" name="intent" value="accountsReceivableBillingAddress"/>
              <react_1.CardHeader>
                <react_1.CardTitle>
                  <macro_2.Trans>Billing Address</macro_2.Trans>
                </react_1.CardTitle>
              </react_1.CardHeader>
              <react_1.CardContent>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <form_1.Input name="name" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Name"], ["Name"])))}/>
                  <form_1.Input name="email" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Email"], ["Email"])))}/>
                  <form_1.Input name="addressLine1" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Address Line 1"], ["Address Line 1"])))}/>
                  <form_1.Input name="addressLine2" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Address Line 2"], ["Address Line 2"])))}/>
                  <form_1.Input name="city" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["City"], ["City"])))}/>
                  <form_1.Input name="state" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["State / Province"], ["State / Province"])))}/>
                  <form_1.Input name="postalCode" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Postal Code"], ["Postal Code"])))}/>
                  <Country_1.default name="countryCode"/>
                  <form_1.PhoneInput name="phone" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Phone"], ["Phone"])))}/>
                  <form_1.PhoneInput name="fax" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Fax"], ["Fax"])))}/>
                </div>
              </react_1.CardContent>
              <react_1.CardFooter>
                <form_1.Submit isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle" &&
                ((_v = fetcher.formData) === null || _v === void 0 ? void 0 : _v.get("intent")) ===
                    "accountsReceivableBillingAddress"}>
                  <macro_2.Trans>Save</macro_2.Trans>
                </form_1.Submit>
              </react_1.CardFooter>
            </form_1.ValidatedForm>
          </react_1.Card>)}
        <p className="mt-4 text-xxs text-foreground/70 uppercase font-light tracking-wide">
          <macro_2.Trans>Customers</macro_2.Trans>
        </p>

        <react_1.Card>
          <react_1.CardHeader>
            <react_1.HStack className="justify-between items-center">
              <div>
                <react_1.CardTitle>
                  <macro_2.Trans>Show Customer IDs</macro_2.Trans>
                </react_1.CardTitle>
                <react_1.CardDescription>
                  <macro_2.Trans>
                    Show a readable Customer ID column on the customer list,
                    customer forms, and dropdowns. Customers are still
                    identified internally either way.
                  </macro_2.Trans>
                </react_1.CardDescription>
              </div>
              <react_1.Switch checked={showCustomerReadableIdEnabled} onCheckedChange={handleShowCustomerReadableIdToggle} disabled={toggleFetcher.state !== "idle"}/>
            </react_1.HStack>
          </react_1.CardHeader>
        </react_1.Card>

        <p className="mt-4 text-xxs text-foreground/70 uppercase font-light tracking-wide">
          <macro_2.Trans>Quoting</macro_2.Trans>
        </p>

        <react_1.Card>
          <form_1.ValidatedForm method="post" validator={settings_1.digitalQuoteValidator} defaultValues={{
            digitalQuoteEnabled: (_w = companySettings.digitalQuoteEnabled) !== null && _w !== void 0 ? _w : false,
            digitalQuoteNotificationGroup: (_x = companySettings.digitalQuoteNotificationGroup) !== null && _x !== void 0 ? _x : [],
            digitalQuoteIncludesPurchaseOrders: (_y = companySettings.digitalQuoteIncludesPurchaseOrders) !== null && _y !== void 0 ? _y : false
        }} fetcher={fetcher}>
            <input type="hidden" name="intent" value="digitalQuote"/>
            <react_1.CardHeader>
              <react_1.CardTitle className="flex items-center gap-2">
                <macro_2.Trans>Digital Quotes</macro_2.Trans>
              </react_1.CardTitle>
              <react_1.CardDescription>
                <macro_2.Trans>
                  Enable digital quotes for your company. This will allow you to
                  send digital quotes to your customers, and allow them to
                  accept them online.
                </macro_2.Trans>
              </react_1.CardDescription>
            </react_1.CardHeader>
            <react_1.CardContent>
              <div className="flex flex-col gap-8 max-w-[400px]">
                <div className="flex flex-col gap-2">
                  <form_1.Boolean name="digitalQuoteEnabled" description={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Digital Quotes Enabled"], ["Digital Quotes Enabled"])))} onChange={function (value) {
            setDigitalQuoteEnabled(value);
        }}/>
                  <form_1.Boolean name="digitalQuoteIncludesPurchaseOrders" description={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Include Purchase Orders"], ["Include Purchase Orders"])))} isDisabled={!digitalQuoteEnabled}/>
                </div>

                <div className="flex flex-col gap-2">
                  <react_1.Label>
                    <macro_2.Trans>Notifications</macro_2.Trans>
                  </react_1.Label>
                  <Form_1.Users name="digitalQuoteNotificationGroup" label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Who should receive notifications when a digital quote is accepted or expired?"], ["Who should receive notifications when a digital quote is accepted or expired?"])))} type="employee"/>
                </div>
              </div>
            </react_1.CardContent>
            <react_1.CardFooter>
              <form_1.Submit isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle" &&
            ((_z = fetcher.formData) === null || _z === void 0 ? void 0 : _z.get("intent")) === "digitalQuote"}>
                <macro_2.Trans>Save</macro_2.Trans>
              </form_1.Submit>
            </react_1.CardFooter>
          </form_1.ValidatedForm>
        </react_1.Card>
        <CategoryMarkupsCard companySettings={companySettings} fetcher={fetcher}/>

        <p className="mt-4 text-xxs text-foreground/70 uppercase font-light tracking-wide">
          <macro_2.Trans>Notifications</macro_2.Trans>
        </p>

        <react_1.Card>
          <form_1.ValidatedForm method="post" validator={settings_1.rfqReadyValidator} defaultValues={{
            rfqReadyNotificationGroup: (_0 = companySettings.rfqReadyNotificationGroup) !== null && _0 !== void 0 ? _0 : []
        }} fetcher={fetcher}>
            <input type="hidden" name="intent" value="rfq"/>
            <react_1.CardHeader>
              <react_1.CardTitle className="flex items-center gap-2">
                <macro_2.Trans>RFQ</macro_2.Trans>
              </react_1.CardTitle>
              <react_1.CardDescription>
                <macro_2.Trans>
                  Enable notifications when an RFQ is marked as ready for quote.
                </macro_2.Trans>
              </react_1.CardDescription>
            </react_1.CardHeader>
            <react_1.CardContent>
              <div className="flex flex-col gap-8 max-w-[400px]">
                <div className="flex flex-col gap-2">
                  <react_1.Label>
                    <macro_2.Trans>Notifications</macro_2.Trans>
                  </react_1.Label>
                  <Form_1.Users name="rfqReadyNotificationGroup" label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Who should receive notifications when a RFQ is marked ready for quote?"], ["Who should receive notifications when a RFQ is marked ready for quote?"])))} type="employee"/>
                </div>
              </div>
            </react_1.CardContent>
            <react_1.CardFooter>
              <form_1.Submit isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle" &&
            ((_1 = fetcher.formData) === null || _1 === void 0 ? void 0 : _1.get("intent")) === "rfq"}>
                <macro_2.Trans>Save</macro_2.Trans>
              </form_1.Submit>
            </react_1.CardFooter>
          </form_1.ValidatedForm>
        </react_1.Card>
      </react_1.VStack>
    </react_1.ScrollArea>);
}
var costCategoryKeys = [
    "materialCost",
    "partCost",
    "toolCost",
    "consumableCost",
    "laborCost",
    "machineCost",
    "overheadCost",
    "outsideCost"
];
var categoryLabels = {
    materialCost: {
        label: "Material",
        description: "Raw materials"
    },
    partCost: {
        label: "Part",
        description: "Made and purchased parts"
    },
    toolCost: {
        label: "Tool",
        description: "Jigs, fixtures, and other tools"
    },
    consumableCost: {
        label: "Consumable",
        description: "Consumables like lubricants, gloves, and other small items"
    },
    laborCost: {
        label: "Labor",
        description: "Service and labor costs"
    },
    machineCost: {
        label: "Machine",
        description: "Time the machine is running"
    },
    overheadCost: {
        label: "Overhead",
        description: "Administrative and other operational costs"
    },
    outsideCost: {
        label: "Outside",
        description: "Services performed by third parties"
    }
};
function CategoryMarkupsCard(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var companySettings = _a.companySettings, fetcher = _a.fetcher;
    var saved = companySettings
        .quoteLineCategoryMarkups;
    return (<react_1.Card>
      <form_1.ValidatedForm method="post" validator={settings_1.quoteLineCategoryMarkupsSettingsValidator} defaultValues={{
            materialCost: (_b = saved === null || saved === void 0 ? void 0 : saved.materialCost) !== null && _b !== void 0 ? _b : 0,
            partCost: (_c = saved === null || saved === void 0 ? void 0 : saved.partCost) !== null && _c !== void 0 ? _c : 0,
            toolCost: (_d = saved === null || saved === void 0 ? void 0 : saved.toolCost) !== null && _d !== void 0 ? _d : 0,
            consumableCost: (_e = saved === null || saved === void 0 ? void 0 : saved.consumableCost) !== null && _e !== void 0 ? _e : 0,
            laborCost: (_f = saved === null || saved === void 0 ? void 0 : saved.laborCost) !== null && _f !== void 0 ? _f : 0,
            machineCost: (_g = saved === null || saved === void 0 ? void 0 : saved.machineCost) !== null && _g !== void 0 ? _g : 0,
            overheadCost: (_h = saved === null || saved === void 0 ? void 0 : saved.overheadCost) !== null && _h !== void 0 ? _h : 0,
            outsideCost: (_j = saved === null || saved === void 0 ? void 0 : saved.outsideCost) !== null && _j !== void 0 ? _j : 0
        }} fetcher={fetcher}>
        <input type="hidden" name="intent" value="categoryMarkups"/>
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_2.Trans>Quote Markups</macro_2.Trans>
          </react_1.CardTitle>
          <react_1.CardDescription>
            <macro_2.Trans>
              Set default markup percentages for each cost category on new quote
              lines
            </macro_2.Trans>
          </react_1.CardDescription>
        </react_1.CardHeader>
        <react_1.CardContent>
          <react_1.VStack>
            {costCategoryKeys.map(function (key, index) { return (<react_1.HStack key={key} className={(0, react_1.cn)("justify-between items-center w-full", index !== costCategoryKeys.length - 1 &&
                "border-b border-border pb-4")}>
                <react_1.VStack spacing={0} className="flex flex-1">
                  <span className="text-sm font-medium">
                    {categoryLabels[key].label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {categoryLabels[key].description}
                  </span>
                </react_1.VStack>
                <div className="flex flex-shrink-0">
                  <form_1.Number name={key} label="" formatOptions={{
                style: "percent",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }} minValue={0}/>
                </div>
              </react_1.HStack>); })}
          </react_1.VStack>
        </react_1.CardContent>
        <react_1.CardFooter>
          <form_1.Submit isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle" &&
            ((_k = fetcher.formData) === null || _k === void 0 ? void 0 : _k.get("intent")) === "categoryMarkups"}>
            <macro_2.Trans>Save</macro_2.Trans>
          </form_1.Submit>
        </react_1.CardFooter>
      </form_1.ValidatedForm>
    </react_1.Card>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15;
