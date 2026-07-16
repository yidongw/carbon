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
exports.MethodOperationInsideDetailTabs = MethodOperationInsideDetailTabs;
var macro_1 = require("@lingui/react/macro");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var components_1 = require("~/components");
var Form_1 = require("~/components/Form");
var Procedure_1 = require("~/components/Form/Procedure");
var shared_1 = require("~/modules/shared");
var index_1 = require("./index");
function MethodOperationInsideDetailTabs(_a) {
    var processData = _a.processData, setProcessData = _a.setProcessData, fieldKey = _a.fieldKey, _b = _a.configurable, configurable = _b === void 0 ? false : _b, _c = _a.isTemporary, isTemporary = _c === void 0 ? false : _c, rulesByField = _a.rulesByField, onConfigure = _a.onConfigure;
    var t = (0, macro_1.useLingui)().t;
    var configureField = function (field, label, defaultValue, returnType) {
        if (!configurable || isTemporary || !onConfigure)
            return undefined;
        var key = fieldKey(field);
        return function () {
            var _a;
            return onConfigure({
                label: label,
                field: key,
                code: (_a = rulesByField.get(key)) === null || _a === void 0 ? void 0 : _a.code,
                defaultValue: defaultValue,
                returnType: returnType
            });
        };
    };
    var sections = (0, react_1.useMemo)(function () {
        var _a, _b, _c, _d, _e, _f;
        var key = fieldKey;
        return [
            {
                id: "setup",
                label: <macro_1.Trans>Setup</macro_1.Trans>,
                accessibilityLabel: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Setup"], ["Setup"]))),
                icon: <components_1.TimeTypeIcon type="Setup"/>,
                summary: ((_a = processData.setupTime) !== null && _a !== void 0 ? _a : 0) > 0
                    ? (0, index_1.formatOperationTabSummary)(processData.setupTime, processData.setupUnit)
                    : undefined,
                summaryTitle: ((_b = processData.setupTime) !== null && _b !== void 0 ? _b : 0) > 0
                    ? "".concat(processData.setupTime, " ").concat(processData.setupUnit)
                    : undefined,
                content: (<>
            <Form_1.UnitHint name="setupHint" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Setup"], ["Setup"])))} value={processData.setupUnitHint} onChange={function (hint) {
                        setProcessData(function (d) { return (__assign(__assign({}, d), { setupUnitHint: hint, setupUnit: hint === "Fixed" ? "Total Minutes" : "Minutes/Piece" })); });
                    }}/>
            <Form_1.NumberControlled name="setupTime" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Setup Time"], ["Setup Time"])))} isOptional={false} minValue={0} value={processData.setupTime} onChange={function (newValue) {
                        return setProcessData(function (d) { return (__assign(__assign({}, d), { setupTime: newValue })); });
                    }} isConfigured={rulesByField.has(key("setupTime"))} onConfigure={configureField("setupTime", t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Setup Time"], ["Setup Time"]))), processData.setupTime, { type: "numeric" })}/>
            <Form_1.StandardFactor name="setupUnit" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Setup Unit"], ["Setup Unit"])))} isOptional={false} hint={processData.setupUnitHint} value={processData.setupUnit} onChange={function (newValue) {
                        setProcessData(function (d) {
                            var _a;
                            return (__assign(__assign({}, d), { setupUnit: (_a = newValue === null || newValue === void 0 ? void 0 : newValue.value) !== null && _a !== void 0 ? _a : "Total Minutes" }));
                        });
                    }} isConfigured={rulesByField.has(key("setupUnit"))} onConfigure={configureField("setupUnit", t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Setup Unit"], ["Setup Unit"]))), processData.setupUnit, { type: "enum", listOptions: __spreadArray([], shared_1.standardFactorType, true) })}/>
          </>)
            },
            {
                id: "labor",
                label: <macro_1.Trans>Labor</macro_1.Trans>,
                accessibilityLabel: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Labor"], ["Labor"]))),
                icon: <components_1.TimeTypeIcon type="Labor"/>,
                summary: ((_c = processData.laborTime) !== null && _c !== void 0 ? _c : 0) > 0
                    ? (0, index_1.formatOperationTabSummary)(processData.laborTime, processData.laborUnit)
                    : undefined,
                summaryTitle: ((_d = processData.laborTime) !== null && _d !== void 0 ? _d : 0) > 0
                    ? "".concat(processData.laborTime, " ").concat(processData.laborUnit)
                    : undefined,
                content: (<>
            <Form_1.UnitHint name="laborHint" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Labor"], ["Labor"])))} value={processData.laborUnitHint} onChange={function (hint) {
                        setProcessData(function (d) { return (__assign(__assign({}, d), { laborUnitHint: hint, laborUnit: hint === "Fixed" ? "Total Minutes" : "Minutes/Piece" })); });
                    }}/>
            <Form_1.NumberControlled name="laborTime" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Labor Time"], ["Labor Time"])))} isOptional={false} minValue={0} value={processData.laborTime} onChange={function (newValue) {
                        return setProcessData(function (d) { return (__assign(__assign({}, d), { laborTime: newValue })); });
                    }} isConfigured={rulesByField.has(key("laborTime"))} onConfigure={configureField("laborTime", t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Labor Time"], ["Labor Time"]))), processData.laborTime, { type: "numeric" })}/>
            <Form_1.StandardFactor name="laborUnit" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Labor Unit"], ["Labor Unit"])))} isOptional={false} hint={processData.laborUnitHint} value={processData.laborUnit} onChange={function (newValue) {
                        setProcessData(function (d) {
                            var _a;
                            return (__assign(__assign({}, d), { laborUnit: (_a = newValue === null || newValue === void 0 ? void 0 : newValue.value) !== null && _a !== void 0 ? _a : "Total Minutes" }));
                        });
                    }} isConfigured={rulesByField.has(key("laborUnit"))} onConfigure={configureField("laborUnit", t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Labor Unit"], ["Labor Unit"]))), processData.laborUnit, { type: "enum", listOptions: __spreadArray([], shared_1.standardFactorType, true) })}/>
          </>)
            },
            {
                id: "machine",
                label: <macro_1.Trans>Machine</macro_1.Trans>,
                accessibilityLabel: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Machine"], ["Machine"]))),
                icon: <components_1.TimeTypeIcon type="Machine"/>,
                summary: ((_e = processData.machineTime) !== null && _e !== void 0 ? _e : 0) > 0
                    ? (0, index_1.formatOperationTabSummary)(processData.machineTime, processData.machineUnit)
                    : undefined,
                summaryTitle: ((_f = processData.machineTime) !== null && _f !== void 0 ? _f : 0) > 0
                    ? "".concat(processData.machineTime, " ").concat(processData.machineUnit)
                    : undefined,
                content: (<>
            <Form_1.UnitHint name="machineHint" label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Machine"], ["Machine"])))} value={processData.machineUnitHint} onChange={function (hint) {
                        setProcessData(function (d) { return (__assign(__assign({}, d), { machineUnitHint: hint, machineUnit: hint === "Fixed" ? "Total Minutes" : "Minutes/Piece" })); });
                    }}/>
            <Form_1.NumberControlled name="machineTime" label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Machine Time"], ["Machine Time"])))} isOptional={false} minValue={0} value={processData.machineTime} onChange={function (newValue) {
                        return setProcessData(function (d) { return (__assign(__assign({}, d), { machineTime: newValue })); });
                    }} isConfigured={rulesByField.has(key("machineTime"))} onConfigure={configureField("machineTime", t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Machine Time"], ["Machine Time"]))), processData.machineTime, { type: "numeric" })}/>
            <Form_1.StandardFactor name="machineUnit" label={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Machine Unit"], ["Machine Unit"])))} isOptional={false} hint={processData.machineUnitHint} value={processData.machineUnit} onChange={function (newValue) {
                        setProcessData(function (d) {
                            var _a;
                            return (__assign(__assign({}, d), { machineUnit: (_a = newValue === null || newValue === void 0 ? void 0 : newValue.value) !== null && _a !== void 0 ? _a : "Total Minutes" }));
                        });
                    }} isConfigured={rulesByField.has(key("machineUnit"))} onConfigure={configureField("machineUnit", t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Machine Unit"], ["Machine Unit"]))), processData.machineUnit, { type: "enum", listOptions: __spreadArray([], shared_1.standardFactorType, true) })}/>
          </>)
            },
            {
                id: "procedure",
                label: <macro_1.Trans>Procedure</macro_1.Trans>,
                accessibilityLabel: t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Procedure"], ["Procedure"]))),
                icon: <lu_1.LuListChecks className="h-4 w-4"/>,
                summary: processData.procedureId ? t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Procedure"], ["Procedure"]))) : undefined,
                contentClassName: "grid w-full grid-cols-1 gap-x-8 gap-y-4 px-4 pb-4 pt-4",
                content: (<Procedure_1.default name="procedureId" label={t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Procedure"], ["Procedure"])))} processId={processData.processId} value={processData.procedureId} isConfigured={rulesByField.has(key("procedureId"))} onConfigure={configureField("procedureId", t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Procedure"], ["Procedure"]))), processData.procedureId, {
                        type: "text",
                        helperText: "the unique identifier for the procedure. you can get this from the URL when editing a procedure"
                    })} onChange={function (value) {
                        setProcessData(function (d) { return (__assign(__assign({}, d), { procedureId: value === null || value === void 0 ? void 0 : value.value })); });
                    }}/>)
            }
        ];
    }, [fieldKey, processData, rulesByField, setProcessData, t]);
    return <index_1.OperationDetailTabs sections={sections}/>;
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22;
