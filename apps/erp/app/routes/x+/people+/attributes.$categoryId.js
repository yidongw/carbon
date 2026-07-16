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
exports.default = EditAttributeCategoryRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var people_1 = require("~/modules/people");
var Attributes_1 = require("~/modules/people/ui/Attributes");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, categoryId, attributeCategory, _c, _d;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "people",
                        role: "employee"
                    })];
                case 1:
                    client = (_e.sent()).client;
                    categoryId = params.categoryId;
                    if (!categoryId)
                        throw (0, auth_1.notFound)("Invalid categoryId");
                    return [4 /*yield*/, (0, people_1.getAttributeCategory)(client, categoryId)];
                case 2:
                    attributeCategory = _e.sent();
                    if (!attributeCategory.error) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.attributes];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(attributeCategory.error, "Failed to fetch attribute category"))];
                case 3: throw _c.apply(void 0, _d.concat([_e.sent()]));
                case 4: return [2 /*return*/, { attributeCategory: attributeCategory.data }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, validation, _d, _e, _f, id, name, emoji, isPublic, updateCategory, _g, _h, _j, _k;
        var request = _b.request;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "people"
                        })];
                case 1:
                    _c = _l.sent(), client = _c.client, userId = _c.userId;
                    _e = (_d = (0, form_1.validator)(people_1.attributeCategoryValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 2: return [4 /*yield*/, _e.apply(_d, [_l.sent()])];
                case 3:
                    validation = _l.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _f = validation.data, id = _f.id, name = _f.name, emoji = _f.emoji, isPublic = _f.isPublic;
                    if (!id)
                        throw new Error("ID is was not found");
                    return [4 /*yield*/, (0, people_1.updateAttributeCategory)(client, {
                            id: id,
                            name: name,
                            emoji: emoji,
                            public: isPublic,
                            updatedBy: userId
                        })];
                case 4:
                    updateCategory = _l.sent();
                    if (!updateCategory.error) return [3 /*break*/, 6];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.attributes];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateCategory.error, "Failed to update attribute category"))];
                case 5: throw _g.apply(void 0, _h.concat([_l.sent()]));
                case 6:
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.attributes];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated attribute category "))];
                case 7: throw _j.apply(void 0, _k.concat([_l.sent()]));
            }
        });
    });
}
function EditAttributeCategoryRoute() {
    var _a, _b, _c;
    var attributeCategory = (0, react_router_1.useLoaderData)().attributeCategory;
    var navigate = (0, react_router_1.useNavigate)();
    var onClose = function () { return navigate(path_1.path.to.attributes); };
    var initialValues = {
        id: attributeCategory === null || attributeCategory === void 0 ? void 0 : attributeCategory.id,
        name: (_a = attributeCategory === null || attributeCategory === void 0 ? void 0 : attributeCategory.name) !== null && _a !== void 0 ? _a : "",
        emoji: (_b = attributeCategory === null || attributeCategory === void 0 ? void 0 : attributeCategory.emoji) !== null && _b !== void 0 ? _b : "",
        isPublic: (_c = attributeCategory === null || attributeCategory === void 0 ? void 0 : attributeCategory.public) !== null && _c !== void 0 ? _c : false
    };
    return (<Attributes_1.AttributeCategoryForm key={initialValues.id} onClose={onClose} initialValues={initialValues}/>);
}
