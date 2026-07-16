"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var date_1 = require("@internationalized/date");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var hooks_1 = require("../hooks");
var formStateContext_1 = require("../internal/formStateContext");
var DatePicker = function (_a) {
    var name = _a.name, label = _a.label, _b = _a.isDisabled, isDisabledProp = _b === void 0 ? false : _b, isRequired = _a.isRequired, minValue = _a.minValue, maxValue = _a.maxValue, _c = _a.inline, inline = _c === void 0 ? false : _c, helperText = _a.helperText, value = _a.value, onChange = _a.onChange;
    var locale = (0, i18n_1.useLocale)().locale;
    var formState = (0, formStateContext_1.useFormStateContext)();
    var isDisabled = formState.isDisabled || formState.isReadOnly || isDisabledProp;
    var validate = (0, form_1.useFormContext)().validate;
    var _d = (0, hooks_1.useField)(name), error = _d.error, defaultValue = _d.defaultValue, validateField = _d.validate, fieldIsOptional = _d.isOptional;
    var _e = (0, react_2.useState)(value
        ? (0, date_1.parseDate)(value)
        : defaultValue
            ? (0, date_1.parseDate)(defaultValue)
            : undefined), date = _e[0], setDate = _e[1];
    (0, react_2.useEffect)(function () {
        if (value) {
            setDate((0, date_1.parseDate)(value));
        }
    }, [value]);
    var handleChange = function (newDate) { return __awaiter(void 0, void 0, void 0, function () {
        var formattedDate, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!newDate)
                        return [2 /*return*/];
                    formattedDate = newDate ? newDate.toString() : null;
                    (0, react_dom_1.flushSync)(function () {
                        setDate(newDate);
                    });
                    if (!inline) return [3 /*break*/, 2];
                    return [4 /*yield*/, validate()];
                case 1:
                    result = _a.sent();
                    if (result.error) {
                        setDate(date);
                    }
                    else {
                        onChange === null || onChange === void 0 ? void 0 : onChange(formattedDate);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    validateField();
                    onChange === null || onChange === void 0 ? void 0 : onChange(formattedDate);
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var utcValue = date ? date.toString() : "";
    var DatePickerPreview = (<span className="flex flex-grow line-clamp-1 items-center">
      {(0, utils_1.formatDate)(utcValue, undefined, locale)}
    </span>);
    return (<react_1.FormControl isInvalid={!!error} isRequired={isRequired}>
      {label && (<react_1.FormLabel htmlFor={name} isOptional={isRequired ? false : (fieldIsOptional !== null && fieldIsOptional !== void 0 ? fieldIsOptional : false)}>
          {label}
        </react_1.FormLabel>)}
      <input type="hidden" name={name} value={utcValue}/>
      <react_1.DatePicker value={date} isDisabled={isDisabled} minValue={minValue} maxValue={maxValue} onChange={handleChange} inline={inline ? DatePickerPreview : undefined} helperText={helperText} label={label}/>
      {error && <react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>}
    </react_1.FormControl>);
};
exports.default = DatePicker;
