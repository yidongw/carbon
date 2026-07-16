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
exports.default = EditAttributeRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var people_1 = require("~/modules/people");
var Attributes_1 = require("~/modules/people/ui/Attributes");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, categoryId, attributeId, attribute, _c, _d;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "people",
                        role: "employee"
                    })];
                case 1:
                    client = (_e.sent()).client;
                    categoryId = params.categoryId, attributeId = params.attributeId;
                    if (!attributeId)
                        throw (0, auth_1.notFound)("attributeId not found");
                    if (!categoryId)
                        throw (0, auth_1.notFound)("categoryId not found");
                    return [4 /*yield*/, (0, people_1.getAttribute)(client, attributeId)];
                case 2:
                    attribute = _e.sent();
                    if (!attribute.error) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.attributeCategoryList(categoryId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(attribute.error, "Failed to fetch attribute"))];
                case 3: throw _c.apply(void 0, _d.concat([_e.sent()]));
                case 4: return [2 /*return*/, {
                        attribute: attribute.data
                    }];
            }
        });
    });
}
function EditAttributeRoute() {
    var _a, _b, _c;
    var attribute = (0, react_router_1.useLoaderData)().attribute;
    var categoryId = (0, react_router_1.useParams)().categoryId;
    if (!categoryId)
        throw new Error("categoryId is not found");
    if (Number.isNaN(categoryId))
        throw new Error("categoryId is not a number");
    var navigate = (0, react_router_1.useNavigate)();
    var onClose = function () { return navigate(-1); };
    var attributesRouteData = (0, hooks_1.useRouteData)(path_1.path.to.attributes);
    return (<Attributes_1.AttributeForm key={"".concat(attribute.id).concat(categoryId)} initialValues={{
            id: attribute === null || attribute === void 0 ? void 0 : attribute.id,
            name: attribute === null || attribute === void 0 ? void 0 : attribute.name,
            // @ts-expect-error
            attributeDataTypeId: attribute === null || attribute === void 0 ? void 0 : attribute.attributeDataTypeId.toString(),
            userAttributeCategoryId: attribute === null || attribute === void 0 ? void 0 : attribute.userAttributeCategoryId,
            canSelfManage: (_a = attribute.canSelfManage) !== null && _a !== void 0 ? _a : true,
            listOptions: (_b = attribute === null || attribute === void 0 ? void 0 : attribute.listOptions) !== null && _b !== void 0 ? _b : []
        }} 
    // @ts-expect-error TS2322 - TODO: fix type
    dataTypes={(_c = attributesRouteData === null || attributesRouteData === void 0 ? void 0 : attributesRouteData.dataTypes) !== null && _c !== void 0 ? _c : []} onClose={onClose}/>);
}
