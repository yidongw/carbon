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
exports.handle = void 0;
exports.loader = loader;
exports.action = action;
exports.default = PersonRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var account_1 = require("~/modules/account");
var people_1 = require("~/modules/people");
var Person_1 = require("~/modules/people/ui/Person");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["People"], ["People"]))),
    to: path_1.path.to.people
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, personId, _d, employeeSummary, attributeCategories, companySettings, _e, _f;
        var _g, _h, _j;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "people"
                    })];
                case 1:
                    _c = _k.sent(), client = _c.client, companyId = _c.companyId;
                    personId = params.personId;
                    if (!personId)
                        throw new Error("Could not find personId");
                    return [4 /*yield*/, Promise.all([
                            (0, people_1.getEmployeeSummary)(client, personId, companyId),
                            (0, account_1.getAllAttributeCategories)(client, personId, companyId),
                            (0, settings_1.getCompanySettings)(client, companyId)
                        ])];
                case 2:
                    _d = _k.sent(), employeeSummary = _d[0], attributeCategories = _d[1], companySettings = _d[2];
                    if (!employeeSummary.error) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.people];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(employeeSummary.error, "Failed to load employee summary"))];
                case 3: throw _e.apply(void 0, _f.concat([_k.sent()]));
                case 4: return [2 /*return*/, {
                        employeeSummary: employeeSummary.data,
                        attributeCategories: (_g = attributeCategories.data) !== null && _g !== void 0 ? _g : [],
                        timeCardEnabled: (_j = (_h = companySettings.data) === null || _h === void 0 ? void 0 : _h.timeCardEnabled) !== null && _j !== void 0 ? _j : false
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, personId, validation, _c, _d, _e, firstName, lastName, about, phone, number, updateAccount, _f, _g, _h, _j;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "people"
                        })];
                case 1:
                    client = (_k.sent()).client;
                    personId = params.personId;
                    if (!personId)
                        throw new Error("No person ID provided");
                    _d = (_c = (0, form_1.validator)(account_1.accountProfileValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 2: return [4 /*yield*/, _d.apply(_c, [_k.sent()])];
                case 3:
                    validation = _k.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _e = validation.data, firstName = _e.firstName, lastName = _e.lastName, about = _e.about, phone = _e.phone, number = _e.number;
                    return [4 /*yield*/, (0, account_1.updatePublicAccount)(client, {
                            id: personId,
                            firstName: firstName,
                            lastName: lastName,
                            about: about,
                            phone: phone,
                            number: number
                        })];
                case 4:
                    updateAccount = _k.sent();
                    if (!updateAccount.error) return [3 /*break*/, 6];
                    _f = react_router_1.data;
                    _g = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateAccount.error, "Failed to update profile"))];
                case 5: return [2 /*return*/, _f.apply(void 0, _g.concat([_k.sent()]))];
                case 6:
                    _h = react_router_1.data;
                    _j = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated profile"))];
                case 7: return [2 /*return*/, _h.apply(void 0, _j.concat([_k.sent()]))];
            }
        });
    });
}
function PersonRoute() {
    var _a = (0, react_router_1.useLoaderData)(), attributeCategories = _a.attributeCategories, timeCardEnabled = _a.timeCardEnabled;
    return (<>
      <Person_1.PersonPreview />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_4fr] h-full w-full gap-4">
        <Person_1.PersonSidebar attributeCategories={attributeCategories} timeCardEnabled={timeCardEnabled}/>
        <react_router_1.Outlet />
      </div>
    </>);
}
var templateObject_1;
