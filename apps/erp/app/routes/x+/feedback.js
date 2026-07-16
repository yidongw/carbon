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
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var form_1 = require("@carbon/form");
var slack_server_1 = require("@carbon/lib/slack.server");
var shared_1 = require("~/modules/shared");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, userId, companyId, formData, validation, _d, attachmentPath, feedback, location, serviceRole, slackClient, _e, company, user, insertFeedback, channel;
        var _f, _g, _h, _j, _k, _l, _m;
        var request = _b.request;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _o.sent(), userId = _c.userId, companyId = _c.companyId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _o.sent();
                    return [4 /*yield*/, (0, form_1.validator)(shared_1.feedbackValidator).validate(formData)];
                case 3:
                    validation = _o.sent();
                    if (validation.error) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to submit feedback"
                            }];
                    }
                    _d = validation.data, attachmentPath = _d.attachmentPath, feedback = _d.feedback, location = _d.location;
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 4:
                    serviceRole = _o.sent();
                    slackClient = (0, slack_server_1.getSlackClient)();
                    return [4 /*yield*/, Promise.all([
                            serviceRole
                                .from("company")
                                .select("slackChannel")
                                .eq("id", companyId)
                                .single(),
                            serviceRole
                                .from("user")
                                .select("firstName,lastName,email")
                                .eq("id", userId)
                                .single(),
                            serviceRole.from("feedback").insert([
                                {
                                    feedback: feedback,
                                    location: location,
                                    attachmentPath: attachmentPath ? "feedback/".concat(attachmentPath) : null,
                                    userId: userId
                                }
                            ])
                        ])];
                case 5:
                    _e = _o.sent(), company = _e[0], user = _e[1], insertFeedback = _e[2];
                    if (insertFeedback.error) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to submit feedback"
                            }];
                    }
                    channel = "#feedback";
                    if ((_f = company.data) === null || _f === void 0 ? void 0 : _f.slackChannel) {
                        channel = company.data.slackChannel;
                        if (!channel.startsWith("#")) {
                            channel = "#".concat(channel);
                        }
                    }
                    return [4 /*yield*/, slackClient.sendMessage({
                            channel: channel,
                            text: "New feedback submitted",
                            blocks: [
                                {
                                    type: "section",
                                    text: { type: "mrkdwn", text: "New feedback submitted" }
                                },
                                {
                                    type: "section",
                                    fields: [
                                        { type: "mrkdwn", text: "*Location:*\n".concat(location) },
                                        { type: "mrkdwn", text: "*Feedback:*\n".concat(feedback) },
                                        {
                                            type: "mrkdwn",
                                            text: "*User:*\n".concat((_h = (_g = user.data) === null || _g === void 0 ? void 0 : _g.firstName) !== null && _h !== void 0 ? _h : "", " ").concat((_k = (_j = user.data) === null || _j === void 0 ? void 0 : _j.lastName) !== null && _k !== void 0 ? _k : "", " <").concat((_m = (_l = user.data) === null || _l === void 0 ? void 0 : _l.email) !== null && _m !== void 0 ? _m : "", ">")
                                        },
                                        {
                                            type: "mrkdwn",
                                            text: "*Attachment:*\n".concat(attachmentPath
                                                ? "".concat(auth_1.SUPABASE_URL, "/storage/v1/object/public/feedback/").concat(attachmentPath)
                                                : "None")
                                        }
                                    ]
                                }
                            ]
                        })];
                case 6:
                    _o.sent();
                    return [2 /*return*/, { success: true, message: "Feedback submitted" }];
            }
        });
    });
}
