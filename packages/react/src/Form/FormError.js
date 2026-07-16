"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormErrorMessage = void 0;
var react_1 = require("react");
var cn_1 = require("../utils/cn");
var FormControl_1 = require("./FormControl");
/**
 * Used to provide feedback about an invalid input,
 * and suggest clear instructions on how to fix it.
 */
exports.FormErrorMessage = (0, react_1.forwardRef)(function (props, ref) {
    var field = (0, FormControl_1.useFormControlContext)();
    if (!(field === null || field === void 0 ? void 0 : field.isInvalid))
        return null;
    return (<div {...field === null || field === void 0 ? void 0 : field.getErrorMessageProps(props, ref)} className={(0, cn_1.cn)("text-destructive text-xs font-medium leading-none", props.className)}/>);
});
exports.FormErrorMessage.displayName = "FormErrorMessage";
