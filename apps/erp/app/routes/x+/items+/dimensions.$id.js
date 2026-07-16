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
exports.default = EditMaterialDimensionsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var items_1 = require("~/modules/items");
var MaterialDimensionForm_1 = require("~/modules/items/ui/MaterialDimensions/MaterialDimensionForm");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, id, materialDimension, _c, _d;
        var _e, _f;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "parts",
                        role: "employee"
                    })];
                case 1:
                    client = (_g.sent()).client;
                    id = params.id;
                    if (!id)
                        throw (0, auth_1.notFound)("id not found");
                    return [4 /*yield*/, (0, items_1.getMaterialDimension)(client, id)];
                case 2:
                    materialDimension = _g.sent();
                    if (!(((_e = materialDimension.data) === null || _e === void 0 ? void 0 : _e.companyId) === null)) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.materialDimensions];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(new Error("Access denied"), "Cannot edit global material grade"))];
                case 3: throw _c.apply(void 0, _d.concat([_g.sent()]));
                case 4: return [2 /*return*/, {
                        materialDimension: (_f = materialDimension === null || materialDimension === void 0 ? void 0 : materialDimension.data) !== null && _f !== void 0 ? _f : null
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, id, formData, validation, updateMaterialDimension, _c, _d, _e, _f;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "parts"
                        })];
                case 1:
                    client = (_g.sent()).client;
                    id = params.id;
                    if (!id)
                        throw new Error("Could not find id");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _g.sent();
                    return [4 /*yield*/, (0, form_1.validator)(items_1.materialDimensionValidator).validate(formData)];
                case 3:
                    validation = _g.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    return [4 /*yield*/, (0, items_1.upsertMaterialDimension)(client, __assign({ id: id }, validation.data))];
                case 4:
                    updateMaterialDimension = _g.sent();
                    if (!updateMaterialDimension.error) return [3 /*break*/, 6];
                    _c = react_router_1.data;
                    _d = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateMaterialDimension.error, "Failed to update material grade"))];
                case 5: return [2 /*return*/, _c.apply(void 0, _d.concat([_g.sent()]))];
                case 6:
                    _e = react_router_1.redirect;
                    _f = ["".concat(path_1.path.to.materialDimensions, "?").concat((0, path_1.getParams)(request))];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated material grade"))];
                case 7: throw _e.apply(void 0, _f.concat([_g.sent()]));
            }
        });
    });
}
function EditMaterialDimensionsRoute() {
    var _a, _b, _c;
    var materialDimension = (0, react_router_1.useLoaderData)().materialDimension;
    var navigate = (0, react_router_1.useNavigate)();
    var initialValues = {
        id: (_a = materialDimension === null || materialDimension === void 0 ? void 0 : materialDimension.id) !== null && _a !== void 0 ? _a : undefined,
        name: (_b = materialDimension === null || materialDimension === void 0 ? void 0 : materialDimension.name) !== null && _b !== void 0 ? _b : "",
        materialFormId: (_c = materialDimension === null || materialDimension === void 0 ? void 0 : materialDimension.materialFormId) !== null && _c !== void 0 ? _c : ""
    };
    return (<MaterialDimensionForm_1.default key={initialValues.id} initialValues={initialValues} onClose={function () { return navigate(-1); }}/>);
}
