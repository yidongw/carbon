"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFormStore = void 0;
var createFormStore_1 = require("./createFormStore");
var useFormStore = function (formId, selector) {
    return (0, createFormStore_1.useRootFormStore)(function (state) { return selector(state.form(formId)); });
};
exports.useFormStore = useFormStore;
