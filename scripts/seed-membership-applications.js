"use strict";
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
/**
 * Seeds pending-only demo membership applications for local/preview testing.
 *
 * Usage:
 *   source /Users/xinjuan/preview/preview.env && npx tsx scripts/seed-membership-applications.ts
 */
var supabase_js_1 = require("@supabase/supabase-js");
var dotenv = require("dotenv");
dotenv.config({ path: ".env.development" });
dotenv.config({ path: ".env.local" });
dotenv.config();
var supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
var demoApplicants = [
    { email: "applications-demo-1@carbon.test", firstName: "Alex", lastName: "Rivera" },
    { email: "applications-demo-2@carbon.test", firstName: "Jordan", lastName: "Chen" },
    { email: "applications-demo-3@carbon.test", firstName: "Sam", lastName: "Patel" },
    { email: "applications-demo-4@carbon.test", firstName: "Taylor", lastName: "Nguyen" },
    { email: "applications-demo-5@carbon.test", firstName: "Morgan", lastName: "Brooks" },
    { email: "applications-demo-6@carbon.test", firstName: "Casey", lastName: "Wright" }
];
function ensureUser(applicant) {
    return __awaiter(this, void 0, void 0, function () {
        var existing, authUser, userId, upsertUser;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, supabase
                        .from("user")
                        .select("id")
                        .eq("email", applicant.email)
                        .maybeSingle()];
                case 1:
                    existing = _c.sent();
                    if ((_a = existing.data) === null || _a === void 0 ? void 0 : _a.id) {
                        return [2 /*return*/, existing.data.id];
                    }
                    return [4 /*yield*/, supabase.auth.admin.createUser({
                            email: applicant.email,
                            email_confirm: true,
                            user_metadata: {
                                firstName: applicant.firstName,
                                lastName: applicant.lastName
                            }
                        })];
                case 2:
                    authUser = _c.sent();
                    if (authUser.error || !authUser.data.user) {
                        throw (_b = authUser.error) !== null && _b !== void 0 ? _b : new Error("Failed to create auth user for ".concat(applicant.email));
                    }
                    userId = authUser.data.user.id;
                    return [4 /*yield*/, supabase.from("user").upsert({
                            id: userId,
                            email: applicant.email,
                            firstName: applicant.firstName,
                            lastName: applicant.lastName,
                            active: true
                        })];
                case 3:
                    upsertUser = _c.sent();
                    if (upsertUser.error) {
                        throw upsertUser.error;
                    }
                    return [2 /*return*/, userId];
            }
        });
    });
}
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var inviteLink, demoEmails, demoUsers, demoUserIds, resetQueries, _i, resetQueries_1, query, result, created, _a, demoApplicants_1, applicant, userId, insert;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, supabase
                        .from("inviteLink")
                        .select("id, companyId, employeeTypeId, locationId, createdBy")
                        .is("revokedAt", null)
                        .order("createdAt", { ascending: false })
                        .limit(1)
                        .maybeSingle()];
                case 1:
                    inviteLink = _e.sent();
                    if (inviteLink.error || !inviteLink.data) {
                        throw (_b = inviteLink.error) !== null && _b !== void 0 ? _b : new Error("No invite link found to attach demo applications to");
                    }
                    demoEmails = demoApplicants.map(function (applicant) { return applicant.email; });
                    return [4 /*yield*/, supabase.from("user").select("id").in("email", demoEmails)];
                case 2:
                    demoUsers = _e.sent();
                    if (demoUsers.error) {
                        throw demoUsers.error;
                    }
                    demoUserIds = (_d = (_c = demoUsers.data) === null || _c === void 0 ? void 0 : _c.map(function (user) { return user.id; })) !== null && _d !== void 0 ? _d : [];
                    if (!(demoUserIds.length > 0)) return [3 /*break*/, 6];
                    resetQueries = [
                        supabase
                            .from("membershipApplication")
                            .delete()
                            .eq("companyId", inviteLink.data.companyId)
                            .in("userId", demoUserIds),
                        supabase
                            .from("employeeJob")
                            .delete()
                            .eq("companyId", inviteLink.data.companyId)
                            .in("id", demoUserIds),
                        supabase
                            .from("employee")
                            .delete()
                            .eq("companyId", inviteLink.data.companyId)
                            .in("id", demoUserIds),
                        supabase
                            .from("userToCompany")
                            .delete()
                            .eq("companyId", inviteLink.data.companyId)
                            .in("userId", demoUserIds)
                    ];
                    _i = 0, resetQueries_1 = resetQueries;
                    _e.label = 3;
                case 3:
                    if (!(_i < resetQueries_1.length)) return [3 /*break*/, 6];
                    query = resetQueries_1[_i];
                    return [4 /*yield*/, query];
                case 4:
                    result = _e.sent();
                    if (result.error) {
                        throw result.error;
                    }
                    _e.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    created = 0;
                    _a = 0, demoApplicants_1 = demoApplicants;
                    _e.label = 7;
                case 7:
                    if (!(_a < demoApplicants_1.length)) return [3 /*break*/, 11];
                    applicant = demoApplicants_1[_a];
                    return [4 /*yield*/, ensureUser(applicant)];
                case 8:
                    userId = _e.sent();
                    return [4 /*yield*/, supabase.from("membershipApplication").insert({
                            companyId: inviteLink.data.companyId,
                            inviteLinkId: inviteLink.data.id,
                            userId: userId,
                            employeeTypeId: inviteLink.data.employeeTypeId,
                            locationId: inviteLink.data.locationId,
                            status: "pending"
                        })];
                case 9:
                    insert = _e.sent();
                    if (insert.error) {
                        throw insert.error;
                    }
                    created += 1;
                    _e.label = 10;
                case 10:
                    _a++;
                    return [3 /*break*/, 7];
                case 11:
                    console.log("Seeded ".concat(created, " pending demo membership applications."));
                    return [2 /*return*/];
            }
        });
    });
}
seed().catch(function (error) {
    console.error(error);
    process.exit(1);
});
