"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFlagsValidator = exports.userFlagValidator = exports.validUserFlags = exports.userPermissionsValidator = exports.revokeInviteValidator = exports.resendInviteValidator = exports.groupValidator = exports.employeeValidator = exports.employeeTypePermissionsValidator = exports.employeeTypeValidator = exports.deactivateUsersValidator = exports.createSupplierAccountValidator = exports.convertOperatorValidator = exports.createOperatorValidator = exports.createEmployeeValidator = exports.createCustomerAccountValidator = exports.bulkPermissionsValidator = void 0;
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
exports.bulkPermissionsValidator = zod_1.z.object({
    editType: zod_1.z.string().min(1, { message: "Update type is required" }),
    userIds: zod_1.z
        .array(zod_1.z.string().min(1, { message: "Invalid selection" }))
        .min(1, { message: "Group members are required" }),
    data: zod_1.z
        .string()
        .startsWith("{", { message: "Invalid JSON" })
        .endsWith("}", { message: "Invalid JSON" })
});
exports.createCustomerAccountValidator = zod_1.z.object({
    id: zod_1.z.string().min(1, "Customer contact is required"),
    customer: zod_1.z.string().min(1, { message: "Customer is required" })
});
exports.createEmployeeValidator = zod_1.z.object({
    email: zod_1.z
        .string()
        .min(1, { message: "Email is required" })
        .email("Must be a valid email"),
    firstName: zod_1.z.string().min(1, { message: "First name is required" }),
    lastName: zod_1.z.string().min(1, { message: "Last name is required" }),
    employeeType: zod_1.z.string().min(1, { message: "Employee type is required" }),
    locationId: zod_1.z.string().min(1, { message: "Location is required" }),
    number: zod_1.z
        .string()
        .optional()
        .transform(function (val) { return (val === "" ? undefined : val); })
});
exports.createOperatorValidator = zod_1.z.object({
    firstName: zod_1.z.string().min(1, { message: "First name is required" }),
    lastName: zod_1.z.string().min(1, { message: "Last name is required" }),
    locationId: zod_1.z.string().min(1, { message: "Location is required" }),
    pin: zod_1.z.string().regex(/^\d{4}$/, "PIN must be 4 digits")
});
exports.convertOperatorValidator = zod_1.z.object({
    email: zod_1.z
        .string()
        .min(1, { message: "Email is required" })
        .email("Must be a valid email"),
    employeeType: zod_1.z.string().min(1, { message: "Employee type is required" })
});
exports.createSupplierAccountValidator = zod_1.z.object({
    id: zod_1.z.string().min(1, "Supplier contact is required"),
    supplier: zod_1.z.string().min(1, { message: "Supplier is required" })
});
exports.deactivateUsersValidator = zod_1.z.object({
    redirectTo: zod_1.z.string(),
    users: zod_1.z
        .array(zod_1.z.string().min(1, { message: "Invalid user id" }))
        .min(1, { message: "Group members are required" })
});
exports.employeeTypeValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    mesOnly: zod_form_data_1.zfd.checkbox(),
    data: zod_1.z
        .string()
        .startsWith("[", { message: "Invalid JSON" })
        .endsWith("]", { message: "Invalid JSON" })
});
exports.employeeTypePermissionsValidator = zod_1.z.array(zod_1.z.object({
    name: zod_1.z.string(),
    permission: zod_1.z.object({
        view: zod_1.z.boolean(),
        create: zod_1.z.boolean(),
        update: zod_1.z.boolean(),
        delete: zod_1.z.boolean()
    })
}));
exports.employeeValidator = zod_1.z.object({
    id: zod_1.z.string(),
    employeeType: zod_1.z.string().min(1, { message: "Employee type is required" }),
    data: zod_1.z
        .string()
        .startsWith("{", { message: "Invalid JSON" })
        .endsWith("}", { message: "Invalid JSON" })
});
exports.groupValidator = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    selections: zod_1.z
        .array(zod_1.z.string().min(1, { message: "Invalid selection" }))
        .min(1, { message: "Group members are required" })
});
exports.resendInviteValidator = zod_1.z.object({
    users: zod_1.z
        .array(zod_1.z.string().min(1, { message: "Invalid user id" }))
        .min(1, { message: "Users are required" })
});
exports.revokeInviteValidator = zod_1.z.object({
    users: zod_1.z
        .array(zod_1.z.string().min(1, { message: "Invalid user id" }))
        .min(1, { message: "Users are required" })
});
exports.userPermissionsValidator = zod_1.z.object({
    view: zod_1.z.boolean(),
    create: zod_1.z.boolean(),
    update: zod_1.z.boolean(),
    delete: zod_1.z.boolean()
});
exports.validUserFlags = [
    "academy",
    "training:quotes",
    "training:salesOrders",
    "training:salesInvoices",
    "training:jobs",
    "training:suppliers",
    "training:purchaseOrders",
    "training:parts",
    "training:inventory",
    "training:quality"
];
var userFlagKeyValidator = zod_1.z.enum(exports.validUserFlags);
exports.userFlagValidator = zod_1.z.object({
    flag: userFlagKeyValidator,
    value: zod_1.z.boolean()
});
exports.userFlagsValidator = zod_1.z.record(userFlagKeyValidator, zod_1.z.boolean());
