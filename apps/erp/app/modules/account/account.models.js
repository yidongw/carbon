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
exports.deleteUserAttributeValueValidator = exports.attributeFileValidator = exports.attributeSupplierValidator = exports.attributeCustomerValidator = exports.attributeUserValidator = exports.attributeTextValidator = exports.attributeNumericValidator = exports.attributeBooleanValidator = exports.accountPersonalDataValidator = exports.accountPasswordValidator = exports.accountLanguageValidator = exports.accountProfileValidator = exports.onboardingUserValidator = void 0;
var locale_1 = require("@carbon/locale");
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
exports.onboardingUserValidator = zod_1.z.object({
    firstName: zod_1.z.string().min(1, { message: "First name is required" }),
    lastName: zod_1.z.string().min(1, { message: "Last name is required" }),
    // about: zfd.text(z.string().optional()),
    next: zod_1.z.string().min(1, { message: "Next is required" })
});
exports.accountProfileValidator = zod_1.z.object({
    firstName: zod_1.z.string().min(1, { message: "First name is required" }),
    lastName: zod_1.z.string().min(1, { message: "Last name is required" }),
    about: zod_1.z.string(),
    phone: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    number: zod_form_data_1.zfd
        .text(zod_1.z.string().optional())
        .transform(function (val) { return (val === "" ? undefined : val); })
});
exports.accountLanguageValidator = zod_1.z.object({
    locale: zod_1.z.enum(locale_1.supportedLanguages)
});
exports.accountPasswordValidator = zod_1.z
    .object({
    currentPassword: zod_1.z
        .string()
        .min(6, { message: "Current password is required" }),
    password: zod_1.z.string().min(6, { message: "Password is required" }),
    confirmPassword: zod_1.z
        .string()
        .min(6, { message: "Confirm password is required" })
})
    .superRefine(function (_a, ctx) {
    var confirmPassword = _a.confirmPassword, password = _a.password;
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: "custom",
            message: "The passwords did not match"
        });
    }
});
exports.accountPersonalDataValidator = zod_1.z.object({});
var attributeDefaults = {
    type: zod_1.z.string().min(1, { message: "Type is required" }),
    userAttributeId: zod_1.z.string().min(20),
    userAttributeValueId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
};
exports.attributeBooleanValidator = zod_1.z.object(__assign(__assign({}, attributeDefaults), { value: zod_form_data_1.zfd.checkbox() }));
exports.attributeNumericValidator = zod_1.z.object(__assign(__assign({}, attributeDefaults), { value: zod_form_data_1.zfd.numeric(zod_1.z.number()) }));
exports.attributeTextValidator = zod_1.z.object(__assign(__assign({}, attributeDefaults), { value: zod_1.z.string().min(1, { message: "Value is required" }) }));
exports.attributeUserValidator = zod_1.z.object(__assign(__assign({}, attributeDefaults), { value: zod_1.z.string().min(1, { message: "User is required" }) }));
exports.attributeCustomerValidator = zod_1.z.object(__assign(__assign({}, attributeDefaults), { value: zod_1.z.string().min(1, { message: "Customer is required" }) }));
exports.attributeSupplierValidator = zod_1.z.object(__assign(__assign({}, attributeDefaults), { value: zod_1.z.string().min(1, { message: "Supplier is required" }) }));
exports.attributeFileValidator = zod_1.z.object(__assign(__assign({}, attributeDefaults), { value: zod_1.z.string().min(1, { message: "File is required" }) }));
exports.deleteUserAttributeValueValidator = zod_1.z.object({
    userAttributeId: zod_1.z.string().min(20),
    userAttributeValueId: zod_1.z.string().min(20)
});
