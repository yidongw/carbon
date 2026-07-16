"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoriteSchema = exports.contact = exports.address = void 0;
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
exports.address = {
    addressId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    addressLine1: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    addressLine2: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    city: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    stateProvince: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    postalCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    countryCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    phone: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    fax: zod_form_data_1.zfd.text(zod_1.z.string().optional())
};
exports.contact = {
    contactId: zod_1.z.string().optional(),
    firstName: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    lastName: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    title: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    email: zod_1.z
        .string()
        .min(1, { message: "Email is required" })
        .email("Must be a valid email"),
    mobilePhone: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    homePhone: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    workPhone: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    notes: zod_form_data_1.zfd.text(zod_1.z.string().optional())
};
exports.favoriteSchema = zod_1.z.object({
    id: zod_1.z.string(),
    favorite: zod_1.z.enum(["favorite", "unfavorite"])
});
