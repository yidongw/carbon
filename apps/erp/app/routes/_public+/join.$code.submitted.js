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
exports.default = JoinSubmittedRoute;
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var invite_links_server_1 = require("~/modules/users/invite-links.server");
var path_1 = require("~/utils/path");
var meta = function () {
    return [{ title: "Request Submitted | Carbon" }];
};
exports.meta = meta;
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
                        return [2 /*return*/, { success: false, companyName: null }];
                    }
                    return [2 /*return*/, {
                            success: true,
                            companyName: invite.data.companyName
                        }];
            }
        });
    });
}
function JoinSubmittedRoute() {
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, react_router_1.useLoaderData)(), success = _a.success, companyName = _a.companyName;
    return (<react_1.VStack spacing={4} className="max-w-lg items-center text-center">
      <img src="/carbon-logo-mark.svg" alt={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Carbon Logo"], ["Carbon Logo"])))} className="w-24 mb-3"/>
      <react_1.Heading size="h1" className="m-0">
        <macro_1.Trans>Request Submitted</macro_1.Trans>
      </react_1.Heading>
      {success && companyName ? (<p className="text-muted-foreground">
          <macro_1.Trans>
            Your request to join {companyName} has been submitted. An admin will
            review your application soon.
          </macro_1.Trans>
        </p>) : (<p className="text-muted-foreground">
          <macro_1.Trans>Your request has been submitted.</macro_1.Trans>
        </p>)}
      <react_1.Button asChild variant="secondary">
        <react_router_1.Link to={path_1.path.to.root}>
          <macro_1.Trans>Return Home</macro_1.Trans>
        </react_router_1.Link>
      </react_1.Button>
    </react_1.VStack>);
}
var templateObject_1;
