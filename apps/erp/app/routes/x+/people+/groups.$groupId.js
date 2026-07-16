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
exports.loader = loader;
exports.action = action;
exports.default = UsersGroupRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var users_1 = require("~/modules/users");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, groupId, groupWithMembers, _c, _d, groupName, _e, _f, group;
        var _g, _h;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "users",
                        role: "employee"
                    })];
                case 1:
                    client = (_j.sent()).client;
                    groupId = params.groupId;
                    if (!groupId)
                        throw (0, auth_1.notFound)("groupId not found");
                    return [4 /*yield*/, (0, users_1.getGroupMembers)(client, groupId)];
                case 2:
                    groupWithMembers = _j.sent();
                    if (!groupWithMembers.error) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.groups];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(groupWithMembers.error, "Failed to load group"))];
                case 3:
                    _c.apply(void 0, _d.concat([_j.sent()]));
                    _j.label = 4;
                case 4:
                    groupName = (_g = groupWithMembers.data) === null || _g === void 0 ? void 0 : _g[0].name;
                    if (!!groupName) return [3 /*break*/, 6];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.groups];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(groupWithMembers, "Group not found"))];
                case 5: throw _e.apply(void 0, _f.concat([_j.sent()]));
                case 6:
                    group = {
                        id: groupId,
                        name: groupName,
                        selections: ((_h = groupWithMembers.data) === null || _h === void 0 ? void 0 : _h.map(function (group) {
                            return group.memberGroupId
                                ? "group_".concat(group.memberGroupId)
                                : "user_".concat(group.memberUserId);
                        })) || []
                    };
                    return [2 /*return*/, { group: group }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, validation, _d, _e, _f, id, name, selections, _g, updateGroup, updateGroupMembers, _h, _j, _k, _l, _m, _o;
        var request = _b.request;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "users"
                        })];
                case 1:
                    _c = _p.sent(), client = _c.client, companyId = _c.companyId;
                    _e = (_d = (0, form_1.validator)(users_1.groupValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 2: return [4 /*yield*/, _e.apply(_d, [_p.sent()])];
                case 3:
                    validation = _p.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _f = validation.data, id = _f.id, name = _f.name, selections = _f.selections;
                    return [4 /*yield*/, Promise.all([
                            (0, users_1.upsertGroup)(client, { id: id, name: name, companyId: companyId }),
                            (0, users_1.upsertGroupMembers)(client, id, selections)
                        ])];
                case 4:
                    _g = _p.sent(), updateGroup = _g[0], updateGroupMembers = _g[1];
                    if (!updateGroup.error) return [3 /*break*/, 6];
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.groups];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateGroup.error, "Failed to update group"))];
                case 5:
                    _h.apply(void 0, _j.concat([_p.sent()]));
                    _p.label = 6;
                case 6:
                    if (!updateGroupMembers.error) return [3 /*break*/, 8];
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.groups];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateGroupMembers.error, "Failed to update group members"))];
                case 7:
                    _k.apply(void 0, _l.concat([_p.sent()]));
                    _p.label = 8;
                case 8:
                    _m = react_router_1.redirect;
                    _o = [path_1.path.to.groups];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Group updated successfully"))];
                case 9: throw _m.apply(void 0, _o.concat([_p.sent()]));
            }
        });
    });
}
function UsersGroupRoute() {
    var group = (0, react_router_1.useLoaderData)().group;
    var initialValues = {
        id: (group === null || group === void 0 ? void 0 : group.id) || "",
        name: (group === null || group === void 0 ? void 0 : group.name) || "",
        selections: (group === null || group === void 0 ? void 0 : group.selections) || []
    };
    return <users_1.GroupForm key={initialValues.id} initialValues={initialValues}/>;
}
