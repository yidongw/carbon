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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFormDefaults = void 0;
exports.validationError = validationError;
var react_router_1 = require("react-router");
var constants_1 = require("./internal/constants");
/**
 * Takes the errors from a `Validator` and returns a `Response`.
 * When you return this from your action, `ValidatedForm` on the frontend will automatically
 * display the errors on the correct fields on the correct form.
 *
 * You can also provide a second argument to `validationError`
 * to specify how to repopulate the form when JS is disabled.
 *
 * @example
 * ```ts
 * const result = validator.validate(await request.formData());
 * if (result.error) return validationError(result.error, result.submittedData);
 * ```
 */
function validationError(error, repopulateFields, init) {
    return (0, react_router_1.data)({
        fieldErrors: error.fieldErrors,
        subaction: error.subaction,
        repopulateFields: repopulateFields,
        formId: error.formId
    }, __assign({ status: 422 }, init));
}
var setFormDefaults = function (formId, defaultValues) {
    var _a;
    return (_a = {},
        _a[(0, constants_1.formDefaultValuesKey)(formId)] = defaultValues,
        _a);
};
exports.setFormDefaults = setFormDefaults;
