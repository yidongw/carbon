"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.handle = void 0;
exports.loader = loader;
exports.default = TemplatesListRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var items_1 = require("~/modules/items");
var TemplatesTable_1 = require("~/modules/items/ui/Templates/TemplatesTable");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Templates"], ["Templates"]))),
    to: path_1.path.to.templates
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, templates, _d, _e, templateRows, templateIds, configurationParameterCounts, bomCounts, bopCounts, _f, configurationParameters, templateMakeMethods, _i, _g, parameter, methodRows, methodIds, methodToTemplate, _h, methodMaterials, methodOperations, _j, _k, material, templateId, _l, _m, operation, templateId;
        var _o, _p, _q, _r, _s, _t, _u, _v;
        var request = _b.request;
        return __generator(this, function (_w) {
            switch (_w.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "parts",
                        bypassRls: true
                    })];
                case 1:
                    _c = _w.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, (0, items_1.getTemplatesList)(client, companyId)];
                case 2:
                    templates = _w.sent();
                    if (!templates.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.authenticatedRoot];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(templates.error, "Failed to fetch templates"))];
                case 3: throw _d.apply(void 0, _e.concat([_w.sent()]));
                case 4:
                    templateRows = (_o = templates.data) !== null && _o !== void 0 ? _o : [];
                    templateIds = templateRows.map(function (template) { return template.id; });
                    configurationParameterCounts = new Map();
                    bomCounts = new Map();
                    bopCounts = new Map();
                    if (!(templateIds.length > 0)) return [3 /*break*/, 7];
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("templateConfigurationParameter")
                                .select("templateId")
                                .in("templateId", templateIds)
                                .eq("companyId", companyId),
                            client
                                .from("templateMakeMethod")
                                .select("id, templateId")
                                .in("templateId", templateIds)
                                .eq("companyId", companyId)
                        ])];
                case 5:
                    _f = _w.sent(), configurationParameters = _f[0], templateMakeMethods = _f[1];
                    for (_i = 0, _g = (_p = configurationParameters.data) !== null && _p !== void 0 ? _p : []; _i < _g.length; _i++) {
                        parameter = _g[_i];
                        configurationParameterCounts.set(parameter.templateId, ((_q = configurationParameterCounts.get(parameter.templateId)) !== null && _q !== void 0 ? _q : 0) + 1);
                    }
                    methodRows = (_r = templateMakeMethods.data) !== null && _r !== void 0 ? _r : [];
                    methodIds = methodRows.map(function (method) { return method.id; });
                    methodToTemplate = new Map(methodRows.map(function (method) { return [method.id, method.templateId]; }));
                    if (!(methodIds.length > 0)) return [3 /*break*/, 7];
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("templateMethodMaterial")
                                .select("templateMakeMethodId")
                                .in("templateMakeMethodId", methodIds)
                                .eq("companyId", companyId),
                            client
                                .from("templateMethodOperation")
                                .select("templateMakeMethodId")
                                .in("templateMakeMethodId", methodIds)
                                .eq("companyId", companyId)
                        ])];
                case 6:
                    _h = _w.sent(), methodMaterials = _h[0], methodOperations = _h[1];
                    for (_j = 0, _k = (_s = methodMaterials.data) !== null && _s !== void 0 ? _s : []; _j < _k.length; _j++) {
                        material = _k[_j];
                        templateId = methodToTemplate.get(material.templateMakeMethodId);
                        if (!templateId)
                            continue;
                        bomCounts.set(templateId, ((_t = bomCounts.get(templateId)) !== null && _t !== void 0 ? _t : 0) + 1);
                    }
                    for (_l = 0, _m = (_u = methodOperations.data) !== null && _u !== void 0 ? _u : []; _l < _m.length; _l++) {
                        operation = _m[_l];
                        templateId = methodToTemplate.get(operation.templateMakeMethodId);
                        if (!templateId)
                            continue;
                        bopCounts.set(templateId, ((_v = bopCounts.get(templateId)) !== null && _v !== void 0 ? _v : 0) + 1);
                    }
                    _w.label = 7;
                case 7: return [2 /*return*/, {
                        templates: templateRows.map(function (template) {
                            var _a, _b, _c;
                            return (__assign(__assign({}, template), { configurationParameterCount: (_a = configurationParameterCounts.get(template.id)) !== null && _a !== void 0 ? _a : 0, bomCount: (_b = bomCounts.get(template.id)) !== null && _b !== void 0 ? _b : 0, bopCount: (_c = bopCounts.get(template.id)) !== null && _c !== void 0 ? _c : 0 }));
                        }),
                        count: templateRows.length
                    }];
            }
        });
    });
}
function TemplatesListRoute() {
    var _a = (0, react_router_1.useLoaderData)(), templates = _a.templates, count = _a.count;
    return (<react_1.VStack spacing={0} className="h-full">
      <TemplatesTable_1.default data={templates} count={count}/>
      <react_router_1.Outlet />
    </react_1.VStack>);
}
var templateObject_1;
