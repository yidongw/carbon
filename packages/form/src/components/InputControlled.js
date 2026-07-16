"use strict";
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
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var hooks_1 = require("../hooks");
var formStateContext_1 = require("../internal/formStateContext");
var InputControlled = (0, react_2.forwardRef)(function (_a, ref) {
    var _b;
    var name = _a.name, label = _a.label, isConfigured = _a.isConfigured, isOptional = _a.isOptional, isRequired = _a.isRequired, helperText = _a.helperText, characterLimit = _a.characterLimit, prefix = _a.prefix, suffix = _a.suffix, value = _a.value, className = _a.className, onChange = _a.onChange, isUppercase = _a.isUppercase, _c = _a.inline, inline = _c === void 0 ? false : _c, isReadOnlyProp = _a.isReadOnly, isDisabledProp = _a.isDisabled, onBlur = _a.onBlur, onConfigure = _a.onConfigure, maxLength = _a.maxLength, rest = __rest(_a, ["name", "label", "isConfigured", "isOptional", "isRequired", "helperText", "characterLimit", "prefix", "suffix", "value", "className", "onChange", "isUppercase", "inline", "isReadOnly", "isDisabled", "onBlur", "onConfigure", "maxLength"]);
    var formState = (0, formStateContext_1.useFormStateContext)();
    var isDisabled = formState.isDisabled || isDisabledProp;
    var isReadOnly = formState.isReadOnly || isReadOnlyProp;
    var validate = (0, form_1.useFormContext)().validate;
    var _d = (0, hooks_1.useField)(name), getInputProps = _d.getInputProps, error = _d.error, fieldIsOptional = _d.isOptional;
    var _e = (0, hooks_1.useControlField)(name), controlValue = _e[0], setControlValue = _e[1];
    var _f = (0, react_2.useState)(inline), inlineMode = _f[0], setInlineMode = _f[1];
    var inputRef = (0, react_2.useRef)(null);
    (0, react_2.useEffect)(function () {
        setControlValue(isUppercase ? uppercase(value) : value);
    }, [isUppercase, setControlValue, value]);
    (0, react_2.useEffect)(function () {
        var _a;
        if (inline && !inlineMode) {
            (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        }
    }, [inline, inlineMode]);
    var handleChange = function (e) {
        setControlValue(e.target.value);
        if (onChange && typeof onChange === "function") {
            onChange(isUppercase ? uppercase(e.target.value) : e.target.value);
        }
    };
    var resolvedIsOptional = isOptional !== null && isOptional !== void 0 ? isOptional : (isRequired ? false : (fieldIsOptional !== null && fieldIsOptional !== void 0 ? fieldIsOptional : false));
    return inlineMode ? (<react_1.VStack>
        {label && (<span className="text-xs text-muted-foreground">{label}</span>)}
        <react_1.HStack spacing={0} className="w-full justify-between">
          {value && (<span className="flex-grow text-sm line-clamp-1">{value}</span>)}
          <react_1.IconButton icon={value ? <lu_1.LuSettings2 /> : <lu_1.LuPlus />} aria-label={value ? "Edit" : "Add"} size="sm" variant="secondary" isDisabled={isReadOnly || isDisabled} onClick={function () { return setInlineMode(false); }}/>
        </react_1.HStack>
      </react_1.VStack>) : (<react_1.FormControl isInvalid={!!error} isRequired={isRequired} isDisabled={isDisabled} isReadOnly={isReadOnly} className={className}>
        {label && (<react_1.FormLabel htmlFor={name} isOptional={resolvedIsOptional} isConfigured={isConfigured} onConfigure={onConfigure}>
            {label}
          </react_1.FormLabel>)}
        {prefix || suffix ? (<react_1.InputGroup>
            {prefix && <react_1.InputLeftAddon children={prefix}/>}
            <react_1.Input ref={function (node) {
                if (typeof ref === "function") {
                    ref(node);
                }
                else if (ref) {
                    ref.current = node;
                }
                inputRef.current = node;
            }} {...getInputProps(__assign(__assign({ id: name }, rest), { value: controlValue }))} maxLength={characterLimit !== null && characterLimit !== void 0 ? characterLimit : maxLength} onChange={handleChange} value={controlValue} isReadOnly={isReadOnly} isDisabled={isDisabled} onBlur={function (e) { return __awaiter(void 0, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!inline) return [3 /*break*/, 2];
                            return [4 /*yield*/, validate()];
                        case 1:
                            result = _a.sent();
                            if (!result.error) {
                                onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
                                setInlineMode(true);
                            }
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); }}/>
            {suffix && <react_1.InputRightAddon children={suffix}/>}
          </react_1.InputGroup>) : (<react_1.Input ref={function (node) {
                if (typeof ref === "function") {
                    ref(node);
                }
                else if (ref) {
                    ref.current = node;
                }
                inputRef.current = node;
            }} {...getInputProps(__assign(__assign({ id: name }, rest), { value: controlValue }))} maxLength={characterLimit !== null && characterLimit !== void 0 ? characterLimit : maxLength} onChange={handleChange} value={controlValue} isReadOnly={isReadOnly} isDisabled={isDisabled} onBlur={function (e) { return __awaiter(void 0, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!inline) return [3 /*break*/, 2];
                            return [4 /*yield*/, validate()];
                        case 1:
                            result = _a.sent();
                            if (!result.error) {
                                onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
                                setInlineMode(true);
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); }}/>)}
        {characterLimit && (<react_1.FormHelperText>
            {(_b = controlValue === null || controlValue === void 0 ? void 0 : controlValue.length) !== null && _b !== void 0 ? _b : 0}/{characterLimit}
          </react_1.FormHelperText>)}
        {helperText && <react_1.FormHelperText>{helperText}</react_1.FormHelperText>}
        {error && <react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>}
      </react_1.FormControl>);
});
function uppercase(value) {
    var _a;
    return (_a = value === null || value === void 0 ? void 0 : value.toUpperCase()) !== null && _a !== void 0 ? _a : "";
}
InputControlled.displayName = "InputControlled";
exports.default = InputControlled;
