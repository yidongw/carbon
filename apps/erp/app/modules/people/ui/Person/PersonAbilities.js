"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var clsx_1 = require("clsx");
var bs_1 = require("react-icons/bs");
var fa_1 = require("react-icons/fa");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var types_1 = require("~/modules/resources/types");
var path_1 = require("~/utils/path");
var AbilityIcons = (_a = {},
    _a[types_1.AbilityEmployeeStatus.Complete] = {
        icon: bs_1.BsCheckLg
    },
    _a[types_1.AbilityEmployeeStatus.InProgress] = {
        icon: bs_1.BsBarChartFill
    },
    _a[types_1.AbilityEmployeeStatus.NotStarted] = {
        icon: fa_1.FaThumbsUp
    },
    _a);
var PersonAbilities = function (_a) {
    var _b;
    var abilities = _a.abilities;
    var t = (0, macro_1.useLingui)().t;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var abilityDescriptions = (_b = {},
        _b[types_1.AbilityEmployeeStatus.Complete] = t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Fully trained for"], ["Fully trained for"]))),
        _b[types_1.AbilityEmployeeStatus.InProgress] = t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Currently training for"], ["Currently training for"]))),
        _b[types_1.AbilityEmployeeStatus.NotStarted] = t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Not started training for"], ["Not started training for"]))),
        _b);
    return (<react_1.Card>
      <react_1.CardHeader>
        <react_1.CardTitle>
          <macro_1.Trans>Abilities</macro_1.Trans>
        </react_1.CardTitle>
      </react_1.CardHeader>
      <react_1.CardContent>
        {(abilities === null || abilities === void 0 ? void 0 : abilities.length) > 0 ? (<ul className="flex flex-col gap-4 w-full">
            {abilities.map(function (employeeAbility) {
                var _a;
                var abilityStatus = (_a = (0, types_1.getTrainingStatus)(employeeAbility)) !== null && _a !== void 0 ? _a : types_1.AbilityEmployeeStatus.NotStarted;
                var icon = AbilityIcons[abilityStatus].icon;
                var description = abilityDescriptions[abilityStatus];
                if (!employeeAbility.ability ||
                    Array.isArray(employeeAbility.ability)) {
                    return null;
                }
                var Icon = icon;
                return (<li key={employeeAbility.id}>
                  <div className="grid-cols-[auto_1fr_auto] space-x-4">
                    <div className={(0, clsx_1.default)("flex h-10 w-10 rounded-full items-center justify-center", {
                        "bg-emerald-500 text-white": abilityStatus === types_1.AbilityEmployeeStatus.Complete,
                        "bg-blue-400 text-white dark:bg-blue-500 dark:text-white": abilityStatus === types_1.AbilityEmployeeStatus.InProgress,
                        "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200": abilityStatus === types_1.AbilityEmployeeStatus.NotStarted
                    })}>
                      <Icon className="h-5 w-5"/>
                    </div>
                    <div className="flex h-full items-center">
                      <p>
                        {description}{" "}
                        <react_router_1.Link className="font-bold" to={path_1.path.to.employeeAbility(employeeAbility.ability.id, employeeAbility.id)}>
                          {employeeAbility.ability.name}
                        </react_router_1.Link>
                      </p>
                    </div>
                    <div className="flex h-full items-center">
                      <p className="text-sm text-muted-foreground">
                        {formatDate(employeeAbility.lastTrainingDate, {
                        month: "short",
                        year: "numeric"
                    })}
                      </p>
                    </div>
                  </div>
                </li>);
            })}
          </ul>) : (<div className="text-muted-foreground text-center p-4 w-full">
            <macro_1.Trans>No abilities added</macro_1.Trans>
          </div>)}
      </react_1.CardContent>
    </react_1.Card>);
};
exports.default = PersonAbilities;
var templateObject_1, templateObject_2, templateObject_3;
