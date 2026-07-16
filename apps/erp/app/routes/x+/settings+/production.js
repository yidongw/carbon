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
exports.default = ProductionSettingsRoute;
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
var useProductionSubmodules_1 = require("~/modules/production/ui/useProductionSubmodules");
var settings_1 = require("~/modules/settings");
var SubmoduleVisibility_1 = require("~/modules/settings/ui/SubmoduleVisibility");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Production"], ["Production"]))),
    to: path_1.path.to.productionSettings
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
        var _c, client, companyId, formData, intent, validation, update, hiddenSubmodules, update;
        var _d, _e, _f;
        var request = _b.request;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "settings"
                    })];
                case 1:
                    _c = _g.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _g.sent();
                    intent = formData.get("intent");
                    if (!(intent === "jobCompleted")) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, form_1.validator)(settings_1.jobCompletedValidator).validate(formData)];
                case 3:
                    validation = _g.sent();
                    if (validation.error) {
                        return [2 /*return*/, { success: false, message: "Invalid form data" }];
                    }
                    return [4 /*yield*/, client
                            .from("companySettings")
                            .update({
                            inventoryJobCompletedNotificationGroup: (_d = validation.data.inventoryJobCompletedNotificationGroup) !== null && _d !== void 0 ? _d : [],
                            salesJobCompletedNotificationGroup: (_e = validation.data.salesJobCompletedNotificationGroup) !== null && _e !== void 0 ? _e : []
                        })
                            .eq("id", companyId)];
                case 4:
                    update = _g.sent();
                    if (update.error)
                        return [2 /*return*/, { success: false, message: update.error.message }];
                    return [2 /*return*/, { success: true, message: "Job notification settings updated" }];
                case 5:
                    if (!(intent === "hiddenSubmodules")) return [3 /*break*/, 7];
                    hiddenSubmodules = [];
                    try {
                        hiddenSubmodules = JSON.parse(String((_f = formData.get("hiddenSubmodules")) !== null && _f !== void 0 ? _f : "[]"));
                    }
                    catch (_h) {
                        // keep empty on parse failure
                    }
                    return [4 /*yield*/, (0, settings_1.updateHiddenSubmodulesSetting)(client, companyId, hiddenSubmodules)];
                case 6:
                    update = _g.sent();
                    if (update.error)
                        return [2 /*return*/, { success: false, message: update.error.message }];
                    return [2 /*return*/, { success: true, message: "Navigation updated" }];
                case 7: return [2 /*return*/, { success: false, message: "Unknown intent" }];
            }
        });
    });
}
function ProductionSettingsRoute() {
    var _a, _b, _c, _d, _e;
    var t = (0, macro_2.useLingui)().t;
    var companySettings = (0, react_router_1.useLoaderData)().companySettings;
    var fetcher = (0, react_router_1.useFetcher)();
    var groups = (0, useProductionSubmodules_1.default)({ includeHidden: true }).groups;
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
          <macro_2.Trans>Production</macro_2.Trans>
        </react_1.Heading>

        <react_1.Card>
          <form_1.ValidatedForm method="post" validator={settings_1.jobCompletedValidator} defaultValues={{
            inventoryJobCompletedNotificationGroup: (_c = companySettings.inventoryJobCompletedNotificationGroup) !== null && _c !== void 0 ? _c : [],
            salesJobCompletedNotificationGroup: (_d = companySettings.salesJobCompletedNotificationGroup) !== null && _d !== void 0 ? _d : []
        }} fetcher={fetcher}>
            <input type="hidden" name="intent" value="jobCompleted"/>
            <react_1.CardHeader>
              <react_1.CardTitle className="flex items-center gap-2">
                <macro_2.Trans>Completed Job Notifications</macro_2.Trans>
              </react_1.CardTitle>
              <react_1.CardDescription>
                <macro_2.Trans>
                  Configure notifications for when jobs are completed.
                </macro_2.Trans>
              </react_1.CardDescription>
            </react_1.CardHeader>
            <react_1.CardContent>
              <div className="flex flex-col gap-8 max-w-[400px]">
                <div className="flex flex-col gap-2">
                  <react_1.Label>
                    <macro_2.Trans>Inventory Job Notifications</macro_2.Trans>
                  </react_1.Label>
                  <Form_1.Users name="inventoryJobCompletedNotificationGroup" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Who should receive notifications when an inventory job is completed?"], ["Who should receive notifications when an inventory job is completed?"])))} type="employee"/>
                </div>
                <div className="flex flex-col gap-2">
                  <react_1.Label>
                    <macro_2.Trans>Sales Job Notifications</macro_2.Trans>
                  </react_1.Label>
                  <Form_1.Users name="salesJobCompletedNotificationGroup" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Who should receive notifications when a sales job is completed?"], ["Who should receive notifications when a sales job is completed?"])))} type="employee"/>
                </div>
              </div>
            </react_1.CardContent>
            <react_1.CardFooter>
              <form_1.Submit isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
                <macro_2.Trans>Save</macro_2.Trans>
              </form_1.Submit>
            </react_1.CardFooter>
          </form_1.ValidatedForm>
        </react_1.Card>

        <SubmoduleVisibility_1.SubmoduleVisibility groups={groups} hidden={(_e = companySettings.hiddenSubmodules) !== null && _e !== void 0 ? _e : []}/>
      </react_1.VStack>
    </react_1.ScrollArea>);
}
var templateObject_1, templateObject_2, templateObject_3;
