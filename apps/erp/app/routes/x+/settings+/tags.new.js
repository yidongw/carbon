"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.loader = loader;
exports.action = action;
exports.default = NewTagRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var overlay_1 = require("~/components/Overlay/overlay");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var url, isOverlay, token, redirectParams, query, requestedTable;
        var request = _b.request;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    url = new URL(request.url);
                    isOverlay = url.searchParams.get("overlay") === "true";
                    // Bare URL (deep link / direct nav): redirect to the list with the overlay
                    // open, so the form always renders as an overlay rather than a full page.
                    if (!isOverlay) {
                        token = (0, overlay_1.overlayToken)(overlay_1.overlay.to.newTag());
                        redirectParams = new URLSearchParams();
                        if (token)
                            redirectParams.append(overlay_1.OVERLAY_PARAM, token);
                        query = (0, overlay_1.serializeSearch)(redirectParams);
                        throw (0, react_router_1.redirect)(query ? "".concat(path_1.path.to.tags, "?").concat(query) : path_1.path.to.tags);
                    }
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c.sent();
                    requestedTable = url.searchParams.get("table");
                    return [2 /*return*/, {
                            table: requestedTable !== null && requestedTable !== void 0 ? requestedTable : "",
                            lockTable: Boolean(requestedTable)
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, isOverlay, formData, validation, insert, _d, _e, _f, _g, _h, _j;
        var request = _b.request;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _k.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    isOverlay = new URL(request.url).searchParams.get("overlay") === "true";
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _k.sent();
                    return [4 /*yield*/, (0, form_1.validator)(shared_1.tagValidator).validate(formData)];
                case 3:
                    validation = _k.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    return [4 /*yield*/, (0, shared_1.insertTag)(client, __assign(__assign({}, validation.data), { companyId: companyId, createdBy: userId }))];
                case 4:
                    insert = _k.sent();
                    if (!insert.error) return [3 /*break*/, 6];
                    _d = react_router_1.data;
                    _e = [{ ok: false, error: "Failed to create tag" }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(insert.error, "Failed to create tag"))];
                case 5: return [2 /*return*/, _d.apply(void 0, _e.concat([_k.sent()]))];
                case 6:
                    if (!isOverlay) return [3 /*break*/, 8];
                    _f = react_router_1.data;
                    _g = [{ ok: true, name: validation.data.name }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Tag created"))];
                case 7: return [2 /*return*/, _f.apply(void 0, _g.concat([_k.sent()]))];
                case 8:
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.tags];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Tag created"))];
                case 9: return [2 /*return*/, _h.apply(void 0, _j.concat([_k.sent()]))];
            }
        });
    });
}
function NewTagRoute() {
    return null;
}
