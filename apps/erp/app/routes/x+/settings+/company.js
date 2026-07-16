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
exports.action = action;
exports.default = Company;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Company"], ["Company"]))),
    to: path_1.path.to.company
};
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, formData, validation, update, _d, _e, _f, _g;
        var request = _b.request;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "settings"
                        })];
                case 1:
                    _c = _h.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _h.sent();
                    return [4 /*yield*/, (0, form_1.validator)(settings_1.companyValidator).validate(formData)];
                case 3:
                    validation = _h.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    return [4 /*yield*/, (0, settings_1.updateCompany)(client, companyId, __assign(__assign({}, validation.data), { updatedBy: userId }))];
                case 4:
                    update = _h.sent();
                    if (!update.error) return [3 /*break*/, 6];
                    _d = react_router_1.data;
                    _e = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(update.error, "Failed to update company"))];
                case 5: return [2 /*return*/, _d.apply(void 0, _e.concat([_h.sent()]))];
                case 6:
                    _f = react_router_1.data;
                    _g = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated company"))];
                case 7: return [2 /*return*/, _f.apply(void 0, _g.concat([_h.sent()]))];
            }
        });
    });
}
function Company() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var t = (0, macro_2.useLingui)().t;
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.authenticatedRoot);
    var company = routeData === null || routeData === void 0 ? void 0 : routeData.company;
    if (!company)
        throw new Error("Company not found");
    var initialValues = {
        name: company.name,
        taxId: (_a = company.taxId) !== null && _a !== void 0 ? _a : undefined,
        vatNumber: (_b = company.vatNumber) !== null && _b !== void 0 ? _b : undefined,
        eori: (_c = company.eori) !== null && _c !== void 0 ? _c : undefined,
        addressLine1: (_d = company.addressLine1) !== null && _d !== void 0 ? _d : "",
        addressLine2: (_e = company.addressLine2) !== null && _e !== void 0 ? _e : undefined,
        city: (_f = company.city) !== null && _f !== void 0 ? _f : "",
        stateProvince: (_g = company.stateProvince) !== null && _g !== void 0 ? _g : "",
        postalCode: (_h = company.postalCode) !== null && _h !== void 0 ? _h : "",
        countryCode: (_j = company.countryCode) !== null && _j !== void 0 ? _j : "",
        baseCurrencyCode: (_k = company.baseCurrencyCode) !== null && _k !== void 0 ? _k : undefined,
        phone: (_l = company.phone) !== null && _l !== void 0 ? _l : undefined,
        email: (_m = company.email) !== null && _m !== void 0 ? _m : undefined,
        website: (_o = company.website) !== null && _o !== void 0 ? _o : undefined
    };
    return (<react_1.ScrollArea className="w-full h-[calc(100dvh-49px)]">
      <react_1.VStack spacing={4} className="py-12 px-4 max-w-[60rem] h-full mx-auto gap-4">
        <react_1.HStack spacing={1} className="items-center">
          <react_1.Heading size="h3">
            <macro_2.Trans>Company</macro_2.Trans>
          </react_1.Heading>
          <react_1.Tooltip>
            <react_1.TooltipTrigger asChild>
              <react_1.Button variant="ghost" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Copy"], ["Copy"])))} size="sm" className="p-1" onClick={function () { var _a; return (0, string_1.copyToClipboard)((_a = company.id) !== null && _a !== void 0 ? _a : ""); }}>
                <lu_1.LuKeySquare className="w-3 h-3"/>
              </react_1.Button>
            </react_1.TooltipTrigger>
            <react_1.TooltipContent>
              <span>
                <macro_2.Trans>Copy company unique identifier</macro_2.Trans>
              </span>
            </react_1.TooltipContent>
          </react_1.Tooltip>
        </react_1.HStack>
        <react_1.Card>
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_2.Trans>Basic Information</macro_2.Trans>
            </react_1.CardTitle>
            <react_1.CardDescription>
              <macro_2.Trans>This information will be used on document headers</macro_2.Trans>
            </react_1.CardDescription>
          </react_1.CardHeader>
          <react_1.CardContent>
            {/* @ts-ignore */}
            <settings_1.CompanyForm company={initialValues}/>
          </react_1.CardContent>
        </react_1.Card>
      </react_1.VStack>
    </react_1.ScrollArea>);
}
var templateObject_1, templateObject_2;
