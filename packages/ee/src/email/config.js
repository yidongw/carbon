"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
var hi2_1 = require("react-icons/hi2");
var zod_1 = require("zod");
var fns_1 = require("../fns");
exports.Email = (0, fns_1.defineIntegration)({
    name: "Email",
    id: "email",
    active: true,
    category: "Email",
    logo: hi2_1.HiEnvelope,
    description: "Send transactional emails — quotes, purchase orders, invoices, and more — from your own domain. Pick Resend for a managed email API, or Custom SMTP to use your own mail server.",
    shortDescription: "Deliver transactional emails via Resend or a custom SMTP server.",
    images: [],
    settingGroups: [
        {
            name: "Resend",
            description: "API credentials for your Resend account."
        },
        {
            name: "SMTP",
            description: "Credentials for your custom SMTP server."
        }
    ],
    settings: [
        {
            name: "provider",
            label: "Delivery method",
            description: "How transactional emails are delivered for this company.",
            type: "cards",
            required: true,
            value: "resend",
            listOptions: [
                {
                    value: "resend",
                    label: "Resend",
                    description: "Managed email API with domain verification."
                },
                {
                    value: "smtp",
                    label: "Custom SMTP",
                    description: "Bring your own SMTP server."
                }
            ]
        },
        {
            name: "fromEmail",
            label: "From email",
            description: "The sender address your customers will see. Must be a domain you control.",
            type: "text",
            required: true,
            value: ""
        },
        // Resend group
        {
            name: "apiKey",
            label: "API key",
            description: "Create one in the Resend dashboard under API Keys.",
            type: "password",
            required: true,
            value: "",
            group: "Resend",
            visibleWhen: { field: "provider", equals: "resend" }
        },
        // SMTP group
        {
            name: "host",
            label: "Host",
            type: "text",
            required: true,
            value: "",
            group: "SMTP",
            visibleWhen: { field: "provider", equals: "smtp" }
        },
        {
            name: "port",
            label: "Port",
            type: "number",
            required: true,
            value: 587,
            group: "SMTP",
            visibleWhen: { field: "provider", equals: "smtp" }
        },
        {
            name: "username",
            label: "Username",
            type: "text",
            required: true,
            value: "",
            group: "SMTP",
            visibleWhen: { field: "provider", equals: "smtp" }
        },
        {
            name: "password",
            label: "Password",
            type: "password",
            required: true,
            value: "",
            group: "SMTP",
            visibleWhen: { field: "provider", equals: "smtp" }
        },
        {
            name: "secure",
            label: "Use TLS",
            description: "For implicit TLS (SMTPS) — ports 465 or 2465. Leave off for STARTTLS — ports 25, 587, 2525, or 2587.",
            type: "switch",
            required: false,
            value: false,
            group: "SMTP",
            visibleWhen: { field: "provider", equals: "smtp" }
        }
    ],
    schema: zod_1.z.discriminatedUnion("provider", [
        zod_1.z.object({
            provider: zod_1.z.literal("resend"),
            fromEmail: zod_1.z.string().email(),
            apiKey: zod_1.z.string().min(1, { message: "API Key is required" })
        }),
        zod_1.z.object({
            provider: zod_1.z.literal("smtp"),
            fromEmail: zod_1.z.string().email(),
            host: zod_1.z.string().min(1, { message: "Host is required" }),
            port: zod_1.z.coerce
                .number()
                .int()
                .min(1, { message: "Port must be between 1 and 65535" })
                .max(65535, { message: "Port must be between 1 and 65535" }),
            username: zod_1.z.string().min(1, { message: "Username is required" }),
            password: zod_1.z.string().min(1, { message: "Password is required" }),
            // `SwitchField` in the integration form always posts a literal
            // "true"/"false" string, and `z.coerce.boolean()` would treat both as
            // truthy (non-empty strings). Preprocess explicitly so unchecking the
            // switch actually sticks.
            secure: zod_1.z
                .preprocess(function (v) {
                if (typeof v === "boolean")
                    return v;
                if (v === "true")
                    return true;
                if (v === "false")
                    return false;
                return v;
            }, zod_1.z.boolean())
                .default(false)
        })
    ])
});
