"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveLabelLogo = resolveLabelLogo;
var auth_1 = require("@carbon/auth");
var labels_1 = require("@carbon/documents/labels");
/** Binds the shared label-logo resolver to this app's Supabase URL. */
function resolveLabelLogo(company, template, labelSize) {
    return (0, labels_1.resolveLabelLogo)(company, template, labelSize, {
        supabaseUrl: auth_1.SUPABASE_URL !== null && auth_1.SUPABASE_URL !== void 0 ? auth_1.SUPABASE_URL : ""
    });
}
