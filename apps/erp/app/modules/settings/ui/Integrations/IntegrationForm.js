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
exports.IntegrationForm = IntegrationForm;
var ee_1 = require("@carbon/ee");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var Icons_1 = require("~/components/Icons");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
function IntegrationActionButton(_a) {
    var _this = this;
    var action = _a.action, isDisabled = _a.isDisabled;
    var _b = (0, react_2.useState)(false), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_2.useState)("idle"), status = _c[0], setStatus = _c[1];
    var handleClick = (0, react_2.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setIsLoading(true);
                    setStatus("running");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch(action.endpoint, { method: "POST" })];
                case 2:
                    response = _b.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _b.sent();
                    if (data.success) {
                        react_1.toast.success("".concat(action.label, " started"));
                        setStatus("completed");
                    }
                    else {
                        setStatus("idle");
                        react_1.toast.error(data.error || "Failed to start ".concat(action.label));
                    }
                    return [3 /*break*/, 6];
                case 4:
                    _a = _b.sent();
                    setStatus("idle");
                    react_1.toast.error("Failed to start ".concat(action.label));
                    return [3 /*break*/, 6];
                case 5:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [action]);
    return (<div className="flex items-center justify-between gap-4 p-3 border rounded-lg w-full">
      <div className="flex flex-col flex-1 min-w-0">
        <p className="text-sm font-medium">{action.label}</p>
        <p className="text-xs text-muted-foreground">{action.description}</p>
      </div>
      <div className="shrink-0">
        <react_1.Button variant="secondary" size="sm" onClick={handleClick} isLoading={isLoading} isDisabled={isDisabled || status === "running"}>
          {status === "completed" ? "Started" : "Run"}
        </react_1.Button>
      </div>
    </div>);
}
/**
 * Helper to normalize option to consistent format
 */
function normalizeOption(option) {
    if (typeof option === "string") {
        return { value: option, label: option };
    }
    return option;
}
/**
 * Wrapper that hides a setting field when its `visibleWhen` condition
 * does not match the current value of the referenced field.
 *
 * Must be mounted as a dedicated component so `useControlField` is only
 * called when `visibleWhen` is defined (satisfies the rules of hooks).
 */
function ConditionalSettingField(_a) {
    var setting = _a.setting;
    var condition = setting.visibleWhen;
    var value = (0, form_1.useControlField)(condition.field)[0];
    var current = value == null ? "" : String(value);
    var equals = Array.isArray(condition.equals)
        ? condition.equals
        : [condition.equals];
    if (!equals.includes(current))
        return null;
    return <SettingFieldInner setting={setting}/>;
}
/**
 * Renders a single setting field based on its type,
 * honouring any `visibleWhen` gating.
 */
