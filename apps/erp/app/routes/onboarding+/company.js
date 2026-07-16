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
exports.loader = loader;
exports.action = action;
exports.default = OnboardingCompany;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var company_server_1 = require("@carbon/auth/company.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var jobs_1 = require("@carbon/jobs");
var locale_1 = require("@carbon/locale");
var utils_1 = require("@carbon/utils");
var react_1 = require("@carbon/react");
var utils_2 = require("@carbon/utils");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var people_1 = require("~/modules/people");
var resources_1 = require("~/modules/resources");
var settings_1 = require("~/modules/settings");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, company;
        var request = _b.request;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _d.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, (0, settings_1.getCompany)(client, companyId !== null && companyId !== void 0 ? companyId : 1)];
                case 2:
                    company = _d.sent();
                    if (company.error || !company.data) {
                        return [2 /*return*/, {
                                company: null
                            }];
                    }
                    return [2 /*return*/, { company: company.data }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, validation, _d, _e, serviceRole, _f, next, d, companyId, companies, company, locations, location, _g, companyUpdate, locationUpdate, companyInsert, language, seed, baseCurrencyCode, website, locationData, locationInsert, locationId, job, companyRecord, sessionCookie, companyIdCookie;
        var _h, _j, _k, _l, _m, _o;
        var request = _b.request;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _p.sent(), client = _c.client, userId = _c.userId;
                    _e = (_d = (0, form_1.validator)(settings_1.onboardingCompanyValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 2: return [4 /*yield*/, _e.apply(_d, [_p.sent()])];
                case 3:
                    validation = _p.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    _f = validation.data, next = _f.next, d = __rest(_f, ["next"]);
                    return [4 /*yield*/, (0, settings_1.getCompanies)(client, userId)];
                case 4:
                    companies = _p.sent();
                    company = (_h = companies === null || companies === void 0 ? void 0 : companies.data) === null || _h === void 0 ? void 0 : _h[0];
                    return [4 /*yield*/, (0, resources_1.getLocationsList)(client, (_j = company === null || company === void 0 ? void 0 : company.id) !== null && _j !== void 0 ? _j : "")];
                case 5:
                    locations = _p.sent();
                    location = (_k = locations === null || locations === void 0 ? void 0 : locations.data) === null || _k === void 0 ? void 0 : _k[0];
                    if (!(company && location)) return [3 /*break*/, 7];
                    return [4 /*yield*/, Promise.all([
                            (0, settings_1.updateCompany)(serviceRole, company.id, __assign(__assign({}, d), { updatedBy: userId })),
                            (0, resources_1.upsertLocation)(serviceRole, __assign(__assign(__assign({}, location), d), { timezone: (0, date_1.getLocalTimeZone)(), updatedBy: userId }))
                        ])];
                case 6:
                    _g = _p.sent(), companyUpdate = _g[0], locationUpdate = _g[1];
                    if (companyUpdate.error) {
                        console.error(companyUpdate.error);
                        throw new Error("Fatal: failed to update company");
                    }
                    if (locationUpdate.error) {
                        console.error(locationUpdate.error);
                        throw new Error("Fatal: failed to update location");
                    }
                    return [3 /*break*/, 13];
                case 7:
                    if (!!companyId) return [3 /*break*/, 9];
                    return [4 /*yield*/, Promise.all([
                            (0, settings_1.insertCompany)(serviceRole, d)
                        ])];
                case 8:
                    companyInsert = (_p.sent())[0];
                    if (companyInsert.error) {
                        console.error(companyInsert.error);
                        throw new Error("Fatal: failed to insert company");
                    }
                    companyId = (_l = companyInsert.data) === null || _l === void 0 ? void 0 : _l.id;
                    _p.label = 9;
                case 9:
                    if (!companyId) {
                        throw new Error("Fatal: failed to get company ID");
                    }
                    language = (0, locale_1.resolveLanguage)((0, utils_1.getPreferenceHeaders)(request).locale);
                    return [4 /*yield*/, (0, settings_1.seedCompany)(serviceRole, companyId, userId, undefined, language)];
                case 10:
                    seed = _p.sent();
                    if (seed.error) {
                        console.error(seed.error);
                        throw new Error("Fatal: failed to seed company");
                    }
                    if (auth_1.CarbonEdition === utils_2.Edition.Cloud) {
                        (0, jobs_1.trigger)("onboard", {
                            type: "lead",
                            companyId: companyId,
                            userId: userId
                        });
                    }
                    baseCurrencyCode = d.baseCurrencyCode, website = d.website, locationData = __rest(d, ["baseCurrencyCode", "website"]);
                    return [4 /*yield*/, Promise.all([
                            (0, resources_1.upsertLocation)(serviceRole, __assign(__assign({}, locationData), { name: "Headquarters", companyId: companyId, timezone: (0, date_1.getLocalTimeZone)(), createdBy: userId }))
                        ])];
                case 11:
                    locationInsert = (_p.sent())[0];
                    if (locationInsert.error) {
                        console.error(locationInsert.error);
                        throw new Error("Fatal: failed to insert location");
                    }
                    locationId = (_m = locationInsert.data) === null || _m === void 0 ? void 0 : _m.id;
                    if (!locationId) {
                        throw new Error("Fatal: failed to get location ID");
                    }
                    return [4 /*yield*/, Promise.all([
                            (0, people_1.insertEmployeeJob)(serviceRole, {
                                id: userId,
                                companyId: companyId,
                                locationId: locationId
                            })
                        ])];
                case 12:
                    job = (_p.sent())[0];
                    if (job.error) {
                        console.error(job.error);
                        throw new Error("Fatal: failed to insert job");
                    }
                    _p.label = 13;
                case 13: return [4 /*yield*/, serviceRole
                        .from("company")
                        .select("companyGroupId")
                        .eq("id", companyId)
                        .single()];
                case 14:
                    companyRecord = (_p.sent()).data;
                    return [4 /*yield*/, (0, session_server_1.updateCompanySession)(request, companyId, (_o = companyRecord === null || companyRecord === void 0 ? void 0 : companyRecord.companyGroupId) !== null && _o !== void 0 ? _o : "")];
                case 15:
                    sessionCookie = _p.sent();
                    companyIdCookie = (0, company_server_1.setCompanyId)(companyId);
                    throw (0, react_router_1.redirect)(next, {
                        headers: [
                            ["Set-Cookie", sessionCookie],
                            ["Set-Cookie", companyIdCookie]
                        ]
                    });
            }
        });
    });
}
function OnboardingCompany() {
    var _a, _b;
    var t = (0, macro_1.useLingui)().t;
    var company = (0, react_router_1.useLoaderData)().company;
    var _c = (0, hooks_1.useOnboarding)(), next = _c.next, previous = _c.previous;
    var initialValues = {
        name: (_a = company === null || company === void 0 ? void 0 : company.name) !== null && _a !== void 0 ? _a : "",
        baseCurrencyCode: (_b = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _b !== void 0 ? _b : "CNY"
    };
    return (<react_1.Card className="max-w-lg">
      <form_1.ValidatedForm validator={settings_1.onboardingCompanyValidator} defaultValues={initialValues} method="post">
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Now let's set up your company</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>
        <react_1.CardContent>
          <Form_1.Hidden name="next" value={next}/>
          <Form_1.Hidden name="baseCurrencyCode" value="CNY"/>
          <react_1.VStack spacing={4}>
            <Form_1.Input autoFocus name="name" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Company Name"], ["Company Name"])))}/>
          </react_1.VStack>
        </react_1.CardContent>

        <react_1.CardFooter>
          <react_1.HStack>
            <react_1.Button variant="solid" isDisabled={!previous} size="md" asChild tabIndex={-1}>
              <react_router_1.Link to={previous} prefetch="intent">
                <macro_1.Trans>Previous</macro_1.Trans>
              </react_router_1.Link>
            </react_1.Button>
            <Form_1.Submit>
              <macro_1.Trans>Next</macro_1.Trans>
            </Form_1.Submit>
          </react_1.HStack>
        </react_1.CardFooter>
      </form_1.ValidatedForm>
    </react_1.Card>);
}
var templateObject_1;
