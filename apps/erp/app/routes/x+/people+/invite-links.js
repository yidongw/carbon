"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.shouldRevalidate = exports.handle = void 0;
exports.loader = loader;
exports.default = Route;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var users_1 = require("~/modules/users");
var invite_links_service_1 = require("~/modules/users/invite-links.service");
var path_1 = require("~/utils/path");
var query_1 = require("~/utils/query");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Invite Links"], ["Invite Links"]))),
    to: path_1.path.to.peopleInviteLinks
};
var shouldRevalidate = function (_a) {
    var formAction = _a.formAction, defaultShouldRevalidate = _a.defaultShouldRevalidate;
    if (formAction === null || formAction === void 0 ? void 0 : formAction.includes("/invite-links/revoke")) {
        return false;
    }
    return defaultShouldRevalidate;
};
exports.shouldRevalidate = shouldRevalidate;
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, url, searchParams, search, _d, limit, offset, sorts, filters, inviteLinks, _e, _f;
        var _g, _h;
        var request = _b.request;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "users",
                        role: "employee",
                        bypassRls: true
                    })];
                case 1:
                    _c = _j.sent(), client = _c.client, companyId = _c.companyId;
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    search = searchParams.get("search");
                    _d = (0, query_1.getGenericQueryFilters)(searchParams), limit = _d.limit, offset = _d.offset, sorts = _d.sorts, filters = _d.filters;
                    return [4 /*yield*/, (0, invite_links_service_1.getInviteLinks)(client, companyId, {
                            search: search,
                            limit: limit,
                            offset: offset,
                            sorts: sorts,
                            filters: filters
                        })];
                case 2:
                    inviteLinks = _j.sent();
                    if (!inviteLinks.error) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.people];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(inviteLinks.error, "Failed to load invite links"))];
                case 3: throw _e.apply(void 0, _f.concat([_j.sent()]));
                case 4: return [2 /*return*/, {
                        inviteLinks: (_g = inviteLinks.data) !== null && _g !== void 0 ? _g : [],
                        count: (_h = inviteLinks.count) !== null && _h !== void 0 ? _h : 0
                    }];
            }
        });
    });
}
function Route() {
    var _a = (0, react_router_1.useLoaderData)(), inviteLinks = _a.inviteLinks, count = _a.count;
    return (<react_1.VStack spacing={0} className="h-full">
      <users_1.InviteLinksTable data={inviteLinks} count={count}/>
      <react_router_1.Outlet />
    </react_1.VStack>);
}
var templateObject_1;
