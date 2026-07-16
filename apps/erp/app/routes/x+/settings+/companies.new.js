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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = action;
exports.default = NewSubsidiaryRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var locale_1 = require("@carbon/locale");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var date_1 = require("@internationalized/date");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var people_1 = require("~/modules/people");
var resources_1 = require("~/modules/resources");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var userId, formData, validation, _c, _, parentCompanyId, baseCurrencyCode, locationData, client, companyInsert, _d, _e, companyId, _f, _g, language, seed, _h, _j, locationInsert, _k, _l, locationId, _m, _o, job, _p, _q, _r, _s;
        var _t, _u;
        var request = _b.request;
        return __generator(this, function (_v) {
            switch (_v.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "settings"
                        })];
                case 1:
                    userId = (_v.sent()).userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _v.sent();
                    return [4 /*yield*/, (0, form_1.validator)(settings_1.subsidiaryValidator).validate(formData)];
                case 3:
                    validation = _v.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _c = validation.data, _ = _c.id, parentCompanyId = _c.parentCompanyId, baseCurrencyCode = _c.baseCurrencyCode, locationData = __rest(_c, ["id", "parentCompanyId", "baseCurrencyCode"]);
                    client = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, settings_1.insertCompany)(client, __assign(__assign({}, locationData), { baseCurrencyCode: baseCurrencyCode }))];
                case 4:
                    companyInsert = _v.sent();
                    if (!companyInsert.error) return [3 /*break*/, 6];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.companies];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(companyInsert.error, "Failed to create company"))];
                case 5: throw _d.apply(void 0, _e.concat([_v.sent()]));
                case 6:
                    companyId = (_t = companyInsert.data) === null || _t === void 0 ? void 0 : _t.id;
                    if (!!companyId) return [3 /*break*/, 8];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.companies];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Failed to get company ID"))];
                case 7: throw _f.apply(void 0, _g.concat([_v.sent()]));
                case 8:
                    language = (0, locale_1.resolveLanguage)((0, utils_1.getPreferenceHeaders)(request).locale);
                    return [4 /*yield*/, (0, settings_1.seedCompany)(client, companyId, userId, parentCompanyId, language)];
                case 9:
                    seed = _v.sent();
                    if (!seed.error) return [3 /*break*/, 11];
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.companies];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(seed.error, "Failed to seed company"))];
                case 10: throw _h.apply(void 0, _j.concat([_v.sent()]));
                case 11: return [4 /*yield*/, (0, resources_1.upsertLocation)(client, __assign(__assign({}, locationData), { name: "Headquarters", companyId: companyId, timezone: (0, date_1.getLocalTimeZone)(), createdBy: userId }))];
                case 12:
                    locationInsert = _v.sent();
                    if (!locationInsert.error) return [3 /*break*/, 14];
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.companies];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(locationInsert.error, "Failed to create headquarters location"))];
                case 13: throw _k.apply(void 0, _l.concat([_v.sent()]));
                case 14:
                    locationId = (_u = locationInsert.data) === null || _u === void 0 ? void 0 : _u.id;
                    if (!!locationId) return [3 /*break*/, 16];
                    _m = react_router_1.redirect;
                    _o = [path_1.path.to.companies];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Failed to get location ID"))];
                case 15: throw _m.apply(void 0, _o.concat([_v.sent()]));
                case 16: return [4 /*yield*/, (0, people_1.insertEmployeeJob)(client, {
                        id: userId,
                        companyId: companyId,
                        locationId: locationId
                    })];
                case 17:
                    job = _v.sent();
                    if (!job.error) return [3 /*break*/, 19];
                    _p = react_router_1.redirect;
                    _q = [path_1.path.to.companies];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(job.error, "Failed to create employee job record"))];
                case 18: throw _p.apply(void 0, _q.concat([_v.sent()]));
                case 19:
                    _r = react_router_1.redirect;
                    _s = [path_1.path.to.companies];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Created company"))];
                case 20: throw _r.apply(void 0, _s.concat([_v.sent()]));
            }
        });
    });
}
function NewSubsidiaryRoute() {
    var _a, _b, _c;
    var navigate = (0, react_router_1.useNavigate)();
    var company = (0, hooks_1.useUser)().company;
    var initialValues = {
        parentCompanyId: (_a = company === null || company === void 0 ? void 0 : company.id) !== null && _a !== void 0 ? _a : undefined,
        name: "",
        taxId: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        stateProvince: "",
        postalCode: "",
        countryCode: "",
        baseCurrencyCode: (_b = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _b !== void 0 ? _b : "USD"
    };
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open)
                navigate(path_1.path.to.companies);
        }}>
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>Let's setup your new company</react_1.ModalTitle>
        </react_1.ModalHeader>
        <react_1.ModalBody>
          <settings_1.SubsidiaryCompanyForm company={initialValues} parentCompanyId={(_c = company === null || company === void 0 ? void 0 : company.id) !== null && _c !== void 0 ? _c : undefined}/>
        </react_1.ModalBody>
      </react_1.ModalContent>
    </react_1.Modal>);
}
