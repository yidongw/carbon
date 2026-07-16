"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var ColorPicker_1 = require("~/components/ColorPicker");
var Color = function (_a) {
    var name = _a.name, label = _a.label;
    var _b = (0, form_1.useField)(name), error = _b.error, fieldIsOptional = _b.isOptional;
    var _c = (0, form_1.useControlField)(name), value = _c[0], setValue = _c[1];
    return (<react_1.FormControl>
      <react_1.FormLabel isOptional={fieldIsOptional}>{label}</react_1.FormLabel>
      <input type="hidden" name={name} value={value !== null && value !== void 0 ? value : ""}/>
      <ColorPicker_1.ColorPicker value={value !== null && value !== void 0 ? value : "#000000"} onChange={setValue}/>
      {error && <react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>}
    </react_1.FormControl>);
};
exports.default = Color;
