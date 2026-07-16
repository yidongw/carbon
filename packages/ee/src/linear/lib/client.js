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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinearClient = exports.LinearClient = void 0;
var client_server_1 = require("@carbon/auth/client.server");
var axios_1 = require("axios");
var service_1 = require("./service");
var LinearClient = /** @class */ (function () {
    function LinearClient() {
        this.instance = axios_1.default.create({
            baseURL: "https://api.linear.app/graphql",
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    LinearClient.prototype.getAuthHeaders = function (companyId) {
        return __awaiter(this, void 0, void 0, function () {
            var serviceRole, data, integration, metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        serviceRole = (0, client_server_1.getCarbonServiceRole)();
                        return [4 /*yield*/, (0, service_1.getLinearIntegration)(serviceRole, companyId)];
                    case 1:
                        data = (_a.sent()).data;
                        integration = data === null || data === void 0 ? void 0 : data[0];
                        if (!integration) {
                            throw new Error("Linear integration not found for company");
                        }
                        metadata = integration.metadata;
                        return [2 /*return*/, {
                                Authorization: metadata.apiKey
                            }];
                }
            });
        });
    };
    LinearClient.prototype.healthcheck = function (companyId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a, _b, _c;
            var _d;
            var _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 3, , 4]);
                        _b = (_a = this.instance).request;
                        _d = {
                            method: "POST"
                        };
                        return [4 /*yield*/, this.getAuthHeaders(companyId)];
                    case 1: return [4 /*yield*/, _b.apply(_a, [(_d.headers = _f.sent(),
                                _d.data = {
                                    query: "query { viewer { id } }"
                                },
                                _d)])];
                    case 2:
                        response = _f.sent();
                        return [2 /*return*/, response.status === 200 && !((_e = response.data.errors) === null || _e === void 0 ? void 0 : _e.length)];
                    case 3:
                        _c = _f.sent();
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LinearClient.prototype.listTeams = function (companyId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, response, _a, _b, error_1;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 3, , 4]);
                        query = "query Teams { teams { nodes { id name } } }";
                        _b = (_a = this.instance).request;
                        _c = {
                            method: "POST"
                        };
                        return [4 /*yield*/, this.getAuthHeaders(companyId)];
                    case 1: return [4 /*yield*/, _b.apply(_a, [(_c.headers = _d.sent(),
                                _c.data = {
                                    query: query
                                },
                                _c)])];
                    case 2:
                        response = _d.sent();
                        return [2 /*return*/, response.data.data.teams.nodes.map(function (el) { return el; })];
                    case 3:
                        error_1 = _d.sent();
                        console.error("Error listing Linear teams:", error_1);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LinearClient.prototype.listIssues = function (companyId, input) {
        return __awaiter(this, void 0, void 0, function () {
            var query, response, _a, _b, error_2;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 3, , 4]);
                        query = "query SearchIssues($term : String!) { searchIssues(term: $term, first: 5, orderBy: updatedAt) { nodes { id identifier title description state { name type color } url assignee { email } } } }";
                        _b = (_a = this.instance).request;
                        _c = {
                            method: "POST"
                        };
                        return [4 /*yield*/, this.getAuthHeaders(companyId)];
                    case 1: return [4 /*yield*/, _b.apply(_a, [(_c.headers = _d.sent(),
                                _c.data = {
                                    query: query,
                                    variables: {
                                        term: input
                                    }
                                },
                                _c)])];
                    case 2:
                        response = _d.sent();
                        return [2 /*return*/, response.data.data.searchIssues.nodes.map(function (el) { return el; })];
                    case 3:
                        error_2 = _d.sent();
                        console.error("Error listing Linear issues:", error_2);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LinearClient.prototype.getIssueById = function (companyId, issueId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, response, _a, _b, error_3;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 3, , 4]);
                        query = "query SearchIssues($filter: IssueFilter!) { issues( filter: $filter first: 1 orderBy: updatedAt ) { nodes { id identifier title dueDate description state { name type color } url assignee { email } } } }";
                        _b = (_a = this.instance).request;
                        _c = {
                            method: "POST"
                        };
                        return [4 /*yield*/, this.getAuthHeaders(companyId)];
                    case 1: return [4 /*yield*/, _b.apply(_a, [(_c.headers = _d.sent(),
                                _c.data = {
                                    query: query,
                                    variables: { filter: { id: { eq: issueId } } }
                                },
                                _c)])];
                    case 2:
                        response = _d.sent();
                        return [2 /*return*/, response.data.data.issues.nodes.at(0) || null];
                    case 3:
                        error_3 = _d.sent();
                        console.error("Error getting Linear issue by ID:", error_3);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LinearClient.prototype.createAttachmentLink = function (companyId, input) {
        return __awaiter(this, void 0, void 0, function () {
            var query, response, _a, _b;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        query = "mutation AttachmentCreate($input: AttachmentCreateInput!) { attachmentCreate(input: $input) { attachment { id } } }";
                        _b = (_a = this.instance).request;
                        _c = {
                            method: "POST"
                        };
                        return [4 /*yield*/, this.getAuthHeaders(companyId)];
                    case 1: return [4 /*yield*/, _b.apply(_a, [(_c.headers = _d.sent(),
                                _c.data = {
                                    query: query,
                                    variables: {
                                        input: input
                                    }
                                },
                                _c)])];
                    case 2:
                        response = _d.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    LinearClient.prototype.listTeamMembers = function (companyId, teamId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, response, _a, _b, error_4;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 3, , 4]);
                        query = "query Team($teamId: String!) { team(id: $teamId) { members { nodes { id email name } } } }";
                        _b = (_a = this.instance).request;
                        _c = {
                            method: "POST"
                        };
                        return [4 /*yield*/, this.getAuthHeaders(companyId)];
                    case 1: return [4 /*yield*/, _b.apply(_a, [(_c.headers = _d.sent(),
                                _c.data = {
                                    query: query,
                                    variables: { teamId: teamId }
                                },
                                _c)])];
                    case 2:
                        response = _d.sent();
                        return [2 /*return*/, response.data.data.team.members.nodes.map(function (el) { return el; })];
                    case 3:
                        error_4 = _d.sent();
                        console.error("Error listing Linear team members:", error_4);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LinearClient.prototype.createIssue = function (companyId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var query, response, _a, _b;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        query = "mutation IssueCreate($input: IssueCreateInput!) { issueCreate(input: $input) { issue { id identifier title dueDate description state { name type color } url assignee { email } } } }";
                        _b = (_a = this.instance).request;
                        _c = {
                            method: "POST"
                        };
                        return [4 /*yield*/, this.getAuthHeaders(companyId)];
                    case 1: return [4 /*yield*/, _b.apply(_a, [(_c.headers = _d.sent(),
                                _c.data = {
                                    query: query,
                                    variables: {
                                        input: data
                                    }
                                },
                                _c)])];
                    case 2:
                        response = _d.sent();
                        return [2 /*return*/, response.data.data.issueCreate.issue];
                }
            });
        });
    };
    LinearClient.prototype.getUsers = function (companyId, filter) {
        return __awaiter(this, void 0, void 0, function () {
            var query, response, _a, _b;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        query = "query Users($filter: UserFilter) { users(filter: $filter) { edges { node { id email } } } }";
                        _b = (_a = this.instance).request;
                        _c = {
                            method: "POST"
                        };
                        return [4 /*yield*/, this.getAuthHeaders(companyId)];
                    case 1: return [4 /*yield*/, _b.apply(_a, [(_c.headers = _d.sent(),
                                _c.data = {
                                    query: query,
                                    variables: { input: filter }
                                },
                                _c)])];
                    case 2:
                        response = _d.sent();
                        return [2 /*return*/, response.data.data.users.edges.map(function (el) { return el.node; })];
                }
            });
        });
    };
    LinearClient.prototype.updateIssue = function (companyId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var query, id, input, response, _a, _b, error_5;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 3, , 4]);
                        query = "mutation IssueUpdate($issueUpdateId: String!, $input: IssueUpdateInput!) { issueUpdate(id: $issueUpdateId, input: $input) { issue { id } } }";
                        id = data.id, input = __rest(data, ["id"]);
                        _b = (_a = this.instance).request;
                        _c = {
                            method: "POST"
                        };
                        return [4 /*yield*/, this.getAuthHeaders(companyId)];
                    case 1: return [4 /*yield*/, _b.apply(_a, [(_c.headers = _d.sent(),
                                _c.data = {
                                    query: query,
                                    variables: {
                                        issueUpdateId: id,
                                        input: input
                                    }
                                },
                                _c)])];
                    case 2:
                        response = _d.sent();
                        return [2 /*return*/, response.data.data.issueUpdate.issue];
                    case 3:
                        error_5 = _d.sent();
                        console.error("Error updating Linear issue:", error_5);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LinearClient.prototype.getWorkflowState = function (companyId, type) {
        return __awaiter(this, void 0, void 0, function () {
            var query, res, _a, _b;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        query = "query GetWorkflowState($filter: WorkflowStateFilter) { workflowStates(filter: $filter ) { nodes { id name color type } } }";
                        _b = (_a = this.instance).request;
                        _c = {
                            method: "POST"
                        };
                        return [4 /*yield*/, this.getAuthHeaders(companyId)];
                    case 1: return [4 /*yield*/, _b.apply(_a, [(_c.headers = _d.sent(),
                                _c.data = {
                                    query: query,
                                    variables: {
                                        filter: {
                                            type: { eq: type }
                                        }
                                    }
                                },
                                _c)])];
                    case 2:
                        res = _d.sent();
                        return [2 /*return*/, res.data.data.workflowStates.nodes.at(0) || null];
                }
            });
        });
    };
    LinearClient.prototype.listAttachments = function (companyId, url) {
        return __awaiter(this, void 0, void 0, function () {
            var query, res, _a, _b, error_6;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 3, , 4]);
                        query = "query Query($filter: AttachmentFilter) { attachments(filter: $filter, first: 1) { nodes { id url } } }";
                        _b = (_a = this.instance).request;
                        _c = {
                            method: "POST"
                        };
                        return [4 /*yield*/, this.getAuthHeaders(companyId)];
                    case 1: return [4 /*yield*/, _b.apply(_a, [(_c.headers = _d.sent(),
                                _c.data = {
                                    query: query,
                                    variables: {
                                        filter: {
                                            url: { contains: url }
                                        }
                                    }
                                },
                                _c)])];
                    case 2:
                        res = _d.sent();
                        return [2 /*return*/, res.data.data.attachments.nodes.map(function (el) { return el; })];
                    case 3:
                        error_6 = _d.sent();
                        console.error("Error listing Linear attachments:", error_6);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LinearClient.prototype.removeAttachment = function (companyId, attachmentId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, response, _a, _b, error_7;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 3, , 4]);
                        query = "mutation AttachmentDelete($attachmentDeleteId: String!) { attachmentDelete(id: $attachmentDeleteId) { success } }";
                        _b = (_a = this.instance).request;
                        _c = {
                            method: "POST"
                        };
                        return [4 /*yield*/, this.getAuthHeaders(companyId)];
                    case 1: return [4 /*yield*/, _b.apply(_a, [(_c.headers = _d.sent(),
                                _c.validateStatus = function (status) { return status === 200 || status === 404; },
                                _c.data = {
                                    query: query,
                                    variables: {
                                        attachmentDeleteId: attachmentId
                                    }
                                },
                                _c)])];
                    case 2:
                        response = _d.sent();
                        return [2 /*return*/, response.data.data.attachmentDelete.success];
                    case 3:
                        error_7 = _d.sent();
                        console.error("Error removing Linear attachment:", error_7);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return LinearClient;
}());
exports.LinearClient = LinearClient;
var instance = null;
var getLinearClient = function () {
    if (!instance)
        instance = new LinearClient();
    return instance;
};
exports.getLinearClient = getLinearClient;
