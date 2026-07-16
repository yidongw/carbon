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
exports.normalizeUniqueLineTypes = normalizeUniqueLineTypes;
exports.getConfigFromEditableLine = getConfigFromEditableLine;
exports.ProductionQuantityLinesEditor = ProductionQuantityLinesEditor;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var ScrapReason_1 = require("~/components/Form/ScrapReason");
var configParamsTableColumns_1 = require("~/modules/production/configParamsTableColumns");
var jobConfiguration_1 = require("~/modules/production/jobConfiguration");
var ConfigParamsTableModal_1 = require("./ConfigParamsTableModal");
var ItemConfigQuantityInput_1 = require("./ItemConfigQuantityInput");
var ALL_QUANTITY_LINE_TYPES = [
    "Production",
    "Rework",
    "Scrap"
];
function normalizeUniqueLineTypes(lines) {
    var used = new Set();
    return lines.map(function (line) {
        if (!used.has(line.type)) {
            used.add(line.type);
            return line;
        }
        var free = ALL_QUANTITY_LINE_TYPES.find(function (t) { return !used.has(t); });
        if (!free) {
            used.add(line.type);
            return line;
        }
        used.add(free);
        return __assign(__assign({}, line), { type: free, scrapReasonId: free === "Scrap" ? line.scrapReasonId : undefined });
    });
}
function getConfigFromEditableLine(line) {
    if (!line.configuration || typeof line.configuration !== "object") {
        return undefined;
    }
    return line.configuration;
}
function buildReferenceContextForLine(line, lineKey, lines, configReferenceContext, employeeId) {
    if (!configReferenceContext)
        return undefined;
    if (configReferenceContext.originalConfiguration != null) {
        return {
            mode: line.type === "Production" ? "original" : "remaining",
            originalConfiguration: configReferenceContext.originalConfiguration,
            otherLineConfigurations: lines
                .filter(function (l) { return l.key !== lineKey; })
                .map(function (l) { return getConfigFromEditableLine(l); })
                .filter(function (config) { return config !== undefined; })
        };
    }
    if (configReferenceContext.configReferenceSource) {
        var siblingLineConfigurations = lines
            .filter(function (line) { return line.key !== lineKey; })
            .map(function (line) { return getConfigFromEditableLine(line); })
            .filter(function (config) { return config !== undefined; });
        return (0, configParamsTableColumns_1.buildProductionConfigTableReferenceContext)({
            source: configReferenceContext.configReferenceSource,
            employeeId: employeeId,
            siblingLineConfigurations: siblingLineConfigurations
        });
    }
    return undefined;
}
function ProductionQuantityLinesEditor(_a) {
    var lines = _a.lines, setLines = _a.setLines, configurationParameters = _a.configurationParameters, itemId = _a.itemId, _b = _a.isDisabled, isDisabled = _b === void 0 ? false : _b, configReferenceContext = _a.configReferenceContext, configReferenceSource = _a.configReferenceSource, employeeId = _a.employeeId, jobId = _a.jobId, jobOperationId = _a.jobOperationId;
    var t = (0, macro_1.useLingui)().t;
    var scrapReasonOptions = (0, ScrapReason_1.useScrapReasons)();
    var scrapOptions = (0, react_2.useMemo)(function () {
        return scrapReasonOptions.map(function (o) { return ({
            value: o.value,
            label: typeof o.label === "string" ? o.label : String(o.label)
        }); });
    }, [scrapReasonOptions]);
    var updateLine = (0, react_2.useCallback)(function (key, patch) {
        setLines(function (prev) {
            return prev.map(function (line) { return (line.key === key ? __assign(__assign({}, line), patch) : line); });
        });
    }, [setLines]);
    var lineConfigModal = (0, ConfigParamsTableModal_1.useConfigTableModal)();
    var openLineConfig = (0, react_2.useCallback)(function (lineKey) {
        if (!itemId)
            return;
        var line = lines.find(function (l) { return l.key === lineKey; });
        if (!line)
            return;
        lineConfigModal.open({
            itemId: itemId,
            configuration: getConfigFromEditableLine(line),
            jobId: jobId,
            jobOperationId: jobOperationId,
            reportKind: "productionQuantity",
            // Report config uses the flat one-row-per-color/size editor (multiple
            // rows per cell), which also captures the raw cut breakdown.
            splitMode: true,
            // Production reports what's planned/remaining per color/size, so seed the
            // cells from the reference. Scrap/Rework start empty (you don't scrap the
            // whole remaining by default).
            prefillFromReference: line.type === "Production",
            // Built from the source the modal fetches for this operation (or the
            // in-memory original config for the "original" reference mode).
            buildReferenceContext: function (source) {
                return buildReferenceContextForLine(line, lineKey, lines, (configReferenceContext === null || configReferenceContext === void 0 ? void 0 : configReferenceContext.originalConfiguration) != null
                    ? {
                        originalConfiguration: configReferenceContext.originalConfiguration
                    }
                    : { configReferenceSource: source }, employeeId);
            },
            onConfirm: function (data) {
                return updateLine(lineKey, {
                    configuration: data.configuration,
                    quantity: data.total > 0 ? data.total : line.quantity
                });
            }
        });
    }, [
        configReferenceContext,
        employeeId,
        itemId,
        jobId,
        jobOperationId,
        lines,
        lineConfigModal,
        updateLine
    ]);
    var addLine = function () {
        var nextType = ALL_QUANTITY_LINE_TYPES.find(function (t) { return !lines.some(function (l) { return l.type === t; }); });
        if (!nextType)
            return;
        setLines(function (prev) { return __spreadArray(__spreadArray([], prev, true), [
            {
                key: "new-".concat(Date.now()),
                type: nextType,
                quantity: 0
            }
        ], false); });
    };
    var hasZeroQuantityLine = lines.some(function (line) { return line.quantity <= 0; });
    var canAddLine = lines.length < ALL_QUANTITY_LINE_TYPES.length && !hasZeroQuantityLine;
    var removeLine = function (key) {
        setLines(function (prev) {
            return prev.length <= 1 ? prev : prev.filter(function (l) { return l.key !== key; });
        });
    };
    var showConfig = Boolean((configurationParameters === null || configurationParameters === void 0 ? void 0 : configurationParameters.length) && itemId);
    return (<react_1.VStack className="w-full items-stretch gap-3">
      {lines.map(function (line) {
            var _a;
            var cfg = getConfigFromEditableLine(line);
            var configTotal = (0, jobConfiguration_1.computeJobConfigTableTotal)(cfg);
            return (<div key={line.key} className="flex w-full min-w-0 flex-col gap-2 rounded-md border border-border px-3 py-2">
            <react_1.HStack className="w-full min-w-0 items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <react_1.Select disabled={showConfig ? isDisabled : false} value={line.type} onValueChange={function (value) {
                    return updateLine(line.key, {
                        type: value,
                        scrapReasonId: value === "Scrap" ? line.scrapReasonId : undefined
                    });
                }}>
                  <react_1.SelectTrigger className="w-full max-w-full">
                    <react_1.SelectValue />
                  </react_1.SelectTrigger>
                  <react_1.SelectContent>
                    <react_1.SelectItem value="Production" disabled={line.type !== "Production" &&
                    lines.some(function (l) { return l.key !== line.key && l.type === "Production"; })}>
                      <macro_1.Trans>Production</macro_1.Trans>
                    </react_1.SelectItem>
                    <react_1.SelectItem value="Rework" disabled={line.type !== "Rework" &&
                    lines.some(function (l) { return l.key !== line.key && l.type === "Rework"; })}>
                      <macro_1.Trans>Rework</macro_1.Trans>
                    </react_1.SelectItem>
                    <react_1.SelectItem value="Scrap" disabled={line.type !== "Scrap" &&
                    lines.some(function (l) { return l.key !== line.key && l.type === "Scrap"; })}>
                      <macro_1.Trans>Scrap</macro_1.Trans>
                    </react_1.SelectItem>
                  </react_1.SelectContent>
                </react_1.Select>
              </div>
              <react_1.IconButton type="button" variant="ghost" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Remove line"], ["Remove line"])))} icon={<lu_1.LuTrash2 />} isDisabled={isDisabled || lines.length <= 1} onClick={function () { return removeLine(line.key); }} className="transition-transform active:scale-[0.96]"/>
            </react_1.HStack>
            <ItemConfigQuantityInput_1.ItemConfigQuantityInput id={"qty-".concat(line.key)} label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Quantity"], ["Quantity"])))} value={line.quantity} onChange={function (quantity) { return updateLine(line.key, { quantity: quantity }); }} minValue={0} isDisabled={showConfig ? isDisabled : false} isReadOnly={configTotal > 0} hasConfigurationParameters={showConfig} onOpenConfigTable={showConfig && !isDisabled
                    ? function () { return openLineConfig(line.key); }
                    : undefined} configTableTotal={configTotal} openConfigAccessibilityLabel={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Edit configuration"], ["Edit configuration"])))}/>
            {line.type === "Scrap" ? (<react_1.VStack className="w-full min-w-0 gap-1">
                <react_1.Label>{t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Scrap reason"], ["Scrap reason"])))}</react_1.Label>
                <react_1.Select disabled={isDisabled} value={(_a = line.scrapReasonId) !== null && _a !== void 0 ? _a : "__unset__"} onValueChange={function (value) {
                        return updateLine(line.key, {
                            scrapReasonId: value === "__unset__" ? undefined : value
                        });
                    }}>
                  <react_1.SelectTrigger className="w-full max-w-full">
                    <react_1.SelectValue placeholder={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Select scrap reason"], ["Select scrap reason"])))}/>
                  </react_1.SelectTrigger>
                  <react_1.SelectContent>
                    <react_1.SelectItem value="__unset__">
                      <macro_1.Trans>Select scrap reason</macro_1.Trans>
                    </react_1.SelectItem>
                    {scrapOptions.map(function (opt) { return (<react_1.SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </react_1.SelectItem>); })}
                  </react_1.SelectContent>
                </react_1.Select>
              </react_1.VStack>) : null}
          </div>);
        })}
      {canAddLine ? (<react_1.Button type="button" variant="secondary" size="sm" isDisabled={showConfig ? isDisabled : false} onClick={addLine} className="transition-transform active:scale-[0.96]">
          <lu_1.LuPlus className="mr-1.5 h-4 w-4"/>
          <macro_1.Trans>Add line</macro_1.Trans>
        </react_1.Button>) : null}
      {lineConfigModal.node}
    </react_1.VStack>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
