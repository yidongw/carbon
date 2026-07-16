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
exports.loader = loader;
exports.action = action;
exports.default = OnboardingUser;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var account_1 = require("~/modules/account");
var users_server_1 = require("~/modules/users/users.server");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var userId, user;
        var request = _b.request;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    userId = (_c.sent()).userId;
                    return [4 /*yield*/, (0, users_server_1.getUser)((0, client_server_1.getCarbonServiceRole)(), userId)];
                case 2:
                    user = _c.sent();
                    if (!(user.error || !user.data)) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, session_server_1.destroyAuthSession)(request)];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4: return [2 /*return*/, { user: user.data }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var userId, validation, _c, _d, _e, firstName, lastName, next, updateAccount;
        var request = _b.request;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    userId = (_f.sent()).userId;
                    _d = (_c = (0, form_1.validator)(account_1.onboardingUserValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 2: return [4 /*yield*/, _d.apply(_c, [_f.sent()])];
                case 3:
                    validation = _f.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _e = validation.data, firstName = _e.firstName, lastName = _e.lastName, next = _e.next;
                    return [4 /*yield*/, (0, account_1.updatePublicAccount)((0, client_server_1.getCarbonServiceRole)(), {
                            id: userId,
                            firstName: firstName,
                            lastName: lastName
                            // about: about ?? "",
                        })];
                case 4:
                    updateAccount = _f.sent();
                    if (updateAccount.error) {
                        console.error(updateAccount.error);
                        throw new Error("Fatal: failed to update account");
                    }
                    throw (0, react_router_1.redirect)(next);
            }
        });
    });
}
function OnboardingUser() {
    var t = (0, macro_1.useLingui)().t;
    var user = (0, react_router_1.useLoaderData)().user;
    var _a = (0, hooks_1.useOnboarding)(), next = _a.next, previous = _a.previous;
    var initialValues = {};
    if ((user === null || user === void 0 ? void 0 : user.firstName) &&
        (user === null || user === void 0 ? void 0 : user.lastName) &&
        (user === null || user === void 0 ? void 0 : user.firstName) !== "Carbon" &&
        (user === null || user === void 0 ? void 0 : user.lastName) !== "Admin") {
        initialValues.firstName = user === null || user === void 0 ? void 0 : user.firstName;
        initialValues.lastName = user === null || user === void 0 ? void 0 : user.lastName;
        // initialValues.about = user?.about!;
    }
    return (<react_1.Card className="max-w-lg">
      <form_1.ValidatedForm autoComplete="off" validator={account_1.onboardingUserValidator} defaultValues={initialValues} method="post">
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Let's setup your account</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>
        <react_1.CardContent>
          <Form_1.Hidden name="next" value={next}/>
          <react_1.VStack spacing={4}>
            <Form_1.Input autoFocus name="firstName" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["First Name"], ["First Name"])))}/>
            <Form_1.Input name="lastName" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Last Name"], ["Last Name"])))}/>
            {/* <TextArea name="about" label={t`About`} /> */}
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
var templateObject_1, templateObject_2;
