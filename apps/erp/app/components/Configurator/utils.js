"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureMonaco = configureMonaco;
exports.generateDefaultCode = generateDefaultCode;
exports.getDefaultValue = getDefaultValue;
exports.generateTypeDefinitions = generateTypeDefinitions;
exports.convertTypescriptToJavaScript = convertTypescriptToJavaScript;
var types_1 = require("./types");
var MATERIAL_TYPE = "{ id: string; materialFormId: string | null; materialSubstanceId: string | null; materialTypeId: string | null; dimensionId: string | null; finishId: string | null; gradeId: string | null; }";
function configureMonaco(monaco) {
    // Configure JavaScript defaults
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false
    });
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        typeRoots: ["node_modules/@types"],
        strict: true
    });
}
function getParameterTypeString(parameter) {
    var _a, _b, _c;
    if (parameter.type === "list" && ((_a = parameter.config) === null || _a === void 0 ? void 0 : _a.options)) {
        var unionType = parameter.config.options
            .map(function (opt) { return "\"".concat(opt, "\""); })
            .join(" | ");
        return " * @param params.".concat(parameter.name, ": ").concat(unionType);
    }
    if (parameter.type === "enum") {
        return " * @param params.".concat(parameter.name, ": ").concat((_c = (_b = parameter.config) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 : _c.join(" | "));
    }
    if (parameter.type === "material") {
        return " * @param params.".concat(parameter.name, ": ").concat(MATERIAL_TYPE);
    }
    return " * @param params.".concat(parameter.name, ": ").concat(types_1.typeMap[parameter.type]);
}
function getReturnTypeString(returnType) {
    if (returnType.type === "list" && returnType.listOptions) {
        return "Array<".concat(returnType.listOptions
            .map(function (opt) { return "\"".concat(opt, "\""); })
            .join(" | "), ">");
    }
    if (returnType.type === "enum" && returnType.listOptions) {
        return returnType.listOptions.map(function (opt) { return "\"".concat(opt, "\""); }).join(" | ");
    }
    if (returnType.type === "material") {
        return MATERIAL_TYPE;
    }
    return types_1.typeMap[returnType.type];
}
function getReturnComment(returnType) {
    if (returnType.type === "list") {
        return "an array of predefined values";
    }
    if (returnType.type === "material") {
        return "a material object";
    }
    return "a ".concat(returnType.type, " value");
}
function getReturnHelperText(returnType) {
    var _a;
    if (returnType.helperText) {
        return returnType.helperText;
    }
    if (returnType.type === "list") {
        return "an array containing any of: [".concat((_a = returnType.listOptions) === null || _a === void 0 ? void 0 : _a.map(function (opt) { return "\"".concat(opt, "\""); }).join(", "), "]");
    }
    if (returnType.type === "enum" && returnType.listOptions) {
        return "one of: ".concat(returnType.listOptions
            .map(function (opt) { return "\"".concat(opt, "\""); })
            .join(" | "));
    }
    if (returnType.type === "material") {
        return "a material object";
    }
    return "a ".concat(returnType.type, " value");
}
function getDefaultReturnValue(returnType, defaultValue) {
    var _a, _b, _c;
    switch (returnType.type) {
        case "text":
            return defaultValue ? "\"".concat(defaultValue, "\"") : '"test"';
        case "numeric":
            return (_a = defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue.toString()) !== null && _a !== void 0 ? _a : "1";
        case "boolean":
            return (_b = defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue.toString()) !== null && _b !== void 0 ? _b : "true";
        case "enum":
            return "\"".concat(defaultValue !== null && defaultValue !== void 0 ? defaultValue : (_c = returnType.listOptions) === null || _c === void 0 ? void 0 : _c[0], "\"");
        case "material":
            return "{\n      id: \"\",\n      materialFormId: null,\n      materialSubstanceId: null,\n      materialTypeId: null,\n      dimensionId: null,\n      finishId: null,\n      gradeId: null,\n    }";
        case "list":
            return returnType.listOptions
                ? "[".concat(returnType.listOptions.map(function (opt) { return "\"".concat(opt, "\""); }).join(", "), "]")
                : "[]";
        default:
            return "[]";
    }
}
function generateDefaultCode(params, returnType, defaultCode, defaultValue) {
    var parameterTypes = params.map(getParameterTypeString).join("\n ");
    var returnTypeStr = getReturnTypeString(returnType);
    var returnComment = getReturnComment(returnType);
    var returnHelperText = getReturnHelperText(returnType);
    var defaultReturnValue = getDefaultReturnValue(returnType, defaultValue);
    return "\n/** \n  * Configure function that processes the provided params\n  * @returns ".concat(returnComment, "\n ").concat(parameterTypes, "\n**/\n\nfunction configure(params: Params): ").concat(returnTypeStr, " {\n  // return ").concat(returnHelperText, "\n  ").concat(defaultCode ? defaultCode : "return ".concat(defaultReturnValue, ";"), "\n}");
}
function getDefaultValue(type, listOptions) {
    var _a;
    switch (type) {
        case "numeric":
            return "1";
        case "text":
            return "test";
        case "boolean":
            return "true";
        case "list":
        case "enum":
            return (_a = listOptions === null || listOptions === void 0 ? void 0 : listOptions[0]) !== null && _a !== void 0 ? _a : "";
        case "material":
            return {
                id: "item_1234567890",
                materialFormId: "plate",
                materialSubstanceId: "steel",
                materialTypeId: null,
                dimensionId: "plate-1/4",
                finishId: null,
                gradeId: "steel-a36"
            };
        case "date":
            return new Date().toISOString();
        default:
            return "";
    }
}
function generateTypeDefinitions(params, returnType) {
    var properties = params
        .map(function (parameter) {
        var _a;
        var typeStr;
        if (parameter.type === "list" && ((_a = parameter.config) === null || _a === void 0 ? void 0 : _a.options)) {
            typeStr = parameter.config.options.map(function (opt) { return "\"".concat(opt, "\""); }).join(" | ");
        }
        else if (parameter.type === "material") {
            typeStr = MATERIAL_TYPE;
        }
        else {
            typeStr = parameter.type;
        }
        var comment = "/** ".concat(parameter.name, " - ").concat(parameter.type, " parameter */");
        return "    ".concat(comment, "\n    ").concat(parameter.name, ": ").concat(typeStr, ";");
    })
        .join("\n\n");
    var returnTypeStr = getReturnTypeString(returnType);
    return "\ndeclare type Params = {\n".concat(properties, "\n}\n\n/**\n * Configure function that processes the provided params\n * @param params The params object containing all available params\n * @returns A value matching the selected return type\n */\ndeclare function configure(params: Params): ").concat(returnTypeStr, ";\n");
}
function convertTypescriptToJavaScript(code) {
    // @ts-expect-error - TypeScript compiler is loaded globally
    if (window === null || window === void 0 ? void 0 : window.ts) {
        // @ts-expect-error - TypeScript compiler is loaded globally
        return window.ts.transpileModule(code, {
            compilerOptions: {
                // @ts-expect-error - TypeScript compiler is loaded globally
                target: window.ts.ScriptTarget.ES2020
            }
        }).outputText;
    }
    return "";
}
