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
exports.default = PurchasingSettingsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var CompanyDefaultAttachmentsCard_1 = require("~/components/CompanyDefaultAttachmentsCard");
var Form_1 = require("~/components/Form");
var Country_1 = require("~/components/Form/Country");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Purchasing"], ["Purchasing"]))),
    to: path_1.path.to.purchasingSettings
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, _d, companySettings, apBillingAddress, defaultAttachmentsResult, _e, _f;
        var _g;
        var request = _b.request;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "settings"
                    })];
                case 1:
                    _c = _h.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, Promise.all([
                            (0, settings_1.getCompanySettings)(client, companyId),
                            (0, settings_1.getAccountsPayableBillingAddress)(client, companyId),
                            client.storage
                                .from("private")
                                .list("".concat(companyId, "/default-attachments/company"))
                        ])];
                case 2:
                    _d = _h.sent(), companySettings = _d[0], apBillingAddress = _d[1], defaultAttachmentsResult = _d[2];
                    if (!companySettings.error) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.settings];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(companySettings.error, "Failed to get company settings"))];
                case 3: throw _e.apply(void 0, _f.concat([_h.sent()]));
                case 4: return [2 /*return*/, {
                        companySettings: companySettings.data,
                        apBillingAddress: apBillingAddress.data,
                        defaultAttachments: (_g = defaultAttachmentsResult.data) !== null && _g !== void 0 ? _g : []
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, formData, intent, _d, apToggleEnabled, apToggleResult, validation, result, updateLeadTimesOnReceipt, updateLeadTimesResult, showSupplierReadableId, showSupplierReadableIdResult, supplierQuoteValidation, supplierQuoteResult, apBillingValidation, apBillingResult, defaultSupplierCcValidation, defaultSupplierCcResult;
        var _e, _f;
        var request = _b.request;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "settings"
                    })];
                case 1:
                    _c = _g.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _g.sent();
                    intent = formData.get("intent");
                    _d = intent;
                    switch (_d) {
                        case "accountsPayableAddressToggle": return [3 /*break*/, 3];
                        case "purchasePriceUpdateTiming": return [3 /*break*/, 5];
                        case "updateLeadTimesOnReceipt": return [3 /*break*/, 8];
                        case "showSupplierReadableIdToggle": return [3 /*break*/, 10];
                        case "supplierQuoteNotification": return [3 /*break*/, 12];
                        case "accountsPayableBillingAddress": return [3 /*break*/, 15];
                        case "emails": return [3 /*break*/, 18];
                    }
                    return [3 /*break*/, 21];
                case 3:
                    apToggleEnabled = formData.get("enabled") === "true";
                    return [4 /*yield*/, (0, settings_1.updateAccountsPayableAddressSetting)(client, companyId, apToggleEnabled)];
                case 4:
                    apToggleResult = _g.sent();
                    if (apToggleResult.error) {
                        console.error("Failed to update accounts payable address toggle:", apToggleResult.error);
                        return [2 /*return*/, {
                                success: false,
                                message: apToggleResult.error.message
                            }];
                    }
                    return [2 /*return*/, {
                            success: true,
                            message: "Accounts payable billing address ".concat(apToggleEnabled ? "enabled" : "disabled")
                        }];
                case 5: return [4 /*yield*/, (0, form_1.validator)(settings_1.purchasePriceUpdateTimingValidator).validate(formData)];
                case 6:
                    validation = _g.sent();
                    if (validation.error) {
                        return [2 /*return*/, { success: false, message: "Invalid form data" }];
                    }
                    return [4 /*yield*/, (0, settings_1.updatePurchasePriceUpdateTimingSetting)(client, companyId, validation.data.purchasePriceUpdateTiming)];
                case 7:
                    result = _g.sent();
                    if (result.error) {
                        console.error("Failed to update purchase price timing setting:", result.error);
                        return [2 /*return*/, {
                                success: false,
                                message: result.error.message
                            }];
                    }
                    return [2 /*return*/, {
                            success: true,
                            message: "Purchase price update timing updated"
                        }];
                case 8:
                    updateLeadTimesOnReceipt = formData.get("enabled") === "true";
                    return [4 /*yield*/, (0, settings_1.updateLeadTimesOnReceiptSetting)(client, companyId, updateLeadTimesOnReceipt)];
                case 9:
                    updateLeadTimesResult = _g.sent();
                    if (updateLeadTimesResult.error) {
                        console.error("Failed to update lead-time-on-receipt setting:", updateLeadTimesResult.error);
                        return [2 /*return*/, {
                                success: false,
                                message: updateLeadTimesResult.error.message
                            }];
                    }
                    return [2 /*return*/, {
                            success: true,
                            message: "Lead time updates on receipt ".concat(updateLeadTimesOnReceipt ? "enabled" : "disabled")
                        }];
                case 10:
                    showSupplierReadableId = formData.get("enabled") === "true";
                    return [4 /*yield*/, (0, settings_1.updateShowSupplierReadableIdSetting)(client, companyId, showSupplierReadableId)];
                case 11:
                    showSupplierReadableIdResult = _g.sent();
                    if (showSupplierReadableIdResult.error) {
                        console.error("Failed to update supplier ID visibility setting:", showSupplierReadableIdResult.error);
                        return [2 /*return*/, {
                                success: false,
                                message: showSupplierReadableIdResult.error.message
                            }];
                    }
                    return [2 /*return*/, {
                            success: true,
                            message: "Supplier IDs ".concat(showSupplierReadableId ? "shown" : "hidden")
                        }];
                case 12: return [4 /*yield*/, (0, form_1.validator)(settings_1.supplierQuoteNotificationValidator).validate(formData)];
                case 13:
                    supplierQuoteValidation = _g.sent();
                    if (supplierQuoteValidation.error) {
                        return [2 /*return*/, { success: false, message: "Invalid form data" }];
                    }
                    return [4 /*yield*/, (0, settings_1.updateSupplierQuoteNotificationSetting)(client, companyId, (_e = supplierQuoteValidation.data.supplierQuoteNotificationGroup) !== null && _e !== void 0 ? _e : [])];
                case 14:
                    supplierQuoteResult = _g.sent();
                    if (supplierQuoteResult.error) {
                        console.error("Failed to update supplier quote notification setting:", supplierQuoteResult.error);
                        return [2 /*return*/, {
                                success: false,
                                message: supplierQuoteResult.error.message
                            }];
                    }
                    return [2 /*return*/, {
                            success: true,
                            message: "Supplier quote notification setting updated"
                        }];
                case 15: return [4 /*yield*/, (0, form_1.validator)(settings_1.accountsPayableBillingAddressValidator).validate(formData)];
                case 16:
                    apBillingValidation = _g.sent();
                    if (apBillingValidation.error) {
                        return [2 /*return*/, { success: false, message: "Invalid form data" }];
                    }
                    return [4 /*yield*/, (0, settings_1.updateAccountsPayableBillingAddress)(client, companyId, apBillingValidation.data, userId)];
                case 17:
                    apBillingResult = _g.sent();
                    if (apBillingResult.error) {
                        console.error("Failed to update accounts payable billing address:", apBillingResult.error);
                        return [2 /*return*/, {
                                success: false,
                                message: apBillingResult.error.message
                            }];
                    }
                    return [2 /*return*/, {
                            success: true,
                            message: "Accounts payable billing address updated"
                        }];
                case 18: return [4 /*yield*/, (0, form_1.validator)(settings_1.defaultSupplierCcValidator).validate(formData)];
                case 19:
                    defaultSupplierCcValidation = _g.sent();
                    if (defaultSupplierCcValidation.error) {
                        return [2 /*return*/, { success: false, message: "Invalid form data" }];
                    }
                    return [4 /*yield*/, (0, settings_1.updateDefaultSupplierCc)(client, companyId, (_f = defaultSupplierCcValidation.data.defaultSupplierCc) !== null && _f !== void 0 ? _f : [])];
                case 20:
                    defaultSupplierCcResult = _g.sent();
                    if (defaultSupplierCcResult.error) {
                        console.error("Failed to update default supplier CC:", defaultSupplierCcResult.error);
                        return [2 /*return*/, {
                                success: false,
                                message: defaultSupplierCcResult.error.message
                            }];
                    }
                    return [2 /*return*/, {
                            success: true,
                            message: "Supplier email settings updated"
                        }];
                case 21: return [2 /*return*/, { success: false, message: "Unknown intent" }];
            }
        });
    });
}
function PurchasingSettingsRoute() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
    var t = (0, macro_2.useLingui)().t;
    var _0 = (0, react_router_1.useLoaderData)(), companySettings = _0.companySettings, apBillingAddress = _0.apBillingAddress, defaultAttachments = _0.defaultAttachments;
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a, _b, _c, _d;
        if (((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) === true && ((_b = fetcher === null || fetcher === void 0 ? void 0 : fetcher.data) === null || _b === void 0 ? void 0 : _b.message)) {
            react_1.toast.success(fetcher.data.message);
        }
        if (((_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.success) === false && ((_d = fetcher === null || fetcher === void 0 ? void 0 : fetcher.data) === null || _d === void 0 ? void 0 : _d.message)) {
            react_1.toast.error(fetcher.data.message);
        }
    }, [(_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.message, (_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success]);
    var toggleFetcher = (0, react_router_1.useFetcher)();
    var _1 = (0, react_2.useState)((_c = companySettings.accountsPayableAddress) !== null && _c !== void 0 ? _c : false), apAddressEnabled = _1[0], setApAddressEnabled = _1[1];
    var _2 = (0, react_2.useState)((_d = companySettings
        .updateLeadTimesOnReceipt) !== null && _d !== void 0 ? _d : false), leadTimesOnReceiptEnabled = _2[0], setLeadTimesOnReceiptEnabled = _2[1];
    var _3 = (0, react_2.useState)((_e = companySettings.showSupplierReadableId) !== null && _e !== void 0 ? _e : false), showSupplierReadableIdEnabled = _3[0], setShowSupplierReadableIdEnabled = _3[1];
    var handleShowSupplierReadableIdToggle = (0, react_2.useCallback)(function (checked) {
        setShowSupplierReadableIdEnabled(checked);
        toggleFetcher.submit({ intent: "showSupplierReadableIdToggle", enabled: checked.toString() }, { method: "POST" });
    }, [toggleFetcher]);
    var handleApAddressToggle = (0, react_2.useCallback)(function (checked) {
        setApAddressEnabled(checked);
        toggleFetcher.submit({ intent: "accountsPayableAddressToggle", enabled: checked.toString() }, { method: "POST" });
    }, [toggleFetcher]);
    var handleLeadTimesOnReceiptToggle = (0, react_2.useCallback)(function (checked) {
        setLeadTimesOnReceiptEnabled(checked);
        toggleFetcher.submit({
            intent: "updateLeadTimesOnReceipt",
            enabled: checked.toString()
        }, { method: "POST" });
    }, [toggleFetcher]);
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
          <macro_2.Trans>Purchasing</macro_2.Trans>
        </react_1.Heading>

        <p className="mt-4 text-xxs text-foreground/70 uppercase font-light tracking-wide">
          <macro_2.Trans>Documents</macro_2.Trans>
        </p>

        <CompanyDefaultAttachmentsCard_1.default files={(defaultAttachments !== null && defaultAttachments !== void 0 ? defaultAttachments : [])}/>
        <react_1.Card>
          <form_1.ValidatedForm method="post" validator={settings_1.defaultSupplierCcValidator} defaultValues={{
            defaultSupplierCc: (_h = companySettings.defaultSupplierCc) !== null && _h !== void 0 ? _h : []
        }} fetcher={fetcher}>
            <input type="hidden" name="intent" value="emails"/>
            <react_1.CardHeader>
              <react_1.CardTitle>
                <macro_2.Trans>Emails</macro_2.Trans>
              </react_1.CardTitle>
              <react_1.CardDescription>
                <macro_2.Trans>
                  These email addresses will be automatically CC'd on all emails
                  sent to suppliers (quotes, purchase orders, etc.).
                </macro_2.Trans>
              </react_1.CardDescription>
            </react_1.CardHeader>
            <react_1.CardContent>
              <div className="flex flex-col gap-8 max-w-[400px]">
                <Form_1.EmailRecipients name="defaultSupplierCc" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Default CC Recipients"], ["Default CC Recipients"])))}/>
              </div>
            </react_1.CardContent>
            <react_1.CardFooter>
              <form_1.Submit isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle" &&
            ((_j = fetcher.formData) === null || _j === void 0 ? void 0 : _j.get("intent")) === "defaultSupplierCc"}>
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
                    Route all AP invoices to one address (e.g. corporate
                    headquarters) instead of individual purchasers.
                  </macro_2.Trans>
                </react_1.CardDescription>
              </div>
              <react_1.Switch checked={apAddressEnabled} onCheckedChange={handleApAddressToggle} disabled={toggleFetcher.state !== "idle"}/>
            </react_1.HStack>
          </react_1.CardHeader>
        </react_1.Card>
        {apAddressEnabled && (<react_1.Card>
            <form_1.ValidatedForm method="post" validator={settings_1.accountsPayableBillingAddressValidator} defaultValues={{
                name: (_k = apBillingAddress === null || apBillingAddress === void 0 ? void 0 : apBillingAddress.name) !== null && _k !== void 0 ? _k : "",
                addressLine1: (_l = apBillingAddress === null || apBillingAddress === void 0 ? void 0 : apBillingAddress.addressLine1) !== null && _l !== void 0 ? _l : "",
                addressLine2: (_m = apBillingAddress === null || apBillingAddress === void 0 ? void 0 : apBillingAddress.addressLine2) !== null && _m !== void 0 ? _m : "",
                city: (_o = apBillingAddress === null || apBillingAddress === void 0 ? void 0 : apBillingAddress.city) !== null && _o !== void 0 ? _o : "",
                state: (_p = apBillingAddress === null || apBillingAddress === void 0 ? void 0 : apBillingAddress.state) !== null && _p !== void 0 ? _p : "",
                postalCode: (_q = apBillingAddress === null || apBillingAddress === void 0 ? void 0 : apBillingAddress.postalCode) !== null && _q !== void 0 ? _q : "",
                countryCode: (_r = apBillingAddress === null || apBillingAddress === void 0 ? void 0 : apBillingAddress.countryCode) !== null && _r !== void 0 ? _r : "",
                phone: (_s = apBillingAddress === null || apBillingAddress === void 0 ? void 0 : apBillingAddress.phone) !== null && _s !== void 0 ? _s : "",
                fax: (_t = apBillingAddress === null || apBillingAddress === void 0 ? void 0 : apBillingAddress.fax) !== null && _t !== void 0 ? _t : "",
                email: (_u = apBillingAddress === null || apBillingAddress === void 0 ? void 0 : apBillingAddress.email) !== null && _u !== void 0 ? _u : ""
            }} fetcher={fetcher}>
              <input type="hidden" name="intent" value="accountsPayableBillingAddress"/>
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
                    "accountsPayableBillingAddress"}>
                  <macro_2.Trans>Save</macro_2.Trans>
                </form_1.Submit>
              </react_1.CardFooter>
            </form_1.ValidatedForm>
          </react_1.Card>)}

        <p className="mt-4 text-xxs text-foreground/70 uppercase font-light tracking-wide">
          <macro_2.Trans>Automatic Updates</macro_2.Trans>
        </p>

        <react_1.Card>
          <form_1.ValidatedForm method="post" validator={settings_1.purchasePriceUpdateTimingValidator} defaultValues={{
            purchasePriceUpdateTiming: (_w = companySettings.purchasePriceUpdateTiming) !== null && _w !== void 0 ? _w : "Purchase Invoice Post"
        }} fetcher={fetcher}>
            <input type="hidden" name="intent" value="purchasePriceUpdateTiming"/>
            <react_1.CardHeader>
              <react_1.CardTitle>
                <macro_2.Trans>Automatic Cost Updates</macro_2.Trans>
              </react_1.CardTitle>
              <react_1.CardDescription>
                <macro_2.Trans>
                  Configure when purchased item costs should be updated from
                  supplier transactions.
                </macro_2.Trans>
              </react_1.CardDescription>
            </react_1.CardHeader>
            <react_1.CardContent>
              <div className="flex flex-col gap-8 max-w-[400px]">
                <form_1.Select name="purchasePriceUpdateTiming" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Update costs on"], ["Update costs on"])))} options={settings_1.purchasePriceUpdateTimingTypes.map(function (type) { return ({
            label: type,
            value: type
        }); })}/>
              </div>
            </react_1.CardContent>
            <react_1.CardFooter>
              <form_1.Submit isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle" &&
            ((_x = fetcher.formData) === null || _x === void 0 ? void 0 : _x.get("intent")) ===
                "purchasePriceUpdateTiming"}>
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
                  <macro_2.Trans>Automatic Lead Time Updates</macro_2.Trans>
                </react_1.CardTitle>
                <react_1.CardDescription>
                  <macro_2.Trans>
                    Update part lead times from posted purchase receipts.
                  </macro_2.Trans>
                </react_1.CardDescription>
              </div>
              <react_1.Switch checked={leadTimesOnReceiptEnabled} onCheckedChange={handleLeadTimesOnReceiptToggle} disabled={toggleFetcher.state !== "idle"}/>
            </react_1.HStack>
          </react_1.CardHeader>
        </react_1.Card>
        <p className="mt-4 text-xxs text-foreground/70 uppercase font-light tracking-wide">
          <macro_2.Trans>Suppliers</macro_2.Trans>
        </p>

        <react_1.Card>
          <react_1.CardHeader>
            <react_1.HStack className="justify-between items-center">
              <div>
                <react_1.CardTitle>
                  <macro_2.Trans>Show Supplier IDs</macro_2.Trans>
                </react_1.CardTitle>
                <react_1.CardDescription>
                  <macro_2.Trans>
                    Show a readable Supplier ID column on the supplier list,
                    supplier forms, and dropdowns. Suppliers are still
                    identified internally either way.
                  </macro_2.Trans>
                </react_1.CardDescription>
              </div>
              <react_1.Switch checked={showSupplierReadableIdEnabled} onCheckedChange={handleShowSupplierReadableIdToggle} disabled={toggleFetcher.state !== "idle"}/>
            </react_1.HStack>
          </react_1.CardHeader>
        </react_1.Card>

        <p className="mt-4 text-xxs text-foreground/70 uppercase font-light tracking-wide">
          <macro_2.Trans>Notifications</macro_2.Trans>
        </p>

        <react_1.Card>
          <form_1.ValidatedForm method="post" validator={settings_1.supplierQuoteNotificationValidator} defaultValues={{
            supplierQuoteNotificationGroup: (_y = companySettings.supplierQuoteNotificationGroup) !== null && _y !== void 0 ? _y : []
        }} fetcher={fetcher}>
            <input type="hidden" name="intent" value="supplierQuoteNotification"/>
            <react_1.CardHeader>
              <react_1.CardTitle>
                <macro_2.Trans>Supplier Quote Notifications</macro_2.Trans>
              </react_1.CardTitle>
              <react_1.CardDescription>
                <macro_2.Trans>
                  Configure who should receive notifications when a supplier
                  submits a quote.
                </macro_2.Trans>
              </react_1.CardDescription>
            </react_1.CardHeader>
            <react_1.CardContent>
              <div className="flex flex-col gap-8 max-w-[400px]">
                <div className="flex flex-col gap-2">
                  <react_1.Label>
                    <macro_2.Trans>Notifications</macro_2.Trans>
                  </react_1.Label>
                  <Form_1.Users name="supplierQuoteNotificationGroup" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Who should receive notifications when a supplier quote is submitted?"], ["Who should receive notifications when a supplier quote is submitted?"])))} type="employee"/>
                </div>
              </div>
            </react_1.CardContent>
            <react_1.CardFooter>
              <form_1.Submit isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle" &&
            ((_z = fetcher.formData) === null || _z === void 0 ? void 0 : _z.get("intent")) ===
                "supplierQuoteNotification"}>
                <macro_2.Trans>Save</macro_2.Trans>
              </form_1.Submit>
            </react_1.CardFooter>
          </form_1.ValidatedForm>
        </react_1.Card>
      </react_1.VStack>
    </react_1.ScrollArea>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13;
