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
exports.default = JoinRoute;
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var framer_motion_1 = require("framer-motion");
var lu_1 = require("react-icons/lu");
var si_1 = require("react-icons/si");
var react_router_1 = require("react-router");
var Profile_1 = require("~/modules/account/ui/Profile");
var invite_links_server_1 = require("~/modules/users/invite-links.server");
var path_1 = require("~/utils/path");
var meta = function () {
    return [{ title: "Join Company | Carbon" }];
};
exports.meta = meta;
var METHOD_META = {
    wechat: {
        label: "WeChat",
        icon: <si_1.SiWechat className="size-4" style={{ color: "#07C160" }}/>
    },
    phone: { label: "Phone", icon: <lu_1.LuPhone className="size-4"/> },
    email: { label: "Email", icon: <lu_1.LuMail className="size-4"/> },
    google: { label: "Google", icon: <si_1.SiGoogle className="size-4"/> },
    azure: { label: "Outlook", icon: <lu_1.LuMail className="size-4"/> }
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var code, authSession, serviceRole, invite;
        var params = _b.params, request = _b.request;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    code = params.code;
                    if (!code)
                        throw new Error("No code provided");
                    return [4 /*yield*/, (0, session_server_1.getAuthSession)(request)];
                case 1:
                    authSession = _c.sent();
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, invite_links_server_1.getPublicInviteLinkByCode)(serviceRole, code, authSession === null || authSession === void 0 ? void 0 : authSession.userId)];
                case 2:
                    invite = _c.sent();
                    if (!invite.success) {
                        return [2 /*return*/, {
                                success: false,
                                data: null,
                                isAuthenticated: !!authSession
                            }];
                    }
                    return [2 /*return*/, {
                            success: true,
                            data: invite.data,
                            isAuthenticated: !!authSession
                        }];
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
// The ordered checklist of required login methods, with each step's status.
function MethodChecklist(_a) {
    var methods = _a.methods, satisfied = _a.satisfied, nextMethod = _a.nextMethod;
    return (<react_1.VStack spacing={2} className="w-full">
      {methods.map(function (method, index) {
            var meta = METHOD_META[method];
            if (!meta)
                return null;
            var done = satisfied.has(method);
            var current = method === nextMethod;
            return (<div key={method} className={"flex w-full items-center justify-between rounded-lg border p-3 ".concat(current ? "border-primary bg-primary/5" : "border-border")}>
            <react_1.HStack spacing={2}>
              <span className="text-xs font-semibold text-muted-foreground">
                {index + 1}
              </span>
              {meta.icon}
              <span className="text-sm font-medium">{meta.label}</span>
            </react_1.HStack>
            {done ? (<lu_1.LuCheck className="size-4 text-emerald-500"/>) : current ? null : (<lu_1.LuLock className="size-4 text-muted-foreground/50"/>)}
          </div>);
        })}
    </react_1.VStack>);
}
function JoinRoute() {
    var _a, _b, _c, _d, _e;
    var t = (0, macro_1.useLingui)().t;
    var _f = (0, react_router_1.useLoaderData)(), success = _f.success, data = _f.data, isAuthenticated = _f.isAuthenticated;
    if (!success || !data) {
        return (<react_1.VStack spacing={4} className="max-w-lg items-center text-center">
        <div className="flex justify-center mb-4">
          <img src="/carbon-logo-mark.svg" alt={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Carbon Logo"], ["Carbon Logo"])))} className="w-36"/>
        </div>
        <react_1.VStack spacing={2} className="text-center w-full">
          <Heading className="w-full text-center">
            <macro_1.Trans>Invalid Invite Link</macro_1.Trans>
          </Heading>
          <p>
            <macro_1.Trans>
              This invite link is invalid or has expired. Please contact the
              person who shared it with you.
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
    if (data.expired) {
        return (<react_1.VStack spacing={4} className="max-w-lg items-center text-center">
        <img src="/carbon-logo-mark.svg" alt={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Carbon Logo"], ["Carbon Logo"])))} className="w-24 mb-3"/>
        <Heading size="h1" className="m-0">
          <macro_1.Trans>Invite Link Expired</macro_1.Trans>
        </Heading>
        <p className="text-muted-foreground">
          <macro_1.Trans>This invite link is no longer accepting new requests.</macro_1.Trans>
        </p>
        <Button asChild>
          <react_router_1.Link to="/">
            <macro_1.Trans>Return Home</macro_1.Trans>
          </react_router_1.Link>
        </Button>
      </react_1.VStack>);
    }
    if (data.alreadyMember) {
        return (<react_1.VStack spacing={4} className="max-w-lg items-center text-center">
        <img src="/carbon-logo-mark.svg" alt={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Carbon Logo"], ["Carbon Logo"])))} className="w-24 mb-3"/>
        <Heading size="h1" className="m-0">
          <macro_1.Trans>Already a Member</macro_1.Trans>
        </Heading>
        <p className="text-muted-foreground">
          <macro_1.Trans>You already have access to {data.companyName}.</macro_1.Trans>
        </p>
        <Button asChild>
          <react_router_1.Link to={path_1.path.to.authenticatedRoot}>
            <macro_1.Trans>Go to App</macro_1.Trans>
          </react_router_1.Link>
        </Button>
      </react_1.VStack>);
    }
    if (data.alreadyApplied) {
        return (<react_1.VStack spacing={4} className="max-w-lg items-center text-center">
        <img src="/carbon-logo-mark.svg" alt={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Carbon Logo"], ["Carbon Logo"])))} className="w-24 mb-3"/>
        <Heading size="h1" className="m-0">
          <macro_1.Trans>Request Submitted</macro_1.Trans>
        </Heading>
        <p className="text-muted-foreground">
          <macro_1.Trans>
            Your request to join {data.companyName} has already been submitted
            and is pending review.
          </macro_1.Trans>
        </p>
      </react_1.VStack>);
    }
    var requiredMethods = data.loginMethods;
    var satisfied = new Set(data.satisfiedMethods);
    var nextMethod = (_a = requiredMethods.find(function (m) { return !satisfied.has(m); })) !== null && _a !== void 0 ? _a : null;
    var allSatisfied = nextMethod === null;
    // First required method the joiner still needs (used for the sign-in CTA when
    // they aren't authenticated yet).
    var firstMethod = requiredMethods[0];
    var loginUrl = "".concat(path_1.path.to.login, "?redirectTo=").concat(encodeURIComponent(path_1.path.to.joinLink(data.code))).concat(firstMethod ? "&only=".concat(encodeURIComponent(firstMethod)) : "");
    // Fake identity rows (types only) so LoginMethodsForm can compute
    // email-family blocking; the connect widget only renders the unlinked method.
    var identityStubs = data.satisfiedMethods.map(function (type) { return ({
        id: type,
        type: type,
        value: "",
        verifiedAt: null,
        createdAt: ""
    }); });
    // Precomputed labels keep the lingui <Trans> children simple (no expressions).
    var firstMethodLabel = firstMethod
        ? ((_c = (_b = METHOD_META[firstMethod]) === null || _b === void 0 ? void 0 : _b.label) !== null && _c !== void 0 ? _c : firstMethod)
        : "";
    var nextMethodLabel = nextMethod
        ? ((_e = (_d = METHOD_META[nextMethod]) === null || _d === void 0 ? void 0 : _d.label) !== null && _e !== void 0 ? _e : nextMethod)
        : "";
    var nextMethodList = (nextMethod ? [nextMethod] : []);
    var requestToJoin = (<react_router_1.Form method="post" action={path_1.path.to.joinLinkApply(data.code)}>
      <Button {...fade} transition={{ duration: 1.2, ease: "easeInOut", delay: 1 }} size="lg" type="submit">
        <macro_1.Trans>Request to Join</macro_1.Trans>
      </Button>
    </react_router_1.Form>);
    return (<framer_motion_1.AnimatePresence>
      <react_1.VStack spacing={4} className="max-w-lg items-center text-center">
        <framer_motion_1.motion.img initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 2, ease: "easeInOut" }} src="/carbon-logo-mark.svg" alt={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Carbon Logo"], ["Carbon Logo"])))} className="w-24 mb-3"/>

        <Heading {...fade} transition={{ duration: 1.2, ease: "easeInOut", delay: 0.5 }} size="h1" className="m-0">
          <macro_1.Trans>Join {data.companyName}</macro_1.Trans>
        </Heading>

        <p className="text-muted-foreground" {...fade} style={{ animationDelay: "0.8s" }}>
          <macro_1.Trans>
            {data.inviterName} invited you to join as {data.roleName}.
          </macro_1.Trans>
        </p>

        {requiredMethods.length === 0 ? (
        // No method requirement: sign in (any method) then request to join.
        isAuthenticated ? (requestToJoin) : (<Button {...fade} transition={{ duration: 1.2, ease: "easeInOut", delay: 1 }} size="lg" asChild>
              <react_router_1.Link to={loginUrl}>
                <macro_1.Trans>Sign In to Request Access</macro_1.Trans>
              </react_router_1.Link>
            </Button>)) : (
        // Required-method sequence: complete each method, in order.
        <react_1.VStack spacing={4} className="w-full max-w-sm">
            <MethodChecklist methods={requiredMethods} satisfied={satisfied} nextMethod={nextMethod}/>

            {allSatisfied ? (requestToJoin) : !isAuthenticated ? (<Button size="lg" asChild>
                <react_router_1.Link to={loginUrl}>
                  <macro_1.Trans>Sign in with {firstMethodLabel}</macro_1.Trans>
                </react_router_1.Link>
              </Button>) : (<react_1.VStack spacing={2} className="w-full">
                <p className="text-sm text-muted-foreground">
                  <macro_1.Trans>Connect your {nextMethodLabel} to continue.</macro_1.Trans>
                </p>
                <Profile_1.LoginMethodsForm identities={identityStubs} enabledMethods={nextMethodList} action={path_1.path.to.joinLinkLink(data.code)} returnTo={path_1.path.to.joinLink(data.code)} bare/>
              </react_1.VStack>)}
          </react_1.VStack>)}
      </react_1.VStack>

      <p className="text-xs text-muted-foreground text-center mt-6">
        <macro_1.Trans>
          By requesting access, you agree to the{" "}
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
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
