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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var Form_1 = require("~/components/Form");
var ScrapReason_1 = require("~/components/Form/ScrapReason");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var configParamsTableColumns_1 = require("../../configParamsTableColumns");
var jobConfiguration_1 = require("../../jobConfiguration");
var production_models_1 = require("../../production.models");
var ConfigParamsTableModal_1 = require("./ConfigParamsTableModal");
var ProductionActorFields_1 = require("./ProductionActorFields");
var ProductionQuantityLinesEditor_1 = require("./ProductionQuantityLinesEditor");
var productionFormCascade_1 = require("./productionFormCascade");
var QuantityWithConfigTable_1 = require("./QuantityWithConfigTable");
var SupplierSubcontractPricingFields_1 = require("./SupplierSubcontractPricingFields");
var useProductionJobPicker_1 = require("./useProductionJobPicker");
function getInitialConfigState(configuration) {
    if (configuration === null ||
        configuration === undefined ||
        typeof configuration !== "object" ||
        Array.isArray(configuration)) {
        return {
            rows: null,
            primaryKeys: [],
            total: 0
        };
    }
    var cfg = configuration;
    var rows = Array.isArray(cfg.configTable)
        ? cfg.configTable
        : null;
    var primaryKeys = Array.isArray(cfg.configTablePrimaryKeys)
        ? cfg.configTablePrimaryKeys.filter(function (k) { return typeof k === "string"; })
        : [];
    return {
        rows: rows,
        primaryKeys: primaryKeys,
        total: (0, jobConfiguration_1.computeJobConfigTableTotal)(cfg)
    };
}
function toEditableLines(input) {
    return input.map(function (l, i) { return (__assign(__assign({}, l), { key: "line-".concat(i, "-").concat(Math.random().toString(36).slice(2, 9)) })); });
}
function isCreateMultiLineInitial(v) {
    return (!("id" in v && v.id) &&
        "lines" in v &&
        Array.isArray(v.lines));
}
var ProductionQuantityForm = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h;
    var initialValues = _a.initialValues, _j = _a.operationOptions, operationOptions = _j === void 0 ? [] : _j, jobOptions = _a.jobOptions, remainingByOperationId = _a.remainingByOperationId, configurationParameters = _a.configurationParameters, configReferenceSource = _a.configReferenceSource, itemId = _a.itemId, jobIdProp = _a.jobId, processId = _a.processId, operationType = _a.operationType, defaultActorKind = _a.defaultActorKind, _l = _a.lockJobSelection, lockJobSelectionProp = _l === void 0 ? false : _l, lockActorSelectionProp = _a.lockActorSelection, _m = _a.lockOperationSelection, lockOperationSelectionProp = _m === void 0 ? false : _m, onDismiss = _a.onDismiss, formAction = _a.action, fetcher = _a.fetcher;
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var hasJobPicker = Boolean(jobOptions === null || jobOptions === void 0 ? void 0 : jobOptions.length);
    var jobPicker = (0, useProductionJobPicker_1.useProductionJobPicker)({
        enabled: hasJobPicker,
        loaderPath: path_1.path.to.newProductionQuantity,
        jobIdProp: jobIdProp,
        operationOptions: operationOptions,
        configurationParameters: configurationParameters,
        configReferenceSource: configReferenceSource,
        itemId: itemId,
        processId: processId,
        operationType: operationType,
        defaultActorKind: defaultActorKind,
        lockActorSelection: lockActorSelectionProp
    });
    var selectedJobId = hasJobPicker
        ? jobPicker.selectedJobId
        : ((_b = jobIdProp === null || jobIdProp === void 0 ? void 0 : jobIdProp.trim()) !== null && _b !== void 0 ? _b : "");
    var jobId = selectedJobId || (jobIdProp === null || jobIdProp === void 0 ? void 0 : jobIdProp.trim()) || undefined;
    var seededFormJobId = (jobIdProp === null || jobIdProp === void 0 ? void 0 : jobIdProp.trim()) || "";
    var isEditing = Boolean("id" in initialValues &&
        initialValues.id != null &&
        String(initialValues.id).trim() !== "");
    var isCreateMultiLine = !isEditing && isCreateMultiLineInitial(initialValues);
    var isDisabled = isEditing
        ? !permissions.can("update", "production")
        : !permissions.can("create", "production");
    var _o = (0, react_2.useState)(isCreateMultiLine
        ? "Production"
        : initialValues.type), type = _o[0], setType = _o[1];
    var _p = (0, react_2.useState)(isCreateMultiLine
        ? 0
        : ((_c = initialValues
            .quantity) !== null && _c !== void 0 ? _c : 0)), quantity = _p[0], setQuantity = _p[1];
    var initialConfig = isCreateMultiLine
        ? {
            rows: null,
            primaryKeys: [],
            total: 0
        }
        : getInitialConfigState(initialValues
            .configuration);
    var _q = (0, react_2.useState)(initialConfig.rows), configTableRows = _q[0], setConfigTableRows = _q[1];
    var _r = (0, react_2.useState)(initialConfig.primaryKeys), configTablePrimaryKeys = _r[0], setConfigTablePrimaryKeys = _r[1];
    var _s = (0, react_2.useState)(initialConfig.total), configTableTotal = _s[0], setConfigTableTotal = _s[1];
    var formBodyRef = (0, react_2.useRef)(null);
    var _t = (0, react_2.useState)(function () {
        if (isCreateMultiLineInitial(initialValues)) {
            return (0, ProductionQuantityLinesEditor_1.normalizeUniqueLineTypes)(toEditableLines(initialValues.lines));
        }
        return [];
    }), lines = _t[0], setLines = _t[1];
    var hasConfigurationParameters = ((_e = (_d = jobPicker.configurationParameters) === null || _d === void 0 ? void 0 : _d.length) !== null && _e !== void 0 ? _e : 0) > 0;
    var hasZeroQuantityLine = isCreateMultiLine && lines.some(function (line) { return line.quantity <= 0; });
    var linesJsonForForm = (0, react_2.useMemo)(function () {
        if (!isCreateMultiLine)
            return "";
        return JSON.stringify(lines.map(function (_a) {
            var _k = _a.key, line = __rest(_a, ["key"]);
            return (__assign(__assign({}, line), { scrapReasonId: line.type === "Scrap" ? line.scrapReasonId : undefined }));
        }));
    }, [isCreateMultiLine, lines]);
    var _u = (0, react_2.useState)(function () {
        var _a;
        if (isCreateMultiLineInitial(initialValues)) {
            return initialValues
                .jobOperationId;
        }
        return ((_a = initialValues
            .jobOperationId) !== null && _a !== void 0 ? _a : "");
    }), jobOperationIdState = _u[0], setJobOperationIdState = _u[1];
    var _v = (0, react_2.useState)(0), operationSelectKey = _v[0], setOperationSelectKey = _v[1];
    var resetQuantityEntry = function (initialQuantity) {
        if (initialQuantity === void 0) { initialQuantity = 0; }
        if (isCreateMultiLine) {
            setLines((0, ProductionQuantityLinesEditor_1.normalizeUniqueLineTypes)(toEditableLines([
                { type: "Production", quantity: initialQuantity }
            ])));
            return;
        }
        setQuantity(initialQuantity);
        setConfigTableRows(null);
        setConfigTablePrimaryKeys([]);
        setConfigTableTotal(0);
    };
    (0, react_2.useEffect)(function () {
        var focusFirstField = function () {
            var _a;
            var root = formBodyRef.current;
            if (!root)
                return;
            var combobox = root.querySelector('button[role="combobox"]:not([disabled])');
            if (combobox) {
                combobox.focus();
                return;
            }
            (_a = root
                .querySelector('input:not([type="hidden"]):not([disabled])')) === null || _a === void 0 ? void 0 : _a.focus();
        };
        var frame = requestAnimationFrame(focusFirstField);
        return function () { return cancelAnimationFrame(frame); };
    }, []);
    var handleConfigTableSubmit = function (rows, total, primaryKeys) {
        setConfigTableRows(rows);
        setConfigTablePrimaryKeys(primaryKeys);
        setConfigTableTotal(total);
        if (total > 0) {
            setQuantity(total);
        }
    };
    var configModal = (0, ConfigParamsTableModal_1.useConfigTableModal)();
    var openConfigTable = function () {
        if (!jobPicker.itemId)
            return;
        configModal.open({
            itemId: jobPicker.itemId,
            configuration: (0, ConfigParamsTableModal_1.toConfigTableValue)(configTableRows, configTablePrimaryKeys, initialValues
                .configuration),
            jobId: jobId !== null && jobId !== void 0 ? jobId : undefined,
            jobOperationId: jobOperationIdState || undefined,
            reportKind: "productionQuantity",
            splitMode: true,
            isEditingReport: isEditing,
            buildReferenceContext: function (source) {
                return (0, configParamsTableColumns_1.buildProductionConfigTableReferenceContext)({
                    source: source !== null && source !== void 0 ? source : undefined,
                    employeeId: actorKind === "employee" ? employeeId : undefined
                });
            },
            onConfirm: function (data) {
                return handleConfigTableSubmit(data.configuration.configTable, data.total, data.primaryKeys);
            }
        });
    };
    var createDefaultValues = (0, react_2.useMemo)(function () {
        var _a;
        if (!isCreateMultiLine)
            return undefined;
        var init = initialValues;
        var operationId = jobOperationIdState || init.jobOperationId || "";
        return __assign(__assign(__assign({}, (hasJobPicker && seededFormJobId ? { jobId: seededFormJobId } : {})), (operationId ? { jobOperationId: operationId } : {})), { notes: (_a = init.notes) !== null && _a !== void 0 ? _a : "", lines: JSON.stringify((0, ProductionQuantityLinesEditor_1.normalizeUniqueLineTypes)(toEditableLines(init.lines)).map(function (_a) {
                var _k = _a.key, l = __rest(_a, ["key"]);
                return l;
            })) });
    }, [
        isCreateMultiLine,
        initialValues,
        hasJobPicker,
        seededFormJobId,
        jobOperationIdState
    ]);
    var editDefaultValues = (0, react_2.useMemo)(function () {
        if (isCreateMultiLine)
            return undefined;
        var values = initialValues;
        var _ak = values.actorKind, _eid = values.employeeId, _spid = values.supplierProcessId, _sid = values.supplierId, rest = __rest(values, ["actorKind", "employeeId", "supplierProcessId", "supplierId"]);
        return __assign(__assign({}, rest), { productionActorSelection: (0, ProductionActorFields_1.selectionFromInitialValues)({
                employeeId: values.employeeId,
                supplierProcessId: values.supplierProcessId
            }) });
    }, [isCreateMultiLine, initialValues]);
    var actorFieldValues = (0, react_2.useMemo)(function () {
        var _a, _b;
        if (isCreateMultiLine) {
            var init = initialValues;
            return {
                employeeId: init.employeeId,
                supplierProcessId: init.supplierProcessId,
                actorKind: (_a = init.actorKind) !== null && _a !== void 0 ? _a : defaultActorKind
            };
        }
        var values = initialValues;
        return {
            employeeId: values.employeeId,
            supplierProcessId: values.supplierProcessId,
            supplierId: values.supplierId,
            actorKind: (_b = values.actorKind) !== null && _b !== void 0 ? _b : defaultActorKind
        };
    }, [isCreateMultiLine, initialValues, defaultActorKind]);
    var _w = (0, react_2.useState)(function () {
        var _a, _b;
        return ((_b = (_a = actorFieldValues.actorKind) !== null && _a !== void 0 ? _a : defaultActorKind) !== null && _b !== void 0 ? _b : "employee");
    }), actorKind = _w[0], setActorKind = _w[1];
    var _x = (0, react_2.useState)(function () { var _a; return (_a = actorFieldValues.employeeId) !== null && _a !== void 0 ? _a : ""; }), employeeId = _x[0], setEmployeeId = _x[1];
    var _y = (0, react_2.useState)(function () { var _a; return (_a = actorFieldValues.supplierProcessId) !== null && _a !== void 0 ? _a : ""; }), supplierProcessId = _y[0], setSupplierProcessId = _y[1];
    (0, react_2.useEffect)(function () {
        var _a, _b;
        setEmployeeId((_a = actorFieldValues.employeeId) !== null && _a !== void 0 ? _a : "");
        setSupplierProcessId((_b = actorFieldValues.supplierProcessId) !== null && _b !== void 0 ? _b : "");
        if (actorFieldValues.actorKind) {
            setActorKind(actorFieldValues.actorKind);
        }
    }, [
        actorFieldValues.actorKind,
        actorFieldValues.employeeId,
        actorFieldValues.supplierProcessId
    ]);
    var actorSelection = (0, react_2.useMemo)(function () {
        return (0, ProductionActorFields_1.selectionFromInitialValues)({
            employeeId: employeeId,
            supplierProcessId: supplierProcessId
        });
    }, [employeeId, supplierProcessId]);
    var resetActorEntry = function () {
        if (lockActorSelectionProp)
            return;
        setEmployeeId("");
        setSupplierProcessId("");
        setActorKind((defaultActorKind !== null && defaultActorKind !== void 0 ? defaultActorKind : "employee"));
    };
    var handleJobChange = function (value) {
        queueMicrotask(function () {
            jobPicker.setSelectedJobId(value);
            setJobOperationIdState("");
            setOperationSelectKey(function (key) { return key + 1; });
            resetQuantityEntry();
            resetActorEntry();
        });
    };
    var isOperationPresetAndLocked = lockOperationSelectionProp &&
        Boolean(initialValues.jobOperationId) &&
        !isEditing;
    var effectiveJobOperationId = isOperationPresetAndLocked
        ? initialValues.jobOperationId
        : jobOperationIdState;
    var _z = (0, productionFormCascade_1.getProductionFormCascadeState)({
        isEditing: isEditing,
        hasJobPicker: hasJobPicker,
        selectedJobId: selectedJobId,
        jobOperationId: effectiveJobOperationId,
        actorSelection: actorSelection,
        permissionDisabled: isDisabled
    }), hasJobSelected = _z.hasJobSelected, hasOperationSelected = _z.hasOperationSelected, areDetailFieldsDisabled = _z.areDetailFieldsDisabled, canSubmitDetails = _z.canSubmitDetails;
    var canSubmitCreate = canSubmitDetails && !hasZeroQuantityLine;
    // Configured reports (e.g. master cutting) enter their quantity through the
    // config-table modal, and opening it only needs the job/item + operation —
    // not an actor. So surface the config quantity field + its modal trigger as
    // soon as the operation is picked, instead of waiting for an employee to be
    // selected (submitting still requires one). Plain-quantity reports keep the
    // stricter `areDetailFieldsDisabled` gate.
    var configFieldsDisabled = isDisabled || !hasJobSelected || !hasOperationSelected;
    // Plain-quantity reports (bundles / non-configured items) show the operation's
    // remaining (target − reported) and can't exceed it. Configured reports are
    // handled per color/size by the config editor instead.
    // NOTE: `Number` is shadowed by the imported `<Number>` form field, so we use
    // globals here (`Infinity`, unary `+`) — calling `Number(...)` would hit the
    // component and throw "Number is not a function".
    var operationRemaining = (_f = remainingByOperationId === null || remainingByOperationId === void 0 ? void 0 : remainingByOperationId[effectiveJobOperationId]) !== null && _f !== void 0 ? _f : Infinity;
    var reportedTotal = isCreateMultiLine
        ? lines.reduce(function (sum, line) { return sum + (+line.quantity || 0); }, 0)
        : +quantity || 0;
    var showRemaining = !isEditing && !hasConfigurationParameters && operationRemaining !== Infinity;
    var remaining = operationRemaining - reportedTotal;
    var exceedsRemaining = showRemaining && remaining < 0;
    var lockActorSelection = isEditing ||
        Boolean(jobPicker.lockActorSelection || lockActorSelectionProp) ||
        Boolean(((_g = actorFieldValues.employeeId) !== null && _g !== void 0 ? _g : "").trim() ||
            ((_h = actorFieldValues.supplierProcessId) !== null && _h !== void 0 ? _h : "").trim());
    return (<>
      <form_1.ValidatedForm validator={isCreateMultiLine
            ? production_models_1.productionQuantityCreateFormValidator
            : production_models_1.productionQuantityValidator} method="post" defaultValues={isCreateMultiLine ? createDefaultValues : editDefaultValues} className="flex h-full flex-col" action={formAction} fetcher={fetcher}>
        <react_1.DrawerHeader>
          <react_1.DrawerTitle>
            {isEditing ? (<macro_1.Trans>Edit Process Completion</macro_1.Trans>) : (<macro_1.Trans>Create Process Completion</macro_1.Trans>)}
          </react_1.DrawerTitle>
        </react_1.DrawerHeader>
        <react_1.DrawerBody>
          {isEditing ? <Form_1.Hidden name="id"/> : null}
          <react_1.VStack ref={formBodyRef} spacing={4}>
            {hasJobPicker && !isEditing ? (<Form_1.Select name="jobId" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Job"], ["Job"])))} options={jobOptions !== null && jobOptions !== void 0 ? jobOptions : []} isDisabled={lockJobSelectionProp} onChange={function (newValue) {
                if (newValue === null || newValue === void 0 ? void 0 : newValue.value)
                    handleJobChange(newValue.value);
            }}/>) : null}
            {isEditing ? (<Form_1.Hidden name="jobOperationId"/>) : (<Form_1.Select key={hasJobPicker ? "op-".concat(operationSelectKey) : "job-operation"} name="jobOperationId" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Operation"], ["Operation"])))} options={jobPicker.operationOptions} isDisabled={lockOperationSelectionProp ||
                (hasJobPicker && !hasJobSelected) ||
                jobPicker.isCascadeLoading} onChange={function (value) {
                var _a, _b;
                if (lockOperationSelectionProp)
                    return;
                var nextOperationId = (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : "";
                setJobOperationIdState(nextOperationId);
                resetQuantityEntry((_b = remainingByOperationId === null || remainingByOperationId === void 0 ? void 0 : remainingByOperationId[nextOperationId]) !== null && _b !== void 0 ? _b : 0);
            }}/>)}
            <ProductionActorFields_1.ProductionActorFields processId={jobPicker.processId} operationType={jobPicker.operationType} defaultActorKind={jobPicker.defaultActorKind} lockActorSelection={lockActorSelection} isDisabled={!hasOperationSelected} employeeIdValue={actorFieldValues.employeeId} supplierProcessIdValue={actorFieldValues.supplierProcessId} supplierIdValue={actorFieldValues.supplierId} onActorKindChange={setActorKind} onEmployeeChange={setEmployeeId} onSupplierProcessChange={setSupplierProcessId}/>

            {isCreateMultiLine &&
            actorKind === "supplier" &&
            jobOperationIdState &&
            supplierProcessId ? (<SupplierSubcontractPricingFields_1.SupplierSubcontractPricingFields jobOperationId={jobOperationIdState} supplierProcessId={supplierProcessId} isDisabled={areDetailFieldsDisabled}/>) : null}

            {isCreateMultiLine ? (<>
                <Form_1.Hidden name="lines" value={linesJsonForForm}/>
                <ProductionQuantityLinesEditor_1.ProductionQuantityLinesEditor lines={lines} setLines={setLines} configurationParameters={jobPicker.configurationParameters} configReferenceSource={jobPicker.configReferenceSource} itemId={jobPicker.itemId} 
        // Configured reports enter their quantity through the config
        // table, which only needs the job/item + operation — so let it
        // open before an actor is picked. Plain-quantity reports keep
        // the stricter gate (need an actor before entering anything).
        isDisabled={hasConfigurationParameters
                ? configFieldsDisabled
                : areDetailFieldsDisabled} employeeId={actorKind === "employee" ? employeeId : undefined} jobId={jobId !== null && jobId !== void 0 ? jobId : undefined} jobOperationId={jobOperationIdState || undefined}/>
              </>) : (<>
                {configTableRows && (<Form_1.Hidden name="configuration" value={JSON.stringify({
                    configTable: configTableRows,
                    configTablePrimaryKeys: configTablePrimaryKeys
                })}/>)}
                {hasConfigurationParameters ? (<QuantityWithConfigTable_1.QuantityWithConfigTable name="quantity" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Quantity"], ["Quantity"])))} value={quantity} minValue={0} isDisabled={configFieldsDisabled} isReadOnly={configTableTotal > 0} configTableTotal={configTableTotal} hasConfigurationParameters onOpenConfigTable={configFieldsDisabled ? undefined : openConfigTable} onChange={setQuantity}/>) : (<Form_1.Number name="quantity" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Quantity"], ["Quantity"])))} isDisabled={areDetailFieldsDisabled}/>)}
                <Form_1.Select name="type" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Quantity Type"], ["Quantity Type"])))} options={[
                { label: "Production", value: "Production" },
                { label: "Scrap", value: "Scrap" },
                { label: "Rework", value: "Rework" }
            ]} onChange={function (value) {
                return setType(value === null || value === void 0 ? void 0 : value.value);
            }}/>
                {type === "Scrap" && (<ScrapReason_1.default name="scrapReasonId" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Scrap Reason"], ["Scrap Reason"])))}/>)}
              </>)}

            <Form_1.TextArea name="notes" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Notes"], ["Notes"])))} isDisabled={hasConfigurationParameters ? areDetailFieldsDisabled : false}/>
          </react_1.VStack>
        </react_1.DrawerBody>
        <react_1.DrawerFooter>
          <react_1.HStack className="w-full justify-between">
            {showRemaining ? (<react_1.HStack spacing={2}>
                <span className="text-sm text-muted-foreground">
                  <macro_1.Trans>Remaining</macro_1.Trans>:{" "}
                  <strong className={(0, react_1.cn)("tabular-nums", remaining < 0 ? "text-red-500" : "text-foreground")}>
                    {remaining}
                  </strong>
                </span>
                {remaining < 0 ? (<react_1.Badge variant="red">
                    <macro_1.Trans>Exceeds plan</macro_1.Trans>
                  </react_1.Badge>) : null}
              </react_1.HStack>) : (<span />)}
            <react_1.HStack className="gap-2">
              <Form_1.Submit isDisabled={isDisabled ||
            exceedsRemaining ||
            (isCreateMultiLine
                ? hasConfigurationParameters
                    ? !canSubmitCreate
                    : !hasOperationSelected || hasZeroQuantityLine
                : hasZeroQuantityLine)} className="transition-transform active:scale-[0.96]">
                <macro_1.Trans>Save</macro_1.Trans>
              </Form_1.Submit>
              <react_1.Button variant="solid" type="button" onClick={onDismiss} className="transition-transform active:scale-[0.96]">
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
            </react_1.HStack>
          </react_1.HStack>
        </react_1.DrawerFooter>
      </form_1.ValidatedForm>
      {configModal.node}
    </>);
};
exports.default = ProductionQuantityForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
