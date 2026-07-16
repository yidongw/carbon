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
exports.default = QualitySettingsRoute;
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
var Form_1 = require("~/components/Form");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Quality"], ["Quality"]))),
    to: path_1.path.to.qualitySettings
};
var gaugeCalibrationValidator = zod_1.z.object({
    intent: zod_1.z.literal("gaugeCalibration"),
    gaugeCalibrationExpiredNotificationGroup: zod_1.z.array(zod_1.z.string()).optional()
});
var dashboardValidator = zod_1.z.object({
    intent: zod_1.z.literal("dashboard"),
    qualityIssueTarget: zod_1.z.coerce.number().int().min(0)
});
var samplingStandardValidator = zod_1.z.object({
    intent: zod_1.z.literal("samplingStandard"),
    samplingStandard: zod_1.z.enum(["ANSI_Z1_4", "ISO_2859_1"])
});
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
        var _c, client, companyId, formData, intent, enabled, update_1, validation_1, update_2, validation_2, update_3, validation, update;
        var _d;
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
                    if (!(intent === "enforceInspectionFourEyes")) return [3 /*break*/, 4];
                    enabled = formData.get("enabled") === "true";
                    return [4 /*yield*/, client
                            .from("companySettings")
                            .update({ enforceInspectionFourEyes: enabled })
                            .eq("id", companyId)];
                case 3:
                    update_1 = _e.sent();
                    if (update_1.error)
                        return [2 /*return*/, { success: false, message: update_1.error.message }];
                    return [2 /*return*/, {
                            success: true,
                            message: "Four-eyes enforcement ".concat(enabled ? "enabled" : "disabled")
                        }];
                case 4:
                    if (!(intent === "samplingStandard")) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, form_1.validator)(samplingStandardValidator).validate(formData)];
                case 5:
                    validation_1 = _e.sent();
                    if (validation_1.error) {
                        return [2 /*return*/, { success: false, message: "Invalid form data" }];
                    }
                    return [4 /*yield*/, client
                            .from("companySettings")
                            // @ts-ignore - samplingStandard column added in migration 20260419100000
                            .update({ samplingStandard: validation_1.data.samplingStandard })
                            .eq("id", companyId)];
                case 6:
                    update_2 = _e.sent();
                    if (update_2.error)
                        return [2 /*return*/, { success: false, message: update_2.error.message }];
                    return [2 /*return*/, { success: true, message: "Sampling standard updated" }];
                case 7:
                    if (!(intent === "dashboard")) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, form_1.validator)(dashboardValidator).validate(formData)];
                case 8:
                    validation_2 = _e.sent();
                    if (validation_2.error) {
                        return [2 /*return*/, { success: false, message: "Invalid form data" }];
                    }
                    return [4 /*yield*/, client
                            .from("companySettings")
                            .update({ qualityIssueTarget: validation_2.data.qualityIssueTarget })
                            .eq("id", companyId)];
                case 9:
                    update_3 = _e.sent();
                    if (update_3.error)
                        return [2 /*return*/, { success: false, message: update_3.error.message }];
                    return [2 /*return*/, { success: true, message: "Dashboard settings updated" }];
                case 10: return [4 /*yield*/, (0, form_1.validator)(gaugeCalibrationValidator).validate(formData)];
                case 11:
                    validation = _e.sent();
                    if (validation.error) {
                        return [2 /*return*/, { success: false, message: "Invalid form data" }];
                    }
                    return [4 /*yield*/, client
                            .from("companySettings")
                            .update({
                            gaugeCalibrationExpiredNotificationGroup: (_d = validation.data.gaugeCalibrationExpiredNotificationGroup) !== null && _d !== void 0 ? _d : []
                        })
                            .eq("id", companyId)];
                case 12:
                    update = _e.sent();
                    if (update.error)
                        return [2 /*return*/, { success: false, message: update.error.message }];
                    return [2 /*return*/, {
                            success: true,
                            message: "Gauge calibration notification settings updated"
                        }];
            }
        });
    });
}
function QualitySettingsRoute() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var t = (0, macro_2.useLingui)().t;
    var companySettings = (0, react_router_1.useLoaderData)().companySettings;
    var fetcher = (0, react_router_1.useFetcher)();
    var toggleFetcher = (0, react_router_1.useFetcher)();
    var _k = (0, react_2.useState)((_a = companySettings
        .enforceInspectionFourEyes) !== null && _a !== void 0 ? _a : false), fourEyesEnabled = _k[0], setFourEyesEnabled = _k[1];
    var handleFourEyesToggle = (0, react_2.useCallback)(function (checked) {
        setFourEyesEnabled(checked);
        toggleFetcher.submit({
            intent: "enforceInspectionFourEyes",
            enabled: checked.toString()
        }, { method: "POST" });
    }, [toggleFetcher]);
    (0, react_2.useEffect)(function () {
        var _a, _b, _c, _d;
        if (((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) === true && ((_b = fetcher === null || fetcher === void 0 ? void 0 : fetcher.data) === null || _b === void 0 ? void 0 : _b.message)) {
            react_1.toast.success(fetcher.data.message);
        }
        if (((_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.success) === false && ((_d = fetcher === null || fetcher === void 0 ? void 0 : fetcher.data) === null || _d === void 0 ? void 0 : _d.message)) {
            react_1.toast.error(fetcher.data.message);
        }
    }, [(_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.message, (_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.success]);
    (0, react_2.useEffect)(function () {
        var _a, _b, _c, _d;
        if (((_a = toggleFetcher.data) === null || _a === void 0 ? void 0 : _a.success) === true && ((_b = toggleFetcher.data) === null || _b === void 0 ? void 0 : _b.message)) {
            react_1.toast.success(toggleFetcher.data.message);
        }
        if (((_c = toggleFetcher.data) === null || _c === void 0 ? void 0 : _c.success) === false && ((_d = toggleFetcher.data) === null || _d === void 0 ? void 0 : _d.message)) {
            react_1.toast.error(toggleFetcher.data.message);
        }
    }, [(_d = toggleFetcher.data) === null || _d === void 0 ? void 0 : _d.message, (_e = toggleFetcher.data) === null || _e === void 0 ? void 0 : _e.success]);
    return (<react_1.ScrollArea className="w-full h-[calc(100dvh-49px)]">
      <react_1.VStack spacing={4} className="py-12 px-4 max-w-[60rem] h-full mx-auto gap-4">
        <react_1.Heading size="h3">
          <macro_2.Trans>Quality</macro_2.Trans>
        </react_1.Heading>

        <react_1.Card>
          <form_1.ValidatedForm method="post" validator={gaugeCalibrationValidator} defaultValues={{
            intent: "gaugeCalibration",
            gaugeCalibrationExpiredNotificationGroup: (_f = companySettings.gaugeCalibrationExpiredNotificationGroup) !== null && _f !== void 0 ? _f : []
        }} fetcher={fetcher}>
            <form_1.Hidden name="intent"/>
            <react_1.CardHeader>
              <react_1.CardTitle className="flex items-center gap-2">
                <macro_2.Trans>Gauge Calibration Notifications</macro_2.Trans>
              </react_1.CardTitle>
              <react_1.CardDescription>
                <macro_2.Trans>
                  Configure notifications for when gauges go out of calibration.
                </macro_2.Trans>
              </react_1.CardDescription>
            </react_1.CardHeader>
            <react_1.CardContent>
              <div className="flex flex-col gap-8 max-w-[400px]">
                <div className="flex flex-col gap-2">
                  <react_1.Label>
                    <macro_2.Trans>Calibration Expiration Notifications</macro_2.Trans>
                  </react_1.Label>
                  <Form_1.Users name="gaugeCalibrationExpiredNotificationGroup" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Who should receive notifications when a gauge goes out of calibration?"], ["Who should receive notifications when a gauge goes out of calibration?"])))} type="employee"/>
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
        <react_1.Card>
          <form_1.ValidatedForm method="post" validator={dashboardValidator} defaultValues={{
            intent: "dashboard",
            qualityIssueTarget: (_g = companySettings.qualityIssueTarget) !== null && _g !== void 0 ? _g : 20
        }} fetcher={fetcher}>
            <form_1.Hidden name="intent"/>
            <react_1.CardHeader>
              <react_1.CardTitle>
                <macro_2.Trans>Dashboard</macro_2.Trans>
              </react_1.CardTitle>
              <react_1.CardDescription>
                <macro_2.Trans>Configure defaults for the quality dashboard.</macro_2.Trans>
              </react_1.CardDescription>
            </react_1.CardHeader>
            <react_1.CardContent>
              <div className="flex flex-col gap-8 max-w-[400px]">
                <div className="flex flex-col gap-2">
                  <react_1.Label htmlFor="qualityIssueTarget">
                    <macro_2.Trans>Issue Target</macro_2.Trans>
                  </react_1.Label>
                  <form_1.Input name="qualityIssueTarget" type="number" min={0}/>
                  <p className="text-xs text-muted-foreground">
                    <macro_2.Trans>
                      Target number of open issues shown as a reference line on
                      the Issue Trend chart.
                    </macro_2.Trans>
                  </p>
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
        <react_1.Card>
          <react_1.CardHeader>
            <react_1.HStack className="justify-between items-center">
              <div>
                <react_1.CardTitle>
                  <macro_2.Trans>
                    Inbound Inspections: Require Different Inspector
                  </macro_2.Trans>
                </react_1.CardTitle>
                <react_1.CardDescription>
                  <macro_2.Trans>
                    Warn when the person inspecting an inbound item is the same
                    person who received it.
                  </macro_2.Trans>
                </react_1.CardDescription>
              </div>
              <react_1.Switch checked={fourEyesEnabled} onCheckedChange={handleFourEyesToggle} disabled={toggleFetcher.state !== "idle"}/>
            </react_1.HStack>
          </react_1.CardHeader>
        </react_1.Card>
        <react_1.Card>
          <form_1.ValidatedForm method="post" validator={samplingStandardValidator} defaultValues={{
            intent: "samplingStandard",
            samplingStandard: (_h = companySettings.samplingStandard) !== null && _h !== void 0 ? _h : "ANSI_Z1_4"
        }} fetcher={fetcher}>
            <form_1.Hidden name="intent"/>
            <react_1.CardHeader>
              <react_1.CardTitle>
                <macro_2.Trans>Sampling Standard</macro_2.Trans>
              </react_1.CardTitle>
              <react_1.CardDescription>
                <macro_2.Trans>
                  Attribute sampling standard used to compute lot sample sizes
                  and accept/reject numbers on inbound inspections.
                </macro_2.Trans>
              </react_1.CardDescription>
            </react_1.CardHeader>
            <react_1.CardContent>
              <div className="flex flex-col gap-2 max-w-[400px]">
                <react_1.Label htmlFor="samplingStandard">
                  <macro_2.Trans>Standard</macro_2.Trans>
                </react_1.Label>
                <SamplingStandardSelect value={(_j = companySettings.samplingStandard) !== null && _j !== void 0 ? _j : "ANSI_Z1_4"}/>
              </div>
            </react_1.CardContent>
            <react_1.CardFooter>
              <form_1.Submit isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
                <macro_2.Trans>Save</macro_2.Trans>
              </form_1.Submit>
            </react_1.CardFooter>
          </form_1.ValidatedForm>
        </react_1.Card>
      </react_1.VStack>
    </react_1.ScrollArea>);
}
function SamplingStandardSelect(_a) {
    var value = _a.value;
    return (<form_1.Select name="samplingStandard" options={[
            { value: "ANSI_Z1_4", label: "ANSI/ASQ Z1.4" },
            { value: "ISO_2859_1", label: "ISO 2859-1" }
        ]} value={value}/>);
}
var templateObject_1, templateObject_2;
