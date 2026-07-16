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
exports.default = PeopleSettingsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["People"], ["People"]))),
    to: path_1.path.to.peopleSettings
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
        var _c, client, companyId, userId, formData, intent, enabled, update, update, update, userPin, pin;
        var _d;
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
                    enabled = formData.get("enabled") === "true";
                    if (!(intent === "timeCard")) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, settings_1.updateTimeCardSetting)(client, companyId, enabled)];
                case 3:
                    update = _e.sent();
                    if (update.error)
                        return [2 /*return*/, { success: false, message: update.error.message }];
                    return [2 /*return*/, { success: true, message: "Timecard settings updated" }];
                case 4:
                    if (!(intent === "lastNameFirst")) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, settings_1.updateLastNameFirstSetting)(client, companyId, enabled)];
                case 5:
                    update = _e.sent();
                    if (update.error)
                        return [2 /*return*/, { success: false, message: update.error.message }];
                    return [2 /*return*/, { success: true, message: "Name display settings updated" }];
                case 6:
                    if (!(intent === "console")) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, settings_1.updateConsoleSetting)(client, companyId, enabled, userId)];
                case 7:
                    update = _e.sent();
                    if (update.error)
                        return [2 /*return*/, { success: false, message: update.error.message }];
                    if (!enabled) return [3 /*break*/, 9];
                    return [4 /*yield*/, client
                            .from("employee")
                            .select("pin")
                            .eq("id", userId)
                            .eq("companyId", companyId)
                            .maybeSingle()];
                case 8:
                    userPin = _e.sent();
                    pin = (_d = userPin.data) === null || _d === void 0 ? void 0 : _d.pin;
                    if (pin) {
                        return [2 /*return*/, {
                                success: true,
                                message: "Console mode enabled",
                                pin: pin
                            }];
                    }
                    _e.label = 9;
                case 9: return [2 /*return*/, { success: true, message: "Console mode settings updated" }];
                case 10: return [2 /*return*/, { success: false, message: "Unknown intent" }];
            }
        });
    });
}
function PeopleSettingsRoute() {
    var _a, _b, _c;
    var companySettings = (0, react_router_1.useLoaderData)().companySettings;
    var fetcher = (0, react_router_1.useFetcher)();
    var _d = (0, react_2.useState)(false), showPinModal = _d[0], setShowPinModal = _d[1];
    var _e = (0, react_2.useState)(null), generatedPin = _e[0], setGeneratedPin = _e[1];
    var isToggling = fetcher.state !== "idle";
    (0, react_2.useEffect)(function () {
        var _a, _b, _c, _d, _e;
        if (((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) === true) {
            if ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.pin) {
                setGeneratedPin(fetcher.data.pin);
                setShowPinModal(true);
            }
            else if ((_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.message) {
                react_1.toast.success(fetcher.data.message);
            }
        }
        if (((_d = fetcher.data) === null || _d === void 0 ? void 0 : _d.success) === false && ((_e = fetcher === null || fetcher === void 0 ? void 0 : fetcher.data) === null || _e === void 0 ? void 0 : _e.message)) {
            react_1.toast.error(fetcher.data.message);
        }
    }, [fetcher.data]);
    var handleConsoleToggle = (0, react_2.useCallback)(function (checked) {
        fetcher.submit({ intent: "console", enabled: String(checked) }, { method: "POST" });
    }, [fetcher]);
    var handleTimeCardToggle = (0, react_2.useCallback)(function (checked) {
        fetcher.submit({ intent: "timeCard", enabled: String(checked) }, { method: "POST" });
    }, [fetcher]);
    var handleLastNameFirstToggle = (0, react_2.useCallback)(function (checked) {
        fetcher.submit({ intent: "lastNameFirst", enabled: String(checked) }, { method: "POST" });
    }, [fetcher]);
    return (<react_1.ScrollArea className="w-full h-[calc(100dvh-49px)]">
      <react_1.VStack spacing={4} className="py-12 px-4 max-w-[60rem] h-full mx-auto gap-4">
        <react_1.Heading size="h3">
          <macro_2.Trans>People</macro_2.Trans>
        </react_1.Heading>

        <react_1.Card>
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_2.Trans>Console Mode</macro_2.Trans>
            </react_1.CardTitle>
            <react_1.CardDescription>
              <macro_2.Trans>
                Enable shared workstation mode for MES terminals. Operators
                identify themselves via PIN before performing work.
              </macro_2.Trans>
            </react_1.CardDescription>
          </react_1.CardHeader>
          <react_1.CardContent>
            <react_1.HStack className="justify-between items-center">
              <react_1.VStack className="items-start" spacing={1}>
                <react_1.HStack className="items-center gap-2">
                  <span className="font-medium">
                    {companySettings.consoleEnabled ? (<macro_2.Trans>Console mode is enabled</macro_2.Trans>) : (<macro_2.Trans>Console mode is disabled</macro_2.Trans>)}
                  </span>
                  <react_1.Badge variant="yellow">
                    <macro_2.Trans>Beta</macro_2.Trans>
                  </react_1.Badge>
                </react_1.HStack>

                <span className="text-sm text-muted-foreground">
                  {companySettings.consoleEnabled ? (<macro_2.Trans>
                      Operators can use shared workstations with PIN
                      authentication.
                    </macro_2.Trans>) : (<macro_2.Trans>Enable to allow shared workstation mode.</macro_2.Trans>)}
                </span>
              </react_1.VStack>
              <react_1.Switch checked={(_a = companySettings.consoleEnabled) !== null && _a !== void 0 ? _a : false} onCheckedChange={handleConsoleToggle} disabled={isToggling}/>
            </react_1.HStack>
          </react_1.CardContent>
        </react_1.Card>

        <react_1.Card>
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_2.Trans>Timecards</macro_2.Trans>
            </react_1.CardTitle>
            <react_1.CardDescription>
              <macro_2.Trans>Enable timecard tracking for work shifts.</macro_2.Trans>
            </react_1.CardDescription>
          </react_1.CardHeader>
          <react_1.CardContent>
            <react_1.HStack className="justify-between items-center">
              <react_1.VStack className="items-start" spacing={1}>
                <react_1.HStack className="items-center gap-2">
                  <span className="font-medium">
                    {companySettings.timeCardEnabled ? (<macro_2.Trans>Timecards are enabled</macro_2.Trans>) : (<macro_2.Trans>Timecards are disabled</macro_2.Trans>)}
                  </span>
                  <react_1.Badge variant="yellow">
                    <macro_2.Trans>Beta</macro_2.Trans>
                  </react_1.Badge>
                </react_1.HStack>

                <span className="text-sm text-muted-foreground">
                  {companySettings.timeCardEnabled ? (<macro_2.Trans>Work shift tracking is active.</macro_2.Trans>) : (<macro_2.Trans>Enable to start tracking work shifts.</macro_2.Trans>)}
                </span>
              </react_1.VStack>
              <react_1.Switch checked={(_b = companySettings.timeCardEnabled) !== null && _b !== void 0 ? _b : false} onCheckedChange={handleTimeCardToggle} disabled={isToggling}/>
            </react_1.HStack>
          </react_1.CardContent>
        </react_1.Card>

        <react_1.Card>
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_2.Trans>Name Display</macro_2.Trans>
            </react_1.CardTitle>
            <react_1.CardDescription>
              <macro_2.Trans>
                Show family name before given name, as used in Chinese and other
                East Asian locales.
              </macro_2.Trans>
            </react_1.CardDescription>
          </react_1.CardHeader>
          <react_1.CardContent>
            <react_1.HStack className="justify-between items-center">
              <react_1.VStack className="items-start" spacing={1}>
                <span className="font-medium">
                  {companySettings.lastNameFirst ? (<macro_2.Trans>Family name is shown first</macro_2.Trans>) : (<macro_2.Trans>Given name is shown first</macro_2.Trans>)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {companySettings.lastNameFirst ? (<macro_2.Trans>
                      Names appear as family name followed by given name across
                      the app.
                    </macro_2.Trans>) : (<macro_2.Trans>
                      Enable to display names with the family name first.
                    </macro_2.Trans>)}
                </span>
              </react_1.VStack>
              <react_1.Switch checked={(_c = companySettings.lastNameFirst) !== null && _c !== void 0 ? _c : false} onCheckedChange={handleLastNameFirstToggle} disabled={isToggling}/>
            </react_1.HStack>
          </react_1.CardContent>
        </react_1.Card>
      </react_1.VStack>

      {showPinModal && generatedPin && (<react_1.Modal open onOpenChange={function (open) { return !open && setShowPinModal(false); }}>
          <react_1.ModalOverlay />
          <react_1.ModalContent>
            <react_1.ModalHeader>
              <react_1.ModalTitle>
                <macro_2.Trans>Your Console PIN</macro_2.Trans>
              </react_1.ModalTitle>
            </react_1.ModalHeader>
            <react_1.ModalBody>
              <react_1.VStack spacing={4}>
                <p className="text-sm text-muted-foreground">
                  <macro_2.Trans>
                    Console mode has been enabled. Use this PIN to identify
                    yourself at MES terminals.
                  </macro_2.Trans>
                </p>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-mono text-3xl tracking-[0.4em]">
                    {generatedPin}
                  </span>
                  <react_1.Copy text={generatedPin}/>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  <macro_2.Trans>
                    Remember this PIN. You will need it to exit console mode on
                    MES terminals.
                  </macro_2.Trans>
                </p>
              </react_1.VStack>
            </react_1.ModalBody>
            <react_1.ModalFooter>
              <react_1.HStack>
                <react_1.Button onClick={function () { return setShowPinModal(false); }}>
                  <macro_2.Trans>Done</macro_2.Trans>
                </react_1.Button>
              </react_1.HStack>
            </react_1.ModalFooter>
          </react_1.ModalContent>
        </react_1.Modal>)}
    </react_1.ScrollArea>);
}
var templateObject_1;