function SettingField(_a) {
    var setting = _a.setting;
    if (setting.visibleWhen) {
        return <ConditionalSettingField setting={setting}/>;
    }
    return <SettingFieldInner setting={setting}/>;
}
function SettingFieldInner(_a) {
    var _b;
    var setting = _a.setting;
    switch (setting.type) {
        case "text":
            return (<div className="w-full">
          <form_1.Input name={setting.name} label={setting.label} isOptional={!setting.required}/>
          {setting.description && (<p className="text-xs text-muted-foreground mt-1.5">
              {setting.description}
            </p>)}
        </div>);
        case "number":
            return (<div className="w-full">
          <form_1.Number name={setting.name} label={setting.label} isRequired={setting.required}/>
          {setting.description && (<p className="text-xs text-muted-foreground mt-1.5">
              {setting.description}
            </p>)}
        </div>);
        case "password":
            return (<div className="w-full">
          <form_1.Password name={setting.name} label={setting.label}/>
          {setting.description && (<p className="text-xs text-muted-foreground mt-1.5">
              {setting.description}
            </p>)}
        </div>);
        case "cards":
            return <CardSelector setting={setting}/>;
        case "switch":
            return <SwitchField setting={setting}/>;
        case "processes":
            return (<div className="w-full">
          <Form_1.Processes name={setting.name} label={setting.label}/>
          {setting.description && (<p className="text-xs text-muted-foreground mt-1">
              {setting.description}
            </p>)}
        </div>);
        case "array":
            return (<div className="w-full">
          <Form_1.Array name={setting.name} label={setting.label}/>
          {setting.description && (<p className="text-xs text-muted-foreground mt-1">
              {setting.description}
            </p>)}
        </div>);
        case "options": {
            var listOptions = (_b = setting.listOptions) !== null && _b !== void 0 ? _b : [];
            // Small static enums render as Choice cards (the same affordance as
            // the explicit `cards` type). Long / dynamically-loaded lists keep
            // the dropdown so things like Xero account pickers stay usable.
            if (listOptions.length > 0 &&
                listOptions.length <= CHOICE_CARD_MAX_OPTIONS) {
                return <CardSelector setting={setting}/>;
            }
            var options = listOptions.map(function (option) {
                var normalized = normalizeOption(option);
                var icon = getOptionIcon(setting.name, normalized.value);
                // Build a simpler label that works well with Radix Select
                var label = (<span key={normalized.value} className="flex items-center gap-2">
            {icon}
            <span className="font-medium">{normalized.label}</span>
            {normalized.description && (<span className="text-muted-foreground text-xs">
                — {normalized.description}
              </span>)}
          </span>);
                return {
                    label: label,
                    value: normalized.value
                };
            });
            return (<div className="w-full">
          <form_1.Select name={setting.name} label={setting.label} options={options}/>
          {setting.description && (<p className="text-xs text-muted-foreground mt-1">
              {setting.description}
            </p>)}
        </div>);
        }
        default:
            return null;
    }
}
/**
 * Card-style picker for mutually-exclusive options. Wraps the shared
 * `ChoiceCardGroup` and binds it into the surrounding ValidatedForm via
 * `useControlField` + a hidden input so the value gets serialized on submit.
 *
 * Used for both the explicit `cards` setting type and for small (≤5) static
 * `options` lists, so the integration form picks the right affordance based
 * on payload size — Choice cards for tight enums, dropdowns for long /
 * dynamically-loaded lists (e.g. Xero account codes).
 */
function CardSelector(_a) {
    var _b;
    var setting = _a.setting;
    var _c = (0, form_1.useControlField)(setting.name), value = _c[0], setValue = _c[1];
    var options = ((_b = setting.listOptions) !== null && _b !== void 0 ? _b : []).map(normalizeOption);
    var current = value == null ? "" : String(value);
    return (<div className="w-full">
      {setting.label && (<div className="flex flex-col gap-0.5 pb-2">
          <div className="text-sm font-medium text-foreground">
            {setting.label}
          </div>
          {setting.description && (<p className="text-xs text-muted-foreground">
              {setting.description}
            </p>)}
        </div>)}
      <form_1.ChoiceCardGroup value={current} onChange={setValue} options={options.map(function (option) {
            var _a;
            return ({
                value: option.value,
                title: option.label,
                description: option.description,
                icon: (_a = getOptionIcon(setting.name, option.value)) !== null && _a !== void 0 ? _a : option.icon
            });
        })}/>
      {/* Hidden input keeps the value in form data on submit */}
      <input type="hidden" name={setting.name} value={current}/>
    </div>);
}
/**
 * Boolean toggle bound to the surrounding ValidatedForm.
 *
 * We deliberately don't reuse `@carbon/form`'s `Boolean`, because that one
 * leans on Radix's built-in hidden checkbox — which only posts a value when
 * *checked*, so an unchecked switch sends nothing and any `.default(true)`
 * in the Zod schema quietly reasserts `true` on save. Users then can't turn
 * the field off (e.g. the Email integration's "Use TLS" switch stayed stuck
 * on).
 *
 * Instead, we drive the `Switch` as a controlled component via
 * `useControlField` and emit our own hidden input that *always* contains
 * either `"true"` or `"false"`, so the posted form data is unambiguous.
 * Schemas consuming these fields need to preprocess the string into a
 * boolean (see `packages/ee/src/email/config.tsx`).
 */
