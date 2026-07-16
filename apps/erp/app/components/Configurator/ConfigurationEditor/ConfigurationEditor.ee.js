"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Configurator;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("@monaco-editor/react");
var react_3 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Modals_1 = require("../../Modals");
var types_1 = require("../types");
var utils_1 = require("../utils");
var ParameterPanel_ee_1 = require("./ParameterPanel.ee");
function Configurator(_a) {
    var configuration = _a.configuration, open = _a.open, defaultParameters = _a.parameters, onClose = _a.onClose, configurationRuleBindings = _a.configurationRuleBindings;
    var t = (0, macro_1.useLingui)().t;
    var defaultCode = configuration.code, defaultValue = configuration.defaultValue, label = configuration.label, returnType = configuration.returnType;
    var isActive = !!defaultCode;
    var mode = (0, react_1.useMode)();
    var _b = (0, react_3.useState)(""), output = _b[0], setOutput = _b[1];
    var _c = (0, react_3.useState)(false), isScriptLoaded = _c[0], setIsScriptLoaded = _c[1];
    var _d = (0, react_3.useState)(defaultParameters.map(function (param) {
        var _a;
        return ({
            name: param.key,
            type: param.dataType,
            value: (0, utils_1.getDefaultValue)(param.dataType, param.listOptions),
            config: param.dataType === "list"
                ? { options: (_a = param.listOptions) !== null && _a !== void 0 ? _a : [] }
                : undefined
        });
    })), parameters = _d[0], setParameters = _d[1];
    (0, react_3.useEffect)(function () {
        setParameters(function (prev) {
            return defaultParameters.map(function (param) {
                var _a, _b;
                return ({
                    name: param.key,
                    type: param.dataType,
                    value: ((_a = prev.find(function (p) { return p.name === param.key; })) === null || _a === void 0 ? void 0 : _a.value) ||
                        (0, utils_1.getDefaultValue)(param.dataType, param.listOptions),
                    config: param.dataType === "list"
                        ? { options: (_b = param.listOptions) !== null && _b !== void 0 ? _b : [] }
                        : undefined
                });
            });
        });
    }, [defaultParameters]);
    var _e = (0, react_3.useState)((0, utils_1.generateDefaultCode)(parameters, returnType, defaultCode, defaultValue)), code = _e[0], setCode = _e[1];
    var _f = (0, react_3.useState)(null), editor = _f[0], setEditor = _f[1];
    var _g = (0, react_3.useState)(null), monaco = _g[0], setMonaco = _g[1];
    var lockedLines = (0, react_3.useMemo)(function () {
        var baseLockedLines = 8; // For the function declaration and closing lines
        var totalLockedLines = baseLockedLines + parameters.length;
        return totalLockedLines;
    }, [parameters]);
    (0, react_3.useEffect)(function () {
        if (editor && monaco) {
            editor.onDidChangeCursorSelection(function () {
                var _a;
                var selectionInLockedRange = (_a = editor
                    .getSelections()) === null || _a === void 0 ? void 0 : _a.some(function (selection) {
                    return selection.intersectRanges(new monaco.Range(1, 0, lockedLines + 1, 0));
                });
                editor.updateOptions({
                    readOnly: selectionInLockedRange,
                    readOnlyMessage: { value: "Cannot edit locked lines." }
                });
            });
        }
    }, [editor, monaco, lockedLines]);
    var handleEditorDidMount = function (editor, monaco) {
        setEditor(editor);
        setMonaco(monaco);
        // Configure Monaco
        (0, utils_1.configureMonaco)(monaco);
        // Add initial type definitions
        var typeDefinitions = (0, utils_1.generateTypeDefinitions)(parameters, returnType);
        monaco.languages.typescript.javascriptDefaults.addExtraLib(typeDefinitions, "parameters.d.ts");
        editor.onDidChangeCursorSelection(function () {
            var _a;
            var selectionInLockedRange = (_a = editor
                .getSelections()) === null || _a === void 0 ? void 0 : _a.some(function (selection) {
                return selection.intersectRanges(new monaco.Range(1, 0, lockedLines + 1, 0));
            });
            editor.updateOptions({
                readOnly: selectionInLockedRange,
                readOnlyMessage: { value: "Cannot edit locked lines." }
            });
        });
    };
    // Update type definitions when parameters change
    (0, react_3.useEffect)(function () {
        if (monaco && editor) {
            var typeDefinitions = (0, utils_1.generateTypeDefinitions)(parameters, returnType);
            monaco.languages.typescript.javascriptDefaults.addExtraLib(typeDefinitions, "parameters.d.ts");
            // Trigger a re-validation of the model
            var model = editor.getModel();
            if (model) {
                monaco.editor.setModelMarkers(model, "typescript", []);
            }
        }
    }, [parameters, monaco, editor, returnType]);
    var saveRuleAction = configurationRuleBindings.save;
    var deleteRuleAction = function (field) {
        return configurationRuleBindings.delete(field);
    };
    var fetcher = (0, react_router_1.useFetcher)();
    var getCodeToSave = function () {
        var lines = code.split("\n");
        var startLine = lockedLines;
        var endLine = lines.length - 1;
        // Find the closing brace of the configure function
        var braceCount = 0;
        for (var i = startLine; i < lines.length; i++) {
            var line = lines[i];
            braceCount += (line.match(/{/g) || []).length;
            braceCount -= (line.match(/}/g) || []).length;
            if (braceCount === -1) {
                endLine = i;
                break;
            }
        }
        var storedCode = lines.slice(startLine, endLine).join("\n").trim();
        return storedCode;
    };
    var handleSave = function () {
        var formData = new FormData();
        formData.append("code", getCodeToSave());
        formData.append("field", configuration.field);
        fetcher.submit(formData, {
            method: "post",
            action: saveRuleAction
        });
    };
    (0, react_3.useEffect)(function () {
        var head = document.querySelector("head");
        var script = document.createElement("script");
        script.setAttribute("src", "https://unpkg.com/typescript@5.5.4/lib/typescript.js");
        script.onload = function () { return setIsScriptLoaded(true); };
        head.appendChild(script);
        return function () {
            head.removeChild(script);
        };
    }, []);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_3.useEffect)(function () {
        var _a, _b;
        if (((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) === false) {
            react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Failed to save configuration rule"], ["Failed to save configuration rule"]))));
        }
        if (((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success) === true) {
            onClose();
        }
    }, [fetcher.data]);
    var runCode = (0, react_3.useCallback)(function () {
        var jsCode = (0, utils_1.convertTypescriptToJavaScript)(code);
        if (isUnsafeCode(jsCode)) {
            setOutput("Error: Unsupported code detected. The code you're trying to run contains disallowed patterns.");
            return;
        }
        try {
            // Create parameters object from the panel
            var parametersObj = parameters.reduce(function (acc, v) {
                if (v.type === "material") {
                    acc[v.name] = v.value;
                }
                else {
                    acc[v.name] =
                        v.type === "numeric"
                            ? Number(v.value)
                            : v.type === "boolean"
                                ? v.value === "true"
                                : v.value;
                }
                return acc;
            }, {});
            // Execute the code
            var fn = new Function("parameters", "\n        ".concat(jsCode, "\n        return configure(parameters);\n      "));
            var result = fn(parametersObj);
            // Verify return type
            if (returnType.type === "list") {
                if (!Array.isArray(result)) {
                    throw new Error("Expected return type to be an array");
                }
                if (returnType.listOptions) {
                    var invalidValue = result.find(function (value) { var _a; return !((_a = returnType.listOptions) === null || _a === void 0 ? void 0 : _a.includes(value)); });
                    if (invalidValue) {
                        throw new Error("Invalid value \"".concat(invalidValue, "\" in array. Must be one of: ").concat(returnType.listOptions.join(", ")));
                    }
                }
            }
            else if (returnType.type === "enum") {
                if (Array.isArray(result)) {
                    throw new Error("Expected return type to be a single value, not an array");
                }
                if (returnType.listOptions &&
                    !returnType.listOptions.includes(result)) {
                    throw new Error("Invalid value \"".concat(result, "\". Must be one of: ").concat(returnType.listOptions.join(", ")));
                }
            }
            else {
                var actualType = typeof result;
                if (actualType !== types_1.typeMap[returnType.type]) {
                    throw new Error("Expected return type ".concat(returnType.type, ", but got ").concat(actualType));
                }
            }
            setOutput("Result: ".concat(JSON.stringify(result)));
        }
        catch (error) {
            setOutput("Error: ".concat(error.message));
        }
    }, [code, parameters, returnType]);
    var deleteDialog = (0, react_1.useDisclosure)();
    if (!open)
        return null;
    return (<>
      <react_1.Modal open={open} onOpenChange={function (open) {
            if (!open) {
                onClose();
            }
        }}>
        <react_1.ModalContent size="xxxlarge" className="p-0 gap-0 h-[90dvh]">
          <div className="flex items-center justify-between p-5 pr-14">
            <react_1.ModalTitle>{t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Configure ", ""], ["Configure ", ""])), label)}</react_1.ModalTitle>
            <react_1.HStack>
              <react_1.Badge variant={isActive ? "green" : "gray"}>
                {isActive ? <macro_1.Trans>Active</macro_1.Trans> : <macro_1.Trans>Inactive</macro_1.Trans>}
                <lu_1.LuSquareFunction className="ml-1"/>
              </react_1.Badge>

              <react_1.DropdownMenu>
                <react_1.DropdownMenuTrigger asChild>
                  <react_1.IconButton icon={<lu_1.LuEllipsisVertical />} variant="secondary" size="sm" aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Actions"], ["Actions"])))}/>
                </react_1.DropdownMenuTrigger>
                <react_1.DropdownMenuContent>
                  <react_1.DropdownMenuItem destructive disabled={!isActive} onClick={deleteDialog.onOpen}>
                    <lu_1.LuTrash2 className="mr-2 h-4 w-4"/>
                    <macro_1.Trans>Delete Rule</macro_1.Trans>
                  </react_1.DropdownMenuItem>
                </react_1.DropdownMenuContent>
              </react_1.DropdownMenu>
            </react_1.HStack>
          </div>

          <div className="flex-1 flex h-full border-t">
            <div className="flex-1 w-2/3 border-r">
              <div className="h-full">
                <react_2.default height="100%" defaultLanguage="javascript" value={code} onChange={function (value) { return setCode(value || ""); }} theme={mode === "light" ? "vs-light" : "vs-dark"} onMount={handleEditorDidMount} options={{
            minimap: { enabled: false },
            fontSize: 14,
            suggest: {
                showProperties: true,
                showValues: true,
                preview: true
            },
            quickSuggestions: true,
            snippetSuggestions: "inline",
            formatOnType: true,
            formatOnPaste: true
        }}/>
              </div>
            </div>

            <div className="w-1/3 flex flex-col bg-background">
              <ParameterPanel_ee_1.default parameters={parameters} onChange={setParameters}/>
              <div className="p-4 border-t space-y-2">
                <react_1.Button onClick={runCode} className="w-full" leftIcon={<lu_1.LuPlay />} variant="secondary" isDisabled={!isScriptLoaded}>
                  <macro_1.Trans>Run Test</macro_1.Trans>
                </react_1.Button>
                <react_1.Button onClick={handleSave} className="w-full" leftIcon={<lu_1.LuSave />} variant="primary" isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
                  <macro_1.Trans>Save & Close</macro_1.Trans>
                </react_1.Button>

                <div className="font-mono mt-4 p-2 bg-accent rounded min-h-[100px] max-h-[300px] max-w-[395px] overflow-auto whitespace-pre-wrap">
                  {output}
                </div>
              </div>
            </div>
          </div>
        </react_1.ModalContent>
      </react_1.Modal>
      {isActive && deleteDialog.isOpen && (<Modals_1.ConfirmDelete isOpen={deleteDialog.isOpen} action={deleteRuleAction(configuration.field)} name={label} text={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Are you sure you want to deactivate the ", " configuration rule?"], ["Are you sure you want to deactivate the ", " configuration rule?"])), label)} onCancel={deleteDialog.onClose} onSubmit={onClose}/>)}
    </>);
}
function isUnsafeCode(code) {
    // Check for disallowed code patterns
    var disallowedPatterns = [
        /\bfetch\b/, // fetch calls
        /setTimeout|setInterval/, // timeouts
        /\bimport\b/, // dynamic imports
        /new Promise/, // promise construction
        /Function\(/ // Function constructor
    ];
    return disallowedPatterns.some(function (pattern) { return pattern.test(code); });
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
