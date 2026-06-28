import { z } from "zod";
import { zfd } from "zod-form-data";

export const loginValidator = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Must be a valid email"),
  redirectTo: z.string()
});

export const emailAndPasswordValidator = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Must be a valid email"),
  password: z.string().min(6, { message: "Password is too short" })
});

export const forgotPasswordValidator = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Must be a valid email")
});

export const magicLinkValidator = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Must be a valid email"),
  redirectTo: zfd.text(z.string().optional()),
  turnstileToken: zfd.text(z.string().optional())
});

// Phone (SMS OTP) login. Mainland-China mobile numbers only — Aliyun's
// verification-code service is domestic (CountryCode 86) at present.
export const phoneLoginValidator = z.object({
  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^1[3-9]\d{9}$/, "Must be a valid phone number"),
  redirectTo: zfd.text(z.string().optional())
});

export const phoneVerifyValidator = z.object({
  phone: z.string().regex(/^1[3-9]\d{9}$/, "Must be a valid phone number"),
  code: z.string().min(4).max(8),
  redirectTo: zfd.text(z.string().optional())
});

export const passwordLoginValidator = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Must be a valid email"),
  password: z.string().min(6, { message: "Password is too short" }),
  redirectTo: zfd.text(z.string().optional()),
  turnstileToken: zfd.text(z.string().optional())
});

export const resetPasswordValidator = z.object({
  password: z.string().min(6, { message: "Password is too short" })
});

export const callbackValidator = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  userId: z.string(),
  redirectTo: zfd.text(z.string().optional())
});

export const selfSignupValidator = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Must be a valid email"),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" })
});

export const verifySignupValidator = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Must be a valid email"),
  verificationCode: z
    .string()
    .min(1, { message: "Verification code is required" })
    .length(6, { message: "Verification code must be 6 characters" })
});