function SwitchField(_a) {
    var setting = _a.setting;
    var _b = (0, form_1.useControlField)(setting.name), value = _b[0], setValue = _b[1];
    var checked = value === true;
    return (<div className="flex items-center justify-between gap-4 w-full py-2">
      <div className="flex flex-col flex-1">
        <span className="text-sm font-medium">{setting.label}</span>
        {setting.description && (<span className="text-xs text-muted-foreground">
            {setting.description}
          </span>)}
      </div>
      <div className="shrink-0">
        <react_1.Switch checked={checked} onCheckedChange={setValue} aria-label={setting.label}/>
        <input type="hidden" name={setting.name} value={checked ? "true" : "false"}/>
      </div>
    </div>);
}
/**
 * Legacy icon support for specific field names that historically rendered
 * a leading glyph in the Select dropdown. Returns null when there's no
 * registered icon so ChoiceCardGroup just omits the icon slot.
 */
function getOptionIcon(settingName, optionValue) {
    if (settingName === "methodType") {
        return <Icons_1.MethodIcon type={optionValue}/>;
    }
    if (settingName === "trackingType") {
        return <Icons_1.TrackingTypeIcon type={optionValue}/>;
    }
    return null;
}
/** Threshold for switching `options` from a Select dropdown to ChoiceCardGroup. */
var CHOICE_CARD_MAX_OPTIONS = 5;
/**
 * Wrapper that hides an entire group when every setting in it is gated
 * by the same `visibleWhen` field and none of them are currently visible.
 * Only mounted when the group actually shares a single `visibleWhen` field.
 */
function GatedSettingsGroup(_a) {
    var name = _a.name, description = _a.description, settings = _a.settings, controlledField = _a.controlledField;
    var value = (0, form_1.useControlField)(controlledField)[0];
    var current = value == null ? "" : String(value);
    var anyVisible = settings.some(function (s) {
        var eq = s.visibleWhen.equals;
        var equals = Array.isArray(eq) ? eq : [eq];
        return equals.includes(current);
    });
    if (!anyVisible)
        return null;
    return (<SettingsGroup name={name} description={description} settings={settings}/>);
}
/**
 * Decides whether a group should be gated behind a shared `visibleWhen`
 * condition, and renders the appropriate component.
 */
function ConditionalSettingsGroup(_a) {
    var _b;
    var name = _a.name, description = _a.description, settings = _a.settings;
    var firstCondition = (_b = settings[0]) === null || _b === void 0 ? void 0 : _b.visibleWhen;
    var sharesCondition = firstCondition !== undefined &&
        settings.every(function (s) { return s.visibleWhen && s.visibleWhen.field === firstCondition.field; });
    if (sharesCondition) {
        return (<GatedSettingsGroup name={name} description={description} settings={settings} controlledField={firstCondition.field}/>);
    }
    return (<SettingsGroup name={name} description={description} settings={settings}/>);
}
/**
 * Renders a group of related settings under a subtle section header.
 * Previously this was a collapsible, but every consumer always opened it
 * by default and never closed it, so the chrome was pure noise.
 */
