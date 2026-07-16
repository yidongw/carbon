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
exports.default = EditRequiredActionRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var quality_1 = require("~/modules/quality");
var RequiredActions_1 = require("~/modules/quality/ui/RequiredActions");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id, client, result, _c, _d;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    id = params.id;
                    if (!id)
                        throw new Error("Required action ID is required");
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "quality",
                            role: "employee"
                        })];
                case 1:
                    client = (_e.sent()).client;
                    return [4 /*yield*/, (0, quality_1.getRequiredAction)(client, id)];
                case 2:
                    result = _e.sent();
                    if (!!result.data) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.requiredActions];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Required action not found"))];
                case 3: return [2 /*return*/, _c.apply(void 0, _d.concat([_e.sent()]))];
                case 4: return [2 /*return*/, { requiredAction: result.data }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id, _c, client, userId, formData, validation, _d, name, active, updateResult, _e, _f, _g, _h;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    id = params.id;
                    if (!id)
                        throw new Error("Required action ID is required");
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "quality"
                        })];
                case 1:
                    _c = _j.sent(), client = _c.client, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _j.sent();
                    return [4 /*yield*/, (0, form_1.validator)(quality_1.requiredActionValidator).validate(formData)];
                case 3:
                    validation = _j.sent();
                    if (validation.error) {
                        return [2 /*return*/, { success: false, message: "Invalid form data" }];
                    }
                    _d = validation.data, name = _d.name, active = _d.active;
                    return [4 /*yield*/, (0, quality_1.upsertRequiredAction)(client, {
                            id: id,
                            name: name,
                            active: active !== null && active !== void 0 ? active : true,
                            updatedBy: userId
                        })];
                case 4:
                    updateResult = _j.sent();
                    if (!updateResult.error) return [3 /*break*/, 6];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.requiredActions];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateResult.error, "Failed to update required action"))];
                case 5: return [2 /*return*/, _e.apply(void 0, _f.concat([_j.sent()]))];
                case 6:
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.requiredActions];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Required action updated successfully"))];
                case 7: return [2 /*return*/, _g.apply(void 0, _h.concat([_j.sent()]))];
            }
        });
    });
}
function EditRequiredActionRoute() {
    var requiredAction = (0, react_router_1.useLoaderData)().requiredAction;
    var navigate = (0, react_router_1.useNavigate)();
    var onClose = function () { return navigate(path_1.path.to.requiredActions); };
    return (<RequiredActions_1.RequiredActionForm type="modal" initialValues={requiredAction} onClose={onClose}/>);
}
