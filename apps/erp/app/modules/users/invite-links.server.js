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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicInviteLinkByCode = getPublicInviteLinkByCode;
exports.createInviteLink = createInviteLink;
exports.revokeInviteLink = revokeInviteLink;
exports.updateInviteLinkExpiry = updateInviteLinkExpiry;
exports.submitMembershipApplication = submitMembershipApplication;
exports.approveMembershipApplication = approveMembershipApplication;
exports.rejectMembershipApplication = rejectMembershipApplication;
var auth_1 = require("@carbon/auth");
var client_server_1 = require("@carbon/auth/client.server");
var identity_server_1 = require("@carbon/auth/identity.server");
var kv_1 = require("@carbon/kv");
var stripe_server_1 = require("@carbon/stripe/stripe.server");
var utils_1 = require("@carbon/utils");
var nanoid_1 = require("nanoid");
var settings_1 = require("~/modules/settings");
var invite_links_service_1 = require("./invite-links.service");
var users_server_1 = require("./users.server");
function getPublicInviteLinkByCode(serviceRole, code, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var inviteLink, expired, loginMethods, alreadyApplied, alreadyMember, satisfiedMethods, _a, pendingApplication, employee, identities, company, employeeType, inviter;
        var _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, serviceRole
                        .from("inviteLink")
                        .select("\n        code,\n        companyId,\n        label,\n        expiresAt,\n        revokedAt,\n        loginMethods,\n        company:companyId(name),\n        employeeType:employeeTypeId(name),\n        inviter:createdBy(fullName)\n      ")
                        .eq("code", code)
                        .maybeSingle()];
                case 1:
                    inviteLink = _g.sent();
                    if (inviteLink.error) {
                        console.error("[getPublicInviteLinkByCode] Database error:", inviteLink.error);
                        return [2 /*return*/, {
                                success: false,
                                message: "Database error: ".concat(inviteLink.error.message)
                            }];
                    }
                    if (!inviteLink.data) {
                        return [2 /*return*/, { success: false, message: "Invite link not found" }];
                    }
                    expired = (0, invite_links_service_1.isInviteLinkExpired)(inviteLink.data);
                    loginMethods = ((_b = inviteLink.data.loginMethods) !== null && _b !== void 0 ? _b : []).filter(function (m) { return typeof m === "string"; });
                    alreadyApplied = false;
                    alreadyMember = false;
                    satisfiedMethods = [];
                    if (!userId) return [3 /*break*/, 3];
                    return [4 /*yield*/, Promise.all([
                            (0, invite_links_service_1.getPendingApplicationForUser)(serviceRole, userId, inviteLink.data.companyId),
                            serviceRole
                                .from("employee")
                                .select("active")
                                .eq("id", userId)
                                .eq("companyId", inviteLink.data.companyId)
                                .maybeSingle(),
                            (0, identity_server_1.getUserIdentities)(userId)
                        ])];
                case 2:
                    _a = _g.sent(), pendingApplication = _a[0], employee = _a[1], identities = _a[2];
                    alreadyApplied = !!pendingApplication.data;
                    alreadyMember = ((_c = employee.data) === null || _c === void 0 ? void 0 : _c.active) === true;
                    satisfiedMethods = Array.from(new Set(identities.map(function (i) { return i.type; })));
                    _g.label = 3;
                case 3:
                    company = inviteLink.data.company;
                    employeeType = inviteLink.data.employeeType;
                    inviter = inviteLink.data.inviter;
                    return [2 /*return*/, {
                            success: true,
                            data: {
                                code: inviteLink.data.code,
                                companyId: inviteLink.data.companyId,
                                companyName: (_d = company === null || company === void 0 ? void 0 : company.name) !== null && _d !== void 0 ? _d : "Company",
                                inviterName: (_e = inviter === null || inviter === void 0 ? void 0 : inviter.fullName) !== null && _e !== void 0 ? _e : "A team member",
                                roleName: (_f = employeeType === null || employeeType === void 0 ? void 0 : employeeType.name) !== null && _f !== void 0 ? _f : "Employee",
                                label: inviteLink.data.label,
                                expired: expired,
                                alreadyApplied: alreadyApplied,
                                alreadyMember: alreadyMember,
                                loginMethods: loginMethods,
                                satisfiedMethods: satisfiedMethods
                            }
                        }];
            }
        });
    });
}
function createInviteLink(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var companyId = _b.companyId, createdBy = _b.createdBy, employeeTypeId = _b.employeeTypeId, locationId = _b.locationId, label = _b.label, expiresAt = _b.expiresAt, loginMethods = _b.loginMethods;
        return __generator(this, function (_c) {
            return [2 /*return*/, client
                    .from("inviteLink")
                    .insert({
                    code: (0, nanoid_1.nanoid)(12),
                    companyId: companyId,
                    createdBy: createdBy,
                    employeeTypeId: employeeTypeId,
                    locationId: locationId,
                    label: label || null,
                    expiresAt: expiresAt || null,
                    loginMethods: loginMethods && loginMethods.length ? loginMethods : null
                })
                    .select("*")
                    .single()];
        });
    });
}
function revokeInviteLink(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var id = _b.id, companyId = _b.companyId;
        return __generator(this, function (_c) {
            return [2 /*return*/, client
                    .from("inviteLink")
                    .update({ revokedAt: new Date().toISOString() })
                    .eq("id", id)
                    .eq("companyId", companyId)
                    .select("*")
                    .single()];
        });
    });
}
function updateInviteLinkExpiry(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var id = _b.id, companyId = _b.companyId, expiresAt = _b.expiresAt;
        return __generator(this, function (_c) {
            return [2 /*return*/, client
                    .from("inviteLink")
                    .update({ expiresAt: expiresAt })
                    .eq("id", id)
                    .eq("companyId", companyId)
                    .select("*")
                    .single()];
        });
    });
}
function submitMembershipApplication(serviceRole, code, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var inviteLink, requiredMethods, identities, satisfied_1, missing, existingEmployee, pendingApplication, application;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, serviceRole
                        .from("inviteLink")
                        .select("*")
                        .eq("code", code)
                        .maybeSingle()];
                case 1:
                    inviteLink = _c.sent();
                    if (inviteLink.error || !inviteLink.data) {
                        return [2 /*return*/, { success: false, message: "Invite link not found" }];
                    }
                    if ((0, invite_links_service_1.isInviteLinkExpired)(inviteLink.data)) {
                        return [2 /*return*/, { success: false, message: "This invite link is no longer valid" }];
                    }
                    requiredMethods = ((_a = inviteLink.data.loginMethods) !== null && _a !== void 0 ? _a : []).filter(function (m) { return typeof m === "string"; });
                    if (!requiredMethods.length) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, identity_server_1.getUserIdentities)(userId)];
                case 2:
                    identities = _c.sent();
                    satisfied_1 = new Set(identities.map(function (i) { return i.type; }));
                    missing = requiredMethods.filter(function (m) { return !satisfied_1.has(m); });
                    if (missing.length) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Please complete all required login methods before joining"
                            }];
                    }
                    _c.label = 3;
                case 3: return [4 /*yield*/, serviceRole
                        .from("employee")
                        .select("active")
                        .eq("id", userId)
                        .eq("companyId", inviteLink.data.companyId)
                        .maybeSingle()];
                case 4:
                    existingEmployee = _c.sent();
                    if ((_b = existingEmployee.data) === null || _b === void 0 ? void 0 : _b.active) {
                        return [2 /*return*/, {
                                success: false,
                                message: "You are already a member of this company"
                            }];
                    }
                    return [4 /*yield*/, (0, invite_links_service_1.getPendingApplicationForUser)(serviceRole, userId, inviteLink.data.companyId)];
                case 5:
                    pendingApplication = _c.sent();
                    if (pendingApplication.data) {
                        return [2 /*return*/, {
                                success: false,
                                message: "You already have a pending application for this company"
                            }];
                    }
                    return [4 /*yield*/, serviceRole.from("membershipApplication").insert({
                            companyId: inviteLink.data.companyId,
                            inviteLinkId: inviteLink.data.id,
                            userId: userId,
                            employeeTypeId: inviteLink.data.employeeTypeId,
                            locationId: inviteLink.data.locationId,
                            status: "pending"
                        })];
                case 6:
                    application = _c.sent();
                    if (application.error) {
                        return [2 /*return*/, { success: false, message: application.error.message }];
                    }
                    return [2 /*return*/, { success: true }];
            }
        });
    });
}
function approveMembershipApplication(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var application, seat, serviceRole, grant, update;
        var id = _b.id, companyId = _b.companyId, reviewerId = _b.reviewerId, locationId = _b.locationId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client
                        .from("membershipApplication")
                        .select("*")
                        .eq("id", id)
                        .eq("companyId", companyId)
                        .maybeSingle()];
                case 1:
                    application = _c.sent();
                    if (application.error || !application.data) {
                        return [2 /*return*/, { success: false, message: "Application not found" }];
                    }
                    if (application.data.status !== "pending") {
                        return [2 /*return*/, { success: false, message: "Application has already been reviewed" }];
                    }
                    return [4 /*yield*/, (0, settings_1.checkSeatAvailability)(client, companyId, 1)];
                case 2:
                    seat = _c.sent();
                    if (!seat.ok) {
                        return [2 /*return*/, { success: false, message: seat.message }];
                    }
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, users_server_1.grantEmployeeAccess)(serviceRole, {
                            userId: application.data.userId,
                            companyId: companyId,
                            employeeTypeId: application.data.employeeTypeId,
                            locationId: locationId !== null && locationId !== void 0 ? locationId : application.data.locationId
                        })];
                case 3:
                    grant = _c.sent();
                    if (!grant.success) {
                        return [2 /*return*/, grant];
                    }
                    return [4 /*yield*/, client
                            .from("membershipApplication")
                            .update(__assign({ status: "approved", reviewedBy: reviewerId, reviewedAt: new Date().toISOString() }, (locationId ? { locationId: locationId } : {})))
                            .eq("id", id)
                            .eq("companyId", companyId)];
                case 4:
                    update = _c.sent();
                    if (update.error) {
                        return [2 /*return*/, { success: false, message: update.error.message }];
                    }
                    return [4 /*yield*/, kv_1.redis.del((0, auth_1.getPermissionCacheKey)(application.data.userId))];
                case 5:
                    _c.sent();
                    if (!(auth_1.CarbonEdition === utils_1.Edition.Cloud)) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, stripe_server_1.updateSubscriptionQuantityForCompany)(companyId)];
                case 6:
                    _c.sent();
                    _c.label = 7;
                case 7: return [2 /*return*/, { success: true }];
            }
        });
    });
}
function rejectMembershipApplication(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var update;
        var id = _b.id, companyId = _b.companyId, reviewerId = _b.reviewerId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client
                        .from("membershipApplication")
                        .update({
                        status: "rejected",
                        reviewedBy: reviewerId,
                        reviewedAt: new Date().toISOString()
                    })
                        .eq("id", id)
                        .eq("companyId", companyId)
                        .eq("status", "pending")
                        .select("id")
                        .maybeSingle()];
                case 1:
                    update = _c.sent();
                    if (update.error) {
                        return [2 /*return*/, { success: false, message: update.error.message }];
                    }
                    if (!update.data) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Application not found or already reviewed"
                            }];
                    }
                    return [2 /*return*/, { success: true }];
            }
        });
    });
}