function SettingsGroup(_a) {
    var name = _a.name, description = _a.description, settings = _a.settings;
    return (<div className="w-full border-t border-border pt-4">
      <div className="flex flex-col gap-1 pb-3">
        <div className="text-[0.6875rem] font-semibold uppercase tracking-wider text-foreground/70">
          {name}
        </div>
        {description && (<p className="text-xs text-muted-foreground">{description}</p>)}
      </div>
      <react_1.VStack spacing={4}>
        {settings.map(function (setting) { return (<SettingField key={setting.name} setting={setting}/>); })}
      </react_1.VStack>
    </div>);
}
function IntegrationForm(_a) {
    var _b;
    var installed = _a.installed, metadata = _a.metadata, onClose = _a.onClose, _c = _a.dynamicOptions, dynamicOptions = _c === void 0 ? {} : _c;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var isDisabled = !permissions.can("update", "settings");
    var companyId = (0, hooks_1.useUser)().company.id;
    var integrationId = (0, react_router_1.useParams)().id;
    var integration = integrationId
        ? ee_1.integrations.find(function (i) { return i.id === integrationId; })
        : undefined;
    // Extract connected organisation name from metadata (e.g. Xero tenant name)
    var connectedOrgName = (_b = metadata === null || metadata === void 0 ? void 0 : metadata.credentials) === null || _b === void 0 ? void 0 : _b.tenantName;
    // Group settings by their group property
    // Settings without a group appear first (ungrouped)
    // Also merges dynamic options into settings that have them
    var _d = (0, react_2.useMemo)(function () {
        var _a, _b;
        if (!integration) {
            return {
                ungroupedSettings: [],
                groupedSettings: new Map(),
                groupNames: [],
                groupDescriptions: new Map()
            };
        }
        var ungrouped = [];
        var grouped = new Map();
        for (var _i = 0, _c = integration.settings; _i < _c.length; _i++) {
            var baseSetting = _c[_i];
            // Merge dynamic options if available for this setting
            var setting = dynamicOptions[baseSetting.name]
                ? __assign(__assign({}, baseSetting), { listOptions: dynamicOptions[baseSetting.name] }) : baseSetting;
            if (!setting.group) {
                ungrouped.push(setting);
            }
            else {
                var existing = (_a = grouped.get(setting.group)) !== null && _a !== void 0 ? _a : [];
                grouped.set(setting.group, __spreadArray(__spreadArray([], existing, true), [setting], false));
            }
        }
        // Build group descriptions map from settingGroups
        var descriptions = new Map();
        var settingGroups = (_b = integration
            .settingGroups) !== null && _b !== void 0 ? _b : [];
        for (var _d = 0, settingGroups_1 = settingGroups; _d < settingGroups_1.length; _d++) {
            var group = settingGroups_1[_d];
            descriptions.set(group.name, group.description);
        }
        return {
            ungroupedSettings: ungrouped,
            groupedSettings: grouped,
            groupNames: __spreadArray([], grouped.keys(), true),
            groupDescriptions: descriptions
        };
    }, [integration, dynamicOptions]), ungroupedSettings = _d.ungroupedSettings, groupedSettings = _d.groupedSettings, groupNames = _d.groupNames, groupDescriptions = _d.groupDescriptions;
    var initialValues = (0, react_2.useMemo)(function () {
        if (!integration)
            return {};
        return integration.settings.reduce(function (acc, setting) {
            var _a;
            var _b;
            return __assign(__assign({}, acc), (_a = {}, _a[setting.name] = (_b = metadata[setting.name]) !== null && _b !== void 0 ? _b : setting.value, _a));
        }, {});
    }, [integration, metadata]);
    if (!integrationId) {
        throw new Error("Integration ID is required");
    }
    if (!integration) {
        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Integration not found"], ["Integration not found"]))));
        return null;
    }
    return (<react_1.Drawer open onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.DrawerContent>
        <form_1.ValidatedForm validator={integration.schema} method="post" action={path_1.path.to.integration(integration.id)} defaultValues={initialValues} className="flex flex-col h-full">
          <react_1.DrawerHeader>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-card p-1.5">
                  <integration.logo className="h-full w-auto"/>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <react_1.Heading size="h3" className="truncate">
                      {integration.name}
                    </react_1.Heading>
                    {installed && <react_1.Badge variant="green">Installed</react_1.Badge>}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <react_1.Badge variant="secondary">{integration.category}</react_1.Badge>
                    <span aria-hidden>•</span>
                    <span>
                      <macro_1.Trans>Published by Carbon</macro_1.Trans>
                    </span>
                  </div>
                </div>
              </div>
              {installed && connectedOrgName && (<div className="text-sm text-muted-foreground">
                  <macro_1.Trans>Connected to</macro_1.Trans>{" "}
                  <span className="font-medium text-foreground">
                    {connectedOrgName}
                  </span>
                </div>)}
            </div>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            <react_1.ScrollArea className="h-[calc(100dvh-240px)] -mx-2 pb-8">
              <react_1.VStack spacing={4} className="px-2">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {integration.description}
                </p>

                {/* @ts-expect-error TS2339 */}
                {integration.setupInstructions && (<div className="flex flex-col gap-2">
                    <div className="text-[0.6875rem] font-semibold uppercase tracking-wider text-foreground/70">
                      <macro_1.Trans>Setup instructions</macro_1.Trans>
                    </div>
                    {/* @ts-expect-error TS2339 */}
                    <integration.setupInstructions companyId={companyId}/>
                  </div>)}

                {/* Ungrouped settings appear first */}
                {ungroupedSettings.length > 0 && (<react_1.VStack spacing={4} className="w-full">
                    {ungroupedSettings.map(function (setting) { return (<SettingField key={setting.name} setting={setting}/>); })}
                  </react_1.VStack>)}

                {/* Grouped settings in flat sections */}
                {groupNames.map(function (groupName) {
            var _a;
            return (<ConditionalSettingsGroup key={groupName} name={groupName} description={groupDescriptions.get(groupName)} settings={(_a = groupedSettings.get(groupName)) !== null && _a !== void 0 ? _a : []}/>);
        })}

                {installed &&
            // @ts-expect-error TS2339 - TODO: fix type
            integration.actions &&
            // @ts-expect-error TS2339 - TODO: fix type
            integration.actions.length > 0 && (<div className="flex w-full flex-col gap-3 border-t border-border pt-4">
                      <div className="text-[0.6875rem] font-semibold uppercase tracking-wider text-foreground/70">
                        <macro_1.Trans>Actions</macro_1.Trans>
                      </div>
                      <react_1.VStack spacing={2} className="w-full">
                        {/* @ts-expect-error TS7006 */}
                        {integration.actions.map(function (action) { return (<IntegrationActionButton key={action.id} action={action} isDisabled={isDisabled}/>); })}
                      </react_1.VStack>
                    </div>)}
              </react_1.VStack>
            </react_1.ScrollArea>
            <div className="mt-2">
              <p className="text-[0.6875rem] leading-relaxed text-muted-foreground">
                Carbon Manufacturing Systems does not endorse any third-party
                software.{" "}
                <a href={"mailto:".concat(utils_1.SUPPORT_EMAIL)} className="underline decoration-dotted underline-offset-2 hover:text-foreground">
                  Report integration
                </a>
                .
              </p>
            </div>
          </react_1.DrawerBody>
          <react_1.DrawerFooter>
            <react_1.HStack>
              {integration.settings.length > 0 ? (installed ? (<form_1.Submit isDisabled={isDisabled}>
                    <macro_1.Trans>Update</macro_1.Trans>
                  </form_1.Submit>) : (<form_1.Submit isDisabled={isDisabled}>
                    <macro_1.Trans>Install</macro_1.Trans>
                  </form_1.Submit>)) : null}

              <react_1.Button variant="solid" onClick={onClose}>
                <macro_1.Trans>Close</macro_1.Trans>
              </react_1.Button>
            </react_1.HStack>
          </react_1.DrawerFooter>
        </form_1.ValidatedForm>
      </react_1.DrawerContent>
    </react_1.Drawer>);
}
var templateObject_1;
