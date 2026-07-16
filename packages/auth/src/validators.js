"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignupValidator = exports.selfSignupValidator = exports.callbackValidator = exports.resetPasswordValidator = exports.passwordLoginValidator = exports.phoneVerifyValidator = exports.phoneLoginValidator = exports.magicLinkValidator = exports.forgotPasswordValidator = exports.emailAndPasswordValidator = exports.loginValidator = void 0;
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
exports.loginValidator = zod_1.z.object({
    email: zod_1.z
        .string()
        .min(1, { message: "Email is required" })
        .email("Must be a valid email"),
    redirectTo: zod_1.z.string()
});
exports.emailAndPasswordValidator = zod_1.z.object({
    email: zod_1.z
        .string()
        .min(1, { message: "Email is required" })
        .email("Must be a valid email"),
    password: zod_1.z.string().min(6, { message: "Password is too short" })
});
exports.forgotPasswordValidator = zod_1.z.object({
    email: zod_1.z
        .string()
        .min(1, { message: "Email is required" })
        .email("Must be a valid email")
});
exports.magicLinkValidator = zod_1.z.object({
    email: zod_1.z
        .string()
        .min(1, { message: "Email is required" })
        .email("Must be a valid email"),
    redirectTo: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    turnstileToken: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
// Phone (SMS OTP) login. Mainland-China mobile numbers only — Aliyun's
// verification-code service is domestic (CountryCode 86) at present.
exports.phoneLoginValidator = zod_1.z.object({
    phone: zod_1.z
        .string()
        .min(1, { message: "Phone number is required" })
        .regex(/^1[3-9]\d{9}$/, "Must be a valid phone number"),
    redirectTo: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    turnstileToken: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.phoneVerifyValidator = zod_1.z.object({
    phone: zod_1.z.string().regex(/^1[3-9]\d{9}$/, "Must be a valid phone number"),
    code: zod_1.z.string().min(4).max(8),
    redirectTo: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.passwordLoginValidator = zod_1.z.object({
    email: zod_1.z
        .string()
        .min(1, { message: "Email is required" })
        .email("Must be a valid email"),
    password: zod_1.z.string().min(6, { message: "Password is too short" }),
    redirectTo: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    turnstileToken: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.resetPasswordValidator = zod_1.z.object({
    password: zod_1.z.string().min(6, { message: "Password is too short" })
});
exports.callbackValidator = zod_1.z.object({
    accessToken: zod_1.z.string(),
    refreshToken: zod_1.z.string(),
    userId: zod_1.z.string(),
    redirectTo: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.selfSignupValidator = zod_1.z.object({
    email: zod_1.z
        .string()
        .min(1, { message: "Email is required" })
        .email("Must be a valid email"),
    firstName: zod_1.z.string().min(1, { message: "First name is required" }),
    lastName: zod_1.z.string().min(1, { message: "Last name is required" })
});
exports.verifySignupValidator = zod_1.z.object({
    email: zod_1.z
        .string()
        .min(1, { message: "Email is required" })
        .email("Must be a valid email"),
    verificationCode: zod_1.z
        .string()
        .min(1, { message: "Verification code is required" })
        .length(6, { message: "Verification code must be 6 characters" })
});
