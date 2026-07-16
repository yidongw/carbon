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
exports.ConfiguratorModal = ConfiguratorModal;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var items_1 = require("~/stores/items");
var path_1 = require("~/utils/path");
function getParameterSchema(parameter) {
    switch (parameter.dataType) {
        case "numeric":
            return zod_form_data_1.zfd.numeric(zod_1.z.number({
                required_error: "".concat(parameter.label, " is required")
            }));
        case "text":
            return zod_1.z.string({
                required_error: "".concat(parameter.label, " is required")
            });
        case "list":
            return zod_1.z.enum(parameter.listOptions, {
                required_error: "".concat(parameter.label, " is required")
            });
        case "boolean":
            return zod_1.z.boolean();
        case "material":
            return zod_1.z.string({
                required_error: "".concat(parameter.label, " is required")
            });
        default:
            return zod_1.z.any();
    }
}
function generateConfigurationSchema(parameters) {
    var schemaFields = parameters.reduce(function (acc, parameter) {
        acc[parameter.key] = getParameterSchema(parameter);
        return acc;
    }, {});
    return zod_1.z.object(schemaFields);
}
function useMaterialsWithFilter(materialFormFilterId) {
    var _a;
    var allMaterials = (0, items_1.useMaterials)();
    var materialsFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        if (materialFormFilterId) {
            materialsFetcher.load(path_1.path.to.api.materials(materialFormFilterId));
        }
    });
    var materials = (0, react_2.useMemo)(function () {
        var _a;
        if (materialFormFilterId && ((_a = materialsFetcher.data) === null || _a === void 0 ? void 0 : _a.data)) {
            return materialsFetcher.data.data;
        }
        return allMaterials;
    }, [materialFormFilterId, (_a = materialsFetcher.data) === null || _a === void 0 ? void 0 : _a.data, allMaterials]);
    return materials;
}
function ParameterField(_a) {
    var _b;
    var parameter = _a.parameter;
    var t = (0, macro_1.useLingui)().t;
    var _c = useConfigurator(), formData = _c.formData, setFormData = _c.setFormData;
    var materials = useMaterialsWithFilter(parameter.materialFormFilterId);
    var handleChange = function (value) {
        var _a;
        setFormData(__assign(__assign({}, formData), (_a = {}, _a[parameter.key] = value, _a)));
    };
    switch (parameter.dataType) {
        case "numeric":
            return (<div className="space-y-2">
          <react_1.Label className="text-xs text-muted-foreground" htmlFor={parameter.key}>
            {parameter.label}
          </react_1.Label>
          <react_1.NumberField onChange={function (value) { return handleChange(Number(value)); }} value={formData[parameter.key]}>
            <react_1.NumberInputGroup className="relative">
              <react_1.NumberInput id={parameter.key}/>
              <react_1.NumberInputStepper>
                <react_1.NumberIncrementStepper>
                  <lu_1.LuChevronUp size="1em" strokeWidth="3"/>
                </react_1.NumberIncrementStepper>
                <react_1.NumberDecrementStepper>
                  <lu_1.LuChevronDown size="1em" strokeWidth="3"/>
                </react_1.NumberDecrementStepper>
              </react_1.NumberInputStepper>
            </react_1.NumberInputGroup>
          </react_1.NumberField>
        </div>);
        case "text":
            return (<div className="space-y-2">
          <react_1.Label className="text-xs text-muted-foreground" htmlFor={parameter.key}>
            {parameter.label}
          </react_1.Label>
          <react_1.Input id={parameter.key} type="text" value={formData[parameter.key] || ""} onChange={function (e) { return handleChange(e.target.value); }} className="w-full"/>
        </div>);
        case "list":
            return (<div className="space-y-2">
          <react_1.Label className="text-xs text-muted-foreground" htmlFor={parameter.key}>
            {parameter.label}
          </react_1.Label>
          <react_1.Select value={formData[parameter.key]} onValueChange={handleChange}>
            <react_1.SelectTrigger id={parameter.key}>
              <react_1.SelectValue placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Select an option"], ["Select an option"])))}/>
            </react_1.SelectTrigger>
            <react_1.SelectContent>
              {(_b = parameter.listOptions) === null || _b === void 0 ? void 0 : _b.map(function (option) { return (<react_1.SelectItem key={option} value={option}>
                  {option}
                </react_1.SelectItem>); })}
            </react_1.SelectContent>
          </react_1.Select>
        </div>);
        case "boolean":
            return (<div className="flex flex-col items-start gap-2">
          <react_1.Label className="text-xs text-muted-foreground" htmlFor={parameter.key}>
            {parameter.label}
          </react_1.Label>
          <react_1.Switch id={parameter.key} checked={formData[parameter.key] || false} onCheckedChange={handleChange}/>
        </div>);
        case "material":
            return (<div className="space-y-2">
          <react_1.Label className="text-xs text-muted-foreground" htmlFor={parameter.key}>
            {parameter.label}
          </react_1.Label>
          <react_1.Combobox id={parameter.key} options={materials.map(function (material) { return ({
                    label: material.name,
                    value: material.id,
                    helper: material.readableIdWithRevision
                }); })} value={formData[parameter.key]} onChange={function (value) { return handleChange(value); }}/>
        </div>);
        default:
            return null;
    }
}
var ConfiguratorContext = (0, react_2.createContext)(undefined);
function ConfiguratorProvider(_a) {
    var children = _a.children, totalSteps = _a.totalSteps, _b = _a.initialValues, initialValues = _b === void 0 ? {} : _b, _c = _a.destructive, destructive = _c === void 0 ? false : _c;
    var _d = (0, react_2.useState)(0), currentStep = _d[0], setCurrentStep = _d[1];
    var _e = (0, react_2.useState)(initialValues), formData = _e[0], setFormData = _e[1];
    var nextStep = function () {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(function (prev) { return prev + 1; });
        }
    };
    var previousStep = function () {
        if (currentStep > 0) {
            setCurrentStep(function (prev) { return prev - 1; });
        }
    };
    var goToStep = function (step) {
        if (step >= 0 && step < totalSteps) {
            setCurrentStep(step);
        }
    };
    return (<ConfiguratorContext.Provider value={{
            currentStep: currentStep,
            totalSteps: totalSteps,
            formData: formData,
            setFormData: setFormData,
            nextStep: nextStep,
            previousStep: previousStep,
            goToStep: goToStep,
            destructive: destructive
        }}>
      {children}
    </ConfiguratorContext.Provider>);
}
function useConfigurator() {
    var context = (0, react_2.useContext)(ConfiguratorContext);
    if (!context) {
        throw new Error("useConfigurator must be used within a ConfiguratorProvider");
    }
    return context;
}
function ConfiguratorFormContent(_a) {
    var groups = _a.groups, parameters = _a.parameters, onSubmit = _a.onSubmit, onGroupChange = _a.onGroupChange;
    var t = (0, macro_1.useLingui)().t;
    var _b = useConfigurator(), currentStep = _b.currentStep, totalSteps = _b.totalSteps, formData = _b.formData, nextStep = _b.nextStep, previousStep = _b.previousStep, destructive = _b.destructive;
    var groupedParameters = (0, react_2.useMemo)(function () {
        var sortedGroups = __spreadArray([], groups, true).sort(function (a, b) { return a.sortOrder - b.sortOrder; })
            .filter(function (group) {
            return parameters.some(function (p) { return p.configurationParameterGroupId === group.id; });
        });
        return sortedGroups.map(function (group) { return ({
            group: group,
            parameters: parameters
                .filter(function (p) { return p.configurationParameterGroupId === group.id; })
                .sort(function (a, b) { return a.sortOrder - b.sortOrder; })
        }); });
    }, [groups, parameters]);
    (0, react_2.useEffect)(function () {
        if (groupedParameters[currentStep]) {
            onGroupChange(groupedParameters[currentStep].group);
        }
    }, [currentStep, groupedParameters, onGroupChange]);
    var isStepValid = (0, react_2.useMemo)(function () {
        if (!groupedParameters[currentStep])
            return false;
        return groupedParameters[currentStep].parameters.every(function (parameter) {
            if (parameter.dataType === "boolean")
                return true;
            if (parameter.dataType === "numeric")
                return formData[parameter.key] !== undefined;
            return (formData[parameter.key] !== undefined && formData[parameter.key] !== "");
        });
    }, [currentStep, groupedParameters, formData]);
    var handleSubmit = function (e) {
        e.preventDefault();
        if (currentStep === totalSteps - 1) {
            var schema = generateConfigurationSchema(parameters);
            var result = schema.safeParse(formData);
            if (result.success) {
                onSubmit(result.data);
            }
            else {
                react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Please fill out all required fields"], ["Please fill out all required fields"]))));
            }
        }
        else {
            nextStep();
        }
    };
    var isLastStep = currentStep === totalSteps - 1;
    return (<form onSubmit={handleSubmit} className="space-y-8">
      <ConfiguratorProgress />

      {groupedParameters[currentStep] && (<ConfiguratorStep group={groupedParameters[currentStep].group} parameters={groupedParameters[currentStep].parameters}/>)}

      {isLastStep && destructive && (<react_1.Alert variant="destructive">
          <lu_1.LuTriangleAlert className="h-4 w-4"/>
          <react_1.AlertTitle>
            <macro_1.Trans>Changing this will overwrite the existing method</macro_1.Trans>
          </react_1.AlertTitle>
        </react_1.Alert>)}
      <div className="flex justify-between pt-4">
        <react_1.Button type="button" variant="secondary" onClick={previousStep} disabled={currentStep === 0}>
          <macro_1.Trans>Previous</macro_1.Trans>
        </react_1.Button>

        <react_1.Button type="submit" disabled={!isStepValid} variant={isLastStep && destructive ? "destructive" : "primary"}>
          {isLastStep ? (destructive ? (<macro_1.Trans>Save and Overwrite</macro_1.Trans>) : (<macro_1.Trans>Save</macro_1.Trans>)) : (<macro_1.Trans>Next</macro_1.Trans>)}
        </react_1.Button>
      </div>
    </form>);
}
function ConfiguratorForm(props) {
    var validGroups = (0, react_2.useMemo)(function () {
        return props.groups.filter(function (group) {
            return props.parameters.some(function (p) { return p.configurationParameterGroupId === group.id; });
        });
    }, [props.groups, props.parameters]);
    var initialValues = (0, react_2.useMemo)(function () {
        var values = {};
        props.parameters.forEach(function (param) {
            var _a, _b, _c, _d, _e, _f;
            if (param.dataType === "boolean") {
                values[param.key] = (_b = (_a = props.initialValues) === null || _a === void 0 ? void 0 : _a[param.key]) !== null && _b !== void 0 ? _b : false;
            }
            else if (param.dataType === "numeric") {
                values[param.key] = (_d = (_c = props.initialValues) === null || _c === void 0 ? void 0 : _c[param.key]) !== null && _d !== void 0 ? _d : 0;
            }
            else {
                values[param.key] = (_f = (_e = props.initialValues) === null || _e === void 0 ? void 0 : _e[param.key]) !== null && _f !== void 0 ? _f : "";
            }
        });
        return values;
    }, [props.initialValues, props.parameters]);
    return (<ConfiguratorProvider initialValues={initialValues} totalSteps={validGroups.length} destructive={props.destructive}>
      <ConfiguratorFormContent {...props}/>
    </ConfiguratorProvider>);
}
function ConfiguratorModal(_a) {
    var _b;
    var groups = _a.groups, parameters = _a.parameters, open = _a.open, onClose = _a.onClose, onSubmit = _a.onSubmit, initialValues = _a.initialValues, destructive = _a.destructive;
    var t = (0, macro_1.useLingui)().t;
    var validGroups = (0, react_2.useMemo)(function () {
        return groups.filter(function (group) {
            return parameters.some(function (p) { return p.configurationParameterGroupId === group.id; });
        });
    }, [groups, parameters]);
    var _c = (0, react_2.useState)(validGroups[0]), currentGroup = _c[0], setCurrentGroup = _c[1];
    return (<react_1.Modal open={open} onOpenChange={function (open) {
            if (!open) {
                onClose();
            }
        }}>
      <react_1.ModalContent size="large">
        <react_1.ModalHeader>
          <react_1.ModalTitle>{(_b = currentGroup === null || currentGroup === void 0 ? void 0 : currentGroup.name) !== null && _b !== void 0 ? _b : t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Configurator"], ["Configurator"])))}</react_1.ModalTitle>
        </react_1.ModalHeader>
        <react_1.ModalBody>
          <ConfiguratorForm groups={groups} parameters={parameters} onSubmit={onSubmit} onGroupChange={setCurrentGroup} initialValues={initialValues} destructive={destructive}/>
        </react_1.ModalBody>
      </react_1.ModalContent>
    </react_1.Modal>);
}
function ConfiguratorProgress() {
    var _a = useConfigurator(), currentStep = _a.currentStep, totalSteps = _a.totalSteps;
    var progress = ((currentStep + 1) / totalSteps) * 100;
    if (totalSteps <= 1)
        return null;
    return (<div className="w-full space-y-2">
      <react_1.BarProgress progress={progress}/>
    </div>);
}
function ConfiguratorStep(_a) {
    var group = _a.group, parameters = _a.parameters;
    return (<div className="grid grid-cols-1 gap-4 md:grid-cols-2 w-full">
      {parameters.map(function (parameter) { return (<ParameterField key={parameter.id} parameter={parameter}/>); })}
    </div>);
}
var templateObject_1, templateObject_2, templateObject_3;
