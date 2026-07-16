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
exports.default = InventorySettingsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Inventory"], ["Inventory"]))),
    to: path_1.path.to.inventorySettings
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, companySettings, _d, _e;
        var request = _b.request;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "settings"
                    })];
                case 1:
                    _c = _f.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, (0, settings_1.getCompanySettings)(client, companyId)];
                case 2:
                    companySettings = _f.sent();
                    if (!!companySettings.data) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.settings];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(companySettings.error, "Failed to get company settings"))];
                case 3: throw _d.apply(void 0, _e.concat([_f.sent()]));
                case 4: return [2 /*return*/, { companySettings: companySettings.data }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, formData, intent, _d, kanbanOutputValidation, kanbanOutputResult, shelfLifeValidation, shelfLifeResult;
        var request = _b.request;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "settings"
                    })];
                case 1:
                    _c = _e.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _e.sent();
                    intent = formData.get("intent");
                    _d = intent;
                    switch (_d) {
                        case "kanbanOutput": return [3 /*break*/, 3];
                        case "shelfLife": return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 9];
                case 3: return [4 /*yield*/, (0, form_1.validator)(settings_1.kanbanOutputValidator).validate(formData)];
                case 4:
                    kanbanOutputValidation = _e.sent();
                    if (kanbanOutputValidation.error) {
                        return [2 /*return*/, { success: false, message: "Invalid form data" }];
                    }
                    return [4 /*yield*/, (0, settings_1.updateKanbanOutputSetting)(client, companyId, kanbanOutputValidation.data.kanbanOutput)];
                case 5:
                    kanbanOutputResult = _e.sent();
                    if (kanbanOutputResult.error)
                        return [2 /*return*/, {
                                success: false,
                                message: kanbanOutputResult.error.message
                            }];
                    return [2 /*return*/, { success: true, message: "Kanban output setting updated" }];
                case 6: return [4 /*yield*/, (0, form_1.validator)(settings_1.shelfLifeSettingsValidator).validate(formData)];
                case 7:
                    shelfLifeValidation = _e.sent();
                    if (shelfLifeValidation.error) {
                        return [2 /*return*/, { success: false, message: "Invalid form data" }];
                    }
                    return [4 /*yield*/, (0, settings_1.updateShelfLifeSettings)(client, companyId, {
                            nearExpiryWarningDays: shelfLifeValidation.data.nearExpiryWarningDays,
                            defaultShelfLifeDays: shelfLifeValidation.data.defaultShelfLifeDays,
                            calculatedInputScope: shelfLifeValidation.data.calculatedInputScope,
                            expiredEntityPolicy: shelfLifeValidation.data.expiredEntityPolicy
                        })];
                case 8:
                    shelfLifeResult = _e.sent();
                    if (shelfLifeResult.error)
                        return [2 /*return*/, {
                                success: false,
                                message: shelfLifeResult.error.message
                            }];
                    return [2 /*return*/, {
                            success: true,
                            message: "Shelf life & expiry settings updated"
                        }];
                case 9: return [2 /*return*/, { success: false, message: "Invalid form data" }];
            }
        });
    });
}
var outputLabels = {
    label: "Label",
    qrcode: "QR Code",
    url: "URL"
};
function InventorySettingsRoute() {
    var _a, _b, _c;
    var t = (0, macro_2.useLingui)().t;
    var companySettings = (0, react_router_1.useLoaderData)().companySettings;
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
    return (<react_1.ScrollArea className="w-full h-[calc(100dvh-49px)]">
      <react_1.VStack spacing={4} className="py-12 px-4 max-w-[60rem] h-full mx-auto gap-4">
        <react_1.Heading size="h3">
          <macro_2.Trans>Inventory</macro_2.Trans>
        </react_1.Heading>
        <react_1.Card>
          <form_1.ValidatedForm method="post" validator={settings_1.kanbanOutputValidator} defaultValues={{
            kanbanOutput: (_c = companySettings.kanbanOutput) !== null && _c !== void 0 ? _c : "qrcode"
        }} fetcher={fetcher}>
            <react_1.CardHeader>
              <react_1.CardTitle className="flex items-center gap-2">
                <macro_2.Trans>Kanban Output</macro_2.Trans>
              </react_1.CardTitle>
              <react_1.CardDescription>
                <macro_2.Trans>
                  Style of kanban output to show in the Kanban table
                </macro_2.Trans>
              </react_1.CardDescription>
            </react_1.CardHeader>
            <react_1.CardContent>
              <form_1.Hidden name="intent" value="kanbanOutput"/>
              <div className="flex flex-col gap-8 max-w-[400px]">
                <div className="flex flex-col gap-2">
                  <form_1.Select name="kanbanOutput" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Output"], ["Output"])))} options={settings_1.kanbanOutputTypes.map(function (type) { return ({
            value: type,
            label: outputLabels[type]
        }); })}/>
                </div>
              </div>
            </react_1.CardContent>
            <react_1.CardFooter>
              <form_1.Submit>
                <macro_2.Trans>Save</macro_2.Trans>
              </form_1.Submit>
            </react_1.CardFooter>
          </form_1.ValidatedForm>
        </react_1.Card>

        <react_1.Card>
          <form_1.ValidatedForm method="post" validator={settings_1.shelfLifeSettingsValidator} defaultValues={(function () {
            var _a, _b, _c, _d, _e;
            var blob = (_a = companySettings.inventoryShelfLife) !== null && _a !== void 0 ? _a : {};
            return {
                nearExpiryWarningDays: (_b = blob.nearExpiryWarningDays) !== null && _b !== void 0 ? _b : undefined,
                defaultShelfLifeDays: (_c = blob.defaultShelfLifeDays) !== null && _c !== void 0 ? _c : 7,
                calculatedInputScope: (_d = blob.calculatedInputScope) !== null && _d !== void 0 ? _d : "AllInputs",
                expiredEntityPolicy: (_e = blob.expiredEntityPolicy) !== null && _e !== void 0 ? _e : "Block"
            };
        })()} fetcher={fetcher}>
            <react_1.CardHeader>
              <react_1.CardTitle className="flex items-center gap-2">
                <macro_2.Trans>Shelf life</macro_2.Trans>
              </react_1.CardTitle>
              <react_1.CardDescription>
                <macro_2.Trans>
                  Manage how shelf life is tracked, computed, and enforced
                  across inventory.
                </macro_2.Trans>
              </react_1.CardDescription>
            </react_1.CardHeader>
            <react_1.CardContent>
              <form_1.Hidden name="intent" value="shelfLife"/>
              <div className="flex flex-col gap-8 max-w-[640px]">
                <ShelfLifeNumbers />
                <div className="flex flex-col gap-3">
                  <ShelfLifeSectionLabel title={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Calculated finished-good expiry"], ["Calculated finished-good expiry"])))} description={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["When a finished product's shelf life is set to Calculated, pick which consumed inputs feed the calculation."], ["When a finished product's shelf life is set to Calculated, pick which consumed inputs feed the calculation."])))}/>
                  <CalculatedInputScopeChoice />
                </div>
                <div className="flex flex-col gap-3">
                  <ShelfLifeSectionLabel title={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["When expired stock is used"], ["When expired stock is used"])))} description={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Decide what an operator sees if they try to issue a batch or serial that's already expired."], ["Decide what an operator sees if they try to issue a batch or serial that's already expired."])))}/>
                  <ExpiredEntityPolicyChoice />
                </div>
              </div>
            </react_1.CardContent>
            <react_1.CardFooter>
              <form_1.Submit>
                <macro_2.Trans>Save</macro_2.Trans>
              </form_1.Submit>
            </react_1.CardFooter>
          </form_1.ValidatedForm>
        </react_1.Card>
      </react_1.VStack>
    </react_1.ScrollArea>);
}
// Inline section label used inside a Card. Title + helper copy without a
// border line — keeps the visual hierarchy quiet so the cards underneath
// carry the weight.
function ShelfLifeSectionLabel(_a) {
    var title = _a.title, description = _a.description;
    return (<div className="flex flex-col gap-0.5">
      <span className="text-sm font-medium">{title}</span>
      <span className="text-xs text-muted-foreground">{description}</span>
    </div>);
}
// Numeric pair (badge threshold + default shelf life). Pulled out so the
// parent CardContent can compose the form as a sequence of sections.
function ShelfLifeNumbers() {
    var t = (0, macro_2.useLingui)().t;
    return (<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 w-full max-w-[640px]">
      <form_1.Number name="nearExpiryWarningDays" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Warn this many days before expiry"], ["Warn this many days before expiry"])))} minValue={0} maxValue={365} helperText={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Items inside this window get a yellow badge."], ["Items inside this window get a yellow badge."])))}/>
      <form_1.Number name="defaultShelfLifeDays" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Default shelf-life duration (days)"], ["Default shelf-life duration (days)"])))} minValue={1} maxValue={365} helperText={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Pre-filled for a new item when expiry is Fixed Duration."], ["Pre-filled for a new item when expiry is Fixed Duration."])))}/>
    </div>);
}
// ChoiceSelect for the Calculated-mode input scope. Compact trigger plus
// a rich dropdown — keeps the form scannable while still surfacing the
// trade-off when the user opens the picker.
function CalculatedInputScopeChoice() {
    var t = (0, macro_2.useLingui)().t;
    var _a = (0, form_1.useControlField)("calculatedInputScope"), value = _a[0], setValue = _a[1];
    var current = value !== null && value !== void 0 ? value : "AllInputs";
    return (<>
      <react_1.ChoiceSelect value={current} onChange={setValue} options={[
            {
                value: "ManagedInputsOnly",
                title: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Sub-assembly expiries only"], ["Sub-assembly expiries only"]))),
                description: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Skip raw-material dates set at receipt. Only inputs with their own shelf-life policy count."], ["Skip raw-material dates set at receipt. Only inputs with their own shelf-life policy count."]))),
                icon: <lu_1.LuShieldCheck />
            },
            {
                value: "AllInputs",
                title: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Calculate from BOM"], ["Calculate from BOM"]))),
                description: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Soonest expiry across every material sets the finished good."], ["Soonest expiry across every material sets the finished good."]))),
                icon: <lu_1.LuLayers />
            }
        ]}/>
      <input type="hidden" name="calculatedInputScope" value={current}/>
    </>);
}
// ChoiceSelect for the expired-entity enforcement policy. Three options
// without flooding the layout — descriptions only show in the open menu.
function ExpiredEntityPolicyChoice() {
    var t = (0, macro_2.useLingui)().t;
    var _a = (0, form_1.useControlField)("expiredEntityPolicy"), value = _a[0], setValue = _a[1];
    var current = value !== null && value !== void 0 ? value : "Block";
    return (<>
      <react_1.ChoiceSelect value={current} onChange={setValue} options={[
            {
                value: "Warn",
                title: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Warn but allow"], ["Warn but allow"]))),
                description: t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Operator gets a warning. Stock still goes through."], ["Operator gets a warning. Stock still goes through."]))),
                icon: <lu_1.LuTriangleAlert />
            },
            {
                value: "Block",
                title: t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Block with an error"], ["Block with an error"]))),
                description: t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Operator must pick a different batch/serial."], ["Operator must pick a different batch/serial."]))),
                icon: <lu_1.LuShield />
            },
            {
                value: "BlockWithOverride",
                title: t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Block, allow override"], ["Block, allow override"]))),
                description: t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Override needs the inventory:update permission and a reason."], ["Override needs the inventory:update permission and a reason."]))),
                icon: <lu_1.LuTimerReset />
            }
        ]}/>
      <input type="hidden" name="expiredEntityPolicy" value={current}/>
    </>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20;
