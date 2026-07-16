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
var session_server_1 = require("@carbon/auth/session.server");
var notifications_1 = require("@carbon/ee/notifications");
var react_router_1 = require("react-router");
var quality_1 = require("~/modules/quality");
var settings_server_1 = require("~/modules/settings/settings.server");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, companyId, id, formData, status, _d, _e, update, _f, _g, integrations, error_1, _h, _j;
        var _k, _l, _m;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "quality"
                        })];
                case 1:
                    _c = _o.sent(), client = _c.client, userId = _c.userId, companyId = _c.companyId;
                    id = params.id;
                    if (!id)
                        throw new Error("Could not find id");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _o.sent();
                    status = formData.get("status");
                    if (!(!status || !quality_1.nonConformanceStatus.includes(status))) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [(_k = (0, path_1.requestReferrer)(request)) !== null && _k !== void 0 ? _k : path_1.path.to.issueDetails(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Invalid status"))];
                case 3: throw _d.apply(void 0, _e.concat([_o.sent()]));
                case 4: return [4 /*yield*/, (0, quality_1.updateIssueStatus)(client, {
                        id: id,
                        status: status,
                        assignee: ["Closed"].includes(status) ? null : undefined,
                        closeDate: ["Closed"].includes(status) ? new Date().toISOString() : null,
                        updatedBy: userId
                    })];
                case 5:
                    update = _o.sent();
                    if (!update.error) return [3 /*break*/, 7];
                    _f = react_router_1.redirect;
                    _g = [(_l = (0, path_1.requestReferrer)(request)) !== null && _l !== void 0 ? _l : path_1.path.to.issueDetails(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(update.error, "Failed to update issue status"))];
                case 6: throw _f.apply(void 0, _g.concat([_o.sent()]));
                case 7:
                    _o.trys.push([7, 10, , 11]);
                    return [4 /*yield*/, (0, settings_server_1.getCompanyIntegrations)(client, companyId)];
                case 8:
                    integrations = _o.sent();
                    return [4 /*yield*/, (0, notifications_1.notifyIssueStatusChanged)({ client: client }, integrations, {
                            companyId: companyId,
                            userId: userId,
                            carbonUrl: "".concat(auth_1.ERP_URL).concat(path_1.path.to.issue(id)), // We might need the full URL here
                            issue: {
                                id: id,
                                status: status,
                                nonConformanceId: id,
                                title: "" // We might need to get the title from the issue data
                            }
                        })];
                case 9:
                    _o.sent();
                    return [3 /*break*/, 11];
                case 10:
                    error_1 = _o.sent();
                    console.error("Failed to send notifications:", error_1);
                    return [3 /*break*/, 11];
                case 11:
                    _h = react_router_1.redirect;
                    _j = [(_m = (0, path_1.requestReferrer)(request)) !== null && _m !== void 0 ? _m : path_1.path.to.issueDetails(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated issue status"))];
                case 12: throw _h.apply(void 0, _j.concat([_o.sent()]));
            }
        });
    });
}
