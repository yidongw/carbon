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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = action;
var auth_1 = require("@carbon/auth");
var client_server_1 = require("@carbon/auth/client.server");
var slack_server_1 = require("@carbon/ee/slack.server");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var quality_service_1 = require("~/modules/quality/quality.service");
var path_1 = require("~/utils/path");
var slackInteractivePayloadSchema = zod_1.z.object({
    type: zod_1.z.string(),
    team: zod_1.z
        .object({
        id: zod_1.z.string(),
        domain: zod_1.z.string()
    })
        .optional(),
    user: zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string().optional(),
        username: zod_1.z.string().optional()
    }),
    channel: zod_1.z
        .object({
        id: zod_1.z.string(),
        name: zod_1.z.string()
    })
        .optional(),
    trigger_id: zod_1.z.string().optional(),
    response_url: zod_1.z.string().optional(),
    actions: zod_1.z.array(zod_1.z.any()).optional(),
    view: zod_1.z.any().optional(),
    api_app_id: zod_1.z.string().optional(),
    token: zod_1.z.string().optional(),
    container: zod_1.z.any().optional(),
    enterprise: zod_1.z.any().optional(),
    message: zod_1.z.any().optional(),
    // Shortcut specific fields
    callback_id: zod_1.z.string().optional()
});
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var formData, payloadString, payload, serviceRole, integration, _c, companyId, metadata, slackToken, error_1;
        var _d, _e, _f, _g;
        var request = _b.request;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _h.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, request.formData()];
                case 1:
                    formData = _h.sent();
                    payloadString = formData.get("payload");
                    if (!payloadString) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Missing payload" }, { status: 400 })];
                    }
                    payload = slackInteractivePayloadSchema.safeParse(JSON.parse(payloadString));
                    if (!payload.success) {
                        console.error("Slack payload validation error:", JSON.stringify(payload.error));
                        return [2 /*return*/, (0, react_router_1.data)({
                                response_type: "ephemeral",
                                text: "Invalid payload format received."
                            }, { status: 400 })];
                    }
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 2:
                    serviceRole = _h.sent();
                    if (!((_d = payload.data.team) === null || _d === void 0 ? void 0 : _d.id)) {
                        return [2 /*return*/, {
                                response_type: "ephemeral",
                                text: "Invalid payload: missing team information."
                            }];
                    }
                    return [4 /*yield*/, (0, slack_server_1.getSlackIntegrationByTeamId)(serviceRole, payload.data.team.id)];
                case 3:
                    integration = _h.sent();
                    if (!((_e = integration.data) === null || _e === void 0 ? void 0 : _e[0]) || integration.error) {
                        console.error("Failed to get Slack integration", integration.error);
                        return [2 /*return*/, {
                                response_type: "ephemeral",
                                text: "Slack integration not found for this workspace."
                            }];
                    }
                    _c = (_f = integration.data) === null || _f === void 0 ? void 0 : _f[0], companyId = _c.companyId, metadata = _c.metadata;
                    slackToken = metadata === null || metadata === void 0 ? void 0 : metadata.access_token;
                    if (!slackToken) {
                        console.error("Slack token not found");
                        return [2 /*return*/, {
                                response_type: "ephemeral",
                                text: "Slack token not found. Please reconfigure the integration."
                            }];
                    }
                    switch (payload.data.type) {
                        case "shortcut":
                            return [2 /*return*/, handleShortcut(payload.data, companyId, slackToken, serviceRole)];
                        case "block_actions":
                            return [2 /*return*/, handleBlockActions(payload.data, companyId, slackToken)];
                        case "view_submission":
                            return [2 /*return*/, handleViewSubmission(payload.data, companyId, slackToken, serviceRole, (_g = integration.data) === null || _g === void 0 ? void 0 : _g[0])];
                        case "view_closed":
                            return [2 /*return*/, { ok: true }];
                        default:
                            return [2 /*return*/, {
                                    response_type: "ephemeral",
                                    text: "Unknown interaction type: ".concat(payload.data.type)
                                }];
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _h.sent();
                    console.error("Slack interactive error:", error_1);
                    return [2 /*return*/, (0, react_router_1.data)({
                            response_type: "ephemeral",
                            text: "An error occurred processing your interaction. Please try again."
                        }, { status: 500 })];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function handleBlockActions(payload, companyId, slackToken) {
    return __awaiter(this, void 0, void 0, function () {
        var action;
        var _a;
        return __generator(this, function (_b) {
            action = (_a = payload.actions) === null || _a === void 0 ? void 0 : _a[0];
            if (!action) {
                return [2 /*return*/, { ok: true }];
            }
            // Handle other block actions here as needed
            // Issue creation is now handled via shortcuts
            switch (action.action_id) {
                case "view_in_carbon":
                    return [2 /*return*/, { ok: true }];
                default:
                    return [2 /*return*/, { ok: true }];
            }
            return [2 /*return*/];
        });
    });
}
function handleShortcut(payload, companyId, slackToken, serviceRole) {
    return __awaiter(this, void 0, void 0, function () {
        var callbackId;
        return __generator(this, function (_a) {
            callbackId = payload.callback_id;
            switch (callbackId) {
                case "create_ncr_modal":
                    return [2 /*return*/, handleCreateNcrShortcut(payload, companyId, slackToken, serviceRole)];
                default:
                    return [2 /*return*/, { ok: true }];
            }
            return [2 /*return*/];
        });
    });
}
function handleCreateNcrShortcut(payload, companyId, slackToken, serviceRole) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, types, workflows, slackClient, error_2;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!payload.trigger_id) {
                        return [2 /*return*/, {
                                response_type: "ephemeral",
                                text: "Missing trigger ID for modal interaction."
                            }];
                    }
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, Promise.all([
                            (0, quality_service_1.getIssueTypesList)(serviceRole, companyId),
                            (0, quality_service_1.getIssueWorkflowsList)(serviceRole, companyId)
                        ])];
                case 2:
                    _a = _d.sent(), types = _a[0], workflows = _a[1];
                    slackClient = (0, slack_server_1.createSlackWebClient)({ token: slackToken });
                    return [4 /*yield*/, slackClient.views.open({
                            trigger_id: payload.trigger_id,
                            view: {
                                type: "modal",
                                callback_id: "create_ncr_modal",
                                title: {
                                    type: "plain_text",
                                    text: "Create Issue"
                                },
                                submit: {
                                    type: "plain_text",
                                    text: "Create"
                                },
                                close: {
                                    type: "plain_text",
                                    text: "Cancel"
                                },
                                blocks: __spreadArray(__spreadArray([
                                    {
                                        type: "input",
                                        block_id: "title_block",
                                        label: {
                                            type: "plain_text",
                                            text: "Title"
                                        },
                                        element: {
                                            type: "plain_text_input",
                                            action_id: "title",
                                            placeholder: {
                                                type: "plain_text",
                                                text: "Brief description of the non-conformance"
                                            }
                                        }
                                    },
                                    {
                                        type: "input",
                                        block_id: "description_block",
                                        label: {
                                            type: "plain_text",
                                            text: "Description"
                                        },
                                        element: {
                                            type: "plain_text_input",
                                            action_id: "description",
                                            multiline: true,
                                            placeholder: {
                                                type: "plain_text",
                                                text: "Detailed description of the issue"
                                            }
                                        },
                                        optional: true
                                    },
                                    {
                                        type: "input",
                                        block_id: "type_block",
                                        label: {
                                            type: "plain_text",
                                            text: "Type"
                                        },
                                        element: {
                                            type: "static_select",
                                            action_id: "type",
                                            placeholder: {
                                                type: "plain_text",
                                                text: "Select issue type"
                                            },
                                            options: ((_b = types.data) === null || _b === void 0 ? void 0 : _b.map(function (type) { return ({
                                                text: {
                                                    type: "plain_text",
                                                    text: type.name
                                                },
                                                value: type.id
                                            }); })) || []
                                        }
                                    }
                                ], (workflows.data && workflows.data.length > 0
                                    ? [
                                        {
                                            type: "input",
                                            block_id: "workflow_block",
                                            label: {
                                                type: "plain_text",
                                                text: "Workflow"
                                            },
                                            element: {
                                                type: "static_select",
                                                action_id: "workflow",
                                                placeholder: {
                                                    type: "plain_text",
                                                    text: "Select workflow"
                                                },
                                                options: workflows.data.map(function (workflow) { return ({
                                                    text: {
                                                        type: "plain_text",
                                                        text: workflow.name
                                                    },
                                                    value: workflow.id
                                                }); })
                                            },
                                            optional: true
                                        }
                                    ]
                                    : []), true), [
                                    {
                                        type: "input",
                                        block_id: "severity_block",
                                        label: {
                                            type: "plain_text",
                                            text: "Severity"
                                        },
                                        element: {
                                            type: "static_select",
                                            action_id: "severity",
                                            placeholder: {
                                                type: "plain_text",
                                                text: "Select severity"
                                            },
                                            options: [
                                                { text: { type: "plain_text", text: "Low" }, value: "Low" },
                                                {
                                                    text: { type: "plain_text", text: "Medium" },
                                                    value: "Medium"
                                                },
                                                { text: { type: "plain_text", text: "High" }, value: "High" },
                                                {
                                                    text: { type: "plain_text", text: "Critical" },
                                                    value: "Critical"
                                                }
                                            ]
                                        },
                                        optional: true
                                    }
                                ], false),
                                private_metadata: JSON.stringify({
                                    channel_id: ((_c = payload.channel) === null || _c === void 0 ? void 0 : _c.id) || "",
                                    user_id: payload.user.id
                                })
                            }
                        })];
                case 3:
                    _d.sent();
                    return [2 /*return*/, { ok: true }];
                case 4:
                    error_2 = _d.sent();
                    console.error("Error opening Issue modal:", error_2);
                    return [2 /*return*/, {
                            response_type: "ephemeral",
                            text: "Failed to open Issue form. Please try again."
                        }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function handleViewSubmission(payload, companyId, slackToken, serviceRole, integration) {
    return __awaiter(this, void 0, void 0, function () {
        var view, values, title, description, typeId, workflowId, severity, modalMetadata, user_id, integrationMetadata, configuredChannelId, employee, createResult, ncrId, _a, threadResult, tasksResult, error_3;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    view = payload.view;
                    if (view.callback_id !== "create_ncr_modal") {
                        return [2 /*return*/, { ok: true }];
                    }
                    _r.label = 1;
                case 1:
                    _r.trys.push([1, 5, , 6]);
                    values = view.state.values;
                    title = values.title_block.title.value;
                    description = ((_c = (_b = values.description_block) === null || _b === void 0 ? void 0 : _b.description) === null || _c === void 0 ? void 0 : _c.value) || "";
                    typeId = (_d = values.type_block.type.selected_option) === null || _d === void 0 ? void 0 : _d.value;
                    workflowId = (_g = (_f = (_e = values.workflow_block) === null || _e === void 0 ? void 0 : _e.workflow) === null || _f === void 0 ? void 0 : _f.selected_option) === null || _g === void 0 ? void 0 : _g.value;
                    severity = ((_k = (_j = (_h = values.severity_block) === null || _h === void 0 ? void 0 : _h.severity) === null || _j === void 0 ? void 0 : _j.selected_option) === null || _k === void 0 ? void 0 : _k.value) || "Medium";
                    modalMetadata = JSON.parse(view.private_metadata);
                    user_id = modalMetadata.user_id;
                    integrationMetadata = integration.metadata;
                    configuredChannelId = integrationMetadata === null || integrationMetadata === void 0 ? void 0 : integrationMetadata.channel_id;
                    if (!configuredChannelId) {
                        throw new Error("No channel configured for Slack integration");
                    }
                    return [4 /*yield*/, (0, slack_server_1.getCarbonEmployeeFromSlackId)(serviceRole, slackToken, user_id, companyId)];
                case 2:
                    employee = _r.sent();
                    if (employee.error || !employee.data) {
                        console.error(employee.error);
                        throw new Error("Failed to get employee");
                    }
                    return [4 /*yield*/, (0, quality_service_1.insertIssue)(serviceRole, {
                            companyId: companyId,
                            createdBy: (_l = employee.data) === null || _l === void 0 ? void 0 : _l.id,
                            description: description,
                            locationId: ((_m = employee.data) === null || _m === void 0 ? void 0 : _m.locationId) || "",
                            name: title,
                            nonConformanceTypeId: typeId,
                            nonConformanceWorkflowId: workflowId,
                            openDate: new Date().toISOString(),
                            priority: severity,
                            source: "Internal"
                        })];
                case 3:
                    createResult = _r.sent();
                    if (createResult.error || !createResult.data) {
                        console.error(createResult.error);
                        throw new Error("Failed to create issue");
                    }
                    ncrId = createResult.data.id;
                    return [4 /*yield*/, Promise.all([
                            (0, slack_server_1.createIssueSlackThread)(serviceRole, {
                                carbonUrl: "".concat(auth_1.ERP_URL).concat(path_1.path.to.issue(ncrId)),
                                companyId: companyId,
                                description: description,
                                id: ncrId,
                                nonConformanceId: createResult.data.nonConformanceId,
                                severity: severity,
                                title: title,
                                userId: (_o = employee.data) === null || _o === void 0 ? void 0 : _o.id
                            }, {
                                slackToken: slackToken,
                                slackUserId: user_id,
                                channelId: configuredChannelId
                            }),
                            serviceRole.functions.invoke("create", {
                                body: {
                                    type: "nonConformanceTasks",
                                    id: ncrId,
                                    companyId: companyId,
                                    userId: (_q = (_p = employee.data) === null || _p === void 0 ? void 0 : _p.id) !== null && _q !== void 0 ? _q : "system"
                                }
                            })
                        ])];
                case 4:
                    _a = _r.sent(), threadResult = _a[0], tasksResult = _a[1];
                    if (tasksResult.error) {
                        console.error("Error creating tasks:", tasksResult.error);
                    }
                    if (threadResult.error) {
                        console.error("Error creating thread:", threadResult.error);
                    }
                    return [2 /*return*/, {
                            response_action: "clear"
                        }];
                case 5:
                    error_3 = _r.sent();
                    console.error("Error creating Issue:", error_3);
                    return [2 /*return*/, {
                            response_action: "errors",
                            errors: {
                                title_block: "Failed to create Issue. Please try again."
                            }
                        }];
                case 6: return [2 /*return*/];
            }
        });
    });
}
