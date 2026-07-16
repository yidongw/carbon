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
exports.default = SuggestionRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_router_1 = require("react-router");
var resources_1 = require("~/modules/resources");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, suggestionId, _d, suggestion, tags, _e, _f;
        var _g;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "resources"
                    })];
                case 1:
                    _c = _h.sent(), client = _c.client, companyId = _c.companyId;
                    suggestionId = params.suggestionId;
                    if (!suggestionId)
                        throw (0, auth_1.notFound)("suggestionId was not found");
                    return [4 /*yield*/, Promise.all([
                            (0, resources_1.getSuggestion)(client, suggestionId),
                            (0, shared_1.getTagsList)(client, companyId, "suggestion")
                        ])];
                case 2:
                    _d = _h.sent(), suggestion = _d[0], tags = _d[1];
                    if (!suggestion.error) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.suggestions];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(suggestion.error, "Failed to get suggestion"))];
                case 3: throw _e.apply(void 0, _f.concat([_h.sent()]));
                case 4: return [2 /*return*/, {
                        suggestion: suggestion.data,
                        tags: (_g = tags.data) !== null && _g !== void 0 ? _g : []
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, suggestionId, formData, emoji, result, _c, _d;
        var _e;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "resources"
                    })];
                case 1:
                    client = (_f.sent()).client;
                    suggestionId = params.suggestionId;
                    if (!suggestionId)
                        throw (0, auth_1.notFound)("suggestionId was not found");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _f.sent();
                    emoji = (_e = formData.get("emoji")) === null || _e === void 0 ? void 0 : _e.toString();
                    if (!emoji) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, resources_1.updateSuggestionEmoji)(client, suggestionId, emoji)];
                case 3:
                    result = _f.sent();
                    if (!result.error) return [3 /*break*/, 5];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.suggestion(suggestionId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to update emoji"))];
                case 4: throw _c.apply(void 0, _d.concat([_f.sent()]));
                case 5: return [2 /*return*/, { success: true }];
            }
        });
    });
}
function SuggestionRoute() {
    var _a = (0, react_router_1.useLoaderData)(), suggestion = _a.suggestion, tags = _a.tags;
    return <resources_1.SuggestionDetails suggestion={suggestion} tags={tags}/>;
}
