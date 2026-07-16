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
exports.clientAction = clientAction;
exports.default = NewGroupRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var users_1 = require("~/modules/users");
var path_1 = require("~/utils/path");
var react_query_1 = require("~/utils/react-query");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, validation, _d, _e, _f, name, selections, createGroup, _g, _h, groupId, _j, _k, insertGroupMembers, _l, _m, _o, _p;
        var _q;
        var request = _b.request;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "users"
                        })];
                case 1:
                    _c = _r.sent(), client = _c.client, companyId = _c.companyId;
                    _e = (_d = (0, form_1.validator)(users_1.groupValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 2: return [4 /*yield*/, _e.apply(_d, [_r.sent()])];
                case 3:
                    validation = _r.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _f = validation.data, name = _f.name, selections = _f.selections;
                    return [4 /*yield*/, (0, users_1.insertGroup)(client, { name: name, companyId: companyId })];
                case 4:
                    createGroup = _r.sent();
                    if (!createGroup.error) return [3 /*break*/, 6];
                    _g = react_router_1.data;
                    _h = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(createGroup.error, "Failed to insert group"))];
                case 5: return [2 /*return*/, _g.apply(void 0, _h.concat([_r.sent()]))];
                case 6:
                    groupId = (_q = createGroup.data) === null || _q === void 0 ? void 0 : _q.id;
                    if (!!groupId) return [3 /*break*/, 8];
                    _j = react_router_1.data;
                    _k = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(createGroup, "Failed to insert group"))];
                case 7: return [2 /*return*/, _j.apply(void 0, _k.concat([_r.sent()]))];
                case 8: return [4 /*yield*/, (0, users_1.upsertGroupMembers)(client, groupId, selections)];
                case 9:
                    insertGroupMembers = _r.sent();
                    if (!insertGroupMembers.error) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, users_1.deleteGroup)(client, groupId)];
                case 10:
                    _r.sent();
                    _l = react_router_1.data;
                    _m = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(insertGroupMembers.error, "Failed to insert group members"))];
                case 11: return [2 /*return*/, _l.apply(void 0, _m.concat([_r.sent()]))];
                case 12:
                    _o = react_router_1.redirect;
                    _p = [path_1.path.to.groups];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Group created"))];
                case 13: throw _o.apply(void 0, _p.concat([_r.sent()]));
            }
        });
    });
}
function clientAction(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var companyId;
        var _c;
        var serverAction = _b.serverAction;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    companyId = (0, react_query_1.getCompanyId)();
                    (_c = window.clientCache) === null || _c === void 0 ? void 0 : _c.invalidateQueries({
                        predicate: function (query) {
                            var queryKey = query.queryKey;
                            return queryKey[0] === "groupsByType" && queryKey[1] === companyId;
                        }
                    });
                    return [4 /*yield*/, serverAction()];
                case 1: return [2 /*return*/, _d.sent()];
            }
        });
    });
}
function NewGroupRoute() {
    var initialValues = {
        id: "",
        name: "",
        selections: []
    };
    return <users_1.GroupForm initialValues={initialValues}/>;
}
