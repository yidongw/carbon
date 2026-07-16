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
exports.default = ResourcesSettingsRoute;
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
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Resources"], ["Resources"]))),
    to: path_1.path.to.resourcesSettings
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, _d, company, companySettings, _e, _f, _g, _h;
        var request = _b.request;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "settings"
                    })];
                case 1:
                    _c = _j.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, Promise.all([
                            (0, settings_1.getCompany)(client, companyId),
                            (0, settings_1.getCompanySettings)(client, companyId)
                        ])];
                case 2:
                    _d = _j.sent(), company = _d[0], companySettings = _d[1];
                    if (!!company.data) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.settings];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(company.error, "Failed to get company"))];
                case 3: throw _e.apply(void 0, _f.concat([_j.sent()]));
                case 4:
                    if (!!companySettings.data) return [3 /*break*/, 6];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.settings];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(companySettings.error, "Failed to get company settings"))];
                case 5: throw _g.apply(void 0, _h.concat([_j.sent()]));
                case 6: return [2 /*return*/, { company: company.data, companySettings: companySettings.data }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, formData, intent, validation, update, validation, update, validation, update;
        var _d, _e, _f, _g, _h;
        var request = _b.request;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "settings"
                    })];
                case 1:
                    _c = _j.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _j.sent();
                    intent = formData.get("intent");
                    if (!(intent === "maintenance")) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, form_1.validator)(settings_1.maintenanceSettingsValidator).validate(formData)];
                case 3:
                    validation = _j.sent();
                    if (validation.error) {
                        return [2 /*return*/, { success: false, message: "Invalid form data" }];
                    }
                    return [4 /*yield*/, client
                            .from("companySettings")
                            .update({
                            maintenanceGenerateInAdvance: validation.data.maintenanceGenerateInAdvance,
                            maintenanceAdvanceDays: validation.data.maintenanceAdvanceDays
                        })
                            .eq("id", companyId)];
                case 4:
                    update = _j.sent();
                    if (update.error)
                        return [2 /*return*/, { success: false, message: update.error.message }];
                    return [2 /*return*/, { success: true, message: "Maintenance settings updated" }];
                case 5:
                    if (!(intent === "suggestions")) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, form_1.validator)(settings_1.suggestionNotificationValidator).validate(formData)];
                case 6:
                    validation = _j.sent();
                    if (validation.error) {
                        return [2 /*return*/, { success: false, message: "Invalid form data" }];
                    }
                    return [4 /*yield*/, (0, settings_1.updateSuggestionNotificationSetting)(client, companyId, (_d = validation.data.suggestionNotificationGroup) !== null && _d !== void 0 ? _d : [])];
                case 7:
                    update = _j.sent();
                    if (update.error)
                        return [2 /*return*/, { success: false, message: update.error.message }];
                    return [2 /*return*/, {
                            success: true,
                            message: "Suggestion notification settings updated"
                        }];
                case 8:
                    if (!(intent === "maintenanceDispatchNotifications")) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, form_1.validator)(settings_1.maintenanceDispatchNotificationValidator).validate(formData)];
                case 9:
                    validation = _j.sent();
                    if (validation.error) {
                        return [2 /*return*/, { success: false, message: "Invalid form data" }];
                    }
                    return [4 /*yield*/, (0, settings_1.updateMaintenanceDispatchNotificationSettings)(client, companyId, {
                            maintenanceDispatchNotificationGroup: (_e = validation.data.maintenanceDispatchNotificationGroup) !== null && _e !== void 0 ? _e : [],
                            qualityDispatchNotificationGroup: (_f = validation.data.qualityDispatchNotificationGroup) !== null && _f !== void 0 ? _f : [],
                            operationsDispatchNotificationGroup: (_g = validation.data.operationsDispatchNotificationGroup) !== null && _g !== void 0 ? _g : [],
                            otherDispatchNotificationGroup: (_h = validation.data.otherDispatchNotificationGroup) !== null && _h !== void 0 ? _h : []
                        })];
                case 10:
                    update = _j.sent();
                    if (update.error)
                        return [2 /*return*/, { success: false, message: update.error.message }];
                    return [2 /*return*/, {
                            success: true,
                            message: "Maintenance dispatch notification settings updated"
                        }];
                case 11: return [2 /*return*/, null];
            }
        });
    });
}
function ResourcesSettingsRoute() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var t = (0, macro_2.useLingui)().t;
    var _p = (0, react_router_1.useLoaderData)(), company = _p.company, companySettings = _p.companySettings;
    var fetcher = (0, react_router_1.useFetcher)();
    var _q = (0, react_2.useState)((_a = companySettings.maintenanceGenerateInAdvance) !== null && _a !== void 0 ? _a : false), maintenanceGenerateInAdvance = _q[0], setMaintenanceGenerateInAdvance = _q[1];
    (0, react_2.useEffect)(function () {
        var _a, _b, _c, _d;
        if (((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) === true && ((_b = fetcher === null || fetcher === void 0 ? void 0 : fetcher.data) === null || _b === void 0 ? void 0 : _b.message)) {
            react_1.toast.success(fetcher.data.message);
        }
        if (((_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.success) === false && ((_d = fetcher === null || fetcher === void 0 ? void 0 : fetcher.data) === null || _d === void 0 ? void 0 : _d.message)) {
            react_1.toast.error(fetcher.data.message);
        }
    }, [(_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.message, (_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.success]);
    return (<react_1.ScrollArea className="w-full h-[calc(100dvh-49px)]">
      <react_1.VStack spacing={4} className="py-12 px-4 max-w-[60rem] h-full mx-auto gap-4">
        <react_1.Heading size="h3">
          <macro_2.Trans>Resources</macro_2.Trans>
        </react_1.Heading>

        <react_1.Card>
          <form_1.ValidatedForm method="post" validator={settings_1.maintenanceDispatchNotificationValidator} defaultValues={{
            maintenanceDispatchNotificationGroup: (_d = companySettings.maintenanceDispatchNotificationGroup) !== null && _d !== void 0 ? _d : [],
            qualityDispatchNotificationGroup: (_e = companySettings.qualityDispatchNotificationGroup) !== null && _e !== void 0 ? _e : [],
            operationsDispatchNotificationGroup: (_f = companySettings.operationsDispatchNotificationGroup) !== null && _f !== void 0 ? _f : [],
            otherDispatchNotificationGroup: (_g = companySettings.otherDispatchNotificationGroup) !== null && _g !== void 0 ? _g : []
        }} fetcher={fetcher}>
            <input type="hidden" name="intent" value="maintenanceDispatchNotifications"/>
            <react_1.CardHeader>
              <react_1.CardTitle className="flex items-center gap-2">
                <macro_2.Trans>Maintenance Dispatch Notifications</macro_2.Trans>
              </react_1.CardTitle>
              <react_1.CardDescription>
                <macro_2.Trans>
                  Configure notifications for when maintenance dispatches are
                  created from the shop floor. Notifications are routed based on
                  the failure mode type.
                </macro_2.Trans>
              </react_1.CardDescription>
            </react_1.CardHeader>
            <react_1.CardContent>
              <div className="flex flex-col gap-8 max-w-[400px]">
                <div className="flex flex-col gap-2">
                  <react_1.Label>
                    <macro_2.Trans>Maintenance Type</macro_2.Trans>
                  </react_1.Label>
                  <Form_1.Users name="maintenanceDispatchNotificationGroup" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Who should receive notifications for maintenance-related dispatches?"], ["Who should receive notifications for maintenance-related dispatches?"])))} type="employee"/>
                </div>
                <div className="flex flex-col gap-2">
                  <react_1.Label>
                    <macro_2.Trans>Quality Type</macro_2.Trans>
                  </react_1.Label>
                  <Form_1.Users name="qualityDispatchNotificationGroup" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Who should receive notifications for quality-related dispatches?"], ["Who should receive notifications for quality-related dispatches?"])))} type="employee"/>
                </div>
                <div className="flex flex-col gap-2">
                  <react_1.Label>
                    <macro_2.Trans>Operations Type</macro_2.Trans>
                  </react_1.Label>
                  <Form_1.Users name="operationsDispatchNotificationGroup" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Who should receive notifications for operations-related dispatches?"], ["Who should receive notifications for operations-related dispatches?"])))} type="employee"/>
                </div>
                <div className="flex flex-col gap-2">
                  <react_1.Label>
                    <macro_2.Trans>Other Type</macro_2.Trans>
                  </react_1.Label>
                  <Form_1.Users name="otherDispatchNotificationGroup" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Who should receive notifications for other dispatches?"], ["Who should receive notifications for other dispatches?"])))} type="employee"/>
                </div>
              </div>
            </react_1.CardContent>
            <react_1.CardFooter>
              <form_1.Submit isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle" &&
            ((_h = fetcher.formData) === null || _h === void 0 ? void 0 : _h.get("intent")) ===
                "maintenanceDispatchNotifications"}>
                <macro_2.Trans>Save</macro_2.Trans>
              </form_1.Submit>
            </react_1.CardFooter>
          </form_1.ValidatedForm>
        </react_1.Card>

        <react_1.Card>
          <form_1.ValidatedForm method="post" validator={settings_1.maintenanceSettingsValidator} defaultValues={{
            maintenanceGenerateInAdvance: (_j = companySettings.maintenanceGenerateInAdvance) !== null && _j !== void 0 ? _j : false,
            maintenanceAdvanceDays: (_k = companySettings.maintenanceAdvanceDays) !== null && _k !== void 0 ? _k : 7
        }} fetcher={fetcher}>
            <input type="hidden" name="intent" value="maintenance"/>
            <react_1.CardHeader>
              <react_1.CardTitle className="flex items-center gap-2">
                <macro_2.Trans>Maintenance Scheduling</macro_2.Trans>
              </react_1.CardTitle>
              <react_1.CardDescription>
                <macro_2.Trans>
                  Configure how preventative maintenance dispatches are
                  automatically generated from maintenance schedules.
                </macro_2.Trans>
              </react_1.CardDescription>
            </react_1.CardHeader>
            <react_1.CardContent>
              <div className="flex flex-col gap-6 max-w-[400px]">
                <div className="flex flex-col gap-2">
                  <form_1.Boolean name="maintenanceGenerateInAdvance" description="Create maintenance dispatches in advance" value={maintenanceGenerateInAdvance} onChange={setMaintenanceGenerateInAdvance}/>
                </div>
                {maintenanceGenerateInAdvance && (<div className="flex flex-col gap-2">
                    <form_1.Number name="maintenanceAdvanceDays" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Days in advance to generate dispatches"], ["Days in advance to generate dispatches"])))} minValue={1} maxValue={365}/>
                  </div>)}
              </div>
            </react_1.CardContent>
            <react_1.CardFooter>
              <form_1.Submit isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle" &&
            ((_l = fetcher.formData) === null || _l === void 0 ? void 0 : _l.get("intent")) === "maintenance"}>
                <macro_2.Trans>Save</macro_2.Trans>
              </form_1.Submit>
            </react_1.CardFooter>
          </form_1.ValidatedForm>
        </react_1.Card>
        <react_1.Card>
          <form_1.ValidatedForm method="post" validator={settings_1.suggestionNotificationValidator} defaultValues={{
            suggestionNotificationGroup: (_m = company.suggestionNotificationGroup) !== null && _m !== void 0 ? _m : []
        }} fetcher={fetcher}>
            <input type="hidden" name="intent" value="suggestions"/>
            <react_1.CardHeader>
              <react_1.CardTitle className="flex items-center gap-2">
                <macro_2.Trans>Suggestion Notifications</macro_2.Trans>
              </react_1.CardTitle>
              <react_1.CardDescription>
                <macro_2.Trans>
                  Configure notifications for when new suggestions are
                  submitted.
                </macro_2.Trans>
              </react_1.CardDescription>
            </react_1.CardHeader>
            <react_1.CardContent>
              <div className="flex flex-col gap-8 max-w-[400px]">
                <div className="flex flex-col gap-2">
                  <react_1.Label>
                    <macro_2.Trans>Suggestion Notifications</macro_2.Trans>
                  </react_1.Label>
                  <Form_1.Users name="suggestionNotificationGroup" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Who should receive notifications when a new suggestion is submitted?"], ["Who should receive notifications when a new suggestion is submitted?"])))} type="employee"/>
                </div>
              </div>
            </react_1.CardContent>
            <react_1.CardFooter>
              <form_1.Submit isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle" &&
            ((_o = fetcher.formData) === null || _o === void 0 ? void 0 : _o.get("intent")) === "suggestions"}>
                <macro_2.Trans>Save</macro_2.Trans>
              </form_1.Submit>
            </react_1.CardFooter>
          </form_1.ValidatedForm>
        </react_1.Card>
      </react_1.VStack>
    </react_1.ScrollArea>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
