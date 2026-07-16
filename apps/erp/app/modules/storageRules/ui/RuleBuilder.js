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
exports.default = RuleBuilder;
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var Form_1 = require("~/components/Form");
var ConditionRow_1 = require("./ConditionRow");
var useValueOptions_1 = require("./useValueOptions");
var emptyConditionFor = function (targetType, surfaces) {
    var _a, _b;
    var pool = targetType
        ? (0, utils_1.getFieldsForTargetTypeAndSurfaces)(targetType, surfaces !== null && surfaces !== void 0 ? surfaces : [])
        : utils_1.FIELD_REGISTRY;
    return { field: (_b = (_a = pool[0]) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : "", op: "eq", value: undefined };
};
function RuleBuilder(_a) {
    var _b, _c;
    var name = _a.name, initial = _a.initial, targetType = _a.targetType, surfaces = _a.surfaces, onConditionsChange = _a.onConditionsChange;
    var t = (0, macro_1.useLingui)().t;
    var _d = (0, react_2.useState)((_b = initial === null || initial === void 0 ? void 0 : initial.kind) !== null && _b !== void 0 ? _b : "all"), kind = _d[0], setKind = _d[1];
    var matchOptions = (0, react_2.useMemo)(function () { return [
        {
            value: "all",
            title: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Match all"], ["Match all"]))),
            description: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Every condition must match"], ["Every condition must match"]))),
            icon: <lu_1.LuCheckCheck />
        },
        {
            value: "any",
            title: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Match any"], ["Match any"]))),
            description: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["At least one condition must match"], ["At least one condition must match"]))),
            icon: <lu_1.LuListChecks />
        },
        {
            value: "none",
            title: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Match none"], ["Match none"]))),
            description: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["No condition may match"], ["No condition may match"]))),
            icon: <lu_1.LuBan />
        }
    ]; }, [t]);
    var _e = (0, react_2.useState)(((_c = initial === null || initial === void 0 ? void 0 : initial.conditions) === null || _c === void 0 ? void 0 : _c.length)
        ? initial.conditions
        : [emptyConditionFor(targetType, surfaces)]), conditions = _e[0], setConditions = _e[1];
    var optionsByLoader = (0, useValueOptions_1.useValueOptions)();
    // Keep parents in sync with the live condition list. `onConditionsChange`
    // identity isn't tracked — parents wrap in `useCallback` if they need it.
    // biome-ignore lint/correctness/useExhaustiveDependencies: callback identity intentionally untracked
    (0, react_2.useEffect)(function () {
        onConditionsChange === null || onConditionsChange === void 0 ? void 0 : onConditionsChange(conditions);
    }, [conditions]);
    var handleChange = (0, react_2.useCallback)(function (index, patch) {
        setConditions(function (prev) {
            return prev.map(function (c, i) { return (i === index ? __assign(__assign({}, c), patch) : c); });
        });
    }, []);
    var handleRemove = (0, react_2.useCallback)(function (index) {
        setConditions(function (prev) {
            return prev.length > 1 ? prev.filter(function (_, i) { return i !== index; }) : prev;
        });
    }, []);
    var handleAdd = (0, react_2.useCallback)(function () {
        setConditions(function (prev) { return __spreadArray(__spreadArray([], prev, true), [emptyConditionFor(targetType, surfaces)], false); });
    }, [targetType, surfaces]);
    var ast = { kind: kind, conditions: conditions };
    return (<react_1.VStack spacing={2} className="w-full">
      <div className="flex items-center justify-between w-full gap-3 flex-wrap">
        <react_1.Heading size="h4">
          <macro_1.Trans>Conditions</macro_1.Trans>
        </react_1.Heading>
        <react_1.ChoiceSelect value={kind} onChange={setKind} options={matchOptions} aria-label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Match"], ["Match"])))} align="end" className="w-[180px]"/>
      </div>

      <Form_1.Hidden name={name} value={JSON.stringify(ast)}/>

      <div className="flex flex-col gap-2 w-full">
        <div className="hidden sm:flex w-full items-center gap-2" aria-hidden>
          <div className={"".concat(ConditionRow_1.CONDITION_GRID_CLASS, " flex-1 min-w-0 px-3")}>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Field"], ["Field"])))}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Operator"], ["Operator"])))}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Value"], ["Value"])))}
            </span>
          </div>
          <div className="w-8 shrink-0"/>
        </div>
        {conditions.map(function (c, i) { return (<ConditionRow_1.default key={i} condition={c} index={i} canRemove={conditions.length > 1} onChange={handleChange} onRemove={handleRemove} optionsByLoader={optionsByLoader} targetType={targetType} surfaces={surfaces}/>); })}
      </div>

      <react_1.Button type="button" variant="secondary" size="sm" leftIcon={<lu_1.LuPlus />} onClick={handleAdd}>
        <macro_1.Trans>Add condition</macro_1.Trans>
      </react_1.Button>
    </react_1.VStack>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
