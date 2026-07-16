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
exports.default = AccountingSettingsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var accounting_1 = require("~/modules/accounting");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
var taxDepreciationSettingsValidator = zod_1.z.object({
    intent: zod_1.z.literal("assetTaxDepreciation"),
    assetTaxRate: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).max(100)),
    deferredTaxLiabilityAccountId: zod_1.z.string().min(1, {
        message: "Deferred tax liability account is required"
    }),
    deferredTaxExpenseAccountId: zod_1.z.string().min(1, {
        message: "Deferred tax expense account is required"
    })
});
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Accounting"], ["Accounting"]))),
    to: path_1.path.to.accountingSettings
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, _d, companySettings, accountDefaults, _e, _f;
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
                            (0, accounting_1.getDefaultAccounts)(client, companyId)
                        ])];
                case 2:
                    _d = _g.sent(), companySettings = _d[0], accountDefaults = _d[1];
                    if (!!companySettings.data) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.settings];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(companySettings.error, "Failed to get company settings"))];
                case 3: throw _e.apply(void 0, _f.concat([_g.sent()]));
                case 4: return [2 /*return*/, {
                        companySettings: companySettings.data,
                        accountDefaults: accountDefaults.data
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, formData, intent, enabled, update, enabled, update, validation, _d, assetTaxRate, deferredTaxLiabilityAccountId, deferredTaxExpenseAccountId, settingsUpdate, accountUpdate;
        var request = _b.request;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "settings"
                    })];
                case 1:
                    _c = _e.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _e.sent();
                    intent = formData.get("intent");
                    if (!(intent === "accountingEnabled")) return [3 /*break*/, 4];
                    enabled = formData.get("enabled") === "true";
                    return [4 /*yield*/, (0, settings_1.updateAccountingEnabledSetting)(client, companyId, enabled)];
                case 3:
                    update = _e.sent();
                    if (update.error)
                        return [2 /*return*/, { success: false, message: update.error.message }];
                    return [2 /*return*/, { success: true, message: "Accounting settings updated" }];
                case 4:
                    if (!(intent === "assetTaxDepreciationEnabled")) return [3 /*break*/, 6];
                    enabled = formData.get("enabled") === "true";
                    return [4 /*yield*/, (0, settings_1.updateAssetTaxDepreciationSettings)(client, companyId, {
                            assetTaxDepreciationEnabled: enabled,
                            assetTaxRate: null
                        })];
                case 5:
                    update = _e.sent();
                    if (update.error)
                        return [2 /*return*/, { success: false, message: update.error.message }];
                    return [2 /*return*/, { success: true, message: "Fixed asset settings updated" }];
                case 6:
                    if (!(intent === "assetTaxDepreciation")) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, form_1.validator)(taxDepreciationSettingsValidator).validate(formData)];
                case 7:
                    validation = _e.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, assetTaxRate = _d.assetTaxRate, deferredTaxLiabilityAccountId = _d.deferredTaxLiabilityAccountId, deferredTaxExpenseAccountId = _d.deferredTaxExpenseAccountId;
                    return [4 /*yield*/, (0, settings_1.updateAssetTaxDepreciationSettings)(client, companyId, { assetTaxDepreciationEnabled: true, assetTaxRate: assetTaxRate })];
                case 8:
                    settingsUpdate = _e.sent();
                    if (settingsUpdate.error)
                        return [2 /*return*/, { success: false, message: settingsUpdate.error.message }];
                    return [4 /*yield*/, client
                            .from("accountDefault")
                            .update({
                            deferredTaxLiabilityAccountId: deferredTaxLiabilityAccountId,
                            deferredTaxExpenseAccountId: deferredTaxExpenseAccountId,
                            updatedBy: userId
                        })
                            .eq("companyId", companyId)];
                case 9:
                    accountUpdate = _e.sent();
                    if (accountUpdate.error)
                        return [2 /*return*/, { success: false, message: accountUpdate.error.message }];
                    return [2 /*return*/, { success: true, message: "Fixed asset settings updated" }];
                case 10: return [2 /*return*/, { success: false, message: "Unknown intent" }];
            }
        });
    });
}
function AccountingSettingsRoute() {
    var _a, _b, _c, _d, _e;
    var _f = (0, react_router_1.useLoaderData)(), companySettings = _f.companySettings, accountDefaults = _f.accountDefaults;
    var fetcher = (0, react_router_1.useFetcher)();
    var taxFetcher = (0, react_router_1.useFetcher)();
    var isInternal = (0, hooks_1.useFlags)().isInternal;
    var taxEnabled = (_a = companySettings.assetTaxDepreciationEnabled) !== null && _a !== void 0 ? _a : false;
    (0, react_2.useEffect)(function () {
        if (fetcher.data && "success" in fetcher.data) {
            if (fetcher.data.success === true && fetcher.data.message) {
                react_1.toast.success(fetcher.data.message);
            }
            if (fetcher.data.success === false && fetcher.data.message) {
                react_1.toast.error(fetcher.data.message);
            }
        }
    }, [fetcher.data]);
    (0, react_2.useEffect)(function () {
        if (taxFetcher.data && "success" in taxFetcher.data) {
            if (taxFetcher.data.success === true && taxFetcher.data.message) {
                react_1.toast.success(taxFetcher.data.message);
            }
            if (taxFetcher.data.success === false && taxFetcher.data.message) {
                react_1.toast.error(taxFetcher.data.message);
            }
        }
    }, [taxFetcher.data]);
    var handleAccountingToggle = (0, react_2.useCallback)(function (checked) {
        fetcher.submit({ intent: "accountingEnabled", enabled: String(checked) }, { method: "POST" });
    }, [fetcher]);
    var handleTaxDepreciationToggle = (0, react_2.useCallback)(function (checked) {
        fetcher.submit({ intent: "assetTaxDepreciationEnabled", enabled: String(checked) }, { method: "POST" });
    }, [fetcher]);
    return (<react_1.ScrollArea className="w-full h-[calc(100dvh-49px)]">
      <react_1.VStack spacing={4} className="py-12 px-4 max-w-[60rem] h-full mx-auto gap-4">
        <react_1.Heading size="h3">
          <macro_2.Trans>Accounting</macro_2.Trans>
        </react_1.Heading>

        <react_1.Card>
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_2.Trans>General Ledger</macro_2.Trans>
            </react_1.CardTitle>
            <react_1.CardDescription>
              <macro_2.Trans>
                Enable full accrual accounting with journal entries, financial
                reports, and general ledger posting.
              </macro_2.Trans>
            </react_1.CardDescription>
          </react_1.CardHeader>
          <react_1.CardContent>
            <react_1.HStack className="justify-between items-center">
              <react_1.VStack className="items-start" spacing={1}>
                <react_1.HStack className="items-center gap-2">
                  <span className="font-medium">
                    {companySettings.accountingEnabled ? (<macro_2.Trans>Accounting is enabled</macro_2.Trans>) : (<macro_2.Trans>Accounting is disabled</macro_2.Trans>)}
                  </span>
                  <react_1.Badge variant="red">
                    <macro_2.Trans>Alpha</macro_2.Trans>
                  </react_1.Badge>
                </react_1.HStack>
                <span className="text-sm text-muted-foreground">
                  {companySettings.accountingEnabled ? (<macro_2.Trans>
                      Transactions will create journal entries and update the
                      general ledger.
                    </macro_2.Trans>) : (<macro_2.Trans>
                      Enable to automatically post transactions to the general
                      ledger.
                    </macro_2.Trans>)}
                </span>
              </react_1.VStack>
              <react_1.Switch checked={(_b = companySettings.accountingEnabled) !== null && _b !== void 0 ? _b : false} onCheckedChange={handleAccountingToggle} disabled={!isInternal}/>
            </react_1.HStack>
          </react_1.CardContent>
        </react_1.Card>

        <form_1.ValidatedForm className="w-full" validator={taxDepreciationSettingsValidator} method="post" fetcher={taxFetcher} defaultValues={{
            intent: "assetTaxDepreciation",
            assetTaxRate: parseFloat((_c = companySettings.assetTaxRate) !== null && _c !== void 0 ? _c : "0"),
            deferredTaxLiabilityAccountId: (_d = accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.deferredTaxLiabilityAccountId) !== null && _d !== void 0 ? _d : "",
            deferredTaxExpenseAccountId: (_e = accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.deferredTaxExpenseAccountId) !== null && _e !== void 0 ? _e : ""
        }}>
          <react_1.Card>
            <react_1.CardHeader>
              <react_1.CardTitle>
                <macro_2.Trans>Fixed Assets</macro_2.Trans>
              </react_1.CardTitle>
              <react_1.CardDescription>
                <macro_2.Trans>
                  Track tax depreciation separately from book depreciation and
                  automatically post deferred tax liability entries.
                </macro_2.Trans>
              </react_1.CardDescription>
            </react_1.CardHeader>
            <react_1.CardContent>
              <react_1.VStack spacing={4}>
                <react_1.HStack className="w-full justify-between items-center">
                  <react_1.VStack className="items-start" spacing={1}>
                    <span className="font-medium">
                      <macro_2.Trans>Track tax depreciation separately</macro_2.Trans>
                    </span>
                    <span className="text-sm text-muted-foreground">
                      <macro_2.Trans>
                        Enable to configure tax-specific depreciation methods on
                        asset classes (e.g., MACRS, accelerated).
                      </macro_2.Trans>
                    </span>
                  </react_1.VStack>
                  <react_1.Switch checked={taxEnabled} onCheckedChange={handleTaxDepreciationToggle}/>
                </react_1.HStack>
                {taxEnabled && (<react_1.VStack spacing={4} className="pt-4 border-t">
                    <Form_1.Hidden name="intent" value="assetTaxDepreciation"/>
                    <Form_1.Number name="assetTaxRate" label="Tax Rate (%)" minValue={0} maxValue={100}/>
                    <Form_1.Account name="deferredTaxLiabilityAccountId" label="Deferred Tax Liability Account" classes={["Liability"]}/>
                    <Form_1.Account name="deferredTaxExpenseAccountId" label="Deferred Tax Expense Account" classes={["Expense"]}/>
                  </react_1.VStack>)}
              </react_1.VStack>
            </react_1.CardContent>
            {taxEnabled && (<react_1.CardFooter>
                <Form_1.Submit isDisabled={taxFetcher.state !== "idle"}>
                  <macro_2.Trans>Save</macro_2.Trans>
                </Form_1.Submit>
              </react_1.CardFooter>)}
          </react_1.Card>
        </form_1.ValidatedForm>
      </react_1.VStack>
    </react_1.ScrollArea>);
}
var templateObject_1;
