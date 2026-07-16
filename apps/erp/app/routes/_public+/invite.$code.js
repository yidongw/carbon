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
exports.meta = void 0;
exports.loader = loader;
exports.action = action;
exports.default = Invite;
var auth_1 = require("@carbon/auth");
var client_server_1 = require("@carbon/auth/client.server");
var company_server_1 = require("@carbon/auth/company.server");
var session_server_1 = require("@carbon/auth/session.server");
var kv_1 = require("@carbon/kv");
var react_1 = require("@carbon/react");
var stripe_server_1 = require("@carbon/stripe/stripe.server");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var framer_motion_1 = require("framer-motion");
var react_router_1 = require("react-router");
var users_server_1 = require("~/modules/users/users.server");
var path_1 = require("~/utils/path");
var meta = function () {
    return [{ title: "Accept Invite | Carbon" }];
};
exports.meta = meta;
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var code, serviceRole, invite;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    code = params.code;
                    if (!code)
                        throw new Error("No code provided");
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("invite")
                            .select("*, company(name)")
                            .eq("code", code)
                            .single()];
                case 1:
                    invite = _c.sent();
                    if (!invite.data || invite.data.acceptedAt) {
                        return [2 /*return*/, { success: false, company: null }];
                    }
                    return [2 /*return*/, { success: true, company: invite.data.company }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var code, authSession, serviceRole, accept, _c, _d, companyRecord, sessionCookie, companyIdCookie, magicLink;
        var _e, _f, _g, _h, _j, _k;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    code = params.code;
                    if (!code)
                        throw new Error("No code provided");
                    return [4 /*yield*/, (0, session_server_1.getAuthSession)(request)];
                case 1:
                    authSession = _l.sent();
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, users_server_1.acceptInvite)(serviceRole, code, (_e = authSession === null || authSession === void 0 ? void 0 : authSession.email) !== null && _e !== void 0 ? _e : undefined)];
                case 2:
                    accept = _l.sent();
                    if (!accept.error) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.root];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(accept.error, (_f = accept.error.message) !== null && _f !== void 0 ? _f : "Failed to accept invite"))];
                case 3: throw _c.apply(void 0, _d.concat([_l.sent()]));
                case 4:
                    if (!(auth_1.CarbonEdition === utils_1.Edition.Cloud)) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, stripe_server_1.updateSubscriptionQuantityForCompany)(accept.data.companyId)];
                case 5:
                    _l.sent();
                    _l.label = 6;
                case 6:
                    if (!authSession) return [3 /*break*/, 10];
                    return [4 /*yield*/, kv_1.redis.del((0, auth_1.getPermissionCacheKey)(authSession.userId))];
                case 7:
                    _l.sent();
                    return [4 /*yield*/, serviceRole
                            .from("company")
                            .select("companyGroupId")
                            .eq("id", accept.data.companyId)
                            .single()];
                case 8:
                    companyRecord = (_l.sent()).data;
                    return [4 /*yield*/, (0, session_server_1.updateCompanySession)(request, accept.data.companyId, (_g = companyRecord === null || companyRecord === void 0 ? void 0 : companyRecord.companyGroupId) !== null && _g !== void 0 ? _g : "")];
                case 9:
                    sessionCookie = _l.sent();
                    companyIdCookie = (0, company_server_1.setCompanyId)(accept.data.companyId);
                    throw (0, react_router_1.redirect)(path_1.path.to.authenticatedRoot, {
                        headers: [
                            ["Set-Cookie", sessionCookie],
                            ["Set-Cookie", companyIdCookie]
                        ]
                    });
                case 10: return [4 /*yield*/, serviceRole.auth.admin.generateLink({
                        type: "magiclink",
                        email: accept.data.email,
                        options: {
                            redirectTo: "".concat((0, auth_1.getAppUrl)(), "/callback")
                        }
                    })];
                case 11:
                    magicLink = _l.sent();
                    throw (0, react_router_1.redirect)((_k = (_j = (_h = magicLink.data) === null || _h === void 0 ? void 0 : _h.properties) === null || _j === void 0 ? void 0 : _j.action_link) !== null && _k !== void 0 ? _k : path_1.path.to.root);
            }
        });
    });
}
var fade = {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
};
var Heading = framer_motion_1.motion.create(react_1.Heading);
var Button = framer_motion_1.motion.create(react_1.Button);
function Invite() {
    var _a;
    var _b = (0, react_router_1.useLoaderData)(), success = _b.success, company = _b.company;
    var t = (0, macro_1.useLingui)().t;
    if (!success) {
        return (<react_1.VStack spacing={4} className="max-w-lg items-center text-center">
        <div className="flex justify-center mb-8">
          <img src="/carbon-mark-light.svg" alt={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Carbon Logo"], ["Carbon Logo"])))} className="w-24 dark:hidden"/>
          <img src="/carbon-mark-dark.svg" alt={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Carbon Logo"], ["Carbon Logo"])))} className="w-24 hidden dark:block"/>
        </div>
        <react_1.VStack spacing={2} className="text-center w-full">
          <Heading className="w-full text-center">
            <macro_1.Trans>Invalid Invite</macro_1.Trans>
          </Heading>
          <p>
            <macro_1.Trans>
              Your invitation is invalid or has already been accepted. Please
              contact support if you believe this is an error.
            </macro_1.Trans>
          </p>
        </react_1.VStack>
        <Button asChild>
          <react_router_1.Link to="/">
            <macro_1.Trans>Return Home</macro_1.Trans>
          </react_router_1.Link>
        </Button>
      </react_1.VStack>);
    }
    return (<framer_motion_1.AnimatePresence>
      <react_1.VStack spacing={4} className="max-w-lg items-center text-center">
        <framer_motion_1.motion.img initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 2, ease: "easeInOut" }} src="/carbon-mark-light.svg" alt="Carbon Logo" className="w-24 dark:hidden"/>
        <img src="/carbon-mark-dark.svg" alt="Carbon Logo" className="w-24 hidden dark:block"/>

        <Heading {...fade} transition={{ duration: 1.2, ease: "easeInOut", delay: 1.5 }} size="h1" className="mb-4">
          <macro_1.Trans>Welcome to Carbon</macro_1.Trans>
        </Heading>

        <react_router_1.Form method="post">
          <Button {...fade} transition={{ duration: 1.2, ease: "easeInOut", delay: 1.5 }} size="lg" type="submit">
            <macro_1.Trans>Join {(_a = company === null || company === void 0 ? void 0 : company.name) !== null && _a !== void 0 ? _a : "Company"}</macro_1.Trans>
          </Button>
        </react_router_1.Form>
      </react_1.VStack>

      <p className="text-xs text-muted-foreground  text-center">
        <macro_1.Trans>
          By accepting the invite, you agree to the{" "}
          <react_router_1.Link to="https://carbon.ms/terms" className="underline">
            Terms of Service
          </react_router_1.Link>{" "}
          and{" "}
          <react_router_1.Link to="https://carbon.ms/privacy" className="underline">
            Privacy Policy
          </react_router_1.Link>
          .
        </macro_1.Trans>
      </p>
    </framer_motion_1.AnimatePresence>);
}
var templateObject_1, templateObject_2;
