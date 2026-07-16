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
exports.onboardFunction = void 0;
var openai_1 = require("@ai-sdk/openai");
var client_server_1 = require("@carbon/auth/client.server");
var email_1 = require("@carbon/documents/email");
var env_1 = require("@carbon/env");
var resend_server_1 = require("@carbon/lib/resend.server");
var slack_server_1 = require("@carbon/lib/slack.server");
var twenty_server_1 = require("@carbon/lib/twenty.server");
var components_1 = require("@react-email/components");
var ai_1 = require("ai");
var v3_1 = require("zod/v3");
var client_1 = require("../../client");
exports.onboardFunction = client_1.inngest.createFunction({ id: "onboard", retries: 3 }, { event: "carbon/onboard" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var _c, type, companyId, userId, plan, carbon, twenty, slack, _d, company, user, _e, leadType_1, twentyId_1, sendOnboardingEmail, from_1, from_2;
    var _f;
    var event = _b.event, step = _b.step;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _c = event.data, type = _c.type, companyId = _c.companyId, userId = _c.userId, plan = _c.plan;
                carbon = (0, client_server_1.getCarbonServiceRole)();
                twenty = (0, twenty_server_1.getTwentyClient)();
                slack = (0, slack_server_1.getSlackClient)();
                return [4 /*yield*/, step.run("load-company-and-user", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, company, user;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, Promise.all([
                                        carbon.from("company").select("*").eq("id", companyId).single(),
                                        carbon.from("user").select("*").eq("id", userId).single()
                                    ])];
                                case 1:
                                    _a = _b.sent(), company = _a[0], user = _a[1];
                                    if (company.error) {
                                        console.error("Could not find company", company.error);
                                        throw new Error(company.error.message);
                                    }
                                    if (user.error) {
                                        console.error("Could not find user", user.error);
                                        throw new Error(user.error.message);
                                    }
                                    return [2 /*return*/, { company: company.data, user: user.data }];
                            }
                        });
                    }); })];
            case 1:
                _d = _g.sent(), company = _d.company, user = _d.user;
                _e = type;
                switch (_e) {
                    case "lead": return [3 /*break*/, 2];
                    case "customer": return [3 /*break*/, 7];
                }
                return [3 /*break*/, 19];
            case 2: return [4 /*yield*/, step.run("create-resend-contact", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var error_1;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                console.log("Processing lead case for user:", userId, "company:", companyId);
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, resend_server_1.resend.contacts.create({
                                        email: (_a = user.email) !== null && _a !== void 0 ? _a : "",
                                        firstName: user.firstName,
                                        lastName: user.lastName,
                                        unsubscribed: false,
                                        audienceId: process.env.RESEND_AUDIENCE_ID
                                    })];
                            case 2:
                                _b.sent();
                                console.log("Successfully created resend contact for:", user.email);
                                return [3 /*break*/, 4];
                            case 3:
                                error_1 = _b.sent();
                                console.error("Error creating resend contact", error_1);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); })];
            case 3:
                _g.sent();
                return [4 /*yield*/, step.run("classify-lead", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var type, object, error_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    type = "Warm";
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, (0, ai_1.generateObject)({
                                            model: (0, openai_1.openai)("gpt-4o"),
                                            schema: v3_1.z.object({
                                                type: v3_1.z.enum(["Warm", "Cold"]).describe("The type of lead")
                                            }),
                                            prompt: "\n                The following is a description of a lead for an ERP system.\n                Determine the quality of the lead based on the description.\n                If the company seems like a real business, return \"Warm\".\n                If it seems like someone is trying to keep their information private by providing a fake company name, return \"Cold\".\n\n                Description:\n                Company: ".concat(company.name, "\n                City: ").concat(company.city, "\n                State: ").concat(company.stateProvince, "\n                Address: ").concat(company.addressLine1, " ").concat(company.addressLine2, "\n                Country: ").concat(company.countryCode, "\n                Website: ").concat(company.website, "\n                Phone: ").concat(company.phone, "\n              "),
                                            temperature: 0.2
                                        })];
                                case 2:
                                    object = (_a.sent()).object;
                                    type = object.type;
                                    console.log("Generated type:", type);
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_2 = _a.sent();
                                    console.error("Error generating type", error_2);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/, type];
                            }
                        });
                    }); })];
            case 4:
                leadType_1 = _g.sent();
                return [4 /*yield*/, step.run("send-slack-lead-notification", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var slackResult, error_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log("Attempting to send Slack message to #leads channel");
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, slack.sendMessage({
                                            channel: "#leads",
                                            text: "New lead 🎉",
                                            blocks: [
                                                {
                                                    type: "section",
                                                    text: {
                                                        type: "mrkdwn",
                                                        text: "*New Signup* ".concat(leadType_1 === "Warm" ? "🥁" : "❄️", "\n\n") +
                                                            "*Contact Information*\n" +
                                                            "\u2022 Name: ".concat(user === null || user === void 0 ? void 0 : user.firstName, " ").concat(user === null || user === void 0 ? void 0 : user.lastName, "\n") +
                                                            "\u2022 Email: ".concat(user === null || user === void 0 ? void 0 : user.email, "\n") +
                                                            "\u2022 Location: ".concat(company.city, ", ").concat(company.stateProvince, "\n\n") +
                                                            "\u2022 Company: ".concat(company.name, "\n\n") +
                                                            "\u2022 Type: ".concat(leadType_1, "\n\n")
                                                    }
                                                }
                                            ]
                                        })];
                                case 2:
                                    slackResult = _a.sent();
                                    console.log("Successfully sent Slack message:", slackResult);
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_3 = _a.sent();
                                    console.error("Error sending Slack message:", error_3);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 5:
                _g.sent();
                return [4 /*yield*/, step.run("add-lead-to-crm", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var twentyPersonId, updateResult, twentyCompanyId, twentyOpportunityId, updateResult_1, error_4;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    if (!process.env.TWENTY_API_KEY) return [3 /*break*/, 10];
                                    _d.label = 1;
                                case 1:
                                    _d.trys.push([1, 8, , 9]);
                                    return [4 /*yield*/, twenty.createPerson({
                                            name: {
                                                firstName: user.firstName,
                                                lastName: user.lastName
                                            },
                                            emails: {
                                                primaryEmail: (_a = user.email) !== null && _a !== void 0 ? _a : ""
                                            },
                                            customerStatus: ["PROSPECTIVE_CUSTOMER"],
                                            location: "".concat(company.city, ", ").concat(company.stateProvince)
                                        })];
                                case 2:
                                    twentyPersonId = _d.sent();
                                    return [4 /*yield*/, carbon
                                            .from("user")
                                            .update({
                                            externalId: {
                                                twenty: twentyPersonId
                                            }
                                        })
                                            .eq("id", userId)];
                                case 3:
                                    updateResult = _d.sent();
                                    console.log("User update result:", updateResult);
                                    if (updateResult.error) {
                                        console.error("Error updating user external ID:", updateResult.error);
                                    }
                                    else {
                                        console.log("Successfully updated user external ID");
                                    }
                                    if (!(leadType_1 === "Warm")) return [3 /*break*/, 7];
                                    return [4 /*yield*/, twenty.createCompany({
                                            name: company.name,
                                            domainName: {
                                                primaryLinkLabel: removeProtocolFromWebsite((_b = company.website) !== null && _b !== void 0 ? _b : ""),
                                                primaryLinkUrl: ensureProtocolFromWebsite((_c = company.website) !== null && _c !== void 0 ? _c : ""),
                                                additionalLinks: []
                                            }
                                        })];
                                case 4:
                                    twentyCompanyId = _d.sent();
                                    return [4 /*yield*/, twenty.createOpportunity({
                                            name: "".concat(company.name, " Opportunity"),
                                            stage: ["NEW"],
                                            companyId: twentyCompanyId,
                                            pointOfContactId: twentyPersonId
                                        })];
                                case 5:
                                    twentyOpportunityId = _d.sent();
                                    return [4 /*yield*/, carbon
                                            .from("company")
                                            .update({
                                            externalId: {
                                                twenty: twentyOpportunityId
                                            }
                                        })
                                            .eq("id", companyId)];
                                case 6:
                                    updateResult_1 = _d.sent();
                                    console.log("Company update result:", updateResult_1);
                                    if (updateResult_1.error) {
                                        console.error("Error updating company external ID:", updateResult_1.error);
                                    }
                                    else {
                                        console.log("Successfully updated company external ID");
                                    }
                                    _d.label = 7;
                                case 7: return [3 /*break*/, 9];
                                case 8:
                                    error_4 = _d.sent();
                                    console.error("Error adding lead to CRM:", error_4);
                                    return [3 /*break*/, 9];
                                case 9: return [3 /*break*/, 11];
                                case 10:
                                    console.log("TWENTY_API_KEY not found, skipping CRM integration");
                                    _d.label = 11;
                                case 11: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 6:
                _g.sent();
                return [3 /*break*/, 19];
            case 7:
                twentyId_1 = (_f = user === null || user === void 0 ? void 0 : user.externalId) === null || _f === void 0 ? void 0 : _f.twenty;
                return [4 /*yield*/, step.run("send-slack-customer-notification", function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            try {
                                slack.sendMessage({
                                    channel: "#sales",
                                    text: "New Customer",
                                    blocks: [
                                        {
                                            type: "section",
                                            text: {
                                                type: "mrkdwn",
                                                text: "*New Signup*\n\n" +
                                                    "*Contact Information*\n" +
                                                    "\u2022 Name: ".concat(user === null || user === void 0 ? void 0 : user.firstName, " ").concat(user === null || user === void 0 ? void 0 : user.lastName, "\n") +
                                                    "\u2022 Email: ".concat(user.email, "\n") +
                                                    "\u2022 Company: ".concat(company === null || company === void 0 ? void 0 : company.name, "\n\n") +
                                                    "\u2022 Plan: $".concat(plan, "\n\n")
                                            }
                                        }
                                    ]
                                });
                            }
                            catch (error) {
                                console.error("Error sending Slack message:", error);
                            }
                            return [2 /*return*/];
                        });
                    }); })];
            case 8:
                _g.sent();
                return [4 /*yield*/, step.run("update-twenty-customer-status", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var error_5;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!twentyId_1) return [3 /*break*/, 4];
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, twenty.updatePerson(twentyId_1, {
                                            customerStatus: ["PILOT_FREE_TRIAL"]
                                        })];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_5 = _a.sent();
                                    console.error("Error updating twenty customer status:", error_5);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 9:
                _g.sent();
                return [4 /*yield*/, step.run("check-onboarding-email-eligibility", function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, shouldSendOnboardingEmailsToUser(carbon, userId)];
                        });
                    }); })];
            case 10:
                sendOnboardingEmail = _g.sent();
                return [4 /*yield*/, step.sleep("wait-5m", "5m")];
            case 11:
                _g.sent();
                if (!sendOnboardingEmail) return [3 /*break*/, 13];
                from_1 = "Chase from Carbon <".concat(env_1.RESEND_DOMAIN === "carbon.ms"
                    ? "chase@carbon.ms"
                    : "no-reply@".concat(env_1.RESEND_DOMAIN), ">");
                return [4 /*yield*/, step.run("send-welcome-email", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        var _b;
                        var _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _a = resend_server_1.sendEmail;
                                    _b = {
                                        from: from_1,
                                        to: (_c = user.email) !== null && _c !== void 0 ? _c : "",
                                        subject: "Carbon"
                                    };
                                    return [4 /*yield*/, (0, components_1.render)((0, email_1.WelcomeEmail)())];
                                case 1: return [4 /*yield*/, _a.apply(void 0, [(_b.html = _d.sent(),
                                            _b)])];
                                case 2:
                                    _d.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 12:
                _g.sent();
                _g.label = 13;
            case 13: return [4 /*yield*/, step.sleep("wait-3d", "3d")];
            case 14:
                _g.sent();
                if (!sendOnboardingEmail) return [3 /*break*/, 16];
                from_2 = "Info from Carbon <".concat(env_1.RESEND_DOMAIN === "carbon.ms"
                    ? "info@carbon.ms"
                    : "no-reply@".concat(env_1.RESEND_DOMAIN), ">");
                return [4 /*yield*/, step.run("send-get-started-email", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        var _b;
                        var _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _a = resend_server_1.sendEmail;
                                    _b = {
                                        from: from_2,
                                        to: (_c = user.email) !== null && _c !== void 0 ? _c : "",
                                        subject: "Get the most out of Carbon"
                                    };
                                    return [4 /*yield*/, (0, components_1.render)((0, email_1.GetStartedEmail)({
                                            firstName: user.firstName,
                                            academyUrl: "https://learn.carbon.ms"
                                        }))];
                                case 1: return [4 /*yield*/, _a.apply(void 0, [(_b.html = _d.sent(),
                                            _b)])];
                                case 2:
                                    _d.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 15:
                _g.sent();
                _g.label = 16;
            case 16: return [4 /*yield*/, step.sleep("wait-30d", "30d")];
            case 17:
                _g.sent();
                return [4 /*yield*/, step.run("check-plan-status-after-30d", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var planAfter30Days, isPlanActiveAfter30Days;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, carbon
                                        .from("companyPlan")
                                        .select("*")
                                        .eq("id", companyId)
                                        .maybeSingle()];
                                case 1:
                                    planAfter30Days = _b.sent();
                                    isPlanActiveAfter30Days = ((_a = planAfter30Days === null || planAfter30Days === void 0 ? void 0 : planAfter30Days.data) === null || _a === void 0 ? void 0 : _a.stripeSubscriptionStatus) === "Active";
                                    if (!(isPlanActiveAfter30Days && twentyId_1)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, twenty.updatePerson(twentyId_1, {
                                            customerStatus: [
                                                isPlanActiveAfter30Days
                                                    ? "CHURNED_CANCELED"
                                                    : "EXISTING_CUSTOMER"
                                            ]
                                        })];
                                case 2:
                                    _b.sent();
                                    _b.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 18:
                _g.sent();
                return [3 /*break*/, 19];
            case 19: return [2 /*return*/];
        }
    });
}); });
function shouldSendOnboardingEmailsToUser(carbon, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var userToCompany;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, carbon
                        .from("userToCompany")
                        .select("*")
                        .eq("userId", userId)];
                case 1:
                    userToCompany = _a.sent();
                    if (userToCompany.error) {
                        return [2 /*return*/, true];
                    }
                    return [2 /*return*/, userToCompany.data.length <= 1];
            }
        });
    });
}
function removeProtocolFromWebsite(website) {
    if (!website)
        return undefined;
    return website.replace(/^https?:\/\//, "").replace(/^www\./, "");
}
function ensureProtocolFromWebsite(website) {
    if (!website)
        return undefined;
    return website.startsWith("http") ? website : "https://".concat(website);
}
