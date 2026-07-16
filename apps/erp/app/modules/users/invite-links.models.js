"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewMembershipApplicationValidator = exports.updateInviteLinkExpiryValidator = exports.revokeInviteLinkValidator = exports.createInviteLinkValidator = exports.INVITE_LOGIN_METHODS = void 0;
exports.parseInviteLoginMethods = parseInviteLoginMethods;
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
// Valid userIdentity login-method types an invite link may require, in the order
// the joiner must complete them. See 20260717000000_invite-link-login-methods.sql.
exports.INVITE_LOGIN_METHODS = [
    "wechat",
    "phone",
    "email",
    "google",
    "azure"
];
exports.createInviteLinkValidator = zod_1.z.object({
    label: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    employeeTypeId: zod_1.z.string().min(1, { message: "Employee type is required" }),
    locationId: zod_1.z.string().min(1, { message: "Location is required" }),
    expiresAt: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    // Ordered, comma-joined list of required login methods; empty = any method.
    loginMethods: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
/** Parse the comma-joined `loginMethods` field into a clean ordered array. */
function parseInviteLoginMethods(raw) {
    if (!raw)
        return [];
    var seen = new Set();
    var result = [];
    for (var _i = 0, _a = raw.split(","); _i < _a.length; _i++) {
        var part = _a[_i];
        var method = part.trim();
        if (exports.INVITE_LOGIN_METHODS.includes(method) &&
            !seen.has(method)) {
            seen.add(method);
            result.push(method);
        }
    }
    return result;
}
exports.revokeInviteLinkValidator = zod_1.z.object({
    id: zod_1.z.string().min(1, { message: "Invite link is required" })
});
exports.updateInviteLinkExpiryValidator = zod_1.z.object({
    id: zod_1.z.string().min(1, { message: "Invite link is required" }),
    expiresAt: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.reviewMembershipApplicationValidator = zod_1.z.object({
    id: zod_1.z.string().min(1, { message: "Application is required" }),
    action: zod_1.z.enum(["approve", "reject"]),
    locationId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
