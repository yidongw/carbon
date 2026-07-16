"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationErrorMessages = exports.ZOD_STRING_MIN_ERROR = void 0;
exports.formatValidationError = formatValidationError;
exports.useFormatValidationError = useFormatValidationError;
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
exports.ZOD_STRING_MIN_ERROR = "String must contain at least 1 character(s)";
exports.validationErrorMessages = (_a = {},
    _a[exports.ZOD_STRING_MIN_ERROR] = (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Required"], ["Required"]))),
    _a.Required = (0, macro_1.msg)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Required"], ["Required"]))),
    _a["List options are required"] = (0, macro_1.msg)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["List options are required"], ["List options are required"]))),
    _a["Label is required"] = (0, macro_1.msg)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Label is required"], ["Label is required"]))),
    _a["Email is required"] = (0, macro_1.msg)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Email is required"], ["Email is required"]))),
    _a["Must be a valid email"] = (0, macro_1.msg)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Must be a valid email"], ["Must be a valid email"]))),
    _a["Password is too short"] = (0, macro_1.msg)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Password is too short"], ["Password is too short"]))),
    _a["First name is required"] = (0, macro_1.msg)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["First name is required"], ["First name is required"]))),
    _a["Last name is required"] = (0, macro_1.msg)(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Last name is required"], ["Last name is required"]))),
    _a["Verification code is required"] = (0, macro_1.msg)(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Verification code is required"], ["Verification code is required"]))),
    _a["Verification code must be 6 characters"] = (0, macro_1.msg)(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Verification code must be 6 characters"], ["Verification code must be 6 characters"]))),
    _a["Rate limit exceeded"] = (0, macro_1.msg)(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Rate limit exceeded"], ["Rate limit exceeded"]))),
    _a["Bot verification failed. Please try again."] = (0, macro_1.msg)(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Bot verification failed. Please try again."], ["Bot verification failed. Please try again."]))),
    _a["Invalid email address"] = (0, macro_1.msg)(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Invalid email address"], ["Invalid email address"]))),
    _a["Failed to send magic link"] = (0, macro_1.msg)(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Failed to send magic link"], ["Failed to send magic link"]))),
    _a["User record not found"] = (0, macro_1.msg)(templateObject_16 || (templateObject_16 = __makeTemplateObject(["User record not found"], ["User record not found"]))),
    _a["Failed to sign in"] = (0, macro_1.msg)(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Failed to sign in"], ["Failed to sign in"]))),
    _a["Failed to send verification code"] = (0, macro_1.msg)(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Failed to send verification code"], ["Failed to send verification code"]))),
    _a["Invalid verification code"] = (0, macro_1.msg)(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Invalid verification code"], ["Invalid verification code"]))),
    _a["Invalid or expired verification code"] = (0, macro_1.msg)(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Invalid or expired verification code"], ["Invalid or expired verification code"]))),
    _a["Failed to create user account"] = (0, macro_1.msg)(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Failed to create user account"], ["Failed to create user account"]))),
    _a["Failed to sign in user"] = (0, macro_1.msg)(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Failed to sign in user"], ["Failed to sign in user"]))),
    _a["Email link is invalid or has expired"] = (0, macro_1.msg)(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Email link is invalid or has expired"], ["Email link is invalid or has expired"]))),
    _a["Error deleting file"] = (0, macro_1.msg)(templateObject_24 || (templateObject_24 = __makeTemplateObject(["Error deleting file"], ["Error deleting file"]))),
    _a["Failed to upload file"] = (0, macro_1.msg)(templateObject_25 || (templateObject_25 = __makeTemplateObject(["Failed to upload file"], ["Failed to upload file"]))),
    _a["File upload is not supported for external scars"] = (0, macro_1.msg)(templateObject_26 || (templateObject_26 = __makeTemplateObject(["File upload is not supported for external scars"], ["File upload is not supported for external scars"]))),
    _a["File size too big (max 20MB)."] = (0, macro_1.msg)(templateObject_27 || (templateObject_27 = __makeTemplateObject(["File size too big (max 20MB)."], ["File size too big (max 20MB)."]))),
    _a["Please open this link in the same browser where you requested sign-in."] = (0, macro_1.msg)(templateObject_28 || (templateObject_28 = __makeTemplateObject(["Please open this link in the same browser where you requested sign-in."], ["Please open this link in the same browser where you requested sign-in."]))),
    _a["Magic link expired or already used. Please request a new one."] = (0, macro_1.msg)(templateObject_29 || (templateObject_29 = __makeTemplateObject(["Magic link expired or already used. Please request a new one."], ["Magic link expired or already used. Please request a new one."]))),
    _a);
function formatValidationError(error, i18n) {
    var descriptor = exports.validationErrorMessages[error];
    if (descriptor)
        return i18n._(descriptor);
    return i18n._(error);
}
function useFormatValidationError() {
    var i18n = (0, macro_2.useLingui)().i18n;
    return function (error) { return formatValidationError(error, i18n); };
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27, templateObject_28, templateObject_29;
