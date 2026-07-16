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
exports.default = LoginMethodsForm;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var qrcode_react_1 = require("qrcode.react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var si_1 = require("react-icons/si");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var META = {
    email: { label: "Email", icon: <lu_1.LuMail className="size-4"/> },
    google: { label: "Google", icon: <si_1.SiGoogle className="size-4"/> },
    azure: { label: "Outlook", icon: <lu_1.LuMail className="size-4"/> },
    phone: { label: "Phone", icon: <lu_1.LuPhone className="size-4"/> },
    wechat: {
        label: "WeChat",
        icon: <si_1.SiWechat className="size-4" style={{ color: "#07C160" }}/>
    }
};
var OTP_METHODS = new Set(["email", "phone"]);
var OAUTH_METHODS = new Set(["google", "azure"]);
// email / google / azure all resolve to the one account email, so once any is
// linked the others can't be added (you can only have one email address).
var EMAIL_FAMILY = new Set(["email", "google", "azure"]);
// This is the user's own account page, so show the real value. WeChat's identity
// value is an opaque unionid, so we show the user's profile name instead.
function displayValue(type, value, wechatName) {
    return type === "wechat" ? (wechatName !== null && wechatName !== void 0 ? wechatName : "") : value;
}
function LoginMethodsForm(_a) {
    var _this = this;
    var _b, _c, _d, _e;
    var identities = _a.identities, enabledMethods = _a.enabledMethods, wechatName = _a.wechatName, 
    // Where the add/remove intent forms POST (default: the profile route). The
    // join flow points these at its own link route.
    _f = _a.action, 
    // Where the add/remove intent forms POST (default: the profile route). The
    // join flow points these at its own link route.
    action = _f === void 0 ? path_1.path.to.profile : _f, 
    // Where OAuth / in-WeChat-browser linking returns to (default: profile).
    _g = _a.returnTo, 
    // Where OAuth / in-WeChat-browser linking returns to (default: profile).
    returnTo = _g === void 0 ? path_1.path.to.profile : _g, 
    // Render without the surrounding Card chrome (used inside the join flow).
    _h = _a.bare, 
    // Render without the surrounding Card chrome (used inside the join flow).
    bare = _h === void 0 ? false : _h;
    var t = (0, macro_1.useLingui)().t;
    var addFetcher = (0, react_router_1.useFetcher)();
    var removeFetcher = (0, react_router_1.useFetcher)();
    var _j = (0, react_2.useState)(null), draft = _j[0], setDraft = _j[1];
    var byType = new Map(identities.map(function (i) { return [i.type, i]; }));
    // Email, Google, and Outlook all share the same underlying email address, so
    // they count as a single independent method. Only allow removal when there is
    // more than one independent method — otherwise the user would lose all access.
    var independentMethods = new Set(identities.map(function (i) {
        return EMAIL_FAMILY.has(i.type) ? "email_family" : i.type;
    }));
    var canRemove = independentMethods.size > 1;
    var hasEmailFamily = identities.some(function (i) {
        return EMAIL_FAMILY.has(i.type);
    });
    var busy = addFetcher.state !== "idle";
    // Track which specific method is being removed so only that button spins.
    var removingType = removeFetcher.state !== "idle"
        ? (_b = removeFetcher.formData) === null || _b === void 0 ? void 0 : _b.get("type")
        : null;
    var sentTo = (_c = draft === null || draft === void 0 ? void 0 : draft.contact) !== null && _c !== void 0 ? _c : "";
    // React to each add-fetcher response exactly once. Keying on a ref (not on
    // draft) avoids acting on stale data — e.g. a previous link left
    // `{ linked: true }` on the fetcher, which would otherwise close a freshly
    // opened draft the moment you click Connect again.
    var handledAddData = (0, react_2.useRef)(null);
    (0, react_2.useEffect)(function () {
        if (addFetcher.state !== "idle" || !addFetcher.data)
            return;
        if (handledAddData.current === addFetcher.data)
            return;
        handledAddData.current = addFetcher.data;
        if (addFetcher.data.step === "addPhoneSent" ||
            addFetcher.data.step === "addEmailSent") {
            setDraft(function (d) { return (d && d.step === "enter" ? __assign(__assign({}, d), { step: "code" }) : d); });
        }
        else if (addFetcher.data.linked) {
            setDraft(null);
        }
    }, [addFetcher.state, addFetcher.data]);
    var onLinkOAuth = function (provider) {
        // carbonClient has persistSession: false — no client-side session to send
        // with linkIdentity(). Use the server-side proxy route instead so GoTrue
        // receives the real user token (read from the session cookie).
        // Pass callbackOrigin from the client: the server sits behind a reverse proxy
        // and sees the internal hostname, not the public browser URL. GoTrue
        // validates redirect_to against the allow list, so it must be the real origin.
        var params = new URLSearchParams({
            provider: provider,
            redirectTo: returnTo,
            callbackOrigin: window.location.origin
        });
        window.location.href = "/api/auth/link-provider?".concat(params);
    };
    var revalidator = (0, react_router_1.useRevalidator)();
    var wechatFetcher = (0, react_router_1.useFetcher)();
    var _k = (0, react_2.useState)(false), wechatOpen = _k[0], setWechatOpen = _k[1];
    var wechatScene = (_e = (_d = wechatFetcher.data) === null || _d === void 0 ? void 0 : _d.scene) !== null && _e !== void 0 ? _e : null;
    // In the WeChat in-app browser, connecting is an OAuth redirect; on desktop we
    // show a QR to scan (mirrors WeChat login).
    var onConnectWeChat = function () {
        setDraft(null);
        if (/MicroMessenger/i.test(navigator.userAgent)) {
            window.location.href = "/auth/wechat?link=1&redirectTo=".concat(encodeURIComponent(returnTo));
            return;
        }
        setWechatOpen(true);
        wechatFetcher.load("/api/wechat-qr-url?link=1");
    };
    // While the QR is shown, poll the scene; the webhook links it once scanned.
    (0, react_2.useEffect)(function () {
        if (!wechatOpen || !wechatScene)
            return;
        var active = true;
        var poll = function () { return __awaiter(_this, void 0, void 0, function () {
            var res, json, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch("/api/wechat-qr-status?scene=".concat(encodeURIComponent(wechatScene)))];
                    case 1:
                        res = _b.sent();
                        if (!res.ok || !active)
                            return [2 /*return*/];
                        return [4 /*yield*/, res.json()];
                    case 2:
                        json = (_b.sent());
                        if (json.status === "linked") {
                            setWechatOpen(false);
                            react_1.toast.success(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["WeChat linked"], ["WeChat linked"]))));
                            revalidator.revalidate();
                        }
                        else if (json.status === "link_failed") {
                            setWechatOpen(false);
                            react_1.toast.error(json.reason === "conflict"
                                ? t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["That WeChat is already linked to another account"], ["That WeChat is already linked to another account"]))) : t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Failed to link WeChat"], ["Failed to link WeChat"]))));
                        }
                        else if (json.status === "expired") {
                            setWechatOpen(false);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        var id = setInterval(poll, 2000);
        poll();
        return function () {
            active = false;
            clearInterval(id);
        };
    }, [wechatOpen, wechatScene, revalidator, t]);
    var content = (<react_1.VStack spacing={2}>
      {enabledMethods.map(function (method) {
            var _a;
            var identity = byType.get(method);
            var meta = META[method];
            var draftOpen = (draft === null || draft === void 0 ? void 0 : draft.method) === method;
            var wechatPanelOpen = method === "wechat" && wechatOpen;
            // Can't add a second email-family method once one is linked.
            var blockedByEmail = EMAIL_FAMILY.has(method) && hasEmailFamily;
            return (<div key={method} className="w-full rounded-lg border border-border">
            <div className="w-full p-3">
              {identity && displayValue(method, identity.value, wechatName) ? (
                // Two-line layout: label row + value + remove row
                <>
                  <react_1.HStack spacing={2}>
                    {meta.icon}
                    <span className="text-sm font-medium">{meta.label}</span>
                  </react_1.HStack>
                  <react_1.HStack className="w-full justify-between mt-1">
                    <span className="text-sm text-muted-foreground break-all">
                      {displayValue(method, identity.value, wechatName)}
                    </span>
                    <removeFetcher.Form method="post" action={action}>
                      <input type="hidden" name="intent" value="removeIdentity"/>
                      <input type="hidden" name="type" value={identity.type}/>
                      <input type="hidden" name="value" value={identity.value}/>
                      <react_1.Button type="submit" variant="ghost" size="sm" isLoading={removingType === identity.type} isDisabled={!canRemove || removingType !== null} leftIcon={<lu_1.LuTrash2 className="size-4"/>}>
                        <macro_1.Trans>Remove</macro_1.Trans>
                      </react_1.Button>
                    </removeFetcher.Form>
                  </react_1.HStack>
                </>) : (
                // Single-line layout: no value to show (unlinked, or WeChat with no name)
                <react_1.HStack className="w-full justify-between">
                  <react_1.HStack spacing={2}>
                    {meta.icon}
                    <span className="text-sm font-medium">{meta.label}</span>
                  </react_1.HStack>
                  {identity ? (<removeFetcher.Form method="post" action={action}>
                      <input type="hidden" name="intent" value="removeIdentity"/>
                      <input type="hidden" name="type" value={identity.type}/>
                      <input type="hidden" name="value" value={identity.value}/>
                      <react_1.Button type="submit" variant="ghost" size="sm" isLoading={removingType === identity.type} isDisabled={!canRemove || removingType !== null} leftIcon={<lu_1.LuTrash2 className="size-4"/>}>
                        <macro_1.Trans>Remove</macro_1.Trans>
                      </react_1.Button>
                    </removeFetcher.Form>) : OTP_METHODS.has(method) ? (<react_1.Button type="button" variant="secondary" size="sm" isDisabled={blockedByEmail} onClick={function () {
                            setWechatOpen(false);
                            setDraft({
                                method: method,
                                step: "enter",
                                contact: "",
                                code: ""
                            });
                        }}>
                      <macro_1.Trans>Connect</macro_1.Trans>
                    </react_1.Button>) : OAUTH_METHODS.has(method) ? (<react_1.Button type="button" variant="secondary" size="sm" isDisabled={blockedByEmail} onClick={function () { return onLinkOAuth(method); }}>
                      <macro_1.Trans>Connect</macro_1.Trans>
                    </react_1.Button>) : (<react_1.Button type="button" variant="secondary" size="sm" onClick={onConnectWeChat}>
                      <macro_1.Trans>Connect</macro_1.Trans>
                    </react_1.Button>)}
                </react_1.HStack>)}
            </div>

            {draftOpen && draft && (<addFetcher.Form method="post" action={action} className="w-full">
                <react_1.VStack spacing={2} className="border-t border-border p-3">
                  {draft.step === "enter" ? (<>
                      <input type="hidden" name="intent" value={method === "phone" ? "addPhoneSend" : "addEmailSend"}/>
                      <react_1.Input name={method === "phone" ? "phone" : "email"} prefix={method === "phone" ? "+86" : undefined} placeholder={method === "phone"
                            ? t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Phone Number"], ["Phone Number"]))) : t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Email Address"], ["Email Address"])))} value={draft.contact} onChange={function (e) {
                            return setDraft(function (d) {
                                return d ? __assign(__assign({}, d), { contact: e.target.value }) : d;
                            });
                        }}/>
                    </>) : (<>
                      <input type="hidden" name="intent" value={method === "phone"
                            ? "addPhoneVerify"
                            : "addEmailVerify"}/>
                      <input type="hidden" name={method === "phone" ? "phone" : "email"} value={draft.contact}/>
                      <p className="text-sm text-muted-foreground">
                        <macro_1.Trans>We've sent a code to {sentTo}</macro_1.Trans>
                      </p>
                      <react_1.Input name="code" placeholder={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Verification code"], ["Verification code"])))} value={draft.code} onChange={function (e) {
                            return setDraft(function (d) {
                                return d ? __assign(__assign({}, d), { code: e.target.value }) : d;
                            });
                        }}/>
                    </>)}

                  {((_a = addFetcher.data) === null || _a === void 0 ? void 0 : _a.success) === false &&
                        addFetcher.data.message && (<span className="text-sm text-red-500">
                        {addFetcher.data.message}
                      </span>)}

                  <react_1.HStack spacing={2}>
                    <react_1.Button type="submit" size="sm" isLoading={busy} isDisabled={busy}>
                      {draft.step === "enter" ? (<macro_1.Trans>Send code</macro_1.Trans>) : (<macro_1.Trans>Verify & link</macro_1.Trans>)}
                    </react_1.Button>
                    <react_1.Button type="button" variant="ghost" size="sm" onClick={function () { return setDraft(null); }}>
                      <macro_1.Trans>Cancel</macro_1.Trans>
                    </react_1.Button>
                  </react_1.HStack>
                </react_1.VStack>
              </addFetcher.Form>)}

            {wechatPanelOpen && (<react_1.VStack spacing={2} className="items-center border-t border-border p-3">
                {wechatFetcher.state === "loading" || !wechatFetcher.data ? (<p className="text-sm text-muted-foreground">
                    <macro_1.Trans>Loading…</macro_1.Trans>
                  </p>) : wechatFetcher.data.url ? (<>
                    <div className="rounded-xl bg-white p-3">
                      <qrcode_react_1.QRCodeSVG value={wechatFetcher.data.url} size={160} className="block"/>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <macro_1.Trans>Scan with WeChat to connect</macro_1.Trans>
                    </p>
                  </>) : (<p className="text-sm text-red-500">
                    <macro_1.Trans>WeChat is unavailable right now</macro_1.Trans>
                  </p>)}
                <react_1.Button type="button" variant="ghost" size="sm" onClick={function () { return setWechatOpen(false); }}>
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
              </react_1.VStack>)}
          </div>);
        })}
    </react_1.VStack>);
    if (bare)
        return content;
    return (<react_1.Card>
      <react_1.CardHeader>
        <react_1.CardTitle>
          <macro_1.Trans>Login methods</macro_1.Trans>
        </react_1.CardTitle>
        <react_1.CardDescription>
          <macro_1.Trans>Ways you can sign in. Only you can change these.</macro_1.Trans>
        </react_1.CardDescription>
      </react_1.CardHeader>
      <react_1.CardContent>{content}</react_1.CardContent>
    </react_1.Card>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
