"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formDefaultValuesKey = exports.FORM_DEFAULTS_FIELD = exports.FORM_ID_FIELD = void 0;
exports.FORM_ID_FIELD = "__rvfInternalFormId";
exports.FORM_DEFAULTS_FIELD = "__rvfInternalFormDefaults";
var formDefaultValuesKey = function (formId) {
    return "".concat(exports.FORM_DEFAULTS_FIELD, "_").concat(formId);
};
exports.formDefaultValuesKey = formDefaultValuesKey;
