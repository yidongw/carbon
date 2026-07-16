"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var provider_1 = require("../provider");
var Input = function () {
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, provider_1.default)(), inputProps = _a.aria.inputProps, _b = _a.innerProps, disabled = _b.disabled, isMulti = _b.isMulti, placeholder = _b.placeholder, readOnly = _b.readOnly, inputValue = _a.inputValue, loading = _a.loading, inputRef = _a.refs.inputRef, onClearInput = _a.onClearInput, onInputBlur = _a.onInputBlur, onInputChange = _a.onInputChange, onInputFocus = _a.onInputFocus;
    return (<react_1.InputGroup>
      {!readOnly &&
            (isMulti ? (<react_1.InputLeftElement>
            <react_1.AvatarGroup size="xs" limit={2}>
              <react_1.Avatar size="xs"/>
              <react_1.Avatar size="xs"/>
            </react_1.AvatarGroup>
          </react_1.InputLeftElement>) : (<react_1.InputLeftElement>
            <react_1.Avatar size="xs"/>
          </react_1.InputLeftElement>))}

      <react_1.Input {...inputProps} isReadOnly={disabled || readOnly} isDisabled={disabled || readOnly} onBlur={onInputBlur} onChange={onInputChange} onFocus={readOnly || disabled ? undefined : onInputFocus} placeholder={placeholder} spellCheck="false" ref={inputRef} type="text" value={inputValue}/>
      {!readOnly && !disabled && (<react_1.InputRightElement>
          <react_1.HStack spacing={1}>
            {loading && <react_1.Spinner />}
            {!loading && !disabled && inputValue.length > 0 && (<react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Clear search query"], ["Clear search query"])))} icon={<lu_1.LuX />} onClick={onClearInput} variant="ghost"/>)}
          </react_1.HStack>
        </react_1.InputRightElement>)}
    </react_1.InputGroup>);
};
exports.default = Input;
var templateObject_1;
