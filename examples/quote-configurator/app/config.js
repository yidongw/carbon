"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIGURED_ITEM_ID = exports.CARBON_PUBLIC_KEY = exports.CARBON_COMPANY_ID = exports.CARBON_APP_URL = exports.CARBON_API_URL = exports.CARBON_API_KEY = void 0;
var CARBON_API_KEY = process.env.CARBON_API_KEY;
exports.CARBON_API_KEY = CARBON_API_KEY;
var CARBON_API_URL = process.env.CARBON_API_URL;
exports.CARBON_API_URL = CARBON_API_URL;
var CARBON_APP_URL = process.env.CARBON_APP_URL;
exports.CARBON_APP_URL = CARBON_APP_URL;
var CARBON_COMPANY_ID = process.env.CARBON_COMPANY_ID;
exports.CARBON_COMPANY_ID = CARBON_COMPANY_ID;
var CARBON_PUBLIC_KEY = process.env.CARBON_PUBLIC_KEY;
exports.CARBON_PUBLIC_KEY = CARBON_PUBLIC_KEY;
var CONFIGURED_ITEM_ID = process.env.CONFIGURED_ITEM_ID;
exports.CONFIGURED_ITEM_ID = CONFIGURED_ITEM_ID;
if (!CARBON_API_KEY) {
    throw new Error("CARBON_API_KEY must be set");
}
if (!CARBON_API_URL) {
    throw new Error("CARBON_API_URL must be set");
}
if (!CARBON_APP_URL) {
    throw new Error("CARBON_APP_URL must be set");
}
if (!CARBON_COMPANY_ID) {
    throw new Error("CARBON_COMPANY_ID must be set");
}
if (!CARBON_PUBLIC_KEY) {
    throw new Error("CARBON_PUBLIC_KEY must be set");
}
